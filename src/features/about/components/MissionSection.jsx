import React from 'react';
import Container from '../../../components/common/Container.jsx';

function MissionSection({ title, content }) {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-100/30 rounded-full blur-[120px] -z-0" />
      
      <Container className="relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-orange-600 font-black uppercase tracking-[0.2em] text-[10px] mb-6 block">
            Our Purpose
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-10 tracking-tight">
            {title}
          </h2>
          
          <div className="relative p-12 md:p-16 rounded-[3rem] bg-white shadow-premium border border-gray-100">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-orange-600 rounded-2xl shadow-xl shadow-orange-200 flex items-center justify-center text-white">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <p className="text-gray-700 text-xl md:text-2xl font-bold leading-relaxed text-balance italic">
              "{content}"
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group">
              <div className="text-gray-900 font-black text-lg mb-2 group-hover:text-orange-600 transition-colors">Integrity</div>
              <p className="text-gray-500 text-sm font-medium">Upholding the highest standards of honesty and transparency.</p>
            </div>
            <div className="group">
              <div className="text-gray-900 font-black text-lg mb-2 group-hover:text-orange-600 transition-colors">Professionalism</div>
              <p className="text-gray-500 text-sm font-medium">Delivering expert guidance with precision and excellence.</p>
            </div>
            <div className="group">
              <div className="text-gray-900 font-black text-lg mb-2 group-hover:text-orange-600 transition-colors">Student-Centered</div>
              <p className="text-gray-500 text-sm font-medium">Putting learners' ambitions at the heart of every decision.</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default MissionSection;
