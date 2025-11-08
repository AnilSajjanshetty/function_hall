// src/components/FeedbackForm.jsx
import { useState } from "react";
import { useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function FeedbackForm({ booking, onClose, initial = {} }) {
  const [form, setForm] = useState({
    rating: initial.rating || 5,
    text: initial.text || "",
  });
  const bookingId = booking?._id
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.text) return alert("Please enter feedback text!");

    if (!bookingId) return alert("Booking ID is required!");

    try {
      const { data } = await axiosInstance.post("/feedback", {
        bookingId,
        rating: form.rating,
        text: form.text,
      });

      alert("Feedback submitted successfully!");
      setForm({ rating: 5, text: "" });
      onClose && onClose(data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error submitting feedback");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        name="rating"
        value={form.rating}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
      >
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n} Star{n > 1 ? "s" : ""}
          </option>
        ))}
      </select>

      <textarea
        name="text"
        required
        placeholder="Your feedback..."
        value={form.text}
        onChange={handleChange}
        rows="4"
        className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
      />

      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition"
      >
        Submit Feedback
      </button>
    </form>
  );
}
