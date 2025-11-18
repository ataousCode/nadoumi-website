import React from 'react'

export default function ApplicationDetail({ application, className = '' }) {
  if (!application) return <div className="text-gray-500">No application selected.</div>
  const { display = {}, data = {} } = application
  const submitted = application.submittedAt ? new Date(application.submittedAt).toLocaleString() : ''
  const detailRows = Object.entries(data || {})
    .filter(([k]) => !['documents'].includes(k))
    .map(([k, v]) => [k, typeof v === 'object' ? JSON.stringify(v) : String(v)])

  return (
    <div className={`space-y-6 ${className}`}>
      <section>
        <h2 className="text-lg font-semibold text-gray-900">Applicant</h2>
        <div className="mt-2 overflow-hidden rounded-md border">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <tbody className="divide-y divide-gray-200">
              <tr><th className="w-40 px-3 py-2 text-left font-medium text-gray-700">Name</th><td className="px-3 py-2 text-gray-900">{display.name || ''}</td></tr>
              <tr><th className="w-40 px-3 py-2 text-left font-medium text-gray-700">Email</th><td className="px-3 py-2 text-gray-900">{display.email || ''}</td></tr>
              <tr><th className="w-40 px-3 py-2 text-left font-medium text-gray-700">Phone</th><td className="px-3 py-2 text-gray-900">{display.phone || ''}</td></tr>
              <tr><th className="w-40 px-3 py-2 text-left font-medium text-gray-700">Program</th><td className="px-3 py-2 text-gray-900">{display.program || ''}</td></tr>
              <tr><th className="w-40 px-3 py-2 text-left font-medium text-gray-700">Submitted</th><td className="px-3 py-2 text-gray-900">{submitted}</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Details</h2>
        <div className="mt-2 overflow-hidden rounded-md border">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Field</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {detailRows.length === 0 ? (
                <tr><td colSpan={2} className="px-3 py-2 text-gray-500">No details</td></tr>
              ) : (
                detailRows.map(([k, v]) => (
                  <tr key={k}>
                    <td className="px-3 py-2 text-gray-700">{k}</td>
                    <td className="px-3 py-2 text-gray-900 break-words">{v}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}