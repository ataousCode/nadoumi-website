import { apiRequest, apiRequestFormData, setAuthToken, clearAuthTokens } from './config';

export const authService = {
  register: async (studentData) => {
    return await apiRequest('students/register', {
      method: 'POST',
      body: studentData,
    });
  },

  login: async (email, password) => {
    return await apiRequest('students/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  adminLogin: async (email, password) => {
    return await apiRequest('admin/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  verifyEmail: async (email, otp) => {
    return await apiRequest('students/verify-email', {
      method: 'POST',
      body: { email, otp },
    });
  },

  resendOTP: async (email) => {
    return await apiRequest('students/resend-otp', {
      method: 'POST',
      body: { email },
    });
  },

  forgotPassword: async (email) => {
    return await apiRequest('students/forgot-password', {
      method: 'POST',
      body: { email },
    });
  },

  resetPassword: async (token, password) => {
    return await apiRequest('students/reset-password', {
      method: 'POST',
      body: { token, password },
    });
  },

  logout: async (role = 'student') => {
    try {
      const endpoint = role === 'admin' ? 'admin/logout' : 'students/logout';
      await apiRequest(endpoint, { method: 'DELETE', tokenType: role });
    } finally {
      clearAuthTokens();
    }
  },

  getProfile: async () => {
    return await apiRequest('students/me');
  },

  getAdminProfile: async () => {
    const result = await apiRequest('admin/me');
    return result.data;
  },

  updateAdminProfile: async (data) => {
    const result = await apiRequest('admin/me', {
      method: 'PUT',
      body: data,
    });
    return result.data;
  },

  updateAdminProfilePicture: async (formData) => {
    const result = await apiRequestFormData('admin/me/profile-picture', formData);
    return result.data;
  },

  updateAdminPassword: async (currentPassword, newPassword) => {
    const result = await apiRequest('admin/me/password', {
      method: 'POST',
      body: { currentPassword, newPassword },
    });
    return result.data;
  },

  updateProfile: async (data) => {
    return await apiRequest('students/me', {
      method: 'PUT',
      body: data,
    });
  },

  updateProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return await apiRequestFormData('students/me/profile-picture', formData);
  }
};
