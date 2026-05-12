import api from './axios';

export const getProjects = () => api.get('/projects');
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (project) => api.post('/projects', project);
export const addProjectMember = (projectId, userId) => api.post(`/projects/${projectId}/members`, { userId });
export const getProjectMembers = (projectId) => api.get(`/projects/${projectId}/members`);
