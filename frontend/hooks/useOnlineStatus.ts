// // /hooks/useOnlineStatus.ts
// // React hook for tracking online status of users

// import { useEffect, useState, useCallback } from 'react';
// import { 
//   isUserOnline, 
//   getLastSeenText, 
//   setupOnlineStatusTracker,
//   batchCheckOnlineStatus 
// } from '@/lib/onlineStatus';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '@/lib/firebase';

// // Hook for current user's online status management
// export function useCurrentUserOnlineStatus() {
//   const [user] = useAuthState(auth);
//   const [isOnline, setIsOnline] = useState<boolean>(true); // Assume online by default

//   // Setup online status tracker for current user
//   useEffect(() => {
//     if (!user?.uid) return;

//     // Setup periodic updates for current user
//     const cleanup = setupOnlineStatusTracker(user.uid);

//     // Check own status immediately
//     isUserOnline(user.uid).then(setIsOnline);

//     // Cleanup on unmount
//     return cleanup;
//   }, [user?.uid]);

//   return { isOnline };
// }

// // Hook to check if a specific user is online
// export function useUserOnlineStatus(userId: string | null) {
//   const [isOnline, setIsOnline] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [lastSeenText, setLastSeenText] = useState<string>('');

//   useEffect(() => {
//     async function checkStatus() {
//       if (!userId) {
//         setLoading(false);
//         return;
//       }

//       try {
//         // Get user document from Firestore to check lastSeen
//         const { db } = await import('@/lib/firebase');
//         const { doc, getDoc } = await import('firebase/firestore');
        
//         const userRef = doc(db, 'users', userId);
//         const userDoc = await getDoc(userRef);
        
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           const lastSeen = userData.lastSeen;
          
//           // Check if online
//           const online = await isUserOnline(userId);
//           setIsOnline(online);
          
//           // Get last seen text
//           if (lastSeen) {
//             const text = getLastSeenText(lastSeen);
//             setLastSeenText(text);
//           } else {
//             setLastSeenText('Never online');
//           }
//         } else {
//           setIsOnline(false);
//           setLastSeenText('User not found');
//         }
//       } catch (error) {
//         console.error('Error checking user online status:', error);
//         setIsOnline(false);
//         setLastSeenText('Error checking status');
//       } finally {
//         setLoading(false);
//       }
//     }

//     checkStatus();

//     // Set up interval to check every 30 seconds
//     const intervalId = setInterval(checkStatus, 30 * 1000);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [userId]);

//   return { isOnline, loading, lastSeenText };
// }

// // Hook to batch check online status for multiple users (optimized for network page)
// export function useBatchOnlineStatus(userIds: string[]) {
//   const [onlineStatusMap, setOnlineStatusMap] = useState<Record<string, boolean>>({});
//   const [loading, setLoading] = useState<boolean>(true);

//   const checkBatchStatus = useCallback(async () => {
//     if (userIds.length === 0) {
//       setOnlineStatusMap({});
//       setLoading(false);
//       return;
//     }

//     try {
//       const statusMap = await batchCheckOnlineStatus(userIds);
//       setOnlineStatusMap(statusMap);
//     } catch (error) {
//       console.error('Error batch checking online status:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [userIds]);

//   useEffect(() => {
//     checkBatchStatus();

//     // Refresh every 30 seconds
//     const intervalId = setInterval(checkBatchStatus, 30 * 1000);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [checkBatchStatus]);

//   return { onlineStatusMap, loading, refresh: checkBatchStatus };
// }

// // Simple hook to get user's last seen time
// export function useLastSeen(userId: string | null) {
//   const [lastSeenText, setLastSeenText] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     async function fetchLastSeen() {
//       if (!userId) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const { db } = await import('@/lib/firebase');
//         const { doc, getDoc } = await import('firebase/firestore');
        
//         const userRef = doc(db, 'users', userId);
//         const userDoc = await getDoc(userRef);
        
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           const text = getLastSeenText(userData.lastSeen);
//           setLastSeenText(text);
//         } else {
//           setLastSeenText('User not found');
//         }
//       } catch (error) {
//         console.error('Error fetching last seen:', error);
//         setLastSeenText('Error');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchLastSeen();
//   }, [userId]);

