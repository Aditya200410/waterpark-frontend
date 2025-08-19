import { useEffect, useState } from 'react';
import { orderAPI } from '../../services/api';
import Loader from '../Loader/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

 // Function to download ticket as PDF
  const handleDownload = async () => {
    const ticketElement = document.getElementById("ticket-card");
    if (!ticketElement) return;

    const canvas = await html2canvas(ticketElement, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Waterpark-Ticket.pdf");
  };

const OrderDetailsModal = ({ orderId, onClose }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

 useEffect(() => {
  const fetchOrderDetails = async () => {
    try {
      console.log("Fetching order details for ID:", orderId);
      setLoading(true);
      setError(null);

      const res = await fetch(`https://water-backend-fe1c.onrender.com/api/bookings/${orderId}`);
      const data = await res.json();
      console.log("Raw API response:", data);

      // ✅ Store only booking object
      if (data.booking) {
        setOrder(data.booking);
      } else {
        setOrder(null);
        console.warn("No booking found in response:", data);
      }

      console.log("Order details fetched:", data.booking);
    } catch (err) {
      setError("Failed to load order details. Please try again later.");
      console.error("Error fetching order details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (orderId) {
    fetchOrderDetails();
  }
}, [orderId]);



  const getStatusColor = (status) => {
    const statusColors = {
      processing: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      manufacturing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-400 via-cyan-300 to-pink-200 bg-opacity-80 backdrop-blur-lg p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 40 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl bg-white/90 backdrop-blur-lg border-4 border-blue-300 font-['Poppins']"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-4 flex justify-between items-center rounded-t-2xl shadow-md">
            <h2 className="text-2xl font-extrabold text-white tracking-wide">
              🎟️ Waterpark Ticket
            </h2>
            <button
              onClick={onClose}
              className="group p-2 rounded-full hover:bg-white/20 transition-colors focus:outline-none"
              aria-label="Close booking details"
            >
              <svg
                className="w-6 h-6 text-white group-hover:text-yellow-200 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div id="ticket-card" className="p-6 sm:p-8 space-y-8">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">{error}</div>
            ) : order ? (
              <div className="space-y-6">
                {/* Ticket Header Info */}
                <div className="text-center">
                  <h3 className="text-3xl font-extrabold text-blue-600">
                    {order?.waterparkName}
                  </h3>
                  <p className="text-gray-600 italic">"Splash • Chill • Fun"</p>
                </div>

                {/* Booking Info */}
                <div className="grid grid-cols-2 gap-6 border-t border-dashed border-blue-300 pt-6">
                  <div>
                    <p className="text-xs text-gray-500">Booking ID</p>
                    <p className="font-mono text-sm text-blue-700">
                      #{order?._id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Visit Date</p>
                    <p className="font-bold text-gray-800">
                      {new Date(order?.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-semibold text-gray-800">
                      {order?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-800">
                      {order?.phone}
                    </p>
                  </div>
                </div>

                {/* Ticket Divider */}
                <div className="border-t-2 border-dotted border-blue-400 my-6"></div>

                {/* Guests Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-500">Adults</p>
                    <p className="font-bold text-blue-700">{order?.adults}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Children</p>
                    <p className="font-bold text-pink-600">{order?.children}</p>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="border-t border-dashed border-blue-300 pt-4 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-500">Advance Paid</p>
                    <p className="font-semibold text-green-600">
                      ₹{order?.advanceAmount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Amount</p>
                    <p className="text-2xl font-extrabold text-pink-700">
                      ₹{order?.totalAmount}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No booking details found.
              </div>
            )}
          </div>

          {/* Download Button */}
          {order && (
            <div className="flex justify-center p-6 rounded-b-3xl">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r  from-blue-400 via-blue-600 text-white font-bold rounded-full hover:scale-105 transition-transform"
              >
                <Download className="w-5 h-5" /> Download Ticket
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default OrderDetailsModal; 