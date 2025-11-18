import React from 'react'
import TranslationOverview from '../../component/services/translation/TranslationOverview.jsx'
import TranslationDetails from '../../component/services/translation/TranslationDetails.jsx'
import FAQ from '../../component/services/faq/FAQ.jsx'
import useTranslation from '../../hooks/service/useTranslation.js'
import ServiceHero from '../../component/services/common/ServiceHero.jsx'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

function TranslationPage() {
  const { faq, details } = useTranslation()
  const { t } = useI18n()

  return (
    <>
      <ServiceHero
        eyebrow={t('navbar.translation')}
        title={details?.title || 'Translation & Interpretation'}
        subtitle={details?.intro || ''}
        actions={[{ label: t('services.actionsContact'), href: '/contact' }, { label: t('services.faq'), href: '#faq', variant: 'secondary' }]}
      />
      <TranslationOverview />
      <TranslationDetails />
      <div id="faq" className="mt-10 container mx-auto px-4">
        <FAQ items={faq} />
      </div>
    </>
  )
}

export default TranslationPage