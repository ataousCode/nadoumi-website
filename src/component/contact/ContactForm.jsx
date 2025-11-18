import React, { useEffect, useState } from 'react'
import Button from '../common/Button.jsx'
import site from '../../data/site.json'
import validateContactForm from '../../utils/validateForm'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

function ContactForm({ className = '' }) {
  const { locale, t } = useI18n()
  const [topics, setTopics] = useState([])
  const [values, setValues] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null) // success | error | null

  useEffect(() => {
    import(`../../i18n/locales/${locale}/contact.topics.json`).then((mod) => {
      const arr = Array.isArray(mod.default) ? mod.default : []
      setTopics(arr)
      setValues((v) => ({ ...v, subject: arr[0] || '' }))
    }).catch(() => setTopics([]))
  }, [locale])

  const onChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const { errors: errs, isValid, values: clean } = validateContactForm(values, t)
    setErrors(errs)
    if (!isValid) {
      setStatus({ type: 'error', message: t('contact.form.status.error') })
      return
    }

    const to = site?.email || 'info@example.com'
    const subject = clean.subject ? `[${clean.subject}] ${clean.name}` : `${t('contact.form.message')} — ${clean.name}`
    const body = encodeURIComponent(`${t('contact.form.name')}: ${clean.name}\n${t('contact.form.email')}: ${clean.email}\n${t('contact.form.phone')}: ${clean.phone || 'N/A'}\n\n${clean.message}`)
    const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`
    window.location.href = mailto
    setStatus({ type: 'success', message: t('contact.form.status.success') })
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
          <div className={`mt-4 rounded-lg p-3 text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{status.message}</div>
        )}

        <div className="mt-8 rounded-2xl bg-white border border-orange-100 shadow-sm">
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('contact.form.name')}</label>
              <input id="name" name="name" value={values.name} onChange={onChange} className={`mt-2 w-full rounded-lg border p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder={t('contact.form.ph.name')} />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('contact.form.email')}</label>
              <input id="email" name="email" type="email" value={values.email} onChange={onChange} className={`mt-2 w-full rounded-lg border p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder={t('contact.form.ph.email')} />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t('contact.form.phone')}</label>
              <input id="phone" name="phone" value={values.phone} onChange={onChange} className={`mt-2 w-full rounded-lg border p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} placeholder={t('contact.form.ph.phone')} />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">{t('contact.form.topic')}</label>
              <select id="subject" name="subject" value={values.subject} onChange={onChange} className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                {topics.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
              {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">{t('contact.form.message')}</label>
              <textarea id="message" name="message" rows="6" value={values.message} onChange={onChange} className={`mt-2 w-full rounded-lg border p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.message ? 'border-red-500' : 'border-gray-300'}`} placeholder={t('contact.form.ph.message')} />
              {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
            </div>

            <div className="md:col-span-2 flex items-center justify-between">
              <p className="text-xs text-gray-500">{t('contact.form.disclaimer')}</p>
              <Button variant="primary" size="md" type="submit" ariaLabel={t('contact.form.send')}>{t('contact.form.send')}</Button>
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