import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tag, ShieldCheck, Zap, ThumbsUp } from "lucide-react";
import config from "../../config/config.js";

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function WhyBookWithUs() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(config.API_URLS.BLOG);
        if (!res.ok) throw new Error("Failed to fetch data from backend");

        const data = await res.json();
        const allCards = Array.isArray(data) ? data : data.cards || [];

        const filteredCards = allCards.filter((card) => card.isMostLoved === true);

        const iconMap = { Tag, ShieldCheck, Zap, ThumbsUp };

        const mappedCards = filteredCards.map((card) => ({
          ...card,
          icon: iconMap[card.icon] || Tag,
        }));

        setCards(mappedCards);
      } catch (err) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) return <p className="text-center py-10 text-blue-600">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <section className="relative py-10 md:py-16 lg:py-20 overflow-hidden">
      {/* Decorative water ripple background */}
      <div className="absolute inset-0 bg-[url('/waves.svg')] bg-cover bg-center opacity-5 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14 lg:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-blue-900 mb-4">
            Why <span className="font-serif italic text-blue-900">Book With Us</span>
          </h2>
          <div className="w-20 h-1  mx-auto rounded-full mb-4"></div>
          <p className="text-sm md:text-base lg:text-lg text-black max-w-2xl mx-auto leading-relaxed">
            Dive into the reasons why thousands of customers trust us for their unforgettable water park adventures.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4 ">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-300 to-cyan-300 border border-blue-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              </div>

              {/* Card Body */}
              <div className="p-5 md:p-6 lg:p-8 ">
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-5">
                  <div className="p-3 md:p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl shadow-md">
                    <card.icon className="h-5 w-5 md:h-7 md:w-7 text-blue-700" />
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-xl font-semibold text-blue-900">
                    {card.name}
                  </h3>
                </div>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Hover glow border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl transition-all duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
