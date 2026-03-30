import React from 'react';
import { cn } from '../../utils/cn';

/**
 * DetailsTable - A reusable component for displaying clean, structured data in rows.
 * @param {Object} props
 * @param {string} props.title - Subsection title (e.g., "Basic information")
 * @param {Array} props.items - Array of { label: string, value: any, isCritical: boolean }
 * @param {string} props.className - Optional wrapping className
 */
function DetailsTable({ title, items, className }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={cn("mb-12 last:mb-0", className)}>
      {title && (
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 border-l-4 border-orange-600 pl-4">
          {title}
        </h3>
      )}
      <div className="bg-white rounded-[32px] border border-gray-100/80 overflow-hidden shadow-sm">
        <div className="divide-y divide-gray-50">
          {items.map((item, idx) => (
            <div 
              key={idx} 
              className="group flex flex-col sm:flex-row hover:bg-orange-50/30 transition-colors"
            >
              <div className="w-full sm:w-1/3 px-8 py-5 bg-gray-50/50 sm:bg-transparent border-b sm:border-b-0 sm:border-r border-gray-100 flex items-center">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  {item.label}
                </span>
              </div>
              <div className="flex-1 px-8 py-5 flex flex-col justify-center">
                <span className={cn(
                  "text-sm font-bold text-gray-900",
                  item.isCritical ? "text-orange-600 font-black" : "text-gray-900"
                )}>
                  {item.value || 'N/A'}
                </span>
                {item.notes && (
                  <p className="mt-1 text-xs text-gray-400 font-medium italic">
                    {item.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DetailsTable;
