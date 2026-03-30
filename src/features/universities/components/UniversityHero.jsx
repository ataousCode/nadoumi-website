import React, { useState } from 'react';
import Container from '../../../components/common/Container.jsx';
import { cn } from '../../../utils/cn';

import GlobalSearch from '../../../components/common/GlobalSearch.jsx';

function UniversityHero({ onSearch }) {
  const handleSearch = (data) => {
    onSearch?.(data.query);
  };

  return (
    <section className="bg-white pt-16 pb-8 overflow-hidden">
      <Container>
        <div className="max-w-xl mx-auto text-center mb-8 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
            Discover Your <span className="text-orange-600">Future</span> Campus
          </h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
            Access 2,500+ premium institutions in China. Find your ideal academic base.
          </p>
        </div>

        <GlobalSearch 
          placeholder="Search institutions, cities or majors..."
          onSearch={handleSearch}
          showCategories={false}
        />
      </Container>
    </section>
  );
}


export default UniversityHero;
