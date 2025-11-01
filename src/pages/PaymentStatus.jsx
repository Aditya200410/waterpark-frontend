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
import config from '../config/config';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null); // 'success', 'failed', 'pending', 'unknown', 'error'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');
  const bookingId = searchParams.get('bookingId'); // For bookings
  const statusParam = searchParams.get('status'); // Read status from URL (success, failed, pending)

  useEffect(() => {
    // Handle status parameter from URL (set by backend redirect)
    if (statusParam) {
      setLoading(false);
      if (statusParam === 'success') {
        setStatus('success');
        // For bookings, check payment and redirect to ticket
        if (bookingId) {
          checkBookingPaymentStatus();
        }
        return;
      } else if (statusParam === 'failed') {
        setStatus('failed');
        if (bookingId) {
          fetchBookingDetails();
        }
        return;
      } else if (statusParam === 'pending') {
        setStatus('pending');
        if (bookingId) {
          fetchBookingDetails();
        }
        return;
      }
    }

    // If no status param, check payment status
    if (!orderId && !transactionId && !bookingId) {
      setError('No order ID, transaction ID, or booking ID provided');
      setLoading(false);
      return;
    }

    checkPaymentStatus();
    // eslint-disable-next-line
  }, [orderId, transactionId, bookingId, statusParam, retryCount]);

  // Redirect after payment success (for bookings)
  useEffect(() => {
    if (status === 'success' && bookingId && statusParam === 'success') {
      const timer = setTimeout(() => {
        navigate(`/ticket?bookingId=${bookingId}`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate, statusParam, bookingId]);

  // Fetch booking details for display
  const fetchBookingDetails = async () => {
    try {
      if (bookingId) {
        const response = await fetch(
          `${config.API_BASE_URL}/api/bookings/any/${bookingId}`
        );
        const data = await response.json();
        
        if (data.success && data.booking) {
          setOrderDetails({
            orderId: data.booking.customBookingId,
            merchantOrderId: data.booking.customBookingId,
            amount: (data.booking.totalAmount || 0) * 100, // Convert to paise
            state: data.booking.paymentStatus === 'Completed' ? 'COMPLETED' : 
                   data.booking.paymentStatus === 'Failed' ? 'FAILED' : 'PENDING'
          });
        }
      }
    } catch (err) {
      console.warn('[PaymentStatus] Could not fetch booking details:', err);
    }
  };

  // Check booking payment status via PhonePe API
  const checkBookingPaymentStatus = async () => {
    try {
      if (!bookingId) return;

      // Get booking to find phonepeOrderId
      const bookingResponse = await fetch(
        `${config.API_BASE_URL}/api/bookings/any/${bookingId}`
      );
      const bookingData = await bookingResponse.json();
      
      if (!bookingData.success || !bookingData.booking) {
        console.warn('[PaymentStatus] Booking not found');
        return;
      }
      
      let phonepeOrderId = bookingData.booking.phonepeOrderId;
      if (!phonepeOrderId) {
        console.warn('[PaymentStatus] PhonePe orderId not found');
        return;
      }
      
      // Sanitize orderId
      phonepeOrderId = String(phonepeOrderId).split(':')[0].split(';')[0].trim();
      
      // Check PhonePe status
      const phonepeResponse = await paymentService.getPhonePeStatus(phonepeOrderId);
      
      if (phonepeResponse.status === 'success') {
        // Verify payment via backend to update booking status
        try {
          await fetch(
            `${config.API_BASE_URL}/api/bookings/verify`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ customBookingId: bookingId })
            }
          );
        } catch (verifyErr) {
          console.warn('[PaymentStatus] Failed to verify payment:', verifyErr);
        }
      }
      
      setOrderDetails(phonepeResponse.data?.data || phonepeResponse.data);
    } catch (err) {
      console.warn('[PaymentStatus] Failed to check booking payment status:', err);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For bookings, get phonepeOrderId first
      if (bookingId) {
        const bookingResponse = await fetch(
          `${config.API_BASE_URL}/api/bookings/any/${bookingId}`
        );
        const bookingData = await bookingResponse.json();
        
        if (bookingData.success && bookingData.booking) {
          const phonepeOrderId = bookingData.booking.phonepeOrderId;
          if (phonepeOrderId) {
            // Sanitize orderId
            const sanitizedOrderId = String(phonepeOrderId).split(':')[0].split(';')[0].trim();
            const response = await paymentService.getPhonePeStatus(sanitizedOrderId);
            setStatus(response.status || 'unknown');
            setOrderDetails(response.data?.data || response.data || {
              orderId: bookingData.booking.customBookingId,
              merchantOrderId: bookingData.booking.customBookingId,
              amount: (bookingData.booking.totalAmount || 0) * 100,
              state: bookingData.booking.paymentStatus === 'Completed' ? 'COMPLETED' : 
                     bookingData.booking.paymentStatus === 'Failed' ? 'FAILED' : 'PENDING'
            });
            return;
          }
        }
      }
      
      // For orders (orderId/transactionId)
      const idToCheck = orderId || transactionId;
      if (!idToCheck) {
        setError('No order ID or transaction ID provided');
        setLoading(false);
        return;
      }
      
      // Sanitize orderId
      const sanitizedId = String(idToCheck).split(':')[0].split(';')[0].trim();
      const response = await paymentService.getPhonePeStatus(sanitizedId);
      setStatus(response.status || 'unknown');
      setOrderDetails(response.data?.data || response.data);
      
    } catch (err) {
      console.error('[PaymentStatus] Error:', err);
      setError(err.message || 'Failed to check payment status');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleGoHome = () => {
    if (bookingId) {
      navigate(`/ticket?bookingId=${bookingId}`);
    } else {
      navigate('/');
    }
  };

  const handleGoToOrders = () => {
    navigate('/');
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
        <p className="text-gray-600 mb-4">
          {bookingId ? 'Your booking has been confirmed and payment received.' : 'Your order has been confirmed and payment received.'}
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-700 text-sm">
            <Shield size={16} className="inline mr-2" />
            Your payment is secure and {bookingId ? 'your booking is being processed' : 'your order is being processed'}
          </p>
        </div>
      </div>

      {orderDetails && (
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-700 mb-2">{bookingId ? 'Booking' : 'Order'} Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{bookingId ? 'Booking' : 'Order'} ID:</span>
                  <span className="font-medium">{orderDetails.merchantOrderId || orderDetails.orderId}</span>
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
                {bookingId ? (
                  <>
                    <div className="flex items-center">
                      <Truck size={16} className="text-pink-500 mr-2" />
                      <span>Show your ticket at the waterpark entrance</span>
                    </div>
                    <div className="flex items-center">
                      <Shield size={16} className="text-pink-500 mr-2" />
                      <span>Secure payment processed successfully</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <Truck size={16} className="text-pink-500 mr-2" />
                      <span>Order will be shipped within 5-7 days</span>
                    </div>
                    <div className="flex items-center">
                      <Shield size={16} className="text-pink-500 mr-2" />
                      <span>Secure payment processed successfully</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        {bookingId ? (
          <p className="text-gray-500 text-sm mb-4">
            Redirecting to ticket page in 3 seconds...
          </p>
        ) : (
          <p className="text-gray-500 text-sm mb-4">
            Redirecting to home page in 5 seconds...
          </p>
        )}
        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full bg-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-pink-700 transition-colors"
          >
            <Home size={20} className="inline mr-2" />
            {bookingId ? 'View Ticket Now' : 'Go Home Now'}
          </button>
          {!bookingId && (
            <button
              onClick={handleGoToOrders}
              className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
            >
              View My Orders
            </button>
          )}
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
              <h3 className="font-semibold text-gray-700 mb-2">{bookingId ? 'Booking' : 'Order'} Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{bookingId ? 'Booking' : 'Order'} ID:</span>
                  <span className="font-medium">{orderDetails.merchantOrderId || orderDetails.orderId}</span>
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
          onClick={() => navigate(bookingId ? `/booking/${bookingId}` : '/checkout')}
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
              <h3 className="font-semibold text-gray-700 mb-2">{bookingId ? 'Booking' : 'Order'} Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{bookingId ? 'Booking' : 'Order'} ID:</span>
                  <span className="font-medium">{orderDetails.merchantOrderId || orderDetails.orderId}</span>
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
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-white to-pink-100 flex items-center justify-center p-4">
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
