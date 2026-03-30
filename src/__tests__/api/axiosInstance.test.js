import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Unit tests for token management utilities in axiosInstance.js.
 * The Axios interceptors are tested indirectly via the service files.
 * Keep tests pure: no network calls, no mocked Axios responses here.
 */

// A clean test environment for localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Now import the functions under test
import {
  getAuthToken,
  setAuthToken,
  clearAuthTokens,
} from '../../api/axiosInstance.js';

beforeEach(() => {
  localStorage.clear();
});

describe('getAuthToken', () => {
  it('returns null when no token exists', () => {
    expect(getAuthToken()).toBeNull();
  });

  it('returns admin token when type is "admin"', () => {
    localStorage.setItem('adminToken', 'admin-jwt-123');
    expect(getAuthToken('admin')).toBe('admin-jwt-123');
  });

  it('returns student token when type is "student"', () => {
    localStorage.setItem('studentToken', 'student-jwt-456');
    expect(getAuthToken('student')).toBe('student-jwt-456');
  });

  it('prefers admin token when no type is specified', () => {
    localStorage.setItem('adminToken', 'admin-jwt-123');
    localStorage.setItem('studentToken', 'student-jwt-456');
    expect(getAuthToken()).toBe('admin-jwt-123');
  });
});

describe('setAuthToken', () => {
  it('sets the admin token and clears the student token', () => {
    localStorage.setItem('studentToken', 'old-student');
    setAuthToken('admin-jwt-new', 'admin');
    expect(localStorage.getItem('adminToken')).toBe('admin-jwt-new');
    expect(localStorage.getItem('studentToken')).toBeNull();
  });

  it('sets the student token and clears the admin token', () => {
    localStorage.setItem('adminToken', 'old-admin');
    setAuthToken('student-jwt-new', 'student');
    expect(localStorage.getItem('studentToken')).toBe('student-jwt-new');
    expect(localStorage.getItem('adminToken')).toBeNull();
  });

  it('clears both tokens when called with null', () => {
    localStorage.setItem('adminToken', 'admin-jwt');
    localStorage.setItem('studentToken', 'student-jwt');
    setAuthToken(null);
    expect(localStorage.getItem('adminToken')).toBeNull();
    expect(localStorage.getItem('studentToken')).toBeNull();
  });
});

describe('clearAuthTokens', () => {
  it('removes both admin and student tokens', () => {
    localStorage.setItem('adminToken', 'a');
    localStorage.setItem('studentToken', 'b');
    clearAuthTokens();
    expect(localStorage.getItem('adminToken')).toBeNull();
    expect(localStorage.getItem('studentToken')).toBeNull();
  });
});
