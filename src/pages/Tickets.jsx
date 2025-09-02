import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftIcon, TicketIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

// Import the modal component you created previously
import OrderDetailsModal from '../components/OrderDetailsModal/OrderDetailsModal'; // Make sure this path is correct

const Ticket = () => {
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State to manage the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalBookingId, setModalBookingId] = useState(null);

  // This function now verifies the ticket ID and opens the modal on success
  const handleFetchTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Use the final ID for the API call
    const finalTicketId = ticketId.startsWith("#") ? ticketId.slice(1) : ticketId;

    try {
      // We still fetch here to validate the ID before opening the modal
      const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/bookings/${finalTicketId}`);
      
      if (!res.ok) {
        throw new Error("Ticket not found or invalid ID.");
      }

      const data = await res.json();
      
      if (!data.success || !data.booking) {
        throw new Error("Ticket not found.");
      }
      
      // On success, set the ID for the modal and open it
      setModalBookingId(finalTicketId);
      setIsModalOpen(true);
      toast.success("Ticket verified!");

    } catch (err) {
      const errorMessage = err.message || "An error occurred. Please double-check your ID.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Handler to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalBookingId(null);
    setTicketId(""); // Clear the input field for the next search
  };

  return (
    <>
      <div className="min-h-screen w-full flex flex-col items-center justify-start py-10 px-4 font-sans relative  overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/4 right-0 w-80 h-80  rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* The main input form container */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative z-10"
        >
          <div className="w-full space-y-6">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold text-white drop-shadow-lg">Ticket Portal</h2>
              <p className="mt-2 text-cyan-200 text-lg">Your adventure awaits! Enter your Booking ID.</p>
            </div>
            
            {error && <p className="text-red-300 bg-red-900/50 p-3 rounded-lg text-sm text-center">{error}</p>}
            
            <form className="space-y-4" onSubmit={handleFetchTicket}>
              <div>
                <label htmlFor="ticketId" className="block text-sm font-medium text-white mb-1">Booking ID</label>
                <input
                  id="ticketId" type="text" required value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  className="block w-full px-4 py-3 border border-slate-700 rounded-xl bg-slate-800/60 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
                  placeholder="e.g., #Booking12345"
                />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-xl font-semibold text-white hover:scale-105 shadow-lg flex justify-center items-center space-x-2 transition-all duration-300 disabled:opacity-50 disabled:scale-100">
                {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <TicketIcon className="h-5 w-5" />}
                <span>Find My Ticket</span>
              </button>
            </form>
          </div>
        </motion.div>
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