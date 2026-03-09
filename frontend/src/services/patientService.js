import api from './api';

const ENDPOINT = '/patients';

export const patientService = {
    getAll: () => api.get(ENDPOINT),
    getById: (id) => api.get(`${ENDPOINT}/${id}`),
    create: (data) => api.post(ENDPOINT, data),
    update: (id, data) => api.put(`${ENDPOINT}/${id}`, data),
    remove: (id) => api.delete(`${ENDPOINT}/${id}`),
};

export default patientService;
