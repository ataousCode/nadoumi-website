import React, { useState } from 'react'
import ServiceLayout from '../common/ServiceLayout.jsx'
import ServiceHeader from '../common/ServiceHeader.jsx'
import ServiceHero from '../common/ServiceHero.jsx'
import ServiceCard from '../common/ServiceCard.jsx'
import ServiceCTA from '../common/ServiceCTA.jsx'
import Modal from '../common/Modal.jsx'
import useTranslation from '../../../hooks/service/useTranslation.js'
import { useI18n } from '../../../i18n/LocaleProvider.jsx'

export default function TranslationOverview() {
  const { details, features } = useTranslation()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(null)
  const { t } = useI18n()

  return (
    <ServiceLayout>
      <ServiceHero
        title={details.title}
        subtitle={details.intro}
        imageSrc="translation.jpg"
        fit="cover"
        position="center 40%"
      />

      <ServiceHeader
        title={t('translation.offerTitle')}
        subtitle={t('translation.offerSubtitle')}
      />

      {/* spacing below header */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((f) => (
          <ServiceCard
            key={f.title}
            title={f.title}
            shortDescription={f.shortDescription}
            ctaText={t('common.learnMore')}
            onClick={() => { setActive(f); setOpen(true) }}
          />
        ))}
      </div>

      {/* spacing between offer grid and CTA */}
      <div className="mt-10">
        <ServiceCTA
          heading={details.cta.heading}
          text={details.cta.text}
          buttonText={details.cta.button}
          onClick={() => (window.location.href = '/contact')}
        />
      </div>

      {/* <FAQ items={faq} /> */}

      <Modal open={open} onClose={() => setOpen(false)} title={active?.title}>
        <p>{active?.detail}</p>
      </Modal>
    </ServiceLayout>
  )
}