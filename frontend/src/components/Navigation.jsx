import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Navigation({ isLoggedIn, setIsLoggedIn, role }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  console.log("role in nav:", role);
  // track scroll for background
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Check login status whenever route changes
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/");
  };

  const navItems = [
    {
      path: isLoggedIn ? `/${role}` : "/",
      label: t("home"),
    },
    { path: "/events", label: t("events") },
    { path: "/gallery", label: t("gallery") },
    { path: "/services", label: t("services") },
    { path: "/announcements", label: t("announcement") },
    // { path: "/booking", label: t("bookNow") },
    { path: "/contact", label: t("contact") },
    ...(isLoggedIn ? [{ path: `/${role}`, label: t("dashboard") }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50
          ? "bg-purple-900/95 backdrop-blur-lg shadow-lg"
          : "bg-purple-900/95 backdrop-blur-lg shadow-lg"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-pink-400" />
          <span className="text-2xl font-bold text-white">
            {t("heroTitle")}
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-white hover:text-pink-300 transition ${
                isActive(item.path) ? "font-bold" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>{t("logout")}</span>
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-pink-300 text-sm"
              >
                {t("login")}
              </Link>
              <Link
                to="/register"
                className="text-white hover:text-pink-300 text-sm"
              >
                {t("register")}
              </Link>
            </>
          )}
          <LanguageSwitcher />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden text-white"
        >
          {showMobileMenu ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-purple-900/95 backdrop-blur-lg">
          <div className="flex flex-col space-y-4 px-4 py-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setShowMobileMenu(false)}
                className="text-white text-left"
              >
                {item.label}
              </Link>
            ))}

            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
                className="flex items-center gap-2  bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>{t("logout")}</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="text-white text-left text-sm"
                >
                  {t("login")}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setShowMobileMenu(false)}
                  className="text-white text-left text-sm"
                >
                  {t("register")}
                </Link>
              </>
            )}
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </nav>
  );
}
