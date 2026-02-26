export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://nadoumibackend.onrender.com/api";

// Get the base server URL (without /api) for static files
export const getServerBaseURL = () => {
  return API_BASE_URL.endsWith("/api")
    ? API_BASE_URL.slice(0, -4)
    : API_BASE_URL.replace(/\/api$/, "");
};

// Helper to construct image URLs for uploaded files
export const getImageURL = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
    return imagePath;
  if (imagePath.startsWith("/uploads"))
    return `${getServerBaseURL()}${imagePath}`;
  return `${getServerBaseURL()}/${imagePath}`;
};

// Student-owned endpoints that require the student token instead of the admin token
const STUDENT_ENDPOINT_PREFIXES = [
  "/students/me",
  "/students/register",
  "/students/login",
  "/students/verify-email",
  "/students/resend-otp",
  "/students/forgot-password",
  "/students/reset-password",
  "/applications/student/me",
];

const isStudentEndpoint = (endpoint) =>
  STUDENT_ENDPOINT_PREFIXES.some(
    (prefix) => endpoint === prefix || endpoint.startsWith(prefix + "/")
  );

export const getAuthToken = (type = null) => {
  if (type === "student") return localStorage.getItem("studentToken");
  if (type === "admin") return localStorage.getItem("adminToken");
  return (
    localStorage.getItem("adminToken") || localStorage.getItem("studentToken")
  );
};

export const setAuthToken = (token, type = "admin") => {
  if (token) {
    if (type === "student") {
      localStorage.setItem("studentToken", token);
      localStorage.removeItem("adminToken");
    } else {
      localStorage.setItem("adminToken", token);
      localStorage.removeItem("studentToken");
    }
  } else {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("studentToken");
  }
};

export const clearAuthTokens = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("studentToken");
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken(isStudentEndpoint(endpoint) ? "student" : "admin");
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    credentials: 'include', // required for httpOnly cookie-based auth
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    if (import.meta.env.DEV) {
      console.log("API Request:", {
        method: config.method || "GET",
        url,
        endpoint,
      });
    }

    const response = await fetch(url, config);

    let data;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch {
      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }
      data = {};
    }

    if (!response.ok) {
      const errorMessage =
        data.error?.message ||
        data.error ||
        data.message ||
        `Request failed: ${response.status} ${response.statusText}`;
      const error = new Error(errorMessage);
      if (data.error?.errors) error.errors = data.error.errors;
      if (data.error?.code) error.code = data.error.code;
      error.response = data;
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (err) {
    if (err instanceof TypeError && err.message.includes("fetch")) {
      const networkError = new Error(
        "Network error. Please check your connection and ensure the API server is running."
      );
      networkError.originalError = err;
      networkError.isNetworkError = true;
      throw networkError;
    }
    throw err;
  }
};

export const apiRequestFormData = async (endpoint, formData, options = {}) => {
  const token = getAuthToken(isStudentEndpoint(endpoint) ? "student" : "admin");
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    method: options.method || "POST",
    credentials: 'include', // required for httpOnly cookie-based auth
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    body: formData,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    const errorMessage =
      errorData.message ||
      errorData.error?.message ||
      errorData.error ||
      "Request failed";
    const error = new Error(errorMessage);
    error.response = errorData;
    if (errorData.details) error.details = errorData.details;
    throw error;
  }

  return response.json();
};
