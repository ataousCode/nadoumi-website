import React from 'react'
import ContactForm from '../component/contact/ContactForm.jsx'
import ContactInfo from '../component/contact/ContactInfo.jsx'
import { useI18n } from '../i18n/LocaleProvider.jsx'

function Contact() {
  const { t } = useI18n()
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-white to-orange-50" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{t('contact.title')}</h1>
            <p className="mt-2 text-gray-700 max-w-3xl mx-auto">{t('contact.subtitle')}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1">
            <ContactInfo />
          </aside>
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  )
}

export default Contact