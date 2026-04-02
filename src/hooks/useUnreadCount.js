import { useQuery } from '@tanstack/react-query';
import { messageService } from '../api/messages';

/**
 * Global hook to fetch and sum the unread message counts for students.
 * Reuses the 'conversations' query key so it syncs with the Messages page.
 */
export const useUnreadCount = (roleInput = 'student') => {
  const role = roleInput?.toLowerCase() === 'admin' ? 'admin' : 'student';
  const queryKey = role === 'admin' ? ['admin-conversations'] : ['conversations'];

  const { data: rawConversations, isLoading } = useQuery({
    queryKey,
    queryFn: () => messageService.getConversations(role),
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });

  const conversations = Array.isArray(rawConversations)
    ? rawConversations
    : Array.isArray(rawConversations?.data)
    ? rawConversations.data
    : [];

  const unreadField = role === 'admin' ? 'unreadCountAdmin' : 'unreadCountStudent';
  
  const totalUnread = conversations.reduce(
    (sum, c) => sum + (parseInt(c[unreadField]) || 0),
    0
  );

  // Deep Transparency Log
  if (conversations.length > 0) {
    console.log(`[UNREAD TRACE] Role: ${role} | Field: ${unreadField} | Total: ${totalUnread}`, conversations.map(c => ({ id: c.id, [unreadField]: c[unreadField] })));
  }

  return { totalUnread, isLoading };
};
