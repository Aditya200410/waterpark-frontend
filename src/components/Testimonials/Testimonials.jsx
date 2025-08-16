import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";


const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    text: 'The wave pool was the highlight of our visit! My kids couldn’t stop laughing and splashing. The lifeguards were attentive and made us feel completely safe. We are already planning our next visit!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'Delhi, NCR',
    text: 'What an amazing experience! The water slides were thrilling and perfectly maintained. My teenage son loved the high-speed slides, while I enjoyed relaxing in the lazy river. A perfect family outing.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Anjali Patel',
    location: 'Ahmedabad, Gujarat',
    text: 'We booked the water park for my daughter’s birthday party and it was unforgettable! The kids enjoyed the rain dance zone, and the staff took care of everything from food to safety. Totally worth it!',
    rating: 5,
  },
  {
    id: 4,
    name: 'Suresh Menon',
    location: 'Bangalore, Karnataka',
    text: 'I was impressed by how clean and well-organized the entire park was. From the thrilling slides to the calm wave pool, there’s something for everyone. The food court had plenty of tasty options too.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Meera Reddy',
    location: 'Hyderabad, Telangana',
    text: 'The kids’ play area is fantastic! My little ones had the time of their lives in the shallow pools and mini slides. As a parent, I really appreciated the safety measures and friendly staff.',
    rating: 5,
  },
  {
    id: 6,
    name: 'Amit Singh',
    location: 'Pune, Maharashtra',
    text: 'The rides are simply world-class! The vertical drop slide gave me such an adrenaline rush, while the family raft ride was pure fun. The locker and changing room facilities were very convenient.',
    rating: 5,
  },
  {
    id: 7,
    name: 'Kavita Iyer',
    location: 'Chennai, Tamil Nadu',
    text: 'The rain dance with DJ music was the best part of our day! Everyone was dancing and enjoying themselves. The atmosphere was so lively, and the staff ensured everything was safe and comfortable.',
    rating: 5,
  },
  {
    id: 8,
    name: 'Vikram Malhotra',
    location: 'Chandigarh, Punjab',
    text: 'Perfect weekend getaway! The combination of thrilling slides, relaxing pools, and delicious food makes it a must-visit spot. My whole family came back with unforgettable memories.',
    rating: 5,
  },
];

// Simplified animations for better performance
const slideVariants = {
  hidden: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    transition: { duration: 0.4, ease: 'easeInOut' }
  }),
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeInOut' }
  },
  exit: (direction) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    transition: { duration: 0.4, ease: 'easeInOut' }
  }),
};

const Testimonials = () => {
  return (
    <section className="testimonials-section py-16 w-full relative">
      <div className="w-full px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        <Carousel
          showArrows={true}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          autoPlay={true}
          interval={5000}
          className="testimonial-carousel w-full"
          renderArrowPrev={(onClickHandler, hasPrev, label) =>
            hasPrev && (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 md:p-4 hover:bg-blue-100 transition-all border border-gray-200"
              >
                <ArrowLeft className="w-7 h-7 md:w-9 md:h-9 text-blue transition-transform duration-200 group-hover:scale-110" />
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            hasNext && (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 md:p-4 hover:bg-blue-100 transition-all border border-gray-200"
              >
                <ArrowRight className="w-7 h-7 md:w-9 md:h-9 text-blue-800 transition-transform duration-200 group-hover:scale-110" />
              </button>
            )
          }
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="max-w-xl mx-auto testimonial-item bg-white p-8 rounded-lg shadow-lg mb-8">
              <div className="flex items-center justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, index) => (
                  <svg
                    key={index}
                    className="w-6 h-6 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">{testimonial.text}</p>
              <div className="text-center">
                <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                <p className="text-gray-500">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials; 