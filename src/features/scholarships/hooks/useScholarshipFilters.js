import { useState, useMemo } from 'react';

export function useScholarshipFilters(initialUniversities, itemsPerPage = 6) {
  const [activeSort, setActiveSort] = useState('ranking');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    location: 'All Locations',
    degreeTypes: [],
    subject: 'All Categories',
    rankMin: '',
    rankMax: '',
    language: 'English',
    tuitionRange: 100
  });

  const filteredUniversities = useMemo(() => {
    return initialUniversities.filter(uni => {
      const matchesSearch = filters.search === '' || 
        uni.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        uni.location.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesLocation = filters.location === 'All Locations' || 
        uni.location === filters.location;
      
      const matchesDegree = filters.degreeTypes.length === 0 || 
        filters.degreeTypes.some(d => uni.degreeTypes.includes(d));
      
      const matchesSubject = filters.subject === 'All Categories' || 
        uni.subjects.includes(filters.subject);
      
      const rankMin = parseInt(filters.rankMin) || 0;
      const rankMax = parseInt(filters.rankMax) || 10000;
      const matchesRank = uni.qsRank >= rankMin && uni.qsRank <= rankMax;
      
      const matchesLanguage = uni.language === filters.language;
      const matchesTuition = (uni.tuition / 1000) <= filters.tuitionRange;

      return matchesSearch && matchesLocation && matchesDegree && matchesSubject && matchesRank && matchesLanguage && matchesTuition;
    }).sort((a, b) => {
      if (activeSort === 'ranking') return a.qsRank - b.qsRank;
      if (activeSort === 'popularity') return b.popularity - a.popularity;
      if (activeSort === 'tuition') return a.tuition - b.tuition;
      return 0;
    });
  }, [initialUniversities, filters, activeSort]);

  const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage);
  const paginatedUniversities = filteredUniversities.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setFilters({
      search: '',
      location: 'All Locations',
      degreeTypes: [],
      subject: 'All Categories',
      rankMin: '',
      rankMax: '',
      language: 'English',
      tuitionRange: 100
    });
    setCurrentPage(1);
  };

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, search: query }));
    setCurrentPage(1);
  };

  return {
    filters,
    setFilters,
    clearFilters,
    handleSearch,
    activeSort,
    setActiveSort,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredUniversities,
    paginatedUniversities
  };
}
