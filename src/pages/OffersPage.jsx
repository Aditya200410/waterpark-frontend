import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react"; // Added ArrowRight
import config from "../config/config.js";

// Framer Motion variants from the first example for staggering and card animation
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
        const allBlogs = Array.isArray(data) ? data : data.products || [];
        // Keep the logic to filter for featured blogs
        const featuredBlogs = allBlogs.filter(
          (blog) => blog.isFeatured === true
        );
        setBlogs(featuredBlogs);
      } catch (err) {
        setError(err.message || "Error fetching blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className=" flex items-center justify-center relative font-sans overflow-hidden">
      {/* Animated bubbles from the second example */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -500, 0], x: [0, 50, -50, 0] }}
          transition={{ repeat: Infinity, duration: 6 + i, ease: "easeInOut" }}
          className="absolute w-6 h-6 rounded-full bg-blue-300 opacity-70"
          style={{ left: `${10 + i * 10}%`, bottom: `${-50 - i * 20}px` }}
        />
      ))}
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          {/* Header from the second example */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-700 mb-4 tracking-tight">
              <span className="text-blue-500 italic font-serif">
                Featured Offers
              </span>{" "}
              ✨
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-6 rounded-full shadow-sm"></div>
            <p className="text-lg sm:text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed">
              Hand-picked featured articles you shouldn’t miss. Dive in for
              inspiration, tips, and exciting stories!
            </p>
          </motion.div>

          {loading && (
            <p className="text-center text-blue-600 text-lg">
              Loading Offers...
            </p>
          )}
          {error && <p className="text-center text-red-500 text-lg">{error}</p>}

          {/* Blogs Grid with stagger animation from the first example */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          >
            {blogs.map((blog) => (
              // --- Copied Card Design Starts Here ---
              <motion.div
                key={blog._id}
                variants={cardVariants}
                whileHover="hover"
                className="group relative bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20"
              >
                {/* Image with hover effect */}
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
                  <p className="text-sm font-medium text-blue-600 mb-2">
                    {blog.category || "General"}
                  </p>
                  
                  <h2 className="text-xl font-bold text-gray-800 mb-3 truncate">
                    {blog.name}
                  </h2>
                  
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
              // --- Copied Card Design Ends Here ---
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}