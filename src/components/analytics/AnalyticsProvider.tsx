'use client';

import { ReactNode } from 'react';

// Social Media Tracking
import FacebookPixel from './FacebookPixel';
import InstagramPixel from './InstagramPixel';

// Google Tracking Suite
import GoogleTagManager from './GoogleTagManager';
import GoogleAnalytics from './GoogleAnalytics';
import GoogleAdsConversion from './GoogleAdsConversion';

// Page Tracking
import PageViewTracker from './PageViewTracker';

// Global Tracking Context
import { TrackingProvider } from '@/context/TrackingContext';

interface AnalyticsProviderProps {
  children: ReactNode;
  instagramPixelId?: string;
  gtmId?: string;
  ga4Id?: string;
  googleAdsId?: string;
}

/**
 * Analytics Provider Component
 * 
 * Comprehensive tracking solution for ProTech HVAC website
 * Includes Facebook Pixel, Google Tag Manager, Google Analytics 4, and Google Ads
 * All IDs are hardcoded in their respective components for simplicity
 */
export default function AnalyticsProvider({
  children,
  instagramPixelId,
  gtmId,
  ga4Id,
  googleAdsId
}: AnalyticsProviderProps) {
  return (
    <TrackingProvider>
      {/* Google Tracking Stack */}
      <GoogleTagManager containerId={gtmId} />
      <GoogleAnalytics measurementId={ga4Id} />
      <GoogleAdsConversion conversionId={googleAdsId} />
      
      {/* Social Media Tracking */}
      <FacebookPixel />
      <InstagramPixel pixelId={instagramPixelId} />
      
      {/* Automatic Page View Tracking */}
      <PageViewTracker />
      
      {/* Render the application */}
      {children}
    </TrackingProvider>
  );
}
