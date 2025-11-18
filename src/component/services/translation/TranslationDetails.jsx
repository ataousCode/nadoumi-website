import React, { useEffect, useState } from 'react'
import ServiceLayout from '../common/ServiceLayout.jsx'
import ServiceHeader from '../common/ServiceHeader.jsx'
import ProcessTimeline from '../common/ProcessTimeline.jsx'
import RequiredDocuments from '../common/RequiredDocuments.jsx'
import useTranslation from '../../../hooks/service/useTranslation.js'
import { useI18n } from '../../../i18n/LocaleProvider.jsx'

export default function TranslationDetails() {
  const { details } = useTranslation()
  const { locale, t } = useI18n()

  const [required, setRequired] = useState([])
  useEffect(() => {
    import(`../../../i18n/locales/${locale}/translation.required.json`).then((mod) => {
      setRequired(Array.isArray(mod.default) ? mod.default : [])
    }).catch(() => setRequired([]))
  }, [locale])

  return (
    <ServiceLayout>
      <ServiceHeader title={t('translation.howTitle')} subtitle={t('translation.howSubtitle')} />
      <ProcessTimeline title={t('translation.processTitle')} subtitle={t('translation.processSubtitle')} steps={details.steps} stepLabel={t('common.step')} />
      <RequiredDocuments title={t('translation.requiredTitle')} note={t('translation.requiredNote')} documents={required} />
    </ServiceLayout>
  )
}