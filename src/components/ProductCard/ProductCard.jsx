import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Ticket } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useState, useEffect } from 'react';
import config from '../../config/config.js';
import { toast } from 'react-hot-toast';
import { getEffectivePrice } from '../../utils/priceUtils';

const ProductCard = ({ product }) => {
  // --- All of your existing logic is preserved ---
  const { addToCart, cartItems } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  const isOutOfStock = product.stock === 0 || product.outOfStock === true || product.inStock === false;
  const cartQuantity = cartItems?.find(item => (item.product?._id || item.product?.id || item.id) === (product._id || product.id))?.quantity || 0;
  const isCartLimit = cartQuantity >= (product.stock || 0);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      toast.error('Product is out of stock');
      return;
    }
    if (isCartLimit) {
      toast.error('Cannot add more than available stock');
      return;
    }
    try {
      const productId = product._id || product.id;
      if (!productId) {
        console.error('Product ID is missing');
        toast.error('Failed to add item to cart');
        return;
      }
      await addToCart(productId);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const hasOptions = product.attributes && product.attributes.length > 0;

  const validImages = product.images?.filter(img => typeof img === 'string' && /\.(jpg|jpeg|png|gif|webp)$/i.test(img)) || [];
  const mainImage = validImages.length > 0 ? config.fixImageUrl(validImages[currentImageIndex]) : config.fixImageUrl(product.image);

  const handlePreviousImage = (e) => {
    e.preventDefault(); e.stopPropagation();
    setCurrentImageIndex(prev => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.preventDefault(); e.stopPropagation();
    setCurrentImageIndex(prev => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (validImages.length <= 1) return;
      if (e.key === 'ArrowLeft') {
        setCurrentImageIndex(prev => prev === 0 ? validImages.length - 1 : prev - 1);
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex(prev => prev === validImages.length - 1 ? 0 : prev + 1);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [validImages.length]);

  return (
    <Link
      to={`/product/${product._id || product.id}`}
      className="group relative block aspect-[4/5] w-full rounded-3xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-1.5"
    >
      {/* Full Height Background Image */}
      <img
        src={mainImage}
        alt={product.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        onError={e => { e.target.src = 'https://placehold.co/400x500/e2e8f0/475569?text=Image'; }}
      />
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

      {/* Discount Badge */}
      {(() => {
        const today = new Date().toISOString().split('T')[0];
        const effectiveAdultPrice = getEffectivePrice(product, 'adultprice', today);
        const hasSpecialPrice = effectiveAdultPrice !== product.adultprice;
        const hasDiscount = product.regularprice && product.regularprice > effectiveAdultPrice;
        
        if (hasSpecialPrice) {
          return (
            <div className="absolute top-4 left-4 z-10 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              Special Price
            </div>
          );
        } else if (hasDiscount) {
          return (
            <div className="absolute top-4 left-4 z-10 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              -{Math.round(((product.regularprice - effectiveAdultPrice) / product.regularprice) * 100)}%
            </div>
          );
        }
        return null;
      })()}

      {/* Image Navigation Controls */}
      {validImages.length > 1 && (
        <>
          <button
            onClick={handlePreviousImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/60 hover:bg-white text-sky-700 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/60 hover:bg-white text-sky-700 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col justify-end h-full p-4 text-white">
        <div className="space-y-2">
           <h3 className="text-lg font-bold truncate">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-300">
              ₹{Math.round(getEffectivePrice(product, 'adultprice', new Date().toISOString().split('T')[0]))}
            </span>
            {product.regularprice && product.regularprice > getEffectivePrice(product, 'adultprice', new Date().toISOString().split('T')[0]) && (
              <span className="text-sm text-gray-300 line-through">₹{Math.round(product.regularprice)}</span>
            )}
            {getEffectivePrice(product, 'adultprice', new Date().toISOString().split('T')[0]) !== product.adultprice && (
              <span className="text-xs text-blue-300 font-medium">Special</span>
            )}
          </div>
        </div>

         {/* Themed Action Button (using a div for visual consistency as the parent is a Link) */}
        <div className="mt-4 w-full bg-gradient-to-r from-cyan-400 to-sky-500 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg">
          <Ticket className="w-5 h-5" />
          <span>{hasOptions ? 'Select Options' : 'Explore'}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;