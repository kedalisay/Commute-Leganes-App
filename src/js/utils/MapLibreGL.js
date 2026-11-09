import { Marker } from 'maplibre-gl';

const addMarkerToMap = (map, coords, isFromLocationFocused) => {
  const markerElement = document.createElement('div')
  markerElement.classList.add('marker')
  markerElement.style.backgroundImage = `url(${isFromLocationFocused ? './assets/icons/custom_from_marker.png' : './assets/icons/custom_to_marker.png'})`
  markerElement.style.width = '55px'
  markerElement.style.height = '55px'

  return new Marker({ element: markerElement }).setLngLat([coords[0], coords[1]]).setOffset([0, -27.5]).addTo(map)
}

const removeMarkerFromMap = (marker) => {
  marker.remove();
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

const addRouteLayers = (map, routeId, layers) => {
  const sourceIds = {
    pathToHopOn: `${routeId}_path_to_hop_on_source`,
    hopOnPoint: `${routeId}_hop_on_point_source`,
    publicRoute: `${routeId}_public_route_source`,
    pathToDropoff: `${routeId}_path_to_dropoff_source`,
  }

  const layerIds = {
    pathToHopOn: `${routeId}_path_to_hop_on`,
    hopOnPoint: `${routeId}_hop_on_point`,
    publicRoute: `${routeId}_public_route`,
    pathToDropoff: `${routeId}_path_to_dropoff`,
  } 

  map.addSource(sourceIds.pathToHopOn, {
    type: 'geojson',
    data: layers.pathToHopOn,
  })

  map.addSource(sourceIds.publicRoute, {
    type: 'geojson',
    data: layers.publicRoute,
  })

  map.addSource(sourceIds.hopOnPoint, {
    type: 'geojson',
    data: layers.hopOnPoint,
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
    id: layerIds.hopOnPoint,
    type: 'fill',
    source: sourceIds.hopOnPoint,
    paint: {
      'fill-color': '#0b37a844',
      'fill-outline-color': '#0b38a8',
      'fill-antialias': true,
    }
  })

  map.addLayer({
    id: layerIds.publicRoute,
    type: 'line',
    source: sourceIds.publicRoute,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': layers.publicRoute.properties.stroke,
      'line-width': 4,
      'line-opacity': 0.5,
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
  addRouteLayers,
  removeRouteLayers,
  setRouteLayerVisibility,
}