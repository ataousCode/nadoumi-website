import React from 'react';

function StatsGrid({ stats }) {
  const defaultStats = [
    { label: 'Global Ranking', value: '#14', sub: 'QS World 2024', icon: '🏆' },
    { label: 'International Students', value: '4,500+', sub: 'From 120+ Countries', icon: '🌍' },
    { label: 'Academic Tier', value: 'C9 League', sub: 'Project 985 & 211', icon: '🏫' },
    { label: 'Programs Available', value: '280+', sub: 'English & Chinese', icon: '📚' },
  ];

  const displayStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayStats.map((stat, idx) => (
        <div 
          key={idx} 
          className="bg-white p-8 rounded-[38px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500 group"
        >
          <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-500 inline-block">
            {stat.icon}
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
              {stat.label}
            </p>
            <h3 className="text-3xl font-black text-gray-900 leading-tight">
              {stat.value}
            </h3>
            <p className="text-sm font-bold text-orange-600/60 tracking-tight">
              {stat.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsGrid;
