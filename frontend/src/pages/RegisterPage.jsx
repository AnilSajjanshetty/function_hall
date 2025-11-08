
// ============================================
// src/pages/RegisterPage.jsx - Updated Register Page
// ============================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    mobileNo: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    // Validate password length
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      // Don't send confirmPassword to backend
      const { confirmPassword, ...registerData } = form;
      const response = await axiosInstance.post(`/auth/register`, registerData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center px-4 pt-20">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">Register</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full mb-3 border px-4 py-2 rounded"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-3 border px-4 py-2 rounded"
            required
          />
          <input
            name="mobileNo"
            placeholder="Mobile No"
            value={form.mobileNo}
            onChange={handleChange}
            className="w-full mb-3 border px-4 py-2 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={handleChange}
            className="w-full mb-3 border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={6}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full mb-4 border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={6}
          />

          {/* Password match indicator */}
          {form.password && form.confirmPassword && (
            <div className={`mb-4 text-sm ${form.password === form.confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
              {form.password === form.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* 🔹 Login link */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?
          <Link
            to="/login"
            className="text-purple-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}