//   return { lastSeenText, loading };
// }


// /hooks/useOnlineStatus.ts
// React hook for tracking online status of users

// import { useEffect, useState, useCallback } from 'react';
// import { 
//   isUserOnline, 
//   getLastSeenText, 
//   setupOnlineStatusTracker,
//   batchCheckOnlineStatus,
//   updateUserOnlineStatus 
// } from '@/lib/onlineStatus';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '@/lib/firebase';

// // Hook for current user's online status management
// export function useCurrentUserOnlineStatus() {
//   const [user] = useAuthState(auth);
//   const [isOnline, setIsOnline] = useState<boolean>(false);
//   const [trackerStarted, setTrackerStarted] = useState<boolean>(false);
//   const [debugLogs, setDebugLogs] = useState<string[]>([]);

//   const addLog = useCallback((message: string) => {
//     const timestamp = new Date().toLocaleTimeString();
//     const logMessage = `[${timestamp}] ${message}`;
//     console.log(logMessage);
//     setDebugLogs(prev => [...prev.slice(-10), logMessage]); // Keep last 10 logs
//   }, []);

//   useEffect(() => {
//     if (!user?.uid) {
//       addLog('⚠️ No user ID for online status');
//       return;
//     }

//     addLog(`🚀 Setting up online status tracker for user: ${user.uid}`);
    
//     // Start tracker
//     const cleanupTracker = setupOnlineStatusTracker(user.uid);
//     setTrackerStarted(true);
    
//     // Check status immediately
//     isUserOnline(user.uid).then(status => {
//       addLog(`📊 Initial online check: ${status ? 'ONLINE' : 'OFFLINE'}`);
//       setIsOnline(status);
//     });

//     // Check status every 20 seconds
//     const checkInterval = setInterval(async () => {
//       const status = await isUserOnline(user.uid);
//       setIsOnline(status);
//       addLog(`⏱️ Periodic check: ${status ? 'ONLINE' : 'OFFLINE'}`);
//     }, 20 * 1000);

//     // Cleanup
//     return () => {
//       addLog(`🛑 Cleaning up tracker for user: ${user.uid}`);
//       cleanupTracker();
//       clearInterval(checkInterval);
//       setTrackerStarted(false);
//     };
//   }, [user?.uid, addLog]);

//   return { 
//     isOnline, 
//     trackerStarted,
//     debugLogs,
    
//     // Manual refresh
//     refresh: async () => {
//       if (user?.uid) {
//         addLog('🔄 Manual refresh triggered');
//         await updateUserOnlineStatus(user.uid);
//         const status = await isUserOnline(user.uid);
//         setIsOnline(status);
//         return status;
//       }
//       return false;
//     }
//   };
// }

// // Hook to check if a specific user is online
// export function useUserOnlineStatus(userId: string | null) {
//   const [isOnline, setIsOnline] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [lastSeenText, setLastSeenText] = useState<string>('');

//   useEffect(() => {
//     async function checkStatus() {
//       if (!userId) {
//         setLoading(false);
//         return;
//       }

//       try {
//         // Get user document from Firestore to check lastSeen
//         const { db } = await import('@/lib/firebase');
//         const { doc, getDoc } = await import('firebase/firestore');
        
//         const userRef = doc(db, 'users', userId);
//         const userDoc = await getDoc(userRef);
        
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           const lastSeen = userData.lastSeen;
          
//           // Check if online
//           const online = await isUserOnline(userId);
//           setIsOnline(online);
          
//           // Get last seen text
//           if (lastSeen) {
//             const text = getLastSeenText(lastSeen);
//             setLastSeenText(text);
//           } else {
//             setLastSeenText('Never online');
//           }
//         } else {
//           setIsOnline(false);
//           setLastSeenText('User not found');
//         }
//       } catch (error) {
//         console.error('Error checking user online status:', error);
//         setIsOnline(false);
//         setLastSeenText('Error checking status');
//       } finally {
//         setLoading(false);
//       }
//     }

//     checkStatus();

//     // Set up interval to check every 30 seconds
//     const intervalId = setInterval(checkStatus, 30 * 1000);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [userId]);

