import api from './axios';

export const getDashboardStats = (projectId) => api.get('/analytics/dashboard', { params: { projectId } });
