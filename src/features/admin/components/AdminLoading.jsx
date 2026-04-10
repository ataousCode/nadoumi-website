import React from 'react';
import { cn } from '../../../utils/cn';

const AdminLoading = ({ 
  message = "Loading your dashboard...", 
  subtext = "We're preparing your workspace. Just a moment.",
  fullScreen = false,
  className = ""
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-20 text-center animate-fadeIn",
      fullScreen ? "fixed inset-0 bg-white/80 backdrop-blur-md z-[100]" : "h-[60vh]",
      className
    )}>
      <div className="relative mb-8">
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-blue-400/20 blur-2xl rounded-full animate-pulse scale-150"></div>
        
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <svg className="w-full h-full animate-spin text-blue-600" viewBox="0 0 24 24">
            <circle 
              className="opacity-10" 
              cx="12" cy="12" r="10" 
              stroke="currentColor" 
              strokeWidth="4" 
              fill="none" 
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
            />
          </svg>
        </div>
      </div>

      <h3 className="text-xl font-black text-gray-900 tracking-tighter mb-2">
        {message}
      </h3>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest max-w-xs leading-relaxed">
        {subtext}
      </p>

      {/* Decorative progress dots */}
      <div className="flex gap-1.5 mt-8">
        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-blue-200 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default AdminLoading;
