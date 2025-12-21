import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../../component/common/Container.jsx'
import Loading from '../../component/admin/Loading.jsx'
import EmptyState from '../../component/admin/EmptyState.jsx'
import Button from '../../component/common/Button.jsx'
import StatusBadge from '../../component/admin/StatusBadge.jsx'
import { getStudentApplications } from '../../api/applications.js'
import { APPLICATION_STATUS } from '../../constants/applicationStatus.js'

function formatDate(value) {
  if (!value) return '—'
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleDateString()
  } catch {
    return '—'
  }
}

export default function MyApplications() {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const apps = await getStudentApplications()
        if (!cancelled) {
          setApplications(apps || [])
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load applications', err)
          setError(err?.message || 'Failed to load applications')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter)

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === APPLICATION_STATUS.PENDING).length,
    received: applications.filter(app => app.status === APPLICATION_STATUS.RECEIVED).length,
    underReview: applications.filter(app => app.status === APPLICATION_STATUS.UNDER_REVIEW).length,
    interview: applications.filter(app => app.status === APPLICATION_STATUS.INTERVIEW).length,
    interviewPassed: applications.filter(app => app.status === APPLICATION_STATUS.INTERVIEW_PASSED).length,
    interviewFailed: applications.filter(app => app.status === APPLICATION_STATUS.INTERVIEW_FAILED).length,
    accepted: applications.filter(app => app.status === APPLICATION_STATUS.ACCEPTED).length,
    rejected: applications.filter(app => app.status === APPLICATION_STATUS.REJECTED).length,
    revoked: applications.filter(app => app.status === APPLICATION_STATUS.REVOKED).length,
  }

  if (loading) {
    return (
      <Container className="py-12">
        <Loading label="Loading applications..." />
      </Container>
    )
  }

  return (
    <Container className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-2">Track and manage your scholarship applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10 gap-3 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-xs text-gray-600">Pending</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-blue-600">{stats.received}</div>
            <div className="text-xs text-gray-600">Received</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-yellow-600">{stats.underReview}</div>
            <div className="text-xs text-gray-600">Review</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-purple-600">{stats.interview}</div>
            <div className="text-xs text-gray-600">Interview</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-green-600">{stats.interviewPassed}</div>
            <div className="text-xs text-gray-600">Passed</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-red-600">{stats.interviewFailed}</div>
            <div className="text-xs text-gray-600">Failed</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-green-600">{stats.accepted}</div>
            <div className="text-xs text-gray-600">Accepted</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-xs text-gray-600">Rejected</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-orange-600">{stats.revoked}</div>
            <div className="text-xs text-gray-600">Revoked</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === 'all'
                ? 'bg-orange-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter(APPLICATION_STATUS.PENDING)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === APPLICATION_STATUS.PENDING
                ? 'bg-yellow-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setFilter(APPLICATION_STATUS.RECEIVED)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === APPLICATION_STATUS.RECEIVED
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Received ({stats.received})
          </button>
          <button
            onClick={() => setFilter(APPLICATION_STATUS.UNDER_REVIEW)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === APPLICATION_STATUS.UNDER_REVIEW
                ? 'bg-yellow-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Under Review ({stats.underReview})
          </button>
          <button
            onClick={() => setFilter(APPLICATION_STATUS.INTERVIEW)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === APPLICATION_STATUS.INTERVIEW
                ? 'bg-purple-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Interview ({stats.interview})
          </button>
          <button
            onClick={() => setFilter(APPLICATION_STATUS.INTERVIEW_PASSED)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === APPLICATION_STATUS.INTERVIEW_PASSED
                ? 'bg-green-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Passed ({stats.interviewPassed})
          </button>
          <button
            onClick={() => setFilter(APPLICATION_STATUS.INTERVIEW_FAILED)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === APPLICATION_STATUS.INTERVIEW_FAILED
                ? 'bg-red-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Failed ({stats.interviewFailed})
          </button>
          <button
            onClick={() => setFilter(APPLICATION_STATUS.ACCEPTED)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === APPLICATION_STATUS.ACCEPTED
                ? 'bg-green-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Accepted ({stats.accepted})
          </button>
          <button
            onClick={() => setFilter(APPLICATION_STATUS.REJECTED)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === APPLICATION_STATUS.REJECTED
                ? 'bg-red-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Rejected ({stats.rejected})
          </button>
          <button
            onClick={() => setFilter(APPLICATION_STATUS.REVOKED)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === APPLICATION_STATUS.REVOKED
                ? 'bg-orange-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Revoked ({stats.revoked})
          </button>
        </div>

        {/* Applications List */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : filteredApplications.length === 0 ? (
          <EmptyState
            title={filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
            message={
              filter === 'all'
                ? 'You haven\'t submitted any scholarship applications yet. Browse scholarships to get started.'
                : `You don't have any ${filter} applications.`
            }
          >
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/scholarships')}
            >
              Browse Scholarships
            </Button>
          </EmptyState>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div
                key={app._id || app.id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/student/applications/${app._id || app.id}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {app.scholarship?.title || app.scholarshipId || 'Scholarship Application'}
                      </h3>
                      <StatusBadge status={app.status} size="sm" />
                    </div>
                    {app.scholarship?.university?.name && (
                      <p className="text-sm text-gray-600 mb-2">
                        {app.scholarship.university.name}
                        {app.scholarship.university.country && (
                          <span className="text-gray-400"> · {app.scholarship.university.country}</span>
                        )}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-3">
                      <span>
                        <span className="font-medium">Submitted:</span>{' '}
                        {formatDate(app.createdAt || app.submittedAt)}
                      </span>
                      {app.updatedAt && app.updatedAt !== app.createdAt && (
                        <span>
                          <span className="font-medium">Updated:</span>{' '}
                          {formatDate(app.updatedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/student/applications/${app._id || app.id}`)
                    }}
                  >
                    View Details →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}

