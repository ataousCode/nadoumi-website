import React from 'react'

function ProcessTimeline({ title = 'Process', subtitle = '', steps = [], stepLabel = 'Step' }) {
  const list = Array.isArray(steps) ? steps : []
  return (
    <section className="mt-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="mt-2 text-gray-700">{subtitle}</p>}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {list.map((s, i) => (
            <div key={i} className="rounded-xl border border-orange-100 p-6 bg-white">
              <div className="text-orange-600 font-bold">{stepLabel} {i + 1}</div>
              <h3 className="mt-1 text-lg font-semibold text-gray-900">{s.title}</h3>
              {s.description && <p className="mt-2 text-gray-700">{s.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProcessTimeline