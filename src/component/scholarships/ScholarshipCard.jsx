import React from 'react'
import Button from '../common/Button.jsx'

function formatDate(value) {
  if (!value) return '—'
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleDateString()
  } catch {
    return '—'
  }
}

export default function ScholarshipCard({ scholarship, onClick }) {
  if (!scholarship) return null

  const deadline = formatDate(scholarship.applicationDeadline)
  const country = scholarship.university?.country || ''
  const universityName = scholarship.university?.name || ''

  const imageUrl = scholarship.university?.logo || scholarship.image

  return (
    <article
      className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {imageUrl && (
        <div className="w-full h-48 bg-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={scholarship.university?.name || scholarship.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-2">
              {scholarship.title}
            </h3>
            <p className="mt-1 text-sm text-gray-600 line-clamp-1">
              {universityName}
              {country && <span className="text-gray-400"> · {country}</span>}
            </p>
          </div>
          {scholarship.category && (
            <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
              {scholarship.category}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-700 line-clamp-3">
          {scholarship.description}
        </p>

        <div className="mt-auto flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">
          <span>
            <span className="font-medium text-gray-800">Deadline:</span>{' '}
            {deadline}
          </span>
          {scholarship.availableSlots != null && (
            <span>
              <span className="font-medium text-gray-800">Slots:</span>{' '}
              {scholarship.availableSlots}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 px-4 pb-4 pt-2">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            if (onClick) onClick()
          }}
        >
          View details
        </Button>
      </div>
    </article>
  )
}


