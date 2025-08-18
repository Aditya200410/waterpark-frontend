import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import ReviewService from '../services/reviewService';
import { useAuth } from '../context/AuthContext';

const ReviewForm = ({
  productId,
  onReviewSubmitted,
  onReviewUpdated,
  onReviewDeleted,
  existingReview = null,
  isEditing,
  onStartEdit,
  onCancelEdit
}) => {
  const { user, isAuthenticated } = useAuth();
  const [stars, setStars] = useState(existingReview?.stars || 0);
  const [reviewTitle, setReviewTitle] = useState(existingReview?.reviewTitle || '');
  const [reviewDescription, setReviewDescription] = useState(existingReview?.reviewDescription || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setStars(existingReview.stars);
      setReviewTitle(existingReview.reviewTitle);
      setReviewDescription(existingReview.reviewDescription);
    } else {
      setStars(0);
      setReviewTitle('');
      setReviewDescription('');
    }
  }, [existingReview]);

  const handleStarClick = (starValue) => setStars(starValue);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !user) return toast.error('Please login to submit a review');
    if (stars === 0) return toast.error('Please select a rating');
    if (!reviewTitle.trim()) return toast.error('Please enter a review title');
    if (!reviewDescription.trim()) return toast.error('Please enter a review description');

    setIsSubmitting(true);
    try {
      const reviewData = {
        productId,
        stars,
        reviewTitle: reviewTitle.trim(),
        reviewDescription: reviewDescription.trim(),
        userEmail: user.email,
        userName: user.name
      };
      if (existingReview && isEditing) {
        const result = await ReviewService.updateReview(existingReview._id, reviewData);
        toast.success('Review updated successfully!');
        onReviewUpdated && onReviewUpdated(result.review);
      } else if (!existingReview) {
        const result = await ReviewService.createReview(reviewData);
        toast.success('Review submitted successfully!');
        onReviewSubmitted && onReviewSubmitted(result.review);
        setStars(0);
        setReviewTitle('');
        setReviewDescription('');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReview) return;
    if (!window.confirm('Are you sure you want to delete your review?')) return;

    setIsSubmitting(true);
    try {
      await ReviewService.deleteReview(existingReview._id, user.email);
      toast.success('Review deleted successfully!');
      onReviewDeleted && onReviewDeleted();
    } catch (error) {
      toast.error(error.message || 'Failed to delete review');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Not logged in
  if (!isAuthenticated || !user) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-blue-100 via-sky-200 to-blue-100 p-6 rounded-2xl shadow-lg border border-blue-200"
      >
        <h3 className="text-lg font-semibold text-blue-900 mb-2">🌊 Write a Review</h3>
        <p className="text-blue-700 mb-4">Please login to share your splash-tastic experience!</p>
        <a 
          href="/login" 
          className="inline-block px-5 py-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 shadow-md transition-all"
        >
          Login to Review
        </a>
      </motion.div>
    );
  }

  // Show user's review
  if (existingReview && !isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-sky-50 to-blue-100 border border-blue-200 rounded-2xl p-6 shadow-md"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-900">💦 Your Review</h3>
          <div className="flex gap-2">
            <button
              onClick={onStartEdit}
              className="px-3 py-1 text-sm bg-sky-500 text-white rounded-full hover:bg-sky-600 shadow transition-all"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded-full hover:bg-red-600 shadow transition-all disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className={`h-6 w-6 drop-shadow-sm transition-transform transform ${
                  index < existingReview.stars
                    ? 'text-yellow-400 hover:scale-110'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-blue-700">({existingReview.stars}/5)</span>
          </div>
          <h4 className="font-medium text-blue-900">{existingReview.reviewTitle}</h4>
          <p className="text-blue-800">{existingReview.reviewDescription}</p>
          <p className="text-xs text-blue-600">
            Reviewed on {new Date(existingReview.createdAt).toLocaleDateString()}
          </p>
        </div>
      </motion.div>
    );
  }

  // Review form
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-sky-50 to-blue-100 border border-blue-200 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-blue-900">
          {existingReview ? '✍️ Edit Your Review' : '🌊 Write a Review'}
        </h3>
        {existingReview && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={isSubmitting}
            className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 shadow transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="mb-4 p-3 bg-sky-200 rounded-xl border border-sky-300">
        <p className="text-sm text-blue-900">
          <span className="font-medium">Reviewing as:</span> {user.name} ({user.email})
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">Rating *</label>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleStarClick(index + 1)}
                className="focus:outline-none"
              >
                {index < stars ? (
                  <StarIcon className="h-7 w-7 text-yellow-400 hover:scale-110 transition-transform" />
                ) : (
                  <StarIconOutline className="h-7 w-7 text-gray-300 hover:text-yellow-400 transition-colors" />
                )}
              </button>
            ))}
            <span className="ml-2 text-sm text-blue-700">
              {stars > 0 ? `(${stars}/5)` : '(Click to rate)'}
            </span>
          </div>
        </div>

        {/* Review Title */}
        <div>
          <label htmlFor="reviewTitle" className="block text-sm font-medium text-blue-900 mb-2">
            Review Title *
          </label>
          <input
            type="text"
            id="reviewTitle"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            maxLength={100}
            className="w-full px-3 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Summarize your splashy experience"
            required
          />
          <p className="text-xs text-blue-600 mt-1">{reviewTitle.length}/100 characters</p>
        </div>

        {/* Review Description */}
        <div>
          <label htmlFor="reviewDescription" className="block text-sm font-medium text-blue-900 mb-2">
            Review Description *
          </label>
          <textarea
            id="reviewDescription"
            value={reviewDescription}
            onChange={(e) => setReviewDescription(e.target.value)}
            maxLength={1000}
            rows={4}
            className="w-full px-3 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Tell us all the fun details about your visit!"
            required
          />
          <p className="text-xs text-blue-600 mt-1">{reviewDescription.length}/1000 characters</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || stars === 0}
            className="px-5 py-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : (existingReview ? 'Update Review' : 'Submit Review')}
          </button>
          {existingReview && (
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={isSubmitting}
              className="px-5 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 shadow disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default ReviewForm;
