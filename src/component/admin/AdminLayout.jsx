import React from 'react'
import { useNavigate } from 'react-router-dom'
import useAdminAuth from '../../hooks/admin/useAdminAuth.js'

export default function AdminLayout({ title, children, className = '' }) {
  const navigate = useNavigate()
  const { isAuthenticated, logout, loading } = useAdminAuth()
  const onLogout = async () => {
    try {
      await logout()
      navigate('/admin/login')
    } catch (_) {}
  }
  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      {title ? (
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
          {isAuthenticated && (
            <button
              type="button"
              className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={onLogout}
              disabled={loading}
            >
              {loading ? 'Signing out…' : 'Logout'}
            </button>
          )}
        </header>
      ) : null}
      <main>{children}</main>
    </div>
  )
}