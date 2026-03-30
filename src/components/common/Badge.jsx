import React from 'react';
import { cn } from '../../utils/cn';

function Badge({ children, variant = 'blue', className }) {
  const variants = {
    blue: 'bg-blue-600 text-white',
    orange: 'bg-orange-600 text-white',
    green: 'bg-emerald-500 text-white',
    yellow: 'bg-yellow-500 text-white',
    indigo: 'bg-indigo-600 text-white',
    outline: 'border border-gray-200 text-gray-600 bg-transparent',
  };

  return (
    <span className={cn(
      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap",
      variants[variant] || variants.blue,
      className
    )}>
      {children}
    </span>
  );
}

export default Badge;
