import { useRef } from 'https://esm.sh/preact/hooks'

import html from '../html.js'

const Drawer = ({ children, showHandle, isOpen, closeDrawer}) => {
  // a drawer component that slides up from the bottom of the screen
  // it has a handle that can be used to drag the drawer up and down
  // the close buttons are inserted via children, so that the drawer can be closed from within the drawer content
  // with accessibility in mind, the drawer should be focusable and should trap focus within the drawer when open
  // the drawer should also have a backdrop that dims the background when it's open

  const startY = useRef(0)
  const startHeight = useRef(0)
  const pointerId = useRef(null)

  const onPointerDown = (e) => {
    startY.current = e.clientY
    startHeight.current = e.currentTarget.parentElement.offsetHeight
    pointerId.current = e.pointerId
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (e.pointerId !== pointerId.current) return

    const newHeight = startHeight.current - (e.clientY - startY.current)
    e.currentTarget.parentElement.style.height = `${newHeight}px`
  }

  const onPointerUp = (e) => {
    if (e.pointerId !== pointerId.current) return

    e.currentTarget.releasePointerCapture(e.pointerId)
    pointerId.current = null
    if (e.currentTarget.parentElement.offsetHeight < 100) {
      closeDrawer()
      e.currentTarget.parentElement.style.height = ''
    }
  }

  return html`
    <div onClick=${closeDrawer} class="${isOpen ? 'top-0 bg-black opacity-80 z-1' : 'opacity-0 z-0 top-100'} fixed left-0 w-full h-full transition-all" bg-(--color-gray-700)></div>
    <div role="dialog" class="${isOpen ? 'translate-y-0 z-2' : 'translate-y-full z-0'} fixed bottom-0 left-1/2 w-full max-w-[768px] max-h-7/8 transition-transform -translate-x-1/2 rounded-t-2xl bg-white border-t border-l border-r border-(--border-default) p-8">
      <div
        class="${showHandle ? 'block' : 'hidden'} absolute top-3 left-1/2 transform -translate-x-1/2 max-w-[100px] w-full h-[5px] bg-(--color-gray-700) rounded-full"
        onPointerDown=${onPointerDown}
        onPointerMove=${onPointerMove}
        onPointerUp=${onPointerUp}
        onPointerCancel=${onPointerUp}
      ></div>
      ${children}
    </div>
  `
}

export default Drawer