import html from '../html.js'
import { getTranslation } from '../i18n.js'

const Loading = ({ isLoading, language = 'English' }) => html`
  <div
    class="absolute ${isLoading ? 'top-0' : 'top-full'} left-0 z-10 flex w-full min-h-screen items-center justify-center bg-(--bg-canvas) p-8 transition-all duration-250 ease-in-out" aria-hidden="${isLoading ? 'false' : 'true'}" ${isLoading ? '' : 'inert'}>
    <div class="flex flex-col items-center gap-4 text-center">
      <img src="/assets/images/commute_leganes_logo_1x1_final.png" alt="" class="h-40 w-40" />
      <div
        aria-hidden="true"
        class="h-10 w-10 animate-spin rounded-full border-4 border-(--border-default) border-t-(--brand-primary)"
      ></div>
      <p class="font-display text-xl font-bold text-(--text-primary)">${getTranslation(language, 'loading')}</p>
      <p class="text-(--text-secondary)">${getTranslation(language, 'preparingMap')}</p>
    </div>
  </div>
`

export default Loading
