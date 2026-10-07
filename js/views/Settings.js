import html from '../html.js'

const Settings = ({
  isVisible,
  hideSettings,
  hideDrawerBackground,
  hideDrawerHandle,
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
      hideDrawerBackground()
      hideDrawerHandle()
      openDrawer()
    }
  }

  const handleThemeChange = (e) => {
    onThemeChange(e.currentTarget.value)
    if (!isDrawerOpen) {
      hideDrawerBackground()
      hideDrawerHandle()
      openDrawer()
    }
  }

  return html`
    <div class="absolute top-0 ${isVisible ? 'left-0' : 'left-full'} bg-(--bg-canvas) flex flex-col gap-3 w-full h-screen p-4 transition-all duration-300 ease-in-out">
      <h2 class="text-2xl font-bold font-display">Settings</h2>
      <button class="absolute top-4 right-4 rounded-md p-2 w-[40px] h-[40px]" onClick=${hideSettings}>
        <svg width="40" xmlns="http://www.w3.org/2000/svg" height="40" id="screenshot-18d99545-70d7-8033-8008-b7a66cfdf76d" viewBox="-1940 -568 40 40" style="-webkit-print-color-adjust::exact" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1">
          <g id="shape-18d99545-70d7-8033-8008-b7a66cfdf76d" style="fill:#000000" rx="0" ry="0">
            <g id="shape-18d99545-70d7-8033-8008-b7a66d04b44f" style="display:none">
              <g class="fills" id="fills-18d99545-70d7-8033-8008-b7a66d04b44f">
                <rect rx="0" ry="0" x="-1948" y="-576" transform="matrix(1.000000, 0.000000, 0.000000, 1.000000, 0.000000, 0.000000)" width="40" height="40" fill-rule="evenodd" clip-rule="evenodd" fill="none" stroke-linejoin="round" stroke-miterlimit="2" style="fill:#333942;fill-opacity:1">
                </rect>
              </g>
            </g>
            <g id="shape-18d99545-70d7-8033-8008-b7a66d066eb5">
              <g class="fills" id="fills-18d99545-70d7-8033-8008-b7a66d066eb5">
                <path d="M-1928,-557.7833862304688L-1918.4683837890625,-567.3167114257812C-1918.2249755859375,-567.56005859375,-1917.9029541015625,-567.6817016601562,-1917.5833740234375,-567.6817016601562C-1916.9097900390625,-567.6817016601562,-1916.3333740234375,-567.1416625976562,-1916.3333740234375,-566.433349609375C-1916.3333740234375,-566.1116333007812,-1916.455078125,-565.7916870117188,-1916.6982421875,-565.5466918945312L-1926.2318115234375,-556.0150756835938L-1916.6998291015625,-546.4833984375C-1916.455078125,-546.2383422851562,-1916.3333740234375,-545.9182739257812,-1916.3333740234375,-545.598388671875C-1916.3333740234375,-544.88671875,-1916.9154052734375,-544.348388671875,-1917.5833740234375,-544.348388671875C-1917.9029541015625,-544.348388671875,-1918.2249755859375,-544.4700317382812,-1918.4683837890625,-544.71337890625L-1928,-554.2450561523438L-1937.5316162109375,-544.71337890625C-1937.7750244140625,-544.4700317382812,-1938.0970458984375,-544.348388671875,-1938.4166259765625,-544.348388671875C-1939.0845947265625,-544.348388671875,-1939.6666259765625,-544.88671875,-1939.6666259765625,-545.598388671875C-1939.6666259765625,-545.9182739257812,-1939.544921875,-546.2383422851562,-1939.3001708984375,-546.4833984375L-1929.7681884765625,-556.0150756835938L-1939.3017578125,-565.5466918945312C-1939.544921875,-565.7916870117188,-1939.6666259765625,-566.1116333007812,-1939.6666259765625,-566.433349609375C-1939.6666259765625,-567.1416625976562,-1939.0902099609375,-567.6817016601562,-1938.4166259765625,-567.6817016601562C-1938.0970458984375,-567.6817016601562,-1937.7750244140625,-567.56005859375,-1937.5316162109375,-567.3167114257812Z" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" style="fill:#333942;fill-opacity:1">
                </path>
              </g>
            </g>
          </g>
        </svg>
      </button>
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
    </div>
  `
}

const SettingsButtons = ({ onSave, onCancel }) => {
  return html`
    <div class="flex flex-row justify-center align-middle gap-5">
      <button class="bg-(--brand-primary) text-(--text-on-brand) font-bold rounded-xl p-2 w-full max-w-[200px]" onClick=${onSave}>Save</button>
      <button class="bg-white border-[3px] border-(--border-default) text-(--text-primary) font-bold rounded-xl p-2 w-full max-w-[200px]" onClick=${onCancel}>Cancel</button>
    </div>
  `
}

export { SettingsButtons }
export default Settings