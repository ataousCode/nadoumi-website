import React, { useState } from 'react';
import Container from '../../../components/common/Container.jsx';
import { cn } from '../../../utils/cn';

import GlobalSearch from '../../../components/common/GlobalSearch.jsx';

function ScholarshipHero({ onSearch }) {
  const handleSearch = (data) => {
    onSearch?.(data.query);
  };

  return (
    <section className="bg-white pt-28 pb-8 overflow-hidden">
      <Container>
        <div className="max-w-xl mx-auto text-center mb-8 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
            Premium <span className="text-orange-600">Scholarships</span> in China
          </h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
            Find and apply for hundreds of fully-funded government programs.
          </p>
        </div>

        <GlobalSearch 
          placeholder="Search scholarships, majors, or cities..."
          onSearch={handleSearch}
          showCategories={false}
        />
      </Container>
    </section>
  );
}


export default ScholarshipHero;
