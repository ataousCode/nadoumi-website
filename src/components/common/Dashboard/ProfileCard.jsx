import React from 'react';

const ProfileCard = ({ title, children, icon, action, className = "" }) => {
  return (
    <div className={`bg-white rounded-[24px] shadow-sm border border-gray-100/30 overflow-hidden flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-blue-600">
              {icon}
            </div>
          )}
          <h3 className="text-base font-black text-gray-900 tracking-tight leading-none">{title}</h3>
        </div>
        {action && (
          <button 
            onClick={action.onClick}
            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-8 flex-1">
        {children}
      </div>
    </div>
  );
};

export default ProfileCard;
