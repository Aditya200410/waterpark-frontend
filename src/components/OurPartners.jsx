import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplet, Star } from "lucide-react";
import config from "../config/config.js";

const logoVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
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
        if (!res.ok) throw new Error("Failed to fetch blogs");

        const data = await res.json();
        const allBlogs = Array.isArray(data) ? data : data.products || [];
        const featuredBlogs = allBlogs.filter((blog) => blog.isPatner === true);
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
    <section className="py-10 md:py-14 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
         <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">
            Explore Our <span className="text-blue-900 italic font-serif">Patners</span> ✨
          </h1>
          <div className="w-28 md:w-32 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-base sm:text-lg md:text-xl text-blue-700 max-w-3xl mx-auto leading-relaxed">
            Discover our Patners .
          </p>
        </motion.div>

        {/* Carousel for mobile */}
        <div className="sm:hidden overflow-x-auto">
  <div className="flex gap-4 px-2">
    {blogs.map((partner) => (
      <motion.div
        key={partner.name}
        variants={logoVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="group bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-500 flex-shrink-0 w-40 h-42 flex flex-col items-center justify-between"
      >
        {/* Image */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src={partner.image}
            alt={partner.name}
            className="max-h-16 object-contain"
          />
        </div>

        {/* Text */}
        <div className="mt-3 text-center text-gray-800 font-semibold text-sm group-hover:text-blue-600 transition-colors duration-300">
          {partner.name}
        </div>
      </motion.div>
    ))}
  </div>
</div>


        {/* Grid for tablets and desktop */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-10">
  {blogs.map((partner) => (
    <motion.div
      key={partner.name}
      variants={logoVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="group bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-500 flex flex-col items-center justify-between w-full h-40 sm:h-48 md:h-52"
    >
      {/* Image */}
      <div className="flex-1 flex items-center justify-center">
        <img
          src={partner.image}
          alt={partner.name}
          className="max-h-16 sm:max-h-20 md:max-h-24 object-contain"
        />
      </div>

      {/* Text */}
      <div className="mt-3 text-center text-gray-800 font-semibold text-sm sm:text-base group-hover:text-green-600 transition-colors duration-300">
        {partner.name}
      </div>
    </motion.div>
  ))}
</div>

         
      </div>
    </section>
  );
}
