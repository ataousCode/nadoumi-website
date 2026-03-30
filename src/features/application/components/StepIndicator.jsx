import React from 'react';
import { cn } from '../../../utils/cn';

function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex justify-between relative mt-8">
      {/* Connector Line Background */}
      <div className="absolute top-4 left-0 right-0 h-px bg-gray-100 -z-10" />
      
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isPending = index > currentStep;

        return (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500",
              isCompleted && "bg-orange-600 text-white shadow-lg shadow-orange-100 scale-110",
              isActive && "bg-white border-2 border-orange-600 text-orange-600 ring-4 ring-orange-50 scale-110",
              isPending && "bg-white border text-gray-300",
              (currentStep === steps.length && isCompleted) && "bg-green-500 shadow-green-100 ring-green-50"
            )}>
              {isCompleted ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <div className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-orange-600" : "bg-gray-200")} />
              )}
            </div>
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest text-center transition-colors",
              (isActive || isCompleted) ? "text-gray-900" : "text-gray-300"
            )}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default StepIndicator;
