import React from 'react'
import Hero from '../component/home/Hero.jsx'
import ValuesSection from '../component/home/ValuesSection.jsx'
import ServicesPreview from '../component/home/ServicesPreview.jsx'
import ProcessSteps from '../component/home/ProcessSteps.jsx'
import Testimonials from '../component/home/Testimonials.jsx'
import Collaboration from '../component/home/Collaboration.jsx'
import CallToAction from '../component/home/CallToAction.jsx'
import { useI18n } from '../i18n/LocaleProvider.jsx'

function Home() {
  const { t } = useI18n()
  return (
    <>
      <Hero
        imageSrc="team.jpg"
        fit="cover"
        position="center 30%"
        title={t('home.subtitle')}
        highlight={t('home.highlight')}
        subtitle=""
        description={t('home.description')}
        primaryText={t('home.primary')}
        primaryHref="/services"
        secondaryText={t('home.secondary')}
        secondaryHref="/services/apply"
      />
      <ValuesSection title={t('home.valuesTitle')} subtitle={t('home.valuesSubtitle')} />
      <ServicesPreview limit={2} />
      <ProcessSteps
        title={t('home.processTitle')}
        subtitle={t('home.processSubtitle')}
        steps={[
          { title: t('home.processSteps.consultation.title'), description: t('home.processSteps.consultation.description') },
          { title: t('home.processSteps.execution.title'), description: t('home.processSteps.execution.description') },
          { title: t('home.processSteps.delivery.title'), description: t('home.processSteps.delivery.description') },
        ]}
      />
      <Testimonials title={t('home.testimonialsTitle')} subtitle={t('home.testimonialsSubtitle')} />
      <Collaboration />
      <CallToAction />
    </>
  )
}

export default Home