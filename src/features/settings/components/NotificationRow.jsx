import React from "react";
import Toggle from "../../../components/common/Toggle";

const NotificationRow = ({ icon, title, description, enabled, onChange }) => (
  <div className="flex items-center justify-between py-6 gap-4">
    <div className="flex items-start gap-4 flex-1">
      <div className="p-2 sm:p-2.5 bg-gray-50 rounded-lg">{icon}</div>
      <div>
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
    <Toggle enabled={enabled} onChange={onChange} />
  </div>
);

export default NotificationRow;
