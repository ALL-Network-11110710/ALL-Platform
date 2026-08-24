// // /lib/referralMessaging.ts
// import { auth, db } from './firebase';
// import { 
//   collection, 
//   addDoc, 
//   serverTimestamp,
//   query,
//   where,
//   orderBy,
//   onSnapshot,
//   getDocs,
//   doc,
//   setDoc
// } from 'firebase/firestore';

// // Create a referral conversation ID that includes the job ID
// export const createReferralConversationId = (
//   jobId: string, 
//   userId1: string, 
//   userId2: string
// ): string => {
//   const sortedIds = [userId1, userId2].sort();
//   return `referral_${jobId}_${sortedIds[0]}_${sortedIds[1]}`;
// };

// // Start or get a referral conversation
// export const startReferralConversation = async (
//   jobId: string,
//   jobTitle: string,
//   companyName: string,
//   employeeId: string,
//   jobSeekerId: string,
//   jobSeekerName: string
// ): Promise<string> => {
//   try {
//     console.log('Starting referral conversation for job:', jobId);
    
//     // Create referral-specific conversation ID
//     const conversationId = createReferralConversationId(jobId, jobSeekerId, employeeId);
    
//     console.log('Generated referral conversation ID:', conversationId);
    
//     // Check if conversation already exists
//     const conversationsRef = collection(db, 'referralConversations');
//     const q = query(conversationsRef, where('conversationId', '==', conversationId));
//     const querySnapshot = await getDocs(q);
    
//     if (querySnapshot.empty) {
//       // Create new referral conversation document
//       await addDoc(collection(db, 'referralConversations'), {
//         conversationId,
//         jobId,
//         jobTitle,
//         companyName,
//         employeeId,
//         jobSeekerId,
//         jobSeekerName,
//         createdAt: serverTimestamp(),
//         lastMessageAt: serverTimestamp(),
//         unreadCount: 0,
//         participants: [employeeId, jobSeekerId],
//         isActive: true
//       });
      
//       console.log('Created new referral conversation:', conversationId);
//     } else {
//       console.log('Referral conversation already exists:', conversationId);
//     }
    
//     // Create notification for the employee
//     const notificationRef = doc(collection(db, 'notifications'));
//     await setDoc(notificationRef, {
//       userId: employeeId,
//       type: 'new_referral_message',
//       title: 'New Referral Inquiry',
//       message: `${jobSeekerName} is interested in the ${jobTitle} position at ${companyName}`,
//       read: false,
//       createdAt: serverTimestamp(),
//       conversationId,
//       jobId,
//       redirectTo: `/referral/marketplace?job=${jobId}&conversation=${conversationId}`
//     });
    
//     return conversationId;
    
//   } catch (error) {
//     console.error('Error starting referral conversation:', error);
//     throw error;
//   }
// };

// // Send a referral message
// export const sendReferralMessage = async (
//   conversationId: string,
//   senderId: string,
//   receiverId: string,
//   jobId: string,
//   content: string
// ): Promise<string> => {
//   try {
//     const messageData = {
//       conversationId,
//       senderId,
//       receiverId,
//       jobId,
//       content,
//       isReferral: true,
//       createdAt: serverTimestamp(),
//       read: false,
//       type: 'referral'
//     };

//     // Add message to messages collection with referral flag
//     const docRef = await addDoc(collection(db, 'messages'), messageData);
    
//     // Update last message time in referral conversation
//     const conversationsRef = collection(db, 'referralConversations');
//     const q = query(conversationsRef, where('conversationId', '==', conversationId));
//     const querySnapshot = await getDocs(q);
    
//     if (!querySnapshot.empty) {
//       const conversationDoc = querySnapshot.docs[0];
//       await setDoc(doc(db, 'referralConversations', conversationDoc.id), {
//         lastMessageAt: serverTimestamp()
//       }, { merge: true });
//     }
    
//     return docRef.id;
//   } catch (error) {
//     console.error('Error sending referral message:', error);
//     throw error;
//   }
// };

// // Get all referral conversations for a user
// export const getUserReferralConversations = async (userId: string) => {
//   try {
//     const conversationsRef = collection(db, 'referralConversations');
//     const q = query(
//       conversationsRef,
//       where('participants', 'array-contains', userId),
//       orderBy('lastMessageAt', 'desc')
//     );
    
//     const querySnapshot = await getDocs(q);
//     const conversations: any[] = [];
    
//     querySnapshot.forEach((doc) => {
//       conversations.push({ id: doc.id, ...doc.data() });
//     });
    
//     return conversations;
//   } catch (error) {
//     console.error('Error fetching referral conversations:', error);
//     return [];
//   }
// };

// // Get messages for a specific referral conversation
// export const getReferralMessages = (
//   conversationId: string,
//   callback: (messages: any[]) => void
// ) => {
//   const messagesRef = collection(db, 'messages');
//   const q = query(
//     messagesRef,
//     where('conversationId', '==', conversationId),
//     where('isReferral', '==', true),
//     orderBy('createdAt', 'asc')
//   );
  
