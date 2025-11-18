import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../component/admin/AdminLayout.jsx'
import Filters from '../../component/admin/Filters.jsx'
import ApplicationsTable from '../../component/admin/ApplicationsTable.jsx'
import Pagination from '../../component/admin/Pagination.jsx'
import Loading from '../../component/admin/Loading.jsx'
import EmptyState from '../../component/admin/EmptyState.jsx'
import StatusBadge from '../../component/admin/StatusBadge.jsx'
import useApplications from '../../hooks/admin/useApplications.js'
import useFilters from '../../hooks/admin/useFilters.js'
import usePagination from '../../hooks/admin/usePagination.js'

export default function ApplicationsInbox() {
  const navigate = useNavigate()
  const { items, loading, error } = useApplications()
  const { filters, set, clear, apply } = useFilters()
  const { page, pageSize, paginate, pageCount, next, prev } = usePagination({ pageSize: 10 })

  const filtered = useMemo(() => apply(items), [apply, items])
  const visible = useMemo(() => paginate(filtered), [paginate, filtered])

  const onSelect = (it) => navigate(`/admin/applications/${it.id}`)

  return (
    <AdminLayout title="Applications">
      <button type="button" className="mb-4 text-orange-600 font-medium hover:underline" onClick={() => navigate('/admin')}>
        ← Back to dashboard
      </button>
      <div className="flex items-center justify-between mb-4">
        <Filters filters={filters} onChange={set} onClear={clear} />
        <div>
          <StatusBadge status="received" />
        </div>
      </div>

      {loading && <Loading label="Loading applications…" />}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {!loading && filtered.length === 0 && (
        <EmptyState title="No applications" message="Try adjusting filters or check back later." />
      )}
      {!loading && filtered.length > 0 && (
        <ApplicationsTable items={visible} onSelect={onSelect} />
      )}

      {!loading && filtered.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Pagination page={page} pageCount={pageCount(filtered)} onPrev={prev} onNext={next} />
        </div>
      )}
    </AdminLayout>
  )
}