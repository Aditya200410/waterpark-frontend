import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplet, Star } from "lucide-react";
import config from "../config/config.js";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  hover: { scale: 1.06, y: -5, transition: { type: "spring", stiffness: 320 } },
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
        const featuredBlogs = allBlogs.filter((blog) => blog.isFeatured === true);
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

       <div className="min-h-screen flex items-center justify-center relative font-sans bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600 overflow-hidden">

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
    <section className="relative min-h-screen overflow-hidden py-20">
  

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-700 mb-4 tracking-tight">
            Featured <span className="text-blue-400 italic font-serif">Offers</span> ✨
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-6 rounded-full shadow-sm"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-600 max-w-3xl mx-auto leading-relaxed">
            Hand-picked featured articles you shouldn’t miss. Dive in for inspiration, tips, and exciting stories!
          </p>
        </motion.div>

        {loading && <p className="text-center text-blue-600 text-lg">Loading Offers...</p>}
        {error && <p className="text-center text-red-500 text-lg">{error}</p>}

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-blue-100 transition-transform duration-500 bg-white/90 flex flex-col"
            >
              {/* Image Section */}
              <div className="relative h-56 md:h-64 w-full overflow-hidden rounded-t-3xl">
                <img
                  src={blog.images?.[0] || "https://via.placeholder.com/300"}
                  alt={blog.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <motion.div
                  className="absolute top-4 right-4 opacity-70"
                  animate={{ rotate: [0, 15, -15, 0], y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  <Star size={28} color="#3B82F6" />
                </motion.div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-3">{blog.name}</h2>
                <p className="text-blue-600 text-sm md:text-base mb-5 flex-grow leading-relaxed">
                  {blog.description?.slice(0, 120) || "No description available."}...
                </p>
                <a
                  href={`/blog/${blog._id}`}
                  className="inline-block bg-blue-500 text-white font-semibold px-5 py-2 rounded-xl hover:bg-blue-600 shadow-md transition-all duration-300 text-center"
                >
                  Read More
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    </div>
  );
}
