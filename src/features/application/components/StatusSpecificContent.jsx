import React from "react";
import ProgressBar from "./ProgressBar";

const StatusSpecificContent = ({ application }) => {
  const { status, interviewDetails } = application;

  if (status === "under_review") {
    // Assuming progress is either in a field or we default to a value
    const progress = application.progress || 45; 
    return (
      <div className="flex-1 max-w-[240px]">
        <div className="flex justify-between items-end mb-2">
          <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Application Progress</p>
          <p className="text-[9px] font-bold text-gray-400">{progress}%</p>
        </div>
        <ProgressBar progress={progress} />
      </div>
    );
  }

  if (status === "interview" && interviewDetails) {
    const formattedDate = interviewDetails.date 
      ? new Date(interviewDetails.date).toLocaleDateString('en-US', { 
          month: 'short', day: 'numeric', year: 'numeric' 
        }) + (interviewDetails.time ? ` at ${interviewDetails.time}` : '')
      : "To be scheduled";

    return (
      <div className="flex-1 flex items-center gap-4 bg-blue-50/50 p-3 rounded-xl">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-bold text-gray-400 uppercase">Interview Date</p>
          <p className="text-xs font-black text-gray-900 truncate">{formattedDate}</p>
        </div>
        {interviewDetails.videoCallLink && (
          <button 
            onClick={() => window.open(interviewDetails.videoCallLink, '_blank')}
            className="px-3 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase rounded-lg hover:bg-blue-700 transition-colors"
          >
            Join
          </button>
        )}
      </div>
    );
  }

  return (
    <p className="text-[11px] font-medium text-gray-500 italic">
      {application.adminNote || (status === 'pending' ? "Waiting for initial review..." : `Status: ${status.replace('_', ' ')}`)}
    </p>
  );
};

export default StatusSpecificContent;
