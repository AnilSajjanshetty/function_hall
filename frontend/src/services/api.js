// src/services/api.js - API Service Layer
import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH APIs ==========
export const authAPI = {
  login: async (password) => {
    const response = await api.post('/auth/login', { password });
    return response.data;
  },
  
  verify: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  }
};

// ========== BOOKING APIs ==========
export const bookingAPI = {
  getAll: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  
  create: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  
  updateStatus: async (id, status) => {
    const response = await api.put(`/bookings/${id}`, { status });
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  }
};

// ========== EVENT APIs ==========
export const eventAPI = {
  getAll: async () => {
    const response = await api.get('/events');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  
  create: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },
  
  update: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  }
};

// ========== ANNOUNCEMENT APIs ==========
export const announcementAPI = {
  getAll: async () => {
    const response = await api.get('/announcements');
    return response.data;
  },
  
  create: async (announcementData) => {
    const response = await api.post('/announcements', announcementData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  }
};

// ========== MESSAGE APIs ==========
export const messageAPI = {
  getAll: async () => {
    const response = await api.get('/messages');
    return response.data;
  },
  
  markAsRead: async (id) => {
    const response = await api.put(`/messages/${id}/read`);
    return response.data;
  }
};

// ========== CONTACT APIs ==========
export const contactAPI = {
  send: async (contactData) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  }
};

export default api;