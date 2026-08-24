// lib/conversations.ts
import {
  db,
  auth,
} from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  serverTimestamp,
  DocumentData,
  DocumentSnapshot,
} from 'firebase/firestore';

// --- Types ---
export interface Conversation {
  id: string;
  participants: string[]; // [uid1, uid2]
  participantData: {
    [uid: string]: {
      uid: string;
      displayName: string;
      photoURL: string | null;
    };
  };
  lastMessage: string;
  lastTimestamp: Timestamp | null;
  unreadCount: {
    [uid: string]: number;
  };
  updatedAt: Timestamp;
  createdAt: Timestamp;
}

export interface ConversationWithOtherUser extends Conversation {
  otherUserId: string;
  otherUserData: {
    uid: string;
    displayName: string;
    photoURL: string | null;
  };
  unreadCountForCurrentUser: number;
}

// --- Helper: Get or create a conversation between two users ---
export const getOrCreateConversation = async (
  currentUserId: string,
  otherUserId: string
): Promise<string> => {
  const conversationId = [currentUserId, otherUserId].sort().join('_');
  const conversationRef = doc(db, 'conversations', conversationId);
  const conversationSnap = await getDoc(conversationRef);

  if (conversationSnap.exists()) {
    return conversationId;
  }

  // Fetch user data for denormalisation
  const [currentUserSnap, otherUserSnap] = await Promise.all([
    getDoc(doc(db, 'users', currentUserId)),
    getDoc(doc(db, 'users', otherUserId)),
  ]);

  const currentUserData = currentUserSnap.data();
  const otherUserData = otherUserSnap.data();

  const participantData = {
    [currentUserId]: {
      uid: currentUserId,
      displayName: currentUserData?.displayName || 'Unknown',
      photoURL: currentUserData?.photoURL || null,
    },
    [otherUserId]: {
      uid: otherUserId,
      displayName: otherUserData?.displayName || 'Unknown',
      photoURL: otherUserData?.photoURL || null,
    },
  };

  const newConversation: Conversation = {
    id: conversationId,
    participants: [currentUserId, otherUserId],
    participantData,
    lastMessage: '',
    lastTimestamp: null,
    unreadCount: {
      [currentUserId]: 0,
      [otherUserId]: 0,
    },
    updatedAt: serverTimestamp() as Timestamp,
    createdAt: serverTimestamp() as Timestamp,
  };

  await setDoc(conversationRef, newConversation);
  return conversationId;
};

// --- Update conversation when a new message is sent ---
export const updateConversationOnNewMessage = async (
  conversationId: string,
  senderId: string,
  receiverId: string,
  messageText: string
): Promise<void> => {
  const conversationRef = doc(db, 'conversations', conversationId);
  const conversationSnap = await getDoc(conversationRef);

  if (!conversationSnap.exists()) {
    // Should not happen, but create if missing
    await getOrCreateConversation(senderId, receiverId);
  }

  // Increment unread count for receiver only
  const currentUnread = conversationSnap.data()?.unreadCount || {};
  const newUnreadCount = {
    ...currentUnread,
    [receiverId]: (currentUnread[receiverId] || 0) + 1,
    // Keep sender's unread count as is (usually 0 for sender)
  };

  await updateDoc(conversationRef, {
    lastMessage: messageText,
    lastTimestamp: serverTimestamp(),
    updatedAt: serverTimestamp(),
    unreadCount: newUnreadCount,
  });
};

// --- Mark conversation as read for a user (set unreadCount to 0) ---
export const markConversationRead = async (
  conversationId: string,
  userId: string
): Promise<void> => {
  const conversationRef = doc(db, 'conversations', conversationId);
  const conversationSnap = await getDoc(conversationRef);

  if (!conversationSnap.exists()) return;

  const currentUnread = conversationSnap.data()?.unreadCount || {};
  if (currentUnread[userId] === 0) return;

  await updateDoc(conversationRef, {
    [`unreadCount.${userId}`]: 0,
  });
};

// --- Fetch paginated conversations for a user (with denormalised other user data) ---
export const getUserConversations = async (
  userId: string,
  pageSize: number = 20,
  lastDocSnapshot?: DocumentSnapshot
): Promise<{
  conversations: ConversationWithOtherUser[];
  lastDoc: DocumentSnapshot | null;
}> => {
  const conversationsRef = collection(db, 'conversations');
  let constraints: any[] = [
    where('participants', 'array-contains', userId),
    orderBy('updatedAt', 'desc'),
    limit(pageSize),
  ];

  if (lastDocSnapshot) {
    constraints.push(startAfter(lastDocSnapshot));
  }

  const q = query(conversationsRef, ...constraints);
  const snapshot = await getDocs(q);

  const conversations: ConversationWithOtherUser[] = [];
  snapshot.forEach((docSnap) => {
    const data = docSnap.data() as Conversation;
    const otherUserId = data.participants.find((id) => id !== userId);
    if (!otherUserId) return;

    const otherUserData = data.participantData[otherUserId] || {
      uid: otherUserId,
      displayName: 'Unknown',
      photoURL: null,
    };

    conversations.push({
      ...data,
      id: docSnap.id,
      otherUserId,
      otherUserData,
      unreadCountForCurrentUser: data.unreadCount[userId] || 0,
    });
  });

  const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
  return { conversations, lastDoc };
};

// --- Get total unread count for a user (across all conversations) ---
export const getTotalUnreadCount = async (userId: string): Promise<number> => {
  const conversationsRef = collection(db, 'conversations');
  const q = query(conversationsRef, where('participants', 'array-contains', userId));
  const snapshot = await getDocs(q);

  let total = 0;
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    total += data.unreadCount?.[userId] || 0;
  });
  return total;
};