//   return onSnapshot(q, (querySnapshot) => {
//     const messages: any[] = [];
//     querySnapshot.forEach((doc) => {
//       messages.push({ id: doc.id, ...doc.data() });
//     });
//     callback(messages);
//   });
// };

// /lib/referralMessaging.ts --------------------   working one 
// import { auth, db } from './firebase';
// import { 
//   collection, 
//   addDoc, 
//   serverTimestamp,
//   query,
//   where,
//   orderBy,
//   onSnapshot,
//   getDocs,
//   doc,
//   getDoc,
//   setDoc
// } from 'firebase/firestore';

// // Create a UNIQUE conversation ID for each employee-jobSeeker pair for a specific job
// export const createReferralConversationId = (
//   jobId: string, 
//   employeeId: string,
//   jobSeekerId: string
// ): string => {
//   // Sort IDs to ensure consistency, but include both IDs to make it unique per pair
//   return `referral_${jobId}_${employeeId}_${jobSeekerId}`;
// };

// // Get employee name from user document
// export const getEmployeeName = async (employeeId: string): Promise<string> => {
//   try {
//     const userDoc = await getDoc(doc(db, 'users', employeeId));
//     if (userDoc.exists()) {
//       const userData = userDoc.data();
//       return userData.displayName || userData.name || userData.email || 'Employee';
//     }
//     return 'Employee';
//   } catch (error) {
//     console.error('Error fetching employee name:', error);
//     return 'Employee';
//   }
// };

// // Get job seeker name from user document
// export const getJobSeekerName = async (jobSeekerId: string): Promise<string> => {
//   try {
//     const userDoc = await getDoc(doc(db, 'users', jobSeekerId));
//     if (userDoc.exists()) {
//       const userData = userDoc.data();
//       return userData.displayName || userData.name || userData.email || 'Job Seeker';
//     }
//     return 'Job Seeker';
//   } catch (error) {
//     console.error('Error fetching job seeker name:', error);
//     return 'Job Seeker';
//   }
// };

// // Start or get a referral conversation - FIXED: Creates unique conversation per user pair
// export const startReferralConversation = async (
//   jobId: string,
//   jobTitle: string,
//   companyName: string,
//   employeeId: string,
//   jobSeekerId: string
// ): Promise<string> => {
//   try {
//     console.log('Starting referral conversation for job:', jobId);
//     console.log('Employee ID:', employeeId);
//     console.log('Job Seeker ID:', jobSeekerId);
    
//     // Get both user names
//     const employeeName = await getEmployeeName(employeeId);
//     const jobSeekerName = await getJobSeekerName(jobSeekerId);
    
//     // Create UNIQUE conversation ID for this specific pair
//     const conversationId = createReferralConversationId(jobId, employeeId, jobSeekerId);
    
//     console.log('Generated UNIQUE referral conversation ID:', conversationId);
//     console.log('Employee Name:', employeeName);
//     console.log('Job Seeker Name:', jobSeekerName);
    
//     // Check if conversation already exists in referralConversations collection
//     const conversationsRef = collection(db, 'referralConversations');
//     const q = query(conversationsRef, where('conversationId', '==', conversationId));
//     const querySnapshot = await getDocs(q);
    
//     if (querySnapshot.empty) {
//       // Create new referral conversation document
//       await addDoc(collection(db, 'referralConversations'), {
//         conversationId,
//         jobId,
//         jobTitle,
//         companyName,
//         employeeId,
//         employeeName,
//         jobSeekerId,
//         jobSeekerName,
//         createdAt: serverTimestamp(),
//         lastMessageAt: serverTimestamp(),
//         lastMessage: 'Conversation started',
//         unreadCount: 0,
//         participants: [employeeId, jobSeekerId],
//         isActive: true,
//         // Additional metadata
//         employeeHasUnread: false,
//         jobSeekerHasUnread: true, // Employee needs to see the notification
//         messageCount: 0
//       });
      
//       console.log('Created NEW referral conversation:', conversationId);
      
//       // Create notification for the employee
//       const notificationRef = doc(collection(db, 'notifications'));
//       await setDoc(notificationRef, {
//         userId: employeeId,
//         type: 'new_referral_conversation',
//         title: 'New Job Inquiry',
//         message: `${jobSeekerName} is interested in the ${jobTitle} position at ${companyName}`,
//         read: false,
//         createdAt: serverTimestamp(),
//         conversationId,
//         jobId,
//         jobTitle,
//         companyName,
//         jobSeekerId,
//         jobSeekerName,
//         redirectTo: `/referral/marketplace?job=${jobId}&conversation=${conversationId}`
//       });
      
//       console.log('Notification created for employee');
//     } else {
//       console.log('Conversation already exists:', conversationId);
      
//       // Update last activity time
//       const conversationDoc = querySnapshot.docs[0];
//       await setDoc(doc(db, 'referralConversations', conversationDoc.id), {
//         lastMessageAt: serverTimestamp(),
//         isActive: true
//       }, { merge: true });
//     }
    
