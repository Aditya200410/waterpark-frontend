import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Droplet } from 'lucide-react'; // Added an icon for the theme
import config from '../../config/config.js';
import { categories as staticCategories } from '../../data/categories.js';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

// --- UPDATED: More relevant water park images ---
const categoryImages = {
  "water park mumbai": "/images/waterparks/mumbai-park.jpg",
  "water park pune": "/images/waterparks/pune-park.jpg",
  "water park banglore": "/images/waterparks/banglore-park.jpg",
  "water park delhi": "/images/waterparks/delhi-park.jpg",
};

// --- NEW: Component for animated background bubbles ---
const AnimatedBubbles = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    {[...Array(15)].map((_, i) => {
      const size = Math.random() * 20 + 5; // Random size between 5px and 25px
      const duration = Math.random() * 10 + 8; // Random duration between 8s and 18s
      const delay = Math.random() * 5; // Random delay
      return (
        <motion.div
          key={i}
          className="absolute rounded-full bg-cyan-400/20 border border-cyan-300/30"
          initial={{ y: '110vh', x: `${Math.random() * 100}vw`, opacity: 0 }}
          animate={{ y: '-10vh', opacity: [0, 1, 1, 0] }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
          }}
          style={{
            width: size,
            height: size,
          }}
        />
      );
    })}
  </div>
);

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(config.API_URLS.CATEGORIES);
      const apiCategories = response.data.categories || [];
      
      const processedCategories = apiCategories.map(category => ({
        id: category._id || category.id,
        name: category.name,
        description: category.description,
        image: category.video || category.image || categoryImages[category.name.toLowerCase()] || '/images/waterparks/default.jpg',
        isVideo: !!category.video,
        sortOrder: category.sortOrder || 0
      }));
      
      processedCategories.sort((a, b) => a.sortOrder - b.sortOrder);
      
      setCategories(processedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Could not load destinations. Please try again later.');
      // Keep fallback for robustness
      const fallbackCategories = staticCategories.map(category => ({
        id: category.name.toLowerCase().replace(/\s+/g, '-'),
        name: category.name,
        image: categoryImages[category.name.toLowerCase()] || '/images/waterparks/default.jpg',
        isVideo: false
      }));
      setCategories(fallbackCategories);
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <section className="relative py-12 md:py-20  overflow-hidden">
      <AnimatedBubbles />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-3 md:mb-4">
              <span className="font-serif italic">Location Available</span>
            </h2>
         
        </motion.div>

        {/* Categories Grid - UPDATED for responsiveness */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                to="/shop"
                state={{ selectedCategory: { main: category.name } }}
                className="group block"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-cyan-500/30 group-hover:shadow-2xl bg-white/40 backdrop-blur-md border border-white/30">
                  {/* Media container with aspect ratio */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    {category.isVideo ? (
                      <video
                        src={config.fixImageUrl(category.image)}
                        className="w-full h-full object-cover"
                        autoPlay muted loop playsInline
                      />
                    ) : (
                      <img
                        src={config.fixImageUrl(category.image)}
                        alt={category.name}
                        className="w-full h-full object-cover"
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/400x300/00b4d8/ffffff?text=' + encodeURIComponent(category.name);
                        }}
                      />
                    )}
                   
                  </div>

                  {/* Content */}
                  <div className="p-4 text-center">
                    <h3 className="text-lg md:text-xl font-bold text-blue-900">
                      {category.name}
                    </h3>
                    <p className="text-sm text-cyan-700 font-medium mt-1">
                      Starting from ₹799
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {error && (
            <div className="text-center mt-12">
                <p className="text-red-500 text-lg font-medium bg-red-100/50 rounded-lg p-4 inline-block">{error}</p>
            </div>
        )}
      </div>
       {/* --- NEW: SVG Wave Divider --- */}
     
    </section>
  );
};

export default Category;