import React from 'react'
import ServiceLayout from '../common/ServiceLayout.jsx'
import ServiceHeader from '../common/ServiceHeader.jsx'
import StudentAdmissionDetails from './StudentAdmissionDetails.jsx'
import useStudentAdmission from '../../../hooks/service/useStudentAdmission.js'
import { useI18n } from '../../../i18n/LocaleProvider.jsx'

/**
 * Student Admission Overview Component
 * Displays service details for student admission services
 */
function StudentAdmissionOverview({ className = '' }) {
  const { details } = useStudentAdmission()
  const { t } = useI18n()

  // Provide defaults while data is loading
  const title = details?.title || t('navbar.studentAdmission') || 'Student Admission Services'
  const intro = details?.intro || ''
  const steps = details?.steps || []

  return (
    <ServiceLayout className={className}>
      <ServiceHeader 
        eyebrow={t('services.heroEyebrow')} 
        title={title} 
        subtitle={intro} 
      />
      <div className="mt-10">
        <StudentAdmissionDetails 
          steps={steps} 
          stepLabel={t('common.step')} 
        />
      </div>
    </ServiceLayout>
  )
}

export default StudentAdmissionOverview