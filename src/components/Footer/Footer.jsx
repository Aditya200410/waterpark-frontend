import { Link } from 'react-router-dom';
import { FaFacebookF, FaWhatsapp, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';

// A reusable link component with the underline animation
const AnimatedLink = ({ to, children, className }) => (
  <Link
    to={to}
    className={`relative group py-1 transition-colors duration-300 ease-in-out hover:text-yellow-300 ${className}`}
  >
    {children}
    {/* Underline effect */}
    <span className="absolute bottom-0 left-1/2 w-full h-[1.5px] bg-yellow-300 transform -translate-x-1/2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-center"></span>
  </Link>
);


export default function Footer() {
  return (
    <footer className="relative text-white overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline // Important for iOS devices
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/footer.webm" // Make sure footer.mp4 is in your /public folder
      >
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better text readability */}
      <div className="absolute top-0 left-0 w-full h-full  z-0"></div>

      {/* Main Content Container - z-10 ensures it's on top of the video and overlay */}
      <div className="container mx-auto px-6 py-12 md:py-16 relative z-10">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-12">

          {/* Column 1: Logo & About */}
          <div className="flex flex-col items-start space-y-4">
            <motion.img
              src="/logo.png"
              alt="Water Park Chalo"
              className="h-36 w-auto rounded-xl drop-shadow-lg bg-white/20 p-2"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            />
            <p className="text-white/80 leading-relaxed text-sm max-w-xs">
              Water Park Chalo is your go-to destination for booking tickets to the best water parks in India. Enjoy a seamless experience with trusted partners and exclusive offers.
            </p>
          </div>

          {/* Column 2: Useful Links */}
          <div>
            <h4 className="text-xl font-semibold mb-5 tracking-wide">Useful Links</h4>
            <ul className="space-y-2 text-white/90">
                <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full mr-3"></span>
                    <AnimatedLink to="/about">About Us</AnimatedLink>
                </li>
                <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full mr-3"></span>
                    <AnimatedLink to="/contact">Contact Us</AnimatedLink>
                </li>
                <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full mr-3"></span>
                    <AnimatedLink to="/policies">Terms and condition</AnimatedLink>
                </li>
                <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full mr-3"></span>
                    <AnimatedLink to="/gallery">Gallery</AnimatedLink>
                </li>
                <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full mr-3"></span>
                    <AnimatedLink to="/blog">Blog</AnimatedLink>
                </li>
                <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full mr-3"></span>
                    <AnimatedLink to="/tickets">Tickets</AnimatedLink>
                </li>
                <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full mr-3"></span>
                    <AnimatedLink to="/offers">Offers</AnimatedLink>
                </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-xl font-semibold mb-5 tracking-wide">Contact & Location</h4>
            <ul className="space-y-3 text-white/90">
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                <a href="tel:+918847714464" className="hover:text-yellow-300 transition-colors">+91 88477 14464</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                <a href="mailto:wpc@waterparkchalo.com" className="hover:text-yellow-300 transition-colors">wpc@waterparkchalo.com</a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-yellow-300 mt-1 flex-shrink-0" />
                <span>110, Lakshmi Apt 1, Alkapuri, Nallasopara</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex flex-col space-y-10 md:hidden">
          <div className="flex flex-col items-center space-y-4 text-center">
            <motion.img
              src="/logo.png"
              alt="Water Park Chalo"
              className="h-32 w-auto rounded-xl drop-shadow-lg bg-white/20 p-2"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            />
            <p className="text-white/80 text-sm max-w-sm">
              Water Park Chalo is your go-to destination for booking tickets to the best water parks in India.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="text-2xl font-semibold mb-4">Links</h4>
              <ul className="space-y-2 text-lg">
                <li><AnimatedLink to="/about">About Us</AnimatedLink></li>
                <li><AnimatedLink to="/contact">Contact Us</AnimatedLink></li>
                <li><AnimatedLink to="/policies">Terms and condition</AnimatedLink></li>
                <li><AnimatedLink to="/gallery">Gallery</AnimatedLink></li>
                <li><AnimatedLink to="/blog">Blog</AnimatedLink></li>
                <li><AnimatedLink to="/tickets">Tickets</AnimatedLink></li>
                <li><AnimatedLink to="/offers">Offers</AnimatedLink></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <a href="tel:+918847714464" className="hover:text-yellow-300">+91 88477 14464</a>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <a href="mailto:wpc@waterparkchalo.com" className="hover:text-yellow-300">Email Us</a>
                </li>
                <li className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>110, Lakshmi Apt 1, Alkapuri, Nallasopara</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Socials */}
        <div className="border-t border-white/20 mt-10 pt-6 text-center">
          <div className="flex justify-center space-x-4 mb-4">
            <a href="https://www.facebook.com/people/Waterpark-chalo/61568891087635" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 rounded-full hover:bg-blue-600 hover:scale-110 transition-all duration-300"><FaFacebookF /></a>
            <a href="https://wa.me/9146869202" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 rounded-full hover:bg-green-500 hover:scale-110 transition-all duration-300"><FaWhatsapp /></a>
            <a href="https://www.instagram.com/waterpark_chalo/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 rounded-full hover:bg-pink-500 hover:scale-110 transition-all duration-300"><FaInstagram /></a>
            <a href="https://www.youtube.com/@Waterparkchalo" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 rounded-full hover:bg-red-500 hover:scale-110 transition-all duration-300"><FaYoutube /></a>
          </div>
          <p className="text-white/70 text-sm">
            © {new Date().getFullYear()} All Rights Reserved by Water Park Chalo.
          </p>
          <p className="text-blue-900 text-sm mt-1">
            Made by{" "}
            <a href="https://www.appzeto.com/" target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:text-white font-semibold transition-colors">
              Appzeto
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}