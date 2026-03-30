import React from 'react';

function UniversityIconCard({ name, rank, icon: Icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    purple: 'bg-purple-50 text-purple-600',
    rose: 'bg-rose-50 text-rose-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${colorClasses[color]}`}>
        {Icon ? <Icon size={32} /> : (
           <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        )}
      </div>
      <h3 className="text-sm font-bold text-gray-900 mb-1 leading-tight">{name}</h3>
      <p className="text-xs text-gray-500 uppercase tracking-widest">{rank}</p>
    </div>
  );
}

export default UniversityIconCard;
