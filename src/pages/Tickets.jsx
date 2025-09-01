import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftIcon, TicketIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";

const Ticket = () => {
  const [ticketId, setTicketId] = useState("");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTicket(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/bookings/${ticketId}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "An unknown error occurred" }));
        throw new Error(errorData.message || "Ticket not found");
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Ticket not found");
      }
      setTicket(data.booking);
      toast.success("Ticket fetched successfully!");
    } catch (err) {
      setError(err.message || "Failed to fetch ticket");
      toast.error(err.message || "Failed to fetch ticket");
      setTicket(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const ticketElement = document.getElementById("ticket-to-download");
    if (ticketElement) {
      toast.loading("Preparing download...", { duration: 1000 });
      html2canvas(ticketElement, {
        scale: 2.5, // Higher resolution for clarity
        useCORS: true, // Needed for external images
        backgroundColor: '#ffffff', // Ensures the background is not transparent
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `resort-ticket-${ticket?._id || "details"}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  const remainingAmount = ticket ? ticket.totalAmount - ticket.advanceAmount : 0;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 font-sans overflow-hidden relative">
      {/* Animated bubbles for water theme */}
  {[...Array(10)].map((_, i) => (
    <motion.div
      key={i}
      animate={{ y: [0, -500, 0], x: [0, 50, -50, 0] }}
      transition={{ repeat: Infinity, duration: 6 + i, ease: "easeInOut" }}
      className="absolute w-6 h-6 rounded-full bg-blue-300 z-[-1] "
      style={{ left: `${10 + i * 10}%`, bottom: `${-50 - i * 20}px` }}
    />
  ))}
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-black/20 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative z-10"
      >
        {/* Verification Form View */}
        {!ticket && (
          <div className="w-full space-y-6">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white drop-shadow-lg">Ticket Verification</h2>
              <p className="mt-2 text-slate-300">Enter your Ticket ID to view details.</p>
            </div>
            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-sm text-center">{error}</p>}
            <form className="space-y-4" onSubmit={handleFetchTicket}>
              <div>
                <label htmlFor="ticketId" className="block text-sm font-medium text-slate-300 mb-1">Ticket ID</label>
                <input
                  id="ticketId" type="text" required value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  className="block w-full px-4 py-3 border border-slate-700 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="Enter your ticket ID"
                />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-cyan-500  rounded-xl font-semibold text-white hover:from-cyan-600 hover:to-purple-700 shadow-lg flex justify-center items-center space-x-2 transition-all disabled:opacity-50">
                {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <TicketIcon className="h-5 w-5" />}
                <span>Check Ticket</span>
              </button>
            </form>
          </div>
        )}

        {/* Render the compact ticket design */}
        {ticket && (
          <motion.div
            id="ticket-to-download"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-2xl overflow-hidden"
          >
          
            <div className="text-center py-3 bg-gray-50 border-b">
              <h2 className="text-2xl font-extrabold text-gray-800 font-serif">{ticket.waterparkName}</h2>
              <p className="text-xs text-gray-500 mt-1">(BOOKING ID: {ticket._id})</p>
            </div>
            <div className="p-4 sm:p-5 text-gray-800 grid grid-cols-2 gap-y-3 gap-x-4">
              <div><p className="text-xs font-medium text-gray-500">NAME:-</p><p className="font-semibold text-sm text-gray-900">{ticket.name}</p></div>
              <div><p className="text-xs font-medium text-gray-500">ADULT COUNT:-</p><p className="font-semibold text-sm text-gray-900">{ticket.adults}</p></div>
              <div><p className="text-xs font-medium text-gray-500">CONTACT:-</p><p className="font-semibold text-sm text-gray-900">{ticket.phone}</p></div>
              <div><p className="text-xs font-medium text-gray-500">CHILD COUNT:-</p><p className="font-semibold text-sm text-gray-900">{ticket.children}</p></div>
              <div><p className="text-xs font-medium text-gray-500">BOOKING DATE:-</p><p className="font-semibold text-sm text-gray-900">{new Date(ticket.bookingDate).toLocaleDateString("en-GB")}</p></div>
              <div><p className="text-xs font-medium text-gray-500">VISIT DATE:-</p><p className="font-semibold text-sm text-green-600">{new Date(ticket.date).toLocaleDateString("en-GB")}</p></div>
            </div>
            <div className="text-center py-3 bg-gray-50 border-y">
              <p className="text-xs font-medium text-gray-600">PACKAGE INCLUSION</p>
              <p className="text-sm font-bold text-gray-800">BREAKFAST + LUNCH + TEA</p>
            </div>
            <div className="text-center font-serif font-bold text-lg p-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
              AMOUNT TO PAY: ₹{remainingAmount.toLocaleString("en-IN")}/-
            </div>
            <div className="p-4 sm:p-5">
              <h4 className="font-serif font-bold text-center mb-2 text-gray-700 text-sm">TERMS & CONDITIONS</h4>
              <ul className="list-disc list-inside text-xs text-gray-600 space-y-1.5 sm:grid sm:grid-cols-2 sm:gap-x-4">
                <li>Show coupon at counter & pay remaining amount.</li>
                <li>Remaining payment must be in cash.</li>
                <li>Reach the Waterpark early for a better experience.</li>
                <li>Alcohol is strictly prohibited.</li>
                <li>Contact us 24hrs prior for cancellation/refund.</li>
                <li>Management holds the final decision in any dispute.</li>
              </ul>
            </div>
            <div className="p-4 text-gray-800 grid grid-cols-2 gap-y-2 gap-x-4 border-t bg-gray-50 text-xs">
              <div><p className="font-medium text-gray-500">ADULT:</p><p className="font-semibold">{ticket.adults} x 550 = ₹{(ticket.adults * 550).toLocaleString("en-IN")}</p></div>
              <div className="text-right"><p className="font-medium text-gray-500">TOTAL:</p><p className="font-semibold">₹{ticket.totalAmount.toLocaleString("en-IN")}</p></div>
              <div><p className="font-medium text-gray-500">CHILD:</p><p className="font-semibold">{ticket.children} x 400 = ₹{(ticket.children * 400).toLocaleString("en-IN")}</p></div>
              <div className="text-right"><p className="font-medium text-gray-500">PAID:</p><p className="font-semibold">₹{ticket.advanceAmount.toLocaleString("en-IN")}</p></div>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Action buttons appear after ticket is fetched */}
      {ticket && (
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center space-x-4 mt-6">
            <a href="/" className="text-sm text-slate-300 hover:text-white flex items-center transition-colors">
              <ArrowLeftIcon className="h-4 w-4 mr-1.5" /> Back to Search
            </a>
            <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-cyan-500 text-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-cyan-500/50 hover:scale-105 transition-all font-semibold text-sm"
            >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Download
            </button>
         </motion.div>
      )}
    </div>
  );
};

export default Ticket;