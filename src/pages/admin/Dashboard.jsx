import React, { useMemo } from 'react'
import AdminLayout from '../../component/admin/AdminLayout.jsx'
import DashboardCard from '../../component/admin/DashboardCard.jsx'
import useApplications from '../../hooks/admin/useApplications.js'

export default function Dashboard() {
  const { items, loading, error } = useApplications()
  const submittedCount = useMemo(() => {
    return Array.isArray(items) ? items.filter((it) => it.status === 'received').length : 0
  }, [items])

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Applications"
          description={loading ? 'Loading…' : 'Submitted applications'}
          count={loading ? undefined : submittedCount}
          actionLabel="Manage"
          to="/admin/applications"
        />
        <DashboardCard
          title="Products"
          description="Manage product listings"
          actionLabel="Open"
          to="/admin/products"
        />
        <DashboardCard
          title="Categories"
          description="Organize product categories"
          actionLabel="Open"
          to="/admin/categories"
        />
      </div>
      {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
    </AdminLayout>
  )
}