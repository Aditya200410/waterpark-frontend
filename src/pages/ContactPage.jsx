import React, { useState } from 'react';
import { motion, LazyMotion, domAnimation } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Clock, CheckCircle, ArrowRight, MessageCircle, Users, Building } from 'lucide-react';

const contactData = () => ({
  company: 'Water Park Chalo',
  address: 'India',
  phone: '+91 ',
  email: 'wpc@waterparkchalo.com',
  officeHours: 'Monday - sun: 9:00 AM - 6:00 PM IST',
  responseTime: '24 hours',
 
});

const Contact = () => {
  const { company, address, phone, email, officeHours, responseTime } = contactData();
  const [formStatus, setFormStatus] = useState({ submitted: false, error: false });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  // State and functions for submitted messages have been removed

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Replace the form handling and submit button with a dynamic mailto link
  const constructMailtoLink = () => {
    // Get current date string
    const currentDate = new Date().toLocaleString();
    
    // Create email subject with name
    const subject = formData.subject ? 
      `${formData.subject} - from ${formData.name}` : 
      `Contact Form Inquiry from ${formData.name}`;
    
    // Create email body with formatted message
    const body = `
Name: ${formData.name}
Email: ${formData.email}
Date: ${currentDate}

Message:
${formData.message}

---
This message was sent via the VyomNexus contact form.
`;

    // Encode parameters for mailto: link
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Modify the handleMailtoSubmit function to remove the success state
  const handleMailtoSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill out all required fields before sending.");
      return;
    }
    
    // Create and open mailto link
    const mailtoLink = constructMailtoLink();
    window.location.href = mailtoLink;
    
    // Optional: Clear form fields after opening email client
    // Removed success state display
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="contact-page">
        <section className="contact-hero">
          <div className="contact-hero-content">
      <motion.div
              className="hero-badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MessageCircle size={16} />
              <span>Get in Touch</span>
            </motion.div>
            
        <motion.h1
              className="contact-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              We'd Love to <span className="gradient-text">Hear From You</span>
        </motion.h1>

            <motion.p 
              className="contact-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Have questions about our services or need assistance? Our team is here to help you.
            </motion.p>
          </div>
          
          <div className="hero-blob"></div>
          <div className="hero-blob hero-blob-secondary"></div>
          <div className="hero-grid-overlay"></div>
        </section>
        
        <div className="contact-container">
          <div className="contact-grid">
        <motion.div
              className="contact-form-container"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="form-header">
                <h2>Send Us a Message</h2>
                <p>Fill out the form below and we'll get back to you shortly</p>
              </div>
              
              <form className="contact-form" onSubmit={handleMailtoSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input 
                    type="text" 
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this regarding?"
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    rows="5"
                    required
                  ></textarea>
                </div>
                
                <motion.button 
                  type="submit" 
                  className="submit-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Send via Email Client</span>
                  <Mail size={16} />
                </motion.button>
              </form>
        </motion.div>

            <motion.div 
              className="contact-info"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="info-card">
                <h3>Contact Information</h3>
                <p>Reach out to us directly or visit our office</p>
                
                <ul className="info-list">
                  <li>
                    <div className="info-icon">
                      <Building size={20} />
                    </div>
                    <div>
                      <strong>Company</strong>
                      <p>{company}</p>
                    </div>
                  </li>
                  <li>
                  
                  </li>
                  <li>
                    <div className="info-icon">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <strong>Address</strong>
                      <p>{address}</p>
                    </div>
                  </li>
                  <li>
                    <div className="info-icon">
                      <Phone size={20} />
                    </div>
                    <div>
                      <strong>Phone</strong>
                      <p>{phone}</p>
                    </div>
                  </li>
                  <li>
                    <div className="info-icon">
                      <Mail size={20} />
                    </div>
                    <div>
                      <strong>Email</strong>
                      <p>{email}</p>
                    </div>
                  </li>
                  <li>
                    <div className="info-icon">
                      <Clock size={20} />
                    </div>
                    <div>
                      <strong>Office Hours</strong>
                      <p>{officeHours}</p>
                    </div>
                  </li>
                </ul>
                
                <div className="response-time">
                  <div className="response-icon">
                    <CheckCircle size={20} />
                  </div>
                  <p>We typically respond within <strong>{responseTime}</strong></p>
                </div>
                
                
              </div>
              
              <div className="faq-preview">
                <h3>Frequently Asked</h3>
                <ul className="faq-list">
                  <li>
                    <a href="/pricing">
                      <span>What pricing plans do you offer?</span>
                      <ArrowRight size={16} />
                    </a>
                  </li>
                  <li>
                    <a href="/features">
                      <span>How does your security system work?</span>
                      <ArrowRight size={16} />
                    </a>
                  </li>
                  <li>
                    <a href="/support">
                      <span>How can I get technical support?</span>
                      <ArrowRight size={16} />
                    </a>
                  </li>
                </ul>
              </div>
      </motion.div>
          </div>
        </div>
        
      
        {/* Submitted messages section has been removed */}
        
        <style jsx>{`
          .contact-page {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #0077B6;
            background: #ffffff;
            overflow-x: hidden;
          }
          
          /* Hero Section Styles */
          .contact-hero {
            background: linear-gradient(145deg, #f8faff 0%, #f0f5ff 100%);
            padding: 140px 20px 100px;
            position: relative;
            overflow: hidden;
          text-align: center;
        }

          .hero-grid-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: linear-gradient(rgba(106, 17, 203, 0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(106, 17, 203, 0.03) 1px, transparent 1px);
            background-size: 30px 30px;
            z-index: 1;
            opacity: 0.5;
          }
          
          .contact-hero-content {
            position: relative;
            z-index: 10;
            max-width: 800px;
            margin: 0 auto;
          }
          
          .hero-badge {
            display: inline-flex;
            align-items: center;
            background: linear-gradient(135deg, #0077B610 0%, #4F7CFF10 100%);
            border: 1px solid rgba(106, 17, 203, 0.2);
            border-radius: 50px;
            padding: 8px 16px;
            margin-bottom: 24px;
            font-size: 0.9rem;
            font-weight: 600;
            color: #0077B6;
            gap: 8px;
          }
          
          .contact-title {
            font-size: 3.5rem;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 24px;
            color: #0077B6;
          }
          
          .gradient-text {
            background: linear-gradient(135deg, #0077B6 0%, #4F7CFF 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
          }
          
          .contact-subtitle {
            font-size: 1.25rem;
            line-height: 1.6;
            color: #0077B6;
            max-width: 700px;
            margin: 0 auto 30px;
          }
          
          .hero-blob {
            position: absolute;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(106, 17, 203, 0.08), transparent 70%);
            border-radius: 100%;
            filter: blur(80px);
            z-index: 1;
            top: -300px;
            right: -200px;
          }
          
          .hero-blob-secondary {
            background: radial-gradient(circle, rgba(79, 124, 255, 0.08), transparent 70%);
            left: -200px;
            right: auto;
            top: auto;
            bottom: -300px;
          }
          
          /* Contact Container Styles */
          .contact-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 80px 20px;
          }
          
          .contact-grid {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            gap: 40px;
          }
          
          /* Form Styles */
          .contact-form-container {
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 15px 50px rgba(106, 17, 203, 0.08);
            padding: 40px;
            border: 1px solid rgba(106, 17, 203, 0.1);
          }
          
          .form-header {
          margin-bottom: 30px;
          }
          
          .form-header h2 {
            font-size: 1.8rem;
            font-weight: 700;
            color: #0077B6;
            margin-bottom: 8px;
          }
          
          .form-header p {
            color: #0077B6;
          font-size: 1rem;
          }
          
          .contact-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          
          .form-group {
          display: flex;
          flex-direction: column;
            gap: 8px;
          }
          
          .form-group label {
            font-weight: 500;
            font-size: 0.95rem;
            color: #0077B6;
          }
          
          .contact-form input,
          .contact-form textarea {
            padding: 14px 16px;
            background: #f8faff;
            border: 1px solid rgba(106, 17, 203, 0.1);
          border-radius: 8px;
            color: #0077B6;
          font-size: 1rem;
          outline: none;
            transition: all 0.3s ease;
            font-family: inherit;
          }
          
          .contact-form input:focus,
          .contact-form textarea:focus {
            border-color: #0077B6;
            box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.1);
            background: #ffffff;
          }
          
          .contact-form input::placeholder,
          .contact-form textarea::placeholder {
            color: #A0AEC0;
          }
          
          .submit-button {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: linear-gradient(135deg, #0077B6 0%, #4F7CFF 100%);
            color: white;
            font-weight: 600;
            padding: 14px 28px;
            border-radius: 8px;
          border: none;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
            box-shadow: 0 8px 20px rgba(106, 17, 203, 0.2);
          }
          
          .submit-button:hover {
            box-shadow: 0 12px 30px rgba(106, 17, 203, 0.3);
          }
          
          /* Contact Info Styles */
          .contact-info {
            display: flex;
            flex-direction: column;
            gap: 30px;
          }
          
          .info-card {
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 15px 50px rgba(106, 17, 203, 0.08);
            padding: 30px;
            border: 1px solid rgba(106, 17, 203, 0.1);
          }
          
          .info-card h3 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #0077B6;
            margin-bottom: 8px;
          }
          
          .info-card > p {
            color: #0077B6;
            font-size: 1rem;
            margin-bottom: 24px;
          }
          
          .info-list {
            list-style: none;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          
          .info-list li {
            display: flex;
            gap: 14px;
          }
          
          .info-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 38px;
            height: 38px;
            background: #f8faff;
          border-radius: 8px;
            color: #0077B6;
          }
          
          .info-list li div:last-child {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          
          .info-list li strong {
            font-size: 0.9rem;
            font-weight: 600;
            color: #0077B6;
          }
          
          .info-list li p {
            margin: 0;
            color: #0077B6;
            font-size: 0.95rem;
          }
          
          .response-time {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(106, 17, 203, 0.1);
          }
          
          .response-icon {
            color: #0077B6;
          }
          
          .response-time p {
            margin: 0;
            font-size: 0.95rem;
            color: #0077B6;
          }
          
          .social-links {
            margin-top: 20px;
          }
          
          .social-links h4 {
          font-size: 1rem;
          font-weight: 600;
            color: #0077B6;
            margin-bottom: 12px;
          }
          
          .social-icons {
            display: flex;
            gap: 12px;
          }
          
          .social-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            background: #f8faff;
            border-radius: 50%;
            color: #0077B6;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
          }
          
          .social-icon:hover {
            background: #0077B6;
            color: white;
          }
          
          /* FAQ Preview Styles */
          .faq-preview {
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 15px 50px rgba(106, 17, 203, 0.08);
            padding: 30px;
            border: 1px solid rgba(106, 17, 203, 0.1);
          }
          
          .faq-preview h3 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #0077B6;
            margin-bottom: 20px;
          }
          
          .faq-list {
            list-style: none;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          
          .faq-list li a {
            display: flex;
            align-items: center;
            justify-content: space-between;
            text-decoration: none;
            color: #0077B6;
            font-size: 0.95rem;
            padding: 12px 16px;
            background: #f8faff;
            border-radius: 8px;
            transition: all 0.3s ease;
          }
          
          .faq-list li a:hover {
            background: #f0f5ff;
            color: #0077B6;
          }
          
          /* Map Container Styles */
          .map-container {
            padding: 80px 20px;
            background: linear-gradient(145deg, #f8faff 0%, #f0f5ff 100%);
            position: relative;
            margin-top: 60px;
          }
          
          .map-header {
            text-align: center;
            max-width: 800px;
            margin: 0 auto 50px;
          }
          
          .map-header h2 {
            font-size: 2.5rem;
            font-weight: 800;
            color: #0077B6;
            margin-bottom: 16px;
          }
          
          .map-header p {
            font-size: 1.2rem;
            color: #0077B6;
            line-height: 1.6;
          }
          
          .map-grid {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 30px;
            max-width: 1200px;
            margin: 0 auto;
          }
          
          .map-info {
            display: flex;
            align-items: center;
          }
          
          .map-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 50px rgba(106, 17, 203, 0.15);
            padding: 35px;
            width: 100%;
            position: relative;
            z-index: 2;
            border: 1px solid rgba(106, 17, 203, 0.05);
          }
          
          .map-card h3 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #0077B6;
            margin-bottom: 16px;
          }
          
          .map-card p {
            color: #0077B6;
            margin-bottom: 25px;
            font-size: 1rem;
            line-height: 1.6;
          }
          
          .location-details {
            list-style: none;
            padding: 0;
            margin-bottom: 30px;
          }
          
          .location-details li {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 14px;
            color: #0077B6;
          }
          
          .location-details li svg {
            color: #0077B6;
            flex-shrink: 0;
          }
          
          .directions-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #0077B6 0%, #4F7CFF 100%);
            color: white;
            font-weight: 600;
            padding: 14px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            box-shadow: 0 8px 20px rgba(106, 17, 203, 0.2);
          }
          
          .directions-button:hover {
            box-shadow: 0 15px 30px rgba(106, 17, 203, 0.3);
            transform: translateY(-3px);
          }
          
          .map-frame {
            height: 500px;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(106, 17, 203, 0.15);
            border: 1px solid rgba(106, 17, 203, 0.05);
          }
          
          /* Responsive Styles */
          @media (max-width: 1024px) {
            .contact-grid {
              grid-template-columns: 1fr;
              gap: 30px;
            }
            
            .contact-title {
              font-size: 3rem;
            }
            
            .map-grid {
              grid-template-columns: 1fr;
              gap: 20px;
            }
            
            .map-card {
              max-width: 600px;
              margin: 0 auto;
            }
            
            .map-frame {
              height: 400px;
            }
          }
          
          @media (max-width: 768px) {
            .contact-hero {
              padding: 120px 20px 80px;
            }
            
            .contact-title {
              font-size: 2.5rem;
            }
            
            .contact-container {
              padding: 60px 20px;
            }
            
            .contact-form-container, 
            .info-card, 
            .faq-preview {
              padding: 25px;
            }
            
            .map-container {
              padding: 60px 20px;
            }
            
            .map-header h2 {
              font-size: 2rem;
            }
            
            .map-header p {
              font-size: 1.1rem;
            }
          }
          
          @media (max-width: 480px) {
            .contact-hero {
              padding: 100px 16px 60px;
            }
            
            .contact-title {
              font-size: 2rem;
            }
            
            .contact-subtitle {
              font-size: 1.1rem;
            }
            
            .contact-form-container, 
            .info-card, 
            .faq-preview {
              padding: 20px;
            }
            
            .form-header h2,
            .info-card h3,
            .faq-preview h3 {
              font-size: 1.5rem;
            }
            
            .map-container {
              padding: 50px 16px;
            }
            
            .map-header h2 {
              font-size: 1.8rem;
            }
            
            .map-frame {
              height: 300px;
            }
          }

          .form-divider {
            display: flex;
            align-items: center;
            margin: 20px 0;
            color: #718096;
          }

          .form-divider::before,
          .form-divider::after {
            content: "";
            flex: 1;
            height: 1px;
            background: rgba(106, 17, 203, 0.1);
          }

          .form-divider span {
            padding: 0 16px;
            font-size: 0.9rem;
            font-weight: 500;
          }

          .email-button {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: white;
            color: #0077B6;
            font-weight: 600;
            padding: 14px 28px;
            border-radius: 8px;
            border: 1px solid rgba(106, 17, 203, 0.2);
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
          }

          .email-button:hover {
            background: #f8faff;
            border-color: #0077B6;
            box-shadow: 0 8px 20px rgba(106, 17, 203, 0.1);
          }

          /* CSS for the error state */
          .form-error {
            text-align: center;
            padding: 40px 20px;
          }

          .error-icon {
            color: #E53E3E;
            margin-bottom: 20px;
          }

          .form-error h3 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 12px;
            color: #E53E3E;
          }

          /* Admin link, messages modal and related styles have been removed */
      `}</style>
    </div>
    </LazyMotion>
  );
};

export default Contact;