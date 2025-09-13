import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../config/axios';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [decodedToken, setDecodedToken] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    setToken(null);
    setDecodedToken(null);
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!token || !decodedToken?.id) return;

    try {
      const response = await api.get(`/users/${decodedToken.id}`);
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error fetching user data:', err);
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [token, decodedToken, logout]);

  // Handle token changes
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          logout();
        } else {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setDecodedToken(decoded);
        }
      } catch (err) {
        console.error('Invalid token', err);
        logout();
      }
    } else {
      setLoading(false);
    }
  }, [token, logout]);

  // Fetch user data when decoded token changes
  useEffect(() => {
    if (decodedToken?.id) {
      fetchUserData();
    }
  }, [decodedToken, fetchUserData]);

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  };

  const login = async (formData) => {
    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      
      // Wait for user data to be loaded
      await new Promise((resolve) => {
        const checkUserData = () => {
          if (user && user.role) {
            resolve();
          } else {
            setTimeout(checkUserData, 100);
          }
        };
        checkUserData();
      });
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        token,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};