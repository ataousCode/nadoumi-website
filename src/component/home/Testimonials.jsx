import React from 'react'
import Container from '../common/Container.jsx'
import Card from '../common/Card.jsx'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

function Testimonials({
  title,
  subtitle,
  items,
  className = '',
}) {
  const { locale, t } = useI18n()
  const [list, setList] = React.useState(items)

  React.useEffect(() => {
    import(`../../i18n/locales/${locale}/testimonials.json`).then((mod) => {
      setList(Array.isArray(mod.default) ? mod.default : [])
    }).catch(() => setList(items))
  }, [locale, items])

  const resolvedTitle = title || t('home.testimonialsTitle')
  const resolvedSubtitle = subtitle || t('home.testimonialsSubtitle')

  return (
    <section className={`bg-white ${className}`}>
      <Container size="md">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{resolvedTitle}</h2>
          {resolvedSubtitle && <p className="mt-2 text-gray-700">{resolvedSubtitle}</p>}
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {list?.map((t) => (
            <Card key={t.id || t.name} as="figure">
              <blockquote>
                <p className="text-gray-800">"{t.feedback}"</p>
              </blockquote>
              <figcaption className="mt-4 text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{t.name}</span>
                {t.role && <> — {t.role}</>}
                {t.country && <>, {t.country}</>}
              </figcaption>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Testimonials