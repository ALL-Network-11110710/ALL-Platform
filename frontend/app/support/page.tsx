'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SupportPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  
  // ✅ Hydration fix for email
  const [supportEmail, setSupportEmail] = useState('');

  useEffect(() => {
    setSupportEmail('all.network0672@gmail.com'); // 👈 Replace with your support email
  }, []);

  const [category, setCategory] = useState('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Auth check
  if (!loading && !user) {
    router.push('/login?redirect=/support');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to submit a request.');
      return;
    }

    if (!subject.trim() || !message.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addDoc(collection(db, 'feedback'), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || 'Anonymous',
        category: category,
        subject: subject.trim(),
        message: message.trim(),
        status: 'open',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setIsSubmitted(true);
      setSubject('');
      setMessage('');
      setCategory('general');
    } catch (err) {
      console.error('Error submitting support request:', err);
      setError('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-neutral-100 border-t-orange-600 rounded-full animate-spin"></div>
        <p className="text-neutral-500 font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-black tracking-tight">Help & Support</h1>
            <p className="text-neutral-500 mt-1">We're here to help. Submit a request and we'll get back to you.</p>
          </div>
          <Link 
            href="/dashboard" 
            className="text-sm font-bold text-neutral-500 hover:text-black transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Success State */}
        {isSubmitted ? (
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-12 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              ✅
            </div>
            <h3 className="text-2xl font-bold text-black mb-3">Request Submitted!</h3>
            <p className="text-neutral-500 max-w-sm mx-auto mb-8">
              Thank you for reaching out. Our team will review your request and get back to you as soon as possible.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          /* Form */
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-bold text-black mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-black"
                  required
                >
                  <option value="bug">🐛 Bug Report</option>
                  <option value="feature">💡 Feature Request</option>
                  <option value="general">📋 General Inquiry</option>
                  <option value="account">🔐 Account Help</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-bold text-black mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of your issue"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-black"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-bold text-black mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue or request in detail..."
                  rows={6}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-black resize-none"
                  required
                />
              </div>

              {/* User Info (read-only) */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <p className="text-sm text-neutral-500">
                  <span className="font-medium">Logged in as:</span> {user?.displayName || user?.email}
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Submitting...
                  </span>
                ) : (
                  'Submit Request'
                )}
              </button>

              <p className="text-xs text-neutral-400 text-center mt-4">
                We typically respond within 24-48 hours.
              </p>
            </form>
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link 
            href="/privacy" 
            className="p-4 bg-white rounded-xl border border-neutral-200 text-center hover:border-orange-500 hover:shadow-md transition-all group"
          >
            <span className="text-2xl block mb-2">🔒</span>
            <span className="text-sm font-bold text-black group-hover:text-orange-600">Privacy Policy</span>
          </Link>
          <Link 
            href="/terms" 
            className="p-4 bg-white rounded-xl border border-neutral-200 text-center hover:border-orange-500 hover:shadow-md transition-all group"
          >
            <span className="text-2xl block mb-2">📄</span>
            <span className="text-sm font-bold text-black group-hover:text-orange-600">Terms of Service</span>
          </Link>
          <div className="p-4 bg-white rounded-xl border border-neutral-200 text-center">
            <span className="text-2xl block mb-2">📧</span>
            <span className="text-sm font-bold text-black">Email Us</span>
            <p className="text-xs text-neutral-500 truncate">
              <a href={`mailto:${supportEmail}`} className="text-orange-600 hover:underline">
                {supportEmail || 'Loading...'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}