import React from 'react'
import { getImageURL } from '../../../api/axiosInstance.js'

function UserMenu({ student, onLogout, isMobile = false }) {
  const initials = student?.firstName?.[0] || 'S'
  const fullName = `${student?.firstName || ''} ${student?.lastName || ''}`

  if (isMobile) {
    return (
      <div className="px-4 py-3 my-2 bg-gray-50 rounded-lg flex items-center gap-3">
        {student?.profilePicture ? (
          <img 
            src={getImageURL(student.profilePicture)}
            alt={student.firstName}
            className="w-10 h-10 rounded-full object-cover border-2 border-orange-200"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <span className="text-orange-50 font-semibold">{initials}</span>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-900">{fullName}</p>
          <p className="text-xs text-gray-500">{student?.email}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50">
      {student?.profilePicture ? (
        <img 
          src={getImageURL(student.profilePicture)}
          alt={student.firstName}
          className="w-6 h-6 rounded-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none'
            const fallback = e.target.nextElementSibling
            if (fallback) fallback.style.display = 'flex'
          }}
        />
      ) : null}
      {(!student?.profilePicture) && (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
          <span className="text-xs font-semibold text-white">{initials}</span>
        </div>
      )}
      <span className="text-sm font-medium text-gray-700">
        {student?.firstName || 'Student'}
      </span>
    </div>
  )
}

export default UserMenu
