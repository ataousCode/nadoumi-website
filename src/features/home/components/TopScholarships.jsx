import React from 'react';
import Container from '../../../components/common/Container.jsx';
import ScholarshipCard from '../../../components/common/ScholarshipCard.jsx';
import { useQuery } from '@tanstack/react-query';
import { getScholarships } from '../../../api/scholarships.js';
import LoadingSpinner from '../../../components/common/LoadingSpinner.jsx';
import { Link } from 'react-router-dom';

function TopScholarships() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['top-scholarships-home'],
    queryFn: () => getScholarships({ isTop: true, limit: 3 })
  });

  if (isLoading) {
    return (
      <section className="py-24 bg-gray-50/50">
        <Container>
          <div className="flex justify-center"><LoadingSpinner /></div>
        </Container>
      </section>
    );
  }

  const scholarships = data?.data?.scholarships || [];

  if (isError || scholarships.length === 0) {
    return (
      <section className="py-24 bg-gray-50/50">
        <Container>
          <div className="flex justify-between items-end mb-12">
            <div className="max-w-xl">
              <span className="text-red-600 font-bold uppercase tracking-widest text-xs mb-3 block">Elite Opportunities</span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">Top Scholarships</h2>
            </div>
          </div>
          <div className="py-16 text-center border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-white">
             <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No top scholarships available yet</p>
             <p className="text-gray-500 text-sm mt-2 font-medium">Flag scholarships as 'Top' in the admin panel to show them here.</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50/50">
      <Container>
        <div className="flex justify-between items-end mb-12">
          <div className="max-w-xl">
            <span className="text-red-600 font-bold uppercase tracking-widest text-xs mb-3 block">Elite Opportunities</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Top Scholarships</h2>
          </div>
          <Link to="/scholarships" className="text-red-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            View all scholarships <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {scholarships.map((s) => (
            <ScholarshipCard key={s.id} scholarship={s} variant="simple" />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default TopScholarships;
