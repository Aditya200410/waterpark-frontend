import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeftIcon, TicketIcon, ArrowDownTrayIcon, SunIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";

// The decorative wave background component
const SubtleWaveBackground = () => (
  // We add a specific class 'hide-on-download' to target and hide this element during capture
  <div className="absolute top-0 left-0 w-full h-full opacity-10 z-0 overflow-hidden hide-on-download">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path fill="#06b6d4" fillOpacity="0.2" d="M0,160L60,176C120,192,240,224,360,213.3C480,203,600,149,720,133.3C840,117,960,139,1080,160C1200,181,1320,203,1380,213.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
    </svg>
  </div>
);

const Ticket = () => {
  const ticketRef = useRef(null);
  const [ticketId, setTicketId] = useState("");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTicket(null);

    const finalTicketId = ticketId.startsWith("#") ? ticketId.slice(1) : ticketId;

    try {
      // RESTORED: Live API fetch logic is now active
      const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/bookings/${finalTicketId}`);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "An unknown error occurred" }));
        throw new Error(errorData.message || "Ticket not found");
      }

      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || "Ticket not found");
      }
      
      setTicket(data.booking);
      toast.success("Ticket verified! Get ready for the waves!");

    } catch (err) {
      const errorMessage = err.message || "Ticket not found or an error occurred. Please double-check your ID.";
      setError(errorMessage);
      toast.error(errorMessage);
      setTicket(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = () => {
    const ticketElement = ticketRef.current;
    if (!ticketElement) return;

    // Find the decorative background element using its class
    const waveBg = ticketElement.querySelector('.hide-on-download');

    toast.loading("Crafting your premium ticket...", { duration: 1000 });

    // Temporarily hide the background before capturing
    if (waveBg) waveBg.style.display = 'none';

    html2canvas(ticketElement, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff', // Ensures a solid white background for the PNG
      logging: false,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `azure-waterpark-ticket-${ticket?.customBookingId || "details"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Ticket downloaded successfully!");
    }).finally(() => {
      // IMPORTANT: Restore the background's visibility after capture is complete
      if (waveBg) waveBg.style.display = 'block';
    });
  };


  const remainingAmount = ticket ? ticket.totalAmount - ticket.advanceAmount : 0;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-10 px-4 font-sans relative  overflow-hidden">
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-blue-500 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-cyan-500 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative z-10"
      >
        {!ticket && (
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
                  placeholder="e.g., waterPark67890"
                />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-xl font-semibold text-white hover:scale-105 shadow-lg flex justify-center items-center space-x-2 transition-all duration-300 disabled:opacity-50 disabled:scale-100">
                {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <TicketIcon className="h-5 w-5" />}
                <span>Find My Ticket</span>
              </button>
            </form>
          </div>
        )}

        {ticket && (
          <motion.div
            ref={ticketRef}
            id="ticket-to-download"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-2xl flex flex-col sm:flex-row relative overflow-hidden text-gray-800"
          >
            <SubtleWaveBackground />

            <div className="p-6 sm:p-8 flex-grow z-10">
              <div className="flex justify-between items-start border-b-2 border-dashed border-gray-200 pb-5">
                <div>
<h2>                    {ticket.waterparkName}
                  </h2>
                  <p className="text-sm font-mono text-gray-500 tracking-wide mt-1">BOOKING ID: <span className="font-bold text-gray-700">{ticket.customBookingId}</span></p>
                </div>
                <SunIcon className="h-10 w-10 text-yellow-400" />
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-base">
                <div><p className="font-medium text-gray-500">Guest Name:</p><p className="font-semibold text-gray-900">{ticket.name}</p></div>
                <div><p className="font-medium text-gray-500">Contact No.:</p><p className="font-semibold text-gray-900">{ticket.phone}</p></div>
                <div><p className="font-medium text-gray-500">Adult Count:</p><p className="font-semibold text-gray-900">{ticket.adults}</p></div>
                <div><p className="font-medium text-gray-500">Child Count:</p><p className="font-semibold text-gray-900">{ticket.children}</p></div>
                <div className="col-span-full"><p className="font-medium text-gray-500">Booking Date:</p><p className="font-semibold text-gray-900">{new Date(ticket.bookingDate).toLocaleDateString("en-GB")}</p></div>
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-5">
                 <div className="text-center py-3 bg-cyan-500/15 rounded-xl">
                   <p className="text-sm font-semibold text-cyan-800 flex items-center justify-center gap-2 mb-1">
                     <CheckCircleIcon className="h-5 w-5 text-cyan-700" /> PACKAGE INCLUDES
                   </p>
                   <p className="text-lg font-extrabold text-cyan-900">BREAKFAST + LUNCH + EVENING TEA</p>
                 </div>
              </div>

              <div className="mt-6 text-center font-sans font-bold text-xl p-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl shadow-lg">
                <span className="text-base font-semibold opacity-90 block mb-1">BALANCE AMOUNT TO PAY</span>
                ₹{remainingAmount.toLocaleString("en-IN")}/-
              </div>

              <div className="mt-6 bg-gray-50 border border-gray-100 rounded-xl p-4 text-gray-700 text-xs">
                <h4 className="font-bold text-center mb-3 text-gray-800 text-sm">IMPORTANT INFORMATION</h4>
                <ul className="list-disc list-inside space-y-1.5 sm:grid sm:grid-cols-2 sm:gap-x-6">
                   {ticket.terms}
                </ul>
              </div>

            </div>

            <div className="relative bg-slate-50 w-full sm:w-40 flex-shrink-0 
                           border-t-2 sm:border-t-0 sm:border-l-2 border-dashed border-gray-300 
                           z-10 flex flex-row items-center justify-around sm:flex-col sm:justify-between py-4 px-4 sm:py-6 sm:px-4"
            >
              <div className="absolute -top-[11px] left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white sm:hidden"></div>
              <div className="absolute -left-[11px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white hidden sm:block"></div>
              
              <div className="text-center">
                <p className="text-sm font-bold text-gray-500">VISIT ON</p>
                <p className="text-2xl font-extrabold text-green-600 leading-tight">{new Date(ticket.date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short' })}</p>
                <p className="text-sm font-bold text-gray-500">{new Date(ticket.date).getFullYear()}</p>
              </div>

              <div className="text-center">
                <p className="text-sm font-bold text-gray-500">GUESTS</p>
                <p className="font-bold text-gray-800 text-base">Adult: <span className="font-extrabold text-xl">{ticket.adults}</span></p>
                <p className="font-bold text-gray-800 text-base">Child: <span className="font-extrabold text-xl">{ticket.children}</span></p>
              </div>
              
              <TicketIcon className="h-8 w-8 text-blue-400 opacity-60 hidden sm:block" />
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {ticket && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center space-x-4 mt-8 z-10">
          <button onClick={() => window.location.reload()} className="text-sm text-white hover:text-white flex items-center transition-colors">
            <ArrowLeftIcon className="h-4 w-4 mr-1.5" /> Start New Search
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-2.5 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all font-semibold text-sm"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            Download Ticket
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Ticket;