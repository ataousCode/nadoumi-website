/**
 * Custom hook for managing application status updates
 * Provides status update functionality with loading and error states
 */

import { useState } from 'react'
import { updateApplicationStatus } from '../../api/applications.js'

/**
 * Hook for updating application status
 * @returns {object} - { updateStatus, isLoading, error, success }
 */
function useApplicationStatus() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  /**
   * Update application status
   * @param {string} applicationId - Application ID
   * @param {object} statusUpdate - Status update data
   * @param {string} statusUpdate.status - New status
   * @param {string} [statusUpdate.note] - Admin note
   * @param {string} [statusUpdate.adminEmail] - Admin email
   * @param {object} [statusUpdate.metadata] - Additional metadata
   * @returns {Promise<object|null>} - Updated application or null if error
   */
  const updateStatus = async (applicationId, statusUpdate) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      const updated = await updateApplicationStatus(applicationId, statusUpdate)
      setSuccess(true)
      setIsLoading(false)
      return updated
    } catch (err) {
      const errorMessage = err.message || 'Failed to update status'
      setError(errorMessage)
      setIsLoading(false)
      return null
    }
  }
  
  /**
   * Reset hook state
   */
  const reset = () => {
    setIsLoading(false)
    setError(null)
    setSuccess(false)
  }
  
  return {
    updateStatus,
    isLoading,
    error,
    success,
    reset,
  }
}

export default useApplicationStatus

