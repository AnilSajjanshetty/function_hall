// src/components/LanguageSwitcher.jsx
import React from "react";
import i18n from "../i18n/i18n";

export default function LanguageSwitcher() {
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <select
      onChange={(e) => changeLanguage(e.target.value)}
      defaultValue={i18n.language}
      className="bg-purple-800 text-white text-sm px-2 py-1 rounded-md border border-pink-400 focus:outline-none"
    >
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
      <option value="mr">मराठी</option>
    </select>
  );
}
