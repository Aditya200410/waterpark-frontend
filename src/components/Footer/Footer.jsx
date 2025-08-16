import { Link } from "react-router-dom";
import { FaFacebookF, FaWhatsapp, FaInstagram, FaYoutube } from "react-icons/fa";
import { Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

export default function Footer() {
  return (
    <footer className="relative text-white w-full bg-gradient-to-r from-blue-500 to-blue-700 overflow-hidden">
      {/* Decorative SVG waves */}
      <div className="absolute inset-x-0 -top-6">
        <svg className="w-full h-12" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,106.7C672,85,768,75,864,90.7C960,107,1056,149,1152,176C1248,203,1344,213,1392,218.7L1440,224L1440,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex relative z-10 max-w-7xl mx-auto px-6 py-12 justify-between">
        {/* Logo & About */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 max-w-sm"
        >
          <img src="/logo.png" alt="Logo" className="w-32" />
          <p className="text-sm leading-relaxed">
            Dive into fun with Water Park Chalo – your gateway to endless splashes, rides, and memories!
          </p>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-3"
        >
          <h4 className="text-lg font-semibold">Useful Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/gallery" className="hover:underline">Gallery</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-3"
        >
          <h4 className="text-lg font-semibold">Contact</h4>
          <p className="flex items-center gap-2 text-sm"><Phone size={16}/> +91 9876543210</p>
          <p className="flex items-center gap-2 text-sm"><Mail size={16}/> info@waterparkchalo.com</p>
          <p className="flex items-center gap-2 text-sm"><MapPin size={16}/> 110, Lakshmi Apt 1, Alkapuri, Nallasopara 401209</p>
        </motion.div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden relative z-10 px-6 py-10 space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <motion.img
            src="/logo.png"
            alt="Logo"
            className="w-40"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        </div>

        {/* Info + Links side by side */}
        <div className="grid grid-cols-2 gap-6">
          {/* Contact */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-2"
          >
            <h4 className="text-md font-semibold">Contact</h4>
            <p className="text-sm"><Phone size={14} className="inline"/> +91 9876543210</p>
            <p className="text-sm"><Mail size={14} className="inline"/> info@waterparkchalo.com</p>
            <p className="text-sm"><MapPin size={14} className="inline"/> 110, Lakshmi Apt 1, Alkapuri, Nallasopara 401209</p>
          </motion.div>

          {/* Useful Links */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-2"
          >
            <h4 className="text-md font-semibold">Useful Links</h4>
            <ul className="space-y-1 text-sm">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/gallery" className="hover:underline">Gallery</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </motion.div>
        </div>

        {/* Social Media */}
        <div className="flex justify-center gap-6 pt-4">
          <FaFacebookF className="text-xl hover:text-blue-300 transition" />
          <FaWhatsapp className="text-xl hover:text-green-400 transition" />
          <FaInstagram className="text-xl hover:text-pink-400 transition" />
          <FaYoutube className="text-xl hover:text-red-500 transition" />
        </div>
      </div>
    </footer>
  );
}
