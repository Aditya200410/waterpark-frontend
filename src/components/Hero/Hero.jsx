import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import config from '../../config/config';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AnimatedBubbles from '../AnimatedBubbles/AnimatedBubbles';

const isVideo = (url) => url && url.toLowerCase().endsWith('.mp4');

// Animation variants for the text content
const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const textItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const Hero = () => {
  const [carouselData, setCarouselData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(undefined);
  const navigate = useNavigate();

  // Helper to update container height based on image aspect ratio
  const updateContainerHeight = (naturalWidth, naturalHeight) => {
    if (containerRef.current && naturalWidth && naturalHeight) {
      const containerWidth = containerRef.current.offsetWidth;
      const aspectRatio = naturalHeight / naturalWidth;
      setContainerHeight(containerWidth * aspectRatio);
    }
  };

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      if (carouselData.length > 0 && containerRef.current && containerHeight) {
        const currentItem = carouselData[currentSlide];
        if (isVideo(currentItem.image)) {
          // For videos, we might need a different approach or accept a fixed aspect ratio
          // For simplicity, we'll re-trigger based on an assumed or initial ratio if possible.
          // This part is tricky as video elements don't have naturalWidth/Height until metadata loads.
          // The onLoadedMetadata handler should mostly cover this.
        } else {
          const img = new window.Image();
          img.src = currentItem.image;
          img.onload = () => {
            updateContainerHeight(img.naturalWidth, img.naturalHeight);
          };
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [carouselData, currentSlide, containerHeight]);

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/hero-carousel/active`);
        if (!response.ok) throw new Error('Failed to fetch carousel data');
        const data = await response.json();
        setCarouselData(data);
      } catch (err) {
        console.error('Error fetching carousel data:', err);
        setError('Failed to load carousel content');
      } finally {
        setLoading(false);
      }
    };
    fetchCarouselData();
  }, []);

  useEffect(() => {
    if (carouselData.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselData.length);
      }, 5000); // You might want to increase this to allow time to read text, e.g., 7000
      return () => clearInterval(timer);
    }
  }, [carouselData]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  };

  const handleMediaError = (e) => {
    console.error('Media loading error:', e);
    e.target.style.display = 'none';
    const fallbackText = document.createElement('div');
    fallbackText.className = 'absolute inset-0 flex items-center justify-center text-red-500 text-lg bg-white bg-opacity-90 rounded-lg shadow-lg';
    fallbackText.textContent = 'Media unavailable';
    e.target.parentNode.appendChild(fallbackText);
  };
  
  const handleCtaClick = (e, link) => {
    e.stopPropagation(); // Prevent the parent div's onClick from firing
    if (link) {
      navigate(link);
    }
  };


  if (loading || error || !carouselData?.length) {
    return (
      <div className="w-full h-[400px] md:h-[600px] lg:h-[700px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        {loading ? (
          <div className="w-12 h-12 border-4 border-blue-100 border-l-blue-500 rounded-full animate-spin" />
        ) : (
          <p className="text-gray-600 text-lg text-center p-8">{error || 'No carousel items available'}</p>
        )}
      </div>
    );
  }
  
  const currentItem = carouselData[currentSlide];

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden bg-black"
      style={containerHeight ? { height: containerHeight, maxHeight: '80vh' } : { height: 400, maxHeight: '80vh' }}
    >
      <AnimatedBubbles />
      {/* Navigation Buttons */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={e => { e.stopPropagation(); prevSlide(); }}
          className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={e => { e.stopPropagation(); nextSlide(); }}
          className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 z-0"
        >
          {isVideo(currentItem.image) ? (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              onLoadedMetadata={e => updateContainerHeight(e.target.videoWidth, e.target.videoHeight)}
              autoPlay loop muted playsInline onError={handleMediaError}
            >
              <source src={currentItem.image} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={currentItem.image}
              alt={currentItem.title || 'Hero image'}
              className="absolute inset-0 w-full h-full object-cover"
              onLoad={e => updateContainerHeight(e.target.naturalWidth, e.target.naturalHeight)}
              onError={handleMediaError}
            />
          )}

          {/* --- CONTENT OVERLAY & ANIMATION --- */}
       
        </motion.div>
      </AnimatePresence>

      {/* Slide indicators */}
      <div className="absolute  bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
        {carouselData.map((_, index) => (
          <button
            key={index}
            onClick={(e) => { e.stopPropagation(); setCurrentSlide(index); }}
            className={`h-2 w-2 rounded-full transition-all duration-300 backdrop-blur-sm ${
              currentSlide === index ? 'w-8 bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;