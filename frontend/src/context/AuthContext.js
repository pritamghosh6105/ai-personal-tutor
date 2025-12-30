import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token);
        try {
          const { data } = await api.get('/api/auth/me');
          setUser(data);
        } catch (error) {
          console.error('Failed to load user:', error);
          setAuthToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Signup
  const signup = async (name, email, password) => {
    const { data } = await api.post('/api/auth/signup', {
      name,
      email,
      password
    });
    setUser(data);
    setAuthToken(data.token);
    return data;
  };

  // Login
  const login = async (email, password) => {
    console.log('🔐 Attempting login with:', email);
    try {
      const { data } = await api.post('/api/auth/login', {
        email,
        password
      });
      console.log('✅ Login successful:', data.name);
      setUser(data);
      setAuthToken(data.token);
      return data;
    } catch (error) {
      console.error('❌ Login failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setAuthToken(null);
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
