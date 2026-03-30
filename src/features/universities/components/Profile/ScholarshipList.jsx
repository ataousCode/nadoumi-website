import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../../../components/common/Badge.jsx';

function ScholarshipList({ scholarships }) {
  const safeScholarships = Array.isArray(scholarships) ? scholarships : [];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">
          Available <span className="text-orange-600">Scholarships</span>
        </h2>
        <p className="text-sm font-bold text-gray-400">
          Showing {scholarships.length} Opportunities
        </p>
      </div>

      <div className="flex overflow-x-auto gap-8 pb-10 -mx-4 px-4 snap-x snap-mandatory no-scrollbar">
        {scholarships.map((scholarship, idx) => (
          <div 
            key={idx} 
            className="flex-shrink-0 w-[420px] snap-start flex flex-col bg-white p-10 rounded-[56px] border border-gray-100/50 hover:shadow-2xl hover:shadow-orange-200/20 transition-all group relative overflow-hidden active:scale-95 cursor-pointer"
            onClick={() => window.location.href = `/scholarships/${scholarship.id}`}
          >
            {/* Decorative background element */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between mb-8 relative z-10">
              <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-3xl group-hover:bg-orange-600 group-hover:scale-110 transition-all duration-500">
                🎓
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge label={scholarship.type || 'Full'} variant="orange" className="text-[10px] font-black" />
                <Badge label={scholarship.degree || 'Bachelor'} variant="indigo" className="text-[10px] font-black" />
              </div>
            </div>

            <div className="flex-1 relative z-10">
              <h4 className="text-2xl font-black text-gray-900 leading-tight mb-4 group-hover:text-orange-600 transition-colors">
                {scholarship.title || 'Institutional Scholarship'}
              </h4>
              <p className="text-sm font-bold text-gray-400 mb-8 border-l-4 border-orange-200 pl-4">
                {scholarship.coverage || 'Full Tuition Coverage + Stipend'}
              </p>
            </div>

            <div className="pt-8 border-t border-gray-50 flex items-center justify-between relative z-10">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Application</span>
               </div>
               <Link 
                 to={`/scholarships/${scholarship.id}`}
                 onClick={(e) => e.stopPropagation()}
                 className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all"
               >
                 View Details
               </Link>
            </div>
          </div>
        ))}
      </div>

      {safeScholarships.length === 0 && (
        <div className="py-20 bg-gray-50 rounded-[40px] text-center border-2 border-dashed border-gray-100">
          <p className="text-gray-400 font-bold italic tracking-tight">No active scholarships are currently listed for this institution.</p>
        </div>
      )}
    </div>
  );
}

export default ScholarshipList;
