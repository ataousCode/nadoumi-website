import React, { useEffect, useMemo, useState } from 'react'
import Container from '../component/common/Container.jsx'
import ScholarshipCard from '../component/scholarships/ScholarshipCard.jsx'
import ScholarshipFilters from '../component/scholarships/ScholarshipFilters.jsx'
import { getScholarships } from '../api/scholarships.js'
import Loading from '../component/admin/Loading.jsx'
import EmptyState from '../component/admin/EmptyState.jsx'
import { useNavigate } from 'react-router-dom'

export default function Scholarships() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    search: '',
    country: '',
    category: '',
  })
  const [data, setData] = useState({
    scholarships: [],
    pagination: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await getScholarships({
          search: filters.search || undefined,
          country: filters.country || undefined,
          category: filters.category || undefined,
        })
        if (!cancelled) {
          setData({
            scholarships: res.scholarships || [],
            pagination: res.pagination || null,
          })
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load scholarships', err)
          setError(err.message || 'Failed to load scholarships. Please try again later.')
          setData({
            scholarships: [],
            pagination: null,
          })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [filters.search, filters.country, filters.category])

  const countries = useMemo(() => {
    const set = new Set()
    data.scholarships.forEach((s) => {
      if (s.university?.country) set.add(s.university.country)
    })
    return Array.from(set).sort()
  }, [data.scholarships])

  const categories = useMemo(() => {
    const set = new Set()
    data.scholarships.forEach((s) => {
      if (s.category) set.add(s.category)
    })
    return Array.from(set).sort()
  }, [data.scholarships])

  const handleCardClick = (id) => {
    navigate(`/scholarships/${id}`)
  }

  return (
    <Container className="py-8 md:py-10 lg:py-12">
      <div className="mb-6 md:mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Scholarships & Universities
        </h1>
        <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
          Explore available scholarships and university programs in China. Filter by
          major, category, and keywords to find the opportunities that fit you
          best.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6 lg:gap-8 items-start">
        <div className="order-2 lg:order-1">
          <ScholarshipFilters
            values={filters}
            onChange={setFilters}
            onReset={() =>
              setFilters({ search: '', country: '', category: '' })
            }
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
              {error ? (
                <EmptyState
                  title="Error loading scholarships"
                  message={error}
                />
              ) : data.scholarships.length === 0 ? (
                <EmptyState
                  title="No scholarships found"
                  message="Try adjusting your filters or check back later."
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {data.scholarships.map((s) => (
                    <ScholarshipCard
                      key={s._id}
                      scholarship={s}
                      onClick={() => handleCardClick(s._id)}
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