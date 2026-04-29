import React from 'react';

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  // Use the user's uploaded logo. Ensure the image is uploaded to public/logo.png
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img 
        src="/logo.png" 
        alt="职引 Logo" 
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback to SVG if image is not yet uploaded
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling?.classList.remove('hidden');
        }}
      />
      {/* Fallback SVG */}
      <svg 
        className="hidden w-full h-full"
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 12 H28 L15 28 H28" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 25 L32 15 L28 28 Z" fill="#F59E0B" />
        <path d="M16 28 Q 22 26 28 18" stroke="#F59E0B" strokeWidth="2" fill="none" strokeDasharray="2 2" />
      </svg>
    </div>
  );
}


