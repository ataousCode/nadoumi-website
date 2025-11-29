import { useEffect, useState } from 'react'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

/**
 * Generic hook to load service data from locale JSON files
 * @param {Object} config - Configuration object
 * @param {string} config.detailsPath - Path to details JSON file (e.g., 'services.importExportDetails')
 * @param {string} config.faqPath - Path to FAQ JSON file (optional)
 * @param {string} config.documentsPath - Path to documents JSON file (optional)
 * @param {string} config.fieldsPath - Path to form fields JSON file (optional)
 * @param {string} config.featuresPath - Path to features JSON file (optional)
 * @param {string} config.requiredPath - Path to required items JSON file (optional)
 * @returns {Object} - Loaded data with defaults
 */
function useServiceData(config = {}) {
  const { locale } = useI18n()
  const [data, setData] = useState({
    details: { title: '', intro: '', steps: [], cta: {} },
    faq: [],
    documents: { rules: {}, documents: [] },
    fields: [],
    features: [],
    required: [],
  })

  useEffect(() => {
    let active = true

    const loadData = async () => {
      const results = {}

      // Load details
      if (config.detailsPath) {
        try {
          const mod = await import(`../../i18n/locales/${locale}/${config.detailsPath}.json`)
          results.details = mod.default || { title: '', intro: '', steps: [], cta: {} }
        } catch {
          results.details = { title: '', intro: '', steps: [], cta: {} }
        }
      }

      // Load FAQ
      if (config.faqPath) {
        try {
          const mod = await import(`../../i18n/locales/${locale}/${config.faqPath}.json`)
          results.faq = Array.isArray(mod.default) ? mod.default : []
        } catch {
          results.faq = []
        }
      }

      // Load documents
      if (config.documentsPath) {
        try {
          const mod = await import(`../../i18n/locales/${locale}/${config.documentsPath}.json`)
          results.documents = mod.default || { rules: {}, documents: [] }
        } catch {
          results.documents = { rules: {}, documents: [] }
        }
      }

      // Load fields
      if (config.fieldsPath) {
        try {
          const mod = await import(`../../i18n/locales/${locale}/${config.fieldsPath}.json`)
          results.fields = Array.isArray(mod.default) ? mod.default : []
        } catch {
          results.fields = []
        }
      }

      // Load features
      if (config.featuresPath) {
        try {
          const mod = await import(`../../i18n/locales/${locale}/${config.featuresPath}.json`)
          results.features = Array.isArray(mod.default) ? mod.default : []
        } catch {
          results.features = []
        }
      }

      // Load required items
      if (config.requiredPath) {
        try {
          const mod = await import(`../../i18n/locales/${locale}/${config.requiredPath}.json`)
          results.required = Array.isArray(mod.default) ? mod.default : []
        } catch {
          results.required = []
        }
      }

      if (active) {
        setData(prev => ({ ...prev, ...results }))
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [locale, config.detailsPath, config.faqPath, config.documentsPath, config.fieldsPath, config.featuresPath, config.requiredPath])

  return data
}

export default useServiceData

