import { Link } from 'react-router-dom';
import { FaFacebookF, FaWhatsapp, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';

// ✅ Import Google Fonts (use in _app or index.html if needed)
// Example: 
// <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Fredoka:wght@400;600&family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />

export default function Footer() {
  return (
    <footer className="relative text-white w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 overflow-hidden">
      {/* Animated Waves */}
      <svg className="absolute bottom-0 w-full h-20 text-white/20" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
          fill="currentColor"
          d="M0,160L80,149.3C160,139,320,117,480,128C640,139,800,181,960,197.3C1120,213,1280,203,1360,197.3L1440,192V320H0Z"
        ></path>
      </svg>

      {/* Floating bubbles */}
      <motion.div
        className="absolute top-6 left-10 w-4 h-4 bg-white/30 rounded-full"
        animate={{ y: [0, -15, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-14 right-10 w-3 h-3 bg-white/40 rounded-full"
        animate={{ y: [0, -20, 0], opacity: [0.4, 0.9, 0.4] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      />

      {/* Desktop Layout */}
      <div className="container mx-auto px-6 py-12 md:py-14 relative z-10 hidden md:block">
        <div className="grid grid-cols-3 gap-10 items-start">
          {/* Logo + Splash */}
          <div className="relative flex flex-col items-start space-y-4">
            <motion.img
              src="/logo.png"
              alt="Water Park Chalo"
              className="h-24 w-auto rounded-xl drop-shadow-lg bg-white/20 p-2"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />

            {/* Splash SVGs around logo */}
            <svg className="absolute -top-4 -left-6 w-14 h-14 text-white/30 animate-pulse" viewBox="0 0 512 512" fill="currentColor">
              <path d="M128 256c0-53 43-96 96-96s96 43 96 96-43 96-96 96-96-43-96-96z" />
            </svg>
            <svg className="absolute top-2 right-0 w-10 h-10 text-white/40 animate-bounce" viewBox="0 0 512 512" fill="currentColor">
              <path d="M192 128c0 35 29 64 64 64s64-29 64-64-29-64-64-64-64 29-64 64z" />
            </svg>

            <p className="text-gray-100 font-[Inter] leading-relaxed text-sm md:text-base max-w-xs">
              Water Park Chalo is your go-to destination for booking tickets to the best water parks in India. Enjoy seamless experience with trusted partners and exclusive offers.
            </p>
          </div>

          {/* Useful Links */}
          <div className="flex flex-col items-center space-y-3">
            <h4 className="text-2xl font-[Pacifico] mb-3">Useful Links</h4>
            <ul className="flex flex-col space-y-2 text-gray-100 font-[Fredoka] text-base ">
            
            <Link to="/about" className="hover:text-yellow-200">About Us</Link>
            <Link to="/contact" className="hover:text-yellow-200">Contact Us</Link>
            <Link to="/policies" className="hover:text-yellow-200">Policies</Link>
             <Link to="/gallery" className="hover:text-yellow-200">gallery</Link>
              <Link to="/blog" className="hover:text-yellow-200">Blog</Link>
              <Link to="offers" className="hover:text-yellow-200">Offers</Link>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-start space-y-3">
            <h4 className="text-2xl font-[Pacifico] mb-3">Contact & Location</h4>
            <div className="flex items-center space-x-2 font-[Fredoka]">
              <Phone className="w-5 h-5" />
              <a href="tel:+918847714464" className="hover:text-yellow-200">+91 88477 14464</a>
            </div>
            <div className="flex items-center space-x-2 font-[Fredoka]">
              <Mail className="w-5 h-5" />
              <a href="mailto:wpc@waterparkchalo.com" className="hover:text-yellow-200">wpc@waterparkchalo.com</a>
            </div>
            <div className="flex items-start space-x-2 font-[Fredoka]">
              <MapPin className="w-5 h-5 mt-1" />
              <span className="text-sm">110, Lakshmi Apt 1, Alkapuri, Nallasopara 401209</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/30 mt-8 pt-4 text-center">
          <div className="text-gray-200 text-sm md:text-base mb-3 font-[Inter]">
            © 2025 All Rights Reserved by Water Park Chalo. Made by{" "}
            <a href="https://www.appzeto.com/" target="_blank" rel="noopener noreferrer" className="text-yellow-200 hover:text-white font-bold">
              Appzeto
            </a>
          </div>
          <div className="flex justify-center space-x-3">
            <a href="https://www.facebook.com/people/Waterpark-chalo/61568891087635" className="p-2.5 bg-white/20 rounded-full hover:bg-blue-600"><FaFacebookF /></a>
            <a href="https://wa.me/9146869202" className="p-2.5 bg-white/20 rounded-full hover:bg-green-500"><FaWhatsapp /></a>
            <a href="https://www.instagram.com/waterpark_chalo/" className="p-2.5 bg-white/20 rounded-full hover:bg-pink-500"><FaInstagram /></a>
            <a href="https://www.youtube.com/@Waterparkchalo" className="p-2.5 bg-white/20 rounded-full hover:bg-red-500"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="container mx-auto px-6 py-10 relative z-10 flex flex-col space-y-8 md:hidden">
        <div className="flex flex-col items-center space-y-4 text-center">
          <motion.img
            src="/logo.png"
            alt="Water Park Chalo"
            className="h-20 w-auto rounded-xl drop-shadow-lg bg-white/20 p-2"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
          <p className="text-gray-100 font-[Inter] text-sm max-w-sm">
            Water Park Chalo is your go-to destination for booking tickets to the best water parks in India. Enjoy seamless experience with trusted partners and exclusive offers.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2 font-[Fredoka]">
            <h4 className="text-lg font-[Pacifico]">Links</h4>
            <Link to="/about" className="hover:text-yellow-200">About Us</Link>
            <Link to="/contact" className="hover:text-yellow-200">Contact Us</Link>
            <Link to="/policies" className="hover:text-yellow-200">Policies</Link>
             <Link to="/gallery" className="hover:text-yellow-200">gallery</Link>
              <Link to="/blog" className="hover:text-yellow-200">Blog</Link>
              <Link to="offers" className="hover:text-yellow-200">Offers</Link>
          </div>
          <div className="flex flex-col space-y-2 font-[Fredoka]">
            <h4 className="text-lg font-[Pacifico]">Contact</h4>
            <a href="tel:+918847714464" className="hover:text-yellow-200">+91 88477 14464</a>
            <a href="mailto:wpc@waterparkchalo.com" className="hover:text-yellow-200">wpc@waterparkchalo.com</a>
            <span className="text-xs">110, Lakshmi Apt 1,<br />Alkapuri, Nallasopara 401209</span>
          </div>
        </div>

        <div className="border-t border-white/30 pt-3 text-center text-gray-200 text-xs font-[Inter]">
          © 2025 All Rights Reserved by Water Park Chalo. <br />
          Made by <a href="https://www.appzeto.com/" target="_blank" rel="noopener noreferrer" className="text-yellow-200 hover:text-white font-bold">Appzeto</a>
        </div>

        <div className="flex justify-center space-x-3 pb-12">
          <a href="https://www.facebook.com/people/Waterpark-chalo/61568891087635" className="p-2.5 bg-white/20 rounded-full hover:bg-blue-600"><FaFacebookF /></a>
          <a href="https://wa.me/9146869202" className="p-2.5 bg-white/20 rounded-full hover:bg-green-500"><FaWhatsapp /></a>
          <a href="https://www.instagram.com/waterpark_chalo/" className="p-2.5 bg-white/20 rounded-full hover:bg-pink-500"><FaInstagram /></a>
          <a href="https://www.youtube.com/@Waterparkchalo" className="p-2.5 bg-white/20 rounded-full hover:bg-red-500"><FaYoutube /></a>
        </div>
      </div>
    </footer>
  );
}
