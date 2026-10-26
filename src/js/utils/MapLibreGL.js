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

const centerMarkerOnMap = (map, marker) => {
  const center = map.getCenter();
  marker.setLngLat([center.lng, center.lat]);
}

const keepMarkerOnMapCentered = (map, marker) => {
  const centerMarkerListener = (e) => {
    centerMarkerOnMap(map, marker)
  }

  const stopMarkerCentering = () => {
    map.off('drag', centerMarkerListener);
    map.off('zoom', centerMarkerListener);
  }

  map.on('drag', centerMarkerListener);
  map.on('zoom', centerMarkerListener);

  return stopMarkerCentering;
}

export { 
  addMarkerToMap, 
  removeMarkerFromMap, 
  centerMarkerOnMap, 
  keepMarkerOnMapCentered
}