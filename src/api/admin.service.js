import { apiRequest } from './axiosInstance.js';

export const adminService = {
  // --- Dashboard & Analytics ---
  getStats: async () => {
    const result = await apiRequest('admin/stats', { method: 'GET' });
    return result.data;
  },

  getAuditLogs: async (limit = 50) => {
    const result = await apiRequest(`admin/audit-feed?limit=${limit}`, { method: 'GET' });
    return result.data;
  },

  // --- Applications Management ---
  getAllApplications: async (params = {}) => {
    // Clean up params - remove 'all' and undefined keys
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'all') {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    const query = new URLSearchParams(cleanParams).toString();
    const result = await apiRequest(`applications?${query}`, { method: 'GET' });
    return result.data || result;
  },

  getApplicationById: async (id) => {
    const result = await apiRequest(`applications/${id}`);
    return result.data || result;
  },

  updateApplicationStatus: async (id, statusData) => {
    // Support both old (positional) and new (object) arg passing if needed
    const body = typeof statusData === 'object' ? statusData : { status: arguments[1], note: arguments[2] };
    const result = await apiRequest(`applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return result.data || result;
  },

  uploadAdminDoc: async (id, formData) => {
    const result = await apiRequest(`applications/${id}/admin-documents`, {
      method: 'PUT',
      body: formData,
      isFormData: true
    });
    return result.data || result;
  },

  addApplicationNote: async (id, note) => {
    const result = await apiRequest(`applications/${id}/notes`, {
      method: 'POST',
      body: { note }
    });
    return result.data || result;
  }
};
