import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, UserCircle, Phone, Users, CalendarDays, Ticket as TicketIcon, X } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import toast from 'react-hot-toast';

// A subtle wave SVG for decoration
const WaveBanner = () => (
  <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden z-0">
    <svg className="absolute bottom-0 w-[200%] h-auto text-white opacity-10" viewBox="0 0 1440 150">
      <path fill="currentColor" d="M0,64L40,80C80,96,160,128,240,128C320,128,400,96,480,85.3C560,75,640,85,720,101.3C800,117,880,139,960,138.7C1040,139,1120,117,1200,101.3C1280,85,1360,75,1400,69.3L1440,64L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
    </svg>
  </div>
);


const OrderDetailsModal = ({ orderId, onClose }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    const ticketElement = document.getElementById("ticket-card-content");
    if (!ticketElement) {
      toast.error("Could not find ticket element to download.");
      return;
    }

    toast.loading("Generating your ticket...", { id: 'download-toast' });

    try {
      const canvas = await html2canvas(ticketElement, {
        scale: 2.5, // High scale for better quality
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // This calculation maintains the aspect ratio of the ticket
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      // **THE FIX:** Center the image vertically on the A4 page
      const yPos = (pageHeight - imgHeight) / 2;
      
      pdf.addImage(imgData, "PNG", 0, yPos > 0 ? yPos : 0, pageWidth, imgHeight);
      pdf.save(`Waterpark-Ticket-${order?.customBookingId || 'details'}.pdf`);

      toast.success("Download successful!", { id: 'download-toast' });

    } catch (error) {
      console.error("PDF Download Failed:", error);
      toast.error("Could not download ticket.", { id: 'download-toast' });
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/bookings/${orderId}`);
        const data = await res.json();
        
        if (data.booking) {
          setOrder(data.booking);
        } else {
          setOrder(null);
          setError("No booking details found for this ID.");
        }
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

  const remainingAmount = order ? order.totalAmount - order.advanceAmount : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 40 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-gray-100 flex flex-col font-sans scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
          onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 flex justify-between items-center rounded-t-xl shadow-md z-20">
            <h2 className="text-xl font-bold text-white tracking-wide">
              Booking Confirmation
            </h2>
            <button
              onClick={onClose}
              className="group p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Close booking details"
            >
              <X className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Content Area */}
          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 py-12 px-6 bg-red-50 rounded-lg">{error}</div>
            ) : order ? (
              <div id="ticket-card-content" className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Resort Name Section */}
                <div className="text-center py-5 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-3xl font-extrabold text-gray-800 font-serif tracking-tight">
                    {order.waterparkName}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1 font-mono">
                    BOOKING ID: {order.customBookingId}
                  </p>
                </div>

                {/* Main Details Grid */}
                <div className="p-6 text-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 border-b border-gray-200">
                  {/* Re-structured grid items for clarity */}
                  <div className="flex items-start gap-3">
                    <UserCircle className="w-6 h-6 text-cyan-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Name</p>
                      <p className="font-bold text-base text-gray-900">{order.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-6 h-6 text-cyan-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Contact</p>
                      <p className="font-bold text-base text-gray-900">{order.phone}</p>
                    </div>
                  </div>
                   <div className="flex items-start gap-3">
                    <Users className="w-6 h-6 text-cyan-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Guests</p>
                      <p className="font-bold text-base text-gray-900">{order.adults} Adults, {order.children} Children</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CalendarDays className="w-6 h-6 text-cyan-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Visit Date</p>
                      <p className="font-extrabold text-base text-green-600">{new Date(order.date).toLocaleDateString("en-GB")}</p>
                    </div>
                  </div>
                </div>
                
                {/* Package Inclusion */}
                <div className="text-center py-4 bg-gray-50">
                    <p className="text-sm font-medium text-gray-600 uppercase">Package Inclusion</p>
                    <p className="text-lg font-bold text-gray-800 mt-1">BREAKFAST + LUNCH + TEA</p>
                </div>

                {/* Amount Pay Banner */}
                <div className="text-center font-serif font-extrabold text-2xl p-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg relative overflow-hidden z-10">
                  <WaveBanner />
                  <div className="relative z-10">
                    <p className="text-sm font-sans font-bold opacity-80">AMOUNT TO PAY AT COUNTER</p>
                     ₹{remainingAmount.toLocaleString("en-IN")}/-
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="p-6 bg-gray-50">
                  <h4 className="font-serif font-bold text-center mb-4 text-gray-700 text-lg">Terms & Conditions</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                    <li>Show this coupon at the counter & pay the remaining amount.</li>
                    <li>Remaining payment must be made in cash.</li>
                    <li>Alcohol is strictly prohibited.</li>
                    <li>For refund/cancellation, contact us 24 hours prior to your check-in date.</li>
                    <li>Management holds the final decision in case of any dispute.</li>
                  </ul>
                </div>

                {/* Final Amount Details */}
                <div className="p-6 text-gray-800 grid grid-cols-2 gap-y-4 gap-x-8 border-t border-gray-200 bg-gray-100 rounded-b-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-500">TOTAL AMOUNT:</p>
                    <p className="font-semibold text-gray-900">₹{order.totalAmount.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">PAID AMOUNT:</p>
                    <p className="font-semibold text-gray-900">₹{order.advanceAmount.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">No booking details to display.</div>
            )}
          </div>
          
         
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default OrderDetailsModal;