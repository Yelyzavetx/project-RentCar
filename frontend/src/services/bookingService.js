// src/services/bookingService.js
import api from './api';

const bookingService = {
    getBookings: async () => {
        try {
            const response = await api.get('/bookings');
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении бронирований:', error);
            throw error;
        }
    },

    getBookingById: async (id) => {
        try {
            const response = await api.get(`/bookings/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Ошибка при получении бронирования с ID ${id}:`, error);
            throw error;
        }
    },

    createBooking: async (bookingData) => {
        try {
            const response = await api.post('/bookings', bookingData);
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании бронирования:', error);
            throw error;
        }
    },

    updateBookingStatus: async (id, status) => {
        try {
            const response = await api.patch(`/bookings/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error(`Ошибка при обновлении статуса бронирования с ID ${id}:`, error);
            throw error;
        }
    },

    deleteBooking: async (id) => {
        try {
            const response = await api.delete(`/bookings/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Ошибка при удалении бронирования с ID ${id}:`, error);
            throw error;
        }
    }
};

export default bookingService;