import React from 'react'

export default function ApplicationDocumentsList({ documents, additionalDocuments, className = '' }) {
  const allDocuments = [
    ...(documents || []),
    ...(additionalDocuments || [])
  ]

  if (allDocuments.length === 0) {
    return null
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Documents</h3>
      <div className="space-y-3">
        {allDocuments.map((doc, index) => (
          <div key={index} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                {doc.required && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Required</span>
                )}
              </div>
              {doc.description && (
                <p className="text-xs text-gray-600 mt-1">{doc.description}</p>
              )}
              {doc.specialConditions && (
                <p className="text-xs text-orange-600 mt-1 italic">{doc.specialConditions}</p>
              )}
            </div>
            {doc.downloadLink && (
              <a
                href={doc.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

