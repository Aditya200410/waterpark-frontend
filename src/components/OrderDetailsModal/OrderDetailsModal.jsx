import { useEffect, useState } from 'react';
import Loader from '../Loader/Loader'; // Assuming you have this component
import { motion, AnimatePresence } from 'framer-motion';
import { Download, UserCircleIcon, PhoneIcon, UsersIcon, CalendarDaysIcon, TagIcon} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import toast from 'react-hot-toast';

const OrderDetailsModal = ({ orderId, onClose }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const handleDownload = async () => {
    const ticketElement = document.getElementById("ticket-card-content");

    // 1. Check if the element exists
    if (!ticketElement) {
      console.error("Download Error: Ticket element with ID 'ticket-card-content' not found.");
      toast.error("Could not find ticket element to download.");
      return;
    }

    toast.loading("Generating ticket image...", { id: 'download-toast' });

    try {
      // 2. Run html2canvas with better options
      const canvas = await html2canvas(ticketElement, {
        scale: 2.5, // Use a higher scale for better quality
        useCORS: true, // Attempt to use CORS for cross-origin images
        allowTaint: true, // Fallback for CORS issues, might "taint" the canvas
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL("image/png");

      // 3. Check if image data is valid
      if (!imgData || imgData === 'data:,') {
        throw new Error("Canvas is empty. This is often caused by a cross-origin image that cannot be rendered.");
      }
      
      toast.loading("Creating PDF...", { id: 'download-toast' });

      // 4. Generate PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Waterpark-Ticket-${order?._id || 'details'}.pdf`);

      toast.success("Download successful!", { id: 'download-toast' });

    } catch (error) {
      console.error("PDF Download Failed:", error);
      toast.error("Could not download ticket. See console for details.", { id: 'download-toast' });
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
        className="fixed top-20 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 40 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-gray-100 flex flex-col font-sans"
        >
          {/* Header */}
          <div className="sticky   bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 flex justify-between items-center rounded-t-xl shadow-md z-20">
            <h2 className="text-xl font-bold text-white tracking-wide">
              Booking Confirmation
            </h2>
            <button
              onClick={onClose}
              className="group p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Close booking details"
            >
              <svg className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
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
              // This div wraps the content that will be downloaded
              <div id="ticket-card-content" className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header Banner */}
              

                {/* Resort Name Section */}
                <div className="text-center py-4 bg-gradient-to-t from-gray-50 to-white border-b border-gray-200">
                  <h2 className="text-3xl font-extrabold text-gray-800 font-serif tracking-tight">
                  {order.waterparkName}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    (BOOKING ID: {order._id})
                  </p>
                </div>

                {/* Main Details Grid */}
                <div className="p-6 text-gray-800 grid grid-cols-2 gap-y-4 gap-x-8 border-b border-gray-100">
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Name</p>
                        <p className="font-semibold text-base text-gray-900">{order.name}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Adult Count</p>
                        <p className="font-semibold text-base text-gray-900">{order.adults}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Contact</p>
                        <p className="font-semibold text-base text-gray-900">{order.phone}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Child Count</p>
                        <p className="font-semibold text-base text-gray-900">{order.children}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Booking Date</p>
                        <p className="font-semibold text-base text-gray-900">{new Date(order.bookingDate).toLocaleDateString("en-GB")}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Visit Date</p>
                        <p className="font-bold text-base text-green-600">{new Date(order.date).toLocaleDateString("en-GB")}</p>
                    </div>
                </div>
                
                {/* Package Inclusion */}
                <div className="text-center py-4 bg-gray-50 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-600 uppercase">Package Inclusion</p>
                    <p className="text-lg font-bold text-gray-800 mt-1">BREAKFAST + LUNCH + TEA</p>
                </div>

              

                {/* Amount Pay Banner */}
                <div className="text-center font-serif font-extrabold text-xl p-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg relative z-10">
                  AMOUNT PAY ON WATERPARK - ₹{remainingAmount.toLocaleString("en-IN")}/-
                </div>

                {/* Terms and Conditions */}
                <div className="p-6 pt-4 bg-gray-50 border-b border-gray-200">
                  <h4 className="font-serif font-bold text-center mb-4 text-gray-700 text-lg">TERM & CONDITION</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                    <li>Show this coupon at counter & pay the remaining amount.</li>
                    <li>It is compulsory to bring the remaining money in cash.</li>
                    <li>Drinking is strictly prohibited in Waterpark.</li>
                    <li>For refund and cancellation contact us before one day of your check in date.</li>
                    <li>If any case of any dispute and misunderstanding Waterpark hold final decision.</li>
                  </ul>
                </div>

                {/* My Resort Booking text */}
                <div className="text-center py-4 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
                  <p className="text-xl font-serif font-extrabold text-blue-700">~My Resort Booking~</p>
                </div>

                {/* Final Amount Details */}
                <div className="p-6 text-gray-800 grid grid-cols-2 gap-y-4 gap-x-8 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-500">ADULT:-</p>
                    <p className="font-semibold text-gray-900">{order.adults} X 550 = ₹{(order.adults * 550).toLocaleString("en-IN")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">TOTAL AMOUNT:-</p>
                    <p className="font-semibold text-gray-900">₹{order.totalAmount.toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">CHILD:-</p>
                    <p className="font-semibold text-gray-900">{order.children} X 400 = ₹{(order.children * 400).toLocaleString("en-IN")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">PAID AMOUNT:-</p>
                    <p className="font-semibold text-gray-900">₹{order.advanceAmount.toLocaleString("en-IN")}</p>
                  </div>
                   <div>
                    <p className="text-sm font-medium text-gray-500">PICKUP DROP:-</p>
                    <p className="font-semibold text-gray-900">₹0</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">REMAINING AMOUNT:-</p>
                    <p className="font-semibold text-gray-900">₹{remainingAmount.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">No booking details to display.</div>
            )}
          </div>
          
          {/* Download Button Footer */}
          {order && (
            <div className="sticky bottom-0 flex justify-center p-4 bg-gray-100/80 backdrop-blur-sm border-t border-gray-200 rounded-b-xl">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-full hover:scale-105 shadow-lg hover:shadow-green-500/40 transition-all"
              >
                <Download className="w-5 h-5" /> Download as PDF
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default OrderDetailsModal;