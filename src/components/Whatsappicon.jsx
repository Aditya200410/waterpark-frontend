// src/components/WhatsAppButton.jsx
import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const phoneNumber = "+918847714464"; // Replace with your WhatsApp number
  const message = "Hello! I want to know more."; // Default message

  const handleClick = () => {
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <>
  

      <button
           onClick={handleClick}
          className=" fixed bottom-[100px] left-6 z-[100] w-16 h-16 bg-green-500 text-white  rounded-full shadow-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          <FaWhatsapp className="w-10 h-10" />
        </button>
        </>

  );
};

export default WhatsAppButton;
