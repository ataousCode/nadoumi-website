import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../utils/cn';

function ProgramCard({ 
  id,
  programName,
  scholarship,
  tuitionFeeAfter,
  duration,
  teachingLanguage,
  category,
  image,
  currency
}) {
  // Extract university info from the primary university associated with the scholarship
  const primaryUniversity = scholarship?.universities?.[0];

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-500 hover:border-gray-200 shadow-soft">
      {/* Visual Header */}
      <div className="relative h-40 overflow-hidden bg-gray-50">
        <img 
          src={image || primaryUniversity?.bannerImage || primaryUniversity?.logo} 
          alt={programName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Category Tag */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
          <div className="bg-black/20 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg text-[8px] font-black text-white uppercase tracking-widest">
            {category}
          </div>
          {scholarship?.scholarshipCategory && (
            <div className="bg-orange-600/90 border border-white/10 px-2.5 py-1 rounded-lg text-[8px] font-black text-white uppercase tracking-widest">
              {scholarship.scholarshipCategory}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 relative">
        {/* Uni Logo Overlay */}
        <div className="absolute -top-8 left-5 w-14 h-14 bg-white rounded-xl shadow-soft flex items-center justify-center p-2 border border-gray-100 group-hover:scale-105 transition-transform">
          <img src={primaryUniversity?.logo} alt={`${primaryUniversity?.name} logo`} className="w-full h-full object-contain" />
        </div>

        <div className="mt-7 mb-4">
          <h3 className="text-base font-black text-gray-900 leading-tight mb-1 group-hover:text-orange-600 transition-colors tracking-tight line-clamp-2">
            {programName}
          </h3>
          <p className="text-gray-400 font-bold text-[9px] uppercase tracking-wider line-clamp-1">
            {primaryUniversity?.name}
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="space-y-0.5">
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Tuition</p>
            <p className="text-[11px] font-black text-gray-700">
              {currency === 'USD' ? '$' : '¥'}{tuitionFeeAfter?.toLocaleString()} {currency || (scholarship?.universityFeeCurrency || 'RMB')}/yr
            </p>
          </div>
          
          <div className="space-y-0.5 border-l border-gray-100 pl-4">
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Duration</p>
            <p className="text-[11px] font-black text-gray-700">{duration} Years</p>
          </div>

          <div className="space-y-0.5 border-l border-gray-100 pl-4">
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Medium</p>
            <p className="text-[11px] font-black text-orange-600">{teachingLanguage}</p>
          </div>
        </div>

        <Link 
          to={`/programs/${id}`}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] transition-all hover:bg-orange-600"
        >
          View Program
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default ProgramCard;