//   return { isOnline, loading, lastSeenText };
// }

// // Hook to batch check online status for multiple users (optimized for network page)
// export function useBatchOnlineStatus(userIds: string[]) {
//   const [onlineStatusMap, setOnlineStatusMap] = useState<Record<string, boolean>>({});
//   const [loading, setLoading] = useState<boolean>(true);

//   const checkBatchStatus = useCallback(async () => {
//     if (userIds.length === 0) {
//       setOnlineStatusMap({});
//       setLoading(false);
//       return;
//     }

//     try {
//       const statusMap = await batchCheckOnlineStatus(userIds);
//       setOnlineStatusMap(statusMap);
//     } catch (error) {
//       console.error('Error batch checking online status:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [userIds]);

//   useEffect(() => {
//     checkBatchStatus();

//     // Refresh every 30 seconds
//     const intervalId = setInterval(checkBatchStatus, 30 * 1000);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [checkBatchStatus]);

//   return { onlineStatusMap, loading, refresh: checkBatchStatus };
// }

// // Simple hook to get user's last seen time
// export function useLastSeen(userId: string | null) {
//   const [lastSeenText, setLastSeenText] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     async function fetchLastSeen() {
//       if (!userId) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const { db } = await import('@/lib/firebase');
//         const { doc, getDoc } = await import('firebase/firestore');
        
//         const userRef = doc(db, 'users', userId);
//         const userDoc = await getDoc(userRef);
        
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           const text = getLastSeenText(userData.lastSeen);
//           setLastSeenText(text);
//         } else {
//           setLastSeenText('User not found');
//         }
//       } catch (error) {
//         console.error('Error fetching last seen:', error);
//         setLastSeenText('Error');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchLastSeen();
//   }, [userId]);

//   return { lastSeenText, loading };
// }



// /hooks/useOnlineStatus.ts
// React hook for tracking online status of users

// import { useEffect, useState, useCallback } from 'react';
// import { 
//   isUserOnline, 
//   getLastSeenText, 
//   setupOnlineStatusTracker,
//   batchCheckOnlineStatus,
//   updateUserOnlineStatus 
// } from '@/lib/onlineStatus';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '@/lib/firebase';

// // Hook for current user's online status management
// export function useCurrentUserOnlineStatus() {
//   const [user] = useAuthState(auth);
//   const [isOnline, setIsOnline] = useState<boolean>(false);
//   const [trackerStarted, setTrackerStarted] = useState<boolean>(false);
//   const [debugLogs, setDebugLogs] = useState<string[]>([]);

//   const addLog = useCallback((message: string) => {
//     const timestamp = new Date().toLocaleTimeString();
//     const logMessage = `[${timestamp}] ${message}`;
//     console.log(logMessage);
//     setDebugLogs(prev => [...prev.slice(-10), logMessage]); // Keep last 10 logs
//   }, []);

//   useEffect(() => {
//     if (!user?.uid) {
//       addLog('⚠️ No user ID for online status');
//       return;
//     }

//     addLog(`🚀 Setting up online status tracker for user: ${user.uid}`);
    
//     // Start tracker
//     const cleanupTracker = setupOnlineStatusTracker(user.uid);
//     setTrackerStarted(true);
    
//     // Function to check status
//     const checkStatus = async () => {
//       try {
//         addLog('🔄 Checking online status...');
//         const online = await isUserOnline(user.uid);
//         setIsOnline(online);
//         addLog(`📊 Status check: ${online ? 'ONLINE' : 'OFFLINE'}`);
//       } catch (error: any) {
//         addLog(`❌ Error checking status: ${error.message}`);
//       }
//     };
    
//     // Check immediately
//     checkStatus();
    
//     // Check every 25 seconds (slightly offset from the 30-second update)
//     const checkInterval = setInterval(checkStatus, 25 * 1000);
    
//     // Cleanup function
//     return () => {
//       addLog('🛑 Cleaning up tracker and intervals');
//       cleanupTracker();
//       clearInterval(checkInterval);
//       setTrackerStarted(false);
//     };
//   }, [user?.uid, addLog]);

