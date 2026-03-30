import React from 'react';

const StatusBadge = ({ label, variant = "default" }) => {
  const variants = {
    default: "bg-green-50 text-green-600 border-green-100",
    premium: "bg-gray-900 text-white border-transparent",
    warning: "bg-orange-50 text-orange-600 border-orange-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
  };

  return (
    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${variants[variant]}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
