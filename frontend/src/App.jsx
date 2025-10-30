// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { authAPI, announcementAPI } from './services/api';

// Pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import GalleryPage from './pages/GalleryPage';
import ServicesPage from './pages/ServicesPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import BookingPage from './pages/BookingPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLoginPage from './pages/AdminLogin';

// Default data
// Default data — replace the placeholders in your App.jsx

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Diwali Special Offer",
    message: "Book any event in November and get 10% off on catering services! Limited slots available.",
    date: "2025-10-28"
  },
  {
    id: 2,
    title: "New Year Grand Celebration",
    message: "Celebrate New Year 2026 with us! Special packages starting at ₹50,000 for 100 guests.",
    date: "2025-10-25"
  },
  {
    id: 3,
    title: "Wedding Season Booking Open",
    message: "Secure your dream wedding date for 2026. Early bird discounts up to 15%!",
    date: "2025-10-20"
  },
  {
    id: 4,
    title: "Corporate Event Package",
    message: "Host your next seminar or team outing with full AV setup and lunch included.",
    date: "2025-10-15"
  },
  {
    id: 5,
    title: "Kids Birthday Bash",
    message: "Free balloon decoration + themed cake for birthdays booked this month!",
    date: "2025-10-10"
  }
];

const DEFAULT_EVENTS = [
  { id: 1, name: "Wedding", icon: "heart", color: "bg-pink-500" },
  { id: 2, name: "Birthday Party", icon: "gift", color: "bg-purple-500" },
  { id: 3, name: "Engagement", icon: "sparkles", color: "bg-rose-500" },
  { id: 4, name: "Office Event", icon: "briefcase", color: "bg-blue-500" },
  { id: 5, name: "Anniversary", icon: "party-popper", color: "bg-orange-500" }
];

const DEFAULT_RECENT_EVENTS = [
  {
    id: 1,
    title: "Rohan & Priya's Wedding",
    type: "Wedding",
    date: "15 Oct 2025",
    guests: 450,
    description: "A magical evening filled with love, lights, and unforgettable moments.",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
      "https://images.unsplash.com/photo-1562183241-b937e1de65e4?w=800&q=80"
    ]
  },
  {
    id: 2,
    title: "Aarav's 1st Birthday",
    type: "Birthday Party",
    date: "08 Oct 2025",
    guests: 80,
    description: "Jungle-themed celebration with games, cake smash, and lots of laughter!",
    images: [
      "https://images.unsplash.com/photo-1519227353069-5c4d5edd7c22?w=800&q=80",
      "https://images.unsplash.com/photo-1606983341727-1b4a5f93b1e0?w=800&q=80"
    ]
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
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
    ]
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
      "https://images.unsplash.com/photo-1511285567679-09b7d0d5b0c3?w=800&q=80"
    ]
  }
];

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [announcements, setAnnouncements] = useState(DEFAULT_ANNOUNCEMENTS);

  useEffect(() => {
    const verify = async () => {
      try {
        await authAPI.verify();
        setIsAdmin(true);
      } catch { console.log('Not logged in as admin');}
    };
    verify();

    const load = async () => {
      try {
        const data = await announcementAPI.getAll();
        if (data.length > 0) setAnnouncements(data);
      } catch {
        console.log('Using default announcements');
      }
    };
    load();
  }, []);

  return (
    <Router>
      <div className="font-sans">
        <Navigation isAdmin={isAdmin} />
        <Routes>
          <Route path="/" element={<HomePage announcements={announcements} recentEvents={DEFAULT_RECENT_EVENTS} />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/gallery" element={<GalleryPage recentEvents={DEFAULT_RECENT_EVENTS} />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/announcements" element={<AnnouncementsPage announcements={announcements} />} />
          <Route path="/booking" element={<BookingPage events={DEFAULT_EVENTS} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin/login" element={<AdminLoginPage setIsAdmin={setIsAdmin} />} />
          {/* <Route
            path="/admin"
            element={isAdmin ? <AdminDashboard setAnnouncements={setAnnouncements} /> : <Navigate to="/admin/login" />}
          /> */}
           <Route
            path="/admin"
            element={ <AdminDashboard setAnnouncements={setAnnouncements} /> }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;