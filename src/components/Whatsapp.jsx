import React from 'react';

const WhatsAppButton = ({ phoneNumber, product }) => {
  // Construct the message with product details
  const message = `Hello! I'm interested in "${product.name}" priced at ₹${product.adultprice.toFixed(2)}. Could you provide more details?`;

  // Encode the message for a URL
  const encodedMessage = encodeURIComponent(message);

  // Create the WhatsApp click-to-chat link
  const whatsappUrl = `https://wa.me/${+918847714464}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-3 px-5 py-3 mt-4 font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
    >
      {/* WhatsApp SVG Icon */}
      <svg
        viewBox="0 0 32 32"
        className="w-8 h-8 fill-current"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.044-.53-.044-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.38.288-.73.288-1.49.187-1.593-.115-.104-.315-.175-.6a.426.426 0 0 0-.372-.12zm-2.487 7.42a12.03 12.03 0 0 1-6.82-1.952L3.62 25.11l1.79-4.49a12.07 12.07 0 0 1-1.9-6.81c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12z" />
      </svg>
      Chat on WhatsApp
    </a>
  );
};

export default WhatsAppButton;