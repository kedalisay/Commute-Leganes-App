import html from '../html.js'
import RouteVisualization from './RouteVisualization.js'

const RouteCard = ({route, selected, onClick}) => {
  const inputId = `route-${route.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  const fare = route.fare !== undefined && route.fare !== null
    ? route.fare
    : route.total_fare
  const duration = route.total_duration
  const distance = route.total_distance
  const transfers = route.total_transfers

  return html`
    <input class="sr-only" type="radio" name="route" id=${inputId} value=${route.name} checked=${selected} />
    <label for=${inputId} class="flex flex-col gap-2 p-4 bg-white border-[3px] border-(--border-default) rounded-3xl text-(--text-secondary) w-full cursor-pointer" onClick=${onClick}>
      <div class="flex flex-row flex-nowrap gap-2 w-full">
        <h3 class="text-xl font-bold font-display text-left basis-1/2 sm:basis-4/6 inline}-block">${route.name}</h3>
        <div class="basis-1/2 sm:basis-2/6 flex flex-col gap-1 items-end justify-center">
          ${fare !== null && fare !== undefined ? html`<data class="text-right" value="${fare}"><b>₱${fare}</b></data>` : null}
          ${duration !== null && duration !== undefined
            ? html`<time class="text-right"><b>${duration} minute${duration !== 1 ? 's' : ''}</b></time>`
            : null}
          ${transfers !== null && transfers !== undefined
            ? html`<data class="text-right" value="${transfers}">${transfers} transfer${transfers !== 1 ? 's' : ''}</data>`
            : null}
          ${distance !== null && distance !== undefined
            ? html`<data class="text-right" value="${distance}">${distance} kilometer${distance !== 1 ? 's' : ''}</data>`
            : null}
        </div>
      </div>
      <${RouteVisualization} route=${route} selected=${selected} />
    </label>
  `
}

export default RouteCard