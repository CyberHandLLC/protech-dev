'use client';

import { ReactNode, Suspense } from 'react';

// Social Media Tracking
import FacebookPixel from './FacebookPixel';
import InstagramPixel from './InstagramPixel';

// Google Tracking Suite
import GoogleTagManager from './GoogleTagManager';
import GoogleAnalytics from './GoogleAnalytics';
import GoogleAdsConversion from './GoogleAdsConversion';

// Page Tracking
import PageViewTracker from './PageViewTracker';
import EmailClickTracker from './EmailClickTracker';
import LocationViewedTracker from './LocationViewedTracker';
import EmergencyClickTracker from './EmergencyClickTracker';
import HomepageLandingTracker from './HomepageLandingTracker';

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
      <Suspense fallback={null}>
        {/* Google Tracking Stack */}
        <GoogleTagManager containerId={gtmId} />
        <GoogleAnalytics measurementId={ga4Id} />
        <GoogleAdsConversion conversionId={googleAdsId} />
      </Suspense>
      
      {/* Social Media Tracking */}
      <FacebookPixel />
      <InstagramPixel pixelId={instagramPixelId} />
      
      <Suspense fallback={null}>
        {/* Automatic Page View Tracking */}
        <PageViewTracker />
        {/* Global Click Tracking */}
        <EmailClickTracker />
        <EmergencyClickTracker />
        {/* Location and Homepage Tracking */}
        <LocationViewedTracker />
        <HomepageLandingTracker />
      </Suspense>
      
      {/* Render the application */}
      {children}
    </TrackingProvider>
  );
}
