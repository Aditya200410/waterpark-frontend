import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';

import Loader from './components/Loader';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Categories from './components/Categories/Categories';
import FeaturedProducts from './components/Products/FeaturedProducts';
import WeeklyBestsellers from './components/Products/WeeklyBestsellers';
import Testimonials from './components/Testimonials/Testimonials';
import Footer from './components/Footer/Footer';
import MissionVision from './components/MissionVision/MissionVision';
import FAQ from './components/FAQ/FAQ';
import ContactPage from './pages/ContactPage';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Signup from './pages/Signup';  
import Account from './pages/Account';  
import Wishlist from './pages/Wishlist';
import ProductView from './pages/ProductView';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import useScrollToTop from './hooks/useScrollToTop';
import MostLoved from './components/Products/MostLoved';
import Cart from './components/Cart';
import Checkout from './pages/Checkout';
import Toast from './components/Toast/Toast';
import ForgotPassword from './pages/ForgotPassword';
import AboutUs from './pages/AboutUs';
import OrderConfirmation from './pages/OrderConfirmation';


import Policies from './pages/Policies';
import PaymentStatus from './pages/PaymentStatus';
import SEO from './components/SEO/SEO';
import { seoConfig, defaultSEO } from './config/seo';
import OffersPage from './pages/OffersPage';
import BlogPage from './pages/BlogPage';
import OurPartners from './components/OurPartners';
import Blogview from './pages/Blogview';
import Gallery from './pages/Gallery';
import WaterparkTicket from './pages/Ticket';
import Tickets from './pages/Tickets';
import Category from './components/Categories/Category';
import WhatsAppButton from './components/Whatsappicon';
import WaterParkCursor from './components/WaterParkCursor/WaterParkCursor';


// Protected Route component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader size="md" text="Loading..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
};

// Simple Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  useScrollToTop();
  const { toast, setToast, setSellerTokenFromURL, sellerToken, updateURLWithCurrentSellerToken } = useCart();
  const { loading: authLoading } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // SEO configuration based on current route
  const getSEOConfig = () => {
    const path = location.pathname;
    
    if (path === '/') return seoConfig.home;
    if (path === '/waterpark') return seoConfig.shop;
    if (path === '/about') return seoConfig.about;
    if (path === '/contact') return seoConfig.contact;
    if (path === '/login') return seoConfig.login;
    if (path === '/signup') return seoConfig.signup;
    if (path === '/policies') return seoConfig.policies;
   
    
    return defaultSEO;
  };

  // Global seller token handler
  useEffect(() => {
    const sellerToken = searchParams.get('seller');
    if (sellerToken) {
      setSellerTokenFromURL(sellerToken);
    }
  }, [location, searchParams, setSellerTokenFromURL]);

  // Ensure URL has seller token when navigating
  useEffect(() => {
    if (sellerToken && !searchParams.get('seller')) {
      updateURLWithCurrentSellerToken();
    }
  }, [sellerToken, location.pathname, updateURLWithCurrentSellerToken]);

  // Show loading only if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="md" text="Loading..." showLogo={true} />
      </div>
    );
  }
// 👇 Add this useEffect
  useEffect(() => {
    window.history.scrollRestoration = "manual"; // disable browser scroll restore
    window.scrollTo(0, 0); // always go to top on reload
  }, []);
  const seoData = getSEOConfig();
  
  return (
    <div className="min-h-screen relative z-0 pt-20 bg-transparent">
      <SEO {...seoData} />
      <Header/>
     <div>
      {/* 1. Background Video */}
      
      
   <div className="relative">
      <Routes>
        <Route path="/" element={
          <main>
            <ErrorBoundary>
              <Hero />
            </ErrorBoundary>
            <ErrorBoundary>
              <Categories/>
            </ErrorBoundary>
         
            <ErrorBoundary>
              <WeeklyBestsellers />
            </ErrorBoundary>
     
            <ErrorBoundary>
              <Testimonials />
            </ErrorBoundary>
            <ErrorBoundary>
              <OurPartners/>
            </ErrorBoundary>
            <ErrorBoundary>
              <MissionVision />
            </ErrorBoundary>
          </main>
         
        } />
     
    
        <Route path="/blog" element={<BlogPage/>} />
        <Route path="/location" element={<Category/>} />
        <Route path="/Offers" element={<OffersPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/waterparks" element={<Shop />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
             <Route path="/ticket" element={<WaterparkTicket/>} />
             <Route path="/booking/:ticketId" element={<WaterparkTicket/>} />
               <Route path="/tickets" element={<Tickets/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/wishlist" element={<Wishlist />} />
      
        <Route path='/gallery' element={<Gallery />} />
   
    
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
        <Route path="/waterpark/:idOrSlug" element={<ProductView />} />

               <Route path="/blog/:id" element={<Blogview />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/policies" element={<Policies />} />
      
        <Route path="/payment/status" element={<PaymentStatus />} />

      </Routes>
      <Footer />
      
    
      
       <Toaster position="top-right" />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          className="z-[91111]"
        />
      )}
        <WhatsAppButton />
        <WaterParkCursor />
    </div>
    </div>
     </div>
  );
}

function App() {
  return (
    <div className="relative z-[15]">
    <ErrorBoundary>
      <CartProvider>
        <AuthProvider>
       
            <Router>
              <AppContent />
            </Router>
        
        </AuthProvider>
      </CartProvider>
    </ErrorBoundary>
    </div>
  );
}

export default App;
