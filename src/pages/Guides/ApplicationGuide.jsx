import React from 'react';
import GuideLayout from './GuideLayout.jsx';
import headerImage from '../../assets/images/guides/app-guide.png';

const steps = [
  {
    number: '01',
    title: 'Research & Selection',
    description: 'Explore our database of over 500+ Chinese universities and scholarships. Filter by major, city, and degree type to find your perfect match.',
    tips: ['Check QS Rankings', 'Review teaching language', 'Compare tuition fees']
  },
  {
    number: '02',
    title: 'Document Preparation',
    description: 'Gather all necessary documents. This usually includes educational transcripts, passport copy, personal statement, and recommendation letters.',
    tips: ['Translate to English/Chinese', 'Ensure valid passport', 'Prepare digital copies']
  },
  {
    number: '03',
    title: 'Online Application',
    description: 'Submit your application through the Nadoumi portal. Our expert team will review your profile for completeness and accuracy.',
    tips: ['Check deadlines', 'Correct all typos', 'Highlight achievements']
  },
  {
    number: '04',
    title: 'Admission & Visa',
    description: 'Once accepted, youll receive an admission notice and JW201/202 form. Use these to apply for your X1 or X2 student visa.',
    tips: ['Apply for visa early', 'Attend the interview', 'Book your flights']
  }
];

const ApplicationGuide = () => {
  return (
    <GuideLayout 
      title="Application Roadmap"
      subtitle="Your journey to China starts here. Follow our comprehensive step-by-step guide to navigate the application process with ease and confidence."
      image={headerImage}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative">
          {/* Vertical line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-[2px] bg-gradient-to-b from-orange-500/20 via-orange-500 to-orange-500/20 -translate-x-1/2" />
          
          {steps.map((step, idx) => (
            <div key={step.number} className={cn(
              "relative bg-gray-50 p-12 rounded-[3rem] border border-gray-100 flex flex-col",
              idx % 2 === 1 ? "md:mt-24 shadow-2xl shadow-orange-50/50" : "shadow-xl shadow-gray-100/50"
            )}>
              <span className="text-6xl font-black text-orange-500/10 absolute top-8 right-12 leading-none">
                {step.number}
              </span>
              <h3 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-10 text-lg">
                {step.description}
              </p>
              
              <div className="mt-auto space-y-3">
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">Pro Tips:</p>
                {step.tips.map(tip => (
                  <div key={tip} className="flex items-center gap-3 text-gray-500 text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-32 p-16 bg-gray-900 rounded-[4rem] text-center text-white overflow-hidden relative group">
           <div className="absolute inset-0 bg-orange-600 opacity-0 group-hover:opacity-10 trasition-opacity duration-1000" />
           <h2 className="text-4xl md:text-5xl font-black mb-8 relative z-10">Ready to start your journey?</h2>
           <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto relative z-10 italic">
             Our expert consultants are ready to assist you at every step of your application.
           </p>
           <button className="px-12 py-6 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-orange-500/30 hover:bg-white hover:text-gray-900 transition-all relative z-10 shrink-0">
             Contact advisor today
           </button>
        </div>
      </div>
    </GuideLayout>
  );
};

// Simple CN utility for the code above
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default ApplicationGuide;
