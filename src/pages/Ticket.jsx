import React, { useState, useEffect } from "react" ;
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

  const remainingAmount = booking.totalAmount - booking.advanceAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Ticket Container */}
      <div
        id="ticket"
        className="max-w-xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform hover:scale-105 transition-transform duration-300 ease-in-out"
      >
        {/* Ticket Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-center text-white border-b-4 border-blue-700">
          <div className="absolute top-5 right-5">
            <img src="/logo.png" alt="Waterparkchalo Logo" className="h-14 w-auto drop-shadow-md" />
          </div>
          <h1 className="text-3xl font-extrabold font-serif tracking-wide">
            Your Waterpark Adventure Awaits!
          </h1>
          <p className="text-sm opacity-90 mt-2 italic">
            Entry Ticket - {booking.waterparkName}
          </p>
        </div>

        {/* Main Ticket Content */}
        <div className="p-6 sm:p-8 text-gray-800">
          <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
            <div>
              <p className="text-xl font-bold text-blue-700 font-serif">Booking ID:</p>
              <p className="text-sm text-gray-600 font-mono break-all">{booking._id}</p>
            </div>
            {/* Placeholder for QR Code */}
            <div className="bg-gray-100 p-2 rounded-lg shadow-inner">
              {/* You would replace this with an actual QR code component */}
              {/* <QRCode value={booking._id} size={80} level="H" /> */}
              
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Visit Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-base">
                <div>
                    <p className="text-sm font-medium text-gray-500">Waterpark</p>
                    <p className="font-semibold text-blue-800">{booking.waterparkName}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Visit Date</p>
                    <p className="font-bold text-green-600 text-lg">
                    {new Date(booking.date).toLocaleDateString("en-GB", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Booking Date</p>
                    <p className="font-medium text-gray-700">
                    {new Date(booking.bookingDate).toLocaleDateString("en-GB")}
                    </p>
                </div>
                 <div>
                    <p className="text-sm font-medium text-gray-500">Payment Status</p>
                    <p className="font-medium text-gray-700">{booking.paymentType} (Paid: ₹{booking.advanceAmount.toLocaleString("en-IN")})</p>
                </div>
            </div>
          </div>

          <div className="mb-6 border-t pt-4 border-gray-200">
             <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Guest Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-base">
                <div>
                    <p className="text-sm font-medium text-gray-500">Guest Name</p>
                    <p className="font-semibold text-gray-900">{booking.name}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Contact Number</p>
                    <p className="font-semibold text-gray-900">{booking.phone}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Adults
                    </p>
                    <p className="font-bold text-gray-900">{booking.adults}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Children
                    </p>
                    <p className="font-bold text-gray-900">{booking.children}</p>
                </div>
            </div>
          </div>
          
        
          {/* Payment Info Banner */}
          <div className="text-center font-serif font-extrabold text-xl p-5 rounded-xl bg-gradient-to-r from-green-100 to-lime-100 text-green-800 border-2 border-green-300 shadow-md transform hover:scale-101 transition-transform">
            Pay at Waterpark: ₹{remainingAmount.toLocaleString("en-IN")}/-
          </div>

          {/* Terms and Conditions */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h4 className="font-serif font-bold text-center mb-4 text-gray-700 text-lg">Important Information</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              <li>Please carry this ticket and a valid ID proof for entry.</li>
              <li>The remaining payment must be made in cash at the waterpark.</li>
              <li>Outside food and beverages, including alcohol, are strictly prohibited.</li>
              <li>Pickup and drop-off services are not included in this package.</li>
              <li>For cancellations or modifications, please contact customer support 24 hours prior to your visit date.</li>
              <li>Management reserves the right to refuse admission or alter timings.</li>
            </ul>
          </div>
        </div>
        {/* Footer */}
        <div className="bg-gradient-to-r from-blue-700 to-cyan-600 p-4 text-center text-white text-xs opacity-90">
            Thank you for booking with Waterparkchalo! Enjoy your splash!
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="mt-8 flex items-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-full border border-blue-300 shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300 font-serif font-bold text-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Ticket (PNG)
      </button>
    </div>
  );
};

export default WaterparkTicket;