import html from '../html.js'

const Loading = () => html`
  <section
    class="fixed inset-0 z-10 flex min-h-screen items-center justify-center bg-(--bg-canvas) p-8"
  >
    <div class="flex flex-col items-center gap-4 text-center">
      <div
        aria-hidden="true"
        class="h-10 w-10 animate-spin rounded-full border-4 border-(--border-default) border-t-(--brand-primary)"
      ></div>
      <h1 class="font-display text-xl font-bold text-(--text-primary)">Loading Commute Leganes...</h1>
      <p class="text-(--text-secondary)">Preparing the map and routes.</p>
    </div>
  </section>
`

export default Loading
