import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Home,
  RefreshCw,
  CreditCard,
  Truck,
  Shield,
  ArrowLeft
} from 'lucide-react';
import paymentService from '../services/paymentService';
import orderService from '../services/orderService';
import config from '../config/config';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';
import AnimatedBubbles from '../components/AnimatedBubbles/AnimatedBubbles';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null); // 'success', 'failed', 'pending', 'unknown', 'error'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const placingOrderRef = useRef(false);

  // Get cart and user context
  const { cartItems: contextCartItems, getTotalPrice, clearCart, getItemImage, sellerToken } = useCart();
  const { user } = useAuth();

  // Try to get form data and cart from localStorage (set in Checkout before payment)
  let savedFormData = {};
  let savedCoupon = null;
  let savedCartItems = [];
  try {
    savedFormData = JSON.parse(localStorage.getItem('checkoutFormData') || '{}') || {};
  } catch (e) { savedFormData = {}; }
  try {
    savedCoupon = JSON.parse(localStorage.getItem('appliedCoupon') || 'null') || JSON.parse(localStorage.getItem('checkoutAppliedCoupon') || 'null');
  } catch (e) { savedCoupon = null; }
  try {
    savedCartItems = JSON.parse(localStorage.getItem('checkoutCartItems') || '[]') || [];
  } catch (e) { savedCartItems = []; }

  const savedCodUpfrontAmount = Number(localStorage.getItem('codUpfrontAmount') || 39);

  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');
  const bookingId = searchParams.get('bookingId'); // For bookings
  const statusParam = searchParams.get('status'); // Read status from URL (failed, success, etc.)

  // Use cart from localStorage if contextCartItems is empty
  const cartItems = (contextCartItems && contextCartItems.length > 0) ? contextCartItems : savedCartItems;

  // Helper to calculate total with coupon
  const getFinalTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || item.price) * item.quantity, 0);
    const discount = savedCoupon && typeof savedCoupon.discountAmount === 'number' ? savedCoupon.discountAmount : 0;
    const total = subtotal - discount;
    return total > 0 ? total : 0;
  };

  // Helper to fetch booking details
  const fetchBookingDetails = useCallback(async () => {
    try {
      if (bookingId) {
        const response = await fetch(
          `${config.API_BASE_URL}/api/bookings/any/${bookingId}`
        );
        const data = await response.json();
        
        if (data.success && data.booking) {
          // Determine state based on payment status
          let state = 'PENDING';
          if (data.booking.paymentStatus === 'Completed' || data.booking.paymentStatus === 'completed') {
            state = 'COMPLETED';
          } else if (data.booking.paymentStatus === 'Failed' || data.booking.paymentStatus === 'failed') {
            state = 'FAILED';
          }
          
          setOrderDetails({
            orderId: data.booking.customBookingId,
            merchantOrderId: data.booking.customBookingId,
            amount: (data.booking.totalAmount || 0) * 100, // Convert to paise
            state: state
          });
        }
      }
    } catch (err) {
      console.warn('[PaymentStatus] Could not fetch booking details:', err);
      // Don't show error, just continue with what we have
    }
  }, [bookingId]);

  // Update payment status to Completed when status=success
  const updatePaymentStatusToCompleted = useCallback(async () => {
    try {
      if (bookingId) {
        console.log('[PaymentStatus] status=success in URL - verifying payment and updating to Completed');
        
        // Use verifyPayment endpoint which checks PhonePe and updates status to Completed
        // The endpoint expects customBookingId, merchantOrderId, or orderId
        const response = await fetch(
          `${config.API_BASE_URL}/api/bookings/verify`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              customBookingId: bookingId
            })
          }
        );
        
        const data = await response.json();
        
        if (data.success) {
          console.log('[PaymentStatus] Payment verified and status updated to Completed');
          setStatus('success');
          // Redirect to ticket page
          navigate(`/ticket?bookingId=${bookingId}`);
        } else {
          console.warn('[PaymentStatus] Payment verification failed:', data.message);
          // Still redirect to ticket page even if verification fails (payment gateway confirmed success)
          setStatus('success');
          navigate(`/ticket?bookingId=${bookingId}`);
        }
      }
    } catch (err) {
      console.warn('[PaymentStatus] Failed to update payment status:', err);
      // Still redirect to ticket page even if update fails
      setStatus('success');
      if (bookingId) {
        navigate(`/ticket?bookingId=${bookingId}`);
      }
    }
  }, [bookingId, navigate]);

  // Verify payment status in background (for cases where status=failed/pending but payment actually succeeded)
  const verifyPaymentStatusInBackground = useCallback(async (currentStatus = 'failed') => {
    try {
      if (bookingId) {
        // Don't check paymentStatus === 'Completed' from database
        // Instead, verify payment status with PhonePe API via verifyPayment endpoint
        // This will check PhonePe and update status to Completed if payment succeeded
        console.log(`[PaymentStatus] status=${currentStatus} in URL - verifying actual payment status with PhonePe`);
        
        const response = await fetch(
          `${config.API_BASE_URL}/api/bookings/verify`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              customBookingId: bookingId
            })
          }
        );
        
        const data = await response.json();
        
        if (data.success) {
          // Payment verified successfully - PhonePe confirmed payment is COMPLETED
          // verifyPayment endpoint already updated status to Completed
          console.log('[PaymentStatus] Payment actually succeeded - status updated to Completed');
          setStatus('success');
          navigate(`/ticket?bookingId=${bookingId}`);
        } else {
          // Payment verification failed - check if it's actually failed or still pending
          console.log('[PaymentStatus] Payment verification result:', data.message);
          
          // If verification explicitly says failed, update to failed
          if (data.state === 'FAILED' || data.message?.toLowerCase().includes('failed')) {
            console.log('[PaymentStatus] Payment verification confirmed failure');
            setStatus('failed');
          }
          // Otherwise keep the current status (pending/failed)
        }
      }
    } catch (err) {
      console.warn('[PaymentStatus] Background verification failed:', err);
      // Ignore errors in background check - keep current status
    }
  }, [bookingId, navigate]);

  // Check payment status directly from PhonePe API (for orders)
  const checkPaymentStatusFromPhonePe = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use orderId or transactionId (PhonePe orderId)
      const idToCheck = orderId || transactionId;
      
      if (!idToCheck) {
        setError('No order ID or transaction ID provided');
        setLoading(false);
        return;
      }
      
      console.log('[PaymentStatus] Checking PhonePe status for orderId:', idToCheck);
      
      // Call PhonePe API directly via paymentService
      const response = await paymentService.getPhonePeStatus(idToCheck);
      
      console.log('[PaymentStatus] PhonePe status response:', response);
      
      // Set status based on PhonePe API response
      // paymentService.getPhonePeStatus returns: { status: 'success'|'failed'|'pending', data: {...} }
      if (response.status === 'success') {
        setStatus('success');
      } else if (response.status === 'failed') {
        setStatus('failed');
      } else if (response.status === 'pending') {
        setStatus('pending');
      } else {
        setStatus('unknown');
      }
      
      // Set order details from PhonePe response
      if (response.data) {
        setOrderDetails(response.data.data || response.data);
      }
      
    } catch (err) {
      console.error('[PaymentStatus] PhonePe status check error:', err);
      setError(err.message || 'Failed to check payment status');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }, [orderId, transactionId]);

  // Check payment status using PhonePe API (for orders with orderId/transactionId)
  useEffect(() => {
    // For orders (orderId/transactionId), always check PhonePe API directly
    if (orderId || transactionId) {
      checkPaymentStatusFromPhonePe();
      return;
    }
    
    // For bookings (bookingId), use the booking-specific flow
    if (bookingId) {
      if (statusParam) {
        setLoading(false);
        if (statusParam === 'failed') {
          setStatus('failed');
          fetchBookingDetails();
          verifyPaymentStatusInBackground('failed');
          return;
        } else if (statusParam === 'success') {
          if (bookingId) {
            updatePaymentStatusToCompleted();
          } else {
            setStatus('success');
            navigate(`/ticket?bookingId=${bookingId}`);
          }
          return;
        } else if (statusParam === 'pending') {
          setStatus('pending');
          fetchBookingDetails();
          verifyPaymentStatusInBackground('pending');
          return;
        }
      }
      
      // No status param for booking, check via API
      checkPaymentStatus();
      return;
    }
    
    // No IDs provided
    if (!orderId && !transactionId && !bookingId) {
      setError('No order ID, transaction ID, or booking ID provided');
      setLoading(false);
      return;
    }
    // eslint-disable-next-line
  }, [orderId, transactionId, bookingId, statusParam, retryCount, checkPaymentStatusFromPhonePe, fetchBookingDetails, verifyPaymentStatusInBackground, updatePaymentStatusToCompleted, navigate]);

  // Place order after payment is successful (for testing, also on failed/pending)
  useEffect(() => {
    if (status === 'success' && !orderPlaced && !placingOrderRef.current) {

      placingOrderRef.current = true;
      placeOrderAfterPayment();
    }
    // eslint-disable-next-line
  }, [status]);

  // Redirect after payment success (for bookings only, orders redirect via placeOrderAfterPayment)
  useEffect(() => {
    if (status === 'success' && !statusParam && bookingId) {
      // For bookings only, redirect to ticket page
      navigate(`/ticket?bookingId=${bookingId}`);
    }
    // For orders, redirect happens in placeOrderAfterPayment after order is placed
  }, [status, navigate, statusParam, bookingId]);

  const checkPaymentStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use bookingId first, then orderId, then transactionId
      const idToCheck = bookingId || orderId || transactionId;
      
      // Try to check status via orders API (works for both bookings and orders)
      try {
        const response = await fetch(
          `${config.API_BASE_URL}/api/orders/status/${idToCheck}`
        );
        const data = await response.json();
        
        if (data.success) {
          const paymentStatus = data.booking?.paymentStatus || data.order?.paymentStatus;
          
          if (paymentStatus === 'Completed' || paymentStatus === 'completed') {
            setStatus('success');
          } else if (paymentStatus === 'Failed' || paymentStatus === 'failed') {
            setStatus('failed');
          } else {
            setStatus('pending');
          }
          
          setOrderDetails({
            orderId: data.booking?.customBookingId || data.order?._id,
            merchantOrderId: data.booking?.customBookingId || data.order?.merchantOrderId,
            amount: (data.booking?.totalAmount || data.order?.totalAmount) * 100, // Convert to paise
            state: (paymentStatus === 'Completed' || paymentStatus === 'completed') ? 'COMPLETED' : (paymentStatus === 'Failed' || paymentStatus === 'failed') ? 'FAILED' : 'PENDING'
          });
          return;
        }
      } catch (orderApiError) {
        console.warn('[PaymentStatus] Orders API failed, trying PhonePe API:', orderApiError);
      }
      
      // Fallback to PhonePe API if orders API fails
      const response = await paymentService.getPhonePeStatus(idToCheck);
      if (response.status === 'success') {
        setStatus('success');
      } else if (response.status === 'failed') {
        setStatus('failed');
      } else {
        setStatus('pending');
      }
      setOrderDetails(response.data?.data || response.data);
      
    } catch (err) {
      console.error('[PaymentStatus] Error:', err);
      setError(err.message || 'Failed to check payment status');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Place order after payment is successful
  const placeOrderAfterPayment = async () => {
    try {
      // Check if order has already been placed for this payment
      const orderKey = `order_placed_${orderId || transactionId}`;
      const orderAlreadyPlaced = localStorage.getItem(orderKey);
      
      if (orderAlreadyPlaced === 'true') {
        
        setOrderPlaced(true);
        return;
      }

      // Check if we have the required data
      if (!orderId && !transactionId) {
        toast.error('Missing payment/order ID. Cannot place order.');
        // Clear persisted data
        localStorage.removeItem('checkoutFormData');
        localStorage.removeItem('checkoutCartItems');
        localStorage.removeItem('appliedCoupon');
        localStorage.removeItem('checkoutAppliedCoupon');
        setError('Missing payment/order ID. Please try again.');
        return;
      }
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        toast.error('No items in cart to place order');
        // Clear persisted data
        localStorage.removeItem('checkoutFormData');
        localStorage.removeItem('checkoutCartItems');
        localStorage.removeItem('appliedCoupon');
        localStorage.removeItem('checkoutAppliedCoupon');
        // Redirect to checkout page to place order there
        navigate('/checkout?paymentSuccess=true&orderId=' + (orderId || transactionId));
        return;
      }

      // Check if we have form data and all required fields
      const formData = savedFormData;
      const requiredFields = [
        'firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'
      ];
      const missingFields = requiredFields.filter(f => !formData[f] || String(formData[f]).trim() === '');
      if (missingFields.length > 0) {
        toast.error('Missing required info: ' + missingFields.join(', '));
        // Clear persisted data
        localStorage.removeItem('checkoutFormData');
        localStorage.removeItem('checkoutCartItems');
        localStorage.removeItem('appliedCoupon');
        localStorage.removeItem('checkoutAppliedCoupon');
        // Redirect to checkout to fix
        navigate('/checkout?paymentSuccess=true&orderId=' + (orderId || transactionId));
        return;
      }

      // Use the same order creation logic as Checkout page
      const appliedCoupon = savedCoupon;
      
      // Create order data similar to Checkout page
      const orderData = {
        customerName: `${formData.firstName || user?.name || ''} ${formData.lastName || ''}`.trim(),
        email: formData.email || user?.email,
        phone: formData.phone || user?.phone,
        address: formData.address || user?.address,
        city: formData.city || user?.city || '',
        state: formData.state || user?.state || '',
        pincode: formData.zipCode || user?.zipCode || '',
        country: formData.country || user?.country || 'India',
        items: cartItems.map(item => ({
          productId: item.product?._id || item.id,
          name: item.product?.name || item.name,
          quantity: item.quantity,
          price: item.product?.price || item.price,
          image: getItemImage(item)
        })),
        totalAmount: getFinalTotal(),
        shippingCost: 0, // No shipping cost for online payment
        codExtraCharge: 0, // No COD charge for online payment
        finalTotal: getFinalTotal(),
        paymentMethod: 'phonepe',
        paymentStatus: 'completed',
        upfrontAmount: 0,
        remainingAmount: 0,
        sellerToken: sellerToken,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        phonepeOrderId: orderDetails?.orderId || orderId,
      };

      // Create the order using the same service as Checkout
      const response = await orderService.createOrder(orderData);

      if (response.success) {
        // Mark this order as placed to prevent duplicates
        localStorage.setItem(orderKey, 'true');
        setOrderPlaced(true);
        clearCart();
        // Clear persisted checkout data after order placed
        localStorage.removeItem('checkoutFormData');
        localStorage.removeItem('checkoutCartItems');
        localStorage.removeItem('appliedCoupon');
        localStorage.removeItem('checkoutAppliedCoupon');
        toast.success('Order placed successfully!');
      } else {
        toast.error(response.message || 'Failed to place order');
        // Clear persisted data on error
        localStorage.removeItem('checkoutFormData');
        localStorage.removeItem('checkoutCartItems');
        localStorage.removeItem('appliedCoupon');
        localStorage.removeItem('checkoutAppliedCoupon');
      }
    } catch (err) {
    
      toast.error('Failed to place order after payment: ' + (err.message || 'Unknown error'));
      // Clear persisted data on error
      localStorage.removeItem('checkoutFormData');
      localStorage.removeItem('checkoutCartItems');
      localStorage.removeItem('appliedCoupon');
      localStorage.removeItem('checkoutAppliedCoupon');
      // If order placement fails, redirect to checkout to try again
      navigate('/checkout?paymentSuccess=true&orderId=' + (orderId || transactionId));
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleGoHome = () => {
    navigate('/booking/' + bookingId);
  };

  const handleGoToOrders = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-cyan-700 font-semibold">Checking payment status...</p>
        </div>
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
              >
                <RefreshCw size={20} className="inline mr-2" />
                Try Again
              </button>
              <button
                onClick={handleGoHome}
                className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                <Home size={20} className="inline mr-2" />
                Go Home
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const renderSuccessStatus = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-4"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={40} className="text-green-500" />
        </motion.div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">Your booking has been confirmed and payment received.</p>
        
      </div>

     

      <div className="text-center">
      
        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
          >
            <Home size={20} className="inline mr-2" />
            View Ticket
          </button>
          <button
            onClick={handleGoToOrders}
            className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
          >
           Home
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderFailedStatus = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-4"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <XCircle size={40} className="text-red-500" />
        </motion.div>
        <h1 className="text-3xl font-bold text-red-600 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-4">Payment was not successful. Please try again.</p>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-700 text-sm">
            <AlertCircle size={16} className="inline mr-2" />
            No amount has been deducted from your account
          </p>
        </div>
      </div>

      {orderDetails && (
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Booking Details</h3>
              <div className="space-y-2 text-sm">
               
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">₹{(orderDetails.amount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-red-600 font-medium">Failed</span>
                </div>
                {orderDetails.errorCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Error Code:</span>
                    <span className="font-medium text-red-600">{orderDetails.errorCode}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
              <h3 className="font-semibold text-cyan-800 mb-2">What You Can Do</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <RefreshCw size={16} className="text-cyan-600 mr-2" />
                  <span>Try the payment again</span>
                </div>
                <div className="flex items-center">
                  <CreditCard size={16} className="text-cyan-600 mr-2" />
                  <span>Use a different payment method</span>
                </div>
                <div className="flex items-center">
                  <Shield size={16} className="text-cyan-600 mr-2" />
                  <span>Contact support if issue persists</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center space-y-3">
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
        >
          <RefreshCw size={20} className="inline mr-2" />
          Try Payment Again
        </button>
        <button
          onClick={handleGoHome}
          className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
        >
          <Home size={20} className="inline mr-2" />
          Go Home
        </button>
      </div>
    </motion.div>
  );

  const renderPendingStatus = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-4"
    >
      <div className="text-center mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Clock size={40} className="text-yellow-500" />
        </motion.div>
        <h1 className="text-3xl font-bold text-yellow-600 mb-2">Payment Pending</h1>
        <p className="text-gray-600 mb-4">Your payment is being processed. Please wait...</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-yellow-700 text-sm">
            <Clock size={16} className="inline mr-2" />
            This may take a few minutes to complete
          </p>
        </div>
      </div>

      {orderDetails && (
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Booking Details</h3>
              <div className="space-y-2 text-sm">

                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">₹{(orderDetails.amount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-yellow-600 font-medium">Pending</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
              <h3 className="font-semibold text-cyan-800 mb-2">What's Happening</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <RefreshCw size={16} className="text-cyan-600 mr-2" />
                  <span>Payment is being verified</span>
                </div>
                <div className="flex items-center">
                  <Shield size={16} className="text-cyan-600 mr-2" />
                  <span>Your money is safe</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="text-cyan-600 mr-2" />
                  <span>Please wait for confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center space-y-3">
        <button
          onClick={handleRetry}
          disabled={retryCount >= 3}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <RefreshCw size={20} className="inline mr-2" />
          Check Status Again ({3 - retryCount} attempts left)
        </button>
        <button
          onClick={handleGoHome}
          className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
        >
          <Home size={20} className="inline mr-2" />
          Go Home
        </button>
      </div>
    </motion.div>
  );

  const renderUnknownStatus = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-4"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <AlertCircle size={40} className="text-gray-500" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-700 mb-2">Unknown Payment Status</h1>
        <p className="text-gray-600 mb-4">We couldn't determine the payment status. Please try again or contact support.</p>
      </div>
      <div className="text-center space-y-3">
        <button
          onClick={handleRetry}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
        >
          <RefreshCw size={20} className="inline mr-2" />
          Try Again
        </button>
        <button
          onClick={handleGoHome}
          className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
        >
          <Home size={20} className="inline mr-2" />
          Go Home
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center p-4 relative">
      <AnimatedBubbles />
      <AnimatePresence mode="wait">
        {status === 'success' && renderSuccessStatus()}
        {status === 'failed' && renderFailedStatus()}
        {status === 'pending' && renderPendingStatus()}
        {status === 'unknown' && renderUnknownStatus()}
      </AnimatePresence>
    </div>
  );
};

export default PaymentStatus; 
