import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion,AnimatePresence } from "framer-motion";
import { Send, KeyRound, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react"; // Using Lucide for consistency
import { toast } from "react-hot-toast";
import config from "../config/config";
import AnimatedBubbles from '../components/AnimatedBubbles/AnimatedBubbles';


const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError(""); setIsLoading(true);
        try {
            const res = await fetch(`${config.API_BASE_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to send OTP");
            toast.success("OTP sent to your email");
            setStep(2);
        } catch (err) {
            const errorMessage = err.message || "An error occurred";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally { setIsLoading(false); }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError(""); setIsLoading(true);
        try {
            const res = await fetch(`${config.API_BASE_URL}/api/auth/verify-forgot-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to reset password");
            toast.success("Password reset successful!");
            setStep(3);
        } catch (err) {
            const errorMessage = err.message || "An error occurred";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally { setIsLoading(false); }
    };

    const renderStepContent = () => {
        if (step === 3) {
            return (
                <div className="text-center space-y-6">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-blue-900">Password Reset Successful!</h3>
                    <p className="text-blue-800/80">You can now sign in with your new password.</p>
                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white hover:scale-105 shadow-lg hover:shadow-cyan-500/40 transition-all duration-300"
                    >
                         <ArrowLeft className="h-5 w-5 mr-2" /> Back to Sign In
                    </Link>
                </div>
            );
        }

        if (step === 2) {
            return (
                <motion.form
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                    onSubmit={handleVerifyOtp}
                >
                    <div>
                        <label htmlFor="otp" className="block text-sm font-semibold text-blue-900/80 mb-2">Verification Code (OTP)</label>
                        <input id="otp" type="text" required value={otp} onChange={(e) => setOtp(e.target.value)}
                            className="block w-full px-4 py-3 border border-cyan-300 rounded-xl bg-white/50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 shadow-inner"
                            placeholder="Enter the code from your email" />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-semibold text-blue-900/80 mb-2">New Password</label>
                        <input id="newPassword" type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                            className="block w-full px-4 py-3 border border-cyan-300 rounded-xl bg-white/50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 shadow-inner"
                            placeholder="Enter your new password" />
                    </div>
                    <button type="submit" disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white hover:scale-105 shadow-lg hover:shadow-cyan-500/40 flex justify-center items-center space-x-2 transition-all duration-300 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed">
                        {isLoading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <ShieldCheck className="h-5 w-5" />}
                        <span>Reset Password</span>
                    </button>
                </motion.form>
            );
        }

        return (
             <motion.form
                key="step1"
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
                onSubmit={handleSendOtp}
            >
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-blue-900/80 mb-2">Email Address</label>
                    <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="block w-full px-4 py-3 border border-cyan-300 rounded-xl bg-white/50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 shadow-inner"
                        placeholder="e.g., your.email@example.com" />
                </div>
                <button type="submit" disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white hover:scale-105 shadow-lg hover:shadow-cyan-500/40 flex justify-center items-center space-x-2 transition-all duration-300 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed">
                    {isLoading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <Send className="h-5 w-5" />}
                    <span>Send Verification Code</span>
                </button>
            </motion.form>
        );
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
            <AnimatedBubbles />
            <motion.div
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, type: 'spring' }}
                className="bg-white/40 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl shadow-cyan-500/20 p-6 sm:p-8 w-full max-w-md relative z-10"
            >
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center bg-white/50 rounded-full p-3 mb-4">
                        <KeyRound className="h-8 w-8 text-cyan-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-blue-900">Forgot Password?</h2>
                    <p className="mt-2 text-blue-800/80">
                        {step === 1 ? "No worries! Enter your email and we'll send you a reset code." : "Check your email for the verification code."}
                    </p>
                </div>
                
                {error && <p className="text-red-700 bg-red-100 border border-red-200 p-3 rounded-lg text-sm font-medium text-center mb-4">{error}</p>}

                <AnimatePresence mode="wait">
                    {renderStepContent()}
                </AnimatePresence>

                {step !== 3 && (
                    <div className="text-center mt-6">
                        <Link to="/login" className="text-sm font-medium text-cyan-700 hover:text-cyan-800 inline-flex items-center gap-1 transition-colors">
                            <ArrowLeft className="h-4 w-4" /> Back to Sign In
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPassword;