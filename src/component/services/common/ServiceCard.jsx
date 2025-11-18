import React from 'react'
import Button from '../../common/Button.jsx'

function ServiceCard({ title, shortDescription, features = [], ctaText = 'Learn more', onClick }) {
  return (
    <div className="rounded-xl border border-orange-100 p-6 flex flex-col bg-white shadow-sm">
      {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
      {shortDescription && <p className="mt-2 text-gray-700">{shortDescription}</p>}
      {Array.isArray(features) && features.length > 0 && (
        <ul className="mt-3 list-disc list-inside text-gray-700">
          {features.slice(0, 6).map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      )}
      <div className="mt-4">
        <Button variant="primary" size="sm" ariaLabel={ctaText} onClick={onClick}>
          {ctaText}
        </Button>
      </div>
    </div>
  )
}

export default ServiceCard