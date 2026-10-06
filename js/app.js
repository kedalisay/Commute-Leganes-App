import html from './html.js'

import Drawer from './components/Drawer.js'

const App = () => {
  return html`
    <main class="relative">
      <h1 class="text-5xl">Commute Leganes</h1>
      <${Drawer}/>
    </main>
    `
}

export default App