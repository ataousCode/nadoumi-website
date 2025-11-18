import React from 'react'
import values from '../../data/values.json'

function Value({ title = 'Our Core Values', subtitle = 'What we stand for', items = values, className = '' }) {
  const extras = [
    { title: 'Transparency', description: 'Open communication and clear expectations in everything we do.' },
    { title: 'Reliability', description: 'Consistent delivery and dependable outcomes you can trust.' },
    { title: 'Impact', description: 'Meaningful results for clients, partners, and communities.' },
  ]

  const cards = Array.isArray(items) && items.length > 0
    ? (items.length >= 6 ? items : [...items, ...extras.slice(0, Math.max(0, 6 - items.length))])
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