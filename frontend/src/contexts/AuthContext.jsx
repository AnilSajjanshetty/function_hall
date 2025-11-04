// ============================================
// src/context/AuthContext.jsx - Auth Context Provider
// ============================================
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, tokenManager } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const verifyAuth = () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');
      const role = localStorage.getItem('role');

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAdmin(role === 'user');
      } else {
        console.log('Not authenticated');
        tokenManager.clearTokens(); // optional if you want to reset
      }
    } catch (error) {
      console.error('Error loading user from localStorage', error);
      tokenManager.clearTokens();
    } finally {
      setLoading(false);
    }
  };

  verifyAuth();
}, []);


 

  const value = {
    user,
    isAdmin,
    loading,

  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};