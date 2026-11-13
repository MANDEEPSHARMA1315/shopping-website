import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('fashion_user');
    const storedToken = localStorage.getItem('fashion_token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
      }
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        localStorage.setItem('fashion_user', JSON.stringify(userData));
        localStorage.setItem('fashion_token', userData.token);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      return { success: false, message: msg };
    }
  };

  // Register handler
  const register = async (formData) => {
    try {
      const response = await API.post('/auth/register', formData);
      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        localStorage.setItem('fashion_user', JSON.stringify(userData));
        localStorage.setItem('fashion_token', userData.token);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      return { success: false, message: msg };
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const response = await API.put('/auth/profile', profileData);
      if (response.data.success) {
        const updated = response.data.data;
        setUser(updated);
        localStorage.setItem('fashion_user', JSON.stringify(updated));
        if (updated.token) {
          localStorage.setItem('fashion_token', updated.token);
        }
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile';
      return { success: false, message: msg };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('fashion_user');
    localStorage.removeItem('fashion_token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
