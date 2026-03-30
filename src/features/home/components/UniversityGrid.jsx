import React from 'react';
import Container from '../../../components/common/Container.jsx';
import UniversityIconCard from '../../../components/common/UniversityIconCard.jsx';

import { useQuery } from '@tanstack/react-query';
import { getUniversities } from '../../../api/universities.js';
import LoadingSpinner from '../../../components/common/LoadingSpinner.jsx';

function UniversityGrid() {
  const { data, isLoading } = useQuery({
    queryKey: ['recommended-universities'],
    queryFn: () => getUniversities({ isRecommended: true, limit: 10 })
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

  const colors = ['blue', 'indigo', 'purple', 'rose', 'orange', 'emerald'];

  return (
    <section className="py-24 bg-gray-50/50">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Top Universities in China</h2>
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
