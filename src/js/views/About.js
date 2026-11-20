import html from '../html.js'

import BackButton from '../components/BackButton.js'

const About = ({ viewMode, setToSettingsView, theme }) => html`
  <section aria-hidden=${viewMode !== 'about' ? true : false} inert=${viewMode !== 'about' ? true : false} class="z-3 absolute top-0 ${ viewMode !== 'about' ? 'left-[100vw]' : 'left-0'} bg-(--bg-canvas) flex flex-col w-full h-full max-h-dvh overflow-y-auto p-4 transition-all duration-300 ease-in-out">
    <${BackButton} onClick=${setToSettingsView} label="Close about" />
    <div>
      <h2 class="mt-15 text-2xl font-bold font-display">About Commute Leganes</h2>
      <img src="/assets/images/commute_leganes_full_logo_2788x900${theme === 'dark' ? '_dark' : ''}.png" alt="" class="my-4 w-80" />
      <p class="mt-2 text-(--text-secondary)">
        A community-focused commute guide for getting around Leganes, Iloilo.
      </p>
    </div>

    <div class="flex flex-col gap-3">
      <h3 class="mt-4 text-lg font-bold font-display">What you can do</h3>
      <ul class="list-disc space-y-2 pl-5 text-(--text-primary)">
        <li>
          Choose starting and destination locations.
          <ul class="list-disc space-y-2 pl-5 text-(--text-primary)">
            <li>Preselect a location from the list of available options.</li>
            <li>Manually enter a location if it's not in the list.</li>
            <li>Choose a location from the map.</li>
          </ul>
        </li>
        <li>Compare walking and public-transport route options.
          <ul class="list-disc space-y-2 pl-5 text-(--text-primary)">
            <li>Route options are displayed for each mode of transport.</li>
            <li>Each are sorted by the shortest time and distance.</li>
          </ul>
        </li>
        <li>View known public routes and their route points.
          <ul class="list-disc space-y-2 pl-5 text-(--text-primary)">
            <li>Tricycle colors represent different routes per barangay and are the most common way to travel in the area.</li>
            <li>Jeepney routes either come from the province or from Iloilo City.</li>
          </ul>
        </li>
      </ul>
    </div>

    <p class="mt-4 text-sm text-(--text-secondary)">
      Route information may change. Please verify fares, terminals, and availability with local operators.
    </p>
  </section>
`

export default About
