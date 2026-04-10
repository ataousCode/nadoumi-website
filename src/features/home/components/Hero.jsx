import React, { useState, useEffect } from 'react';
import Container from '../../../components/common/Container.jsx';
import HeroSearch from './HeroSearch.jsx';
import { cn } from '../../../utils/cn';

const HERO_IMAGES = [
  '/src/assets/images/hero-group.png',
  '/src/assets/images/student.jpg',
  '/src/assets/images/student1.jpg',
  '/src/assets/images/student2.jpg',
];

function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center pt-28 pb-20 overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        {HERO_IMAGES.map((img, index) => (
          <div 
            key={img}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <div className={cn(
              "absolute inset-0 scale-105",
              index === currentIndex && "animate-slow-zoom"
            )}>
              <img 
                src={img} 
                className="w-full h-full object-cover"
                alt={`Slide ${index + 1}`}
              />
              {/* Cinematic Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 backdrop-blur-[1px]" />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </div>
        ))}
      </div>

      <Container className="relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1] animate-fade-in-up">
            Build Your <br className="hidden md:block"/> Future <span className="text-orange-500">in China</span>
          </h1>
          <p className="text-base md:text-xl text-white/90 mb-10 max-w-xl mx-auto font-medium leading-relaxed animate-fade-in-up [animation-delay:200ms]">
            Discover 5,000+ fully-funded scholarships and world-class programs at China's most prestigious institutions.
          </p>

          <HeroSearch />

          {/* Stats Badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-10 animate-fade-in-up [animation-delay:400ms]">
            <div className="flex items-center gap-4 text-white/70 group cursor-default">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-orange-500/50 transition-colors">
                 <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xl font-black text-white leading-none">5,000+</div>
                <div className="text-[10px] font-bold uppercase tracking-widest mt-1">Scholarships</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-white/70 group cursor-default">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-orange-500/50 transition-colors">
                 <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xl font-black text-white leading-none">150+</div>
                <div className="text-[10px] font-bold uppercase tracking-widest mt-1">Top Universities</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Hero;
