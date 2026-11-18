import { Marker } from 'maplibre-gl';

const addMarkerToMap = (map, coords, isFromLocationFocused) => {
  const markerElement = document.createElement('div')
  markerElement.classList.add('marker')
  markerElement.style.backgroundImage = `url(${isFromLocationFocused ? './assets/icons/custom_from_marker.svg' : './assets/icons/custom_to_marker.svg'})`
  markerElement.style.width = '55px'
  markerElement.style.height = '55px'
  markerElement.style.backgroundSize = 'cover'

  return new Marker({ element: markerElement }).setLngLat([coords[0], coords[1]]).setOffset([0, -27.5]).addTo(map)
}

const removeMarkerFromMap = (marker) => {
  if (marker) {
    marker.remove();
  }
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

const chooseLocationOnMap = ({
  map,
  isFromLocation,
  fromMarker,
  setFromMarker,
  toMarker,
  setToMarker,
  stopMarkerCentering,
  setDrawerToLocationActions,
  openDrawer,
}) => {
  const coords = map.getCenter().toArray()
  const marker = addMarkerToMap(map, coords, isFromLocation)

  if (isFromLocation) {
    removeMarkerFromMap(fromMarker)
    setFromMarker(marker)
  } else {
    removeMarkerFromMap(toMarker)
    setToMarker(marker)
  }

  if (stopMarkerCentering?.current) {
    stopMarkerCentering.current()
    removeMarkerFromMap(fromMarker)
    removeMarkerFromMap(toMarker)
  }
  if (stopMarkerCentering) {
    stopMarkerCentering.current = keepMarkerOnMapCentered(map, marker)
  } else {
    keepMarkerOnMapCentered(map, marker)
  }
  setDrawerToLocationActions()
  openDrawer()
}

const addRouteLayers = (map, routeId, layers) => {
  const sourceIds = {
    pathToHopOn: `${routeId}_path_to_hop_on_source`,
    commutePath: `${routeId}_commute_path_source`,
    startPoint: `${routeId}_start_point_source`,
    endPoint: `${routeId}_end_point_source`,
    hopOnPoint: `${routeId}_hop_on_point_source`,
    hopOffPoint: `${routeId}_hop_off_point_source`,
    inBetweenPoints: `${routeId}_in_between_points_source`,
    terminalPoint: `${routeId}_terminal_point_source`,
    publicRoute: `${routeId}_public_route_source`,
    pathToDropoff: `${routeId}_path_to_dropoff_source`,
  }

  const layerIds = {
    pathToHopOn: `${routeId}_path_to_hop_on`,
    commutePath: `${routeId}_commute_path`,
    startPoint: `${routeId}_start_point`,
    endPoint: `${routeId}_end_point`,
    hopOnPoint: `${routeId}_hop_on_point`,
    hopOffPoint: `${routeId}_hop_off_point`,
    inBetweenPoints: `${routeId}_in_between_points`,
    terminalPoint: `${routeId}_terminal_point`,
    publicRoute: `${routeId}_public_route`,
    pathToDropoff: `${routeId}_path_to_dropoff`,
  } 

  map.addSource(sourceIds.pathToHopOn, {
    type: 'geojson',
    data: layers.pathToHopOn,
  })

  map.addSource(sourceIds.startPoint, {
    type: 'geojson',
    data: layers.startPoint,
  })

  map.addSource(sourceIds.endPoint, {
    type: 'geojson',
    data: layers.endPoint,
  })

  map.addSource(sourceIds.commutePath, {
    type: 'geojson',
    data: layers.commutePath,
  })

  map.addSource(sourceIds.hopOnPoint, {
    type: 'geojson',
    data: layers.hopOnPoint,
  })

  map.addSource(sourceIds.hopOffPoint, {
    type: 'geojson',
    data: layers.hopOffPoint,
  })

  if (layers.inBetweenPoints) {
    map.addSource(sourceIds.inBetweenPoints, {
      type: 'geojson',
      data: layers.inBetweenPoints,
    })
  }

  map.addSource(sourceIds.terminalPoint, {
    type: 'geojson',
    data: layers.terminalPoint,
  })

  map.addSource(sourceIds.pathToDropoff, {
    type: 'geojson',
    data: layers.pathToDropoff,
  })

  map.addLayer({
    id: layerIds.pathToHopOn,
    type: 'line',
    source: sourceIds.pathToHopOn,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#0b38a8',
      'line-width': 4,
      'line-dasharray': [2, 4],
    },
  })

  map.addLayer({
    id: layerIds.pathToDropoff,
    type: 'line',
    source: sourceIds.pathToDropoff,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#0b38a8',
      'line-width': 4,
      'line-dasharray': [2, 4],
    },
  })

  map.addLayer({
    id: layerIds.commutePath,
    type: 'line',
    source: sourceIds.commutePath,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': [
        'coalesce',
        ['get', 'stroke'],
        layers.publicRoute.properties.stroke,
      ],
      'line-width': [
        'coalesce',
        ['get', 'strokeWidth'],
        layers.publicRoute.properties['stroke-width'],
      ],
      'line-opacity': [
        'coalesce',
        ['get', 'strokeOpacity'],
        layers.publicRoute.properties['stroke-opacity'],
      ],
    },
  })

  map.addLayer({
    id: layerIds.startPoint,
    type: 'circle',
    source: sourceIds.startPoint,
    paint: {
      'circle-color': '#ffffff',
      'circle-radius': 6,
      'circle-stroke-color': '#0b38a8',
      'circle-stroke-width': 4,
    }
  })

  map.addLayer({
    id: layerIds.endPoint,
    type: 'circle',
    source: sourceIds.endPoint,
    paint: {
      'circle-color': '#D50A0A',
      'circle-radius': 6,
      'circle-stroke-color': '#D50A0A',
      'circle-stroke-width': 4,
    }
  })

  map.addLayer({
    id: layerIds.hopOnPoint,
    type: 'circle',
    source: sourceIds.hopOnPoint,
    paint: {
      'circle-color': '#f59e0b',
      'circle-radius': 6,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 2,
    }
  })

  map.addLayer({
    id: layerIds.hopOffPoint,
    type: 'circle',
    source: sourceIds.hopOffPoint,
    paint: {
      'circle-color': '#f59e0b',
      'circle-radius': 6,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 2,
    }
  })

  if (layers.inBetweenPoints) {
    map.addLayer({
      id: layerIds.inBetweenPoints,
      type: 'circle',
      source: sourceIds.inBetweenPoints,
      paint: {
        'circle-color': '#f59e0b',
        'circle-radius': 6,
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 2,
      }
    })
  }

  map.addLayer({
    id: layerIds.terminalPoint,
    type: layers.terminalPoint.geometry.type === 'Polygon' ? 'fill' : 'circle',
    source: sourceIds.terminalPoint,
    paint: layers.terminalPoint.geometry.type === 'Polygon' ?{
      'fill-color': '#f59e0b',
      'fill-opacity': 0.5,
      'fill-outline-color': '#ffffff',
    } : {
      'circle-color': '#f59e0b',
      'circle-radius': 6,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 2,
    }
  })

  return {
    sourceIds,
    layerIds: Object.values(layerIds),
  }
}

const removeRouteLayers = (map, routePrefix) => {
  if (!map || !map.getStyle()) return
  const style = map.getStyle()
  const layerIds = (style.layers || [])
    .map((layer) => layer.id)
    .filter((id) => id.startsWith(`${routePrefix}-`))

  layerIds.forEach((layerId) => map.removeLayer(layerId))

  const sourceIds = Object.keys(style.sources || {})
    .filter((sourceId) => sourceId.startsWith(`${routePrefix}-`))

  sourceIds.forEach((sourceId) => {
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId)
    }
  })
}

const setRouteLayerVisibility = (map, layerIds, visible) => {
  layerIds.forEach((layerId) => {
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none')
    }
  })
}

export { 
  addMarkerToMap, 
  removeMarkerFromMap, 
  centerMarkerOnMap, 
  keepMarkerOnMapCentered,
  chooseLocationOnMap,
  addRouteLayers,
  removeRouteLayers,
  setRouteLayerVisibility,
}