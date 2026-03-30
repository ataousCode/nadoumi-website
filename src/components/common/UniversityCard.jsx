import React from 'react';
import { Link } from 'react-router-dom';
import Skeleton from './Skeleton.jsx';
import { cn } from '../../utils/cn';

/**
 * Unified UniversityCard component mimicking ScholarshipCard style
 * @param {Object} props
 * @param {Object} props.university - University data object
 * @param {string} props.variant - 'simple' (home) or 'detailed' (listing)
 * @param {boolean} props.loading - Loading state
 */
export default function UniversityCard({ university, variant = 'simple', loading = false }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
        <Skeleton className="h-48 w-full" />
        <div className="p-6 flex flex-col flex-1 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <div className="pt-4 border-t border-gray-50 mt-auto">
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!university) return null;

  const name = university.name;
  const logo = university.logo;
  const banner = university.bannerImage || university.banner;
  const city = university.city;
  const province = university.province;
  const rank = university.qsRank;

  if (variant === 'simple') {
    return (
      <Link 
        to={`/universities/${university.id || university.universityId}`}
        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full group cursor-pointer"
      >
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img 
            src={banner || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe1?auto=format&fit=crop&q=80'} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        </div>
        
        <div className="p-6 pt-2 flex flex-col flex-1 relative">
          {/* Logo Overlay - Moved outside overflow-hidden container */}
          <div className="absolute -top-10 left-6 w-20 h-20 bg-white rounded-2xl p-2 shadow-xl border border-gray-100 flex items-center justify-center z-10 transition-transform duration-300 group-hover:-translate-y-1">
            <img src={logo} alt={`${name} logo`} className="w-full h-full object-contain" />
          </div>

          <div className="mt-12">
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
              {name}
            </h3>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">
              {city}{city && province ? ', ' : ''}{province}
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
            <div className="flex items-center gap-2 text-orange-600 text-[10px] font-black uppercase tracking-widest">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>QS Rank: #{rank || 'N/A'}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Detailed variant could be added here later if needed
  return null;
}
