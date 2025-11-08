// src/components/FeedbackForm.jsx
import { useState } from "react";
import config from "../../config";
import { useEffect } from "react";

export default function FeedbackForm({ onSubmit, initial = {} }) {
  const [form, setForm] = useState({
    name: initial.name || "",
    email: initial.email || "",
    rating: initial.rating || 5,
    text: initial.text || "",
  });


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role == config.userRole) {
      setForm((prev) => ({
        ...prev,
        username: user.username || "",
        email: user.email || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.text) return;
    onSubmit(form);
    setForm({ name: "", email: "", rating: 5, text: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        disabled={true}
        type="text"
        name="name"
        required
        placeholder="Your Name"
        value={form.username}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
      />
      <input
        disabled={true}
        type="email"
        name="email"
        required
        placeholder="Your Email"
        value={form.email}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
      />
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