import React from "react";
import { cn } from "../../../utils/cn";

const TAB_OPTIONS = [
  { id: "all", label: "All Applications" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
  { id: "drafts", label: "Drafts" },
];

const TrackingTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex items-center border-b border-gray-100 overflow-x-auto no-scrollbar">
      {TAB_OPTIONS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-6 py-4 text-sm font-bold whitespace-nowrap transition-all relative",
            activeTab === tab.id
              ? "text-blue-600"
              : "text-gray-400 hover:text-gray-600"
          )}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
};

export default TrackingTabs;
