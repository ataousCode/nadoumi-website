import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/icons/logo.jpg'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

function Navbar() {
  const [open, setOpen] = useState(false)
  const [elevated, setElevated] = useState(false)
  const { t } = useI18n()
  const services = [
    { href: '/services/import-export', label: t('navbar.importExport') },
    { href: '/services/student-admission', label: t('navbar.studentAdmission') },
    { href: '/services/translation', label: t('navbar.translation') },
  ]

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 4)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkBase = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ` +
    (isActive ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600')

  return (
    <nav className={`sticky top-0 z-50 bg-white/95 backdrop-blur border-b ${elevated ? 'shadow-sm' : 'shadow-none'}`} aria-label="Primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Brand logo" className="h-12 w-12" />
          </div>

          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={linkBase} end>{t('navbar.home')}</NavLink>
            <NavLink to="/about" className={linkBase}>{t('navbar.about')}</NavLink>
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
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="space-y-1 px-4 py-3">
            <NavLink to="/" className={linkBase} end onClick={() => setOpen(false)}>{t('navbar.home')}</NavLink>
            <NavLink to="/services" className={linkBase} onClick={() => setOpen(false)}>{t('navbar.services')}</NavLink>
            {/* Services submenu items (mobile) */}
            <div className="ml-4 space-y-1">
              {services.map((s) => (
                <NavLink key={s.href} to={s.href} className={({ isActive }) => `block px-3 py-1 rounded-md text-sm ${isActive ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'}`} onClick={() => setOpen(false)}>
                  {s.label}
                </NavLink>
              ))}
            </div>
            <NavLink to="/about" className={linkBase} onClick={() => setOpen(false)}>{t('navbar.about')}</NavLink>
            <NavLink to="/contact" className={linkBase} onClick={() => setOpen(false)}>{t('navbar.contact')}</NavLink>
            <div className="mt-2"><LanguageSwitcher /></div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar