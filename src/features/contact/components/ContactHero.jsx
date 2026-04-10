import React from 'react';
import Container from '../../../components/common/Container.jsx';

function ContactHero({ 
  title = "Contact Us", 
  subtitle = "We're Here to Help",
  description = "Have questions about scholarships or admissions? Reach out to our team of experts."
}) {
  return (
    <section className="relative pt-32 pb-20 bg-white overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-50/30 skew-x-12 translate-x-1/4 -z-0" />
      
      <Container className="relative z-10">
        <div className="max-w-3xl">
          <span className="text-orange-600 font-black uppercase tracking-[0.2em] text-[10px] mb-4 block animate-fade-in-up">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight animate-fade-in-up [animation-delay:100ms]">
            {title} <br/>
            <span className="text-orange-600">{subtitle}</span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed max-w-2xl animate-fade-in-up [animation-delay:200ms]">
            {description}
          </p>
        </div>
      </Container>
    </section>
  );
}

export default ContactHero;
