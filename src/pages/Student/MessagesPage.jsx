import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import StudentLayout from '../../components/layout/StudentLayout';
import ConversationSidebar from '../../features/messages/components/ConversationSidebar';
import ChatHeader from '../../features/messages/components/ChatHeader';
import MessageThread from '../../features/messages/components/MessageThread';
import MessageInput from '../../features/messages/components/MessageInput';
import { messageService } from '../../api/messages';
import { authService } from '../../api/auth.service';
import { sendTypingStatus, subscribeToMessages, getSocket } from '../../api/socket';
import { useChatSocket } from '../../features/messages/hooks/useChatSocket';

const MessagesPage = () => {
  const queryClient = useQueryClient();
  const [activeConversationId, setActiveConversationId] = useState(null);

  // 1. Fetch User Profile
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
    retry: false,
  });
  const user = profileData?.data || profileData;

  // 1.1 Fetch Support Admins
  const { data: supportAdmins, isLoading: adminsLoading } = useQuery({
    queryKey: ['support-admins'],
    queryFn: () => messageService.getSupportAdmins('student'),
    retry: false,
  });

  // 2. Fetch Conversations
  const { data: rawConversations, isLoading: convLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messageService.getConversations('student'),
    retry: false,
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
    queryKey: ['messages', activeConversationId],
    queryFn: () => messageService.getMessages(activeConversationId, 'student'),
    enabled: !!activeConversationId,
    retry: false,
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
      }, 'student'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (err) => {
      console.error('Send failed:', err);
    },
  });

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || null;

  // 5. Real-time socket hook
  // Note: we might need to update useChatSocket for multiple admins if needed
  const { typingUser, onlineUsers } = useChatSocket(
    activeConversationId,
    activeConversation?.adminId,
    'student'
  );

  // Auto-refresh conversations when opening one to clear unread counts
  useEffect(() => {
    if (activeConversationId) {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  }, [activeConversationId, queryClient]);

  // Helper: is this a support admin conversation?
  const isSupportConv = (c) => {
    // If the conversation has an admin, it's a support conversation for students
    return !!c?.adminId || !!c?.admin;
  };

  const totalUnread = conversations.filter(isSupportConv).reduce(
    (sum, c) => sum + (parseInt(c.unreadCount) || 0),
    0
  );

  const handleSelect = (id) => {
    // If id is an admin ID from supportAdmins
    const targetAdmin = supportAdmins?.find(a => a.id === id);
    if (targetAdmin) {
      const existing = conversations.find(c => c.adminId === id);
      if (existing) {
        setActiveConversationId(existing.id);
        return;
      }
      messageService
        .createConversation(id, 'student')
        .then((res) => {
          const conv = res?.data || res;
          setActiveConversationId(conv.id);
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        })
        .catch((err) => console.error('Create conversation failed:', err));
    } else {
      setActiveConversationId(id);
    }
  };

  const handleSend = (payload) => {
    sendMutation.mutate(payload);
  };

  const handleTyping = (isTyping) => {
    if (activeConversationId) {
      sendTypingStatus(activeConversationId, isTyping);
    }
  };

  // Loading state — safe, no layout dependencies
  if (profileLoading || convLoading || adminsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <StudentLayout user={user}>
      <div className="flex bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden h-[calc(100vh-140px)]">
        {/* Sidebar */}
        <ConversationSidebar
          conversations={conversations.filter(isSupportConv)}
          supportAdmins={supportAdmins}
          activeId={activeConversationId}
          onSelect={handleSelect}
          totalUnread={totalUnread}
        />

        {/* Main Chat */}
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50/30">
          {activeConversation ? (
            <>
              <ChatHeader
                conversation={activeConversation}
                isOnline={onlineUsers?.has?.(activeConversation.adminId)}
              />
              <MessageThread
                messages={messages}
                typingUser={typingUser}
                currentUserId={user?.id || user?._id}
                participant={activeConversation?.admin}
                isLoading={msgsLoading}
              />
              <MessageInput
                onSend={handleSend}
                onTyping={handleTyping}
                conversationId={activeConversationId}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
                <span className="text-4xl">💬</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">
                Your Inbox
              </h3>
              <p className="text-sm font-medium text-gray-400 max-w-xs">
                Select a conversation to start messaging with Nadoumi Support.
              </p>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default MessagesPage;
