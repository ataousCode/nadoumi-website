import { apiRequest, getAuthToken, API_BASE_URL } from './config';

const BASE = 'messages';

export const messageService = {
  getConversations: async (role = null) => {
    const res = await apiRequest(`${BASE}/conversations`, { tokenType: role });
    return res?.data ?? res ?? [];
  },
  
  getSupportAdmins: async (role = null) => {
    const res = await apiRequest(`${BASE}/support-admins`, { tokenType: role });
    return res?.data ?? res ?? [];
  },
  
  getMessages: async (conversationId, role = null) => {
    if (!conversationId) return [];
    const res = await apiRequest(`${BASE}/conversations/${conversationId}/messages`, { tokenType: role });
    return res?.data ?? res ?? [];
  },
  
  sendMessage: async (payload, role = null) => {
    const res = await apiRequest(`${BASE}/send`, {
      method: 'POST',
      body: JSON.stringify(payload),
      tokenType: role
    });
    return res?.data ?? res;
  },
  
  createConversation: async (adminId, role = null) => {
    const res = await apiRequest(`${BASE}/conversations`, {
      method: 'POST',
      body: JSON.stringify({ adminId }),
      tokenType: role
    });
    return res?.data ?? res;
  },

  /**
   * Upload a file or image to the backend.
   * Returns: { url, name, size, type }
   */
  uploadFile: async (conversationId, file, role = 'student') => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await apiRequestFormData(
      `${BASE}/conversations/${conversationId}/upload`,
      formData,
      { tokenType: role }
    );

    // Backend returns { success: true, data: { url, name, size, type } }
    return res?.data ?? res;
  },
};
