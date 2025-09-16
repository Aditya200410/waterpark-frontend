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
        console.log('🎯 LCP (Largest Contentful Paint):', lastEntry.startTime.toFixed(2) + 'ms');
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log('🎯 FID (First Input Delay):', entry.processingStart - entry.startTime + 'ms');
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
        console.log('🎯 CLS (Cumulative Layout Shift):', clsValue.toFixed(4));
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

        console.log('📊 Media Resources Performance:');
        imageResources.forEach(resource => {
          const loadTime = resource.responseEnd - resource.startTime;
          const size = resource.transferSize || 0;
          console.log(`  ${resource.name.split('/').pop()}: ${loadTime.toFixed(2)}ms (${(size/1024).toFixed(2)}KB)`);
        });

        // Overall page load time
        const navigation = performance.getEntriesByType('navigation')[0];
        console.log('🚀 Page Load Time:', navigation.loadEventEnd - navigation.fetchStart + 'ms');
        console.log('🚀 DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.fetchStart + 'ms');
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
