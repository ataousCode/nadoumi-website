import React, { useState } from 'react';
import Container from '../components/common/Container.jsx';
import { cn } from '../utils/cn';
import UniversityHero from '../features/universities/components/UniversityHero.jsx';
import UniversityCard from '../features/universities/components/UniversityCard.jsx';
import UniversitySidebar from '../features/universities/components/UniversitySidebar.jsx';

import { useQuery } from '@tanstack/react-query';
import { getUniversities } from '../api/universities.js';

function Universities() {
  const [activeSort, setActiveSort] = useState('ranking');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [filters, setFilters] = useState({
    search: '',
    location: 'All Locations',
    universityTypes: [],
    tiers: [],
    rankMin: '',
    rankMax: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['universities', filters, activeSort, currentPage],
    queryFn: () => getUniversities({
      ...filters,
      page: currentPage,
      limit: itemsPerPage,
      sort: activeSort
    }),
    keepPreviousData: true
  });

  const universities = data?.data?.universities || [];
  const totalItems = data?.data?.pagination?.total || 0;
  const totalPages = data?.data?.pagination?.totalPages || 1;

  const sortOptions = [
    { id: 'ranking', label: 'Ranking' },
    { id: 'popularity', label: 'Popularity' },
    { id: 'scholarships', label: 'Scholarships' },
  ];

  const clearFilters = () => {
    setFilters({
      search: '',
      location: 'All Locations',
      universityTypes: [],
      tiers: [],
      rankMin: '',
      rankMax: '',
    });
    setCurrentPage(1);
  };

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, search: query }));
    setCurrentPage(1);
  };

  return (
    <div className="bg-white">
      <UniversityHero onSearch={handleSearch} />
      
      <Container className="py-20">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <UniversitySidebar 
            filters={filters} 
            setFilters={setFilters} 
            onClear={clearFilters} 
          />

          {/* Main Feed */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Showing <span className="text-gray-900">{totalItems}</span> Institutions
              </h2>

              <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-xl transition-all">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3">Sort by:</span>
                 {sortOptions.map((opt) => (
                   <button
                    key={opt.id}
                    onClick={() => {
                      setActiveSort(opt.id);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      "py-2 px-5 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all",
                      activeSort === opt.id 
                        ? "bg-white text-orange-600 shadow-sm" 
                        : "text-gray-400 hover:text-gray-600"
                    )}
                   >
                     {opt.label}
                   </button>
                 ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-gray-50 animate-pulse rounded-[2.5rem]" />
                ))
              ) : universities.length > 0 ? (
                universities.map((uni) => (
                  <UniversityCard key={uni.id || uni.universityId} {...uni} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No institutions found</h3>
                  <p className="text-gray-500 text-sm">Try adjusting your keywords or filters.</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={cn(
                      "w-12 h-12 rounded-xl font-black text-xs transition-all",
                      currentPage === i + 1 
                        ? "bg-orange-600 text-white shadow-lg shadow-orange-100" 
                        : "text-gray-400 hover:bg-gray-50"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Universities;
