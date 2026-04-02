import React from 'react';
import Container from '../../../components/common/Container.jsx';
import ScholarshipCard from '../../../components/common/ScholarshipCard.jsx';
import { Link } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import { getFeaturedScholarships } from '../../../api/scholarships.js';
import LoadingSpinner from '../../../components/common/LoadingSpinner.jsx';

function FeaturedScholarships() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['featured-scholarships'],
    queryFn: () => getFeaturedScholarships(),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <section className="py-24 bg-white">
        <Container>
          <div className="flex justify-center"><LoadingSpinner /></div>
        </Container>
      </section>
    );
  }

  const scholarships = data?.data || [];

  if (isError || scholarships.length === 0) {
    return (
      <section className="py-24 bg-white">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-orange-600 font-bold uppercase tracking-widest text-xs mb-3 block">Opportunities</span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">Featured Scholarships</h2>
            </div>
          </div>
          <div className="py-16 text-center border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/50">
             <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No featured scholarships available yet</p>
             <p className="text-gray-500 text-sm mt-2 font-medium">Check back soon or explore our general programs.</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-orange-600 font-bold uppercase tracking-widest text-xs mb-3 block">Opportunities</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Featured Scholarships</h2>
          </div>
          <Link to="/scholarships" className="text-orange-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            View all <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {scholarships.slice(0, 3).map((s, i) => (
            <ScholarshipCard key={s.id || i} scholarship={s} variant="simple" />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default FeaturedScholarships;
