import React from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../component/admin/AdminLayout.jsx'

export default function Products() {
  const navigate = useNavigate()
  return (
    <AdminLayout title="Products">
      <button type="button" className="mb-4 text-orange-600 font-medium hover:underline" onClick={() => navigate('/admin')}>
        ← Back to dashboard
      </button>
      <div className="rounded-xl border border-orange-100 p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">Products</h2>
        <p className="mt-2 text-gray-700 text-sm">This section will be implemented later.</p>
      </div>
    </AdminLayout>
  )
}