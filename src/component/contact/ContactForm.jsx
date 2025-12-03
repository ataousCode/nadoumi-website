import React, { useEffect, useState } from 'react'
import emailjs from 'emailjs-com'
import Button from '../common/Button.jsx'
import site from '../../data/site.json'
import validateContactForm from '../../utils/validateForm'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

function ContactForm({ className = '' }) {
  const { locale, t } = useI18n()
  // Small helper to avoid showing raw i18n keys if a translation is missing
  const tr = (key, fallback) => {
    const value = t(key)
    if (value === key && fallback) return fallback
    return value
  }
  const [topics, setTopics] = useState([])
  const [values, setValues] = useState({ name: '', email: '', phone: '', country: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null) // success | error | loading | null
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTopicOpen, setIsTopicOpen] = useState(false)

  useEffect(() => {
    import(`../../i18n/locales/${locale}/contact.topics.json`).then((mod) => {
      const arr = Array.isArray(mod.default) ? mod.default : []
      setTopics(arr)
      // If no topic is selected yet, default to the first option
      if (arr.length) {
        setValues((v) => ({
          ...v,
          subject: v.subject || arr[0],
        }))
      }
    }).catch(() => setTopics([]))
  }, [locale])

  const onChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const { errors: errs, isValid, values: clean } = validateContactForm(values, t)
    setErrors(errs)
    if (!isValid) {
      setStatus({ type: 'error', message: t('contact.form.status.error') })
      return
    }

    setIsSubmitting(true)
    setStatus({ type: 'loading', message: tr('common.status.submitting', 'Sending your message...') })

    const serviceId = 'service_8az2yef'
    const templateId = 'template_tae2yig'
    const publicKey = 'ubv16OvVyXYIoKY6o'

    const templateParams = {
      from_name: clean.name,
      from_email: clean.email,
      phone: clean.phone || 'N/A',
      country: clean.country || 'N/A',
      subject: clean.subject || 'General Inquiry',
      message: clean.message,
      locale,
      to_email: site?.email || 'team@nadoumiconsulting.com',
      company_name: site?.companyName || 'Nadoumi Consulting',
    }

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey)
      setStatus({ type: 'success', message: tr('contact.form.status.success', 'Thanks! Your message has been sent. We will get back to you soon.') })
      setValues({ name: '', email: '', phone: '', country: '', subject: topics[0] || '', message: '' })
      setErrors({})
    } catch (err) {
      console.error('EmailJS send error:', err)
      setStatus({
        type: 'error',
        message: tr('contact.form.status.submitError', 'Failed to send your message. Please try again later.'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={`relative ${className}`} aria-labelledby="contact-heading">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-100" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl">
          <h2 id="contact-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">{t('contact.form.title')}</h2>
          <p className="mt-2 text-gray-600">{t('contact.form.subtitle')}</p>
        </div>

        {status?.type && (
          <div
            className={`mt-4 rounded-lg p-3 text-sm ${
              status.type === 'success'
                ? 'bg-green-50 text-green-700'
                : status.type === 'loading'
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-red-50 text-red-700'
            }`}
          >
            {status.message}
          </div>
        )}

        <div className="mt-8 rounded-2xl bg-white border border-orange-100 shadow-sm">
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('contact.form.name')}</label>
              <input
                id="name"
                name="name"
                value={values.name}
                onChange={onChange}
                className={`mt-2 w-full rounded-lg border p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={tr('contact.form.ph.name', 'Your full name')}
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('contact.form.email')}</label>
              <input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={onChange}
                className={`mt-2 w-full rounded-lg border p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={tr('contact.form.ph.email', 'you@company.com')}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t('contact.form.phone')}</label>
              <input
                id="phone"
                name="phone"
                value={values.phone}
                onChange={onChange}
                className={`mt-2 w-full rounded-lg border p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={tr('contact.form.ph.phone', t('contact.form.phone'))}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">{t('contact.form.country')}</label>
              <input
                id="country"
                name="country"
                value={values.country}
                onChange={onChange}
                className="mt-2 w-full rounded-lg border p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 border-gray-300"
                placeholder={tr('contact.form.ph.country', 'Your country')}
              />
            </div>

            <div className="relative">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                {t('contact.form.topic')}
              </label>

              {/* Visually hidden native select (for accessibility / forms), but we render a custom dropdown for better mobile UX */}
              <select
                id="subject"
                name="subject"
                value={values.subject}
                onChange={(e) => {
                  const value = e.target.value
                  setValues((v) => ({ ...v, subject: value }))
                }}
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              >
                {topics.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setIsTopicOpen((open) => !open)}
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 bg-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <span className={values.subject ? 'text-gray-900' : 'text-gray-400'}>
                  {values.subject || tr('contact.form.status.select', 'Select topic')}
                </span>
                <svg
                  className="w-4 h-4 text-gray-500 ml-2 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.5 7.5L10 12L14.5 7.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isTopicOpen && topics.length > 0 && (
                <div className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg max-h-60 overflow-y-auto">
                  {topics.map((opt) => {
                    const isActive = values.subject === opt
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setValues((v) => ({ ...v, subject: opt }))
                          setIsTopicOpen(false)
                        }}
                        className={`w-full text-left px-3 py-2 text-sm ${
                          isActive
                            ? 'bg-orange-50 text-orange-700'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              )}
              {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">{t('contact.form.message')}</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={values.message}
                onChange={onChange}
                className={`mt-2 w-full rounded-lg border p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={tr('contact.form.ph.message', t('contact.form.message'))}
              />
              {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
            </div>

            <div className="md:col-span-2 flex items-center justify-between">
              <p className="text-xs text-gray-500">{t('contact.form.disclaimer')}</p>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                ariaLabel={t('contact.form.send')}
                disabled={isSubmitting}
                className="md:px-6 md:py-3"
              >
                {isSubmitting ? tr('common.status.submitting', 'Sending...') : t('contact.form.send')}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          {t('contact.form.preferEmail')} <a className="text-orange-600 font-medium hover:underline" href={`mailto:${site?.email || 'info@example.com'}`}>{site?.email || 'info@example.com'}</a>.
        </div>
      </div>
    </section>
  )
}

export default ContactForm