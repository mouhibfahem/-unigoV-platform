import axios from 'axios';

const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    if (import.meta.env.MODE === 'production') {
        return 'https://unigov-platform-production.up.railway.app/api';
    }
    return 'http://localhost:8081/api';
};

const api = axios.create({
    baseURL: getBaseUrl(),
});

console.log('API Base URL:', api.defaults.baseURL);

// Auth & User
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

// Decisions
api.getAllDecisions = () => api.get('/decisions');
api.createDecision = (data) => api.post('/decisions', data);
api.deleteDecision = (id) => api.delete(`/decisions/${id}`);

// Announcements
api.getAnnouncements = () => api.get('/announcements');
api.createAnnouncement = (formData) => api.post('/announcements', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// Complaints
api.getComplaints = () => api.get('/complaints');
api.getMyComplaints = () => api.get('/complaints/my');
api.getComplaintById = (id) => api.get(`/complaints/${id}`);
api.updateComplaint = (id, data) => api.put(`/complaints/${id}`, data);
api.deleteComplaint = (id) => api.delete(`/complaints/${id}`);

// Polls
api.getPolls = () => api.get('/polls');
api.createPoll = (data) => api.post('/polls', data);
api.vote = (optionId) => api.post(`/polls/${optionId}/vote`);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error Details:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default api;
