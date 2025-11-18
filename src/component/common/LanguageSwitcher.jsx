import React from 'react'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

function LanguageSwitcher({ className = '' }) {
  const { locale, setLocale, t } = useI18n()
  const options = [
    { value: 'en', label: 'EN' },
    { value: 'fr', label: 'FR' },
    { value: 'zh', label: '中文' },
  ]
  return (
    <div className={className} aria-label={t('navbar.language')}>
      <select
        className="px-2 py-1 rounded-md border text-sm"
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