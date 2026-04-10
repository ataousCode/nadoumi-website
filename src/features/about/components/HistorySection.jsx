import React from 'react';
import Container from '../../../components/common/Container.jsx';

function HistorySection({ title, content }) {
  return (
    <section className="py-24 bg-gray-50">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="sticky top-32">
            <span className="text-orange-600 font-black uppercase tracking-[0.2em] text-[10px] mb-4 block">
              Our Legacy
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight leading-tight">
              {title}
            </h2>
            <div className="w-20 h-1.5 bg-orange-600 rounded-full" />
          </div>
          <div className="relative">
            <div className="absolute -left-8 top-0 bottom-0 w-px bg-gray-200 hidden md:block" />
            <p className="text-gray-600 text-lg md:text-xl font-medium leading-[1.8] text-justify">
              {content}
            </p>
            
            <div className="mt-12 grid grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl bg-white shadow-premium border border-gray-100">
                <div className="text-4xl font-black text-orange-600 mb-2">10+</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Years Excellence</div>
              </div>
              <div className="p-8 rounded-3xl bg-white shadow-premium border border-gray-100">
                <div className="text-4xl font-black text-orange-600 mb-2">1000+</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Students Guided</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HistorySection;
