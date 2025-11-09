import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState({ type: '', text: '' });

  // Automatically hide message after 5 seconds
  useEffect(() => {
    if (responseMsg.text) {
      const timer = setTimeout(() => {
        setResponseMsg({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [responseMsg]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMsg({ type: '', text: '' }); // clear any old message

    try {
      setLoading(true);
      const res = await axiosInstance.post('/contact', {
        name: formData.name,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      });

      if (res.data.success) {
        setResponseMsg({
          type: 'success',
          text: '✅ Thank you for contacting us! Your message has been sent successfully. Our team will reach out to you soon.'
        });
        setFormData({ name: '', phone: '', subject: '', message: '' });
      } else {
        setResponseMsg({ type: 'error', text: '❌ Failed to send message. Please try again.' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setResponseMsg({ type: 'error', text: '⚠️ Something went wrong. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 py-20 px-4 text-white pt-24">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-5xl font-bold text-center mb-16">Contact Us</h2>
        <div className="grid md:grid-cols-2 gap-12">

          {/* Contact Info Section */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <MapPin className="w-8 h-8 text-pink-300 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-xl mb-2">Location</h3>
                <p className="text-pink-100">
                  Viraj Garden Function Hall<br />
                  Main Road, Bodh Gaya<br />
                  Bihar, India
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Phone className="w-8 h-8 text-pink-300 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-xl mb-2">Phone</h3>
                <p className="text-pink-100">
                  +91 9876543210<br />
                  +91 9876543211
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Mail className="w-8 h-8 text-pink-300 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-xl mb-2">Email</h3>
                <p className="text-pink-100">
                  info@virajgarden.com<br />
                  bookings@virajgarden.com
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6">Quick Inquiry</h3>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 border-2 border-white/30 outline-none focus:border-pink-300 transition"
              />
              <input
                type="text"
                name="phone"
                placeholder="Your Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 border-2 border-white/30 outline-none focus:border-pink-300 transition"
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 border-2 border-white/30 outline-none focus:border-pink-300 transition"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 border-2 border-white/30 outline-none focus:border-pink-300 transition"
              ></textarea>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-lg font-bold hover:from-pink-600 hover:to-purple-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            {/* ✅ Show message below form (auto hides after 5s) */}
            {responseMsg.text && (
              <p
                className={`mt-4 text-center font-semibold ${responseMsg.type === 'success'
                  ? 'text-green-400'
                  : 'text-red-400'
                  }`}
              >
                {responseMsg.text}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
