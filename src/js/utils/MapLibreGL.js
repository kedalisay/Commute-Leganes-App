const addMarkerToMap = (map, coords, isFromLocationFocused) => {
  map.addLayer({
    id: 'custom-marker-layer' + (isFromLocationFocused ? '-from' : '-to'),
    type: 'symbol',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [coords['longitude'], coords['latitude']],
            },
          },
        ],
      },
    },
    layout: {
      'icon-image': isFromLocationFocused ? 'custom-from-marker' : 'custom-to-marker',
      'icon-size': 0.5,
      'icon-allow-overlap': true,
    },
  });
}

const removeMarkerFromMap = (map, isFromLocationFocused) => {
  const layerId = 'custom-marker-layer' + (isFromLocationFocused ? '-from' : '-to');
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId);
  }
  if (map.getSource(layerId)) {
    map.removeSource(layerId);
  }
}

export { addMarkerToMap, removeMarkerFromMap }