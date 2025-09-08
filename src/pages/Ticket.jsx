import React, { useState, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Download, UserCircle, Users, Waves, FileText, ExternalLink } from "lucide-react";
import AnimatedBubbles from '../components/AnimatedBubbles/AnimatedBubbles';

const WaterparkTicket = () => {
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initialBooking = location.state?.booking || null;
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get("bookingId");

  // This useEffect fetches the booking data and ticket
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let bookingData = initialBooking;
        
        // Fetch booking data if not provided
        if (!initialBooking && bookingId) {
          const bookingResponse = await axios.get(
            `${import.meta.env.VITE_APP_API_BASE_URL}/api/bookings/${bookingId}`
          );
          bookingData = bookingResponse.data.booking;
        }
        
        if (bookingData) {
          setBooking(bookingData);
          
          // Fetch ticket data
          try {
            const ticketResponse = await axios.get(
              `${import.meta.env.VITE_APP_API_BASE_URL}/api/tickets/${bookingData.customBookingId}`
            );
            setTicket(ticketResponse.data.ticket);
          } catch (ticketError) {
            console.warn("Ticket not found or not generated yet:", ticketError);
            // Don't set error for ticket, just show the visual ticket
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load booking information");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [bookingId, initialBooking]);

  // Download PDF ticket from Cloudinary
  const handleDownloadPDF = useCallback(async () => {
    if (!ticket?.ticketPdfUrl) {
      console.error("No PDF ticket available");
      return;
    }

    try {
      // Create a temporary link to download the PDF
      const link = document.createElement("a");
      link.href = ticket.ticketPdfUrl;
      link.download = `waterpark-ticket-${booking.customBookingId}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("PDF Download Failed:", error);
    }
  }, [ticket, booking]);

  // The download handler for visual ticket (fallback)
  const handleDownloadVisual = useCallback(async () => {
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
    if (booking && !loading) {
      // A short timeout ensures the component has fully rendered with the data
      // before html2canvas tries to capture it.
      const timer = setTimeout(() => {
        // Try to download PDF first, fallback to visual ticket
        if (ticket?.ticketPdfUrl) {
          console.log("Downloading PDF ticket:", ticket.ticketPdfUrl);
          handleDownloadPDF();
        } else {
          console.log("No PDF ticket found, downloading visual ticket");
          handleDownloadVisual();
        }
      }, 1000); // Increased delay to 1 second

      // Clean up the timeout if the component unmounts before it fires
      return () => clearTimeout(timer);
    }
  }, [booking, loading, ticket, handleDownloadPDF, handleDownloadVisual]); // It runs when booking or handleDownload changes

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
        <AnimatedBubbles />
        <div className="text-center text-gray-600">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          Loading ticket...
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
        <AnimatedBubbles />
        <div className="text-center text-red-600">
          {error || "No booking information available"}
        </div>
      </div>
    );
  }

  const remainingAmount = booking ? booking.totalAmount - booking.advanceAmount : 0;

  return (
    <div className="flex flex-col items-center  min-h-screen py-10 pb-24 relative">
      <AnimatedBubbles />
      
      {/* Status and Download buttons */}
      <div className="flex flex-col items-center gap-4 mb-8">
        {!ticket?.ticketPdfUrl && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
              <span>Generating PDF ticket... This may take a few moments.</span>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-4">
          {ticket?.ticketPdfUrl ? (
            <button
              onClick={handleDownloadPDF}
              className="group flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <FileText className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
              Download PDF Ticket
            </button>
          ) : (
            <button
              onClick={handleDownloadVisual}
              className="group flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <Download className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
              Download Visual Ticket
            </button>
          )}
          
          {ticket?.ticketPdfUrl && (
            <a
              href={ticket.ticketPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <ExternalLink className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
              View PDF Online
            </a>
          )}
        </div>
      </div>

      {/* Modern Ticket Design */}
      <div 
        id="ticket" 
        className="relative flex flex-col md:flex-row aspect-[99/210] md:aspect-[210/99] w-full max-w-4xl text-blue-900 shadow-2xl overflow-hidden rounded-xl"
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
        <div className="relative z-10 flex flex-col md:flex-row w-full h-full">
          {/* Left Stub */}
          <div className="relative w-full md:w-1/4 bg-gradient-to-b from-cyan-600 to-blue-700 text-white flex flex-row md:flex-col items-center justify-between p-3 md:p-4">
            <div className="text-center">
              <img src='/logo.png' alt="Logo" className="h-12 md:h-16 w-auto" />
            </div>
            
            {/* Terms and Conditions */}
            <div className="text-center font-display text-xs tracking-widest uppercase opacity-70 whitespace-pre-line hidden md:block">
              {`Please carry cash for remaining payment.
Drinking is strictly prohibited.
Pickup and drop service not included.
Waterpark holds final decision.
Contact 1 day before check-in for refunds.`}
            </div>
            
            <Waves className="w-6 h-6 md:w-8 md:h-8 text-white opacity-40"/>
          </div>

          {/* Main Content */}
          <div className="relative w-full md:w-3/4 flex flex-col p-4 md:p-6 border-t-2 md:border-t-0 md:border-l-2 border-dashed border-blue-400/80">
            <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
              <div className="flex-1">
                <h2 className="font-display text-2xl md:text-4xl font-extrabold text-blue-900">{booking.waterparkName}</h2>
                <p className="font-sans text-sm mt-2 md:mt-3 text-blue-800">Present this ticket at the entrance.</p>
              </div>
              <div className="text-left md:text-right">
                <p className="font-sans text-xs font-bold text-blue-800 uppercase">Visit Date</p>
                <p className="font-display font-extrabold text-xl md:text-2xl text-cyan-700">{new Date(booking.date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 my-auto">
              <div className="flex items-center gap-3">
                <UserCircle className="w-5 h-5 md:w-6 md:h-6 text-cyan-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-blue-800 uppercase">Guest Name</p>
                  <p className="font-bold text-sm md:text-base text-blue-900">{booking.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-cyan-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-blue-800 uppercase">Guests</p>
                  <p className="font-bold text-sm md:text-base text-blue-900">{booking.adults} Adults, {booking.children} Children</p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-dashed border-blue-400/80 flex flex-col md:flex-row justify-between items-end gap-4">
              <div className="order-1">
                <p className="font-sans text-xs font-bold text-blue-800 uppercase">Booking ID</p>
                <p className="font-mono text-lg md:text-xl font-bold tracking-wider text-blue-900">{booking.customBookingId}</p>
              </div>
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
        </div>
      </div>
    </div>
  );
};

export default WaterparkTicket;