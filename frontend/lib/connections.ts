// import { db } from '@/lib/firebase';
// import { 
//   doc, 
//   getDoc, 
//   setDoc, 
//   updateDoc,
//   collection, 
//   query, 
//   where, 
//   getDocs,
//   serverTimestamp 
// } from 'firebase/firestore';

// export interface Connection {
//   id: string;
//   fromUserId: string;
//   toUserId: string;
//   status: 'pending' | 'accepted' | 'rejected';
//   createdAt: any;
// }

// export interface UserProfile {
//   uid: string;
//   displayName: string | null;
//   headline: string;
//   profileImage: string;
// }

// export const sendConnectionRequest = async (fromUserId: string, toUserId: string): Promise<string> => {
//   // Create a unique ID for the connection document using the user IDs
//   const connectionId = `${fromUserId}_${toUserId}`;
//   const connectionRef = doc(db, 'connections', connectionId);

//   // Check if a connection already exists
//   const connectionSnap = await getDoc(connectionRef);
//   if (connectionSnap.exists()) {
//     throw new Error('Connection request already exists.');
//   }

//   // Create a new connection request
//   await setDoc(connectionRef, {
//     fromUserId,
//     toUserId,
//     status: 'pending',
//     createdAt: serverTimestamp(),
//   });

//   return connectionId;
// };

// export const getConnectionStatus = async (fromUserId: string, toUserId: string): Promise<Connection | null> => {
//   const connectionId = `${fromUserId}_${toUserId}`;
//   const connectionRef = doc(db, 'connections', connectionId);
//   const connectionSnap = await getDoc(connectionRef);

//   if (connectionSnap.exists()) {
//     return { id: connectionSnap.id, ...connectionSnap.data() } as Connection;
//   }

//   return null;
// };

// export const getIncomingConnectionRequests = async (userId: string): Promise<(Connection & { fromUser: UserProfile })[]> => {
//   try {
//     // Query for connection requests where the current user is the recipient
//     const q = query(
//       collection(db, 'connections'),
//       where('toUserId', '==', userId),
//       where('status', '==', 'pending')
//     );
    
//     const querySnapshot = await getDocs(q);
//     const requests: (Connection & { fromUser: UserProfile })[] = [];

//     // For each connection request, fetch the sender's profile
//     for (const connectionDoc of querySnapshot.docs) {
//       const connectionData = { id: connectionDoc.id, ...connectionDoc.data() } as Connection;
      
//       // Get the sender's profile
//       const userDoc = await getDoc(doc(db, 'users', connectionData.fromUserId));
//       if (userDoc.exists()) {
//         const userData = userDoc.data() as {
//           displayName?: string;
//           headline?: string;
//           profileImage?: string;
//           [key: string]: any;
//         };
        
//         requests.push({
//           ...connectionData,
//           fromUser: {
//             uid: userDoc.id,
//             displayName: userData.displayName || null,
//             headline: userData.headline || '',
//             profileImage: userData.profileImage || ''
//           }
//         });
//       }
//     }

//     return requests;
//   } catch (error) {
//     console.error('Error fetching incoming connection requests:', error);
//     throw error;
//   }
// };

// export const acceptConnectionRequest = async (connectionId: string): Promise<void> => {
//   try {
//     const connectionRef = doc(db, 'connections', connectionId);
//     await updateDoc(connectionRef, {
//       status: 'accepted',
//       respondedAt: serverTimestamp()
//     });
//   } catch (error) {
//     console.error('Error accepting connection request:', error);
//     throw error;
//   }
// };

// export const rejectConnectionRequest = async (connectionId: string): Promise<void> => {
//   try {
//     const connectionRef = doc(db, 'connections', connectionId);
//     await updateDoc(connectionRef, {
//       status: 'rejected',
//       respondedAt: serverTimestamp()
//     });
//   } catch (error) {
//     console.error('Error rejecting connection request:', error);
//     throw error;
//   }
// };

// import { db } from '@/lib/firebase';
// import { 
//   doc, 
//   getDoc, 
//   setDoc, 
//   updateDoc,
//   collection, 
//   query, 
//   where, 
//   getDocs,
//   serverTimestamp 
// } from 'firebase/firestore';

// export interface Connection {
//   id: string;
//   fromUserId: string;
//   toUserId: string;
//   status: 'pending' | 'accepted' | 'rejected';
//   createdAt: any;
// }

// export interface UserProfile {
//   uid: string;
//   displayName: string | null;
//   headline: string;
//   profileImage: string;
// }

// export const sendConnectionRequest = async (fromUserId: string, toUserId: string): Promise<string> => {
//   // Create a unique ID for the connection document using the user IDs
//   const connectionId = `${fromUserId}_${toUserId}`;
//   const connectionRef = doc(db, 'connections', connectionId);

//   // Check if a connection already exists
//   const connectionSnap = await getDoc(connectionRef);
//   if (connectionSnap.exists()) {
//     throw new Error('Connection request already exists.');
//   }

//   // Get the sender's profile to include their name in the notification
//   const fromUserDoc = await getDoc(doc(db, 'users', fromUserId));
//   if (!fromUserDoc.exists()) {
//     throw new Error('User not found.');
//   }
//   const fromUserData = fromUserDoc.data() as {
//     displayName?: string;
//     headline?: string;
//     profileImage?: string;
//     [key: string]: any;
//   };

//   // Create a new connection request
//   await setDoc(connectionRef, {
//     fromUserId,
//     toUserId,
//     status: 'pending',
//     createdAt: serverTimestamp(),
//   });

//   // Create a notification for the recipient
//   const notificationId = `${fromUserId}_${toUserId}_connection_request_${Date.now()}`;
//   const notificationRef = doc(db, 'notifications', notificationId);
  
//   await setDoc(notificationRef, {
//     userId: toUserId, // The recipient of the notification
//     type: 'connection_request',
//     fromUserId: fromUserId,
//     fromUserName: fromUserData.displayName || 'Someone',
//     message: `${fromUserData.displayName || 'Someone'} wants to connect with you`,
//     read: false,
//     connectionId: connectionId,
//     createdAt: serverTimestamp(),
//   });

//   return connectionId;
// };

// export const getConnectionStatus = async (fromUserId: string, toUserId: string): Promise<Connection | null> => {
//   const connectionId = `${fromUserId}_${toUserId}`;
//   const connectionRef = doc(db, 'connections', connectionId);
//   const connectionSnap = await getDoc(connectionRef);

//   if (connectionSnap.exists()) {
//     return { id: connectionSnap.id, ...connectionSnap.data() } as Connection;
//   }

//   return null;
// };

// export const getIncomingConnectionRequests = async (userId: string): Promise<(Connection & { fromUser: UserProfile })[]> => {
//   try {
//     // Query for connection requests where the current user is the recipient
//     const q = query(
//       collection(db, 'connections'),
//       where('toUserId', '==', userId),
//       where('status', '==', 'pending')
//     );
    
//     const querySnapshot = await getDocs(q);
//     const requests: (Connection & { fromUser: UserProfile })[] = [];

//     // For each connection request, fetch the sender's profile
//     for (const connectionDoc of querySnapshot.docs) {
//       const connectionData = { id: connectionDoc.id, ...connectionDoc.data() } as Connection;
      
//       // Get the sender's profile
//       const userDoc = await getDoc(doc(db, 'users', connectionData.fromUserId));
//       if (userDoc.exists()) {
//         const userData = userDoc.data() as {
//           displayName?: string;
//           headline?: string;
//           profileImage?: string;
//           [key: string]: any;
//         };
        
//         requests.push({
//           ...connectionData,
//           fromUser: {
//             uid: userDoc.id,
//             displayName: userData.displayName || null,
//             headline: userData.headline || '',
//             profileImage: userData.profileImage || ''
//           }
//         });
//       }
//     }

//     return requests;
//   } catch (error) {
//     console.error('Error fetching incoming connection requests:', error);
//     throw error;
//   }
// };

// export const acceptConnectionRequest = async (connectionId: string): Promise<void> => {
//   try {
//     const connectionRef = doc(db, 'connections', connectionId);
//     await updateDoc(connectionRef, {
//       status: 'accepted',
//       respondedAt: serverTimestamp()
//     });
//   } catch (error) {
//     console.error('Error accepting connection request:', error);
//     throw error;
//   }
// };

// export const rejectConnectionRequest = async (connectionId: string): Promise<void> => {
//   try {
//     const connectionRef = doc(db, 'connections', connectionId);
//     await updateDoc(connectionRef, {
//       status: 'rejected',
//       respondedAt: serverTimestamp()
//     });
//   } catch (error) {
//     console.error('Error rejecting connection request:', error);
//     throw error;
//   }
// };

// working main one 

// import { db } from '@/lib/firebase';
// import { 
//   doc, 
//   getDoc, 
//   setDoc, 
//   updateDoc,
//   collection, 
//   query, 
//   where, 
//   getDocs,
//   serverTimestamp 
// } from 'firebase/firestore';

// export interface Connection {
//   id: string;
//   fromUserId: string;
//   toUserId: string;
//   status: 'pending' | 'accepted' | 'rejected';
//   createdAt: any;
// }

// export interface UserProfile {
//   uid: string;
//   displayName: string | null;
//   headline: string;
//   profileImage: string;
// }

// /**
//  * Send a connection request from one user to another
//  */
// export const sendConnectionRequest = async (fromUserId: string, toUserId: string): Promise<string> => {
//   // Create a unique ID for the connection document using the user IDs
//   const connectionId = `${fromUserId}_${toUserId}`;
//   const connectionRef = doc(db, 'connections', connectionId);

//   // Check if a connection already exists
//   const connectionSnap = await getDoc(connectionRef);
//   if (connectionSnap.exists()) {
//     throw new Error('Connection request already exists.');
//   }

//   // Get the sender's profile to include their name in the notification
//   const fromUserDoc = await getDoc(doc(db, 'users', fromUserId));
//   if (!fromUserDoc.exists()) {
//     throw new Error('User not found.');
//   }
//   const fromUserData = fromUserDoc.data() as {
//     displayName?: string;
//     headline?: string;
//     profileImage?: string;
//     [key: string]: any;
//   };

//   // Create a new connection request
//   await setDoc(connectionRef, {
//     fromUserId,
//     toUserId,
//     status: 'pending',
//     createdAt: serverTimestamp(),
//   });

//   // Create a notification for the recipient
//   const notificationId = `${fromUserId}_${toUserId}_connection_request_${Date.now()}`;
//   const notificationRef = doc(db, 'notifications', notificationId);
  
//   await setDoc(notificationRef, {
//     userId: toUserId, // The recipient of the notification
//     type: 'connection_request',
//     fromUserId: fromUserId,
//     fromUserName: fromUserData.displayName || 'Someone',
//     message: `${fromUserData.displayName || 'Someone'} wants to connect with you`,
//     read: false,
//     connectionId: connectionId,
//     createdAt: serverTimestamp(),
//   });

//   return connectionId;
// };

// /**
//  * Get connection status between two users (one direction)
//  */
// export const getConnectionStatus = async (fromUserId: string, toUserId: string): Promise<Connection | null> => {
//   const connectionId = `${fromUserId}_${toUserId}`;
//   const connectionRef = doc(db, 'connections', connectionId);
//   const connectionSnap = await getDoc(connectionRef);

//   if (connectionSnap.exists()) {
//     return { id: connectionSnap.id, ...connectionSnap.data() } as Connection;
//   }

//   return null;
// };

// /**
//  * Check if two users are connected (accepted status in either direction)
//  * This is the main function we use for messaging permissions
//  */
// export const areUsersConnected = async (userId1: string, userId2: string): Promise<boolean> => {
//   try {
//     // Check connection from userId1 to userId2
//     const connection1 = await getConnectionStatus(userId1, userId2);
//     if (connection1 && connection1.status === 'accepted') {
//       return true;
//     }
    
//     // Check connection from userId2 to userId1
//     const connection2 = await getConnectionStatus(userId2, userId1);
//     if (connection2 && connection2.status === 'accepted') {
//       return true;
//     }
    
//     // No accepted connection found
//     return false;
//   } catch (error) {
//     console.error('Error checking user connection:', error);
//     return false;
//   }
// };

// /**
//  * Get all incoming connection requests for a user
//  */
// export const getIncomingConnectionRequests = async (userId: string): Promise<(Connection & { fromUser: UserProfile })[]> => {
//   try {
//     // Query for connection requests where the current user is the recipient
//     const q = query(
//       collection(db, 'connections'),
//       where('toUserId', '==', userId),
//       where('status', '==', 'pending')
//     );
    
//     const querySnapshot = await getDocs(q);
//     const requests: (Connection & { fromUser: UserProfile })[] = [];

//     // For each connection request, fetch the sender's profile
//     for (const connectionDoc of querySnapshot.docs) {
//       const connectionData = { id: connectionDoc.id, ...connectionDoc.data() } as Connection;
      
//       // Get the sender's profile
//       const userDoc = await getDoc(doc(db, 'users', connectionData.fromUserId));
//       if (userDoc.exists()) {
//         const userData = userDoc.data() as {
//           displayName?: string;
//           headline?: string;
//           profileImage?: string;
//           [key: string]: any;
//         };
        
//         requests.push({
//           ...connectionData,
//           fromUser: {
//             uid: userDoc.id,
//             displayName: userData.displayName || null,
//             headline: userData.headline || '',
//             profileImage: userData.profileImage || ''
//           }
//         });
//       }
//     }

//     return requests;
//   } catch (error) {
//     console.error('Error fetching incoming connection requests:', error);
//     throw error;
//   }
// };

// /**
//  * Accept a connection request
//  */
// export const acceptConnectionRequest = async (connectionId: string): Promise<void> => {
//   try {
//     const connectionRef = doc(db, 'connections', connectionId);
//     await updateDoc(connectionRef, {
//       status: 'accepted',
//       respondedAt: serverTimestamp()
//     });
//   } catch (error) {
//     console.error('Error accepting connection request:', error);
//     throw error;
//   }
// };

// /**
//  * Reject a connection request
//  */
// export const rejectConnectionRequest = async (connectionId: string): Promise<void> => {
//   try {
//     const connectionRef = doc(db, 'connections', connectionId);
//     await updateDoc(connectionRef, {
//       status: 'rejected',
//       respondedAt: serverTimestamp()
//     });
//   } catch (error) {
//     console.error('Error rejecting connection request:', error);
//     throw error;
//   }
// };

// /**
//  * Get all connections for a user (both sent and received, accepted only)
//  */
// export const getUserConnections = async (userId: string): Promise<Connection[]> => {
//   try {
//     // Query for connections where user is either sender or receiver
//     const q1 = query(
//       collection(db, 'connections'),
//       where('fromUserId', '==', userId),
//       where('status', '==', 'accepted')
//     );
    
//     const q2 = query(
//       collection(db, 'connections'),
//       where('toUserId', '==', userId),
//       where('status', '==', 'accepted')
//     );
    
//     const [sentSnapshot, receivedSnapshot] = await Promise.all([
//       getDocs(q1),
//       getDocs(q2)
//     ]);
    
//     const connections: Connection[] = [];
    
//     sentSnapshot.forEach((doc) => {
//       connections.push({ id: doc.id, ...doc.data() } as Connection);
//     });
    
//     receivedSnapshot.forEach((doc) => {
//       connections.push({ id: doc.id, ...doc.data() } as Connection);
//     });
    
//     return connections;
//   } catch (error) {
//     console.error('Error fetching user connections:', error);
//     throw error;
//   }
// };

// /**
//  * Remove a connection (unfriend)
//  */
// export const removeConnection = async (connectionId: string): Promise<void> => {
//   try {
//     const connectionRef = doc(db, 'connections', connectionId);
//     await updateDoc(connectionRef, {
//       status: 'removed',
//       removedAt: serverTimestamp()
//     });
//   } catch (error) {
//     console.error('Error removing connection:', error);
//     throw error;
//   }
// };

// /**
//  * Get mutual connections between two users
//  */
// export const getMutualConnections = async (userId1: string, userId2: string): Promise<Connection[]> => {
//   try {
//     // Get all connections for both users
//     const [user1Connections, user2Connections] = await Promise.all([
//       getUserConnections(userId1),
//       getUserConnections(userId2)
//     ]);
    
//     // Extract connected user IDs
//     const user1ConnectedIds = new Set<string>();
//     user1Connections.forEach(conn => {
//       const otherId = conn.fromUserId === userId1 ? conn.toUserId : conn.fromUserId;
//       user1ConnectedIds.add(otherId);
//     });
    
//     const user2ConnectedIds = new Set<string>();
//     user2Connections.forEach(conn => {
//       const otherId = conn.fromUserId === userId2 ? conn.toUserId : conn.fromUserId;
//       user2ConnectedIds.add(otherId);
//     });
    
//     // Find intersection (mutual connections)
//     const mutualIds = [...user1ConnectedIds].filter(id => user2ConnectedIds.has(id));
    
//     // Return connection objects for mutual connections (simplified)
//     const mutualConnections: Connection[] = [];
    
//     for (const id of mutualIds) {
//       // Get connection between userId1 and this mutual connection
//       const connection = await getConnectionStatus(userId1, id) || await getConnectionStatus(id, userId1);
//       if (connection) {
//         mutualConnections.push(connection);
//       }
//     }
    
//     return mutualConnections;
//   } catch (error) {
//     console.error('Error fetching mutual connections:', error);
//     return [];
//   }
// };


// -------------------- ---------- Main one ---------------------------------

// import { db } from '@/lib/firebase';
// import { 
//   doc, 
//   getDoc, 
//   setDoc, 
//   updateDoc,
//   deleteDoc,
//   collection, 
//   query, 
//   where, 
//   getDocs,
//   writeBatch,
//   serverTimestamp,
//   orderBy,
//   or,
//   and
// } from 'firebase/firestore';

// // Helper function to generate consistent connection ID regardless of direction
// function getConnectionId(userId1: string, userId2: string): string {
//   // Sort IDs to ensure consistent connection ID regardless of direction
//   const [id1, id2] = [userId1, userId2].sort();
//   return `${id1}_${id2}`;
// }

// // Helper function to get connection direction
// function getConnectionDirection(fromUserId: string, toUserId: string, connection: Connection): 'sent' | 'received' | 'same' {
//   if (connection.fromUserId === fromUserId && connection.toUserId === toUserId) {
//     return 'sent';
//   } else if (connection.fromUserId === toUserId && connection.toUserId === fromUserId) {
//     return 'received';
//   }
//   return 'same';
// }

// export interface Connection {
//   id: string;
//   fromUserId: string;  // The user who sent the request
//   toUserId: string;    // The user who received the request
//   status: 'pending' | 'accepted' | 'rejected' | 'removed' | 'cancelled';
//   createdAt: any;
//   respondedAt?: any;
//   removedAt?: any;
//   cancelledAt?: any;
//   note?: string;
//   tags?: string[];
//   mutualConnections?: number;
// }

// // Match the EXACT UserProfile interface from your profile page
// export interface UserProfile {
//   uid: string;
//   displayName: string | null;
//   email: string | null;
//   headline: string;
//   bio: string;
//   skills: string[];
//   location: string;
//   profileImage: string;
//   projects: string[];
//   education: string;
//   experience: string;
//   website: string;
//   github: string;
//   linkedin: string;
//   createdAt?: any;
// }

// // Extended interfaces for different views
// export interface ConnectionWithUser extends Connection {
//   otherUser: UserProfile;
// }

// export interface IncomingRequest extends Connection {
//   fromUser: UserProfile;
// }

// export interface SentRequest extends Connection {
//   toUser: UserProfile;
// }

// /**
//  * Send a connection request from one user to another
//  * Smart handling: If other user already sent a request, automatically accept it
//  */
// export const sendConnectionRequest = async (fromUserId: string, toUserId: string): Promise<string> => {
//   // Generate consistent connection ID (sorted to avoid duplicates)
//   const connectionId = getConnectionId(fromUserId, toUserId);
//   const connectionRef = doc(db, 'connections', connectionId);

//   // Check if a connection already exists
//   const connectionSnap = await getDoc(connectionRef);
  
//   if (connectionSnap.exists()) {
//     const existing = connectionSnap.data() as Connection;
    
//     // Check the status of the existing connection
//     if (existing.status === 'accepted') {
//       throw new Error('Already connected with this user.');
//     }
    
//     if (existing.status === 'pending') {
//       // Determine who sent the existing request
//       if (existing.fromUserId === fromUserId && existing.toUserId === toUserId) {
//         // Current user already sent request to this user
//         throw new Error('Connection request already pending.');
//       } else if (existing.fromUserId === toUserId && existing.toUserId === fromUserId) {
//         // Other user already sent request to current user - AUTO ACCEPT!
//         console.log(`Auto-accepting connection from ${toUserId} to ${fromUserId}`);
//         await updateDoc(connectionRef, {
//           status: 'accepted',
//           respondedAt: serverTimestamp()
//         });
        
//         // Get the other user's profile for notification
//         const fromUserDoc = await getDoc(doc(db, 'users', toUserId));
//         if (fromUserDoc.exists()) {
//           const fromUserData = fromUserDoc.data() as any;
//           const toUserDoc = await getDoc(doc(db, 'users', fromUserId));
//           const toUserData = toUserDoc.data() as any;
          
//           // Create acceptance notification for the original sender
//           const notificationId = `${connectionId}_auto_accepted_${Date.now()}`;
//           const notificationRef = doc(db, 'notifications', notificationId);
          
//           await setDoc(notificationRef, {
//             userId: toUserId, // Original sender
//             type: 'connection_accepted',
//             fromUserId: fromUserId,
//             fromUserName: toUserData.displayName || 'Someone',
//             fromUserHeadline: toUserData.headline || '',
//             fromUserImage: toUserData.profileImage || '',
//             message: `${toUserData.displayName || 'Someone'} accepted your connection request`,
//             read: false,
//             connectionId: connectionId,
//             createdAt: serverTimestamp(),
//           });
//         }
        
//         return connectionId;
//       }
//     }
    
//     // If connection exists but is rejected, cancelled, or removed, allow sending new request
//     if (['rejected', 'cancelled', 'removed'].includes(existing.status)) {
//       // Delete the old connection and create a new one
//       await deleteDoc(connectionRef);
//     }
//   }

//   // Get the sender's profile
//   const fromUserDoc = await getDoc(doc(db, 'users', fromUserId));
//   if (!fromUserDoc.exists()) {
//     throw new Error('User not found.');
//   }
//   const fromUserData = fromUserDoc.data() as any;

//   // Calculate mutual connections
//   let mutualCount = 0;
//   try {
//     const mutual = await getMutualConnections(fromUserId, toUserId);
//     mutualCount = mutual.length;
//   } catch (error) {
//     console.error('Error calculating mutual connections:', error);
//   }

//   // Create a new connection request
//   await setDoc(connectionRef, {
//     fromUserId,
//     toUserId,
//     status: 'pending',
//     createdAt: serverTimestamp(),
//     mutualConnections: mutualCount,
//   });

//   // Create a notification for the recipient
//   const notificationId = `${fromUserId}_${toUserId}_connection_request_${Date.now()}`;
//   const notificationRef = doc(db, 'notifications', notificationId);
  
//   await setDoc(notificationRef, {
//     userId: toUserId,
//     type: 'connection_request',
//     fromUserId: fromUserId,
//     fromUserName: fromUserData.displayName || 'Someone',
//     fromUserHeadline: fromUserData.headline || '',
//     fromUserImage: fromUserData.profileImage || '',
//     message: `${fromUserData.displayName || 'Someone'} wants to connect with you`,
//     read: false,
//     connectionId: connectionId,
//     mutualConnections: mutualCount,
//     createdAt: serverTimestamp(),
//   });

//   return connectionId;
// };

// /**
//  * Get connection between two users (checks both directions, accepts any status)
//  */
// export const getConnectionBetweenUsers = async (userId1: string, userId2: string): Promise<Connection | null> => {
//   if (userId1 === userId2) return null;
  
//   const connectionId = getConnectionId(userId1, userId2);
//   const connectionRef = doc(db, 'connections', connectionId);
//   const connectionSnap = await getDoc(connectionRef);

//   if (connectionSnap.exists()) {
//     return { id: connectionSnap.id, ...connectionSnap.data() } as Connection;
//   }

//   return null;
// };

// /**
//  * Get connection status from one user's perspective
//  */
// export const getConnectionStatus = async (fromUserId: string, toUserId: string): Promise<Connection | null> => {
//   const connection = await getConnectionBetweenUsers(fromUserId, toUserId);
//   if (!connection) return null;
  
//   // Check if the connection matches the direction
//   if (connection.fromUserId === fromUserId && connection.toUserId === toUserId) {
//     return connection;
//   }
  
//   // If connection exists but in reverse direction, return it with swapped perspective
//   if (connection.fromUserId === toUserId && connection.toUserId === fromUserId) {
//     return {
//       ...connection,
//       // Note: id remains the same, but fromUserId/toUserId in the returned object
//       // reflect the actual database record, not the requested perspective
//     };
//   }
  
//   return null;
// };

// /**
//  * Check if two users are connected (accepted status) - FIXED VERSION WITH MULTIPLE CHECKS
//  */
// export const areUsersConnected = async (userId1: string, userId2: string): Promise<boolean> => {
//   if (userId1 === userId2) return false;
  
//   try {
//     // Check 1: Direct connection document
//     const connection = await getConnectionBetweenUsers(userId1, userId2);
//     if (connection?.status === 'accepted') {
//       return true;
//     }
    
//     // Check 2: Query user's accepted connections list (fallback)
//     const userConnections = await getUserConnections(userId1);
//     const connectedUserIds = userConnections.map(conn => 
//       conn.fromUserId === userId1 ? conn.toUserId : conn.fromUserId
//     );
    
//     if (connectedUserIds.includes(userId2)) {
//       return true;
//     }
    
//     // Check 3: Query the other user's accepted connections list
//     const otherUserConnections = await getUserConnections(userId2);
//     const otherConnectedUserIds = otherUserConnections.map(conn => 
//       conn.fromUserId === userId2 ? conn.toUserId : conn.fromUserId
//     );
    
//     if (otherConnectedUserIds.includes(userId1)) {
//       return true;
//     }
    
//     return false;
//   } catch (error) {
//     console.error('Error checking user connection:', error);
//     return false;
//   }
// };

// /**
//  * Get all connections for a user (both sent and received, accepted only)
//  */
// export const getUserConnections = async (userId: string): Promise<Connection[]> => {
//   try {
//     const q = query(
//       collection(db, 'connections'),
//       or(
//         and(
//           where('fromUserId', '==', userId),
//           where('status', '==', 'accepted')
//         ),
//         and(
//           where('toUserId', '==', userId),
//           where('status', '==', 'accepted')
//         )
//       )
//     );
    
//     const querySnapshot = await getDocs(q);
//     const connections: Connection[] = [];
    
//     querySnapshot.forEach((doc) => {
//       connections.push({ id: doc.id, ...doc.data() } as Connection);
//     });
    
//     return connections;
//   } catch (error) {
//     console.error('Error fetching user connections:', error);
//     throw error;
//   }
// };

// /**
//  * Get all incoming connection requests for a user
//  */
// export const getIncomingConnectionRequests = async (userId: string): Promise<IncomingRequest[]> => {
//   try {
//     const q = query(
//       collection(db, 'connections'),
//       where('toUserId', '==', userId),
//       where('status', '==', 'pending')
//     );
    
//     const querySnapshot = await getDocs(q);
//     const requests: IncomingRequest[] = [];

//     for (const connectionDoc of querySnapshot.docs) {
//       const connectionData = { id: connectionDoc.id, ...connectionDoc.data() } as Connection;
      
//       // Get the sender's profile
//       const userDoc = await getDoc(doc(db, 'users', connectionData.fromUserId));
//       if (userDoc.exists()) {
//         const userData = userDoc.data() as any;
        
//         requests.push({
//           ...connectionData,
//           fromUser: {
//             uid: userDoc.id,
//             displayName: userData.displayName || null,
//             email: userData.email || null,
//             headline: userData.headline || '',
//             bio: userData.bio || '',
//             skills: userData.skills || [],
//             location: userData.location || '',
//             profileImage: userData.profileImage || '',
//             projects: userData.projects || [],
//             education: userData.education || '',
//             experience: userData.experience || '',
//             website: userData.website || '',
//             github: userData.github || '',
//             linkedin: userData.linkedin || '',
//             createdAt: userData.createdAt
//           }
//         });
//       }
//     }

//     // Sort by most recent
//     requests.sort((a, b) => {
//       const dateA = a.createdAt?.toDate?.() || new Date(0);
//       const dateB = b.createdAt?.toDate?.() || new Date(0);
//       return dateB.getTime() - dateA.getTime();
//     });

//     return requests;
//   } catch (error) {
//     console.error('Error fetching incoming connection requests:', error);
//     throw error;
//   }
// };

// /**
//  * Get all sent connection requests for a user
//  */
// export const getSentConnectionRequests = async (userId: string): Promise<SentRequest[]> => {
//   try {
//     const q = query(
//       collection(db, 'connections'),
//       where('fromUserId', '==', userId),
//       where('status', '==', 'pending')
//     );
    
//     const querySnapshot = await getDocs(q);
//     const requests: SentRequest[] = [];

//     for (const connectionDoc of querySnapshot.docs) {
//       const connectionData = { id: connectionDoc.id, ...connectionDoc.data() } as Connection;
      
//       // Get the recipient's profile
//       const userDoc = await getDoc(doc(db, 'users', connectionData.toUserId));
//       if (userDoc.exists()) {
//         const userData = userDoc.data() as any;
        
//         requests.push({
//           ...connectionData,
//           toUser: {
//             uid: userDoc.id,
//             displayName: userData.displayName || null,
//             email: userData.email || null,
//             headline: userData.headline || '',
//             bio: userData.bio || '',
//             skills: userData.skills || [],
//             location: userData.location || '',
//             profileImage: userData.profileImage || '',
//             projects: userData.projects || [],
//             education: userData.education || '',
//             experience: userData.experience || '',
//             website: userData.website || '',
//             github: userData.github || '',
//             linkedin: userData.linkedin || '',
//             createdAt: userData.createdAt
//           }
//         });
//       }
//     }

//     // Sort by most recent
//     requests.sort((a, b) => {
//       const dateA = a.createdAt?.toDate?.() || new Date(0);
//       const dateB = b.createdAt?.toDate?.() || new Date(0);
//       return dateB.getTime() - dateA.getTime();
//     });

//     return requests;
//   } catch (error) {
//     console.error('Error fetching sent connection requests:', error);
//     throw error;
//   }
// };

// /**
//  * Accept a connection request
//  */
// export const acceptConnectionRequest = async (connectionId: string): Promise<void> => {
//   try {
//     const connectionRef = doc(db, 'connections', connectionId);
//     const connectionSnap = await getDoc(connectionRef);
    
//     if (!connectionSnap.exists()) {
//       throw new Error('Connection not found.');
//     }
    
//     const connectionData = connectionSnap.data() as Connection;
    
//     await updateDoc(connectionRef, {
//       status: 'accepted',
//       respondedAt: serverTimestamp()
//     });

//     // Create a notification for the sender
//     const fromUserDoc = await getDoc(doc(db, 'users', connectionData.fromUserId));
//     if (fromUserDoc.exists()) {
//       const fromUserData = fromUserDoc.data() as any;
//       const toUserDoc = await getDoc(doc(db, 'users', connectionData.toUserId));
//       const toUserData = toUserDoc.data() as any;
      
//       const notificationId = `${connectionId}_accepted_${Date.now()}`;
//       const notificationRef = doc(db, 'notifications', notificationId);
      
//       await setDoc(notificationRef, {
//         userId: connectionData.fromUserId,
//         type: 'connection_accepted',
//         fromUserId: connectionData.toUserId,
//         fromUserName: toUserData.displayName || 'Someone',
//         fromUserHeadline: toUserData.headline || '',
//         fromUserImage: toUserData.profileImage || '',
//         message: `${toUserData.displayName || 'Someone'} accepted your connection request`,
//         read: false,
//         connectionId: connectionId,
//         createdAt: serverTimestamp(),
//       });
//     }
//   } catch (error) {
//     console.error('Error accepting connection request:', error);
//     throw error;
//   }
// };

// /**
//  * Reject a connection request
//  */
// export const rejectConnectionRequest = async (connectionId: string): Promise<void> => {
//   try {
//     const connectionRef = doc(db, 'connections', connectionId);
//     await updateDoc(connectionRef, {
//       status: 'rejected',
//       respondedAt: serverTimestamp()
//     });
//   } catch (error) {
//     console.error('Error rejecting connection request:', error);
//     throw error;
//   }
// };

// /**
//  * Cancel a sent connection request
//  */
// export const cancelConnectionRequest = async (connectionId: string): Promise<void> => {
//   try {
//     const connectionRef = doc(db, 'connections', connectionId);
//     await updateDoc(connectionRef, {
//       status: 'cancelled',
//       cancelledAt: serverTimestamp()
//     });
//   } catch (error) {
//     console.error('Error cancelling connection request:', error);
//     throw error;
//   }
// };

// /**
//  * Get user connections with profile data
//  */
// export const getUserConnectionsWithProfiles = async (userId: string): Promise<ConnectionWithUser[]> => {
//   try {
//     const connections = await getUserConnections(userId);
//     const connectionsWithProfiles: ConnectionWithUser[] = [];
    
//     for (const connection of connections) {
//       const otherUserId = connection.fromUserId === userId ? connection.toUserId : connection.fromUserId;
//       const userDoc = await getDoc(doc(db, 'users', otherUserId));
      
//       if (userDoc.exists()) {
//         const userData = userDoc.data() as any;
        
//         connectionsWithProfiles.push({
//           ...connection,
//           otherUser: {
//             uid: userDoc.id,
//             displayName: userData.displayName || null,
//             email: userData.email || null,
//             headline: userData.headline || '',
//             bio: userData.bio || '',
//             skills: userData.skills || [],
//             location: userData.location || '',
//             profileImage: userData.profileImage || '',
//             projects: userData.projects || [],
//             education: userData.education || '',
//             experience: userData.experience || '',
//             website: userData.website || '',
//             github: userData.github || '',
//             linkedin: userData.linkedin || '',
//             createdAt: userData.createdAt
//           }
//         });
//       }
//     }
    
//     // Sort by most recent
//     connectionsWithProfiles.sort((a, b) => {
//       const dateA = a.createdAt?.toDate?.() || new Date(0);
//       const dateB = b.createdAt?.toDate?.() || new Date(0);
//       return dateB.getTime() - dateA.getTime();
//     });
    
//     return connectionsWithProfiles;
//   } catch (error) {
//     console.error('Error fetching connections with profiles:', error);
//     throw error;
//   }
// };

// /**
//  * Remove a connection (unfriend)
//  */
// export const removeConnection = async (connectionId: string): Promise<void> => {
//   try {
//     const connectionRef = doc(db, 'connections', connectionId);
//     await updateDoc(connectionRef, {
//       status: 'removed',
//       removedAt: serverTimestamp()
//     });
//   } catch (error) {
//     console.error('Error removing connection:', error);
//     throw error;
//   }
// };

// /**
//  * Delete a connection completely (admin only)
//  */
// export const deleteConnection = async (connectionId: string): Promise<void> => {
//   try {
//     const connectionRef = doc(db, 'connections', connectionId);
//     await deleteDoc(connectionRef);
//   } catch (error) {
//     console.error('Error deleting connection:', error);
//     throw error;
//   }
// };

// /**
//  * Get mutual connections between two users
//  */
// export const getMutualConnections = async (userId1: string, userId2: string): Promise<Connection[]> => {
//   try {
//     const [user1Connections, user2Connections] = await Promise.all([
//       getUserConnections(userId1),
//       getUserConnections(userId2)
//     ]);
    
//     const user1ConnectedIds = new Set<string>();
//     user1Connections.forEach(conn => {
//       const otherId = conn.fromUserId === userId1 ? conn.toUserId : conn.fromUserId;
//       if (otherId !== userId2) {
//         user1ConnectedIds.add(otherId);
//       }
//     });
    
//     const user2ConnectedIds = new Set<string>();
//     user2Connections.forEach(conn => {
//       const otherId = conn.fromUserId === userId2 ? conn.toUserId : conn.fromUserId;
//       if (otherId !== userId1) {
//         user2ConnectedIds.add(otherId);
//       }
//     });
    
//     const mutualIds = [...user1ConnectedIds].filter(id => user2ConnectedIds.has(id));
    
//     const mutualConnections: Connection[] = [];
    
//     for (const id of mutualIds) {
//       const connection = await getConnectionBetweenUsers(userId1, id);
//       if (connection) {
//         mutualConnections.push(connection);
//       }
//     }
    
//     return mutualConnections;
//   } catch (error) {
//     console.error('Error fetching mutual connections:', error);
//     return [];
//   }
// };

// /**
//  * Update connection note
//  */
// export const updateConnectionNote = async (connectionId: string, note: string): Promise<void> => {
//   try {
//     const connectionRef = doc(db, 'connections', connectionId);
//     await updateDoc(connectionRef, {
//       note: note,
//       updatedAt: serverTimestamp()
//     });
//   } catch (error) {
//     console.error('Error updating connection note:', error);
//     throw error;
//   }
// };

// /**
//  * Update connection tags
//  */
// export const updateConnectionTags = async (connectionId: string, tags: string[]): Promise<void> => {
//   try {
//     const connectionRef = doc(db, 'connections', connectionId);
//     await updateDoc(connectionRef, {
//       tags: tags,
//       updatedAt: serverTimestamp()
//     });
//   } catch (error) {
//     console.error('Error updating connection tags:', error);
//     throw error;
//   }
// };

