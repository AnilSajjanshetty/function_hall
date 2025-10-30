import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 py-20 px-4 text-white pt-24">
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
};

export default ContactSection;