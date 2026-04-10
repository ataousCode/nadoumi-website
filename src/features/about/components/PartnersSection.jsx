import React from 'react';
import Container from '../../../components/common/Container.jsx';

const images = import.meta.glob('../../../assets/images/*.{jpg,jpeg,png,webp,svg}', { eager: true });
const resolveImage = (path) => {
  if (!path) return '';
  const filename = path.split('/').pop();
  return images[`../../../assets/images/${filename}`]?.default || path;
};

function PartnersSection({ partners = [] }) {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle Background Text */}
      <div className="absolute top-10 left-10 text-[10vw] font-black text-gray-50 opacity-50 select-none -z-0">
        NETWORK
      </div>
      
      <Container className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl text-left">
            <span className="text-orange-600 font-black uppercase tracking-[0.2em] text-[10px] mb-4 block">
              Direct Collaboration
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-none">
              University Partners <br/>
              <span className="text-orange-600">& Global Network</span>
            </h2>
          </div>
          <p className="text-gray-500 font-medium text-right max-w-xs hidden md:block">
            Establishing trusted bridges between students and world-class institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {partners.map((partner) => (
            <div 
              key={partner.id} 
              className="group relative aspect-[16/10] rounded-[2rem] overflow-hidden bg-gray-100 shadow-premium hover:shadow-2xl transition-all duration-500"
            >
              <img 
                src={resolveImage(partner.image)} 
                alt={`Partner Network ${partner.id}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Glass Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Inner Border */}
              <div className="absolute inset-4 border border-white/20 rounded-[1.5rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100" />
            </div>
          ))}
        </div>
        
        <div className="mt-20 pt-10 border-t border-gray-100 flex flex-wrap justify-center gap-10 opacity-40 grayscale">
          {/* Subtle repetition for "Enterprise" feel */}
          <div className="font-black text-sm tracking-tighter uppercase">Excellence</div>
          <div className="font-black text-sm tracking-tighter uppercase">Integrity</div>
          <div className="font-black text-sm tracking-tighter uppercase">Global Reach</div>
          <div className="font-black text-sm tracking-tighter uppercase">Education First</div>
        </div>
      </Container>
    </section>
  );
}

export default PartnersSection;
