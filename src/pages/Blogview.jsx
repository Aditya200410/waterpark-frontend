import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, AlertTriangle, Loader2 } from "lucide-react";
import config from "../config/config";
import { motion } from "framer-motion";
import AnimatedBubbles from "../components/AnimatedBubbles/AnimatedBubbles";

// --- Framer Motion Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 10 },
  },
};

// --- Main Component ---
const BlogView = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const endpoint = `${config.API_URLS.BLOG}/${id}`;
        const response = await fetch(endpoint);

        if (!response.ok) throw new Error("Whoops! We couldn't find that blog post.");

        const data = await response.json();
        const foundProduct =
          data.product ||
          (Array.isArray(data.products) ? data.products[0] : null) ||
          (data._id ? data : null);

        if (!foundProduct) throw new Error("Blog post data seems to be missing.");

        setProduct({
          ...foundProduct,
          id: foundProduct._id || foundProduct.id,
          images: foundProduct.images || [foundProduct.image],
          // Use 'name' as a fallback for 'title'
          title: foundProduct.title || foundProduct.name, 
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // --- Loading State ---
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-sky-200">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
      </div>
    );

  // --- Error State ---
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50 p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-red-200">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-700 mb-2">An Error Occurred</h2>
            <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  
  // --- Main Content ---
  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200 overflow-hidden relative">
      <AnimatedBubbles />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        {/* Header Section */}
        <header className="py-24 md:py-32 text-center relative">
            <motion.h1 variants={itemVariants} className="text-2xl sm:text-2xl md:text-3xl font-extrabold text-slate-800 drop-shadow-md mb-4 px-4">
                {product.title}
            </motion.h1>
            <motion.div variants={itemVariants} className="flex justify-center items-center gap-3 text-slate-500 font-medium">
                <CalendarDays className="w-5 h-5 text-blue-500" />
                <span>Published on {new Date(product.createdAt || Date.now()).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </motion.div>
        </header>

        {/* Main Content Article */}
        <motion.article 
            variants={itemVariants} 
            className="max-w-4xl mx-auto px-4 sm:px-8 py-10 bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl -mt-16 relative z-10"
        >
          {/* Enhanced Typography for Description */}
          <div className="prose prose-lg lg:prose-xl max-w-none text-slate-700 leading-relaxed">
            <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-blue-600 first-letter:mr-3 first-letter:float-left">
              {product.description}
            </p>
          </div>

          {/* Dynamic Image Grid */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 border-l-4 border-blue-500 pl-4">
              Related Images
            </h3>
            <motion.div 
                variants={containerVariants}
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {product.images?.slice(0, 5).map((img, idx) => (
                <motion.div
                  key={idx}
                  variants={imageVariants}
                  whileHover={{ scale: 1.05, y: -5, transition: { type: "spring", stiffness: 300 } }}
                  // Dynamic grid spanning for a more interesting layout
                  className={`relative overflow-hidden rounded-2xl shadow-lg border-2 border-white
                    ${idx === 0 ? 'col-span-2 md:col-span-3 h-80' : ''}
                    ${idx > 0 ? 'h-52' : ''}
                  `}
                >
                  <img
                    src={img}
                    alt={`Blog view ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/10"></div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.article>
      </motion.div>
      <div className="h-32"></div> {/* Spacer for bottom */}
    </div>
  );
};

export default BlogView;