import { useEffect, useRef } from 'https://esm.sh/preact/hooks'

import html from '../html.js'

const Drawer = ({
  children,
  isBackgroundVisible,
  isHandleVisible,
  isOpen,
  closeDrawer,
  label = 'Drawer',
}) => {
  // a drawer component that slides up from the bottom of the screen
  // it has a handle that can be used to drag the drawer up and down
  // the close buttons are inserted via children, so that the drawer can be closed from within the drawer content
  // with accessibility in mind, the drawer should be focusable and should trap focus within the drawer when open
  // the drawer should also have a backdrop that dims the background when it's open

  const startY = useRef(0)
  const startHeight = useRef(0)
  const pointerId = useRef(null)
  const drawerRef = useRef(null)
  const previouslyFocusedElement = useRef(null)

  useEffect(() => {
    const drawer = drawerRef.current
    if (!drawer) return

    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement
      const firstFocusableElement = drawer.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      ;(firstFocusableElement || drawer).focus()
    } else {
      if (previouslyFocusedElement.current && typeof previouslyFocusedElement.current.focus === 'function') {
        previouslyFocusedElement.current.focus()
      }
      drawer.style.height = ''
    }
  }, [isOpen])

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      closeDrawer()
      return
    }

    if (e.key !== 'Tab') return

    const focusableElements = [...e.currentTarget.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )]

    if (focusableElements.length === 0) {
      e.preventDefault()
      e.currentTarget.focus()
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault()
      lastElement.focus()
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault()
      firstElement.focus()
    }
  }

  const onPointerDown = (e) => {
    startY.current = e.clientY
    startHeight.current = drawerRef.current.offsetHeight
    pointerId.current = e.pointerId
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (e.pointerId !== pointerId.current) return

    const newHeight = startHeight.current - (e.clientY - startY.current)
    drawerRef.current.style.height = `${newHeight}px`
  }

  const onPointerUp = (e) => {
    if (e.pointerId !== pointerId.current) return

    e.currentTarget.releasePointerCapture(e.pointerId)
    pointerId.current = null
    if (drawerRef.current.offsetHeight < 100) {
      closeDrawer()
      drawerRef.current.style.height = ''
    }
  }

  const onHandleKeyDown = (e) => {
    if (e.key === 'Escape' || e.key === 'ArrowDown') {
      e.preventDefault()
      closeDrawer()
      return
    }

    if (e.key !== 'ArrowUp') return

    e.preventDefault()
    const maxHeight = window.innerHeight * 0.875
    const newHeight = Math.min(drawerRef.current.offsetHeight + 40, maxHeight)
    drawerRef.current.style.height = `${newHeight}px`
  }

  const backdropClass = isOpen
    ? `${isBackgroundVisible ? 'bg-black opacity-80' : 'opacity-0'} z-1 pointer-events-auto`
    : 'opacity-0 z-0 pointer-events-none'

  return html`
    <div id="drawer-wrapper">
      <div onClick=${closeDrawer} aria-hidden=${!isOpen} class="${backdropClass} fixed inset-0 transition-all bg-(--color-gray-700)"></div>
      <div
        id="drawer"
        ref=${drawerRef}
        role="dialog"
        aria-modal="true"
        aria-hidden=${!isOpen}
        inert=${!isOpen}
        aria-label=${label}
        tabIndex="-1"
        onKeyDown=${onKeyDown}
        class="${isOpen ? 'translate-y-0 z-2' : 'translate-y-full z-0'} fixed bottom-0 left-1/2 overflow-y-auto w-full max-w-[768px] max-h-7/8 transition-transform -translate-x-1/2 rounded-t-2xl bg-white border-t border-l border-r border-(--border-default) p-8"
      >
        <button
          type="button"
          aria-label="Resize drawer. Use Arrow Up to expand or Arrow Down to close."
          class="${isHandleVisible ? 'block' : 'hidden'} absolute top-3 left-1/2 transform -translate-x-1/2 max-w-[100px] w-full h-[5px] bg-(--color-gray-700) rounded-full"
          onKeyDown=${onHandleKeyDown}
          onPointerDown=${onPointerDown}
          onPointerMove=${onPointerMove}
          onPointerUp=${onPointerUp}
          onPointerCancel=${onPointerUp}
        ></button>
        ${children}
      </div>
    </div>
  `
}

export default Drawer