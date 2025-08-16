import { FaFacebookF, FaWhatsapp, FaInstagram, FaYoutube } from "react-icons/fa";
import { Phone, Mail, MapPin } from "lucide-react";
import React from "react";

export default function Footer() {
  return (
    <footer className="relative w-full text-white bg-gradient-to-r from-blue-500 to-blue-700 overflow-hidden">
      {/* Decorative SVG waves */}
      <div className="absolute top-0 left-0 w-full h-20">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="rgba(255,255,255,0.2)"
            d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,160C672,128,768,96,864,112C960,128,1056,192,1152,192C1248,192,1344,128,1392,96L1440,64V0H0Z"
          />
        </svg>
      </div>

      <div className="relative z-10 px-6 py-12 md:py-16 lg:px-20">
        {/* Desktop Layout */}
        <div className="hidden md:grid grid-cols-4 gap-8">
          {/* Logo */}
          <div>
            <h2 className="text-2xl font-extrabold tracking-wide">Water Park Chalo</h2>
            <p className="mt-3 text-sm opacity-80">
              Dive into fun with endless rides, pools & adventures. 🌊
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Useful Links</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>Home</li>
              <li>About Us</li>
              <li>Tickets</li>
              <li>Attractions</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li className="flex items-center gap-2">
                <Phone size={16} /> +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} /> info@waterparkchalo.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} /> Patna, Bihar
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
            <div className="flex gap-4">
              <FaFacebookF className="cursor-pointer hover:text-blue-200" />
              <FaInstagram className="cursor-pointer hover:text-pink-200" />
              <FaWhatsapp className="cursor-pointer hover:text-green-200" />
              <FaYoutube className="cursor-pointer hover:text-red-300" />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col items-center text-center gap-6">
          {/* Logo */}
          <div>
            <h2 className="text-3xl font-extrabold">🌊 Water Park Chalo</h2>
          </div>

          {/* Contact + Links side by side */}
          <div className="flex justify-center gap-12 w-full">
            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Contact</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li className="flex items-center gap-2 justify-center">
                  <Phone size={14} /> +91 98765 43210
                </li>
                <li className="flex items-center gap-2 justify-center">
                  <Mail size={14} /> info@waterparkchalo.com
                </li>
                <li className="flex items-center gap-2 justify-center">
                  <MapPin size={14} /> Patna, Bihar
                </li>
              </ul>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Links</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li>Home</li>
                <li>About</li>
                <li>Tickets</li>
                <li>Attractions</li>
              </ul>
            </div>
          </div>

          {/* Socials at bottom */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
            <div className="flex gap-6 justify-center">
              <FaFacebookF className="cursor-pointer hover:text-blue-200" />
              <FaInstagram className="cursor-pointer hover:text-pink-200" />
              <FaWhatsapp className="cursor-pointer hover:text-green-200" />
              <FaYoutube className="cursor-pointer hover:text-red-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full h-20">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="rgba(255,255,255,0.15)"
            d="M0,64L48,96C96,128,192,192,288,197.3C384,203,480,149,576,144C672,139,768,181,864,176C960,171,1056,117,1152,101.3C1248,85,1344,107,1392,117.3L1440,128V320H0Z"
          />
        </svg>
      </div>
    </footer>
  );
}
