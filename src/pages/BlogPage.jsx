import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react"; // Assuming you use lucide-react for icons

import { Droplet } from "lucide-react";
import config from "../config/config.js";
import AnimatedBubbles from "../components/AnimatedBubbles/AnimatedBubbles";

// Framer Motion variants for stagger animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
    hover: {
      y: -10,
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
  };

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(config.API_URLS.BLOG);
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();

        // Ensure we have an array
        const allBlogs = Array.isArray(data)
          ? data
          : data.products || [];

        // Filter only best sellers
        const bestSellers = allBlogs.filter(
          (blog) => blog.isBestSeller === true
        );

        setBlogs(bestSellers);
      } catch (err) {
        setError(err.message || "Error fetching blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
      // The main container with a slightly more dynamic gradient
    <div className="min-h-screen flex items-center justify-center relative font-sans  overflow-hidden">
      <AnimatedBubbles />
    
 
      <section className="relative  w-full min-h-screen overflow-y-auto py-20 md:py-24">
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header with improved animation */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ staggerChildren: 0.2 }}
            className="text-center mb-16 md:mb-20"
          >
            <motion.h1
              variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold  text-blue-600 mb-4"
            
            >
             <span className="text-white italic font-serif">  Explore Our Insights</span> ✨
            </motion.h1>
            {/* Animated underline */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "8rem" }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="h-1 bg-sky-200 mx-auto mb-6 rounded-full"
            ></motion.div>
            <motion.p
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
            >
              Discover our top-performing and most-loved blog posts.
            </motion.p>
          </motion.div>

          {loading && <p className="text-center text-white text-lg">Loading blogs...</p>}
          {error && <p className="text-center text-red-300 bg-red-900/50 p-4 rounded-lg">{error}</p>}

          {/* Blogs Grid with stagger animation */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          >
            {blogs.map((blog) => (
              <motion.div
                key={blog._id}
                variants={cardVariants}
                whileHover="hover"
                className="group relative bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20"
              >
                {/* Single, more impactful image with hover effect */}
                <div className="overflow-hidden">
                  <motion.img
                    src={blog.images?.[0] || "https://via.placeholder.com/400x225"}
                    alt={blog.name}
                    className="w-full h-48 object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                </div>

                {/* Content with better padding and structure */}
                <div className="p-6 bg-white">
                  {/* Category/Tag */}
                  <p className="text-sm font-medium text-blue-600 mb-2">{blog.category || 'General'}</p>
                  
                  <h2 className="text-xl font-bold text-gray-800 mb-3 truncate">{blog.name}</h2>
                  
                  <p className="text-gray-600 text-sm mb-4 h-20 overflow-hidden">
                    {blog.description?.slice(0, 120) || "No description available."}...
                  </p>

                  {/* Enhanced "Read More" link */}
                  <a
                    href={`/blog/${blog._id}`}
                    className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-800 transition-colors duration-300"
                  >
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};