import React from 'react';
import ProfileCard from '../../../components/common/Dashboard/ProfileCard';
import InterestTag from '../../../components/common/Dashboard/InterestTag';
import { HeartIcon, MapPinIcon } from '@heroicons/react/24/outline';

const StudyPreferencesCard = ({ profile }) => {
  const preferences = profile?.preferences || {};
  
  const parseTags = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  };

  const fields = parseTags(preferences.desiredField);
  const cities = parseTags(preferences.preferredCities);

  return (
    <ProfileCard 
      title="Study Preferences" 
      icon={<HeartIcon className="w-5 h-5 text-blue-600" />}
      className="h-full"
    >
      <div className="space-y-10">
        {/* Study Level */}
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Study Level</p>
          <div className="flex gap-2">
            <InterestTag label={preferences.studyLevel || 'Not specified'} color="blue" />
          </div>
        </div>

        {/* Fields of Interest */}
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Fields of Interest</p>
          <div className="flex flex-wrap gap-2">
            {fields.length > 0 ? fields.map((field, i) => (
              <InterestTag key={i} label={field} color="indigo" />
            )) : <span className="text-[11px] text-gray-300 font-bold italic">No fields selected</span>}
          </div>
        </div>

        {/* Preferred Destinations */}
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Preferred Destinations</p>
          <div className="space-y-3">
            {cities.length > 0 ? cities.map((city, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300">
                  <MapPinIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-black text-gray-600 uppercase tracking-tight">{city}</span>
              </div>
            )) : <span className="text-[11px] text-gray-300 font-bold italic">No destinations selected</span>}
          </div>
        </div>
      </div>
    </ProfileCard>
  );
};

export default StudyPreferencesCard;
