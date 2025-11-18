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

function FounderMessage({ title = "Founder's Message", person }) {
  const { locale } = useI18n()
  const baseFounder = person || team.find((p) => /founder/i.test(p.position)) || team[0]
  const [founder, setFounder] = React.useState(baseFounder)
  React.useEffect(() => {
    import(`../../i18n/locales/${locale}/about.team.json`).then((mod) => {
      const overrides = Array.isArray(mod.default) ? mod.default : []
      const byId = Object.fromEntries(overrides.map((o) => [o.id, o]))
      setFounder({ ...baseFounder, ...(byId[baseFounder?.id] || {}) })
    }).catch(() => setFounder(baseFounder))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])
  const photoUrl = resolveImage(founder?.photo) || resolveImage('founder.jpg')

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center md:justify-start">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={founder?.name || 'Founder'}
                className="w-full max-w-sm md:max-w-md rounded-2xl shadow-md object-cover aspect-[4/5]"
              />
            ) : (
              <div className="w-full max-w-md aspect-[4/5] bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">Founder image</div>
            )}
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
            <p className="mt-2 text-gray-700">
              {founder?.name} — {founder?.position}
            </p>
            {founder?.bio && (
              <p className="mt-4 text-gray-700 leading-relaxed">
                {founder.bio}
              </p>
            )}
            {founder?.email || founder?.linkedin ? (
              <div className="mt-6 flex gap-4">
                {founder?.linkedin && (
                  <a href={founder.linkedin} target="_blank" rel="noreferrer" className="text-orange-700 font-semibold hover:underline">
                    LinkedIn
                  </a>
                )}
                {founder?.email && (
                  <a href={`mailto:${founder.email}`} className="text-orange-700 font-semibold hover:underline">
                    Email
                  </a>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FounderMessage