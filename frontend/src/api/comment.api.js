import api from './axios';

export const getComments = (bugId) => api.get(`/comments/bug/${bugId}`);
export const addComment = (comment) => api.post('/comments', comment);
