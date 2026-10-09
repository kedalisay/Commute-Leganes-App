import html from '../html.js'

const RouteCard = ({route, onClick}) => {
  const inputId = `route-${route.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return html`
    <input class="sr-only" type="radio" name="route" id=${inputId} value=${route.name} />
    <label for=${inputId} class="flex flex-col gap-2 p-4 bg-white border-[3px] border-(--border-default) rounded-3xl text-(--text-secondary) w-full cursor-pointer" onClick=${onClick}>
      <div class="flex flex-row flex-nowrap gap-2 w-full">
        <h3 class="text-xl font-bold font-display text-left basis-1/2 sm:basis-5/6 inline-block">${route.name}</h3>
        <div class="basis-1/2 sm:basis-1/6 flex flex-col gap-1 items-end justify-center">
          <data class="text-right" value="${route.total_fare}"><b>₱${route.total_fare}</b></data>
          <time class="text-right" datetime="0d 0h 13m 0s"><b>${route.total_duration} minute${route.total_duration !== 1 ? 's' : ''}</b></time>
          <data class="text-right" value="${route.total_transfers}">${route.total_transfers} transfer${route.total_transfers !== 1 ? 's' : ''}</data>
          <data class="text-right" value="${route.total_distance}"> ${route.total_distance} kilometer${route.total_distance !== 1 ? 's' : ''}</data>
        </div>
      </div>
      <div>
        #TODO: Add route path visualization here
      </div>
    </label>
  `
}

export default RouteCard