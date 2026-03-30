import React from "react";
import { Link } from "react-router-dom";
import { getStatusConfig } from "../../../constants/statusConfig";
import StatusBadge from "../../../components/common/Dashboard/StatusBadge";
import StatusSpecificContent from "./StatusSpecificContent";

const ApplicationTrackingCard = ({ application }) => {
  const statusConfig = getStatusConfig(application.status);
  const scholarship = application.scholarship || {};
  const university = scholarship.university || {};
  
  // Format the application date
  const appliedDate = application.submittedAt 
    ? new Date(application.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : "N/A";

  const scholarshipTitle = scholarship.title || "Untitled Scholarship";
  const universityName = university.name || university.nameInChinese || "Global University";
  const scholarshipBenefits = scholarship.benefits?.general || scholarship.category || "Full Scholarship";

  return (
    <div className="bg-white rounded-[24px] overflow-hidden border border-gray-100/50 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row h-full md:h-48 group">
      {/* Thumbnail Section */}
      <div className="w-full md:w-64 h-48 md:h-full relative overflow-hidden bg-gray-50">
        <img 
          src={university.logo || university.bannerImage || "https://images.unsplash.com/photo-1541339907198-e08756eaa539?q=80&w=2070&auto=format&fit=crop"} 
          alt={scholarshipTitle}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge label={statusConfig.label} variant={statusConfig.color === 'yellow' ? 'warning' : statusConfig.color} />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              ID: {application.applicationId || application.id?.split('-')[0]}
            </span>
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">
            Applied On <br className="md:hidden" />
            <span className="text-gray-900 ml-1">{appliedDate}</span>
          </div>
        </div>

        <h3 className="text-lg font-black text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
          {scholarshipTitle}
        </h3>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-auto">
          {universityName} • {scholarshipBenefits}
        </p>

        {/* Dynamic Status Row */}
        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
          <StatusSpecificContent application={application} />
          <Link 
            to={`/application/${application.applicationId || application.id}`}
            className="px-6 py-2 bg-gray-50 hover:bg-gray-100 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ApplicationTrackingCard;