//     return conversationId;
    
//   } catch (error) {
//     console.error('Error starting referral conversation:', error);
//     throw error;
//   }
// };

// // Send a referral message - FIXED: Messages go to specific conversation
// export const sendReferralMessage = async (
//   conversationId: string,
//   senderId: string,
//   content: string
// ): Promise<string> => {
//   try {
//     console.log('Sending referral message to conversation:', conversationId);
    
//     // Get the conversation to find participants
//     const conversationsRef = collection(db, 'referralConversations');
//     const q = query(conversationsRef, where('conversationId', '==', conversationId));
//     const querySnapshot = await getDocs(q);
    
//     if (querySnapshot.empty) {
//       throw new Error('Conversation not found');
//     }
    
//     const conversationDoc = querySnapshot.docs[0];
//     const conversationData = conversationDoc.data();
    
//     // Determine receiver ID
//     const receiverId = conversationData.participants.find((id: string) => id !== senderId);
    
//     if (!receiverId) {
//       throw new Error('Receiver not found in conversation');
//     }
    
//     // Create message data
//     const messageData = {
//       conversationId,
//       senderId,
//       receiverId,
//       content,
//       isReferral: true,
//       createdAt: serverTimestamp(),
//       read: false,
//       type: 'referral',
//       // Additional metadata
//       senderName: senderId === conversationData.employeeId ? conversationData.employeeName : conversationData.jobSeekerName,
//       receiverName: receiverId === conversationData.employeeId ? conversationData.employeeName : conversationData.jobSeekerName,
//       jobId: conversationData.jobId,
//       jobTitle: conversationData.jobTitle
//     };

//     // Add message to messages collection
//     const docRef = await addDoc(collection(db, 'messages'), messageData);
    
//     // Update conversation metadata
//     await setDoc(doc(db, 'referralConversations', conversationDoc.id), {
//       lastMessageAt: serverTimestamp(),
//       lastMessage: content.length > 50 ? content.substring(0, 50) + '...' : content,
//       unreadCount: conversationData.unreadCount + 1,
//       [`${receiverId}HasUnread`]: true,
//       messageCount: (conversationData.messageCount || 0) + 1
//     }, { merge: true });
    
//     // Create notification for receiver
//     const senderName = senderId === conversationData.employeeId ? conversationData.employeeName : conversationData.jobSeekerName;
//     const notificationRef = doc(collection(db, 'notifications'));
//     await setDoc(notificationRef, {
//       userId: receiverId,
//       type: 'new_message',
//       title: 'New Message',
//       message: `${senderName}: ${content.length > 100 ? content.substring(0, 100) + '...' : content}`,
//       read: false,
//       createdAt: serverTimestamp(),
//       conversationId,
//       jobId: conversationData.jobId,
//       jobTitle: conversationData.jobTitle,
//       senderId,
//       senderName
//     });
    
//     console.log('Message sent and notification created');
//     return docRef.id;
    
//   } catch (error) {
//     console.error('Error sending referral message:', error);
//     throw error;
//   }
// };

// // Get all referral conversations for a user
// export const getUserReferralConversations = async (userId: string) => {
//   try {
//     const conversationsRef = collection(db, 'referralConversations');
//     const q = query(
//       conversationsRef,
//       where('participants', 'array-contains', userId),
//       orderBy('lastMessageAt', 'desc')
//     );
    
//     const querySnapshot = await getDocs(q);
//     const conversations: any[] = [];
    
//     querySnapshot.forEach((doc) => {
//       conversations.push({ 
//         id: doc.id, 
//         ...doc.data(),
//         // Calculate unread count for this user
//         myUnreadCount: doc.data()[`${userId}HasUnread`] ? 1 : 0
//       });
//     });
    
//     console.log(`Found ${conversations.length} conversations for user ${userId}`);
//     return conversations;
//   } catch (error) {
//     console.error('Error fetching referral conversations:', error);
//     return [];
//   }
// };

// // Get conversations for a specific job
// export const getJobReferralConversations = async (jobId: string, userId: string) => {
//   try {
//     const conversationsRef = collection(db, 'referralConversations');
//     const q = query(
//       conversationsRef,
//       where('jobId', '==', jobId),
//       where('participants', 'array-contains', userId),
//       orderBy('lastMessageAt', 'desc')
//     );
    
//     const querySnapshot = await getDocs(q);
//     const conversations: any[] = [];
    
//     querySnapshot.forEach((doc) => {
//       conversations.push({ 
//         id: doc.id, 
//         ...doc.data(),
//         // Calculate unread count for this user
//         myUnreadCount: doc.data()[`${userId}HasUnread`] ? 1 : 0
//       });
//     });
    
//     console.log(`Found ${conversations.length} conversations for job ${jobId}`);
//     return conversations;
//   } catch (error) {
//     console.error('Error fetching job conversations:', error);
//     return [];
//   }
// };

