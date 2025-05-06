'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface TrackedEvent {
  id: string;
  timestamp: number;
  eventType: string;
  contentName: string;
}

interface TrackingContextType {
  isInitialized: boolean;
  trackedEvents: Record<string, TrackedEvent>;
  isTrackingEnabled: boolean;
  pageViewTracked: boolean;
  trackEvent: (eventType: string, contentName: string, uniqueId?: string) => boolean;
  setPageViewTracked: (value: boolean) => void;
  enableTracking: () => void;
  disableTracking: () => void;
  isEventTracked: (eventType: string, contentName: string) => boolean;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

// The number of milliseconds to prevent duplicate events
const THROTTLE_WINDOW = 2000;

// Generate a unique ID for an event using its properties
const generateEventId = (eventType: string, contentName: string, uniqueId?: string): string => {
  return uniqueId || `${eventType}:${contentName}`.toLowerCase().replace(/\s+/g, '-');
};

export const TrackingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(true);
  const [pageViewTracked, setPageViewTracked] = useState(false);
  const trackedEventsRef = useRef<Record<string, TrackedEvent>>({});

  // Initialize tracking on mount
  useEffect(() => {
    // Don't track in development mode unless explicitly enabled
    const shouldTrack = process.env.NODE_ENV === 'production' || localStorage.getItem('enable_dev_tracking') === 'true';
    setIsTrackingEnabled(shouldTrack);
    setIsInitialized(true);

    // Clean up old tracked events every 10 minutes
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      const updatedEvents = { ...trackedEventsRef.current };
      
      // Remove events older than 30 minutes
      Object.keys(updatedEvents).forEach(key => {
        if (now - updatedEvents[key].timestamp > 30 * 60 * 1000) {
          delete updatedEvents[key];
        }
      });
      
      trackedEventsRef.current = updatedEvents;
    }, 10 * 60 * 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  // Track an event and prevent duplicates
  const trackEvent = (eventType: string, contentName: string, uniqueId?: string): boolean => {
    if (!isTrackingEnabled || !isInitialized) {
      return false;
    }

    // Special case: Always allow standard page_view events to prevent Facebook Pixel issues
    // This ensures basic PageView events are never blocked, while still preventing duplicates of custom events
    if (eventType === 'page_view' && (!contentName || contentName === 'PageView')) {
      return true;
    }

    const eventId = generateEventId(eventType, contentName, uniqueId);
    const now = Date.now();
    
    // Check if this event was recently tracked
    const existingEvent = trackedEventsRef.current[eventId];
    if (existingEvent && now - existingEvent.timestamp < THROTTLE_WINDOW) {
      console.log(`Event throttled: ${eventType} - ${contentName} (duplicate within ${THROTTLE_WINDOW}ms)`);
      return false;
    }
    
    // Record this event
    trackedEventsRef.current = {
      ...trackedEventsRef.current,
      [eventId]: {
        id: eventId,
        timestamp: now,
        eventType,
        contentName
      }
    };
    
    return true;
  };

  // Check if an event has been tracked recently
  const isEventTracked = (eventType: string, contentName: string): boolean => {
    const eventId = generateEventId(eventType, contentName);
    const existingEvent = trackedEventsRef.current[eventId];
    
    if (!existingEvent) return false;
    
    // Check if event was tracked within the throttle window
    return Date.now() - existingEvent.timestamp < THROTTLE_WINDOW;
  };

  const enableTracking = () => setIsTrackingEnabled(true);
  const disableTracking = () => setIsTrackingEnabled(false);

  const value: TrackingContextType = {
    isInitialized,
    trackedEvents: trackedEventsRef.current,
    isTrackingEnabled,
    pageViewTracked,
    trackEvent,
    setPageViewTracked,
    enableTracking,
    disableTracking,
    isEventTracked
  };

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = (): TrackingContextType => {
  const context = useContext(TrackingContext);
  if (context === undefined) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};
