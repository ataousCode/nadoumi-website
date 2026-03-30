import { apiRequest } from './config';

export const adminService = {
  getStats: async () => {
    const result = await apiRequest('admin/stats', { method: 'GET' });
    return result.data;
  },


  getAllApplications: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const result = await apiRequest(`applications?${query}`, { method: 'GET' });
    return result.data;
  },

  updateApplicationStatus: async (id, status, note, metadata = {}) => {
    const result = await apiRequest(`applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note, metadata }),
    });
    return result.data;
  },
  

  getAuditLogs: async (limit = 50) => {
    const result = await apiRequest(`admin/audit-feed?limit=${limit}`, { method: 'GET' });
    return result.data;
  }

};

