import React from 'react'
import site from '../../../data/site.json'
import { useI18n } from '../../../i18n/LocaleProvider.jsx'

const Item = ({ icon, label, children }) => (
  <div className="rounded-xl border border-orange-100 bg-white shadow-sm p-6 flex items-start gap-4">
    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <div className="text-sm font-semibold text-gray-900">{label}</div>
      <div className="mt-1 text-gray-700">{children}</div>
    </div>
  </div>
)

function ContactInfo({ className = '' }) {
  const email = site?.email || 'info@example.com'
  const phone = site?.phone || '+1 000 000 0000'
  const address = site?.address || 'Add your address in site.json'
  const { t } = useI18n()

  return (
    <section className={`bg-white ${className}`} aria-labelledby="contact-info-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h2 id="contact-info-heading" className="text-xl sm:text-2xl font-bold text-gray-900">{t('contact.infoTitle')}</h2>
        <p className="mt-2 text-gray-600">{t('contact.infoSubtitle')}</p>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <Item
            label={t('contact.email')}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M1.5 5.25A2.25 2.25 0 013.75 3h16.5A2.25 2.25 0 0122.5 5.25v13.5A2.25 2.25 0 0120.25 21H3.75A2.25 2.25 0 011.5 18.75V5.25zm1.72.53l8.28 6.207a.75.75 0 00.9 0l8.28-6.207A.75.75 0 0019.97 4.5H4.03a.75.75 0 00-.81 1.28z" />
              </svg>
            }
          >
            <a className="text-orange-600 font-medium hover:underline" href={`mailto:${email}`}>{email}</a>
          </Item>

          <Item
            label={t('contact.phone')}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M2.25 4.5A2.25 2.25 0 014.5 2.25h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H6.75a11.25 11.25 0 0010.5 10.5v-2.25a2.25 2.25 0 012.25-2.25h2.25a2.25 2.25 0 012.25 2.25V19.5a2.25 2.25 0 01-2.25 2.25H19.5A17.25 17.25 0 012.25 4.5z" />
              </svg>
            }
          >
            <a className="text-orange-600 font-medium hover:underline" href={`tel:${phone}`}>{phone}</a>
          </Item>

          <Item
            label={t('contact.address')}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 2.25c-4.28 0-7.75 3.47-7.75 7.75 0 5.81 6.53 10.79 7.19 11.28a.75.75 0 00.92 0c.66-.49 7.19-5.47 7.19-11.28 0-4.28-3.47-7.75-7.75-7.75zm0 10.25a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
              </svg>
            }
          >
            {address}
          </Item>
        </div>

        {site?.social && (
          <div className="mt-6">
            <div className="text-sm font-semibold text-gray-900">{t('contact.follow')}</div>
            <div className="mt-3 flex gap-3 text-sm">
              {site?.social?.twitter && (
                <a href={site.social.twitter} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-orange-600">Twitter</a>
              )}
              {site?.social?.facebook && (
                <a href={site.social.facebook} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-orange-600">Facebook</a>
              )}
              {site?.social?.linkedin && (
                <a href={site.social.linkedin} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-orange-600">LinkedIn</a>
              )}
              {site?.social?.instagram && (
                <a href={site.social.instagram} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-orange-600">Instagram</a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ContactInfo