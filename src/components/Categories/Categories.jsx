import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import config from '../../config/config.js';
import { categories as staticCategories } from '../../data/categories.js';

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// Static category images mapping remains unchanged
const categoryImages = {
  "water park mumbai": "/images/categories/wooden-craft.jpg",
  "water park pune": "/images/categories/terracotta.jpg",
  "water park banglore": "/images/categories/dokra-art.jpg",
  "water park delhi": "/images/categories/jewellery.jpg"
};

const Categories = () => {
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
        image: category.video || category.image || categoryImages[category.name] || '/images/categories/default.jpg',
        isVideo: !!category.video,
        locationPosition: category.locationPosition || 0
      }));
      
      processedCategories.sort((a, b) => a.locationPosition - b.locationPosition);
      
      setCategories(processedCategories.slice(0, 4));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      const fallbackCategories = staticCategories.map(category => ({
        id: category.name.toLowerCase().replace(/\s+/g, '-'),
        name: category.name,
        image: categoryImages[category.name] || '/images/categories/default.jpg',
        isVideo: false
      }));
      setCategories(fallbackCategories.slice(0, 4));
      setLoading(false);
    }
  };

  // Loading and Error states remain unchanged
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B6]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-500 text-lg font-medium">{error}</div>
      </div>
    );
  }

  return (
    <section className="py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4">
        
        {/* ✅ REDESIGNED: Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-3 md:mb-4">
              <span className="font-serif italic"> Explore by Location</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-base md:text-lg text-gray-600">
              Find the best water parks and attractions near you.
            </p>
          </div>
        </motion.div>

        {/* ✅ REDESIGNED: Categories Grid with new card style */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto"
        >
          {categories.map((category) => (
            <motion.div variants={itemVariants} key={category.id}>
              <Link
                to="/shop"
                state={{ selectedCategory: { main: category.name } }}
                className="group block" // `block` is important for the link to take up space
              >
                {/* NEW CARD DESIGN:
                  - `relative` container with an aspect ratio to control shape.
                  - Image/video is positioned absolutely to fill the container.
                  - A semi-transparent gradient overlay sits on top for text readability.
                  - Text content is positioned at the bottom.
                */}
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
                        e.target.src = 'https://placehold.co/400x500/e2e8f0/475569?text=' + encodeURIComponent(category.name);
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

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 md:mt-12"
        >
          <Link
            to="/category"
            className="inline-flex items-center px-6 py-3 text-sm font-medium md:text-base bg-[#0077B6] text-white rounded-lg shadow-md hover:bg-[#005f8a] transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0077B6]"
          >
            View All Locations
            <svg 
              className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;