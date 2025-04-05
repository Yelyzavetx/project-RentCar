import api from './api';

const catalogService = {
    getCars: async (params = {}) => {
        try {
            console.log('Fetching cars with params:', params);
            const response = await api.get('/catalog', { params });
            console.log('API response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching cars:', error.response || error);
            throw error;
        }
    },

    getCarById: async (id) => {
        try {
            console.log(`Fetching car with id: ${id}`);
            const response = await api.get(`/catalog/${id}`);
            console.log('API response:', response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching car ${id}:`, error.response || error);
            throw error;
        }
    },

    createCar: async (carData) => {
        try {
            console.log('Creating car with data:', carData);
            const response = await api.post('/catalog', carData);
            console.log('API response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating car:', error.response || error);
            throw error;
        }
    },

    updateCar: async (id, carData) => {
        try {
            console.log(`Updating car ${id} with data:`, carData);
            const response = await api.put(`/catalog/${id}`, carData);
            console.log('API response:', response.data);
            return response.data;
        } catch (error) {
            console.error(`Error updating car ${id}:`, error.response || error);
            throw error;
        }
    },

    deleteCar: async (id) => {
        try {
            console.log(`Deleting car with id: ${id}`);
            const response = await api.delete(`/catalog/${id}`);
            console.log('API response:', response.data);
            return response.data;
        } catch (error) {
            console.error(`Error deleting car ${id}:`, error.response || error);
            throw error;
        }
    }
};

export default catalogService;