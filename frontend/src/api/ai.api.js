import api from './axios';

export const classifyBug = (bug) => api.post('/ai/classify', bug);
export const findSimilarBugs = (bug) => api.post('/ai/similar', bug);
export const suggestAssignee = (bugId, category) => api.post('/ai/suggest-assignee', { bugId, category });
