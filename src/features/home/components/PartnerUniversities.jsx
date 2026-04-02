import React from 'react';
import Container from '../../../components/common/Container.jsx';
import UniversityCard from '../../../components/common/UniversityCard.jsx';
import { useQuery } from '@tanstack/react-query';
import { getUniversities } from '../../../api/universities.js';
import LoadingSpinner from '../../../components/common/LoadingSpinner.jsx';
import { Link } from 'react-router-dom';

function PartnerUniversities() {
  const { data, isLoading } = useQuery({
    queryKey: ['partner-universities'],
    queryFn: () => getUniversities({ isPartner: true, limit: 3 })
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-orange-600 font-black uppercase tracking-[0.2em] text-[10px] mb-4 block">Global Network</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Partner Universities</h2>
            <p className="text-gray-500 text-lg font-medium leading-relaxed">
              Exclusive partnerships with world-class institutions to provide you with seamless admission and scholarship opportunities.
            </p>
          </div>
          <Link to="/universities" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-orange-600 hover:shadow-2xl hover:shadow-orange-200">
            View All Partners
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

export default PartnerUniversities;
