import { isValidPhoneNumber } from 'react-phone-number-input';

export const validate = {
  required: (value) => {
    if (value === undefined || value === null || value === '') return 'This field is required';
    if (Array.isArray(value) && value.length === 0) return 'Please select at least one option';
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Please enter a valid email address';
  },

  phone: (value) => {
    if (!value) return null;
    return isValidPhoneNumber(value) ? null : 'Please enter a valid phone number';
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
    // Sync with backend: 5-20 alphanumeric characters
    const passportRegex = /^[A-Z0-9]{5,20}$/i;
    return passportRegex.test(value) ? null : 'Please enter a valid passport number (5-20 alphanumeric characters)';
  }
};
