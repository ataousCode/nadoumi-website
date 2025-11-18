import React from 'react'

function ImportExportDetails({ steps = [], className = '', stepLabel = 'Step' }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`} aria-label="Import & Export steps">
      {steps.map((s, i) => (
        <div key={i} className="rounded-xl border border-orange-100 p-6 bg-white shadow-sm">
          <div className="text-sm uppercase tracking-wider text-orange-600">{stepLabel} {i + 1}</div>
          <h3 className="mt-2 text-lg font-semibold text-gray-900">{s.title}</h3>
          <p className="mt-2 text-gray-700">{s.description}</p>
        </div>
      ))}
    </div>
  )
}

export default ImportExportDetails