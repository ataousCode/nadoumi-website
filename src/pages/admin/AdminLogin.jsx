import React from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../component/admin/AdminLayout.jsx'
import LoginForm from '../../component/admin/LoginForm.jsx'
import logoUrl from '../../assets/icons/logo.jpg'

export default function AdminLogin() {
  const navigate = useNavigate()
  const onSuccess = () => navigate('/admin')
  return (
    <AdminLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-sm bg-white border border-orange-100 rounded-xl shadow-sm p-6">
          <div className="flex flex-col items-center text-center">
            <img src={logoUrl} alt="Logo" className="h-12 w-12 mb-2 rounded-md" />
            <h2 className="text-xl font-semibold text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-600 mb-4">Sign in to manage applications</p>
          </div>
          <LoginForm onSuccess={onSuccess} />
        </div>
      </div>
    </AdminLayout>
  )
}