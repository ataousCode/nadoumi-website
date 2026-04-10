import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../../components/layout/AdminLayout';
import ConversationSidebar from '../../features/messages/components/ConversationSidebar';
import ChatHeader from '../../features/messages/components/ChatHeader';
import MessageThread from '../../features/messages/components/MessageThread';
import MessageInput from '../../features/messages/components/MessageInput';
import { messageService } from '../../api/messages';
import { authService } from '../../api/auth.service';
import { sendTypingStatus, subscribeToMessages } from '../../api/socket';
import { useChatSocket } from '../../features/messages/hooks/useChatSocket';
import AdminLoading from '../../features/admin/components/AdminLoading';

const AdminMessagesPage = () => {
  const queryClient = useQueryClient();
  const [activeConversationId, setActiveConversationId] = useState(null);

  // 1. Fetch Admin Profile
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: () => authService.getAdminProfile(),
    retry: false,
    refetchOnWindowFocus: false,
  });
  const admin = profileData?.data || profileData;

  // 2. Fetch Conversations
  const { data: rawConversations, isLoading: convLoading } = useQuery({
    queryKey: ['admin-conversations'],
    queryFn: () => messageService.getConversations('admin'),
    retry: false,
    refetchOnWindowFocus: false,
  });
  const conversations = Array.isArray(rawConversations)
    ? rawConversations
    : Array.isArray(rawConversations?.data)
    ? rawConversations.data
    : [];

  // Auto-select first conversation
  useEffect(() => {
    if (conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  // 3. Fetch Messages for Active Conversation
  const { data: rawMessages, isLoading: msgsLoading } = useQuery({
    queryKey: ['admin-messages', activeConversationId],
    queryFn: () => messageService.getMessages(activeConversationId, 'admin'),
    enabled: !!activeConversationId,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const messages = Array.isArray(rawMessages)
    ? rawMessages
    : Array.isArray(rawMessages?.data)
    ? rawMessages.data
    : [];

  // 4. Send Message Mutation
  const sendMutation = useMutation({
    mutationFn: (payload) =>
      messageService.sendMessage({
        conversationId: activeConversationId,
        ...payload,
      }, 'admin'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-conversations'] });
    },
    onError: (err) => {
      console.error('Send failed:', err);
    },
  });

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || null;

  // 5. Real-time socket hook
  const { typingUser, onlineUsers } = useChatSocket(
    activeConversationId,
    activeConversation?.studentId,
    'admin'
  );

  // Auto-refresh conversations when opening one to clear unread counts
  useEffect(() => {
    if (activeConversationId) {
      queryClient.invalidateQueries({ queryKey: ['admin-conversations'] });
    }
  }, [activeConversationId, queryClient]);

  const totalUnread = conversations.reduce(
    (sum, c) => sum + (c.unreadCount || 0),
    0
  );

  const handleSelect = (id) => {
    setActiveConversationId(id);
  };

  const handleSend = (payload) => {
    sendMutation.mutate(payload);
  };

  const handleTyping = (isTyping) => {
    if (activeConversationId) {
      sendTypingStatus(activeConversationId, isTyping);
    }
  };

  if (profileLoading || convLoading) {
    return <AdminLoading message="Loading Communications..." subtext="Syncing your recent conversations and messages." />;
  }

  return (
    <div className="flex bg-white rounded-[32px] shadow-xl border border-gray-100/50 overflow-hidden h-[calc(100vh-160px)] animate-fadeIn">
      {/* Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={handleSelect}
        totalUnread={totalUnread}
        isAdminView={true}
      />

      {/* Main Chat */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50/20">
        {activeConversation ? (
          <>
            <ChatHeader
              conversation={activeConversation}
              isOnline={onlineUsers?.has?.(activeConversation.studentId)}
              isAdminView={true}
            />
            <MessageThread
              messages={messages}
              typingUser={typingUser}
              currentUserId={admin?.id || admin?._id}
              participant={activeConversation.student}
              isAdminView={true}
              isLoading={msgsLoading}
            />
            <MessageInput
              onSend={handleSend}
              onTyping={handleTyping}
              conversationId={activeConversationId}
              role="admin"
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-[40px] flex items-center justify-center mb-8 shadow-inner">
               <span className="text-4xl text-blue-600 animate-bounce">💬</span>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
              Direct Messaging
            </h3>
            <p className="text-sm font-bold text-gray-400 max-w-xs uppercase tracking-widest">
              Select a student conversation to begin responding.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessagesPage;
