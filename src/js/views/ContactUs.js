import html from '../html.js'

import BackButton from '../components/BackButton.js'

const ContactUs = ({ viewMode, setToSettingsView }) => html`
  <section aria-hidden=${viewMode !== 'contact-us' ? true : false} inert=${viewMode !== 'contact-us' ? true : false} class="z-3 absolute top-0 ${ viewMode !== 'contact-us' ? 'left-[100vw]' : 'left-0'} bg-(--bg-canvas) flex flex-col w-full h-full max-h-dvh overflow-y-auto p-4 transition-all duration-300 ease-in-out">
    <${BackButton} onClick=${setToSettingsView} label="Close contact us" />
    <div>
      <h2 class="mt-15 text-2xl font-bold font-display">Contact Us</h2>
      <p class="mt-2 text-(--text-secondary)">
        Have questions or feedback? We'd love to hear from you!
      </p>
    </div>

    <div class="flex flex-col gap-3">
      <h3 class="mt-4 text-lg font-bold font-display">Email</h3>
      <p class="text-(--text-primary)">
        You can reach us at <a href="mailto:betterleganes@gmail.com" class="text-(--color-blue-700) underline">betterleganes@gmail.com</a>.
      </p>
    </div>

    <div class="flex flex-col gap-3">
      <h3 class="mt-4 text-lg font-bold font-display">Social Media</h3>
      <p class="text-(--text-primary)">
        Follow us on social media for updates and announcements:
      </p>
      <ul class="list-disc space-y-2 pl-5 text-(--text-primary)">
        <li><a href="https://www.facebook.com/BetterLeganes" target="_blank" rel="noopener noreferrer" class="text-(--color-blue-700) underline">Facebook</a></li>
      </ul>
    </div>
  </section>
`

export default ContactUs
