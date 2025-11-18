import React from 'react'
import ImportExportOverview from '../../component/services/importExport/ImportExportOverview.jsx'
import FAQ from '../../component/services/faq/FAQ.jsx'
import useImportExport from '../../hooks/service/useImportExport.js'
import ServiceHero from '../../component/services/common/ServiceHero.jsx'
import ProcessTimeline from '../../component/services/importExport/ProcessTimeline.jsx'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

function ImportExportPage() {
  const { faq, details } = useImportExport()
  const { t } = useI18n()

  return (
    <>
      <ServiceHero
        eyebrow={t('navbar.importExport')}
        title={details?.title || 'Import & Export Consulting'}
        subtitle={details?.intro || ''}
        actions={[{ label: t('services.actionsContact'), href: '/contact' }, { label: t('services.faq'), href: '#faq', variant: 'secondary' }]}
      />
      <ImportExportOverview />
      <ProcessTimeline />
      <div id="faq" className="mt-10 container mx-auto px-4">
        <FAQ items={faq} />
      </div>
    </>
  )
}

export default ImportExportPage