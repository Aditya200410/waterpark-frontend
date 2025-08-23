import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PaperAirplaneIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";
import config from "../config/config";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(""); setMessage(""); setIsLoading(true);
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setMessage(data.message);
      toast.success("OTP sent to your email");
      setStep(2);
    } catch (err) {
      setError(err.message || "An error occurred");
      toast.error(err.message || "An error occurred");
    } finally { setIsLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(""); setMessage(""); setIsLoading(true);
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/auth/verify-forgot-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");
      setMessage(data.message);
      toast.success("Password reset successful!");
      setStep(3);
    } catch (err) {
      setError(err.message || "An error occurred");
      toast.error(err.message || "An error occurred");
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-fit flex flex-col lg:flex-row font-roboto  bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600 overflow-hidden">

      {/* Left Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-12 lg:py-0"
      >
        <div className="max-w-md w-full space-y-8 bg-white bg-opacity-80 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-blue-200">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-poppins text-blue-900 drop-shadow-lg">
              Reset Your <span className="italic text-cyan-600">Password</span>
            </h2>
            {step === 1 && (
              <p className="mt-2 text-sm md:text-base text-blue-800">
                Enter your email to receive an OTP.
              </p>
            )}
          </div>

          {/* Messages */}
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {/* Step 1 - Send OTP */}
          {step === 1 && (
            <form className="space-y-5" onSubmit={handleSendOtp}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-900">
                  Email
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-3 pr-3 py-3 border border-blue-300 rounded-xl shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-white"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-cyan-500 text-white rounded-xl shadow-lg hover:bg-cyan-600 disabled:opacity-50 flex justify-center items-center"
              >
                {isLoading ? "Sending..." : <><PaperAirplaneIcon className="h-5 w-5 mr-2" /> Send OTP</>}
              </button>
            </form>
          )}

          {/* Step 2 - Verify OTP */}
          {step === 2 && (
            <form className="space-y-5" onSubmit={handleVerifyOtp}>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-blue-900">
                  OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="block w-full pl-3 pr-3 py-3 border border-blue-300 rounded-xl shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-white"
                  placeholder="Enter OTP"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-blue-900">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full pl-3 pr-3 py-3 border border-blue-300 rounded-xl shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-white"
                  placeholder="Enter new password"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-cyan-500 text-white rounded-xl shadow-lg hover:bg-cyan-600 disabled:opacity-50 flex justify-center items-center"
              >
                {isLoading ? "Verifying..." : <><PaperAirplaneIcon className="h-5 w-5 mr-2" /> Set New Password</>}
              </button>
            </form>
          )}

          {/* Step 3 - Success */}
          {step === 3 && (
            <div className="text-center space-y-4">
              <p className="text-green-700 font-semibold">Password reset successful!</p>
              <Link to="/login" className="text-cyan-600 hover:text-cyan-500 flex items-center justify-center">
                <ArrowLeftIcon className="h-5 w-5 mr-1" /> Back to Sign In
              </Link>
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/login" className="text-cyan-600 hover:text-cyan-500 flex items-center justify-center">
              <ArrowLeftIcon className="h-5 w-5 mr-1" /> Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Water Theme with Logo */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-gradient-to-br from-cyan-300 via-blue-300 to-blue-500 overflow-hidden"
      >
     

        {/* Floating bubbles */}
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/40 animate-float"
            style={{
              width: `${Math.random() * 40 + 20}px`,
              height: `${Math.random() * 40 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}

        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-20px); }
            }
            .animate-float {
              animation: float 6s ease-in-out infinite;
            }
          `}
        </style>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
