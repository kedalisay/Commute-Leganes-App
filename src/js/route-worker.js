import PathFinder, { pathToGeoJSON } from 'geojson-path-finder'

import roadNetwork from '../../dist/data/leganes_road_network.json'
import publicRoutesData from '../../dist/data/leganes_public_routes.json'
import barangaysData from '../../dist/data/bgysubmuns-municity-603026000.0.01.json'
import terminalsData from '../../dist/data/leganes_terminals.json'

import { getBarangay } from './utils/Barangay.js'
import { getCoordinates, areValidCoordinates } from './utils/Geolocation.js'
import { getClosestVertex, getVertexCoordinates, getTerminalPoints, getReachableVertices, getRouteForBarangay } from './utils/Route.js'

const pathfinder = new PathFinder(roadNetwork, { tolerance: 1e-5 })
const pathEdges = Object.keys(pathfinder.graph.vertices)
  .map((vertex) => vertex.split(',').map((coordinate) => parseFloat(coordinate)))
  .filter((coordinates) => coordinates.length === 2 && coordinates.every(Number.isFinite))

const barangays = barangaysData.features.map((feature) => ({
  name: feature.properties.adm4_en,
  geometry: feature.geometry,
}))
const publicRoutes = publicRoutesData.features
  .sort((a, b) => a.properties['route-name'].localeCompare(b.properties['route-name']))
  .filter((feature) => feature.properties.public === true)
const terminals = terminalsData.features.map((feature) => ({
  name: feature.properties['terminal-name'],
  geometry: feature.geometry,
}))
const closestVertexCache = new Map()
const routeVerticesCache = new Map()
const transferCache = new Map()
const routePathCache = new Map()

const getCachedClosestVertex = (coordinates) => {
  const key = `${coordinates[0]},${coordinates[1]}`
  if (!closestVertexCache.has(key)) {
    closestVertexCache.set(key, getClosestVertex(coordinates, pathEdges))
  }
  return closestVertexCache.get(key)
}

const pathToGeoJSONSafe = (path) => {
  if (!path || !Array.isArray(path.path) || path.path.length === 0) return null
  if (path.path.length === 1) {
    return {
      type: 'Feature',
      properties: { weight: path.weight, edgeDatas: path.edgeDatas },
      geometry: { type: 'LineString', coordinates: [path.path[0], path.path[0]] },
    }
  }
  return pathToGeoJSON(path)
}

const getCoordinateDistance = (from, to) => {
  const latitude = (to[1] - from[1]) * Math.PI / 180
  const longitude = (to[0] - from[0]) * Math.PI / 180
  const fromLatitude = from[1] * Math.PI / 180
  const toLatitude = to[1] * Math.PI / 180
  const haversine = Math.sin(latitude / 2) ** 2
    + Math.sin(longitude / 2) ** 2 * Math.cos(fromLatitude) * Math.cos(toLatitude)
  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

const getRoutePath = (fromVertex, toVertex, routeCoordinates) => {
  if (!Array.isArray(routeCoordinates) || routeCoordinates.length < 2) return null
  const getClosestRouteIndex = (vertex) => routeCoordinates.reduce(
    (closestIndex, coordinate, index) => Math.hypot(coordinate[0] - vertex[0], coordinate[1] - vertex[1])
      < Math.hypot(routeCoordinates[closestIndex][0] - vertex[0], routeCoordinates[closestIndex][1] - vertex[1])
      ? index
      : closestIndex,
    0,
  )
  const fromIndex = getClosestRouteIndex(fromVertex)
  const toIndex = getClosestRouteIndex(toVertex)
  const routePath = routeCoordinates.slice(Math.min(fromIndex, toIndex), Math.max(fromIndex, toIndex) + 1)
  if (fromIndex > toIndex) routePath.reverse()
  routePath.unshift(fromVertex)
  routePath.push(toVertex)
  return {
    path: routePath,
    weight: routePath.reduce((total, coordinate, index) => index === 0
      ? total
      : total + getCoordinateDistance(routePath[index - 1], coordinate), 0),
    edgeDatas: [],
  }
}

const getNearestReachableVertex = (coordinates, targetPoint, direction = 'to') => getReachableVertices(
  coordinates,
  targetPoint,
  pathEdges,
  pathfinder,
  direction,
).sort((a, b) => (
  Math.hypot(a.vertex[0] - targetPoint.geometry.coordinates[0], a.vertex[1] - targetPoint.geometry.coordinates[1])
  - Math.hypot(b.vertex[0] - targetPoint.geometry.coordinates[0], b.vertex[1] - targetPoint.geometry.coordinates[1])
))[0] || null

const getRouteFare = (route, distance) => {
  const fares = Array.isArray(route.properties['route-fare']) ? route.properties['route-fare'] : []
  const fare = fares.find((candidate) => candidate.type !== 'per succeeding kilometer') || fares[0]
  if (!fare) return { amount: 0, mode: route.properties['mode-of-transport'] }
  if (fare.mode === 'jeepney' && fare.type === 'first 4 kilometers' && distance > 4) {
    const succeedingFare = fares.find((candidate) => candidate.type === 'per succeeding kilometer')
    return {
      amount: fare.amount + (succeedingFare ? Math.ceil(distance - 4) * succeedingFare.amount : 0),
      mode: fare.mode,
    }
  }
  return { amount: fare.amount, mode: fare.mode }
}

const buildRoute = (routeId, routeName, fromPoint, toPoint, route, terminal, terminalIsHopOn) => {
  const terminalCoordinates = terminal?.geometry?.coordinates
  if (!Array.isArray(terminalCoordinates)) return null

  const hopOnCoordinates = terminalIsHopOn ?  [terminalCoordinates] : route.geometry.coordinates
  const hopOffCoordinates = terminalIsHopOn ? route.geometry.coordinates : [terminalCoordinates]
  const hopOn = getNearestReachableVertex(hopOnCoordinates, fromPoint, 'from')
  const dropoff = getNearestReachableVertex(hopOffCoordinates, toPoint)
  if (!hopOn || !dropoff) return null

  const commutePath = getRoutePath(hopOn.vertex, dropoff.vertex, route.geometry?.coordinates)
  const geojsonPathToHopOn = pathToGeoJSONSafe(hopOn.path)
  const geojsonPathToDropoff = pathToGeoJSONSafe(dropoff.path)
  const geojsonCommutePath = pathToGeoJSONSafe(commutePath)
  if (!geojsonPathToHopOn || !geojsonPathToDropoff || !geojsonCommutePath) return null

  const fares = Array.isArray(route.properties['route-fare']) ? route.properties['route-fare'] : []
  let fare = fares.find((candidate) => candidate.type !== 'per succeeding kilometer') || fares[0]
  if (!fare) return null
  const walkingDistance = hopOn.path.weight + dropoff.path.weight
  const commuteDistance = commutePath.weight
  const succeedingFare = fares.find((candidate) => candidate.type === 'per succeeding kilometer')
  if (fare.mode === 'jeepney' && commuteDistance > 4
    && fare.type === 'first 4 kilometers'
    && succeedingFare) {
    fare = { ...fare, amount: fare.amount + Math.ceil(commuteDistance - 4) * succeedingFare.amount }
  }

  return {
    id: routeId,
    name: routeName,
    public: false,
    total_distance: (walkingDistance + commuteDistance).toPrecision(2),
    total_duration: Math.round(walkingDistance / 5 * 60) + Math.round(commuteDistance / 40 * 60),
    total_transfers: 0,
    fare: fare.amount,
    mode: fare.mode,
    layers: {
      pathToHopOn: geojsonPathToHopOn,
      startPoint: { type: 'Feature', properties: {}, geometry: fromPoint.geometry },
      endPoint: { type: 'Feature', properties: {}, geometry: toPoint.geometry },
      hopOnPoint: { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: hopOn.vertex } },
      hopOffPoint: { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: dropoff.vertex } },
      terminalPoint: { type: 'Feature', properties: terminal.properties || {}, geometry: terminal.geometry },
      commutePath: geojsonCommutePath,
      pathToDropoff: geojsonPathToDropoff,
      publicRoute: route,
    },
  }
}

const getRouteTransfer = (fromRoute, toRoute) => {
  let closestTransfer = null
  const cacheKey = `${publicRoutes.indexOf(fromRoute)}:${publicRoutes.indexOf(toRoute)}`
  if (transferCache.has(cacheKey)) return transferCache.get(cacheKey)

  const getRouteVertices = (route) => {
    if (routeVerticesCache.has(route)) return routeVerticesCache.get(route)
    const vertices = route.geometry.coordinates
      .map((coordinate) => getCachedClosestVertex(coordinate).vertex)
      .filter(Boolean)
      .filter((vertex, index, candidates) => (
        candidates.findIndex((candidate) => candidate[0] === vertex[0] && candidate[1] === vertex[1]) === index
      ))
    routeVerticesCache.set(route, vertices)
    return vertices
  }

  const fromVertices = getRouteVertices(fromRoute)
  const toVertices = getRouteVertices(toRoute)

  for (const fromVertex of fromVertices) {
    for (const toVertex of toVertices) {
      if (Math.hypot(fromVertex[0] - toVertex[0], fromVertex[1] - toVertex[1]) > 0.01) continue
      const transferKey = `${fromVertex[0]},${fromVertex[1]}:${toVertex[0]},${toVertex[1]}`
      let path = routePathCache.get(transferKey)
      if (!routePathCache.has(transferKey)) {
        path = pathfinder.findPath(
          { type: 'Point', geometry: { type: 'Point', coordinates: fromVertex } },
          { type: 'Point', geometry: { type: 'Point', coordinates: toVertex } },
        )
        routePathCache.set(transferKey, path)
      }
      if (!path || (closestTransfer && path.weight >= closestTransfer.path.weight)) continue
      closestTransfer = { fromVertex, toVertex, path }
    }
  }
  transferCache.set(cacheKey, closestTransfer)
  return closestTransfer
}

