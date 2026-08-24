// app/test-firebase/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function TestFirebase() {
  const [user, loading] = useAuthState(auth);
  const [firestoreStatus, setFirestoreStatus] = useState('');
  const [testing, setTesting] = useState(false);

  const testFirestore = async () => {
    setTesting(true);
    setFirestoreStatus('');
    
    try {
      // Test writing to Firestore
      const testRef = await addDoc(collection(db, 'testCollection'), {
        testData: 'This is a test record',
        timestamp: new Date(),
      });
      
      // Test reading from Firestore
      const querySnapshot = await getDocs(collection(db, 'testCollection'));
      const records = querySnapshot.docs.map(doc => doc.data());
      
      setFirestoreStatus(`Success! Wrote and read ${records.length} test records.`);
    } catch (error: any) {
      console.error('Firestore test error:', error);
      setFirestoreStatus(`Error: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Testing Firebase Connection</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Firebase Connection</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
        {user ? (
          <p className="text-green-600">✅ Connected as: {user.email}</p>
        ) : (
          <p className="text-yellow-600">⚠️ Not authenticated</p>
        )}
      </div>
      
      <div className="mb-6">
        <button
          onClick={testFirestore}
          disabled={testing}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {testing ? 'Testing Firestore...' : 'Test Firestore Connection'}
        </button>
      </div>
      
      {firestoreStatus && (
        <div className={`p-4 rounded ${
          firestoreStatus.includes('Error') 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {firestoreStatus}
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h2 className="text-lg font-semibold mb-2">Environment Variables Check</h2>
        <p>API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}</p>
        <p>Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing'}</p>
        <p>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}</p>
      </div>
    </div>
  );
}