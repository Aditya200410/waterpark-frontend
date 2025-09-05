import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import WhyUs from "../components/MissionVision/MissionVision";
import AnimatedBubbles from '../components/AnimatedBubbles/AnimatedBubbles';

const Login = () => {
    const navigate = useNavigate();
    const { login, error: contextError } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ identifier: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await login(formData);
            toast.success("Welcome back!");
            navigate("/", { replace: true });
        } catch (err) {
            const errorMessage = err.message || contextError || "Failed to login. Please check your credentials.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-hidden">
    <AnimatedBubbles />

    {/* Centered Form */}
    <div className="z-10 flex items-center justify-center p-4 sm:p-6 lg:p-8 w-full">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="bg-white/40 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl shadow-cyan-500/20 p-6 sm:p-8 w-full max-w-md"
      >
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center bg-white/50 rounded-full p-3 mb-4">
                            <LogIn className="h-8 w-8 text-cyan-600" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-blue-900">Welcome Back!</h2>
                        <p className="mt-2 text-blue-800/80">
                            Don't have an account?{" "}
                            <Link to="/signup" className="font-semibold text-cyan-700 hover:text-cyan-800 transition-colors">
                                Sign Up
                            </Link>
                        </p>
                    </div>

                    {error && (
                        <p className="text-red-700 bg-red-100 border border-red-200 p-3 rounded-lg text-sm font-medium text-center mb-4">
                            {error}
                        </p>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Email/Phone */}
                        <div className="relative">
                            <label htmlFor="identifier" className="sr-only">Email or Phone</label>
                            <Mail className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-cyan-500" />
                            <input
                                id="identifier" name="identifier" type="text"
                                autoComplete="username" required value={formData.identifier} onChange={handleChange}
                                className="block w-full pl-12 pr-4 py-3 border border-cyan-300 rounded-xl bg-white/50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 shadow-inner"
                                placeholder="Email or Phone Number"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <Lock className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-cyan-500" />
                            <input
                                id="password" name="password" type={showPassword ? "text" : "password"}
                                autoComplete="current-password" required value={formData.password} onChange={handleChange}
                                className="block w-full pl-12 pr-12 py-3 border border-cyan-300 rounded-xl bg-white/50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 shadow-inner"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-4 -translate-y-1/2 text-cyan-500 hover:text-cyan-700 focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 select-none">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                                />
                                <span className="text-blue-800/90 font-medium">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="font-semibold text-cyan-700 hover:text-cyan-800 transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit" disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-lg text-white hover:scale-105 shadow-lg hover:shadow-cyan-500/40 flex justify-center items-center space-x-2 transition-all duration-300 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
                        >
                            {isLoading 
                                ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                : <span>Sign In</span>
                            }
                        </button>
                    </form>
                </motion.div>
            </div>

        </div>
    );
};

export default Login;