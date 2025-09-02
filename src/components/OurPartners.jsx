import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplet, Star } from "lucide-react";
import config from "../config/config.js";



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
     <section className="h-full m-10">
      {/* Add overflow-hidden here */}
      <div className="container mx-auto overflow-hidden"> 
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-3 md:mb-4">
            <span className="font-serif italic">Explore Our Partners</span>
          </h2>
          <div className="w-16 md:w-20 h-0.5 bg-[#0077B6] mx-auto"></div>
        </motion.div>

        {/* I've removed the redundant `overflow-hidden` from this line */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex gap-6 overflow-x-auto pb-6 -mx-2 px-2 scrollbar-hide"
        >
          {blogs.map((partner) => (
            <motion.div
              key={partner._id}
              whileHover={{ scale: 1.08, rotate: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="min-w-[220px] md:min-w-[280px] lg:min-w-[320px] rounded-2xl shadow-md hover:shadow-2xl 
                         transition-all duration-300 ease-in-out flex flex-col items-center justify-center p-6"
            >
              {/* Bigger Image */}
              <div className="w-36 h-36 md:w-44 md:h-44 flex items-center justify-center mb-5 overflow-hidden rounded-xl">
                <img
                  src={partner.image || partner.images?.[0] || "https://via.placeholder.com/150"}
                  alt={partner.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Text */}
              <h2 className="text-base md:text-lg font-semibold text-blue-800 tracking-wide text-center">
                {partner.name}
              </h2>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

  );
}