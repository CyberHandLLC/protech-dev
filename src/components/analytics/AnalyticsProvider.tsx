'use client';

import FacebookPixel from './FacebookPixel';
import InstagramPixel from './InstagramPixel';
import GoogleTagManager from './GoogleTagManager';
import { ReactNode } from 'react';

interface AnalyticsProviderProps {
  children: ReactNode;
  instagramPixelId?: string;
  gtmId?: string;
}

/**
 * Analytics Provider Component
 * 
 * Single component to add all tracking scripts to the application
 * Facebook Pixel is directly implemented with the hardcoded ID
 */
export default function AnalyticsProvider({
  children,
  instagramPixelId,
  gtmId
}: AnalyticsProviderProps) {
  return (
    <>
      {/* Include all tracking scripts */}
      <FacebookPixel />
      <InstagramPixel pixelId={instagramPixelId} />
      <GoogleTagManager containerId={gtmId} />
      
      {/* Render the application */}
      {children}
    </>
  );
}
