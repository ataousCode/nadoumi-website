import React from 'react';
import Container from '../../../components/common/Container.jsx';
import UniversityCard from '../../../components/common/UniversityCard.jsx';
import { useQuery } from '@tanstack/react-query';
import { getUniversities } from '../../../api/universities.js';
import LoadingSpinner from '../../../components/common/LoadingSpinner.jsx';
import { Link } from 'react-router-dom';

function TopUniversitiesChina() {
  const { data, isLoading } = useQuery({
    queryKey: ['top-universities-china-home'],
    queryFn: () => getUniversities({ isTop: true, limit: 3 }) // 3 to match Featured layout
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

  const universities = data?.data?.universities || [];

  if (universities.length === 0 && !isLoading) return null;

  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="flex justify-between items-end mb-12">
          <div className="max-w-xl">
            <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs mb-3 block">Academic Prestige</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Top Universities in China</h2>
          </div>
          <Link to="/universities" className="text-indigo-600 font-bold flex items-center gap-2 hover:gap-3 transition-all underline decoration-indigo-100 decoration-4 underline-offset-8">
            View all universities <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {universities.map((u) => (
            <UniversityCard 
              key={u.id} 
              university={u} 
              variant="simple" 
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default TopUniversitiesChina;
