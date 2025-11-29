import React from 'react'
import { Navigate } from 'react-router-dom'
import useAdminAuth from '../../hooks/admin/useAdminAuth.js'

export default function ProtectedRoute({ children, fallback = null }) {
  const { isAuthenticated, loading } = useAdminAuth()
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated) return fallback || <Navigate to="/admin/login" replace />
  return <>{children}</>
}