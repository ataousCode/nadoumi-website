import React from 'react';
import Container from '../../../components/common/Container.jsx';

const images = import.meta.glob('../../../assets/images/*.{jpg,jpeg,png,webp,svg}', { eager: true });
const resolveImage = (path) => {
  if (!path) return '';
  const filename = path.split('/').pop();
  return images[`../../../assets/images/${filename}`]?.default || path;
};

function Team({ members = [] }) {
  return (
    <section className="py-24 bg-gray-50/50">
      <Container>
        <div className="text-center mb-16">
          <span className="text-orange-600 font-black uppercase tracking-[0.2em] text-[10px] mb-4 block">
            The Founding Team
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
            Expert Guidance
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {members.map((member) => (
            <div key={member.id} className="group flex flex-col items-center text-center">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[2.5rem] mb-8 shadow-premium group-hover:shadow-2xl transition-all duration-500">
                <img 
                  src={resolveImage(member.image)} 
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute inset-0 border-[12px] border-white/0 group-hover:border-white/10 transition-all duration-500 pointer-events-none rounded-[2.5rem]" />
              </div>
              
              <div className="px-4">
                <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {member.name}
                </h3>
                <p className="text-orange-600 font-bold uppercase tracking-widest text-[10px] mb-4">
                  {member.position}
                </p>
                {member.bio && (
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">
                    {member.bio}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Team;