import React from 'react';
import Container from '../components/common/Container.jsx';
import ScholarshipHero from '../features/scholarships/components/ScholarshipHero.jsx';
import FilterSidebar from '../features/scholarships/components/FilterSidebar.jsx';
import ScholarshipCard from '../components/common/ScholarshipCard.jsx';
import ScholarshipTable from '../features/scholarships/components/ScholarshipTable.jsx';
import { Icons } from '../assets/icons/Icons.jsx';
import { cn } from '../utils/cn';

const sortOptions = [
  { id: 'ranking', label: 'Ranking' },
  { id: 'popularity', label: 'Popularity' },
  { id: 'tuition', label: 'Tuition' },
];

import { useQuery } from '@tanstack/react-query';
import { getScholarships } from '../api/scholarships.js';
import { useSearchParams } from 'react-router-dom';

const catMap = {
  'language': 'Language',
  'bachelor': 'Bachelor',
  'master': 'Master',
  'phd': 'PhD',
  'Language': 'Language',
  "Bachelor's": 'Bachelor',
  "Master's": 'Master',
  'PhD': 'PhD'
};

const reverseCatMap = {
  'Language': 'Language',
  'Bachelor': "Bachelor's",
  'Master': "Master's",
  'PhD': 'PhD'
};

const Scholarships = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSort, setActiveSort] = React.useState('ranking');
  const [viewMode, setViewMode] = React.useState('list'); // 'list' or 'grid'
  const [currentPage, setCurrentPage] = React.useState(1);

  const initialProgramCat = searchParams.get('programCategory');
  const initialDegreeTypes = initialProgramCat && reverseCatMap[initialProgramCat] 
    ? [reverseCatMap[initialProgramCat]] 
    : [];

  const [filters, setFilters] = React.useState({
    search: searchParams.get('search') || '',
    location: 'All Locations',
    degreeTypes: initialDegreeTypes,
    subject: 'All Categories',
    rankMin: '',
    rankMax: '',
    language: 'English',
    tuitionRange: 100
  });

  // Sync state with URL params when they change (e.g., from Home Hero)
  React.useEffect(() => {
    const urlQuery = searchParams.get('search') || '';
    const urlCat = searchParams.get('programCategory');
    
    setFilters(prev => ({
      ...prev,
      search: urlQuery,
      degreeTypes: urlCat && reverseCatMap[urlCat] ? [reverseCatMap[urlCat]] : prev.degreeTypes
    }));
    setCurrentPage(1);
  }, [searchParams]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['scholarships', filters, activeSort, currentPage],
    queryFn: () => {
      const programCategories = filters.degreeTypes.map(d => catMap[d]).filter(Boolean);

      return getScholarships({
        ...filters,
        programCategories: programCategories.length > 0 ? programCategories : undefined,
        page: currentPage,
        limit: 12,
        sort: activeSort
      });
    }
  });

  const scholarships = data?.data?.scholarships || [];
  const totalPages = data?.data?.pagination?.totalPages || 1;
  const totalItems = data?.data?.pagination?.total || 0;

  const handleSearch = (searchData) => {
    // GlobalSearch returns { query, category }
    const { query, category } = typeof searchData === 'object' ? searchData : { query: searchData };
    
    setFilters(prev => ({ 
      ...prev, 
      search: query || '',
      degreeTypes: category && category !== 'all' && reverseCatMap[catMap[category] || category]
        ? [reverseCatMap[catMap[category] || category]]
        : prev.degreeTypes
    }));
    setCurrentPage(1);
  };

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
    setSearchParams({}); // Clear URL params too
    setCurrentPage(1);
  };

  return (
    <div className="bg-white">
      <ScholarshipHero onSearch={handleSearch} />
      
      <Container className="py-20">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <FilterSidebar 
            filters={filters} 
            setFilters={setFilters} 
            onClear={clearFilters} 
          />

          {/* Main Feed */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <div className="flex flex-col gap-1">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">
                  Showing <span className="text-gray-900">{totalItems}</span> Scholarships
                </h2>
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-0.5 mt-1 animate-pulse">
                  {viewMode === 'list' ? 'List mode Active' : 'Grid mode Active'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                {/* Sort Sort */}
                <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-xl transition-all h-12">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3">Sort by:</span>
                   {sortOptions.map((opt) => (
                     <button
                      key={opt.id}
                      onClick={() => {
                        setActiveSort(opt.id);
                        setCurrentPage(1);
                      }}
                      className={cn(
                        "py-2.5 px-5 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all h-full",
                        activeSort === opt.id 
                          ? "bg-white text-orange-600 shadow-sm" 
                          : "text-gray-400 hover:text-gray-600"
                      )}
                     >
                       {opt.label}
                     </button>
                   ))}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center p-1 bg-gray-100/50 rounded-xl border border-gray-100 h-10 ml-auto">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "w-10 h-8 flex items-center justify-center rounded-lg transition-all",
                      viewMode === 'grid' ? "bg-white text-orange-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                    title="Grid View"
                  >
                    <Icons.Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "w-10 h-8 flex items-center justify-center rounded-lg transition-all",
                      viewMode === 'list' ? "bg-white text-orange-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                    title="List View"
                  >
                    <Icons.List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* List / Grid Render */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[400px] bg-gray-50 animate-pulse rounded-3xl" />
                ))}
              </div>
            ) : scholarships.length > 0 ? (
              viewMode === 'list' ? (
                <ScholarshipTable scholarships={scholarships} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {scholarships.map((s) => (
                    <ScholarshipCard 
                      key={s.id} 
                      scholarship={s}
                      variant="detailed"
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="col-span-full py-20 text-center animate-fade-in">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No scholarships found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your filters or search keywords.</p>
              </div>
            )}

            {/* Dynamic Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-30"
                >
                  <Icons.ChevronLeft className="w-5 h-5" />
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
                  <Icons.ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Scholarships;
