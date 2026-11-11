import html from '../html.js'

import BackButton from '../components/BackButton.js'

const Settings = ({
  drawerMode,
  hideSettings,
  isDrawerOpen,
  openDrawer,
  language,
  theme,
  onLanguageChange,
  onThemeChange,
}) => {
  const handleLanguageChange = (e) => {
    onLanguageChange(e.currentTarget.value)
    if (!isDrawerOpen) {
      openDrawer()
    }
  }

  const handleThemeChange = (e) => {
    onThemeChange(e.currentTarget.value)
    if (!isDrawerOpen) {
      openDrawer()
    }
  }

  return html`
    <section aria-hidden=${drawerMode !== 'settings' ? true : false} inert=${drawerMode !== 'settings' ? true : false} id="settings" class="z-3 absolute top-0 ${drawerMode !== 'settings' ? 'left-[100vw]' : 'left-0'} bg-(--bg-canvas) flex flex-col gap-3 w-full h-screen p-4 transition-all duration-300 ease-in-out">
      <h2 class="mt-15 text-2xl font-bold font-display">Settings</h2>
      <${BackButton} onClick=${hideSettings} label="Close settings" foregroundFill="#333942" />
      <form class="mt-4">
        <fieldset class="flex flex-row flex-wrap gap-2 mb-4">
          <legend class="text-lg font-semibold mb-2">Language</legend>
          <input class="w-0 h-0 visibility-hidden" type="radio" name="language" value="English" id="language-en" onChange=${handleLanguageChange} checked=${language === 'English'} />
          <label for="language-en" class="inline-block bg-white border-[3px] border-(--border-default) rounded-xl px-4 py-2 text-center font-bold">
            English
          </label>
          <input class="w-0 h-0 visibility-hidden" type="radio" name="language" value="Hiligaynon" id="language-hil" onChange=${handleLanguageChange} checked=${language === 'Hiligaynon'} />
          <label for="language-hil" class="inline-block bg-white border-[3px] border-(--border-default) rounded-xl px-4 py-2 text-center font-bold">
            Hiligaynon
          </label>
          <input class="w-0 h-0 visibility-hidden" type="radio" name="language" value="Tagalog" id="language-tgl" onChange=${handleLanguageChange} checked=${language === 'Tagalog'} />
          <label for="language-tgl" class="inline-block bg-white border-[3px] border-(--border-default) rounded-xl px-4 py-2 text-center font-bold">
            Tagalog
          </label>
        </fieldset>
        <fieldset class="flex flex-row flex-wrap gap-2 mb-4">
          <legend class="text-lg font-semibold mb-2">Theme</legend>
          <input class="w-0 h-0 visibility-hidden" type="radio" name="theme" value="light" id="theme-light" onChange=${handleThemeChange} checked=${theme === 'light'} />
          <label for="theme-light" class="inline-block bg-white border-[3px] border-(--border-default) rounded-xl px-4 py-2 text-center font-bold">
            Light
          </label>
          <input class="w-0 h-0 visibility-hidden" type="radio" name="theme" value="dark" id="theme-dark" onChange=${handleThemeChange} checked=${theme === 'dark'} />
          <label for="theme-dark" class="inline-block bg-white border-[3px] border-(--border-default) rounded-xl px-4 py-2 text-center font-bold">
            Dark
          </label>
        </fieldset>
      </form>
    </section>
  `
}

export default Settings