import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Waves, 
  Sparkles, 
  Droplets,
  Award,
  Star,
  Users
} from "lucide-react";
import config from "../config/config.js";
import AnimatedBubbles from "./AnimatedBubbles/AnimatedBubbles";

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
    <section className="relative py-20 md:py-32 overflow-hidden">
      <AnimatedBubbles />
      
      {/* Water wave background effect */}
      <div className="absolute inset-0 "></div>
      
      {/* Floating water droplets */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full opacity-30 ${
              i % 3 === 0 ? 'w-3 h-3 bg-blue-300' : 
              i % 3 === 1 ? 'w-2 h-2 bg-blue-300' : 
              'w-1 h-1 bg-indigo-300'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, Math.random() * 8 - 4, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container relative mx-auto px-4">
        {/* Premium Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
        
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-3 md:mb-4">
              <span className="font-serif italic">Our Trusted  Partners</span>
            </h2>
            <div className="w-16 md:w-20 h-0.5 bg-[#0077B6] mx-auto"></div>
           
          </h2>
          
        

        
        </motion.div>

        {/* Loading and Error States */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center space-x-3 text-blue-600">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg font-medium">Loading Partners...</span>
            </div>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center space-x-3 text-red-500">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-red-500 text-sm">!</span>
              </div>
              <span className="text-lg font-medium">{error}</span>
            </div>
          </motion.div>
        )}

        {/* Premium Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-10">
          {blogs.map((partner, index) => (
            <motion.div
              key={partner._id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                
              }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="group relative"
            >
              <div className="relative justify-center p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                {/* Water wave pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 via-blue-200/20 to-blue-200/20"></div>
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-300/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-300/30 to-transparent"></div>
                </div>
                
                {/* Floating sparkles */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                </div>


                {/* Partner Logo Container */}
                <motion.div
                  
                  whileInView={{ scale: 1, rotate: 0 }}
                  whileHover={{ 
                    scale: 1.1, 
                  
                  }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg border-4 border-white/30 bg-gradient-to-br from-blue-50 to-blue-50"
                >
                  <img
                    src={
                      partner.image ||
                      partner.images?.[0] ||
                      "https://via.placeholder.com/150"
                    }
                    alt={partner.name}
                    className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                  />
                  
                 
                </motion.div>

                {/* Partner Name */}
                <div className="relative z-10 text-center">
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-blue-800 leading-tight">
                    {partner.name}
                  </h3>
                  
                
                </div>

              </div>
            </motion.div>
          ))}
        </div>

     
      </div>
    </section>
  );
}