// // Get messages for a specific referral conversation
// export const getReferralMessages = (
//   conversationId: string,
//   callback: (messages: any[]) => void
// ) => {
//   const messagesRef = collection(db, 'messages');
//   const q = query(
//     messagesRef,
//     where('conversationId', '==', conversationId),
//     where('isReferral', '==', true),
//     orderBy('createdAt', 'asc')
//   );
  
//   return onSnapshot(q, (querySnapshot) => {
//     const messages: any[] = [];
//     querySnapshot.forEach((doc) => {
//       messages.push({ id: doc.id, ...doc.data() });
//     });
//     callback(messages);
//   });
// };

// // Mark conversation as read
// export const markConversationAsRead = async (conversationId: string, userId: string) => {
//   try {
//     const conversationsRef = collection(db, 'referralConversations');
//     const q = query(conversationsRef, where('conversationId', '==', conversationId));
//     const querySnapshot = await getDocs(q);
    
//     if (!querySnapshot.empty) {
//       const conversationDoc = querySnapshot.docs[0];
//       await setDoc(doc(db, 'referralConversations', conversationDoc.id), {
//         [`${userId}HasUnread`]: false,
//         unreadCount: 0
//       }, { merge: true });
      
//       console.log(`Marked conversation ${conversationId} as read for user ${userId}`);
//     }
//   } catch (error) {
//     console.error('Error marking conversation as read:', error);
//   }
// };




// ----------------------------------- working one ------------------

// import { auth, db } from './firebase';
// import { 
//   collection, 
//   addDoc, 
//   serverTimestamp,
//   query,
//   where,
//   orderBy,
//   onSnapshot,
//   getDocs,
//   doc,
//   getDoc,
//   setDoc,
//   Timestamp,
//   DocumentData
// } from 'firebase/firestore';

// // Define interfaces for type safety
// export interface ReferralConversation {
//   id: string;
//   conversationId: string;
//   jobId: string;
//   jobTitle: string;
//   companyName: string;
//   employeeId: string;
//   employeeName: string;
//   jobSeekerId: string;
//   jobSeekerName: string;
//   lastMessageAt: Timestamp | null;
//   lastMessage: string;
//   myUnreadCount: number;
//   createdAt: Timestamp | null;
//   messageCount: number;
//   participants: string[];
//   isActive: boolean;
//   employeeHasUnread?: boolean;
//   jobSeekerHasUnread?: boolean;
//   unreadCount?: number;
// }

// export interface Message {
//   id: string;
//   conversationId: string;
//   senderId: string;
//   senderName: string;
//   receiverId: string;
//   receiverName: string;
//   content: string;
//   createdAt: Timestamp | null;
//   read: boolean;
//   isReferral: boolean;
//   jobId: string;
//   jobTitle: string;
//   delivered?: boolean;
// }

// // Create a UNIQUE conversation ID for each employee-jobSeeker pair for a specific job
// export const createReferralConversationId = (
//   jobId: string, 
//   employeeId: string,
//   jobSeekerId: string
// ): string => {
//   return `referral_${jobId}_${employeeId}_${jobSeekerId}`;
// };

// // Get employee name from user document
// export const getEmployeeName = async (employeeId: string): Promise<string> => {
//   try {
//     const userDoc = await getDoc(doc(db, 'users', employeeId));
//     if (userDoc.exists()) {
//       const userData = userDoc.data();
//       return userData.displayName || userData.name || userData.email || 'Employee';
//     }
//     return 'Employee';
//   } catch (error) {
//     console.error('Error fetching employee name:', error);
//     return 'Employee';
//   }
// };

// // Get job seeker name from user document
// export const getJobSeekerName = async (jobSeekerId: string): Promise<string> => {
//   try {
//     const userDoc = await getDoc(doc(db, 'users', jobSeekerId));
//     if (userDoc.exists()) {
//       const userData = userDoc.data();
//       return userData.displayName || userData.name || userData.email || 'Job Seeker';
//     }
//     return 'Job Seeker';
//   } catch (error) {
//     console.error('Error fetching job seeker name:', error);
//     return 'Job Seeker';
//   }
// };

// // Start or get a referral conversation
// export const startReferralConversation = async (
//   jobId: string,
//   jobTitle: string,
//   companyName: string,
//   employeeId: string,
//   jobSeekerId: string
// ): Promise<string> => {
//   try {
//     console.log('Starting referral conversation for job:', jobId);
    
//     // Get both user names
//     const employeeName = await getEmployeeName(employeeId);
//     const jobSeekerName = await getJobSeekerName(jobSeekerId);
    
//     // Create UNIQUE conversation ID for this specific pair
//     const conversationId = createReferralConversationId(jobId, employeeId, jobSeekerId);
    
//     console.log('Generated UNIQUE referral conversation ID:', conversationId);
    
//     // Check if conversation already exists in referralConversations collection
//     const conversationsRef = collection(db, 'referralConversations');
//     const q = query(conversationsRef, where('conversationId', '==', conversationId));
//     const querySnapshot = await getDocs(q);
    
