import React from 'react'
import { useI18n } from '../../../i18n/LocaleProvider.jsx'
import useStudentAdmission from '../../../hooks/service/useStudentAdmission.js'
import DocumentCard from '../../common/DocumentCard.jsx'

function RequiredDocuments() {
  const { t } = useI18n()
  const { documents } = useStudentAdmission()
  const list = Array.isArray(documents?.documents) ? documents.documents : []

  return (
    <section className="mt-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('admission.requiredTitle')}</h2>
        <p className="mt-2 text-gray-700">{t('admission.requiredSubtitle')}</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map((doc, index) => (
            <DocumentCard
              key={index}
              label={doc.label}
              type={doc.type}
              required={doc.required}
              note={doc.note}
              t={t}
            />
          ))}
        </div>
        {documents?.rules && documents.rules.maxSizeMB && (
          <div className="mt-8 rounded-xl border border-orange-100 p-6 bg-orange-50">
            <h3 className="text-lg font-semibold text-gray-900">{t('admission.uploadRules')}</h3>
            <ul className="mt-2 list-disc list-inside text-gray-700">
              <li>{t('admission.maxSize')}: {documents.rules.maxSizeMB}MB</li>
              {Array.isArray(documents.rules.allowedTypes) && documents.rules.allowedTypes.length > 0 && (
                <li>{t('admission.allowedTypes')}: {documents.rules.allowedTypes.join(', ')}</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

export default RequiredDocuments