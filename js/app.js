import { useState } from 'https://esm.sh/preact/hooks'

import html from './html.js'

import Settings from './views/Settings.js'
import { SettingsButtons } from './views/Settings.js'

import SearchTransitWidget from './components/SearchTransitWidget.js'
import Drawer from './components/Drawer.js'
import AppButtons from './components/AppButtons.js'

const App = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const openDrawer = () => setIsDrawerOpen(true)
  const closeDrawer = () => setIsDrawerOpen(false)
  let showDrawerHandle = false;

  const [isSettingsVisible, setIsSettingsVisible] = useState(false)
  const showSettings = () => setIsSettingsVisible(true)
  const hideSettings = () => setIsSettingsVisible(false)

  const sampleContent = html`<div class="">
    <h2 class="text-2xl mb-4">Drawer Content</h2>
    <p>This is some sample content inside the drawer.</p>
    <button class="bg-red-500 text-white rounded-md p-2 w-full" onClick=${closeDrawer}>
      Close Drawer
    </button>
  </div>`

  return html`
    <main class="relative">
      <form>
        <${SearchTransitWidget} />
      </form>
      <${AppButtons} onSettingsClick=${showSettings} />
      <${Settings} isVisible=${isSettingsVisible} hideSettings=${hideSettings} isDrawerOpen=${isDrawerOpen} openDrawer=${openDrawer} />
      <${Drawer} showHandle=${showDrawerHandle} isOpen=${isDrawerOpen} closeDrawer=${closeDrawer}>
        ${SettingsButtons({ onSave: () => { console.log('Settings saved'); closeDrawer(); }, onCancel: closeDrawer })}
      </${Drawer}>
    </main>
    `
}

export default App