//   return { 
//     isOnline, 
//     trackerStarted,
//     debugLogs,
    
//     // Manual refresh
//     refresh: async () => {
//       if (user?.uid) {
//         addLog('🔄 Manual refresh triggered');
//         await updateUserOnlineStatus(user.uid);
//         const status = await isUserOnline(user.uid);
//         setIsOnline(status);
//         return status;
//       }
//       return false;
//     }
//   };
// }

// // Hook to check if a specific user is online
// export function useUserOnlineStatus(userId: string | null) {
//   const [isOnline, setIsOnline] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [lastSeenText, setLastSeenText] = useState<string>('');

//   useEffect(() => {
//     async function checkStatus() {
//       if (!userId) {
//         setLoading(false);
//         return;
//       }

//       try {
//         console.log(`🔍 Checking status for user: ${userId}`);
//         const online = await isUserOnline(userId);
//         setIsOnline(online);
        
//         // Get last seen text
//         const { db } = await import('@/lib/firebase');
//         const { doc, getDoc } = await import('firebase/firestore');
        
//         const userRef = doc(db, 'users', userId);
//         const userDoc = await getDoc(userRef);
        
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           let lastSeen = userData.lastSeen;
          
//           // Try backup field if main field doesn't exist
//           if (!lastSeen && userData.lastSeenClient) {
//             lastSeen = userData.lastSeenClient;
//           }
          
//           if (lastSeen) {
//             const text = getLastSeenText(lastSeen);
//             setLastSeenText(text);
//           } else {
//             setLastSeenText('Never online');
//           }
//         } else {
//           setIsOnline(false);
//           setLastSeenText('User not found');
//         }
//       } catch (error) {
//         console.error('Error checking user online status:', error);
//         setIsOnline(false);
//         setLastSeenText('Error checking status');
//       } finally {
//         setLoading(false);
//       }
//     }

//     checkStatus();
    
//     // Refresh every 30 seconds
//     const intervalId = setInterval(checkStatus, 30 * 1000);
    
//     return () => clearInterval(intervalId);
//   }, [userId]);

//   return { isOnline, loading, lastSeenText };
// }

// // Hook to batch check online status for multiple users (optimized for network page)
// export function useBatchOnlineStatus(userIds: string[]) {
//   const [onlineStatusMap, setOnlineStatusMap] = useState<Record<string, boolean>>({});
//   const [loading, setLoading] = useState<boolean>(true);

//   const checkBatchStatus = useCallback(async () => {
//     if (userIds.length === 0) {
//       setOnlineStatusMap({});
//       setLoading(false);
//       return;
//     }

//     try {
//       const statusMap = await batchCheckOnlineStatus(userIds);
//       setOnlineStatusMap(statusMap);
//     } catch (error) {
//       console.error('Error batch checking online status:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [userIds]);

//   useEffect(() => {
//     checkBatchStatus();

//     // Refresh every 30 seconds
//     const intervalId = setInterval(checkBatchStatus, 30 * 1000);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [checkBatchStatus]);

//   return { onlineStatusMap, loading, refresh: checkBatchStatus };
// }

// // Simple hook to get user's last seen time
// export function useLastSeen(userId: string | null) {
//   const [lastSeenText, setLastSeenText] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     async function fetchLastSeen() {
//       if (!userId) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const { db } = await import('@/lib/firebase');
//         const { doc, getDoc } = await import('firebase/firestore');
        
//         const userRef = doc(db, 'users', userId);
//         const userDoc = await getDoc(userRef);
        
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           let lastSeen = userData.lastSeen;
          
//           // Try backup field if main field doesn't exist
//           if (!lastSeen && userData.lastSeenClient) {
//             lastSeen = userData.lastSeenClient;
//           }
          
//           const text = getLastSeenText(lastSeen);
//           setLastSeenText(text);
//         } else {
//           setLastSeenText('User not found');
//         }
//       } catch (error) {
//         console.error('Error fetching last seen:', error);
//         setLastSeenText('Error');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchLastSeen();
//   }, [userId]);

//   return { lastSeenText, loading };
// }

