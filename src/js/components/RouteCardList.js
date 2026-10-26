import html from '../html.js'

import RouteCard from './RouteCard.js'
import PublicRouteCard from './PublicRouteCard.js'

const RouteCardList = ({ map, routes }) => {
  const focusRoute = (route) => {
    const features = map.getSource('public-routes')._data.geojson.features.sort((a, b) => a.properties['route-name'].localeCompare(b.properties['route-name'])).filter((feature) => feature.properties['public'] === true)

    const allRoutesShown = features.every((feature) => map.getLayoutProperty(`public-route-${feature.properties['route-name']}`, 'visibility') === 'visible')
    if (allRoutesShown) {
      features.forEach((feature) => {
        map.setLayoutProperty(`public-route-${feature.properties['route-name']}`, 'visibility', 'none')
      })
      map.setLayoutProperty(`public-route-${route.name}`, 'visibility', 'visible')
    } else {
        if (map.getLayoutProperty(`public-route-${route.name}`, 'visibility') === 'visible') {
       map.setLayoutProperty(`public-route-${route.name}`, 'visibility', 'none');
      } else {
       map.setLayoutProperty(`public-route-${route.name}`, 'visibility', 'visible');
      }
    }
  }

  return html`
    <section aria-labelledby="routes-heading" class="pb-8 overflow-y-auto max-h-full">
      <h2 id="routes-heading" class="sr-only">Choose a route</h2>
      <form id="routes-form">
        <fieldset class="flex flex-col gap-3 w-full">
        ${routes.map((route) => html`<${route.public ? PublicRouteCard : RouteCard} route=${route} onClick=${() => route.public ? focusRoute(route) : () => {}} />`)}
        </fieldset>
      </form>
    </section>
  `
}

export default RouteCardList