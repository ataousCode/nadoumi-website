import React from 'react'
import useAdminAuth from '../../hooks/admin/useAdminAuth.js'
import { useI18n } from '../../i18n/LocaleProvider.jsx'
import ConfirmDialog from '../common/ConfirmDialog.jsx'
import AdminSidebar from './AdminSidebar.jsx'
import useLogout from '../../hooks/common/useLogout.js'

export default function AdminLayout({ title, children, className = '' }) {
  const { t } = useI18n()
  const { isAuthenticated, logout, loading } = useAdminAuth()
  
  const { showConfirm, setShowConfirm, handleLogout, isLoading } = useLogout(
    logout,
    '/login',
    loading
  )
  
  if (!isAuthenticated) {
    return <div>{children}</div>
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 lg:ml-0">
        <div className={`container mx-auto px-4 py-8 ${className}`}>
          <main>{children}</main>
        </div>
      </div>
      
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
    </div>
  )
}