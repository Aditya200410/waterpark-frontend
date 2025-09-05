import { motion } from "framer-motion";
import { MapPin, Mail, Clock, Users, Heart, Star, Award } from "lucide-react";
import SEO from "../components/SEO/SEO";
import AnimatedBubbles from "../components/AnimatedBubbles/AnimatedBubbles";

const AboutUs = () => {
  const stats = [
    { icon: Users, number: "500+", label: "Happy Visitors" },
    { icon: Award, number: "2+", label: "Years Experience" },
    { icon: Heart, number: "200+", label: "Water Slides" },
    { icon: Star, number: "4.9", label: "Visitor Rating" },
  ];

  const values = [
    {
      title: "Guest Safety",
      description:
        "We follow strict safety protocols, ensuring a secure environment for visitors of all ages.",
      icon: "🦺",
    },
    {
      title: "Innovative Rides",
      description:
        "Our rides are modern, thrilling, and designed to deliver fun without compromising safety.",
      icon: "🎢",
    },
    {
      title: "Clean Environment",
      description:
        "We maintain the park with top hygiene standards and eco-friendly practices.",
      icon: "💧",
    },
    {
      title: "Memorable Experience",
      description:
        "From families to groups, we create unforgettable water adventures and memories.",
      icon: "🌟",
    },
  ];

  return (
    <div className="w-full font-roboto overflow-hidden relative">
      <AnimatedBubbles />

      <SEO
        title="About Water Park Chalo - Professional Water Adventures"
        description="Learn about Water Park Chalo, our mission to provide safe, fun, and professional water experiences."
        keywords="water park, professional water rides, family fun, adventure"
        url="https://waterparkchalo.com/about"
        image="/waterpark-hero.jpg"
      />

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight break-words">
            <span className="text-white italic font-serif">
              Professional Water Adventures
            </span>{" "}
            ✨
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white text-base sm:text-lg md:text-xl max-w-3xl mx-auto"
          >
            Water Park Chalo is committed to delivering safe, thrilling, and
            unforgettable experiences for families and adventure seekers alike.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-blue-50 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
            >
              <stat.icon className="w-8 sm:w-10 h-8 sm:h-10 text-blue-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-blue-900">
                {stat.number}
              </h3>
              <p className="text-blue-700 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4 sm:mb-6">
              Our Story
            </h2>
            <p className="text-white mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
              Water Park Chalo was created to provide professional water park
              experiences, combining thrill, safety, and family fun in one
              location.
            </p>
            <p className="text-white mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
              Our vision is to become the region’s leading water adventure park
              while maintaining the highest standards of service and hygiene.
            </p>
            <p className="text-white leading-relaxed text-sm sm:text-base">
              We bring together expert staff, modern rides, and clean,
              eco-friendly facilities to ensure every visitor leaves with
              unforgettable memories.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/left.png"
                alt="Water Park Ride"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-6">
            Our Values
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl p-6 shadow hover:shadow-lg transition-shadow text-center bg-white"
              >
                <div className="text-3xl sm:text-4xl mb-3">{value.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-blue-700 text-sm sm:text-base">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-6">
            Contact Us
          </motion.h2>
          <p className="text-white mb-10 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base">
            Reach out to us for bookings, inquiries, or more information about
            our professional water park services.
          </p>

          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow flex flex-col items-center">
              <MapPin className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-semibold text-blue-900 mb-1">Address</h3>
              <p className="text-blue-700 text-sm sm:text-base break-words">
                110, Lakshmi Apt, Near Kailash Darshan 1, Alkapuri, Nallasopara
                East 401209
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow flex flex-col items-center">
              <Mail className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-semibold text-blue-900 mb-1">Email</h3>
              <p className="text-blue-700 text-sm sm:text-base break-words">
                care@waterparkchalo.com
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow flex flex-col items-center">
              <Clock className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-semibold text-blue-900 mb-1">Hours</h3>
              <p className="text-blue-700 text-sm sm:text-base">
                Mon - Sun: 10AM - 7PM
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
