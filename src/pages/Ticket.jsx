import React, { useState, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { Download, UserCircle, Users, Waves, FileText, ExternalLink, Phone, User } from "lucide-react";
import AnimatedBubbles from '../components/AnimatedBubbles/AnimatedBubbles';

const WaterparkTicket = () => {
  const location = useLocation();
  const params = useParams();
  const [booking, setBooking] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initialBooking = location.state?.booking || null;
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get("bookingId");
  const ticketId = params.ticketId; // From /booking/:ticketId route

  // This useEffect fetches the booking data and ticket
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let bookingData = initialBooking;
        let ticketData = null;
        
        // Priority 1: If we have ticketId from URL params (from /booking/:ticketId route)
        if (ticketId) {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_APP_API_BASE_URL}/api/bookings/ticket/${ticketId}`
            );
            bookingData = response.data.booking;
            ticketData = response.data.ticket;
          } catch (error) {
            console.error("Error fetching booking with ticket:", error);
            setError("Failed to load ticket information");
            return;
          }
        }
        // Priority 2: Fetch booking data if not provided and we have bookingId
        else if (!initialBooking && bookingId) {
          const bookingResponse = await axios.get(
            `${import.meta.env.VITE_APP_API_BASE_URL}/api/bookings/${bookingId}`
          );
          bookingData = bookingResponse.data.booking;
        }
        
        if (bookingData) {
          setBooking(bookingData);
          
          // If we don't already have ticket data, try to fetch it
          if (!ticketData) {
            try {
              const ticketResponse = await axios.get(
                `${import.meta.env.VITE_APP_API_BASE_URL}/api/tickets/${bookingData.customBookingId}`
              );
              ticketData = ticketResponse.data.ticket;
            } catch (ticketError) {
              console.warn("Ticket not found or not generated yet:", ticketError);
              // Don't set error for ticket, just show the visual ticket
            }
          }
          
          setTicket(ticketData);
        } else {
          setError("No booking information found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load booking information");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [bookingId, initialBooking, ticketId]);

  // Generate and download PDF ticket directly from booking data
  const handleDownloadPDF = useCallback(async () => {
    if (!booking) {
      console.error("No booking data available");
      return;
    }

    try {
      // Generate PDF from booking data using the same logic as backend
      const visitDate = new Date(booking.date).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const bookingDate = new Date(booking.bookingDate).toLocaleDateString('en-IN');
      
      // Create a simple PDF using jsPDF
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      
      // Set font
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(24);
      pdf.text(booking.waterparkName, 20, 30);
      
      pdf.setFontSize(16);
      pdf.text("Water Park Adventure Ticket", 20, 45);
      
      // Booking details
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      let yPos = 70;
      
      const details = [
        [`Booking ID: ${booking.customBookingId}`, ""],
        [`Customer Name: ${booking.name}`, ""],
        [`Email: ${booking.email}`, ""],
        [`Phone: ${booking.phone}`, ""],
        [`Water Number: ${booking.waternumber}`, ""],
        [`Adults: ${booking.adults}`, `Children: ${booking.children}`],
        [`Booking Date: ${bookingDate}`, ""],
        [`Visit Date: ${visitDate}`, ""],
        [`Advance Paid: ₹${booking.advanceAmount}`, `Total Amount: ₹${booking.totalAmount}`],
        [`Remaining Amount: ₹${booking.leftamount}`, ""]
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
      pdf.text("Thank you for choosing " + booking.waterparkName + "!", 20, yPos);
      pdf.text("Have a splashing good time!", 20, yPos + 8);
      pdf.text("Keep this ticket safe and show it at the entrance", 20, yPos + 16);
      
      // Save the PDF
      pdf.save(`waterpark-ticket-${booking.customBookingId}.pdf`);
    } catch (error) {
      console.error("PDF Generation Failed:", error);
    }
  }, [booking]);

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

  // This new useEffect triggers the visual ticket download automatically
  useEffect(() => {
    // Only run this effect if booking data has been loaded
    if (booking && !loading) {
      // A short timeout ensures the component has fully rendered with the data
      const timer = setTimeout(() => {
        // Generate and download visual ticket automatically
        handleDownloadVisual();
      }, 2000); // Increased delay to 2 seconds to ensure ticket element is fully rendered

      // Clean up the timeout if the component unmounts before it fires
      return () => clearTimeout(timer);
    }
  }, [booking, loading, handleDownloadVisual]); // It runs when booking or handleDownload changes

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
        <div className="text-center text-red-600 max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4">Ticket Not Found</h2>
          <p className="mb-4">{error || "No booking information available"}</p>
          <div className="space-y-2 text-sm text-gray-600">
            <p>If you just completed payment, please wait a moment and refresh the page.</p>
            <p>You can also access your ticket anytime using your Booking ID at:</p>
            <p className="font-mono bg-gray-100 p-2 rounded">{window.location.origin}/tickets</p>
          </div>
        </div>
      </div>
    );
  }

  const remainingAmount = booking ? booking.totalAmount - booking.advanceAmount : 0;

  return (
    <div className="flex flex-col items-center min-h-screen py-10 pb-24 relative">
      <AnimatedBubbles />
      
      {/* Success Message and Ticket URL */}
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8 max-w-2xl mx-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-2">🎉 Booking Confirmed!</h2>
          <p className="text-green-700 mb-4">Your water park ticket is ready. You can access it anytime using the link below:</p>
          <div className="bg-white border border-green-300 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600 mb-1">Persistent Ticket URL:</p>
            <p className="font-mono text-sm break-all text-green-800">
              {window.location.origin}/booking/{booking.customBookingId}
            </p>
          </div>
          <p className="text-sm text-gray-600">
            💡 <strong>Tip:</strong> Bookmark this page or save the URL above to access your ticket anytime, even if you close your browser!
          </p>
        </div>
      </div>

      {/* Status and Download buttons */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-4">
        
          <button
            onClick={handleDownloadVisual}
            className="group flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
          >
            <Download className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
            Download Ticket
          </button>
        </div>
      </div>

      {/* Ticket Design - Using OrderDetailsModal Style */}
      <div className="w-full max-w-4xl font-sans overflow-x-auto">
        <div 
          id="ticket" 
          className="relative flex aspect-[210/99] min-w-[280px] sm:min-w-[400px] md:min-w-[600px] w-full text-blue-900 shadow-2xl overflow-hidden rounded-xl"
          style={{ 
            backgroundImage: `url('/tback2.png')`,
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
            <div className="relative w-1/4 bg-gradient-to-b from-cyan-600 to-blue-700 text-white flex flex-col items-center justify-between p-1 sm:p-4">
              <div className="text-center">
                <img src='/logo.png' alt="Logo" className="w-12 h-12 sm:w-24 sm:h-24" />
              </div>

              {/* Terms & Conditions Box */}
              <div className="w-full flex-grow flex flex-col overflow-hidden my-1 sm:my-2">
                <h3 className="text-center font-bold text-[6px] sm:text-sm uppercase tracking-wider mb-0.5 md:mb-2 flex-shrink-0">
                  Terms & Conditions
                </h3>
                <div className="w-full h-full overflow-y-auto pr-1">
                  <ul className="space-y-1 text-left text-[6px] sm:text-xs list-disc list-outside pl-2 sm:pl-4 opacity-80">
                    {booking.terms ? booking.terms.split('\n').map((line, index) => (
                      line.trim() && <li key={index}>{line}</li>
                    )) : (
                      <>
                        <li>Please carry cash for remaining payment.</li>
                        <li>Drinking is strictly prohibited.</li>
                        <li>Pickup and drop service not included.</li>
                        <li>Waterpark holds final decision.</li>
                        <li>Contact 1 day before check-in for refunds.</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="relative w-3/4 flex flex-col p-2 sm:p-6 border-l-2 border-dashed border-blue-400/80">
              <div className="flex justify-between items-start mb-1 sm:mb-4">
                <div>
                  <h2 className="font-display text-sm sm:text-2xl md:text-4xl font-extrabold text-blue-900 leading-tight">{booking.waterparkName}</h2>
                  <p className="font-sans text-[10px] sm:text-sm mt-0.5 sm:mt-3 text-blue-800">Present this ticket at the entrance.</p>
                </div>
                <div className="text-right">
                  <p className="font-sans text-[8px] sm:text-xs font-bold text-blue-800 uppercase">Visit Date</p>
                  <p className="font-display font-extrabold text-xs sm:text-xl md:text-2xl text-cyan-700">{new Date(booking.date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-1 sm:gap-x-6 gap-y-1 sm:gap-y-4 my-auto">
                <div className="flex items-center gap-0.5 sm:gap-3">
                  <UserCircle className="w-3 h-3 sm:w-6 sm:h-6 text-cyan-600 flex-shrink-0" />
                  <div>
                    <p className="text-[8px] sm:text-xs font-bold text-blue-800 uppercase">Guest Name</p>
                    <p className="font-bold text-[10px] sm:text-base text-blue-900 leading-tight">{booking.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-3">
                  <Users className="w-3 h-3 sm:w-6 sm:h-6 text-cyan-600 flex-shrink-0" />
                  <div>
                    <p className="text-[8px] sm:text-xs font-bold text-blue-800 uppercase">Guests</p>
                    <p className="font-bold text-[10px] sm:text-base text-blue-900 leading-tight">{booking.adults} Adults, {booking.children} Children</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-0.5 sm:gap-3">
                        <Phone className="w-3 h-3 sm:w-6 sm:h-6 text-cyan-600 flex-shrink-0" />
                      <div>
                            <p className="text-[8px] sm:text-xs font-bold text-blue-800 uppercase">Phone Number</p>
                            <p className="font-bold text-[10px] sm:text-base text-blue-900 leading-tight">{booking.phone}</p>
                          </div>
                          </div>

              <div className="mt-auto pt-1 sm:pt-4 border-t border-dashed border-blue-400/80">
                <div className="flex flex-row justify-between items-center w-full">
                  <div>
                    <p className="font-sans text-[8px] sm:text-xs font-bold text-blue-800 uppercase">Booking ID</p>
                    <p className="font-mono text-[10px] sm:text-xl font-bold tracking-wider text-blue-900">{booking.customBookingId}</p>
                  </div>
                  <div className="flex flex-row gap-2 sm:gap-6">
                    <div className="text-right">
                      <p className="font-sans text-[8px] sm:text-xs font-bold text-blue-800 uppercase">Amount Paid</p>
                      <p className="font-display font-extrabold text-sm sm:text-2xl md:text-3xl text-blue-900">₹{booking.advanceAmount.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-sans text-[8px] sm:text-xs font-bold text-red-600 uppercase">Amount To Pay</p>
                      <p className="font-display font-extrabold text-sm sm:text-2xl md:text-3xl text-red-600">₹{remainingAmount.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact information */}
              <div className="mt-auto pt-1 sm:pt-4 border-t border-dashed border-blue-400/80">
                <div className="flex flex-row justify-between items-center w-full">
                  <div>
                    <p className="font-sans text-[8px] sm:text-xs font-bold text-blue-800 whitespace-nowrap">
                      www.waterparkchalo.com
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-2 sm:gap-4">
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
  );
};

export default WaterparkTicket;