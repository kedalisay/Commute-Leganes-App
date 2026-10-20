import { Marker } from 'maplibre-gl';

const addMarkerToMap = (map, coords, isFromLocationFocused) => {
  const markerElement = document.createElement('div')
  markerElement.classList.add('marker')
  markerElement.style.backgroundImage = `url(${isFromLocationFocused ? './assets/icons/custom_from_marker.png' : './assets/icons/custom_to_marker.png'})`
  markerElement.style.width = '55px'
  markerElement.style.height = '55px'

  return new Marker({ element: markerElement }).setLngLat([coords['lng'], coords['lat']]).setOffset([0, -27.5]).addTo(map)
}

const removeMarkerFromMap = (marker) => {
  marker.remove();
}

export { addMarkerToMap, removeMarkerFromMap }