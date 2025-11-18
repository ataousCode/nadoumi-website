import { useCallback, useEffect, useState } from 'react'
import { listApplications, getApplication, updateApplicationStatus, subscribeApplications } from '../../api/applications.js'

/**
 * Admin applications hook: fetches list, supports detail and status updates.
 */
export default function useApplications() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toDisplay = (app) => {
    const first = app?.applicant?.firstName || app?.fields?.firstName || ''
    const last = app?.applicant?.lastName || app?.fields?.lastName || ''
    const name = [first, last].filter(Boolean).join(' ').trim() || app?.fields?.fullName || ''
    const email = app?.applicant?.email || app?.fields?.email || ''
    const phone = app?.applicant?.phone || app?.fields?.phone || ''
    const program = app?.desiredProgram || app?.fields?.desiredProgram || ''
    return { name, email, phone, program }
  }

  const normalize = (app) => {
    if (!app) return null
    return {
      ...app,
      display: toDisplay(app),
      data: app.fields || {},
      documents: app.documents || {},
    }
  }

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const list = await listApplications()
      const normalized = Array.isArray(list) ? list.map(normalize).filter(Boolean) : []
      setItems(normalized)
    } catch (err) {
      setError(err?.message || 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Initial load
    refresh()
    // Real-time subscription
    const unsub = subscribeApplications((list) => {
      const normalized = Array.isArray(list) ? list.map(normalize).filter(Boolean) : []
      setItems(normalized)
    })
    return () => { try { unsub && unsub() } catch (_) { /* noop */ } }
  }, [refresh])

  const fetchById = useCallback(async (id) => {
    try {
      const app = await getApplication(id)
      return normalize(app)
    } catch (err) {
      setError(err?.message || 'Failed to load application')
      return null
    }
  }, [])

  const setStatus = useCallback(async (id, status) => {
    try {
      await updateApplicationStatus(id, status)
      await refresh()
    } catch (err) {
      setError(err?.message || 'Failed to update status')
    }
  }, [refresh])

  return { items, loading, error, refresh, fetchById, setStatus }
}