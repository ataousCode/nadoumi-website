import React from 'react'

function ProcessSteps({
  title = 'How It Works',
  subtitle = 'A simple, transparent process from start to finish',
  steps = [
    { title: 'Consultation', description: 'We understand your goals and outline a clear plan.' },
    { title: 'Execution', description: 'We coordinate suppliers/universities and handle logistics or applications.' },
    { title: 'Delivery', description: 'We deliver outcomes and support you post-engagement.' },
  ],
  className = '',
}) {
  return (
    <section className={`bg-white ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-2 text-gray-700">{subtitle}</p>}
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => (
            <div key={s.title} className="rounded-xl border border-orange-100 p-6">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold">{idx + 1}</div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{s.title}</h3>
              {s.description && <p className="mt-2 text-gray-700">{s.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProcessSteps