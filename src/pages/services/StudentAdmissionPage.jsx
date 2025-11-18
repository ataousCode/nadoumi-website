import React from 'react'
import { Link } from 'react-router-dom'
import StudentAdmissionOverview from '../../component/services/studentAdmission/StudentAdmissionOverview.jsx'
import ServiceHero from '../../component/services/common/ServiceHero.jsx'
import RequiredDocuments from '../../component/services/studentAdmission/RequiredDocuments.jsx'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

function StudentAdmissionPage() {
  const { t } = useI18n()
  return (
    <>
      <ServiceHero
        eyebrow={t('navbar.studentAdmission')}
        title={t('home.secondary')}
        subtitle={t('services.howSubtitle')}
        actions={[{ label: t('home.secondary'), href: '/services/apply' }, { label: t('services.actionsContact'), href: '/contact', variant: 'secondary' }]}
      />
      <StudentAdmissionOverview />
      <RequiredDocuments />
      <div className="mt-10 container mx-auto px-4 text-center">
        <Link
          to="/services/apply"
          className="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-md shadow hover:bg-orange-700"
        >
          {t('home.secondary')}
        </Link>
      </div>
    </>
  )
}

export default StudentAdmissionPage