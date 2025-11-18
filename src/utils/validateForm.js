import { EMAIL_REGEX, PHONE_REGEX, MESSAGE_MIN, MESSAGE_MAX, NAME_MAX, SUBJECT_MAX } from './constants'

export function trimValues(values = {}) {
  const v = Object.fromEntries(
    Object.entries(values).map(([k, val]) => [k, typeof val === 'string' ? val.trim() : val])
  )
  return v
}

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

export default validateContactForm