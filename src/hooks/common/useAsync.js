/**
 * useAsync Hook
 * Custom hook for handling async operations with loading, error, and data states
 */
import { useState, useEffect, useCallback } from 'react'

/**
 * Hook for managing async operations
 * @param {Function} asyncFunction - Async function to execute
 * @param {boolean} immediate - Whether to execute immediately (default: true)
 * @param {Array} dependencies - Dependencies array for re-execution
 * @returns {object} { loading, error, data, execute, reset }
 */
export function useAsync(asyncFunction, immediate = true, dependencies = []) {
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const execute = useCallback(async (...params) => {
    setLoading(true)
    setError(null)

    try {
      const response = await asyncFunction(...params)
      setData(response)
      return response
    } catch (err) {
      setError(err.message || 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }, [asyncFunction])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, dependencies)

  return { loading, error, data, execute, reset }
}

/**
 * Hook for fetching data with automatic loading state
 * @param {Function} fetchFunction - Function that fetches data
 * @param {Array} dependencies - Dependencies array for re-fetching
 * @returns {object} { loading, error, data, refetch }
 */
export function useFetch(fetchFunction, dependencies = []) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  const refetch = useCallback(() => {
    setRefetchTrigger(prev => prev + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        const result = await fetchFunction()
        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to fetch data')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [...dependencies, refetchTrigger])

  return { loading, error, data, refetch }
}

/**
 * Hook for handling form submissions with loading state
 * @returns {object} { loading, error, success, submitForm, reset }
 */
export function useFormSubmit() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const submitForm = useCallback(async (submitFunction) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await submitFunction()
      setSuccess(true)
      return true
    } catch (err) {
      setError(err.message || 'Submission failed')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setSuccess(false)
  }, [])

  return { loading, error, success, submitForm, reset }
}

/**
 * Hook for managing loading state with optional delay
 * @param {boolean} initialState - Initial loading state
 * @param {number} minLoadingTime - Minimum loading time in ms (default: 0)
 * @returns {object} { loading, startLoading, stopLoading }
 */
export function useLoadingState(initialState = false, minLoadingTime = 0) {
  const [loading, setLoading] = useState(initialState)
  const [loadingStartTime, setLoadingStartTime] = useState(null)

  const startLoading = useCallback(() => {
    setLoading(true)
    setLoadingStartTime(Date.now())
  }, [])

  const stopLoading = useCallback(async () => {
    if (minLoadingTime > 0 && loadingStartTime) {
      const elapsed = Date.now() - loadingStartTime
      const remaining = minLoadingTime - elapsed
      
      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining))
      }
    }
    
    setLoading(false)
    setLoadingStartTime(null)
  }, [minLoadingTime, loadingStartTime])

  return { loading, startLoading, stopLoading, setLoading }
}

/**
 * Hook for pagination with loading state
 * @param {Function} fetchFunction - Function to fetch paginated data
 * @param {number} initialPage - Initial page number (default: 1)
 * @param {number} pageSize - Items per page (default: 10)
 * @returns {object} Pagination state and controls
 */
export function usePagination(fetchFunction, initialPage = 1, pageSize = 10) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState([])
  const [page, setPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        const result = await fetchFunction(page, pageSize)
        setData(result.items || result.data || [])
        setTotalPages(result.totalPages || Math.ceil((result.total || 0) / pageSize))
        setTotalItems(result.total || 0)
      } catch (err) {
        setError(err.message || 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page, pageSize, fetchFunction])

  const nextPage = useCallback(() => {
    setPage(prev => Math.min(prev + 1, totalPages))
  }, [totalPages])

  const prevPage = useCallback(() => {
    setPage(prev => Math.max(prev - 1, 1))
  }, [])

  const goToPage = useCallback((newPage) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)))
  }, [totalPages])

  return {
    loading,
    error,
    data,
    page,
    totalPages,
    totalItems,
    nextPage,
    prevPage,
    goToPage,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

