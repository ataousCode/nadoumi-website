// Utility functions for validating service-related file uploads

export function isAllowedType(file, allowedTypes = []) {
  if (!file || !allowedTypes || allowedTypes.length === 0) return true
  return allowedTypes.includes(file.type)
}

export function isUnderMaxSize(file, maxBytes = Infinity) {
  if (!file || !Number.isFinite(maxBytes)) return true
  return file.size <= maxBytes
}

export function validateFile(file, { allowedTypes = [], maxBytes = Infinity } = {}) {
  if (!file) return { valid: false, error: 'No file provided' }
  if (!isAllowedType(file, allowedTypes)) {
    return { valid: false, error: 'Invalid file type' }
  }
  if (!isUnderMaxSize(file, maxBytes)) {
    return { valid: false, error: 'File exceeds maximum size' }
  }
  return { valid: true }
}

export function validateMultiple(files = [], { allowedTypes = [], maxBytes = Infinity, minFiles = 0 } = {}) {
  const errors = []
  if (!Array.isArray(files)) return { valid: false, errors: ['Files must be an array'] }
  const countOk = files.length >= (minFiles || 0)
  files.forEach((f, i) => {
    const { valid, error } = validateFile(f, { allowedTypes, maxBytes })
    if (!valid && error) errors.push(`File ${i + 1}: ${error}`)
  })
  const valid = errors.length === 0 && countOk
  return { valid, errors }
}

export function summarizeFileError({ maxDisplay = '10MB', note } = {}) {
  const parts = []
  if (maxDisplay) parts.push(`Max size ${maxDisplay}`)
  if (note) parts.push(note)
  return parts.join(' — ')
}