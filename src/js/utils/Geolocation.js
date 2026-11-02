
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


export { getGeolocation }