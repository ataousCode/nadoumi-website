import React from 'react';
import { CameraIcon, CheckBadgeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { getImageURL } from '../../../../api/config';

const ProfileHeader = ({ admin, isUploading, onUpload }) => {
  const maskDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown';
  
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-12 rounded-[48px] border border-gray-100 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/40 rounded-full -mr-40 -mt-40 blur-3xl" />
      <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
        <label className="group relative cursor-pointer">
          <div className="w-36 h-36 rounded-[40px] overflow-hidden bg-gray-50 border-4 border-white shadow-2xl ring-1 ring-gray-100 transition-all group-hover:scale-105">
            {admin?.profilePicture ? (
              <img src={getImageURL(admin.profilePicture)} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 text-4xl font-black">
                {(admin?.name?.[0] || 'A').toUpperCase()}
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
              </div>
            )}
          </div>
          <div className="absolute -bottom-3 -right-3 p-3 bg-gray-900 text-white rounded-2xl shadow-xl transition-all group-hover:bg-blue-600">
            <CameraIcon className="w-6 h-6" />
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={(e) => onUpload(e.target.files[0])} />
        </label>

        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">{admin?.name || 'Administrator'}</h1>
            <CheckBadgeIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4 text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">
             <span className="flex items-center gap-1.5"><ShieldCheckIcon className="w-3.5 h-3.5" />System {admin?.role || 'Admin'}</span>
             <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
             <span>ID: #{admin?.id?.slice(0, 8)}</span>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex gap-12 border-l border-gray-100 pl-12 h-20 items-center">
        <HeaderStat label="Date Joined" value={maskDate(admin?.createdAt)} />
        <HeaderStat label="Security" value="Verified" valueColor="text-emerald-500" />
      </div>
    </div>
  );
};

const HeaderStat = ({ label, value, valueColor = "text-gray-900" }) => (
  <div>
    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-base font-black ${valueColor}`}>{value}</p>
  </div>
);

export default ProfileHeader;
