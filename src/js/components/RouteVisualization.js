import html from '../html.js'

import Walk from './icons/Walk.js'
import Tricycle from './icons/Tricycle.js'
import Jeepney from './icons/Jeepney.js'

const START_COLOR = '#0b38a8'
const END_COLOR = '#d7191c'
const HOP_COLOR = '#f59e0b'
const ICON_SIZE = 25

const getWeight = (path) => {
  const weight = path?.properties?.weight
  return Number.isFinite(weight) && weight >= 0 ? weight : 0
}

const getTransportIcon = (mode, color) => {
  if (mode === 'tricycle') {
    return html`<${Tricycle} width=${ICON_SIZE} height=${ICON_SIZE} backgroundFill=${color} />`
  }

  if (mode === 'jeepney') {
    return html`<${Jeepney} width=${ICON_SIZE} height=${ICON_SIZE} backgroundFill=${color} />`
  }

  return html`<${Walk} width=${ICON_SIZE} height=${ICON_SIZE} backgroundFill=${color} />`
}

const RouteVisualization = ({ route, selected }) => {
  const layers = route.layers
  if (!layers) return null

  const walkingToHopOn = getWeight(layers.pathToHopOn)
  const commute = getWeight(layers.commutePath)
  const walkingFromDropoff = getWeight(layers.pathToDropoff)
  const total = walkingToHopOn + commute + walkingFromDropoff || 1
  const track = { x: 12, y: 12, width: 350, height: 4 }
  const trackCenterY = track.y + track.height / 2
  const hopOnX = track.x + track.width * (walkingToHopOn / total)
  const hopOffX = track.x + track.width * ((walkingToHopOn + commute) / total)
  const commuteMode = route.mode
  const commuteColor = layers.publicRoute?.properties?.stroke || HOP_COLOR

  const segments = [
    {
      label: 'Walk',
      mode: 'walk',
      start: track.x,
      end: hopOnX,
      color: START_COLOR,
      dashed: true,
    },
    {
      label: commuteMode,
      mode: commuteMode,
      start: hopOnX,
      end: hopOffX,
      color: commuteColor,
      dashed: false,
    },
    {
      label: 'Walk',
      mode: 'walk',
      start: hopOffX,
      end: track.x + track.width,
      color: START_COLOR,
      dashed: true,
    },
  ]

  return html`
    <div class="relative mt-8 w-full max-w-[350px] h-[25px] ${!selected ? 'opacity-50' : ''}" aria-label="Route visualization">
      <div class="absolute inset-x-0 top-[-29px] h-[24px] text-xs text-(--text-secondary)">
        ${segments.map((segment) => html`
          <div
            class="absolute flex h-[25px] items-center gap-1 whitespace-nowrap"
            style=${`left: ${((segment.start + segment.end) / 2 / 360) * 100}%; transform: translateX(-50%)`}
          >
            <span class="flex h-[25px] w-[25px] shrink-0 items-center justify-center">
              ${getTransportIcon(segment.mode, segment.mode === commuteMode ? commuteColor : START_COLOR)}
            </span>
            <span class="capitalize">${segment.label}</span>
          </div>
        `)}
      </div>
      <svg class="absolute inset-x-0 top-0 w-full h-[25px] overflow-visible" viewBox="0 0 360 25" preserveAspectRatio="none" role="img" aria-label=${`${route.name} route`}>
        ${segments.map((segment) => html`
          <line
            x1=${segment.start}
            y1=${trackCenterY}
            x2=${segment.end}
            y2=${trackCenterY}
            stroke=${segment.color}
            stroke-width=${track.height}
            stroke-dasharray=${segment.dashed ? '12 3' : ''}
          />
        `)}
        <circle cx=${track.x} cy=${trackCenterY} r="8" fill="#ffffff" stroke=${START_COLOR} stroke-width="3" />
        <circle cx=${hopOnX} cy=${trackCenterY} r="6" fill=${HOP_COLOR} stroke="white" stroke-width="2" />
        <circle cx=${hopOffX} cy=${trackCenterY} r="6" fill=${HOP_COLOR} stroke="white" stroke-width="2" />
        <circle cx=${track.x + track.width} cy=${trackCenterY} r="8" fill=${END_COLOR} stroke=${END_COLOR} stroke-width="3" />
      </svg>
    </div>
  `
}

export default RouteVisualization
