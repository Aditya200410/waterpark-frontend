import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const PaymentRetry = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there are stored payment details
    const storedDetails = localStorage.getItem('lastPaymentDetails');
    if (storedDetails) {
      try {
        const details = JSON.parse(storedDetails);
        // Check if the payment details are recent (within last 10 minutes)
        const isRecent = Date.now() - details.timestamp < 10 * 60 * 1000;
        if (isRecent) {
          setPaymentDetails(details);
          checkBookingStatus(details.customBookingId);
        } else {
          // Clear old payment details
          localStorage.removeItem('lastPaymentDetails');
          navigate('/');
        }
      } catch (error) {
        console.error('Error parsing stored payment details:', error);
        localStorage.removeItem('lastPaymentDetails');
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const checkBookingStatus = async (customBookingId) => {
    try {
      setIsChecking(true);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE_URL}/api/bookings/${customBookingId}`
      );
      
      if (response.data.success) {
        setBookingStatus(response.data.booking);
        if (response.data.booking.paymentStatus === "Completed") {
          // Payment is confirmed, clear stored details and redirect
          localStorage.removeItem('lastPaymentDetails');
          toast.success("Payment confirmed! Redirecting to your booking...");
          setTimeout(() => {
            navigate(`/booking/${customBookingId}`);
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Error checking booking status:', error);
      toast.error("Unable to check booking status. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const retryPaymentVerification = async () => {
    if (!paymentDetails) return;
    
    try {
      setIsRetrying(true);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_BASE_URL}/api/bookings/verify`,
        {
          razorpay_order_id: paymentDetails.razorpay_order_id,
          razorpay_payment_id: paymentDetails.razorpay_payment_id,
          razorpay_signature: paymentDetails.razorpay_signature,
          bookingId: paymentDetails.bookingId,
        }
      );

      if (response.data.success) {
        toast.success("Payment verified successfully!");
        localStorage.removeItem('lastPaymentDetails');
        navigate(`/booking/${paymentDetails.customBookingId}`);
      } else {
        toast.error("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.error("Payment verification failed. Please contact support.");
    } finally {
      setIsRetrying(false);
    }
  };

  const goToBooking = () => {
    if (paymentDetails) {
      navigate(`/booking/${paymentDetails.customBookingId}`);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Checking Payment Status</h2>
          <p className="text-gray-600">Please wait while we verify your payment...</p>
        </div>
      </div>
    );
  }

  if (bookingStatus?.paymentStatus === "Completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-700 mb-2">Payment Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your booking has been successfully confirmed.</p>
          <button
            onClick={goToBooking}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            View Your Booking
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Processing</h2>
        <p className="text-gray-600 mb-6">
          Your payment was successful, but we're still processing your booking. 
          This usually takes just a few moments.
        </p>
        
        {bookingStatus && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-2">Booking Details:</h3>
            <p className="text-sm text-gray-600">
              <strong>Booking ID:</strong> {bookingStatus.customBookingId}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Status:</strong> {bookingStatus.paymentStatus}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Amount:</strong> ₹{bookingStatus.totalAmount}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={retryPaymentVerification}
            disabled={isRetrying}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Retry Verification
              </>
            )}
          </button>
          
          <button
            onClick={goToBooking}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            View Booking Anyway
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          If you continue to have issues, please contact support with your booking ID: {paymentDetails?.customBookingId}
        </p>
      </div>
    </div>
  );
};

export default PaymentRetry;
