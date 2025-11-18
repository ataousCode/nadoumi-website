import React from 'react'
import { Link } from 'react-router-dom'

function DashboardCard({
  title,
  description,
  count,
  actionLabel = 'View',
  to,
  disabled = false,
  className = '',
}) {
  const Action = () => (
    disabled || !to ? (
      <button className="px-3 py-2 bg-gray-200 text-gray-600 rounded-md cursor-not-allowed" disabled>
        Coming soon
      </button>
    ) : (
      <Link to={to} className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
        {actionLabel}
      </Link>
    )
  )

  return (
    <div className={`rounded-xl border border-orange-100 p-6 bg-white ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && <p className="mt-1 text-gray-700 text-sm">{description}</p>}
        </div>
        {typeof count === 'number' && (
          <div className="text-2xl font-bold text-orange-600" aria-label={`${title} count`}>{count}</div>
        )}
      </div>
      <div className="mt-4">
        <Action />
      </div>
    </div>
  )
}

export default DashboardCard