import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, ChevronDown, Search, User, Heart, Home, ShoppingCart, Phone, Mail } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import logo from '/logo.png';
import config from '../../config/config.js';
import axios from 'axios';
import Loader from '../Loader';
import { useSellerNavigation } from '../../hooks/useSellerNavigation';
import { Waves, Droplets, Ship, Umbrella, WavesIcon } from "lucide-react";

const Header = () => {
  // All your existing state and functions remain unchanged...
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDesktopSearchFocused, setIsDesktopSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const searchInputRef = useRef(null);
  const searchBarRef = useRef(null);
  const desktopSearchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getTotalItems } = useCart();
  const { user } = useAuth();
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('menu');
  const { navigateToHome, navigateToShop, navigateToProduct } = useSellerNavigation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10); // Trigger effect slightly after scroll starts
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    const handleClickOutside = (e) => {
      if (isSearchOpen && searchBarRef.current && !searchBarRef.current.contains(e.target)) {
        setIsSearchOpen(false);
        setSearchResults([]);
        setSearchQuery('');
      }
      if (isDesktopSearchFocused && desktopSearchRef.current && !desktopSearchRef.current.contains(e.target)) {
        setIsDesktopSearchFocused(false);
        setSearchResults([]);
        setSearchQuery('');
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsDesktopSearchFocused(false);
        setSearchResults([]);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isSearchOpen, isDesktopSearchFocused]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    const debounceSearch = setTimeout(() => {
      fetch(config.API_URLS.SHOP)
        .then(res => res.json())
        .then(data => {
          const q = searchQuery.trim().toLowerCase();
          const results = data.filter(p =>
            (p.name && p.name.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q))
          );
          setSearchResults(results);
          setSearchLoading(false);
        })
        .catch(err => {
          setSearchError('Failed to fetch products');
          setSearchLoading(false);
        });
    }, 300); // Added a debounce for better performance

    return () => clearTimeout(debounceSearch);
  }, [searchQuery]);

  useEffect(() => {
    setCategoriesLoading(true);
    axios.get(config.API_URLS.CATEGORIES)
      .then(response => {
        setDynamicCategories(response.data.categories || []);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setDynamicCategories([]);
      })
      .finally(() => {
        setCategoriesLoading(false);
      });
  }, []);

  const handleCategoryClick = (category, subcategory = null, item = null) => {
    navigate('/shop', {
      state: {
        selectedCategory: {
          main: category,
          sub: subcategory,
          item: item
        }
      }
    });
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery.trim()}`);
      setIsSearchOpen(false);
      setIsDesktopSearchFocused(false);
      setSearchQuery('');
    }
  };

  const handleSearchIconClick = () => {
    setIsSearchOpen((prev) => !prev);
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
  };

  const handleResultClick = (id) => {
    setIsSearchOpen(false);
    setIsDesktopSearchFocused(false);
    setSearchResults([]);
    setSearchQuery('');
    navigateToProduct(id);
  };

  const isActive = (path) => location.pathname === path;

  // REFINED: Combined menu items for a cleaner desktop nav
  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Waterparks', path: '/waterparks' },
    { name: 'Tickets', path: '/tickets' },
    { name: 'Offers', path: '/offers' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  // REFINED: Kept mobile menu comprehensive
  const MmenuItems = [
    { name: 'Home', path: '/' },
    { name: 'Waterparks', path: '/waterparks' },
    { name: 'Offers', path: '/offers' },
    { name: 'Blog', path: '/blog' },
    { name: 'Tickets', path: '/tickets' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const mobileMenuVariants = {
    closed: { x: '-100%', transition: { type: 'tween', duration: 0.4, ease: [0.4, 0.0, 0.2, 1] } },
    open: { x: 0, transition: { type: 'tween', duration: 0.4, ease: [0.4, 0.0, 0.2, 1] } }
  };

  return (
    <>
      {/* Search Overlay - Unchanged Logic, Refined Styling */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed top-0 left-0 w-full z-[20000] bg-white/80 backdrop-blur-lg shadow-2xl border-b border-gray-200 px-4 py-4 flex flex-col items-center mb-10"
            ref={searchBarRef}
          >
            <form onSubmit={handleSearch} className="w-full max-w-2xl relative flex">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for waterparks or tickets..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-6 pr-12 py-3 border border-gray-200 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 shadow-lg bg-white"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-colors duration-200"
              >
                <Search size={20} />
              </button>
            </form>
            <div className="w-full max-w-2xl mt-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              {searchLoading && <div className="flex items-center justify-center py-8 text-cyan-500"><Loader /></div>}
              {searchError && <div className="py-8 text-center text-red-500">{searchError}</div>}
              {!searchLoading && !searchError && searchResults.length > 0 && (
                <ul className="max-h-[60vh] overflow-y-auto">
                  {searchResults.slice(0, 8).map(product => (
                    <li key={product._id} className="flex items-center px-6 py-4 hover:bg-cyan-50 cursor-pointer transition-all duration-200 border-b last:border-b-0 border-gray-100" onClick={() => handleResultClick(product._id)}>
                      <img src={config.fixImageUrl(product.image)} alt={product.name} className="w-14 h-14 object-cover rounded-xl mr-4 border border-gray-200 shadow-sm" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500 truncate">{product.description}</div>
                      </div>
                      <div className="ml-4 text-cyan-600 font-bold whitespace-nowrap">₹{product.price}</div>
                    </li>
                  ))}
                </ul>
              )}
              {!searchLoading && !searchError && searchQuery && searchResults.length === 0 && (
                <div className="py-8 text-center text-gray-500">No results found. Try another search!</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEW: Shorter, Modern Header */}
      <header
        className={`fixed top-0 left-0 w-full z-[10000] transition-all duration-300 ease-in-out mb-10 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20"> {/* Shorter height */}

            {/* Left side: Logo */}
            <motion.button onClick={navigateToHome} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} >
              <img src={logo} alt="Waterpark Chalo" className={`h-16 w-auto transition-all duration-300 ${isScrolled ? '' : 'drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]'}`} />
            </motion.button>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2 bg-white/20 backdrop-blur-sm p-2 rounded-full">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out relative group ${isActive(item.path)
                      ? 'bg-white shadow-md text-cyan-600'
                      : `${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-cyan-700`
                    }`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-cyan-400 rounded-full transition-all duration-300 group-hover:w-4 ${isActive(item.path) ? 'w-4' : ''}`}></span>
                </Link>
              ))}
            </nav>

            {/* Right side: Icons and Auth */}
            <div className="flex items-center space-x-4">
              {/* Desktop Search - now an icon */}
              <motion.button
                onClick={handleSearchIconClick}
                className={`hidden md:inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${isScrolled ? 'text-gray-600 hover:bg-gray-200' : 'text-white hover:bg-white/20'
                  }`}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Open search"
              >
                <Search size={20} />
              </motion.button>

              {/* Auth Button */}
              {user ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
                  <Link to="/account" className="flex items-center px-5 py-2.5 bg-cyan-500 text-white text-sm font-semibold rounded-full hover:bg-cyan-600 transition-all duration-200 shadow-lg">
                    My Account
                  </Link>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
                  <Link to="/login" className={`flex items-center px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 shadow-lg ${isScrolled ? 'bg-cyan-500 text-white hover:bg-cyan-600' : 'bg-white/90 text-cyan-600 hover:bg-white'}`}>
                    Login
                  </Link>
                </motion.div>
              )}

              {/* Mobile Hamburger Menu */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${isScrolled ? 'text-gray-700 hover:bg-gray-200' : 'text-white hover:bg-white/20'}`}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>
      </header>


      {/* Mobile Menu Overlay - Refined Styling */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[20000]" />
            <motion.div
              variants={mobileMenuVariants} initial="closed" animate="open" exit="closed"
              className="fixed top-0 left-0 h-full w-full max-w-sm bg-gradient-to-br from-cyan-400 to-blue-600 z-[20001] flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/20">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}><img src={logo} alt="Waterpark Chalo" className="h-12 w-auto" /></Link>
                <motion.button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white hover:bg-white/10 rounded-full" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <X size={24} />
                </motion.button>
              </div>

              <div className="flex border-b border-white/20">
                <button onClick={() => setActiveMobileTab('menu')} className={`flex-1 py-3 text-center text-sm font-semibold transition-all duration-200 relative ${activeMobileTab === 'menu' ? 'text-white' : 'text-white/70'}`}>
                  MENU
                  {activeMobileTab === 'menu' && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" layoutId="mobileTab" />}
                </button>
                <button onClick={() => setActiveMobileTab('categories')} className={`flex-1 py-3 text-center text-sm font-semibold transition-all duration-200 relative ${activeMobileTab === 'categories' ? 'text-white' : 'text-white/70'}`}>
                  CATEGORIES
                  {activeMobileTab === 'categories' && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" layoutId="mobileTab" />}
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-4">
                {activeMobileTab === 'menu' && (
                  <nav>
                    <ul className="space-y-1">
                      {MmenuItems.map((item) => (
                        <li key={item.path}>
                          <Link to={item.path} onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-4 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200 font-medium text-lg">
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
                {activeMobileTab === 'categories' && (
                  <div>
                    {categoriesLoading ? (
                      <div className="flex items-center justify-center py-12 text-white"><Loader /></div>
                    ) : dynamicCategories.length > 0 ? (
                      <ul className="space-y-1">
                        {dynamicCategories.map(category => (
                          <li key={category._id || category.id}>
                            <button onClick={() => { handleCategoryClick(category.name); setIsMobileMenuOpen(false); }} className="w-full text-left py-3 px-4 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200 font-medium text-lg">
                              {category.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-12 text-white/60">No categories found</div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/20">
                {user ? (
                  <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-4 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200 font-medium">
                    <User size={20} /> My Account
                  </Link>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-4 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200 font-medium">
                    <User size={20} /> Login / Register
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* Mobile Bottom Navigation - Refined Styling */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 border-t border-gray-200 z-[9999] backdrop-blur-lg">
        <nav className="flex justify-around items-center h-16 px-2">
          <Link to="/" className="flex flex-col items-center justify-center text-gray-600 hover:text-cyan-500 transition-colors duration-200 w-1/4">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Home</span>
          </Link>
          <Link to="/waterparks" className="flex flex-col items-center justify-center text-gray-600 hover:text-cyan-500 transition-colors duration-200 w-1/4">
            <WavesIcon className="w-6 h-6" /> {/* Using ShoppingCart for consistency */}
            <span className="text-xs mt-1 font-medium">Parks</span>
          </Link>
          <Link to="/tickets" className="flex flex-col items-center justify-center text-gray-600 hover:text-cyan-500 transition-colors duration-200 relative w-1/4">
            <ShoppingBag className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Tickets</span>
            {getTotalItems && getTotalItems() > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 right-2 bg-cyan-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
                {getTotalItems()}
              </motion.span>
            )}
          </Link>
          <Link to="/account" className="flex flex-col items-center justify-center text-gray-600 hover:text-cyan-500 transition-colors duration-200 w-1/4">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Account</span>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Header;