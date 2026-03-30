import React from 'react';
import Container from '../../../components/common/Container.jsx';
import Button from '../../../components/common/Button.jsx';

const features = [
  {
    title: 'Affordable Excellence',
    description: 'World-class education with tuition and living costs significantly lower than in Western nations.',
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: 'Global Career',
    description: 'Gain direct exposure to the world\'s second largest economy and earn a language used by 1.3B people.',
    icon: (
       <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: 'Innovation Hub',
    description: 'Study at the forefront of AI, green energy, and 5G technology in the world\'s leading tech clusters.',
    icon: (
      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: 'Cultural Depth',
    description: 'Experience a rich 5,000-year history while living in some of the most futuristic cities on earth.',
    icon: (
      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  }
];

function WhyChooseUs() {
  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
          
          <div className="lg:w-1/2">
            <span className="text-orange-600 font-bold uppercase tracking-widest text-xs mb-3 block">Why Choose US</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">
              Empowering Global Students to Reach New Heights
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Nadoumi bridges the gap between international talent and Chinese academic excellence. Our platform simplifies the complex application process, ensuring we find the perfect program and the funding to support it.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                'Verified official scholarship listings only',
                'One-click application management system',
                'Direct communication with university admissions'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-900 font-bold italic">
                  <div className="bg-emerald-500 rounded-full p-1">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            
            <Button variant="primary" className="rounded-full px-10 py-4 font-black shadow-lg shadow-orange-200">
              Learn More About Studying in China
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default WhyChooseUs;