// // Hook to get online status of multiple users with real-time updates
// export function useMultipleUserOnlineStatus(userIds: string[]) {
//   const [statusMap, setStatusMap] = useState<Record<string, { isOnline: boolean; lastSeenText: string }>>({});
//   const [loading, setLoading] = useState<boolean>(true);

//   const updateStatusForUser = useCallback(async (userId: string) => {
//     try {
//       const { db } = await import('@/lib/firebase');
//       const { doc, getDoc } = await import('firebase/firestore');
      
//       const userRef = doc(db, 'users', userId);
//       const userDoc = await getDoc(userRef);
      
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         let lastSeen = userData.lastSeen;
        
//         if (!lastSeen && userData.lastSeenClient) {
//           lastSeen = userData.lastSeenClient;
//         }
        
//         const isOnline = await isUserOnline(userId);
//         const lastSeenText = getLastSeenText(lastSeen);
        
//         setStatusMap(prev => ({
//           ...prev,
//           [userId]: { isOnline, lastSeenText }
//         }));
//       }
//     } catch (error) {
//       console.error(`Error updating status for user ${userId}:`, error);
//     }
//   }, []);

//   useEffect(() => {
//     if (userIds.length === 0) {
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
    
//     // Update status for all users
//     const promises = userIds.map(userId => updateStatusForUser(userId));
    
//     Promise.all(promises).finally(() => {
//       setLoading(false);
//     });

//     // Set up interval for updates
//     const intervalId = setInterval(() => {
//       userIds.forEach(userId => updateStatusForUser(userId));
//     }, 30 * 1000);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [userIds, updateStatusForUser]);

//   return { statusMap, loading };
// }


// --------------------------------------------- main part ------------------------

// import { useEffect, useState, useCallback } from 'react';
// import { 
//   isUserOnline, 
//   getLastSeenText, 
//   setupOnlineStatusTracker,
//   batchCheckOnlineStatus,
//   updateUserOnlineStatus 
// } from '@/lib/onlineStatus';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '@/lib/firebase';

// // Hook for current user's online status management
// export function useCurrentUserOnlineStatus() {
//   const [user] = useAuthState(auth);
//   const [isOnline, setIsOnline] = useState<boolean>(false);
//   const [trackerStarted, setTrackerStarted] = useState<boolean>(false);
//   const [debugLogs, setDebugLogs] = useState<string[]>([]);

//   const addLog = useCallback((message: string) => {
//     const timestamp = new Date().toLocaleTimeString();
//     const logMessage = `[${timestamp}] ${message}`;
//     console.log(logMessage);
//     setDebugLogs(prev => [...prev.slice(-10), logMessage]); // Keep last 10 logs
//   }, []);

//   useEffect(() => {
//     if (!user?.uid) {
//       addLog('⚠️ No user ID for online status');
//       return;
//     }

//     addLog(`🚀 Setting up online status tracker for user: ${user.uid}`);
    
//     // Start tracker
//     const cleanupTracker = setupOnlineStatusTracker(user.uid);
//     setTrackerStarted(true);
    
//     // Function to check status
//     const checkStatus = async () => {
//       try {
//         addLog('🔄 Checking online status...');
//         const online = await isUserOnline(user.uid);
//         setIsOnline(online);
//         addLog(`📊 Status check: ${online ? 'ONLINE' : 'OFFLINE'}`);
//       } catch (error: any) {
//         addLog(`❌ Error checking status: ${error.message}`);
//       }
//     };
    
//     // Check immediately
//     checkStatus();
    
//     // FIXED: Check every 30 seconds (5 seconds AFTER the 25-second update)
//     // This ensures check happens AFTER update
//     const checkInterval = setInterval(checkStatus, 30 * 1000);
    
//     // Cleanup function
//     return () => {
//       addLog('🛑 Cleaning up tracker and intervals');
//       cleanupTracker();
//       clearInterval(checkInterval);
//       setTrackerStarted(false);
//     };
//   }, [user?.uid, addLog]);

//   return { 
//     isOnline, 
//     trackerStarted,
//     debugLogs,
    
//     // Manual refresh
//     refresh: async () => {
//       if (user?.uid) {
//         addLog('🔄 Manual refresh triggered');
//         await updateUserOnlineStatus(user.uid);
//         const status = await isUserOnline(user.uid);
//         setIsOnline(status);
//         return status;
//       }
//       return false;
//     }
//   };
// }

// // Hook to check if a specific user is online
// export function useUserOnlineStatus(userId: string | null) {
//   const [isOnline, setIsOnline] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [lastSeenText, setLastSeenText] = useState<string>('');

//   useEffect(() => {
//     async function checkStatus() {
//       if (!userId) {
//         setLoading(false);
//         return;
//       }

//       try {
//         console.log(`🔍 Checking status for user: ${userId}`);
//         const online = await isUserOnline(userId);
//         setIsOnline(online);
        
//         // Get last seen text
//         const { db } = await import('@/lib/firebase');
//         const { doc, getDoc } = await import('firebase/firestore');
        
//         const userRef = doc(db, 'users', userId);
//         const userDoc = await getDoc(userRef);
        
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           let lastSeen = userData.lastSeen;
          
//           // Try backup field if main field doesn't exist
//           if (!lastSeen && userData.lastSeenClient) {
//             lastSeen = userData.lastSeenClient;
//           }
          
//           if (lastSeen) {
//             const text = getLastSeenText(lastSeen);
//             setLastSeenText(text);
//           } else {
//             setLastSeenText('Never online');
//           }
//         } else {
//           setIsOnline(false);
//           setLastSeenText('User not found');
//         }
//       } catch (error) {
//         console.error('Error checking user online status:', error);
//         setIsOnline(false);
//         setLastSeenText('Error checking status');
//       } finally {
//         setLoading(false);
//       }
//     }

//     checkStatus();
    
//     // FIXED: Check less frequently for other users (60 seconds)
//     const intervalId = setInterval(checkStatus, 60 * 1000);
    
//     return () => clearInterval(intervalId);
//   }, [userId]);

//   return { isOnline, loading, lastSeenText };
// }

// // Hook to batch check online status for multiple users (optimized for network page)
// export function useBatchOnlineStatus(userIds: string[]) {
//   const [onlineStatusMap, setOnlineStatusMap] = useState<Record<string, boolean>>({});
//   const [loading, setLoading] = useState<boolean>(true);

//   const checkBatchStatus = useCallback(async () => {
//     if (userIds.length === 0) {
//       setOnlineStatusMap({});
//       setLoading(false);
//       return;
//     }

//     try {
//       const statusMap = await batchCheckOnlineStatus(userIds);
//       setOnlineStatusMap(statusMap);
//     } catch (error) {
//       console.error('Error batch checking online status:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [userIds]);

//   useEffect(() => {
//     checkBatchStatus();

//     // FIXED: Check less frequently for batches (45 seconds)
//     const intervalId = setInterval(checkBatchStatus, 45 * 1000);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [checkBatchStatus]);

//   return { onlineStatusMap, loading, refresh: checkBatchStatus };
// }

// // Simple hook to get user's last seen time
// export function useLastSeen(userId: string | null) {
//   const [lastSeenText, setLastSeenText] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     async function fetchLastSeen() {
//       if (!userId) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const { db } = await import('@/lib/firebase');
//         const { doc, getDoc } = await import('firebase/firestore');
        
//         const userRef = doc(db, 'users', userId);
//         const userDoc = await getDoc(userRef);
        
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           let lastSeen = userData.lastSeen;
          
//           // Try backup field if main field doesn't exist
//           if (!lastSeen && userData.lastSeenClient) {
//             lastSeen = userData.lastSeenClient;
//           }
          
//           const text = getLastSeenText(lastSeen);
//           setLastSeenText(text);
//         } else {
//           setLastSeenText('User not found');
//         }
//       } catch (error) {
//         console.error('Error fetching last seen:', error);
//         setLastSeenText('Error');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchLastSeen();
//   }, [userId]);

//   return { lastSeenText, loading };
// }

// // Hook to get online status of multiple users with real-time updates
// export function useMultipleUserOnlineStatus(userIds: string[]) {
//   const [statusMap, setStatusMap] = useState<Record<string, { isOnline: boolean; lastSeenText: string }>>({});
//   const [loading, setLoading] = useState<boolean>(true);

