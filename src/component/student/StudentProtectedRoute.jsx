import React from 'react'
import { Navigate } from 'react-router-dom'
import useStudentAuth from '../../hooks/student/useStudentAuth.js'
import Loading from '../admin/Loading.jsx'
import Container from '../common/Container.jsx'

export default function StudentProtectedRoute({ children, fallback = null }) {
  const { isAuthenticated, loading } = useStudentAuth()
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <Container className="min-h-screen flex items-center justify-center">
        <Loading label="Loading..." />
      </Container>
    )
  }
  
  if (!isAuthenticated) {
    return fallback || <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

