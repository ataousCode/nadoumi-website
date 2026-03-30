import React from 'react';
import { cn } from '../../../utils/cn';

function RadioGroup({ label, options, value, onChange }) {
  return (
    <div className="space-y-3 col-span-full">
      {label && <label className="block text-sm font-bold text-gray-900">{label}</label>}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all font-bold text-xs uppercase tracking-widest",
              value === opt.value
                ? "bg-white border-orange-600 text-orange-600 shadow-lg shadow-orange-100"
                : "bg-gray-50/50 border-transparent text-gray-400 hover:bg-gray-100"
            )}
          >
            <div className={cn(
              "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
              value === opt.value ? "border-orange-600" : "border-gray-200"
            )}>
              {value === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />}
            </div>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RadioGroup;
