import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081/api',
});

api.updateProfile = (data) => api.put('/users/profile', data);
api.uploadPhoto = (formData) => api.post('/users/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

api.getCurrentUser = () => api.get('/users/me');

api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default api;
