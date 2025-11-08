import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import GalleryPage from "./pages/GalleryPage";
import ServicesPage from "./pages/ServicesPage";
import BookingPage from "./pages/BookingPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import { useEffect, useState } from "react";
import UserDashboard from "./pages/UserDashboard";
import config from "../config";

// Define allowed roles
const adminRole = config.adminRole
const userRole = config.userRole
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("accessToken")
  );
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  // Listen for changes to login state from other tabs or login/logout
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("accessToken"));
      setRole(localStorage.getItem("role") || "");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <div className="font-sans">
        <Navigation isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} role={role} />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/services" element={<ServicesPage />} />
          {/* <Route path="/booking" element={<BookingPage />} /> */}
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected admin route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                element={<AdminDashboard />}
                allowedRoles={[adminRole]}
              />
            }
          />

          {/* Protected admin route */}
          <Route
            path="/user"
            element={
              <ProtectedRoute
                element={<UserDashboard />}
                allowedRoles={[userRole]}
              />
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
