// components/TestMessageButton.tsx
'use client';

import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { sendMessage } from '@/lib/sendMessage';

export default function TestMessageButton() {
  const [user] = useAuthState(auth);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const testMessageText = 'This is a test message!';

  const handleClick = async () => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    setStatus('sending');
    try {
      await sendMessage({
        text: testMessageText,
        senderId: user.uid,
        receiverId: user.uid, // Sending to themselves for testing
      });
      setStatus('sent');
      console.log('Test message sent! Check your Firestore "messages" collection.');
    } catch (error) {
      console.error('Failed to send test message:', error);
      setStatus('error');
    }
  };

  return (
    <div className="p-4 border border-orange-500 rounded-lg bg-orange-50 mt-4">
      <h3 className="font-bold text-lg mb-2">Test Message Function</h3>
      <button
        onClick={handleClick}
        disabled={status === 'sending'}
        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending...' : 'Send Test Message'}
      </button>
      {status === 'sent' && <p className="text-green-600 mt-2">✓ Message sent successfully!</p>}
      {status === 'error' && <p className="text-red-600 mt-2">✗ Failed to send message. Check console.</p>}
      <p className="text-sm text-gray-600 mt-2">
        This will create a new message in Firestore between User ID: <strong>{user?.uid}</strong> and <strong>{user?.uid}</strong>.
      </p>
    </div>
  );
}