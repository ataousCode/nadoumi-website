import useServiceData from './useServiceData.js'

/**
 * Hook for Import/Export service data
 */
function useImportExport() {
  const { details, faq } = useServiceData({
    detailsPath: 'services.importExportDetails',
    faqPath: 'services.faq',
  })

  return { details, faq }
}

export default useImportExport
