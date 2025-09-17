import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import AnimatedBubbles from "../components/AnimatedBubbles/AnimatedBubbles";

function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ logged-in user info

  const [loading, setLoading] = useState(false);

  // START: Coupon Code State
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  // END: Coupon Code State

  const getCheckoutData = () => {
    if (location.state) {
      return location.state;
    }
    const dataFromStorage = localStorage.getItem("checkoutData");
  
    if (dataFromStorage) {
     
      return JSON.parse(dataFromStorage);
     
    }
    return {};
  };

  const checkoutData = getCheckoutData();
  const {
    adultCount,
    childCount,
    date,
    resortName,
    paid,
    totalamount,
    resortId,
    waternumber,
    terms,
    paymentType,
  } = checkoutData;

  
const formattedDate = new Date(date).toISOString().split("T")[0];
  const [billingDetails, setBillingDetails] = useState({
    firstName: "",
    lastName: "",
    phone: "",
   waternumber: waternumber,
    email: "",
    city: "",
     date: formattedDate, // ✅ sending ISO-supported date
    createAccount: false,
    total: totalamount,
    advance:paid,
    terms
  });

  useEffect(() => {
    if (user) {
      const nameParts = user.name ? user.name.split(" ") : [""];
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");

      setBillingDetails((prevDetails) => ({
        ...prevDetails,
        firstName: firstName || "",
        lastName: lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  // Enhanced recovery mechanism for pending bookings
  useEffect(() => {
    const checkPendingBooking = () => {
      const pendingBooking = localStorage.getItem('pendingBooking');
      if (pendingBooking) {
        try {
          const bookingData = JSON.parse(pendingBooking);
          const timeDiff = Date.now() - bookingData.timestamp;
          
          console.log("🔍 Found pending booking:", {
            customBookingId: bookingData.customBookingId,
            age: Math.round(timeDiff / 1000) + "s"
          });
          
          // If less than 10 minutes old, try to confirm it
          if (timeDiff < 10 * 60 * 1000) {
            console.log("🔄 Attempting to confirm pending booking...");
            toast.info("Confirming your previous booking...");
            
            axios.post(
              `${import.meta.env.VITE_APP_API_BASE_URL}/api/bookings/confirm-and-notify`,
              {
                razorpay_order_id: bookingData.razorpay_order_id,
                razorpay_payment_id: bookingData.razorpay_payment_id,
                razorpay_signature: bookingData.razorpay_signature,
                bookingId: bookingData.bookingId,
                customBookingId: bookingData.customBookingId,
              }
            ).then((response) => {
              if (response.data.success) {
                console.log("✅ Pending booking confirmed successfully");
                localStorage.removeItem('pendingBooking');
                toast.success("Your booking has been confirmed!");
              } else {
                throw new Error("Confirmation failed");
              }
            }).catch(err => {
              console.error("❌ Failed to confirm pending booking:", err);
              
              // If it's been more than 5 minutes, show warning
              if (timeDiff > 5 * 60 * 1000) {
                toast.warning("Booking confirmation is taking longer than expected. Please contact support if needed.");
              }
              
              // Remove very old pending bookings (30+ minutes)
              if (timeDiff > 30 * 60 * 1000) {
                console.log("🗑️ Removing old pending booking");
                localStorage.removeItem('pendingBooking');
                toast.error("Old pending booking removed. Please contact support if you made a payment.");
              }
            });
          } else {
            // Remove old pending booking
            console.log("🗑️ Removing old pending booking");
            localStorage.removeItem('pendingBooking');
          }
        } catch (error) {
          console.error("❌ Error processing pending booking:", error);
          localStorage.removeItem('pendingBooking');
        }
      }
    };

    // Check immediately
    checkPendingBooking();
    
    // Also check every 30 seconds for the first 5 minutes
    const interval = setInterval(() => {
      const pendingBooking = localStorage.getItem('pendingBooking');
      if (pendingBooking) {
        checkPendingBooking();
      } else {
        clearInterval(interval);
      }
    }, 30000);
    
    // Clean up interval after 5 minutes
    setTimeout(() => clearInterval(interval), 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBillingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // START: Handle Apply Coupon Function
  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error("Please enter a coupon code.");
      return;
    }
    try {
      // Create cart items array for product-specific coupons
      const cartItems = [{
        product: resortId, // Send the product ID directly
        price: totalamount,
        quantity: 1,
        name: resortName
      }];

      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_BASE_URL}/api/coupons/validate`,
        {
          code: couponCode,
          cartTotal: totalamount, // Using original paid for validation\
          
          cartItems: cartItems
        }
      );

      if (response.data.success) {
        const { coupon, discountAmount, message, applicableItems } = response.data.data;
        setAppliedCoupon(coupon);
        setDiscountAmount(discountAmount);

        setCouponError(""); // Clear previous errors
        toast.success(message);
      } else {
        setCouponError(response.data.message);
        setDiscountAmount(0); // Reset discount if coupon is invalid
        setAppliedCoupon(null);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      const errorMessage = error.response?.data?.message || "Invalid coupon code";
      toast.error(errorMessage);
      setCouponError(errorMessage);
    }
  };
  // END: Handle Apply Coupon Function

  // Calculate final total after discount
  const discountedTotalAmount = totalamount - discountAmount;
  const finalTotal = paid; // Advance amount remains the same
  const remainingAmount = discountedTotalAmount - finalTotal;

  const handlePayment = async (e) => {
    e.preventDefault();
    if (
      billingDetails.email === "" ||
      billingDetails.firstName === "" ||
      billingDetails.lastName === "" ||
      billingDetails.phone === "" ||
      billingDetails.city === ""
    ) {
      toast.error("Please fill all the details");
      return;
    }
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_BASE_URL}/api/bookings/create`,
        {
          waterpark: resortId,
          waternumber: waternumber,
          waterparkName: resortName,
          name: `${billingDetails.firstName} ${billingDetails.lastName}`,
          email: billingDetails.email,
          phone: billingDetails.phone,
          date: formattedDate,
          adults: adultCount,
          children: childCount,
          total: discountedTotalAmount,
          advanceAmount: finalTotal,
          paymentType: paymentType,
          paymentMethod: paymentMethod,
          terms: terms,
        }
      );
  
      const {
        success,
        orderId,
        booking,
        key,
        amount,
        currency,
        name,
        description,
        prefill,
      } = response.data;
  
      if (!success) {
        toast.error("Failed to create booking. Please try again.");
        return;
      }
  
      if (paymentMethod === "razorpay" && orderId) {
        const options = {
          key,
          amount,
          currency,
          name,
          description,
          order_id: orderId,
          prefill,
          // 🚫 no callback_url → we control success
          handler: async function (res) {
            try {
              toast.success("Payment successful! Confirming booking...");
  
              const confirmRes = await axios.post(
                `${import.meta.env.VITE_APP_API_BASE_URL}/api/bookings/confirm-and-notify`,
                {
                  razorpay_order_id: res.razorpay_order_id,
                  razorpay_payment_id: res.razorpay_payment_id,
                  razorpay_signature: res.razorpay_signature,
                  bookingId: booking._id,
                  customBookingId: booking.customBookingId,
                }
              );
  
              if (confirmRes.data.success) {
                toast.success("Booking confirmed!");
                navigate(`/booking/${booking.customBookingId}`);
              } else {
                toast.error("Payment verified, but booking confirmation failed.");
                navigate(`/booking/${booking.customBookingId}`);
              }
            } catch (err) {
              console.error("❌ Confirm error:", err);
              toast.error("Payment captured. Please check booking page.");
              navigate(`/booking/${booking.customBookingId}`);
            }
          },
          modal: {
            ondismiss: function () {
              toast.info("Payment cancelled");
            },
          },
        };
  
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else if (paymentMethod === "cash") {
        toast.success("Booking created successfully with cash payment.");
        navigate(`/booking/${booking.customBookingId}`);
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Payment initiation failed. Please try again.");
    }
  };
  

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-cyan-200 via-blue-200 to-blue-300 overflow-hidden">
      <AnimatedBubbles />
      {/* Top Wave */}
      <div className="absolute top-0 left-0 w-full">
        {/* SVG remains unchanged */}
      </div>

      {/* Checkout card */}
      <div className="mt-10 mb-10  relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-10 z-10 border-4 border-cyan-300">
        <h1 className="text-4xl font-bold text-blue-700 text-center mb-8">
          🎢 Water Park Checkout 💦
        </h1>

        <form className="space-y-10">
          {/* Billing Details (Unchanged) */}
          <div>
            <h2 className="text-2xl font-semibold text-cyan-600 mb-4">
              Billing Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["firstName", "lastName", "phone", "email", "city"].map(
                (field) => (
                  <div key={field} className="flex flex-col">
                    <label
                      htmlFor={field}
                      className="text-gray-700 font-medium mb-2"
                    >
                      {field === "phone" 
                        ? "WhatsApp Number (can be used as login)"
                        : field
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())
                      }
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={field}
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={billingDetails[field]}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                )
              )}
            </div>
          </div>

          {/* START: Coupon Code Section */}
          <div>
            <h2 className="text-2xl font-semibold text-cyan-600 mb-4">
              Have a Coupon?
            </h2>
            
            {!appliedCoupon ? (
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-grow px-4 py-2 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Apply
                </button>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-semibold">✓ Coupon Applied</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">
                      {appliedCoupon.code}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedCoupon(null);
                      setDiscountAmount(0);
                      setCouponCode("");
                      setCouponError("");
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
                
            
              </div>
            )}
            
            {couponError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-red-600 font-semibold">✗ Coupon Invalid</span>
                </div>
                <div className="text-sm text-red-700 mt-2">
                  {couponError}
                </div>
              </div>
            )}
          </div>
          {/* END: Coupon Code Section */}

          {/* Order Summary (MODIFIED) */}
          <div>
            <h2 className="text-2xl font-semibold text-cyan-600 mb-4">
              Your Order
            </h2>
            <div className="overflow-x-auto bg-cyan-50 rounded-lg shadow">
              <table className="w-full text-left border-collapse">
                <thead className="bg-cyan-100">
                  <tr>
                    <th className="py-3 px-4 text-blue-700 font-medium">
                      Product
                    </th>
                    <th className="py-3 px-4 text-blue-700 font-medium">
                      Paid
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">
                      {resortName} x 1
                      <br />
                      <span className="text-sm text-gray-500">
                        Check-in: {date} | Adults: {adultCount} | Children:{" "}
                        {childCount}
                      </span>
                    </td>
                    <td className="py-3 px-4">₹{paid}</td>
                  </tr>

               

                  <tr className="border-b">
                    <td className="py-3 px-4">Total Amount:</td>
                    <td className="py-3 px-4">₹{totalamount}</td>
                  </tr>
                  {discountAmount > 0 && (
                    <tr className="border-b text-green-600">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">After Discount:</div>
                          <div className="text-xs text-gray-500">Original: ₹{totalamount}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-right">
                          <div className="font-semibold">₹{discountedTotalAmount}</div>
                          <div className="text-xs text-gray-500">You saved: ₹{discountAmount}</div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {paymentType === 'advance' && (
                    <tr className="border-b">
                      <td className="py-3 px-4">Remaining to be <br/>Paid in Waterpark:</td>
                      <td className="py-3 px-4">₹{remainingAmount}</td>
                    </tr>
                  )}
                 
                  <tr>
                    <td className="py-3 px-4 font-semibold text-cyan-700">
                      {paymentType === 'full' ? 'Payable Total Amount (Full Payment):' : 'Payable Total Amount (Advance):'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-cyan-700">
                      ₹{finalTotal}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment (Unchanged) */}
          <div>
            <h2 className="text-2xl font-semibold text-cyan-600 mb-4">
              Payment Method
            </h2>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="px-4 py-2 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="razorpay">Razorpay</option>
            </select>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-blue-500 hover:to-cyan-400 text-white py-3 rounded-xl shadow-lg transform transition duration-300 hover:scale-105"
          >
            🌊 Chill & Pay Now
          </button>
        </form>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full">
        {/* SVG remains unchanged */}
      </div>
    </div>
  );
}

export default CheckoutPage;