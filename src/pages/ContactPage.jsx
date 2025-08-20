import React, { useState } from 'react';
import { motion, LazyMotion, domAnimation } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Waves, Droplet, Building, Sun } from 'lucide-react';

const Contact = () => {
  // Contact info is now directly in the component for simplicity
  const contactInfo = {
    company: 'Water Park Chalo',
    address: 'Splash City, India',
    phone: '+91 12345 67890',
    email: 'hello@waterparkchalo.com',
    officeHours: 'Mon - Sun: 9:00 AM - 6:00 PM',
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const constructMailtoLink = () => {
    const subject = formData.subject 
      ? `${formData.subject} - from ${formData.name}`
      : `Inquiry from ${formData.name}`;
      
    const body = `
      Name: ${formData.name}
      Email: ${formData.email}
      Date: ${new Date().toLocaleString()}

      Message:
      ${formData.message}
      ---
      Sent from the Water Park Chalo contact form!
    `;
    return `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleMailtoSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill out all required fields!");
      return;
    }
    window.location.href = constructMailtoLink();
    setFormData({ name: '', email: '', subject: '', message: '' });
  };
  
  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="font-sans bg-foam text-deep-blue overflow-x-hidden">
        
        {/* HERO SECTION */}
        <section className="relative text-center py-24 px-4 sm:py-32 bg-water-blue overflow-hidden">
          <motion.div 
            className="relative z-10 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="flex justify-center items-center gap-3 mb-6">
              <Waves className="text-white/80" size={32} />
              <h2 className="text-2xl font-bold text-white tracking-wider">Get In Touch</h2>
              <Waves className="text-white/80" size={32} />
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white mb-4 leading-tight">
              Slide Into Our <span className="text-sun-yellow">DMs</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              Got a question or ready to book your next splash-tastic adventure? We're all ears!
            </motion.p>
          </motion.div>
          {/* Wavy Divider SVG */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0 100H1440V24.5C1217.5 43.5 984 -10.5 720 5.5C456 21.5 240 76.5 0 24.5V100Z" fill="#f0f9ff"/>
            </svg>
          </div>
        </section>

        {/* MAIN CONTENT GRID */}
        <main className="py-16 sm:py-24 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
            
            {/* CONTACT FORM */}
            <motion.div 
              className="lg:col-span-3 bg-white p-8 sm:p-10 rounded-3xl shadow-lg shadow-water-blue/10"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h3 className="text-3xl font-bold text-deep-blue mb-2">Send a Message</h3>
              <p className="text-slate-500 mb-8">We'll get back to you faster than a ride down the waterslides!</p>
              
              <form onSubmit={handleMailtoSubmit} className="space-y-6">
                <div className="form-group">
                  <label htmlFor="name" className="text-lg font-semibold text-deep-blue block mb-2">Your Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Alex River" required className="w-full p-4 bg-foam rounded-xl border-2 border-transparent focus:border-water-blue focus:ring-0 transition-all duration-300 placeholder:text-slate-400" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="text-lg font-semibold text-deep-blue block mb-2">Email Address</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required className="w-full p-4 bg-foam rounded-xl border-2 border-transparent focus:border-water-blue focus:ring-0 transition-all duration-300 placeholder:text-slate-400" />
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="text-lg font-semibold text-deep-blue block mb-2">Subject</label>
                  <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="What's this about?" required className="w-full p-4 bg-foam rounded-xl border-2 border-transparent focus:border-water-blue focus:ring-0 transition-all duration-300 placeholder:text-slate-400" />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="text-lg font-semibold text-deep-blue block mb-2">Your Message</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Tell us everything..." rows="5" required className="w-full p-4 bg-foam rounded-xl border-2 border-transparent focus:border-water-blue focus:ring-0 transition-all duration-300 placeholder:text-slate-400"></textarea>
                </div>
                
                <motion.button 
                  type="submit" 
                  className="w-full flex items-center justify-center gap-3 bg-sun-yellow text-deep-blue font-bold text-lg py-4 px-8 rounded-xl shadow-lg shadow-sun-yellow/30"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <span>Send Message</span>
                  <Send size={20} />
                </motion.button>
              </form>
            </motion.div>

            {/* INFO CARD */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <div className="bg-gradient-to-br from-water-blue to-water-blue-dark p-8 sm:p-10 rounded-3xl shadow-lg shadow-water-blue/20 text-white h-full">
                <h3 className="text-3xl font-bold mb-8 text-white">Contact Info</h3>
                <ul className="space-y-6">
                  <InfoItem icon={<Building />} label="Company" value={contactInfo.company} />
                  <InfoItem icon={<MapPin />} label="Address" value={contactInfo.address} />
                  <InfoItem icon={<Phone />} label="Phone" value={contactInfo.phone} />
                  <InfoItem icon={<Mail />} label="Email" value={contactInfo.email} />
                  <InfoItem icon={<Clock />} label="Park Hours" value={contactInfo.officeHours} />
                </ul>
                <div className="mt-10 pt-6 border-t border-white/20 flex items-center gap-4">
                    <Sun className="text-sun-yellow" size={32} />
                    <p className="text-lg font-semibold">Ready for some fun in the sun!</p>
                </div>
              </div>
            </motion.div>

          </div>
        </main>
      </div>
    </LazyMotion>
  );
};

// A helper component for list items in the info card to keep the code clean
const InfoItem = ({ icon, label, value }) => (
  <li className="flex items-start gap-4">
    <div className="flex-shrink-0 bg-white/20 p-3 rounded-full">
      {React.cloneElement(icon, { size: 22 })}
    </div>
    <div>
      <strong className="block font-bold text-lg">{label}</strong>
      <p className="text-white/80">{value}</p>
    </div>
  </li>
);

export default Contact;