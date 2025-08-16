import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tag, ShieldCheck, Zap, ThumbsUp } from "lucide-react";
import config from "../../config/config.js";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
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

        // Filter only items where isMostLoved is true
        const filteredCards = allCards.filter((card) => card.isMostLoved === true);

        // Map icons from lucide-react based on backend property (optional)
        const iconMap = {
          Tag,
          ShieldCheck,
          Zap,
          ThumbsUp,
        };

        const mappedCards = filteredCards.map((card) => ({
          ...card,
          icon: iconMap[card.icon] || Tag, // default to Tag if icon not found
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
    <section className="py-6 md:py-10 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-gray-900 mb-3 md:mb-4">
            Why <span className="font-serif italic">Book With Us</span>
          </h2>
          <div className="w-16 md:w-20 h-0.5 bg-gradient-to-r from-pink-600 to-pink-600 mx-auto mb-4 md:mb-6"></div>
          <p className="text-sm md:text-base lg:text-lg text-whit max-w-2xl mx-auto leading-relaxed">
            Discover why thousands of happy customers choose us for their water park adventures.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {cards.map((card) => (
            <motion.div
              key={card.title}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group relative bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border border-white/20"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-3 md:p-6 lg:p-8">
                <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4 lg:mb-5">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-pink-100 to-pink-100 rounded-lg md:rounded-xl shadow-sm">
                    <card.icon className="h-4 w-4 md:h-6 md:w-6 text-pink-700" />
                  </div>
                  <h3 className="text-sm md:text-xl lg:text-2xl font-semibold text-gray-900">{card.title}</h3>
                </div>
                <p className="text-xs md:text-base text-gray-600 leading-relaxed">{card.description}</p>
              </div>

              <div className="absolute inset-0 border-2 border-transparent group-hover:border-pink-200 rounded-xl md:rounded-2xl transition-colors duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
