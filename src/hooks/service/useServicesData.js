import { useCallback, useEffect, useState } from 'react'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

function useServicesData() {
  const { locale } = useI18n()
  const [list, setList] = useState([])
  useEffect(() => {
    let active = true
    ;(async () => {
      const mod = await import(`../../i18n/locales/${locale}/services.list.json`)
      const arr = Array.isArray(mod.default) ? mod.default : []
      if (active) setList(arr)
    })()
    return () => { active = false }
  }, [locale])

  const getBySlug = useCallback((slug) => list.find((s) => s.slug === slug), [list])

  return { services: list, getBySlug }
}

export default useServicesData