import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAdminAuth from '../../hooks/admin/useAdminAuth.js'
import { useI18n } from '../../i18n/LocaleProvider.jsx'
import ConfirmDialog from '../common/ConfirmDialog.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function AdminLayout({ title, children, className = '' }) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { isAuthenticated, logout, loading } = useAdminAuth()
  const { success, error } = useToast()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  
  const handleLogout = async () => {
    try {
      await logout()
      success(t('common.toast.logoutSuccess'))
      navigate('/admin/login')
    } catch (err) {
      error(t('common.toast.logoutError'))
    }
  }
  
  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      {title ? (
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
          {isAuthenticated && (
            <button
              type="button"
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              onClick={() => setShowLogoutConfirm(true)}
              disabled={loading}
            >
              {t('common.logout')}
            </button>
          )}
        </header>
      ) : null}
      <main>{children}</main>
      
      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title={t('common.logout')}
        message={t('common.logoutConfirm')}
        variant="warning"
        isLoading={loading}
        confirmText={t('common.logout')}
      />
    </div>
  )
}