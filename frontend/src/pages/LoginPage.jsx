import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosInstance from "../utils/axiosInstance";
import config from "../../config";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const admin = config.adminRole;
  const userRole = config.userRole;

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ prevent form reload
    setLoading(true);

    try {
      const response = await axiosInstance.post(`/auth/login`, form); // ✅ send form state as payload

      const { accessToken, user, refreshToken } = response.data;

      // ✅ Store in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user?.role);

      Swal.fire({
        title: "Login Successful!",
        text: "You have logged in successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        if (user.role === admin) {
          navigate("/admin");
        }
        else if (user.role === userRole) {
          navigate("/user");
        }
        else {
          navigate("/");
        }
      }, 2000);
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      Swal.fire({
        title: "Login Failed",
        text:
          error.response?.data?.message ||
          "Invalid credentials, please try again.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-8 text-purple-900">
          Admin Login
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 mb-4"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 mb-4"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
            {/* 🔹 Register link */}
        <p className="text-center text-gray-600 mt-6">
          Don’t have an account?
          <Link
            to="/register"
            className="text-purple-600 font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
        </form>
      </div>
    </div>
  );
}
