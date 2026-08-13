import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center font-body">
      <h1 className="text-9xl font-black font-heading text-primary mb-4 drop-shadow-sm">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Oops! The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="flex items-center gap-2 bg-gray-900 hover:bg-primary text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-md shadow-gray-900/10"
      >
        <Home size={20} />
        Back to Home
      </Link>
    </div>
  );
}
