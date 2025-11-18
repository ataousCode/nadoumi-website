import React from 'react'
import ServiceLayout from '../../component/services/common/ServiceLayout.jsx'
import ServiceHeader from '../../component/services/common/ServiceHeader.jsx'
import ApplicationForm from '../../component/services/studentAdmission/ApplicationForm.jsx'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

function ApplicationFormPage() {
  const { t } = useI18n()
  return (
    <ServiceLayout>
      <ServiceHeader
        eyebrow={t('navbar.studentAdmission')}
        title={t('home.secondary')}
        subtitle={t('services.howSubtitle')}
      />
      <div className="mt-8">
        <ApplicationForm />
      </div>
    </ServiceLayout>
  )
}

export default ApplicationFormPage