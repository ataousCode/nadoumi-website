import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../component/common/Card.jsx'
import Link from '../../component/common/Link.jsx'
import ServiceLayout from '../../component/services/common/ServiceLayout.jsx'
import ServiceHeader from '../../component/services/common/ServiceHeader.jsx'
import ServiceHero from '../../component/services/common/ServiceHero.jsx'
import ServiceCard from '../../component/services/common/ServiceCard.jsx'
import useServicesData from '../../hooks/service/useServicesData.js'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

function Services() {
  const { services } = useServicesData()
  const navigate = useNavigate()
  const { t } = useI18n()

  const goTo = (slug) => {
    const map = {
      'import-export': '/services/import-export',
      'student-admission': '/services/student-admission',
      'translation': '/services/translation',
    }
    const href = map[slug] || '/services'
    navigate(href)
  }

  return (
    <>
      <ServiceHero
        eyebrow={t('services.heroEyebrow')}
        title={t('services.heroTitle')}
        subtitle={t('services.heroSubtitle')}
        actions={[
          { label: t('services.actionsExplore'), href: '/services' },
          { label: t('services.actionsContact'), href: '/contact', variant: 'secondary' },
        ]}
      />
      <ServiceLayout>
        <section className="mt-8">
          <ServiceHeader title={t('services.whyTitle')} subtitle={t('services.whySubtitle')} align="left" />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { t: t('services.why.expert'), d: t('services.whyDesc.expert') },
              { t: t('services.why.clear'), d: t('services.whyDesc.clear') },
              { t: t('services.why.fast'), d: t('services.whyDesc.fast') },
              { t: t('services.why.compliance'), d: t('services.whyDesc.compliance') },
              { t: t('services.why.personalized'), d: t('services.whyDesc.personalized') },
              { t: t('services.why.outcome'), d: t('services.whyDesc.outcome') },
            ].map((b, i) => (
              <Card key={i}>
                <h3 className="text-lg font-semibold text-gray-900">{b.t}</h3>
                <p className="mt-2 text-gray-700">{b.d}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <ServiceHeader title={t('services.howTitle')} subtitle={t('services.howSubtitle')} align="left" />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { t: t('services.how.discovery'), d: t('services.howDesc.discovery') },
              { t: t('services.how.plan'), d: t('services.howDesc.plan') },
              { t: t('services.how.execute'), d: t('services.howDesc.execute') },
              { t: t('services.how.support'), d: t('services.howDesc.support') },
            ].map((s, i) => (
              <Card key={i}>
                <div className="text-orange-600 font-bold">{t('common.step')} {i + 1}</div>
                <h3 className="mt-1 text-lg font-semibold text-gray-900">{s.t}</h3>
                <p className="mt-2 text-gray-700">{s.d}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <ServiceHeader title={t('services.exploreTitle')} subtitle={t('services.exploreSubtitle')} align="left" />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((svc) => (
              <ServiceCard
                key={svc.id}
                title={svc.title}
                shortDescription={svc.shortDescription}
                features={svc.features}
                ctaText={svc.ctaText}
                onClick={() => goTo(svc.slug)}
              />
            ))}
          </div>
        </section>

        <div className="mt-12 text-center">
          <Link to="/contact" variant="button">{t('services.contactUs')}</Link>
        </div>
      </ServiceLayout>
    </>
  )
}

export default Services