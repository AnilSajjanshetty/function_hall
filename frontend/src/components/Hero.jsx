// src/components/Hero.jsx
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import bgImage from "../assets/virajgarden.webp"; 

export default function Hero() {
  const { t } = useTranslation();

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-pink-800 to-rose-900"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center", 
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Background overlay to darken image for text readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Background glowing circles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-40 h-40 md:w-72 md:h-72 bg-pink-500 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 w-56 h-56 md:w-96 md:h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 md:px-8">
        <div className="mb-6 animate-bounce">
          <Sparkles className="w-14 h-14 md:w-20 md:h-20 mx-auto text-yellow-300" />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-5 pt-5 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200">
          {t("heroTitle")}
        </h1>

        <p className="text-xl mb-4 text-pink-100">{t("heroSubtitle")}</p>
        <p className="text-lg mb-8 text-gray-200">{t("heroDescription")}</p>

        <Link
          to="/register"
          className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-semibold transform hover:scale-105 transition-all shadow-2xl"
        >
          Register to book now
        </Link>

        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6">
            <p className="text-3xl sm:text-4xl font-bold text-yellow-300">500+</p>
            <p className="text-pink-200 text-sm sm:text-base">{t("eventsHosted")}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6">
            <p className="text-3xl sm:text-4xl font-bold text-yellow-300">1000+</p>
            <p className="text-pink-200 text-sm sm:text-base">{t("happyClients")}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6">
            <p className="text-3xl sm:text-4xl font-bold text-yellow-300">15+</p>
            <p className="text-pink-200 text-sm sm:text-base">{t("yearsExperience")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
