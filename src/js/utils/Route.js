const getClosestVertex = (coordinates, pathEdges) => {
  return pathEdges.reduce(
    (closest, vertex) => {
      const coords = Array.isArray(coordinates[0]) ? coordinates[0][0] : coordinates

      const distance = Math.sqrt(
        Math.pow(vertex[0] - coords[0], 2) +
        Math.pow(vertex[1] - coords[1], 2)
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

  return closestVertex.vertex
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

const getReachableVertices = (coordinates, targetPoint, pathEdges, pathfinder, direction = 'to') => {
  const candidates = coordinates
    .map((coordinate) => getClosestVertex(coordinate, pathEdges).vertex)
    .filter(Boolean)
    .filter((vertex, index, vertices) => (
      vertices.findIndex((candidate) => (
        candidate[0] === vertex[0] && candidate[1] === vertex[1]
      )) === index
    ))
    .sort((a, b) => (
      Math.hypot(
        a[0] - targetPoint.geometry.coordinates[0],
        a[1] - targetPoint.geometry.coordinates[1]
      ) - Math.hypot(
        b[0] - targetPoint.geometry.coordinates[0],
        b[1] - targetPoint.geometry.coordinates[1]
      )
    ))

  return candidates.flatMap((vertex) => {
    const vertexPoint = {
      type: 'Point',
      geometry: { type: 'Point', coordinates: vertex },
    }
    const path = direction === 'from'
      ? pathfinder.findPath(vertexPoint, targetPoint)
      : pathfinder.findPath(targetPoint, vertexPoint)

    return path ? [{ vertex, path }] : []
  }).sort((a, b) => a.path.weight - b.path.weight)
}

const getReachableVertex = (coordinates, targetPoint, pathEdges, pathfinder, direction = 'to') => {
  return getReachableVertices(
    coordinates,
    targetPoint,
    pathEdges,
    pathfinder,
    direction
  )[0] || null
}

const getRouteForBarangay = (barangayName, publicRoutes) => {
  if (!barangayName) return []

  return publicRoutes.filter((route) =>
    route.properties['route-name'].includes(barangayName)
  )
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
      type: 'Feature',
      properties: { name: terminalName },
      geometry: terminal.geometry,
    }]
  })
}

export {
  getClosestVertex,
  getClosestTerminalVertices,
  getReachableVertices,
  getReachableVertex,
  getVertexCoordinates,
  getTerminalPoints,
  getRouteForBarangay,
}