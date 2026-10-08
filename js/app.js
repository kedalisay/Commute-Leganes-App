import { useState } from 'https://esm.sh/preact/hooks'

import html from './html.js'

import Settings from './views/Settings.js'

import Drawer from './components/Drawer.js'
import ActionButtons from './components/ActionButtons.js'
import UseCurrentLocationButton from './components/UseCurrentLocationButton.js'
import ChooseOnMapButton from './components/ChooseOnMapButton.js'
import LocationCard from './components/LocationCard.js'
import RouteCard from './components/RouteCard.js'
import PublicRouteCard from './components/PublicRouteCard.js'

const SearchTransitWidget = () => {
  // contains two input fields: "from" and "to"
  // contains a button to swap the values of the two input fields
  // submit button is stored in a separate component
  // this element is wrapped in a form element

  return html`
    <fieldset class="bg-transparent relative">
      <label class="relative inline-block w-full max-w-[calc(100%-45px)] h-[35px] mb-4">
        <svg class="stroke-(--brand-primary) stroke-4  absolute top-[50%] left-1 -translate-y-[50%]" width="25" height="25" xmlns="http://www.w3.org/2000/svg">
          <circle r="10" cx="12.5" cy="12.5" fill="none"/>
        </svg>
        <input type="text" name="from" placeholder="Where from?" class="bg-(--bg-surface) border border-(--border-default) rounded-lg p-2 pl-8 w-full\ h-full" />
      </label>
      <label class="relative inline-block w-full max-w-[calc(100%-45px)] h-[35px]">
        <svg class="fill-(--brand-secondary) absolute top-[50%] left-1 -translate-y-[50%]" width="25" height="25" xmlns="http://www.w3.org/2000/svg">
          <circle r="12.5" cx="12.5" cy="12.5"/>
        </svg>
        <input type="text" name="to" placeholder="Where to?" class="bg-(--bg-surface) border border-(--border-default) rounded-lg p-2 pl-8 w-full h-full" />
      </label>
      <svg class="stroke-(--color-gray-500) stroke-8 absolute top-0 left-[13.5px]" width="5" height="80" xmlns="http://www.w3.org/2000/svg">
        <g>
          <path stroke-dasharray="10,2" d="M 5 27 L 5 60" />
        </g>
      </svg>
      <button type="button" class="absolute top-1/2 right-0 translate-y-[-50%] bg-(--bg-surface) border border-(--border-default) rounded-full p-2 mb-2 max-w-[35px] max-h-[35px]" aria-label="Swap from and to">
        <svg class="fill-(--color-gray-700)" width="25" xmlns="http://www.w3.org/2000/svg" height="25" viewBox="-2286.5 -1519 25 25" style="-webkit-print-color-adjust::exact" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
          <g id="shape-34a2cc8f-b94b-80f6-8008-b877a2503443" style="fill:#000000" rx="0" ry="0">
            <g id="shape-34a2cc8f-b94b-80f6-8008-b877a2530ff9" style="display:none">
              <g class="fills" id="fills-34a2cc8f-b94b-80f6-8008-b877a2530ff9">
                <rect rx="0" ry="0" x="-2288" y="-1520" transform="matrix(1.000000, 0.000000, 0.000000, 1.000000, 0.000000, 0.000000)" width="20" height="20" fill="none" style="fill-opacity:1">
                </rect>
              </g>
            </g>
            <g id="shape-34a2cc8f-b94b-80f6-8008-b877a2542044">
              <g class="fills" id="fills-34a2cc8f-b94b-80f6-8008-b877a2542044">
                <path d="M-2272.086669921875,-1511.5589599609375C-2272.54541015625,-1511.5589599609375,-2272.91357421875,-1511.1917724609375,-2272.91357421875,-1510.732177734375L-2272.91357421875,-1506.196044921875C-2272.91357421875,-1505.828857421875,-2273.20751953125,-1505.5347900390625,-2273.57470703125,-1505.5347900390625L-2278.514404296875,-1505.535400390625L-2277.6513671875,-1506.3984375C-2277.321044921875,-1506.728759765625,-2277.321044921875,-1507.242919921875,-2277.6513671875,-1507.5738525390625C-2277.9814453125,-1507.9041748046875,-2278.495849609375,-1507.9041748046875,-2278.82666015625,-1507.5738525390625L-2281.103515625,-1505.2969970703125C-2281.43408203125,-1504.9666748046875,-2281.43408203125,-1504.4525146484375,-2281.103515625,-1504.12158203125L-2278.82666015625,-1501.825439453125C-2278.6611328125,-1501.659912109375,-2278.45947265625,-1501.586669921875,-2278.2392578125,-1501.586669921875C-2278.03759765625,-1501.586669921875,-2277.81689453125,-1501.659912109375,-2277.652099609375,-1501.825439453125C-2277.32177734375,-1502.1556396484375,-2277.32177734375,-1502.6697998046875,-2277.652099609375,-1503.000732421875L-2278.533447265625,-1503.8822021484375L-2273.57470703125,-1503.8822021484375C-2272.3076171875,-1503.8822021484375,-2271.2607421875,-1504.9290771484375,-2271.2607421875,-1506.1961669921875L-2271.260009765625,-1510.7330322265625C-2271.260009765625,-1511.19189453125,-2271.627197265625,-1511.55908203125,-2272.086669921875,-1511.55908203125Z" style="fill-opacity:1">
                </path>
              </g>
            </g>
            <g id="shape-34a2cc8f-b94b-80f6-8008-b877a254e61a">
              <g class="fills" id="fills-34a2cc8f-b94b-80f6-8008-b877a254e61a">
                <path d="M-2278.2939453125,-1513.8551025390625C-2278.624267578125,-1513.5247802734375,-2278.6064453125,-1513.0107421875,-2278.2939453125,-1512.6796875C-2278.12841796875,-1512.51416015625,-2277.9267578125,-1512.44091796875,-2277.70654296875,-1512.44091796875C-2277.486572265625,-1512.44091796875,-2277.2841796875,-1512.51416015625,-2277.119140625,-1512.6796875L-2274.84228515625,-1514.97509765625C-2274.52978515625,-1515.305419921875,-2274.52978515625,-1515.819580078125,-2274.84228515625,-1516.1505126953125L-2277.11865234375,-1518.42822265625C-2277.448974609375,-1518.7584228515625,-2277.963134765625,-1518.7584228515625,-2278.294189453125,-1518.42822265625C-2278.62451171875,-1518.097900390625,-2278.62451171875,-1517.5836181640625,-2278.294189453125,-1517.2528076171875L-2277.41259765625,-1516.3714599609375L-2282.37158203125,-1516.3714599609375C-2283.638671875,-1516.3714599609375,-2284.685546875,-1515.324462890625,-2284.685546875,-1514.057373046875L-2284.685546875,-1509.538818359375C-2284.685546875,-1509.080078125,-2284.318359375,-1508.712158203125,-2283.85888671875,-1508.712158203125C-2283.39990234375,-1508.712158203125,-2283.0322265625,-1509.079345703125,-2283.0322265625,-1509.538818359375L-2283.0322265625,-1514.056640625C-2283.0322265625,-1514.423828125,-2282.738037109375,-1514.7178955078125,-2282.37060546875,-1514.7178955078125L-2277.4306640625,-1514.7178955078125Z" style="fill-opacity:1">
                </path>
              </g>
            </g>
          </g>
        </svg>
      </button>
    </fieldset>
    `
}

