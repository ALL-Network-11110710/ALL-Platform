"use client";

import { useState } from 'react';
import { generateAndSendOTP, verifyOTP, validateCompanyEmail } from '@/lib/emailService';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

export default function TestOTPPage() {
  const [user] = useAuthState(auth);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!user) {
      setMessage('Please log in first');
      return;
    }

    const validation = validateCompanyEmail(email);
    if (!validation.isValid) {
      setMessage(`Validation Error: ${validation.error}`);
      return;
    }

    setLoading(true);
    setMessage('Sending OTP...');
    
    const result = await generateAndSendOTP(email, user.uid);
    
    if (result.success) {
      setMessage(`✅ ${result.message}`);
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }
    
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (!user) {
      setMessage('Please log in first');
      return;
    }

    if (!otp || otp.length !== 6) {
      setMessage('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setMessage('Verifying OTP...');
    
    const result = await verifyOTP(user.uid, otp);
    
    if (result.success) {
      setMessage(`✅ ${result.message} - Email: ${result.email}`);
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-orange-600 mb-4">OTP System Test</h1>
        
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800 font-bold">TEST MODE ACTIVE</p>
          <p className="text-yellow-700 text-sm">Personal emails are allowed for testing</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Test Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@gmail.com"
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleSendOTP}
              disabled={loading || !user}
              className="w-full mt-2 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              Send Test OTP
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              className="w-full p-2 border rounded text-center text-xl tracking-widest"
              maxLength={6}
            />
            <button
              onClick={handleVerifyOTP}
              disabled={loading || !user}
              className="w-full mt-2 bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              Verify OTP
            </button>
          </div>

          {message && (
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <p className="text-gray-800">{message}</p>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-600">
            <p className="font-bold">Test Instructions:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Log in to your account first</li>
              <li>Enter any email (personal emails allowed in test mode)</li>
              <li>Click "Send Test OTP"</li>
              <li>Check your email for OTP (also check console for OTP)</li>
              <li>Enter OTP and click "Verify OTP"</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}