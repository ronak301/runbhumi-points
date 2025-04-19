// utils/analytics.js

export const trackEvent = (eventName, properties = {}) => {
  console.log("Tracking Event:", eventName, properties);

  // Google Analytics (GA4)
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, properties);
  }
  // If you want to add Facebook Pixel / Segment / Others, you can add here
};
