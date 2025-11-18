import React from 'react'

const styles = {
  received: 'bg-gray-100 text-gray-800 border-gray-200',
  reviewing: 'bg-blue-100 text-blue-800 border-blue-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200',
}

export default function StatusBadge({ status = 'received', className = '' }) {
  const s = String(status || '').toLowerCase()
  const cls = styles[s] || styles.default
  const label = s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Received'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls} ${className}`}>
      {label}
    </span>
  )
}