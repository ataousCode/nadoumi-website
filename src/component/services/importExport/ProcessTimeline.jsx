import React from 'react'
import useImportExport from '../../../hooks/service/useImportExport.js'
import { useI18n } from '../../../i18n/LocaleProvider.jsx'

function ProcessTimeline() {
  const { details } = useImportExport()
  const steps = Array.isArray(details?.steps) ? details.steps : []
  const { t } = useI18n()

  return (
    <section className="mt-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('importExport.processTitle')}</h2>
        <p className="mt-2 text-gray-700">{t('importExport.processSubtitle')}</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="rounded-xl border border-orange-100 p-6 bg-white">
              <div className="text-orange-600 font-bold">{t('common.step')} {i + 1}</div>
              <h3 className="mt-1 text-lg font-semibold text-gray-900">{s.title}</h3>
              {s.description && <p className="mt-2 text-gray-700">{s.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProcessTimeline