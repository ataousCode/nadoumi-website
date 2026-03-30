import React from 'react';
import Container from '../../../components/common/Container.jsx';
import TestimonialCard from '../../../components/common/TestimonialCard.jsx';

const testimonials = [
  {
    quote: "The portal made my dream of studying in Shanghai a reality. The scholarship filters were a lifesaver, and I secured full CSC funding!",
    author: "Elena Rodriguez",
    university: "MBA, Fudan University",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
  },
  {
    quote: "As an engineering student, finding the right technical university was easy. The support team answered all my visa questions.",
    author: "David Chen",
    university: "CS, Tsinghua University",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  },
  {
    quote: "I never thought I could afford to study abroad until I found the Belt & Road scholarship through this amazing platform.",
    author: "Amara Okeke",
    university: "Medicine, Zhejiang Uni",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
  }
];

function TestimonialSection() {
  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Scholar Success Stories</h2>
          <div className="w-20 h-1.5 bg-orange-600 mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default TestimonialSection;
