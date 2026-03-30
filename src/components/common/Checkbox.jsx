import React from 'react';
import { cn } from '../../utils/cn';

function Checkbox({ label, checked, onChange, id }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input 
          type="checkbox" 
          id={id}
          checked={checked} 
          onChange={onChange}
          className="sr-only" 
        />
        <div className={cn(
          "w-5 h-5 rounded border-2 transition-all flex items-center justify-center",
          checked 
            ? "bg-orange-600 border-orange-600 shadow-md shadow-orange-200" 
            : "border-gray-200 bg-white group-hover:border-orange-300"
        )}>
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      {label && <span className="text-sm font-medium text-gray-700 select-none group-hover:text-gray-900 transition-colors">{label}</span>}
    </label>
  );
}

export default Checkbox;
