import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import config from '../../config/config.js';
import { getEffectivePrice } from '../../utils/priceUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Ticket } from 'lucide-react';
import { createProductUrl } from '../../utils/urlUtils';

const ProductCard = ({ product }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!product) return null;

    // --- Logic for price and images is preserved ---
    const hasOptions = product.attributes && product.attributes.length > 0;
    const validImages = product.images?.filter(img => typeof img === 'string' && /\.(jpg|jpeg|png|gif|webp)$/i.test(img)) || [];
    const imageSources = validImages.length > 0 ? validImages : [product.image].filter(Boolean);
    const mainImage = config.fixImageUrl(imageSources[currentImageIndex]);
    
    const today = new Date().toISOString().split('T')[0];
    const effectivePrice = getEffectivePrice(product, 'adultprice', today);
    const hasDiscount = product.regularprice && product.regularprice > effectivePrice;
    const discountPercentage = hasDiscount ? Math.round(((product.regularprice - effectivePrice) / product.regularprice) * 100) : 0;
    
    const handleImageNavigation = (e, direction) => {
        e.preventDefault();
        e.stopPropagation();
        const newIndex = direction === 'next'
            ? (currentImageIndex + 1) % imageSources.length
            : (currentImageIndex - 1 + imageSources.length) % imageSources.length;
        setCurrentImageIndex(newIndex);
    };

    return (
        <motion.div
            layout
            className="group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 ease-in-out 
                       border border-slate-200/80 hover:shadow-xl hover:shadow-cyan-200/50 hover:-translate-y-1"
        >
            <Link to={createProductUrl(product._id || product.id, product.name)} className="block">
                <div className="relative w-full aspect-square overflow-hidden">
                    <AnimatePresence>
                        <motion.img
                            key={currentImageIndex}
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            src={mainImage}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={e => { e.target.src = 'https://placehold.co/400x500/e2e8f0/475569?text=Image'; }}
                        />
                    </AnimatePresence>
                    
                    {discountPercentage > 0 && (
                        <div className="absolute top-2.5 left-2.5 z-10 bg-rose-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg">
                            -{discountPercentage}%
                        </div>
                    )}

                    {imageSources.length > 1 && (
                        <>
                            <button onClick={(e) => handleImageNavigation(e, 'prev')} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white/70 hover:bg-white rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"><ChevronLeft size={16} /></button>
                            <button onClick={(e) => handleImageNavigation(e, 'next')} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white/70 hover:bg-white rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"><ChevronRight size={16} /></button>
                        </>
                    )}
                </div>
            </Link>

            <div className="p-3 flex flex-col flex-grow">
                <h3 className="text-sm font-semibold text-slate-800 truncate" title={product.name}>
                    <Link to={createProductUrl(product._id || product.id, product.name)} className="hover:text-cyan-600 transition-colors">
                        {product.name}
                    </Link>
                </h3>
                
                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-slate-900">
                            ₹{Math.round(effectivePrice)}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-slate-400 line-through">₹{Math.round(product.regularprice)}</span>
                        )}
                    </div>
                    
                    {/* --- CHANGED: This is now a Link component, not a button --- */}
                    <Link
                        to={createProductUrl(product._id || product.id, product.name)}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300
                                   bg-cyan-100 text-cyan-800 hover:bg-cyan-500 hover:text-white"
                    >
                        <Ticket size={14} />
                        <span>Book</span>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;