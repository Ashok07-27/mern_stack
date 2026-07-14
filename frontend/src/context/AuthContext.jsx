import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (emailOrUsername, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  };

  // Helper function for authenticated API requests
  const authFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (userInfo && userInfo.token) {
      headers['Authorization'] = `Bearer ${userInfo.token}`;
    }

    const res = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      // Auto-logout if token expired
      logout();
      throw new Error('Session expired. Please log in again.');
    }

    return res;
  };

  return (
    <AuthContext.Provider value={{ userInfo, loading, login, register, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
