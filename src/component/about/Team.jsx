import React from 'react'
import team from '../../data/team.json'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

const images = import.meta.glob('../../assets/images/*', { eager: true })
const resolveImage = (pathOrFile) => {
  if (!pathOrFile) return null
  // Extract filename from path (handles both "/assets/images/file.jpg" and "file.jpg")
  const file = pathOrFile.includes('/') ? pathOrFile.split('/').pop() : pathOrFile
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
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list?.map((m) => {
            const photoUrl = resolveImage(m.photo)
            return (
              <div key={m.id || m.name} className="group text-center">
                {/* Team Member Image */}
                <div className="relative mb-6">
                  {photoUrl ? (
                    <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden ring-4 ring-orange-100 group-hover:ring-orange-300 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                      <img 
                        src={photoUrl} 
                        alt={m.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-600 ring-4 ring-orange-50">
                      <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Team Member Info */}
                <div className="px-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{m.name}</h3>
                  {m.position && (
                    <p className="mt-2 text-orange-600 font-medium">{m.position}</p>
                  )}
                  {m.bio && (
                    <p className="mt-4 text-gray-600 text-sm leading-relaxed">{m.bio}</p>
                  )}
                  <div className="mt-4 flex justify-center gap-4 text-sm">
                    {m.linkedin && (
                      <a 
                        href={m.linkedin} 
                        className="text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1" 
                        target="_blank" 
                        rel="noreferrer"
                        aria-label={`${m.name} LinkedIn`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        {t('about.links.linkedin')}
                      </a>
                    )}
                    {m.email && (
                      <a 
                        href={`mailto:${m.email}`} 
                        className="text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1"
                        aria-label={`Email ${m.name}`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {t('about.links.email')}
                      </a>
                    )}
                  </div>
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