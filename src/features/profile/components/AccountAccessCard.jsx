import React from 'react';
import ProfileCard from '../../../components/common/Dashboard/ProfileCard';
import { Cog8ToothIcon, ChevronRightIcon, LockClosedIcon, BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const AccountAction = ({ icon: Icon, label }) => (
  <button className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 transition-all group">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
        <Icon className="w-4.5 h-4.5" />
      </div>
      <span className="text-[13px] font-bold text-gray-700">{label}</span>
    </div>
    <ChevronRightIcon className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-900 transition-all" />
  </button>
);

const AccountAccessCard = () => {
  return (
    <ProfileCard title="Account Access" icon={<Cog8ToothIcon className="w-5 h-5" />}>
      <div className="space-y-1">
        <AccountAction icon={LockClosedIcon} label="Change Password" />
        <AccountAction icon={BellIcon} label="Notification Settings" />
        <AccountAction icon={ShieldCheckIcon} label="Privacy & Security" />
      </div>
    </ProfileCard>
  );
};

export default AccountAccessCard;
