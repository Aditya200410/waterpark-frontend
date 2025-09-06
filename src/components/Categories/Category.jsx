import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import config from '../../config/config.js';
import { categories as staticCategories } from '../../data/categories.js';
import AnimatedBubbles from '../AnimatedBubbles/AnimatedBubbles';

// Framer Motion variants remain unchanged
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

// Static images mapping remains unchanged
const categoryImages = {
  "water park mumbai": "/images/waterparks/mumbai-park.jpg",
  "water park pune": "/images/waterparks/pune-park.jpg",
  "water park banglore": "/images/waterparks/banglore-park.jpg",
  "water park delhi": "/images/waterparks/delhi-park.jpg",
};

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ NO LOGIC CHANGES HERE: Data fetching and processing are identical.
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
    // ✅ DESIGN CHANGE: Changed background color for consistency.
    <section className="relative py-12 md:py-20  overflow-hidden">
      <AnimatedBubbles />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ✅ REDESIGNED: Header Section with new style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-16"
        >
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                    All Our Destinations
                </h2>
                <p className="mt-3 sm:mt-4 text-base md:text-lg text-gray-600">
                    Choose your next adventure from our exciting water park locations.
                </p>
            </div>
        </motion.div>

        {/* ✅ REDESIGNED: Categories Grid with new card style */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          // Grid layout is kept as is for this page (1 col on mobile, then 2, then 4)
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                to="/shop"
                state={{ selectedCategory: { main: category.name } }}
                className="group block"
              >
                {/* NEW CARD DESIGN: Applied here */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl md:rounded-2xl shadow-lg transition-shadow duration-300 hover:shadow-2xl">
                  
                  {/* Background Image/Video */}
                  {category.isVideo ? (
                    <video
                      src={config.fixImageUrl(category.image)}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      autoPlay muted loop playsInline
                    />
                  ) : (
                    <img
                      src={config.fixImageUrl(category.image)}
                      alt={category.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/400x500/00b4d8/ffffff?text=' + encodeURIComponent(category.name);
                      }}
                    />
                  )}

                  {/* Overlay and Content */}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 md:p-5">
                    <h3 className="text-lg font-bold text-white transition-transform duration-300 group-hover:-translate-y-2 sm:text-xl">
                      {category.name}
                    </h3>
                    <div className="mt-1 flex items-center text-sm font-medium text-sky-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span>Explore</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
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
    </section>
  );
};

export default Category;