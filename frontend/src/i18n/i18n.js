// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import mr from "./locales/mr.json";
import hi from "./locales/hi.json"; // optional

const resources = {
  en: { translation: en },
  mr: { translation: mr },
  hi: { translation: hi },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "en", // 🟢 Remember last language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
