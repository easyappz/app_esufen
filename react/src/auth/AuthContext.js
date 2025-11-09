import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { authApi } from '../api/authApi';

const AuthContext = createContext({
  user: null,
  loading: true,
  register: async () => {},
  login: async () => {},
  logout: () => {},
  fetchMe: async () => {},
});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveTokens = (access, refresh) => {
    if (access) {
      localStorage.setItem('accessToken', access);
      localStorage.setItem('token', access); // keep in sync with base axios file
    }
    if (refresh) localStorage.setItem('refreshToken', refresh);
  };

  const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');
  };

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await authApi.me();
      setUser(data);
      return data;
    } catch (e) {
      // silently ignore here, will be handled by pages
      return null;
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const { data } = await authApi.login({ email, password });
    const { access, refresh } = data || {};
    if (!access || !refresh) throw new Error('No tokens');
    saveTokens(access, refresh);
    const me = await fetchMe();
    if (!me) throw new Error('Failed to fetch user');
    setUser(me);
    return me;
  }, [fetchMe]);

  const register = useCallback(async ({ email, first_name, last_name, password }) => {
    await authApi.register({ email, first_name, last_name, password });
    await login({ email, password });
  }, [login]);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const access = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');
    if (!access && !refresh) {
      setLoading(false);
      return;
    }
    (async () => {
      await fetchMe();
      setLoading(false);
    })();
  }, [fetchMe]);

  const value = useMemo(() => ({ user, loading, register, login, logout, fetchMe }), [user, loading, register, login, logout, fetchMe]);

  return (
    <div data-easytag="id1-src/auth/AuthContext.js">
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </div>
  );
};

export const useAuth = () => useContext(AuthContext);
