import { useState, useEffect } from "react";
import { Calendar, Plus, MessageSquare } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { useTranslation } from "react-i18next";
import BookingFormModal from "../components/BookingForm";
import FeedbackForm from "../components/FeedbackForm";

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // ✅ Load bookings only
  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/bookings");
      setBookings(response.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleFeedbackClick = (booking) => {
    setSelectedBooking(booking);
    setShowFeedbackModal(true);
  };

  const isEventCompleted = (date) => {
    try {
      const eventDate = new Date(date);
      const today = new Date();
      return eventDate < today;
    } catch {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center overflow-x-hidden">
        <div className="text-2xl text-purple-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-20 px-4 overflow-x-hidden">
      <div className="max-w-6xl mx-auto w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-col sm:flex-row gap-4 text-center sm:text-left">
          <h4 className="text-2xl font-bold text-purple-900">User Dashboard</h4>
        </div>

        {/* Tabs - Bookings */}
        <div className="bg-white rounded-xl shadow-lg p-3 flex flex-wrap gap-2 mb-6 justify-between items-center">
          <button className="px-6 py-3 rounded-lg font-semibold bg-purple-600 text-white">
            {t("bookings")} ({bookings?.length})
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            + Add Booking
          </button>
        </div>

        {/* Bookings Content */}
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-lg text-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Calendar className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                No Bookings Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start planning your event today!
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transform hover:scale-105 transition"
              >
                <Plus className="w-5 h-5" />
                Book Now
              </button>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking?._id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
              >
                <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">
                      {booking?.name}
                    </h4>
                    <p className="text-gray-600">
                      {booking?.email} | {booking?.phone}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold ${booking?.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : booking?.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {booking?.status?.toUpperCase() || "PENDING"}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Event Type</p>
                    <p className="font-semibold text-purple-900">
                      {booking?.eventType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold text-purple-900">
                      {booking?.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Guests</p>
                    <p className="font-semibold text-purple-900">
                      {booking?.guests}
                    </p>
                  </div>
                </div>

                {booking.message && (
                  <p className="text-gray-600 mb-4 italic">
                    "{booking?.message}"
                  </p>
                )}

                {/* Feedback button only if approved and event date passed */}
                {booking?.status === "approved" &&
                  isEventCompleted(booking?.date) && (
                    <button
                      onClick={() => handleFeedbackClick(booking)}
                      className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-purple-600 text-white px-5 py-2 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Give Feedback
                    </button>
                  )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Booking Form Modal */}
      <BookingFormModal show={showModal} onClose={() => setShowModal(false)} />

      {/* Feedback Modal */}
      {showFeedbackModal && selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl w-[90%] sm:w-[500px]">
            <h3 className="text-xl font-semibold text-purple-900 mb-4 text-center">
              Feedback for {selectedBooking?.eventType}
            </h3>
            <FeedbackForm
              booking={selectedBooking}
              onClose={() => setShowFeedbackModal(false)}
            />
            {/* Cancel Button */}
            <button
              onClick={() => setShowFeedbackModal(false)}
              className="mt-4 w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
