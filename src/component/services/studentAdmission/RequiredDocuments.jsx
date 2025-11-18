import React from 'react'
import { useI18n } from '../../../i18n/LocaleProvider.jsx'

function RequiredDocuments() {
  const { locale, t } = useI18n()
  const [documents, setDocuments] = React.useState(null)
  const list = Array.isArray(documents?.documents) ? documents.documents : []

  React.useEffect(() => {
    import(`../../../i18n/locales/${locale}/admission.documents.json`).then((mod) => {
      setDocuments(mod.default)
    }).catch(() => setDocuments(null))
  }, [locale])

  return (
    <section className="mt-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('admission.requiredTitle')}</h2>
        <p className="mt-2 text-gray-700">{t('admission.requiredSubtitle')}</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map((doc, i) => (
            <div key={i} className="rounded-xl border border-orange-100 p-6 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">{doc.label}</h3>
              <p className="mt-1 text-gray-700">{t('admission.typeLabel')}: <span className="font-medium">{doc.type}</span> {doc.required ? `(${t('admission.required')})` : `(${t('admission.optional')})`}</p>
              {doc.note && <p className="mt-2 text-gray-700">{doc.note}</p>}
            </div>
          ))}
        </div>
        {documents?.rules && (
          <div className="mt-8 rounded-xl border border-orange-100 p-6 bg-orange-50">
            <h3 className="text-lg font-semibold text-gray-900">{t('admission.uploadRules')}</h3>
            <ul className="mt-2 list-disc list-inside text-gray-700">
              <li>{t('admission.maxSize')}: {documents.rules.maxSizeMB}MB</li>
              <li>{t('admission.allowedTypes')}: {documents.rules.allowedTypes.join(', ')}</li>
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

export default RequiredDocuments