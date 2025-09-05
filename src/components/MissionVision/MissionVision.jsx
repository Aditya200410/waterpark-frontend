import { useState, useEffect } from "react";
import { motion } from "framer-motion";
// You might need an icon for the header, for example:
import { Waves } from "lucide-react"; 
import config from "../../config/config.js";
import AnimatedBubbles from "../AnimatedBubbles/AnimatedBubbles";

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" } 
  },
  hover: { 
    scale: 1.08, 
    y: -8, 
    transition: { type: "spring", stiffness: 300, damping: 15 } 
  },
};



export default function MissionVission() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ... your data fetching logic remains the same
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(config.API_URLS.BLOG);
        if (!res.ok) throw new Error("Failed to fetch features");
        const data = await res.json();
        const allBlogs = Array.isArray(data) ? data : data.products || [];
        const featuredBlogs = allBlogs.filter((blog) => blog.isMostLoved === true);
        setBlogs(featuredBlogs);
      } catch (err) {
        setError(err.message || "Error fetching features");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section className="relative  py-16 md:py-24 overflow-hidden mb-10">
      <AnimatedBubbles />

      <div className="container relative mx-auto px-4">
        {/* Thematic Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="items-center gap-3 mb-4">
             <h2 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-3 md:mb-4">
              <span className="font-serif italic">Why us</span>
            </h2>
           
            <div className="w-16 md:w-20 h-0.5 bg-[#0077B6] mx-auto"></div>
          </div>
           {/* Fun wave divider */}
          <div className="mx-auto w-48 mt-2">
          
          </div>
        </motion.div>

        {loading && <p className="text-center text-sky-600 text-lg">Loading Attractions...</p>}
        {error && <p className="text-center text-red-500 text-lg">{error}</p>}

        {/* Themed Feature Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, amount: 0.3 }}
              className="flex flex-col items-center justify-start rounded-3xl p-4 md:p-6 text-center 
                          backdrop-blur-md
                         shadow-lg shadow-cyan-500/10 transition-shadow duration-300 hover:shadow-xl hover:shadow-cyan-500/20"
            >
              {/* Image container styled like a lifebuoy */}
              <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center mb-4  rounded-full p-2 ring-4 ">
                <img
                  src={blog.images?.[0] || "https://via.placeholder.com/150"}
                  alt={blog.name}
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>

              {/* Text */}
              <h2 className="text-sm md:text-base font-semibold text-sky-800 tracking-wide">
                {blog.name}
              </h2>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}