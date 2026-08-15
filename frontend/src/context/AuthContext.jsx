import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  updateProfile as apiUpdateProfile
} from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Restore Session from Token on Page Refresh (Requirement 22 & 48)
  useEffect(() => {
    const initAuthSession = async () => {
      const token = localStorage.getItem('csc_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getCurrentUser();
        if (res && res.success && res.data) {
          setUser(res.data);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('csc_token');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        localStorage.removeItem('csc_token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuthSession();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await loginUser(credentials);
      if (res && res.success && res.data) {
        const { accessToken, user: userData } = res.data;
        if (accessToken) {
          localStorage.setItem('csc_token', accessToken);
        }
        setUser(userData);
        setIsAuthenticated(true);
        return res.data;
      } else {
        throw new Error(res.message || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await registerUser(userData);
      if (res && res.success && res.data) {
        const { accessToken, user: registeredUser } = res.data;
        if (accessToken) {
          localStorage.setItem('csc_token', accessToken);
          setUser(registeredUser);
          setIsAuthenticated(true);
        }
        return res;
      } else {
        throw new Error(res.message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('csc_token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await getCurrentUser();
      if (res && res.success && res.data) {
        setUser(res.data);
        setIsAuthenticated(true);
        return res.data;
      }
    } catch (err) {
      logout();
    }
    return null;
  };

  const updateUserProfile = async (data) => {
    const res = await apiUpdateProfile(data);
    if (res && res.success && res.data) {
      setUser(prev => ({ ...prev, ...res.data }));
      return res.data;
    }
    throw new Error(res.message || 'Failed to update profile.');
  };

  const isAdmin = Boolean(user && user.role === 'admin');

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    refreshUser,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;
