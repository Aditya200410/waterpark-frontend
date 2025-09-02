import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, UserCircle, Phone, Users, CalendarDays, Ticket as TicketIcon, X } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import toast from 'react-hot-toast';

// A subtle, elegant watermark for the ticket background
const WaveWatermark = () => (
  <svg className="absolute inset-0 w-full h-full text-brand-navy opacity-[0.03]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
    <path fill="currentColor" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,133.3C672,117,768,139,864,165.3C960,192,1056,224,1152,218.7C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
  </svg>
);

const OrderDetailsModal = ({ orderId, onClose }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    const ticketElement = document.getElementById("ticket-to-print");
    if (!ticketElement) {
      toast.error("Ticket element not found.");
      return;
    }
    toast.loading("Generating ticket...", { id: 'download-toast' });
    try {
      const canvas = await html2canvas(ticketElement, { scale: 3, useCORS: true, backgroundColor: null });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [210, 99] }); // DL envelope size
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${order?.customBookingId}.pdf`);
      toast.success("ticket downloaded!", { id: 'download-toast' });
    } catch (error) {
      console.error("PDF Download Failed:", error);
      toast.error("Download failed.", { id: 'download-toast' });
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/bookings/${orderId}`);
        const data = await res.json();
        if (data.booking) setOrder(data.booking);
        else setError("No booking details found.");
      } catch (err) {
        setError("Failed to load order details.");
        console.error("Error fetching order details:", err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrderDetails();
  }, [orderId]);

  const remainingAmount = order ? order.totalAmount - order.advanceAmount : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="h-full fixed inset-0 z-[500] flex flex-col items-center justify-center bg-black/70 backdrop-blur-md p-4"
        onClick={onClose}
      >
        {loading ? (
          <div className="animate-spin w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full"></div>
        ) : error ? (
          <div className="text-center text-red-400 p-8 bg-brand-navy rounded-lg">{error}</div>
        ) : order ? (
          <>
          {/* MODIFICATION: Added overflow-x-auto to this wrapper */}
            <motion.div
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-4xl font-sans overflow-x-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* MODIFICATION: Set a minimum width for the ticket */}
              <div id="ticket-to-print" className="relative flex aspect-[210/99] min-w-[700px] w-full bg-brand-cream text-brand-navy shadow-2xl overflow-hidden">
                <WaveWatermark />
                
                {/* Left Stub */}
                <div className="relative w-1/4 bg-brand-navy text-brand-cream flex flex-col items-center justify-between p-4">
                  <div className="text-center">
                    <p className="font-display text-2xl tracking-tighter leading-none">Water park</p>
                    <p className="font-sans text-xs font-bold tracking-[0.2em]">PASS</p>
                  </div>
                  <div className=" text-center font-display text-xs tracking-widest uppercase opacity-100">
                    {order.terms}
                  </div>
                  <TicketIcon className="w-8 h-8 text-brand-gold opacity-50"/>
                </div>

                {/* Main Content */}
                <div className="relative w-3/4 flex flex-col p-6 border-l-2 border-dashed border-brand-navy/30">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="font-display text-4xl font-extrabold text-brand-navy">{order.waterparkName}</h2>
                      <p className="font-sans text-sm text-brand-navy/60">Show this on Extrance </p>
                    </div>
                    <div className="text-right">
                       <p className="font-sans text-xs font-bold text-brand-navy/60 uppercase">Visit Date</p>
                       <p className="font-display font-extrabold text-2xl text-brand-gold">{new Date(order.date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 my-auto">
                    <div className="flex items-center gap-3">
                      <UserCircle className="w-6 h-6 text-brand-gold flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-brand-navy/60 uppercase">Guest Name</p>
                        <p className="font-bold text-base text-brand-navy">{order.name}</p>
                      </div>
                    </div>
                     <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-brand-gold flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-brand-navy/60 uppercase">Guests</p>
                        <p className="font-bold text-base text-brand-navy">{order.adults} Adults, {order.children} Children</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-dashed border-brand-navy/30 flex justify-between items-end">
                    <div>
                      <p className="font-sans text-xs font-bold text-brand-navy/60 uppercase">Booking ID</p>
                      <p className="font-mono text-xl font-bold tracking-wider text-brand-navy">{order.customBookingId}</p>
                    </div>
                     <div className="text-right">
                       <p className="font-sans text-xs font-bold text-brand-navy/60 uppercase">Amount Paid</p>
                       <p className="font-display font-extrabold text-3xl text-brand-navy">₹{order.advanceAmount.toLocaleString("en-IN")}</p>
                    </div>
                     <div className="text-right">
                       <p className="font-sans text-xs font-bold text-brand-navy/60 uppercase">Amount To Pay</p>
                       <p className="font-display font-extrabold text-3xl text-brand-navy">₹{remainingAmount.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons (outside the printable area) */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={handleDownload}
                className="group flex items-center gap-2 bg-gold-gradient text-brand-navy font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Download className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
                Download ticket
              </button>
               <button onClick={onClose} className="text-white/60 hover:text-white font-bold transition-colors">Close</button>
            </div>
          </>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}

export default OrderDetailsModal;