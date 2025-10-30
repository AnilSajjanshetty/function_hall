import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookingForm = () => {
  const [bookingForm, setBookingForm] = useState({
    name: '', email: '', phone: '', eventType: '', date: '', guests: '', message: ''
  });
  const navigate = useNavigate();

  const events = [
    { id: 1, name: 'Wedding' },
    { id: 2, name: 'Birthday Party' },
    { id: 3, name: 'Engagement' },
    { id: 4, name: 'Office Event' },
    { id: 5, name: 'Anniversary' }
  ];

  const announcements = [
    { id: 1, title: 'Special Discount', message: 'Get 20% off on weekday bookings!', date: '2025-10-25' },
    { id: 2, title: 'New Decoration Packages', message: 'Check out our premium decoration options', date: '2025-10-28' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Booking request submitted successfully!');
    setBookingForm({ name: '', email: '', phone: '', eventType: '', date: '', guests: '', message: '' });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 py-20 px-4 pt-24">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-4xl font-bold text-center mb-8 text-purple-900">Book Your Event</h2>

          {announcements?.length > 0 && (
            <div className="mb-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
              <h3 className="font-bold text-purple-900 mb-2 flex items-center">
                <Bell className="w-5 h-5 mr-2" /> Latest Announcements
              </h3>
              {announcements?.slice(0, 2).map(ann => (
                <div key={ann.id} className="mb-2">
                  <p className="font-semibold text-sm text-purple-800">{ann.title}</p>
                  <p className="text-sm text-gray-700">{ann.message}</p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="text" required placeholder="Full Name" value={bookingForm.name} onChange={e => setBookingForm({...bookingForm, name: e.target.value})} className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none transition" />
            <input type="email" required placeholder="Email" value={bookingForm.email} onChange={e => setBookingForm({...bookingForm, email: e.target.value})} className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none transition" />
            <input type="tel" required placeholder="Phone Number" value={bookingForm.phone} onChange={e => setBookingForm({...bookingForm, phone: e.target.value})} className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none transition" />
            <select required value={bookingForm.eventType} onChange={e => setBookingForm({...bookingForm, eventType: e.target.value})} className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none transition">
              <option value="">Select Event Type</option>
              {events.map(event => <option key={event.id} value={event.name}>{event.name}</option>)}
            </select>
            <input type="date" required value={bookingForm.date} onChange={e => setBookingForm({...bookingForm, date: e.target.value})} className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none transition" />
            <input type="number" required placeholder="Number of Guests" value={bookingForm.guests} onChange={e => setBookingForm({...bookingForm, guests: e.target.value})} className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none transition" />
            <textarea placeholder="Additional Message" value={bookingForm.message} onChange={e => setBookingForm({...bookingForm, message: e.target.value})} className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none transition" rows="4"></textarea>
            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105">
              Submit Booking Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;