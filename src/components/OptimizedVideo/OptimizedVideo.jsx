import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const OptimizedVideo = ({ 
  src, 
  poster,
  className = '', 
  autoPlay = false,
  loop = true,
  muted = true,
  playsInline = true,
  onLoadedMetadata,
  onError,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '100px 0px',
        threshold: 0.1
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const handleLoadedMetadata = (e) => {
    setIsLoaded(true);
    onLoadedMetadata?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  return (
    <div ref={videoRef} className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Error fallback */}
      {hasError && poster && (
        <img
          src={poster}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
        />
      )}
      
      {/* Actual video */}
      {shouldLoad && !hasError && (
        <motion.video
          ref={videoRef}
          src={src}
          poster={poster}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          {...props}
        >
          Your browser does not support the video tag.
        </motion.video>
      )}
    </div>
  );
};

export default OptimizedVideo;
