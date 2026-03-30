import React from 'react'
import ServiceLayout from '../common/ServiceLayout.jsx'
import ServiceHeader from '../common/ServiceHeader.jsx'
import ImportExportDetails from './ImportExportDetails.jsx'
import ImportExportCTA from './ImportExportCTA.jsx'
import useImportExport from '../../../../hooks/service/useImportExport.js'
import { useI18n } from '../../../../i18n/LocaleProvider.jsx'

function ImportExportOverview({ className = '' }) {
  const { details } = useImportExport()
  const { t } = useI18n()
  return (
    <ServiceLayout className={className}>
      <ServiceHeader eyebrow={t('services.heroEyebrow')} title={details.title} subtitle={details.intro} />
      <div className="mt-10">
        <ImportExportDetails steps={details.steps} stepLabel={t('common.step')} />
      </div>
      <div className="mt-10">
        <ImportExportCTA cta={details.cta} />
      </div>
    </ServiceLayout>
  )
}

export default ImportExportOverview