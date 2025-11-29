import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/icons/logo.jpg'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

function Navbar() {
  const [open, setOpen] = useState(false)
  const [elevated, setElevated] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { t } = useI18n()

  const services = [
    { href: '/services/import-export', label: t('navbar.importExport') },
    { href: '/services/student-admission', label: t('navbar.studentAdmission') },
    { href: '/services/translation', label: t('navbar.translation') },
  ]

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY

      // Add shadow when scrolled
      setElevated(currentScrollY > 4)

      // Hide navbar on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down & past threshold
        setVisible(false)
      } else {
        // Scrolling up or at top
        setVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastScrollY])

  const linkBase = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ` +
    (isActive ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600')

  const mobileLinkBase = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium transition ` +
    (isActive ? 'text-orange-600 bg-orange-50' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50')

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b transition-transform duration-300 ${elevated ? 'shadow-sm' : 'shadow-none'
        } ${visible ? 'translate-y-0' : '-translate-y-full'}`}
      aria-label="Primary"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Brand logo" className="h-10 w-10" />
          </div>

          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={linkBase} end>{t('navbar.home')}</NavLink>
            <NavLink to="/about" className={linkBase}>{t('navbar.about')}</NavLink>
            <NavLink to="/products" className={linkBase}>{t('navbar.products', 'Products')}</NavLink>
            {/* Services with dropdown */}
            <div className="relative group">
              <div className="flex items-center">
                <NavLink to="/services" className={linkBase}>{t('navbar.services')}</NavLink>
                <svg className="ml-1 h-4 w-4 text-gray-500 group-hover:text-orange-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="absolute left-0 top-full mt-0 w-56 rounded-md shadow-lg bg-white border border-orange-100 hidden group-hover:block z-50" role="menu" aria-label="Services submenu">
                <div className="py-2">
                  {services.map((s) => (
                    <NavLink key={s.href} to={s.href} className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? 'text-orange-600' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-700'}`}>{s.label}</NavLink>
                  ))}
                </div>
              </div>
            </div>
            <NavLink to="/contact" className={linkBase}>{t('navbar.contact')}</NavLink>
            <LanguageSwitcher className="ml-2" />
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Toggle Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white shadow-lg">
          <div className="px-4 py-3 space-y-1">
            <NavLink to="/" className={mobileLinkBase} end onClick={() => setOpen(false)}>{t('navbar.home')}</NavLink>
            <NavLink to="/about" className={mobileLinkBase} onClick={() => setOpen(false)}>{t('navbar.about')}</NavLink>
            <NavLink to="/products" className={mobileLinkBase} onClick={() => setOpen(false)}>{t('navbar.products', 'Products')}</NavLink>

            {/* Services section */}
            <div className="py-1">
              <div className="px-3 py-2 text-base font-medium text-gray-900">
                {t('navbar.services')}
              </div>
              <div className="ml-3 space-y-1">
                {services.map((s) => (
                  <NavLink
                    key={s.href}
                    to={s.href}
                    className={({ isActive }) => `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'}`}
                    onClick={() => setOpen(false)}
                  >
                    {s.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <NavLink to="/contact" className={mobileLinkBase} onClick={() => setOpen(false)}>{t('navbar.contact')}</NavLink>

            <div className="pt-4 pb-2 border-t border-gray-100">
              <div className="px-3">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{t('navbar.language')}</p>
                <LanguageSwitcher variant="buttons" />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar