import React, { useState } from 'react';
import { Bell, Mail, Calendar, CheckCircle, X } from 'lucide-react';

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', message: '' });
  const [messages, setMessages] = useState([]);

  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();
    alert('Announcement published!');
    setAnnouncementForm({ title: '', message: '' });
  };

  const handleApprove = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'approved' } : b));
    alert('Booking approved!');
  };

  const handleReject = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'rejected' } : b));
    alert('Booking rejected!');
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center text-purple-900">
            <Bell className="w-6 h-6 mr-2" /> Create Announcement
          </h3>
          <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
            <input type="text" required placeholder="Title" value={announcementForm.title} onChange={e => setAnnouncementForm({...announcementForm, title: e.target.value})} className="w-full px-4 py-2 rounded-lg border-2 border-purple-200 outline-none" />
            <textarea required placeholder="Message" value={announcementForm.message} onChange={e => setAnnouncementForm({...announcementForm, message: e.target.value})} className="w-full px-4 py-2 rounded-lg border-2 border-purple-200 outline-none" rows="3"></textarea>
            <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
              Publish
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center text-purple-900">
            <Mail className="w-6 h-6 mr-2" /> Messages ({messages.length})
          </h3>
          <div className="text-center text-gray-500 py-8">No messages yet</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-6 flex items-center text-purple-900">
          <Calendar className="w-6 h-6 mr-2" /> Booking Requests ({bookings.length})
        </h3>
        <div className="text-center text-gray-500 py-8">No bookings yet</div>
      </div>
    </>
  );
};

export default AdminPanel;