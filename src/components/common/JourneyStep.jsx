import React from 'react';

function JourneyStep({ number, title, description }) {
  return (
    <div className="flex flex-col items-center text-center max-w-xs">
      <div className="w-16 h-16 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-2xl font-black mb-6 shadow-lg shadow-orange-200">
        {number}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">
        {title}
      </h3>
      <p className="text-orange-100/80 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default JourneyStep;
