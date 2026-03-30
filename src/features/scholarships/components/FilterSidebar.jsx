import React from 'react';
import Checkbox from '../../../components/common/Checkbox.jsx';
import RangeSlider from '../../../components/common/RangeSlider.jsx';
import provinces from 'province-city-china/dist/province.json';
import { cn } from '../../../utils/cn';

function FilterSidebar({ filters, setFilters, onClear }) {
  const degreeOptions = [
    { id: 'language', label: 'Language' },
    { id: 'bachelor', label: "Bachelor's" },
    { id: 'master', label: "Master's" },
    { id: 'phd', label: 'PhD' },
  ];

  const subjects = [
    'All Categories',
    'Engineering & Tech',
    'Medicine',
    'Business',
    'Arts & Humanities',
    'Science',
    'Social Sciences'
  ];

  const handleDegreeChange = (label) => {
    const newDegrees = filters.degreeTypes.includes(label)
      ? filters.degreeTypes.filter(d => d !== label)
      : [...filters.degreeTypes, label];
    setFilters({ ...filters, degreeTypes: newDegrees });
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

      {/* Degree Type */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Degree Level</label>
        <div className="space-y-2">
          {degreeOptions.map((opt) => (
            <Checkbox 
              key={opt.id}
              label={opt.label} 
              checked={filters.degreeTypes.includes(opt.label)}
              onChange={() => handleDegreeChange(opt.label)}
              className="text-xs font-bold text-gray-600"
            />
          ))}
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject Category</label>
        <select 
          value={filters.subject}
          onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-orange-600/10 focus:bg-white transition-all outline-none"
        >
          {subjects.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Global Ranking */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Rank</label>
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

      {/* Teaching Language */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Language</label>
        <div className="grid grid-cols-2 p-1 bg-gray-50 border border-gray-100 rounded-xl">
          <button 
            onClick={() => setFilters({ ...filters, language: 'English' })}
            className={cn(
              "py-2 px-4 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all",
              filters.language === 'English' 
                ? "bg-white text-orange-600 shadow-sm shadow-gray-200" 
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            English
          </button>
          <button 
            onClick={() => setFilters({ ...filters, language: 'Chinese' })}
            className={cn(
              "py-2 px-4 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all",
              filters.language === 'Chinese' 
                ? "bg-white text-orange-600 shadow-sm shadow-gray-200" 
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            Chinese
          </button>
        </div>
      </div>

      {/* Tuition Slider */}
      <RangeSlider 
        label="Tuition (RMB/Year)" 
        min={0} 
        max={100} 
        value={filters.tuitionRange} 
        onChange={(val) => setFilters({ ...filters, tuitionRange: val })}
        unit="k+" 
        className="text-[10px] font-black text-gray-400 uppercase tracking-widest"
      />
    </aside>
  );
}


export default FilterSidebar;
