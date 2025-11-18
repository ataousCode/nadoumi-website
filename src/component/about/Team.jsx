import React from 'react'
import team from '../../data/team.json'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

const images = import.meta.glob('../../assets/images/*', { eager: true })
const resolveImage = (pathOrFile) => {
  if (!pathOrFile) return null
  const file = pathOrFile.split('/').pop()
  const key = `../../assets/images/${file}`
  const mod = images[key]
  return mod ? mod.default : null
}

function Team({ title = 'Meet the Team', subtitle = 'The people behind our work', members = team, className = '' }) {
  const { locale, t } = useI18n()
  const [list, setList] = React.useState(members)

  React.useEffect(() => {
    import(`../../i18n/locales/${locale}/about.team.json`).then((mod) => {
      const overrides = Array.isArray(mod.default) ? mod.default : []
      if (overrides.length > 0) {
        const byId = Object.fromEntries(overrides.map((o) => [o.id, o]))
        const merged = (members || []).map((m) => ({ ...m, ...(byId[m.id] || {}) }))
        setList(merged)
      } else {
        setList(members)
      }
    }).catch(() => setList(members))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])
  return (
    <section className={`bg-white ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-2 text-gray-700">{subtitle}</p>}
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {list?.map((m) => {
            const photoUrl = resolveImage(m.photo)
            return (
              <div key={m.id || m.name} className="rounded-xl border border-orange-100 p-6">
                {photoUrl ? (
                  <img src={photoUrl} alt={m.name} className="w-full h-48 object-cover rounded-lg" />
                ) : (
                  <div className="w-full h-48 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">{t('about.team.noImage')}</div>
                )}
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{m.name}</h3>
                {m.position && <p className="text-gray-700">{m.position}</p>}
                {m.bio && <p className="mt-2 text-gray-700 text-sm">{m.bio}</p>}
                <div className="mt-3 text-sm">
                  {m.linkedin && (
                    <a href={m.linkedin} className="text-orange-600 hover:underline" target="_blank" rel="noreferrer">
                      {t('about.links.linkedin')}
                    </a>
                  )}
                  {m.email && (
                    <a href={`mailto:${m.email}`} className="ml-3 text-orange-600 hover:underline">
                      {t('about.links.email')}
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Team