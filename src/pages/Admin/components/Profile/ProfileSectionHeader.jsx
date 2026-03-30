import React from 'react';

const ProfileSectionHeader = ({ icon: Icon, title, subtitle, color, isDark }) => (
  <div className="flex items-center gap-5 mb-10">
    <div className={`w-14 h-14 ${isDark ? 'bg-white/10' : `bg-${color}-50`} rounded-2xl flex items-center justify-center ${isDark ? `text-${color}-400` : `text-${color}-600`} shadow-inner`}>
      <Icon className="w-7 h-7" />
    </div>
    <div>
      <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tight`}>{title}</h3>
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">{subtitle}</p>
    </div>
  </div>
);

export default ProfileSectionHeader;
