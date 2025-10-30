// src/pages/AdminLoginPage.jsx
import { useState } from 'react';
import { authAPI } from '../services/api';

export default function AdminLoginPage({ setCurrentView, setIsAdmin }) {
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { token } = await authAPI.login(password);
      localStorage.setItem('adminToken', token);
      setIsAdmin(true);
      setCurrentView('admin');
    } catch (err) {
      alert('Invalid password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-8 text-purple-900">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 mb-4" />
          <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold">
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">Demo: admin123</p>
      </div>
    </div>
  );
}