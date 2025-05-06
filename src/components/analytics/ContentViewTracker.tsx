'use client';

import { useEffect } from 'react';
import { useFacebookEvents } from '@/hooks/useFacebookEvents';
import useFacebookServerEvents from '@/hooks/useFacebookServerEvents';
import useGoogleTracking from '@/hooks/useGoogleTracking';

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
  const { trackContent } = useGoogleTracking();
  
  useEffect(() => {
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
        contentName: contentName,
        contentCategory: contentCategory,
        contentType: contentType,
        ...additionalData
      });
      
      // Google Analytics tracking
      trackContent(
        contentType,
        {
          item_name: contentName,
          item_category: contentCategory,
          ...additionalData
        }
      );
      
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
    trackContent
  ]);
  
  // This component doesn't render anything
  return null;
}
