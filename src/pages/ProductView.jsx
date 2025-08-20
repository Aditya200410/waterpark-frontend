import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { useParams, useNavigate } from 'react-router-dom';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ShieldCheck } from "lucide-react"; // Added ShieldCheck for modal
import { 
  HeartIcon, ShoppingCartIcon, ShareIcon, StarIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon,
  DocumentTextIcon, CogIcon, TruckIcon, ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import MostLoved from '../components/Products/MostLoved';
import WeeklyBestsellers from '../components/Products/WeeklyBestsellers';

import { useAuth } from '../context/AuthContext';
import { MapPin } from "lucide-react";
import config from '../config/config.js';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import ReviewService from '../services/reviewService';
import SEO from '../components/SEO/SEO';
import { seoConfig } from '../config/seo';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Ref for the booking section to scroll to
  const bookingSectionRef = useRef(null);



const [paymentOption, setPaymentOption] = useState('advance'); // 'advance' or 'full'
  const [selectedImage, setSelectedImage] = useState(0);
  const [adultquantity, setadultQuantity] = useState(1); // Default to 1
  const [childquantity, setchildQuantity] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalSelectedImage, setModalSelectedImage] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [error, setError] = useState(null);
  const [BookingDate, setBookingDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
  
  // NEW: State for the terms and conditions modal
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const tabs = [
    { id: 'description', label: 'Description', icon: DocumentTextIcon },
    { id: 'specifications', label: 'Specifications', icon: CogIcon },
    { id: 'FAQ', label: 'FAQ', icon: TruckIcon },
    { id: 'reviews', label: 'Reviews', icon: ChatBubbleLeftRightIcon },
  ];

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Load reviews for the product
  const loadReviews = async () => {
    if (!product?._id) return;
    
    setReviewsLoading(true);
    try {
      const reviewsData = await ReviewService.getProductReviews(product._id);
      setReviews(reviewsData.reviews || []);
      
      // Check if current user has reviewed this product
      if (user && user.email) {
        try {
          const userReviewData = await ReviewService.getUserReview(product._id, user.email);
          setUserReview(userReviewData);
        } catch (error) {
          // User hasn't reviewed this product
          setUserReview(null);
        }
      } else {
        setUserReview(null);
      }
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try fetching from each collection until we find the product
        const endpoints = [
          `${config.API_URLS.SHOP}/${id}`, // Try shop first (most reliable)
          `${config.API_URLS.PRODUCTS}/${id}`, // Then products endpoint
          `${config.API_URLS.LOVED}/${id}`,
          `${config.API_URLS.BESTSELLER}/${id}`,
          `${config.API_URLS.FEATURED_PRODUCTS}/${id}`
        ];

        let foundProduct = null;
        let fetchError = null;

        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint);
            
            if (!response.ok) {
              continue;
            }
            
            const data = await response.json();
            
            // Check for both the new MongoDB format and old format
            foundProduct = data.product || // New MongoDB format
                           (Array.isArray(data.products) ? data.products[0] : null) || // Array format
                           (data._id ? data : null); // Direct object format
            
            if (foundProduct) {
              // Ensure consistent ID field
              foundProduct = {
                ...foundProduct,
                id: foundProduct._id || foundProduct.id,
                // Ensure price and regularPrice are numbers
                price: parseFloat(foundProduct.price) || 0,
                regularprice: parseFloat(foundProduct.regularprice) || 0,
                adultprice: parseFloat(foundProduct.adultprice) || 0,
                childprice: parseFloat(foundProduct.childprice) || 0,
                weekendprice: parseFloat(foundProduct.weekendprice) || 0,

                // Ensure images array exists
                images: foundProduct.images || [foundProduct.image],
              };
              break;
            }
          } catch (error) {
            fetchError = error;
          }
        }

        if (!foundProduct) {
          throw new Error(fetchError || 'Product not found in any collection');
        }

        setProduct(foundProduct);
      } catch (error) {
        setError(error.message || 'Failed to load product details');
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Load reviews when product is loaded or user changes
  useEffect(() => {
    if (product?._id) {
      loadReviews();
    }
  }, [product?._id, user?.email]);

  // Keyboard navigation for image gallery - MUST be before any conditional returns
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!product) return;
      
      // Get product images dynamically to avoid initialization issues
      const images = product.images && Array.isArray(product.images) && product.images.length > 0
        ? product.images
            .filter(img => {
              if (!img || typeof img !== 'string') return false;
              const ext = img.toLowerCase().split('.').pop();
              return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
            })
            .map(img => config.fixImageUrl(img))
        : [config.fixImageUrl(product.image)];
      
      if (images.length <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1);
      } else if (e.key === 'ArrowRight') {
        setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [product]);

  // Handle opening the terms modal
  const handleOpenTermsModal = () => {
    if (!BookingDate) {
      toast.error("Please select a date for your booking.");
      return;
    }
    if (adultquantity === 0 && childquantity === 0) {
        toast.error("Please add at least one adult or child ticket.");
        return;
    }
    setIsTermsModalOpen(true);
  };

  // This function now proceeds after terms are accepted
  const handleProceedToCheckout = () => {
    // 1. Close the modal
    setIsTermsModalOpen(false);

    // 2. Structure the data for the checkout page
    const checkoutData = {
      resortId: product._id,
      resortName: product.name,
      adultCount: adultquantity,
      childCount: childquantity,
      date: BookingDate,
      subtotal: adultquantity * product.adultprice + childquantity * product.childprice,
      deposit: adultquantity * product.adultprice + childquantity * product.childprice,
    };

    // 3. Save the data to localStorage and navigate
    try {
      localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
      navigate('/checkout', { state: checkoutData });
    } catch (error) {
      console.error("Could not proceed to checkout:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // NEW: Function to scroll to the booking section
  const scrollToBooking = () => {
    bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };


  if (loading) return <Loader fullScreen={true} withHeaderFooter={true} size="large" text="Loading product details..."  />;
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-2">Product Not Found</h2>
      <p className="text-gray-700 mb-4">{error}</p>
      <button onClick={() => window.location.href = '/shop'} className="px-4 py-2 bg-blue text-white rounded hover:bg-blue">Back to Shop</button>
    </div>
  );
  if (!product) return null;

  // SEO configuration for product page
  const productSEO = seoConfig.product(product);

  // Consistent out-of-stock logic
  const isOutOfStock = product.outOfStock === true || product.inStock === false;

  // Use product.images array if available, otherwise fallback to single image
  const productImages = (() => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      const validImages = product.images
        .filter(img => {
          if (!img || typeof img !== 'string') return false;
          const ext = img.toLowerCase().split('.').pop();
          return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
        })
        .map(img => config.fixImageUrl(img));
      
      if (validImages.length > 0) {
        return validImages;
      }
    }
    
    const fallbackImage = config.fixImageUrl(product.image);
    return [fallbackImage];
  })();

  const handleadultQuantityChange = (value) => {
    setadultQuantity(Math.max(0, value)); // Allow 0
  }
  const handlechildQuantityChange = (value) => {
    setchildQuantity(Math.max(0, value)); // Allow 0
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length 
    : 0;

  // Handle review submission
  const handleReviewSubmitted = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
    setUserReview(newReview);
  };

  // Handle review update
  const handleReviewUpdated = (updatedReview) => {
    setReviews(prev => prev.map(review => 
      review._id === updatedReview._id ? updatedReview : review
    ));
    setUserReview(updatedReview);
  };

  // Handle review deletion
  const handleReviewDeleted = () => {
    setUserReview(null);
    loadReviews();
  };

  const handlePreviousImage = () => {
    setSelectedImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };


  const handleShare = async () => {
    setIsShareModalOpen(true);
  };

  const handleShareOption = async (option) => {
    try {
      const shareData = {
        title: product.name,
        text: `Check out this amazing product: ${product.name}`,
        url: window.location.href,
      };

      switch (option) {
        case 'native':
          if (navigator.share) {
            await navigator.share(shareData);
          } else {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
          }
          break;
        case 'whatsapp':
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`;
          window.open(whatsappUrl, '_blank');
          break;
        case 'facebook':
          const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
          window.open(facebookUrl, '_blank');
          break;
        case 'twitter':
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
          window.open(twitterUrl, '_blank');
          break;
        case 'copy':
          await navigator.clipboard.writeText(window.location.href);
          toast.success('Link copied to clipboard!');
          break;
        default:
          break;
      }
      setIsShareModalOpen(false);
    } catch (error) {
      toast.error('Failed to share product');
      setIsShareModalOpen(false);
    }
  };

  const handleImageClick = () => {
    setModalSelectedImage(selectedImage);
    setIsImageModalOpen(true);
  };

  const handleModalPreviousImage = () => {
    setModalSelectedImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleModalNextImage = () => {
    setModalSelectedImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const handleModalClose = () => {
    setIsImageModalOpen(false);
  };

  const grandTotal = adultquantity * product.adultprice + childquantity * product.childprice;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className=" w-full h-full bg-[#00B4D8] overflow-hidden">

      <SEO {...productSEO} />
      {/* Breadcrumb */}
  
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
           {/* Product Images - Left Side */}
           <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-4 flex flex-col"
            >
            {/* Main Image Display */}
            <div className="relative w-full flex items-center justify-center rounded-2xl overflow-hidden bg-gradient-to-br from-[#CAF0F8] via-[#ADE8F4] to-[#90E0EF] group shadow-xl border border-[#0077B6]/20" style={{ maxHeight: '60vh' }}>
            
            <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="max-w-full max-h-[60vh] object-cover cursor-pointer"
                onClick={handleImageClick}
                onError={e => {
                e.target.onerror = null;
                if (productImages[selectedImage] !== config.fixImageUrl(product.image)) {
                    e.target.src = config.fixImageUrl(product.image);
                } else {
                    e.target.src = 'https://placehold.co/600x600/e0f7fa/006d77?text=No+Image';
                }
                }}
            />

            {/* Gallery Badge */}
            {productImages.length > 1 && (
                <div className="absolute top-3 right-3 bg-[#03045E]/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                📷 {productImages.length} Photos
                </div>
            )}

            {/* Navigation Arrows */}
            {productImages.length > 1 && (
                <>
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ x: -5, scale: 1.1 }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-[#90E0EF] text-[#0077B6] p-3 rounded-full shadow-lg border-2 border-[#0077B6]/30 transition-all"
                    onClick={handlePreviousImage}
                    aria-label="Previous image"
                >
                    <ChevronLeftIcon className="h-6 w-6" />
                </motion.button>

                <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    whileHover={{ x: 5, scale: 1.1 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-[#90E0EF] text-[#0077B6] p-3 rounded-full shadow-lg border-2 border-[#0077B6]/30 transition-all"
                    onClick={handleNextImage}
                    aria-label="Next image"
                >
                    <ChevronRightIcon className="h-6 w-6" />
                </motion.button>
                </>
            )}

            {/* Counter */}
            {productImages.length > 1 && (
                <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#023E8A]/80 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md"
                >
                {selectedImage + 1} / {productImages.length}
                </motion.div>
            )}
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
                {productImages.map((image, index) => (
                <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all relative shadow-sm ${
                    selectedImage === index 
                        ? 'border-[#0077B6] shadow-lg' 
                        : 'border-transparent hover:border-[#0077B6]/30'
                    }`}
                >
                    <img 
                    src={image} 
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover bg-white" 
                    onError={e => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/150x150/e0f7fa/006d77?text=Image';
                    }}
                    />
                    {selectedImage === index && (
                    <div className="absolute inset-0 bg-[#0077B6]/20 flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#0077B6] rounded-full"></div>
                    </div>
                    )}
                </motion.button>
                ))}
            </div>
            )}
            </motion.div>


          {/* Product Details - Right Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7 space-y-6 flex flex-col justify-start bg-gradient-to-br from-[#E0F7FA] to-[#B2EBF2] p-6 rounded-2xl shadow-lg relative overflow-hidden"
            >
            {/* Decorative Wave Background */}
            <div className="absolute top-0 left-0 w-full h-24 bg-[#00B4D8] rounded-b-[50%] opacity-20 pointer-events-none"></div>

            {/* Product Header */}
            <div className="space-y-3 relative z-10">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <MapPin size={14} className="text-blue-800" />
                <span className="px-2 py-1 bg-[#CAF0F8] text-[#023E8A] text-xs font-medium rounded-full">
                {product.category}
                </span>
                {product.isNew && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    🌊 New Splash!
                </span>
                )}
            </div>

            <h1 className="text-2xl font-bold text-[#03045E] leading-tight">
                {product.name}
            </h1>
            
            {/* Rating Display */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                    <StarIcon
                    key={index}
                    className={`h-4 w-4 ${index < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
                <span className="text-xs text-gray-600">
                    {averageRating > 0 ? `${averageRating.toFixed(1)} (${reviews.length} reviews)` : 'No reviews yet'}
                </span>
                </div>
            </div>
            </div>

            {/* Price Section */}
            
            <div className="space-y-2">
                <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#0077B6]">
                    ₹{product.childprice.toFixed(2)} for child ticket
                </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#0077B6]">
                    ₹{product.adultprice.toFixed(2)} for adult ticket
                </span>
                </div>
            </div>


            { /* Product Description */}
            {/* Product Tabs - Water Park Theme */}
            
            <div className="mt-10 font-['Baloo_2',cursive]">
            
              {/* Tab Navigation */}
            
              <div className="border-b-2 border-blue-200 relative">
            
                  {/* Desktop Tabs */}
            
                
            
          <div className="mt-10 font-['Baloo_2',cursive]">
  {/* Tab Navigation */}
  <div className="border-b-2 border-blue-200">
    {/* Unified Responsive Tabs for All Devices */}
    <nav className="flex space-x-1 sm:space-x-1 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative whitespace-nowrap py-2 px-3 text-sm sm:py-3 sm:px-4 sm:text-lg rounded-t-xl font-semibold transition-all duration-300 ${
            activeTab === tab.id
              ? "bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white shadow-md"
              : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              layoutId="tab-underline"
              className="absolute left-0 right-0 -bottom-[2px] h-1 bg-[#90E0EF] rounded-full"
            />
          )}
        </motion.button>
      ))}
    </nav>
  </div>

  </div>
                </div>
            
            
            
              {/* Tab Content */}
            
              <div className="py-8">
            
                <AnimatePresence mode="wait">
            
                  {/* --- Description Tab --- */}
            
                  {activeTab === 'description' && (
            
                    <motion.div
            
                      key="description"
            
                      initial={{ opacity: 0, y: 30 }}
            
                      animate={{ opacity: 1, y: 0 }}
            
                      exit={{ opacity: 0, y: -30 }}
            
                      transition={{ duration: 0.4 }}
            
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
            
                    >
            
                      {/* Features */}
            
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#CAF0F8] to-[#ADE8F4] shadow-lg">
            
                        <h4 className="font-bold text-[#03045E] mb-3 text-lg">💡 Features</h4>
            
                        <div className="space-y-2 text-sm text-[#023E8A]">
            
                          {product.utility
            
                            ? product.utility.split(/\r?\n/).map((line, index) => (
            
                                <p key={index} className="font-medium">
            
                                  {line.trim()}
            
                                </p>
            
                              ))
            
                            : <p>N/A</p>}
            
                        </div>
            
                      </div>
            
            
            
                      {/* Facilities */}
            
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#CAF0F8] to-[#ADE8F4] shadow-lg">
            
                        <h4 className="font-bold text-[#03045E] mb-3 text-lg">🏝️ Facility</h4>
            
                        <p className="text-sm text-[#023E8A] whitespace-pre-line">
            
                          {product.care || 'Care instructions not available'}
            
                        </p>
            
                      </div>
            
                    </motion.div>
            
                  )}
            
            
            
                  {/* --- Specifications Tab --- */}
            
                  {activeTab === 'specifications' && (
            
                    <motion.div
            
                      key="specifications"
            
                      initial={{ opacity: 0, y: 30 }}
            
                      animate={{ opacity: 1, y: 0 }}
            
                      exit={{ opacity: 0, y: -30 }}
            
                      transition={{ duration: 0.4 }}
            
                      className="space-y-6"
            
                    >
            
                      {/* Basic Info */}
            
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#CAF0F8] to-[#ADE8F4] shadow-lg">
            
                        <h4 className="font-bold text-[#03045E] mb-3 text-lg">ℹ️ Basic Information</h4>
            
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
                          <div>
            
                            <span className="text-xs text-gray-600">Product Name</span>
            
                            <p className="text-base font-semibold text-[#023E8A]">{product.name}</p>
            
                          </div>
            
                          <div>
            
                            <span className="text-xs text-gray-600">Location</span>
            
                            <p className="text-base font-semibold text-[#023E8A]">{product.category}</p>
            
                          </div>
            
                        </div>
            
                      </div>
            
            
            
                      {/* Pricing Info */}
            
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#CAF0F8] to-[#ADE8F4] shadow-lg">
            
                        <h4 className="font-bold text-[#03045E] mb-3 text-lg">💵 Pricing</h4>
            
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
                          <div>
            
                            <span className="text-xs text-gray-600">Adult Ticket</span>
            
                            <p className="font-bold text-xl text-[#0077B6]">₹{product.adultprice?.toFixed(2) || 'N/A'}</p>
            
                          </div>
            
                          <div>
            
                            <span className="text-xs text-gray-600">Child Ticket</span>
            
                            <p className="font-bold text-xl text-[#0077B6]">₹{product.childprice?.toFixed(2) || 'N/A'}</p>
            
                          </div>
            
                   
            
                        </div>
            
                      </div>
            
            
            
                      {/* Description */}
            
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#CAF0F8] to-[#ADE8F4] shadow-lg">
            
                        <h4 className="font-bold text-[#03045E] mb-3 text-lg">📖 Description</h4>
            
                        <p className="text-base text-[#023E8A] leading-relaxed">{product.description || 'No description available.'}</p>
            
                      </div>
            
                    </motion.div>
            
                  )}
            
            
            
                  {/* --- FAQ Tab --- */}
            
                  {activeTab === 'FAQ' && (
            
                    <motion.div
            
                      key="FAQ"
            
                      initial={{ opacity: 0, y: 30 }}
            
                      animate={{ opacity: 1, y: 0 }}
            
                      exit={{ opacity: 0, y: -30 }}
            
                      transition={{ duration: 0.4 }}
            
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
            
                    >
            
                      {/* Info */}
            
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#CAF0F8] to-[#ADE8F4] shadow-lg">
            
                        <h4 className="font-bold text-[#03045E] mb-3 text-lg">🌞 Park Information</h4>
            
                        <ul className="space-y-2 text-[#023E8A]">
            
                          <li>• Opening Hours: 10:00 AM – 7:00 PM</li>
            
                          <li>• Tickets available online & gate</li>
            
                          <li>• Free entry for kids below 3 yrs</li>
            
                          <li>• Lockers & changing rooms</li>
            
                          <li>• Food courts inside park</li>
            
                        </ul>
            
                      </div>
            
                     
            
                      {/* Safety */}
            
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#CAF0F8] to-[#ADE8F4] shadow-lg">
            
                        <h4 className="font-bold text-[#03045E] mb-3 text-lg">🛟 Safety & Policies</h4>
            
                        <ul className="space-y-2 text-[#023E8A]">
            
                          <li>• Swimwear is mandatory</li>
            
                          <li>• Outside food not allowed</li>
            
                          <li>• Follow lifeguards at all times</li>
            
                          <li>• Pregnant women avoid rides</li>
            
                          <li>• First aid available on-site</li>
            
                        </ul>
            
                      </div>
            
                    </motion.div>
            
                  )}
            
            
            
                  {/* --- Reviews Tab --- */}
            
                  {activeTab === 'reviews' && (
            
                    <motion.div
            
                      key="reviews"
            
                      initial={{ opacity: 0, y: 30 }}
            
                      animate={{ opacity: 1, y: 0 }}
            
                      exit={{ opacity: 0, y: -30 }}
            
                      transition={{ duration: 0.4 }}
            
                      className="space-y-6"
            
                    >
            
                      {reviewsLoading ? (
            
                        <div className="flex items-center justify-center py-10 text-blue-600 font-medium">
            
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            
                          <span className="ml-3">Loading reviews...</span>
            
                        </div>
            
                      ) : (
            
                        <>
            
                          <ReviewForm
            
                            productId={product._id}
            
                            existingReview={userReview}
            
                            isEditing={isEditingReview}
            
                            onStartEdit={() => setIsEditingReview(true)}
            
                            onCancelEdit={() => setIsEditingReview(false)}
            
                            onReviewSubmitted={(review) => {
            
                              handleReviewSubmitted(review);
            
                              setIsEditingReview(false);
            
                            }}
            
                            onReviewUpdated={(review) => {
            
                              handleReviewUpdated(review);
            
                              setIsEditingReview(false);
            
                            }}
            
                            onReviewDeleted={() => {
            
                              handleReviewDeleted();
            
                              setIsEditingReview(false);
            
                            }}
            
                          />
            
            
            
                          <ReviewList
            
                            reviews={reviews}
            
                            averageRating={averageRating}
            
                            totalReviews={reviews.length}
            
                          />
            
                        </>
            
                      )}
            
                    </motion.div>
            
                  )}
            
                </AnimatePresence>
            
              </div>
            
            </div>
            

            {/* -------------------- NEW BOOKING SECTION REF -------------------- */}
            <div ref={bookingSectionRef} className="space-y-6 pt-4 border-t-2 border-dashed border-[#0096C7]">
                {/* Date Picker Section */}
                <div className="mt-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-[#90E0EF] to-[#48CAE4] p-4 rounded-xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-3"
                >
                    <label className="text-sm font-semibold text-[#03045E] flex items-center gap-2">
                    📅 Select Date:
                    </label>
                    <input
                    type="date"
                    value={BookingDate} // Controlled component
                    className="px-4 py-2 rounded-lg border border-[#0077B6]/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:border-[#0077B6] text-[#03045E] bg-white"
                    min={new Date().toISOString().split("T")[0]}  // Block past dates
                    onChange={(e) => setBookingDate(e.target.value)}
                    />
                </motion.div>
                </div>

                 {/* Quantity + Actions */}
                <div className="flex flex-wrap items-center gap-4">
                    {/* Adult Qty */}
                    <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">👨 Adult:</label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                        <button
                        onClick={() => handleadultQuantityChange(adultquantity - 1)}
                        className="px-3 py-2 hover:bg-[#CAF0F8] transition-colors disabled:opacity-50"
                        disabled={adultquantity <= 0}
                        >
                        -
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300 text-md font-semibold text-[#03045E]">
                        {adultquantity}
                        </span>
                        <button
                        onClick={() => handleadultQuantityChange(adultquantity + 1)}
                        className="px-3 py-2 hover:bg-[#CAF0F8] transition-colors"
                        >
                        +
                        </button>
                    </div>
                    </div>

                    {/* Child Qty */}
                    <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">👧 Child:</label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                        <button
                        onClick={() => handlechildQuantityChange(childquantity - 1)}
                        className="px-3 py-2 hover:bg-[#CAF0F8] transition-colors disabled:opacity-50"
                        disabled={childquantity <= 0}
                        >
                        -
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300 text-md font-semibold text-[#03045E]">
                        {childquantity}
                        </span>
                        <button
                        onClick={() => handlechildQuantityChange(childquantity + 1)}
                        className="px-3 py-2 hover:bg-[#CAF0F8] transition-colors"
                        >
                        +
                        </button>
                    </div>
                    </div>
                </div>

                {/* Ticket Summary */}
                <div className="w-full flex justify-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-lg bg-gradient-to-br from-[#00B4D8] via-[#0096C7] to-[#0077B6] rounded-2xl shadow-xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-[#023E8A] text-white text-center py-3 text-lg font-bold tracking-wide flex items-center justify-center gap-2">
                    🎟️ Ticket Summary
                    </div>

                    {/* Table */}
                    <table className="w-full text-sm text-white">
                    <thead className="bg-[#03045E]/80">
                        <tr>
                        <th className="px-4 py-3 text-left">Ticket Type</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-4 py-3 text-right">Price</th>
                        <th className="px-4 py-3 text-right">Total</th>
                        </tr>
                    </thead>
                   <tbody>
          {/* Adult */}
          <motion.tr 
            className="border-t border-white/30 hover:bg-white/10 transition"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <td className="px-4 py-3 font-medium">👨 Adult above 8 year</td>
            <td className="px-4 py-3 text-center">{adultquantity}</td>
            <td className="px-4 py-3 text-right">₹{product.adultprice}</td>
            <td className="px-4 py-3 text-right">₹{adultquantity * product.adultprice}</td>
          </motion.tr>

          {/* Child */}
          <motion.tr 
            className="border-t border-white/30 hover:bg-white/10 transition"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <td className="px-4 py-3 font-medium">👧 Child 3 to 8 year</td>
            <td className="px-4 py-3 text-center">{childquantity}</td>
            <td className="px-4 py-3 text-right">₹{product.childprice}</td>
            <td className="px-4 py-3 text-right">₹{childquantity * product.childprice}</td>
          </motion.tr>
        </tbody>

                    {/* Footer */}
                    <tfoot>
                        <motion.tr 
                        className="bg-[#48CAE4] text-[#03045E] font-bold text-base"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        >
                        <td className="px-4 py-3 text-left" colSpan={3}>💰 Grand Total</td>
                        <td className="px-4 py-3 text-right">
                            ₹{grandTotal.toFixed(2)}
                        </td>
                        </motion.tr>
                    </tfoot>
                    </table>
                </motion.div>
                </div>
                
                {/* MODIFIED: Book button now opens the terms modal */}
                <div className="flex items-center gap-4">
                    <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleOpenTermsModal}
                    disabled={isOutOfStock}
                    className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full font-bold text-lg transition-all shadow-lg ${
                        isOutOfStock
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:shadow-xl'
                    }`}
                    >
                    {isOutOfStock ? 'CURRENTLY UNAVAILABLE' : 'BOOK NOW'}
                    </motion.button>

                    {/* Share Button */}
                    <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 bg-white border border-gray-300 rounded-full hover:bg-[#CAF0F8] transition-colors shadow-md"
                    onClick={handleShare}
                    >
                    <ShareIcon className="h-5 w-5 text-gray-600" />
                    </motion.button>
                </div>
            </div>

          
            </motion.div>
        </div>

      

        {/* Related Products */}
        <div className="mt-8">
            <div>
            <MostLoved />
            </div>
        </div>
      </div>

       {/* -------------------- NEW FIXED BOOK NOW BUTTON -------------------- */}
   <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
    // Positioned from the left, no longer stretching full-width
    className="fixed bottom-20 left-6 md:bottom-6 md:left-6 z-40" 
    >
    <button
    onClick={scrollToBooking}
    // Removed w-50 and changed to rounded-full for all screen sizes
    className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#03045E] to-[#0077B6] text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-blue-400/50 transition-all duration-300 transform hover:-translate-y-1"
    >
    <span>Book Now</span>
    <span className="hidden md:inline-block">-</span>
    <div className="px-3 py-1 bg-white/20 rounded-full text-sm">
        ₹{grandTotal.toFixed(2)}
    </div>
    </button>
</motion.div>

      {/* Full Size Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleModalClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-7xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleModalClose}
                className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200"
                aria-label="Close modal"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              {/* Main Image */}
              <div className="relative w-full flex items-center justify-center" style={{ maxHeight: '90vh' }}>
                <img
                  src={productImages[modalSelectedImage]}
                  alt={`${product.name} - Full size view`}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  onError={e => {
                    e.target.onerror = null;
                    if (productImages[modalSelectedImage] !== config.fixImageUrl(product.image)) {
                      e.target.src = config.fixImageUrl(product.image);
                    } else {
                      e.target.src = 'https://placehold.co/800x600/e2e8f0/475569?text=Product+Image';
                    }
                  }}
                />

                {/* Navigation Arrows */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={handleModalPreviousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-[#0077B6] p-4 rounded-full transition-all duration-200 shadow-lg border-2 border-[#0077B6]/30"
                      aria-label="Previous image"
                    >
                      <ChevronLeftIcon className="h-8 w-8" />
                    </button>
                    <button
                      onClick={handleModalNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-[#0077B6] p-4 rounded-full transition-all duration-200 shadow-lg border-2 border-[#0077B6]/30"
                      aria-label="Next image"
                    >
                      <ChevronRightIcon className="h-8 w-8" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {productImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                    {modalSelectedImage + 1} / {productImages.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {productImages.length > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setModalSelectedImage(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        modalSelectedImage === index 
                          ? 'border-white shadow-lg' 
                          : 'border-white/30 hover:border-white/60'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} - Thumbnail ${index + 1}`}
                        className="w-full h-full object-fit bg-white"
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/64x64/e2e8f0/475569?text=Image';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsShareModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Share Product</h3>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Share Options */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Native Share */}
                  <button
                    onClick={() => handleShareOption('native')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <ShareIcon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Share</span>
                  </button>

                  {/* WhatsApp */}
                  <button
                    onClick={() => handleShareOption('whatsapp')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={() => handleShareOption('facebook')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Facebook</span>
                  </button>

                  {/* Twitter */}
                  <button
                    onClick={() => handleShareOption('twitter')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Twitter</span>
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={() => handleShareOption('copy')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Copy Link</span>
                  </button>

                  {/* Cancel */}
                  <button
                    onClick={() => setIsShareModalOpen(false)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <XMarkIcon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Cancel</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Full Size Image Modal */}
      {/* ... Your existing image modal code ... */}

      {/* Share Modal */}
      {/* ... Your existing share modal code ... */}

      {/* -------------------- NEW TERMS & CONDITIONS MODAL -------------------- */}
      <AnimatePresence>
        {isTermsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsTermsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-[#E0F7FA] to-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden border-2 border-[#00B4D8]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="h-7 w-7" />
                    <h3 className="text-xl font-bold">Booking Confirmation</h3>
                </div>
                <button
                  onClick={() => setIsTermsModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Body Content */}
              <div className="p-6 space-y-4">
                <h4 className="text-lg font-semibold text-[#03045E]">Terms and Conditions</h4>
                <div className="text-sm text-gray-600 max-h-48 overflow-y-auto space-y-2 pr-2">
                {product.terms.split('\n').map((line, index) => (
                    <p key={index} className="whitespace-pre-wrap"> {line}</p>
                ))}
                
                 </div>
                 {/* Summary inside modal */}
                <div className="bg-[#CAF0F8] p-4 rounded-lg border border-[#90E0EF]">
                    <h5 className="font-bold text-[#023E8A] mb-2">Your Booking Summary</h5>
                    <div className="flex justify-between items-center text-md">
                        <span className="text-gray-700">Total Amount Payable:</span>
                        <span className="font-extrabold text-2xl text-[#0077B6]">₹{grandTotal.toFixed(2)}</span>
                    </div>
                     <p className="text-xs text-center text-gray-500 mt-2">You will be redirected to the payment gateway.</p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 p-4 bg-gray-50 border-t">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsTermsModalOpen(false)}
                  className="px-5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleProceedToCheckout}
                  className="px-6 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                >
                  I Accept & Proceed to Pay
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default ProductView;