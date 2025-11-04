// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  const links = [
    { to: "/", label: t("home") },
    { to: "/events", label: t("events") },
    { to: "/gallery", label: t("gallery") },
    { to: "/services", label: t("services") },
    { to: "/announcements", label: t("latestAnnouncements") },
    // { to: "/booking", label: t("bookNow") },
  ];

  return (
    <footer className="bg-gradient-to-r from-purple-900 to-pink-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-8 mb-6 flex-wrap">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="hover:text-pink-300 transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p className="text-pink-200">{t("copyright")}</p>
        <p className="text-pink-300 text-sm mt-2">{t("tagline")}</p>
      </div>
    </footer>
  );
}
