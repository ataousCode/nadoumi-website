/**
 * Custom hook for fetching and managing applications
 * Provides real-time subscriptions, filtering, and search
 */

import { useState, useEffect, useMemo } from 'react'
import {
  subscribeApplications,
  subscribeApplicationsByStatus,
  searchApplications,
} from '../../api/applications.js'

/**
 * Hook for managing applications list
 * @param {object} options - Hook options
 * @param {string} [options.filterStatus] - Filter by status
 * @param {string} [options.searchTerm] - Search term
 * @param {boolean} [options.realtime=true] - Enable real-time updates
 * @returns {object} - { applications, isLoading, error, refetch }
 */
function useApplications(options = {}) {
  const {
    filterStatus = null,
    searchTerm = '',
    realtime = true,
  } = options
  
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)
  
  // Subscribe to applications (with optional filtering)
  useEffect(() => {
    if (!realtime) return
    
    setIsLoading(true)
    setError(null)
    
    let unsubscribe
    
    try {
      if (filterStatus) {
        unsubscribe = subscribeApplicationsByStatus(filterStatus, (apps) => {
          setApplications(apps)
          setIsLoading(false)
        })
      } else {
        unsubscribe = subscribeApplications((apps) => {
          setApplications(apps)
          setIsLoading(false)
        })
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch applications')
      setIsLoading(false)
    }
    
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [filterStatus, realtime, refetchTrigger])
  
  // Client-side search filtering
  const filteredApplications = useMemo(() => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return applications
    }
    
    const term = searchTerm.toLowerCase().trim()
    
    return applications.filter((app) => {
      const personalInfo = app.personalInfo || {}
      const contactInfo = app.contactInfo || {}
      
      const fullName = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.toLowerCase()
      const email = (contactInfo.email || '').toLowerCase()
      const phone = (contactInfo.phone || '').toLowerCase()
      const applicationId = (app.id || '').toLowerCase()
      
      return (
        fullName.includes(term) ||
        email.includes(term) ||
        phone.includes(term) ||
        applicationId.includes(term)
      )
    })
  }, [applications, searchTerm])
  
  /**
   * Manually refetch applications
   */
  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1)
  }
  
  return {
    applications: filteredApplications,
    isLoading,
    error,
    refetch,
    totalCount: applications.length,
    filteredCount: filteredApplications.length,
  }
}

export default useApplications
