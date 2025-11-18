import React from 'react'

export default function Pagination({ page, pageCount, onPrev, onNext, onGo }) {
  const total = typeof pageCount === 'function' ? null : pageCount
  return (
    <div className="flex items-center gap-2">
      <button type="button" className="px-3 py-2 bg-gray-200 rounded-md" onClick={onPrev} disabled={page <= 1}>Prev</button>
      <span className="text-sm text-gray-700">Page {page}{total ? ` / ${total}` : ''}</span>
      <button type="button" className="px-3 py-2 bg-gray-200 rounded-md" onClick={onNext}>Next</button>
    </div>
  )
}