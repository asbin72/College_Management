/// <reference types="vite/client" />
import axios from 'axios';

export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('kalpanaaa_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle unauthorized responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('kalpanaaa_auth_token');
        localStorage.removeItem('kalpanaaa_user');
      }
    }
    return Promise.reject(error);
  }
);
