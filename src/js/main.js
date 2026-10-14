import { Map, getVersion, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { render } from 'https://esm.sh/preact'

import App from './app.js'
import html from './html.js'

setWorkerUrl(new URL(`/src/js/maplibre-gl-worker.mjs?v=${getVersion()}`, import.meta.url).toString());

window.map = new Map({
  container: 'map',
  style: '/assets/osm_custom_bright_commute_leganes.json', 
});

render(html`<${App} />`, document.getElementById('app'))