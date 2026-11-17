import React from 'react';

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-lg ${className}`}>
      <img src="/brand-logo.png" alt="职引 Logo" className="h-full w-full object-contain" decoding="async" />
    </div>
  );
}


