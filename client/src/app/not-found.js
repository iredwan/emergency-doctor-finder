"use client"
import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
      <h1 className="text-8xl text-primary font-bold m-0">404</h1>
      
      <h2 className="text-3xl text-secondary font-normal mb-6">Page Not Found</h2>
      
      <p className="text-lg max-w-lg mb-8 text-gray-600">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      
      <Link href="/" className="bg-primary text-white px-6 py-3 rounded font-bold shadow-lg hover:bg-opacity-90 transition-all">
        Return Home
      </Link>
    </div>
  );
} 