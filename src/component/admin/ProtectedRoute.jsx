import React from 'react'
import useAdminAuth from '../../hooks/admin/useAdminAuth.js'

export default function ProtectedRoute({ children, fallback = null }) {
  const { isAuthenticated } = useAdminAuth()
  if (!isAuthenticated) return fallback
  return <>{children}</>
}