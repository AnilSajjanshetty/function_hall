// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 1. No token or user → redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Admin trying to access user page → go to admin
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    // User trying to access admin page → go to user dashboard
    if (user.role === "user") {
      return <Navigate to="/user" replace />;
    }
    // Any other case → home
    return <Navigate to="/" replace />;     
  }

  // 3. All good → render the page
  return element;
};

export default ProtectedRoute;