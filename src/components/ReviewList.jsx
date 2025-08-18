import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';

const ReviewList = ({ reviews = [], averageRating = 0, totalReviews = 0 }) => {
  if (reviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-sky-100 to-blue-100 p-6 rounded-2xl text-center shadow-md border border-blue-200"
      >
        <h3 className="text-xl font-bold text-blue-900 mb-2">💦 Customer Reviews</h3>
        <p className="text-blue-700">No reviews yet. Be the first to splash your opinion!</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-sky-50 to-blue-50 border border-blue-200 rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-bold text-blue-900 mb-4">💦 Customer Reviews</h3>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className={`h-6 w-6 drop-shadow-md ${
                    index < Math.floor(averageRating)
                      ? 'text-yellow-400'
                      : 'text-blue-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-bold text-blue-800">{averageRating.toFixed(1)}</span>
          </div>
          <span className="text-blue-600">({totalReviews} reviews)</span>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((review) => review.stars === star).length;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm text-blue-700 w-8">{star}★</span>
                <div className="flex-1 bg-blue-100 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-r from-sky-400 to-blue-500 h-3 rounded-full shadow-sm"
                  />
                </div>
                <span className="text-sm text-blue-700 w-12">{count}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <motion.div
            key={review._id || review.id || index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-sky-50 to-blue-50 border border-blue-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-sky-200 text-blue-900 rounded-full flex items-center justify-center font-bold">
                  {review.userName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">
                    {review.userName || 'Anonymous'}
                  </h4>
                  <p className="text-xs text-blue-600">
                    {new Date(review.createdAt || review.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, starIndex) => (
                  <StarIcon
                    key={starIndex}
                    className={`h-5 w-5 ${
                      starIndex < review.stars ? 'text-yellow-400' : 'text-blue-200'
                    }`}
                  />
                ))}
                <span className="text-sm text-blue-700 ml-1">({review.stars}/5)</span>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-blue-900">{review.reviewTitle}</h5>
              <p className="text-blue-800 leading-relaxed">{review.reviewDescription}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
