import React from 'react'

/**
 * Reusable card component for displaying document requirements
 * @param {Object} props
 * @param {string} props.label - Document label/title
 * @param {string} props.type - Document type (optional)
 * @param {boolean} props.required - Whether document is required (optional)
 * @param {string} props.note - Additional note (optional)
 * @param {Object} props.t - Translation function (optional)
 * @param {string} props.className - Additional CSS classes
 */
function DocumentCard({ 
  label, 
  type, 
  required, 
  note, 
  t = (key) => key,
  className = '' 
}) {
  return (
    <div className={`rounded-xl border border-orange-100 p-6 bg-white ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
      {type && (
        <p className="mt-1 text-gray-700">
          {t('admission.typeLabel')}: <span className="font-medium">{type}</span>{' '}
          {required !== undefined && (
            required ? `(${t('admission.required')})` : `(${t('admission.optional')})`
          )}
        </p>
      )}
      {note && <p className="mt-2 text-gray-700">{note}</p>}
    </div>
  )
}

export default DocumentCard

