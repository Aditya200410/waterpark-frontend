// Test utility for the updated checkout flow
export const testCheckoutIntegration = {
  // Test the new Razorpay verification endpoint
  async testRazorpayVerification() {
    try {
      const testResponse = {
        razorpay_order_id: 'order_test123',
        razorpay_payment_id: 'pay_test123',
        razorpay_signature: 'test_signature'
      };

      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/razorpay/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testResponse)
      });

      const result = await response.json();
      console.log('Razorpay verification test result:', result);
      return result;
    } catch (error) {
      console.error('Razorpay verification test error:', error);
      return { success: false, error: error.message };
    }
  },

  // Test order creation endpoint
  async testOrderCreation() {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/razorpay/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: 499,
          currency: 'INR',
          receipt: `test_${Date.now()}`
        })
      });

      const result = await response.json();
      console.log('Order creation test result:', result);
      return result;
    } catch (error) {
      console.error('Order creation test error:', error);
      return { success: false, error: error.message };
    }
  },

  // Test booking status endpoint
  async testBookingStatus(bookingId) {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/bookings/status/${bookingId}`);
      const result = await response.json();
      console.log('Booking status test result:', result);
      return result;
    } catch (error) {
      console.error('Booking status test error:', error);
      return { success: false, error: error.message };
    }
  },

  // Run all tests
  async runAllTests() {
    console.log('=== Checkout Integration Tests ===');
    
    console.log('1. Testing order creation...');
    const orderTest = await this.testOrderCreation();
    
    console.log('2. Testing Razorpay verification...');
    const verificationTest = await this.testRazorpayVerification();
    
    console.log('3. Testing booking status...');
    const statusTest = await this.testBookingStatus('test_booking_id');
    
    const results = {
      orderCreation: orderTest,
      verification: verificationTest,
      bookingStatus: statusTest
    };
    
    console.log('All test results:', results);
    return results;
  }
};

// Export for use in components
export default testCheckoutIntegration;

