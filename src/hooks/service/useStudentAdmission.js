import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

function useStudentAdmission() {
  const { locale } = useI18n()
  const [details, setDetails] = useState({ title: '', intro: '', steps: [], cta: {} })
  const [documents, setDocuments] = useState({ rules: {}, documents: [] })
  const [fields, setFields] = useState([])
  useEffect(() => {
    let active = true
    ;(async () => {
      const d = await import(`../../i18n/locales/${locale}/services.studentAdmissionDetails.json`)
      let docs = null
      let f = null
      try {
        const modDocs = await import(`../../i18n/locales/${locale}/admission.documents.json`)
        docs = modDocs.default || null
      } catch {}
      try {
        const modFields = await import(`../../i18n/locales/${locale}/admission.formFields.json`)
        f = Array.isArray(modFields.default) ? modFields.default : null
      } catch {}
      if (active) setDetails(d.default || {})
      if (active) setDocuments(docs || { rules: {}, documents: [] })
      if (active) setFields(f || [])
    })()
    return () => { active = false }
  }, [locale])

  return { details, documents, fields }
}

export default useStudentAdmission