import React from 'react';

const WhyUs = () => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Why Choose Us?</h2>
      <div className="grid md:grid-cols-3 gap-8 text-center">
        <div>
          <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Unforgettable Fun</h3>
          <p className="text-gray-600">Experience the thrill of our world-class water slides and attractions.</p>
        </div>
        <div>
          <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01"></path></svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Family Friendly</h3>
          <p className="text-gray-600">A safe and enjoyable environment for the whole family to create lasting memories.</p>
        </div>
        <div>
          <div className="bg-yellow-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Delicious Food</h3>
          <p className="text-gray-600">A wide variety of food and beverage options to satisfy every craving.</p>
        </div>
      </div>
    </div>
  );
};

export default WhyUs;
