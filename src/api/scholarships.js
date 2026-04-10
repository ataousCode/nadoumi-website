import { apiRequest } from './axiosInstance.js';

const API_BASE = "scholarships";

export async function getScholarships(filters = {}) {
  const params = new URLSearchParams();

  if (filters.category) params.append("category", filters.category);
  if (filters.country) params.append("country", filters.country);
  if (filters.search) params.append("search", filters.search);
  if (filters.page) params.append("page", filters.page);
  if (filters.limit) params.append("limit", filters.limit);
  if (filters.status) params.append("status", filters.status);
  if (filters.programCategory) params.append("programCategory", filters.programCategory);
  if (filters.programCategories) {
    if (Array.isArray(filters.programCategories)) {
      filters.programCategories.forEach(cat => params.append("programCategories", cat));
    } else {
      params.append("programCategories", filters.programCategories);
    }
  }
  if (filters.scholarshipCategory) params.append("scholarshipCategory", filters.scholarshipCategory);
  if (filters.isHot !== undefined) params.append("isHot", filters.isHot);
  if (filters.isRecommended !== undefined) params.append("isRecommended", filters.isRecommended);
  if (filters.isTop !== undefined) params.append("isTop", filters.isTop);
  if (filters.sort) params.append("sort", filters.sort);
  
  // Sidebar filters
  if (filters.location && filters.location !== 'All Locations') params.append("city", filters.location);
  if (filters.subject && filters.subject !== 'All Categories') params.append("field", filters.subject);
  if (filters.rankMin) params.append("rankMin", filters.rankMin);
  if (filters.rankMax) params.append("rankMax", filters.rankMax);
  if (filters.language) params.append("teachingLanguage", filters.language);
  if (filters.tuitionRange !== undefined) params.append("maxTuition", filters.tuitionRange * 1000); // 100k+ slider

  const query = params.toString();
  return apiRequest(`${API_BASE}${query ? `?${query}` : ""}`);
}

export async function getFeaturedScholarships() {
  return apiRequest(`${API_BASE}/featured`);
}

export async function getScholarship(id) {
  return apiRequest(`${API_BASE}/${id}`);
}

export async function createScholarship(data) {
  return apiRequest(API_BASE, {
    method: "POST",
    body: data,
  });
}

export async function updateScholarship(id, data) {
  return apiRequest(`${API_BASE}/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteScholarship(id) {
  await apiRequest(`${API_BASE}/${id}`, { method: "DELETE" });
  return id;
}

export async function updateScholarshipStatus(id, status) {
  return apiRequest(`${API_BASE}/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}
