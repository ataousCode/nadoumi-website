import useServiceData from './useServiceData.js'

/**
 * Hook for Student Admission service data
 */
function useStudentAdmission() {
  const { details, documents, fields } = useServiceData({
    detailsPath: 'services.studentAdmissionDetails',
    documentsPath: 'admission.documents',
    fieldsPath: 'admission.formFields',
  })

  return { details, documents, fields }
}

export default useStudentAdmission
