import { useCallback, useState } from 'react'
import { getDocumentUrls } from '../../api/documents.js'

export default function useDocumentPreview() {
  const [urls, setUrls] = useState([]) // [{ path, url }]
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadFor = useCallback(async (application) => {
    setLoading(true)
    setError('')
    try {
      const list = await getDocumentUrls(application)
      setUrls(Array.isArray(list) ? list : [])
    } catch (err) {
      setError(err?.message || 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }, [])

  return { urls, loading, error, loadFor }
}