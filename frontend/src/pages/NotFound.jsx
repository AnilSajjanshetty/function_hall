import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-purple-900">404</h1>
        <p className="text-2xl text-gray-700 mb-8">Page Not Found</p>
        <Link to="/" className="bg-purple-600 text-white px-8 py-3 rounded-lg">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;