import html from '../html.js'

import BackButton from '../components/BackButton.js'

const ReportIssue = ({ viewMode, setToSettingsView }) => html`
  <section aria-hidden=${viewMode !== 'report-issue' ? true : false} inert=${viewMode !== 'report-issue' ? true : false} class="z-3 absolute top-0 ${ viewMode !== 'report-issue' ? 'left-[100vw]' : 'left-0'} bg-(--bg-canvas) flex flex-col w-full min-h-screen h-fit p-4 transition-all duration-300 ease-in-out">
  <${BackButton} onClick=${setToSettingsView} label="Close report issue form" foregroundFill="#333942" />  
  <h2 class="mt-15 mb-4 text-2xl font-bold font-display">Report Issue</h2>
    <iframe data-tally-src="https://tally.so/embed/BEpGYe?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" loading="lazy" width="100%" height="100" frameborder="0" marginheight="0" marginwidth="0" title="Report Issue"></iframe>
    <script>var d=document,w="https://tally.so/widgets/embed.js",v=function(){"undefined"!=typeof Tally?Tally.loadEmbeds():d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((function(e){e.src=e.dataset.tallySrc}))};if("undefined"!=typeof Tally)v();else if(d.querySelector('script[src="'+w+'"]')==null){var s=d.createElement("script");s.src=w,s.onload=v,s.onerror=v,d.body.appendChild(s);}</script>
  </section>
`

export default ReportIssue
