import { Link, useLocation } from "react-router-dom";
import { Sparkles, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Navigation({ isAdmin }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: t("home") },
    { path: "/events", label: t("events") },
    { path: "/gallery", label: t("gallery") },
    { path: "/services", label: t("services") },
    { path: "/announcements", label: t("announcement") },
    { path: "/booking", label: t("bookNow") },
    { path: "/contact", label: t("contact") },
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
          <span className="text-2xl font-bold text-white">{t("heroTitle")}</span>
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

          {isAdmin ? (
            <Link
              to="/admin"
              className="bg-pink-600 text-white px-4 py-2 rounded-full text-sm"
            >
              {t("admin")}
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className="text-white hover:text-pink-300 text-sm"
            >
              {t("admin")}
            </Link>
          )}

          {/* Language Switcher */}
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
            <LanguageSwitcher />
            <Link
              to="/admin/login"
              onClick={() => setShowMobileMenu(false)}
              className="text-white text-left text-sm"
            >
              {t("Admin")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
