import { useState, useEffect } from 'react';
import { subscribeToPresence, queryPresence, subscribeToPresenceResponse, getSocket } from '../api/socket';

/**
 * Global-ready hook to track which users are online.
 * Can be used anywhere to show status indicators.
 */
export const usePresence = (targetUserId = null) => {
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

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

    socket.on('status:update', presenceHandler);
    socket.on('presence:res', presenceResHandler);

    if (targetUserId) {
      queryPresence(targetUserId);
    }

    return () => {
      socket.off('status:update', presenceHandler);
      socket.off('presence:res', presenceResHandler);
    };
  }, [targetUserId]);

  const isOnline = (userId) => onlineUsers.has(userId);

  return { onlineUsers, isOnline };
};
