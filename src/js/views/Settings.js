import { useState } from 'https://esm.sh/preact/hooks'

import html from '../html.js'

import About from './About.js'
import TermsOfService from './TermsOfService.js'
import PrivacyPolicy from './PrivacyPolicy.js'
import ReportIssue from './ReportIssue.js'
import GiveFeedback from './GiveFeedback.js'
import ContactUs from './ContactUs.js'

import BackButton from '../components/BackButton.js'
import { getTranslation } from '../i18n.js'

const NavButton = ({ label, onClick, variant = 'primary', foregroundFill = 'var(--text-primary)'}) => {
  const buttonStyles = {
    primary: 'bg-(--brand-primary) text-(--text-on-brand)',
    secondary: 'bg-(--bg-surface) border-[3px] border-(--border-default) text-(--text-primary)',
  }

  return html`
    <button
      type='button'
      class="${buttonStyles[variant] || buttonStyles.primary} font-bold text-left rounded-xl py-2 px-4 mb-2 w-full flex flex-row justify-left items-center gap-2"
      onClick=${onClick}
    >
      <svg width="10.564" xmlns="http://www.w3.org/2000/svg" height="10" id="screenshot-042d8923-adcb-803b-8008-f5125e08463f" viewBox="-2179.38 -228 10.564 10" style="-webkit-print-color-adjust::exact" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1">
        <g id="shape-042d8923-adcb-803b-8008-f5125e08463f" style="fill:#000000" xml:space="preserve" rx="0" ry="0">
          <g id="shape-042d8923-adcb-803b-8008-f5125e084640" style="display:none">
            <g class="fills" id="fills-042d8923-adcb-803b-8008-f5125e084640">
              <rect rx="0" ry="0" x="-2179.3796992481202" y="-228" transform="matrix(-1.000000, 0.000000, 0.000000, -1.000000, -4348.195489, -446.000000)" width="10.56390977443607" height="10" style="enable-background:new 0 0 100 100; fill:none; fill-opacity:1">
              </rect>
            </g>
          </g>
          <g id="shape-042d8923-adcb-803b-8008-f5125e084641" style="fill:#000000" rx="0" ry="0">
            <g id="shape-042d8923-adcb-803b-8008-f5125e084642">
              <g class="fills" id="fills-042d8923-adcb-803b-8008-f5125e084642">
                <path d="M-2169.302001953125,-223.5541534423828L-2172.396728515625,-226.5128936767578C-2172.682373046875,-226.7855987548828,-2173.15771484375,-226.7855987548828,-2173.44287109375,-226.5128936767578C-2173.728271484375,-226.2403106689453,-2173.728271484375,-225.7858428955078,-2173.44287109375,-225.5131378173828L-2171.615478515625,-223.7560577392578L-2178.376220703125,-223.7560577392578C-2178.788330078125,-223.7560577392578,-2179.115966796875,-223.4430694580078,-2179.115966796875,-223.0491485595703C-2179.115966796875,-222.6553497314453,-2178.788330078125,-222.3423614501953,-2178.376220703125,-222.3423614501953L-2171.615478515625,-222.3423614501953L-2173.44287109375,-220.5952911376953C-2173.728271484375,-220.3225860595703,-2173.728271484375,-219.8682403564453,-2173.44287109375,-219.5955352783203C-2173.294921875,-219.4541778564453,-2173.104736328125,-219.3834991455078,-2172.914794921875,-219.3834991455078C-2172.724365234375,-219.3834991455078,-2172.533935546875,-219.4541778564453,-2172.386474609375,-219.5955352783203L-2169.302001953125,-222.5442657470703C-2169.164306640625,-222.6756134033203,-2169.079833984375,-222.8573760986328,-2169.079833984375,-223.0491485595703C-2169.079833984375,-223.2410430908203,-2169.15380859375,-223.4228057861328,-2169.302001953125,-223.5541534423828Z" style="fill:${foregroundFill};fill-opacity:1">
                </path>
              </g>
            </g>
          </g>
        </g>
      </svg>
    ${label}
    </button>
  `
}

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
  const t = (key) => getTranslation(language, key)
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

  const [viewMode, setViewMode] = useState('settings')
  const setToAboutView = () => setViewMode('about')
  const setToSettingsView = () => setViewMode('settings')
  const setToTermsOfServiceView = () => setViewMode('terms-of-service')
  const setToPrivacyPolicyView = () => setViewMode('privacy-policy')
  const setToReportIssueView = () => setViewMode('report-issue')
  const setToGiveFeedbackView = () => setViewMode('give-feedback')
  const setToContactUsView = () => setViewMode('contact-us')

  return html`
    <section aria-hidden=${drawerMode !== 'settings' || viewMode !== 'settings' ? true : false} inert=${drawerMode !== 'settings' || viewMode !== 'settings' ? true : false} id="settings" class="z-3 absolute top-0 ${drawerMode !== 'settings' ? 'left-[100vw]' : 'left-0'} bg-(--bg-canvas) flex flex-col w-full h-full max-h-dvh overflow-y-auto p-4 transition-all duration-300 ease-in-out">
      <h2 class="mt-15 mb-4 text-2xl font-bold font-display">${t('settings')}</h2>
      <${BackButton} onClick=${hideSettings} label=${t('closeSettings')} />
      <form class="mt-4">
        <fieldset class="flex flex-row flex-wrap gap-2 mb-4">
          <legend class="text-lg font-semibold mb-2">${t('language')}</legend>
          <input class="w-0 h-0 visibility-hidden" type="radio" name="language" value="English" id="language-en" onChange=${handleLanguageChange} checked=${language === 'English'} />
          <label for="language-en" class="inline-block bg-(--bg-surface) text-(--text-primary) border-[3px] border-(--border-default) rounded-xl px-4 py-2 text-center font-bold">
            English
          </label>
          <input class="w-0 h-0 visibility-hidden" type="radio" name="language" value="Hiligaynon" id="language-hil" onChange=${handleLanguageChange} checked=${language === 'Hiligaynon'} />
          <label for="language-hil" class="inline-block bg-(--bg-surface) text-(--text-primary) border-[3px] border-(--border-default) rounded-xl px-4 py-2 text-center font-bold">
            Hiligaynon
          </label>
          <input class="w-0 h-0 visibility-hidden" type="radio" name="language" value="Tagalog" id="language-tgl" onChange=${handleLanguageChange} checked=${language === 'Tagalog'} />
          <label for="language-tgl" class="inline-block bg-(--bg-surface) text-(--text-primary) border-[3px] border-(--border-default) rounded-xl px-4 py-2 text-center font-bold">
            Tagalog
          </label>
        </fieldset>
        <fieldset class="flex flex-row flex-wrap gap-2 mb-4">
          <legend class="text-lg font-semibold mb-2">${t('theme')}</legend>
          <input class="w-0 h-0 visibility-hidden" type="radio" name="theme" value="light" id="theme-light" onChange=${handleThemeChange} checked=${theme === 'light'} />
          <label for="theme-light" class="inline-block bg-(--bg-surface) text-(--text-primary) border-[3px] border-(--border-default) rounded-xl px-4 py-2 text-center font-bold">
            ${t('light')}
          </label>
          <input class="w-0 h-0 visibility-hidden" type="radio" name="theme" value="dark" id="theme-dark" onChange=${handleThemeChange} checked=${theme === 'dark'} />
          <label for="theme-dark" class="inline-block bg-(--bg-surface) text-(--text-primary) border-[3px] border-(--border-default) rounded-xl px-4 py-2 text-center font-bold">
            ${t('dark')}
          </label>
        </fieldset>
      </form>
      <section class="mb-2">
        <h3 class="text-lg font-semibold mb-2">${t('information')}</h3>
        <${NavButton} label=${t('about')} onClick=${setToAboutView} variant="secondary" />
        <${NavButton} label=${t('termsOfService')} onClick=${setToTermsOfServiceView} variant="secondary" />
        <${NavButton} label=${t('privacyPolicy')} onClick=${setToPrivacyPolicyView} variant="secondary" />
      </section>
      <section class="mb-8">
        <h3 class="text-lg font-semibold mb-2">${t('support')}</h3>
        <${NavButton} label=${t('reportIssue')} onClick=${setToReportIssueView} variant="secondary" />
        <${NavButton} label=${t('giveFeedback')} onClick=${setToGiveFeedbackView} variant="secondary" />
        <${NavButton} label=${t('contactUs')} onClick=${setToContactUsView} variant="secondary" />
      </section>
      <div class="mt-auto flex flex-col gap-1 text-center text-xs text-(--text-secondary)">
        <small>Commute Leganes Version 0.1.0-beta</small>
        <small>Copyright © 2026. All rights reserved.</small>
      </div>
    </section>
    <${About} viewMode=${viewMode} setToSettingsView=${setToSettingsView} theme=${theme} />
    <${TermsOfService} viewMode=${viewMode} setToSettingsView=${setToSettingsView} />
    <${PrivacyPolicy} viewMode=${viewMode} setToSettingsView=${setToSettingsView} />
    <${ReportIssue} viewMode=${viewMode} setToSettingsView=${setToSettingsView} />
    <${GiveFeedback} viewMode=${viewMode} setToSettingsView=${setToSettingsView} />
    <${ContactUs} viewMode=${viewMode} setToSettingsView=${setToSettingsView} />
  `
}

export default Settings