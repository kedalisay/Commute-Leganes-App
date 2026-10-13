import html from '../html.js'

const LocationCard = ({location, onClick}) => {
  const inputId = `location-${location.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return html`
    <input class="sr-only" type="radio" name="location" id=${inputId} value=${location.name} />
    <label for=${inputId} class="flex flex-col p-4 bg-white text-(--text-primary) w-full cursor-pointer" onClick=${onClick}>
      <h3 class="text-xl font-bold font-display text-left basis-1/2 sm:basis-5/6 inline-block">${location.name}</h3>
      <p class="text-md text-(--text-secondary)">${location.full_address}</p>
    </label>
    <hr class="border border-(--border-default)" />
  `
}

export default LocationCard