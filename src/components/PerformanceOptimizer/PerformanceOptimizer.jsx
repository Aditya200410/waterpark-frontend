import React, { useEffect } from 'react';

const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload critical images
      const criticalImages = [
        '/logo.webp',
        '/google.webp',
        '/footer.webm',
        '/back.webm'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = src.endsWith('.webm') || src.endsWith('.mp4') ? 'video' : 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Preload critical fonts
    const preloadFonts = () => {
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.as = 'font';
      fontLink.type = 'font/woff2';
      fontLink.crossOrigin = 'anonymous';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(fontLink);
    };

    // Optimize video loading
    const optimizeVideoLoading = () => {
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        // Only load video when it's about to be visible
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              video.load();
              observer.unobserve(video);
            }
          });
        }, { rootMargin: '100px' });
        
        observer.observe(video);
      });
    };

    // Implement resource hints
    const addResourceHints = () => {
      // DNS prefetch for external domains
      const dnsPrefetchDomains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://api.waterparkchalo.com'
      ];

      dnsPrefetchDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    // Initialize optimizations
    preloadCriticalResources();
    preloadFonts();
    addResourceHints();
    
    // Delay video optimization to avoid blocking initial render
    setTimeout(optimizeVideoLoading, 100);

    // Cleanup function
    return () => {
      // Remove any added resource hints if component unmounts
      const addedLinks = document.querySelectorAll('link[rel="preload"], link[rel="dns-prefetch"]');
      addedLinks.forEach(link => {
        if (link.href.includes('logo.webp') || 
            link.href.includes('google.webp') || 
            link.href.includes('footer.webm') ||
            link.href.includes('back.webm')) {
          link.remove();
        }
      });
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceOptimizer;
