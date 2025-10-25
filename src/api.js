import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://edu-backend-qss8.vercel.app';

console.log('🔧 API Configuration:', {
    baseURL,
    environment: import.meta.env.MODE,
    hasEnvVar: !!import.meta.env.VITE_API_URL
});

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
});

// Request interceptor
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        console.log('📤 API Request:', {
            method: config.method.toUpperCase(),
            url: config.url,
            fullURL: `${config.baseURL}${config.url}`,
            data: config.data
        });
        return config;
    },
    error => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    response => {
        console.log('✅ API Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data
        });
        return response;
    },
    error => {
        if (error.response) {
            // Server responded with error
            console.error('❌ API Error Response:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                url: error.config?.url,
                fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown'
            });
        } else if (error.request) {
            // Request made but no response
            console.error('❌ API No Response:', {
                message: 'Request was made but no response received',
                url: error.config?.url,
                error: error.message
            });
        } else {
            // Error in request setup
            console.error('❌ API Request Setup Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;

