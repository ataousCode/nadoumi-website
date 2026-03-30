import React from 'react';
import Badge from '../../../components/common/Badge.jsx';
import Button from '../../../components/common/Button.jsx';
import { cn } from '../../../utils/cn';

function UniversityDetailCard({ 
  name, 
  location, 
  logo, 
  image, 
  badges = [], 
  qsRank, 
  intlStudents, 
  scholarshipCount 
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col group">
      {/* Upper section with Image and Badges */}
      <div className="relative h-44 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-x-0 top-0 p-4 flex flex-wrap gap-2 pointer-events-none">
          {badges.map((b, i) => (
            <Badge key={i} variant={b.variant}>{b.label}</Badge>
          ))}
        </div>
        
        {/* Logo Inset */}
        <div className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center p-2 z-10">
          <img src={logo} alt={`${name} logo`} className="w-full h-full object-contain" />
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        {/* Identity */}
        <div className="mb-6">
          <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-widest">{location}</span>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-50">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">QS Global</p>
            <p className="text-lg font-black text-blue-600">#{qsRank}</p>
          </div>
          <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-50">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Int'l Students</p>
            <p className="text-lg font-black text-indigo-600">{intlStudents}+</p>
          </div>
        </div>
        
        {/* Scholarship Indicator */}
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs mb-8">
          <div className="bg-emerald-100 rounded-full p-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <span>{scholarshipCount} Scholarship Types Available</span>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Button variant="primary" className="flex-1 rounded-xl font-black text-sm shadow-lg shadow-orange-100">
            View Details
          </Button>
          <button className="p-3 rounded-xl border border-gray-100 text-gray-300 hover:text-rose-500 hover:border-rose-100 transition-all hover:bg-rose-50">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UniversityDetailCard;
