'use client';
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { updateUserOnlineStatus, isUserOnline, setupOnlineStatusTracker } from '@/lib/onlineStatus';

export default function DebugOnlinePage() {
  const [user] = useAuthState(auth);
  const [logs, setLogs] = useState<string[]>([]);
  const [lastSeen, setLastSeen] = useState<any>(null);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [manualResult, setManualResult] = useState<any>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    setLogs(prev => [...prev.slice(-20), logMessage]); // Keep last 20 logs
  };

  // Test manual update
  const testManualUpdate = async () => {
    if (!user?.uid) return;
    
    try {
      addLog('🔄 Testing manual update...');
      
      // Update timestamp
      await updateUserOnlineStatus(user.uid);
      addLog('✅ Manual update attempted');
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check status
      const online = await isUserOnline(user.uid);
      setIsOnline(online);
      addLog(`📊 User is ${online ? 'ONLINE' : 'OFFLINE'}`);
      
      // Get latest data
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        setLastSeen(data.lastSeen);
        addLog(`🕐 Last seen: ${data.lastSeen ? data.lastSeen.toDate().toLocaleString() : 'None'}`);
      }
      
      setManualResult({ success: true, isOnline: online });
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      setManualResult({ success: false, error: error.message });
    }
  };

  // Test interval tracker
  const startIntervalTracker = () => {
    if (!user?.uid) return;
    
    addLog('🚀 Starting interval tracker...');
    const cleanup = setupOnlineStatusTracker(user.uid);
    
    // Return cleanup function
    return () => {
      addLog('🛑 Stopping interval tracker');
      cleanup();
    };
  };

  useEffect(() => {
    if (user?.uid) {
      addLog(`👤 User logged in: ${user.email} (${user.uid})`);
      
      // Test immediately
      testManualUpdate();
      
      // Start interval tracker
      const cleanup = startIntervalTracker();
      
      return cleanup;
    }
  }, [user?.uid]);

  // Check Firestore permissions
  const testFirestoreWrite = async () => {
    if (!user?.uid) return;
    
    try {
      addLog('📝 Testing Firestore write permission...');
      const userRef = doc(db, 'users', user.uid);
      
      // Try to write a test field
      const { setDoc, Timestamp } = await import('firebase/firestore');
      await setDoc(
        userRef,
        {
          testField: 'test_value',
          testTimestamp: Timestamp.now()
        },
        { merge: true }
      );
      addLog('✅ Firestore write successful');
      
      // Clean up test field
      setTimeout(async () => {
        await setDoc(
          userRef,
          {
            testField: null
          },
          { merge: true }
        );
        addLog('🧹 Test field cleaned up');
      }, 3000);
      
    } catch (error: any) {
      addLog(`❌ Firestore write failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Online Status Debug</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Controls */}
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">User Info</h2>
            <div className="space-y-2">
              <p><strong>Email:</strong> {user?.email || 'Not logged in'}</p>
              <p><strong>UID:</strong> {user?.uid || 'N/A'}</p>
              <p><strong>Current Time:</strong> {new Date().toLocaleString()}</p>
              <p><strong>Last Seen in DB:</strong> {lastSeen ? lastSeen.toDate().toLocaleString() : 'Loading...'}</p>
              <p><strong>Is Online:</strong> 
                <span className={`ml-2 px-3 py-1 rounded ${isOnline ? 'bg-green-600' : 'bg-red-600'}`}>
                  {isOnline ? 'YES' : 'NO'}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Test Controls</h2>
            <div className="space-y-4">
              <button
                onClick={testManualUpdate}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
              >
                Manual Update & Check
              </button>
              
              <button
                onClick={testFirestoreWrite}
                className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold"
              >
                Test Firestore Write
              </button>
              
              <button
                onClick={() => {
                  setLogs([]);
                  console.clear();
                }}
                className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold"
              >
                Clear Logs
              </button>
            </div>
          </div>

          {manualResult && (
            <div className={`p-4 rounded-lg ${manualResult.success ? 'bg-green-900' : 'bg-red-900'}`}>
              <h3 className="font-bold mb-2">Manual Test Result</h3>
              <pre className="text-sm">
                {JSON.stringify(manualResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Right Column: Logs */}
        <div className="bg-black p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Debug Logs</h2>
            <span className="text-gray-400">{logs.length} entries</span>
          </div>
          
          <div className="font-mono text-sm bg-gray-900 rounded-lg p-4 h-[500px] overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div 
                  key={index} 
                  className={`py-2 border-b border-gray-800 ${log.includes('✅') ? 'text-green-400' : log.includes('❌') ? 'text-red-400' : log.includes('⚠️') ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  {log}
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic">No logs yet. Click test buttons.</div>
            )}
          </div>
          
          <div className="mt-4 text-xs text-gray-400">
            <p>📝 Check browser console (F12) for more detailed logs.</p>
            <p>🔄 The interval tracker should update every 30 seconds.</p>
            <p>🟢 Green dot should appear when lastSeen is within 2 minutes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}