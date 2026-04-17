import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [email, setEmail] = useState(localStorage.getItem('email'));

  const isAuthenticated = !!token;

  const login = async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    const { token: t, email: e } = res.data;
    localStorage.setItem('token', t);
    localStorage.setItem('email', e);
    setToken(t);
    setEmail(e);
    return res.data;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setToken(null);
    setEmail(null);
  };

  const editPassword = async (oldPassword, newPassword) => {
    const res = await api.patch('/auth/edit-password', { oldPassword, newPassword });
    return res.data;
  };

  const deleteAccount = async (password) => {
    const res = await api.delete('/auth/delete-account', { data: { password } });
    logout();
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ token, email, isAuthenticated, login, register, logout, editPassword, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
