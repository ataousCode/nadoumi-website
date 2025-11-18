import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../component/admin/AdminLayout.jsx'
import Loading from '../../component/admin/Loading.jsx'
import EmptyState from '../../component/admin/EmptyState.jsx'
import StatusBadge from '../../component/admin/StatusBadge.jsx'
import ApplicationDetail from '../../component/admin/ApplicationDetail.jsx'
import DocumentList from '../../component/admin/DocumentList.jsx'
import ErrorBoundary from '../../component/admin/ErrorBoundary.jsx'
import useApplications from '../../hooks/admin/useApplications.js'

export default function ApplicationDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { fetchById, setStatus } = useApplications()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const it = await fetchById(id)
        if (mounted) setItem(it)
      } catch (err) {
        if (mounted) setError(err?.message || 'Failed to load application')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [id, fetchById])

  const onApprove = async () => {
    try {
      setUpdating(true)
      await setStatus(id, 'approved')
      const it = await fetchById(id)
      setItem(it)
    } catch (err) {
      setError(err?.message || 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }
  const onReject = async () => {
    try {
      setUpdating(true)
      await setStatus(id, 'rejected')
      const it = await fetchById(id)
      setItem(it)
    } catch (err) {
      setError(err?.message || 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <AdminLayout title="Application Details">
      <button type="button" className="mb-4 text-orange-600 font-medium hover:underline" onClick={() => navigate(-1)}>
        ← Back to list
      </button>

      {loading && <Loading label="Loading application…" />}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {!loading && !item && <EmptyState title="Not found" message="This application does not exist." />}
      {!loading && item && (
        <ErrorBoundary>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-gray-900 text-xl font-semibold">{item.display?.name}</div>
              <StatusBadge status={item.status} />
            </div>
            <ApplicationDetail application={item} />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Documents</h2>
              <DocumentList application={item} />
            </div>
            <div className="flex gap-2 pt-2">
              <button className="px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-60" onClick={onApprove} disabled={updating}>Approve</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md disabled:opacity-60" onClick={onReject} disabled={updating}>Reject</button>
            </div>
          </div>
        </ErrorBoundary>
      )}
    </AdminLayout>
  )
}