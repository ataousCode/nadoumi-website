import React from 'react';
import { getImageURL } from '../../../api/config';
import logo from '../../../assets/icons/logo.jpg';
import { usePresence } from '../../../hooks/usePresence';
import Skeleton from '../../../components/common/Skeleton';

const ConversationSidebar = ({ 
  conversations = [], 
  supportAdmins = [], 
  activeId, 
  onSelect, 
  totalUnread = 0, 
  isAdminView = false,
  isLoading = false 
}) => {
  const { isOnline } = usePresence();

  // Top "Stories" - The authorized support admins
  const stories = (supportAdmins || []).map(admin => ({
    id: admin.id,
    name: admin.name.split(' ')[0], // First name for compact story view
    fullName: admin.name,
    image: admin.profilePicture ? getImageURL(admin.profilePicture) : logo,
    isOnline: isOnline(admin.id)
  }));

  if (isLoading) {
    return (
      <div className="w-[300px] border-r border-gray-100 flex flex-col bg-white">
        <div className="p-6 pb-2">
            <Skeleton className="h-8 w-24 mb-4" />
        </div>
        <div className="px-6 flex gap-4 pb-6 border-b border-gray-50 mt-2">
            {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col items-center gap-2">
                    <Skeleton variant="circle" className="w-14 h-14" />
                    <Skeleton className="h-2 w-10" />
                </div>
            ))}
        </div>
        <div className="flex-1 p-4 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex gap-4">
                    <Skeleton variant="circle" className="w-12 h-12 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-2 w-full" />
                    </div>
                </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-[300px] border-r border-gray-100 flex flex-col bg-white">
      {/* Search Header (Placeholder) */}
      <div className="p-6 pb-2">
        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center justify-between">
          Inbox
          {totalUnread > 0 && (
            <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider">
              {totalUnread} New
            </span>
          )}
        </h2>
      </div>

      {/* Stories Section */}
      <div className="px-6 flex gap-4 overflow-x-auto no-scrollbar pb-6 border-b border-gray-50 mt-2">
        {stories.map((story) => {
          const isActive = activeId === story.id;
          return (
            <div 
              key={story.id} 
              onClick={() => onSelect(story.id)}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div className={`w-14 h-14 rounded-full p-0.5 border-2 relative ${isActive ? 'border-blue-600' : 'border-gray-100'} group-hover:border-blue-400 transition-all`}>
                <div className={`w-full h-full rounded-full overflow-hidden flex items-center justify-center ${story.color || 'bg-gray-50'}`}>
                  {story.image ? (
                    <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">{story.icon}</span>
                  )}
                </div>
                {/* Online Status Indicator */}
                {story.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                )}
              </div>
              <span className={`text-[10px] font-bold ${isActive ? 'text-blue-600' : 'text-gray-500'} group-hover:text-gray-900 transition-colors uppercase tracking-tight`}>
                {story.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-4">
        {conversations.map((conv) => {
          const isActive = activeId === conv.id;
          const participant = isAdminView ? conv.student : conv.admin;
          const participantName = isAdminView 
            ? (participant?.firstName ? `${participant.firstName} ${participant.lastName}` : (participant?.name || 'Student'))
            : (participant?.name || 'Support');
          const lastMsgAt = conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
          const participantIsOnline = isOnline(participant?.id);
          
          return (
            <div 
              key={conv.id} 
              onClick={() => onSelect(conv.id)}
              className={`px-6 py-5 flex gap-4 cursor-pointer transition-all relative ${isActive ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
            >
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600" />}
              
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 relative">
                 {participant?.profilePicture ? (
                   <img src={getImageURL(participant.profilePicture)} alt={participantName} className="w-full h-full object-cover" />
                 ) : (
                   <img 
                    src={isAdminView ? "https://ui-avatars.com/api/?name=" + encodeURIComponent(participantName) + "&background=random" : logo} 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                  />
                 )}
                 {/* Online Status Dot */}
                 {participantIsOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                 )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-[13px] font-black truncate ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
                    {participantName}
                  </h4>
                  <span className="text-[10px] font-bold text-gray-400">{lastMsgAt}</span>
                </div>
                <p className="text-[11px] font-medium text-gray-500 truncate leading-relaxed">
                  {conv.lastMessage || 'No messages yet'}
                </p>
                
                {conv.unreadCount > 0 && (
                   <div className="mt-2 flex">
                     <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                       {conv.unreadCount}
                     </span>
                   </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationSidebar;