//     if (querySnapshot.empty) {
//       // Create new referral conversation document
//       await addDoc(collection(db, 'referralConversations'), {
//         conversationId,
//         jobId,
//         jobTitle,
//         companyName,
//         employeeId,
//         employeeName,
//         jobSeekerId,
//         jobSeekerName,
//         createdAt: serverTimestamp(),
//         lastMessageAt: serverTimestamp(),
//         lastMessage: 'Conversation started',
//         unreadCount: 0,
//         participants: [employeeId, jobSeekerId],
//         isActive: true,
//         employeeHasUnread: false,
//         jobSeekerHasUnread: true,
//         messageCount: 0
//       });
      
//       console.log('Created NEW referral conversation:', conversationId);
      
//       // Create notification for the employee
//       const notificationRef = doc(collection(db, 'notifications'));
//       await setDoc(notificationRef, {
//         userId: employeeId,
//         type: 'new_referral_conversation',
//         title: 'New Job Inquiry',
//         message: `${jobSeekerName} is interested in the ${jobTitle} position at ${companyName}`,
//         read: false,
//         createdAt: serverTimestamp(),
//         conversationId,
//         jobId,
//         jobTitle,
//         companyName,
//         jobSeekerId,
//         jobSeekerName,
//         redirectTo: `/referral/marketplace?job=${jobId}&conversation=${conversationId}`
//       });
      
//       console.log('Notification created for employee');
//     } else {
//       console.log('Conversation already exists:', conversationId);
      
//       // Update last activity time
//       const conversationDoc = querySnapshot.docs[0];
//       await setDoc(doc(db, 'referralConversations', conversationDoc.id), {
//         lastMessageAt: serverTimestamp(),
//         isActive: true
//       }, { merge: true });
//     }
    
//     return conversationId;
    
//   } catch (error) {
//     console.error('Error starting referral conversation:', error);
//     throw error;
//   }
// };

// // Send a referral message
// export const sendReferralMessage = async (
//   conversationId: string,
//   senderId: string,
//   content: string
// ): Promise<string> => {
//   try {
//     console.log('Sending referral message to conversation:', conversationId);
    
//     // Get the conversation to find participants
//     const conversationsRef = collection(db, 'referralConversations');
//     const q = query(conversationsRef, where('conversationId', '==', conversationId));
//     const querySnapshot = await getDocs(q);
    
//     if (querySnapshot.empty) {
//       throw new Error('Conversation not found');
//     }
    
//     const conversationDoc = querySnapshot.docs[0];
//     const conversationData = conversationDoc.data();
    
//     // Determine receiver ID
//     const receiverId = conversationData.participants.find((id: string) => id !== senderId);
    
//     if (!receiverId) {
//       throw new Error('Receiver not found in conversation');
//     }
    
//     // Get sender and receiver names
//     const senderName = senderId === conversationData.employeeId ? conversationData.employeeName : conversationData.jobSeekerName;
//     const receiverName = receiverId === conversationData.employeeId ? conversationData.employeeName : conversationData.jobSeekerName;
    
//     // Create message data
//     const messageData = {
//       conversationId,
//       senderId,
//       receiverId,
//       content,
//       isReferral: true,
//       createdAt: serverTimestamp(),
//       read: false,
//       type: 'referral',
//       senderName,
//       receiverName,
//       jobId: conversationData.jobId,
//       jobTitle: conversationData.jobTitle
//     };

//     // Add message to messages collection
//     const docRef = await addDoc(collection(db, 'messages'), messageData);
    
//     // Update conversation metadata
//     await setDoc(doc(db, 'referralConversations', conversationDoc.id), {
//       lastMessageAt: serverTimestamp(),
//       lastMessage: content.length > 50 ? content.substring(0, 50) + '...' : content,
//       unreadCount: conversationData.unreadCount + 1,
//       [`${receiverId}HasUnread`]: true,
//       messageCount: (conversationData.messageCount || 0) + 1
//     }, { merge: true });
    
//     // Create notification for receiver
//     const notificationRef = doc(collection(db, 'notifications'));
//     await setDoc(notificationRef, {
//       userId: receiverId,
//       type: 'new_message',
//       title: 'New Message',
//       message: `${senderName}: ${content.length > 100 ? content.substring(0, 100) + '...' : content}`,
//       read: false,
//       createdAt: serverTimestamp(),
//       conversationId,
//       jobId: conversationData.jobId,
//       jobTitle: conversationData.jobTitle,
//       senderId,
//       senderName
//     });
    
//     console.log('Message sent and notification created');
//     return docRef.id;
    
//   } catch (error) {
//     console.error('Error sending referral message:', error);
//     throw error;
//   }
// };

// // Get all referral conversations for a user
// export const getUserReferralConversations = async (userId: string): Promise<ReferralConversation[]> => {
//   try {
//     const conversationsRef = collection(db, 'referralConversations');
//     const q = query(
//       conversationsRef,
//       where('participants', 'array-contains', userId),
//       orderBy('lastMessageAt', 'desc')
//     );
    
//     const querySnapshot = await getDocs(q);
//     const conversations: ReferralConversation[] = [];
    
