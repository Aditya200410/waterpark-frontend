import React from 'react';
import { motion } from 'framer-motion';
const partners = [
  { name: 'WaterPark A', logo: './left.png' },
  { name: 'WaterPark B', logo: './water.png' },
  { name: 'TicketMaster', logo: './slide.png' },
  { name: 'PayFast', logo: './left.png' },
  { name: 'WaterPark C', logo: './waterparkC.png' },
  { name: 'TicketNow', logo: './ticketnow.png' },
];

const logoVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export default function OurPartners() {
  return (
    <section className="py-10 md:py-14 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14 lg:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-4 md:mb-5">
            Our <span className="font-serif italic">Partners</span>
          </h2>
          <div className="w-20 md:w-24 h-0.5 bg-gradient-to-r from-pink-600 to-pink-600 mx-auto mb-5 md:mb-7"></div>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We collaborate with trusted water parks, ticketing platforms, and payment providers to give you a seamless experience.
          </p>
        </motion.div>

        {/* Carousel for mobile */}
        <div className="sm:hidden overflow-x-auto">
          <div className="flex gap-4 px-2">
            {partners.map((partner) => (
              <motion.div
                key={partner.name}
                variants={logoVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-500 flex-shrink-0 w-40 flex items-center justify-center"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-16 object-contain"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Grid for tablets and desktop */}
        <div className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 lg:gap-10 items-center justify-items-center">
          {partners.map((partner) => (
            <motion.div
              key={partner.name}
              variants={logoVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group bg-white/90 backdrop-blur-sm rounded-2xl p-5 md:p-6 lg:p-8 shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-500 flex items-center justify-center"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-16 sm:max-h-20 lg:max-h-24 object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
