// src/pages/UserDashboard.jsx
import { useState, useEffect } from 'react';
import { Calendar, LogOut, Plus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

 

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
          <h2 className="text-4xl font-bold text-purple-900">My Dashboard</h2>
        </div>

        {/* Tabs - Only Bookings */}
        <div className="bg-white rounded-xl shadow-lg p-2 flex gap-2 mb-6">
          <button className="px-6 py-3 rounded-lg font-semibold bg-purple-600 text-white">
            Bookings ({bookings?.length})
          </button>
        </div>

        {/* Bookings Content */}
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-lg text-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Calendar className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No Bookings Yet</h3>
              <p className="text-gray-600 mb-6">Start planning your event today!</p>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transform hover:scale-105 transition"
              >
                <Plus className="w-5 h-5" />
                Book Now
              </Link>
            </div>
          ) : (
            bookings.map(booking => (
              <div key={booking?.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">{booking?.name}</h4>
                    <p className="text-gray-600">{booking?.email} | {booking?.phone}</p>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                    booking?.status === 'approved' ? 'bg-green-100 text-green-800' :
                    booking?.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking?.status?.toUpperCase() || 'PENDING'}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Event Type</p>
                    <p className="font-semibold text-purple-900">{booking?.eventType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold text-purple-900">{booking?.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Guests</p>
                    <p className="font-semibold text-purple-900">{booking?.guests}</p>
                  </div>
                </div>

                {booking.message && (
                  <p className="text-gray-600 mb-4 italic">"{booking?.message}"</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}