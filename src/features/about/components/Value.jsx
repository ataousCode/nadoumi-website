import React from 'react'
import base from '../../../data/values.json'
import { useI18n } from '../../../i18n/LocaleProvider.jsx'

function Value({ title = 'Our Core Values', subtitle = 'What we stand for', items = base, className = '' }) {
  const { locale } = useI18n()
  const [list, setList] = React.useState(items)

  React.useEffect(() => {
    import(`../../i18n/locales/${locale}/about.values.json`).then((mod) => {
      const arr = Array.isArray(mod.default) ? mod.default : []
      setList(arr.length > 0 ? arr : items)
    }).catch(() => setList(items))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  const extras = [
    { id: 'tr', title: 'Transparency', description: 'Open communication and clear expectations in everything we do.' },
    { id: 're', title: 'Reliability', description: 'Consistent delivery and dependable outcomes you can trust.' },
    { id: 'im', title: 'Impact', description: 'Meaningful results for clients, partners, and communities.' },
  ]

  const cards = Array.isArray(list) && list.length > 0
    ? (list.length >= 6 ? list : [...list, ...extras.slice(0, Math.max(0, 6 - list.length))])
    : extras

  return (
    <section className={`bg-white ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-2 text-gray-700">{subtitle}</p>}
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards?.map((it, idx) => (
            <div key={it.id || it.title} className="rounded-2xl border border-orange-100 bg-white shadow-sm hover:shadow-md transition p-8">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-lg">{idx + 1}</div>
              <h3 className="mt-5 text-xl font-semibold text-gray-900">{it.title}</h3>
              {it.description && <p className="mt-3 text-gray-700 leading-relaxed">{it.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Value