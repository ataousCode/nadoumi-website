import React from 'react';
import Container from '../../../components/common/Container.jsx';
import GlobalSearch from '../../../components/common/GlobalSearch.jsx';

function ProgramHero({ onSearch }) {
  const handleSearch = (data) => {
    onSearch?.(data);
  };

  return (
    <section className="bg-white pt-16 pb-8 overflow-hidden">
      <Container>
        <div className="max-w-xl mx-auto text-center mb-10 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
            Academic <span className="text-orange-600">Programs</span>
          </h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
            Discover world-class English and Chinese medium majors from top-tier institutions.
          </p>
        </div>

        <GlobalSearch 
          placeholder="Search majors, programs or subjects..."
          onSearch={handleSearch}
          showCategories={true}
        />
      </Container>
    </section>
  );
}

export default ProgramHero;