const getRouteSequence = (fromRoutes, toRoutes) => {
  const sequences = []
  const seen = new Set()
  for (const fromRoute of fromRoutes) {
    for (const toRoute of toRoutes) {
      if (fromRoute === toRoute) continue
      const transfer = getRouteTransfer(fromRoute, toRoute)
      if (!transfer) continue
      const key = `${publicRoutes.indexOf(fromRoute)}:${publicRoutes.indexOf(toRoute)}`
      if (seen.has(key)) continue
      seen.add(key)
      sequences.push({ routes: [fromRoute, toRoute], transfer })
    }
  }
  return sequences
}

const toFeatureCollection = (features, weight) => ({
  type: 'FeatureCollection',
  properties: { weight },
  features,
})

const buildRouteChain = (routeSequence, fromPoint, toPoint, getTransfer) => {
  const transfers = routeSequence.slice(0, -1).map((route, index) => getTransfer(route, routeSequence[index + 1]))
  if (transfers.some((transfer) => !transfer)) return null
  const pathToHopOnFeatures = []
  const commuteFeatures = []
  let walkingDistance = 0
  let commuteDistance = 0
  let fare = 0
  const modes = []
  const segments = []
  const inBetweenPoints = []

  for (let index = 0; index < routeSequence.length; index += 1) {
    const route = routeSequence[index]
    const routeCoordinates = route.geometry?.coordinates
    if (!Array.isArray(routeCoordinates) || routeCoordinates.length < 2) return null
    const hopOn = index === 0
      ? getNearestReachableVertex(routeCoordinates, fromPoint)
      : { vertex: transfers[index - 1].toVertex, path: transfers[index - 1].path }
    const dropoff = index === routeSequence.length - 1
      ? getNearestReachableVertex(routeCoordinates, toPoint, 'from')
      : { vertex: transfers[index].fromVertex, path: null }
    if (!hopOn || !dropoff) return null

    if (hopOn.path) {
      const walkingFeature = pathToGeoJSONSafe(hopOn.path)
      if (!walkingFeature) return null
      pathToHopOnFeatures.push(walkingFeature)
      walkingDistance += hopOn.path.weight
      segments.push({ mode: 'walk', label: 'Walk', weight: hopOn.path.weight, color: '#0b38a8' })
    }
    const commutePath = getRoutePath(hopOn.vertex, dropoff.vertex, routeCoordinates)
    const commuteFeature = pathToGeoJSONSafe(commutePath)
    if (!commutePath || !commuteFeature) return null
    commuteFeature.properties = {
      ...commuteFeature.properties,
      stroke: route.properties.stroke,
      strokeWidth: route.properties['stroke-width'],
      strokeOpacity: route.properties['stroke-opacity'],
    }
    commuteFeatures.push(commuteFeature)
    commuteDistance += commutePath.weight
    const routeFare = getRouteFare(route, commutePath.weight)
    fare += routeFare.amount
    modes.push(routeFare.mode)
    segments.push({ mode: routeFare.mode, label: routeFare.mode, weight: commutePath.weight, color: route.properties.stroke })
    inBetweenPoints.push(hopOn.vertex)
    inBetweenPoints.push(dropoff.vertex)
  }

  const firstHopOnPoint = inBetweenPoints.shift()
  const lastDropoffPoint = inBetweenPoints.pop()
  const finalWalkingPath = getNearestReachableVertex([lastDropoffPoint], toPoint, 'from')
  if (!finalWalkingPath) return null
  const finalWalkingFeature = pathToGeoJSONSafe(finalWalkingPath.path)
  if (!finalWalkingFeature) return null
  walkingDistance += finalWalkingPath.path.weight
  segments.push({ mode: 'walk', label: 'Walk', weight: finalWalkingPath.path.weight, color: '#0b38a8' })

  return {
    id: '',
    name: '',
    public: false,
    total_distance: (walkingDistance + commuteDistance).toPrecision(2),
    total_duration: Math.round(walkingDistance / 5 * 60) + Math.round(commuteDistance / 40 * 60),
    total_transfers: routeSequence.length - 1,
    fare,
    mode: modes.join(', '),
    segments,
    layers: {
      pathToHopOn: toFeatureCollection(pathToHopOnFeatures, walkingDistance),
      startPoint: { type: 'Feature', properties: {}, geometry: fromPoint.geometry },
      endPoint: { type: 'Feature', properties: {}, geometry: toPoint.geometry },
      hopOnPoint: { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: firstHopOnPoint } },
      hopOffPoint: { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: lastDropoffPoint } },
      inBetweenPoints: {
        type: 'FeatureCollection',
        properties: {},
        features: inBetweenPoints.map((point) => ({
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: point },
        })),
      },
      terminalPoint: { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: lastDropoffPoint } },
      commutePath: toFeatureCollection(commuteFeatures, commuteDistance),
      pathToDropoff: finalWalkingFeature,
      publicRoute: routeSequence[0],
    },
  }
}

