import React from 'react';
import { PhoneIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { getImageURL } from '../../../api/config';
import logo from '../../../assets/icons/logo.jpg';

const ChatHeader = ({ conversation, isOnline, isAdminView = false }) => {
  if (!conversation) return null;

  // In Admin View, the participant is the Student. In Student View, it's the Admin.
  const participant = isAdminView ? conversation.student : conversation.admin;
  const participantName = participant?.name || (isAdminView ? 'Student' : 'Support');
  const OFFICE_PHONE = "+86 159 0823 7607";

  return (
    <div className="h-20 px-8 flex items-center justify-between border-b border-gray-100/50 bg-white/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-blue-50 flex items-center justify-center border border-blue-50">
            {participant?.profilePicture ? (
              <img src={getImageURL(participant.profilePicture)} alt={participantName} className="w-full h-full object-cover" />
            ) : (
              <img 
                src={isAdminView ? "https://ui-avatars.com/api/?name=" + encodeURIComponent(participantName) + "&background=random" : logo} 
                alt="Avatar" 
                className="w-full h-full object-cover" 
              />
            )}
          </div>
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-black text-gray-900">{participantName}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            {isOnline ? (
              <>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">
                  Online
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Standard Response Time: &lt; 2 hours
                </span>
              </>
            ) : (
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Offline
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <a 
          href={`tel:${OFFICE_PHONE.replace(/\s/g, '')}`}
          className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
          title={`Call Office: ${OFFICE_PHONE}`}
        >
          <PhoneIcon className="w-5 h-5" />
        </a>
        <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
          <InformationCircleIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
