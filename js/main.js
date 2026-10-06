import { render } from 'https://esm.sh/preact'

import App from './app.js'
import html from './html.js'

render(html`<${App} />`, document.getElementById('app'))
