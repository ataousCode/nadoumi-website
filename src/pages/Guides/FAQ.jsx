import React, { useState } from 'react';
import GuideLayout from './GuideLayout.jsx';
import headerImage from '../../assets/images/guides/faq.png';

const faqs = [
  {
    q: "Is it difficult to get a Chinese student visa?",
    a: "No, as long as you have the original Admission Notice and JW201/202 form from a certified university, the process is straightforward at your local embassy or consulate."
  },
  {
    q: "Do I need to speak Chinese to study in China?",
    a: "Not necessarily. Many top universities offer English-taught programs. However, we recommend learning basic Chinese for your daily life and integration."
  },
  {
    q: "Are scholarships available for international students?",
    a: "Yes! There are CSC Scholarships (Government), University Scholarships, Provincial Scholarships, and the Nadoumi-exclusive scholarships."
  },
  {
    q: "Can I work while studying in China?",
    a: "Generally, student visa holders are not allowed to work. However, some universities allow part-time internships or work-study programs on campus specified by regulations."
  },
  {
    q: "What is the HSK exam?",
    a: "The HSK (Hanyu Shuiping Kaoshi) is the standardized Chinese proficiency test. Levels 4-5 are usually required for Chinese-taught degree programs."
  },
  {
    q: "How safe is it for international students?",
    a: "China is widely regarded as one of the safest countries in the world. Campus security is very strict, and cities are generally safe to walk at night."
  }
];

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <GuideLayout 
      title="Common Questions"
      subtitle="Find quick answers to common questions about studying, living, and applying through Nadoumi. Can't find what you're looking for? Reach out."
      image={headerImage}
    >
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className={`border-b border-gray-100 transition-all duration-500 rounded-[2.5rem] overflow-hidden ${openIdx === idx ? 'bg-gray-50 p-10' : 'bg-transparent p-6 hover:bg-orange-50/30'}`}
            >
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                className="w-full text-left flex items-center justify-between"
              >
                <h3 className={`text-xl font-black ${openIdx === idx ? 'text-orange-600' : 'text-gray-900'} transition-colors`}>
                  {faq.q}
                </h3>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIdx === idx ? 'bg-orange-500 text-white rotate-45' : 'bg-gray-100 text-gray-400'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v12m6-6H6" /></svg>
                </div>
              </button>
              
              <div className={`transition-all duration-500 overflow-hidden ${openIdx === idx ? 'max-h-96 mt-6' : 'max-h-0'}`}>
                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 p-12 bg-white rounded-[3rem] border-2 border-dashed border-orange-100 text-center">
           <p className="text-gray-500 font-medium mb-6">Still have questions that we didn't cover?</p>
           <button className="text-orange-600 font-black uppercase tracking-widest text-sm hover:underline">
             Ask our support community →
           </button>
        </div>
      </div>
    </GuideLayout>
  );
};

export default FAQ;
