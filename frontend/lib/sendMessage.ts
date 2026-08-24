// // lib/sendMessage.ts

// // Import necessary functions from the Firebase SDKs
// // We need to add 'collection' to the import from 'firebase/firestore'
// import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
// // Import your Firebase configuration which contains the 'db' object
// import { db } from './firebase';

// // Define the parameters that the sendMessage function will need
// interface SendMessageParams {
//   text: string;       // The actual message text
//   senderId: string;   // The UID of the user sending the message
//   receiverId: string; // The UID of the user receiving the message
// }

// // The main function to send a message
// export const sendMessage = async ({ text, senderId, receiverId }: SendMessageParams): Promise<void> => {
//   try {
//     // 1. Create a unique conversation ID by combining the two user IDs
//     // We sort them alphabetically to ensure the ID is always the same for two users,
//     // regardless of who sends the message first.
//     const sortedIds = [senderId, receiverId].sort();
//     const conversationId = `${sortedIds[0]}_${sortedIds[1]}`; // e.g., "user123_user456"

//     // 2. Create a reference to a new document in the 'messages' collection.
//     // Firestore will automatically generate a unique ID for this message.
//     // We use the 'collection' function here, which we now import
//     const messageRef = doc(collection(db, 'messages'));

//     // 3. Prepare the data to be saved in the new document
//     const messageData = {
//       text,                   // The message text from the function parameters
//       senderId,               // The sender's UID
//       receiverId,             // The receiver's UID
//       conversationId,         // The generated conversation ID
//       timestamp: serverTimestamp(), // A special Firestore value that adds the server time
//     };

//     // 4. Save the data to the new document in Firestore
//     await setDoc(messageRef, messageData);

//     // Optional: You can add a console log for debugging to see it worked
//     console.log('Message sent successfully!');
//   } catch (error) {
//     // If anything goes wrong, log the error
//     console.error('Error sending message: ', error);
//     // It's good practice to re-throw the error so the calling code can handle it if needed
//     throw error;
//   }
// };

// lib/sendMessage.ts

// lib/sendMessage.ts

// ---------------------------------- main part -------------------------------

// import { doc, setDoc, serverTimestamp, collection, getDoc } from 'firebase/firestore';
// import { db } from './firebase';

// // Define the parameters that the sendMessage function will need
// interface SendMessageParams {
//   text: string;       // The actual message text
//   senderId: string;   // The UID of the user sending the message
//   receiverId: string; // The UID of the user receiving the message
// }

// // Function to create a notification for new messages
// const createMessageNotification = async (
//   receiverId: string,
//   senderId: string,
//   messageText: string,
//   conversationId: string
// ) => {
//   try {
//     // Get sender's profile info
//     const senderDoc = await getDoc(doc(db, 'users', senderId));
//     const senderData = senderDoc.data();
    
//     // Create notification
//     const notificationRef = doc(collection(db, 'notifications'));
    
//     await setDoc(notificationRef, {
//       userId: receiverId,
//       type: 'new_message',
//       fromUserId: senderId,
//       fromUserName: senderData?.displayName || 'Someone',
//       message: `Sent you a message: ${messageText.substring(0, 50)}${messageText.length > 50 ? '...' : ''}`,
//       read: false,
//       createdAt: serverTimestamp(),
//       conversationId: conversationId
//     });
    
//     console.log('Message notification created');
//   } catch (error) {
//     console.error('Error creating message notification:', error);
//   }
// };

// // The main function to send a message
// export const sendMessage = async ({ text, senderId, receiverId }: SendMessageParams): Promise<void> => {
//   try {
//     console.log('Starting to send message...', { text, senderId, receiverId });
    
//     // 1. Create a unique conversation ID by combining the two user IDs
//     // We sort them alphabetically to ensure the ID is always the same for two users,
//     // regardless of who sends the message first.
//     const sortedIds = [senderId, receiverId].sort();
//     const conversationId = `${sortedIds[0]}_${sortedIds[1]}`; // e.g., "user123_user456"
//     console.log('Generated conversationId:', conversationId);

//     // 2. Create a reference to a new document in the 'messages' collection.
//     // Firestore will automatically generate a unique ID for this message.
//     const messageRef = doc(collection(db, 'messages'));

