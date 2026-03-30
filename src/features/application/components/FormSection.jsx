import React from 'react';

function FormSection({ title, icon, children }) {
  return (
    <div className="space-y-8 py-4 border-b border-gray-50 last:border-none pb-12 first:pt-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm">
          {icon}
        </div>
        <h2 className="text-xl font-black text-gray-900 tracking-tight">
          {title}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {children}
      </div>
    </div>
  );
}

export default FormSection;
