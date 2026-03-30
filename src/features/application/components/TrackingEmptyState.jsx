import React from "react";
import { Link } from "react-router-dom";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

const TrackingEmptyState = ({ title = "No Applications Found", description = "You haven't applied for any scholarships yet." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-20 h-20 bg-gray-50 rounded-[28px] flex items-center justify-center mb-6">
        <ClipboardDocumentListIcon className="w-10 h-10 text-gray-300" />
      </div>
      <h3 className="text-xl font-black text-gray-900 mb-3">{title}</h3>
      <p className="text-sm font-medium text-gray-500 max-w-sm mb-8 leading-relaxed">
        {description}
      </p>
      <Link 
        to="/scholarships"
        className="px-8 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-600/10 hover:bg-blue-700 transition-all active:scale-95"
      >
        Explore Scholarships
      </Link>
    </div>
  );
};

export default TrackingEmptyState;
