import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Waves, 
  Shield, 
  Clock, 
  Star, 
  Users, 
  Zap, 
  Heart, 
  Award,
  Droplets,
  Sparkles,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react"; 
import config from "../../config/config.js";
import AnimatedBubbles from "../AnimatedBubbles/AnimatedBubbles";



export default function MissionVission() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Color schemes for different cards
  const colorSchemes = [
    { color: "from-blue-500 to-cyan-600", bgColor: "bg-blue-50", textColor: "text-blue-800" },
    { color: "from-blue-500 to-cyan-600", bgColor: "bg-blue-50", textColor: "text-blue-800" },
    { color: "from-blue-500 to-cyan-600", bgColor: "bg-blue-50", textColor: "text-blue-800" },
    { color: "from-blue-500 to-cyan-600", bgColor: "bg-blue-50", textColor: "text-blue-800" },
    { color: "from-blue-500 to-cyan-600", bgColor: "bg-blue-50", textColor: "text-blue-800" },
    { color: "from-blue-500 to-cyan-600", bgColor: "bg-blue-50", textColor: "text-blue-800" }
  ];

  useEffect(() => {
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

  // Auto-scroll functionality with infinite loop
  useEffect(() => {
    if (blogs.length === 0) return;
    
    const interval = setInterval(() => {
      const container = document.querySelector('.overflow-x-auto');
      if (!container) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScroll = scrollWidth - clientWidth;
      
      if (scrollLeft >= maxScroll - 10) {
        // If at the end, scroll back to start
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Otherwise, scroll to next card
        const cardWidth = container.scrollWidth / blogs.length;
        container.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [blogs.length]);

  return (
    <section className="relative h-full py-16 md:py-24 overflow-hidden">
      <AnimatedBubbles />
      
      <div className="container relative mx-auto px-4">
        {/* Premium Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          {/* FIX: Replaced nested <h2> with a <p> tag for valid HTML */}
          <p className="text-2xl md:text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-3 md:mb-4">
            <span className="font-serif italic">Why Choose us</span>
          </p>
          <div className="w-16 md:w-20 h-0.5 bg-[#0077B6] mx-auto"></div>
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
              <span className="text-lg font-medium">Loading Attractions...</span>
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
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-500 text-sm">!</span>
              </div>
              <span className="text-lg font-medium">{error}</span>
            </div>
          </motion.div>
        )}

        {/* Premium Feature Cards - Scrollable */}
        <div className="relative">
          <div 
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {blogs.map((blog, index) => {
              const colorScheme = colorSchemes[index % colorSchemes.length];
              return (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="group relative flex-shrink-0 w-[calc(50%-0.5rem)] md:w-[calc(25%-0.75rem)] min-w-[280px]"
                  style={{ 
                    scrollSnapAlign: 'start'
                  }}
                >
                  {/* FIX #1: Added 'h-full', 'flex', and 'flex-col' to make cards equal height */}
                  <div className={`h-full flex flex-col relative p-6 md:p-8 rounded-3xl ${colorScheme.bgColor} backdrop-blur-sm border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden`}>
                    {/* Water wave pattern overlay */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 via-blue-200/20 to-blue-200/20"></div>
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-300/30 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-300/30 to-transparent"></div>
                    </div>
                    
                    {/* Background gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>

                    {/* Image container styled like a lifebuoy */}
                    <motion.div
                      className="relative w-32 h-32 md:w-30 md:h-30 mx-auto mb-6 rounded-full overflow-hidden shadow-xl border-4 border-white/30"
                    >
                      <img
                        src={blog.images?.[0] || "https://via.placeholder.com/150"}
                        alt={blog.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </motion.div>

                    {/* Content */}
                    {/* FIX #2: This wrapper now grows to fill space and centers the text */}
                    <div className="relative z-10 text-center flex-grow flex flex-col justify-center">
                      <h3 className={`text-lg md:text-xl lg:text-2xl font-light italic text-blue-800 mb-2 ${colorScheme.textColor} leading-tight`}>
                        {blog.name}
                      </h3>
                    </div>

                    {/* Bottom accent line */}
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colorScheme.color} rounded-b-3xl`}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Navigation Arrows */}
          <div className="hidden md:flex absolute inset-y-0 left-0 items-center">
            <button
              onClick={() => {
                const container = document.querySelector('.overflow-x-auto');
                if (!container) return;
                const { scrollLeft, scrollWidth, clientWidth } = container;
                const maxScroll = scrollWidth - clientWidth;
                const scrollAmount = 300;
                if (scrollLeft <= 10) {
                  container.scrollTo({ left: maxScroll, behavior: 'smooth' });
                } else {
                  container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                }
              }}
              className="bg-white/90 shadow-lg rounded-full p-2 hover:bg-white transition-colors z-10 -ml-4"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          <div className="hidden md:flex absolute inset-y-0 right-0 items-center">
            <button
              onClick={() => {
                const container = document.querySelector('.overflow-x-auto');
                if (!container) return;
                const { scrollLeft, scrollWidth, clientWidth } = container;
                const maxScroll = scrollWidth - clientWidth;
                const scrollAmount = 300;
                if (scrollLeft >= maxScroll - 10) {
                  container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                  container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
              }}
              className="bg-white/90 shadow-lg rounded-full p-2 hover:bg-white transition-colors z-10 -mr-4"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: "10K+", label: "Happy Visitors", icon: Users },
            { number: "99.9%", label: "Safety Record", icon: Shield },
            { number: "4.7★", label: "Our Partner", icon: Star },
            { number: "24/7", label: "Customer Support", icon: Award }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}