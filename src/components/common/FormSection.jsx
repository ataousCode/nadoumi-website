import React from 'react';
import { cn } from '../../utils/cn';

const FormSection = ({ title, description, icon: Icon, children, className = '', action }) => {
  return (
    <section className={cn("bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-900/5", className)}>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="w-12 h-12 bg-gray-50 text-gray-900 rounded-2xl flex items-center justify-center">
              <Icon className="w-6 h-6" />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">{title}</h2>
            {description && <p className="text-gray-400 text-sm font-medium">{description}</p>}
          </div>
        </div>
        {action && (
          <div className="flex items-center">
            {action}
          </div>
        )}
      </div>
      {children}
    </section>
  );
};

export default FormSection;
