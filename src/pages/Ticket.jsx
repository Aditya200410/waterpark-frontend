import React, { useState, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Download, UserCircle, Users, Waves } from "lucide-react";
import AnimatedBubbles from '../components/AnimatedBubbles/AnimatedBubbles';

const WaterparkTicket = () => {
  const location = useLocation();
  const [booking, setBooking] = useState(null);

  const initialBooking = location.state?.booking || null;
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get("bookingId");

  // This useEffect fetches the booking data
  useEffect(() => {
    if (!initialBooking && bookingId) {
      axios
        .get(`${import.meta.env.VITE_SERVER_URL}/api/bookings/${bookingId}`)
        .then((response) => {
          setBooking(response.data.booking);
        })
        .catch((error) => {
          console.error("Error fetching booking:", error);
        });
    } else if (initialBooking) {
      setBooking(initialBooking);
    }
  }, [bookingId, initialBooking]);

  // The download handler is wrapped in useCallback for optimization
  const handleDownload = useCallback(async () => {
    // Make sure booking data and the ticket element are available
    if (!booking) return;
    const ticketElement = document.getElementById("ticket");
    if (!ticketElement) return;

    try {
      const canvas = await html2canvas(ticketElement, { 
        scale: 3, 
        useCORS: true, 
        backgroundColor: null,
        allowTaint: true,
        ignoreElements: (element) => element.id === 'background-image-loader'
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [210, 99] }); // DL envelope size
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`waterpark-ticket-${booking.customBookingId}.pdf`);
    } catch (error) {
      console.error("PDF Download Failed:", error);
      // Fallback to PNG download
      const canvas = await html2canvas(ticketElement, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `ticket-${booking.customBookingId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [booking]); // This function now depends on the booking data

  // This new useEffect triggers the download automatically
  useEffect(() => {
    // Only run this effect if booking data has been loaded
    if (booking) {
      // A short timeout ensures the component has fully rendered with the data
      // before html2canvas tries to capture it.
      const timer = setTimeout(() => {
        handleDownload();
      }, 500); // 500ms delay

      // Clean up the timeout if the component unmounts before it fires
      return () => clearTimeout(timer);
    }
  }, [booking, handleDownload]); // It runs when booking or handleDownload changes

  if (!booking) {
    return <div className="text-center text-gray-600 mt">Loading or no booking information available...</div>;
  }

  const remainingAmount = booking ? booking.totalAmount - booking.advanceAmount : 0;

  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-cyan-50 to-blue-100 min-h-screen py-10 pb-24 relative">
      <AnimatedBubbles />
      {/* The download button is kept as a manual fallback */}
      <button
        onClick={handleDownload}
        className="group flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 mb-8"
      >
        <Download className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
        Download Ticket Again
      </button>

      {/* Modern Ticket Design */}
      <div 
        id="ticket" 
        className="relative flex aspect-[210/99] min-w-[700px] w-full max-w-4xl text-blue-900 shadow-2xl overflow-hidden rounded-xl"
        style={{ 
          backgroundImage: `url('/tback.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-white/60 dark:bg-black/20 mix-blend-multiply opacity-80 z-0"></div>
        
        {/* Ticket Content */}
        <div className="relative z-10 flex w-full h-full">
          {/* Left Stub */}
          <div className="relative w-1/4 bg-gradient-to-b from-cyan-600 to-blue-700 text-white flex flex-col items-center justify-between p-4">
            <div className="text-center">
              <img src='/logo.png' alt="Logo" className="h-16 w-auto" />
            </div>
            
            {/* Terms and Conditions */}
            <div className="text-center font-display text-xs tracking-widest uppercase opacity-70 whitespace-pre-line">
              {`Please carry cash for remaining payment.
Drinking is strictly prohibited.
Pickup and drop service not included.
Waterpark holds final decision.
Contact 1 day before check-in for refunds.`}
            </div>
            
            <Waves className="w-8 h-8 text-white opacity-40"/>
          </div>

          {/* Main Content */}
          <div className="relative w-3/4 flex flex-col p-6 border-l-2 border-dashed border-blue-400/80">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-display text-4xl font-extrabold text-blue-900">{booking.waterparkName}</h2>
                <p className="font-sans text-sm mt-3 text-blue-800">Present this ticket at the entrance.</p>
              </div>
              <div className="text-right">
                <p className="font-sans text-xs font-bold text-blue-800 uppercase">Visit Date</p>
                <p className="font-display font-extrabold text-2xl text-cyan-700">{new Date(booking.date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 my-auto">
              <div className="flex items-center gap-3">
                <UserCircle className="w-6 h-6 text-cyan-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-blue-800 uppercase">Guest Name</p>
                  <p className="font-bold text-base text-blue-900">{booking.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-cyan-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-blue-800 uppercase">Guests</p>
                  <p className="font-bold text-base text-blue-900">{booking.adults} Adults, {booking.children} Children</p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-dashed border-blue-400/80 flex justify-between items-end">
              <div>
                <p className="font-sans text-xs font-bold text-blue-800 uppercase">Booking ID</p>
                <p className="font-mono text-xl font-bold tracking-wider text-blue-900">{booking.customBookingId}</p>
              </div>
              <div className="text-right">
                <p className="font-sans text-xs font-bold text-blue-800 uppercase">Amount Paid</p>
                <p className="font-display font-extrabold text-3xl text-blue-900">₹{booking.advanceAmount.toLocaleString("en-IN")}</p>
              </div>
              <div className="text-right">
                <p className="font-sans text-xs font-bold text-blue-800 uppercase">Amount To Pay</p>
                <p className="font-display font-extrabold text-3xl text-blue-600">₹{remainingAmount.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterparkTicket;