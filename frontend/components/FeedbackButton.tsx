'use client';

import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function FeedbackButton() {
  const [user] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('suggestion');
  const [rating, setRating] = useState(0);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setSubmitMessage('❌ Please enter your feedback');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const feedbackData = {
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || 'anonymous',
        userName: user?.displayName || 'Anonymous User',
        rating,
        category,
        message: message.trim(),
        status: 'new',
        createdAt: serverTimestamp(),
        pageUrl: window.location.href,
        userAgent: navigator.userAgent.substring(0, 200) // Truncate for storage
      };

      await addDoc(collection(db, 'feedback'), feedbackData);
      
      setSubmitMessage('✅ Thank you for your feedback!');
      setMessage('');
      setRating(0);
      setCategory('suggestion');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
        setSubmitMessage('');
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitMessage('❌ Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        aria-label="Submit Feedback"
      >
        <div className="flex items-center">
          <span className="text-2xl mr-2">💬</span>
          <span className="text-sm font-medium hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Feedback
          </span>
        </div>
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Share Your Feedback</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-orange-200 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-orange-100 mt-2">
                Help us improve the platform
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-black font-medium mb-3">
                  How would you rate your experience?
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-3xl transition-transform hover:scale-110 ${
                        star <= rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    >
                      {star <= rating ? '★' : '☆'}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Not good</span>
                  <span>Excellent</span>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-black font-medium mb-2">
                  What type of feedback?
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-black bg-white"
                >
                  <option value="bug">🐛 Bug Report</option>
                  <option value="feature">✨ Feature Request</option>
                  <option value="suggestion">💡 Suggestion</option>
                  <option value="improvement">🚀 Improvement Idea</option>
                  <option value="other">❓ Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-black font-medium mb-2">
                  Your Feedback
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you think, what you'd like to see, or any issues you encountered..."
                  className="w-full p-3 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-black bg-white h-40 resize-none"
                  maxLength={1000}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {message.length}/1000 characters
                </div>
              </div>

              {/* Submit Message */}
              {submitMessage && (
                <div className={`p-3 rounded-lg text-center ${
                  submitMessage.includes('✅') 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  {submitMessage}
                </div>
              )}

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:bg-orange-300 transition-colors font-medium flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    'Send Feedback'
                  )}
                </button>
              </div>

              {/* User Info */}
              {user && (
                <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
                  Submitting as: <span className="font-medium">{user.displayName || user.email}</span>
                </div>
              )}
            </form>

            {/* Footer */}
            <div className="bg-gray-50 p-4 text-center text-sm text-gray-600 border-t border-gray-200">
              Your feedback helps us improve the platform for everyone.
            </div>
          </div>
        </div>
      )}
    </>
  );
}