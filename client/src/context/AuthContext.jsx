import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('fittrack_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user profile on startup if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('fittrack_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    if (res.success && res.token) {
      localStorage.setItem('fittrack_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.success && res.token) {
      localStorage.setItem('fittrack_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const demoLogin = async () => {
    const res = await authApi.demoLogin();
    if (res.success && res.token) {
      localStorage.setItem('fittrack_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const updateProfile = async (profileData) => {
    const res = await authApi.updateProfile(profileData);
    if (res.success && res.user) {
      setUser((prev) => ({ ...prev, ...res.user }));
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('fittrack_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        demoLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
