import React from 'react';
import ProfileCard from '../../../components/common/Dashboard/ProfileCard';
import DetailItem from '../../../components/common/Dashboard/DetailItem';
import { AcademicCapIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

const AcademicBackgroundCard = ({ profile }) => {
  const education = profile?.education?.[0] || {};

  return (
    <ProfileCard 
      title="Academic Background" 
      icon={<AcademicCapIcon className="w-5 h-5" />}
      action={{ label: "Update Record", onClick: () => {} }}
    >
      {/* University Banner */}
      <div className="bg-[#F8FAFC] rounded-2xl p-5 mb-8 flex items-center gap-5 border border-blue-50">
        <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
          <BuildingLibraryIcon className="w-7 h-7 text-blue-600" />
        </div>
        <div>
          <h4 className="text-sm font-black text-gray-900 leading-tight mb-0.5">
            {education.institution || 'University not specified'}
          </h4>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
            {education.degree} {education.field ? `in ${education.field}` : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <DetailItem label="Current Level" value={education.graduated ? 'Graduated' : 'Undergraduate'} />
        <DetailItem 
          label="GPA / Grade" 
          value={education.gpa ? education.gpa.toString() : null} 
          className="[&_p:last-child]:text-green-600"
        />
        <DetailItem label="Graduation Year" value={education.gradYear} />
      </div>
    </ProfileCard>
  );
};

export default AcademicBackgroundCard;
