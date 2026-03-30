import React from 'react';
import Container from '../../../components/common/Container.jsx';
import ScholarshipCard from '../../../components/common/ScholarshipCard.jsx';
import { useQuery } from '@tanstack/react-query';
import { getScholarships } from '../../../api/scholarships.js';
import LoadingSpinner from '../../../components/common/LoadingSpinner.jsx';
import { Link } from 'react-router-dom';

function RecommendedSelfFinanced() {
  const { data, isLoading } = useQuery({
    queryKey: ['recommended-self-financed'],
    queryFn: () => getScholarships({ scholarshipCategory: 'Self_funded', limit: 3 })
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

  const scholarships = data?.data?.scholarships || data?.data || [];

  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px] mb-4 block">Self-Financed Programs</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Recommended Self-financed Programs</h2>
            <p className="text-gray-500 text-lg font-medium">
              High-value programs with competitive tuition rates and direct admission pathways for motivated students.
            </p>
          </div>
          <Link to="/scholarships?category=Self_funded" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-emerald-600 hover:shadow-2xl hover:shadow-emerald-200">
            View All Programs
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
        
        {scholarships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {scholarships.slice(0, 3).map((s) => (
              <ScholarshipCard key={s.id} scholarship={s} variant="detailed" />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[40px] bg-gray-50/50">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No self-financed programs added yet</p>
            <p className="text-gray-500 text-sm mt-2">Check the admin panel to mark scholarships as "Self-funded".</p>
          </div>
        )}
      </Container>
    </section>
  );
}

export default RecommendedSelfFinanced;
