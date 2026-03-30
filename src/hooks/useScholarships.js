import { useQuery } from '@tanstack/react-query'
import { getScholarships, getScholarship } from '../api/scholarships'

export function useScholarships(filters = {}) {
  return useQuery({
    queryKey: ['scholarships', filters],
    queryFn: () => getScholarships(filters),
    // Keep data on filters change to avoid flashes
    placeholderData: (previousData) => previousData,
  })
}

export function useScholarship(id) {
  return useQuery({
    queryKey: ['scholarship', id],
    queryFn: () => getScholarship(id),
    enabled: !!id,
  })
}
