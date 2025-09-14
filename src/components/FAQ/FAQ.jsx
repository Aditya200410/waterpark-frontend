import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const faqCategories = [
  {
    title: 'About WaterParkChalo',
    questions: [
      {
        q: 'Is WaterParkChalo An Indian Company?',
        a: 'Yes, WaterParkChalo is a registered company in India specializing in water park ticket booking and adventure experiences. We are committed to providing the best water park experiences across India.'
      },
     
      {
        q: 'Where Can I Book Water Park Tickets In India?',
        a: '• You can book water park tickets directly through our website: **waterparkchalo.com**\n• **Alternatively** you can also visit our partner water parks and book tickets on-site with special discounts available through our platform.'
      },
     
      
    ]
  },
  {
    title: 'About Water Park Experiences',
    questions: [
      {
        q: 'What Types of Water Parks Do You Partner With?',
        a: 'WaterParkChalo partners with premium water parks across India, featuring thrilling water slides, wave pools, lazy rivers, and family-friendly attractions. We work with both established water parks and emerging adventure destinations to provide diverse experiences for all age groups.'
      },
      {
        q: 'Are All Water Park Activities Safe?',
        a: 'YES, all our partner water parks maintain the highest safety standards with certified lifeguards, regular equipment maintenance, and safety protocols. We ensure that all activities are supervised by trained professionals and follow international safety guidelines.'
      },
      
    ]
  },
  {
    title: 'How To Book',
    questions: [
      {
        q: 'How Do I Book Water Park Tickets Online?',
        a: 'It\'s very easy! Browse through our selection of water parks, choose your preferred date and time slot, select the number of tickets needed, and add them to your cart. Click \'Checkout\' – Apply any discount codes if you have them – agree to terms and conditions – Make payment using your Debit/Credit Card/Net Banking/Wallet or UPI. Your booking is complete and you\'ll receive instant confirmation!'
      },
      {
        q: 'How Will I Know If My Booking Is Confirmed?',
        a: 'During the payment process you will receive a confirmation that your payment has been successfully processed. **You\'ll get an on-screen notification \'Booking Confirmed\'.** You will also receive a booking confirmation number through email/SMS from WaterParkChalo with your e-tickets.'
      },
      {
        q: 'Is It Safe To Use My Credit Card Online At waterparkchalo.com?',
        a: 'We do not store credit card information on our website. Your payment information is secure with our trusted payment solution providers – Razorpay and PhonePe, ensuring your financial data is protected.'
      }
    ]
  },
  {
    title: 'Billing & Payments',
    questions: [
      {
        q: 'What Payment Methods Do You Accept?',
        a: 'We accept all MasterCard, VISA, American Express, and RuPay Debit or Credit Cards.\n\nWe also support UPI payments, net banking, and digital wallets like Paytm, PhonePe, and Google Pay for convenient booking.'
      },
      {
        q: 'When Will My Payment Be Charged?',
        a: 'Your payment will be charged immediately at the time of booking confirmation through our secured payment gateway. You\'ll receive instant confirmation and e-tickets upon successful payment.'
      }
    ]
  },
  {
    title: 'Cancellations & Refunds',
    questions: [
      {
        q: 'What Is Your Cancellation Policy?',
        a: '• At WaterParkChalo, we understand that plans can change, so we offer flexible cancellation options.\n• Cancellations made 24 hours before the scheduled visit are eligible for full refund.\n• Cancellations made within 24 hours but before the visit time are eligible for 50% refund.\n• No refunds for no-shows or cancellations after the visit time.\n• Refund requests must be made through our customer support at support@waterparkchalo.com with your booking reference number.\n• Refunds will be processed within 5-7 business days to the original payment method.'
      }
    ]
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('About WaterParkChalo');
  const [activeQuestion, setActiveQuestion] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-12"
        >
          Frequently Asked Questions (FAQs)
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">FAQs</h2>
              <nav className="space-y-2">
                {faqCategories.map((category) => (
                  <button
                    key={category.title}
                    onClick={() => setActiveCategory(category.title)}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                      activeCategory === category.title
                        ? 'bg-pink-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {category.title}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* FAQ Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-6">{activeCategory}</h2>
              <div className="space-y-4">
                {faqCategories
                  .find((cat) => cat.title === activeCategory)
                  ?.questions.map((faq, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 last:border-0"
                    >
                      <button
                        onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                        className="w-full flex items-center justify-between py-4 text-left"
                      >
                        <span className="font-medium pr-8">{faq.q}</span>
                        <ChevronDownIcon
                          className={`h-5 w-5 text-gray-500 transition-transform ${
                            activeQuestion === index ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>
                      {activeQuestion === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pb-4 text-gray-600 whitespace-pre-line"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 