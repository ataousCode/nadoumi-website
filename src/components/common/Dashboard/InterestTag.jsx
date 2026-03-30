import React from 'react';

const InterestTag = ({ label, color = "blue" }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    indigo: "bg-[#EEF2FF] text-[#4F46E5] border-[#E0E7FF]",
    gray: "bg-gray-50 text-gray-400 border-gray-100",
  };

  return (
    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${colorMap[color] || colorMap.blue} transition-all hover:scale-105 cursor-default`}>
      {label}
    </span>
  );
};

export default InterestTag;
