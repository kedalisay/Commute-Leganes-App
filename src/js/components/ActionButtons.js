import html from '../html.js'

const buttonStyles = {
  primary: 'bg-(--brand-primary) text-(--text-on-brand)',
  secondary: 'bg-white border-[3px] border-(--border-default) text-(--text-primary)',
}

const ActionButtons = ({ buttons, direction = 'row' }) => {
  const layoutClass = direction === 'column' ? 'flex-col' : 'flex-row'

  return html`
    <div class="flex ${layoutClass} justify-center align-middle gap-5">
      ${buttons.map(({ label, onClick, ariaLabel = '', variant = 'primary', type = 'button' }) => html`
        <button
          type=${type}
          ${ariaLabel ? `aria-label="${ariaLabel}"` : ''}
          class="${buttonStyles[variant] || buttonStyles.primary} font-bold rounded-xl p-2 w-full max-w-[200px]"
          onClick=${onClick}
        >
          ${label}
        </button>
      `)}
    </div>
  `
}

export default ActionButtons
