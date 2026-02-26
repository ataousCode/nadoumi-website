import React, { useEffect, useState, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/icons/logo.jpg'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import { useI18n } from '../../i18n/LocaleProvider.jsx'
import useStudentAuth from '../../hooks/student/useStudentAuth.js'
import useLogout from '../../hooks/common/useLogout.js'
import Button from './Button.jsx'
import { getImageURL } from '../../api/config.js'

function Navbar() {
  const [open, setOpen] = useState(false)
  const [elevated, setElevated] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { t } = useI18n()
  const { isAuthenticated: isStudentAuthenticated, student, logout: logoutStudent, loading: studentLoading } = useStudentAuth()
  
  const { showConfirm, setShowConfirm, handleLogout, isLoading } = useLogout(
    logoutStudent,
    '/',
    studentLoading
  )

  const closeMobileMenu = () => setOpen(false)

  const services = [
    { href: '/services/import-export', label: t('navbar.importExport') },
    { href: '/services/translation', label: t('navbar.translation') },
  ]

  const publicNavItems = useMemo(() => [
    { href: '/', label: t('navbar.home'), end: true },
    { href: '/about', label: t('navbar.about') },
    { href: '/services', label: t('navbar.services', 'Services') },
    { href: '/scholarships', label: t('navbar.scholarships', 'Scholarships') },
    { href: '/contact', label: t('navbar.contact') },
  ], [t])

  const studentNavItems = useMemo(() => [
    { href: '/scholarships', label: t('navbar.scholarships', 'Scholarships') },
  ], [t])

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY
      setElevated(currentScrollY > 4)
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setVisible(false)
      } else {
        setVisible(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastScrollY])

  const linkBase = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive 
        ? 'text-orange-600 bg-orange-50' 
        : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50/50'
    }`

  const mobileLinkBase = ({ isActive }) =>
    `block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
      isActive 
        ? 'text-orange-600 bg-orange-50' 
        : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
    }`

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-b border-gray-100 transition-all duration-300 ${
        elevated ? 'shadow-lg shadow-gray-100/50' : 'shadow-sm'
      } ${visible ? 'translate-y-0' : '-translate-y-full'}`}
      aria-label="Primary"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <NavLink 
              to={isStudentAuthenticated ? "/student/dashboard" : "/"} 
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <img src={logo} alt="Nadoumi Logo" className="h-10 w-10 rounded-lg shadow-sm group-hover:shadow-md transition-shadow" />
                <div className="absolute inset-0 rounded-lg bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Nadoumi
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center gap-2 flex-1 justify-center">
            {isStudentAuthenticated ? (
              <>
                {studentNavItems.map((item) => (
                  <NavLink 
                    key={item.href} 
                    to={item.href} 
                    className={linkBase}
                    end={item.end}
                  >
                    {item.label}
                  </NavLink>
                ))}
                <NavLink to="/student/dashboard" className={linkBase}>
                  Dashboard
                </NavLink>
                <div className="h-6 w-px bg-gray-200 mx-2" />
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50">
                  {student?.profilePicture ? (
                    <img 
                      src={getImageURL(student.profilePicture)}
                      alt={student.firstName}
                      className="w-6 h-6 rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        const fallback = e.target.nextElementSibling
                        if (fallback) {
                          fallback.style.display = 'flex'
                        }
                      }}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      <span className="text-xs font-semibold text-white">
                        {student?.firstName?.[0] || 'S'}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {student?.firstName || 'Student'}
                  </span>
                </div>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {publicNavItems.map((item) => (
                  <NavLink 
                    key={item.href} 
                    to={item.href} 
                    className={linkBase}
                    end={item.end}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </>
            )}
          </div>

          {/* Right Side Actions - Sign Up and Language */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {!isStudentAuthenticated && (
              <NavLink to="/student/register">
                <Button variant="primary" size="sm" ariaLabel="Sign Up">
                  Sign Up
                </Button>
              </NavLink>
            )}
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
            aria-label="Toggle Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-xl">
          <div className="px-4 py-4 space-y-1">
            {isStudentAuthenticated ? (
              <>
                {studentNavItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={mobileLinkBase}
                    end={item.end}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </NavLink>
                ))}
                <NavLink to="/student/dashboard" className={mobileLinkBase} onClick={closeMobileMenu}>
                  Dashboard
                </NavLink>
                <div className="px-4 py-3 my-2 bg-gray-50 rounded-lg flex items-center gap-3">
                  {student?.profilePicture ? (
                    <img 
                      src={`${API_BASE_URL}${student.profilePicture}`}
                      alt={student.firstName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-orange-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      <span className="text-orange-50 font-semibold">
                        {student?.firstName?.[0] || 'S'}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {student?.firstName} {student?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{student?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowConfirm(true)
                    closeMobileMenu()
                  }}
                  className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {publicNavItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={mobileLinkBase}
                    end={item.end}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </NavLink>
                ))}
                <NavLink to="/services" className={mobileLinkBase} onClick={closeMobileMenu}>
                  {t('navbar.services', 'Services')}
                </NavLink>
                <NavLink to="/student/register" className="block mt-2" onClick={closeMobileMenu}>
                  <Button variant="primary" className="w-full" ariaLabel="Sign Up">
                    Sign Up
                  </Button>
                </NavLink>
              </>
            )}

            <div className="pt-4 pb-2 border-t border-gray-100 mt-4">
              <div className="px-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {t('navbar.language')}
                </p>
                <LanguageSwitcher variant="buttons" />
              </div>
            </div>
          </div>
        </div>
      )}

      {isStudentAuthenticated && (
        <ConfirmDialog
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleLogout}
          title={t('common.logout')}
          message={t('common.logoutConfirm')}
          variant="warning"
          isLoading={isLoading}
          confirmText={t('common.logout')}
        />
      )}
    </nav>
  )
}

export default Navbar
