// // /lib/onlineStatus.ts
// // Firestore-based online status tracking system
// // User is considered "online" if lastSeen is within 2 minutes

// import { db } from '@/lib/firebase';
// import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// // Update user's last seen timestamp (call this periodically when user is active)
// export async function updateUserOnlineStatus(userId: string): Promise<void> {
//   if (!userId) return;

//   try {
//     const userRef = doc(db, 'users', userId);
//     await setDoc(
//       userRef,
//       {
//         lastSeen: serverTimestamp(), // Firebase server timestamp
//         // We don't store "isOnline" boolean because it becomes stale
//         // Instead, we calculate it based on lastSeen timestamp
//       },
//       { merge: true } // Merge with existing user data, don't overwrite
//     );
//     console.log(`Updated online status for user: ${userId}`);
//   } catch (error) {
//     console.error('Error updating online status:', error);
//   }
// }

// // Check if a user is currently online (lastSeen within last 2 minutes)
// export async function isUserOnline(userId: string): Promise<boolean> {
//   if (!userId) return false;

//   try {
//     const userRef = doc(db, 'users', userId);
//     const userDoc = await getDoc(userRef);
    
//     if (!userDoc.exists()) return false;
    
//     const userData = userDoc.data();
//     const lastSeen = userData.lastSeen;
    
//     // If no lastSeen timestamp, user is offline
//     if (!lastSeen) return false;
    
//     // Convert Firestore timestamp to Date
//     const lastSeenDate = lastSeen.toDate();
//     const now = new Date();
    
//     // Calculate difference in minutes
//     const diffInMinutes = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60);
    
//     // User is considered online if last seen within 2 minutes
//     return diffInMinutes < 2;
//   } catch (error) {
//     console.error('Error checking online status:', error);
//     return false;
//   }
// }

// // Get user's last seen time as a readable string
// export function getLastSeenText(lastSeen: any): string {
//   if (!lastSeen) return 'Never online';
  
//   try {
//     const lastSeenDate = lastSeen.toDate();
//     const now = new Date();
//     const diffInMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));
    
//     if (diffInMinutes < 1) return 'Just now';
//     if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
//     const diffInHours = Math.floor(diffInMinutes / 60);
//     if (diffInHours < 24) return `${diffInHours}h ago`;
    
//     const diffInDays = Math.floor(diffInHours / 24);
//     if (diffInDays < 7) return `${diffInDays}d ago`;
    
//     return lastSeenDate.toLocaleDateString();
//   } catch (error) {
//     return 'Unknown';
//   }
// }

// // Setup periodic online status updates for current user
// // Call this when user logs in or page loads
// export function setupOnlineStatusTracker(userId: string): () => void {
//   if (!userId) return () => {};
  
//   // Update immediately
//   updateUserOnlineStatus(userId);
  
//   // Set up interval to update every 30 seconds
//   const intervalId = setInterval(() => {
//     updateUserOnlineStatus(userId);
//   }, 30 * 1000); // 30 seconds
  
//   // Return cleanup function to clear interval
//   return () => {
//     clearInterval(intervalId);
//     console.log(`Cleaned up online status tracker for user: ${userId}`);
//   };
// }

// // Batch check online status for multiple users (optimized for network page)
// export async function batchCheckOnlineStatus(userIds: string[]): Promise<Record<string, boolean>> {
//   const statusMap: Record<string, boolean> = {};
  
//   // Check each user's status
//   const promises = userIds.map(async (userId) => {
//     const isOnline = await isUserOnline(userId);
//     statusMap[userId] = isOnline;
//   });
  
//   await Promise.all(promises);
//   return statusMap;
// }

// /lib/onlineStatus.ts - COMPLETE FIXED VERSION
// Firestore-based online status tracking system
// User is considered "online" if lastSeen is within 3 minutes

// import { db } from '@/lib/firebase';
// import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';

// // Update user's last seen timestamp (call this periodically when user is active)
// export async function updateUserOnlineStatus(userId: string): Promise<void> {
//   if (!userId) return;

//   try {
//     const userRef = doc(db, 'users', userId);
//     const now = new Date();
//     const firestoreTimestamp = Timestamp.fromDate(now);
    
//     await setDoc(
//       userRef,
//       {
//         lastSeen: firestoreTimestamp,
//         lastSeenClient: now.toISOString(), // Backup with ISO string
//         updatedAt: now.toISOString()
//       },
//       { merge: true }
//     );
//     console.log(`Updated online status for user: ${userId} at ${now.toISOString()}`);
//   } catch (error) {
//     console.error('Error updating online status:', error);
//   }
// }

// // Check if a user is currently online (lastSeen within last 3 minutes)
// export async function isUserOnline(userId: string): Promise<boolean> {
//   if (!userId) return false;

//   try {
//     const userRef = doc(db, 'users', userId);
//     const userDoc = await getDoc(userRef);
    
//     if (!userDoc.exists()) return false;
    
//     const userData = userDoc.data();
//     let lastSeen: Date | null = null;
    
//     // Try multiple timestamp fields
//     if (userData.lastSeen) {
//       lastSeen = userData.lastSeen.toDate();
//       console.log(`📅 Using lastSeen field: ${lastSeen.toISOString()}`);
//     } else if (userData.lastSeenClient) {
//       lastSeen = new Date(userData.lastSeenClient);
//       console.log(`📅 Using lastSeenClient field: ${lastSeen.toISOString()}`);
//     } else if (userData.updatedAt) {
//       lastSeen = new Date(userData.updatedAt);
//       console.log(`📅 Using updatedAt field: ${lastSeen.toISOString()}`);
//     }
    
//     // If no lastSeen timestamp, user is offline
//     if (!lastSeen) return false;
    
//     const now = new Date();
    
//     // Calculate difference in minutes
//     const diffInMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);
    
//     // User is considered online if last seen within 3 minutes
//     return diffInMinutes < 3;
//   } catch (error) {
//     console.error('Error checking online status:', error);
//     return false;
//   }
// }

// // Get user's last seen time as a readable string
// export function getLastSeenText(lastSeen: any): string {
//   if (!lastSeen) return 'Never online';
  
//   try {
//     let lastSeenDate: Date;
    
//     // Check if it's a Firestore Timestamp
//     if (lastSeen && typeof lastSeen === 'object' && 'toDate' in lastSeen) {
//       lastSeenDate = lastSeen.toDate();
//     } 
//     // Check if it's a string
//     else if (typeof lastSeen === 'string') {
//       lastSeenDate = new Date(lastSeen);
//     } 
//     // Unknown type
//     else {
//       return 'Unknown';
//     }
    
//     const now = new Date();
//     const diffInSeconds = Math.floor((now.getTime() - lastSeenDate.getTime()) / 1000);
    
//     if (diffInSeconds < 60) return 'Just now';
//     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
//     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
//     if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
//     return lastSeenDate.toLocaleDateString();
//   } catch (error) {
//     return 'Recently';
//   }
// }

// // Setup periodic online status updates for current user
// // Call this when user logs in or page loads
// export function setupOnlineStatusTracker(userId: string): () => void {
//   if (!userId) return () => {};
  
//   // Update immediately
//   updateUserOnlineStatus(userId);
  
//   // Set up interval to update every 30 seconds
//   const intervalId = setInterval(() => {
//     updateUserOnlineStatus(userId);
//   }, 30 * 1000); // 30 seconds
  
//   // Return cleanup function to clear interval
//   return () => {
//     clearInterval(intervalId);
//     console.log(`Cleaned up online status tracker for user: ${userId}`);
//   };
// }

// // Batch check online status for multiple users (optimized for network page)
// export async function batchCheckOnlineStatus(userIds: string[]): Promise<Record<string, boolean>> {
//   const statusMap: Record<string, boolean> = {};
  
//   // Check each user's status
//   const promises = userIds.map(async (userId) => {
//     const isOnline = await isUserOnline(userId);
//     statusMap[userId] = isOnline;
//   });
  
//   await Promise.all(promises);
//   return statusMap;
// }


// --------------------------------- main part -----------------------------

// import { db } from '@/lib/firebase';
// import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// // Update user's last seen timestamp (call this periodically when user is active)
// export async function updateUserOnlineStatus(userId: string): Promise<void> {
//   if (!userId) return;

//   try {
//     const userRef = doc(db, 'users', userId);
    
//     // Use serverTimestamp for consistency across all clients
//     await setDoc(
//       userRef,
//       {
//         lastSeen: serverTimestamp(), // Firestore server timestamp - most reliable
//         lastSeenClient: new Date().toISOString(), // Client timestamp as backup
//         updatedAt: new Date().toISOString()
//       },
//       { merge: true }
//     );
//     console.log(`✅ Updated online status for user: ${userId}`);
//   } catch (error) {
//     console.error('❌ Error updating online status:', error);
//   }
// }

// // Check if a user is currently online (lastSeen within last 5 minutes)
// export async function isUserOnline(userId: string): Promise<boolean> {
//   if (!userId) return false;

//   try {
//     const userRef = doc(db, 'users', userId);
//     const userDoc = await getDoc(userRef);
    
//     if (!userDoc.exists()) {
//       console.log(`❌ User ${userId} document does not exist`);
//       return false;
//     }
    
//     const userData = userDoc.data();
//     let lastSeen: Date | null = null;
//     let timestampSource = 'none';
    
//     console.log(`🔍 Checking online status for user: ${userId}`);
    
//     // Try multiple timestamp fields with priority - FIXED WITH PROPER ERROR HANDLING
//     if (userData.lastSeen) {
//       try {
//         const tempDate = userData.lastSeen.toDate();
//         if (tempDate && !isNaN(tempDate.getTime())) { // Check if date is valid
//           lastSeen = tempDate;
//           timestampSource = 'lastSeen';
//           console.log(`✅ Using Firestore lastSeen: ${tempDate.toISOString()}`);
//         } else {
//           console.log(`⚠️ Firestore timestamp is invalid, trying backup fields`);
//         }
//       } catch (e) {
//         console.log(`⚠️ Failed to parse Firestore timestamp: ${e}, trying backup fields`);
//       }
//     }
    
//     // If Firestore timestamp failed, try backup fields WITH VALIDATION
//     if (!lastSeen && userData.lastSeenClient) {
//       try {
//         const tempDate = new Date(userData.lastSeenClient);
//         if (!isNaN(tempDate.getTime())) { // Check if date is valid
//           lastSeen = tempDate;
//           timestampSource = 'lastSeenClient';
//           console.log(`✅ Using lastSeenClient: ${tempDate.toISOString()}`);
//         } else {
//           console.log(`⚠️ lastSeenClient is invalid date string: ${userData.lastSeenClient}`);
//         }
//       } catch (e) {
//         console.log(`⚠️ Failed to parse lastSeenClient: ${e}`);
//       }
//     }
    
//     // FIXED: Added proper validation for updatedAt
//     if (!lastSeen && userData.updatedAt) {
//       try {
//         const tempDate = new Date(userData.updatedAt);
//         if (!isNaN(tempDate.getTime())) { // Check if date is valid
//           lastSeen = tempDate;
//           timestampSource = 'updatedAt';
//           console.log(`✅ Using updatedAt: ${tempDate.toISOString()}`);
//         } else {
//           console.log(`⚠️ updatedAt is invalid date string: ${userData.updatedAt}`);
//         }
//       } catch (e) {
//         console.log(`⚠️ Failed to parse updatedAt: ${e}`);
//       }
//     }
    
//     // If no timestamp found at all
//     if (!lastSeen) {
//       console.log(`❌ No valid timestamp found for user: ${userId}`);
//       return false;
//     }
    
//     const now = new Date();
//     const diffInMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);
    
//     console.log(`⏰ Time difference: ${diffInMinutes.toFixed(2)} minutes (source: ${timestampSource})`);
    
//     // User is considered online if last seen within 5 minutes
//     const isOnline = diffInMinutes < 10;
    
//     if (isOnline) {
//       console.log(`🟢 User ${userId} is ONLINE`);
//     } else {
//       console.log(`🔴 User ${userId} is OFFLINE (last seen ${diffInMinutes.toFixed(1)} minutes ago)`);
//     }
    
//     return isOnline;
//   } catch (error) {
//     console.error('❌ Error checking online status:', error);
//     return false;
//   }
// }

// // Get user's last seen time as a readable string
// export function getLastSeenText(lastSeen: any): string {
//   if (!lastSeen) return 'Never online';
  
//   try {
//     let lastSeenDate: Date;
    
//     // Check if it's a Firestore Timestamp
//     if (lastSeen && typeof lastSeen === 'object' && 'toDate' in lastSeen) {
//       lastSeenDate = lastSeen.toDate();
//     } 
//     // Check if it's a string
//     else if (typeof lastSeen === 'string') {
//       lastSeenDate = new Date(lastSeen);
//     } 
//     // Already a Date object
//     else if (lastSeen instanceof Date) {
//       lastSeenDate = lastSeen;
//     }
//     // Unknown type
//     else {
//       return 'Unknown';
//     }
    
//     // Check if the date is valid
//     if (isNaN(lastSeenDate.getTime())) {
//       return 'Recently';
//     }
    
//     const now = new Date();
//     const diffInSeconds = Math.floor((now.getTime() - lastSeenDate.getTime()) / 1000);
    
//     if (diffInSeconds < 60) return 'Just now';
//     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
//     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
//     if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
//     return lastSeenDate.toLocaleDateString();
//   } catch (error) {
//     return 'Recently';
//   }
// }

// // Setup periodic online status updates for current user
// // Call this when user logs in or page loads
// export function setupOnlineStatusTracker(userId: string): () => void {
//   if (!userId) return () => {};
  
//   console.log(`🚀 Starting online status tracker for user: ${userId}`);
  
//   // Update immediately
//   updateUserOnlineStatus(userId);
  
//   // Set up interval to update every 25 seconds (more frequent than check interval)
//   const intervalId = setInterval(() => {
//     console.log(`🔄 Periodic update for user: ${userId}`);
//     updateUserOnlineStatus(userId);
//   }, 25 * 1000); // 25 seconds
  
//   // Return cleanup function to clear interval
//   return () => {
//     console.log(`🧹 Cleaning up online status tracker for user: ${userId}`);
//     clearInterval(intervalId);
//   };
// }

// // Batch check online status for multiple users (optimized for network page)
// export async function batchCheckOnlineStatus(userIds: string[]): Promise<Record<string, boolean>> {
//   const statusMap: Record<string, boolean> = {};
  
//   // Check each user's status
//   const promises = userIds.map(async (userId) => {
//     const isOnline = await isUserOnline(userId);
//     statusMap[userId] = isOnline;
//   });
  
//   await Promise.all(promises);
//   return statusMap;
// }



import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';

// Helper: determine if user is online based on lastSeen timestamp
export function isUserOnlineFromLastSeen(lastSeen: any): boolean {
  if (!lastSeen) return false;
  try {
    let lastSeenDate: Date;
    if (lastSeen && typeof lastSeen === 'object' && 'toDate' in lastSeen) {
      lastSeenDate = lastSeen.toDate();
    } else if (typeof lastSeen === 'string') {
      lastSeenDate = new Date(lastSeen);
    } else if (lastSeen instanceof Date) {
      lastSeenDate = lastSeen;
    } else {
      return false;
    }
    if (isNaN(lastSeenDate.getTime())) return false;
    const diffInMinutes = (Date.now() - lastSeenDate.getTime()) / (1000 * 60);
    return diffInMinutes < 10; // Within 10 minutes = online
  } catch {
    return false;
  }
}

