import api from './api';

const ENDPOINT = '/appointments';

export const appointmentService = {
    getAll: () => api.get(ENDPOINT),
    getById: (id) => api.get(`${ENDPOINT}/${id}`),
    create: (data) => api.post(ENDPOINT, data),
    update: (id, data) => api.put(`${ENDPOINT}/${id}`, data),
    remove: (id) => api.delete(`${ENDPOINT}/${id}`),
};

export default appointmentService;
