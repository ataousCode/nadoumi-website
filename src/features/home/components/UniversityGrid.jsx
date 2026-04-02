import React from 'react';
import Container from '../../../components/common/Container.jsx';
import UniversityIconCard from '../../../components/common/UniversityIconCard.jsx';

import { useQuery } from '@tanstack/react-query';
import { getUniversities } from '../../../api/universities.js';
import LoadingSpinner from '../../../components/common/LoadingSpinner.jsx';

function UniversityGrid() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['explore-universities-home'],
    queryFn: () => getUniversities({ limit: 10 })
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
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Explore Institutions</h2>
            <p className="text-gray-600 font-medium italic">Our database of partner universities is constantly growing.</p>
          </div>
          <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-white/50">
             <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No universities available in the system yet</p>
          </div>
        </Container>
      </section>
    );
  }

  const colors = ['blue', 'indigo', 'purple', 'rose', 'orange', 'emerald'];

  return (
    <section id="explore-universities" className="py-24 bg-gray-50/50">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Our Institutions</h2>
          <p className="text-gray-600 font-medium">Join a community of global scholars at Asia's highest-ranking academic institutions.</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {universities.map((u, i) => (
            <UniversityIconCard 
              key={u.id || i} 
              {...u} 
              rank={`QS Rank: #${u.qsRank || 'N/A'}`}
              color={colors[i % colors.length]}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default UniversityGrid;
