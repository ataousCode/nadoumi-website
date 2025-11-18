import { useEffect, useState } from 'react'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

function useImportExport() {
  const { locale } = useI18n()
  const [details, setDetails] = useState({ title: '', intro: '', steps: [], cta: {} })
  const [faq, setFaq] = useState([])
  useEffect(() => {
    let active = true
    ;(async () => {
      const d = await import(`../../i18n/locales/${locale}/services.importExportDetails.json`)
      const f = await import(`../../i18n/locales/${locale}/services.faq.json`)
      if (active) {
        setDetails(d.default || {})
        setFaq(Array.isArray(f.default) ? f.default : [])
      }
    })()
    return () => { active = false }
  }, [locale])
  return { details, faq }
}

export default useImportExport