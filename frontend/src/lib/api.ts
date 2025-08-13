import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';
const TOKEN_KEY = 'notes_jwt';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authApi = {
  register: async (data: { email: string; password: string }) => {
    const response = await api.post('/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    // Use form-encoded data for FastAPI OAuth2PasswordRequestForm
    const params = new URLSearchParams();
    params.append('username', data.email);
    params.append('password', data.password);
    const response = await api.post('/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    if (response.data.access_token) {
      localStorage.setItem(TOKEN_KEY, response.data.access_token);
    }
    return response.data;
  },
  
  me: async () => {
    const response = await api.get('/me');
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Notes API functions
export const notesApi = {
  create: async (data: { title: string; content: string }) => {
    const response = await api.post('/notes', data);
    return response.data;
  },
  
  list: async () => {
    const response = await api.get('/notes');
    return response.data;
  },
  
  update: async (id: string, data: { title: string; content: string }) => {
    const response = await api.put(`/notes/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  }
};

// Utility functions
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const isAuthenticated = () => !!getToken();