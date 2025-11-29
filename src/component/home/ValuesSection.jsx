import React from 'react'
import Container from '../common/Container.jsx'
import Card from '../common/Card.jsx'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

function ValuesSection({
  title,
  subtitle,
  items,
  className = '',
}) {
  const { locale, t } = useI18n()
  const [list, setList] = React.useState(items)

  React.useEffect(() => {
    import(`../../i18n/locales/${locale}/values.json`).then((mod) => {
      setList(Array.isArray(mod.default) ? mod.default : [])
    }).catch(() => setList(items))
  }, [locale, items])

  const resolvedTitle = title || t('home.valuesTitle')
  const resolvedSubtitle = subtitle || t('home.valuesSubtitle')

  return (
    <section className={`bg-white ${className}`}>
      <Container size="md">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{resolvedTitle}</h2>
          {resolvedSubtitle && <p className="mt-2 text-gray-700">{resolvedSubtitle}</p>}
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {list?.map((it) => (
            <Card key={it.id || it.title}>
              <h3 className="text-lg font-semibold text-gray-900">{it.title}</h3>
              {it.description && <p className="mt-2 text-gray-700">{it.description}</p>}
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default ValuesSection