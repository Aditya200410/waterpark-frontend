import React, { useEffect } from 'react';

const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV !== 'development') return;

    // Monitor Core Web Vitals
    const measurePerformance = () => {
      // Largest Contentful Paint (LCP)
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Resource loading times
      window.addEventListener('load', () => {
        const resources = performance.getEntriesByType('resource');
        const imageResources = resources.filter(resource => 
          resource.name.includes('.png') || 
          resource.name.includes('.jpg') || 
          resource.name.includes('.jpeg') || 
          resource.name.includes('.webp') ||
          resource.name.includes('.mp4') ||
          resource.name.includes('.webm')
        );

        imageResources.forEach(resource => {
          const loadTime = resource.responseEnd - resource.startTime;
          const size = resource.transferSize || 0;
        });

        // Overall page load time
        const navigation = performance.getEntriesByType('navigation')[0];
      });
    };

    // Run performance monitoring
    measurePerformance();

    // Cleanup
    return () => {
      // Cleanup observers if needed
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;
