import { h, render } from 'https://esm.sh/preact'
import htm  from 'https://esm.sh/htm'

import App from './app.js'

const html = htm.bind(h)
export default html

render(html`<${App} />`, document.getElementById('app'))
