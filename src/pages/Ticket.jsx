import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { useLocation } from "react-router-dom";
import axios from "axios";
// If you want a real QR code, you'd install a library like 'qrcode.react'
// import QRCode from "qrcode.react";

const WaterparkTicket = () => {
  const location = useLocation();
  const [booking, setBooking] = useState(null);

  const initialBooking = location.state?.booking || null;
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get("bookingId");

  useEffect(() => {
    if (!initialBooking && bookingId) {
      axios
        .get(`${import.meta.env.VITE_SERVER_URL}/api/bookings/${bookingId}`)
        .then((response) => {
          setBooking(response.data.booking);
        })
        .catch((error) => {
          console.error("Error fetching booking:", error);
          setBooking(null);
        });
    } else if (initialBooking) {
      setBooking(initialBooking);
    }
  }, [bookingId, initialBooking]);

  const handleDownload = () => {
    const ticketElement = document.getElementById("ticket");
    if (ticketElement) {
      html2canvas(ticketElement, {
        scale: 2, // Higher resolution for clarity
        useCORS: true, // Important for external images like logos
        allowTaint: true, // Allows cross-origin images to be rendered, but taints the canvas
        width: 800, // Define a fixed width for the screenshot
        height: 1130, // Define a fixed height for the screenshot (A4 aspect ratio approx)
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `waterpark-ticket-${booking?._id || "details"}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-gray-600">
        Loading booking information...
      </div>
    );
  }

  // Calculate remaining amount based on your data structure
  const remainingAmount = booking.totalAmount - booking.advanceAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Animated bubbles for water theme */}
  {[...Array(10)].map((_, i) => (
    <motion.div
      key={i}
      animate={{ y: [0, -500, 0], x: [0, 50, -50, 0] }}
      transition={{ repeat: Infinity, duration: 6 + i, ease: "easeInOut" }}
      className="absolute w-6 h-6 rounded-full bg-blue-300 z-[-1] "
      style={{ left: `${10 + i * 10}%`, bottom: `${-50 - i * 20}px` }}
    />
  ))} {/* Ticket Container */}
      <div
        id="ticket"
        className="max-w-xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform hover:scale-105 transition-transform duration-300 ease-in-out"
        style={{ width: "800px", height: "1130px", boxSizing: "border-box" }} // Fixed dimensions for consistency
      >
       

        {/* Resort Name Section */}
        <div className="text-center py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-3xl font-extrabold text-gray-800 font-serif">
            {booking.waterparkName}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            (BOOKING ID: {booking._id})
          </p>
        </div>

        {/* Main Details Grid */}
        <div className="p-6 sm:p-8 text-gray-800 grid grid-cols-2 gap-y-4 gap-x-8">
          {/* Row 1 */}
          <div>
            <p className="text-sm font-medium text-gray-500">NAME:-</p>
            <p className="font-semibold text-gray-900">{booking.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">ADULT COUNT:-</p>
            <p className="font-semibold text-gray-900">{booking.adults}</p>
          </div>

          {/* Row 2 */}
          <div>
            <p className="text-sm font-medium text-gray-500">CONTACT:-</p>
            <p className="font-semibold text-gray-900">{booking.phone}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">CHILD COUNT:-</p>
            <p className="font-semibold text-gray-900">{booking.children}</p>
          </div>

          {/* Row 3 */}
          <div>
            <p className="text-sm font-medium text-gray-500">BOOKING DATE:-</p>
            <p className="font-semibold text-gray-900">
              {new Date(booking.bookingDate).toLocaleDateString("en-GB")}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">VISIT DATE:-</p>
            <p className="font-semibold text-green-600">
              {new Date(booking.date).toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>

        {/* Package Inclusion */}
        <div className="text-center py-4 bg-gray-50 border-y border-gray-200 mt-4">
          <p className="text-sm font-medium text-gray-600">
            PACKAGE INCLUSION
          </p>
          <p className="text-lg font-bold text-gray-800 mt-1">
            BREAKFAST + LUNCH + TEA
          </p>
        </div>

       

        {/* Amount Pay Banner */}
        <div className="text-center font-serif font-extrabold text-xl p-5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-b-4 border-blue-700 shadow-md transform hover:scale-101 transition-transform">
          AMOUNT PAY ON WATERPARK - ₹{remainingAmount.toLocaleString("en-IN")}
          /-
        </div>

        {/* Terms and Conditions */}
        <div className="p-6 sm:p-8 pt-4">
          <h4 className="font-serif font-bold text-center mb-4 text-gray-700 text-lg">
            TERM & CONDITION
          </h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>Show this coupon at counter & pay the remaining amount.</li>
            <li>It is compulsory to bring the remaining money in cash.</li>
            <li>For a better experience, reach the Waterpark before it open.</li>
            <li>Drinking is strictly prohibited in Waterpark.</li>
            <li>
              For refund and cancellation contact us before one day of your
              check in date.
            </li>
            <li>
              If any case of any dispute and misunderstanding Waterpark hold
              final decision.
            </li>
          </ul>
        </div>

        {/* My Resort Booking text */}
        <div className="text-center py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xl font-serif font-extrabold text-blue-700">
            ~My Resort Booking~
          </p>
        </div>

        {/* Final Amount Details */}
        <div className="p-6 sm:p-8 text-gray-800 grid grid-cols-2 gap-y-4 gap-x-8 border-t border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-500">ADULT:-</p>
            <p className="font-semibold text-gray-900">
              {booking.adults} X 550 = ₹{(booking.adults * 550).toLocaleString("en-IN")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500">TOTAL AMOUNT:-</p>
            <p className="font-semibold text-gray-900">₹{booking.totalAmount.toLocaleString("en-IN")}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">CHILD:-</p>
            <p className="font-semibold text-gray-900">
              {booking.children} X 400 = ₹{(booking.children * 400).toLocaleString("en-IN")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500">PAID AMOUNT:-</p>
            <p className="font-semibold text-gray-900">₹{booking.advanceAmount.toLocaleString("en-IN")}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">PICKUP DROP:-</p>
            <p className="font-semibold text-gray-900">₹0</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500">
              REMAINING AMOUNT:-
            </p>
            <p className="font-semibold text-gray-900">₹{remainingAmount.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="mt-8 flex items-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-full border border-blue-300 shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300 font-serif font-bold text-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Download Ticket (PNG)
      </button>
    </div>
  );
};

export default WaterparkTicket;