import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

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
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_BASE_URL}/api/coupons/validate`,
     
        {
          code: couponCode,
          cartTotal: paid, // Using original paid for validation
        }
      );

      if (response.data.success) {
        const { coupon, discountAmount, message } = response.data.data;
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
      toast.error("An error occurred while applying the coupon.");
      setCouponError("An error occurred. Please try again.");
    }
  };
  // END: Handle Apply Coupon Function

  // Calculate final total after discount
  const finalTotal = paid-discountAmount;
 
  const remainingAmount = totalamount-paid;

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
          // MODIFIED: Send discounted total and coupon info
          total: finalTotal,
          advanceAmount: finalTotal,
          paymentType: paymentMethod,
          terms:terms
      
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
        console.error("Error:", response.data.message);
        toast.error("Failed to create booking. Please try again.");
        return;
      }

      if (paymentMethod === "razorpay" && orderId) {
        // Initialize Razorpay payment
        const options = {
          key: key,
          amount: amount,
          currency: currency,
          name: name,
          description: description,
          order_id: orderId,
          prefill: prefill,
          handler: async function (response) {
            try {
              // Verify payment on backend
              const verifyResponse = await 
              axios.post(
                `${import.meta.env.VITE_APP_API_BASE_URL}/api/bookings/verify`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  bookingId: booking._id,
                }
              );

              if (verifyResponse.data.success) {
                toast.success("Payment successful!");
                navigate("/ticket", {
                  state: { booking: verifyResponse.data.booking },
                });
              } else {
                toast.error(
                  "Payment verification failed. Please contact support."
                );
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              toast.error(
                "Payment verification failed. Please contact support."
              );
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
        navigate("/ticket", { state: { booking: booking } });
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Payment initiation failed. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-cyan-200 via-blue-200 to-blue-300 overflow-hidden">
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
                      {field
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
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
            {couponError && (
              <p className="text-red-500 mt-2">{couponError}</p>
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
                      paid
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

                  {/* START: Display Discount if Applied */}
                  {discountAmount > 0 && (
                    <tr className="border-b text-green-600">
                      <td className="py-3 px-4">
                        Discount ({appliedCoupon?.code})
                      </td>
                      <td className="py-3 px-4">- ₹{discountAmount.toFixed(2)}</td>
                    </tr>
                  )}
                  {/* END: Display Discount */}

                  <tr className="border-b">
                    <td className="py-3 px-4">totalamount:</td>
                    <td className="py-3 px-4">₹{totalamount}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Remaining to be <br/>paid in waterpark:</td>
                    <td className="py-3 px-4">₹{remainingAmount}</td>
                  </tr>
                 
                  <tr>
                    <td className="py-3 px-4 font-semibold text-cyan-700">
                      Payable totalamount:
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