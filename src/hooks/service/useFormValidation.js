import { useCallback, useMemo, useState } from 'react'
import { EMAIL_REGEX, PHONE_REGEX } from '../../utils/constants'

/**
 * Generic form validation hook driven by field definitions.
 * Supports required, type-specific checks for email/tel/select/textarea/text.
 * Now with improved error messages and better validation rules.
 *
 * @param {Array} fieldSections - array of sections with { section, fields: [{ id, label, type, required }] }
 * @param {Function} t - Translation function for i18n error messages (optional)
 */
function useFormValidation(fieldSections = [], t = (key) => key) {
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
      const trimmedVal = typeof val === 'string' ? val.trim() : val
      
      // Required field validation
      if (def.required) {
        if (val === undefined || val === null || trimmedVal === '' || (def.type === 'select' && !val)) {
          nextErrors[id] = t('admission.form.required') || `${def.label} is required`
          return
        }
        
        // Checkbox validation
        if (def.type === 'checkbox' && !val) {
          nextErrors[id] = t('admission.form.required') || `${def.label} is required`
          return
        }
      }

      // Type-specific validation (only if value is provided)
      if (trimmedVal) {
        // Email validation
        if (def.type === 'email') {
          if (!EMAIL_REGEX.test(String(trimmedVal))) {
            nextErrors[id] = t('admission.form.invalidEmail') || 'Please enter a valid email address'
          }
        }
        
        // Phone validation
        if (def.type === 'tel') {
          if (!PHONE_REGEX.test(String(trimmedVal))) {
            nextErrors[id] = t('admission.form.invalidPhone') || 'Please enter a valid phone number'
          }
        }
        
        // Date validation
        if (def.type === 'date') {
          const dateVal = new Date(trimmedVal)
          if (isNaN(dateVal.getTime())) {
            nextErrors[id] = 'Please enter a valid date'
          }
        }
        
        // Min/Max length validation
        if (def.minLength && String(trimmedVal).length < def.minLength) {
          nextErrors[id] = `${def.label} must be at least ${def.minLength} characters`
        }
        if (def.maxLength && String(trimmedVal).length > def.maxLength) {
          nextErrors[id] = `${def.label} must not exceed ${def.maxLength} characters`
        }
      }
    })
    
    setErrors(nextErrors)
    return { errors: nextErrors, isValid: Object.keys(nextErrors).length === 0 }
  }, [fieldMap, t])

  const clear = useCallback(() => setErrors({}), [])
  
  const clearField = useCallback((fieldId) => {
    setErrors((prev) => {
      const next = { ...prev }
      delete next[fieldId]
      return next
    })
  }, [])

  return { errors, validate, clear, clearField }
}

export default useFormValidation