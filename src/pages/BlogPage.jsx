import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplet, Star } from "lucide-react";
import config from "../config/config.js";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  hover: { scale: 1.05, y: -5, transition: { type: "spring", stiffness: 300 } },
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
    <section className="relative bg-gradient-to-b from-blue-50 to-white min-h-screen overflow-hidden py-16 md:py-20">
      {/* Floating Bubbles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-6 h-6 md:w-8 md:h-8 text-blue-300"
          style={{
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 90 + 5}%`,
          }}
          animate={{ y: [-10, 10, -10], x: [-5, 5, -5], rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 6 + Math.random() * 4, ease: "easeInOut" }}
        >
          <Droplet size={24} color="#60A5FA" />
        </motion.div>
      ))}

      <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-600 mb-4">
            Explore Our <span className="text-blue-400 italic font-serif">Blogs</span> ✨
          </h1>
          <div className="w-28 md:w-32 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-base sm:text-lg md:text-xl text-blue-700 max-w-3xl mx-auto leading-relaxed">
            Discover our top-performing and most-loved blog posts.
          </p>
        </motion.div>

        {loading && <p className="text-center text-blue-600">Loading blogs...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-white/80 to-blue-50 rounded-3xl p-6 shadow-lg border border-blue-200 overflow-hidden"
            >
              {/* Floating Star Icon */}
              <motion.div
                className="absolute top-3 right-3 opacity-60"
                animate={{ rotate: [0, 15, -15, 0], y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
              >
                <Star size={28} color="#3B82F6" />
              </motion.div>

              {/* Blog Images (Up to 4) */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {blog.images?.slice(0, 4).map((img, idx) => (
                  <img
                    key={idx}
                    src={img || "https://via.placeholder.com/150"}
                    alt={blog.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>

              {/* Blog Content */}
              <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-2">{blog.name}</h2>
              <p className="text-blue-700 text-sm md:text-base mb-3 leading-relaxed">
                {blog.description?.slice(0, 100) || "No description available."}...
              </p>

              {/* Read More Button */}
              <a
                href={`/blog/${blog._id}`}
                className="inline-block bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
              >
                Read More
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
  