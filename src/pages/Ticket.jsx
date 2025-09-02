import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { useLocation } from "react-router-dom";
import axios from "axios";

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
        });
    } else if (initialBooking) {
      setBooking(initialBooking);
    }
  }, [bookingId, initialBooking]);

  if (!booking) {
    return <div className="text-center text-gray-600 mt">Loading or no booking information available...</div>;
  }

  const handleDownload = () => {
    const ticketElement = document.getElementById("ticket");
    html2canvas(ticketElement, {
      scale: 2,
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "waterpark-ticket.png";
      link.click();
    });
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 py-10 pb-24">
      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900 mt-24 px-5 py-2 rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 font-serif"
      >
        ⬇ Download Ticket
      </button>

      {/* Ticket */}
      <div
        id="ticket"
        className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 mt-6"
      >
        {/* Ticket Header */}
        <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 py-6 px-4 text-center border-b border-gray-200">
          <h1 className="text-xl font-serif text-blue-800 tracking-wide">Waterpark Ticket</h1>
          <h2 className="text-base font-semibold font-serif text-gray-800">Creating Memories</h2>
          <p className="text-sm italic text-gray-600">One Adventure at a Time with Waterparkchalo</p>
          <div className="absolute top-3 right-3">
            <img src="/logo.png" alt="Logo" className="h-12" />
          </div>
        </div>

        {/* Main Ticket Content */}
        <div className="p-6 text-gray-800 font-sans">
          <h2 className="text-center text-xl font-serif font-bold text-blue-800 mb-4">
            {booking.waterparkName}
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <p>
              <span className="font-semibold">Booking Id:</span>
              <span className="block break-words">{booking._id}</span>
            </p>
            <p>
              <span className="font-semibold">Payment Id:</span>{" "}
              {booking.paymentType === "Razorpay"
                ? booking.paymentId || "Razorpay Payment"
                : booking.paymentType === "PhonePe"
                ? "pay_P5cD6ESfdBTZ0B"
                : "COD"}
            </p>
            <p>
              <span className="font-semibold">Booking Date:</span>{" "}
              {new Date(booking.bookingDate).toLocaleDateString("en-GB")}
            </p>
            <p>
              <span className="font-semibold">Visit Date:</span>{" "}
              {new Date(booking.date).toLocaleDateString("en-GB")}
            </p>
            <p>
              <span className="font-semibold">Name:</span> {booking.name}
            </p>
            <p>
              <span className="font-semibold">Adult:</span> {booking.adults}
            </p>
            <p>
              <span className="font-semibold">Contact:</span> {booking.phone}
            </p>
            <p>
              <span className="font-semibold">Children:</span> {booking.children}
            </p>
          </div>

          <div className="text-center mb-6">
            <h3 className="font-serif font-bold text-gray-800 mb-1">Package Inclusion</h3>
            <p className="text-sm text-gray-600">Breakfast + Lunch + Tea</p>
          </div>

          {/* Payment Info */}
          <h3
            className="font-serif font-bold text-center border border-blue-900 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm"
            style={{
              padding: "12px",
              lineHeight: "1.2",
              height: "52px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Pay on Waterpark ₹
            {booking.totalAmount && booking.advanceAmount
              ? booking.totalAmount - booking.advanceAmount
              : "N/A"}
            /-
          </h3>

          {/* Terms and Conditions */}
          <div className="mt-6">
            <h4 className="font-serif font-bold text-center mb-3 text-gray-800">Terms and Conditions</h4>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>Please carry cash for remaining payment.</li>
              <li>Drinking is strictly prohibited in the waterpark.</li>
              <li>Pickup and drop service is not included in this package.</li>
              <li>In case of any dispute or misunderstanding, the waterpark holds the final decision.</li>
              <li>For refund and cancellation, contact us 1 day before your check-in date.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterparkTicket;