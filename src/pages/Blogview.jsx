import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, Image as ImageIcon, Loader2 } from "lucide-react";
import config from "../config/config";
import { motion } from "framer-motion";
import { Droplet } from "lucide-react";
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

        if (!response.ok) throw new Error("Blog not found");

        const data = await response.json();
        const foundProduct =
          data.product ||
          (Array.isArray(data.products) ? data.products[0] : null) ||
          (data._id ? data : null);

        if (!foundProduct) throw new Error("Blog not found");

        setProduct({
          ...foundProduct,
          id: foundProduct._id || foundProduct.id,
          images: foundProduct.images || [foundProduct.image],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-blue-100">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 font-semibold mt-10 bg-yellow-50 p-6 rounded-xl shadow-md">
        {error}
      </div>
    );

  return (
    <div className=" min-h-screen font-sans">

  
        {/* Animated bubbles for water theme */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -500, 0], x: [0, 50, -50, 0] }}
            transition={{ repeat: Infinity, duration: 6 + i, ease: "easeInOut" }}
            className="absolute w-6 h-6 rounded-full bg-blue-300 opacity-70"
            style={{ left: `${10 + i * 10}%`, bottom: `${-50 - i * 20}px` }}
          />
        ))}
      {/* Wave Header */}
      <div className="relative">
        <svg
          className="absolute top-0 left-0 w-full h-32"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,96L48,122.7C96,149,192,203,288,213.3C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192V0H0Z"
          ></path>
        </svg>
        <div className="pt-20 pb-10 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-800 drop-shadow-lg flex justify-center items-center gap-3">
            <ImageIcon className="text-white bg-blue-500 p-1 rounded-full w-12 h-12" />
            {product.title}
          </h1>
          <div className="flex justify-center items-center gap-2 mt-4 text-blue-700 font-medium">
            <CalendarDays className="w-5 h-5 text-blue-500" />
            <span>
              {new Date(product.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-10 bg-white shadow-2xl rounded-3xl -mt-10 relative z-20">
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-10">
          {product.description}
        </p>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {product.images?.slice(0, 4).map((img, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 border-4 border-blue-200"
            >
              <img
                src={img}
                alt={`Blog Image ${idx + 1}`}
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Wave */}
      <svg
        className="w-full h-32 mt-16"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#60a5fa"
          fillOpacity="1"
          d="M0,160L48,176C96,192,192,224,288,208C384,192,480,128,576,128C672,128,768,192,864,186.7C960,181,1056,107,1152,80C1248,53,1344,75,1392,85.3L1440,96V320H0Z"
        ></path>
      </svg>
    </div>
  );
};

export default BlogView;
