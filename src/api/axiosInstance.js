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
  
  // If no type is specified, we check if we are on a student route or admin route
  const isStudentRoute = window.location.pathname.startsWith('/profile') || 
                        window.location.pathname.startsWith('/applications') ||
                        window.location.pathname.startsWith('/messages');

  if (isStudentRoute) return studentToken;
  return adminToken || studentToken;
};

export const isAuthenticated = (type = 'student') => {
  return !!getAuthToken(type);
};

export const setAuthToken = (token, type = 'admin') => {
  if (token) {
    if (type === 'student') {
      localStorage.setItem('studentToken', token);
      localStorage.removeItem('adminToken');
    } else {
      localStorage.setItem('adminToken', token);
      localStorage.removeItem('studentToken');
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
const STUDENT_ENDPOINT_PREFIXES = [
  '/students/me',
  '/students/register',
  '/students/login',
  '/students/verify-email',
  '/students/resend-otp',
  '/students/forgot-password',
  '/students/reset-password',
  '/applications/student/me',
  '/messages',
  '/scholarships',
  '/universities',
  '/programs',
];

const isStudentEndpoint = (url) =>
  STUDENT_ENDPOINT_PREFIXES.some(
    (prefix) => url === prefix || url.startsWith(prefix + '/')
  );

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
