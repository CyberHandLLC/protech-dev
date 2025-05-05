'use client';

import FacebookPixel from './FacebookPixel';
import InstagramPixel from './InstagramPixel';
import GoogleTagManager from './GoogleTagManager';
import { ReactNode } from 'react';

interface AnalyticsProviderProps {
  children: ReactNode;
  facebookPixelId?: string;
  instagramPixelId?: string;
  gtmId?: string;
}

/**
 * Analytics Provider Component
 * 
 * Single component to add all tracking scripts to the application
 * All IDs default to environment variables when not explicitly provided
 */
export default function AnalyticsProvider({
  children,
  facebookPixelId,
  instagramPixelId,
  gtmId
}: AnalyticsProviderProps) {
  return (
    <>
      {/* Include all tracking scripts */}
      <FacebookPixel pixelId={facebookPixelId} />
      <InstagramPixel pixelId={instagramPixelId} />
      <GoogleTagManager containerId={gtmId} />
      
      {/* Render the application */}
      {children}
    </>
  );
}
