import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { password });
      localStorage.setItem('token', res.data.token);
      setUser({ isAdmin: true });
      return true;
    } catch (err) {
      alert('Invalid password');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);