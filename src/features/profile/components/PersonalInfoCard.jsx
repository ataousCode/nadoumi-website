import React from 'react';
import ProfileCard from '../../../components/common/Dashboard/ProfileCard';
import DetailItem from '../../../components/common/Dashboard/DetailItem';
import { UserIcon } from '@heroicons/react/24/outline';

const PersonalInfoCard = ({ student }) => {
  return (
    <ProfileCard 
      title="Personal Information" 
      icon={<UserIcon className="w-5 h-5" />}
      action={{ label: "Edit Details", onClick: () => {} }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
        <DetailItem label="Full Name" value={`${student?.firstName} ${student?.lastName}`} />
        <DetailItem label="Email Address" value={student?.email} />
        <DetailItem label="Phone Number" value={student?.phone} />
        <DetailItem label="Date of Birth" value={student?.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null} />
        <DetailItem label="Nationality" value={student?.country} />
        <DetailItem label="Gender" value={student?.gender} />
      </div>
    </ProfileCard>
  );
};

export default PersonalInfoCard;
