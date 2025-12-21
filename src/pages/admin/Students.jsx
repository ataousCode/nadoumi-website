import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../component/admin/AdminLayout.jsx'
import DataTable from '../../component/common/DataTable.jsx'
import Button from '../../component/common/Button.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useI18n } from '../../i18n/LocaleProvider.jsx'
import { getAllStudents } from '../../api/students.js'

export default function Students() {
  const { success, error: showError } = useToast()
  const { t } = useI18n()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      setLoading(true)
      const response = await getAllStudents()
      setStudents(Array.isArray(response) ? response : [])
    } catch (err) {
      console.error('Error loading students:', err)
      showError(err?.message || 'Failed to load students')
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString()
  }

  const columns = [
    {
      label: 'Name',
      key: 'name',
      className: 'font-medium',
      render: (item) => `${item.firstName || ''} ${item.lastName || ''}`.trim() || '-'
    },
    {
      label: 'Email',
      key: 'email'
    },
    {
      label: 'Country',
      key: 'country',
      render: (item) => item.country || '-'
    },
    {
      label: 'Passport',
      key: 'passportNumber',
      render: (item) => item.passportNumber || '-'
    },
    {
      label: 'Email Verified',
      key: 'isEmailVerified',
      render: (item) => (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
          item.isEmailVerified
            ? 'bg-green-50 text-green-700'
            : 'bg-yellow-50 text-yellow-700'
        }`}>
          {item.isEmailVerified ? 'Verified' : 'Pending'}
        </span>
      )
    },
    {
      label: 'Registered',
      key: 'createdAt',
      render: (item) => formatDate(item.createdAt)
    },
    {
      label: 'Actions',
      key: 'actions',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/students/${item._id || item.id}`}
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            View
          </Link>
        </div>
      )
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading students...</div>
        ) : (
          <DataTable
            columns={columns}
            data={students}
            searchPlaceholder="Search students..."
          />
        )}
      </div>
    </AdminLayout>
  )
}

