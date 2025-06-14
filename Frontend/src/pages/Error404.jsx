import React from 'react';
import { Link } from 'react-router-dom';

const Error404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="text-8xl font-extrabold text-purple-400 mb-4 animate-bounce">404</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Oops! Page Not Found</h1>
      <p className="text-gray-600 mb-6">The page you are looking for does not exist or has been moved.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold shadow-lg transition-colors"
      >
        Go Home
      </Link>
      <div className="mt-8 text-6xl">🧭</div>
    </div>
  );
};

export default Error404; 