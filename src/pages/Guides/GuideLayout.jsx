import React from 'react';
import Container from '../../components/common/Container.jsx';

const GuideLayout = ({ title, subtitle, image, children }) => {
  return (
    <div className="bg-white pt-20">
      {/* Header Section */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden bg-orange-950">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end pb-20">
          <Container>
            <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-orange-600 rounded-full text-white font-black uppercase tracking-[0.2em] text-[10px] mb-8 shadow-xl shadow-orange-900/40 border border-orange-500 animate-in fade-in zoom-in duration-700">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Nadoumi Education Guide
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tight leading-none">
                {title}
              </h1>
              <p className="text-xl text-gray-200 font-medium leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            </div>
          </Container>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-24 animate-in fade-in duration-1000 delay-300">
        <Container>
          {children}
        </Container>
      </div>
    </div>
  );
};

export default GuideLayout;
