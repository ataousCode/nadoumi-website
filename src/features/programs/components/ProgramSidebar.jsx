import React from 'react';
import Checkbox from '../../../components/common/Checkbox.jsx';
import { cn } from '../../../utils/cn';

function ProgramSidebar({ filters = {}, setFilters, onClear, categories = [] }) {
  const languageOptions = [
    { id: 'english', label: 'English Medium' },
    { id: 'chinese', label: 'Chinese Medium' },
  ];

  const tuitionTiers = [
    { id: 'free', label: 'Tution Free', min: 0, max: 0 },
    { id: 'budget', label: 'Under ¥15,000', min: 1, max: 15000 },
    { id: 'standard', label: '¥15,000 - ¥30,000', min: 15001, max: 30000 },
    { id: 'premium', label: '¥30,000+', min: 30001, max: 100000 },
  ];

  const handleToggle = (type, label) => {
    const list = filters[type] || [];
    const newList = list.includes(label)
      ? list.filter(item => item !== label)
      : [...list, label];
    setFilters({ ...filters, [type]: newList });
  };

  const handleTuitionChange = (tier) => {
    setFilters({ 
      ...filters, 
      tuitionTier: filters.tuitionTier === tier.id ? null : tier.id,
      tuitionMin: tier.min,
      tuitionMax: tier.max
    });
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">
          Refine
        </h2>
        <button 
          onClick={onClear}
          className="text-[9px] font-black text-orange-600 uppercase tracking-widest hover:text-orange-700 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Language */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Medium of Instruction</label>
        <div className="space-y-2">
          {languageOptions.map((opt) => (
            <Checkbox 
              key={opt.id}
              label={opt.label} 
              checked={filters.languages?.includes(opt.label)}
              onChange={() => handleToggle('languages', opt.label)}
              className="text-xs font-bold text-gray-600"
            />
          ))}
        </div>
      </div>

      {/* Tuition Tiers */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tuition Fee</label>
        <div className="space-y-2">
          {tuitionTiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => handleTuitionChange(tier)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl border transition-all text-xs font-bold",
                filters.tuitionTier === tier.id
                  ? "bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-100"
                  : "bg-gray-50 border-gray-100 text-gray-600 hover:border-orange-200"
              )}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      {/* Major Categories */}
      {categories.length > 0 && (
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject Categories</label>
          <div className="space-y-2">
            {categories.map((cat, idx) => {
              const label = typeof cat === 'string' ? cat : cat.name;
              const value = typeof cat === 'string' ? cat : (cat.id || cat.name);
              return (
                <Checkbox 
                  key={idx}
                  label={label} 
                  checked={filters.categories?.includes(label)}
                  onChange={() => handleToggle('categories', label)}
                  className="text-xs font-bold text-gray-600"
                />
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}

export default ProgramSidebar;
