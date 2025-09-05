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
  CheckCircle
} from "lucide-react"; 
import config from "../../config/config.js";
import AnimatedBubbles from "../AnimatedBubbles/AnimatedBubbles";



export default function MissionVission() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <AnimatedBubbles />
      
      {/* Water wave background effect */}
      <div className="absolute inset-0 "></div>
      
      {/* Floating water droplets */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full opacity-40 ${
              i % 3 === 0 ? 'w-3 h-3 bg-blue-300' : 
              i % 3 === 1 ? 'w-2 h-2 bg-blue-300' : 
              'w-1 h-1 bg-indigo-300'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 10 - 5, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
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
              <span className="font-serif italic">Why Choose us</span>
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

        {/* Premium Feature Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogs.map((blog, index) => {
            const colorScheme = colorSchemes[index % colorSchemes.length];
            return (
              <motion.div
                key={blog._id}
                
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, amount: 0.3 }}
                className="group relative"
              >
                <div className={`relative p-6 md:p-8 rounded-3xl ${colorScheme.bgColor} backdrop-blur-sm border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden`}>
                  {/* Water wave pattern overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 via-blue-200/20 to-blue-200/20"></div>
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-300/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-300/30 to-transparent"></div>
                  </div>
                  
                  {/* Background gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Floating sparkles */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                  </div>

                  {/* Water droplets decoration */}
                  <div className="absolute top-2 left-2 opacity-60">
                    <Droplets className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="absolute bottom-2 right-2 opacity-60">
                    <Droplets className="w-3 h-3 text-blue-400" />
                  </div>

                  {/* Image container styled like a lifebuoy */}
                  <motion.div
                    
                    className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-full overflow-hidden shadow-xl border-4 border-white/30"
                  >
                    <img
                      src={blog.images?.[0] || "https://via.placeholder.com/150"}
                      alt={blog.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                    
                    {/* Ripple effect on hover */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-white/30"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    />
                  </motion.div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <h3 className={`text-lg md:text-xl lg:text-2xl font-bold mb-2 ${colorScheme.textColor} leading-tight`}>
                      {blog.name}
                    </h3>
                  </div>

                  {/* Bottom accent line */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colorScheme.color} rounded-b-3xl`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                  />
                </div>
              </motion.div>
            );
          })}
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
            { number: "4.7★", label: "Average Rating", icon: Star },
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