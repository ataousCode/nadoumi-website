import React from 'react';

function RangeSlider({ label, min, max, value, onChange, unit = '' }) {
  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-bold text-gray-900 mb-2">
          {label}
        </label>
      )}
      <div className="relative h-6 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
        />
      </div>
      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        <span>{min}{unit}</span>
        <span>{value}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

export default RangeSlider;
