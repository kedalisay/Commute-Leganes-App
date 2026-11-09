import { booleanPointInPolygon } from '@turf/turf'

const getBarangay = (coordinates, barangays) => {
  if (
    !Array.isArray(coordinates) ||
    coordinates.length !== 2 ||
    !coordinates.every(Number.isFinite)
  ) {
    return null
  }

  const point = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates,
    },
  }

  return barangays.find((barangay) => {
    const barangayFeature = {
      type: 'Feature',
      properties: {},
      geometry: barangay.geometry,
    }

    return booleanPointInPolygon(point, barangayFeature)
  })?.name || null
}

export {
  getBarangay,
}