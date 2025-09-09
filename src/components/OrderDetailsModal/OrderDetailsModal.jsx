import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, UserCircle, Phone, Users, CalendarDays, Ticket as TicketIcon, X, Waves, FileText } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import toast from 'react-hot-toast';

// A more prominent, water-themed watermark for the ticket background
const WaveWatermark = () => (
  <svg className="absolute inset-0 w-full h-full text-cyan-400 opacity-15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
    <path fill="currentColor" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,133.3C672,117,768,139,864,165.3C960,192,1056,224,1152,218.7C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
  </svg>
);

const OrderDetailsModal = ({ orderId, onClose }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDownloadPDF = async () => {
    if (!order) {
      toast.error("No booking data available");
      return;
    }

    try {
      toast.loading("Generating PDF ticket...", { id: 'download-toast' });
      
      // Generate PDF from booking data
      const visitDate = new Date(order.date).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const bookingDate = new Date(order.bookingDate).toLocaleDateString('en-IN');
      
      // Create a simple PDF using jsPDF
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      
      // Set font
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(24);
      pdf.text(order.waterparkName, 20, 30);
      
      pdf.setFontSize(16);
      pdf.text("Water Park Adventure Ticket", 20, 45);
      
      // Booking details
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      let yPos = 70;
      
      const details = [
        [`Booking ID: ${order.customBookingId}`, ""],
        [`Customer Name: ${order.name}`, ""],
        [`Email: ${order.email}`, ""],
        [`Phone: ${order.phone}`, ""],
        [`Water Number: ${order.waternumber}`, ""],
        [`Adults: ${order.adults}`, `Children: ${order.children}`],
        [`Booking Date: ${bookingDate}`, ""],
        [`Visit Date: ${visitDate}`, ""],
        [`Advance Paid: ₹${order.advanceAmount}`, `Total Amount: ₹${order.totalAmount}`],
        [`Remaining Amount: ₹${order.leftamount}`, ""]
      ];
      
      details.forEach(([left, right]) => {
        pdf.text(left, 20, yPos);
        if (right) {
          pdf.text(right, 100, yPos);
        }
        yPos += 8;
      });
      
      // Footer
      yPos += 20;
      pdf.setFontSize(10);
      pdf.text("Thank you for choosing " + order.waterparkName + "!", 20, yPos);
      pdf.text("Have a splashing good time!", 20, yPos + 8);
      pdf.text("Keep this ticket safe and show it at the entrance", 20, yPos + 16);
      
      // Save the PDF
      pdf.save(`waterpark-ticket-${order.customBookingId}.pdf`);
      toast.success("PDF ticket generated!", { id: 'download-toast' });
    } catch (error) {
      console.error("PDF Generation Failed:", error);
      toast.error("PDF generation failed. Please try again.", { id: 'download-toast' });
    }
  };

  const handleDownloadVisual = async () => {
    const ticketElement = document.getElementById("ticket-to-print");
    if (!ticketElement) {
      toast.error("Ticket element not found.");
      return;
    }
    toast.loading("Generating visual ticket...", { id: 'download-visual-toast' });
    try {
      const canvas = await html2canvas(ticketElement, { 
        scale: 3, 
        useCORS: true, 
        backgroundColor: null,
        // Ensure the background image is included in the canvas
        allowTaint: true, // May be needed for cross-origin images, but generally avoid
        ignoreElements: (element) => element.id === 'background-image-loader' // Ignore a potential loader for the image
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [210, 99] }); // DL envelope size
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`waterpark-ticket-${order?.customBookingId}.pdf`);
      toast.success("Visual ticket downloaded!", { id: 'download-visual-toast' });
    } catch (error) {
      console.error("Visual PDF Download Failed:", error);
      toast.error("Visual download failed. Please try again.", { id: 'download-visual-toast' });
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
       
        const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/bookings/${orderId.toLowerCase()}`);
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
        className="h-full fixed inset-0 z-[500] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4"
        onClick={onClose}
      >
        {loading ? (
          <div className="animate-spin w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full"></div>
        ) : error ? (
          <div className="text-center text-red-300 p-8 bg-blue-900/50 rounded-lg backdrop-blur-lg">{error}</div>
        ) : order ? (
          <>
            <motion.div
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-4xl font-sans overflow-x-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                id="ticket-to-print" 
                className="relative flex aspect-[210/99] min-w-[280px] sm:min-w-[400px] md:min-w-[600px] w-full text-blue-900 shadow-2xl overflow-hidden rounded-xl"
                style={{ 
                  backgroundImage: `url('/tback2.png')`, // Directly using the image
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)' // Fallback and slight overlay for text
                }}
              >
                {/* Optional: Overlay to ensure text readability on top of the image */}
                <div className="absolute inset-0 bg-white/60 dark:bg-black/20 mix-blend-multiply opacity-80 z-0"></div>
                
                {/* Original content of the ticket, now on top of the background image */}
                <div className="relative z-10 flex w-full h-full">
               



               {/* Left Stub */}
<div className="relative w-1/4 bg-gradient-to-b from-cyan-600 to-blue-700 text-white flex flex-col items-center justify-between p-1 sm:p-4">
  <div className="text-center">
    <img src='/logo.png' alt="Logo" className="w-12 h-12 sm:w-24 sm:h-24" />
  </div>

  {/* ✅ START: Updated Terms & Conditions Box */}
  <div className="w-full flex-grow flex flex-col overflow-hidden my-1 sm:my-2">
    <h3 className="text-center font-bold text-[6px] sm:text-sm uppercase tracking-wider mb-0.5  md:mb-2 flex-shrink-0">
      Terms & Conditions
    </h3>
    {/* This inner div becomes the scrollable container */}
    <div className="w-full h-full overflow-y-auto pr-1">
      <ul className="space-y-1 text-left text-[6px] sm:text-xs list-disc list-outside pl-2 sm:pl-4 opacity-80">
        {order.terms.split('\n').map((line, index) => (
          // This ensures that empty lines in your terms data won't create an empty list item
          line.trim() && <li key={index}>{line}</li>
        ))}
      </ul>
    </div>
  </div>
  {/* ✅ END: Updated Terms & Conditions Box */}

 
</div>


                    {/* Main Content */}
                    <div className="relative w-3/4 flex flex-col p-2 sm:p-6 border-l-2 border-dashed border-blue-400/80">
                      <div className="flex justify-between items-start mb-1 sm:mb-4">
                        <div>
                          <h2 className="font-display text-sm sm:text-2xl md:text-4xl font-extrabold text-blue-900 leading-tight">{order.waterparkName}</h2>
                          <p className="font-sans text-[10px] sm:text-sm mt-0.5 sm:mt-3 text-blue-800">Present this ticket at the entrance.</p>
                        </div>
                        <div className="text-right">
                          <p className="font-sans text-[8px] sm:text-xs font-bold text-blue-800 uppercase">Visit Date</p>
                          <p className="font-display font-extrabold text-xs sm:text-xl md:text-2xl text-cyan-700">{new Date(order.date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-1 sm:gap-x-6 gap-y-1 sm:gap-y-4 my-auto">
                        <div className="flex items-center gap-0.5 sm:gap-3">
                          <UserCircle className="w-3 h-3 sm:w-6 sm:h-6 text-cyan-600 flex-shrink-0" />
                          <div>
                            <p className="text-[8px] sm:text-xs font-bold text-blue-800 uppercase">Guest Name</p>
                            <p className="font-bold text-[10px] sm:text-base text-blue-900 leading-tight">{order.name}</p>
                          </div>
                        </div>
                         <div className="flex items-center gap-0.5 sm:gap-3">
                          <Users className="w-3 h-3 sm:w-6 sm:h-6 text-cyan-600 flex-shrink-0" />
                          <div>
                            <p className="text-[8px] sm:text-xs font-bold text-blue-800 uppercase">Guests</p>
                            <p className="font-bold text-[10px] sm:text-base text-blue-900 leading-tight">{order.adults} Adults, {order.children} Children</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto pt-1 sm:pt-4 border-t border-dashed border-blue-400/80">
  {/* ✅ Changed to always be a row and vertically centered */}
  <div className="flex flex-row justify-between items-center w-full">  <div>
                            <p className="font-sans text-[8px] sm:text-xs font-bold text-blue-800 uppercase">Booking ID</p>
                            <p className="font-mono text-[10px] sm:text-xl font-bold tracking-wider text-blue-900">{order.customBookingId}</p>
                          </div>
                          <div className="flex flex-row gap-2 sm:gap-6">
                            <div className="text-right">
                              <p className="font-sans text-[8px] sm:text-xs font-bold text-blue-800 uppercase">Amount Paid</p>
                              <p className="font-display font-extrabold text-sm sm:text-2xl md:text-3xl text-blue-900">₹{order.advanceAmount.toLocaleString("en-IN")}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-sans text-[8px] sm:text-xs font-bold text-red-600 uppercase">Amount To Pay</p>
                              <p className="font-display font-extrabold text-sm sm:text-2xl md:text-3xl text-red-600">₹{remainingAmount.toLocaleString("en-IN")}</p>
                            </div>
                          </div>
                        </div>
                      </div>



                   {/* contact information*/}
<div className="mt-auto pt-1 sm:pt-4 border-t border-dashed border-blue-400/80">
  {/* ✅ Changed to always be a row and vertically centered */}
  <div className="flex flex-row justify-between items-center w-full">
    <div>
      {/* ✅ Added whitespace-nowrap */}
      <p className="font-sans text-[8px] sm:text-xs font-bold text-blue-800 whitespace-nowrap">
        www.waterparkchalo.com
      </p>
    </div>
    <div className="flex flex-row items-center gap-2 sm:gap-4">
      {/* ✅ Added whitespace-nowrap */}
     
      {/* ✅ Added whitespace-nowrap */}
      <p className="font-sans text-[8px] sm:text-xs font-bold text-blue-600 uppercase whitespace-nowrap">
        +918847714464
      </p>
    </div>
  </div>
</div>
                    </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons (outside the printable area) */}
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 mt-2 sm:mt-6">
             
              <button
                onClick={handleDownloadVisual}
                className="group flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-1.5 sm:py-3 px-3 sm:px-6 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 text-xs sm:text-base"
              >
                <Download className="w-3 h-3 sm:w-5 sm:h-5 transition-transform group-hover:-translate-y-0.5" />
                <span className="hidden sm:inline">Download Ticket</span>
                <span className="sm:hidden">Visual</span>
              </button>
               <button onClick={onClose} className="text-white/60 hover:text-white font-bold transition-colors text-xs sm:text-base">Close</button>
            </div>
          </>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}

export default OrderDetailsModal;