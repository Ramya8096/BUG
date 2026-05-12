import api from './axios';

export const getBugs = (projectId, params) => api.get('/bugs', { params: { projectId, ...params } });
export const getBug = (id) => api.get(`/bugs/${id}`);
export const createBug = (bug, projectKey) => api.post(`/bugs?projectKey=${projectKey}`, bug);
export const updateBugStatus = (id, status) => api.patch(`/bugs/${id}/status`, { status });
export const assignBug = (id, assigneeId) => api.patch(`/bugs/${id}/assign`, { assigneeId });
export const deleteBug = (id) => api.delete(`/bugs/${id}`);
