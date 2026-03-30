/**
 * config.js — Backward-compat shim.
 *
 * All API logic has been migrated to axiosInstance.js (Axios + interceptors).
 * This file re-exports everything so existing service-file imports stay intact.
 */
export {
  API_BASE_URL,
  getServerBaseURL,
  getImageURL,
  getAuthToken,
  setAuthToken,
  clearAuthTokens,
  apiRequest,
  apiRequestFormData,
} from './axiosInstance.js';

// Named default re-export for anything that imports the axios instance directly
export { default as axiosInstance } from './axiosInstance.js';
