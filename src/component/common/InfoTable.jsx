import React from 'react'

export default function InfoTable({ title, data, className = '' }) {
  if (!data || Object.keys(data).length === 0) {
    return null
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="divide-y divide-gray-200 bg-white">
            {Object.entries(data).map(([key, value]) => {
              if (value === null || value === undefined || value === '') return null
              
              const displayValue = Array.isArray(value) 
                ? value.join(', ') 
                : typeof value === 'boolean' 
                ? (value ? 'Yes' : 'No')
                : value
              
              return (
                <tr key={key}>
                  <th className="w-1/3 px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                  </th>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {displayValue}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

