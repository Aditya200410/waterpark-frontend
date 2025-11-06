import { useState, useEffect, useRef } from 'react';
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
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';
import AnimatedBubbles from '../components/AnimatedBubbles/AnimatedBubbles';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null); // 'success', 'failed', 'pending', 'unknown', 'error'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [bookingVerified, setBookingVerified] = useState(false);
  const verifyingRef = useRef(false);

  const orderId = searchParams.get('orderId'); // PhonePe merchantOrderId
  const bookingId = searchParams.get('bookingId'); // customBookingId

  useEffect(() => {
    if (!orderId || !bookingId) {
      setError('No order ID or booking ID provided');
      setLoading(false);
      return;
    }
    checkPaymentStatus();
    // eslint-disable-next-line
  }, [orderId, bookingId, retryCount]);

  // Verify booking payment after payment is successful
  useEffect(() => {
    if (status === 'success' && !bookingVerified && !verifyingRef.current) {
      verifyingRef.current = true;
      verifyBookingPayment();
    }
    // eslint-disable-next-line
  }, [status]);

  // Redirect to ticket page after successful verification
  useEffect(() => {
    if (status === 'success' && bookingVerified && bookingId) {
      // Small delay to ensure booking is updated in database
      setTimeout(() => {
        navigate(`/ticket?bookingId=${bookingId}`);
      }, 1000);
    }
  }, [status, bookingVerified, bookingId, navigate]);

  const checkPaymentStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First, get PhonePe payment status using the orderId (merchantOrderId)
      // We need to get the actual PhonePe transaction ID from the booking first
      if (!bookingId) {
        setError('Booking ID is required');
        setLoading(false);
        return;
      }

      // Get booking to find PhonePe orderId (transaction ID)
      try {
        const bookingResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_BASE_URL}/api/bookings/any/${bookingId}`
        );
        
        if (bookingResponse.data.success && bookingResponse.data.booking) {
          const booking = bookingResponse.data.booking;
          const phonePeOrderId = booking.phonepeOrderId || orderId;
          
          // Check PhonePe payment status
          const response = await paymentService.getPhonePeStatus(phonePeOrderId);
          setStatus(response.status);
          setOrderDetails(response.data?.data || response.data);
        } else {
          setError('Booking not found');
          setStatus('error');
        }
      } catch (bookingError) {
        console.error('Error fetching booking:', bookingError);
        // Try to check payment status directly with orderId
        const response = await paymentService.getPhonePeStatus(orderId);
        setStatus(response.status);
        setOrderDetails(response.data?.data || response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to check payment status');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Verify booking payment after payment is successful
  const verifyBookingPayment = async () => {
    try {
      if (!orderId || !bookingId) {
        toast.error('Missing payment or booking information');
        return;
      }

      // Check if booking has already been verified
      const verifyKey = `booking_verified_${bookingId}`;
      const alreadyVerified = localStorage.getItem(verifyKey);
      
      if (alreadyVerified === 'true') {
        setBookingVerified(true);
        return;
      }

      toast.info('Verifying payment and updating booking...');

      // Get booking to find PhonePe orderId (transaction ID)
      let phonePeOrderId = orderId;
      try {
        const bookingResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_BASE_URL}/api/bookings/any/${bookingId}`
        );
        
        if (bookingResponse.data.success && bookingResponse.data.booking) {
          const booking = bookingResponse.data.booking;
          phonePeOrderId = booking.phonepeOrderId || orderId;
        }
      } catch (bookingError) {
        console.warn('Could not fetch booking, using orderId directly:', bookingError);
      }

      // Verify payment with booking controller
      const verifyResponse = await axios.post(
        `${import.meta.env.VITE_APP_API_BASE_URL}/api/bookings/verify`,
        {
          orderId: phonePeOrderId,
          merchantOrderId: orderId,
          bookingId: bookingId,
        }
      );

      if (verifyResponse.data.success) {
        // Mark booking as verified to prevent duplicate verification
        localStorage.setItem(verifyKey, 'true');
        setBookingVerified(true);
        toast.success('🎉 Payment verified successfully! Booking confirmed.');
      } else {
        toast.error(verifyResponse.data.message || 'Payment verification failed');
      }
    } catch (err) {
      console.error('Error verifying booking payment:', err);
      toast.error(err.response?.data?.message || 'Failed to verify payment. Please contact support.');
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoToTicket = () => {
    if (bookingId) {
      navigate(`/ticket?bookingId=${bookingId}`);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-white to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-pink-700">Checking payment status...</p>
        </div>
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-white to-pink-100 flex items-center justify-center">
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
                className="w-full bg-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-pink-700 transition-colors"
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
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-700 text-sm">
            <Shield size={16} className="inline mr-2" />
            Your payment is secure and your order is being processed
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
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium">{bookingId || orderDetails.merchantOrderId || orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">₹{(orderDetails.amount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">Completed</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-700 mb-2">What's Next?</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Truck size={16} className="text-pink-500 mr-2" />
                  <span>Your booking is confirmed</span>
                </div>
               
                <div className="flex items-center">
                  <Shield size={16} className="text-pink-500 mr-2" />
                  <span>Secure payment processed successfully</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <p className="text-gray-500 text-sm mb-4">
          {bookingVerified ? 'Redirecting to ticket page...' : 'Verifying payment...'}
        </p>
        <div className="space-y-3">
          <button
            onClick={handleGoToTicket}
            className="w-full bg-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-pink-700 transition-colors"
          >
            <Shield size={20} className="inline mr-2" />
            View My Ticket
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
        <p className="text-gray-600 mb-4">Your payment could not be processed. Please try again.</p>
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
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium">{bookingId || orderDetails.merchantOrderId || orderDetails.orderId}</span>
                </div>
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
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-700 mb-2">What You Can Do</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <RefreshCw size={16} className="text-pink-500 mr-2" />
                  <span>Try the payment again</span>
                </div>
                <div className="flex items-center">
                  <CreditCard size={16} className="text-pink-500 mr-2" />
                  <span>Use a different payment method</span>
                </div>
                <div className="flex items-center">
                  <Shield size={16} className="text-pink-500 mr-2" />
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
          className="w-full bg-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-pink-700 transition-colors"
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
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium">{bookingId || orderDetails.merchantOrderId || orderDetails.orderId}</span>
                </div>
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
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-700 mb-2">What's Happening</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <RefreshCw size={16} className="text-pink-500 mr-2" />
                  <span>Payment is being verified</span>
                </div>
                <div className="flex items-center">
                  <Shield size={16} className="text-pink-500 mr-2" />
                  <span>Your money is safe</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="text-pink-500 mr-2" />
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
          className="w-full bg-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="w-full bg-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-pink-700 transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-white to-pink-100 flex items-center justify-center p-4 relative">
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