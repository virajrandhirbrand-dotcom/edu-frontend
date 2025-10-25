import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://edu-backend-qss8.vercel.app',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        console.log('API Request:', config.method.toUpperCase(), config.url);
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    response => {
        console.log('API Response:', response.status, response.config.url);
        return response;
    },
    error => {
        if (error.response) {
            // Server responded with error
            console.error('API Error Response:', {
                status: error.response.status,
                data: error.response.data,
                url: error.config.url
            });
        } else if (error.request) {
            // Request made but no response
            console.error('API No Response:', error.request);
        } else {
            // Error in request setup
            console.error('API Request Setup Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;

