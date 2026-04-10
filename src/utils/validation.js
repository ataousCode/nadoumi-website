import { isValidPhoneNumber } from 'react-phone-number-input';
import { EMAIL_REGEX, PHONE_REGEX, MESSAGE_MIN, MESSAGE_MAX, NAME_MAX, SUBJECT_MAX } from './constants';

/**
 * Trim all string values in an object
 */
export function trimValues(values = {}) {
  return Object.fromEntries(
    Object.entries(values).map(([k, val]) => [k, typeof val === 'string' ? val.trim() : val])
  );
}

/**
 * Core validation rules
 */
export const validate = {
  required: (value, fieldName = 'This field') => {
    if (value === undefined || value === null || value === '') return `${fieldName} is required`;
    if (Array.isArray(value) && value.length === 0) return 'Please select at least one option';
    if (typeof value === 'string' && value.trim() === '') return `${fieldName} is required`;
    return null;
  },

  email: (value) => {
    if (!value) return null;
    return EMAIL_REGEX.test(value) ? null : 'Please enter a valid email address';
  },

  phone: (value) => {
    if (!value) return null;
    return (isValidPhoneNumber(value) || PHONE_REGEX.test(value)) ? null : 'Please enter a valid phone number';
  },

  password: (value) => {
    if (!value) return null;
    if (value.length < 8) return 'Password must be at least 8 characters long';
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!pattern.test(value)) return 'Password must contain uppercase, lowercase, and a number';
    return null;
  },

  match: (value, otherValue, fieldName = 'Passwords') => {
    if (!value || !otherValue) return null;
    return value === otherValue ? null : `${fieldName} do not match`;
  },

  passport: (value) => {
    if (!value) return null;
    const passportRegex = /^[A-Z0-9]{5,20}$/i;
    return passportRegex.test(value) ? null : 'Please enter a valid passport number (5-20 alphanumeric characters)';
  },

  length: (value, min, max, fieldName = 'This field') => {
    if (!value) return null;
    if (value.length < min) return `${fieldName} must be at least ${min} characters`;
    if (value.length > max) return `${fieldName} must not exceed ${max} characters`;
    return null;
  }
};

/**
 * Form Level Validators
 */
export function validateContactForm(values = {}, t = (k) => k) {
  const v = trimValues(values);
  const errors = {};

  if (!v.name) errors.name = t('validation.nameRequired');
  else if (v.name.length > NAME_MAX) errors.name = String(t('validation.nameMax')).replace('{{max}}', NAME_MAX);

  if (!v.email) errors.email = t('validation.emailRequired');
  else if (!EMAIL_REGEX.test(v.email)) errors.email = t('validation.emailInvalid');

  if (v.phone) {
    if (!PHONE_REGEX.test(v.phone)) errors.phone = t('validation.phoneInvalid');
  }

  if (v.subject) {
    if (v.subject.length > SUBJECT_MAX) errors.subject = String(t('validation.subjectMax')).replace('{{max}}', SUBJECT_MAX);
  }

  if (!v.message) errors.message = t('validation.messageRequired');
  else if (v.message.length < MESSAGE_MIN) errors.message = String(t('validation.messageMin')).replace('{{min}}', MESSAGE_MIN);
  else if (v.message.length > MESSAGE_MAX) errors.message = String(t('validation.messageMax')).replace('{{max}}', MESSAGE_MAX);

  return { errors, isValid: Object.keys(errors).length === 0, values: v };
}

/**
 * Generic Form Validator
 */
export function validateForm(values, rules) {
  const trimmedValues = trimValues(values);
  const errors = {};
  
  Object.entries(rules).forEach(([field, validators]) => {
    const value = trimmedValues[field];
    
    for (const validator of validators) {
      const error = validator(value, trimmedValues);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    values: trimmedValues
  };
}

export default validateContactForm;
