import { Map, getVersion, setWorkerUrl } from 'maplibre-gl';
import PathFinder, { pathToGeoJSON }  from "geojson-path-finder";

import { useEffect, useState, useRef } from 'https://esm.sh/preact/hooks'

import leganes_road_network_geojson from '../../data/leganes_road_network.json'

import html from './html.js'

import Loading from './views/Loading.js'
import Settings from './views/Settings.js'

import Drawer from './components/Drawer.js'
import RouteWidget from './components/RouteWidget.js'
import ActionButtons from './components/ActionButtons.js'
import LocationCardList from './components/LocationCardList.js'
import RouteCardList from './components/RouteCardList.js'

import { removeMarkerFromMap, addRouteLayers, removeRouteLayers, setRouteLayerVisibility } from './utils/MapLibreGL.js';
import { getCoordinates, areValidCoordinates } from './utils/Geolocation.js';
import { getBarangay } from './utils/Barangay.js';
import { getRouteForBarangay, getClosestVertex, getVertexCoordinates, getTerminalPoints, getReachableVertices } from './utils/Route.js';

setWorkerUrl(new URL(`/src/js/maplibre-gl-worker.mjs?v=${getVersion()}`, import.meta.url).toString());

const MAP = new Map({
  container: 'map',
  style: '/assets/osm_custom_bright_commute_leganes.json', 
});

const PATHFINDER = new PathFinder(leganes_road_network_geojson, { tolerance: 1e-5 });
const PATH_VERTICES = Object.keys(PATHFINDER.graph.vertices)
  .map((vertex) => vertex.split(',').map((coordinate) => parseFloat(coordinate)))
  .filter((coordinates) => coordinates.length === 2 && coordinates.every(Number.isFinite))

const STATIC_LOCATIONS = {}
const STATIC_TERMINALS = {}
const STATIC_BARANGAYS = {}
const BARANGAY_COLORS = {
  'Poblacion': "#5bcf55",
  'Cari Minor': "#445cd0",
  'San Vicente': "#3c8fe7",
  'Guinobatan': "#30bce2",
  'Guihaman': "#e279b7",
  'Buntatala': "#db5ace",
  'Lapayon': "#86e7de",
  'Calaboa': "#9a6ecc",
  'Cagamutan Norte': "#e98651",
  'Cari Mayor': "#72d2aa",
  'Cagamutan Sur': "#e93868",
  'Guintas': "#d7b97d",
  'Camangay': "#caef73",
  'Bigke': "#67de87",
  'M.V. Hechanova': "#cac83d",
  'Napnud': "#c578da",
  'Gua-an': "#7161ca",
  'Nabitasan': "#86ca5f",
}

const PUBLIC_ROUTES = {}

const MAP_DATA_READY = new Promise((resolve, reject) => {
  MAP.on('load', async () => {
    try {
      const publicRoutesData = await (await fetch('/data/leganes_public_routes.json')).json()
      PUBLIC_ROUTES.features = publicRoutesData.features.sort((a, b) => a.properties['route-name'].localeCompare(b.properties['route-name'])).filter((feature) => feature.properties['public'] === true)

      const barangaysData = await (await fetch('/data/bgysubmuns-municity-603026000.0.01.json')).json()
      STATIC_BARANGAYS.features = barangaysData.features.map((feature) => {
        const barangayName = feature.properties.adm4_en
        const barangayGeometry = feature.geometry
        const barangayFillColor = BARANGAY_COLORS[barangayName] || "#9e9e9e"
        const barangayStrokeColor = "#212121"

        return {
          name: barangayName,
          geometry: barangayGeometry,
          fill: barangayFillColor,
          stroke: barangayStrokeColor
        }
      })

      const terminalsData = await (await fetch('/data/leganes_terminals.json')).json()
      STATIC_TERMINALS.features = terminalsData.features.map((feature) => {
        const terminalName = feature.properties['terminal-name']
        const terminalGeometry = feature.geometry

        return {
          name: terminalName,
          geometry: terminalGeometry,
        }
      })

      const locationsData = await (await fetch('/data/leganes_locations.json')).json()
      STATIC_LOCATIONS.features = locationsData.features.map((feature) => {
        const locationName = feature.properties['location-name']
        const locationCoordinates = feature.geometry.coordinates
        const locationAliases = feature.properties['location-aliases']

        return {
          name: locationName,
          coords: locationCoordinates,
          aliases: locationAliases,
        }
      })

      MAP.addSource('public-routes', {
        'type': 'geojson',
        'data': publicRoutesData,
      });

      MAP.addSource('terminals', {
        'type': 'geojson',
        'data': terminalsData,
      })

      PUBLIC_ROUTES.features.forEach((route) => {
        MAP.addLayer({
          'id': `public-route-${route.properties['route-name']}`,
          'type': 'line',
          'source': 'public-routes',
          'layout': { 'line-join': 'round', 'line-cap': 'round', 'visibility': 'none' },
          'paint': {
            'line-color': route.properties['stroke'],
            'line-width': route.properties['stroke-width'],
            'line-opacity': route.properties['stroke-opacity'],
          },
          'filter': ['==', ['get', 'route-name'], route.properties['route-name']],
        })

        MAP.addLayer({
          'id': `public-route-label-${route.properties['route-name']}`,
          'type': 'symbol',
          'source': 'public-routes',
          'layout': {
            'symbol-placement': 'line',
            'text-field': route.properties['route-name'],
            'text-size': 12,
            'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
            'text-anchor': 'top',
            'visibility': 'none',
          },
          'paint': {
            'text-color': '#1A1D20',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1,
            'text-halo-blur': 1,
          },
          'filter': ['==', ['get', 'route-name'], route.properties['route-name']],
        })
      })

      STATIC_TERMINALS.features.forEach((terminal) => {
        const terminalName = terminal.name.trim().toLowerCase().replace(/\s+/g, '-')

        MAP.addLayer({
          'id': `terminal-${terminalName}`,
          'type': 'fill',
          'source': 'terminals',
          'layout': { 'visibility': 'none' },
          'paint': {
            'fill-color': '#f59e0b',
            'fill-opacity': 0.5,
            'fill-outline-color': '#ffffff',
          }
        })
      })
      MAP.once('idle', resolve)
    } catch (error) {
      console.error('Unable to load map data:', error)
      reject(error)
    }
  })
})

