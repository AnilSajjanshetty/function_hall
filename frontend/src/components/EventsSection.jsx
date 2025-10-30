import React from "react";
import { Heart, Gift, Sparkles, Briefcase, PartyPopper } from "lucide-react";
import { useTranslation } from "react-i18next";

const EventsSection = () => {
  const { t } = useTranslation();

  const events = [
    {
      id: 1,
      name: t("wedding"),
      icon: Heart,
      color: "bg-pink-500",
      description: t("weddingDesc"),
    },
    {
      id: 2,
      name: t("birthdayParty"),
      icon: Gift,
      color: "bg-purple-500",
      description: t("birthdayDesc"),
    },
    {
      id: 3,
      name: t("engagement"),
      icon: Sparkles,
      color: "bg-rose-500",
      description: t("engagementDesc"),
    },
    {
      id: 4,
      name: t("officeEvent"),
      icon: Briefcase,
      color: "bg-blue-500",
      description: t("officeDesc"),
    },
    {
      id: 5,
      name: t("anniversary"),
      icon: PartyPopper,
      color: "bg-orange-500",
      description: t("anniversaryDesc"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-5xl font-bold text-center mb-4 text-purple-900">
          {t("ourEvents")}
        </h2>
        <p className="text-center text-gray-600 mb-16 text-lg">
          {t("perfectVenue")}
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, idx) => {
            const Icon = event.icon;
            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div
                  className={`${event.color} w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto`}
                >
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">
                  {event.name}
                </h3>
                <p className="text-center text-gray-600">{event.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventsSection;
