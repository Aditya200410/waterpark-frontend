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
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Auto-scroll functionality with infinite loop
  useEffect(() => {
    if (blogs.length === 0 || !scrollRef.current) return;
    
    const interval = setInterval(() => {
      const container = scrollRef.current;
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

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const scrollAmount = clientWidth * 0.8;
    
    if (direction === "left") {
      if (scrollLeft <= 10) {
        // If at the start, scroll to end
        scrollRef.current.scrollTo({ left: maxScroll, behavior: "smooth" });
      } else {
        scrollRef.current.scrollTo({ left: scrollLeft - scrollAmount, behavior: "smooth" });
      }
    } else {
      if (scrollLeft >= maxScroll - 10) {
        // If at the end, scroll to start
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: "smooth" });
      }
    }
  };

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

        {/* Premium Partners Grid - Scrollable */}
        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {blogs.map((partner, index) => (
              <motion.div
                key={partner._id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="group relative flex-shrink-0 w-[calc(50%-0.5rem)] md:w-[calc(25%-0.75rem)] min-w-[280px]"
                style={{ 
                  scrollSnapAlign: 'start'
                }}
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
                  <h3 className="font-light italic text-lg text-blue-800">
                    {partner.name}
                  </h3>
                  
                
                </div>

              </div>
            </motion.div>
          ))}
          </div>
          
          {/* Navigation Arrows */}
          <div className="hidden md:flex absolute inset-y-0 left-0 items-center">
            <button
              onClick={() => scroll("left")}
              className="bg-white/90 shadow-lg rounded-full p-2 hover:bg-white transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          <div className="hidden md:flex absolute inset-y-0 right-0 items-center">
            <button
              onClick={() => scroll("right")}
              className="bg-white/90 shadow-lg rounded-full p-2 hover:bg-white transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

     
      </div>
    </section>
  );
}
