import { useState } from 'https://esm.sh/preact/hooks'

import html from './html.js'

import Drawer from './components/Drawer.js'

const App = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const openDrawer = () => setIsDrawerOpen(true)
  const closeDrawer = () => setIsDrawerOpen(false)
  let showDrawerHandle = false;

  const sampleButton = html`<button class="bg-blue-500 text-white rounded-md p-2 w-full mb-2" onClick=${openDrawer}>Open Drawer</button>`
  const sampleContent = html`<div class="">
    <h2 class="text-2xl mb-4">Drawer Content</h2>
    <p>This is some sample content inside the drawer.</p>
    <button class="bg-red-500 text-white rounded-md p-2 w-full" onClick=${closeDrawer}>
      Close Drawer
    </button>
  </div>`

  return html`
    <main class="relative">
      ${sampleButton}
      <h1 class="text-5xl">Commute Leganes</h1>
      <${Drawer} showHandle=${showDrawerHandle} isOpen=${isDrawerOpen} closeDrawer=${closeDrawer}>
        ${sampleContent}
      </${Drawer}>
    </main>
    `
}

export default App