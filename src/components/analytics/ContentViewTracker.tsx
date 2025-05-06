'use client';

import { useEffect, useRef } from 'react';
import { useFacebookEvents } from '@/hooks/useFacebookEvents';
import useFacebookServerEvents from '@/hooks/useFacebookServerEvents';
import useGoogleTracking from '@/hooks/useGoogleTracking';
import { useTracking } from '@/context/TrackingContext';

interface ContentViewTrackerProps {
  contentName: string;
  contentType: string;
  contentCategory?: string;
  additionalData?: Record<string, any>;
}

/**
 * ContentViewTracker Component
 * 
 * General purpose content view tracking for about pages, informational pages, etc.
 * Tracks content views with both Facebook and Google Analytics
 */
export default function ContentViewTracker({
  contentName,
  contentType,
  contentCategory = 'Information',
  additionalData = {}
}: ContentViewTrackerProps) {
  // Initialize tracking hooks
  const { trackViewContent: trackFacebookViewContent } = useFacebookEvents();
  const { trackViewContent: trackServerViewContent } = useFacebookServerEvents();
  const { trackPageView: trackGAContent } = useGoogleTracking();
  
  // Get global tracking context for centralized deduplication
  const { trackEvent, isTrackingEnabled } = useTracking();
  
  // Keep the local ref as a backup prevention measure
  const hasTrackedRef = useRef(false);
  
  useEffect(() => {
    // Skip if already tracked or tracking is disabled
    if (hasTrackedRef.current || !isTrackingEnabled) return;
    
    // Mark as tracked locally to prevent future fires
    hasTrackedRef.current = true;
    
    // Create a unique ID for this content view
    const uniqueId = `content_view:${contentType}:${contentName}`;
    
    // Use global tracking context to prevent duplicate tracking
    if (!trackEvent('content_view', contentName, uniqueId)) {
      console.log(`Content view throttled by global context: ${contentName}`);
      return;
    }
    // Track the content view with enhanced data
    try {
      // Client-side Facebook tracking
      trackFacebookViewContent({
        customData: {
          contentName: contentName,
          contentCategory: contentCategory,
          contentType: contentType,
          ...additionalData
        }
      });
      
      // Server-side Facebook tracking
      trackServerViewContent({
        contentName,
        contentCategory,
        contentType
      });
      
      // Google Analytics tracking
      trackGAContent(contentType, contentName, {
        content_category: contentCategory,
        ...additionalData
      });
      
      console.log(`Content view tracked: ${contentName} (${contentType})`);
    } catch (error) {
      console.error('Error tracking content view:', error);
    }
  }, [
    contentName,
    contentType,
    contentCategory,
    additionalData,
    trackFacebookViewContent,
    trackServerViewContent,
    trackGAContent
  ]);
  
  // This component doesn't render anything
  return null;
}
