import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
    initiateSocketConnection,
    disconnectSocket,
    joinConversation,
    leaveConversation,
    subscribeToMessages,
    subscribeToTyping,
    subscribeToPresence,
    queryPresence,
    subscribeToPresenceResponse,
    getSocket,
} from '../../../api/socket';
import { getAuthToken } from '../../../api/config';

export const useChatSocket = (activeConversationId, targetUserId, role = 'student') => {
    const queryClient = useQueryClient();
    const [typingUser, setTypingUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(new Set());

    // 1. Manage Socket Connection (Stability Fix)
    // Only connects when token or role changes
    useEffect(() => {
        const token = getAuthToken(role);
        if (!token) return;

        console.log(`[Socket] Initializing for ${role}...`);
        initiateSocketConnection(token);

        const socket = getSocket();
        if (!socket) return;

        // Listen for new messages
        const messageHandler = (newMessage) => {
            const queryKey = role === 'admin' ? ['admin-messages', newMessage.conversationId] : ['messages', newMessage.conversationId];
            
            // Update cache only if it matches current active chat or just invalidates
            queryClient.setQueryData(
                queryKey,
                (old = []) => {
                    const existing = Array.isArray(old) ? old : (Array.isArray(old?.data) ? old.data : []);
                    if (existing.find((m) => m.id === newMessage.id)) return old;
                    
                    const updated = [...existing, newMessage];
                    return Array.isArray(old) ? updated : { ...old, data: updated };
                }
            );

            // Invalidate conversations list to show last message/unread
            const conversationsKey = role === 'admin' ? ['admin-conversations'] : ['conversations'];
            queryClient.invalidateQueries({ queryKey: conversationsKey });
        };

        const refreshHandler = () => {
            const conversationsKey = role === 'admin' ? ['admin-conversations'] : ['conversations'];
            queryClient.invalidateQueries({ queryKey: conversationsKey });
        };

        const typingHandler = (data) => {
            if (data?.conversationId === activeConversationId) {
                setTypingUser(data.isTyping ? data.userId : null);
            }
        };

        const presenceHandler = (data) => {
            if (!data?.userId) return;
            setOnlineUsers((prev) => {
                const next = new Set(prev);
                if (data.status === 'online') next.add(data.userId);
                else next.delete(data.userId);
                return next;
            });
        };

        const presenceResHandler = (data) => {
            if (data?.isOnline && data?.userId) {
                setOnlineUsers((prev) => {
                    const next = new Set(prev);
                    next.add(data.userId);
                    return next;
                });
            }
        };

        const readStatusHandler = (data) => {
            if (data?.conversationId === activeConversationId) {
                const messageKey = role === 'admin' ? ['admin-messages', activeConversationId] : ['messages', activeConversationId];
                queryClient.invalidateQueries({ queryKey: messageKey });
            }
        };

        socket.on('message:new', messageHandler);
        socket.on('messages:read', readStatusHandler);
        socket.on('conversations:refresh', refreshHandler);
        socket.on('user:typing', typingHandler);
        socket.on('status:update', presenceHandler);
        socket.on('presence:res', presenceResHandler);

        // Initial presence query
        if (targetUserId) {
            queryPresence(targetUserId);
        }

        return () => {
            console.log(`[Socket] Cleaning up ${role} connection...`);
            socket.off('message:new', messageHandler);
            socket.off('messages:read', readStatusHandler);
            socket.off('conversations:refresh', refreshHandler);
            socket.off('user:typing', typingHandler);
            socket.off('status:update', presenceHandler);
            socket.off('presence:res', presenceResHandler);
            disconnectSocket();
        };
    }, [role, queryClient]); // Only reconnect if role/client changes

    // 2. Manage Conversation Room Subscriptions
    useEffect(() => {
        if (activeConversationId) {
            joinConversation(activeConversationId);
            setTypingUser(null); // Reset typing state on switch
            return () => leaveConversation(activeConversationId);
        }
    }, [activeConversationId]);

    // 3. Periodic presence update for target
    useEffect(() => {
        if (targetUserId) {
            queryPresence(targetUserId);
        }
    }, [targetUserId]);

    return { typingUser, onlineUsers };
};