const AppButtons = ({ onSettingsClick }) => {
  return html`
    <div class="flex flex-col gap-3 w-[35px] absolute top-30 right-0">
      <button onClick=${onSettingsClick} class="bg-(--bg-surface) border border-(--border-default) p-2 w-full max-w-[35px] max-h-[35px] rounded-full">
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
      <button class="bg-(--bg-surface) border border-(--border-default) p-2 w-full max-w-[35px] max-h-[35px] rounded-full">
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
    </div>
  `
}

const LocationCardList = ({ locations }) => {
  return html`
    <form id="locations-form" class="flex flex-col gap-1 w-full">
      <${UseCurrentLocationButton} coords=${{latitude: 10.7875, longitude: 122.60455}}/>
      <${ChooseOnMapButton} />
      ${locations.map((location) => html`<${LocationCard} location=${location} onClick=${() => console.log(`${location.name} clicked`)} />`)}
    </form>
  `
}

const RouteCardList = ({ routes }) => {
  return html`
    <form id="routes-form" class="flex flex-col gap-3 w-full">
      ${routes.map((route) => html`<${route.public ? PublicRouteCard : RouteCard} route=${route} onClick=${() => console.log(`${route.name} clicked`)} />`)}
    </form>
  `
}

const App = () => {
  // Drawer state management
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const openDrawer = () => setIsDrawerOpen(true)
  const closeDrawer = () => setIsDrawerOpen(false)

  const [isDrawerBackgroundVisible, setIsDrawerBackgroundVisible] = useState(true)
  const showDrawerBackground = () => setIsDrawerBackgroundVisible(true)
  const hideDrawerBackground = () => setIsDrawerBackgroundVisible(false)

  const [isDrawerHandleVisible, setIsDrawerHandleVisible] = useState(true)
  const showDrawerHandle = () => setIsDrawerHandleVisible(true)
  const hideDrawerHandle = () => setIsDrawerHandleVisible(false)

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

  const [isSettingsVisible, setIsSettingsVisible] = useState(false)
  const showSettings = () => {
    setDraftSettings(savedSettings)
    setIsSettingsVisible(true)
  }
  const hideSettings = () => {
    setIsSettingsVisible(false)
    closeDrawer()
  }

  const settingsActions = [
    { label: 'Save', onClick: saveSettings, variant: 'primary' },
    { label: 'Cancel', onClick: cancelSettings, variant: 'secondary' },
  ]

  return html`
    <main class="relative">
      <form>
        <${SearchTransitWidget} />
      </form>
      <${AppButtons} onSettingsClick=${showSettings} />
      <${Settings}
        isVisible=${isSettingsVisible}
        hideSettings=${hideSettings}
        hideDrawerBackground=${hideDrawerBackground}
        hideDrawerHandle=${hideDrawerHandle}
        isDrawerOpen=${isDrawerOpen}
        openDrawer=${openDrawer}
        language=${draftSettings.language}
        theme=${draftSettings.theme}
        onLanguageChange=${updateLanguage}
        onThemeChange=${updateTheme}
      />
      <${Drawer} showBackground=${showDrawerBackground} isBackgroundVisible=${isDrawerBackgroundVisible} isHandleVisible=${isDrawerHandleVisible} isOpen=${isDrawerOpen} closeDrawer=${closeDrawer}>
        ${isSettingsVisible ? html`<${ActionButtons} buttons=${settingsActions} direction="row" />` : null}
        <${LocationCardList} locations=${[
          { name: 'Leganes Central Elementary School', full_address: 'Iloilo - Capiz Road, Brgy. Poblacion' },
          { name: 'Leganes Commercial Complex', full_address: 'Hilado St., Brgy. Poblacion' },
          { name: 'Archdiocesan Shrine of St. Vincent Ferrer', full_address: 'Hilado St., Brgy. Poblacion' },
          { name: 'La Maison Du Leganes', full_address: 'Calle Progreso, Brgy. Guinobatan' },
          { name: 'Jolibee Leganes', full_address: 'Iloilo - Capiz Road, Brgy. Poblacion' },
          { name: 'Leganes Integrated Katunggan Ecopark', full_address: 'Coastal Road, Brgy. Gua-an' }
        ]}>
      </${Drawer}>
    </main>
    `
}

// <${RouteCardList} routes=${[
//           {name: 'Guinobatan', total_fare: 23, total_duration: 13, total_transfers: 1, total_distance: 1.1},
//           {name: 'Napnud', total_fare: 25, total_duration: 15, total_transfers: 2, total_distance: 1.3},
//           {public: true, name: 'GUITODA - Guinobatan', total_fare: 30, total_duration: 20, total_transfers: 3, total_distance: 2.0},
//         ]} />

export default App