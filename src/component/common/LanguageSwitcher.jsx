import React from 'react'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

function LanguageSwitcher({ className = '', variant = 'select' }) {
  const { locale, setLocale, t } = useI18n()
  const options = [
    { value: 'en', label: 'EN' },
    { value: 'fr', label: 'FR' },
    { value: 'zh', label: '中文' },
  ]

  if (variant === 'buttons') {
    return (
      <div className={`flex items-center gap-2 ${className}`} aria-label={t('navbar.language')}>
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => setLocale(o.value)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${locale === o.value
                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                : 'text-gray-600 hover:bg-gray-100 border border-transparent'
              }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={className} aria-label={t('navbar.language')}>
      <select
        className="px-2 py-1 rounded-md border border-gray-300 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSwitcher