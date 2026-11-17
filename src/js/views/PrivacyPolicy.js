import html from '../html.js'

import BackButton from '../components/BackButton.js'

const PrivacyPolicy = ({ viewMode, setToSettingsView }) => html`
  <section aria-hidden=${viewMode !== 'privacy-policy' ? true : false} inert=${viewMode !== 'privacy-policy' ? true : false} class="z-3 absolute top-0 ${ viewMode !== 'privacy-policy' ? 'left-[100vw]' : 'left-0'} bg-(--bg-canvas) flex flex-col w-full h-screen p-4 transition-all duration-300 ease-in-out">
    <${BackButton} onClick=${setToSettingsView} label="Close privacy policy" foregroundFill="#333942" />
    <div>
      <h2 class="mt-15 mb-4 text-2xl font-bold font-display">Privacy Policy</h2>
      <p class="mb-2 text-(--text-secondary)"><strong>Effective Date:</strong> November 18, 2026</p>
      <p class="text-(--text-secondary)"><strong>Last Updated:</strong> November 18, 2026</p>
    </div>

    <div>
      <p class="mt-4">Your privacy matters. <strong>Commute Leganes</strong> is built to provide transit guidance without collecting or storing personal profiles.</p>
      <h3 class="mt-4 mb-2 text-lg font-bold font-display">1. No Personal Data Storage</h3>
      <p>We do not use a backend database to store personal user accounts, names, or location histories. Preferences such as your chosen language (English, Hiligaynon, or Tagalog) and display theme (Light or Dark mode) are saved locally on your own device's browser storage.</p>

      <h3 class="mt-4 mb-2 text-lg font-bold font-display">2. Web Analytics & Interaction Tracking</h3>
      <p>To understand app usage and improve navigation workflows, we use privacy-friendly web analytics to track anonymous interaction events such as page views, button clicks, and origin/destination search patterns. This data is aggregated and cannot be used to identify you personally.</p>

      <h3 class="mt-4 text-lg font-bold font-display">3. Feedback Submissions</h3>
      <p>If you choose to submit a route correction or bug report via our feedback feature, we only receive the message details you explicitly provide so we can review and update our transit data.</p>
    </div>
  </section>
`

export default PrivacyPolicy
