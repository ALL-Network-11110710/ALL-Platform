'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function SetupAdmin() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [message, setMessage] = useState('');
  const [currentRole, setCurrentRole] = useState<string>('');

  // Check current role
  useEffect(() => {
    async function checkCurrentRole() {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentRole(userData?.role || 'No role set (user)');
          }
        } catch (error) {
          console.error('Error checking role:', error);
        }
      }
    }

    if (!loading) {
      checkCurrentRole();
    }
  }, [user, loading]);

  const makeAdmin = async () => {
    if (!user) {
      setMessage('You must be logged in to set admin role');
      return;
    }

    setIsSettingUp(true);
    setMessage('');

    try {
      // Get current user data first to preserve it
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      let userData = {};
      
      if (userDoc.exists()) {
        userData = userDoc.data();
      }

      // Update user document with admin role
      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        role: 'admin',
        displayName: user.displayName || 'Admin User',
        email: user.email,
        updatedAt: new Date()
      }, { merge: true });

      setMessage('✅ Success! You are now an admin. Redirecting to admin dashboard...');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/admin');
      }, 2000);

    } catch (error) {
      console.error('Error setting admin role:', error);
      setMessage('❌ Error setting admin role. Check console for details.');
    } finally {
      setIsSettingUp(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-black">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-xl font-semibold text-black mb-2">Login Required</h2>
          <p className="text-black mb-4">Please log in to set up admin access.</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg border border-orange-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚙️</span>
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">Admin Setup</h1>
          <p className="text-black">Set up administrator access for your account</p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-black mb-2">Current User Info:</h3>
          <p className="text-black text-sm"><strong>Name:</strong> {user.displayName || 'Not set'}</p>
          <p className="text-black text-sm"><strong>Email:</strong> {user.email}</p>
          <p className="text-black text-sm"><strong>Current Role:</strong> {currentRole}</p>
        </div>

        <button
          onClick={makeAdmin}
          disabled={isSettingUp}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-orange-300 transition-colors mb-4"
        >
          {isSettingUp ? 'Setting Up Admin...' : 'Make Me Admin'}
        </button>

        {message && (
          <div className={`p-3 rounded-lg text-center ${
            message.includes('✅') ? 'bg-green-100 text-green-800' : 
            message.includes('❌') ? 'bg-red-100 text-red-800' : 
            'bg-orange-100 text-black'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <button 
            onClick={() => router.push('/dashboard')}
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}