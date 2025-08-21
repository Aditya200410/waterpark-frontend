import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import WhyUs from "../components/MissionVision/MissionVision"; // 👈 Import the new component

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

    let identifier = formData.identifier.trim();
    if (/^\d{10}$/.test(identifier)) identifier;

    try {
      await login({ ...formData, identifier });
      toast.success("Welcome back!");
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || contextError || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-roboto bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600 overflow-hidden">
      
    
      {/* Left Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex  items-start lg:items-center justify-center px-3 sm:px-10 lg:px-1 py-12 lg:py-0"
      >
           <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="  bg-white/20  backdrop-blur-lg rounded-3xl shadow-lg p-6 w-full max-w-md relative z-10"
      >
        <div className="max-w-md w-full space-y-8 ">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-['Baloo_2'] text-blue-900 drop-shadow-lg">
              Welcome <span className="italic text-cyan-600">Back</span>
            </h2>
            <p className="mt-2 text-sm md:text-base text-blue-800">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-cyan-600 hover:text-cyan-500"
              >
                Sign up
              </Link>
            </p>
          </div>

      

          {/* Error Message */}
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email/Phone */}
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-sm font-medium text-blue-900"
                >
                  Email or Phone
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-cyan-400" />
                  </div>
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    autoComplete="username"
                    required
                    value={formData.identifier}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-blue-300 rounded-xl shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Enter your email or phone number"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-blue-900"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-cyan-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-blue-300 rounded-xl shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-cyan-400 hover:text-cyan-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-cyan-500 focus:ring-cyan-400 border-gray-300 rounded"
                />
                <span className="text-sm text-blue-900">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-900 hover:text-cyan-900"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-cyan-500 hover:bg-cyan-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </motion.div>
      
</motion.div>

    {/* Why Us Section */}
    <div className="lg:hidden flex">
          <WhyUs  />
          </div>
      {/* Right Side - Fun Water Theme */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-gradient-to-br from-cyan-300 via-blue-300 to-blue-500"
      >
        <div className="text-center px-8">
          <h2 className="text-4xl font-poppins font-bold text-white mb-6 drop-shadow-lg">
            Dive into <span className="italic text-yellow-300">Fun!</span>
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Experience a splash of joy with our colorful water-inspired
            interface.
          </p>

          {/* Animated bubbles */}
          <div className="relative w-full h-64 overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-white/40 animate-float"
                style={{
                  width: `${1 * 40 + 20}px`,
                  height: `${1 * 40 + 20}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bubble float animation */}
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
    </div>
  );
};

export default Login;
