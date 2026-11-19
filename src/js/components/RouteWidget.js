import html from '../html.js'

import { addMarkerToMap, removeMarkerFromMap, chooseLocationOnMap } from '../utils/MapLibreGL.js'
import { getTranslation } from '../i18n.js'

const RouteWidget = ({ map, edges, drawerMode, language, setDrawerToDefault, setDrawerToLocations, setDrawerToLocationActions, stopMarkerCentering, fromMarker, setFromMarker, toMarker, setToMarker, isDrawerOpen, openDrawer, closeDrawer, allLocations, setLocations, fromLocation, setFromLocation, setIsFromLocationFocused, toLocation, setToLocation, setIsToLocationFocused }) => {
  const t = (key) => getTranslation(language, key)
  const locationHasMatchingName = (location, value) => location.toLocaleLowerCase().includes(value.toLocaleLowerCase())
  const getLocationName = (location) => typeof location === 'object' && location !== null ? location.name || '' : location || ''

  const commitCoordinates = (value, isFrom) => {
    const inputCoords = value.split(',').map((coord) => parseFloat(coord.trim()))
    if (inputCoords.length !== 2 || !inputCoords.every(Number.isFinite)) {
      return false
    }

    const coords = [inputCoords[1], inputCoords[0]]
    const closestVertex = edges.reduce((closest, vertex) => {
      const distance = Math.hypot(vertex[0] - coords[0], vertex[1] - coords[1])
      return distance < closest.distance ? { vertex, distance } : closest
    }, { vertex: null, distance: Infinity })

    if (!closestVertex.vertex || closestVertex.distance > 1) {
      console.error('Coordinates are out of bounds of the road network:', coords)
      return false
    }

    const vertexCoords = closestVertex.vertex
    const location = {
      name: `${vertexCoords[1]}, ${vertexCoords[0]}`,
      coords: vertexCoords,
    }

    if (isFrom) {
      setFromLocation(location)
      if (fromMarker) removeMarkerFromMap(fromMarker)
      setFromMarker(addMarkerToMap(map, coords, true))
    } else {
      setToLocation(location)
      if (toMarker) removeMarkerFromMap(toMarker)
      setToMarker(addMarkerToMap(map, coords, false))
    }

    map.flyTo({ center: coords })
    closeDrawer()
    return true
  }

  const handleCoordinateKeyDown = (event, isFrom) => {
    if (event.key !== 'Enter') return

    if (commitCoordinates(event.currentTarget.value, isFrom)) {
      event.preventDefault()
    }
  }

  const handleFromInput = (event) => {
    setDrawerToLocations();

    if (event.target.value === '') {
      setFromLocation('');
      setLocations(allLocations);
      if (Object.prototype.toString.call(stopMarkerCentering) === "[object Function]") {
        stopMarkerCentering()
        setFromMarker(null)
        removeMarkerFromMap(fromMarker)
      } 

      setIsFromLocationFocused(false);
      setDrawerToDefault();
      closeDrawer();
      return;
    }

    const fromValue = event.target.value;

    if (fromLocation && typeof fromLocation === 'object') {
      setFromLocation({ name: fromValue });
    } else {
      setFromLocation({ name: fromValue });
    }

    setIsFromLocationFocused(true);
    setIsToLocationFocused(false);

    const filteredLocations = []

    for (const location of allLocations) {
      if (locationHasMatchingName(location.name, fromValue)) {
        filteredLocations.push(location);
      } else {
        if (Array.isArray(location.aliases) && location.aliases.length > 0) {
        for (const alias of location.aliases) {
          if (locationHasMatchingName(alias, fromValue)) {
            filteredLocations.push({ ...location, name: alias });
          }
        }
      }
      }
    }

    setLocations(filteredLocations);

    if (!isDrawerOpen) {
      openDrawer();
    }

    if (fromMarker) {
      setFromMarker(null)
      removeMarkerFromMap(fromMarker)
    }
  }

  const handleToInput = (event) => {
    setDrawerToLocations();

    if (event.target.value === '') {
      setToLocation('');
      setLocations(allLocations);
      if (Object.prototype.toString.call(stopMarkerCentering) === "[object Function]") {
        stopMarkerCentering()
        setToMarker(null)
        removeMarkerFromMap(toMarker);
      }
      setIsToLocationFocused(false);
      setDrawerToDefault();
      closeDrawer();
      return;
    }

    const toValue = event.target.value;

    if (toLocation && typeof toLocation === 'object') {
      setToLocation({ name: toValue });
    } else {
      setToLocation({ name: toValue });
    }
    setIsToLocationFocused(true);
    setIsFromLocationFocused(false);

    const filteredLocations = []

    for (const location of allLocations) {
      if (locationHasMatchingName(location.name, toValue)) {
        filteredLocations.push(location);
      } else {
        if (Array.isArray(location.aliases) && location.aliases.length > 0) {
          for (const alias of location.aliases) {
            if (locationHasMatchingName(alias, toValue)) {
              filteredLocations.push({ ...location, name: alias });
            }
          }
        }
      }
    }

    setLocations(filteredLocations);
    if (!isDrawerOpen) {
      openDrawer();
    }

    if (toMarker) {
      setToMarker(null)
      removeMarkerFromMap(toMarker)
    }
  }

  const handleSwapLocations = () => {
    if (!fromLocation || !toLocation || !fromMarker || !toMarker) return;

    removeMarkerFromMap(fromMarker);
    removeMarkerFromMap(toMarker);

    const tempLocation = fromLocation;
    setFromLocation(toLocation);
    setToLocation(tempLocation);

    const newFromMarker = addMarkerToMap(map, toMarker.getLngLat().toArray(), true);
    setFromMarker(newFromMarker);
    const newToMarker = addMarkerToMap(map, fromMarker.getLngLat().toArray(), false);
    setToMarker(newToMarker);
  }

  const chooseFromLocationOnMap = () => {
    setIsFromLocationFocused(true)
    setIsToLocationFocused(false)
    chooseLocationOnMap({
      map,
      isFromLocation: true,
      fromMarker,
      setFromMarker,
      toMarker,
      setToMarker,
      stopMarkerCentering,
      setDrawerToLocationActions,
      openDrawer: openDrawer,
    })
  }

  const chooseToLocationOnMap = () => {
    setIsFromLocationFocused(false)
    setIsToLocationFocused(true)
    chooseLocationOnMap({
      map,
      isFromLocation: false,
      fromMarker,
      setFromMarker,
      toMarker,
      setToMarker,
      stopMarkerCentering,
      setDrawerToLocationActions,
      openDrawer: openDrawer,
    })
  }

  return html`<section aria-hidden=${drawerMode !== 'settings' ? false : true} inert=${drawerMode !== 'settings' ? false : true} id="plot-route-widget" class="relative ${drawerMode !== 'settings' ? 'z-2' : ''} px-4 pt-4 bg-transparent">
      <form id="plot-route-form"> 
        <h2 class="sr-only">${t('chooseRoute')}</h2>
        <fieldset class="bg-transparent relative">
          <label class="relative inline-block w-full max-w-[calc(100%-45px)] h-[35px] mb-4">
            <svg class="stroke-(--brand-primary) stroke-4  absolute top-[50%] left-1 -translate-y-[50%]" width="25" height="25" xmlns="http://www.w3.org/2000/svg">
              <circle r="10" cx="12.5" cy="12.5" fill="none"/>
            </svg>
            <input id="fromLocationInput" onInput=${handleFromInput} onKeyDown=${(event) => handleCoordinateKeyDown(event, true)} type="text" name="from" placeholder=${t('whereFrom')} value=${getLocationName(fromLocation)} class="bg-(--bg-surface) border border-(--border-default) rounded-lg p-2 pl-8 pr-8 w-full h-full" />
            <button onClick=${chooseFromLocationOnMap} aria-label=${t('chooseStartingLocation')} class="absolute top-[50%] right-2 -translate-y-[50%]" type="button">
              <svg class="fill-(--brand-secondary)" width="20" xmlns="http://www.w3.org/2000/svg" height="20" id="screenshot-f2a02e6b-c442-80ce-8008-f65e49d9b426" viewBox="-2324.782 -1538.234 20 20" style="-webkit-print-color-adjust::exact" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1">
                <g id="shape-f2a02e6b-c442-80ce-8008-f65e49d9b426" style="fill:#000000" width="24" height="24" rx="0" ry="0">
                  <g id="shape-f2a02e6b-c442-80ce-8008-f65e49d9b427" style="display:none">
                    <g class="fills" id="fills-f2a02e6b-c442-80ce-8008-f65e49d9b427">
                      <rect rx="0" ry="0" x="-2324.7824239398756" y="-1538.2339421823856" transform="matrix(1.000000, 0.000000, 0.000000, 1.000000, 0.000000, 0.000000)" width="20" height="20" fill="none" style="fill:none">
                      </rect>
                    </g>
                  </g>
                  <g id="shape-f2a02e6b-c442-80ce-8008-f65e49d9b428">
                    <g class="fills" id="fills-f2a02e6b-c442-80ce-8008-f65e49d9b428">
                      <path d="M-2314.782470703125,-1537.4007568359375C-2317.405517578125,-1537.4007568359375,-2319.782470703125,-1535.2730712890625,-2319.782470703125,-1532.64892578125C-2319.782470703125,-1530.0255126953125,-2317.61376953125,-1526.89306640625,-2314.782470703125,-1522.4007568359375C-2311.951171875,-1526.89306640625,-2309.782470703125,-1530.0255126953125,-2309.782470703125,-1532.64892578125C-2309.782470703125,-1535.2730712890625,-2312.158203125,-1537.4007568359375,-2314.782470703125,-1537.4007568359375ZM-2314.782470703125,-1530.73388671875C-2315.703369140625,-1530.73388671875,-2316.44921875,-1531.4798583984375,-2316.44921875,-1532.4007568359375C-2316.44921875,-1533.3214111328125,-2315.703369140625,-1534.0670166015625,-2314.782470703125,-1534.0670166015625C-2313.861572265625,-1534.0670166015625,-2313.11572265625,-1533.3214111328125,-2313.11572265625,-1532.4007568359375C-2313.11572265625,-1531.4798583984375,-2313.861572265625,-1530.73388671875,-2314.782470703125,-1530.73388671875ZM-2308.11572265625,-1525.73388671875L-2310.728515625,-1525.73388671875C-2311.049072265625,-1525.19970703125,-2311.392822265625,-1524.64306640625,-2311.7548828125,-1524.0670166015625L-2309.145751953125,-1524.0670166015625L-2308.728759765625,-1523.23388671875L-2312.282470703125,-1523.23388671875L-2312.5693359375,-1522.7803955078125L-2312.809814453125,-1522.4007568359375L-2312.344970703125,-1522.4007568359375L-2311.6298828125,-1520.73388671875L-2317.86962890625,-1520.73388671875L-2317.15478515625,-1522.4007568359375L-2316.755859375,-1522.4007568359375L-2316.99658203125,-1522.7803955078125L-2317.2822265625,-1523.23388671875L-2318.98388671875,-1523.23388671875L-2319.826416015625,-1524.0670166015625L-2317.81005859375,-1524.0670166015625C-2318.172119140625,-1524.64306640625,-2318.5166015625,-1525.19970703125,-2318.836181640625,-1525.73388671875L-2321.44873046875,-1525.73388671875L-2324.782470703125,-1519.0670166015625L-2304.782470703125,-1519.0670166015625L-2308.11572265625,-1525.73388671875ZM-2318.77734375,-1520.73388671875L-2322.0859375,-1520.73388671875L-2320.61572265625,-1523.673828125L-2319.35205078125,-1522.4007568359375L-2318.0615234375,-1522.4007568359375L-2318.77734375,-1520.73388671875ZM-2311.4375,-1522.4007568359375L-2308.31201171875,-1522.4007568359375L-2307.478759765625,-1520.73388671875L-2310.72216796875,-1520.73388671875L-2311.4375,-1522.4007568359375Z" style="fill:var(--text-primary);fill-opacity:1">
                      </path>
                    </g>
                  </g>
                </g>
              </svg>
            </button>
          </label>
          <label class="relative inline-block w-full max-w-[calc(100%-45px)] h-[35px]">
            <svg class="fill-(--brand-secondary) absolute top-[50%] left-1 -translate-y-[50%]" width="25" height="25" xmlns="http://www.w3.org/2000/svg">
              <circle r="12" cx="12.5" cy="12.5"/>
            </svg>
            <input id="toLocationInput" onInput=${handleToInput} onKeyDown=${(event) => handleCoordinateKeyDown(event, false)} type="text" name="to" placeholder=${t('whereTo')} value=${getLocationName(toLocation)} class="bg-(--bg-surface) border border-(--border-default) rounded-lg p-2 pl-8 pr-8 w-full h-full" />
            <button onClick=${chooseToLocationOnMap} aria-label=${t('chooseDestinationLocation')} class="absolute top-[50%] right-2 -translate-y-[50%]" type="button">
              <svg class="fill-(--brand-secondary)" width="20" xmlns="http://www.w3.org/2000/svg" height="20" id="screenshot-f2a02e6b-c442-80ce-8008-f65e49d9b426" viewBox="-2324.782 -1538.234 20 20" style="-webkit-print-color-adjust::exact" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1">
                <g id="shape-f2a02e6b-c442-80ce-8008-f65e49d9b426" style="fill:#000000" width="24" height="24" rx="0" ry="0">
                  <g id="shape-f2a02e6b-c442-80ce-8008-f65e49d9b427" style="display:none">
                    <g class="fills" id="fills-f2a02e6b-c442-80ce-8008-f65e49d9b427">
                      <rect rx="0" ry="0" x="-2324.7824239398756" y="-1538.2339421823856" transform="matrix(1.000000, 0.000000, 0.000000, 1.000000, 0.000000, 0.000000)" width="20" height="20" fill="none" style="fill:none">
                      </rect>
                    </g>
                  </g>
                  <g id="shape-f2a02e6b-c442-80ce-8008-f65e49d9b428">
                    <g class="fills" id="fills-f2a02e6b-c442-80ce-8008-f65e49d9b428">
                      <path d="M-2314.782470703125,-1537.4007568359375C-2317.405517578125,-1537.4007568359375,-2319.782470703125,-1535.2730712890625,-2319.782470703125,-1532.64892578125C-2319.782470703125,-1530.0255126953125,-2317.61376953125,-1526.89306640625,-2314.782470703125,-1522.4007568359375C-2311.951171875,-1526.89306640625,-2309.782470703125,-1530.0255126953125,-2309.782470703125,-1532.64892578125C-2309.782470703125,-1535.2730712890625,-2312.158203125,-1537.4007568359375,-2314.782470703125,-1537.4007568359375ZM-2314.782470703125,-1530.73388671875C-2315.703369140625,-1530.73388671875,-2316.44921875,-1531.4798583984375,-2316.44921875,-1532.4007568359375C-2316.44921875,-1533.3214111328125,-2315.703369140625,-1534.0670166015625,-2314.782470703125,-1534.0670166015625C-2313.861572265625,-1534.0670166015625,-2313.11572265625,-1533.3214111328125,-2313.11572265625,-1532.4007568359375C-2313.11572265625,-1531.4798583984375,-2313.861572265625,-1530.73388671875,-2314.782470703125,-1530.73388671875ZM-2308.11572265625,-1525.73388671875L-2310.728515625,-1525.73388671875C-2311.049072265625,-1525.19970703125,-2311.392822265625,-1524.64306640625,-2311.7548828125,-1524.0670166015625L-2309.145751953125,-1524.0670166015625L-2308.728759765625,-1523.23388671875L-2312.282470703125,-1523.23388671875L-2312.5693359375,-1522.7803955078125L-2312.809814453125,-1522.4007568359375L-2312.344970703125,-1522.4007568359375L-2311.6298828125,-1520.73388671875L-2317.86962890625,-1520.73388671875L-2317.15478515625,-1522.4007568359375L-2316.755859375,-1522.4007568359375L-2316.99658203125,-1522.7803955078125L-2317.2822265625,-1523.23388671875L-2318.98388671875,-1523.23388671875L-2319.826416015625,-1524.0670166015625L-2317.81005859375,-1524.0670166015625C-2318.172119140625,-1524.64306640625,-2318.5166015625,-1525.19970703125,-2318.836181640625,-1525.73388671875L-2321.44873046875,-1525.73388671875L-2324.782470703125,-1519.0670166015625L-2304.782470703125,-1519.0670166015625L-2308.11572265625,-1525.73388671875ZM-2318.77734375,-1520.73388671875L-2322.0859375,-1520.73388671875L-2320.61572265625,-1523.673828125L-2319.35205078125,-1522.4007568359375L-2318.0615234375,-1522.4007568359375L-2318.77734375,-1520.73388671875ZM-2311.4375,-1522.4007568359375L-2308.31201171875,-1522.4007568359375L-2307.478759765625,-1520.73388671875L-2310.72216796875,-1520.73388671875L-2311.4375,-1522.4007568359375Z" style="fill:var(--text-primary);fill-opacity:1">
                      </path>
                    </g>
                  </g>
                </g>
              </svg>
            </button>
          </label>
          <svg class="stroke-(--color-gray-500) stroke-8 absolute top-0 left-[13.5px]" width="5" height="80" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path stroke-dasharray="10,2" d="M 5 27 L 5 60" />
            </g>
          </svg>
          <button aria-label=${t('swapLocations')} onClick=${handleSwapLocations} type="button" class="absolute top-1/2 right-0 translate-y-[-50%] bg-(--bg-surface) border border-(--border-default) rounded-full p-2 mb-2 max-w-[35px] max-h-[35px]">
            <svg width="25" xmlns="http://www.w3.org/2000/svg" height="25" viewBox="-2286.5 -1519 25 25" style="-webkit-print-color-adjust::exact" fill="none" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
              <g id="shape-34a2cc8f-b94b-80f6-8008-b877a2503443" style="fill:#000000" rx="0" ry="0">
                <g id="shape-34a2cc8f-b94b-80f6-8008-b877a2530ff9" style="display:none">
                  <g class="fills" id="fills-34a2cc8f-b94b-80f6-8008-b877a2530ff9">
                    <rect rx="0" ry="0" x="-2288" y="-1520" transform="matrix(1.000000, 0.000000, 0.000000, 1.000000, 0.000000, 0.000000)" width="20" height="20" fill="none" style="fill-opacity:1">
                    </rect>
                  </g>
                </g>
                <g id="shape-34a2cc8f-b94b-80f6-8008-b877a2542044">
                  <g class="fills" id="fills-34a2cc8f-b94b-80f6-8008-b877a2542044">
                    <path d="M-2272.086669921875,-1511.5589599609375C-2272.54541015625,-1511.5589599609375,-2272.91357421875,-1511.1917724609375,-2272.91357421875,-1510.732177734375L-2272.91357421875,-1506.196044921875C-2272.91357421875,-1505.828857421875,-2273.20751953125,-1505.5347900390625,-2273.57470703125,-1505.5347900390625L-2278.514404296875,-1505.535400390625L-2277.6513671875,-1506.3984375C-2277.321044921875,-1506.728759765625,-2277.321044921875,-1507.242919921875,-2277.6513671875,-1507.5738525390625C-2277.9814453125,-1507.9041748046875,-2278.495849609375,-1507.9041748046875,-2278.82666015625,-1507.5738525390625L-2281.103515625,-1505.2969970703125C-2281.43408203125,-1504.9666748046875,-2281.43408203125,-1504.4525146484375,-2281.103515625,-1504.12158203125L-2278.82666015625,-1501.825439453125C-2278.6611328125,-1501.659912109375,-2278.45947265625,-1501.586669921875,-2278.2392578125,-1501.586669921875C-2278.03759765625,-1501.586669921875,-2277.81689453125,-1501.659912109375,-2277.652099609375,-1501.825439453125C-2277.32177734375,-1502.1556396484375,-2277.32177734375,-1502.6697998046875,-2277.652099609375,-1503.000732421875L-2278.533447265625,-1503.8822021484375L-2273.57470703125,-1503.8822021484375C-2272.3076171875,-1503.8822021484375,-2271.2607421875,-1504.9290771484375,-2271.2607421875,-1506.1961669921875L-2271.260009765625,-1510.7330322265625C-2271.260009765625,-1511.19189453125,-2271.627197265625,-1511.55908203125,-2272.086669921875,-1511.55908203125Z" style="fill:var(--text-primary); fill-opacity:1">
                    </path>
                  </g>
                </g>
                <g id="shape-34a2cc8f-b94b-80f6-8008-b877a254e61a">
                  <g class="fills" id="fills-34a2cc8f-b94b-80f6-8008-b877a254e61a">
                    <path d="M-2278.2939453125,-1513.8551025390625C-2278.624267578125,-1513.5247802734375,-2278.6064453125,-1513.0107421875,-2278.2939453125,-1512.6796875C-2278.12841796875,-1512.51416015625,-2277.9267578125,-1512.44091796875,-2277.70654296875,-1512.44091796875C-2277.486572265625,-1512.44091796875,-2277.2841796875,-1512.51416015625,-2277.119140625,-1512.6796875L-2274.84228515625,-1514.97509765625C-2274.52978515625,-1515.305419921875,-2274.52978515625,-1515.819580078125,-2274.84228515625,-1516.1505126953125L-2277.11865234375,-1518.42822265625C-2277.448974609375,-1518.7584228515625,-2277.963134765625,-1518.7584228515625,-2278.294189453125,-1518.42822265625C-2278.62451171875,-1518.097900390625,-2278.62451171875,-1517.5836181640625,-2278.294189453125,-1517.2528076171875L-2277.41259765625,-1516.3714599609375L-2282.37158203125,-1516.3714599609375C-2283.638671875,-1516.3714599609375,-2284.685546875,-1515.324462890625,-2284.685546875,-1514.057373046875L-2284.685546875,-1509.538818359375C-2284.685546875,-1509.080078125,-2284.318359375,-1508.712158203125,-2283.85888671875,-1508.712158203125C-2283.39990234375,-1508.712158203125,-2283.0322265625,-1509.079345703125,-2283.0322265625,-1509.538818359375L-2283.0322265625,-1514.056640625C-2283.0322265625,-1514.423828125,-2282.738037109375,-1514.7178955078125,-2282.37060546875,-1514.7178955078125L-2277.4306640625,-1514.7178955078125Z" style="fill:var(--text-primary); fill-opacity:1">
                    </path>
                  </g>
                </g>
              </g>
            </svg>
          </button>
        </fieldset>
      </form>
    </section>
  `
}

export default RouteWidget