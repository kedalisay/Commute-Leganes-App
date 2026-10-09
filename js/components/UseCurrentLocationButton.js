import html from '../html.js'

const UseCurrentLocationButton = ({coords, onClick}) => {
  return html`
    <button type="button" class="flex flex-row items-center p-4 bg-white text-(--text-primary) w-full cursor-pointer" onClick=${onClick} aria-label="Use your current location">
      <svg class="w-full max-w-[40px] h-full max-h-[40px] mr-4" width="40" xmlns="http://www.w3.org/2000/svg" height="40" id="screenshot-3a1341ad-8328-80f0-8008-c1e03ef5ae4b" viewBox="995 709 40 40" style="-webkit-print-color-adjust::exact" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1">
        <g id="shape-3a1341ad-8328-80f0-8008-c1e03ef5ae4b" style="fill:#000000" width="24" height="24" rx="0" ry="0">
          <g id="shape-3a1341ad-8328-80f0-8008-c1e03ef5ae4c" style="display:none">
            <g class="fills" id="fills-3a1341ad-8328-80f0-8008-c1e03ef5ae4c">
              <rect rx="0" ry="0" x="995" y="709" transform="matrix(1.000000, 0.000000, 0.000000, 1.000000, 0.000000, 0.000000)" width="40" height="39.999999999999886" fill="none" style="fill:#333942;fill-opacity:1">
              </rect>
            </g>
          </g>
          <g id="shape-3a1341ad-8328-80f0-8008-c1e03ef5ae4d">
            <g class="fills" id="fills-3a1341ad-8328-80f0-8008-c1e03ef5ae4d">
              <path d="M1015.0000610351562,709C1008.0033569335938,709,1001.6668090820312,714.6718139648438,1001.6668090820312,721.6700439453125C1001.6668090820312,728.6666259765625,1007.4484252929688,737.0200805664062,1015.0000610351562,749C1022.5518188476562,737.0200805664062,1028.333251953125,728.6666259765625,1028.333251953125,721.6700439453125C1028.333251953125,714.6718139648438,1021.9984741210938,709,1015.0000610351562,709ZM1015.0000610351562,727.333251953125C1012.2384643554688,727.333251953125,1010.0001831054688,725.0949096679688,1010.0001831054688,722.333251953125C1010.0001831054688,719.5716552734375,1012.2384643554688,717.333251953125,1015.0000610351562,717.333251953125C1017.7617797851562,717.333251953125,1020.0001831054688,719.5716552734375,1020.0001831054688,722.333251953125C1020.0001831054688,725.0949096679688,1017.7617797851562,727.333251953125,1015.0000610351562,727.333251953125Z" style="fill:#333942;fill-opacity:1">
              </path>
            </g>
          </g>
        </g>
      </svg>
      <div class="flex flex-col gap-1">
        <p class="text-xl font-bold font-display text-left">Use your current location</p>
        <p class="text-md text-(--text-secondary) text-left">${coords.latitude}, ${coords.longitude}</p>
      </div>
    </button>
    <hr class="border border-(--border-default)" />
  `
}

export default UseCurrentLocationButton