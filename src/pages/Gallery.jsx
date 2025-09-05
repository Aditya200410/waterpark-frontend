import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import config from '../config/config';
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedBubbles from '../components/AnimatedBubbles/AnimatedBubbles';

const Gallery = () => {
  const [carouselData, setCarouselData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the lightbox
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const isLightboxOpen = selectedImageIndex !== null;

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/hero-carousel/active`);
        if (!response.ok) throw new Error('Failed to fetch carousel data');
        const data = await response.json();
        const filteredData = data.filter(item => item.isMobile === true);
        setCarouselData(filteredData);
      } catch (err) {
        console.error('Error fetching carousel data:', err);
        setError('Failed to load gallery content');
      } finally {
        setLoading(false);
      }
    };
    fetchCarouselData();
  }, []);

  // Lightbox navigation handlers
  const handleOpenLightbox = (index) => setSelectedImageIndex(index);
  const handleCloseLightbox = () => setSelectedImageIndex(null);
  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
  };
  const handlePrevImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex - 1 + carouselData.length) % carouselData.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-sky-100">
        <div className="w-16 h-16 border-8 border-cyan-200 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !carouselData.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-sky-100">
        <p className="text-red-500 text-lg">{error || 'No gallery items available'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative font-sans  overflow-hidden">
      <AnimatedBubbles />

      <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative z-10 py-16 md:py-20">
        {/* Thematic Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center justify-center gap-3 text-white mb-4">
            
           <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-700 mb-4 tracking-tight">
              <span className="text-white italic font-serif">
               Splash Gallery
              </span>{" "}
              ✨
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-6 rounded-full shadow-sm"></div>
            <p className="text-lg sm:text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed">
              Amazing photos of our Amazing waterpark
            </p>
          </motion.div>
          </div>
          <div className="mx-auto w-48 mt-2">
           
          </div>
        </motion.div>
      
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {carouselData.map((item, idx) => (
            <motion.div
              key={item._id || idx}
              className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer border-2 border-cyan-300/50"
              onClick={() => handleOpenLightbox(idx)}
              whileHover={{ scale: 1.05, y: -5, shadow: "0 25px 50px -12px rgba(103, 232, 249, 0.4)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
            >
              <img
                src={item.image}
               
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/fallback.png'; }}
              />
             
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/50 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseLightbox}
          >
            {/* Main Image Display */}
            <motion.div 
              className="relative"
              layoutId={`gallery-image-${selectedImageIndex}`}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
            >
              <img
                src={carouselData[selectedImageIndex].image}
                alt={carouselData[selectedImageIndex].title || 'Full view'}
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
              />
            </motion.div>

            {/* Close Button */}
            <motion.button
              className="absolute top-5 right-5 w-12 h-12 bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-md hover:bg-white/50 transition-colors"
              onClick={handleCloseLightbox}
              whileHover={{ scale: 1.1, rotate: 90 }}
            >
              <X size={28} />
            </motion.button>

            {/* Previous Button */}
            <motion.button
              className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-md hover:bg-white/50 transition-colors"
              onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
              whileHover={{ scale: 1.1 }}
            >
              <ChevronLeft size={32} />
            </motion.button>
            
            {/* Next Button */}
            <motion.button
              className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-md hover:bg-white/50 transition-colors"
              onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
              whileHover={{ scale: 1.1 }}
            >
              <ChevronRight size={32} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;