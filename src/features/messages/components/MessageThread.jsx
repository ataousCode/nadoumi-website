import React, { useRef, useEffect } from 'react';
import { DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { getImageURL } from '../../../api/config';
import logo from '../../../assets/icons/logo.jpg';

const MessageThread = ({ messages, typingUser, currentUserId, participant, isAdminView = false, isLoading }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
      {/* Date separator */}
      <div className="flex justify-center">
        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
          Today
        </span>
      </div>

      {messages.length === 0 && (
        <div className="flex justify-center pt-8">
          <p className="text-sm text-gray-400 font-medium">No messages yet. Say hello! 👋</p>
        </div>
      )}

      {messages.map((msg, idx) => {
        const isMe = msg.senderId && currentUserId && String(msg.senderId).trim().toLowerCase() === String(currentUserId).trim().toLowerCase();
        const type = msg.type || 'text'; // 'text', 'image', 'file'
        const time = msg.createdAt
          ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '';

        return (
          <div key={msg.id || idx} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            {!isMe && (
              <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                {participant?.profilePicture ? (
                  <img src={getImageURL(participant.profilePicture)} alt={participant.name} className="w-full h-full object-cover" />
                ) : (
                  <img 
                    src={isAdminView ? "https://ui-avatars.com/api/?name=" + encodeURIComponent(participant?.name || 'Student') + "&background=random" : logo} 
                    alt="Participant" 
                    className="w-full h-full object-cover" 
                  />
                )}
              </div>
            )}

            <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>

              {/* ─── IMAGE MESSAGE ─── */}
              {type === 'image' && (
                <div
                  className="rounded-2xl overflow-hidden cursor-pointer shadow-md hover:scale-[1.02] transition-transform"
                  onClick={() => {
                    const url = getImageURL(msg.fileUrl);
                    if (url) window.open(url, '_blank');
                  }}
                >
                  <img
                    src={getImageURL(msg.fileUrl)}
                    alt={msg.fileName || 'Image'}
                    className="max-w-[280px] max-h-[350px] object-cover block"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* ─── FILE MESSAGE ─── */}
              {type === 'file' && (
                <div
                  className={`flex items-center gap-3 p-4 rounded-2xl shadow-sm border ${
                    isMe
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-white border-gray-100 text-gray-800'
                  }`}
                  style={{ minWidth: '220px' }}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${isMe ? 'bg-blue-700' : 'bg-blue-50'}`}>
                    <DocumentTextIcon className={`w-6 h-6 ${isMe ? 'text-blue-200' : 'text-blue-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${isMe ? 'text-white' : 'text-gray-900'}`}>
                      {msg.fileName || 'Document'}
                    </p>
                    <p className={`text-[10px] mt-0.5 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                      {msg.fileSize || ''} • Document
                    </p>
                  </div>
                  {msg.fileUrl && (
                    <a
                      href={getImageURL(msg.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`p-2 rounded-lg flex-shrink-0 transition-all ${isMe ? 'bg-blue-700 hover:bg-blue-800 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'}`}
                    >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}

              {/* ─── TEXT MESSAGE ─── */}
              {type === 'text' && (
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm max-w-full ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                </div>
              )}

              {/* Timestamp + status */}
              <div className={`flex items-center gap-1 mt-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className="text-[10px] text-gray-300 font-medium">{time}</span>
                {isMe && (
                  <div className="flex items-center ml-1">
                    {msg.status === 'read' ? (
                      <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7m-7 6l4 4L22 7" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Typing indicator */}
      {typingUser && (
        <div className="flex items-end gap-2">
          <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
            {participant?.profilePicture ? (
              <img src={getImageURL(participant.profilePicture)} alt={participant.name} className="w-full h-full object-cover" />
            ) : (
              <img src={logo} alt="Participant" className="w-full h-full object-cover" />
            )}
          </div>
          <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm flex gap-1 items-center">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageThread;
