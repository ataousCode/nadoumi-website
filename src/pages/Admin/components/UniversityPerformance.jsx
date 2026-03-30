import React from 'react';

const UniversityPerformance = ({ universities }) => {
  const maxCount = Math.max(...universities.map(u => u.count), 1);

  return (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100/50 shadow-sm flex flex-col h-full">
      <div className="mb-8">
        <h3 className="text-xl font-black text-gray-900 tracking-tight">University Performance</h3>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Top Performing Institutions</p>
      </div>

      <div className="flex-1 space-y-6">
        {universities.map((uni, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-sm font-black text-gray-900 tracking-tight">{uni.name}</span>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{uni.count.toLocaleString()} apps</span>
            </div>
            <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100/30">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(uni.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-gray-50">
        <button className="w-full py-3.5 bg-gray-50 text-gray-600 font-bold text-[11px] uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all border border-gray-100">
           View Detailed Report
        </button>
      </div>
    </div>
  );
};

export default UniversityPerformance;
