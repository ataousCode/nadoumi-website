import React from 'react';
import { getImageURL } from '../../../api/axiosInstance.js';
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

  // Helper to extract a reliable ID from various backend formats
  const getSafeId = (obj) => obj?.id || obj?._id || obj?.uuid || null;

  // Top "Stories" calculation for legacy/mobile support (kept internal)
  const stories = (supportAdmins || []).map(admin => {
    const adminName = admin?.name || admin?.fullName || 'Support';
    const adminId = getSafeId(admin);
    return {
      id: adminId,
      name: adminName.includes(' ') ? adminName.split(' ')[0] : adminName,
      fullName: adminName,
      image: admin.profilePicture ? getImageURL(admin.profilePicture) : null,
      isOnline: isOnline(adminId)
    };
  });

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
    <div className="w-[300px] border-r border-gray-100 flex flex-col bg-white h-full shadow-sm">
      {/* Search Header */}
      <div className="p-6 pb-2">
        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center justify-between">
          Inbox
          {totalUnread > 0 && (
            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider">
              {totalUnread} New
            </span>
          )}
        </h2>
      </div>

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-12">
        
        {/* Recent Conversations */}
        <div className="mb-2">
          {conversations.length > 0 && (
            <div className="px-6 py-2">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Recent Chats
              </h3>
            </div>
          )}
          
          {conversations.map((conv) => {
            const isActive = activeId === conv.id;
            const participant = isAdminView ? conv.student : conv.admin;
            const participantName = isAdminView 
              ? (participant?.firstName ? `${participant.firstName} ${participant.lastName}` : (participant?.name || 'Student'))
              : (participant?.name || 'Support');
            const lastMsgAt = conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
            const pId = getSafeId(participant);
            const participantIsOnline = isOnline(pId);
            
            return (
              <div 
                key={conv.id} 
                onClick={() => onSelect(conv.id)}
                className={`px-6 py-4 flex gap-4 cursor-pointer transition-all relative ${isActive ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />}
                
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 relative">
                   {participant?.profilePicture ? (
                     <img src={getImageURL(participant.profilePicture)} alt={participantName} className="w-full h-full object-cover" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-bold text-xs uppercase">
                        {(participantName || 'S').substring(0, 2)}
                      </div>
                   )}
                   {participantIsOnline && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                   )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className={`text-[12px] font-black truncate ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
                      {participantName}
                    </h4>
                    <span className="text-[9px] font-bold text-gray-400">{lastMsgAt}</span>
                  </div>
                  <p className="text-[10px] font-medium text-gray-500 truncate mt-0.5">
                    {conv.lastMessage || 'No messages yet'}
                  </p>
                  
                  {conv.unreadCount > 0 && (
                     <div className="mt-1 flex">
                       <span className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                         {conv.unreadCount}
                       </span>
                     </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Support Team (Direct Contact) Section */}
        <div className="mt-4 px-6">
          <div className="mb-4 flex items-center justify-between border-t border-gray-50 pt-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Available Support
            </h3>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
          
          <div className="space-y-2">
            {supportAdmins.map((admin) => {
              const adminId = getSafeId(admin);
              // Only show in direct contact if they DON'T have an active conversation
              const hasActiveConv = conversations.some(c => 
                (isAdminView ? getSafeId(c.student) : getSafeId(c.admin)) === adminId
              );
              
              if (hasActiveConv) return null;

              return (
                <div 
                  key={adminId || Math.random()} 
                  onClick={() => onSelect(adminId)}
                  className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 rounded-xl hover:bg-gray-50 hover:shadow-sm border border-transparent hover:border-gray-100 transition-all"
                >
                  <div className="w-9 h-9 rounded-xl overflow-hidden border border-gray-100 bg-white flex-shrink-0 relative">
                    {admin.profilePicture ? (
                      <img src={getImageURL(admin.profilePicture)} alt={admin.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 font-bold text-[9px] uppercase">
                        {(admin.name || admin.fullName || 'Admin').substring(0, 2)}
                      </div>
                    )}
                    {isOnline(adminId) && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white rounded-full shadow-sm" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-gray-900 group-hover:text-blue-600 truncate transition-colors">
                      {admin.name || admin.fullName || 'Support Agent'}
                    </p>
                    <p className="text-[9px] font-bold text-blue-500 uppercase tracking-tight">Chat Now</p>
                  </div>
                  
                  <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <span className="text-[10px]">💬</span>
                  </div>
                </div>
              );
            })}
            
            {/* If NO admins are showing, confirm it's truly empty */}
            {supportAdmins.filter(admin => !conversations.some(c => (isAdminView ? getSafeId(c.student) : getSafeId(c.admin)) === getSafeId(admin))).length === 0 && (
                <div className="py-8 px-4 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Team Offline</p>
                    <p className="text-[9px] text-gray-400 mt-1">Try again later</p>
                </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ConversationSidebar;
