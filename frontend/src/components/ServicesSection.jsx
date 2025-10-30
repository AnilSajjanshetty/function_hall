import React from "react";
import { useTranslation } from "react-i18next";

const ServicesSection = () => {
  const { t } = useTranslation();

  const services = [
    { id: 1, key: "premiumChairs", price: "₹50/chair", image: "🪑" },
    { id: 2, key: "diningTables", price: "₹500/table", image: "🍽️" },
    { id: 3, key: "flowerDecoration", price: "₹15,000+", image: "🌸" },
    { id: 4, key: "stageSetup", price: "₹25,000+", image: "🎤" },
    { id: 5, key: "lighting", price: "₹10,000+", image: "💡" },
    { id: 6, key: "soundSystem", price: "₹8,000+", image: "🔊" },
    { id: 7, key: "catering", price: "₹500/person", image: "🍛" },
    { id: 8, key: "photography", price: "₹20,000+", image: "📸" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-20 px-4">
      <div className="container mx-auto">
        {/* Heading and subtitle from i18n */}
        <h2 className="text-5xl font-bold text-center mb-4 text-purple-900">
          {t("ourServices")}
        </h2>
        <p className="text-center text-gray-600 mb-16 text-lg">
          {t("completeSolutions")}
        </p>

        <div className="grid md:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-center"
            >
              <div className="text-6xl mb-4">{service.image}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                {t(service.key)}
              </h3>
              <p className="text-purple-600 font-semibold">{service.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
