import html from '../html.js'

import UseCurrentLocationButton from './UseCurrentLocationButton.js'
import ChooseOnMapButton from './ChooseOnMapButton.js'
import LocationCard from './LocationCard.js'

import { getGeolocation } from '../utils/Geolocation.js'
import { addMarkerToMap, keepMarkerOnMapCentered } from '../utils/MapLibreGL.js'

const LocationCardList = ({ map, setFromMarker, setToMarker, stopMarkerCentering, locations, setDrawerToLocationActions, closeDrawer, deviceLocation, setDeviceLocation, isFromLocationFocused, setFromLocation, isToLocationFocused, setToLocation }) => {  
  const useCurrentLocation = async () => {
    const coords = await getGeolocation()
    if (!coords) {
      alert('Unable to get your current location. Please make sure you have granted location access to this web app.')
      closeDrawer()
      return
    }

    if (deviceLocation !== null) {
      if (coords['lat'] !== deviceLocation['lat'] && coords['lng'] !== deviceLocation['lng']) {
        setDeviceLocation(coords)
      }
      if (isFromLocationFocused) {
        setFromLocation(deviceLocation)
      } else if (isToLocationFocused) {
        setToLocation(deviceLocation)
      }
    } else {
      setDeviceLocation(coords)
      if (isFromLocationFocused) {
        setFromLocation(coords)
      } else if (isToLocationFocused) {
        setToLocation(coords)
      }
    }

    isFromLocationFocused 
      ? (setFromMarker(addMarkerToMap(map, coords, isFromLocationFocused))) 
      : (setToMarker(addMarkerToMap(map, coords, isFromLocationFocused)))

    map.flyTo({
      center: [coords['lng'], coords['lat']],
    })
    
    closeDrawer()
  }

  const chooseOnMap = () => {
    const coords = map.getCenter()
    const marker = addMarkerToMap(map, coords, isFromLocationFocused)
    setDrawerToLocationActions()

    if (isFromLocationFocused) {
      setFromMarker(marker)
      stopMarkerCentering = keepMarkerOnMapCentered(map, marker)
      return
    } 

   setToMarker(marker)
    stopMarkerCentering = keepMarkerOnMapCentered(map, marker)
  }

  return html`
    <section aria-labelledby="locations-heading" class="pb-8 overflow-y-auto max-h-full">
      <h2 id="locations-heading" class="sr-only">Choose a location</h2>
      <form id="locations-form">
        <fieldset class="flex flex-col gap-1 w-full">
        <${UseCurrentLocationButton} onClick=${() => useCurrentLocation()} />
        <${ChooseOnMapButton} onClick=${chooseOnMap}/>
        ${locations.map((location) => html`<${LocationCard} location=${location} onClick=${() => {
          if (isFromLocationFocused) {
            setFromLocation(location.coordinates.toString())
            closeDrawer()
            return
          } 

          setToLocation(location.coordinates.toString())
          closeDrawer()
          }
        }} />`)}
        </fieldset>
      </form>
    </section>
  `
}

export default LocationCardList