import html from '../html.js'

import BackButton from '../components/BackButton.js'

const ReportIssue = ({ viewMode, setToSettingsView }) => html`
  <section aria-hidden=${viewMode !== 'report-issue' ? true : false} inert=${viewMode !== 'report-issue' ? true : false} class="z-3 absolute top-0 ${ viewMode !== 'report-issue' ? 'left-[100vw]' : 'left-0'} bg-(--bg-canvas) flex flex-col w-full h-full max-h-dvh overflow-y-auto p-4 transition-all duration-300 ease-in-out">
  <${BackButton} onClick=${setToSettingsView} label="Close report issue form" />  
  <h2 class="mt-15 mb-4 text-2xl font-bold font-display">Report Issue</h2>
    <iframe src="https://tally.so/embed/BEpGYe?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" loading="lazy" width="100%" height="437" frameborder="0" marginheight="0" marginwidth="0" title="Report Issue"></iframe>
  </section>
`

export default ReportIssue
