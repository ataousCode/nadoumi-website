import React from 'react'

export default function EmptyState({ title = 'Nothing here yet', message = 'No data to display.', children, className = '' }) {
  return (
    <div className={`text-center rounded-xl border border-dashed border-gray-300 p-8 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {message && <p className="mt-2 text-gray-600">{message}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}