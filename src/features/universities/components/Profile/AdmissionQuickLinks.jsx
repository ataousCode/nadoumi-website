import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../../../../api/axiosInstance';

function AdmissionQuickLinks({ university }) {
  const handleAction = (destination) => {
    if (isAuthenticated('student')) {
      window.location.href = destination;
    } else {
      window.location.href = `/login?redirect=${destination}`;
    }
  };

  const handleApplyNow = () => handleAction(`/application?universityId=${university?.id || ''}`);
  const handleContactNadoumi = () => handleAction('/messages');

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Visual background elements */}
      <div className="absolute inset-0 bg-gray-900 z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-600/10 blur-[150px] rounded-full -mr-96 -mt-96" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full -ml-40 -mb-40" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Admissions are Open</span>
        </div>

        <h3 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter mb-8">
          Ready to <span className="text-orange-500 italic">Apply?</span>
        </h3>
        
        <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
          Start your journey at {university?.name || "one of China's top institutions"} today. Our advisors are ready to guide you through every step.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
          <button 
            onClick={handleApplyNow}
            className="w-full sm:w-auto py-6 px-12 bg-orange-600 text-white rounded-[32px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-orange-900/40 transition-all hover:-translate-y-1 hover:bg-orange-500 active:scale-95 flex items-center justify-center gap-3"
          >
            Apply Now
            <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

          <button 
            onClick={handleContactNadoumi}
            className="w-full sm:w-auto py-6 px-12 bg-white/5 text-white border border-white/20 rounded-[32px] font-black text-sm uppercase tracking-[0.2em] transition-all hover:bg-white/10 hover:border-white/40 active:scale-95 flex items-center justify-center gap-3"
          >
            Contact Nadoumi
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="flex -space-x-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-14 h-14 rounded-full border-4 border-gray-900 bg-gray-800 overflow-hidden shadow-xl transform hover:-translate-y-2 transition-transform cursor-pointer">
                <img src={`https://i.pravatar.cc/150?u=nadoumi-${i}`} alt="Advisor" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm font-black text-white uppercase tracking-[0.2em] mb-1">Join 5,000+ Global Students</p>
            <p className="text-xs font-bold text-gray-500">Currently processing applications for the 2026 Academic Intake</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdmissionQuickLinks;
