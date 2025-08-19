import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftIcon, TicketIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

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
    const res = await fetch(`http://localhost:5175/api/bookings/${ticketId}`);
    const data = await res.json();

    if (!res.ok || !data.success) throw new Error(data.message || "Ticket not found");

    setTicket(data.booking); // <-- use `data.booking` here
    toast.success("Ticket fetched successfully!");
  } catch (err) {
    setError(err.message || "Failed to fetch ticket");
    toast.error(err.message || "Failed to fetch ticket");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex  justify-center relative font-sans bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600 overflow-hidden">
      {/* Animated bubbles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -500, 0], x: [0, 50, -50, 0] }}
          transition={{ repeat: Infinity, duration: 6 + i, ease: "easeInOut" }}
          className="absolute w-6 h-6 rounded-full bg-blue-300 opacity-70"
          style={{ left: `${10 + i * 10}%`, bottom: `${-50 - i * 20}px` }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-lg p-10 w-full max-w-md relative z-10 mt-14"
      >
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-poppins text-blue-900 drop-shadow-lg">
              Check Your <span className="italic text-cyan-600">Ticket</span>
            </h2>
            <p className="mt-2 text-sm md:text-base text-blue-800">
              Enter your Ticket ID to view booking details.
            </p>
          </div>

          {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

          {/* Ticket Form */}
          <form className="space-y-4" onSubmit={handleFetchTicket}>
            <div>
              <label htmlFor="ticketId" className="block text-sm font-medium text-blue-50">
                Ticket ID
              </label>
              <input
                id="ticketId"
                type="text"
                required
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                className="block w-full pl-3 pr-3 py-3 border border-blue-300 rounded-xl bg-blue-50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200"
                placeholder="Enter your ticket ID"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl font-semibold text-white hover:from-blue-500 hover:to-blue-700 shadow-lg flex justify-center items-center space-x-2 transition-all duration-300"
            >
              {loading && <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />}
              <TicketIcon className="h-5 w-5 mr-2" /> Check Ticket
            </button>
          </form>

          {/* Ticket Info */}
          {ticket && (
            <div className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-xl shadow-inner">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Ticket Details</h3>
              <p><span className="font-medium">Name:</span> {ticket.name}</p>
              <p><span className="font-medium">Waterpark:</span> {ticket.waterparkName}</p>
              <p><span className="font-medium">Payment Status:</span> {ticket.paymentStatus}</p>
                <p><span className="font-medium">Ticket ID:</span> {ticket._id}</p>
                <p><span className="font-medium">Email:</span> {ticket.email}</p>
                <p><span className="font-medium">Phone:</span> {ticket.phone}</p>
                <p><span className="font-medium">no.of adult</span> {ticket.adults}</p>
                <p><span className="font-medium">no.of child</span> {ticket.children}</p>
             
            </div>
          )}

          <div className="text-center mt-4">
            <a href="/" className="text-cyan-600 hover:text-cyan-500 flex items-center justify-center">
              <ArrowLeftIcon className="h-5 w-5 mr-1" /> Back to Home
            </a>
          </div>
        </div>

        {/* Decorative wave */}
        <svg className="absolute -bottom-6 left-0 w-full h-12" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgba(255,255,255,0.2)" d="M0,64L48,90.7C96,117,192,171,288,197.3C384,224,480,224,576,197.3C672,171,768,117,864,101.3C960,85,1056,107,1152,122.7C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </motion.div>
    </div>
  );
};

export default Ticket;
