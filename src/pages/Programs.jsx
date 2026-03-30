import React, { useState } from 'react';
import Container from '../components/common/Container.jsx';
import ProgramHero from '../features/programs/components/ProgramHero.jsx';
import ProgramSidebar from '../features/programs/components/ProgramSidebar.jsx';
import ProgramCard from '../features/programs/components/ProgramCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { cn } from '../utils/cn';

import { useQuery } from '@tanstack/react-query';
import { getPrograms, getProgramCategories } from '../api/programs.js';

function Programs() {
  const [filters, setFilters] = useState({
    search: '',
    category: 'Bachelor',
    languages: [],
    tuitionTier: null,
    tuitionMin: null,
    tuitionMax: null,
    categories: []
  });
  const activeSort = 'popular';
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const { data: categoriesData } = useQuery({
    queryKey: ['program-categories'],
    queryFn: getProgramCategories
  });

  const categories = categoriesData?.data || ["Engineering", "Business", "Medicine", "Arts & Humanities", "Social Sciences"];

  const { data, isLoading } = useQuery({
    queryKey: ['programs', filters, activeSort, currentPage],
    queryFn: () => {
      const languageMap = {
        'English Medium': 'English',
        'Chinese Medium': 'Chinese'
      };

      const params = {
        category: filters.category,
        teachingLanguage: filters.languages?.length > 0 
          ? languageMap[filters.languages[0]] 
          : undefined,
        field: filters.categories?.length > 0 ? filters.categories[0] : undefined,
        search: filters.search,
        page: currentPage,
        limit: itemsPerPage,
        sort: activeSort,
        tuitionMin: filters.tuitionMin,
        tuitionMax: filters.tuitionMax
      };

      return getPrograms(params);
    },
    keepPreviousData: true
  });

  const programs = data?.data?.programs || [];
  const totalItems = data?.data?.pagination?.total || 0;
  const totalPages = data?.data?.pagination?.totalPages || 1;

  const handleSearch = (data) => {
    setFilters(prev => ({ ...prev, search: data.query, category: data.category }));
    setCurrentPage(1);
  };

  const handleClear = () => {
    setFilters({
      search: '',
      category: 'Bachelor',
      languages: [],
      tuitionTier: null,
      tuitionMin: null,
      tuitionMax: null,
      categories: []
    });
    setCurrentPage(1);
  };
   // Add sorting logic if needed on API side or here

  return (
    <main className="min-h-screen bg-white">
      <ProgramHero onSearch={handleSearch} />

      <Container className="py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters */}
          <ProgramSidebar 
            filters={filters} 
            setFilters={setFilters} 
            onClear={handleClear}
            categories={categories}
          />

          {/* Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Showing <span className="text-gray-900">{totalItems}</span> Academic Programs
              </h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 bg-gray-50 animate-pulse rounded-3xl" />
                ))}
              </div>
            ) : programs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                  {programs.map((program) => (
                    <ProgramCard key={program.id} {...program} />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-30"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={cn(
                          "h-10 w-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all",
                          p === currentPage 
                            ? "bg-orange-600 text-white shadow-lg shadow-orange-100" 
                            : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-30"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-50 rounded-3xl p-16 text-center border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-soft flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">No programs found</h3>
                <p className="text-sm text-gray-400 font-medium">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}

export default Programs;
