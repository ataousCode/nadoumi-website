import React from 'react'

export default function Loading({ label = 'Loading…', size = 20, className = '' }) {
  const s = typeof size === 'number' ? size : 20
  return (
    <div className={`flex items-center gap-2 text-gray-600 ${className}`} role="status" aria-live="polite">
      <svg width={s} height={s} viewBox="0 0 24 24" className="animate-spin" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="#e5e7eb" strokeWidth="4" />
        <path d="M12 2 a10 10 0 0 1 10 10" fill="none" stroke="#f97316" strokeWidth="4" />
      </svg>
      <span className="text-sm">{label}</span>
    </div>
  )
}