import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import config from '../config/config';
import { Droplet, Star } from "lucide-react";


const Gallery = () => {
  const [carouselData, setCarouselData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCarouselData = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/hero-carousel/active`);
      if (!response.ok) throw new Error('Failed to fetch carousel data');
      const data = await response.json();
      const filteredData = data.filter(item => ( item.isMobile === true));
      setCarouselData(filteredData);
    } catch (err) {
      console.error('Error fetching carousel data:', err);
      setError('Failed to load gallery content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarouselData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-100">
        <div className="w-12 h-12 border-4 border-blue-200 border-l-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !carouselData.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-100">
        <p className="text-red-500 text-lg">{error || 'No gallery items available'}</p>
      </div>
    );
  }

  return (
      <div className="min-h-screen flex items-center justify-center relative font-sans  overflow-hidden">

      {/* Animated bubbles for water theme */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -500, 0], x: [0, 50, -50, 0] }}
          transition={{ repeat: Infinity, duration: 6 + i, ease: "easeInOut" }}
          className="absolute w-6 h-6 rounded-full bg-blue-300 opacity-70"
          style={{ left: `${10 + i * 10}%`, bottom: `${-50 - i * 20}px` }}
        />
      ))}
    <section className="relative  min-h-screen overflow-hidden py-16 md:py-20">
     
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-600 mb-4">
         <span className="text-white italic font-serif">   Explore Our  Gallery</span> ✨
          </h1>
          <div className="w-28 md:w-32 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-base sm:text-lg md:text-xl text-white max-w-3xl mx-auto leading-relaxed">
            Discover our gallery images.
          </p>
        </motion.div>
    
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-auto">
        {carouselData.map((item, idx) => (
          <motion.div
            key={idx}
            className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer"
            whileHover={{ scale: 1.05, rotate: 1 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
          >
            <img
              src={item.image} // <--- FIXED field name
              alt={item.title || 'Gallery Image'}
              className="w-full h-auto object-cover rounded-xl"
              onError={(e) => { e.target.src = '/fallback.png'; }}
            />
            {item.title && (
              <motion.div
                className="absolute bottom-2 left-2 bg-blue-500/60 text-white px-2 py-1 rounded text-sm backdrop-blur-sm"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                {item.title}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
      </section>
    </div>
  );
};

export default Gallery;
