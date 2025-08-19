import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import config from '../config/config';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    if (!phone.match(/^\d{10}$/)) {
      setError('Please enter a valid 10-digit phone number');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${config.API_URLS.AUTH}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone:phone
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Account created successfully!');
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center relative font-sans bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600 overflow-hidden">

      {/* Animated bubbles for water theme */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -200, 0], x: [0, 50, -50, 0] }}
          transition={{ repeat: Infinity, duration: 6 + i, ease: "easeInOut" }}
          className="absolute w-6 h-6 rounded-full bg-blue-300/50 opacity-70"
          style={{ left: `${10 + i * 10}%`, bottom: `${-50 - i * 20}px` }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-lg p-10 w-full max-w-md relative z-10"
      >
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-blue-100 mb-2 tracking-tight">
            Create <span className="italic text-white font-serif">Account</span>
          </h2>
          <p className="text-sm text-blue-50">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-blue-900 hover:underline">Sign in</Link>
          </p>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField id="name" label="Full Name" icon={<User className="text-blue-300" />} placeholder="Full Name" value={formData.name} onChange={handleChange} disabled={isLoading} />
          <InputField id="email" label="Email" icon={<Mail className="text-blue-300" />} placeholder="Email" value={formData.email} onChange={handleChange} disabled={isLoading} />

          <PasswordField id="password" label="Password" value={formData.password} show={showPassword} toggleShow={() => setShowPassword(!showPassword)} onChange={handleChange} disabled={isLoading} />
          <PasswordField id="confirmPassword" label="Confirm Password" value={formData.confirmPassword} show={showConfirmPassword} toggleShow={() => setShowConfirmPassword(!showConfirmPassword)} onChange={handleChange} disabled={isLoading} />

          {/* Phone field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-blue-50">Phone Number</label>
            <div className="mt-1 relative flex">
              <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-blue-300 bg-blue-100 text-blue-700 text-sm select-none">+91</span>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                maxLength={10}
                className="block w-full pl-3 pr-4 py-3 border border-blue-300 rounded-r-xl bg-blue-50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200"
                placeholder="10-digit phone number"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl font-semibold text-white hover:from-blue-500 hover:to-blue-700 shadow-lg flex justify-center items-center space-x-2 transition-all duration-300"
          >
            {isLoading && <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />}
            Sign Up
          </button>
        </form>

        {/* Decorative wave */}
        <svg className="absolute -bottom-6 left-0 w-full h-12" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgba(255,255,255,0.2)" d="M0,64L48,90.7C96,117,192,171,288,197.3C384,224,480,224,576,197.3C672,171,768,117,864,101.3C960,85,1056,107,1152,122.7C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </motion.div>
    </div>
  );
};

const InputField = ({ id, label, icon, placeholder, value, onChange, disabled }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-blue-50">{label}</label>
    <div className="mt-1 relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
      <input
        id={id}
        name={id}
        type="text"
        autoComplete={id}
        required
        className="block w-full pl-10 pr-3 py-3 border border-blue-300 rounded-xl bg-blue-50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  </div>
);

const PasswordField = ({ id, label, value, show, toggleShow, onChange, disabled }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-blue-50">{label}</label>
    <div className="mt-1 relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="text-blue-300 h-5 w-5" /></div>
      <input
        id={id}
        name={id}
        type={show ? "text" : "password"}
        required
        className="block w-full pl-10 pr-10 py-3 border border-blue-300 rounded-xl bg-blue-50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200"
        placeholder={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button type="button" onClick={toggleShow} className="text-blue-400 hover:text-blue-700 focus:outline-none" disabled={disabled}>
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  </div>
);

export default Signup;
