import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useI18n } from '../../i18n/LocaleProvider.jsx'
import useAdminAuth from '../../hooks/admin/useAdminAuth.js'
import useLogout from '../../hooks/common/useLogout.js'
import ConfirmDialog from '../common/ConfirmDialog.jsx'
import logoUrl from '../../assets/icons/logo.jpg'

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { path: '/admin/applications', label: 'Applications', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { path: '/admin/scholarships', label: 'Scholarships', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { path: '/admin/universities', label: 'Universities', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { path: '/admin/students', label: 'Students', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { path: '/admin/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
]

function AdminSidebar() {
  const { t } = useI18n()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const { logout, loading } = useAdminAuth()
  
  const { showConfirm, setShowConfirm, handleLogout, isLoading } = useLogout(
    logout,
    '/login',
    loading
  )

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md border border-gray-200"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Nadoumi Logo" className="h-10 w-10 rounded-md" />
            <h2 className="text-xl font-bold text-gray-900">Nadoumi</h2>
          </div>
        </div>

        <nav className="p-4 space-y-1 flex flex-col h-[calc(100vh-80px)]">
          <div className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive(item.path)
                    ? 'bg-orange-50 text-orange-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowConfirm(true)}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-red-50 hover:text-red-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>{t('common.logout')}</span>
            </button>
          </div>
        </nav>
        
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
      </aside>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default AdminSidebar

