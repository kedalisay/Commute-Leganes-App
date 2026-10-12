import { Map, getVersion, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { render } from 'https://esm.sh/preact'

import App from './app.js'
import html from './html.js'

setWorkerUrl(new URL(`./maplibre-gl-worker.mjs?v=${getVersion()}`, import.meta.url).toString());

new Map({
    container: 'map', // container id
    style: '../assets/osm_bright_custom_commute_leganes.json', // style URL
    center: [122.60455, 10.7875], // starting position [lng, lat]
    zoom: 13 // starting zoom
  });

render(html`<${App} />`, document.getElementById('app'))