//     // 3. Prepare the data to be saved in the new document
//     const messageData = {
//       text,                   // The message text from the function parameters
//       senderId,               // The sender's UID
//       receiverId,             // The receiver's UID
//       conversationId,         // The generated conversation ID
//       participants: [senderId, receiverId], // For easier querying
//       timestamp: serverTimestamp(), // A special Firestore value that adds the server time
//       status: 'sent',         // NEW: Initial message status
//     };

//     console.log('Attempting to save message data:', messageData);

//     // 4. Save the data to the new document in Firestore
//     await setDoc(messageRef, messageData);

//     // 5. Create a notification for the receiver
//     await createMessageNotification(receiverId, senderId, text, conversationId);

//     console.log('Message sent successfully! ID:', messageRef.id);
//   } catch (error) {
//     console.error('Error sending message: ', error);
//     // It's good practice to re-throw the error so the calling code can handle it if needed
//     throw error;
//   }
// };

// // NEW: Function to update message status
// export const updateMessageStatus = async (messageId: string, status: 'sent' | 'delivered' | 'read'): Promise<void> => {
//   try {
//     const messageRef = doc(db, 'messages', messageId);
//     await setDoc(messageRef, { status }, { merge: true }); // Merge to update only the status field
//     console.log(`Message status updated to ${status} for message: ${messageId}`);
//   } catch (error) {
//     console.error('Error updating message status:', error);
//     throw error;
//   }
// };



// lib/sendMessage.ts
import { doc, setDoc, serverTimestamp, collection, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { getOrCreateConversation, updateConversationOnNewMessage } from './conversations'; // NEW

// Define the parameters that the sendMessage function will need
interface SendMessageParams {
  text: string;       // The actual message text
  senderId: string;   // The UID of the user sending the message
  receiverId: string; // The UID of the user receiving the message
}

// Function to create a notification for new messages (unchanged)
const createMessageNotification = async (
  receiverId: string,
  senderId: string,
  messageText: string,
  conversationId: string
) => {
  try {
    // Get sender's profile info
    const senderDoc = await getDoc(doc(db, 'users', senderId));
    const senderData = senderDoc.data();
    
    // Create notification
    const notificationRef = doc(collection(db, 'notifications'));
    
    await setDoc(notificationRef, {
      userId: receiverId,
      type: 'new_message',
      fromUserId: senderId,
      fromUserName: senderData?.displayName || 'Someone',
      message: `Sent you a message: ${messageText.substring(0, 50)}${messageText.length > 50 ? '...' : ''}`,
      read: false,
      createdAt: serverTimestamp(),
      conversationId: conversationId
    });
    
    console.log('Message notification created');
  } catch (error) {
    console.error('Error creating message notification:', error);
  }
};

// The main function to send a message
export const sendMessage = async ({ text, senderId, receiverId }: SendMessageParams): Promise<void> => {
  try {
    console.log('Starting to send message...', { text, senderId, receiverId });
    
    // 1. Create a unique conversation ID by combining the two user IDs
    const sortedIds = [senderId, receiverId].sort();
    const conversationId = `${sortedIds[0]}_${sortedIds[1]}`;
    console.log('Generated conversationId:', conversationId);

    // 2. Ensure conversation document exists (create if not)
    await getOrCreateConversation(senderId, receiverId);

    // 3. Create a reference to a new document in the 'messages' collection.
    const messageRef = doc(collection(db, 'messages'));

    // 4. Prepare the message data
    const messageData = {
      text,
      senderId,
      receiverId,
      conversationId,
      participants: [senderId, receiverId],
      timestamp: serverTimestamp(),
      status: 'sent',
    };

    console.log('Attempting to save message data:', messageData);

    // 5. Save the message to Firestore
    await setDoc(messageRef, messageData);

    // 6. Update the conversation document with last message and unread count
    await updateConversationOnNewMessage(conversationId, senderId, receiverId, text);

    // 7. Create a notification for the receiver
    await createMessageNotification(receiverId, senderId, text, conversationId);

    console.log('Message sent successfully! ID:', messageRef.id);
  } catch (error) {
    console.error('Error sending message: ', error);
    throw error;
  }
};

// Function to update message status (unchanged)
export const updateMessageStatus = async (messageId: string, status: 'sent' | 'delivered' | 'read'): Promise<void> => {
  try {
    const messageRef = doc(db, 'messages', messageId);
    await setDoc(messageRef, { status }, { merge: true });
    console.log(`Message status updated to ${status} for message: ${messageId}`);
  } catch (error) {
    console.error('Error updating message status:', error);
    throw error;
  }
};