//     querySnapshot.forEach((doc) => {
//       const data = doc.data();
//       conversations.push({ 
//         id: doc.id, 
//         conversationId: data.conversationId || '',
//         jobId: data.jobId || '',
//         jobTitle: data.jobTitle || '',
//         companyName: data.companyName || '',
//         employeeId: data.employeeId || '',
//         employeeName: data.employeeName || '',
//         jobSeekerId: data.jobSeekerId || '',
//         jobSeekerName: data.jobSeekerName || '',
//         lastMessageAt: data.lastMessageAt || null,
//         lastMessage: data.lastMessage || '',
//         myUnreadCount: data[`${userId}HasUnread`] ? 1 : 0,
//         createdAt: data.createdAt || null,
//         messageCount: data.messageCount || 0,
//         participants: data.participants || [],
//         isActive: data.isActive || false,
//         employeeHasUnread: data.employeeHasUnread,
//         jobSeekerHasUnread: data.jobSeekerHasUnread,
//         unreadCount: data.unreadCount
//       });
//     });
    
//     console.log(`Found ${conversations.length} conversations for user ${userId}`);
//     return conversations;
//   } catch (error) {
//     console.error('Error fetching referral conversations:', error);
//     return [];
//   }
// };

// // Get conversations for a specific job
// export const getJobReferralConversations = async (jobId: string, userId: string): Promise<ReferralConversation[]> => {
//   try {
//     const conversationsRef = collection(db, 'referralConversations');
//     const q = query(
//       conversationsRef,
//       where('jobId', '==', jobId),
//       where('participants', 'array-contains', userId),
//       orderBy('lastMessageAt', 'desc')
//     );
    
//     const querySnapshot = await getDocs(q);
//     const conversations: ReferralConversation[] = [];
    
//     querySnapshot.forEach((doc) => {
//       const data = doc.data();
//       conversations.push({ 
//         id: doc.id, 
//         conversationId: data.conversationId || '',
//         jobId: data.jobId || '',
//         jobTitle: data.jobTitle || '',
//         companyName: data.companyName || '',
//         employeeId: data.employeeId || '',
//         employeeName: data.employeeName || '',
//         jobSeekerId: data.jobSeekerId || '',
//         jobSeekerName: data.jobSeekerName || '',
//         lastMessageAt: data.lastMessageAt || null,
//         lastMessage: data.lastMessage || '',
//         myUnreadCount: data[`${userId}HasUnread`] ? 1 : 0,
//         createdAt: data.createdAt || null,
//         messageCount: data.messageCount || 0,
//         participants: data.participants || [],
//         isActive: data.isActive || false
//       });
//     });
    
//     console.log(`Found ${conversations.length} conversations for job ${jobId}`);
//     return conversations;
//   } catch (error) {
//     console.error('Error fetching job conversations:', error);
//     return [];
//   }
// };

// // Get messages for a specific referral conversation
// export const getReferralMessages = (
//   conversationId: string,
//   callback: (messages: Message[]) => void
// ) => {
//   const messagesRef = collection(db, 'messages');
//   const q = query(
//     messagesRef,
//     where('conversationId', '==', conversationId),
//     where('isReferral', '==', true),
//     orderBy('createdAt', 'asc')
//   );
  
//   return onSnapshot(q, (querySnapshot) => {
//     const messages: Message[] = [];
//     querySnapshot.forEach((doc) => {
//       const data = doc.data();
//       messages.push({ 
//         id: doc.id, 
//         conversationId: data.conversationId || '',
//         senderId: data.senderId || '',
//         senderName: data.senderName || '',
//         receiverId: data.receiverId || '',
//         receiverName: data.receiverName || '',
//         content: data.content || '',
//         createdAt: data.createdAt || null,
//         read: data.read || false,
//         isReferral: data.isReferral || false,
//         jobId: data.jobId || '',
//         jobTitle: data.jobTitle || ''
//       });
//     });
//     callback(messages);
//   });
// };

// // Mark conversation as read
// export const markConversationAsRead = async (conversationId: string, userId: string) => {
//   try {
//     const conversationsRef = collection(db, 'referralConversations');
//     const q = query(conversationsRef, where('conversationId', '==', conversationId));
//     const querySnapshot = await getDocs(q);
    
//     if (!querySnapshot.empty) {
//       const conversationDoc = querySnapshot.docs[0];
//       await setDoc(doc(db, 'referralConversations', conversationDoc.id), {
//         [`${userId}HasUnread`]: false,
//         unreadCount: 0
//       }, { merge: true });
      
//       console.log(`Marked conversation ${conversationId} as read for user ${userId}`);
//     }
//   } catch (error) {
//     console.error('Error marking conversation as read:', error);
//   }
// };


import { auth, db } from './firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  DocumentData,
  limit,
  startAfter,
  updateDoc,
  increment,
  QueryDocumentSnapshot
} from 'firebase/firestore';

