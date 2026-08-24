import { doc, setDoc, deleteDoc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { debounce } from 'lodash';

// Set that a user is typing in a conversation
export const startTyping = async (conversationId: string, userId: string) => {
  try {
    const typingRef = doc(db, 'typing', `${conversationId}_${userId}`);
    await setDoc(typingRef, {
      conversationId,
      userId,
      typing: true,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error setting typing status:', error);
  }
};

// Remove typing status when user stops typing or sends message
export const stopTyping = async (conversationId: string, userId: string) => {
  try {
    const typingRef = doc(db, 'typing', `${conversationId}_${userId}`);
    await deleteDoc(typingRef);
  } catch (error) {
    console.error('Error removing typing status:', error);
  }
};

// Debounced version to avoid too many Firestore writes
export const debouncedStopTyping = debounce(stopTyping, 1000);

// Listen for typing events in a conversation
export const listenForTyping = (conversationId: string, callback: (typingUsers: string[]) => void) => {
  return onSnapshot(
    query(collection(db, 'typing'), where('conversationId', '==', conversationId)),
    (snapshot) => {
      const typingUsers = snapshot.docs.map(doc => doc.data().userId);
      callback(typingUsers);
    },
    (error) => {
      console.error('Error listening for typing:', error);
    }
  );
};