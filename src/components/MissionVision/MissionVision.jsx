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
 <section className="relative h-fit overflow-hidden mb-10">
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

  <div className="container relative z-10 h-fit">
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
        we offer a unique blend of adventure, relaxation, and unforgettable
        experiences. Our mission is to create a waterpark that caters to all
        ages, ensuring everyone has a splashing good time.
      </p>
    </motion.div>

    {loading && (
      <p className="text-center text-blue-600 text-lg">Loading Offers...</p>
    )}
    {error && <p className="text-center text-red-500 text-lg">{error}</p>}

    {/* Feature Cards (like image) */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
  {blogs.map((blog) => (
    <motion.div
      key={blog._id}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center rounded-2xl p-6 text-center 
                 bg-gradient-to-br from-blue-50 to-blue-100 
                 shadow-lg hover:shadow-2xl transition-transform duration-300"
    >
      {/* Bigger Image */}
      <div className="w-32 h-32 flex items-center justify-center mb-4">
        <img
          src={blog.images?.[0] || "https://via.placeholder.com/150"}
          alt={blog.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Smaller Text */}
      <h2 className="text-sm md:text-base font-medium text-blue-800 tracking-wide">
        {blog.name}
      </h2>
    </motion.div>
  ))}
</div>


  </div>
</section>

  );
}
