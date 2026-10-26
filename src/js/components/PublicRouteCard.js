import html from '../html.js'

import Distance from './icons/Distance.js'
import TwoDirections from './icons/TwoDirections.js'
import Jeepney from './icons/Jeepney.js'
import Tricycle from './icons/Tricycle.js'


const TricycleEntry = ({route_color, fare}) => {
  return html`
    <div class="flex flex-col gap-1 items-end justify-start">
      <${Tricycle} width="40" height="40" backgroundFill="${route_color}" />
      <strong class="text-right">Tricycle</strong>
      ${fare.length > 0 ? fare.map(fareEntry => {
        if (fareEntry.mode === 'tricycle') {
          return html`
            <span class="text-sm text-right">₱${fareEntry.amount} ${fareEntry.type}</span>
          `
        }
      }) : ''}
    </div>
  `
}

const JeepneyEntry = ({route_color, fare}) => {
  return html`
    <div class="flex flex-col gap-1 items-end justify-start">
      <${Jeepney} width="40" height="40" backgroundFill="${route_color}" />
      <strong class="text-right">Jeepney</strong>
      ${fare.length > 0 ? fare.map(fareEntry => {
        if (fareEntry.mode === 'jeepney') {
          return html`
            <span class="text-sm text-right">₱${fareEntry.amount} ${fareEntry.type}</span>
          `
        }
      }) : ''}
    </div>
  `
}

const PublicRouteCard = ({route, onClick}) => {
  const inputId = `public-route-${route.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return html`
    <input class="sr-only relative" type="checkbox" name="public-route" id=${inputId} value=${route.name} />
    <label for=${inputId} class="flex flex-col gap-2 p-4 bg-white border-[3px] border-(--border-default) rounded-3xl text-(--text-secondary) w-full cursor-pointer" onClick=${onClick}>
      <div class="flex flex-row flex-nowrap gap-2 w-full">
        <div class="basis-2/3 sm:basis-5/6 flex flex-col gap-1 items-start">
          <h3 class="text-xl font-bold font-display text-left inline-block">${route.name}</h3>
          <data value="${route.total_distance}"> 
            <${Distance} classNames="mr-2" width="30" height="30" foregroundFill="var(--color-gray-700)" />
            ${route.total_distance} kilometer${route.total_distance !== 1 ? 's' : ''}
          </data>
          <data value="${route.direction}">
            <${TwoDirections} width="30" height="30" foregroundFill="var(--color-gray-700)" />
            ${route.direction[0].toUpperCase() + route.direction.slice(1)}
          </data>
          <ol class="list-public-route list-inside mt-4">
            ${route.points.map(point => html`<li>${point}</li>`)}
          </ol>
        </div>
        <div class="basis-1/3 sm:basis-1/6 flex flex-row flex-wrap content-start gap-4 items-start justify-end">
            ${route.mode_of_transport.includes('tricycle') ? html`<${TricycleEntry} route_color=${route.color} fare=${route.fare} />` : ''}
            ${route.mode_of_transport.includes('jeepney') ? html`<${JeepneyEntry} route_color=${route.color} fare=${route.fare} />` : ''}
        </div>
      </div>
    </label>
  `
}

export default PublicRouteCard