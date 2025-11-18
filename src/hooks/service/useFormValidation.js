import { useCallback, useMemo, useState } from 'react'
import { EMAIL_REGEX, PHONE_REGEX } from '../../utils/constants'

/**
 * Generic form validation hook driven by field definitions.
 * Supports required, type-specific checks for email/tel/select/textarea/text.
 *
 * @param {Array} fieldSections - array of sections with { section, fields: [{ id, label, type, required }] }
 */
function useFormValidation(fieldSections = []) {
  const [errors, setErrors] = useState({})

  const fieldMap = useMemo(() => {
    const map = {}
    ;(fieldSections || []).forEach((sec) => {
      (sec.fields || []).forEach((f) => { map[f.id] = f })
    })
    return map
  }, [fieldSections])

  const validate = useCallback((values = {}) => {
    const nextErrors = {}
    Object.entries(fieldMap).forEach(([id, def]) => {
      const val = values[id]
      if (def.required && (val === undefined || val === null || String(val).trim() === '')) {
        nextErrors[id] = `${def.label || id} is required`
        return
      }

      if (val) {
        if (def.type === 'email' && !EMAIL_REGEX.test(String(val))) {
          nextErrors[id] = 'Enter a valid email address'
        }
        if (def.type === 'tel' && !PHONE_REGEX.test(String(val))) {
          nextErrors[id] = 'Enter a valid phone number'
        }
      }
    })
    setErrors(nextErrors)
    return { errors: nextErrors, isValid: Object.keys(nextErrors).length === 0 }
  }, [fieldMap])

  const clear = useCallback(() => setErrors({}), [])

  return { errors, validate, clear }
}

export default useFormValidation