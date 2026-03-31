import axios from 'axios';

// ─────────────────────────────────────────────
// Base Config
// ─────────────────────────────────────────────
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api"; // Default to relative path or /api if not set

// ─────────────────────────────────────────────
// Token Management (localStorage)
// ─────────────────────────────────────────────
export const getAuthToken = (type = null) => {
  const adminToken   = localStorage.getItem('adminToken');
  const studentToken = localStorage.getItem('studentToken');

  if (type === 'student') return studentToken;
  if (type === 'admin')   return adminToken;
  
  const path = window.location.pathname.toLowerCase();
  const isStudentDashboard = path.includes('/profile') || 
                             path.includes('/applications') ||
                             path.includes('/messages') ||
                             path.includes('/students');

  if (isStudentDashboard && studentToken) return studentToken;
  if (path.includes('/admin') && adminToken) return adminToken;

  return studentToken || adminToken;
};

export const isAuthenticated = (type = 'student') => {
  return !!getAuthToken(type);
};

export const setAuthToken = (token, type = 'admin') => {
  if (token) {
    if (type === 'student') {
      localStorage.setItem('studentToken', token);
      // Only remove admin if it's actually there to avoid unnecessary state changes
      if (localStorage.getItem('adminToken')) localStorage.removeItem('adminToken');
    } else {
      localStorage.setItem('adminToken', token);
      if (localStorage.getItem('studentToken')) localStorage.removeItem('studentToken');
    }
  } else {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('studentToken');
  }
};

export const clearAuthTokens = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('studentToken');
};

// ─────────────────────────────────────────────
// Endpoint → token-type mapping
// ─────────────────────────────────────────────
const isStudentEndpoint = (url) => {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  
  // PRIMARY STUDENT KEYS: login, register, me, and specific dashboards
  return (
    lowerUrl.includes('/students/') ||  // Covers /api/students/login, me, etc.
    lowerUrl.includes('/student/') ||   // Covers /api/applications/student/
    lowerUrl.includes('messages') || 
    lowerUrl.includes('scholarships') ||
    lowerUrl.includes('universities') ||
    lowerUrl.includes('programs')
  );
};

// ─────────────────────────────────────────────
// Axios Instance
// ─────────────────────────────────────────────
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,      // send cookies on every request
  headers: { 'Content-Type': 'application/json' },
});

// REQUEST INTERCEPTOR — attach the correct Bearer token
axiosInstance.interceptors.request.use((config) => {
  const endpoint = config.url || '';
  const tokenType = config._tokenType || (isStudentEndpoint(endpoint) ? 'student' : 'admin');
  const token = getAuthToken(tokenType);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Let FormData set its own Content-Type (boundary required)
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

// RESPONSE INTERCEPTOR — normalize errors + auto-store tokens
axiosInstance.interceptors.response.use(
  (response) => {
    const { config, data } = response;
    // Auto-extract token from auth endpoints
    const tokenValue = data?.token || data?.data?.token;
    const endpoint   = config.url || '';
    if (
      tokenValue &&
      (endpoint.includes('login') ||
        endpoint.includes('register') ||
        endpoint.includes('verify-email'))
    ) {
      const tokenType = config._tokenType || (isStudentEndpoint(endpoint) ? 'student' : 'admin');
      setAuthToken(tokenValue, tokenType);
    }
    return data;        // unwrap the axios envelope — callers get raw data
  },
  (error) => {
    if (!error.response) {
      // Network error (no internet, server down, CORS etc.)
      const networkError = new Error('Network error. Please check your connection.');
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
    }

    const { data, status } = error.response;
    const message =
      data?.error?.message ||
      data?.message ||
      `Request failed: ${status}`;

    const apiError       = new Error(message);
    apiError.status      = status;
    apiError.code        = data?.error?.code || 'UNKNOWN_ERROR';
    apiError.errors      = data?.error?.errors || data?.details;
    apiError.response    = data;
    return Promise.reject(apiError);
  }
);

export default axiosInstance;

// ─────────────────────────────────────────────
// Convenience helpers (used by service files)
// ─────────────────────────────────────────────

/**
 * General-purpose API request — replaces the old `apiRequest` from config.js.
 * Service files pass method/body/headers; Axios interceptors handle auth.
 */
export const apiRequest = (endpoint, options = {}) => {
  const {
    method = 'GET',
    body,
    headers = {},
    tokenType,
    isFormData = false,
  } = options;

  return axiosInstance.request({
    url:             endpoint,
    method,
    data:            body,
    headers,
    _tokenType:      tokenType,
    ...(isFormData && { data: body }),  // body is already FormData
  });
};

/**
 * FormData-specific shortcut — replaces `apiRequestFormData` from config.js.
 */
export const apiRequestFormData = (endpoint, formData, options = {}) =>
  apiRequest(endpoint, { method: 'POST', ...options, body: formData, isFormData: true });

// ─────────────────────────────────────────────
// URL Helpers (unchanged)
// ─────────────────────────────────────────────
export const getServerBaseURL = () => {
  return API_BASE_URL.endsWith('/api')
    ? API_BASE_URL.slice(0, -4)
    : API_BASE_URL.replace(/\/api$/, '');
};

export const getImageURL = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://'))
    return imagePath;
  if (imagePath.startsWith('/uploads'))
    return `${getServerBaseURL()}${imagePath}`;
  return `${getServerBaseURL()}/${imagePath}`;
};
