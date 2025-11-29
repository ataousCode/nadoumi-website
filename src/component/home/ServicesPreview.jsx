import { useNavigate } from 'react-router-dom'
import useServicesData from '../../hooks/service/useServicesData.js'
import Container from '../common/Container.jsx'
import Card from '../common/Card.jsx'
import Button from '../common/Button.jsx'
import Link from '../common/Link.jsx'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

function ServicesPreview({
  title,
  subtitle,
  limit = 2,
  className = '',
}) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { services } = useServicesData()
  const items = Array.isArray(services) ? services : []
  const shown = items.slice(0, limit)

  return (
    <section className={`bg-white ${className}`}>
      <Container size="md">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title || t('home.servicesPreviewTitle')}</h2>
          {(subtitle || t('home.servicesPreviewSubtitle')) && <p className="mt-2 text-gray-700">{subtitle || t('home.servicesPreviewSubtitle')}</p>}
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {shown.map((svc) => (
            <Card key={svc.id || svc.title} className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900">{svc.title}</h3>
              {svc.shortDescription && <p className="mt-2 text-gray-700">{svc.shortDescription}</p>}
              {svc.features && (
                <ul className="mt-3 list-disc list-inside text-gray-700">
                  {svc.features.slice(0, 4).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              )}
              <div className="mt-4">
                <Button variant="primary" size="sm" ariaLabel={svc.ctaText || t('services.actionsExplore')} onClick={() => navigate('/services')}>
                  {svc.ctaText || t('services.actionsExplore')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/services" variant="default">{t('home.viewAllServices')}</Link>
        </div>
      </Container>
    </section>
  )
}

export default ServicesPreview