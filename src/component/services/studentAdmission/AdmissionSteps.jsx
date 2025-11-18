import React from 'react'

function AdmissionSteps({ steps = [], className = '' }) {
  return (
    <ol className={`space-y-4 ${className}`} aria-label="Admission steps list">
      {steps.map((s, i) => (
        <li key={i} className="rounded-xl border border-orange-100 p-6 bg-white shadow-sm">
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 text-orange-700 font-bold">{i + 1}</span>
            <div>
              <h4 className="text-base font-semibold text-gray-900">{s.title}</h4>
              <p className="mt-1 text-gray-700 text-sm">{s.description}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}

export default AdmissionSteps