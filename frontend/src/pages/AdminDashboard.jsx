// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import {
  bookingAPI,
  announcementAPI,
  eventAPI,
  messageAPI,
} from "../services/api";
import {
  Calendar,
  X,
  CheckCircle,
  Bell,
  PartyPopper,
  Mail,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookingFormModal from "../components/BookingForm";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    date: "",
    guests: "",
    message: "",
  });

  const DEFAULT_ANNOUNCEMENTS = [
    {
      id: 1,
      title: "Diwali Special Offer",
      message:
        "Book any event in November and get 10% off on catering services! Limited slots available.",
      date: "2025-10-28",
    },
    {
      id: 2,
      title: "New Year Grand Celebration",
      message:
        "Celebrate New Year 2026 with us! Special packages starting at ₹50,000 for 100 guests.",
      date: "2025-10-25",
    },
    {
      id: 3,
      title: "Wedding Season Booking Open",
      message:
        "Secure your dream wedding date for 2026. Early bird discounts up to 15%!",
      date: "2025-10-20",
    },
    {
      id: 4,
      title: "Corporate Event Package",
      message:
        "Host your next seminar or team outing with full AV setup and lunch included.",
      date: "2025-10-15",
    },
    {
      id: 5,
      title: "Kids Birthday Bash",
      message:
        "Free balloon decoration + themed cake for birthdays booked this month!",
      date: "2025-10-10",
    },
  ];

  const DEFAULT_RECENT_EVENTS = [
    {
      id: 1,
      title: "Rohan & Priya's Wedding",
      type: "Wedding",
      date: "15 Oct 2025",
      guests: 450,
      description:
        "A magical evening filled with love, lights, and unforgettable moments.",
      images: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
        "https://images.unsplash.com/photo-1562183241-b937e1de65e4?w=800&q=80",
      ],
    },
    {
      id: 2,
      title: "Aarav's 1st Birthday",
      type: "Birthday Party",
      date: "08 Oct 2025",
      guests: 80,
      description:
        "Jungle-themed celebration with games, cake smash, and lots of laughter!",
      images: [
        "https://images.unsplash.com/photo-1519227353069-5c4d5edd7c22?w=800&q=80",
        "https://images.unsplash.com/photo-1606983341727-1b4a5f93b1e0?w=800&q=80",
      ],
    },
    {
      id: 3,
      title: "TechWave Annual Meet 2025",
      type: "Office Event",
      date: "01 Oct 2025",
      guests: 200,
      description: "Product launch, awards, and networking dinner.",
      images: [
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      ],
    },
    {
      id: 4,
      title: "Silver Jubilee Anniversary",
      type: "Anniversary",
      date: "25 Sep 2025",
      guests: 120,
      description: "25 years of love celebrated with family and close friends.",
      images: [
        "https://images.unsplash.com/photo-1606216794074-735e8e0d3d6e?w=800&q=80",
        "https://images.unsplash.com/photo-1511285567679-09b7d0d5b0c3?w=800&q=80",
      ],
    },
  ];

  const [announcements, setAnnouncements] = useState(DEFAULT_ANNOUNCEMENTS);
  const [events, setEvents] = useState(DEFAULT_RECENT_EVENTS);

  // Forms
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    message: "",
  });
  const [eventForm, setEventForm] = useState({
    title: "",
    type: "",
    date: "",
    guests: "",
    description: "",
    imageUrls: "",
    videoUrls: "",
  });

  const eventTypes = [
    "Wedding",
    "Birthday Party",
    "Engagement",
    "Office Event",
    "Anniversary",
  ];

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [bookingsData, eventsData, announcementsData, messagesData] =
        await Promise.all([
          bookingAPI.getAll(),
          eventAPI.getAll(),
          announcementAPI.getAll(),
          messageAPI.getAll(),
        ]);
      setBookings(bookingsData);
      setEvents(eventsData);
      setAnnouncements(announcementsData);
      setMessages(messagesData);
    } catch (error) {
      console.error("Error loading data:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    delete require("../services/api").default.defaults.headers.common[
      "Authorization"
    ];
    navigate("/admin/login");
  };

  const handleApprove = async (id) => {
    try {
      await bookingAPI.updateStatus(id, "approved");
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "approved" } : b))
      );
      alert("Booking approved! Email and SMS sent to customer.");
    } catch (error) {
      alert("Failed to approve booking");
    }
  };

  const handleReject = async (id) => {
    try {
      await bookingAPI.updateStatus(id, "rejected");
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "rejected" } : b))
      );
      alert("Booking rejected. Notification sent to customer.");
    } catch (error) {
      alert("Failed to reject booking");
    }
  };

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await announcementAPI.create(announcementForm);
      alert(
        `Announcement published! Emails: ${response.emailsSent}, SMS: ${response.smsSent}`
      );
      setAnnouncementForm({ title: "", message: "" });
      loadAllData();
    } catch (error) {
      alert("Failed to create announcement");
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageUrls = eventForm.imageUrls
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url);
      const videoUrls = eventForm.videoUrls
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url);

      await eventAPI.create({
        title: eventForm.title,
        type: eventForm.type,
        date: eventForm.date,
        guests: parseInt(eventForm.guests),
        images: imageUrls,
        videos: videoUrls,
        description: eventForm.description,
      });

      alert("Event added successfully!");
      setEventForm({
        title: "",
        type: "",
        date: "",
        guests: "",
        description: "",
        imageUrls: "",
        videoUrls: "",
      });
      loadAllData();
    } catch (error) {
      alert("Failed to add event");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Delete this event?")) {
      try {
        await eventAPI.delete(id);
        alert("Event deleted!");
        loadAllData();
      } catch (error) {
        alert("Failed to delete event");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-purple-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-purple-900">
            Admin Dashboard
          </h2>
          {/* <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition">
            <LogOut className="w-5 h-5" />
            Logout
          </button> */}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-2 flex gap-2 mb-6 overflow-x-auto">
          {[
            {
              id: "bookings",
              label: "Bookings",
              count: bookings.length,
              icon: "📅",
            },
            {
              id: "gallery",
              label: "Gallery",
              count: events.length,
              icon: "🖼️",
            },
            {
              id: "announcements",
              label: "Announcements",
              count: announcements.length,
              icon: "📢",
            },
            {
              id: "messages",
              label: "Messages",
              count: messages.length,
              icon: "📧",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.icon} {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-purple-900">
                <Calendar className="inline w-6 h-6 mr-2" />
                Booking Requests
              </h3>
              <button
                onClick={() => setShowBookingModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                + Add Booking
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                No bookings yet
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">
                        {booking.name}
                      </h4>
                      <p className="text-gray-600">
                        {booking.email} | {booking.phone}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold ${
                        booking.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status?.toUpperCase() || "PENDING"}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Event Type</p>
                      <p className="font-semibold text-purple-900">
                        {booking.eventType}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold text-purple-900">
                        {booking.date}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Guests</p>
                      <p className="font-semibold text-purple-900">
                        {booking.guests}
                      </p>
                    </div>
                  </div>

                  {booking.message && (
                    <p className="text-gray-600 mb-4 italic">
                      "{booking.message}"
                    </p>
                  )}

                  {booking.status === "pending" && (
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleApprove(booking.id)}
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(booking.id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
                      >
                        <X className="w-5 h-5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            {/* Add Event Form */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-purple-900 mb-4">
                <PartyPopper className="inline w-6 h-6 mr-2" />
                Add Event to Gallery
              </h3>
              <form onSubmit={handleEventSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Event Title"
                    value={eventForm.title}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, title: e.target.value })
                    }
                    className="px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
                  />
                  <select
                    required
                    value={eventForm.type}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, type: e.target.value })
                    }
                    className="px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
                  >
                    <option value="">Select Event Type</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    required
                    value={eventForm.date}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, date: e.target.value })
                    }
                    className="px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
                  />
                  <input
                    type="number"
                    required
                    placeholder="Guests"
                    value={eventForm.guests}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, guests: e.target.value })
                    }
                    className="px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
                  />
                </div>
                <textarea
                  required
                  placeholder="Description"
                  value={eventForm.description}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, description: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
                  rows="3"
                />
                <input
                  type="text"
                  placeholder="Image URLs (comma separated)"
                  value={eventForm.imageUrls}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, imageUrls: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Video URLs (YouTube embed)"
                  value={eventForm.videoUrls}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, videoUrls: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition"
                >
                  Add Event
                </button>
              </form>
            </div>

            {/* Events List */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-purple-900 mb-4">
                Manage Events
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="border-2 border-purple-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-800">
                          {event.title}
                        </h4>
                        <p className="text-sm text-purple-600">{event.type}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {event.description}
                    </p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>📅 {event.date}</span>
                      <span>👥 {event.guests}</span>
                      <span>🖼️ {event.images?.length || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === "announcements" && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">
              <Bell className="inline w-6 h-6 mr-2" />
              Create Announcement
            </h3>
            <form
              onSubmit={handleAnnouncementSubmit}
              className="space-y-4 mb-8"
            >
              <input
                type="text"
                required
                placeholder="Title"
                value={announcementForm.title}
                onChange={(e) =>
                  setAnnouncementForm({
                    ...announcementForm,
                    title: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
              />
              <textarea
                required
                placeholder="Message"
                value={announcementForm.message}
                onChange={(e) =>
                  setAnnouncementForm({
                    ...announcementForm,
                    message: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
                rows="4"
              />
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition"
              >
                📢 Publish (Email + SMS to all)
              </button>
            </form>

            <h4 className="text-xl font-bold text-purple-900 mb-4">Recent</h4>
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <h5 className="font-bold text-purple-900">{ann.title}</h5>
                    <span className="text-xs text-gray-500">{ann.date}</span>
                  </div>
                  <p className="text-gray-700">{ann.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">
              <Mail className="inline w-6 h-6 mr-2" />
              All Messages
            </h3>
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-purple-800">{msg.subject}</p>
                  <p className="text-sm text-gray-600">To: {msg.to}</p>
                  <p className="text-xs text-gray-500">{msg.timestamp}</p>
                  <p className="text-sm text-gray-700 mt-2 bg-white p-3 rounded">
                    {msg.body}
                  </p>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No messages yet
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      <BookingFormModal show={showBookingModal} onClose={() => setShowBookingModal(false)} />
    </div>
  );
}