//   const updateStatusForUser = useCallback(async (userId: string) => {
//     try {
//       const { db } = await import('@/lib/firebase');
//       const { doc, getDoc } = await import('firebase/firestore');
      
//       const userRef = doc(db, 'users', userId);
//       const userDoc = await getDoc(userRef);
      
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         let lastSeen = userData.lastSeen;
        
//         if (!lastSeen && userData.lastSeenClient) {
//           lastSeen = userData.lastSeenClient;
//         }
        
//         const isOnline = await isUserOnline(userId);
//         const lastSeenText = getLastSeenText(lastSeen);
        
//         setStatusMap(prev => ({
//           ...prev,
//           [userId]: { isOnline, lastSeenText }
//         }));
//       }
//     } catch (error) {
//       console.error(`Error updating status for user ${userId}:`, error);
//     }
//   }, []);

//   useEffect(() => {
//     if (userIds.length === 0) {
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
    
//     // Update status for all users
//     const promises = userIds.map(userId => updateStatusForUser(userId));
    
//     Promise.all(promises).finally(() => {
//       setLoading(false);
//     });

//     // FIXED: Check less frequently for multiple users (60 seconds)
//     const intervalId = setInterval(() => {
//       userIds.forEach(userId => updateStatusForUser(userId));
//     }, 30 * 1000);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [userIds, updateStatusForUser]);

//   return { statusMap, loading };
// }




import { useEffect, useState, useCallback, useRef } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  isUserOnlineFromLastSeen, 
  getLastSeenText, 
  setupOnlineStatusTracker,
  updateUserOnlineStatus,
  batchCheckOnlineStatus,
  isUserOnline
} from '@/lib/onlineStatus';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

// Helper: chunk array into groups of max 10
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

// ========== Current User Hook ==========
export function useCurrentUserOnlineStatus() {
  const [user] = useAuthState(auth);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [trackerStarted, setTrackerStarted] = useState<boolean>(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    setDebugLogs(prev => [...prev.slice(-10), logMessage]);
  }, []);

  useEffect(() => {
    if (!user?.uid) {
      addLog('⚠️ No user ID for online status');
      return;
    }

    addLog(`🚀 Setting up online status tracker for user: ${user.uid}`);
    const cleanupTracker = setupOnlineStatusTracker(user.uid);
    setTrackerStarted(true);
    
    const checkStatus = async () => {
      try {
        const online = await isUserOnline(user.uid);
        setIsOnline(online);
      } catch (error: any) {
        addLog(`❌ Error checking status: ${error.message}`);
      }
    };
    
    checkStatus();
    const checkInterval = setInterval(checkStatus, 30 * 1000);
    
    return () => {
      addLog('🛑 Cleaning up tracker and intervals');
      cleanupTracker();
      clearInterval(checkInterval);
      setTrackerStarted(false);
    };
  }, [user?.uid, addLog]);

  return { 
    isOnline, 
    trackerStarted,
    debugLogs,
    refresh: async () => {
      if (user?.uid) {
        addLog('🔄 Manual refresh triggered');
        await updateUserOnlineStatus(user.uid);
        const status = await isUserOnline(user.uid);
        setIsOnline(status);
        return status;
      }
      return false;
    }
  };
}

// ========== Single User Hook ==========
export function useUserOnlineStatus(userId: string | null) {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastSeenText, setLastSeenText] = useState<string>('');

  useEffect(() => {
    async function checkStatus() {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const online = await isUserOnline(userId);
        setIsOnline(online);
        
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          let lastSeen = userData.lastSeen;
          if (!lastSeen && userData.lastSeenClient) lastSeen = userData.lastSeenClient;
          setLastSeenText(getLastSeenText(lastSeen));
        } else {
          setLastSeenText('User not found');
        }
      } catch (error) {
        console.error('Error checking user online status:', error);
        setIsOnline(false);
        setLastSeenText('Error checking status');
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
    const intervalId = setInterval(checkStatus, 60 * 1000);
    return () => clearInterval(intervalId);
  }, [userId]);

  return { isOnline, loading, lastSeenText };
}

