import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftIcon, TicketIcon, QrCodeIcon, UserIcon, MapPinIcon } from "@heroicons/react/24/solid";
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

    // --- Mock Data for easy testing ---
    // Uncomment this block to test the UI without a backend.
    // if (ticketId) {
    //   setTimeout(() => {
    //     setTicket({
    //       _id: ticketId,
    //       name: "John Doe",
    //       waterparkName: "Aqua Paradise Park",
    //       paymentStatus: "Paid",
    //       email: "john.doe@example.com",
    //       phone: "123-456-7890",
    //       adults: 2,
    //       children: 1,
    //     });
    //     setLoading(false);
    //     toast.success("Ticket fetched successfully!");
    //   }, 1000);
    //   return;
    // }
    // --- End of Mock Data ---


    try {
      const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/bookings/${ticketId}`);
      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.message || "Ticket not found");

      setTicket(data.booking);
      toast.success("Ticket fetched successfully!");
    } catch (err) {
      setError(err.message || "Failed to fetch ticket");
      toast.error(err.message || "Failed to fetch ticket");
      setTicket(null); // Clear previous ticket on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans b overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-black/20 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10"
      >
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
             <h2 className="text-4xl font-bold text-white drop-shadow-lg">
              Ticket Verification
            </h2>
            <p className="mt-2 text-slate-300">
              Enter your Ticket ID to view your booking details.
            </p>
          </div>

          {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-sm text-center -mb-4">{error}</p>}

          {/* Ticket Form */}
          <form className="space-y-4" onSubmit={handleFetchTicket}>
            <div>
              <label htmlFor="ticketId" className="block text-sm font-medium text-slate-300 mb-1">
                Ticket ID
              </label>
              <input
                id="ticketId"
                type="text"
                required
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                className="block w-full px-4 py-3 border border-slate-700 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                placeholder="Enter your ticket ID"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold text-white hover:from-cyan-600 hover:to-purple-700 shadow-lg flex justify-center items-center space-x-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <TicketIcon className="h-5 w-5" />}
              <span>Check Ticket</span>
            </button>
          </form>

          {/* Premium Ticket Info */}
          {ticket && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-8"
            >
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-1 relative filter drop-shadow-lg">
                {/* Cutouts */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-8 h-8 rounded-full bg-slate-900"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-8 h-8 rounded-full bg-slate-900"></div>
                
                <div className="flex flex-col sm:flex-row bg-slate-900 rounded-xl overflow-hidden">
                  {/* Main Ticket Info */}
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Water Park Ticket</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{ticket.waterparkName}</h3>
                      </div>
                      <div
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          ticket.paymentStatus === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {ticket.paymentStatus}
                      </div>
                    </div>
                    <div className="border-b border-dashed border-slate-700 my-4"></div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <p className="text-slate-400">Name</p>
                        <p className="font-semibold text-white">{ticket.name}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Phone</p>
                        <p className="font-semibold text-white">{ticket.phone}</p>
                      </div>
                       <div>
                        <p className="text-slate-400">Adults</p>
                        <p className="font-semibold text-white">{ticket.adults}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Children</p>
                        <p className="font-semibold text-white">{ticket.children}</p>
                      </div>
                    </div>
                  </div>

               
                </div>
              </div>
            </motion.div>
          )}

          <div className="text-center mt-4">
            <a href="/" className="text-white hover:text-cyan-400 flex items-center justify-center transition-colors">
              <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Home
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Ticket;