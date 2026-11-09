
const getGeolocation = async () => {
  try {
    return navigator.geolocation ? await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve([position.coords.longitude, position.coords.latitude])
      }, (error) => {
        reject(error)
      })
    }) : null
  } catch (error) {
    console.error('Error getting user location:', error)
  }
}

const getCoordinates = (location) => {
  if (typeof location === 'object' && location !== null) {
    return Array.isArray(location.coords) ? location.coords : null
  }

  if (typeof location !== 'string' || location.trim() === '') {
    return null
  }

  const coordinates = location
    .split(',')
    .map((coordinate) => parseFloat(coordinate.trim()))

  if (coordinates.length !== 2 || !coordinates.every(Number.isFinite)) {
    return null
  }

  return coordinates.reverse()
}

const areValidCoordinates = (coordinates) => (
  Array.isArray(coordinates) &&
  coordinates.length === 2 &&
  coordinates.every(Number.isFinite)
)

export { 
  getGeolocation,
  getCoordinates,
  areValidCoordinates,
}