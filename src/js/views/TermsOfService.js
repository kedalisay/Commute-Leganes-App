import html from '../html.js'

import BackButton from '../components/BackButton.js'

const TermsOfService = ({ viewMode, setToSettingsView }) => html`
  <section aria-hidden=${viewMode !== 'terms-of-service' ? true : false} inert=${viewMode !== 'terms-of-service' ? true : false} class="z-3 absolute top-0 ${ viewMode !== 'terms-of-service' ? 'left-[100vw]' : 'left-0'} bg-(--bg-canvas) flex flex-col w-full h-full max-h-dvh overflow-y-auto p-4 transition-all duration-300 ease-in-out">
    <${BackButton} onClick=${setToSettingsView} label="Close terms of service" foregroundFill="#333942" />
    <div>
      <h2 class="mt-15 mb-4 text-2xl font-bold font-display">Terms of Service</h2>
      <p class="mb-2 text-(--text-secondary)"><strong>Effective Date:</strong> November 18, 2026</p>
      <p class="text-(--text-secondary)"><strong>Last Updated:</strong> November 18, 2026</p>
    </div>

    <div>
      <p class="mt-4">Welcome to <strong>Commute Leganes</strong>. By accessing or using this web application and website, you agree to the following terms:</p>

      <h3 class="mt-4 mb-2 text-lg font-bold font-display">1. Independent Civic Initiative</h3>
      <p>Commute Leganes is an independent, community-driven civic-technology project. It is <strong>not affiliated with, endorsed by, or officially connected to</strong> the Local Government Unit (LGU) of Leganes, the LTFRB, or any government agency or transport cooperative.</p>

      <h3 class="mt-4 mb-2 text-lg font-bold font-display">2. Informational Purpose & Route Accuracy</h3>
      <p>This platform provides public transit routes, estimated fares, and travel guidance strictly for general convenience. While we actively maintain and update route data as much as possible to minimize errors, actual fares, road closures, and vehicle availability may change without prior notice. Commute Leganes does not guarantee 100% accuracy and is not liable for delays, fare disputes, or missed trips.</p>

      <h3 class="mt-4 mb-2 text-lg font-bold font-display">3. User Feedback</h3>
      <p>Any route corrections, fare updates, or suggestions submitted through our feedback mechanism are voluntary. By submitting feedback, you grant us permission to use that information to improve the platform for the community.</p>
    </div>
  </section>
`

export default TermsOfService