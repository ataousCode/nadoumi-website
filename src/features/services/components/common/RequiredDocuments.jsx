import React from 'react'
import DocumentCard from '../../../../components/common/DocumentCard.jsx'

/**
 * Required documents section with grid display
 * Displays document requirements with optional metadata
 */
function RequiredDocuments({ 
  title = 'What to Provide', 
  note = '', 
  documents = [],
  t = (key) => key 
}) {
  const list = Array.isArray(documents) ? documents : []

  return (
    <section className="mt-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
        {note && <p className="mt-2 text-gray-700">{note}</p>}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map((doc, index) => {
            // Support both string and object formats
            const isString = typeof doc === 'string'
            return (
              <DocumentCard
                key={index}
                label={isString ? doc : doc.label}
                type={!isString ? doc.type : undefined}
                required={!isString ? doc.required : undefined}
                note={!isString ? doc.note : undefined}
                t={t}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default RequiredDocuments
