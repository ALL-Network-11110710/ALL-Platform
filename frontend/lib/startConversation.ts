// // File: /lib/startConversation.ts
// import { auth, db } from './firebase';
// import { 
//   collection, 
//   query, 
//   where, 
//   getDocs, 
//   doc, 
//   setDoc, 
//   serverTimestamp,
//   getDoc 
// } from 'firebase/firestore';

// /**
//  * Creates a conversation between two users or returns existing conversation ID
//  * @param currentUserId - The ID of the current user (job seeker)
//  * @param employeeUserId - The ID of the employee (job poster)
//  * @returns The conversation ID
//  */
// export const startConversation = async (currentUserId: string, employeeUserId: string): Promise<string> => {
//   try {
//     console.log('Starting conversation between:', currentUserId, 'and', employeeUserId);
    
//     // 1. Generate conversation ID (same method as in sendMessage.ts)
//     const sortedIds = [currentUserId, employeeUserId].sort();
//     const conversationId = `${sortedIds[0]}_${sortedIds[1]}`;
    
//     console.log('Generated conversation ID:', conversationId);
    
//     // 2. Check if conversation already has messages
//     const messagesRef = collection(db, 'messages');
//     const conversationQuery = query(
//       messagesRef,
//       where('conversationId', '==', conversationId)
//     );
    
//     const querySnapshot = await getDocs(conversationQuery);
    
//     // If no messages exist yet, we don't need to create anything
//     // The conversation will be created automatically when first message is sent
//     console.log('Found existing messages:', querySnapshot.size);
    
//     return conversationId;
    
//   } catch (error) {
//     console.error('Error starting conversation:', error);
//     throw error;
//   }
// };

// /**
//  * Helper function to start conversation from referral job
//  * This creates a notification for the employee about the conversation
//  */
// export const startReferralConversation = async (
//   jobId: string,
//   jobTitle: string,
//   jobCompany: string,
//   employeeUserId: string,
//   jobSeekerUserId: string,
//   jobSeekerName: string
// ): Promise<string> => {
//   try {
//     console.log('Starting referral conversation for job:', jobId);
    
//     // 1. Get conversation ID
//     const conversationId = await startConversation(jobSeekerUserId, employeeUserId);
    
//     // 2. Get job seeker's profile info
//     let jobSeekerData: any = { displayName: jobSeekerName };
//     try {
//       const jobSeekerDoc = await getDoc(doc(db, 'users', jobSeekerUserId));
//       if (jobSeekerDoc.exists()) {
//         jobSeekerData = jobSeekerDoc.data();
//       }
//     } catch (error) {
//       console.error('Error fetching job seeker data:', error);
//     }
    
//     // 3. Create notification in Firestore for the employee
//     const notificationRef = doc(collection(db, 'notifications'));
    
//     await setDoc(notificationRef, {
//       userId: employeeUserId,
//       type: 'new_referral_conversation',
//       fromUserId: jobSeekerUserId,
//       fromUserName: jobSeekerData.displayName || jobSeekerName || 'A job seeker',
//       message: `is interested in the ${jobTitle} position at ${jobCompany}`,
//       read: false,
//       createdAt: serverTimestamp(),
//       conversationId: conversationId,
//       jobId: jobId,
//       jobTitle: jobTitle,
//       jobCompany: jobCompany
//     });
    
//     console.log('Referral conversation notification created for employee');
//     return conversationId;
    
//   } catch (error) {
//     console.error('Error starting referral conversation:', error);
//     throw error;
//   }
// };

// /**
//  * Helper function to check if user can start a conversation
//  */
// export const canMessageEmployee = (currentUserId: string, employeeUserId: string): boolean => {
//   return currentUserId !== employeeUserId;
// };


import { auth, db } from './firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  serverTimestamp,
  getDoc 
} from 'firebase/firestore';
import { areUsersConnected } from './connections'; // ADD THIS IMPORT

/**
 * Creates a conversation between two users or returns existing conversation ID
 * @param currentUserId - The ID of the current user (job seeker)
 * @param employeeUserId - The ID of the employee (job poster)
 * @returns The conversation ID
 */
export const startConversation = async (currentUserId: string, employeeUserId: string): Promise<string> => {
  try {
    console.log('Starting conversation between:', currentUserId, 'and', employeeUserId);
    
    // FIX: Check if users are connected BEFORE allowing conversation
    const areConnected = await areUsersConnected(currentUserId, employeeUserId);
    
    if (!areConnected) {
      throw new Error('You must be connected with this user to start a conversation.');
    }
    
    // Generate conversation ID (same method as in sendMessage.ts)
    const sortedIds = [currentUserId, employeeUserId].sort();
    const conversationId = `${sortedIds[0]}_${sortedIds[1]}`;
    
    console.log('Generated conversation ID:', conversationId);
    
    return conversationId;
    
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error;
  }
};

/**
 * Helper function to start conversation from referral job
 * This creates a notification for the employee about the conversation
 */
export const startReferralConversation = async (
  jobId: string,
  jobTitle: string,
  jobCompany: string,
  employeeUserId: string,
  jobSeekerUserId: string,
  jobSeekerName: string
): Promise<string> => {
  try {
    console.log('Starting referral conversation for job:', jobId);
    
    // 1. Get conversation ID
    // FIX: For referral conversations, DON'T require connection
    const sortedIds = [jobSeekerUserId, employeeUserId].sort();
    const conversationId = `${sortedIds[0]}_${sortedIds[1]}`;
    
    // 2. Get job seeker's profile info
    let jobSeekerData: any = { displayName: jobSeekerName };
    try {
      const jobSeekerDoc = await getDoc(doc(db, 'users', jobSeekerUserId));
      if (jobSeekerDoc.exists()) {
        jobSeekerData = jobSeekerDoc.data();
      }
    } catch (error) {
      console.error('Error fetching job seeker data:', error);
    }
    
    // 3. Create notification in Firestore for the employee
    const notificationRef = doc(collection(db, 'notifications'));
    
    await setDoc(notificationRef, {
      userId: employeeUserId,
      type: 'new_referral_conversation',
      fromUserId: jobSeekerUserId,
      fromUserName: jobSeekerData.displayName || jobSeekerName || 'A job seeker',
      message: `is interested in the ${jobTitle} position at ${jobCompany}`,
      read: false,
      createdAt: serverTimestamp(),
      conversationId: conversationId,
      jobId: jobId,
      jobTitle: jobTitle,
      jobCompany: jobCompany
    });
    
    console.log('Referral conversation notification created for employee');
    return conversationId;
    
  } catch (error) {
    console.error('Error starting referral conversation:', error);
    throw error;
  }
};

/**
 * Helper function to check if user can start a conversation
 */
export const canMessageEmployee = (currentUserId: string, employeeUserId: string): boolean => {
  return currentUserId !== employeeUserId;
};