// /**
//  * Bulk accept connection requests
//  */
// export const bulkAcceptConnectionRequests = async (connectionIds: string[]): Promise<void> => {
//   try {
//     const batch = writeBatch(db);
    
//     for (const connectionId of connectionIds) {
//       const connectionRef = doc(db, 'connections', connectionId);
//       batch.update(connectionRef, {
//         status: 'accepted',
//         respondedAt: serverTimestamp()
//       });
//     }
    
//     await batch.commit();
//   } catch (error) {
//     console.error('Error bulk accepting connection requests:', error);
//     throw error;
//   }
// };

// /**
//  * Bulk reject connection requests
//  */
// export const bulkRejectConnectionRequests = async (connectionIds: string[]): Promise<void> => {
//   try {
//     const batch = writeBatch(db);
    
//     for (const connectionId of connectionIds) {
//       const connectionRef = doc(db, 'connections', connectionId);
//       batch.update(connectionRef, {
//         status: 'rejected',
//         respondedAt: serverTimestamp()
//       });
//     }
    
//     await batch.commit();
//   } catch (error) {
//     console.error('Error bulk rejecting connection requests:', error);
//     throw error;
//   }
// };

// /**
//  * Get connection statistics for a user
//  */
// export const getConnectionStatistics = async (userId: string): Promise<{
//   totalConnections: number;
//   pendingReceived: number;
//   pendingSent: number;
//   mutualConnectionsAverage: number;
// }> => {
//   try {
//     const [
//       connections,
//       incomingRequests,
//       sentRequests
//     ] = await Promise.all([
//       getUserConnections(userId),
//       getIncomingConnectionRequests(userId),
//       getSentConnectionRequests(userId)
//     ]);
    
//     let totalMutual = 0;
//     for (const connection of connections) {
//       const otherUserId = connection.fromUserId === userId ? connection.toUserId : connection.fromUserId;
//       const mutual = await getMutualConnections(userId, otherUserId);
//       totalMutual += mutual.length;
//     }
    
//     const averageMutual = connections.length > 0 ? totalMutual / connections.length : 0;
    
//     return {
//       totalConnections: connections.length,
//       pendingReceived: incomingRequests.length,
//       pendingSent: sentRequests.length,
//       mutualConnectionsAverage: Math.round(averageMutual)
//     };
//   } catch (error) {
//     console.error('Error fetching connection statistics:', error);
//     return {
//       totalConnections: 0,
//       pendingReceived: 0,
//       pendingSent: 0,
//       mutualConnectionsAverage: 0
//     };
//   }
// };

// /**
//  * Get all connections involving a user (for network page optimization)
//  */
// export const getAllConnectionsForUser = async (userId: string): Promise<Record<string, Connection>> => {
//   try {
//     const q = query(
//       collection(db, 'connections'),
//       or(
//         where('fromUserId', '==', userId),
//         where('toUserId', '==', userId)
//       )
//     );
    
//     const querySnapshot = await getDocs(q);
//     const connectionsMap: Record<string, Connection> = {};
    
//     querySnapshot.forEach((doc) => {
//       const connection = { id: doc.id, ...doc.data() } as Connection;
//       const otherUserId = connection.fromUserId === userId ? connection.toUserId : connection.fromUserId;
//       connectionsMap[otherUserId] = connection;
//     });
    
//     return connectionsMap;
//   } catch (error) {
//     console.error('Error fetching all connections for user:', error);
//     return {};
//   }
// };

// /**
//  * Debug connection between two users
//  * This function logs detailed information about the connection between two users.
//  * Use it in the browser console: debugConnection('user1', 'user2')
//  */
// export const debugConnection = async (userId1: string, userId2: string): Promise<void> => {
//   console.log('=== DEBUG CONNECTION ===');
//   console.log('User IDs:', userId1, userId2);
  
//   const connectionId = getConnectionId(userId1, userId2);
//   console.log('Connection ID (sorted):', connectionId);
  
//   try {
//     const connection = await getConnectionBetweenUsers(userId1, userId2);
//     console.log('Connection document:', connection);
    
//     if (connection) {
//       console.log('Connection status:', connection.status);
//       console.log('Direction:', connection.fromUserId, '->', connection.toUserId);
      
//       // Check if the connection is accepted
//       const connected = await areUsersConnected(userId1, userId2);
//       console.log('areUsersConnected result:', connected);
      
//       // Check both directions in the connections collection
//       const q = query(
//         collection(db, 'connections'),
//         or(
//           and(where('fromUserId', '==', userId1), where('toUserId', '==', userId2)),
//           and(where('fromUserId', '==', userId2), where('toUserId', '==', userId1))
//         )
//       );
      
//       const querySnapshot = await getDocs(q);
//       console.log('All matching connection documents:');
//       querySnapshot.forEach((doc) => {
//         console.log('  ', doc.id, '=>', doc.data());
//       });
//     } else {
//       console.log('No connection document found.');
//     }
//   } catch (error) {
//     console.error('Error debugging connection:', error);
//   }
  
//   console.log('=== END DEBUG ===');
// };


import { db } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  deleteDoc,
  collection, 
  query, 
  where, 
  getDocs,
  writeBatch,
  serverTimestamp,
  or,
  and,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  Query
} from 'firebase/firestore';

// Helper: consistent connection ID
function getConnectionId(userId1: string, userId2: string): string {
  const [id1, id2] = [userId1, userId2].sort();
  return `${id1}_${id2}`;
}

// Snapshot of a user's basic profile (to avoid N+1)
export interface UserSnapshot {
  uid: string;
  displayName: string;
  headline: string;
  profileImage: string;
}

export interface Connection {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'removed' | 'cancelled';
  createdAt: any;
  respondedAt?: any;
  removedAt?: any;
  cancelledAt?: any;
  note?: string;
  tags?: string[];
  mutualConnections?: number;
  updatedAt?: any;
  fromUserSnapshot?: UserSnapshot;   // optional for legacy
  toUserSnapshot?: UserSnapshot;
}

// Full user profile (for compatibility)
export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  headline: string;
  bio: string;
  skills: string[];
  location: string;
  profileImage: string;
  projects: string[];
  education: string;
  experience: string;
  website: string;
  github: string;
  linkedin: string;
  createdAt?: any;
}

export interface ConnectionWithUser extends Connection {
  otherUser: UserProfile;
}

export interface IncomingRequest extends Connection {
  fromUser: UserProfile;
}

export interface SentRequest extends Connection {
  toUser: UserProfile;
}

// ========== Helper: fetch user snapshot ==========
const getUserSnapshot = async (userId: string): Promise<UserSnapshot> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) {
    return { uid: userId, displayName: 'Unknown User', headline: '', profileImage: '' };
  }
  const data = userDoc.data() as any;
  return {
    uid: userId,
    displayName: data.displayName || 'Unknown User',
    headline: data.headline || '',
    profileImage: data.profileImage || '',
  };
};

