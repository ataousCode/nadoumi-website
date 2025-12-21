import React, { useEffect, useMemo, useState } from 'react'
import Container from '../component/common/Container.jsx'
import ScholarshipCard from '../component/scholarships/ScholarshipCard.jsx'
import ScholarshipFilters from '../component/scholarships/ScholarshipFilters.jsx'
import { getScholarships } from '../api/scholarships.js'
import Loading from '../component/admin/Loading.jsx'
import EmptyState from '../component/admin/EmptyState.jsx'
import { useNavigate } from 'react-router-dom'

// Fallback UI-only dummy scholarships with detailed data and images
const dummyScholarships = [
  {
    _id: 'dummy-1',
    title: 'Nadoumi Excellence Scholarship – Business & Trade',
    university: {
      name: 'Guangzhou International Business University',
      country: 'China',
      city: 'Guangzhou',
      website: 'https://www.example-university.edu.cn',
      logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop',
    },
    description: `Full-tuition scholarship for outstanding international students pursuing degrees in International Trade, Supply Chain Management, and Logistics.

This prestigious scholarship covers 100% of tuition fees and provides comprehensive support for international students. Recipients will have access to world-class facilities, industry partnerships, and career development opportunities.

The program includes:
• Full tuition coverage for the entire degree duration
• Monthly living stipend
• Travel allowance for international students
• Health insurance coverage
• Access to exclusive networking events
• Internship opportunities with leading companies

Guangzhou International Business University is ranked among the top business schools in China, with strong connections to global trade networks and multinational corporations.`,
    requirements: {
      minGPA: 3.5,
      requiredLanguages: ['English', 'Chinese (HSK Level 4)'],
      requiredDegrees: ['High School Diploma', 'Bachelor\'s Degree (for Master\'s programs)'],
      ageLimit: 30,
      nationalityRestrictions: [],
    },
    benefits: {
      tuitionCoverage: 100,
      livingStipend: 3000,
      travelAllowance: true,
      healthInsurance: true,
      other: [
        'Free accommodation in university dormitory',
        'Monthly meal allowance',
        'Textbook and study materials support',
        'Airport pickup service',
      ],
    },
    applicationDeadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
    startDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days from now
    duration: '4 years (Bachelor) / 2 years (Master)',
    availableSlots: 10,
    category: 'Business & Trade',
    tags: ['Full Tuition', 'Living Stipend', 'Business', 'Trade', 'Logistics'],
    status: 'published',
  },
  {
    _id: 'dummy-2',
    title: 'Chinese Language & Culture Scholarship',
    university: {
      name: 'Nadoumi Language Institute',
      country: 'China',
      city: 'Shenzhen',
      website: 'https://www.nadoumi-language.edu.cn',
      logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
    },
    description: `One-year intensive Chinese language program with cultural immersion and comprehensive preparation for degree studies in China.

This scholarship is designed for students who want to master Mandarin Chinese while experiencing authentic Chinese culture. The program combines rigorous language training with cultural activities, field trips, and academic preparation.

Program highlights:
• Intensive Mandarin classes (20 hours/week)
• Cultural immersion activities
• Preparation for HSK exams
• University application guidance
• Cultural exchange programs
• Homestay or dormitory accommodation

Upon completion, students will be well-prepared to apply for undergraduate or graduate programs at Chinese universities. The institute has partnerships with over 50 universities across China.`,
    requirements: {
      minGPA: 3.0,
      requiredLanguages: ['English'],
      requiredDegrees: ['High School Diploma'],
      ageLimit: 35,
      nationalityRestrictions: [],
    },
    benefits: {
      tuitionCoverage: 80,
      livingStipend: 2000,
      travelAllowance: false,
      healthInsurance: true,
      other: [
        'Free HSK exam registration',
        'Cultural activity fees covered',
        'Textbook and learning materials',
        '24/7 student support',
      ],
    },
    applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    startDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
    duration: '1 year',
    availableSlots: 20,
    category: 'Language',
    tags: ['Language', 'Culture', 'HSK', 'Intensive Program', 'Cultural Immersion'],
    status: 'published',
  },
  {
    _id: 'dummy-3',
    title: 'STEM Innovation Scholarship',
    university: {
      name: 'Shenzhen Institute of Technology',
      country: 'China',
      city: 'Shenzhen',
      website: 'https://www.szit.edu.cn',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
    },
    description: `Partial scholarship for high-achieving students in Computer Science, Electrical Engineering, and Data Science programs.

Shenzhen Institute of Technology is at the forefront of technological innovation, located in China's Silicon Valley. This scholarship supports talented students pursuing cutting-edge research and practical applications in STEM fields.

Scholarship benefits include:
• 70% tuition coverage
• Research funding opportunities
• Access to state-of-the-art laboratories
• Industry mentorship programs
• Internship placements at tech companies
• Conference and publication support

The institute has strong partnerships with leading tech companies including Huawei, Tencent, and BYD. Scholarship recipients often secure employment offers before graduation.`,
    requirements: {
      minGPA: 3.7,
      requiredLanguages: ['English'],
      requiredDegrees: ['High School Diploma (for Bachelor)', 'Bachelor\'s Degree (for Master\'s)'],
      ageLimit: 28,
      nationalityRestrictions: [],
    },
    benefits: {
      tuitionCoverage: 70,
      livingStipend: 2500,
      travelAllowance: true,
      healthInsurance: true,
      other: [
        'Research funding up to ¥50,000',
        'Laptop and software support',
        'Conference attendance funding',
        'Industry mentorship program',
      ],
    },
    applicationDeadline: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(), // 75 days from now
    startDate: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toISOString(), // 100 days from now
    duration: '4 years (Bachelor) / 2-3 years (Master/PhD)',
    availableSlots: 8,
    category: 'STEM',
    tags: ['STEM', 'Technology', 'Innovation', 'Research', 'Engineering', 'Computer Science'],
    status: 'published',
  },
]

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
          // On error, show dummy data instead of error message
          setData({
            scholarships: dummyScholarships,
            pagination: null,
          })
          setError('') // Clear error so dummy data shows
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
              {data.scholarships.length === 0 ? (
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