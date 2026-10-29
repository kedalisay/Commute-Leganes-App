import html from '../html.js'

const LocationCard = ({location, onClick}) => {
  const coordinatesString = `${location.coordinates[1]}, ${location.coordinates[0]}`

  return html`
    <button type="button" class="flex flex-col p-4 bg-white text-(--text-primary) w-full cursor-pointer" onClick=${onClick}>
      <h3 class="text-xl font-bold font-display text-left basis-1/2 sm:basis-5/6 inline-block">${location.name}</h3>
      <p class="text-md text-left text-(--text-secondary)">${coordinatesString}</p>
    </button>
    <hr class="border border-(--border-default)" />
  `
}

export default LocationCard