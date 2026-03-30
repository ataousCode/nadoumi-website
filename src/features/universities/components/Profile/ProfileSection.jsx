import React from 'react';

const ProfileSection = ({ title, icon, subtitle, children, className = "" }) => {
  return (
    <section className={`space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <span className="text-3xl filter drop-shadow-sm">{icon}</span>
             <h2 className="text-3xl font-black text-gray-900 tracking-tight">
               {title.split(' ')[0]} <span className="text-orange-600">{title.split(' ').slice(1).join(' ')}</span>
             </h2>
          </div>
          {subtitle && (
            <p className="text-lg text-gray-500 font-medium max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      <div className="relative">
        {children}
      </div>
    </section>
  );
};

export default ProfileSection;
