import apiClient from './api';

// Auth services
export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// Event services
export const eventService = {
  getAllEvents: async (category = 'all', search = '') => {
    const params = new URLSearchParams();
    if (category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    
    const response = await apiClient.get(`/events?${params.toString()}`);
    return response.data;
  },

  getEventById: async (eventId) => {
    const response = await apiClient.get(`/events/${eventId}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await apiClient.post('/events', eventData);
    return response.data;
  },

  updateEvent: async (eventId, eventData) => {
    const response = await apiClient.put(`/events/${eventId}`, eventData);
    return response.data;
  },

  deleteEvent: async (eventId) => {
    const response = await apiClient.delete(`/events/${eventId}`);
    return response.data;
  },

  registerForEvent: async (eventId) => {
    const response = await apiClient.post(`/events/${eventId}/register`);
    return response.data;
  },

  unregisterFromEvent: async (eventId) => {
    const response = await apiClient.delete(`/events/${eventId}/register`);
    return response.data;
  },

  getUserEvents: async () => {
    const response = await apiClient.get('/events/user/my-events');
    return response.data;
  },
};
