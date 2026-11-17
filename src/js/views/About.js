import html from '../html.js'

import BackButton from '../components/BackButton.js'

const About = ({ viewMode, setToSettingsView }) => html`
  <section aria-hidden=${viewMode !== 'about' ? true : false} inert=${viewMode !== 'about' ? true : false} class="z-3 absolute top-0 ${ viewMode !== 'about' ? 'left-[100vw]' : 'left-0'} bg-(--bg-canvas) flex flex-col w-full h-screen p-4 transition-all duration-300 ease-in-out">
    <${BackButton} onClick=${setToSettingsView} label="Close about" foregroundFill="#333942" />
    <div>
      <h2 class="mt-15 text-2xl font-bold font-display">About Commute Leganes</h2>
      <p class="mt-2 text-(--text-secondary)">
        A community-focused commute guide for getting around Leganes, Iloilo.
      </p>
    </div>

    <div class="flex flex-col gap-3">
      <h3 class="mt-4 text-lg font-bold font-display">What you can do</h3>
      <ul class="list-disc space-y-2 pl-5 text-(--text-primary)">
        <li>Choose starting and destination locations.</li>
        <li>Compare walking and public-transport route options.</li>
        <li>View known public routes and their route points.</li>
      </ul>
    </div>

    <p class="mt-4 text-sm text-(--text-secondary)">
      Route information may change. Please verify fares, terminals, and availability with local operators.
    </p>
  </section>
`

export default About
