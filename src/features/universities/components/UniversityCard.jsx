import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../../components/common/Badge.jsx';
import { cn } from '../../../utils/cn';

function UniversityCard({ 
  id,
  universityId, 
  name, 
  nameInChinese, 
  city, 
  province, 
  logo, 
  bannerImage,
  image, 
  qsRank, 
  type, 
  isRecommended,
  scholarships = [],
  tags = ["Project 985", "Project 211"]
}) {
  const displayImage = bannerImage || image || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80';
  const displayId = id || universityId;
  const viewCount = qsRank ? parseInt(qsRank) * 25 : 1240;

  return (
    <div className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-orange-100 hover:-translate-y-1 flex flex-col h-full relative">
      <Link to={`/universities/${displayId}`} className="relative h-52 overflow-hidden block">
        <img 
          src={displayImage} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/10 to-transparent opacity-80" />
        
        {/* Glass Badge Header */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex flex-wrap gap-2">
            {tags && tags.slice(0, 1).map((tag, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest">
                {tag}
              </div>
            ))}
          </div>
          {isRecommended && (
            <div className="bg-orange-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-orange-500/20">
              ★ Hot
            </div>
          )}
        </div>

        {/* Identity Overlay */}
        <div className="absolute bottom-4 left-6 right-16">
           <h3 className="text-lg font-black text-white leading-tight drop-shadow-2xl group-hover:text-orange-400 transition-colors">
            {name}
          </h3>
          <p className="text-white/60 font-bold text-[9px] mt-1 tracking-widest uppercase">
            {nameInChinese || 'Institutional Excellence'}
          </p>
        </div>
      </Link>

      <div className="p-6 flex-1 flex flex-col relative">
        {/* Logo Float */}
        <div className="absolute -top-8 right-6 w-16 h-16 bg-white rounded-2xl p-2.5 shadow-xl border border-gray-50 flex items-center justify-center transition-transform group-hover:-translate-y-1">
          <img src={logo || '/default-uni-logo.png'} alt="Logo" className="w-full h-full object-contain" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">Location</span>
            <p className="text-[11px] font-black text-gray-900 truncate">{city}{province ? `, ${province}` : ''}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">World Rank</span>
            <p className="text-[11px] font-black text-indigo-600">#{qsRank || 'TOP 100'}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 py-3 border-y border-gray-50">
           <div className="flex flex-col">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Scholarships</span>
              <span className="text-xs font-black text-gray-900">{scholarships?.length || 0} Programs</span>
           </div>
           <div className="flex items-center gap-1.5 text-orange-600">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
              <span className="text-[9px] font-black uppercase tracking-widest">{viewCount.toLocaleString()} Viewing</span>
           </div>
        </div>

        <Link 
          to={`/universities/${displayId}`}
          className="mt-auto w-full inline-flex items-center justify-center py-3 bg-orange-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-orange-100 transition-all hover:bg-gray-900 hover:shadow-orange-200"
        >
          View
        </Link>
      </div>
    </div>
  );
}

export default UniversityCard;
