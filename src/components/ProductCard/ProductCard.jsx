import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import config from '../../config/config.js';
import { toast } from 'react-hot-toast';
import { getEffectivePrice } from '../../utils/priceUtils';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Ticket } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { addToCart, cartItems } = useCart();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // --- All of your existing logic is preserved ---
    if (!product) return null;

    const isOutOfStock = product.stock === 0 || product.outOfStock === true || product.inStock === false;
    const cartQuantity = cartItems?.find(item => (item.product?._id || item.id) === (product._id || product.id))?.quantity || 0;
    const isCartLimit = cartQuantity >= (product.stock || 0);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock) return toast.error('Product is out of stock');
        if (isCartLimit) return toast.error('Cannot add more than available stock');
        try {
            await addToCart(product._id || product.id);
        } catch (error) {
            toast.error('Failed to add item to cart');
        }
    };

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
        // Changed: The card is no longer a single link. It's a container.
        <motion.div
            layout
            className="group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 ease-in-out 
                       border border-slate-200/80 hover:shadow-xl hover:shadow-cyan-200/50 hover:-translate-y-1"
        >
            {/* --- Image Section (This part is the link) --- */}
            <Link to={`/product/${product._id || product.id}`} className="block">
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

            {/* --- Content Section (Separate from the link for better UX) --- */}
            <div className="p-3 flex flex-col flex-grow">
                {/* Title is a link */}
                <h3 className="text-sm font-semibold text-slate-800 truncate" title={product.name}>
                    <Link to={`/product/${product._id || product.id}`} className="hover:text-cyan-600 transition-colors">
                        {product.name}
                    </Link>
                </h3>
                
                {/* Price and Action Button now share a line for a compact, app-like feel */}
                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-slate-900">
                            ₹{Math.round(effectivePrice)}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-slate-400 line-through">₹{Math.round(product.regularprice)}</span>
                        )}
                    </div>
                    
                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300
                                   bg-cyan-100 text-cyan-800 hover:bg-cyan-500 hover:text-white
                                   disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                    >
                        <Ticket size={14} />
                        <span>{hasOptions ? 'Options' : 'Book'}</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;