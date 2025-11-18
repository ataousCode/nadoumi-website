import React from 'react'
import Button from '../common/Button.jsx'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

function CallToAction({
  title,
  subtitle,
  primaryText,
  primaryHref = '/contact',
  secondaryText,
  secondaryHref = '/contact',
  className = '',
}) {
  const { t } = useI18n()
  const go = (href) => (window.location.href = href)
  const resolvedTitle = title || t('home.ctaTitle')
  const resolvedSubtitle = subtitle || t('home.ctaSubtitle')
  const resolvedPrimaryText = primaryText || t('home.ctaPrimary')
  const resolvedSecondaryText = secondaryText || t('home.ctaSecondary')

  return (
    <section className={`bg-orange-50 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{resolvedTitle}</h2>
        {resolvedSubtitle && <p className="mt-2 text-gray-700">{resolvedSubtitle}</p>}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button variant="primary" size="md" ariaLabel={resolvedPrimaryText} onClick={() => go(primaryHref)}>
            {resolvedPrimaryText}
          </Button>
          <Button variant="secondary" size="md" ariaLabel={resolvedSecondaryText} onClick={() => go(secondaryHref)}>
            {resolvedSecondaryText}
          </Button>
        </div>
      </div>
    </section>
  )
}

export default CallToAction