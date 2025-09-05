import { motion } from 'framer-motion';

// --- Standardized AnimatedBubbles component ---
// This component provides consistent bubble animation across all pages
const AnimatedBubbles = () => (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => {
            const size = Math.random() * 25 + 10;
            const duration = Math.random() * 12 + 8;
            const delay = Math.random() * 6;
            return (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-cyan-300/30 border border-white/50"
                    initial={{ y: '110vh', x: `${Math.random() * 100}vw`, opacity: 0 }}
                    animate={{ y: '-10vh', opacity: [0, 1, 1, 0] }}
                    transition={{ duration, delay, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
                    style={{ width: size, height: size }}
                />
            );
        })}
    </div>
);

export default AnimatedBubbles;
