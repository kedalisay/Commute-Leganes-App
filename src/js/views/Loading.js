import html from '../html.js'
import { getTranslation } from '../i18n.js'
import RouteLoading from '../components/RouteLoading.js'

const Loading = ({ isLoading, language = 'English' , theme = 'light'}) => html`
  <div
    class="absolute ${isLoading ? 'top-0' : 'top-full'} left-0 z-10 flex flex-col w-full min-h-screen items-center justify-center bg-(--bg-canvas) p-8 transition-all duration-250 ease-in-out"
    aria-hidden="${isLoading ? 'false' : 'true'}"
    ${isLoading ? '' : 'inert'}>
    <img src="assets/images/commute_leganes_full_logo_2000x1500${theme === 'dark' ? '_dark' : ''}.png" alt="" class="relative top-10 w-70" />
    <${RouteLoading}
      title=''
      subtitle=${getTranslation(language, 'preparingMap')}
    />
  </div>
`

export default Loading
