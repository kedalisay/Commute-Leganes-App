import html from '../html.js'
import { getTranslation } from '../i18n.js'

const Loading = ({ language = 'English' }) => html`
  <section
    class="fixed inset-0 z-10 flex min-h-screen items-center justify-center bg-(--bg-canvas) p-8"
  >
    <div class="flex flex-col items-center gap-4 text-center">
      <div
        aria-hidden="true"
        class="h-10 w-10 animate-spin rounded-full border-4 border-(--border-default) border-t-(--brand-primary)"
      ></div>
      <h1 class="font-display text-xl font-bold text-(--text-primary)">${getTranslation(language, 'loading')}</h1>
      <p class="text-(--text-secondary)">${getTranslation(language, 'preparingMap')}</p>
    </div>
  </section>
`

export default Loading
