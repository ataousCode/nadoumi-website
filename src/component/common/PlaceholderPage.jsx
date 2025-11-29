import React from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../admin/AdminLayout.jsx'

/**
 * Reusable placeholder component for pages under development
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.message - Placeholder message
 * @param {string} props.backTo - Route to navigate back to
 * @param {string} props.backLabel - Label for back button
 * @param {boolean} props.useAdminLayout - Whether to wrap in AdminLayout
 */
function PlaceholderPage({ 
  title = 'Coming Soon', 
  message = 'This section will be implemented later.',
  backTo = '/admin',
  backLabel = '← Back to dashboard',
  useAdminLayout = true,
}) {
  const navigate = useNavigate()

  const content = (
    <>
      <button 
        type="button" 
        className="mb-4 text-orange-600 font-medium hover:underline" 
        onClick={() => navigate(backTo)}
      >
        {backLabel}
      </button>
      <div className="rounded-xl border border-orange-100 p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-gray-700 text-sm">{message}</p>
      </div>
    </>
  )

  if (useAdminLayout) {
    return <AdminLayout title={title}>{content}</AdminLayout>
  }

  return content
}

export default PlaceholderPage

