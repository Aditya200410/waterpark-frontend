import React, { useState } from 'react';
import config from '../config/config';

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const __DEV__ = document.domain === 'localhost' || window.location.hostname === 'localhost';

function RazorpayTest() {
  const [name, setName] = useState('Test User');
  const [email, setEmail] = useState('test@example.com');
  const [phone, setPhone] = useState('9899999999');
  const [amount, setAmount] = useState(499);
  const [loading, setLoading] = useState(false);

  async function displayRazorpay() {
    setLoading(true);
    
    try {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      // Create order using your backend API
      const orderResponse = await fetch(`${config.API_BASE_URL}/api/razorpay/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          receipt: `test_${Date.now()}`
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const data = await orderResponse.json();
      console.log('Order created:', data);

      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      const options = {
        key: __DEV__ ? 'rzp_test_uGoq5ABJztRAhk' : 'PRODUCTION_KEY',
        currency: data.currency,
        amount: data.amount.toString(),
        order_id: data.id,
        name: 'Waterpark Chalo',
        description: 'Test payment for waterpark booking',
        image: `${config.API_BASE_URL}/logo.png`,
        handler: async function (response) {
          console.log('Payment successful:', response);
          
          // Verify payment with backend
          try {
            const verifyResponse = await fetch(`${config.API_BASE_URL}/api/razorpay/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              alert('Payment verified successfully!');
              console.log('Payment verification successful');
            } else {
              alert('Payment verification failed: ' + verifyData.message);
              console.error('Payment verification failed:', verifyData);
            }
          } catch (error) {
            console.error('Error verifying payment:', error);
            alert('Payment completed but verification failed. Please contact support.');
          }
        },
        prefill: {
          name,
          email,
          contact: phone
        },
        theme: {
          color: '#3399cc'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Razorpay Payment Test
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={displayRazorpay}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md font-medium ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          } text-white transition duration-200`}
        >
          {loading ? 'Processing...' : `Pay ₹${amount}`}
        </button>
      </div>
      
      <div className="mt-6 text-sm text-gray-600">
        <p className="text-center">
          This is a test payment. Use Razorpay test credentials.
        </p>
      </div>
    </div>
  );
}

export default RazorpayTest;
