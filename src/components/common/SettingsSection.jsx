import React from "react";
import { cn } from "../../utils/cn";

const SettingsSection = ({ title, description, children, className = "" }) => {
  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
};

export default SettingsSection;
