import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  ArrowLeftOnRectangleIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ShoppingCartIcon, 
  ClockIcon, 
  TrashIcon, 
  PlusIcon, 
  MinusIcon,
  CogIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  TruckIcon,
  GiftIcon,
  UserCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import orderService from '../services/orderService';
import config from '../config/config.js';
import OrderDetailsModal from '../components/OrderDetailsModal/OrderDetailsModal';

// PDF libs
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Helper to get tab from URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Account = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState(() => query.get('tab') || 'orders');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice, getItemImage } = useCart();
  const { user, logout, updateProfile, isAuthenticated } = useAuth();

  // Refs to bill sections for PDF export
  const billRefs = useRef({});

  // Water-park palette helpers
  const aquaPill = 'bg-cyan-50 text-cyan-700 border-cyan-200';
  const indigoPill = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  const tealPill = 'bg-teal-50 text-teal-700 border-teal-200';
  const greenPill = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  const grayPill = 'bg-gray-50 text-gray-700 border-gray-200';

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
      case 'confirmed':
        return aquaPill;
      case 'manufacturing':
        return tealPill;
      case 'shipped':
        return indigoPill;
      case 'delivered':
        return greenPill;
      default:
        return grayPill;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <ClockIcon className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'manufacturing':
        return <CogIcon className="h-4 w-4" />;
      case 'shipped':
        return <TruckIcon className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  // Function to handle tab changes and update URL
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const newUrl = `/account?tab=${tabId}`;
    navigate(newUrl, { replace: true });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      setLoading(false);
      if (user?.name) toast.success(`Welcome back, ${user?.name}!`);
    }
  }, [isAuthenticated, navigate, user]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setFormData(prev => ({
      ...prev,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
    }));
  }, [user, navigate]);

  useEffect(() => {
    if (user?.email) fetchOrders();
    // eslint-disable-next-line
  }, [user?.email]);

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  useEffect(() => {
    const tab = query.get('tab');
    if (tab) setActiveTab(tab);
  }, [location.search]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === filter));
    }
  }, [filter, orders]);

  const fetchOrders = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const data = await orderService.getOrdersByEmail(user.email);
      if (data) {
       
        setOrders(data);
        setFilteredOrders(data);
      } else {
        throw new Error(data.message || 'No success field in response');
      }
    } catch (error) {
      let errorMsg = error?.message || 'Failed to fetch orders';
      if (error?.response?.data?.message) errorMsg = error.response.data.message;
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity);
      toast.success('Ticket updated successfully');
    } catch {
      toast.error('Failed to update ticket');
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success('Removed from ticket');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success('Ticket cleared');
    } catch {
      toast.error('Failed to clear ticket');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await updateProfile(updateData);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }));
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } catch {
      toast.error('Failed to logout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Download bill/ticket PDF
  const handleDownloadBill = async (orderId) => {
    try {
      const target = billRefs.current[orderId];
      if (!target) return;

      // temporarily add a white background for clean capture
      const originalBg = target.style.backgroundColor;
      target.style.backgroundColor = '#ffffff';

      const canvas = await html2canvas(target, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;
      let heightLeft = imgHeight;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`WaterPark_Ticket_${orderId}.pdf`);

      // restore bg
      target.style.backgroundColor = originalBg || '';
    } catch (e) {
      console.error(e);
      toast.error('Unable to generate PDF');
    }
  };

  const tabs = [
    { id: 'orders', label: 'Tickets', icon: GiftIcon },
  ];

  // Decorative bubbles
  const Bubble = ({ className }) => (
    <span
      className={`absolute rounded-full opacity-30 blur-sm animate-[float_6s_ease-in-out_infinite] ${className}`}
      style={{
        background:
          'radial-gradient(circle at 30% 30%, rgba(255,255,255,.9), rgba(255,255,255,.2) 60%, rgba(255,255,255,0) 70%)'
      }}
    />
  );

  // JSX for the orders tab
  const OrdersTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Wavey title with tiny surfboard SVG */}
            <svg width="36" height="36" viewBox="0 0 24 24" className="shrink-0">
              <path d="M4 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" fill="none" stroke="#06b6d4" strokeWidth="1.5" />
              <path d="M10 6c3 2 5 4 6 6 1.2 2.4-.4 5.5-3.2 6.3" fill="none" stroke="#0ea5e9" strokeWidth="1.5"/>
            </svg>
            <h2 className="text-2xl font-semibold text-cyan-900">Your Tickets</h2>
          </div>
          <div className="flex gap-2">
           
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-cyan-200 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 -m-2">
                <svg viewBox="0 0 120 30" className="h-6 w-24">
                  <path d="M0 15 Q 20 0, 40 15 T 80 15 T 120 15" fill="none" stroke="#67e8f9" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 relative overflow-hidden rounded-2xl border border-cyan-100">
            <div className="absolute -top-16 -left-10 opacity-30">
              <svg width="220" height="120" viewBox="0 0 1440 320">
                <path fill="#cffafe" d="M0,224L48,197.3C96,171,192,117,288,90.7C384,64,480,64,576,80C672,96,768,128,864,149.3C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L0,320Z"></path>
              </svg>
            </div>
            <ShoppingCartIcon className="mx-auto h-12 w-12 text-cyan-400" />
            <h3 className="mt-2 text-sm font-medium text-cyan-900">No tickets found</h3>
            <p className="mt-1 text-sm text-cyan-700">Dive into fun—book your first ticket!</p>
            <div className="mt-6">
              <Link
                to="/shop"
                className="inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-xl text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400"
              >
                Explore Rides
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="relative rounded-2xl border border-cyan-100 bg-gradient-to-br from-white to-cyan-50 p-6 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Decorative bubbles */}
                <Bubble className="h-14 w-14 left-3 -top-4" />
                <Bubble className="h-10 w-10 right-10 -bottom-4" />
                <Bubble className="h-8 w-8 left-1/2 top-8" />

                {/* Wave ribbon */}
                <div className="absolute -top-1 left-0 right-0">
                  <svg viewBox="0 0 1440 60" className="w-full h-8">
                    <path fill="#a5f3fc" d="M0,32L48,37.3C96,43,192,53,288,48C384,43,480,21,576,18.7C672,16,768,32,864,42.7C960,53,1056,59,1152,53.3C1248,48,1344,32,1392,24L1440,16L1440,0L0,0Z"></path>
                  </svg>
                </div>

                {/* Printable BILL/TICKET (captured for PDF) */}
                <div
                  ref={(el) => (billRefs.current[order._id] = el)}
                  className="bg-white rounded-xl border border-cyan-100 p-4"
                >
                  {/* Header */}
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      {/* Ticket logo SVG */}
                      <svg width="36" height="36" viewBox="0 0 24 24" className="shrink-0">
                        <rect x="3" y="6" width="18" height="12" rx="2" ry="2" fill="#06b6d4" opacity=".15"/>
                        <path d="M6 9h12M6 12h8M6 15h6" stroke="#06b6d4" strokeWidth="1.5" fill="none"/>
                      </svg>
                      <div>
                        <p className="text-xs text-cyan-600 font-semibold tracking-wide">AquaSplash Water Park</p>
                        <h3 className="text-lg font-bold text-cyan-900">Entry Ticket & Bill</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-cyan-600">Order Date</p>
                      <p className="font-medium text-cyan-900">
                       
                      </p>
                    </div>
                  </div>

                  {/* Order IDs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    <div>
                      <p className="text-xs text-cyan-600">Order ID</p>
                      <p className="font-mono text-sm">{order._id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-cyan-600">Payment</p>
                      <p className="text-sm font-medium capitalize">
                        {order.paymentStatus || 'pending'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-cyan-600">Status</p>
                      <p className="text-sm font-medium capitalize">{order.orderStatus}</p>
                    </div>
                  </div>

                  {/* Items */}
                

                  {/* Summary */}
                  <div className="mt-4 pt-4 border-t border-cyan-100">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-2">
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          <span className="capitalize">{order.orderStatus}</span>
                        </div>
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${
                          order.paymentStatus === 'completed' 
                            ? greenPill
                            : order.paymentStatus === 'failed'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : aquaPill
                        }`}>
                          <CreditCardIcon className="h-4 w-4" />
                          <span className="capitalize">Payment: {order.paymentStatus || 'pending'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-cyan-700">Total Amount</p>
                          <p className="text-xl font-extrabold text-cyan-900">₹{order.totalAmount.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => setSelectedOrderId(order._id)}
                          className="inline-flex items-center gap-2 px-4 py-2 border border-cyan-200 text-cyan-900 shadow-sm text-sm font-medium rounded-xl bg-white hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        >
                          <EyeIcon className="h-4 w-4" />
                          View Details
                        </button>
                      </div>
                    </div>

                    {/* Address */}
                    {order?.address && (
                      <div className="mt-3 text-sm text-cyan-800">
                        <p>
                          <span className="font-medium">Guest Address:</span>{' '}
                          {order.address.street}, {order.address.city}, {order.address.state} {order.address.pincode}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions row (outside capture area) */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                

                 
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Water-park header backdrop */}
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-cyan-50 to-white relative">
        {/* top waves */}
        <div className="absolute inset-x-0 -top-1">
          <svg viewBox="0 0 1440 80" className="w-full h-16">
            <path fill="#e0f2fe" d="M0,64L60,53.3C120,43,240,21,360,16C480,11,600,21,720,37.3C840,53,960,75,1080,69.3C1200,64,1320,32,1380,16L1440,0L1440,0L0,0Z"></path>
          </svg>
        </div>

        {/* floating bubbles around */}
        <Bubble className="h-24 w-24 right-6 top-24" />
        <Bubble className="h-12 w-12 left-10 top-56" />
        <Bubble className="h-16 w-16 right-24 bottom-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg width="44" height="44" viewBox="0 0 24 24" className="shrink-0">
                  <path d="M4 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" fill="none" stroke="#06b6d4" strokeWidth="1.5" />
                  <circle cx="7" cy="7" r="2" fill="#22d3ee" opacity=".6"/>
                </svg>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-cyan-900">My Aqua Account</h1>
                  <p className="text-cyan-700 mt-1">
                    Hey {user?.name || 'Guest'} — manage your profile & tickets. Surf’s up! 🏄‍♂️
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center space-x-2 px-6 py-3 bg-rose-500 text-white rounded-2xl hover:bg-rose-600 transition-colors shadow-lg"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
              </motion.button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl shadow-lg p-6 sticky top-8 bg-white/70 backdrop-blur border border-cyan-100"
              >
                <nav className="space-y-2">
                  {[
                    { id: 'orders', label: 'Tickets', icon: GiftIcon },
                    { id: 'profile', label: 'Profile', icon: UserCircleIcon },
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 border ${
                        activeTab === tab.id
                          ? 'bg-cyan-600 text-white border-cyan-600 shadow'
                          : 'text-cyan-900 bg-white hover:bg-cyan-50 border-cyan-100'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  ))}
                </nav>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-2xl shadow-lg border border-cyan-100 p-6"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-cyan-900">Profile Information</h3>
                    </div>

                    {isEditing ? (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-cyan-800 mb-2">Full Name</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-cyan-200 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-cyan-800 mb-2">Email</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              disabled
                              className="w-full px-4 py-3 border border-cyan-200 rounded-lg bg-cyan-50 text-cyan-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-cyan-800 mb-2">Phone</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-cyan-200 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-cyan-800 mb-2">Address</label>
                            <textarea
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              rows="3"
                              className="w-full px-4 py-3 border border-cyan-200 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="border-t border-cyan-100 pt-6">
                          <h4 className="text-lg font-medium text-cyan-900 mb-4">Change Password (Optional)</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-cyan-800 mb-2">Current Password</label>
                              <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-cyan-200 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-cyan-800 mb-2">New Password</label>
                              <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-cyan-200 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-cyan-800 mb-2">Confirm New Password</label>
                              <input
                                type="password"
                                name="confirmNewPassword"
                                value={formData.confirmNewPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-cyan-200 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>

                        {error && (
                          <div className="flex items-center space-x-2 p-4 bg-rose-50 border border-rose-200 rounded-lg">
                            <XCircleIcon className="h-5 w-5 text-rose-500" />
                            <span className="text-rose-700">{error}</span>
                          </div>
                        )}

                        {message && (
                          <div className="flex items-center space-x-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                            <span className="text-emerald-700">{message}</span>
                          </div>
                        )}

                        <div className="flex justify-end space-x-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-3 border border-cyan-200 text-cyan-900 rounded-lg hover:bg-cyan-50 transition-colors"
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                          >
                            Save Changes
                          </motion.button>
                        </div>
                      </form>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-cyan-700 mb-1">Full Name</label>
                          <p className="text-lg font-medium text-cyan-900">{user?.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-cyan-700 mb-1">Email</label>
                          <p className="text-lg font-medium text-cyan-900">{user?.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-cyan-700 mb-1">Phone</label>
                          <p className="text-lg font-medium text-cyan-900">{user?.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-cyan-700 mb-1">Address</label>
                          <p className="text-lg font-medium text-cyan-900">{user?.address || 'Not provided'}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'cart' && (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-2xl shadow-lg border border-cyan-100 p-6"
                  >
                    <h3 className="text-xl font-semibold text-cyan-900 mb-6">Ticket Cart</h3>
                    
                    {cartItems.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingCartIcon className="mx-auto h-16 w-16 text-cyan-300 mb-4" />
                        <h3 className="text-lg font-medium text-cyan-900 mb-2">Your Ticket is empty</h3>
                        <p className="text-cyan-700 mb-6">Add passes and splash into fun!</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate('/shop')}
                          className="px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors"
                        >
                          Explore Rides
                        </motion.button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {cartItems.map((item) => (
                          <motion.div
                            key={item.productId || item.product?._id || item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-4 bg-cyan-50 rounded-xl"
                          >
                            <div className="flex items-center gap-4">
                              <img
                                src={config.fixImageUrl(getItemImage(item))}
                                alt={item.product?.name || item.name}
                                className="h-16 w-16 object-cover rounded-lg ring-1 ring-cyan-100"
                              />
                              <div>
                                <h4 className="font-medium text-cyan-900">{item.product?.name || item.name}</h4>
                                <p className="text-sm text-cyan-700">₹{(item.product?.price || item.price).toFixed(2)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 bg-white rounded-lg p-2 border border-cyan-100">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleUpdateQuantity(item.productId || item.product?._id || item.id, item.quantity - 1)}
                                  className="p-1 rounded-full hover:bg-cyan-50"
                                  disabled={item.quantity <= 1}
                                >
                                  <MinusIcon className="h-4 w-4" />
                                </motion.button>
                                <span className="font-medium px-2">{item.quantity}</span>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleUpdateQuantity(item.productId || item.product?._id || item.id, item.quantity + 1)}
                                  className="p-1 rounded-full hover:bg-cyan-50"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                </motion.button>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleRemoveFromCart(item.productId || item.product?._id || item.id)}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                          
                        <div className="border-t border-cyan-100 pt-6">
                          <div className="flex justify-between items-center mb-4">
                            <div className="text-lg font-semibold text-cyan-900">
                              Total: ₹{getTotalPrice().toFixed(2)}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleClearCart}
                              className="text-sm text-rose-600 hover:text-rose-800"
                            >
                              Clear Ticket
                            </motion.button>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => navigate('/shop')}
                              className="flex-1 px-6 py-3 border border-cyan-200 text-cyan-900 rounded-xl hover:bg-cyan-50 transition-colors"
                            >
                              Continue Exploring
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => navigate('/checkout')}
                              className="flex-1 px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors"
                            >
                              Proceed to Checkout
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'orders' && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-2xl shadow-lg border border-cyan-100 p-6"
                  >
                    <h3 className="text-xl font-semibold text-cyan-900 mb-6">Ticket History</h3>
                    <OrdersTab />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrderId && (
          <OrderDetailsModal
            orderId={selectedOrderId}
            onClose={() => setSelectedOrderId(null)}
          />
        )}
      </AnimatePresence>

      {/* keyframes for floating bubbles (Tailwind arbitrary) */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </>
  );
};

export default Account;
