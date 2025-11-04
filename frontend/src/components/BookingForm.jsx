import React, { useState } from "react";
import { X } from "lucide-react";

const BookingFormModal = ({ show, onClose }) => {
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    date: "",
    guests: "",
    message: "",
  });

  const events = [
    { id: 1, name: "Wedding" },
    { id: 2, name: "Birthday Party" },
    { id: 3, name: "Engagement" },
    { id: 4, name: "Office Event" },
    { id: 5, name: "Anniversary" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Booking request submitted successfully!");
    setBookingForm({
      name: "",
      email: "",
      phone: "",
      eventType: "",
      date: "",
      guests: "",
      message: "",
    });
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-pink-600 px-6 py-4 flex justify-between items-center">
          <h5 className="text-white text-xl font-bold">Book Your Event</h5>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              required
              placeholder="Full Name"
              value={bookingForm.name}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-600 outline-none"
            />

            <input
              type="email"
              required
              placeholder="Email"
              value={bookingForm.email}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, email: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-600 outline-none"
            />

            <input
              type="tel"
              required
              placeholder="Phone Number"
              value={bookingForm.phone}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, phone: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-600 outline-none"
            />

            <select
              required
              value={bookingForm.eventType}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, eventType: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-600 outline-none"
            >
              <option value="">Select Event Type</option>
              {events.map((event) => (
                <option key={event.id} value={event.name}>
                  {event.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              required
              value={bookingForm.date}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, date: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-600 outline-none"
            />

            <input
              type="number"
              required
              placeholder="Number of Guests"
              value={bookingForm.guests}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, guests: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-600 outline-none"
            />

            <textarea
              placeholder="Additional Message"
              value={bookingForm.message}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, message: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-600 outline-none"
              rows="3"
            ></textarea>

            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105 shadow-lg mt-2"
            >
              Book Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingFormModal;