// Update user's last seen timestamp (call periodically when user is active)
export async function updateUserOnlineStatus(userId: string): Promise<void> {
  if (!userId) return;
  try {
    const userRef = doc(db, 'users', userId);
    const now = serverTimestamp();
    await setDoc(
      userRef,
      {
        lastSeen: now,
        lastSeenClient: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Also store isOnline derived from lastSeen (client-side will use it, but we write true now)
        isOnline: true,
      },
      { merge: true }
    );
    // Schedule an "offline" update after 10 minutes? Not needed; client will recompute.
    console.log(`✅ Updated online status for user: ${userId}`);
  } catch (error) {
    console.error('❌ Error updating online status:', error);
  }
}

// Check if a user is currently online (uses lastSeen from Firestore)
export async function isUserOnline(userId: string): Promise<boolean> {
  if (!userId) return false;
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) return false;
    const userData = userDoc.data();
    let lastSeen = userData.lastSeen;
    if (!lastSeen && userData.lastSeenClient) lastSeen = userData.lastSeenClient;
    return isUserOnlineFromLastSeen(lastSeen);
  } catch (error) {
    console.error('❌ Error checking online status:', error);
    return false;
  }
}

// Get user's last seen time as a readable string
export function getLastSeenText(lastSeen: any): string {
  if (!lastSeen) return 'Never online';
  try {
    let lastSeenDate: Date;
    if (lastSeen && typeof lastSeen === 'object' && 'toDate' in lastSeen) {
      lastSeenDate = lastSeen.toDate();
    } else if (typeof lastSeen === 'string') {
      lastSeenDate = new Date(lastSeen);
    } else if (lastSeen instanceof Date) {
      lastSeenDate = lastSeen;
    } else {
      return 'Unknown';
    }
    if (isNaN(lastSeenDate.getTime())) return 'Recently';
    const diffInSeconds = Math.floor((Date.now() - lastSeenDate.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return lastSeenDate.toLocaleDateString();
  } catch {
    return 'Recently';
  }
}

// Setup periodic online status updates for current user
export function setupOnlineStatusTracker(userId: string): () => void {
  if (!userId) return () => {};
  console.log(`🚀 Starting online status tracker for user: ${userId}`);
  updateUserOnlineStatus(userId);
  const intervalId = setInterval(() => {
    updateUserOnlineStatus(userId);
  }, 25 * 1000);
  return () => {
    console.log(`🧹 Cleaning up online status tracker for user: ${userId}`);
    clearInterval(intervalId);
  };
}

// OPTIMIZED: Batch check online status for multiple users using a single query (max 10 per query)
export async function batchCheckOnlineStatus(userIds: string[]): Promise<Record<string, boolean>> {
  if (userIds.length === 0) return {};
  const statusMap: Record<string, boolean> = {};
  const chunkSize = 10;
  for (let i = 0; i < userIds.length; i += chunkSize) {
    const chunk = userIds.slice(i, i + chunkSize);
    const q = query(collection(db, 'users'), where('uid', 'in', chunk));
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => {
      const data = doc.data();
      let lastSeen = data.lastSeen;
      if (!lastSeen && data.lastSeenClient) lastSeen = data.lastSeenClient;
      statusMap[doc.id] = isUserOnlineFromLastSeen(lastSeen);
    });
    // For any userId in chunk not found, set offline
    chunk.forEach(uid => {
      if (!statusMap[uid]) statusMap[uid] = false;
    });
  }
  return statusMap;
}