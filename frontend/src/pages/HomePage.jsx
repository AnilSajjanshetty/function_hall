// src/pages/HomePage.jsx
import React from "react";
import Hero from "../components/Hero";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function HomePage({ announcements, recentEvents }) {
  const { t } = useTranslation(); // 👈 use i18n hook

  return (
    <>
      <Hero />

      {/* Announcements */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-white flex items-center justify-center">
            <Bell className="w-10 h-10 mr-3 animate-bounce" /> {t("latestAnnouncements")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {announcements?.slice(0, 3).map((ann) => (
              <div
                key={ann.id}
                className="bg-white rounded-xl shadow-2xl p-6 transform hover:scale-105 transition-all"
              >
                <h3 className="text-xl font-bold text-purple-900">{ann.title}</h3>
                <p className="text-gray-700">{ann.message}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/announcements"
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold"
            >
              {t("viewAll")}
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-5xl font-bold text-center mb-4 text-purple-900">
            {t("recentEvents")}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {recentEvents?.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="h-64 bg-gradient-to-br from-purple-400 to-pink-400">
                  <img
                    src={event.images[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold">{event.title}</h3>
                  <p className="text-gray-600">{event.description}</p>
                  <Link
                    to="/gallery"
                    className="mt-4 inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg"
                  >
                    {t("viewGallery")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
