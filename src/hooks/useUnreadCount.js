import { useQuery } from '@tanstack/react-query';
import { messageService } from '../api/messages';

/**
 * Global hook to fetch and sum the unread message counts for students.
 * Reuses the 'conversations' query key so it syncs with the Messages page.
 */
export const useUnreadCount = (role = 'student') => {
  const { data: rawConversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messageService.getConversations(role),
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });

  const conversations = Array.isArray(rawConversations)
    ? rawConversations
    : Array.isArray(rawConversations?.data)
    ? rawConversations.data
    : [];

  const totalUnread = conversations.reduce(
    (sum, c) => sum + (parseInt(c.unreadCount) || 0),
    0
  );

  return { totalUnread, isLoading };
};
