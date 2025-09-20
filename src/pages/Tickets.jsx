import { useState } from "react";
import { motion } from "framer-motion";
import { TicketIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

// Import the modal component
import OrderDetailsModal from '../components/OrderDetailsModal/OrderDetailsModal'; // Make sure this path is correct
import AnimatedBubbles from '../components/AnimatedBubbles/AnimatedBubbles';

const Ticket = () => {
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalBookingId, setModalBookingId] = useState(null);

  const handleFetchTicket = async (e) => {
    e.preventDefault();
    if (!ticketId) {
        toast.error("Please enter a Booking ID.");
        return;
    }
    setLoading(true);
    setError("");

    const finalTicketId = ticketId.startsWith("#") ? ticketId.slice(1) : ticketId;
    


    try {
      const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/bookings/${finalTicketId.toLowerCase()}`);
      
      if (!res.ok) {
        throw new Error("Ticket not found or invalid ID.");
      }

      const data = await res.json();
      
      if (!data.success || !data.booking) {
        throw new Error("We couldn't find a ticket with that ID.");
      }
      
      setModalBookingId(finalTicketId);
      setIsModalOpen(true);
      toast.success("Ticket verified successfully!");

    } catch (err) {
      const errorMessage = err.message || "An error occurred. Please double-check your ID.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalBookingId(null);
    setTicketId("");
  };

  return (
    <>
      <div className="h-fit md:max-h-screen w-full flex flex-col items-center justify-start py-10 px-4 font-sans relative  overflow-hidden ">
        <AnimatedBubbles />
        
        {/* The main input form container */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="bg-white/40 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl shadow-cyan-500/20 p-6 sm:p-8 w-full max-w-md relative z-10"
        >
          <div className="w-full space-y-6">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900">Retrieve Your Ticket</h2>
              <p className="mt-2 text-blue-800/80">
                Enter your Booking ID to view and download your pass.
              </p>
            </div>
            
            <form className="space-y-4" onSubmit={handleFetchTicket}>
              <div>
                <label htmlFor="ticketId" className="block text-sm font-semibold text-blue-900/80 mb-2">Booking ID</label>
                <input
                  id="ticketId" type="text" required value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  className="block w-full px-4 py-3 border border-cyan-300 rounded-xl bg-white/50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 shadow-inner"
                  placeholder="e.g., waterparkchalo123"
                />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white hover:scale-105 shadow-lg hover:shadow-cyan-500/40 flex justify-center items-center space-x-2 transition-all duration-300 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed">
                {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <TicketIcon className="h-5 w-5" />}
                <span>Find My Ticket</span>
              </button>
            </form>
             {error && <p className="text-red-700 bg-red-100 border border-red-200 p-3 rounded-lg text-sm font-medium text-center">{error}</p>}
          </div>
        </motion.div>

        {/* --- NEW: SVG Wave Divider --- */}
        <div className="absolute bottom-0 left-0 w-full h-24 text-white -z-0">
        
        </div>
      </div>

      {/* Conditionally render the OrderDetailsModal */}
      {isModalOpen && modalBookingId && (
        <OrderDetailsModal 
          orderId={modalBookingId} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
};

export default Ticket;