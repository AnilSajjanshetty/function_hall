import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

export default function FeedbackModal() {
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedbackData.name || !feedbackData.email || !feedbackData.message) {
      Swal.fire({
        icon: "warning",
        title: "Please fill all fields!",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", feedbackData.name);
    formData.append("email", feedbackData.email);
    formData.append("message", feedbackData.message);
    if (file) formData.append("file", file);

    try {
      setLoading(true);
      const response = await axiosInstance.post(`/feedback/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Feedback Submitted!",
        text: response?.data?.message || "Thank you for your feedback 😊",
        timer: 2000,
        showConfirmButton: false,
      });

      setFeedbackData({ name: "", email: "", message: "" });
      setFile(null);
    } catch (error) {
      console.error("Feedback submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to submit feedback!",
        text: error?.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 bg-gradient-to-r from-pink-50 to-purple-50">
      <motion.div
        className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 w-[90%] sm:w-[500px]"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-pink-600">
          Share Your Feedback 💬
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            value={feedbackData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-400 outline-none"
          />

          <input
            type="email"
            name="email"
            value={feedbackData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-400 outline-none"
          />

          <textarea
            name="message"
            value={feedbackData.message}
            onChange={handleChange}
            placeholder="Write your feedback..."
            rows="4"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-400 outline-none"
          ></textarea>

          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 cursor-pointer"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
