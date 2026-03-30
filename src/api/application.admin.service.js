import { apiRequest } from './config';

export const applicationAdminService = {
  /**
   * Fetch all applications with filters
   */
  getAll: async (params = {}) => {
    // Clean up params - remove 'all' and undefined keys
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'all') {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    const query = new URLSearchParams(cleanParams).toString();
    const result = await apiRequest(`/applications?${query}`);
    return result;
  },

  /**
   * Fetch a single application with full details
   */
  getById: async (id) => {
    const result = await apiRequest(`/applications/${id}`);
    return result;
  },

  /**
   * Update application status with note and metadata
   */
  updateStatus: async (id, statusData) => {
    const result = await apiRequest(`/applications/${id}/status`, {
      method: 'PUT',
      body: statusData
    });
    return result;
  },

  /**
   * Upload an official document for an application (Admission Letter, JW202)
   */
  uploadAdminDoc: async (id, formData) => {
    const result = await apiRequest(`/applications/${id}/admin-documents`, {
      method: 'PUT',
      body: formData,
      isFormData: true
    });
    return result;
  },

  /**
   * Add a note to communication history or audit log
   */
  addNote: async (id, note) => {
    const result = await apiRequest(`/applications/${id}/notes`, {
      method: 'POST',
      body: { note }
    });
    return result;
  }
};
