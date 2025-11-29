/**
 * Custom hook for deleting applications
 * Provides delete functionality with loading and error states
 */

import { useState } from 'react'
import { deleteApplication } from '../../api/applications.js'
import { canDelete } from '../../constants/applicationStatus.js'

/**
 * Hook for deleting applications
 * @returns {object} - { deleteApp, isLoading, error, success, canDeleteApplication }
 */
function useApplicationDelete() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  /**
   * Delete an application
   * @param {string} applicationId - Application ID to delete
   * @returns {Promise<boolean>} - True if successful, false otherwise
   */
  const deleteApp = async (applicationId) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      await deleteApplication(applicationId)
      setSuccess(true)
      setIsLoading(false)
      return true
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete application'
      setError(errorMessage)
      setIsLoading(false)
      return false
    }
  }
  
  /**
   * Check if an application can be deleted based on its status
   * @param {string} status - Application status
   * @returns {boolean} - Whether deletion is allowed
   */
  const canDeleteApplication = (status) => {
    return canDelete(status)
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
    deleteApp,
    isLoading,
    error,
    success,
    canDeleteApplication,
    reset,
  }
}

export default useApplicationDelete

