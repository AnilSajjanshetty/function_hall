// src/pages/BookingPage.jsx
import { useState } from "react";
import { bookingAPI } from "../services/api";
import { useTranslation } from "react-i18next";

export default function BookingPage({ events }) {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    date: "",
    guests: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookingAPI.create(form);
      alert(t("bookingSuccess"));
      setForm({
        name: "",
        email: "",
        phone: "",
        eventType: "",
        date: "",
        guests: "",
        message: "",
      });
    } catch (err) {
      alert(t("bookingFail"));
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-4xl font-bold text-center mb-8 text-purple-900">
            {t("bookYourEvent")}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              required
              placeholder={t("name")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500"
            />
            <input
              required
              type="email"
              placeholder={t("email")}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500"
            />
            <input
              required
              type="tel"
              placeholder={t("phone")}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500"
            />
            <select
              required
              value={form.eventType}
              onChange={(e) => setForm({ ...form, eventType: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500"
            >
              <option value="">{t("eventType")}</option>
              {events?.map((e) => (
                <option key={e.id} value={e.name}>
                  {e.name}
                </option>
              ))}
            </select>
            <input
              required
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500"
            />
            <input
              required
              type="number"
              placeholder={t("guests")}
              value={form.guests}
              onChange={(e) => setForm({ ...form, guests: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500"
            />
            <textarea
              placeholder={t("message")}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500"
              rows="4"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold"
            >
              {t("submitBooking")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
