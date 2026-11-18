import html from '../html.js'

import UseCurrentLocationButton from './UseCurrentLocationButton.js'
import ChooseOnMapButton from './ChooseOnMapButton.js'
import LocationCard from './LocationCard.js'

import { getGeolocation } from '../utils/Geolocation.js'
import { addMarkerToMap, removeMarkerFromMap, chooseLocationOnMap } from '../utils/MapLibreGL.js'
import { getTranslation } from '../i18n.js'

const LocationCardList = ({ map, fromMarker, setFromMarker, toMarker, setToMarker, stopMarkerCentering, locations, setDrawerToLocationActions, closeDrawer, deviceLocation, setDeviceLocation, isFromLocationFocused, setFromLocation, isToLocationFocused, setToLocation, language }) => {  
  const useCurrentLocation = async () => {
    const coords = await getGeolocation()
    if (!coords) {
      alert('Unable to get your current location. Please make sure you have granted location access to this web app.')
      closeDrawer()
      return
    }

    if (deviceLocation === null 
      || coords[1] !== deviceLocation[1] 
      || coords[0] !== deviceLocation[0]) {
      setDeviceLocation(coords)
    }

    if (isFromLocationFocused) {
      setFromLocation({ name: `${coords[1]}, ${coords[0]}`, coords: coords })
      if (fromMarker) {
        removeMarkerFromMap(fromMarker)
      }
      setFromMarker(addMarkerToMap(map, coords, isFromLocationFocused))
    } else if (isToLocationFocused) {
      setToLocation({ name: `${coords[1]}, ${coords[0]}`, coords: coords })
      if (toMarker) {
        removeMarkerFromMap(toMarker)
      }
      setToMarker(addMarkerToMap(map, coords, isFromLocationFocused))
    }

    map.flyTo({
      center: [coords[0], coords[1]],
    })
    
    closeDrawer()
  }

  const chooseOnMap = () => {
    chooseLocationOnMap({
      map,
      isFromLocation: isFromLocationFocused,
      fromMarker,
      setFromMarker,
      toMarker,
      setToMarker,
      stopMarkerCentering,
      setDrawerToLocationActions,
      openDrawer: null,
    })
  }

  const handleLocationClick = (location) => {
    const marker = addMarkerToMap(map, location.coords, isFromLocationFocused)
    map.flyTo({
      center: location.coords,
    })

    if (isFromLocationFocused) {
      setFromLocation(location)
      if (fromMarker) removeMarkerFromMap(fromMarker)
      setFromMarker(marker)
      closeDrawer()
      return
    } 

    setToLocation(location)
    if (toMarker) removeMarkerFromMap(toMarker)
    setToMarker(marker)
    closeDrawer()
  }

  return html`
    <section aria-labelledby="locations-heading" class="pb-8 overflow-y-auto max-h-full">
      <h2 id="locations-heading" class="sr-only">${getTranslation(language, 'chooseLocation')}</h2>
      <form id="locations-form">
        <fieldset class="flex flex-col gap-1 w-full">
        <${UseCurrentLocationButton} language=${language} onClick=${() => useCurrentLocation()} />
        <${ChooseOnMapButton} language=${language} onClick=${chooseOnMap}/>
        ${locations.map((location) => 
          html`<${LocationCard} 
          location=${location} 
          onClick=${() => handleLocationClick(location)} 
          />`)}
        </fieldset>
      </form>
    </section>
  `
}

export default LocationCardList