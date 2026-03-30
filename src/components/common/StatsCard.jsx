import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 ring-blue-100',
    orange: 'bg-orange-50 text-orange-600 ring-orange-100',
    green: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    purple: 'bg-purple-50 text-purple-600 ring-purple-100',
  };

  return (
    <div className="bg-white p-6 rounded-[24px] border border-gray-100/50 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ring-4 ${colors[color]} transition-transform group-hover:scale-110`}>
          <Icon className="w-6 h-6" />
        </div>
        {trendValue && (
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
            trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            {trend === 'up' ? <ArrowTrendingUpIcon className="w-2.5 h-2.5" /> : <ArrowTrendingDownIcon className="w-2.5 h-2.5" />}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1">{title}</p>
        <h3 className="text-2xl font-black text-gray-900 tracking-tighter">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
      </div>
    </div>
  );
};

export default StatsCard;
