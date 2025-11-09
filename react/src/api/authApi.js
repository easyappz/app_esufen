import instance from './interceptors';

export const authApi = {
  register: (data) => instance.post('/auth/register', data),
  login: (data) => instance.post('/auth/login', data),
  refresh: (refresh) => instance.post('/auth/refresh', { refresh }),
  me: () => instance.get('/auth/me'),
  updateMe: (data) => instance.put('/auth/me', data),
};