// ========== Send connection request (with snapshots) ==========
export const sendConnectionRequest = async (fromUserId: string, toUserId: string): Promise<string> => {
  const connectionId = getConnectionId(fromUserId, toUserId);
  const connectionRef = doc(db, 'connections', connectionId);
  const connectionSnap = await getDoc(connectionRef);

  if (connectionSnap.exists()) {
    const existing = connectionSnap.data() as Connection;
    if (existing.status === 'accepted') throw new Error('Already connected.');
    if (existing.status === 'pending') {
      if (existing.fromUserId === fromUserId && existing.toUserId === toUserId) {
        throw new Error('Request already pending.');
      } else if (existing.fromUserId === toUserId && existing.toUserId === fromUserId) {
        // Auto-accept
        await updateDoc(connectionRef, {
          status: 'accepted',
          respondedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        const notificationId = `${connectionId}_auto_accepted_${Date.now()}`;
        const notificationRef = doc(db, 'notifications', notificationId);
        await setDoc(notificationRef, {
          userId: toUserId,
          type: 'connection_accepted',
          fromUserId: fromUserId,
          fromUserName: existing.toUserSnapshot?.displayName || 'Someone',
          fromUserHeadline: existing.toUserSnapshot?.headline || '',
          fromUserImage: existing.toUserSnapshot?.profileImage || '',
          message: `${existing.toUserSnapshot?.displayName || 'Someone'} accepted your request`,
          read: false,
          connectionId,
          createdAt: serverTimestamp(),
        });
        return connectionId;
      }
    }
    if (['rejected', 'cancelled', 'removed'].includes(existing.status)) {
      await deleteDoc(connectionRef);
    }
  }

  // Fetch snapshots (2 reads)
  const [fromSnapshot, toSnapshot] = await Promise.all([
    getUserSnapshot(fromUserId),
    getUserSnapshot(toUserId)
  ]);

  await setDoc(connectionRef, {
    fromUserId,
    toUserId,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    fromUserSnapshot: fromSnapshot,
    toUserSnapshot: toSnapshot,
    mutualConnections: 0,
  });

  // Notification using snapshots
  const notificationId = `${fromUserId}_${toUserId}_request_${Date.now()}`;
  const notificationRef = doc(db, 'notifications', notificationId);
  await setDoc(notificationRef, {
    userId: toUserId,
    type: 'connection_request',
    fromUserId,
    fromUserName: fromSnapshot.displayName,
    fromUserHeadline: fromSnapshot.headline,
    fromUserImage: fromSnapshot.profileImage,
    message: `${fromSnapshot.displayName} wants to connect`,
    read: false,
    connectionId,
    mutualConnections: 0,
    createdAt: serverTimestamp(),
  });

  return connectionId;
};

// ========== Get connection between two users ==========
export const getConnectionBetweenUsers = async (userId1: string, userId2: string): Promise<Connection | null> => {
  if (userId1 === userId2) return null;
  const connId = getConnectionId(userId1, userId2);
  const snap = await getDoc(doc(db, 'connections', connId));
  return snap.exists() ? { id: snap.id, ...snap.data() } as Connection : null;
};

// ========== Optimized: single query ==========
export const areUsersConnected = async (userId1: string, userId2: string): Promise<boolean> => {
  if (userId1 === userId2) return false;
  const conn = await getConnectionBetweenUsers(userId1, userId2);
  return conn?.status === 'accepted';
};

// ========== Get accepted connections (with optional pagination) ==========
export const getUserConnections = async (
  userId: string,
  pageSize: number = 20,
  lastDoc?: QueryDocumentSnapshot
): Promise<{ connections: Connection[]; lastDoc: QueryDocumentSnapshot | null }> => {
  try {
    let q: Query = query(
      collection(db, 'connections'),
      or(
        and(where('fromUserId', '==', userId), where('status', '==', 'accepted')),
        and(where('toUserId', '==', userId), where('status', '==', 'accepted'))
      ),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    const snapshot = await getDocs(q);
    const connections = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Connection));
    const newLastDoc = snapshot.docs.length === pageSize ? snapshot.docs[snapshot.docs.length - 1] : null;
    return { connections, lastDoc: newLastDoc };
  } catch (error) {
    console.error('Error fetching user connections:', error);
    throw error;
  }
};

// ========== Incoming requests with pagination & orderBy ==========
export const getIncomingConnectionRequests = async (
  userId: string,
  pageSize: number = 20,
  lastDoc?: QueryDocumentSnapshot
): Promise<{ requests: IncomingRequest[]; lastDoc: QueryDocumentSnapshot | null }> => {
  try {
    let q: Query = query(
      collection(db, 'connections'),
      where('toUserId', '==', userId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    if (lastDoc) q = query(q, startAfter(lastDoc));
    const snapshot = await getDocs(q);
    const requests: IncomingRequest[] = [];

    for (const docSnap of snapshot.docs) {
      const connection = { id: docSnap.id, ...docSnap.data() } as Connection;
      let fromUser: UserProfile;
      if (connection.fromUserSnapshot) {
        fromUser = {
          uid: connection.fromUserSnapshot.uid,
          displayName: connection.fromUserSnapshot.displayName,
          email: null,
          headline: connection.fromUserSnapshot.headline,
          bio: '', skills: [], location: '', profileImage: connection.fromUserSnapshot.profileImage,
          projects: [], education: '', experience: '', website: '', github: '', linkedin: '', createdAt: null
        };
      } else {
        console.warn(`Legacy connection ${connection.id} missing snapshot`);
        const userDoc = await getDoc(doc(db, 'users', connection.fromUserId));
        const data = userDoc.data() as any;
        fromUser = {
          uid: connection.fromUserId,
          displayName: data?.displayName || 'Unknown',
          email: null,
          headline: data?.headline || '',
          bio: '', skills: [], location: '', profileImage: data?.profileImage || '',
          projects: [], education: '', experience: '', website: '', github: '', linkedin: '', createdAt: null
        };
      }
      requests.push({ ...connection, fromUser });
    }
    const newLastDoc = snapshot.docs.length === pageSize ? snapshot.docs[snapshot.docs.length - 1] : null;
    return { requests, lastDoc: newLastDoc };
  } catch (error) {
    console.error('Error fetching incoming requests:', error);
    throw error;
  }
};

// ========== Sent requests with pagination & orderBy ==========
export const getSentConnectionRequests = async (
  userId: string,
  pageSize: number = 20,
  lastDoc?: QueryDocumentSnapshot
): Promise<{ requests: SentRequest[]; lastDoc: QueryDocumentSnapshot | null }> => {
  try {
    let q: Query = query(
      collection(db, 'connections'),
      where('fromUserId', '==', userId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    if (lastDoc) q = query(q, startAfter(lastDoc));
    const snapshot = await getDocs(q);
    const requests: SentRequest[] = [];

    for (const docSnap of snapshot.docs) {
      const connection = { id: docSnap.id, ...docSnap.data() } as Connection;
      let toUser: UserProfile;
      if (connection.toUserSnapshot) {
        toUser = {
          uid: connection.toUserSnapshot.uid,
          displayName: connection.toUserSnapshot.displayName,
          email: null,
          headline: connection.toUserSnapshot.headline,
          bio: '', skills: [], location: '', profileImage: connection.toUserSnapshot.profileImage,
          projects: [], education: '', experience: '', website: '', github: '', linkedin: '', createdAt: null
        };
      } else {
        console.warn(`Legacy connection ${connection.id} missing snapshot`);
        const userDoc = await getDoc(doc(db, 'users', connection.toUserId));
        const data = userDoc.data() as any;
        toUser = {
          uid: connection.toUserId,
          displayName: data?.displayName || 'Unknown',
          email: null,
          headline: data?.headline || '',
          bio: '', skills: [], location: '', profileImage: data?.profileImage || '',
          projects: [], education: '', experience: '', website: '', github: '', linkedin: '', createdAt: null
        };
      }
      requests.push({ ...connection, toUser });
    }
    const newLastDoc = snapshot.docs.length === pageSize ? snapshot.docs[snapshot.docs.length - 1] : null;
    return { requests, lastDoc: newLastDoc };
  } catch (error) {
    console.error('Error fetching sent requests:', error);
    throw error;
  }
};

// ========== Connections with profiles (using snapshots, no N+1) ==========
export const getUserConnectionsWithProfiles = async (
  userId: string,
  pageSize: number = 20,
  lastDoc?: QueryDocumentSnapshot
): Promise<{ connections: ConnectionWithUser[]; lastDoc: QueryDocumentSnapshot | null }> => {
  try {
    const { connections, lastDoc: newLastDoc } = await getUserConnections(userId, pageSize, lastDoc);
    const result: ConnectionWithUser[] = [];

    for (const connection of connections) {
      const isFromUser = connection.fromUserId === userId;
      const snapshot = isFromUser ? connection.toUserSnapshot : connection.fromUserSnapshot;
      let otherUserProfile: UserProfile;

      if (snapshot && snapshot.uid) {
        otherUserProfile = {
          uid: snapshot.uid,
          displayName: snapshot.displayName,
          email: null,
          headline: snapshot.headline,
          bio: '', skills: [], location: '', profileImage: snapshot.profileImage,
          projects: [], education: '', experience: '', website: '', github: '', linkedin: '', createdAt: null
        };
      } else {
        const otherUserId = isFromUser ? connection.toUserId : connection.fromUserId;
        console.warn(`Legacy connection ${connection.id} missing snapshot, fetching user ${otherUserId}`);
        const userDoc = await getDoc(doc(db, 'users', otherUserId));
        const data = userDoc.data() as any;
        otherUserProfile = {
          uid: otherUserId,
          displayName: data?.displayName || 'Unknown',
          email: null,
          headline: data?.headline || '',
          bio: '', skills: [], location: '', profileImage: data?.profileImage || '',
          projects: [], education: '', experience: '', website: '', github: '', linkedin: '', createdAt: null
        };
      }
      result.push({ ...connection, otherUser: otherUserProfile });
    }
    return { connections: result, lastDoc: newLastDoc };
  } catch (error) {
    console.error('Error fetching connections with profiles:', error);
    throw error;
  }
};

// ========== Accept request ==========
export const acceptConnectionRequest = async (connectionId: string): Promise<void> => {
  const connectionRef = doc(db, 'connections', connectionId);
  const snap = await getDoc(connectionRef);
  if (!snap.exists()) throw new Error('Connection not found.');
  const connection = snap.data() as Connection;
  await updateDoc(connectionRef, {
    status: 'accepted',
    respondedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  const notificationRef = doc(db, 'notifications', `${connectionId}_accepted_${Date.now()}`);
  await setDoc(notificationRef, {
    userId: connection.fromUserId,
    type: 'connection_accepted',
    fromUserId: connection.toUserId,
    fromUserName: connection.toUserSnapshot?.displayName || 'Someone',
    fromUserHeadline: connection.toUserSnapshot?.headline || '',
    fromUserImage: connection.toUserSnapshot?.profileImage || '',
    message: `${connection.toUserSnapshot?.displayName || 'Someone'} accepted your request`,
    read: false,
    connectionId,
    createdAt: serverTimestamp(),
  });
};

// ========== Reject request ==========
export const rejectConnectionRequest = async (connectionId: string): Promise<void> => {
  await updateDoc(doc(db, 'connections', connectionId), {
    status: 'rejected',
    respondedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

// ========== Cancel sent request ==========
export const cancelConnectionRequest = async (connectionId: string): Promise<void> => {
  await updateDoc(doc(db, 'connections', connectionId), {
    status: 'cancelled',
    cancelledAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

// ========== Remove connection ==========
export const removeConnection = async (connectionId: string): Promise<void> => {
  await updateDoc(doc(db, 'connections', connectionId), {
    status: 'removed',
    removedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

// ========== Delete connection (admin) ==========
export const deleteConnection = async (connectionId: string): Promise<void> => {
  await deleteDoc(doc(db, 'connections', connectionId));
};

// ========== Optimized: getAllConnectionsForUser (only pending/accepted) ==========
export const getAllConnectionsForUser = async (userId: string): Promise<Record<string, Connection>> => {
  try {
    const q = query(
      collection(db, 'connections'),
      or(
        and(where('fromUserId', '==', userId), where('status', 'in', ['pending', 'accepted'])),
        and(where('toUserId', '==', userId), where('status', 'in', ['pending', 'accepted']))
      )
    );
    const snapshot = await getDocs(q);
    const map: Record<string, Connection> = {};
    snapshot.forEach(doc => {
      const conn = { id: doc.id, ...doc.data() } as Connection;
      const otherId = conn.fromUserId === userId ? conn.toUserId : conn.fromUserId;
      map[otherId] = conn;
    });
    return map;
  } catch (error) {
    console.error('Error fetching all connections for user:', error);
    return {};
  }
};

// ========== Mutual connections (simplified, not used in critical paths) ==========
export const getMutualConnections = async (userId1: string, userId2: string): Promise<Connection[]> => {
  try {
    const [conns1, conns2] = await Promise.all([
      getUserConnections(userId1, 1000), // large limit, but avoid in loops
      getUserConnections(userId2, 1000)
    ]);
    const set1 = new Set(conns1.connections.map(c => c.fromUserId === userId1 ? c.toUserId : c.fromUserId));
    const mutualIds = conns2.connections
      .map(c => c.fromUserId === userId2 ? c.toUserId : c.fromUserId)
      .filter(id => set1.has(id) && id !== userId1 && id !== userId2);
    const mutual: Connection[] = [];
    for (const id of mutualIds) {
      const conn = await getConnectionBetweenUsers(userId1, id);
      if (conn) mutual.push(conn);
    }
    return mutual;
  } catch (error) {
    console.error('Error fetching mutual connections:', error);
    return [];
  }
};

// ========== Update note/tags ==========
export const updateConnectionNote = async (connectionId: string, note: string): Promise<void> => {
  await updateDoc(doc(db, 'connections', connectionId), { note, updatedAt: serverTimestamp() });
};
export const updateConnectionTags = async (connectionId: string, tags: string[]): Promise<void> => {
  await updateDoc(doc(db, 'connections', connectionId), { tags, updatedAt: serverTimestamp() });
};

// ========== Bulk actions ==========
export const bulkAcceptConnectionRequests = async (connectionIds: string[]): Promise<void> => {
  const batch = writeBatch(db);
  for (const id of connectionIds) {
    batch.update(doc(db, 'connections', id), { status: 'accepted', respondedAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }
  await batch.commit();
};
export const bulkRejectConnectionRequests = async (connectionIds: string[]): Promise<void> => {
  const batch = writeBatch(db);
  for (const id of connectionIds) {
    batch.update(doc(db, 'connections', id), { status: 'rejected', respondedAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }
  await batch.commit();
};

// ========== Statistics (simplified, no extra reads) ==========
export const getConnectionStatistics = async (userId: string): Promise<{
  totalConnections: number;
  pendingReceived: number;
  pendingSent: number;
  mutualConnectionsAverage: number;
}> => {
  try {
    const { connections } = await getUserConnections(userId, 1000);
    const { requests: incoming } = await getIncomingConnectionRequests(userId, 1000);
    const { requests: sent } = await getSentConnectionRequests(userId, 1000);
    return {
      totalConnections: connections.length,
      pendingReceived: incoming.length,
      pendingSent: sent.length,
      mutualConnectionsAverage: 0, // can be computed by cloud function later
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { totalConnections: 0, pendingReceived: 0, pendingSent: 0, mutualConnectionsAverage: 0 };
  }
};

// ========== Debug ==========
export const debugConnection = async (userId1: string, userId2: string): Promise<void> => {
  console.log('=== DEBUG ===');
  const conn = await getConnectionBetweenUsers(userId1, userId2);
  console.log('Connection:', conn);
  console.log('Connected:', await areUsersConnected(userId1, userId2));
  console.log('=== END ===');
};