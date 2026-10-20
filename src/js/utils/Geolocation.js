
const getGeolocation = async () => {
  try {
    return navigator.geolocation ? await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      }, (error) => {
        reject(error)
      })
    }) : null
  } catch (error) {
    console.error('Error getting user location:', error)
  }
}


export { getGeolocation }