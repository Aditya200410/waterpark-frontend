import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import WhyUs from "../components/MissionVision/MissionVision";
import AnimatedBubbles from '../components/AnimatedBubbles/AnimatedBubbles';

const Signup = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            setError('Passwords do not match');
            return;
        }
        if (!phone.match(/^\d{10}$/)) {
            toast.error('Please enter a valid 10-digit phone number');
            setError('Please enter a valid 10-digit phone number');
            return;
        }
        
        setIsLoading(true);
        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: phone,
            });
            toast.success('Account created successfully! Welcome!');
            navigate('/');
        } catch (err) {
            const errorMessage = err.message || 'Failed to create account.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
       <div className="relative min-h-screen w-full flex items-center justify-s font-sans overflow-hidden">
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
                            <UserPlus className="h-8 w-8 text-cyan-600" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-blue-900">Create Your Account</h2>
                        <p className="mt-2 text-blue-800/80">
                            Already have an account?{" "}
                            <Link to="/login" className="font-semibold text-cyan-700 hover:text-cyan-800 transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>

                    {error && (
                        <p className="text-red-700 bg-red-100 border border-red-200 p-3 rounded-lg text-sm font-medium text-center mb-4">
                            {error}
                        </p>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="relative">
                            <User className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-cyan-500" />
                            <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange}
                                className="block w-full pl-12 pr-4 py-3 border border-cyan-300 rounded-xl bg-white/50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 shadow-inner"
                                placeholder="Full Name" />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <Mail className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-cyan-500" />
                            <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange}
                                className="block w-full pl-12 pr-4 py-3 border border-cyan-300 rounded-xl bg-white/50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 shadow-inner"
                                placeholder="Email Address" />
                        </div>

                        {/* Phone */}
                        <div className="relative flex">
                            <Phone className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-cyan-500 z-10" />
                            <span className="inline-flex items-center pl-12 pr-3 rounded-l-xl border border-r-0 border-cyan-300 bg-sky-100/70 text-blue-800 text-sm select-none font-semibold">+91</span>
                            <input type="tel" required maxLength={10} placeholder="10-Digit Phone Number" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                                className="block w-full pl-3 pr-4 py-3 border border-cyan-300 rounded-r-xl bg-white/50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:z-10 transition-all duration-300 shadow-inner" />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-cyan-500" />
                            <input id="password" name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange}
                                className="block w-full pl-12 pr-12 py-3 border border-cyan-300 rounded-xl bg-white/50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 shadow-inner"
                                placeholder="Password" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-4 -translate-y-1/2 text-cyan-500 hover:text-cyan-700 focus:outline-none">
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        
                        {/* Confirm Password */}
                        <div className="relative">
                            <Lock className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-cyan-500" />
                            <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required value={formData.confirmPassword} onChange={handleChange}
                                className="block w-full pl-12 pr-12 py-3 border border-cyan-300 rounded-xl bg-white/50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 shadow-inner"
                                placeholder="Confirm Password" />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute top-1/2 right-4 -translate-y-1/2 text-cyan-500 hover:text-cyan-700 focus:outline-none">
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        <button type="submit" disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-lg text-white hover:scale-105 shadow-lg hover:shadow-cyan-500/40 flex justify-center items-center space-x-2 transition-all duration-300 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed">
                            {isLoading
                                ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                : <span>Create Account</span>
                            }
                        </button>
                    </form>
                </motion.div>
            </div>

          
        </div>
    );
};

export default Signup;