import React, { useMemo, useState, useEffect } from 'react'
import AdminLayout from '../../component/admin/AdminLayout.jsx'
import DashboardCard from '../../component/admin/DashboardCard.jsx'
import useApplications from '../../hooks/admin/useApplications.js'
import { getScholarships } from '../../api/scholarships.js'

export default function Dashboard() {
  const { applications: items, isLoading: loading, error } = useApplications()
  const [scholarshipsStats, setScholarshipsStats] = useState({ total: 0, published: 0, draft: 0 })
  const [loadingScholarships, setLoadingScholarships] = useState(true)

  useEffect(() => {
    loadScholarshipsStats()
  }, [])

  const loadScholarshipsStats = async () => {
    try {
      setLoadingScholarships(true)
      const response = await getScholarships({ limit: 100 })
      const data = response.data || response
      const scholarships = Array.isArray(data.scholarships) ? data.scholarships : (Array.isArray(data) ? data : [])
      setScholarshipsStats({
        total: scholarships.length,
        published: scholarships.filter(s => s.status === 'published').length,
        draft: scholarships.filter(s => s.status === 'draft').length
      })
    } catch (err) {
      console.error('Failed to load scholarships stats:', err)
    } finally {
      setLoadingScholarships(false)
    }
  }

  const submittedCount = useMemo(() => {
    return Array.isArray(items) ? items.filter((it) => it.status === 'received' || it.status === 'pending').length : 0
  }, [items])

  const pendingCount = useMemo(() => {
    return Array.isArray(items) ? items.filter((it) => it.status === 'pending').length : 0
  }, [items])

  const underReviewCount = useMemo(() => {
    return Array.isArray(items) ? items.filter((it) => it.status === 'under_review').length : 0
  }, [items])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Applications"
            description={loading ? 'Loading…' : 'Total applications'}
            count={loading ? undefined : submittedCount}
            actionLabel="View"
            to="/admin/applications"
          />
          <DashboardCard
            title="Pending"
            description="Awaiting review"
            count={loading ? undefined : pendingCount}
            actionLabel="View"
            to="/admin/applications?status=pending"
          />
          <DashboardCard
            title="Under Review"
            description="In progress"
            count={loading ? undefined : underReviewCount}
            actionLabel="View"
            to="/admin/applications?status=under_review"
          />
          <DashboardCard
            title="Scholarships"
            description={loadingScholarships ? 'Loading…' : 'Published scholarships'}
            count={loadingScholarships ? undefined : scholarshipsStats.published}
            actionLabel="View"
            to="/admin/scholarships"
          />
        </div>

        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
      </div>
    </AdminLayout>
  )
}