// ========== Batch Hook (uses batched queries, still polling but optimized) ==========
export function useBatchOnlineStatus(userIds: string[]) {
  const [onlineStatusMap, setOnlineStatusMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const checkBatchStatus = useCallback(async () => {
    if (userIds.length === 0) {
      setOnlineStatusMap({});
      setLoading(false);
      return;
    }
    try {
      const statusMap = await batchCheckOnlineStatus(userIds);
      setOnlineStatusMap(statusMap);
    } catch (error) {
      console.error('Error batch checking online status:', error);
    } finally {
      setLoading(false);
    }
  }, [userIds]);

  useEffect(() => {
    checkBatchStatus();
    const intervalId = setInterval(checkBatchStatus, 45 * 1000);
    return () => clearInterval(intervalId);
  }, [checkBatchStatus]);

  return { onlineStatusMap, loading, refresh: checkBatchStatus };
}

// ========== Last Seen Hook ==========
export function useLastSeen(userId: string | null) {
  const [lastSeenText, setLastSeenText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchLastSeen() {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          let lastSeen = userData.lastSeen;
          if (!lastSeen && userData.lastSeenClient) lastSeen = userData.lastSeenClient;
          setLastSeenText(getLastSeenText(lastSeen));
        } else {
          setLastSeenText('User not found');
        }
      } catch (error) {
        console.error('Error fetching last seen:', error);
        setLastSeenText('Error');
      } finally {
        setLoading(false);
      }
    }
    fetchLastSeen();
  }, [userId]);

  return { lastSeenText, loading };
}

// ========== OPTIMIZED: Real-time, No Polling, with Caching ==========
export function useMultipleUserOnlineStatus(userIds: string[]) {
  const [statusMap, setStatusMap] = useState<Record<string, { isOnline: boolean; lastSeenText: string }>>({});
  const [loading, setLoading] = useState(true);
  
  const cacheRef = useRef<Record<string, { isOnline: boolean; lastSeen: any }>>({});
  const unsubscribeRefs = useRef<(() => void)[]>([]);

  const updateStatus = useCallback((userId: string, lastSeen: any) => {
    const isOnline = isUserOnlineFromLastSeen(lastSeen);
    const cached = cacheRef.current[userId];
    if (cached && cached.isOnline === isOnline && cached.lastSeen === lastSeen) {
      return; // No change
    }
    cacheRef.current[userId] = { isOnline, lastSeen };
    setStatusMap(prev => ({
      ...prev,
      [userId]: { isOnline, lastSeenText: getLastSeenText(lastSeen) }
    }));
  }, []);

  useEffect(() => {
    // Clean up previous listeners
    unsubscribeRefs.current.forEach(unsub => unsub());
    unsubscribeRefs.current = [];
    
    if (userIds.length === 0) {
      setStatusMap({});
      setLoading(false);
      return;
    }

    setLoading(true);
    const chunks = chunkArray(userIds, 10);
    let pendingChunks = chunks.length;

    chunks.forEach(chunk => {
      const q = query(collection(db, 'users'), where('uid', 'in', chunk));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        // Process changed documents
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added' || change.type === 'modified') {
            const data = change.doc.data();
            let lastSeen = data.lastSeen;
            if (!lastSeen && data.lastSeenClient) lastSeen = data.lastSeenClient;
            updateStatus(change.doc.id, lastSeen);
          }
        });
        // Ensure all users in chunk are represented (if missing, offline)
        chunk.forEach(userId => {
          const docExists = snapshot.docs.some(doc => doc.id === userId);
          if (!docExists) {
            updateStatus(userId, null);
          }
        });
        pendingChunks--;
        if (pendingChunks === 0) setLoading(false);
      }, (error) => {
        console.error('Error in online status listener:', error);
        pendingChunks--;
        if (pendingChunks === 0) setLoading(false);
      });
      unsubscribeRefs.current.push(unsubscribe);
    });

    return () => {
      unsubscribeRefs.current.forEach(unsub => unsub());
      unsubscribeRefs.current = [];
    };
  }, [userIds, updateStatus]);

  return { statusMap, loading };
}