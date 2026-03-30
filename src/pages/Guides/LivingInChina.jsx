import React from 'react';
import GuideLayout from './GuideLayout.jsx';
import headerImage from '../../assets/images/guides/living-china.png';

const lifestyleCards = [
  {
    title: 'Cost of Living',
    icon: '💰',
    content: 'Studying in China is highly affordable. On average, students spend between $300 - $700 per month on living expenses, depending on the city.',
    details: ['Meal: $2 - $5', 'Monthly Transport: $15 - $25', 'Dormitory: $500 - $1500 / year']
  },
  {
    title: 'Technology & Apps',
    icon: '📱',
    content: "China is a cashless society. You'll need WeChat and Alipay for everything—from buying street food to paying tuition.",
    details: ['WeChat Pay / Alipay', 'Meituan (Food delivery)', 'Baidu Maps']
  },
  {
    title: 'Food & Dining',
    icon: '🍜',
    content: "Chinese cuisine is incredibly diverse. From spicy Sichuan hotpot to delicate Cantonese dim sum, there's something for every palate.",
    details: ['Street Food Culture', 'University Canteens', 'Halal options available']
  },
  {
    title: 'Transportation',
    icon: '🚄',
    content: 'High-speed trains connect major cities in hours. Within cities, extensive subway systems and bike-sharing make commuting effortless.',
    details: ['High-speed rail', 'Shared bicycles', 'DiDi (Ride-hailing)']
  }
];

const LivingInChina = () => {
  return (
    <GuideLayout 
      title="Living in China"
      subtitle="Beyond the classroom. Experience a vibrant, high-tech, and culturally rich lifestyle. Your guide to daily life, culture, and essentials."
      image={headerImage}
    >
      <div className="max-w-6xl mx-auto space-y-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {lifestyleCards.map(card => (
            <div key={card.title} className="bg-white p-10 rounded-[3rem] border border-gray-100 hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 group">
              <div className="text-4xl mb-6">{card.icon}</div>
              <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">{card.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">{card.content}</p>
              <div className="space-y-2">
                {card.details.map(detail => (
                   <div key={detail} className="flex items-center gap-3 text-[10px] font-black text-orange-600 uppercase tracking-widest whitespace-nowrap">
                      <div className="w-1 h-1 bg-orange-500 rounded-full" />
                      {detail}
                   </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
           <div className="lg:col-span-2 space-y-12">
              <div className="space-y-6">
                 <span className="text-orange-500 font-black uppercase tracking-[0.3em] text-[10px] block">Cultural Immersion</span>
                 <h2 className="text-5xl font-black text-gray-900 tracking-tight leading-none">Traditional Customs & Modern Life</h2>
                 <p className="text-xl text-gray-500 leading-relaxed font-medium">While China is rapidly modernizing, traditional values remains central to daily life. Respect, collective harmony, and the concept of "Mianzi" (face) are core to social interactions.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 {[
                   { t: 'Festivals', d: 'Chinese New Year, Mid-Autumn Festival, and Dragon Boat Festival are iconic.' },
                   { t: 'Safety', d: 'China is consistently ranked as one of the safest countries for international students.' }
                 ].map(i => (
                   <div key={i.t} className="p-8 bg-gray-50 rounded-3xl border border-gray-100 italic font-medium text-gray-600">
                      <span className="block font-black text-gray-900 not-italic mb-2 text-lg">{i.t}</span>
                      {i.d}
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="relative h-full min-h-[500px] rounded-[4rem] overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&q=80" alt="Cultural China" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-900/40 to-transparent" />
           </div>
        </div>
      </div>
    </GuideLayout>
  );
};

export default LivingInChina;