const findRoutes = (fromLocation, toLocation) => {
  const fromCoords = getCoordinates(fromLocation)
  const toCoords = getCoordinates(toLocation)
  if (!areValidCoordinates(fromCoords) || !areValidCoordinates(toCoords)) return []
  const fromBarangay = getBarangay(fromCoords, barangays)
  const toBarangay = getBarangay(toCoords, barangays)
  if (!fromBarangay || !toBarangay) return []
  const closestFromVertex = getClosestVertex(fromCoords, pathEdges)
  const closestToVertex = getClosestVertex(toCoords, pathEdges)
  if (!closestFromVertex.vertex || !closestToVertex.vertex) return []
  const fromVertexCoords = getVertexCoordinates(closestFromVertex)
  const toVertexCoords = getVertexCoordinates(closestToVertex)
  const routeFromBarangay = getRouteForBarangay(fromBarangay, publicRoutes)
  const routeToBarangay = getRouteForBarangay(toBarangay, publicRoutes)
  if (routeFromBarangay.length === 0 && routeToBarangay.length === 0) return []

  const originRoutes = routeFromBarangay.flatMap((route) => getTerminalPoints(route, terminals).map((terminal) => ({
    route, terminal, terminalIsHopOn: false,
  })))
  const destinationRoutes = routeToBarangay.flatMap((route) => getTerminalPoints(route, terminals).map((terminal) => ({
    route, terminal, terminalIsHopOn: true,
  })))
  const routeCandidates = [...originRoutes, ...destinationRoutes]
  if (routeCandidates.length === 0) return []

  const closestTerminals = routeCandidates.flatMap(({ route, terminal, terminalIsHopOn }) => {
    const closestVertex = getClosestVertex(terminal.geometry.coordinates, pathEdges)
    return closestVertex.vertex ? [{ route, terminal, terminalIsHopOn, closestVertex }] : []
  })

  const directRoutes = closestTerminals.map(({ route, terminal, terminalIsHopOn }, index) => buildRoute(
    `route-${index + 1}`,
    `Route ${index + 1} from ${fromBarangay} to ${toBarangay}`,
    { type: 'Point', geometry: { type: 'Point', coordinates: fromVertexCoords } },
    { type: 'Point', geometry: { type: 'Point', coordinates: toVertexCoords } },
    route,
    terminal,
    terminalIsHopOn,
  )).filter(Boolean).sort((a, b) => a.total_duration - b.total_duration)

  const transferCandidates = getRouteSequence(routeFromBarangay, routeToBarangay.length > 0 ? routeToBarangay : publicRoutes)
  const transferRoutes = transferCandidates.map(({ routes, transfer }, index) => {
    const route = buildRouteChain(
      routes,
      { type: 'Point', geometry: { type: 'Point', coordinates: fromVertexCoords } },
      { type: 'Point', geometry: { type: 'Point', coordinates: toVertexCoords } },
      () => transfer,
    )
    if (!route) return null
    return {
      ...route,
      id: `route-transfer-${index + 1}`,
      name: `Route ${index + 1} from ${fromBarangay} to ${toBarangay}`,
    }
  }).filter(Boolean)

  return [...directRoutes, ...transferRoutes].sort((a, b) => a.total_duration - b.total_duration)
}

self.onmessage = (event) => {
  const { id, fromLocation, toLocation } = event.data
  try {
    self.postMessage({ id, routes: findRoutes(fromLocation, toLocation) })
  } catch (error) {
    self.postMessage({ id, routes: [], error: error instanceof Error ? error.message : String(error) })
  }
}
