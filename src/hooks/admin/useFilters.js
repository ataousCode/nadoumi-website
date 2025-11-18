import { useCallback, useMemo, useState } from 'react'

/**
 * Simple filters hook: status, search query, date range.
 */
export default function useFilters(initial = {}) {
  const [filters, setFilters] = useState({ status: 'all', q: '', from: '', to: '', ...initial })

  const set = useCallback((patch) => setFilters((f) => ({ ...f, ...patch })), [])
  const clear = useCallback(() => setFilters({ status: 'all', q: '', from: '', to: '' }), [])

  const apply = useCallback((items = []) => {
    const { status, q, from, to } = filters
    const ql = q.trim().toLowerCase()
    const fromTs = from ? new Date(from).getTime() : null
    const toTs = to ? new Date(to).getTime() : null
    return items.filter((it) => {
      const okStatus = status === 'all' || it.status === status
      const txt = `${it.display?.name || ''} ${it.display?.email || ''} ${it.display?.program || ''}`.toLowerCase()
      const okQ = !ql || txt.includes(ql)
      const ts = it.submittedAt ? new Date(it.submittedAt).getTime() : null
      const okFrom = !fromTs || (ts && ts >= fromTs)
      const okTo = !toTs || (ts && ts <= toTs)
      return okStatus && okQ && okFrom && okTo
    })
  }, [filters])

  const activeCount = useMemo(() => Object.values(filters).filter(Boolean).length, [filters])

  return { filters, set, clear, apply, activeCount }
}