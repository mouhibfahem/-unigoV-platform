import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081/api',
});

api.updateProfile = (data) => api.put('/users/profile', data);
api.uploadPhoto = (formData) => api.post('/users/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

api.getCurrentUser = () => api.get('/users/me');

// Messaging
api.getConversations = () => api.get('/messages/conversations');
api.getConversationHistory = (userId) => api.get(`/messages/history/${userId}`);
api.sendMessage = (data) => api.post('/messages', data);
api.getContacts = () => api.get('/messages/contacts');

// Agenda / Events
api.getUpcomingEvents = () => api.get('/events/upcoming');
api.createEvent = (data) => api.post('/events', data);

api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default api;
