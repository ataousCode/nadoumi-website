import React, { useEffect, useMemo, useState } from 'react'
import Container from '../component/common/Container.jsx'
import ScholarshipCard from '../component/scholarships/ScholarshipCard.jsx'
import ScholarshipFilters from '../component/scholarships/ScholarshipFilters.jsx'
import { getScholarships } from '../api/scholarships.js'
import Loading from '../component/admin/Loading.jsx'
import { useNavigate } from 'react-router-dom'

const EMPTY_FILTERS = { search: '', country: '', category: '' }

export default function Scholarships() {
  const navigate  = useNavigate()
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [data, setData]       = useState({ scholarships: [], pagination: null })
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null) // null | 'network' | 'server'

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getScholarships({
          search:   filters.search   || undefined,
          country:  filters.country  || undefined,
          category: filters.category || undefined,
        })
        if (!cancelled) {
          setData({
            scholarships: res.scholarships || [],
            pagination:   res.pagination   || null,
          })
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load scholarships', err)
          const isNetwork = !err.status ||
                            err.message?.toLowerCase().includes('network') ||
                            err.message?.toLowerCase().includes('failed to fetch')
          setError(isNetwork ? 'network' : 'server')
          setData({ scholarships: [], pagination: null })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [filters.search, filters.country, filters.category])

  const countries = useMemo(() => {
    const set = new Set()
    data.scholarships.forEach((s) => { if (s.university?.country) set.add(s.university.country) })
    return Array.from(set).sort()
  }, [data.scholarships])

  const categories = useMemo(() => {
    const set = new Set()
    data.scholarships.forEach((s) => { if (s.category) set.add(s.category) })
    return Array.from(set).sort()
  }, [data.scholarships])

  const hasActiveFilters = filters.search || filters.country || filters.category
  const resetFilters     = () => setFilters(EMPTY_FILTERS)
  // Retrigger the effect by creating a new object reference
  const retry            = () => setFilters((f) => ({ ...f }))

  return (
    <Container className="py-8 md:py-10 lg:py-12">
      <div className="mb-6 md:mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Scholarships &amp; Universities
        </h1>
        <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
          Explore available scholarships and university programs in China. Filter by
          major, category, and keywords to find the opportunities that fit you best.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6 lg:gap-8 items-start">
        <div className="order-2 lg:order-1">
          <ScholarshipFilters
            values={filters}
            onChange={setFilters}
            onReset={resetFilters}
            countries={countries}
            categories={categories}
          />
        </div>

        <div className="order-1 lg:order-2">
          {loading && (
            <div className="py-10">
              <Loading label="Loading scholarships..." />
            </div>
          )}

          {!loading && (
            <>
              {/* ── Error state ── */}
              {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-12 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                    {error === 'network' ? (
                      <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M8.111 8.111A7.5 7.5 0 0 0 4.5 12c0 1.38.373 2.67 1.023 3.773M12 12v.01M9.879 9.879A4.5 4.5 0 0 0 7.5 12a4.5 4.5 0 0 0 .739 2.5M15.5 12a4.5 4.5 0 0 0-4.5-4.5m0 0a4.5 4.5 0 0 0-2.122.532" />
                      </svg>
                    ) : (
                      <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v3.75a3 3 0 0 1-3 3m-13.5 0v3a3 3 0 0 0 3 3h7.5a3 3 0 0 0 3-3v-3M8.25 9h.008v.008H8.25V9Zm3.75 0h.008v.008H12V9Zm3.75 0h.008v.008h-.008V9Z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {error === 'network' ? 'Unable to reach the server' : 'Something went wrong'}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                    {error === 'network'
                      ? 'Please check your internet connection and make sure the backend server is running, then try again.'
                      : 'We had trouble loading scholarships. This is usually temporary — please try again in a moment.'}
                  </p>
                  <button
                    onClick={retry}
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Try again
                  </button>
                </div>
              )}

              {/* ── Empty state ── */}
              {!error && data.scholarships.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-14 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                    <svg className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803 7.5 7.5 0 0 0 15.803 15.803Z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">No scholarships found</h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                    {hasActiveFilters
                      ? 'No scholarships match your current filters. Try adjusting your search criteria.'
                      : 'There are no scholarships available at the moment. Please check back later.'}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="mt-5 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}

              {/* ── Results grid ── */}
              {!error && data.scholarships.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {data.scholarships.map((s) => (
                    <ScholarshipCard
                      key={s.id || s._id}
                      scholarship={s}
                      onClick={() => navigate(`/scholarships/${s.id || s._id}`)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  )
}