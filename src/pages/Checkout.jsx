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
  const { adultCount, childCount, date, resortName, subtotal, deposit, resortId } = checkoutData;



  const [billingDetails, setBillingDetails] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    city: "",
    createAccount: false,
    total: subtotal,
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

  const handlePayment = async (e) => {
    e.preventDefault();
    if (billingDetails.email === "" || billingDetails.firstName === "" || billingDetails.lastName === "" || billingDetails.phone === "" || billingDetails.city === "") {
      toast.error("Please fill all the details");
      return;
    }

    try {
      console.log("Order placed with details:", billingDetails, paymentMethod, resortId);

      const response = await axios.post("http://localhost:5175/api/bookings/create", {
        waterpark: resortId,
        waterparkName: resortName,
        name: `${billingDetails.firstName} ${billingDetails.lastName}`,
        email: billingDetails.email,
        phone: billingDetails.phone,
        date: date,
        adults: adultCount,
        children: childCount,
        total: subtotal,
        advanceAmount: deposit,
        paymentType: paymentMethod,
      });

      const { success, orderId, booking, key, amount, currency, name, description, prefill } = response.data;

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
              const verifyResponse = await axios.post("https://water-backend-fe1c.onrender.com/api/bookings/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: booking._id
              });

              if (verifyResponse.data.success) {
                toast.success("Payment successful!");
                navigate("/ticket", { state: { booking: verifyResponse.data.booking } });
              } else {
                toast.error("Payment verification failed. Please contact support.");
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              toast.error("Payment verification failed. Please contact support.");
            }
          },
          modal: {
            ondismiss: function() {
              toast.info("Payment cancelled");
            }
          }
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
        <svg viewBox="0 0 1440 320" className="w-full h-32 text-cyan-300">
          <path
            fill="currentColor"
            fillOpacity="1"
            d="M0,96L48,122.7C96,149,192,203,288,224C384,245,480,235,576,202.7C672,171,768,117,864,96C960,75,1056,85,1152,112C1248,139,1344,181,1392,202.7L1440,224L1440,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Checkout card */}
      <div className="mt-10 mb-10  relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-10 z-10 border-4 border-cyan-300">
        <h1 className="text-4xl font-bold text-blue-700 text-center mb-8">
          🎢 Water Park Checkout 💦
        </h1>

        <form className="space-y-10">
          {/* Billing Details */}
          <div>
            <h2 className="text-2xl font-semibold text-cyan-600 mb-4">Billing Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["firstName", "lastName", "phone", "email", "city"].map((field) => (
                <div key={field} className="flex flex-col">
                  <label htmlFor={field} className="text-gray-700 font-medium mb-2">
                    {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
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
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-2xl font-semibold text-cyan-600 mb-4">Your Order</h2>
            <div className="overflow-x-auto bg-cyan-50 rounded-lg shadow">
              <table className="w-full text-left border-collapse">
                <thead className="bg-cyan-100">
                  <tr>
                    <th className="py-3 px-4 text-blue-700 font-medium">Product</th>
                    <th className="py-3 px-4 text-blue-700 font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">
                      {resortName} x 1
                      <br />
                      <span className="text-sm text-gray-500">
                        Check-in: {date} | Adults: {adultCount} | Children: {childCount}
                      </span>
                    </td>
                    <td className="py-3 px-4">₹{subtotal}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Deposit:</td>
                    <td className="py-3 px-4">₹{deposit}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Remaining:</td>
                    <td className="py-3 px-4">₹{subtotal - deposit}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Total payable:</td>
                    <td className="py-3 px-4 font-semibold">₹{subtotal}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-cyan-700">Payable deposit:</td>
                    <td className="py-3 px-4 font-semibold text-cyan-700">₹{deposit}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h2 className="text-2xl font-semibold text-cyan-600 mb-4">Payment Method</h2>
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
        <svg viewBox="0 0 1440 320" className="w-full h-32 text-blue-400">
          <path
            fill="currentColor"
            fillOpacity="1"
            d="M0,224L30,224C60,224,120,224,180,197.3C240,171,300,117,360,122.7C420,128,480,192,540,224C600,256,660,256,720,224C780,192,840,128,900,117.3C960,107,1020,149,1080,181.3C1140,213,1200,235,1260,229.3C1320,224,1380,192,1410,176L1440,160L1440,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}

export default CheckoutPage;
