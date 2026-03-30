import React from 'react';
import GuideLayout from './GuideLayout.jsx';
import headerImage from '../../assets/images/guides/visa-info.png';

const VisaInfo = () => {
  return (
    <GuideLayout 
      title="Visa & Immigration"
      subtitle="Navigating student visas doesn't have to be complicated. Everything you need to know about X1/X2 visas, document legalities, and residence permits."
      image={headerImage}
    >
      <div className="max-w-4xl mx-auto space-y-24">
        {/* Visa Types Section */}
        <section>
          <div className="text-center mb-16">
            <span className="text-orange-600 font-black uppercase tracking-widest text-xs mb-4 block">Immigration Policy 2024</span>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Understanding Student Visa Types</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-12 rounded-[3rem] border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
               <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 font-black text-2xl mb-8">X1</div>
               <h3 className="text-2xl font-black text-gray-900 mb-4">Long-term Student Visa</h3>
               <p className="text-gray-600 leading-relaxed mb-6">Designed for students pursuing studies for more than 180 days (6 months). Must be converted to a Residence Permit within 30 days of arrival.</p>
               <ul className="space-y-3 border-t pt-6 border-gray-50">
                  <li className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <div className="w-1 h-1 bg-orange-500 rounded-full" />
                    validity: Entry only (30 days)
                  </li>
                  <li className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <div className="w-1 h-1 bg-orange-500 rounded-full" />
                    Conversion Required
                  </li>
               </ul>
            </div>
            
            <div className="bg-white p-12 rounded-[3rem] border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
               <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 font-black text-2xl mb-8">X2</div>
               <h3 className="text-2xl font-black text-gray-900 mb-4">Short-term Student Visa</h3>
               <p className="text-gray-600 leading-relaxed mb-6">For students studying for less than 180 days (e.g. one semester or short-term language programs). General single-entry.</p>
               <ul className="space-y-3 border-t pt-6 border-gray-50">
                  <li className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                    validity: full stay period
                  </li>
                  <li className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                    No Residence Permit Needed
                  </li>
               </ul>
            </div>
          </div>
        </section>

        {/* Required Documents Section */}
        <section className="bg-gray-50 rounded-[4rem] p-16">
          <div className="mb-px border-b border-gray-200 pb-12 mb-12 flex justify-between items-end">
            <h2 className="text-3xl font-black text-gray-900 leading-none">Required Documents</h2>
            <p className="text-orange-600 font-bold text-sm leading-none">Mandatory for Application</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
            {[
              { title: 'Valid Passport', desc: 'At least 6 months validity from date of entry.' },
              { title: 'Admission Notice', desc: 'Original physical copy sent by the university.' },
              { title: 'JW201/202 Form', desc: 'Visa application for study (Foreign student only).' },
              { title: 'Visa Application Form', desc: 'Completed online via COVA system.' },
              { title: 'Medical Report', desc: 'Required for X1 applicants (Foreigners Health Exam).' },
              { title: 'Passport Photos', desc: 'Recent professional color photos with white background.' }
            ].map(doc => (
              <div key={doc.title} className="flex gap-6">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h4 className="text-lg font-black text-gray-900 mb-2">{doc.title}</h4>
                  <p className="text-gray-500 text-sm">{doc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </GuideLayout>
  );
};

export default VisaInfo;
