import api from './api';

const catalogService = {
    getCars: async (params = {}) => {
        try {
            const response = await api.get('/catalog', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching cars:', error);
            throw error;
        }
    }
};

export default catalogService;