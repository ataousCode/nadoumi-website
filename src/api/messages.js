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
    const token = getAuthToken(role);
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${API_BASE_URL}/messages/conversations/${conversationId}/upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || `Upload failed with status ${response.status}`);
    }

    const json = await response.json();
    // Backend returns { success, data: { url, name, size, type } }
    return json?.data ?? json;
  },
};
