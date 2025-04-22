'use client';

import { memo } from 'react';
import Link from 'next/link';

/**
 * Client-side components for EmergencyBadge and ScrollIndicator
 * Using the Server/Client Component pattern to optimize TBT:
 * - Static UI rendered on server with zero JavaScript
 * - Only interactive elements rendered on client
 */

// Memoized component to prevent unnecessary re-renders
const EmergencyBadge = memo(function EmergencyBadge() {
  return (
    <div className="absolute bottom-4 sm:bottom-8 right-0 left-0 sm:left-auto sm:right-8 z-20 flex justify-center sm:block">
      <Link 
        href="/emergency-service"
        className="group flex items-center bg-red rounded-full px-4 sm:px-5 py-2 sm:py-3 shadow-lg hover:bg-red-dark transition-colors"
        aria-label="24/7 Emergency Service"
      >
        <span className="text-xl sm:text-2xl mr-2 animate-pulse" aria-hidden="true">🚨</span>
        <div>
          <p className="text-white font-bold leading-tight text-sm sm:text-base">24/7 Emergency</p>
          <p className="text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">Fast Response</p>
        </div>
      </Link>
    </div>
  );
});

// Memoized ScrollIndicator component
const ScrollIndicator = memo(function ScrollIndicator() {
  return (
    <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block" aria-hidden="true">
      <div className="w-6 sm:w-8 h-10 sm:h-12 rounded-full border-2 border-white/50 flex items-start justify-center">
        <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-pulse"></div>
      </div>
    </div>
  );
});

// ClientHeroSection combines interactive elements but with minimal JavaScript
export default function ClientHeroSection() {
  return (
    <>
      <EmergencyBadge />
      <ScrollIndicator />
    </>
  );
}
