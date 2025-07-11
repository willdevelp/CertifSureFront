// src/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://cerisuckback.onrender.com/api', // Votre URL backend
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;