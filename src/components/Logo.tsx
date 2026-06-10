import React from 'react';

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg 
        className="w-full h-full"
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="职引 Logo"
      >
        <path d="M12 12 H28 L15 28 H28" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 25 L32 15 L28 28 Z" fill="#F59E0B" />
        <path d="M16 28 Q 22 26 28 18" stroke="#F59E0B" strokeWidth="2" fill="none" strokeDasharray="2 2" />
      </svg>
    </div>
  );
}


