import { useCallback, useMemo, useState } from 'react'
import { validateFile, validateMultiple } from '../../utils/fileValidation'

/**
 * useFileUpload manages service application document uploads.
 * Pass in the admissionDocuments config to enable per-document validation.
 *
 * @param {Object} params
 * @param {Object} params.generalRules - { maxFileSizeBytes, maxFileSizeDisplay }
 * @param {Array} params.documents - list of document definitions with id, fileMimeTypes, type, minFiles
 */
function useFileUpload({ generalRules, documents } = {}) {
  const [files, setFiles] = useState({}) // { [docId]: File | File[] }
  const [errors, setErrors] = useState({}) // { [docId]: string[] }

  const docMap = useMemo(() => {
    const map = {}
    ;(documents || []).forEach((d) => { map[d.id] = d })
    return map
  }, [documents])

  const validateForDoc = useCallback((docId, nextFiles) => {
    const doc = docMap[docId] || {}
    const allowed = doc.fileMimeTypes || []
    const maxBytes = generalRules?.maxFileSizeBytes ?? Infinity
    const minFiles = doc.minFiles || 0
    if (Array.isArray(nextFiles)) {
      const { valid, errors } = validateMultiple(nextFiles, { allowedTypes: allowed, maxBytes, minFiles })
      return { valid, errors }
    }
    const { valid, error } = validateFile(nextFiles, { allowedTypes: allowed, maxBytes })
    return { valid, errors: error ? [error] : [] }
  }, [docMap, generalRules])

  const setFilesFor = useCallback((docId, nextFiles) => {
    const isMultiple = docMap[docId]?.type === 'file-multiple'
    const normalized = isMultiple ? Array.from(nextFiles || []) : nextFiles?.[0] || nextFiles || null
    const { valid, errors: e } = validateForDoc(docId, normalized || (isMultiple ? [] : null))
    setFiles((prev) => ({ ...prev, [docId]: normalized }))
    setErrors((prev) => ({ ...prev, [docId]: valid ? [] : e }))
    return valid
  }, [docMap, validateForDoc])

  const removeFileAt = useCallback((docId, index) => {
    const current = files[docId]
    if (!Array.isArray(current)) return
    const next = current.filter((_, i) => i !== index)
    const { valid, errors: e } = validateForDoc(docId, next)
    setFiles((prev) => ({ ...prev, [docId]: next }))
    setErrors((prev) => ({ ...prev, [docId]: valid ? [] : e }))
  }, [files, validateForDoc])

  const clearAll = useCallback(() => {
    setFiles({})
    setErrors({})
  }, [])

  return {
    files,
    errors,
    setFilesFor,
    removeFileAt,
    clearAll,
  }
}

export default useFileUpload