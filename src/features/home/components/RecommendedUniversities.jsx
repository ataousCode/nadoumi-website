import React from 'react';
import Container from '../../../components/common/Container.jsx';
import UniversityCard from '../../universities/components/UniversityCard.jsx';
import { useQuery } from '@tanstack/react-query';
import { getUniversities } from '../../../api/universities.js';
import LoadingSpinner from '../../../components/common/LoadingSpinner.jsx';
import { Link } from 'react-router-dom';

function RecommendedUniversities() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['recommended-universities-home'],
    queryFn: () => getUniversities({ isRecommended: true, limit: 3 })
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

  const universities = data?.data?.universities || [];

  if (isError || universities.length === 0) {
    return (
      <section className="py-24 bg-gray-50/50">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-indigo-600 font-black uppercase tracking-[0.2em] text-[10px] mb-4 block">Nadoumi Selection</span>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Recommended by Nadoumi</h2>
            </div>
          </div>
          <div className="py-16 text-center border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-white">
             <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No recommended universities available yet</p>
             <p className="text-gray-500 text-sm mt-2 font-medium">Flag universities as 'Recommended' in the admin panel to show them here.</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50/50">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-indigo-600 font-black uppercase tracking-[0.2em] text-[10px] mb-4 block">Nadoumi Selection</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Recommended by Nadoumi</h2>
            <p className="text-gray-500 text-lg font-medium">
              Hand-picked institutions known for their excellence in teaching, research, and international student support.
            </p>
          </div>
          <Link to="/universities" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-orange-600 hover:shadow-2xl hover:shadow-orange-200">
            Explore All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {universities.map((u) => (
            <UniversityCard key={u.id} university={u} variant="simple" />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default RecommendedUniversities;
