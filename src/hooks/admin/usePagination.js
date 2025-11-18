import { useCallback, useMemo, useState } from 'react'

export default function usePagination({ pageSize = 10 } = {}) {
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(pageSize)

  const paginate = useCallback((items = []) => {
    const start = (page - 1) * size
    return items.slice(start, start + size)
  }, [page, size])

  const pageCount = useMemo(() => (count) => Math.max(1, Math.ceil(count / size)), [size])

  const next = useCallback((count) => setPage((p) => Math.min(p + 1, pageCount(count))), [pageCount])
  const prev = useCallback(() => setPage((p) => Math.max(p - 1, 1)), [])
  const go = useCallback((p, count) => setPage(Math.max(1, Math.min(p, pageCount(count)))), [pageCount])

  return { page, size, setPage, setSize, paginate, pageCount, next, prev, go }
}