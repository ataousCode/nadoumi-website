import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../../component/common/Container.jsx'
import Button from '../../component/common/Button.jsx'
import useStudentAuth from '../../hooks/student/useStudentAuth.js'
import { getStudentApplications } from '../../api/applications.js'
import { APPLICATION_STATUS } from '../../constants/applicationStatus.js'
import { getStatusConfig } from '../../constants/statusConfig.js'
import Loading from '../../component/admin/Loading.jsx'
import StatusBadge from '../../component/admin/StatusBadge.jsx'
import { getImageURL } from '../../api/config.js'
import { formatDate } from '../../utils/dateFormatter.js'

const statusConfig = {
  [APPLICATION_STATUS.PENDING]: getStatusConfig(APPLICATION_STATUS.PENDING),
  [APPLICATION_STATUS.RECEIVED]: getStatusConfig(APPLICATION_STATUS.RECEIVED),
  [APPLICATION_STATUS.UNDER_REVIEW]: getStatusConfig(APPLICATION_STATUS.UNDER_REVIEW),
  [APPLICATION_STATUS.INTERVIEW]: getStatusConfig(APPLICATION_STATUS.INTERVIEW),
  [APPLICATION_STATUS.INTERVIEW_PASSED]: getStatusConfig(APPLICATION_STATUS.INTERVIEW_PASSED),
  [APPLICATION_STATUS.INTERVIEW_FAILED]: getStatusConfig(APPLICATION_STATUS.INTERVIEW_FAILED),
  [APPLICATION_STATUS.ACCEPTED]: getStatusConfig(APPLICATION_STATUS.ACCEPTED),
  [APPLICATION_STATUS.REJECTED]: getStatusConfig(APPLICATION_STATUS.REJECTED),
  [APPLICATION_STATUS.REVOKED]: getStatusConfig(APPLICATION_STATUS.REVOKED),
}

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { student, loading: authLoading } = useStudentAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !student) {
      navigate('/login')
      return
    }

    async function loadApplications() {
      try {
        const apps = await getStudentApplications()
        setApplications(apps || [])
      } catch (err) {
        console.error('Failed to load applications', err)
      } finally {
        setLoading(false)
      }
    }

    if (student) {
      loadApplications()
    }
  }, [student, authLoading, navigate])

  if (authLoading || loading) {
    return (
      <Container className="py-12">
        <Loading label="Loading..." />
      </Container>
    )
  }

  if (!student) {
    return null
  }

  // Calculate statistics
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

  // Get recent applications (last 5)
  const recentApplications = applications
    .sort((a, b) => new Date(b.createdAt || b.submittedAt || 0) - new Date(a.createdAt || a.submittedAt || 0))
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Container className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              {student.profilePicture ? (
                <img 
                  src={getImageURL(student.profilePicture)}
                  alt={student.firstName}
                  className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    const fallback = e.target.nextElementSibling
                    if (fallback) {
                      fallback.style.display = 'flex'
                    }
                  }}
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {student.firstName?.[0] || 'S'}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Welcome back, {student.firstName}!
                </h1>
                <p className="text-gray-600 mt-1">Track and manage your scholarship applications</p>
              </div>
            </div>
          </div>

          {/* Statistics Cards - Improved Design */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3">
              {Object.entries(stats).map(([key, value]) => {
                const config = statusConfig[APPLICATION_STATUS[key.toUpperCase()]] || 
                  { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: '📊' }
                return (
                  <div 
                    key={key}
                    className={`${config.bg} ${config.border} border-2 rounded-xl p-4 text-center transition-all hover:shadow-md hover:scale-105 cursor-default`}
                  >
                    <div className="text-2xl mb-1">{config.icon}</div>
                    <div className={`text-2xl md:text-3xl font-bold ${config.text} mb-1`}>
                      {value}
                    </div>
                    <div className="text-xs font-medium text-gray-600 capitalize">
                      {key === 'underReview' ? 'Review' : key}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions - Enhanced */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full" />
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    className="w-full justify-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => navigate('/scholarships')}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Browse Scholarships
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full justify-center gap-2"
                    onClick={() => navigate('/student/applications')}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View All Applications
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-center gap-2"
                    onClick={() => navigate('/student/profile')}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Edit Profile
                  </Button>
                </div>
              </div>

              {/* Profile Summary Card */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Profile Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-orange-100">Email Verified</span>
                    <span className="text-sm font-medium">
                      {student.emailVerified ? '✓ Verified' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-100">Applications</span>
                    <span className="text-sm font-medium">{stats.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-100">Active</span>
                    <span className="text-sm font-medium">
                      {stats.pending + stats.received + stats.underReview + stats.interview}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity - Enhanced */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full" />
                    Recent Applications
                  </h2>
                  {applications.length > 0 && (
                    <button
                      onClick={() => navigate('/student/applications')}
                      className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
                    >
                      View All
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>

                {recentApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                      <svg
                        className="h-10 w-10 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-sm text-gray-600 mb-6">Start your journey by exploring available scholarships</p>
                    <Button
                      variant="primary"
                      onClick={() => navigate('/scholarships')}
                    >
                      Browse Scholarships
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentApplications.map((app) => {
                      const config = statusConfig[app.status] || statusConfig[APPLICATION_STATUS.PENDING]
                      return (
                        <div
                          key={app._id || app.id}
                          className={`${config.bg} ${config.border} border-2 rounded-xl p-5 hover:shadow-md transition-all cursor-pointer group`}
                          onClick={() => navigate(`/student/applications/${app._id || app.id}`)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-3 mb-2">
                                <div className={`w-10 h-10 rounded-lg ${config.bg} ${config.border} border flex items-center justify-center flex-shrink-0`}>
                                  <span className="text-lg">{config.icon}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                                    {app.scholarship?.title || 'Scholarship Application'}
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1 truncate">
                                    {app.scholarship?.university?.name || 'University'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500 ml-13">
                                <span className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {formatDate(app.createdAt || app.submittedAt)}
                                </span>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <StatusBadge status={app.status} size="sm" />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