const AppButtons = ({ drawerMode, onSettingsClick, onRoutesClick }) => {
  return html`
    <section aria-hidden=${drawerMode === 'settings' || drawerMode === 'locations' || drawerMode === 'locations-action' ? true : false} inert=${drawerMode === 'settings' || drawerMode === 'locations' || drawerMode === 'locations-action' ? true : false} id="app-buttons" class="absolute top-30 z-1 right-4 flex flex-col gap-3 w-[35px] bg-transparent">
      <h2 class="sr-only">App Buttons</h2>
      <button aria-label="Open settings" onClick=${onSettingsClick} class="${drawerMode === 'settings' ? 'bg-(--bg-subtle)' : 'bg-(--bg-surface)'} border border-(--border-default) p-2 w-full max-w-[35px] max-h-[35px] rounded-full transition-all">
        <svg width="22" xmlns="http://www.w3.org/2000/svg" height="22" id="screenshot-53f07293-9876-8096-8008-ad032f479751" viewBox="-1564.2 -1177.5 30 32" style="-webkit-print-color-adjust::exact" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1">
          <g id="shape-53f07293-9876-8096-8008-ad032f479751" style="fill:#000000" width="22" height="22" rx="0" ry="0">
            <g id="shape-53f07293-9876-8096-8008-ad032f479752" style="display:none">
              <g class="fills" id="fills-53f07293-9876-8096-8008-ad032f479752">
                <rect rx="0" ry="0" x="-1564.8504672897195" y="-1178" transform="matrix(1.000000, 0.000000, 0.000000, 1.000000, 0.000000, 0.000000)" width="24.92211838006233" height="25" fill="none" style="fill:none">
                </rect>
              </g>
            </g>
            <g id="shape-53f07293-9876-8096-8008-ad032f479753">
              <g class="fills" id="fills-53f07293-9876-8096-8008-ad032f479753">
                <path d="M-1539.9283447265625,-1163.816650390625L-1539.9283447265625,-1167.183349609375C-1541.642822265625,-1167.7947998046875,-1542.725830078125,-1167.9666748046875,-1543.27099609375,-1169.2864990234375L-1543.27099609375,-1169.2874755859375C-1543.8182373046875,-1170.6114501953125,-1543.167236328125,-1171.510498046875,-1542.3914794921875,-1173.14892578125L-1544.7642822265625,-1175.5291748046875C-1546.38525390625,-1174.7562255859375,-1547.290771484375,-1174.096923828125,-1548.61376953125,-1174.6468505859375L-1548.61474609375,-1174.6468505859375C-1549.9324951171875,-1175.19482421875,-1550.10498046875,-1176.28857421875,-1550.7113037109375,-1178L-1554.0675048828125,-1178C-1554.671875,-1176.296875,-1554.84521484375,-1175.19580078125,-1556.1640625,-1174.6468505859375L-1556.1650390625,-1174.6468505859375C-1557.4849853515625,-1174.096923828125,-1558.3790283203125,-1174.7490234375,-1560.0145263671875,-1175.5291748046875L-1562.3873291015625,-1173.14892578125C-1561.61376953125,-1171.515625,-1560.9595947265625,-1170.6136474609375,-1561.5078125,-1169.2874755859375C-1562.0550537109375,-1167.9635009765625,-1563.152587890625,-1167.78955078125,-1564.8504638671875,-1167.183349609375L-1564.8504638671875,-1163.816650390625C-1563.15576171875,-1163.21240234375,-1562.0550537109375,-1163.0364990234375,-1561.5078125,-1161.7135009765625C-1560.9573974609375,-1160.378173828125,-1561.626220703125,-1159.457275390625,-1562.3873291015625,-1157.85205078125L-1560.0145263671875,-1155.4708251953125C-1558.3924560546875,-1156.2447509765625,-1557.4871826171875,-1156.903076171875,-1556.1650390625,-1156.3531494140625L-1556.1640625,-1156.3531494140625C-1554.84521484375,-1155.80517578125,-1554.6729736328125,-1154.7083740234375,-1554.0675048828125,-1153L-1550.7113037109375,-1153C-1550.10693359375,-1154.7041015625,-1549.9324951171875,-1155.802001953125,-1548.6065673828125,-1156.3563232421875L-1548.6053466796875,-1156.3563232421875C-1547.2947998046875,-1156.902099609375,-1546.4039306640625,-1156.2509765625,-1544.7652587890625,-1155.4697265625L-1542.392578125,-1157.85107421875C-1543.1650390625,-1159.4791259765625,-1543.8203125,-1160.3853759765625,-1543.27294921875,-1161.7115478515625C-1542.725830078125,-1163.035400390625,-1541.6241455078125,-1163.21142578125,-1539.9283447265625,-1163.816650390625ZM-1552.389404296875,-1161.3333740234375C-1554.6832275390625,-1161.3333740234375,-1556.5430908203125,-1163.198974609375,-1556.5430908203125,-1165.5C-1556.5430908203125,-1167.801025390625,-1554.6832275390625,-1169.6666259765625,-1552.389404296875,-1169.6666259765625C-1550.0955810546875,-1169.6666259765625,-1548.2357177734375,-1167.801025390625,-1548.2357177734375,-1165.5C-1548.2357177734375,-1163.198974609375,-1550.0955810546875,-1161.3333740234375,-1552.389404296875,-1161.3333740234375Z" style="fill:#333942;fill-opacity:1">
                </path>
              </g>
            </g>
          </g>
        </svg>
      </button>
      <button aria-label="Show public routes" onClick=${onRoutesClick} class="${drawerMode === 'routes-public' ? 'bg-(--bg-subtle)' : 'bg-(--bg-surface)'} border border-(--border-default) p-2 w-full max-w-[35px] max-h-[35px] rounded-full transition-all">
        <svg width="18" xmlns="http://www.w3.org/2000/svg" height="18" id="screenshot-53f07293-9876-8096-8008-ad032f47974c" viewBox="-1565.854 -1132 30 30" style="-webkit-print-color-adjust::exact" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1">
          <g id="shape-53f07293-9876-8096-8008-ad032f47974c" style="fill:#000000" width="18" height="18" rx="0" ry="0">
            <g id="shape-53f07293-9876-8096-8008-ad032f47974d" style="display:none">
              <g class="fills" id="fills-53f07293-9876-8096-8008-ad032f47974d">
                <rect rx="0" ry="0" x="-1563.853582554517" y="-1129" transform="matrix(1.000000, 0.000000, 0.000000, 1.000000, 0.000000, 0.000000)" width="24.92211838006233" height="25" fill="none" style="fill:#333942;fill-opacity:1">
                </rect>
              </g>
            </g>
            <g id="shape-53f07293-9876-8096-8008-ad032f47974e">
              <g class="fills" id="fills-53f07293-9876-8096-8008-ad032f47974e">
                <path d="M-1557.0311279296875,-1115.03125C-1557.41845703125,-1115.03125,-1557.8006591796875,-1115.0999755859375,-1558.166015625,-1115.234375L-1557.7435302734375,-1116.3853759765625C-1557.5140380859375,-1116.301025390625,-1557.2752685546875,-1116.25830078125,-1557.0311279296875,-1116.25830078125C-1556.76123046875,-1116.25830078125,-1556.4974365234375,-1116.3104248046875,-1556.2481689453125,-1116.4124755859375L-1555.7840576171875,-1115.277099609375C-1556.1806640625,-1115.113525390625,-1556.6002197265625,-1115.03125,-1557.0311279296875,-1115.03125ZM-1548.028076171875,-1115.846923828125L-1549.750732421875,-1116.831298828125L-1549.1453857421875,-1117.89794921875L-1547.421630859375,-1116.91357421875L-1548.028076171875,-1115.846923828125ZM-1554.73095703125,-1115.86767578125L-1555.3592529296875,-1116.9208984375L-1553.6573486328125,-1117.9427490234375L-1553.0291748046875,-1116.8896484375L-1554.73095703125,-1115.86767578125ZM-1550.6624755859375,-1117.3343505859375C-1550.9149169921875,-1117.4395751953125,-1551.1817626953125,-1117.4937744140625,-1551.4559326171875,-1117.4937744140625C-1551.6947021484375,-1117.4937744140625,-1551.930419921875,-1117.4520263671875,-1552.15576171875,-1117.3697509765625L-1552.5721435546875,-1118.52392578125C-1552.2130126953125,-1118.6541748046875,-1551.8369140625,-1118.7197265625,-1551.4559326171875,-1118.7208251953125C-1551.0196533203125,-1118.7208251953125,-1550.593994140625,-1118.635498046875,-1550.1920166015625,-1118.466552734375L-1550.6624755859375,-1117.3343505859375ZM-1559.7320556640625,-1117.504150390625C-1560.2877197265625,-1117.504150390625,-1560.73828125,-1117.0531005859375,-1560.73828125,-1116.495849609375C-1560.73828125,-1115.9385986328125,-1560.2877197265625,-1115.4874267578125,-1559.7320556640625,-1115.4874267578125C-1559.176513671875,-1115.4874267578125,-1558.725830078125,-1115.9395751953125,-1558.725830078125,-1116.495849609375C-1558.7269287109375,-1117.0531005859375,-1559.176513671875,-1117.504150390625,-1559.7320556640625,-1117.504150390625ZM-1545.6343994140625,-1124.8333740234375L-1551.392578125,-1129L-1557.150634765625,-1124.8333740234375L-1563.8536376953125,-1129L-1563.8536376953125,-1108.1666259765625L-1557.150634765625,-1104L-1551.392578125,-1108.1666259765625L-1545.6343994140625,-1104L-1538.9315185546875,-1108.1666259765625L-1538.9315185546875,-1129L-1545.6343994140625,-1124.8333740234375ZM-1541.00830078125,-1109.3260498046875L-1545.1619873046875,-1106.7437744140625L-1545.1619873046875,-1111.2916259765625L-1546.2003173828125,-1111.2916259765625L-1546.2003173828125,-1106.9781494140625L-1550.3541259765625,-1109.9833984375L-1550.3541259765625,-1114.4166259765625L-1552.430908203125,-1114.4166259765625L-1552.430908203125,-1109.984375L-1556.584716796875,-1106.9791259765625L-1556.584716796875,-1112.3333740234375L-1557.623046875,-1112.3333740234375L-1557.623046875,-1106.7447509765625L-1561.7767333984375,-1109.3271484375L-1561.7767333984375,-1125.25830078125L-1557.623046875,-1122.676025390625L-1557.623046875,-1119.625L-1556.584716796875,-1119.625L-1556.584716796875,-1122.6739501953125L-1552.430908203125,-1125.68017578125L-1552.430908203125,-1121.7083740234375L-1550.3541259765625,-1121.7083740234375L-1550.3541259765625,-1125.68017578125L-1546.2003173828125,-1122.6739501953125L-1546.2003173828125,-1120.6666259765625L-1545.1619873046875,-1120.6666259765625L-1545.1619873046875,-1122.676025390625L-1541.00830078125,-1125.25830078125L-1541.00830078125,-1109.3260498046875ZM-1542.3873291015625,-1114.4000244140625L-1543.733154296875,-1115.7271728515625L-1542.4111328125,-1117.073974609375L-1543.1463623046875,-1117.8052978515625L-1544.4674072265625,-1116.456298828125L-1545.8109130859375,-1117.78125L-1546.541015625,-1117.0499267578125L-1545.1951904296875,-1115.7208251953125L-1546.51708984375,-1114.370849609375L-1545.7872314453125,-1113.6385498046875L-1544.4610595703125,-1114.9906005859375L-1543.1163330078125,-1113.6624755859375L-1542.3873291015625,-1114.4000244140625Z" style="fill:#333942;fill-opacity:1">
                </path>
              </g>
            </g>
          </g>
        </svg>
      </button>
    </section>
  `
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    MAP_DATA_READY.then(() => {
      if (isMounted) {
        setIsLoading(false)
      }
    }).catch((error) => {
      if (isMounted) {
        console.error('Map initialization failed:', error)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  // Marker state management
  const [fromMarker, setFromMarker] = useState(null)
  const [toMarker, setToMarker] = useState(null)
  
  // Location state management
  const [deviceLocation, setDeviceLocation] = useState(null)

  const [fromLocation, setFromLocation] = useState('')
  const setFromLocationHandler = (location) => {
    if (typeof location === 'object' && location !== null) {
      if (location.hasOwnProperty('name')) {
        setFromLocation(location)
      } else {
        setFromLocation({ name: `${location.coords[1]}, ${location.coords[0]}`, coords: location.coords })
      }
      return
    }

    setFromLocation(location)
  }
  const [isFromLocationFocused, setIsFromLocationFocused] = useState(false)

  const [toLocation, setToLocation] = useState('')
  const setToLocationHandler = (location) => {
    if (typeof location === 'object' && location !== null) {
      if (location.hasOwnProperty('name')) {
        setToLocation(location)
      } else {
        setToLocation({ name: `${location.coords[1]}, ${location.coords[0]}`, coords: location.coords })
      }
      return
    }

    setToLocation(location)
  }
  const [isToLocationFocused, setIsToLocationFocused] = useState(false)
  
  const [locations, setLocations] = useState([])

  const stopMarkerCentering = useRef(null)

  const confirmLocation = () => {
    const coords = {
      'coords':MAP.getCenter().toArray()
    }

    if (isFromLocationFocused) {
      setFromLocationHandler(coords)
    } else {
      setToLocationHandler(coords)
    }

    if (stopMarkerCentering.current) {
      stopMarkerCentering.current()
      stopMarkerCentering.current = null
    }
    setDrawerToDefault()
    closeDrawer()
  }

  const goBackToLocations = () => {
    if (stopMarkerCentering.current) {
      stopMarkerCentering.current()
      stopMarkerCentering.current = null
    }
    isFromLocationFocused ? removeMarkerFromMap(fromMarker) : removeMarkerFromMap(toMarker)
    setDrawerToLocations()
  }

  const locationActions = [
    { label: 'Confirm location', onClick: confirmLocation, variant: 'primary' },
    { label: 'Go back to list of locations', onClick: goBackToLocations, variant: 'secondary' },
  ]

  // Drawer state management
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const openDrawer = () => setIsDrawerOpen(true)
  const closeDrawer = () => setIsDrawerOpen(false)
  
  const [drawerMode, setDrawerMode] = useState('default') 
  const setDrawerToSettings = () => setDrawerMode('settings')
  const setDrawerToLocations = () => setDrawerMode('locations')
  const setDrawerToLocationActions = () => setDrawerMode('locations-action')
  const setDrawerToRoutes = () => setDrawerMode('routes')
  const setDrawerToPublicRoutes = () => setDrawerMode('routes-public')
  const setDrawerToDefault = () => setDrawerMode('default')

  // Settings state management
  const [savedSettings, setSavedSettings] = useState(() => ({
    language: localStorage.getItem('language') || 'English',
    theme: localStorage.getItem('theme') || 'light',
  }))
  const [draftSettings, setDraftSettings] = useState(savedSettings)

  const updateLanguage = (language) => {
    setDraftSettings((settings) => ({ ...settings, language }))
  }

  const updateTheme = (theme) => {
    setDraftSettings((settings) => ({ ...settings, theme }))
  }

  const saveSettings = () => {
    setSavedSettings(draftSettings)
    localStorage.setItem('language', draftSettings.language)
    localStorage.setItem('theme', draftSettings.theme)
    closeDrawer()
  }

  const cancelSettings = () => {
    setDraftSettings(savedSettings)
    closeDrawer()
  }

  const showSettings = () => {
    PUBLIC_ROUTES.features.forEach((feature) => {
      MAP.setLayoutProperty(`public-route-${feature.properties['route-name']}`, 'visibility', 'none')
    })

    closeDrawer()
    setDraftSettings(savedSettings)
    setDrawerToSettings()
  }
  const hideSettings = () => {
    setDrawerToDefault()
    closeDrawer()
  }

  const settingsActions = [
    { label: 'Save', onClick: saveSettings, variant: 'primary' },
    { label: 'Cancel', onClick: cancelSettings, variant: 'secondary' },
  ]

  // Routes state management
  const [routes, setRoutes] = useState([])
  const [selectedRouteId, setSelectedRouteId] = useState(null)

  const selectRoute = (routeId) => {
    if (!routeId) return

    routes.forEach((route) => {
      if (!route.layerIds) return

      route.layerIds.forEach((layerId) => {
        if (MAP.getLayer(layerId)) {
          MAP.setLayoutProperty(layerId, 'visibility', route.id === routeId ? 'visible' : 'none')
        }
      })
    })

    setSelectedRouteId(routeId)
  }

  const showPublicRoutes = () => {
    const routeData = []

    PUBLIC_ROUTES.features.forEach((feature) => {
      const routeName = feature.properties['route-name']
      const isPublic = feature.properties['public']
      const routeColor = feature.properties['stroke']
      const routeTotalDistance = feature.properties['total-distance']
      const routeFare = feature.properties['route-fare']
      const routeDirection = feature.properties['direction'][0].toUpperCase() + feature.properties['direction'].slice(1)
      const routeModeOfTransport = feature.properties['mode-of-transport'].split(',').map(mode => mode.trim())
      const routePoints = feature.properties['route-points'].split(',').map(point => point.trim())

      const isPublicRouteVisible = MAP.getLayoutProperty(`public-route-${routeName}`, 'visibility') === 'visible'
      const isPublicRouteLabelVisible = MAP.getLayoutProperty(`public-route-label-${routeName}`, 'visibility') === 'visible'

      MAP.setLayoutProperty(`public-route-${routeName}`, 'visibility', isPublicRouteVisible ? 'none' : 'visible')
      MAP.setLayoutProperty(`public-route-label-${routeName}`, 'visibility', isPublicRouteLabelVisible ? 'none' : 'visible')

      routeData.push({
        name: routeName,
        public: isPublic,
        total_distance: routeTotalDistance,
        mode_of_transport: routeModeOfTransport,
        points: routePoints,
        direction: routeDirection,
        fare: routeFare,
        color: routeColor
      })
    });

    STATIC_TERMINALS.features.forEach((terminal) => {
      const terminalName = terminal.name.trim().toLowerCase().replace(/\s+/g, '-')
      const isVisible = MAP.getLayoutProperty(`terminal-${terminalName}`, 'visibility') === 'visible'

      MAP.setLayoutProperty(`terminal-${terminalName}`, 'visibility', isVisible ? 'none' : 'visible')
    });

    setRoutes(routeData)
    setDrawerToPublicRoutes()
    openDrawer()
  }

  const hidePublicRoutes = () => {
    PUBLIC_ROUTES.features.forEach((feature) => {
      const routeName = feature.properties['route-name']
      MAP.setLayoutProperty(`public-route-${routeName}`, 'visibility', 'none')
      MAP.setLayoutProperty(`public-route-label-${routeName}`, 'visibility', 'none')
    });

    STATIC_TERMINALS.features.forEach((terminal) => {
      const terminalName = terminal.name.trim().toLowerCase().replace(/\s+/g, '-')
      MAP.setLayoutProperty(`terminal-${terminalName}`, 'visibility', 'none')
    });

    setRoutes([])
    setSelectedRouteId(null)
    closeDrawer()
  }

  const pathToGeoJSONSafe = (path) => {
    if (!path || !Array.isArray(path.path) || path.path.length === 0) {
      return null
    }

    if (path.path.length === 1) {
      return {
        type: 'Feature',
        properties: {
          weight: path.weight,
          edgeDatas: path.edgeDatas,
        },
        geometry: {
          type: 'LineString',
          coordinates: [path.path[0], path.path[0]],
        },
      }
    }

    return pathToGeoJSON(path)
  }

  const getCoordinateDistance = (from, to) => {
    const latitude = (to[1] - from[1]) * Math.PI / 180
    const longitude = (to[0] - from[0]) * Math.PI / 180
    const fromLatitude = from[1] * Math.PI / 180
    const toLatitude = to[1] * Math.PI / 180
    const haversine = Math.sin(latitude / 2) ** 2
      + Math.sin(longitude / 2) ** 2 * Math.cos(fromLatitude) * Math.cos(toLatitude)

    return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  }

  const getRoutePath = (fromVertex, toVertex, routeCoordinates) => {
    if (!Array.isArray(routeCoordinates) || routeCoordinates.length < 2) {
      return null
    }

    const getClosestRouteIndex = (vertex) => routeCoordinates.reduce(
      (closestIndex, coordinate, index) => (
        Math.hypot(
          coordinate[0] - vertex[0],
          coordinate[1] - vertex[1]
        ) < Math.hypot(
          routeCoordinates[closestIndex][0] - vertex[0],
          routeCoordinates[closestIndex][1] - vertex[1]
        )
          ? index
          : closestIndex
      ),
      0
    )

    const fromIndex = getClosestRouteIndex(fromVertex)
    const toIndex = getClosestRouteIndex(toVertex)
    const routePath = routeCoordinates
      .slice(Math.min(fromIndex, toIndex), Math.max(fromIndex, toIndex) + 1)

    if (fromIndex > toIndex) routePath.reverse()

    routePath.unshift(fromVertex)
    routePath.push(toVertex)

    return {
      path: routePath,
      weight: routePath.reduce(
        (total, coordinate, index) => index === 0
          ? total
          : total + getCoordinateDistance(routePath[index - 1], coordinate),
        0
      ),
      edgeDatas: [],
    }
  }

  const getNearestReachableVertex = (coordinates, targetPoint, pathEdges, pathfinder, direction = 'to') => {
    const targetCoordinates = targetPoint.geometry.coordinates

    return getReachableVertices(
      coordinates,
      targetPoint,
      pathEdges,
      pathfinder,
      direction
    ).sort((a, b) => (
      Math.hypot(
        a.vertex[0] - targetCoordinates[0],
        a.vertex[1] - targetCoordinates[1]
      ) - Math.hypot(
        b.vertex[0] - targetCoordinates[0],
        b.vertex[1] - targetCoordinates[1]
      )
    ))[0] || null
  }

  const buildRoute = (index, routeId, routeName, fromPoint, toPoint, route, terminal, terminalIsHopOn, pathfinder, pathEdges) => {
    const terminalCoordinates = terminal?.geometry?.coordinates
    if (!Array.isArray(terminalCoordinates)) return null

    if (Array.isArray(route.properties['route-fare']) && route.properties['route-fare'][index] && route.properties['route-fare'][index].mode === 'jeepney' && route.properties['route-fare'][index].type === 'per succeeding kilometer') {
      return null
    }

    console.log(terminal)

    const hopOnCoordinates = terminalIsHopOn
      ? [terminalCoordinates]
      : route.geometry.coordinates
    const hopOffCoordinates = terminalIsHopOn
      ? route.geometry.coordinates
      : [terminalCoordinates]

    const hopOn = getNearestReachableVertex(
      hopOnCoordinates,
      fromPoint,
      pathEdges,
      pathfinder
    )

    const dropoff = getNearestReachableVertex(
      hopOffCoordinates,
      toPoint,
      pathEdges,
      pathfinder,
      'from'
    )

    const routeCoordinates = route.geometry?.coordinates
    if (!Array.isArray(routeCoordinates) || routeCoordinates.length < 2) return null

    if (!hopOn || !dropoff) return null

    const fromHopOnPoint = {
      type: 'Point',
      geometry: { type: 'Point', coordinates: hopOn.vertex },
    }
    const toDropoffPoint = {
      type: 'Point',
      geometry: { type: 'Point', coordinates: dropoff.vertex },
    }
    const commutePath = getRoutePath(
      hopOn.vertex,
      dropoff.vertex,
      routeCoordinates
    )

    const geojsonPathToHopOn = pathToGeoJSONSafe(hopOn.path)
    const geojsonPathToDropoff = pathToGeoJSONSafe(dropoff.path)
    const geojsonCommutePath = pathToGeoJSONSafe(commutePath)
    if (!geojsonPathToHopOn || !geojsonPathToDropoff || !geojsonCommutePath) return null

    const fares = Array.isArray(route.properties['route-fare'])
      ? route.properties['route-fare']
      : []
    const fare = fares[index] || fares[0]
    if (!fare) return null

    const walkingDistance = hopOn.path.weight + dropoff.path.weight
    const commuteDistance = commutePath.weight

    if (fare.mode === 'jeepney' && commuteDistance > 4) {
      if (fare.type === 'first 4 kilometers' && fares[index + 1]?.type === 'per succeeding kilometer') {
        const extraFare = Math.ceil(commuteDistance - 4) * fares[index + 1]['amount']
        fare.amount += extraFare
      }
    }

    console.log(`Route ${routeId} - ${routeName}: Walking distance: ${walkingDistance.toPrecision(2)} km, Commute distance: ${commuteDistance.toPrecision(2)} km`)

    return {
      id: routeId,
      name: routeName,
      public: false,
      total_distance: (walkingDistance + commuteDistance).toPrecision(2),
      total_duration: Math.round(walkingDistance / 5 * 60) + Math.round(commuteDistance / 40 * 60), // calculate duration minutes based on distance and average speed (e.g., 5 km/h for walking, 40 km/h for commuting)
      total_transfers: 1,
      fare: fare.amount,
      mode: fare.mode,
      layers: {
        pathToHopOn: geojsonPathToHopOn,
        startPoint: {
          type: 'Feature',
          properties: {},
          geometry: fromPoint.geometry,
        },
        endPoint: {
          type: 'Feature',
          properties: {},
          geometry: toPoint.geometry,
        },
        hopOnPoint: {
          type: 'Feature',
          properties: {},
          geometry: fromHopOnPoint.geometry,
        },
        hopOffPoint: {
          type: 'Feature',
          properties: {},
          geometry: toDropoffPoint.geometry,
        },
        terminalPoint: {
          type: 'Feature',
          properties: terminal.properties || {},
          geometry: terminal.geometry,
        },
        commutePath: geojsonCommutePath,
        pathToDropoff: geojsonPathToDropoff,
        publicRoute: route,
      }
    }
  }

  const getRouteTransfer = (fromRoute, toRoute, pathEdges, pathfinder) => {
    let closestTransfer = null

    for (const fromCoordinate of fromRoute.geometry.coordinates) {
      const fromVertex = getClosestVertex(fromCoordinate, pathEdges).vertex
      if (!fromVertex) continue

      for (const toCoordinate of toRoute.geometry.coordinates) {
        const toVertex = getClosestVertex(toCoordinate, pathEdges).vertex
        if (!toVertex) continue

        const distance = Math.hypot(
          fromVertex[0] - toVertex[0],
          fromVertex[1] - toVertex[1]
        )
        if (distance > 0.01) continue

        const path = pathfinder.findPath(
          { type: 'Point', geometry: { type: 'Point', coordinates: fromVertex } },
          { type: 'Point', geometry: { type: 'Point', coordinates: toVertex } }
        )
        if (!path || (closestTransfer && path.weight >= closestTransfer.path.weight)) continue

        closestTransfer = {
          fromVertex,
          toVertex,
          path,
        }
      }
    }

    return closestTransfer
  }

  const getRouteSequence = (fromRoutes, toRoutes, publicRoutes, pathEdges, pathfinder) => {
    const sequences = []
    const seen = new Set()

    for (const fromRoute of fromRoutes) {
      for (const toRoute of toRoutes) {
        if (fromRoute === toRoute) continue

        const transfer = getRouteTransfer(fromRoute, toRoute, pathEdges, pathfinder)
        if (!transfer) continue

        const key = `${publicRoutes.indexOf(fromRoute)}:${publicRoutes.indexOf(toRoute)}`
        if (seen.has(key)) continue
        seen.add(key)
        sequences.push({ routes: [fromRoute, toRoute], transfer })
      }
    }

    return sequences
  }

  const getRouteFare = (route, distance) => {
    const fares = Array.isArray(route.properties['route-fare'])
      ? route.properties['route-fare']
      : []
    const fare = fares.find((candidate) => candidate.type !== 'per succeeding kilometer') || fares[0]
    if (!fare) return { amount: 0, mode: route.properties['mode-of-transport'] }

    if (
      fare.mode === 'jeepney' &&
      fare.type === 'first 4 kilometers' &&
      distance > 4
    ) {
      const succeedingFare = fares.find((candidate) => candidate.type === 'per succeeding kilometer')
      return {
        amount: fare.amount + (
          succeedingFare
            ? Math.ceil(distance - 4) * succeedingFare.amount
            : 0
        ),
        mode: fare.mode,
      }
    }

    return { amount: fare.amount, mode: fare.mode }
  }

  const toFeatureCollection = (features, weight) => ({
    type: 'FeatureCollection',
    properties: { weight },
    features,
  })

  const buildRouteChain = (routeSequence, fromPoint, toPoint, pathfinder, pathEdges, getTransfer) => {
    const transfers = routeSequence.slice(0, -1).map((route, index) => (
      getTransfer(route, routeSequence[index + 1])
    ))
    if (transfers.some((transfer) => !transfer)) return null

    const pathToHopOnFeatures = []
    const commuteFeatures = []
    let walkingDistance = 0
    let commuteDistance = 0
    let fare = 0
    const modes = []
    const segments = []
    const inBetweenPoints = []

    for (let index = 0; index < routeSequence.length; index += 1) {
      const route = routeSequence[index]
      const routeCoordinates = route.geometry?.coordinates
      if (!Array.isArray(routeCoordinates) || routeCoordinates.length < 2) return null

      const hopOn = index === 0
        ? getNearestReachableVertex(routeCoordinates, fromPoint, pathEdges, pathfinder)
        : {
            vertex: transfers[index - 1].toVertex,
            path: transfers[index - 1].path,
          }
      const dropoff = index === routeSequence.length - 1
        ? getNearestReachableVertex(routeCoordinates, toPoint, pathEdges, pathfinder, 'from')
        : {
            vertex: transfers[index].fromVertex,
            path: null,
          }

      if (!hopOn || !dropoff) return null

      if (hopOn.path) {
        const walkingFeature = pathToGeoJSONSafe(hopOn.path)
        if (!walkingFeature) return null
        pathToHopOnFeatures.push(walkingFeature)
        walkingDistance += hopOn.path.weight
        segments.push({
          mode: 'walk',
          label: 'Walk',
          weight: hopOn.path.weight,
          color: '#0b38a8',
        })
      }

      const commutePath = getRoutePath(hopOn.vertex, dropoff.vertex, routeCoordinates)
      const commuteFeature = pathToGeoJSONSafe(commutePath)
      if (!commutePath || !commuteFeature) return null

      commuteFeature.properties = {
        ...commuteFeature.properties,
        stroke: route.properties.stroke,
        strokeWidth: route.properties['stroke-width'],
        strokeOpacity: route.properties['stroke-opacity'],
      }
      commuteFeatures.push(commuteFeature)
      commuteDistance += commutePath.weight
      const routeFare = getRouteFare(route, commutePath.weight)
      fare += routeFare.amount
      modes.push(routeFare.mode)
      segments.push({
        mode: routeFare.mode,
        label: routeFare.mode,
        weight: commutePath.weight,
        color: route.properties.stroke,
      })

      inBetweenPoints.push(hopOn.vertex)
      inBetweenPoints.push(dropoff.vertex)
    }

    const firstHopOnPoint = inBetweenPoints.shift()
    const lastDropoffPoint = inBetweenPoints.pop()

    console.log('In between points:', inBetweenPoints)

    const finalWalkingPath = getNearestReachableVertex(
      [lastDropoffPoint],
      toPoint,
      pathEdges,
      pathfinder,
      'from'
    )
    if (!finalWalkingPath) return null

    const finalWalkingFeature = pathToGeoJSONSafe(finalWalkingPath.path)
    if (!finalWalkingFeature) return null
    walkingDistance += finalWalkingPath.path.weight
    segments.push({
      mode: 'walk',
      label: 'Walk',
      weight: finalWalkingPath.path.weight,
      color: '#0b38a8',
    })

    return {
      id: '',
      name: '',
      public: false,
      total_distance: (walkingDistance + commuteDistance).toPrecision(2),
      total_duration: Math.round(walkingDistance / 5 * 60) + Math.round(commuteDistance / 40 * 60),
      total_transfers: routeSequence.length,
      fare,
      mode: modes.join(', '),
      segments,
      layers: {
        pathToHopOn: toFeatureCollection(pathToHopOnFeatures, walkingDistance),
        startPoint: {
          type: 'Feature',
          properties: {},
          geometry: fromPoint.geometry,
        },
        endPoint: {
          type: 'Feature',
          properties: {},
          geometry: toPoint.geometry,
        },
        hopOnPoint: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: firstHopOnPoint },
        },
        hopOffPoint: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: lastDropoffPoint },
        },
        inBetweenPoints: {
          type: 'FeatureCollection',
          properties: {},
          features: inBetweenPoints.map((point) => ({
            type: 'Feature',
            properties: {},
            geometry: { type: 'Point', coordinates: point },
          })),
        },
        terminalPoint: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: lastDropoffPoint },
        },
        commutePath: toFeatureCollection(commuteFeatures, commuteDistance),
        pathToDropoff: finalWalkingFeature,
        publicRoute: routeSequence[0],
      },
    }
  }

  const findRoutes = (fromLocation, toLocation, pathEdges, pathfinder, barangays, publicRoutes, terminals) => {
    const fromCoords = getCoordinates(fromLocation)
    const toCoords = getCoordinates(toLocation)

    if (!areValidCoordinates(fromCoords) || !areValidCoordinates(toCoords)) {
      return []
    }

    const fromBarangay = getBarangay(fromCoords, barangays)
    const toBarangay = getBarangay(toCoords, barangays)

    if (!fromBarangay || !toBarangay) {
      return []
    }

    const closestFromVertex = getClosestVertex(fromCoords, pathEdges)
    const closestToVertex = getClosestVertex(toCoords, pathEdges)

    if (!closestFromVertex.vertex || !closestToVertex.vertex) {
      return []
    }

    const fromVertexCoords = getVertexCoordinates(closestFromVertex)
    const toVertexCoords = getVertexCoordinates(closestToVertex)

    const fromRoute = getRouteForBarangay(fromBarangay, publicRoutes)
    const toRoute = getRouteForBarangay(toBarangay, publicRoutes)

    if (fromRoute.length === 0 && toRoute.length === 0) {
      return []
    }

    console.log('fromRoute:', fromRoute) 
    console.log('toRoute:', toRoute)

    const destinationRoutes = toRoute.flatMap((route) => {
      const terminalPoints = getTerminalPoints(route, terminals)
      return terminalPoints.map((terminal) => ({ route, terminal, terminalIsHopOn: true }))
    })
    const originRoutes = fromRoute.flatMap((route) => {
      const terminalPoints = getTerminalPoints(route, terminals)
      return terminalPoints.map((terminal) => ({ route, terminal, terminalIsHopOn: false }))
    })
    const routeCandidates = [
      ...destinationRoutes,
      ...originRoutes,
    ]

    if (routeCandidates.length === 0) {
      return []
    }

    const closestTerminals = routeCandidates.flatMap(({ route, terminal, terminalIsHopOn }) => {
      const closestVertex = getClosestVertex(terminal.geometry.coordinates, pathEdges)
      return closestVertex.vertex
        ? [{ route, terminal, terminalIsHopOn, closestVertex }]
        : []
    })

    const directRoutes = closestTerminals.map(({ route, terminal, terminalIsHopOn }, index) =>
      buildRoute(
        index,
        `route-${index + 1}`,
        `Route ${index + 1} from ${fromBarangay} to ${toBarangay}`,
        { type: 'Point', geometry: { type: 'Point', coordinates: fromVertexCoords } },
        { type: 'Point', geometry: { type: 'Point', coordinates: toVertexCoords } },
        route,
        terminal,
        terminalIsHopOn,
        pathfinder,
        pathEdges
      )
    ).filter(Boolean).sort((a, b) => a.total_duration - b.total_duration)

    const transferCandidates = getRouteSequence(
      fromRoute,
      toRoute.length > 0 ? toRoute : publicRoutes,
      publicRoutes,
      pathEdges,
      pathfinder
    )
    const transferRoutes = transferCandidates.map(({ routes, transfer }, index) => {
      const route = buildRouteChain(
        routes,
        { type: 'Point', geometry: { type: 'Point', coordinates: fromVertexCoords } },
        { type: 'Point', geometry: { type: 'Point', coordinates: toVertexCoords } },
        pathfinder,
        pathEdges,
        () => transfer
      )
      if (!route) return null

      return {
        ...route,
        id: `route-transfer-${index + 1}`,
        name: `Route ${index + 1} from ${fromBarangay} to ${toBarangay}`,
      }
    }).filter(Boolean)

    console.log('Transfer Routes: ', transferRoutes)

    return [...directRoutes, ...transferRoutes]
      .sort((a, b) => a.total_duration - b.total_duration)
  }

  const findRoute = () => {
    removeRouteLayers(MAP, 'route')
    setSelectedRouteId(null)

    if (!fromMarker || !toMarker) {
      setRoutes([])
      return
    }

    const routeResults = findRoutes(
      fromLocation,
      toLocation,
      PATH_VERTICES,
      PATHFINDER,
      STATIC_BARANGAYS.features,
      PUBLIC_ROUTES.features,
      STATIC_TERMINALS.features
    )

    if (routeResults.length === 0) {
      setRoutes([])
      setDrawerToRoutes()
      openDrawer()
      return
    }

    const routes = routeResults.map((route) => {
      console.log('Route: ', route)
      const mapLayerState = addRouteLayers(MAP, route.id, route.layers)

      return {
        ...route,
        ...mapLayerState,
      }
    })

    const firstRoute = routes[0]

    routes.forEach((route) => {
      setRouteLayerVisibility(MAP, route.layerIds, route.id === firstRoute.id)
    })

    setRoutes(routes)
    setSelectedRouteId(firstRoute.id)
    setDrawerToRoutes()
    openDrawer()
  }

  useEffect(findRoute, [fromLocation, toLocation])

  // Update document title based on drawer mode
  useEffect(() => {
    switch (drawerMode) {
      case 'settings':
        document.title = 'Settings - Commute Leganes'
        break
      case 'locations':
        document.title = 'Choose a Location - Commute Leganes'
        break
      case 'routes':
        document.title = 'Choose a Route - Commute Leganes'
        break
      case 'routes-public':
        document.title = 'Public Routes - Commute Leganes'
        break
      default:
        document.title = 'Commute Leganes'
    }
  }, [drawerMode])

  return !isLoading ? html`
    <main class="relative ${drawerMode !== 'default' ? 'z-1' : ''}">
      <h1 class="sr-only">Commute Leganes</h1>
      <${RouteWidget} 
        map=${MAP}
        edges=${PATH_VERTICES}
        stopMarkerCentering=${stopMarkerCentering.current}
        fromMarker=${fromMarker} 
        setFromMarker=${setFromMarker}
        toMarker=${toMarker}
        setToMarker=${setToMarker}
        drawerMode=${drawerMode}
        setDrawerToDefault=${setDrawerToDefault}
        setDrawerToLocations=${setDrawerToLocations}
        isDrawerOpen=${isDrawerOpen} 
        openDrawer=${openDrawer} 
        closeDrawer=${closeDrawer}
        allLocations=${STATIC_LOCATIONS.features || []}
        setLocations=${setLocations}
        fromLocation=${fromLocation}
        setFromLocation=${setFromLocationHandler}
        setIsFromLocationFocused=${setIsFromLocationFocused}
        toLocation=${toLocation} 
        setToLocation=${setToLocationHandler}
        setIsToLocationFocused=${setIsToLocationFocused}
      />
      ${drawerMode !== 'locations-action'
        ? html`<${AppButtons} 
            drawerMode=${drawerMode} 
            onSettingsClick=${showSettings}
            onRoutesClick=${drawerMode === 'routes-public' ? hidePublicRoutes : showPublicRoutes}
          />`
        : null
      }
      <${Settings}
        drawerMode=${drawerMode}
        hideSettings=${hideSettings}
        isDrawerOpen=${isDrawerOpen}
        openDrawer=${openDrawer}
        language=${draftSettings.language}
        theme=${draftSettings.theme}
        onLanguageChange=${updateLanguage}
        onThemeChange=${updateTheme}
      />
      <${Drawer} 
        isOpen=${isDrawerOpen} 
        drawerMode=${drawerMode}
        setDrawerToDefault=${setDrawerToDefault}
        closeDrawer=${closeDrawer}
      >
        ${drawerMode === 'settings' ? html`<${ActionButtons} buttons=${settingsActions} direction="row" />` : null}
        ${drawerMode === 'locations' 
          ? html`<${LocationCardList} 
            map=${MAP}
            fromMarker=${fromMarker}
            setFromMarker=${setFromMarker}
            toMarker=${toMarker}
            setToMarker=${setToMarker}
            stopMarkerCentering=${stopMarkerCentering}
            locations=${locations} 
            drawerMode=${drawerMode}
            setDrawerToLocationActions=${setDrawerToLocationActions}
            closeDrawer=${closeDrawer} 
            deviceLocation=${deviceLocation}
            setDeviceLocation=${setDeviceLocation}
            isFromLocationFocused=${isFromLocationFocused} 
            setFromLocation=${setFromLocationHandler} 
            isToLocationFocused=${isToLocationFocused} 
            setToLocation=${setToLocationHandler} 
          />` 
          : null}
        ${drawerMode === 'locations-action' 
          ? html`<${ActionButtons} buttons=${locationActions} direction="column" />` 
          : null}
        ${drawerMode === 'routes' || drawerMode === 'routes-public' ? html`<${RouteCardList} map=${MAP} routes=${routes} selectedRouteId=${selectedRouteId} onRouteSelect=${selectRoute} />` : null}
      </${Drawer}>
    </main>
    ` : html`<main class="relative z-1 h-dvh overflow-hidden"> <${Loading} /> </main>`
}

export default App