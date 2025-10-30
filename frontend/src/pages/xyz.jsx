import React, { useState, useEffect } from 'react';
import { Calendar, Users, Mail, Bell, CheckCircle, Clock, Star, MapPin, Phone, Sparkles, PartyPopper, Gift, Briefcase, Heart, Menu, X } from 'lucide-react';

const VirajGardenWebsite = () => {
  const [currentView, setCurrentView] = useState('home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([
    { id: 1, name: 'Wedding', icon: Heart, color: 'bg-pink-500', description: 'Grand wedding celebrations with full arrangements' },
    { id: 2, name: 'Birthday Party', icon: Gift, color: 'bg-purple-500', description: 'Memorable birthday celebrations for all ages' },
    { id: 3, name: 'Engagement', icon: Sparkles, color: 'bg-rose-500', description: 'Beautiful engagement ceremonies' },
    { id: 4, name: 'Office Event', icon: Briefcase, color: 'bg-blue-500', description: 'Corporate events and conferences' },
    { id: 5, name: 'Anniversary', icon: PartyPopper, color: 'bg-orange-500', description: 'Special anniversary celebrations' }
  ]);
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: '🎉 Diwali Special Offer', message: 'Book your event before November 15th and get 25% off on all decoration packages! Limited slots available.', date: '2025-10-25' },
    { id: 2, title: '💐 New Premium Decoration', message: 'Introducing our exclusive Royal Wedding Package with imported flowers and LED stage setup', date: '2025-10-28' },
    { id: 3, title: '🍽️ Extended Menu', message: 'Now serving 50+ cuisine varieties! Continental, Chinese, South Indian, and more added to our catering menu', date: '2025-10-20' },
    { id: 4, title: '❄️ AC Hall Available', message: 'Our fully air-conditioned hall is now ready for bookings. Perfect for summer events!', date: '2025-10-15' },
    { id: 5, title: '📸 Free Photography', message: 'Book any package above ₹1 lakh and get 2 hours of professional photography absolutely FREE!', date: '2025-10-10' }
  ]);
  
  const [recentEvents, setRecentEvents] = useState([
    { 
      id: 1, 
      title: 'Rahul & Priya Wedding', 
      type: 'Wedding',
      date: 'October 20, 2025',
      guests: 500,
      images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800', 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800'],
      videos: ['https://www.youtube.com/embed/dQw4w9WgXcQ'],
      description: 'A grand wedding ceremony with traditional decorations and a beautiful stage setup'
    },
    { 
      id: 2, 
      title: 'Tech Corp Annual Meet', 
      type: 'Corporate Event',
      date: 'October 15, 2025',
      guests: 200,
      images: ['https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'],
      videos: [],
      description: 'Professional corporate event with modern AV setup and conference facilities'
    },
    { 
      id: 3, 
      title: 'Aarav 1st Birthday', 
      type: 'Birthday Party',
      date: 'October 10, 2025',
      guests: 150,
      images: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800', 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800'],
      videos: [],
      description: 'Colorful birthday celebration with themed decorations and entertainment'
    },
    { 
      id: 4, 
      title: 'Amit & Sneha Engagement', 
      type: 'Engagement',
      date: 'October 5, 2025',
      guests: 300,
      images: ['https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800'],
      videos: [],
      description: 'Elegant engagement ceremony with floral decorations and romantic ambiance'
    }
  ]);
  
  const [services, setServices] = useState([
    { id: 1, name: 'Premium Chairs', price: '₹50/chair', image: '🪑' },
    { id: 2, name: 'Dining Tables', price: '₹500/table', image: '🍽️' },
    { id: 3, name: 'Flower Decoration', price: '₹15,000+', image: '💐' },
    { id: 4, name: 'Stage Setup', price: '₹25,000+', image: '🎭' },
    { id: 5, name: 'Lighting', price: '₹10,000+', image: '💡' },
    { id: 6, name: 'Sound System', price: '₹8,000+', image: '🔊' },
    { id: 7, name: 'Catering', price: '₹500/person', image: '🍛' },
    { id: 8, name: 'Photography', price: '₹20,000+', image: '📸' }
  ]);
  const [messages, setMessages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [scrollY, setScrollY] = useState(0);

  const [bookingForm, setBookingForm] = useState({
    name: '', email: '', phone: '', eventType: '', date: '', guests: '', message: '', selectedServices: []
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: '', message: ''
  });

  const [eventForm, setEventForm] = useState({
    title: '', type: '', date: '', guests: '', description: '', imageUrls: '', videoUrls: ''
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sendEmail = (to, subject, body) => {
    const newMessage = {
      id: Date.now(),
      to,
      subject,
      body,
      timestamp: new Date().toLocaleString(),
      read: false
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const newBooking = {
      id: Date.now(),
      ...bookingForm,
      status: 'pending',
      submittedAt: new Date().toLocaleString()
    };
    setBookings(prev => [...prev, newBooking]);
    
    sendEmail(bookingForm.email, 'Booking Received - Viraj Garden', 
      `Dear ${bookingForm.name},\n\nYour booking request for ${bookingForm.eventType} on ${bookingForm.date} has been received. We will review and get back to you soon.\n\nThank you for choosing Viraj Garden!`);
    
    sendEmail('admin@virajgarden.com', 'New Booking Request', 
      `New booking from ${bookingForm.name}\nEvent: ${bookingForm.eventType}\nDate: ${bookingForm.date}\nGuests: ${bookingForm.guests}\nPhone: ${bookingForm.phone}`);
    
    alert('Booking request submitted successfully! Check your email for confirmation.');
    setBookingForm({ name: '', email: '', phone: '', eventType: '', date: '', guests: '', message: '', selectedServices: [] });
    setCurrentView('home');
  };

  const handleApproveBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    setBookings(prev => prev.map(b => 
      b.id === bookingId ? { ...b, status: 'approved' } : b
    ));
    
    sendEmail(booking.email, 'Booking Confirmed - Viraj Garden', 
      `Dear ${booking.name},\n\nGreat news! Your booking for ${booking.eventType} on ${booking.date} has been APPROVED!\n\nWe look forward to hosting your event.\n\nViraj Garden Team`);
    
    alert('Booking approved and confirmation email sent!');
  };

  const handleRejectBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    setBookings(prev => prev.map(b => 
      b.id === bookingId ? { ...b, status: 'rejected' } : b
    ));
    
    sendEmail(booking.email, 'Booking Update - Viraj Garden', 
      `Dear ${booking.name},\n\nWe regret to inform you that we cannot accommodate your booking for ${booking.date} due to prior commitments.\n\nPlease contact us for alternative dates.\n\nViraj Garden Team`);
    
    alert('Booking rejected and notification sent!');
  };

  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();
    const newAnnouncement = {
      id: Date.now(),
      ...announcementForm,
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    
    bookings.forEach(booking => {
      sendEmail(booking.email, `Announcement: ${announcementForm.title}`, announcementForm.message);
    });
    
    alert('Announcement published and emails sent to all customers!');
    setAnnouncementForm({ title: '', message: '' });
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const imageUrls = eventForm.imageUrls.split(',').map(url => url.trim()).filter(url => url);
    const videoUrls = eventForm.videoUrls.split(',').map(url => url.trim()).filter(url => url);
    
    const newEvent = {
      id: Date.now(),
      title: eventForm.title,
      type: eventForm.type,
      date: eventForm.date,
      guests: parseInt(eventForm.guests),
      images: imageUrls,
      videos: videoUrls,
      description: eventForm.description
    };
    
    setRecentEvents(prev => [newEvent, ...prev]);
    alert('Event added to gallery successfully!');
    setEventForm({ title: '', type: '', date: '', guests: '', description: '', imageUrls: '', videoUrls: '' });
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setRecentEvents(prev => prev.filter(e => e.id !== eventId));
      alert('Event deleted successfully!');
    }
  };

  const adminLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAdmin(true);
      setCurrentView('admin');
      alert('Admin login successful!');
    } else {
      alert('Invalid password!');
    }
  };

  const Hero = () => (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-pink-800 to-rose-900">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-4">
        <div className="mb-6 animate-bounce">
          <Sparkles className="w-20 h-20 mx-auto text-yellow-300" />
        </div>
        <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200">
          Viraj Garden
        </h1>
        <p className="text-2xl md:text-3xl mb-8 text-pink-100">Where Dreams Come True</p>
        <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-200">
          Premium Function Hall for All Your Celebrations - Weddings, Birthdays, Corporate Events & More
        </p>
        <button 
          onClick={() => setCurrentView('booking')}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-12 py-4 rounded-full text-xl font-semibold transform hover:scale-105 transition-all shadow-2xl">
          Book Your Event Now
        </button>
        
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
            <p className="text-4xl font-bold text-yellow-300">500+</p>
            <p className="text-pink-200">Events Hosted</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
            <p className="text-4xl font-bold text-yellow-300">1000+</p>
            <p className="text-pink-200">Happy Clients</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
            <p className="text-4xl font-bold text-yellow-300">15+</p>
            <p className="text-pink-200">Years Experience</p>
          </div>
        </div>
      </div>
    </div>
  );

  const Navigation = () => (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-purple-900/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-pink-400" />
          <span className="text-2xl font-bold text-white">Viraj Garden</span>
        </div>
        
        <div className="hidden md:flex space-x-6">
          <button onClick={() => setCurrentView('home')} className="text-white hover:text-pink-300 transition">Home</button>
          <button onClick={() => setCurrentView('events')} className="text-white hover:text-pink-300 transition">Events</button>
          <button onClick={() => setCurrentView('gallery')} className="text-white hover:text-pink-300 transition">Gallery</button>
          <button onClick={() => setCurrentView('services')} className="text-white hover:text-pink-300 transition">Services</button>
          <button onClick={() => setCurrentView('announcements')} className="text-white hover:text-pink-300 transition">Announcements</button>
          <button onClick={() => setCurrentView('booking')} className="text-white hover:text-pink-300 transition">Book Now</button>
          <button onClick={() => setCurrentView('contact')} className="text-white hover:text-pink-300 transition">Contact</button>
        </div>
        
        <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden text-white">
          {showMobileMenu ? <X /> : <Menu />}
        </button>
      </div>
      
      {showMobileMenu && (
        <div className="md:hidden bg-purple-900/95 backdrop-blur-lg">
          <div className="flex flex-col space-y-4 px-4 py-6">
            <button onClick={() => { setCurrentView('home'); setShowMobileMenu(false); }} className="text-white text-left">Home</button>
            <button onClick={() => { setCurrentView('events'); setShowMobileMenu(false); }} className="text-white text-left">Events</button>
            <button onClick={() => { setCurrentView('gallery'); setShowMobileMenu(false); }} className="text-white text-left">Gallery</button>
            <button onClick={() => { setCurrentView('services'); setShowMobileMenu(false); }} className="text-white text-left">Services</button>
            <button onClick={() => { setCurrentView('announcements'); setShowMobileMenu(false); }} className="text-white text-left">Announcements</button>
            <button onClick={() => { setCurrentView('booking'); setShowMobileMenu(false); }} className="text-white text-left">Book Now</button>
            <button onClick={() => { setCurrentView('contact'); setShowMobileMenu(false); }} className="text-white text-left">Contact</button>
          </div>
        </div>
      )}
    </nav>
  );

  const AnnouncementsSection = () => (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-white flex items-center justify-center">
          <Bell className="w-10 h-10 mr-3 animate-bounce" />
          Latest Announcements & Offers
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {announcements.slice(0, 3).map((ann, idx) => (
            <div key={ann.id} 
              className="bg-white rounded-xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-pink-300/50"
              style={{animationDelay: `${idx * 0.1}s`}}>
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-purple-900">{ann.title}</h3>
                <span className="text-xs text-gray-500">{new Date(ann.date).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700">{ann.message}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button 
            onClick={() => setCurrentView('announcements')}
            className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-pink-50 transition">
            View All Announcements
          </button>
        </div>
      </div>
    </div>
  );

  const RecentEventsGallery = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    
    return (
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-5xl font-bold text-center mb-4 text-purple-900">Recent Events Gallery</h2>
          <p className="text-center text-gray-600 mb-16 text-lg">Memorable moments from our recent celebrations</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {recentEvents.map((event, idx) => (
              <div key={event.id} 
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="relative h-64 bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden">
                  {event.images && event.images.length > 0 ? (
                    <img 
                      src={event.images[0]} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-8xl">🎉</div>';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-8xl">🎉</div>
                  )}
                  {event.images && event.images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-purple-900/80 text-white px-3 py-1 rounded-full text-sm">
                      +{event.images.length - 1} more
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-bold text-gray-800">{event.title}</h3>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {event.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {event.guests} Guests
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedEvent(event)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition">
                    View Full Gallery
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedEvent(null)}>
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b-2 border-purple-200 p-6 flex justify-between items-center">
                <h3 className="text-3xl font-bold text-purple-900">{selectedEvent.title}</h3>
                <button onClick={() => setSelectedEvent(null)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-8 h-8" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-purple-900 mb-4">Photos</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedEvent.images && selectedEvent.images.map((img, idx) => (
                      <img 
                        key={idx}
                        src={img}
                        alt={`${selectedEvent.title} ${idx + 1}`}
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/800x600?text=Event+Photo';
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                {selectedEvent.videos && selectedEvent.videos.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-purple-900 mb-4">Videos</h4>
                    <div className="grid md:grid-cols-1 gap-4">
                      {selectedEvent.videos.map((video, idx) => (
                        <div key={idx} className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden shadow-lg">
                          <iframe
                            src={video}
                            className="absolute top-0 left-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2"><strong>Event Type:</strong> {selectedEvent.type}</p>
                  <p className="text-gray-700 mb-2"><strong>Date:</strong> {selectedEvent.date}</p>
                  <p className="text-gray-700 mb-2"><strong>Guests:</strong> {selectedEvent.guests}</p>
                  <p className="text-gray-700"><strong>Description:</strong> {selectedEvent.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const EventsSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-5xl font-bold text-center mb-4 text-purple-900">Our Events</h2>
        <p className="text-center text-gray-600 mb-16 text-lg">Perfect venue for every occasion</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, idx) => {
            const IconComponent = event.icon;
            return (
              <div key={event.id} 
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                style={{animationDelay: `${idx * 0.1}s`}}>
                <div className={`${event.color} w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto`}>
                  <IconComponent className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">{event.name}</h3>
                <p className="text-center text-gray-600">{event.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const ServicesSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-5xl font-bold text-center mb-4 text-purple-900">Our Services</h2>
        <p className="text-center text-gray-600 mb-16 text-lg">Complete event solutions under one roof</p>
        
        <div className="grid md:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <div key={service.id} 
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl text-center mb-4">{service.image}</div>
              <h3 className="text-xl font-bold text-center mb-2 text-gray-800">{service.name}</h3>
              <p className="text-center text-purple-600 font-semibold">{service.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AllAnnouncementsPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-5xl font-bold text-center mb-4 text-purple-900 flex items-center justify-center">
          <Bell className="w-12 h-12 mr-4 text-pink-600" />
          All Announcements
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">Stay updated with our latest offers and news</p>
        
        <div className="space-y-6">
          {announcements.map((ann, idx) => (
            <div key={ann.id} 
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transform hover:-translate-x-2 transition-all duration-300 border-l-4 border-pink-500">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-2xl font-bold text-purple-900">{ann.title}</h3>
                <span className="bg-pink-100 text-pink-700 px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap ml-4">
                  {new Date(ann.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">{ann.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const BookingForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-4xl font-bold text-center mb-8 text-purple-900">Book Your Event</h2>
          
          {announcements.length > 0 && (
            <div className="mb-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
              <h3 className="font-bold text-purple-900 mb-2 flex items-center">
                <Bell className="w-5 h-5 mr-2" /> Latest Announcements
              </h3>
              {announcements.slice(0, 2).map(ann => (
                <div key={ann.id} className="mb-2">
                  <p className="font-semibold text-sm text-purple-800">{ann.title}</p>
                  <p className="text-sm text-gray-700">{ann.message}</p>
                </div>
              ))}
            </div>
          )}
          
          <form onSubmit={handleBookingSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
              <input type="text" required value={bookingForm.name} onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none transition" />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input type="email" required value={bookingForm.email} onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none transition" />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
              <input type="tel" required value={bookingForm.phone} onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none transition" />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Event Type</label>
              <select required value={bookingForm.eventType} onChange={(e) => setBookingForm({...bookingForm, eventType: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none transition">
                <option value="">Select Event Type</option>
                {events.map(event => <option key={event.id} value={event.name}>{event.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Event Date</label>
              <input type="date" required value={bookingForm.date} onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none transition" />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Number of Guests</label>
              <input type="number" required value={bookingForm.guests} onChange={(e) => setBookingForm({...bookingForm, guests: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none transition" />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Additional Message</label>
              <textarea value={bookingForm.message} onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none transition" rows="4"></textarea>
            </div>
            
            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105">
              Submit Booking Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const ContactSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 py-20 px-4 text-white">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-5xl font-bold text-center mb-16">Contact Us</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <MapPin className="w-8 h-8 text-pink-300 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-xl mb-2">Location</h3>
                <p className="text-pink-100">Viraj Garden Function Hall<br/>Main Road, Bodh Gaya<br/>Bihar, India</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Phone className="w-8 h-8 text-pink-300 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-xl mb-2">Phone</h3>
                <p className="text-pink-100">+91 9876543210<br/>+91 9876543211</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Mail className="w-8 h-8 text-pink-300 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-xl mb-2">Email</h3>
                <p className="text-pink-100">info@virajgarden.com<br/>bookings@virajgarden.com</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">Quick Inquiry</h3>
            <form className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-lg bg-white/20 border-2 border-white/30 outline-none focus:border-pink-300 transition" />
              <input type="email" placeholder="Your Email" className="w-full px-4 py-3 rounded-lg bg-white/20 border-2 border-white/30 outline-none focus:border-pink-300 transition" />
              <textarea placeholder="Your Message" rows="4" className="w-full px-4 py-3 rounded-lg bg-white/20 border-2 border-white/30 outline-none focus:border-pink-300 transition"></textarea>
              <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-lg font-bold hover:from-pink-600 hover:to-purple-700 transition">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('bookings');
    
    return (
      <div className="min-h-screen bg-gray-100 py-20 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-purple-900">Admin Dashboard</h2>
            <button onClick={() => { setIsAdmin(false); setCurrentView('home'); }} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600">
              Logout
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-lg mb-8 p-2 flex gap-2 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
                activeTab === 'bookings' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              📅 Bookings ({bookings.length})
            </button>
            <button 
              onClick={() => setActiveTab('gallery')}
              className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
                activeTab === 'gallery' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              🖼️ Gallery ({recentEvents.length})
            </button>
            <button 
              onClick={() => setActiveTab('announcements')}
              className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
                activeTab === 'announcements' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              📢 Announcements
            </button>
            <button 
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
                activeTab === 'messages' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              📧 Messages ({messages.length})
            </button>
          </div>
          
          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center text-purple-900">
                <Calendar className="w-6 h-6 mr-2" /> Booking Requests
              </h3>
              <div className="space-y-4">
                {bookings.map(booking => (
                  <div key={booking.id} className="border-2 border-purple-200 rounded-lg p-6 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">{booking.name}</h4>
                        <p className="text-gray-600">{booking.email} | {booking.phone}</p>
                      </div>
                      <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                        booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                        booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Event Type</p>
                        <p className="font-semibold text-purple-900">{booking.eventType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-semibold text-purple-900">{booking.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Guests</p>
                        <p className="font-semibold text-purple-900">{booking.guests}</p>
                      </div>
                    </div>
                    {booking.message && (
                      <p className="text-gray-600 mb-4 italic">"{booking.message}"</p>
                    )}
                    {booking.status === 'pending' && (
                      <div className="flex space-x-4">
                        <button onClick={() => handleApproveBooking(booking.id)}
                          className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 mr-2" /> Approve
                        </button>
                        <button onClick={() => handleRejectBooking(booking.id)}
                          className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 flex items-center justify-center">
                          <X className="w-5 h-5 mr-2" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {bookings.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No booking requests yet</p>
                )}
              </div>
            </div>
          )}
          
          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-4 flex items-center text-purple-900">
                  <PartyPopper className="w-6 h-6 mr-2" /> Add Event to Gallery
                </h3>
                <form onSubmit={handleEventSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" required placeholder="Event Title (e.g., John & Mary Wedding)" value={eventForm.title}
                      onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                      className="px-4 py-3 rounded-lg border-2 border-purple-200 outline-none focus:border-purple-500 transition" />
                    
                    <select required value={eventForm.type} onChange={(e) => setEventForm({...eventForm, type: e.target.value})}
                      className="px-4 py-3 rounded-lg border-2 border-purple-200 outline-none focus:border-purple-500 transition">
                      <option value="">Select Event Type</option>
                      {events.map(event => <option key={event.id} value={event.name}>{event.name}</option>)}
                    </select>
                    
                    <input type="date" required value={eventForm.date}
                      onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                      className="px-4 py-3 rounded-lg border-2 border-purple-200 outline-none focus:border-purple-500 transition" />
                    
                    <input type="number" required placeholder="Number of Guests" value={eventForm.guests}
                      onChange={(e) => setEventForm({...eventForm, guests: e.target.value})}
                      className="px-4 py-3 rounded-lg border-2 border-purple-200 outline-none focus:border-purple-500 transition" />
                  </div>
                  
                  <textarea required placeholder="Event Description" value={eventForm.description}
                    onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 outline-none focus:border-purple-500 transition" rows="3"></textarea>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">📸 Image URLs (comma separated)</label>
                    <input type="text" placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" value={eventForm.imageUrls}
                      onChange={(e) => setEventForm({...eventForm, imageUrls: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 outline-none focus:border-purple-500 transition" />
                    <p className="text-xs text-gray-500 mt-1">Paste image URLs from Unsplash, Pexels, or your hosting service</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">🎥 Video URLs (comma separated, YouTube embed links)</label>
                    <input type="text" placeholder="https://www.youtube.com/embed/VIDEO_ID" value={eventForm.videoUrls}
                      onChange={(e) => setEventForm({...eventForm, videoUrls: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 outline-none focus:border-purple-500 transition" />
                    <p className="text-xs text-gray-500 mt-1">Use YouTube embed format: https://www.youtube.com/embed/VIDEO_ID</p>
                  </div>
                  
                  <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105">
                    ➕ Add Event to Gallery
                  </button>
                </form>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-6 flex items-center text-purple-900">
                  <PartyPopper className="w-6 h-6 mr-2" /> Manage Gallery Events
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {recentEvents.map(event => (
                    <div key={event.id} className="border-2 border-purple-200 rounded-lg p-4 hover:shadow-lg transition">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-800">{event.title}</h4>
                          <p className="text-sm text-purple-600">{event.type}</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition flex items-center">
                          <X className="w-4 h-4 mr-1" /> Delete
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                      <div className="flex justify-between text-xs text-gray-500 flex-wrap gap-2">
                        <span>📅 {event.date}</span>
                        <span>👥 {event.guests} guests</span>
                        <span>🖼️ {event.images?.length || 0} photos</span>
                        <span>🎥 {event.videos?.length || 0} videos</span>
                      </div>
                    </div>
                  ))}
                </div>
                {recentEvents.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No events in gallery yet. Add your first event above!</p>
                )}
              </div>
            </div>
          )}
          
          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center text-purple-900">
                <Bell className="w-6 h-6 mr-2" /> Create Announcement
              </h3>
              <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                <input type="text" required placeholder="Announcement Title (e.g., 🎉 Special Diwali Offer)" value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 outline-none focus:border-purple-500 transition" />
                <textarea required placeholder="Announcement Message" value={announcementForm.message}
                  onChange={(e) => setAnnouncementForm({...announcementForm, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 outline-none focus:border-purple-500 transition" rows="4"></textarea>
                <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition">
                  📢 Publish Announcement
                </button>
              </form>
              
              <div className="mt-8">
                <h4 className="text-xl font-bold mb-4 text-purple-900">Recent Announcements</h4>
                <div className="space-y-3">
                  {announcements.slice(0, 5).map(ann => (
                    <div key={ann.id} className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-bold text-purple-900">{ann.title}</h5>
                        <span className="text-xs text-gray-500">{new Date(ann.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{ann.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center text-purple-900">
                <Mail className="w-6 h-6 mr-2" /> Email Messages
              </h3>
              <div className="space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
                    <p className="font-semibold text-purple-800 mb-1">{msg.subject}</p>
                    <p className="text-sm text-gray-600 mb-2">To: {msg.to}</p>
                    <p className="text-xs text-gray-500 mb-2">{msg.timestamp}</p>
                    <p className="text-sm text-gray-700 bg-white p-3 rounded">{msg.body}</p>
                  </div>
                ))}
                {messages.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No messages yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const AdminLogin = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-8 text-purple-900">Admin Login</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 outline-none focus:border-purple-500"
              placeholder="Enter admin password" />
          </div>
          <button onClick={adminLogin} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700">
            Login
          </button>
          <p className="text-center text-gray-600 text-sm">Demo password: admin123</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans">
      <Navigation />
      
      {currentView === 'home' && (
        <>
          <Hero />
          <AnnouncementsSection />
          <RecentEventsGallery />
        </>
      )}
      {currentView === 'events' && <EventsSection />}
      {currentView === 'gallery' && <RecentEventsGallery />}
      {currentView === 'services' && <ServicesSection />}
      {currentView === 'announcements' && <AllAnnouncementsPage />}
      {currentView === 'booking' && <BookingForm />}
      {currentView === 'contact' && <ContactSection />}
      {currentView === 'adminLogin' && <AdminLogin />}
      {currentView === 'admin' && isAdmin && <AdminPanel />}
      
      <footer className="bg-gradient-to-r from-purple-900 to-pink-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center space-x-8 mb-6 flex-wrap">
            <button onClick={() => setCurrentView('home')} className="hover:text-pink-300 transition">Home</button>
            <button onClick={() => setCurrentView('events')} className="hover:text-pink-300 transition">Events</button>
            <button onClick={() => setCurrentView('gallery')} className="hover:text-pink-300 transition">Gallery</button>
            <button onClick={() => setCurrentView('services')} className="hover:text-pink-300 transition">Services</button>
            <button onClick={() => setCurrentView('announcements')} className="hover:text-pink-300 transition">Announcements</button>
            <button onClick={() => setCurrentView('booking')} className="hover:text-pink-300 transition">Book Now</button>
            <button onClick={() => setCurrentView('adminLogin')} className="hover:text-pink-300 transition text-sm">Admin</button>
          </div>
          <p className="text-pink-200">&copy; 2025 Viraj Garden. All rights reserved.</p>
          <p className="text-pink-300 text-sm mt-2">Making Your Events Memorable</p>
        </div>
      </footer>
    </div>
  );
};

export default VirajGardenWebsite;