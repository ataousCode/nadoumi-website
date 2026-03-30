import React from 'react';

const DetailItem = ({ label, value, icon, className = "" }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
        {label}
      </p>
      <div className="flex items-center gap-2">
        {icon && <span className="text-blue-400">{icon}</span>}
        <p className="text-sm font-bold text-gray-900 tracking-tight leading-none">
          {value || <span className="text-gray-200 italic font-medium">Not specified</span>}
        </p>
      </div>
    </div>
  );
};

export default DetailItem;
