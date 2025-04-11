// src/services/authService.js
import api from './api';

const authService = {
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            throw error;
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }
            return response.data;
        } catch (error) {
            console.error('Ошибка при входе:', error);
            throw error;
        }
    },

    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
    },

    setupAuth: () => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return true;
        }
        return false;
    }
};

export default authService;