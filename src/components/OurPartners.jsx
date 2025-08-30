import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplet, Star } from "lucide-react";
import config from "../config/config.js";

// Parent container variants for staggering children animations
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  hover: { scale: 1.06, y: -5, transition: { type: "spring", stiffness: 320 } },
};
// Child item variants
const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export default function OurPartners() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(config.API_URLS.BLOG);
        if (!res.ok) throw new Error("Failed to fetch partners");

        const data = await res.json();
        const allPartners = Array.isArray(data) ? data : data.products || [];
        const featuredPartners = allPartners.filter((blog) => blog.isPatner === true);
        setBlogs(featuredPartners);
      } catch (err) {
        setError(err.message || "Error fetching partners");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section className="py-10 md:py-14 lg:py-20 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">
            <span className="text-blue-900 italic font-serif">Explore Our Partners</span> ✨
          </h1>
          <div className="w-28 md:w-32 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-6 rounded-full"></div>
         
        </motion.div>

        {/* Carousel for mobile */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="sm:hidden flex gap-4 overflow-x-auto pb-4 px-2 -mx-2 scrollbar-hide overflow-y-hidden"
        >
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center rounded-2xl p-6 text-center 
                       
                        "
            >
              {/* Bigger Image */}
              <div className="w-32 h-32 flex items-center justify-center mb-4">
                <img
                  src={blog.images?.[0] || "https://via.placeholder.com/150"}
                  alt={blog.name}
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>
        
              {/* Smaller Text */}
              <h2 className="text-sm md:text-base font-medium text-blue-800 tracking-wide">
                {blog.name}
              </h2>
            </motion.div>
          ))}
        </motion.div>

        {/* Grid for tablets and desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8"
        >
          {blogs.map((partner) => (
            <motion.div
              key={partner.name}
              variants={itemVariants}
              className="group h-48 md:h-52 rounded-2xl p-5   align-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col items-center justify-center "
            >
              <div className="flex-grow flex items-center justify-center overflow-hidden w-full"> {/* Added overflow-hidden and w-full */}
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="max-h-16 md:max-h-20 rounded-2xl object-contain transition-transform duration-300 group-hover:scale-125" // Smaller initial max-h and added group-hover:scale-125
                />
              </div>
             <h2 className="text-sm md:text-base font-medium text-blue-800 tracking-wide">
        {partner.name}
      </h2>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}