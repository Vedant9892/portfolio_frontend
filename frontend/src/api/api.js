import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const projectsApi = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  getBySlug: (slug) => api.get(`/projects/slug/${slug}`),
};

export const personalInfoApi = {
  get: () => api.get('/personal-info'),
};

export const experienceApi = {
  getAll: () => api.get('/experience'),
};

export const educationApi = {
  getAll: () => api.get('/education'),
};

export const achievementsApi = {
  getAll: () => api.get('/achievements'),
};

export const mylifeApi = {
  get: () => api.get('/mylife'),
};

export const webprofileApi = {
  get: () => api.get('/webprofile'),
};

export const travelApi = {
  getAll: () => api.get('/travel'),
  getBySlug: (slug) => api.get(`/travel/slug/${slug}`),
};

export default api;
