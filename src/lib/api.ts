/// <reference types="vite/client" />

export const API_BASE = import.meta.env.DEV 
  ? '' // In development/preview, we must proxy through server.ts to avoid CORS errors from the real backend.
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');

/**
 * A wrapper around fetch that automatically adds the Authorization header
 * if a token is present in localStorage.
 */
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'API request failed';
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch (e) {
      // Ignore JSON parse error if response is not JSON
    }
    throw new Error(errorMsg);
  }

  return response.json();
};
