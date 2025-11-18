import React from 'react'
import ServiceLayout from '../common/ServiceLayout.jsx'
import ServiceHeader from '../common/ServiceHeader.jsx'
import StudentAdmissionDetails from './StudentAdmissionDetails.jsx'
import useStudentAdmission from '../../../hooks/service/useStudentAdmission.js'
import { useI18n } from '../../../i18n/LocaleProvider.jsx'

function StudentAdmissionOverview({ className = '' }) {
  const { details } = useStudentAdmission()
  const { t } = useI18n()
  return (
    <ServiceLayout className={className}>
      <ServiceHeader eyebrow={t('services.heroEyebrow')} title={details.title} subtitle={details.intro} />
      <div className="mt-10">
        <StudentAdmissionDetails steps={details.steps} stepLabel={t('common.step')} />
      </div>
    </ServiceLayout>
  )
}

export default StudentAdmissionOverview