// Define interfaces
export interface ReferralConversation {
  id: string;
  conversationId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  employeeId: string;
  employeeName: string;
  jobSeekerId: string;
  jobSeekerName: string;
  lastMessageAt: Timestamp | null;
  lastMessage: string;
  myUnreadCount: number;
  createdAt: Timestamp | null;
  messageCount: number;
  participants: string[];
  isActive: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  createdAt: Timestamp | null;
  read: boolean;
  isReferral: boolean;
  jobId: string;
  jobTitle: string;
  delivered?: boolean;
}

// Helper: Create unique conversation ID
export const createReferralConversationId = (
  jobId: string, 
  employeeId: string,
  jobSeekerId: string
): string => {
  return `referral_${jobId}_${employeeId}_${jobSeekerId}`;
};

// Get user name
export const getEmployeeName = async (employeeId: string): Promise<string> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', employeeId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.displayName || userData.name || userData.email || 'Employee';
    }
    return 'Employee';
  } catch (error) {
    console.error('Error fetching employee name:', error);
    return 'Employee';
  }
};

export const getJobSeekerName = async (jobSeekerId: string): Promise<string> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', jobSeekerId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.displayName || userData.name || userData.email || 'Job Seeker';
    }
    return 'Job Seeker';
  } catch (error) {
    console.error('Error fetching job seeker name:', error);
    return 'Job Seeker';
  }
};

