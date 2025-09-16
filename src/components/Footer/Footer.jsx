import { Link } from 'react-router-dom';
import { FaFacebookF, FaWhatsapp, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Phone, Mail, MapPin, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';
import AnimatedBubbles from '../AnimatedBubbles/AnimatedBubbles';
import OptimizedVideo from '../OptimizedVideo/OptimizedVideo';
import OptimizedImage from '../OptimizedImage/OptimizedImage';

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

// Download App Button Component
const DownloadAppButton = ({ className = "" }) => (
<motion.a
  href="https://api.waterparkchalo.com/app-debug.apk"
  download="waterpark-chalo-app.apk"
  className={`inline-flex items-center  text-white  rounded-lg  ${className}`}
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.98 }}
>
  
  <div className="flex items-center ">
    {/* Google Play Icon (SVG) */}
  <OptimizedImage src="/google.webp" alt="Download App" className='w-fit md:h-[90px] h-[70px]' priority />
    
    
  </div>
</motion.a>
);


export default function Footer() {
  return (
    <footer className="relative text-white overflow-hidden">
      <AnimatedBubbles />
      {/* Background Video - Optimized */}
      <OptimizedVideo
        src="/footer.webm"
        poster="/footer.png"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* Overlay for better text readability */}
      <div className="absolute top-0 left-0 w-full h-full  z-0"></div>

      {/* Main Content Container - z-10 ensures it's on top of the video and overlay */}
      <div className="container mx-auto px-6 py-12 md:py-16 relative z-2">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-12">

          {/* Column 1: Logo & About */}
          <div className="flex flex-col items-start space-y-4">
            <Link to={"/"}>
            <motion.div
              className="h-36 w-auto rounded-xl drop-shadow-lg bg-white/20 p-2"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            >
              <OptimizedImage
                src="/logo.webp"
                alt="Water Park Chalo"
                className="h-full w-auto"
                priority
              />
            </motion.div>
            </Link>
            <p className="text-white/80 leading-relaxed text-sm max-w-xs">
              Water Park Chalo is your go-to destination for booking tickets to the best water parks in India. Enjoy a seamless experience with trusted partners and exclusive offers.
            </p>
           
          </div>

          {/* Column 2: Useful Links */}
          <div>
            <h4 className="text-xl font-semibold mb-3 tracking-wide">Useful Links</h4>
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
    <h4 className="text-lg font-semibold mb-3 tracking-wide">Contact & Location</h4>
    {/* Increased vertical spacing for better readability */}
    <ul className="space-y-2 text-white/90">
        {/* - Using 'items-start' to align the icon with the top of the text.
          - This is better if the text ever wraps to a second line.
        */}
        <li className="flex items-start space-x-3">
            {/* Added 'mt-0.5' to optically align the icon with the center of the first line of text */}
            <Phone className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" />
            <a href="tel:+918847714464" className="hover:text-yellow-300 transition-colors">+91 88477 14464</a>
        </li>

        <li className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0 space-x-3"  />
            {/* - Added 'break-all' to ensure the long email address doesn't 
                overflow its container on small screens.
            */}
            <a href="mailto:wpc@waterparkchalo.com" className="hover:text-yellow-300 transition-colors break-all">  Email us</a>
        </li>

        <li className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" />
            {/* This text will wrap naturally because it has spaces */}
            <span>110, Lakshmi Apt 1, Alkapuri, Nallasopara</span>
        </li>
        <li>
           {/* Download App Button */}
           <div className="mt-4">
              <DownloadAppButton />
            </div>
        </li>
    </ul>
</div>

        </div>

        {/* Mobile Layout */}
        <div className="flex flex-col space-y-10 md:hidden">
         
          <div className="flex flex-col items-center space-y-4 text-center">
          <Link to={"/"}>
            <motion.div
              className="h-32 w-auto rounded-xl drop-shadow-lg bg-white/20 p-2"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            >
              <OptimizedImage
                src="/logo.webp"
                alt="Water Park Chalo"
                className="h-full w-auto"
                priority
              />
            </motion.div>
            </Link>
            <p className="text-white/80 text-sm max-w-sm">
              Water Park Chalo is your go-to destination for booking tickets to the best water parks in India.
            </p>
           
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
           <div>
            <h4 className="text-lg font-semibold mb-3 tracking-wide">Useful Links</h4>
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
            <div>
              <h4 className="text-lg font-semibold mb-3 tracking-wide">Contact & Location</h4>
            <ul className="space-y-3 text-white/90">
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                <a href="tel:+918847714464" className="hover:text-yellow-300 transition-colors">+91 88477 14464</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                <a href="mailto:wpc@waterparkchalo.com" className="hover:text-yellow-300 transition-colors">Email us</a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-yellow-300 mt-1 flex-shrink-0" />
                <span>110, Lakshmi Apt 1, Alkapuri, Nallasopara</span>
              </li>
              <li>
                 {/* Download App Button - Mobile */}
            <div className="mt-4">
              <DownloadAppButton className="scale-90" />
            </div>
              </li>
            </ul>
          </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Socials */}
        <div className="border-t  mt-10  pt-6 font-semibold text-center h-fit">
         <p className="text-white ">
            © {new Date().getFullYear()} All Rights Reserved by Water Park Chalo.
          </p>
          
          <div className="flex justify-center mt-5 space-x-4 mb-8 md:mb-0">
            <a href="https://www.facebook.com/people/Waterpark-chalo/61568891087635" target="_blank" rel="noopener noreferrer" className="p-2.5  rounded-full bg-blue-600 hover:scale-110 transition-all duration-300"><FaFacebookF /></a>
            <a href="https://wa.me/918847714464" target="_blank" rel="noopener noreferrer" className="p-2.5  rounded-full bg-green-500 hover:scale-110 transition-all duration-300"><FaWhatsapp /></a>
            <a href="https://www.instagram.com/waterpark_chalo/?igshid=OGQ5ZDc2ODk2ZA%3D%3D" target="_blank" rel="noopener noreferrer" className="p-2.5  rounded-full bg-pink-500 hover:scale-110 transition-all duration-300"><FaInstagram /></a>
            <a href="https://www.youtube.com/@Waterparkchalo" target="_blank" rel="noopener noreferrer" className="p-2.5  rounded-full bg-red-500 hover:scale-110 transition-all duration-300"><FaYoutube /></a>
          </div>
         
        </div>
      </div>
    </footer>
  );
}
