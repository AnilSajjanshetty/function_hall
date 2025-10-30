import React from 'react';

const GalleryPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-20 px-4 pt-24">
      <div className="container mx-auto">
        <h2 className="text-5xl font-bold text-center mb-4 text-purple-900">Event Gallery</h2>
        <p className="text-center text-gray-600 mb-16 text-lg">Memorable moments from our celebrations</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-6xl text-white">
                Party
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800">Grand Celebration</h3>
                <p className="text-sm text-gray-600">March {i * 5}, 2025</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;