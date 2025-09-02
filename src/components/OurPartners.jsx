import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import config from "../config/config.js";

export default function OurPartners() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(config.API_URLS.BLOG);
        if (!res.ok) throw new Error("Failed to fetch partners");

        const data = await res.json();
        const allPartners = Array.isArray(data) ? data : data.products || [];
        const featuredPartners = allPartners.filter(
          (blog) => blog.isPatner === true
        );
        setBlogs(featuredPartners);
      } catch (err) {
        setError(err.message || "Error fetching partners");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.8;
    scrollRef.current.scrollTo({
      left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="h-full m-10">
      <div className="container mx-auto overflow-hidden relative">
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

        {/* Partners Slider */}
        <motion.div
          ref={scrollRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex gap-6 overflow-x-hidden pb-6 -mx-2 px-2 scrollbar-hide scroll-smooth"
        >
          {blogs.map((partner) => (
            <motion.div
              key={partner._id}
              whileHover={{ scale: 1.08, rotate: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="min-w-[220px] md:min-w-[280px] lg:min-w-[320px] rounded-2xl shadow-md hover:shadow-2xl 
                         transition-all duration-300 ease-in-out flex flex-col items-center justify-center p-6"
            >
              <div className="w-36 h-36 md:w-44 md:h-44 flex items-center justify-center mb-5 overflow-hidden rounded-xl">
                <img
                  src={
                    partner.image ||
                    partner.images?.[0] ||
                    "https://via.placeholder.com/150"
                  }
                  alt={partner.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h2 className="text-base md:text-lg font-semibold text-blue-800 tracking-wide text-center">
                {partner.name}
              </h2>
            </motion.div>
          ))}
        </motion.div>

        {/* Desktop Arrows */}
        <div className="hidden md:flex absolute inset-y-0 left-0 items-center">
          <button
            onClick={() => scroll("left")}
            className="bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <div className="hidden md:flex absolute inset-y-0 right-0 items-center">
          <button
            onClick={() => scroll("right")}
            className="bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
}
