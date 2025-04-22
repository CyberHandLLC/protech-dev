/**
 * Deferred analytics script
 * This script is loaded with the "afterInteractive" strategy to reduce TBT
 */

// Initialize analytics after the page is interactive
function initAnalytics() {
  // Simple analytics placeholder that doesn't block the main thread
  console.log('Analytics initialized');
  
  // Mock analytics setup that would normally be run immediately
  // In a real application, this would be your actual analytics code
  // By deferring this execution, we reduce TBT
}

// Use requestIdleCallback to run non-critical code during browser idle time
// This dramatically reduces TBT by moving work off the main thread
if (typeof window !== 'undefined') {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      initAnalytics();
    });
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(initAnalytics, 1000);
  }
}
