import html from '../html.js'

const LocationCard = ({location, onClick}) => {
  return html`
    <input class="w-0 h-0 visibility-hidden" type="radio" name="location" id=${location.name} value=${location.name} />
    <label for=${location.name} class="flex flex-col p-4 bg-white text-(--text-primary) w-full cursor-pointer" onClick=${onClick}>
      <p class="text-xl font-bold font-display text-left basis-1/2 sm:basis-5/6 inline-block">${location.name}</p>
      <p class="text-md text-(--text-secondary)">${location.full_address}</p>
    </label>
    <hr class="border border-(--border-default)" />
  `
}

export default LocationCard