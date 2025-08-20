import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplet, Star } from "lucide-react";
import config from "../../config/config.js";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  hover: { scale: 1.06, y: -5, transition: { type: "spring", stiffness: 320 } },
};

export default function MissionVission() {
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
        const featuredBlogs = allBlogs.filter((blog) => blog.isMostLoved === true);
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
    <section className="relative min-h-screen overflow-hidden">
        {/* Animated bubbles for water theme */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -500, 0], x: [0, 50, -50, 0] }}
          transition={{ repeat: Infinity, duration: 6 + i, ease: "easeInOut" }}
          className="absolute w-6 h-6 rounded-full bg-blue-300 "
          style={{ left: `${10 + i * 10}%`, bottom: `${-50 - i * 20}px` }}
        />
      ))}

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">
            why <span className="text-blue-900 italic font-serif">us</span> ✨
          </h1>
          <div className="w-28 md:w-32 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-base sm:text-lg md:text-xl text-blue-700 max-w-3xl mx-auto leading-relaxed">
            we offer a unique blend of adventure, relaxation, and unforgettable experiences. Our mission is to create a waterpark that caters to all ages, ensuring everyone has a splashing good time.
          </p>
        </motion.div>

        {loading && <p className="text-center text-blue-600 text-lg">Loading Offers...</p>}
        {error && <p className="text-center text-red-500 text-lg">{error}</p>}

        {/* Blogs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              
              
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
