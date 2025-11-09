/* Configure additional interceptors without editing axios.js */
import instance from './axios';

// Ensure base URL points to API
instance.defaults.baseURL = '/api';

// Helper to get tokens
const getTokens = () => ({
  access: localStorage.getItem('accessToken'),
  refresh: localStorage.getItem('refreshToken'),
});

// Ensure Authorization header uses accessToken and keep legacy 'token' in sync
instance.interceptors.request.use((config) => {
  const { access } = getTokens();
  if (access) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${access}`;
    try {
      localStorage.setItem('token', access);
    } catch {}
  }
  return config;
});

let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  pendingQueue = [];
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      const { refresh } = getTokens();
      if (!refresh) {
        try {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('token');
        } catch {}
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue requests while refreshing
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            originalRequest._retry = true;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await instance.post('/auth/refresh', { refresh });
        const newAccess = res.data?.access;
        if (newAccess) {
          localStorage.setItem('accessToken', newAccess);
          localStorage.setItem('token', newAccess);
        }
        isRefreshing = false;
        processQueue(null, newAccess);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
        return instance(originalRequest);
      } catch (refreshErr) {
        isRefreshing = false;
        processQueue(refreshErr, null);
        try {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('token');
        } catch {}
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
