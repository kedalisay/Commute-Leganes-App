const getClosestVertex = (coordinates, pathEdges) => {
  return pathEdges.reduce(
    (closest, vertex) => {
      const distance = Math.sqrt(
        Math.pow(vertex[0][0] - coordinates[0], 2) +
        Math.pow(vertex[0][1] - coordinates[1], 2)
      )

      return distance < closest.distance
        ? { vertex, distance }
        : closest
    },
    { vertex: null, distance: Infinity }
  )
}

const getVertexCoordinates = (closestVertex) => {
  if (!closestVertex?.vertex) return null

  return [
    closestVertex.vertex[0][0],
    closestVertex.vertex[0][1],
  ]
}

const getClosestTerminalVertices = (
  terminalPoints,
  pathEdges
) => {
  return terminalPoints
    .map((terminalPoint) => ({
      ...terminalPoint,
      closestVertex: getClosestVertex(
        terminalPoint.geometry.coordinates,
        pathEdges
      ),
    }))
    .filter(({ closestVertex }) => closestVertex?.vertex)
}

const getRouteForBarangay = (barangayName, publicRoutes) => {
  if (!barangayName) return null

  return publicRoutes.find((route) =>
    route.properties['route-name'].includes(barangayName)
  ) || null
}

const getTerminalPoints = (route, terminals) => {
  const terminalNames = route?.properties?.terminals

  if (!Array.isArray(terminalNames)) {
    return []
  }

  return terminalNames.flatMap((terminalName) => {
    const terminal = terminals.find(
      (candidate) => candidate.name === terminalName
    )

    if (!terminal) return []

    return [{
      type: 'Point',
      properties: { name: terminalName },
      geometry: {
        type: 'Point',
        coordinates: terminal.geometry.coordinates[0][0],
      },
    }]
  })
}

export {
  getClosestVertex,
  getClosestTerminalVertices,
  getVertexCoordinates,
  getTerminalPoints,
  getRouteForBarangay,
}