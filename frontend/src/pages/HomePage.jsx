import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import { Bell, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";
import videos from "../assets/videos";
import images from "../assets/images";

export default function HomePage() {
  const { t } = useTranslation();
  const [announcements, setAnnouncements] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🎞️ Realistic Wedding / Function Videos (Pexels)
  const weddingVideos = [
    videos.video1,
    videos.video2,
    videos.video3,
    videos.video4,
    videos.video5,
  ];
  const weddingImages = [
    images.wedding1,
    images.wedding2,
    images.wedding3,
    images.wedding4,
  ];

  // 🔄 Fetch latest 5 each
  const loadHomeData = async () => {
    setLoading(true);
    try {
      const [annRes, eventRes] = await Promise.all([
        axiosInstance.get("/announcements/latest"),
        axiosInstance.get("/events/latest"),
      ]);
      setAnnouncements(annRes.data || []);
      setRecentEvents(eventRes.data.events || []);
    } catch (error) {
      console.error("Error fetching latest data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  return (
    <>
      <Hero />

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="flex flex-col items-center text-purple-700">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mb-3"
            />
            <p className="text-lg font-semibold animate-pulse">
              Loading latest updates...
            </p>
          </div>
        </div>
      )}

      {/* Announcements Section */}
      {!loading && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-16 px-6">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-white flex items-center justify-center gap-3">
              <Bell className="w-10 h-10 animate-bounce" />
              {t("Latest Announcements")}
            </h2>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-10">
              {announcements.length > 0 ? (
                announcements.slice(0, 5).map((ann, index) => (
                  <motion.div
                    key={ann._id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white rounded-2xl shadow-2xl p-8 border-l-8 border-purple-600 hover:shadow-purple-300 transition-all"
                  >
                    <h3 className="text-2xl font-bold text-purple-900 mb-3">
                      {ann.title}
                    </h3>
                    <p className="text-gray-700 line-clamp-3 text-lg leading-relaxed">
                      {ann.message}
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                      📅 {new Date(ann.date).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-white col-span-2">
                  No recent announcements
                </p>
              )}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/announcements"
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-transform"
              >
                {t("View All")}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Events Section */}
      {!loading && (
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 py-20 px-6">
          <div className="container mx-auto">
            <h2 className="text-5xl font-bold text-center mb-10 text-purple-900 flex justify-center items-center gap-3">
              <Calendar className="w-10 h-10 text-purple-700 animate-pulse" />
              {t("Recent Events")}
            </h2>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-12">
              {recentEvents.length > 0 ? (
                recentEvents.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden border hover:shadow-purple-300 transition-all"
                  >
                    {/* <div className="relative h-72 overflow-hidden">
                      {event.videos?.length > 0 ? (
                        <video
                          src={event.videos[0]}
                          autoPlay
                          muted
                          loop
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={weddingVideos[index]}
                          autoPlay
                          muted
                          loop
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div> */}
                    <div className="relative h-72 overflow-hidden">
                      {event.videos?.length > 0 ? (
                        <video
                          src={weddingVideos[index]}
                          autoPlay
                          muted
                          loop
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          key={`${event._id}-${index}`}
                          src={weddingImages[index]}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-purple-800 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-lg line-clamp-3">
                        {event.description}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        📅 {new Date(event.date).toLocaleDateString()}
                      </p>
                      <Link
                        to="/gallery"
                        className="mt-4 inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform"
                      >
                        {t("View Gallery")}
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-purple-700 col-span-2">
                  No recent events found
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
