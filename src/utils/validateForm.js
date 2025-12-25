import { EMAIL_REGEX, PHONE_REGEX, MESSAGE_MIN, MESSAGE_MAX, NAME_MAX, SUBJECT_MAX } from './constants'

/**
 * Trim all string values in an object
 * @param {object} values - Object with values to trim
 * @returns {object} Object with trimmed string values
 */
export function trimValues(values = {}) {
  const v = Object.fromEntries(
    Object.entries(values).map(([k, val]) => [k, typeof val === 'string' ? val.trim() : val])
  )
  return v
}

/**
 * Validate contact form
 * @param {object} values - Form values
 * @param {Function} t - Translation function
 * @returns {object} { errors, isValid, values }
 */
export function validateContactForm(values = {}, t = (k) => k) {
  const v = trimValues(values)
  const errors = {}

  if (!v.name) errors.name = t('validation.nameRequired')
  else if (v.name.length > NAME_MAX) errors.name = String(t('validation.nameMax')).replace('{{max}}', NAME_MAX)

  if (!v.email) errors.email = t('validation.emailRequired')
  else if (!EMAIL_REGEX.test(v.email)) errors.email = t('validation.emailInvalid')

  if (v.phone) {
    if (!PHONE_REGEX.test(v.phone)) errors.phone = t('validation.phoneInvalid')
  }

  if (v.subject) {
    if (v.subject.length > SUBJECT_MAX) errors.subject = String(t('validation.subjectMax')).replace('{{max}}', SUBJECT_MAX)
  }

  if (!v.message) errors.message = t('validation.messageRequired')
  else if (v.message.length < MESSAGE_MIN) errors.message = String(t('validation.messageMin')).replace('{{min}}', MESSAGE_MIN)
  else if (v.message.length > MESSAGE_MAX) errors.message = String(t('validation.messageMax')).replace('{{max}}', MESSAGE_MAX)

  return { errors, isValid: Object.keys(errors).length === 0, values: v }
}

/**
 * Validate email field
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null if valid
 */
export function validateEmail(email) {
  if (!email) return 'Email is required'
  if (!EMAIL_REGEX.test(email.trim())) return 'Invalid email format'
  return null
}

/**
 * Validate password field
 * @param {string} password - Password to validate
 * @param {number} minLength - Minimum password length (default: 8)
 * @returns {string|null} Error message or null if valid
 */
export function validatePassword(password, minLength = 8) {
  if (!password) return 'Password is required'
  if (password.length < minLength) return `Password must be at least ${minLength} characters`
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter'
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
  if (!/\d/.test(password)) return 'Password must contain at least one number'
  return null
}

/**
 * Validate required field
 * @param {*} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null if valid
 */
export function validateRequired(value, fieldName = 'This field') {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`
  }
  if (typeof value === 'string' && value.trim() === '') {
    return `${fieldName} is required`
  }
  return null
}

/**
 * Validate string length
 * @param {string} value - String to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null if valid
 */
export function validateLength(value, min, max, fieldName = 'This field') {
  if (!value) return null
  if (value.length < min) return `${fieldName} must be at least ${min} characters`
  if (value.length > max) return `${fieldName} must not exceed ${max} characters`
  return null
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @param {boolean} required - Whether field is required
 * @returns {string|null} Error message or null if valid
 */
export function validatePhone(phone, required = false) {
  if (!phone) return required ? 'Phone number is required' : null
  if (!PHONE_REGEX.test(phone.trim())) return 'Invalid phone number format'
  return null
}

/**
 * Validate date field
 * @param {string} date - Date to validate
 * @param {boolean} allowPast - Whether past dates are allowed
 * @param {boolean} allowFuture - Whether future dates are allowed
 * @returns {string|null} Error message or null if valid
 */
export function validateDate(date, allowPast = true, allowFuture = true) {
  if (!date) return 'Date is required'
  
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return 'Invalid date format'
  
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  dateObj.setHours(0, 0, 0, 0)
  
  if (!allowPast && dateObj < now) return 'Date cannot be in the past'
  if (!allowFuture && dateObj > now) return 'Date cannot be in the future'
  
  return null
}

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {string|null} Error message or null if valid
 */
export function validatePasswordMatch(password, confirmPassword) {
  if (!confirmPassword) return 'Please confirm your password'
  if (password !== confirmPassword) return 'Passwords do not match'
  return null
}

/**
 * Validate form with custom rules
 * @param {object} values - Form values
 * @param {object} rules - Validation rules { fieldName: [validators] }
 * @returns {object} { errors, isValid, values }
 */
export function validateForm(values, rules) {
  const trimmedValues = trimValues(values)
  const errors = {}
  
  Object.entries(rules).forEach(([field, validators]) => {
    const value = trimmedValues[field]
    
    for (const validator of validators) {
      const error = validator(value, trimmedValues)
      if (error) {
        errors[field] = error
        break // Stop at first error for this field
      }
    }
  })
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    values: trimmedValues
  }
}

/**
 * Create custom validator
 * @param {Function} validatorFn - Validation function
 * @param {string} errorMessage - Error message
 * @returns {Function} Validator function
 */
export function createValidator(validatorFn, errorMessage) {
  return (value) => {
    const isValid = validatorFn(value)
    return isValid ? null : errorMessage
  }
}

export default validateContactForm