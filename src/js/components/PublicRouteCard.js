import html from '../html.js'
import Jeepney from './icons/Jeepney.js'

import Tricycle from './icons/Tricycle.js'

const PublicRouteCard = ({route, onClick}) => {
  const inputId = `public-route-${route.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return html`
    <input class="sr-only relative" type="checkbox" name="public-route" id=${inputId} value=${route.name} />
    <label for=${inputId} class="flex flex-col gap-2 p-4 bg-white border-[3px] border-(--border-default) rounded-3xl text-(--text-secondary) w-full cursor-pointer" onClick=${onClick}>
      <div class="flex flex-row flex-nowrap gap-2 w-full">
        <div class="basis-1/2 sm:basis-5/6 flex flex-col gap-1 items-start">
          <h3 class="text-xl font-bold font-display text-left inline-block">${route.name}</h3>
          <ol class="list-public-route list-inside">
            ${route.points.map(point => html`<li>${point}</li>`)}
          </ol>
        </div>
        <div class="basis-1/2 sm:basis-1/6 flex flex-col gap-1 items-end justify-start">
          <div class="flex flex-row gap-1 items-center justify-end">
            ${route.mode_of_transport.includes('tricycle') ? html`<${Tricycle} width="40" height="40" backgroundFill=${route.color} />` : ''}
            ${route.mode_of_transport.includes('jeepney') ? html`<${Jeepney} width="40" height="40" backgroundFill=${route.color} />` : ''}
          </div>
          <p class="text-lg"><b>${route.mode_of_transport.map(mode => mode.charAt(0).toUpperCase() + mode.slice(1)).join('/')}</b></p>
          <data class="text-right" value="${route.total_distance}"> ${route.total_distance} kilometer${route.total_distance !== 1 ? 's' : ''}</data>
        </div>
      </div>
      <div>
        #TODO: Add route path visualization here
      </div>
    </label>
  `
}

export default PublicRouteCard