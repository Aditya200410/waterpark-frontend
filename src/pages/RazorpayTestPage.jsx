import React from 'react';
import RazorpayTest from '../components/RazorpayTest';

const RazorpayTestPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Razorpay Integration Test
          </h1>
          <p className="text-gray-600">
            Test the Razorpay payment integration with webhook support
          </p>
        </div>
        
        <RazorpayTest />
        
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Integration Details
            </h2>
            
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h3 className="font-medium text-gray-800">Backend Endpoints:</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/razorpay/create-order</code> - Create payment order</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/razorpay/verify-payment</code> - Verify payment signature</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/razorpay/webhook</code> - Razorpay webhook handler</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800">Webhook Events Handled:</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">payment.captured</code> - Payment successful</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">payment.failed</code> - Payment failed</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800">Environment Variables Required:</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">RAZORPAY_KEY_ID</code> - Your Razorpay key ID</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">RAZORPAY_KEY_SECRET</code> - Your Razorpay key secret</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">RAZORPAY_WEBHOOK_SECRET</code> - Webhook secret for signature verification</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RazorpayTestPage;
