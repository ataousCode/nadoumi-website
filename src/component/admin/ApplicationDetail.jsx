import React from 'react'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

export default function ApplicationDetail({ application, className = '' }) {
  const { t } = useI18n()
  
  if (!application) return <div className="text-gray-500">No application selected.</div>
  
  // Extract data from populated student or legacy structure
  const student = application.student || {}
  const applicant = application.applicant || {}
  const fields = application.fields || {}
  const preferences = application.preferences || {}
  
  const fullName = student.firstName && student.lastName
    ? `${student.firstName} ${student.lastName}`
    : `${applicant.firstName || fields.firstName || ''} ${applicant.lastName || fields.lastName || ''}`.trim() || 'N/A'
  const email = student.email || applicant.email || fields.email || 'N/A'
  const phone = student.phone || applicant.phone || fields.phone || 'N/A'
  // Program should be the scholarship title
  const scholarship = application.scholarship || {}
  const program = scholarship.title || application.desiredProgram || fields.desiredProgram || preferences.currentDegree || preferences.currentInstitution || 'N/A'
  
  const formatDate = (timestamp) => {
    try {
      if (!timestamp) return 'N/A'
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleString()
    } catch {
      return 'N/A'
    }
  }
  
  const submitted = formatDate(application.submittedAt)
  
  // Build comprehensive details from fields object (contains all form data)
  const groupedFields = {}
  Object.entries(fields).forEach(([key, value]) => {
    // Group fields by section or use a default 'Other Details' section
    const section = key.includes('education') ? 'Education Information' :
                    key.includes('work') ? 'Work Experience' :
                    key.includes('family') ? 'Family Information' :
                    key.includes('address') ? 'Address Information' :
                    key.includes('academic') ? 'Academic Information' :
                    'Additional Information'
    
    if (!groupedFields[section]) {
      groupedFields[section] = {}
    }
    groupedFields[section][key] = value
  })
  
  const detailSections = Object.entries(groupedFields).map(([title, data]) => ({ title, data }))

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Student Summary</h2>
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr><th className="w-40 px-4 py-3 text-left font-medium text-gray-700 bg-gray-50">Name</th><td className="px-4 py-3 text-gray-900">{fullName}</td></tr>
              <tr><th className="w-40 px-4 py-3 text-left font-medium text-gray-700 bg-gray-50">Email</th><td className="px-4 py-3 text-gray-900">{email}</td></tr>
              <tr><th className="w-40 px-4 py-3 text-left font-medium text-gray-700 bg-gray-50">Phone</th><td className="px-4 py-3 text-gray-900">{phone}</td></tr>
              <tr><th className="w-40 px-4 py-3 text-left font-medium text-gray-700 bg-gray-50">Program</th><td className="px-4 py-3 text-gray-900">{program}</td></tr>
              <tr><th className="w-40 px-4 py-3 text-left font-medium text-gray-700 bg-gray-50">Submitted</th><td className="px-4 py-3 text-gray-900">{submitted}</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Detailed Sections */}
      {detailSections.map((section) => {
        const entries = Object.entries(section.data || {}).filter(([k, v]) => v !== null && v !== undefined && v !== '')
        if (entries.length === 0) return null
        
        // Special handling for Family Information
        if (section.title === 'Family Information') {
          const familyMembers = section.data.familyMembers
          if (Array.isArray(familyMembers) && familyMembers.length > 0) {
            return (
              <section key={section.title}>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h2>
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nationality</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relationship</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {familyMembers.map((member, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-gray-900">{member.name || 'N/A'}</td>
                            <td className="px-4 py-3 text-gray-900">{member.nationality || 'N/A'}</td>
                            <td className="px-4 py-3 text-gray-900">{member.relationship || 'N/A'}</td>
                            <td className="px-4 py-3 text-gray-900">{member.email || 'N/A'}</td>
                            <td className="px-4 py-3 text-gray-900">{member.phone || 'N/A'}</td>
                            <td className="px-4 py-3 text-gray-900">{member.jobTitle || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )
          }
        }
        
        return (
          <section key={section.title}>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h2>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <tbody className="divide-y divide-gray-200 bg-white">
                  {entries.map(([key, value]) => {
                    // Skip familyMembers as it's handled separately
                    if (key === 'familyMembers') return null
                    
                    // Format the key to be more readable
                    const formattedKey = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())
                      .trim()
                    
                    // Format the value
                    let formattedValue = value
                    if (typeof value === 'object' && value !== null) {
                      if (Array.isArray(value)) {
                        formattedValue = value.length > 0 ? JSON.stringify(value, null, 2) : 'Empty'
                      } else if (value.toDate) {
                        formattedValue = formatDate(value)
                      } else {
                        formattedValue = JSON.stringify(value, null, 2)
                      }
                    } else if (typeof value === 'boolean') {
                      formattedValue = value ? 'Yes' : 'No'
                    }
                    
                    return (
                      <tr key={key}>
                        <th className="w-48 px-4 py-3 text-left font-medium text-gray-700 bg-gray-50 align-top">
                          {formattedKey}
                        </th>
                        <td className="px-4 py-3 text-gray-900 break-words whitespace-pre-wrap">
                          {String(formattedValue)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )
      })}
    </div>
  )
}