// Start or get a referral conversation
export const startReferralConversation = async (
  jobId: string,
  jobTitle: string,
  companyName: string,
  employeeId: string,
  jobSeekerId: string
): Promise<string> => {
  try {
    const employeeName = await getEmployeeName(employeeId);
    const jobSeekerName = await getJobSeekerName(jobSeekerId);
    const conversationId = createReferralConversationId(jobId, employeeId, jobSeekerId);
    
    const conversationsRef = collection(db, 'referralConversations');
    const q = query(conversationsRef, where('conversationId', '==', conversationId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      await addDoc(collection(db, 'referralConversations'), {
        conversationId,
        jobId,
        jobTitle,
        companyName,
        employeeId,
        employeeName,
        jobSeekerId,
        jobSeekerName,
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
        lastMessage: 'Conversation started',
        participants: [employeeId, jobSeekerId],
        isActive: true,
        messageCount: 0
      });
      
      // Create notification for employee
      const notificationRef = doc(collection(db, 'notifications'));
      await setDoc(notificationRef, {
        userId: employeeId,
        type: 'new_referral_conversation',
        title: 'New Job Inquiry',
        message: `${jobSeekerName} is interested in the ${jobTitle} position at ${companyName}`,
        read: false,
        createdAt: serverTimestamp(),
        conversationId,
        jobId,
        jobTitle,
        companyName,
        jobSeekerId,
        jobSeekerName,
        redirectTo: `/referral/marketplace?job=${jobId}&conversation=${conversationId}`
      });
    } else {
      // Update last activity
      const conversationDoc = querySnapshot.docs[0];
      await setDoc(doc(db, 'referralConversations', conversationDoc.id), {
        lastMessageAt: serverTimestamp(),
        isActive: true
      }, { merge: true });
    }
    
    return conversationId;
  } catch (error) {
    console.error('Error starting referral conversation:', error);
    throw error;
  }
};

// Send a referral message - now updates unread count on the job document
export const sendReferralMessage = async (
  conversationId: string,
  senderId: string,
  content: string
): Promise<string> => {
  try {
    const conversationsRef = collection(db, 'referralConversations');
    const q = query(conversationsRef, where('conversationId', '==', conversationId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) throw new Error('Conversation not found');
    
    const conversationDoc = querySnapshot.docs[0];
    const conversationData = conversationDoc.data();
    const receiverId = conversationData.participants.find((id: string) => id !== senderId);
    if (!receiverId) throw new Error('Receiver not found');
    
    const senderName = senderId === conversationData.employeeId ? conversationData.employeeName : conversationData.jobSeekerName;
    const receiverName = receiverId === conversationData.employeeId ? conversationData.employeeName : conversationData.jobSeekerName;
    
    // Add message
    const messageData = {
      conversationId,
      senderId,
      receiverId,
      content,
      isReferral: true,
      createdAt: serverTimestamp(),
      read: false,
      type: 'referral',
      senderName,
      receiverName,
      jobId: conversationData.jobId,
      jobTitle: conversationData.jobTitle
    };
    const docRef = await addDoc(collection(db, 'messages'), messageData);
    
    // Update conversation metadata
    await setDoc(doc(db, 'referralConversations', conversationDoc.id), {
      lastMessageAt: serverTimestamp(),
      lastMessage: content.length > 50 ? content.substring(0, 50) + '...' : content,
      messageCount: increment(1)
    }, { merge: true });
    
    // ** NEW: Update unread count on the job document **
    const jobRef = doc(db, 'referralJobs', conversationData.jobId);
    const jobSnap = await getDoc(jobRef);
    if (jobSnap.exists()) {
      const currentUnreads = jobSnap.data()?.unreadCounts || {};
      const newCount = (currentUnreads[receiverId] || 0) + 1;
      await updateDoc(jobRef, {
        [`unreadCounts.${receiverId}`]: newCount
      });
    }
    
    // Create notification
    const notificationRef = doc(collection(db, 'notifications'));
    await setDoc(notificationRef, {
      userId: receiverId,
      type: 'new_message',
      title: 'New Message',
      message: `${senderName}: ${content.length > 100 ? content.substring(0, 100) + '...' : content}`,
      read: false,
      createdAt: serverTimestamp(),
      conversationId,
      jobId: conversationData.jobId,
      jobTitle: conversationData.jobTitle,
      senderId,
      senderName
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error sending referral message:', error);
    throw error;
  }
};

// Paginated getUserReferralConversations
export const getUserReferralConversations = async (
  userId: string,
  pageSize: number = 20,
  startAfterDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ conversations: ReferralConversation[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    let conversationsQuery = query(
      collection(db, 'referralConversations'),
      where('participants', 'array-contains', userId),
      orderBy('lastMessageAt', 'desc'),
      limit(pageSize)
    );
    
    if (startAfterDoc) {
      conversationsQuery = query(conversationsQuery, startAfter(startAfterDoc));
    }
    
    const snapshot = await getDocs(conversationsQuery);
    const conversations: ReferralConversation[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      conversations.push({
        id: docSnap.id,
        conversationId: data.conversationId,
        jobId: data.jobId,
        jobTitle: data.jobTitle,
        companyName: data.companyName,
        employeeId: data.employeeId,
        employeeName: data.employeeName,
        jobSeekerId: data.jobSeekerId,
        jobSeekerName: data.jobSeekerName,
        lastMessageAt: data.lastMessageAt,
        lastMessage: data.lastMessage,
        myUnreadCount: 0, // We no longer rely on this; unread is on job
        createdAt: data.createdAt,
        messageCount: data.messageCount,
        participants: data.participants,
        isActive: data.isActive
      });
    });
    
    return {
      conversations,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null
    };
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return { conversations: [], lastDoc: null };
  }
};

// Get conversations for a specific job (paginated)
export const getJobReferralConversationsPaginated = async (
  jobId: string,
  userId: string,
  pageSize: number = 20,
  startAfterDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ conversations: ReferralConversation[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    let conversationsQuery = query(
      collection(db, 'referralConversations'),
      where('jobId', '==', jobId),
      where('participants', 'array-contains', userId),
      orderBy('lastMessageAt', 'desc'),
      limit(pageSize)
    );
    
    if (startAfterDoc) {
      conversationsQuery = query(conversationsQuery, startAfter(startAfterDoc));
    }
    
    const snapshot = await getDocs(conversationsQuery);
    const conversations: ReferralConversation[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      conversations.push({
        id: docSnap.id,
        conversationId: data.conversationId,
        jobId: data.jobId,
        jobTitle: data.jobTitle,
        companyName: data.companyName,
        employeeId: data.employeeId,
        employeeName: data.employeeName,
        jobSeekerId: data.jobSeekerId,
        jobSeekerName: data.jobSeekerName,
        lastMessageAt: data.lastMessageAt,
        lastMessage: data.lastMessage,
        myUnreadCount: 0,
        createdAt: data.createdAt,
        messageCount: data.messageCount,
        participants: data.participants,
        isActive: data.isActive
      });
    });
    
    return {
      conversations,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null
    };
  } catch (error) {
    console.error('Error fetching job conversations:', error);
    return { conversations: [], lastDoc: null };
  }
};

// Mark conversation as read - now updates job document unread count
export const markConversationAsRead = async (conversationId: string, userId: string) => {
  try {
    const conversationsRef = collection(db, 'referralConversations');
    const q = query(conversationsRef, where('conversationId', '==', conversationId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const conversationDoc = querySnapshot.docs[0];
      const data = conversationDoc.data();
      const jobId = data.jobId;
      
      // Update job document: set unread count for this user to 0
      const jobRef = doc(db, 'referralJobs', jobId);
      await updateDoc(jobRef, {
        [`unreadCounts.${userId}`]: 0
      });
      
      console.log(`Marked conversation ${conversationId} as read for user ${userId}`);
    }
  } catch (error) {
    console.error('Error marking conversation as read:', error);
  }
};

// Get messages (unchanged)
export const getReferralMessages = (
  conversationId: string,
  callback: (messages: Message[]) => void
) => {
  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef,
    where('conversationId', '==', conversationId),
    where('isReferral', '==', true),
    orderBy('createdAt', 'asc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const messages: Message[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      messages.push({ 
        id: docSnap.id, 
        conversationId: data.conversationId || '',
        senderId: data.senderId || '',
        senderName: data.senderName || '',
        receiverId: data.receiverId || '',
        receiverName: data.receiverName || '',
        content: data.content || '',
        createdAt: data.createdAt || null,
        read: data.read || false,
        isReferral: data.isReferral || false,
        jobId: data.jobId || '',
        jobTitle: data.jobTitle || ''
      });
    });
    callback(messages);
  });
};