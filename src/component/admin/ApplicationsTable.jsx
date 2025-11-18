import React from 'react'

export default function ApplicationsTable({ items = [], onSelect, className = '' }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 border rounded-xl">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.length === 0 && (
            <tr>
              <td colSpan="5" className="px-4 py-6 text-center text-gray-500">No applications yet.</td>
            </tr>
          )}
          {items.map((it) => (
            <tr key={it.id} className="hover:bg-orange-50 cursor-pointer" onClick={() => onSelect && onSelect(it)}>
              <td className="px-4 py-3 text-sm text-gray-900">{it.display?.name}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{it.display?.email}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{it.display?.program}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{it.submittedAt ? new Date(it.submittedAt).toLocaleString() : ''}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{it.status || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}