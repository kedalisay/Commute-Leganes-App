import html from '../html.js'

const RouteLoading = ({ title, subtitle }) => html`
  <div class="flex h-full min-h-[215px] flex-col items-center justify-center gap-4 px-6 text-center" role="status" aria-live="polite">
    ${title ? html`<p class="font-display text-xl font-bold leading-tight text-(--text-primary)">${title}</p>` : null}
    ${subtitle ? html`<p class="text-sm text-(--text-secondary)">${subtitle}</p>` : null}
    <div class="route-loading-dots" aria-hidden="true">
      ${[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => html`
        <span style="--angle:${angle}deg;--opacity:${1 - index * 0.09}"></span>
      `)}
    </div>
  </div>
`

export default RouteLoading
