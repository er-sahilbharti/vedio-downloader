import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const sessionId = localStorage.getItem('video-downloader-session') || 'anonymous';
  config.headers['x-anonymous-session'] = sessionId;
  return config;
});

export const getVideoInfo = (url) => api.post('/video/info', { url });
export const startDownload = (data) => api.post('/download', data);
export const getDownloadStatus = (id) => api.get(`/download/status/${id}`);
export const getDownloadFile = (id) => api.get(`/download/file/${id}`, { responseType: 'blob' });
export const getHistory = () => api.get('/history');
export const deleteHistory = (id) => api.delete(`/history/${id}`);

export default api;
