import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// Static category images mapping
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
      sortOrder: category.sortOrder || 0
    }));
    
    processedCategories.sort((a, b) => a.sortOrder - b.sortOrder);
    
    // ✅ Only take first 4 categories
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
    // ✅ Only take first 4 fallback categories
    setCategories(fallbackCategories.slice(0, 4));
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 md:py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B6]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 md:py-16">
        <div className="text-red-500 text-lg font-medium">{error}</div>
      </div>
    );
  }

  return (
    <section className="py-6 md:py-10 lg:py-12">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-8 lg:mb-10"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-3 md:mb-4">
              <span className="font-serif italic">Location Available</span>
            </h2>
           
            <div className="w-16 md:w-20 h-0.5 bg-[#0077B6] mx-auto"></div>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8 max-w-6xl mx-auto"
        >
          {categories.map((category, index) => (
            <Link
              key={category.id || index}
              to="/shop"
              state={{ selectedCategory: { main: category.name } }}
              className="group"
            >
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -4 }}
                className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-b from-[#E6F9FF] to-[#B3ECFF] border border-[#B3ECFF] transition-all duration-500"
              >
                {/* Media */}
                <div className="relative h-40 w-full overflow-hidden">
                  {category.isVideo ? (
                    <video
                      src={config.fixImageUrl(category.image)}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={config.fixImageUrl(category.image)}
                      alt={category.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/400x400/e2e8f0/475569?text=' + encodeURIComponent(category.name);
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-[#023E8A] mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-[#0077B6] font-medium mb-3">
                    Starting from ₹799
                  </p>
                  <span className="inline-block w-full py-2 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white font-medium text-sm shadow-md hover:shadow-xl transition">
                    Explore
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-6 md:mt-8 lg:mt-10"
        >
          <div className="max-w-md mx-auto">
         
            <Link
              to="/category"
              className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-[#0077B6] text-white font-medium rounded-lg hover:bg-[#005f8a] transition-all duration-300 group shadow-lg hover:shadow-xl"
            >
              View All Location
              <svg 
                className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
