import axios from 'axios';

const normalizeApiBaseUrl = (rawUrl) => {
    if (!rawUrl) return 'http://localhost:5000/api';

    const trimmed = rawUrl.trim().replace(/\/+$/, '');
    if (/\/api$/i.test(trimmed)) return trimmed;
    return `${trimmed}/api`;
};

const api = axios.create({
    baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
