import axios from 'axios';

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
    // Fix common deployment issue where users only provide the domain
    if (!url.endsWith('/api/v1')) {
        // If it ends with slash, remove it first
        if (url.endsWith('/')) url = url.slice(0, -1);
        // Append correct suffix
        url += '/api/v1';
    }
    return url;
};

const api = axios.create({
    baseURL: getBaseUrl(),
});

// Since auth is bypassed on backend, we can remove interceptors or keep them minimal
api.interceptors.request.use((config) => {
    // Inject a dummy token to satisfy any legacy frontend checks
    config.headers.Authorization = `Bearer dummy-bypassed-token`;
    return config;
});

export const candidateService = {
    upload: (formData) => api.post('/candidates/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    bulk: (formData) => api.post('/candidates/bulk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getAll: () => api.get('/candidates'),
    getById: (id) => api.get(`/candidates/${id}`),
    update: (id, data) => api.put(`/candidates/${id}`, data),
    delete: (id) => api.delete(`/candidates/${id}`),
};

export const jobService = {
    getSuggested: (district) => api.get(`/jobs/suggested?district=${district || ''}`),
    getById: (id) => api.get(`/jobs/${id}`),
    create: (data) => api.post('/jobs', data),
};

export const applicationService = {
    apply: (data) => api.post('/applications/apply', data),
    getAll: () => api.get('/applications'),
    getByJob: (jobId) => api.get(`/applications/job/${jobId}`),
};

export const aiService = {
    chat: (query, history) => api.post('/ai/chat', { query, history }),
    generateJD: (data) => api.post('/ai/generate-jd', data),
};

export default api;
