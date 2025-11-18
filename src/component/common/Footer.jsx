import React from 'react'
import site from '../../data/site.json'
import logo from '../../assets/icons/logo.jpg'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

function Footer() {
  const { t } = useI18n()
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Brand logo" className="h-12 w-12" />
            </div>
            <p className="mt-3 text-sm text-gray-600">{t('footer.description')}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t('footer.contact')}</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              {site?.email && (<li><a className="hover:text-orange-600" href={`mailto:${site.email}`}>{site.email}</a></li>)}
              {site?.phone && (<li><a className="hover:text-orange-600" href={`tel:${site.phone}`}>{site.phone}</a></li>)}
              {site?.address && (<li>{site.address}</li>)}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t('footer.follow')}</h3>
            <div className="mt-3 flex gap-3">
              {site?.social?.twitter && (
                <a aria-label="Twitter" href={site.social.twitter} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-orange-600">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M19.633 7.997c.013.18.013.361.013.542 0 5.543-4.22 11.93-11.93 11.93-2.372 0-4.577-.693-6.427-1.885.33.038.648.05.991.05a8.45 8.45 0 0 0 5.237-1.806 4.224 4.224 0 0 1-3.94-2.92c.257.038.514.063.783.063.373 0 .747-.05 1.095-.144a4.216 4.216 0 0 1-3.385-4.138v-.05c.556.31 1.2.5 1.885.523A4.21 4.21 0 0 1 2.9 6.82c0-.78.206-1.5.556-2.124a11.97 11.97 0 0 0 8.695 4.41 4.754 4.754 0 0 1-.106-.966 4.216 4.216 0 0 1 7.3-2.884 8.31 8.31 0 0 0 2.667-1.017 4.23 4.23 0 0 1-1.853 2.32 8.44 8.44 0 0 0 2.432-.656 9.06 9.06 0 0 1-2.758 2.106Z"/></svg>
                </a>
              )}
              {site?.social?.linkedin && (
                <a aria-label="LinkedIn" href={site.social.linkedin} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-orange-600">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.05c.53-1 1.82-2.05 3.75-2.05 4 0 4.75 2.63 4.75 6.05V23h-4v-5.5c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V23h-4V8.5z"/></svg>
                </a>
              )}
              {site?.social?.instagram && (
                <a aria-label="Instagram" href={site.social.instagram} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-orange-600">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zm-5 3a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm6.5-2.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z"/></svg>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t pt-6">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} {t('footer.copyright')}</p>
          <a href="https://tadalatestudio.com/" target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-orange-600">{t('footer.designBy')}</a>
          <p className="text-xs text-gray-500">{t('footer.madeWithLove')}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer