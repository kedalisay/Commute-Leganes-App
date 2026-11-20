import html from '../html.js'

import BackButton from '../components/BackButton.js'

const GiveFeedback = ({ viewMode, setToSettingsView }) => html`
  <section aria-hidden=${viewMode !== 'give-feedback' ? true : false} inert=${viewMode !== 'give-feedback' ? true : false} class="z-3 absolute top-0 ${ viewMode !== 'give-feedback' ? 'left-[100vw]' : 'left-0'} bg-(--bg-canvas) flex flex-col w-full h-full max-h-dvh overflow-y-auto p-4 transition-all duration-300 ease-in-out">
  <${BackButton} onClick=${setToSettingsView} label="Close feedback form" />  
  <h2 class="mt-15 mb-4 text-2xl font-bold font-display">Give Feedback</h2>
    <iframe src="https://tally.so/embed/q5Gb8g?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" loading="lazy" width="100%" height="345" frameborder="0" marginheight="0" marginwidth="0" title="Give Feedback"></iframe>
  </section>
`

export default GiveFeedback
