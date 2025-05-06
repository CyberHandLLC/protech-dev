'use client';

import { useEffect } from 'react';
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
  const { trackContent } = useGoogleTracking();
  
  useEffect(() => {
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
      trackContent(
        'blog_post_view',
        {
          item_name: postTitle,
          item_category: postCategory,
          item_variant: postAuthor,
          item_id: postDate,
          item_list_name: 'Blog Posts',
          item_list_id: postTags.join(',')
        }
      );
      
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
    trackContent
  ]);
  
  // This component doesn't render anything
  return null;
}
