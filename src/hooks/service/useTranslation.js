import useServiceData from './useServiceData.js'

/**
 * Hook for Translation service data
 */
function useTranslation() {
  const { details, faq, features, required } = useServiceData({
    detailsPath: 'services.translationDetails',
    faqPath: 'services.faq',
    featuresPath: 'translation.features',
    requiredPath: 'translation.required',
  })

  return { details, faq, features, required }
}

export default useTranslation
