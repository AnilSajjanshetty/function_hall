import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";

const AnnouncementsPage = () => {
  const { t } = useTranslation();

  const DEFAULT_ANNOUNCEMENTS = [
    {
      id: 1,
      title: t("diwaliOfferTitle"),
      message: t("diwaliOfferMsg"),
      date: "2025-10-28",
    },
    {
      id: 2,
      title: t("newYearTitle"),
      message: t("newYearMsg"),
      date: "2025-10-25",
    },
    {
      id: 3,
      title: t("weddingSeasonTitle"),
      message: t("weddingSeasonMsg"),
      date: "2025-10-20",
    },
    {
      id: 4,
      title: t("corporateEventTitle"),
      message: t("corporateEventMsg"),
      date: "2025-10-15",
    },
    {
      id: 5,
      title: t("kidsBirthdayTitle"),
      message: t("kidsBirthdayMsg"),
      date: "2025-10-10",
    },
  ];

  const [announcements, setAnnouncements] = useState(DEFAULT_ANNOUNCEMENTS);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/announcements");
      if (res.data && Array.isArray(res.data)) {
        setAnnouncements(res.data);
      }
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-20 px-4 pt-24">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-5xl font-bold text-center mb-4 text-purple-900 flex items-center justify-center">
          <Bell className="w-12 h-12 mr-4 text-pink-600" />
          {t("allAnnouncements")}
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">{t("stayUpdated")}</p>

        <div className="space-y-6">
          {announcements.map((ann) => (
            <div
              key={ann.id || ann._id}
              className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-2xl font-bold text-purple-900">{ann.title}</h3>
                <span className="bg-pink-100 text-pink-700 px-4 py-1 rounded-full text-sm">
                  {new Date(ann.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 text-lg">{ann.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
