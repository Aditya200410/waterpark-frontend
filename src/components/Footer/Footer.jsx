import { Link } from 'react-router-dom';
import { FaFacebookF, FaWhatsapp, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';

export default function Footer() {
  return (
    <footer className="relative text-white w-full bg-gradient-to-r from-blue-500 to-blue-700 overflow-hidden py-16 md:py-20">
      {/* Decorative SVG waves */}
      <svg className="absolute top-0 left-0 w-full h-24 text-white/10" preserveAspectRatio="none" viewBox="0 0 1440 320">
        <path fill="currentColor" fillOpacity="0.1" d="M0,96L1440,32L1440,0L0,0Z"></path>
      </svg>

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
        {/* Left Column - Logo */}
        <div className="flex flex-col items-start space-y-6">
          <motion.img
            src="/logo.png"
            alt="Water Park Chalo"
            className="h-40 w-auto rounded-2xl drop-shadow-lg bg-white/10 p-3"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
          <p className="text-gray-200 leading-relaxed text-base md:text-lg max-w-xs">
            Water Park Chalo is your go-to destination for booking tickets to the best water parks in India. Enjoy seamless experience with trusted partners and exclusive offers.
          </p>
          <div className="flex space-x-4 mt-3">
            <a href="https://www.facebook.com/people/Waterpark-chalo/61568891087635" className="p-3 bg-white/20 rounded-full hover:bg-blue-600 transition-all duration-200">
              <FaFacebookF className="text-white" />
            </a>
            <a href="https://wa.me/9146869202" className="p-3 bg-white/20 rounded-full hover:bg-green-500 transition-all duration-200">
              <FaWhatsapp className="text-white" />
            </a>
            <a href="https://www.instagram.com/waterpark_chalo/" className="p-3 bg-white/20 rounded-full hover:bg-pink-500 transition-all duration-200">
              <FaInstagram className="text-white" />
            </a>
            <a href="https://www.youtube.com/@Waterparkchalo" className="p-3 bg-white/20 rounded-full hover:bg-red-500 transition-all duration-200">
              <FaYoutube className="text-white" />
            </a>
          </div>
        </div>

        {/* Center Column - Useful Links */}
        <div className="flex flex-col items-center space-y-5">
          <h4 className="text-xl md:text-2xl font-bold mb-3">Useful Links</h4>
          <ul className="space-y-3 text-gray-200 text-base md:text-lg">
            <li>
              <Link 
                to="/about" 
                className="relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                className="relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link 
                to="/policies" 
                className="relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              >
                Policies
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Column - Contact Info */}
        <div className="flex flex-col items-start space-y-4">
          <h4 className="text-xl md:text-2xl font-bold mb-3">Contact & Location</h4>
          <div className="flex items-center space-x-3 group">
            <Phone className="w-6 h-6 text-white" />
            <a href="tel:+918847714464" className="relative text-gray-200 hover:text-white transition-colors duration-200 font-medium after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
              +91 88477 14464
            </a>
          </div>
          <div className="flex items-center space-x-3 group">
            <Mail className="w-6 h-6 text-white" />
            <a href="mailto:wpc@waterparkchalo.com" className="relative text-gray-200 hover:text-white transition-colors duration-200 font-medium after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
              wpc@waterparkchalo.com
            </a>
          </div>
          <div className="flex items-start space-x-3 group">
            <MapPin className="w-6 h-6 text-white mt-1" />
            <span className="relative text-gray-200 font-medium text-sm md:text-base after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
              110, Lakshmi Apt 1, Alkapuri, Nallasopara 401209
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 mt-10 py-5 text-center text-gray-300 text-sm md:text-base">
        © 2025 All Rights Reserved by Water Park Chalo. Made by <a href="https://www.appzeto.com/" target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:text-blue-300">Appzeto</a>
      </div>
    </footer>
  );
}
