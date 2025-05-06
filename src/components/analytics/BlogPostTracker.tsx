'use client';

import { useEffect, useRef } from 'react';
import { useFacebookEvents } from '@/hooks/useFacebookEvents';
import useFacebookServerEvents from '@/hooks/useFacebookServerEvents';
import useGoogleTracking from '@/hooks/useGoogleTracking';

interface BlogPostTrackerProps {
  postTitle: string;
  postCategory?: string;
  postAuthor?: string;
  postDate?: string;
  postTags?: string[];
}

/**
 * BlogPostTracker Component
 * 
 * Enhanced tracking for blog posts that sends detailed view_content events
 * to both Facebook (client and server) and Google Analytics
 */
export default function BlogPostTracker({
  postTitle,
  postCategory = 'HVAC Blog',
  postAuthor = '',
  postDate = '',
  postTags = []
}: BlogPostTrackerProps) {
  // Initialize tracking hooks
  const { trackViewContent: trackFacebookViewContent } = useFacebookEvents();
  const { trackViewContent: trackServerViewContent } = useFacebookServerEvents();
  const { trackPageView: trackGAContent } = useGoogleTracking();
  
  // Use ref to track if this content view has already been tracked
  const hasTrackedRef = useRef(false);
  
  useEffect(() => {
    // Prevent duplicate tracking
    if (hasTrackedRef.current) return;
    
    // Mark as tracked to prevent future fires
    hasTrackedRef.current = true;
    // Track the blog post view with enhanced data
    try {
      // Client-side Facebook tracking
      trackFacebookViewContent({
        customData: {
          contentName: postTitle,
          contentCategory: postCategory,
          contentType: 'article'
        }
      });
      
      // Server-side Facebook tracking
      trackServerViewContent({
        contentName: postTitle,
        contentCategory: postCategory,
        contentType: 'article'
      });
      
      // Google Analytics tracking
      trackGAContent('blog_post_view', postTitle, {
        content_category: postCategory,
        author: postAuthor,
        published_date: postDate,
        tags: postTags.join(',')
      });
      
      console.log(`Blog post view tracked: ${postTitle}`);
    } catch (error) {
      console.error('Error tracking blog post view:', error);
    }
  }, [
    postTitle, 
    postCategory, 
    postAuthor,
    postDate,
    postTags,
    trackFacebookViewContent,
    trackServerViewContent,
    trackGAContent
  ]);
  
  // This component doesn't render anything
  return null;
}
