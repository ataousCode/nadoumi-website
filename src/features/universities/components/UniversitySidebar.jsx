import React from 'react';
import Checkbox from '../../../components/common/Checkbox.jsx';
import RangeSlider from '../../../components/common/RangeSlider.jsx';
import provinces from 'province-city-china/dist/province.json';
import { cn } from '../../../utils/cn';

function UniversitySidebar({ filters, setFilters, onClear }) {
  const universityTypes = [
    { id: 'research', label: 'Research' },
    { id: 'comprehensive', label: 'Comprehensive' },
    { id: 'vocational', label: 'Vocational' },
    { id: 'technical', label: 'Technical' },
  ];

  const academicTiers = [
    { id: '985', label: 'Project 985' },
    { id: '211', label: 'Project 211' },
    { id: 'doublefirst', label: 'Double First Class' },
  ];

  const handleToggle = (type, label) => {
    const list = filters[type] || [];
    const newList = list.includes(label)
      ? list.filter(item => item !== label)
      : [...list, label];
    setFilters({ ...filters, [type]: newList });
  };

  const handleRankChange = (type, value) => {
    setFilters({ ...filters, [type]: value });
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2">
          Filters
        </h2>
        <button 
          onClick={onClear}
          className="text-[9px] font-black text-orange-600 uppercase tracking-widest hover:text-orange-700 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Province/City</label>
        <select 
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-orange-600/10 focus:bg-white transition-all outline-none"
        >
          <option>All Locations</option>
          {provinces.map((p) => (
            <option key={p.province} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* University Type */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Institution Type</label>
        <div className="space-y-2">
          {universityTypes.map((opt) => (
            <Checkbox 
              key={opt.id}
              label={opt.label} 
              checked={filters.universityTypes?.includes(opt.label)}
              onChange={() => handleToggle('universityTypes', opt.label)}
              className="text-xs font-bold text-gray-600"
            />
          ))}
        </div>
      </div>

      {/* Academic Tiers */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Academic Tier</label>
        <div className="space-y-2">
          {academicTiers.map((opt) => (
            <Checkbox 
              key={opt.id}
              label={opt.label} 
              checked={filters.tiers?.includes(opt.label)}
              onChange={() => handleToggle('tiers', opt.label)}
              className="text-xs font-bold text-gray-600"
            />
          ))}
        </div>
      </div>

      {/* Ranking */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">QS Ranking</label>
        <div className="grid grid-cols-2 gap-3">
          <input 
            type="text" 
            placeholder="Min" 
            value={filters.rankMin}
            onChange={(e) => handleRankChange('rankMin', e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-orange-600/10 focus:bg-white transition-all outline-none" 
          />
          <input 
            type="text" 
            placeholder="Max" 
            value={filters.rankMax}
            onChange={(e) => handleRankChange('rankMax', e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-orange-600/10 focus:bg-white transition-all outline-none" 
          />
        </div>
      </div>
    </aside>
  );
}


export default UniversitySidebar;
