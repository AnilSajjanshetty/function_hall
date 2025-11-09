// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  Calendar,
  X,
  CheckCircle,
  Bell,
  PartyPopper,
  Mail,
  LogOut,
  MessageSquare,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookingFormModal from "../components/BookingForm";
import FeedbackForm from "../components/FeedbackForm";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [messages, setMessages] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({ title: "", message: "" });

  // Unified Event + Media Form
  const [eventForm, setEventForm] = useState({
    title: "",
    type: "",
    date: "",
    guests: "",
    description: "",
    files: null, // FileList for images/videos
  });

  const [feedbackForm, setFeedbackForm] = useState({ text: "" });

  // Gallery upload form
  const [galleryForm, setGalleryForm] = useState({
    files: null,
    titles: "",
    tags: "",
  });

  // Separate media upload for existing events
  const [selectedEventForMedia, setSelectedEventForMedia] = useState(null);
  const [eventMediaForm, setEventMediaForm] = useState({ files: null });

  const eventTypes = ["Wedding", "Birthday Party", "Engagement", "Office Event", "Anniversary"];

  // === Normalize _id → id ===
  const normalize = (arr) => (arr || []).map(item => ({ ...item, id: item._id }));

  // === Load All Data ===
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        bookingsRes,
        eventsRes,
        galleryRes,
        announcementsRes,
        messagesRes,
        feedbacksRes,
      ] = await Promise.all([
        axiosInstance.get("/bookings"),
        axiosInstance.get("/events"),
        axiosInstance.get("/gallery"),
        axiosInstance.get("/announcements"),
        axiosInstance.get("/messages"),
        axiosInstance.get("/feedback"),
      ]);

      setBookings(normalize(bookingsRes.data));
      setEvents(normalize(eventsRes.data.events || []));
      setGalleryItems(normalize(galleryRes.data.gallery || []));
      setAnnouncements(normalize(announcementsRes.data));
      setMessages(normalize(messagesRes.data));
      setFeedbacks(normalize(feedbacksRes.data.data || []));
    } catch (error) {
      console.error("Error loading data:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  // === BOOKINGS ===
  const handleApprove = async (id) => {
    try {
      await axiosInstance.patch(`/bookings/${id}/status`, { status: "approved" });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "approved" } : b));
      alert("Booking approved!");
    } catch (e) {
      alert("Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.patch(`/bookings/${id}/status`, { status: "rejected" });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "rejected" } : b));
      alert("Booking rejected!");
    } catch (e) {
      alert("Failed to reject");
    }
  };

  // === ANNOUNCEMENTS ===
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/announcements", announcementForm);
      alert(`Announcement published! Emails: ${res.data.emailsSent}, SMS: ${res.data.smsSent}`);
      setAnnouncementForm({ title: "", message: "" });
      loadAllData();
    } catch (e) {
      alert("Failed to publish");
    }
  };

  // === EVENTS + MEDIA IN ONE GO ===
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!eventForm.files || eventForm.files.length === 0) {
      return alert("Please upload at least one image/video");
    }

    const formData = new FormData();
    formData.append("title", eventForm.title);
    formData.append("type", eventForm.type);
    formData.append("date", eventForm.date);
    formData.append("guests", parseInt(eventForm.guests));
    formData.append("description", eventForm.description);
    Array.from(eventForm.files).forEach(file => formData.append("files", file));

    try {
      await axiosInstance.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Event created with media!");
      setEventForm({
        title: "",
        type: "",
        date: "",
        guests: "",
        description: "",
        files: null,
      });
      loadAllData();
    } catch (err) {
      console.error(err);
      alert("Failed to create event: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await axiosInstance.delete(`/events/${id}`);
      alert("Event deleted");
      loadAllData();
    } catch (e) {
      alert("Failed to delete");
    }
  };

  // Upload media to existing event
  const handleUploadEventMedia = async (e) => {
    e.preventDefault();
    if (!eventMediaForm.files || eventMediaForm.files.length === 0) return;
    if (!selectedEventForMedia) return alert("Select an event first");

    const formData = new FormData();
    Array.from(eventMediaForm.files).forEach(file => formData.append("files", file));
    formData.append("eventId", selectedEventForMedia.id);

    try {
      await axiosInstance.post(`/events/${selectedEventForMedia.id}/media`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Media uploaded!");
      setEventMediaForm({ files: null });
      loadAllData();
    } catch (e) {
      alert("Failed to upload media");
    }
  };

  // === GALLERY ===
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (!galleryForm.files || galleryForm.files.length === 0) return;
    if (!galleryForm.titles.trim()) return alert("Titles required");

    const formData = new FormData();
    Array.from(galleryForm.files).forEach(file => formData.append("files", file));

    const titlesArray = galleryForm.titles.split(',').map(t => t.trim()).filter(Boolean);
    if (titlesArray.length !== galleryForm.files.length) {
      return alert("Number of titles must match number of files");
    }
    formData.append("titles", JSON.stringify(titlesArray));

    if (galleryForm.tags.trim()) {
      const tagsArray = galleryForm.tags.split(',').map(t => t.trim()).filter(Boolean);
      formData.append("tags", JSON.stringify(Array.from(galleryForm.files).map((_, i) => [tagsArray[i % tagsArray.length]])));
    }

    try {
      await axiosInstance.post("/gallery/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Gallery items uploaded!");
      setGalleryForm({ files: null, titles: "", tags: "" });
      loadAllData();
    } catch (e) {
      alert("Failed to upload to gallery");
    }
  };

  const handleDeleteGalleryItem = async (id) => {
    if (!window.confirm("Delete this gallery item?")) return;
    try {
      await axiosInstance.delete(`/gallery/${id}`);
      alert("Gallery item deleted");
      loadAllData();
    } catch (e) {
      alert("Failed to delete");
    }
  };

  // === FEEDBACK ===
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackForm.text.trim()) return;
    try {
      const res = await axiosInstance.post("/feedback", { text: feedbackForm.text });
      setFeedbacks(prev => [...prev, { ...res.data, id: res.data._id }]);
      setFeedbackForm({ text: "" });
      alert("Feedback added!");
    } catch (e) {
      alert("Failed to add feedback");
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    try {
      await axiosInstance.delete(`/feedback/${id}`);
      setFeedbacks(prev => prev.filter(f => f.id !== id));
      alert("Feedback deleted");
    } catch (e) {
      alert("Failed to delete");
    }
  };

  // === UI ===
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-purple-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4 overflow-x-hidden">
      <div className="container mx-auto overflow-x-hidden">

        {/* Header */}
        <div className="flex justify-between items-center mb-3 flex-col sm:flex-row gap-4">
          <h4 className="text-2xl font-bold text-purple-900">Dashboard</h4>
        </div>

        {/* Tabs - Updated: Renamed "gallery" to "events", added "gallery" tab */}
        <div className="bg-white rounded-xl shadow-lg p-2 flex flex-wrap gap-2 mb-6">
          {[
            { id: "bookings", label: "Bookings", count: bookings.length, icon: <Calendar className="w-5 h-5" /> },
            { id: "events", label: "Events", count: events.length, icon: <PartyPopper className="w-5 h-5" /> }, // Renamed
            { id: "gallery", label: "Gallery", count: galleryItems.length, icon: <ImageIcon className="w-5 h-5" /> }, // New tab
            { id: "announcements", label: "Announcements", count: announcements.length, icon: <Bell className="w-5 h-5" /> },
            { id: "messages", label: "Messages", count: messages.length, icon: <Mail className="w-5 h-5" /> },
            { id: "feedback", label: "Feedback", count: feedbacks.length, icon: <MessageSquare className="w-5 h-5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-2 ${activeTab === tab.id
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {tab.icon} {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* === BOOKINGS TAB === */}
        {activeTab === "bookings" && (
          <div className="space-y-4 overflow-x-hidden">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h3 className="text-2xl font-bold text-purple-900">
                <Calendar className="inline w-6 h-6 mr-2" /> Booking Requests
              </h3>
              <button
                onClick={() => setShowBookingModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                + Add Booking
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                No bookings yet
              </div>
            ) : (
              bookings.map((b) => (
                <div key={b.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                  <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{b.name}</h4>
                      <p className="text-gray-600">{b.email} | {b.phone}</p>
                    </div>
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold ${b.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : b.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {b.status?.toUpperCase() || "PENDING"}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Event Type</p>
                      <p className="font-semibold text-purple-900">{b.eventType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold text-purple-900">{b.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Guests</p>
                      <p className="font-semibold text-purple-900">{b.guests}</p>
                    </div>
                  </div>

                  {b.message && (
                    <p className="text-gray-600 mb-4 italic">"{b.message}"</p>
                  )}

                  {b.status === "pending" && (
                    <div className="flex gap-4 flex-wrap">
                      <button
                        onClick={() => handleApprove(b.id)}
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(b.id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
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

        {/* === EVENTS TAB (Create Event + Media in One Form) === */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-purple-900 mb-4">
                <PartyPopper className="inline w-6 h-6 mr-2" /> Create Event + Upload Media
              </h3>
              <form onSubmit={handleEventSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Event Title"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
                  />
                  <select
                    required
                    value={eventForm.type}
                    onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                    className="px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
                  >
                    <option value="">Select Event Type</option>
                    {eventTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    required
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
                  />
                  <input
                    type="number"
                    required
                    placeholder="Guests"
                    value={eventForm.guests}
                    onChange={(e) => setEventForm({ ...eventForm, guests: e.target.value })}
                    className="px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
                  />
                </div>
                <textarea
                  required
                  placeholder="Description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
                  rows="3"
                />
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  required
                  onChange={(e) => setEventForm({ ...eventForm, files: e.target.files })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition"
                >
                  Create Event & Upload Media ({eventForm.files?.length || 0} files)
                </button>
              </form>
            </div>

            {/* Existing events list */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-purple-900 mb-4">Manage Events</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {events.map((ev) => (
                  <div key={ev.id} className="border-2 border-purple-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-800">{ev.title}</h4>
                        <p className="text-sm text-purple-600">{ev.type}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{ev.description}</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>Date: {ev.date}</span>
                      <span>Guests: {ev.guests}</span>
                      <span>Media: {ev.media?.length || 0}</span>
                    </div>
                    {ev.thumbnail && (
                      <img src={ev.thumbnail.url} alt="Thumbnail" className="mt-2 w-full h-32 object-cover rounded" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === GALLERY TAB === */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            {/* Gallery upload form */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-purple-900 mb-4">
                <ImageIcon className="inline w-6 h-6 mr-2" /> Add to Gallery
              </h3>
              <form onSubmit={handleGallerySubmit} className="space-y-4">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => setGalleryForm({ ...galleryForm, files: e.target.files })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Titles (comma-separated, one per file)"
                  value={galleryForm.titles}
                  onChange={(e) => setGalleryForm({ ...galleryForm, titles: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Tags (comma-separated, optional)"
                  value={galleryForm.tags}
                  onChange={(e) => setGalleryForm({ ...galleryForm, tags: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={!galleryForm.files || !galleryForm.titles.trim()}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-bold hover:from-green-700 hover:to-blue-700 transition disabled:opacity-50"
                >
                  Upload to Gallery ({galleryForm.files?.length || 0} files)
                </button>
              </form>
            </div>

            {/* Gallery list */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-purple-900 mb-4">Manage Gallery</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {galleryItems.map((item) => (
                  <div key={item.id} className="border-2 border-purple-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-bold text-gray-800">{item.title}</h5>
                        <p className="text-xs text-purple-600">{item.mediaType.toUpperCase()}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteGalleryItem(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                    {item.mediaType === "image" ? (
                      <img src={item.url} alt={item.title} className="w-full h-32 object-cover rounded mb-2" />
                    ) : (
                      <video src={item.url} controls className="w-full h-32 object-cover rounded mb-2" />
                    )}
                    <div className="text-xs text-gray-500">
                      <span>Tags: {item.tags?.join(", ") || "None"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === ANNOUNCEMENTS TAB === */}
        {activeTab === "announcements" && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">
              <Bell className="inline w-6 h-6 mr-2" /> Create Announcement
            </h3>
            <form onSubmit={handleAnnouncementSubmit} className="space-y-4 mb-8">
              <input
                type="text"
                required
                placeholder="Title"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
              />
              <textarea
                required
                placeholder="Message"
                value={announcementForm.message}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
                rows="4"
              />
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition"
              >
                Publish (Email + SMS to all)
              </button>
            </form>

            <h4 className="text-xl font-bold text-purple-900 mb-4">Recent</h4>
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <h5 className="font-bold text-purple-900">{a.title}</h5>
                    <span className="text-xs text-gray-500">
                      {new Date(a.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{a.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === MESSAGES TAB === */}
        {activeTab === "messages" && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">
              <Mail className="inline w-6 h-6 mr-2" /> All Messages
            </h3>
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-purple-800">{m.name}</p>
                  <p className="font-semibold text-purple-800">{m.phone}</p>
                  <p className="font-semibold text-purple-800">{m.subject}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(m.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-700 mt-2 bg-white p-3 rounded">{m.message}</p>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-center text-gray-500 py-8">No messages yet</p>
              )}
            </div>
          </div>
        )}

        {/* === FEEDBACK TAB === */}
        {activeTab === "feedback" && (
          <div className="space-y-6">
            {/* Add Feedback */}
            {/* <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-purple-900 mb-4">Add Feedback</h3>
              <FeedbackForm onSubmit={handleFeedbackSubmit} />
            </div> */}

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-purple-900 mb-4">
                All Feedback
              </h3>
              {feedbacks.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No feedback yet</p>
              ) : (
                <div className="space-y-3">
                  {feedbacks.map((fb) => (
                    <div
                      key={fb.id} // Fixed: Use id from normalize
                      className="bg-purple-50 p-4 rounded-lg flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <p className="text-gray-800">{fb.text}</p>
                        {fb.createdAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(fb.createdAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteFeedback(fb.id)} // Fixed: Use id
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      <BookingFormModal
        show={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </div>
  );
}