import React from 'react';
import Container from '../../../components/common/Container.jsx';
import { cn } from '../../../utils/cn';

const images = import.meta.glob('../../../assets/images/*.{jpg,jpeg,png,webp,svg}', { eager: true });
const resolveImage = (path) => {
  if (!path) return '';
  const filename = path.split('/').pop();
  return images[`../../../assets/images/${filename}`]?.default || path;
};

function AboutHero({ 
  title = "About Nadoumi", 
  subtitle = "Our Journey & Commitment",
  description = "Empowering students through professional guidance and stable industry cooperation since 2014."
}) {
  const bgImage = resolveImage('student.jpg');

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0 z-0 scale-105 animate-slow-zoom">
        <img 
          src={bgImage} 
          className="w-full h-full object-cover"
          alt="About Nadoumi Background"
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>
      
      <Container className="relative z-10">
        <div className="max-w-3xl">
          <span className="text-orange-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4 block animate-fade-in-up">
            Founded in 2014
          </span>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1] animate-fade-in-up [animation-delay:100ms]">
            {title} <br/>
            <span className="text-orange-500">{subtitle}</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl font-medium leading-relaxed max-w-2xl animate-fade-in-up [animation-delay:200ms]">
            {description}
          </p>
          
          <div className="mt-12 flex items-center gap-6 animate-fade-in-up [animation-delay:300ms]">
            <div className="h-px w-12 bg-orange-500" />
            <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em]">Scroll to Discover Our Legacy</span>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default AboutHero;