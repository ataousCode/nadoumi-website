import React from 'react';
import Container from '../../../components/common/Container.jsx';
import JourneyStep from '../../../components/common/JourneyStep.jsx';

const steps = [
  {
    number: 1,
    title: 'Search & Shortlist',
    description: 'Browse thousands of programs and scholarships tailored to your academic background.'
  },
  {
    number: 2,
    title: 'Single Application',
    description: 'Fill out one profile and apply to multiple universities and scholarships simultaneously.'
  },
  {
    number: 3,
    title: 'Get Your Admission',
    description: 'Track your application status and receive your official JW201/202 visa forms online.'
  }
];

function JourneySection() {
  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Subtle decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl -ml-48 -mb-48" />

      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Your Journey Starts Here</h2>
          <p className="text-orange-100/60 font-medium italic">Three simple steps to secure your place in a top Chinese university.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {steps.map((s, i) => (
            <JourneyStep key={i} {...s} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default JourneySection;
