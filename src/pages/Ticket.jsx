import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const WaterparkTicket = () => {
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [status, setStatus] = useState("Loading booking information...");
  const hasDownloaded = useRef(false); // Ref to prevent multiple downloads

  const initialBooking = location.state?.booking || null;
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get("bookingId");

  // Function to handle the download logic
  const handleDownload = () => {
    const ticketElement = document.getElementById("ticket");
    if (ticketElement) {
      toast.loading("Capturing ticket image...", { id: "download-toast" });
      html2canvas(ticketElement, {
        scale: 2.5, // Higher resolution for better quality
        useCORS: true,
        backgroundColor: '#ffffff', // Set a solid background for the image
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `waterpark-ticket-${booking?.customBookingId || "details"}.png`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Download started!", { id: "download-toast" });
        setStatus("✅ Ticket downloaded successfully!");
      }).catch(err => {
        console.error("Failed to generate ticket image:", err);
        toast.error("Could not generate ticket.", { id: "download-toast" });
        setStatus("❌ Failed to generate ticket.");
      });
    }
  };

  // Effect to fetch booking data
  useEffect(() => {
    if (!initialBooking && bookingId) {
      axios
        .get(`${import.meta.env.VITE_SERVER_URL}/api/bookings/${bookingId}`)
        .then((response) => {
          setBooking(response.data.booking);
          setStatus("Booking loaded. Preparing download...");
        })
        .catch((error) => {
          console.error("Error fetching booking:", error);
          setBooking(null);
          setStatus("Could not find booking information.");
        });
    } else if (initialBooking) {
      setBooking(initialBooking);
      setStatus("Booking loaded. Preparing download...");
    }
  }, [bookingId, initialBooking]);

  // Effect to trigger download automatically once booking is set
  useEffect(() => {
    // Check if booking data is available and download hasn't been initiated
    if (booking && !hasDownloaded.current) {
      // Set the flag to true immediately to prevent re-triggering
      hasDownloaded.current = true;
      
      // Use a short timeout to ensure the DOM is fully painted before capturing
      const timer = setTimeout(() => {
        handleDownload();
      }, 1000); // 1-second delay for rendering

      return () => clearTimeout(timer); // Cleanup timer if component unmounts
    }
  }, [booking]); // This effect depends on the 'booking' state

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-gray-600 font-semibold text-xl">
        {status}
      </div>
    );
  }

  const remainingAmount = booking.totalAmount - booking.advanceAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <Toaster position="top-center" />
      
      {/* Animated bubbles for water theme */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -500, 0], x: [0, 50, -50, 0] }}
          transition={{ repeat: Infinity, duration: 8 + i * 0.5, ease: "easeInOut" }}
          className="absolute w-6 h-6 rounded-full bg-blue-300/50 z-0"
          style={{ left: `${10 + i * 10}%`, bottom: `${-50 - i * 20}px` }}
        />
      ))}

      {/* Ticket Container */}
      <div
        id="ticket"
        className="max-w-xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-2"
      >
        <div className="border-2 border-dashed border-cyan-300 rounded-[20px] p-6 sm:p-8 flex flex-col h-full">

          {/* Resort Name Section */}
          <div className="text-center pb-4 border-b border-gray-200">
            <h2 className="text-3xl font-extrabold text-gray-800 font-serif">
              {booking.waterparkName}
            </h2>
            <p className="text-sm text-gray-500 mt-1 font-mono">
              BOOKING ID: {booking.customBookingId}
            </p>
          </div>

          {/* Main Details Grid */}
          <div className="py-6 text-gray-800 grid grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <p className="text-sm font-medium text-gray-500">NAME:</p>
              <p className="font-semibold text-gray-900">{booking.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ADULT COUNT:</p>
              <p className="font-semibold text-gray-900">{booking.adults}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">CONTACT:</p>
              <p className="font-semibold text-gray-900">{booking.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">CHILD COUNT:</p>
              <p className="font-semibold text-gray-900">{booking.children}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">BOOKING DATE:</p>
              <p className="font-semibold text-gray-900">
                {new Date(booking.bookingDate).toLocaleDateString("en-GB")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">VISIT DATE:</p>
              <p className="font-semibold text-green-600 text-lg">
                {new Date(booking.date).toLocaleDateString("en-GB")}
              </p>
            </div>
          </div>

          {/* Amount Pay Banner */}
          <div className="text-center font-serif font-extrabold text-xl my-4 p-5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg">
            AMOUNT TO PAY AT COUNTER: ₹{remainingAmount.toLocaleString("en-IN")}/-
          </div>

          {/* Terms and Conditions */}
          <div className="pt-4 flex-grow">
            <h4 className="font-serif font-bold text-center mb-3 text-gray-700 text-lg">
              Terms & Conditions
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5">
              <li>Show this coupon at the counter & pay the remaining amount in cash.</li>
              <li>Alcohol is strictly prohibited in the Waterpark.</li>
              <li>For refunds/cancellations, contact us 24 hours prior to your check-in date.</li>
              <li>Management holds the final decision in case of any dispute.</li>
            </ul>
          </div>

        
        </div>
      </div>
      
      {/* Status message for the user */}
      <div className="mt-8 text-center font-semibold text-gray-700 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full shadow-md">
        <p>{status}</p>
      </div>
    </div>
  );
};

export default WaterparkTicket;