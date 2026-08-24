import { doc, setDoc, serverTimestamp, collection, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export const createMessageNotification = async (
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