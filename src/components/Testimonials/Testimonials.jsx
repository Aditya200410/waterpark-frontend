import { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Bubble SVG Component
const Bubble = ({ size, style }) => (
  <svg
    className={`absolute animate-bubble`}
    style={{ width: size, height: size, ...style }}
    viewBox="0 0 100 100"
    fill="none"
  >
    <circle cx="50" cy="50" r="50" fill="rgba(173,216,230,0.3)" />
  </svg>
);

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    text: 'The wave pool was the highlight of our visit! My kids couldn’t stop laughing and splashing...',
    rating: 5,
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'Delhi, NCR',
    text: 'What an amazing experience! The water slides were thrilling and perfectly maintained...',
    rating: 5,
  },
  // ... add the rest of your testimonials
];

const Testimonials = () => {
  return (
    <section className="relative py-16overflow-hidden mt-16">
      {/* Animated Bubbles */}
      <Bubble size="50px" style={{ top: '10%', left: '5%', animationDelay: '0s' }} />
      <Bubble size="30px" style={{ top: '40%', left: '80%', animationDelay: '2s' }} />
      <Bubble size="40px" style={{ top: '70%', left: '20%', animationDelay: '1s' }} />
      <Bubble size="25px" style={{ top: '20%', left: '60%', animationDelay: '3s' }} />
      <Bubble size="35px" style={{ top: '60%', left: '50%', animationDelay: '4s' }} />

      <div className="w-full px-4 relative z-10 text-center mt-16">
         <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">
            Read Our <span className="text-blue-900 italic font-serif">Reviews</span> ✨
          </h1>

        <Carousel
          showArrows={true}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          autoPlay={true}
          interval={5000}
          className="testimonial-carousel w-full max-w-3xl mx-auto relative"
          renderArrowPrev={(onClickHandler, hasPrev, label) =>
            hasPrev && (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-blue-200/80 shadow-lg rounded-full p-3 hover:bg-blue-300 transition-all"
              >
                <ArrowLeft className="w-6 h-6 text-blue-800" />
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            hasNext && (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-blue-200/80 shadow-lg rounded-full p-3 hover:bg-blue-300 transition-all"
              >
                <ArrowRight className="w-6 h-6 text-blue-800" />
              </button>
            )
          }
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl p-8 shadow-lg mx-4 mt-16"
            >
              {/* Rating Stars */}
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, index) => (
                  <svg
                    key={index}
                    className="w-6 h-6 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-center text-blue-900 italic mb-6">{testimonial.text}</p>

              {/* User Info */}
              <div className="text-center">
                <h4 className="font-semibold text-lg text-blue-800">{testimonial.name}</h4>
                <p className="text-blue-600">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      <style jsx>{`
        @keyframes bubble {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-200px) scale(1.2);
            opacity: 0;
          }
        }
        .animate-bubble {
          animation: bubble 6s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
