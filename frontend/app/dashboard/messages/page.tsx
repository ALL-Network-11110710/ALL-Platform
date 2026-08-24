// 'use client';

// import { useEffect, useState, useMemo } from 'react';
// import { useRouter } from 'next/navigation';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { collection, query, where, orderBy, getDocs, DocumentData } from 'firebase/firestore';
// import Link from 'next/link';
// import { debounce } from 'lodash';

// interface Conversation {
//   id: string;
//   otherUserId: string;
//   lastMessage?: string;
//   lastTimestamp?: Date;
//   otherUserData?: DocumentData;
// }

// export default function MessagesPage() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [allConversations, setAllConversations] = useState<Conversation[]>([]); // Store all conversations for filtering
//   const [loadingConversations, setLoadingConversations] = useState(true);
//   const [searchQuery, setSearchQuery] = useState(''); // NEW: Search query state

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/login');
//     }
//   }, [user, loading, router]);

//   // Fetch user's conversations
//   useEffect(() => {
//     async function fetchConversations() {
//       if (user) {
//         try {
//           // Get all messages where the user is either sender or receiver
//           const messagesRef = collection(db, 'messages');
//           const sentMessagesQuery = query(
//             messagesRef,
//             where('senderId', '==', user.uid)
//           );
          
//           const receivedMessagesQuery = query(
//             messagesRef,
//             where('receiverId', '==', user.uid)
//           );
          
//           // Execute both queries
//           const [sentSnapshot, receivedSnapshot] = await Promise.all([
//             getDocs(sentMessagesQuery),
//             getDocs(receivedMessagesQuery)
//           ]);
          
//           // Combine all messages
//           const allMessages: any[] = [];
          
//           sentSnapshot.forEach((doc) => {
//             allMessages.push({ id: doc.id, ...doc.data() });
//           });
          
//           receivedSnapshot.forEach((doc) => {
//             allMessages.push({ id: doc.id, ...doc.data() });
//           });
          
//           // Group messages by conversationId
//           const conversationsMap = new Map<string, Conversation>();
          
//           allMessages.forEach((message) => {
//             const conversationId = message.conversationId;
//             const existingConversation = conversationsMap.get(conversationId);
            
//             // If this is a new conversation or this message is newer than the stored one
//             const messageTime = message.timestamp?.toDate?.() || new Date(0);
//             const existingTime = existingConversation?.lastTimestamp || new Date(0);
            
//             if (!existingConversation || messageTime > existingTime) {
//               // Determine who the other user is
//               const otherUserId = message.senderId === user.uid ? message.receiverId : message.senderId;
              
//               conversationsMap.set(conversationId, {
//                 id: conversationId,
//                 otherUserId: otherUserId,
//                 lastMessage: message.text,
//                 lastTimestamp: messageTime,
//               });
//             }
//           });
          
//           // Convert to array
//           const conversationsArray = Array.from(conversationsMap.values());
          
//           // Sort by most recent
//           conversationsArray.sort((a, b) => {
//             const timeA = a.lastTimestamp || new Date(0);
//             const timeB = b.lastTimestamp || new Date(0);
//             return timeB.getTime() - timeA.getTime();
//           });
          
//           // Fetch user data for each conversation
//           const conversationsWithUserData = await Promise.all(
//             conversationsArray.map(async (conversation) => {
//               try {
//                 const userQuery = query(collection(db, 'users'), where('__name__', '==', conversation.otherUserId));
//                 const userDoc = await getDocs(userQuery);
//                 if (!userDoc.empty) {
//                   return {
//                     ...conversation,
//                     otherUserData: userDoc.docs[0].data()
//                   };
//                 }
//               } catch (error) {
//                 console.error('Error fetching user data:', error);
//               }
//               return conversation;
//             })
//           );
          
//           setConversations(conversationsWithUserData);
//           setAllConversations(conversationsWithUserData); // Store all conversations
//         } catch (error) {
//           console.error('Error fetching conversations:', error);
//         } finally {
//           setLoadingConversations(false);
//         }
//       }
//     }

//     if (user) {
//       fetchConversations();
//     }
//   }, [user]);

//   // NEW: Filter conversations based on search query
//   const filteredConversations = useMemo(() => {
//     if (!searchQuery.trim()) return conversations;
    
//     const query = searchQuery.toLowerCase().trim();
//     return conversations.filter(conversation => {
//       // Search by user name
//       const userNameMatch = conversation.otherUserData?.displayName?.toLowerCase().includes(query);
      
//       // Search by last message content
//       const messageMatch = conversation.lastMessage?.toLowerCase().includes(query);
      
//       // Search by user headline/bio
//       const headlineMatch = conversation.otherUserData?.headline?.toLowerCase().includes(query);
      
//       return userNameMatch || messageMatch || headlineMatch;
//     });
//   }, [conversations, searchQuery]);

//   // NEW: Debounced search handler
//   const handleSearchChange = debounce((value: string) => {
//     setSearchQuery(value);
//   }, 300);

//   if (loading || loadingConversations) return (
//     <div className="min-h-screen bg-white flex items-center justify-center">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
//         <p className="mt-4 text-black">Loading your conversations...</p>
//       </div>
//     </div>
//   );

//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-4xl mx-auto p-6">
//         <div className="flex items-center justify-between mb-8">
//           <h1 className="text-3xl font-bold text-black">Your Conversations</h1>
//           <Link 
//             href="/network"
//             className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
//           >
//             Find People to Message
//           </Link>
//         </div>

//         {/* NEW: Search Bar */}
//         <div className="mb-6">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search conversations..."
//               onChange={(e) => handleSearchChange(e.target.value)}
//               className="w-full p-4 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder-gray-500"
//             />
//             <div className="absolute right-3 top-3.5">
//               <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//               </svg>
//             </div>
//           </div>
//         </div>

//         {conversations.length === 0 ? (
//           <div className="bg-white rounded-2xl p-8 text-center border border-orange-200 shadow-lg">
//             <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <span className="text-4xl">💬</span>
//             </div>
//             <h2 className="text-2xl font-semibold text-black mb-4">No conversations yet</h2>
//             <p className="text-black mb-6">Start a conversation with someone in your network!</p>
//             <Link 
//               href="/network"
//               className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
//             >
//               Browse Network
//             </Link>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {/* NEW: Search results info */}
//             {searchQuery && (
//               <div className="text-sm text-black mb-2">
//                 {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''} found for "{searchQuery}"
//               </div>
//             )}

//             {filteredConversations.map((conversation) => (
//               <Link
//                 key={conversation.id}
//                 href={`/dashboard/messages/${conversation.id}`}
//                 className="block bg-white border border-orange-200 rounded-2xl p-4 hover:bg-orange-50 transition-colors shadow-sm"
//               >
//                 <div className="flex items-center space-x-4">
//                   {/* Profile image */}
//                   <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center border border-orange-300">
//                     {conversation.otherUserData?.photoURL ? (
//                       <img 
//                         src={conversation.otherUserData.photoURL} 
//                         alt={conversation.otherUserData.displayName || 'User'} 
//                         className="w-12 h-12 rounded-full" 
//                       />
//                     ) : (
//                       <span className="text-orange-500 font-semibold">
//                         {conversation.otherUserData?.displayName?.[0] || 'U'}
//                       </span>
//                     )}
//                   </div>
                  
//                   {/* Conversation details */}
//                   <div className="flex-1 min-w-0">
//                     <h3 className="font-semibold text-black truncate">
//                       {conversation.otherUserData?.displayName || 'Unknown User'}
//                     </h3>
//                     {conversation.lastMessage && (
//                       <p className="text-black text-sm truncate">
//                         {conversation.lastMessage}
//                       </p>
//                     )}
//                   </div>
                  
//                   {/* Timestamp */}
//                   {conversation.lastTimestamp && (
//                     <div className="text-sm text-black whitespace-nowrap">
//                       {conversation.lastTimestamp.toLocaleDateString()}
//                     </div>
//                   )}
//                 </div>
//               </Link>
//             ))}

//             {/* NEW: No search results message */}
//             {searchQuery && filteredConversations.length === 0 && (
//               <div className="text-center py-8">
//                 <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <span className="text-2xl">🔍</span>
//                 </div>
//                 <h3 className="text-lg font-medium text-black mb-2">No matches found</h3>
//                 <p className="text-black">Try different search terms or browse your network to start new conversations.</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
// import { useParams, useRouter, useSearchParams } from 'next/navigation';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import {
//   collection,
//   query,
//   where,
//   orderBy,
//   getDocs,
//   onSnapshot,
//   DocumentData,
//   updateDoc,
//   doc,
//   Timestamp,
//   addDoc
// } from 'firebase/firestore';
// import Link from 'next/link';
// import { debounce } from 'lodash';
// import { updateMessageStatus } from '@/lib/sendMessage';
// import { startTyping, stopTyping, debouncedStopTyping, listenForTyping } from '@/lib/typing';

// // Types
// interface Message {
//   id: string;
//   text: string;
//   senderId: string;
//   receiverId: string;
//   timestamp: Date;
//   status: 'sent' | 'delivered' | 'read';
//   conversationId: string;
// }

// interface Conversation {
//   id: string;
//   otherUserId: string;
//   lastMessage?: string;
//   lastTimestamp?: Date;
//   otherUserData?: DocumentData;
//   unreadCount?: number;
// }

// export default function UnifiedMessagesPage() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const conversationId = searchParams.get('id') || '';
//   const [user, loadingAuth] = useAuthState(auth);
//   const router = useRouter();
  
//   // State for conversations list
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [allConversations, setAllConversations] = useState<Conversation[]>([]);
//   const [loadingConversations, setLoadingConversations] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
  
//   // State for active conversation
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [otherUser, setOtherUser] = useState<DocumentData | null>(null);
//   const [sending, setSending] = useState(false);
//   const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
//   // Refs
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const unsubscribeMessagesRef = useRef<(() => void) | null>(null);
//   const unsubscribeTypingRef = useRef<(() => void) | null>(null);
//   const conversationViewedRef = useRef(false);
//   const messagesContainerRef = useRef<HTMLDivElement>(null);

//   // Auto-scroll to bottom when messages change
//   const scrollToBottom = () => {
//     if (messagesContainerRef.current) {
//       messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
//     }
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // ==================== CONVERSATIONS LIST LOGIC ====================
//   // Fetch user's conversations
//   useEffect(() => {
//     async function fetchConversations() {
//       if (user) {
//         try {
//           // Get all messages where the user is either sender or receiver
//           const messagesRef = collection(db, 'messages');
//           const sentMessagesQuery = query(
//             messagesRef,
//             where('senderId', '==', user.uid),
//             orderBy('timestamp', 'desc')
//           );
          
//           const receivedMessagesQuery = query(
//             messagesRef,
//             where('receiverId', '==', user.uid),
//             orderBy('timestamp', 'desc')
//           );
          
//           // Execute both queries
//           const [sentSnapshot, receivedSnapshot] = await Promise.all([
//             getDocs(sentMessagesQuery),
//             getDocs(receivedMessagesQuery)
//           ]);
          
//           // Combine all messages
//           const allMessages: any[] = [];
          
//           sentSnapshot.forEach((doc) => {
//             allMessages.push({ id: doc.id, ...doc.data() });
//           });
          
//           receivedSnapshot.forEach((doc) => {
//             allMessages.push({ id: doc.id, ...doc.data() });
//           });
          
//           // Group messages by conversationId and calculate unread counts
//           const conversationsMap = new Map<string, Conversation>();
          
//           allMessages.forEach((message) => {
//             const convId = message.conversationId;
//             const existingConversation = conversationsMap.get(convId);
            
//             // If this is a new conversation or this message is newer than the stored one
//             const messageTime = message.timestamp?.toDate?.() || new Date(0);
//             const existingTime = existingConversation?.lastTimestamp || new Date(0);
            
//             // Calculate unread count for this conversation
//             let unreadCount = existingConversation?.unreadCount || 0;
//             if (message.receiverId === user.uid && message.status !== 'read') {
//               unreadCount += 1;
//             }
            
//             if (!existingConversation || messageTime > existingTime) {
//               // Determine who the other user is
//               const otherUserId = message.senderId === user.uid ? message.receiverId : message.senderId;
              
//               conversationsMap.set(convId, {
//                 id: convId,
//                 otherUserId: otherUserId,
//                 lastMessage: message.text,
//                 lastTimestamp: messageTime,
//                 unreadCount: unreadCount
//               });
//             } else if (existingConversation) {
//               // Update unread count for existing conversation
//               conversationsMap.set(convId, {
//                 ...existingConversation,
//                 unreadCount: unreadCount
//               });
//             }
//           });
          
//           // Convert to array
//           const conversationsArray = Array.from(conversationsMap.values());
          
//           // Sort by most recent
//           conversationsArray.sort((a, b) => {
//             const timeA = a.lastTimestamp || new Date(0);
//             const timeB = b.lastTimestamp || new Date(0);
//             return timeB.getTime() - timeA.getTime();
//           });
          
//           // Fetch user data for each conversation
//           const conversationsWithUserData = await Promise.all(
//             conversationsArray.map(async (conversation) => {
//               try {
//                 const userQuery = query(collection(db, 'users'), where('__name__', '==', conversation.otherUserId));
//                 const userDoc = await getDocs(userQuery);
//                 if (!userDoc.empty) {
//                   return {
//                     ...conversation,
//                     otherUserData: userDoc.docs[0].data()
//                   };
//                 }
//               } catch (error) {
//                 console.error('Error fetching user data:', error);
//               }
//               return conversation;
//             })
//           );
          
//           setConversations(conversationsWithUserData);
//           setAllConversations(conversationsWithUserData);
//         } catch (error) {
//           console.error('Error fetching conversations:', error);
//         } finally {
//           setLoadingConversations(false);
//         }
//       }
//     }

//     if (user) {
//       fetchConversations();
      
//       // Set up real-time listener for new conversations
//       const messagesRef = collection(db, 'messages');
//       const q = query(
//         messagesRef,
//         where('receiverId', '==', user.uid),
//         orderBy('timestamp', 'desc')
//       );
      
//       const unsubscribe = onSnapshot(q, () => {
//         fetchConversations(); // Refresh conversations when new messages arrive
//       });
      
//       return () => unsubscribe();
//     }
//   }, [user]);

//   // Filter conversations based on search query
//   const filteredConversations = useMemo(() => {
//     if (!searchQuery.trim()) return conversations;
    
//     const query = searchQuery.toLowerCase().trim();
//     return conversations.filter(conversation => {
//       const userNameMatch = conversation.otherUserData?.displayName?.toLowerCase().includes(query);
//       const messageMatch = conversation.lastMessage?.toLowerCase().includes(query);
//       const headlineMatch = conversation.otherUserData?.headline?.toLowerCase().includes(query);
      
//       return userNameMatch || messageMatch || headlineMatch;
//     });
//   }, [conversations, searchQuery]);

//   // Debounced search handler
//   const handleSearchChange = debounce((value: string) => {
//     setSearchQuery(value);
//   }, 300);

//   // ==================== ACTIVE CONVERSATION LOGIC ====================
//   // Load messages for active conversation
//   useEffect(() => {
//     if (!user || !conversationId) {
//       setMessages([]);
//       setOtherUser(null);
//       return;
//     }

//     setLoadingMessages(true);

//     // Clean up previous listeners
//     if (unsubscribeMessagesRef.current) {
//       unsubscribeMessagesRef.current();
//       unsubscribeMessagesRef.current = null;
//     }
    
//     if (unsubscribeTypingRef.current) {
//       unsubscribeTypingRef.current();
//       unsubscribeTypingRef.current = null;
//     }

//     // Fetch other user data
//     const userIds = conversationId.split('_');
//     const otherUserId = userIds[0] === user.uid ? userIds[1] : userIds[0];
    
//     const fetchOtherUser = async () => {
//       try {
//         const userQuery = query(collection(db, 'users'), where('__name__', '==', otherUserId));
//         const userDoc = await getDocs(userQuery);
//         if (!userDoc.empty) {
//           setOtherUser(userDoc.docs[0].data());
//         }
//       } catch (error) {
//         console.error('Error fetching other user:', error);
//       }
//     };

//     fetchOtherUser();

//     // Set up real-time messages listener
//     const messagesRef = collection(db, 'messages');
//     const q = query(
//       messagesRef,
//       where('conversationId', '==', conversationId),
//       orderBy('timestamp', 'asc')
//     );

//     unsubscribeMessagesRef.current = onSnapshot(q, 
//       (snapshot) => {
//         const messagesData: Message[] = [];
//         snapshot.forEach((doc) => {
//           const data = doc.data();
//           messagesData.push({
//             id: doc.id,
//             text: data.text,
//             senderId: data.senderId,
//             receiverId: data.receiverId,
//             timestamp: data.timestamp?.toDate() || new Date(),
//             status: data.status || 'sent',
//             conversationId: data.conversationId,
//           });
//         });
//         setMessages(messagesData);
//         setLoadingMessages(false);
        
//         // Mark messages as delivered when they are received
//         markMessagesAsDelivered(messagesData);
//       },
//       (error) => {
//         console.error('Error in messages snapshot:', error);
//         setLoadingMessages(false);
//       }
//     );

//     // Set up typing listener
//     unsubscribeTypingRef.current = listenForTyping(
//       conversationId,
//       (users) => {
//         const otherTypingUsers = users.filter((uid) => uid !== user?.uid);
//         setTypingUsers(otherTypingUsers);
//       }
//     );

//     return () => {
//       if (unsubscribeMessagesRef.current) {
//         unsubscribeMessagesRef.current();
//       }
//       if (unsubscribeTypingRef.current) {
//         unsubscribeTypingRef.current();
//       }
//     };
//   }, [user, conversationId]);

//   // Mark messages as read when conversation is active
//   useEffect(() => {
//     if (!user || !conversationId || conversationViewedRef.current) return;
    
//     conversationViewedRef.current = true;
//     markMessagesAsRead();
//   }, [user, conversationId, messages]);

//   // Function to mark messages as read
//   const markMessagesAsRead = async () => {
//     if (!user) return;
    
//     try {
//       const messagesToMarkAsRead = messages.filter(
//         message => message.receiverId === user.uid && message.status !== 'read'
//       );
      
//       for (const message of messagesToMarkAsRead) {
//         await updateMessageStatus(message.id, 'read');
//       }
      
//       // Update conversations list to clear unread count
//       setConversations(prev => prev.map(conv => 
//         conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
//       ));
//     } catch (error) {
//       console.error('Error marking messages as read:', error);
//     }
//   };

//   // Function to mark messages as delivered
//   const markMessagesAsDelivered = async (messagesData: Message[]) => {
//     if (!user) return;
    
//     try {
//       const messagesToMarkAsDelivered = messagesData.filter(
//         message => message.receiverId === user.uid && message.status === 'sent'
//       );
      
//       for (const message of messagesToMarkAsDelivered) {
//         await updateMessageStatus(message.id, 'delivered');
//       }
//     } catch (error) {
//       console.error('Error marking messages as delivered:', error);
//     }
//   };

//   // Debounced function to handle typing
//   const handleInputChange = useCallback(
//     debounce((text: string) => {
//       if (!user || !conversationId) return;
      
//       if (text.trim().length > 0) {
//         startTyping(conversationId, user.uid);
//       } else {
//         debouncedStopTyping(conversationId, user.uid);
//       }
//     }, 500),
//     [user, conversationId]
//   );

//   // Handle message input with typing detection
//   const handleMessageChange = (text: string) => {
//     setNewMessage(text);
//     handleInputChange(text);
//   };

//   // Send message function
//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !user || !conversationId || sending) return;

//     setSending(true);
//     try {
//       // Stop typing before sending
//       await stopTyping(conversationId, user.uid);
      
//       const userIds = conversationId.split('_');
//       const receiverId = userIds[0] === user.uid ? userIds[1] : userIds[0];
      
//       // Send message to Firestore
//       await addDoc(collection(db, 'messages'), {
//         text: newMessage,
//         senderId: user.uid,
//         receiverId: receiverId,
//         timestamp: Timestamp.now(),
//         status: 'sent',
//         conversationId: conversationId
//       });
      
//       setNewMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//       alert('Failed to send message. Please try again.');
//     } finally {
//       setSending(false);
//     }
//   };

//   // Clean up typing status when component unmounts
//   useEffect(() => {
//     return () => {
//       if (user && conversationId) {
//         debouncedStopTyping(conversationId, user.uid);
//       }
//     };
//   }, [user, conversationId]);

//   // Function to get status icon
//   const getStatusIcon = (status: string, isSender: boolean) => {
//     if (!isSender) return null;
    
//     switch (status) {
//       case 'sent':
//         return <span className="text-xs">✓</span>;
//       case 'delivered':
//         return <span className="text-xs">✓✓</span>;
//       case 'read':
//         return <span className="text-xs text-blue-400">✓✓</span>;
//       default:
//         return null;
//     }
//   };

//   // Format date for conversation list
//   const formatListDate = (timestamp?: Date) => {
//     if (!timestamp) return '';
//     const now = new Date();
//     const diffMs = now.getTime() - timestamp.getTime();
//     const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
//     if (diffDays === 0) {
//       return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } else if (diffDays === 1) {
//       return 'Yesterday';
//     } else if (diffDays < 7) {
//       return timestamp.toLocaleDateString([], { weekday: 'short' });
//     } else {
//       return timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' });
//     }
//   };

//   // Format time for messages
//   const formatMessageTime = (timestamp: Date) => {
//     return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   // Select conversation
//   const selectConversation = (convId: string) => {
//     router.push(`/dashboard/messages?id=${convId}`);
//   };

//   // Go back to conversations list (for mobile)
//   const goBackToList = () => {
//     router.push('/dashboard/messages');
//   };

//   if (loadingAuth) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-xl font-semibold text-black mb-4">Please log in to view messages</h1>
//           <button
//             onClick={() => router.push('/login')}
//             className="bg-orange-500 text-white px-6 py-2 rounded-lg"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Desktop Layout - Two Columns */}
//       <div className="hidden md:flex h-screen">
//         {/* Left Sidebar - Conversations List */}
//         <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
//           {/* Header */}
//           <div className="p-4 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <h1 className="text-xl font-bold text-black">Messages</h1>
//               <Link
//                 href="/network"
//                 className="text-orange-500 hover:text-orange-600 text-sm font-medium"
//               >
//                 Find People
//               </Link>
//             </div>
            
//             {/* Search Bar */}
//             <div className="mt-4">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search conversations..."
//                   onChange={(e) => handleSearchChange(e.target.value)}
//                   className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder-gray-500 pl-10"
//                 />
//                 <div className="absolute left-3 top-3.5">
//                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Conversations List */}
//           <div className="flex-1 overflow-y-auto">
//             {loadingConversations ? (
//               <div className="p-4 text-center">
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
//                 <p className="mt-2 text-sm text-gray-500">Loading conversations...</p>
//               </div>
//             ) : filteredConversations.length === 0 ? (
//               <div className="p-8 text-center">
//                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <span className="text-2xl">💬</span>
//                 </div>
//                 <h3 className="text-lg font-medium text-black mb-2">
//                   {searchQuery ? 'No matches found' : 'No conversations yet'}
//                 </h3>
//                 <p className="text-gray-500 text-sm mb-4">
//                   {searchQuery ? 'Try different search terms' : 'Start a conversation with someone in your network!'}
//                 </p>
//                 <Link
//                   href="/network"
//                   className="inline-block bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
//                 >
//                   Browse Network
//                 </Link>
//               </div>
//             ) : (
//               <div className="divide-y divide-gray-100">
//                 {filteredConversations.map((conversation) => (
//                   <div
//                     key={conversation.id}
//                     onClick={() => selectConversation(conversation.id)}
//                     className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
//                       conversationId === conversation.id ? 'bg-orange-50 border-r-2 border-orange-500' : ''
//                     }`}
//                   >
//                     <div className="flex items-center space-x-3">
//                       {/* Profile Image */}
//                       <div className="relative">
//                         <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
//                           {conversation.otherUserData?.photoURL ? (
//                             <img
//                               src={conversation.otherUserData.photoURL}
//                               alt={conversation.otherUserData.displayName}
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <span className="text-orange-500 font-semibold">
//                               {conversation.otherUserData?.displayName?.[0] || 'U'}
//                             </span>
//                           )}
//                         </div>
//                         {/* Online Status */}
//                         <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                       </div>

//                       {/* Conversation Details */}
//                       <div className="flex-1 min-w-0">
//                         <div className="flex justify-between items-start">
//                           <h3 className="font-semibold text-black truncate">
//                             {conversation.otherUserData?.displayName || 'Unknown User'}
//                           </h3>
//                           <span className="text-xs text-gray-500 whitespace-nowrap">
//                             {formatListDate(conversation.lastTimestamp)}
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center mt-1">
//                           <p className="text-sm text-gray-600 truncate max-w-[150px]">
//                             {conversation.lastMessage || 'No messages yet'}
//                           </p>
//                           {conversation.unreadCount && conversation.unreadCount > 0 && (
//                             <span className="bg-orange-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
//                               {conversation.unreadCount}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Main Area - Active Conversation or Welcome */}
//         <div className="w-2/3 bg-white flex flex-col">
//           {conversationId ? (
//             <>
//               {/* Conversation Header */}
//               <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
//                     {otherUser?.photoURL ? (
//                       <img
//                         src={otherUser.photoURL}
//                         alt={otherUser.displayName}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <span className="text-orange-500 font-semibold">
//                         {otherUser?.displayName?.[0] || 'U'}
//                       </span>
//                     )}
//                   </div>
//                   <div>
//                     <h2 className="font-semibold text-black">{otherUser?.displayName || 'User'}</h2>
//                     <p className="text-xs text-gray-500">
//                       {typingUsers.length > 0 ? 'typing...' : otherUser?.headline || 'Active now'}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Messages Area */}
//               <div
//                 ref={messagesContainerRef}
//                 className="flex-1 overflow-y-auto p-4 bg-gray-50"
//               >
//                 {loadingMessages ? (
//                   <div className="flex justify-center items-center h-full">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
//                   </div>
//                 ) : messages.length === 0 ? (
//                   <div className="flex justify-center items-center h-full">
//                     <div className="text-center">
//                       <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <span className="text-2xl">💬</span>
//                       </div>
//                       <h3 className="text-lg font-medium text-black mb-2">No messages yet</h3>
//                       <p className="text-gray-500">Start the conversation!</p>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {messages.map((message) => {
//                       const isSender = message.senderId === user.uid;
//                       return (
//                         <div
//                           key={message.id}
//                           className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
//                         >
//                           <div
//                             className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2 ${
//                               isSender
//                                 ? 'bg-orange-500 text-white rounded-br-none'
//                                 : 'bg-white text-black border border-gray-200 rounded-bl-none'
//                             }`}
//                           >
//                             <p className="text-sm">{message.text}</p>
//                             <div className="flex justify-between items-center mt-1">
//                               <span className={`text-xs ${isSender ? 'text-orange-200' : 'text-gray-500'}`}>
//                                 {formatMessageTime(message.timestamp)}
//                               </span>
//                               {isSender && (
//                                 <span className="ml-2">
//                                   {getStatusIcon(message.status, isSender)}
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
                    
//                     {/* Typing Indicator */}
//                     {typingUsers.length > 0 && (
//                       <div className="flex justify-start">
//                         <div className="bg-white border border-gray-200 text-black max-w-xs px-4 py-2 rounded-2xl rounded-bl-none">
//                           <div className="flex items-center">
//                             <div className="flex space-x-1">
//                               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
//                             </div>
//                             <span className="ml-2 text-sm text-gray-500">typing...</span>
//                           </div>
//                         </div>
//                       </div>
//                     )}
                    
//                     <div ref={messagesEndRef} />
//                   </div>
//                 )}
//               </div>

//               {/* Message Input */}
//               <div className="p-4 border-t border-gray-200 bg-white">
//                 <form onSubmit={handleSendMessage} className="flex gap-2">
//                   <input
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => handleMessageChange(e.target.value)}
//                     placeholder="Type a message..."
//                     className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder-gray-500"
//                     disabled={sending}
//                   />
//                   <button
//                     type="submit"
//                     disabled={!newMessage.trim() || sending}
//                     className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
//                   >
//                     {sending ? (
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                     ) : (
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
//                       </svg>
//                     )}
//                   </button>
//                 </form>
//               </div>
//             </>
//           ) : (
//             /* Welcome Screen when no conversation selected */
//             <div className="flex-1 flex flex-col items-center justify-center p-8">
//               <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
//                 <span className="text-5xl">💬</span>
//               </div>
//               <h2 className="text-2xl font-bold text-black mb-3">Your Messages</h2>
//               <p className="text-gray-600 text-center max-w-md mb-8">
//                 Select a conversation from the list to start messaging, or find new people to connect with.
//               </p>
//               <div className="flex gap-4">
//                 <Link
//                   href="/network"
//                   className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
//                 >
//                   Browse Network
//                 </Link>
//                 <button
//                   onClick={() => router.push('/referral/marketplace')}
//                   className="bg-white border border-orange-500 text-orange-500 px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors"
//                 >
//                   Find Referral Jobs
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Mobile Layout - Single Column */}
//       <div className="md:hidden h-screen bg-white">
//         {conversationId ? (
//           /* Mobile Conversation View */
//           <div className="h-full flex flex-col">
//             {/* Header with back button */}
//             <div className="p-4 border-b border-gray-200 flex items-center">
//               <button
//                 onClick={goBackToList}
//                 className="mr-3 text-orange-500 p-2"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
//                 </svg>
//               </button>
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
//                   {otherUser?.photoURL ? (
//                     <img
//                       src={otherUser.photoURL}
//                       alt={otherUser.displayName}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <span className="text-orange-500 font-semibold">
//                       {otherUser?.displayName?.[0] || 'U'}
//                     </span>
//                   )}
//                 </div>
//                 <div>
//                   <h2 className="font-semibold text-black">{otherUser?.displayName || 'User'}</h2>
//                   <p className="text-xs text-gray-500">
//                     {typingUsers.length > 0 ? 'typing...' : otherUser?.headline || 'Active now'}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Messages */}
//             <div
//               ref={messagesContainerRef}
//               className="flex-1 overflow-y-auto p-4 bg-gray-50"
//             >
//               {loadingMessages ? (
//                 <div className="flex justify-center items-center h-full">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
//                 </div>
//               ) : messages.length === 0 ? (
//                 <div className="flex justify-center items-center h-full">
//                   <div className="text-center">
//                     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <span className="text-2xl">💬</span>
//                     </div>
//                     <h3 className="text-lg font-medium text-black mb-2">No messages yet</h3>
//                     <p className="text-gray-500">Start the conversation!</p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {messages.map((message) => {
//                     const isSender = message.senderId === user.uid;
//                     return (
//                       <div
//                         key={message.id}
//                         className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
//                       >
//                         <div
//                           className={`max-w-xs rounded-2xl px-4 py-2 ${
//                             isSender
//                               ? 'bg-orange-500 text-white rounded-br-none'
//                               : 'bg-white text-black border border-gray-200 rounded-bl-none'
//                           }`}
//                         >
//                           <p className="text-sm">{message.text}</p>
//                           <div className="flex justify-between items-center mt-1">
//                             <span className={`text-xs ${isSender ? 'text-orange-200' : 'text-gray-500'}`}>
//                               {formatMessageTime(message.timestamp)}
//                             </span>
//                             {isSender && (
//                               <span className="ml-2">
//                                 {getStatusIcon(message.status, isSender)}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
                  
//                   {/* Typing Indicator */}
//                   {typingUsers.length > 0 && (
//                     <div className="flex justify-start">
//                       <div className="bg-white border border-gray-200 text-black max-w-xs px-4 py-2 rounded-2xl rounded-bl-none">
//                         <div className="flex items-center">
//                           <div className="flex space-x-1">
//                             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
//                           </div>
//                           <span className="ml-2 text-sm text-gray-500">typing...</span>
//                         </div>
//                       </div>
//                     </div>
//                   )}
                  
//                   <div ref={messagesEndRef} />
//                 </div>
//               )}
//             </div>

//             {/* Message Input */}
//             <div className="p-4 border-t border-gray-200 bg-white">
//               <form onSubmit={handleSendMessage} className="flex gap-2">
//                 <input
//                   type="text"
//                   value={newMessage}
//                   onChange={(e) => handleMessageChange(e.target.value)}
//                   placeholder="Type a message..."
//                   className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder-gray-500"
//                   disabled={sending}
//                 />
//                 <button
//                   type="submit"
//                   disabled={!newMessage.trim() || sending}
//                   className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
//                 >
//                   {sending ? (
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                   ) : (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
//                     </svg>
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>
//         ) : (
//           /* Mobile Conversations List */
//           <div className="h-full flex flex-col">
//             {/* Header */}
//             <div className="p-4 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h1 className="text-xl font-bold text-black">Messages</h1>
//                 <Link
//                   href="/network"
//                   className="text-orange-500 hover:text-orange-600 text-sm font-medium"
//                 >
//                   Find People
//                 </Link>
//               </div>
              
//               {/* Search Bar */}
//               <div className="mt-4">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Search conversations..."
//                     onChange={(e) => handleSearchChange(e.target.value)}
//                     className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder-gray-500 pl-10"
//                   />
//                   <div className="absolute left-3 top-3.5">
//                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Conversations List */}
//             <div className="flex-1 overflow-y-auto">
//               {loadingConversations ? (
//                 <div className="p-4 text-center">
//                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
//                   <p className="mt-2 text-sm text-gray-500">Loading conversations...</p>
//                 </div>
//               ) : filteredConversations.length === 0 ? (
//                 <div className="p-8 text-center">
//                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <span className="text-2xl">💬</span>
//                   </div>
//                   <h3 className="text-lg font-medium text-black mb-2">
//                     {searchQuery ? 'No matches found' : 'No conversations yet'}
//                   </h3>
//                   <p className="text-gray-500 text-sm mb-4">
//                     {searchQuery ? 'Try different search terms' : 'Start a conversation with someone in your network!'}
//                   </p>
//                   <Link
//                     href="/network"
//                     className="inline-block bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
//                   >
//                     Browse Network
//                   </Link>
//                 </div>
//               ) : (
//                 <div className="divide-y divide-gray-100">
//                   {filteredConversations.map((conversation) => (
//                     <div
//                       key={conversation.id}
//                       onClick={() => selectConversation(conversation.id)}
//                       className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
//                     >
//                       <div className="flex items-center space-x-3">
//                         {/* Profile Image */}
//                         <div className="relative">
//                           <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
//                             {conversation.otherUserData?.photoURL ? (
//                               <img
//                                 src={conversation.otherUserData.photoURL}
//                                 alt={conversation.otherUserData.displayName}
//                                 className="w-full h-full object-cover"
//                               />
//                             ) : (
//                               <span className="text-orange-500 font-semibold">
//                                 {conversation.otherUserData?.displayName?.[0] || 'U'}
//                               </span>
//                             )}
//                           </div>
//                           {/* Online Status */}
//                           <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                         </div>

//                         {/* Conversation Details */}
//                         <div className="flex-1 min-w-0">
//                           <div className="flex justify-between items-start">
//                             <h3 className="font-semibold text-black truncate">
//                               {conversation.otherUserData?.displayName || 'Unknown User'}
//                             </h3>
//                             <span className="text-xs text-gray-500 whitespace-nowrap">
//                               {formatListDate(conversation.lastTimestamp)}
//                             </span>
//                           </div>
//                           <div className="flex justify-between items-center mt-1">
//                             <p className="text-sm text-gray-600 truncate max-w-[150px]">
//                               {conversation.lastMessage || 'No messages yet'}
//                             </p>
//                             {conversation.unreadCount && conversation.unreadCount > 0 && (
//                               <span className="bg-orange-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
//                                 {conversation.unreadCount}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// here is the working previous code 


// 'use client';

// import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
// import { useParams, useRouter, useSearchParams } from 'next/navigation';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import {
//   collection,
//   query,
//   where,
//   orderBy,
//   getDocs,
//   onSnapshot,
//   DocumentData,
//   updateDoc,
//   doc,
//   Timestamp,
//   addDoc
// } from 'firebase/firestore';
// import Link from 'next/link';
// import { debounce } from 'lodash';
// import { updateMessageStatus } from '@/lib/sendMessage';
// import { startTyping, stopTyping, debouncedStopTyping, listenForTyping } from '@/lib/typing';

// // Types
// interface Message {
//   id: string;
//   text: string;
//   senderId: string;
//   receiverId: string;
//   timestamp: Date;
//   status: 'sent' | 'delivered' | 'read';
//   conversationId: string;
// }

// interface Conversation {
//   id: string;
//   otherUserId: string;
//   lastMessage?: string;
//   lastTimestamp?: Date;
//   otherUserData?: DocumentData;
//   unreadCount?: number;
// }

// export default function UnifiedMessagesPage() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const conversationId = searchParams.get('id') || '';
//   const [user, loadingAuth] = useAuthState(auth);
//   const router = useRouter();
  
//   // State for conversations list
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [allConversations, setAllConversations] = useState<Conversation[]>([]);
//   const [loadingConversations, setLoadingConversations] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
  
//   // State for active conversation
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [otherUser, setOtherUser] = useState<DocumentData | null>(null);
//   const [sending, setSending] = useState(false);
//   const [typingUsers, setTypingUsers] = useState<string[]>([]);
//   const [isUserTyping, setIsUserTyping] = useState(false);
  
//   // Refs
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const unsubscribeMessagesRef = useRef<(() => void) | null>(null);
//   const unsubscribeTypingRef = useRef<(() => void) | null>(null);
//   const messagesContainerRef = useRef<HTMLDivElement>(null);
//   const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   // Auto-scroll to bottom when messages change
//   const scrollToBottom = () => {
//     if (messagesContainerRef.current) {
//       messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
//     }
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // ==================== CONVERSATIONS LIST LOGIC ====================
//   // Fetch user's conversations
//   useEffect(() => {
//     async function fetchConversations() {
//       if (user) {
//         try {
//           // Get all messages where the user is either sender or receiver
//           const messagesRef = collection(db, 'messages');
//           const sentMessagesQuery = query(
//             messagesRef,
//             where('senderId', '==', user.uid),
//             orderBy('timestamp', 'desc')
//           );
          
//           const receivedMessagesQuery = query(
//             messagesRef,
//             where('receiverId', '==', user.uid),
//             orderBy('timestamp', 'desc')
//           );
          
//           // Execute both queries
//           const [sentSnapshot, receivedSnapshot] = await Promise.all([
//             getDocs(sentMessagesQuery),
//             getDocs(receivedMessagesQuery)
//           ]);
          
//           // Combine all messages
//           const allMessages: any[] = [];
          
//           sentSnapshot.forEach((doc) => {
//             allMessages.push({ id: doc.id, ...doc.data() });
//           });
          
//           receivedSnapshot.forEach((doc) => {
//             allMessages.push({ id: doc.id, ...doc.data() });
//           });
          
//           // Group messages by conversationId and calculate unread counts
//           const conversationsMap = new Map<string, Conversation>();
          
//           allMessages.forEach((message) => {
//             const convId = message.conversationId;
//             const existingConversation = conversationsMap.get(convId);
            
//             // If this is a new conversation or this message is newer than the stored one
//             const messageTime = message.timestamp?.toDate?.() || new Date(0);
//             const existingTime = existingConversation?.lastTimestamp || new Date(0);
            
//             // Calculate unread count for this conversation
//             let unreadCount = existingConversation?.unreadCount || 0;
//             if (message.receiverId === user.uid && message.status !== 'read') {
//               unreadCount += 1;
//             }
            
//             if (!existingConversation || messageTime > existingTime) {
//               // Determine who the other user is
//               const otherUserId = message.senderId === user.uid ? message.receiverId : message.senderId;
              
//               conversationsMap.set(convId, {
//                 id: convId,
//                 otherUserId: otherUserId,
//                 lastMessage: message.text,
//                 lastTimestamp: messageTime,
//                 unreadCount: unreadCount
//               });
//             } else if (existingConversation) {
//               // Update unread count for existing conversation
//               conversationsMap.set(convId, {
//                 ...existingConversation,
//                 lastMessage: message.text,
//                 lastTimestamp: messageTime,
//                 unreadCount: unreadCount
//               });
//             }
//           });
          
//           // Convert to array
//           const conversationsArray = Array.from(conversationsMap.values());
          
//           // Sort by most recent
//           conversationsArray.sort((a, b) => {
//             const timeA = a.lastTimestamp || new Date(0);
//             const timeB = b.lastTimestamp || new Date(0);
//             return timeB.getTime() - timeA.getTime();
//           });
          
//           // Fetch user data for each conversation
//           const conversationsWithUserData = await Promise.all(
//             conversationsArray.map(async (conversation) => {
//               try {
//                 const userQuery = query(collection(db, 'users'), where('__name__', '==', conversation.otherUserId));
//                 const userDoc = await getDocs(userQuery);
//                 if (!userDoc.empty) {
//                   return {
//                     ...conversation,
//                     otherUserData: userDoc.docs[0].data()
//                   };
//                 }
//               } catch (error) {
//                 console.error('Error fetching user data:', error);
//               }
//               return conversation;
//             })
//           );
          
//           setConversations(conversationsWithUserData);
//           setAllConversations(conversationsWithUserData);
//         } catch (error) {
//           console.error('Error fetching conversations:', error);
//         } finally {
//           setLoadingConversations(false);
//         }
//       }
//     }

//     if (user) {
//       fetchConversations();
      
//       // Set up real-time listener for new conversations
//       const messagesRef = collection(db, 'messages');
//       const q = query(
//         messagesRef,
//         where('receiverId', '==', user.uid),
//         orderBy('timestamp', 'desc')
//       );
      
//       const unsubscribe = onSnapshot(q, () => {
//         fetchConversations(); // Refresh conversations when new messages arrive
//       });
      
//       return () => unsubscribe();
//     }
//   }, [user]);

//   // Filter conversations based on search query
//   const filteredConversations = useMemo(() => {
//     if (!searchQuery.trim()) return conversations;
    
//     const query = searchQuery.toLowerCase().trim();
//     return conversations.filter(conversation => {
//       const userNameMatch = conversation.otherUserData?.displayName?.toLowerCase().includes(query);
//       const messageMatch = conversation.lastMessage?.toLowerCase().includes(query);
//       const headlineMatch = conversation.otherUserData?.headline?.toLowerCase().includes(query);
      
//       return userNameMatch || messageMatch || headlineMatch;
//     });
//   }, [conversations, searchQuery]);

//   // Debounced search handler
//   const handleSearchChange = debounce((value: string) => {
//     setSearchQuery(value);
//   }, 300);

//   // ==================== ACTIVE CONVERSATION LOGIC ====================
//   // Load messages for active conversation
//   useEffect(() => {
//     if (!user || !conversationId) {
//       setMessages([]);
//       setOtherUser(null);
//       setTypingUsers([]);
//       return;
//     }

//     setLoadingMessages(true);

//     // Clean up previous listeners
//     if (unsubscribeMessagesRef.current) {
//       unsubscribeMessagesRef.current();
//       unsubscribeMessagesRef.current = null;
//     }
    
//     if (unsubscribeTypingRef.current) {
//       unsubscribeTypingRef.current();
//       unsubscribeTypingRef.current = null;
//     }

//     // Fetch other user data
//     const userIds = conversationId.split('_');
//     const otherUserId = userIds[0] === user.uid ? userIds[1] : userIds[0];
    
//     const fetchOtherUser = async () => {
//       try {
//         const userQuery = query(collection(db, 'users'), where('__name__', '==', otherUserId));
//         const userDoc = await getDocs(userQuery);
//         if (!userDoc.empty) {
//           setOtherUser(userDoc.docs[0].data());
//         }
//       } catch (error) {
//         console.error('Error fetching other user:', error);
//       }
//     };

//     fetchOtherUser();

//     // Set up real-time messages listener
//     const messagesRef = collection(db, 'messages');
//     const q = query(
//       messagesRef,
//       where('conversationId', '==', conversationId),
//       orderBy('timestamp', 'asc')
//     );

//     unsubscribeMessagesRef.current = onSnapshot(q, 
//       (snapshot) => {
//         const messagesData: Message[] = [];
//         snapshot.forEach((doc) => {
//           const data = doc.data();
//           messagesData.push({
//             id: doc.id,
//             text: data.text,
//             senderId: data.senderId,
//             receiverId: data.receiverId,
//             timestamp: data.timestamp?.toDate() || new Date(),
//             status: data.status || 'sent',
//             conversationId: data.conversationId,
//           });
//         });
//         setMessages(messagesData);
//         setLoadingMessages(false);
        
//         // Mark messages as delivered when they are received
//         markMessagesAsDelivered(messagesData);
        
//         // Clear unread count for this conversation
//         clearUnreadCount(conversationId);
//       },
//       (error) => {
//         console.error('Error in messages snapshot:', error);
//         setLoadingMessages(false);
//       }
//     );

//     // Set up typing listener with proper cleanup
//     unsubscribeTypingRef.current = listenForTyping(
//       conversationId,
//       (users) => {
//         // Filter out current user and handle cleanup
//         const otherTypingUsers = users.filter((uid) => uid !== user?.uid);
        
//         // Clear previous timeout
//         if (typingTimeoutRef.current) {
//           clearTimeout(typingTimeoutRef.current);
//         }
        
//         // Set new users
//         setTypingUsers(otherTypingUsers);
        
//         // If users are typing, set a timeout to clear them after 3 seconds (in case listener fails)
//         if (otherTypingUsers.length > 0) {
//           typingTimeoutRef.current = setTimeout(() => {
//             setTypingUsers([]);
//           }, 3000);
//         }
//       }
//     );

//     return () => {
//       if (unsubscribeMessagesRef.current) {
//         unsubscribeMessagesRef.current();
//       }
//       if (unsubscribeTypingRef.current) {
//         unsubscribeTypingRef.current();
//       }
//       if (typingTimeoutRef.current) {
//         clearTimeout(typingTimeoutRef.current);
//       }
//     };
//   }, [user, conversationId]);

//   // Function to mark messages as delivered
//   const markMessagesAsDelivered = async (messagesData: Message[]) => {
//     if (!user) return;
    
//     try {
//       const messagesToMarkAsDelivered = messagesData.filter(
//         message => message.receiverId === user.uid && message.status === 'sent'
//       );
      
//       for (const message of messagesToMarkAsDelivered) {
//         await updateMessageStatus(message.id, 'delivered');
//       }
//     } catch (error) {
//       console.error('Error marking messages as delivered:', error);
//     }
//   };

//   // Function to clear unread count for a conversation
//   const clearUnreadCount = async (convId: string) => {
//     if (!user) return;
    
//     try {
//       // Mark all messages as read in this conversation
//       const messagesToMarkAsRead = messages.filter(
//         message => message.receiverId === user.uid && message.status !== 'read'
//       );
      
//       for (const message of messagesToMarkAsRead) {
//         await updateMessageStatus(message.id, 'read');
//       }
      
//       // Update conversations list to clear unread count
//       setConversations(prev => prev.map(conv => 
//         conv.id === convId ? { ...conv, unreadCount: 0 } : conv
//       ));
      
//       // Also update allConversations for consistency
//       setAllConversations(prev => prev.map(conv => 
//         conv.id === convId ? { ...conv, unreadCount: 0 } : conv
//       ));
//     } catch (error) {
//       console.error('Error clearing unread count:', error);
//     }
//   };

//   // Debounced function to handle typing with proper cleanup
//   const handleInputChange = useCallback(
//     debounce((text: string) => {
//       if (!user || !conversationId) return;
      
//       if (text.trim().length > 0) {
//         setIsUserTyping(true);
//         startTyping(conversationId, user.uid);
//       } else {
//         setIsUserTyping(false);
//         debouncedStopTyping(conversationId, user.uid);
//       }
//     }, 500),
//     [user, conversationId]
//   );

//   // Handle message input with typing detection
//   const handleMessageChange = (text: string) => {
//     setNewMessage(text);
//     handleInputChange(text);
//   };

//   // Send message function
//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !user || !conversationId || sending) return;

//     setSending(true);
//     try {
//       // Stop typing before sending
//       setIsUserTyping(false);
//       await stopTyping(conversationId, user.uid);
      
//       const userIds = conversationId.split('_');
//       const receiverId = userIds[0] === user.uid ? userIds[1] : userIds[0];
      
//       // Send message to Firestore
//       await addDoc(collection(db, 'messages'), {
//         text: newMessage,
//         senderId: user.uid,
//         receiverId: receiverId,
//         timestamp: Timestamp.now(),
//         status: 'sent',
//         conversationId: conversationId
//       });
      
//       setNewMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//       alert('Failed to send message. Please try again.');
//     } finally {
//       setSending(false);
//     }
//   };

//   // Clean up typing status when component unmounts
//   useEffect(() => {
//     return () => {
//       if (user && conversationId) {
//         setIsUserTyping(false);
//         debouncedStopTyping(conversationId, user.uid);
//       }
//       if (typingTimeoutRef.current) {
//         clearTimeout(typingTimeoutRef.current);
//       }
//     };
//   }, [user, conversationId]);

//   // Function to get status icon
//   const getStatusIcon = (status: string, isSender: boolean) => {
//     if (!isSender) return null;
    
//     switch (status) {
//       case 'sent':
//         return <span className="text-xs">✓</span>;
//       case 'delivered':
//         return <span className="text-xs">✓✓</span>;
//       case 'read':
//         return <span className="text-xs text-blue-400">✓✓</span>;
//       default:
//         return null;
//     }
//   };

//   // Format date for conversation list
//   const formatListDate = (timestamp?: Date) => {
//     if (!timestamp) return '';
//     const now = new Date();
//     const diffMs = now.getTime() - timestamp.getTime();
//     const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
//     if (diffDays === 0) {
//       return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } else if (diffDays === 1) {
//       return 'Yesterday';
//     } else if (diffDays < 7) {
//       return timestamp.toLocaleDateString([], { weekday: 'short' });
//     } else {
//       return timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' });
//     }
//   };

//   // Format time for messages
//   const formatMessageTime = (timestamp: Date) => {
//     return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   // Select conversation
//   const selectConversation = (convId: string) => {
//     // Clear typing indicators when switching conversations
//     setTypingUsers([]);
//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }
    
//     router.push(`/dashboard/messages?id=${convId}`);
//   };

//   // Go back to conversations list (for mobile)
//   const goBackToList = () => {
//     router.push('/dashboard/messages');
//   };

//   if (loadingAuth) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-xl font-semibold text-black mb-4">Please log in to view messages</h1>
//           <button
//             onClick={() => router.push('/login')}
//             className="bg-orange-500 text-white px-6 py-2 rounded-lg"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Desktop Layout - Two Columns */}
//       <div className="hidden md:flex h-screen">
//         {/* Left Sidebar - Conversations List */}
//         <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
//           {/* Header */}
//           <div className="p-4 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <h1 className="text-xl font-bold text-black">Messages</h1>
//               <Link
//                 href="/network"
//                 className="text-orange-500 hover:text-orange-600 text-sm font-medium"
//               >
//                 Find People
//               </Link>
//             </div>
            
//             {/* Search Bar */}
//             <div className="mt-4">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search conversations..."
//                   onChange={(e) => handleSearchChange(e.target.value)}
//                   className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder-gray-500 pl-10"
//                 />
//                 <div className="absolute left-3 top-3.5">
//                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Conversations List */}
//           <div className="flex-1 overflow-y-auto">
//             {loadingConversations ? (
//               <div className="p-4 text-center">
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
//                 <p className="mt-2 text-sm text-gray-500">Loading conversations...</p>
//               </div>
//             ) : filteredConversations.length === 0 ? (
//               <div className="p-8 text-center">
//                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <span className="text-2xl">💬</span>
//                 </div>
//                 <h3 className="text-lg font-medium text-black mb-2">
//                   {searchQuery ? 'No matches found' : 'No conversations yet'}
//                 </h3>
//                 <p className="text-gray-500 text-sm mb-4">
//                   {searchQuery ? 'Try different search terms' : 'Start a conversation with someone in your network!'}
//                 </p>
//                 <Link
//                   href="/network"
//                   className="inline-block bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
//                 >
//                   Browse Network
//                 </Link>
//               </div>
//             ) : (
//               <div className="divide-y divide-gray-100">
//                 {filteredConversations.map((conversation) => (
//                   <div
//                     key={conversation.id}
//                     onClick={() => selectConversation(conversation.id)}
//                     className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
//                       conversationId === conversation.id ? 'bg-orange-50 border-r-2 border-orange-500' : ''
//                     }`}
//                   >
//                     <div className="flex items-center space-x-3">
//                       {/* Profile Image - NO GREEN DOT */}
//                       <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
//                         {conversation.otherUserData?.photoURL ? (
//                           <img
//                             src={conversation.otherUserData.photoURL}
//                             alt={conversation.otherUserData.displayName}
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <span className="text-orange-500 font-semibold">
//                             {conversation.otherUserData?.displayName?.[0] || 'U'}
//                           </span>
//                         )}
//                       </div>

//                       {/* Conversation Details */}
//                       <div className="flex-1 min-w-0">
//                         <div className="flex justify-between items-start">
//                           <h3 className="font-semibold text-black truncate">
//                             {conversation.otherUserData?.displayName || 'Unknown User'}
//                           </h3>
//                           <span className="text-xs text-gray-500 whitespace-nowrap">
//                             {formatListDate(conversation.lastTimestamp)}
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center mt-1">
//                           <p className="text-sm text-gray-600 truncate max-w-[150px]">
//                             {conversation.lastMessage || 'No messages yet'}
//                           </p>
//                           {conversation.unreadCount && conversation.unreadCount > 0 && (
//                             <span className="bg-orange-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
//                               {conversation.unreadCount}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Main Area - Active Conversation or Welcome */}
//         <div className="w-2/3 bg-white flex flex-col">
//           {conversationId ? (
//             <>
//               {/* Conversation Header */}
//               <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
//                     {otherUser?.photoURL ? (
//                       <img
//                         src={otherUser.photoURL}
//                         alt={otherUser.displayName}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <span className="text-orange-500 font-semibold">
//                         {otherUser?.displayName?.[0] || 'U'}
//                       </span>
//                     )}
//                   </div>
//                   <div>
//                     <h2 className="font-semibold text-black">{otherUser?.displayName || 'User'}</h2>
//                     {/* REMOVED "Active now" text */}
//                     <p className="text-xs text-gray-500">
//                       {typingUsers.length > 0 ? 'typing...' : otherUser?.headline || ''}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Messages Area */}
//               <div
//                 ref={messagesContainerRef}
//                 className="flex-1 overflow-y-auto p-4 bg-gray-50"
//               >
//                 {loadingMessages ? (
//                   <div className="flex justify-center items-center h-full">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
//                   </div>
//                 ) : messages.length === 0 ? (
//                   <div className="flex justify-center items-center h-full">
//                     <div className="text-center">
//                       <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <span className="text-2xl">💬</span>
//                       </div>
//                       <h3 className="text-lg font-medium text-black mb-2">No messages yet</h3>
//                       <p className="text-gray-500">Start the conversation!</p>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {messages.map((message) => {
//                       const isSender = message.senderId === user.uid;
//                       return (
//                         <div
//                           key={message.id}
//                           className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
//                         >
//                           <div
//                             className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2 ${
//                               isSender
//                                 ? 'bg-orange-500 text-white rounded-br-none'
//                                 : 'bg-white text-black border border-gray-200 rounded-bl-none'
//                             }`}
//                           >
//                             <p className="text-sm">{message.text}</p>
//                             <div className="flex justify-between items-center mt-1">
//                               <span className={`text-xs ${isSender ? 'text-orange-200' : 'text-gray-500'}`}>
//                                 {formatMessageTime(message.timestamp)}
//                               </span>
//                               {isSender && (
//                                 <span className="ml-2">
//                                   {getStatusIcon(message.status, isSender)}
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
                    
//                     {/* Typing Indicator */}
//                     {typingUsers.length > 0 && (
//                       <div className="flex justify-start">
//                         <div className="bg-white border border-gray-200 text-black max-w-xs px-4 py-2 rounded-2xl rounded-bl-none">
//                           <div className="flex items-center">
//                             <div className="flex space-x-1">
//                               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
//                             </div>
//                             <span className="ml-2 text-sm text-gray-500">typing...</span>
//                           </div>
//                         </div>
//                       </div>
//                     )}
                    
//                     <div ref={messagesEndRef} />
//                   </div>
//                 )}
//               </div>

//               {/* Message Input */}
//               <div className="p-4 border-t border-gray-200 bg-white">
//                 <form onSubmit={handleSendMessage} className="flex gap-2">
//                   <input
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => handleMessageChange(e.target.value)}
//                     placeholder="Type a message..."
//                     className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder-gray-500"
//                     disabled={sending}
//                   />
//                   <button
//                     type="submit"
//                     disabled={!newMessage.trim() || sending}
//                     className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
//                   >
//                     {sending ? (
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                     ) : (
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
//                       </svg>
//                     )}
//                   </button>
//                 </form>
//               </div>
//             </>
//           ) : (
//             /* Welcome Screen when no conversation selected */
//             <div className="flex-1 flex flex-col items-center justify-center p-8">
//               <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
//                 <span className="text-5xl">💬</span>
//               </div>
//               <h2 className="text-2xl font-bold text-black mb-3">Your Messages</h2>
//               <p className="text-gray-600 text-center max-w-md mb-8">
//                 Select a conversation from the list to start messaging, or find new people to connect with.
//               </p>
//               <div className="flex gap-4">
//                 <Link
//                   href="/network"
//                   className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
//                 >
//                   Browse Network
//                 </Link>
//                 <button
//                   onClick={() => router.push('/referral/marketplace')}
//                   className="bg-white border border-orange-500 text-orange-500 px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors"
//                 >
//                   Find Referral Jobs
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Mobile Layout - Single Column */}
//       <div className="md:hidden h-screen bg-white">
//         {conversationId ? (
//           /* Mobile Conversation View */
//           <div className="h-full flex flex-col">
//             {/* Header with back button */}
//             <div className="p-4 border-b border-gray-200 flex items-center">
//               <button
//                 onClick={goBackToList}
//                 className="mr-3 text-orange-500 p-2"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
//                 </svg>
//               </button>
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
//                   {otherUser?.photoURL ? (
//                     <img
//                       src={otherUser.photoURL}
//                       alt={otherUser.displayName}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <span className="text-orange-500 font-semibold">
//                       {otherUser?.displayName?.[0] || 'U'}
//                     </span>
//                   )}
//                 </div>
//                 <div>
//                   <h2 className="font-semibold text-black">{otherUser?.displayName || 'User'}</h2>
//                   {/* REMOVED "Active now" text */}
//                   <p className="text-xs text-gray-500">
//                     {typingUsers.length > 0 ? 'typing...' : otherUser?.headline || ''}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Messages */}
//             <div
//               ref={messagesContainerRef}
//               className="flex-1 overflow-y-auto p-4 bg-gray-50"
//             >
//               {loadingMessages ? (
//                 <div className="flex justify-center items-center h-full">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
//                 </div>
//               ) : messages.length === 0 ? (
//                 <div className="flex justify-center items-center h-full">
//                   <div className="text-center">
//                     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <span className="text-2xl">💬</span>
//                     </div>
//                     <h3 className="text-lg font-medium text-black mb-2">No messages yet</h3>
//                     <p className="text-gray-500">Start the conversation!</p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {messages.map((message) => {
//                     const isSender = message.senderId === user.uid;
//                     return (
//                       <div
//                         key={message.id}
//                         className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
//                       >
//                         <div
//                           className={`max-w-xs rounded-2xl px-4 py-2 ${
//                             isSender
//                               ? 'bg-orange-500 text-white rounded-br-none'
//                               : 'bg-white text-black border border-gray-200 rounded-bl-none'
//                           }`}
//                         >
//                           <p className="text-sm">{message.text}</p>
//                           <div className="flex justify-between items-center mt-1">
//                             <span className={`text-xs ${isSender ? 'text-orange-200' : 'text-gray-500'}`}>
//                               {formatMessageTime(message.timestamp)}
//                             </span>
//                             {isSender && (
//                               <span className="ml-2">
//                                 {getStatusIcon(message.status, isSender)}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
                  
//                   {/* Typing Indicator */}
//                   {typingUsers.length > 0 && (
//                     <div className="flex justify-start">
//                       <div className="bg-white border border-gray-200 text-black max-w-xs px-4 py-2 rounded-2xl rounded-bl-none">
//                         <div className="flex items-center">
//                           <div className="flex space-x-1">
//                             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
//                           </div>
//                           <span className="ml-2 text-sm text-gray-500">typing...</span>
//                         </div>
//                       </div>
//                     </div>
//                   )}
                  
//                   <div ref={messagesEndRef} />
//                 </div>
//               )}
//             </div>

//             {/* Message Input */}
//             <div className="p-4 border-t border-gray-200 bg-white">
//               <form onSubmit={handleSendMessage} className="flex gap-2">
//                 <input
//                   type="text"
//                   value={newMessage}
//                   onChange={(e) => handleMessageChange(e.target.value)}
//                   placeholder="Type a message..."
//                   className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder-gray-500"
//                   disabled={sending}
//                 />
//                 <button
//                   type="submit"
//                   disabled={!newMessage.trim() || sending}
//                   className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
//                 >
//                   {sending ? (
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                   ) : (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
//                     </svg>
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>
//         ) : (
//           /* Mobile Conversations List */
//           <div className="h-full flex flex-col">
//             {/* Header */}
//             <div className="p-4 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h1 className="text-xl font-bold text-black">Messages</h1>
//                 <Link
//                   href="/network"
//                   className="text-orange-500 hover:text-orange-600 text-sm font-medium"
//                 >
//                   Find People
//                 </Link>
//               </div>
              
//               {/* Search Bar */}
//               <div className="mt-4">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Search conversations..."
//                     onChange={(e) => handleSearchChange(e.target.value)}
//                     className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder-gray-500 pl-10"
//                   />
//                   <div className="absolute left-3 top-3.5">
//                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Conversations List */}
//             <div className="flex-1 overflow-y-auto">
//               {loadingConversations ? (
//                 <div className="p-4 text-center">
//                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
//                   <p className="mt-2 text-sm text-gray-500">Loading conversations...</p>
//                 </div>
//               ) : filteredConversations.length === 0 ? (
//                 <div className="p-8 text-center">
//                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <span className="text-2xl">💬</span>
//                   </div>
//                   <h3 className="text-lg font-medium text-black mb-2">
//                     {searchQuery ? 'No matches found' : 'No conversations yet'}
//                   </h3>
//                   <p className="text-gray-500 text-sm mb-4">
//                     {searchQuery ? 'Try different search terms' : 'Start a conversation with someone in your network!'}
//                   </p>
//                   <Link
//                     href="/network"
//                     className="inline-block bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
//                   >
//                     Browse Network
//                   </Link>
//                 </div>
//               ) : (
//                 <div className="divide-y divide-gray-100">
//                   {filteredConversations.map((conversation) => (
//                     <div
//                       key={conversation.id}
//                       onClick={() => selectConversation(conversation.id)}
//                       className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
//                     >
//                       <div className="flex items-center space-x-3">
//                         {/* Profile Image - NO GREEN DOT */}
//                         <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
//                           {conversation.otherUserData?.photoURL ? (
//                             <img
//                               src={conversation.otherUserData.photoURL}
//                               alt={conversation.otherUserData.displayName}
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <span className="text-orange-500 font-semibold">
//                               {conversation.otherUserData?.displayName?.[0] || 'U'}
//                             </span>
//                           )}
//                         </div>

//                         {/* Conversation Details */}
//                         <div className="flex-1 min-w-0">
//                           <div className="flex justify-between items-start">
//                             <h3 className="font-semibold text-black truncate">
//                               {conversation.otherUserData?.displayName || 'Unknown User'}
//                             </h3>
//                             <span className="text-xs text-gray-500 whitespace-nowrap">
//                               {formatListDate(conversation.lastTimestamp)}
//                             </span>
//                           </div>
//                           <div className="flex justify-between items-center mt-1">
//                             <p className="text-sm text-gray-600 truncate max-w-[150px]">
//                               {conversation.lastMessage || 'No messages yet'}
//                             </p>
//                             {conversation.unreadCount && conversation.unreadCount > 0 && (
//                               <span className="bg-orange-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
//                                 {conversation.unreadCount}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
// import { useParams, useRouter, useSearchParams } from 'next/navigation';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import {
//   collection,
//   query,
//   where,
//   orderBy,
//   getDocs,
//   onSnapshot,
//   DocumentData,
//   Timestamp,
//   addDoc
// } from 'firebase/firestore';
// import Link from 'next/link';
// import { debounce } from 'lodash';
// import { updateMessageStatus } from '@/lib/sendMessage';
// import { startTyping, stopTyping, debouncedStopTyping, listenForTyping } from '@/lib/typing';
// import { 
//   Search, MessageCircle, Users, Send, MoreVertical, Phone, Video, 
//   Image as ImageIcon, Paperclip, Smile, Mic, Check, CheckCheck, 
//   Clock, ChevronLeft, X, Pin, Archive, Trash2, MoreHorizontal 
// } from 'lucide-react';

// // --- TYPES ---
// interface Message {
//   id: string;
//   text: string;
//   senderId: string;
//   receiverId: string;
//   timestamp: any;
//   status: 'sent' | 'delivered' | 'read';
//   conversationId: string;
// }

// interface Conversation {
//   id: string;
//   otherUserId: string;
//   lastMessage?: string;
//   lastTimestamp?: any;
//   otherUserData?: DocumentData;
//   unreadCount?: number;
//   isPinned?: boolean;
//   isArchived?: boolean;
// }

// // --- HELPER: SAFE DATE CONVERSION ---
// const toJSDate = (date: any): Date => {
//   if (!date) return new Date();
//   if (date instanceof Date) return date;
//   if (date && typeof date.toDate === 'function') {
//     return date.toDate();
//   }
//   return new Date(date);
// };

// export default function UnifiedMessagesPage() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const conversationId = searchParams.get('id') || '';
//   const [user, loadingAuth] = useAuthState(auth);
//   const router = useRouter();
  
//   // State
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [allConversations, setAllConversations] = useState<Conversation[]>([]);
//   const [loadingConversations, setLoadingConversations] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'archived'>('all');
//   const [showConversationMenu, setShowConversationMenu] = useState<string | null>(null);
  
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [otherUser, setOtherUser] = useState<DocumentData | null>(null);
//   const [sending, setSending] = useState(false);
//   const [typingUsers, setTypingUsers] = useState<string[]>([]);
//   const [isUserTyping, setIsUserTyping] = useState(false);
  
//   // Refs
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const unsubscribeMessagesRef = useRef<(() => void) | null>(null);
//   const unsubscribeTypingRef = useRef<(() => void) | null>(null);
//   const messagesContainerRef = useRef<HTMLDivElement>(null);
//   const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   // Auto-scroll
//   const scrollToBottom = () => {
//     if (messagesContainerRef.current) {
//       messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
//     }
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, typingUsers]);

//   // ==================== CONVERSATIONS LOGIC ====================
//   useEffect(() => {
//     async function fetchConversations() {
//       if (user) {
//         try {
//           const messagesRef = collection(db, 'messages');
//           const sentQuery = query(messagesRef, where('senderId', '==', user.uid), orderBy('timestamp', 'desc'));
//           const receivedQuery = query(messagesRef, where('receiverId', '==', user.uid), orderBy('timestamp', 'desc'));
          
//           const [sentSnap, receivedSnap] = await Promise.all([getDocs(sentQuery), getDocs(receivedQuery)]);
          
//           const allMessages: any[] = [];
//           sentSnap.forEach(doc => allMessages.push({ id: doc.id, ...doc.data() }));
//           receivedSnap.forEach(doc => allMessages.push({ id: doc.id, ...doc.data() }));
          
//           const convMap = new Map<string, Conversation>();
          
//           allMessages.forEach(msg => {
//             const convId = msg.conversationId;
//             const existing = convMap.get(convId);
            
//             const msgTime = toJSDate(msg.timestamp);
//             const existingTime = toJSDate(existing?.lastTimestamp || new Date(0));
            
//             let unread = existing?.unreadCount || 0;
//             if (msg.receiverId === user.uid && msg.status !== 'read') unread++;
            
//             if (!existing || msgTime > existingTime) {
//               const otherId = msg.senderId === user.uid ? msg.receiverId : msg.senderId;
//               convMap.set(convId, {
//                 id: convId,
//                 otherUserId: otherId,
//                 lastMessage: msg.text,
//                 lastTimestamp: msg.timestamp,
//                 unreadCount: unread,
//                 isPinned: false,
//                 isArchived: false
//               });
//             } else if (existing) {
//               convMap.set(convId, { ...existing, unreadCount: unread });
//             }
//           });
          
//           const convArray = Array.from(convMap.values()).sort((a, b) => 
//             toJSDate(b.lastTimestamp).getTime() - toJSDate(a.lastTimestamp).getTime()
//           );
          
//           const convsWithUser = await Promise.all(convArray.map(async (conv) => {
//             try {
//               const userQuery = query(collection(db, 'users'), where('__name__', '==', conv.otherUserId));
//               const userDoc = await getDocs(userQuery);
//               if (!userDoc.empty) return { ...conv, otherUserData: userDoc.docs[0].data() };
//             } catch (e) { console.error(e); }
//             return conv;
//           }));
          
//           setConversations(convsWithUser);
//           setAllConversations(convsWithUser);
//         } catch (error) {
//           console.error("Error fetching conversations", error);
//         } finally {
//           setLoadingConversations(false);
//         }
//       }
//     }

//     if (user) {
//       fetchConversations();
//       const q = query(collection(db, 'messages'), where('receiverId', '==', user.uid), orderBy('timestamp', 'desc'));
//       const unsub = onSnapshot(q, () => fetchConversations());
//       return () => unsub();
//     }
//   }, [user]);

//   // Filters
//   const filteredConversations = useMemo(() => {
//     let filtered = allConversations;
//     if (activeFilter === 'unread') filtered = filtered.filter(c => (c.unreadCount || 0) > 0);
//     else if (activeFilter === 'archived') filtered = filtered.filter(c => c.isArchived);
//     else filtered = filtered.filter(c => !c.isArchived);
    
//     if (!searchQuery.trim()) return filtered;
//     const q = searchQuery.toLowerCase().trim();
//     return filtered.filter(c => 
//       c.otherUserData?.displayName?.toLowerCase().includes(q) || 
//       c.lastMessage?.toLowerCase().includes(q)
//     );
//   }, [allConversations, searchQuery, activeFilter]);

//   const handleSearchChange = debounce((val: string) => setSearchQuery(val), 300);

//   // ==================== ACTIVE CHAT LOGIC ====================
//   useEffect(() => {
//     if (!user || !conversationId) {
//       setMessages([]); setOtherUser(null); setTypingUsers([]); return;
//     }
    
//     setLoadingMessages(true);
//     if (unsubscribeMessagesRef.current) unsubscribeMessagesRef.current();
//     if (unsubscribeTypingRef.current) unsubscribeTypingRef.current();

//     // Fetch User
//     const ids = conversationId.split('_');
//     const otherId = ids[0] === user.uid ? ids[1] : ids[0];
//     const fetchUser = async () => {
//       const q = query(collection(db, 'users'), where('__name__', '==', otherId));
//       const d = await getDocs(q);
//       if (!d.empty) setOtherUser(d.docs[0].data());
//     };
//     fetchUser();

//     // Messages Listener
//     const q = query(collection(db, 'messages'), where('conversationId', '==', conversationId), orderBy('timestamp', 'asc'));
//     unsubscribeMessagesRef.current = onSnapshot(q, (snap) => {
//       const msgs: Message[] = [];
//       snap.forEach(d => msgs.push({ id: d.id, ...d.data() } as Message));
//       setMessages(msgs);
//       setLoadingMessages(false);
//       markMessagesRead(msgs);
//     });

//     // Typing Listener
//     unsubscribeTypingRef.current = listenForTyping(conversationId, (users) => {
//       const others = users.filter(u => u !== user.uid);
//       setTypingUsers(others);
//     });

//     return () => {
//       if (unsubscribeMessagesRef.current) unsubscribeMessagesRef.current();
//       if (unsubscribeTypingRef.current) unsubscribeTypingRef.current();
//     };
//   }, [user, conversationId]);

//   const markMessagesRead = async (msgs: Message[]) => {
//     if (!user) return;
//     const unread = msgs.filter(m => m.receiverId === user.uid && m.status !== 'read');
//     for (const m of unread) await updateMessageStatus(m.id, 'read');
//     setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, unreadCount: 0 } : c));
//   };

//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !user || !conversationId || sending) return;
//     setSending(true);
//     try {
//       await stopTyping(conversationId, user.uid);
//       const ids = conversationId.split('_');
//       const receiverId = ids[0] === user.uid ? ids[1] : ids[0];
//       await addDoc(collection(db, 'messages'), {
//         text: newMessage,
//         senderId: user.uid,
//         receiverId,
//         timestamp: Timestamp.now(),
//         status: 'sent',
//         conversationId
//       });
//       setNewMessage('');
//     } catch (err) { console.error(err); } 
//     finally { setSending(false); }
//   };

//   const handleTyping = (text: string) => {
//     setNewMessage(text);
//     if (!user || !conversationId) return;
//     if (text.trim().length > 0) startTyping(conversationId, user.uid);
//     else debouncedStopTyping(conversationId, user.uid);
//   };

//   // --- SAFE FORMATTERS USING HELPER ---
//   const formatTime = (d?: any) => {
//     const date = toJSDate(d);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const formatDate = (d?: any) => {
//     const date = toJSDate(d);
//     const now = new Date();
//     if (now.getDate() === date.getDate()) return formatTime(date);
//     return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
//   };

//   const getStatusIcon = (status: string, isSender: boolean) => {
//     if (!isSender) return null;
//     switch (status) {
//       case 'sent': return <span className="text-[10px] text-orange-200">✓</span>;
//       case 'delivered': return <span className="text-[10px] text-orange-200">✓✓</span>;
//       case 'read': return <span className="text-[10px] text-white">✓✓</span>; 
//       default: return null;
//     }
//   };

//   if (loadingAuth) return <div className="h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;
//   if (!user) { router.push('/login'); return null; }

//   return (
//     <div className="flex h-screen bg-white overflow-hidden font-sans text-neutral-900">
      
//       {/* 1. LEFT SIDEBAR (Inbox) */}
//       <div className={`
//         w-full md:w-[400px] flex-shrink-0 flex flex-col border-r border-neutral-200 bg-white
//         ${conversationId ? 'hidden md:flex' : 'flex'} 
//       `}>
        
//         {/* Sidebar Header */}
//         <div className="p-5 border-b border-neutral-100">
//           <div className="flex items-center justify-between mb-5">
//             <h1 className="text-2xl font-black text-black tracking-tight">Messages</h1>
//             <div className="flex gap-2">
//               <Link href="/network" className="p-2 hover:bg-neutral-100 rounded-full transition-colors" title="New Message">
//                 <Users className="h-5 w-5 text-neutral-600" />
//               </Link>
//               <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
//                 <MoreVertical className="h-5 w-5 text-neutral-600" />
//               </button>
//             </div>
//           </div>
          
//           {/* Search */}
//           <div className="relative group mb-4">
//             <Search className="h-4 w-4 text-neutral-400 absolute left-3 top-3.5 group-focus-within:text-orange-600 transition-colors" />
//             <input
//               type="text"
//               placeholder="Search inbox..."
//               onChange={(e) => handleSearchChange(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium"
//             />
//           </div>

//           {/* Filters */}
//           <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
//             {['all', 'unread', 'archived'].map((f) => (
//               <button
//                 key={f}
//                 onClick={() => setActiveFilter(f as any)}
//                 className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${
//                   activeFilter === f 
//                     ? 'bg-black text-white' 
//                     : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
//                 }`}
//               >
//                 {f}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Conversation List */}
//         <div className="flex-1 overflow-y-auto">
//           {loadingConversations ? (
//             <div className="p-10 flex justify-center"><div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>
//           ) : filteredConversations.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full p-8 text-center opacity-60">
//               <MessageCircle className="h-12 w-12 text-neutral-300 mb-3" />
//               <p className="text-sm font-medium">No conversations found</p>
//             </div>
//           ) : (
//             <div className="divide-y divide-neutral-50">
//               {filteredConversations.map((conv) => (
//                 <div
//                   key={conv.id}
//                   onClick={() => router.push(`/dashboard/messages?id=${conv.id}`)}
//                   className={`group relative p-4 cursor-pointer transition-all hover:bg-neutral-50 ${
//                     conversationId === conv.id ? 'bg-orange-50/50' : ''
//                   }`}
//                 >
//                   {/* Active Indicator */}
//                   {conversationId === conv.id && (
//                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-600 rounded-r-full" />
//                   )}

//                   <div className="flex gap-4">
//                     {/* Avatar */}
//                     <div className="relative flex-shrink-0">
//                       {conv.otherUserData?.photoURL ? (
//                         <img src={conv.otherUserData.photoURL} alt="" className="w-12 h-12 rounded-full object-cover border border-neutral-100" />
//                       ) : (
//                         <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
//                           {conv.otherUserData?.displayName?.[0] || '?'}
//                         </div>
//                       )}
//                       <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
//                     </div>

//                     <div className="flex-1 min-w-0">
//                       <div className="flex justify-between items-baseline mb-1">
//                         <h3 className={`text-sm font-bold truncate ${conversationId === conv.id ? 'text-black' : 'text-neutral-800'}`}>
//                           {conv.otherUserData?.displayName || 'Unknown'}
//                         </h3>
//                         <span className={`text-[10px] font-medium ${conv.unreadCount ? 'text-orange-600' : 'text-neutral-400'}`}>
//                           {formatDate(conv.lastTimestamp)}
//                         </span>
//                       </div>
                      
//                       <div className="flex justify-between items-center">
//                         <p className={`text-xs truncate pr-4 ${conv.unreadCount ? 'font-bold text-black' : 'text-neutral-500'}`}>
//                           {conv.lastMessage || 'Start a conversation'}
//                         </p>
//                         {conv.unreadCount ? (
//                           <span className="h-5 min-w-[20px] px-1.5 flex items-center justify-center bg-orange-600 text-white text-[10px] font-bold rounded-full">
//                             {conv.unreadCount}
//                           </span>
//                         ) : null}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 2. RIGHT MAIN AREA (Chat) */}
//       <div className={`flex-1 flex flex-col bg-[#fcfcfc] relative ${!conversationId ? 'hidden md:flex' : 'flex'}`}>
        
//         {/* Background Pattern */}
//         <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
//              style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
//         </div>

//         {conversationId ? (
//           <>
//             {/* Chat Header */}
//             <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 py-3 flex justify-between items-center shadow-sm">
//               <div className="flex items-center gap-3">
//                 <button onClick={() => router.push('/dashboard/messages')} className="md:hidden p-2 -ml-2 text-neutral-500">
//                   <ChevronLeft className="h-6 w-6" />
//                 </button>
                
//                 <Link href={otherUser ? `/profile/${otherUser.uid}` : '#'} className="flex items-center gap-3 group">
//                   <div className="relative">
//                     {otherUser?.photoURL ? (
//                       <img src={otherUser.photoURL} alt="" className="w-10 h-10 rounded-full object-cover" />
//                     ) : (
//                       <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
//                         {otherUser?.displayName?.[0] || '?'}
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <h2 className="text-sm font-bold text-black group-hover:text-orange-600 transition-colors">
//                       {otherUser?.displayName || 'Loading...'}
//                     </h2>
//                     <p className="text-xs text-neutral-500 font-medium flex items-center gap-1">
//                       {typingUsers.length > 0 ? (
//                         <span className="text-orange-600 animate-pulse font-bold">typing...</span>
//                       ) : (
//                         <>
//                           <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Active Now
//                         </>
//                       )}
//                     </p>
//                   </div>
//                 </Link>
//               </div>

//               <div className="flex items-center gap-1">
//                 <button className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors">
//                   <Phone className="h-5 w-5" />
//                 </button>
//                 <button className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors">
//                   <Video className="h-5 w-5" />
//                 </button>
//                 <button className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors">
//                   <MoreHorizontal className="h-5 w-5" />
//                 </button>
//               </div>
//             </header>

//             {/* Messages Area */}
//             <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
//               {loadingMessages ? (
//                 <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-neutral-200 border-t-orange-500 rounded-full animate-spin"></div></div>
//               ) : messages.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full opacity-50">
//                   <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-4xl">👋</div>
//                   <p className="text-neutral-500 font-medium">Say hello to start the conversation!</p>
//                 </div>
//               ) : (
//                 <>
//                   {messages.map((msg, i) => {
//                     const isMe = msg.senderId === user.uid;
//                     return (
//                       <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
//                         <div className={`max-w-[75%] relative`}>
//                           <div className={`
//                             px-5 py-3 text-sm leading-relaxed shadow-sm break-words
//                             ${isMe 
//                               ? 'bg-orange-600 text-white rounded-2xl rounded-tr-sm' 
//                               : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-neutral-100'}
//                           `}>
//                             {msg.text}
//                           </div>
                          
//                           <div className={`flex items-center gap-1 mt-1 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
//                             <span className="text-[10px] text-neutral-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
//                               {formatTime(msg.timestamp)}
//                             </span>
//                             {isMe && (
//                               <span className="text-[10px]">
//                                 {msg.status === 'read' ? <CheckCheck className="h-3 w-3 text-blue-500" /> : <Check className="h-3 w-3 text-neutral-400" />}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
                  
//                   {/* Typing Bubble */}
//                   {typingUsers.length > 0 && (
//                     <div className="flex justify-start">
//                       <div className="bg-white border border-neutral-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
//                         <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></div>
//                         <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-100"></div>
//                         <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-200"></div>
//                       </div>
//                     </div>
//                   )}
//                   <div ref={messagesEndRef} />
//                 </>
//               )}
//             </div>

//             {/* Input Area - FIXED for feedback button overlap */}
//             <div className="sticky bottom-0 z-50 p-4 md:p-6 pt-2 bg-transparent">
//               <form onSubmit={handleSendMessage} className="flex items-end gap-2 bg-white p-2 rounded-[2rem] shadow-xl border border-neutral-100 ring-1 ring-black/5 relative">
//                 <div className="flex gap-1 pl-2 pb-2">
//                   <button type="button" className="p-2 text-neutral-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors">
//                     <Paperclip className="h-5 w-5" />
//                   </button>
//                 </div>

//                 <input
//                   type="text"
//                   value={newMessage}
//                   onChange={(e) => handleTyping(e.target.value)}
//                   placeholder="Type a message..."
//                   className="flex-1 max-h-32 py-3 px-2 bg-transparent outline-none text-black placeholder-neutral-400 text-sm"
//                   disabled={sending}
//                   autoFocus
//                 />

//                 <button
//                   type="submit"
//                   disabled={!newMessage.trim() || sending}
//                   className={`
//                     w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all relative z-50
//                     ${!newMessage.trim() || sending 
//                       ? 'bg-neutral-100 text-neutral-300' 
//                       : 'bg-black text-white hover:bg-orange-600 shadow-md transform hover:scale-105 active:scale-95'}
//                   `}
//                 >
//                   {sending ? (
//                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                   ) : (
//                     <Send className="h-4 w-4 ml-0.5" />
//                   )}
//                 </button>
//               </form>
//             </div>
//           </>
//         ) : (
//           /* Empty State (Desktop) */
//           <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-neutral-50/50">
//             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-neutral-100">
//               <span className="text-5xl">✨</span>
//             </div>
//             <h2 className="text-2xl font-black text-black mb-2">Select a Conversation</h2>
//             <p className="text-neutral-500 max-w-sm mb-8">
//               Choose a chat from the left to start messaging, or expand your network to find new opportunities.
//             </p>
//             <Link
//               href="/network"
//               className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg"
//             >
//               Start New Chat
//             </Link>
//           </div>
//         )}
//       </div>

//       {/* Custom CSS for preventing feedback button overlap */}
//       <style jsx global>{`
//         /* Ensure feedback button doesn't overlap chat input */
//         .feedback-button, 
//         [data-feedback-button],
//         button[aria-label*="feedback"],
//         button[aria-label*="Feedback"] {
//           bottom: 100px !important;
//           right: 20px !important;
//         }
        
//         /* Make sure our chat input stays on top */
//         .sticky.bottom-0.z-50 {
//           position: sticky;
//           z-index: 50;
//         }
        
//         /* Adjust for mobile */
//         @media (max-width: 768px) {
//           .feedback-button, 
//           [data-feedback-button],
//           button[aria-label*="feedback"],
//           button[aria-label*="Feedback"] {
//             bottom: 80px !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }


// --------------------------- This is the main one ---------------------------


// "use client";

// import { Suspense } from 'react';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import {
//   collection,
//   query,
//   where,
//   orderBy,
//   getDocs,
//   onSnapshot,
//   DocumentData,
//   Timestamp,
//   addDoc
// } from 'firebase/firestore';
// import { useParams, useRouter, useSearchParams } from 'next/navigation';
// import Link from 'next/link';
// import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
// import { debounce } from 'lodash';
// import { updateMessageStatus } from '@/lib/sendMessage';
// import { startTyping, stopTyping, debouncedStopTyping, listenForTyping } from '@/lib/typing';
// import { 
//   Search, MessageCircle, Users, Send, MoreVertical, Phone, Video, 
//   Image as ImageIcon, Paperclip, Smile, Mic, Check, CheckCheck, 
//   Clock, ChevronLeft, X, Pin, Archive, Trash2, MoreHorizontal 
// } from 'lucide-react';

// // --- TYPES ---
// interface Message {
//   id: string;
//   text: string;
//   senderId: string;
//   receiverId: string;
//   timestamp: any;
//   status: 'sent' | 'delivered' | 'read';
//   conversationId: string;
// }

// interface Conversation {
//   id: string;
//   otherUserId: string;
//   lastMessage?: string;
//   lastTimestamp?: any;
//   otherUserData?: DocumentData;
//   unreadCount?: number;
//   isPinned?: boolean;
//   isArchived?: boolean;
// }

// // --- HELPER: SAFE DATE CONVERSION ---
// const toJSDate = (date: any): Date => {
//   if (!date) return new Date();
//   if (date instanceof Date) return date;
//   if (date && typeof date.toDate === 'function') {
//     return date.toDate();
//   }
//   return new Date(date);
// };

// // --- CLIENT COMPONENT (contains all original logic) ---
// function MessagesPageClient() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const conversationId = searchParams.get('id') || '';
//   const [user, loadingAuth] = useAuthState(auth);
//   const router = useRouter();
  
//   // State
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [allConversations, setAllConversations] = useState<Conversation[]>([]);
//   const [loadingConversations, setLoadingConversations] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'archived'>('all');
//   const [showConversationMenu, setShowConversationMenu] = useState<string | null>(null);
  
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [otherUser, setOtherUser] = useState<DocumentData | null>(null);
//   const [sending, setSending] = useState(false);
//   const [typingUsers, setTypingUsers] = useState<string[]>([]);
//   const [isUserTyping, setIsUserTyping] = useState(false);
  
//   // Refs
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const unsubscribeMessagesRef = useRef<(() => void) | null>(null);
//   const unsubscribeTypingRef = useRef<(() => void) | null>(null);
//   const messagesContainerRef = useRef<HTMLDivElement>(null);
//   const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   // Auto-scroll
//   const scrollToBottom = () => {
//     if (messagesContainerRef.current) {
//       messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
//     }
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, typingUsers]);

//   // ==================== CONVERSATIONS LOGIC ====================
//   useEffect(() => {
//     async function fetchConversations() {
//       if (user) {
//         try {
//           const messagesRef = collection(db, 'messages');
//           const sentQuery = query(messagesRef, where('senderId', '==', user.uid), orderBy('timestamp', 'desc'));
//           const receivedQuery = query(messagesRef, where('receiverId', '==', user.uid), orderBy('timestamp', 'desc'));
          
//           const [sentSnap, receivedSnap] = await Promise.all([getDocs(sentQuery), getDocs(receivedQuery)]);
          
//           const allMessages: any[] = [];
//           sentSnap.forEach(doc => allMessages.push({ id: doc.id, ...doc.data() }));
//           receivedSnap.forEach(doc => allMessages.push({ id: doc.id, ...doc.data() }));
          
//           const convMap = new Map<string, Conversation>();
          
//           allMessages.forEach(msg => {
//             const convId = msg.conversationId;
//             const existing = convMap.get(convId);
            
//             const msgTime = toJSDate(msg.timestamp);
//             const existingTime = toJSDate(existing?.lastTimestamp || new Date(0));
            
//             let unread = existing?.unreadCount || 0;
//             if (msg.receiverId === user.uid && msg.status !== 'read') unread++;
            
//             if (!existing || msgTime > existingTime) {
//               const otherId = msg.senderId === user.uid ? msg.receiverId : msg.senderId;
//               convMap.set(convId, {
//                 id: convId,
//                 otherUserId: otherId,
//                 lastMessage: msg.text,
//                 lastTimestamp: msg.timestamp,
//                 unreadCount: unread,
//                 isPinned: false,
//                 isArchived: false
//               });
//             } else if (existing) {
//               convMap.set(convId, { ...existing, unreadCount: unread });
//             }
//           });
          
//           const convArray = Array.from(convMap.values()).sort((a, b) => 
//             toJSDate(b.lastTimestamp).getTime() - toJSDate(a.lastTimestamp).getTime()
//           );
          
//           const convsWithUser = await Promise.all(convArray.map(async (conv) => {
//             try {
//               const userQuery = query(collection(db, 'users'), where('__name__', '==', conv.otherUserId));
//               const userDoc = await getDocs(userQuery);
//               if (!userDoc.empty) return { ...conv, otherUserData: userDoc.docs[0].data() };
//             } catch (e) { console.error(e); }
//             return conv;
//           }));
          
//           setConversations(convsWithUser);
//           setAllConversations(convsWithUser);
//         } catch (error) {
//           console.error("Error fetching conversations", error);
//         } finally {
//           setLoadingConversations(false);
//         }
//       }
//     }

//     if (user) {
//       fetchConversations();
//       const q = query(collection(db, 'messages'), where('receiverId', '==', user.uid), orderBy('timestamp', 'desc'));
//       const unsub = onSnapshot(q, () => fetchConversations());
//       return () => unsub();
//     }
//   }, [user]);

//   // Filters
//   const filteredConversations = useMemo(() => {
//     let filtered = allConversations;
//     if (activeFilter === 'unread') filtered = filtered.filter(c => (c.unreadCount || 0) > 0);
//     else if (activeFilter === 'archived') filtered = filtered.filter(c => c.isArchived);
//     else filtered = filtered.filter(c => !c.isArchived);
    
//     if (!searchQuery.trim()) return filtered;
//     const q = searchQuery.toLowerCase().trim();
//     return filtered.filter(c => 
//       c.otherUserData?.displayName?.toLowerCase().includes(q) || 
//       c.lastMessage?.toLowerCase().includes(q)
//     );
//   }, [allConversations, searchQuery, activeFilter]);

//   const handleSearchChange = debounce((val: string) => setSearchQuery(val), 300);

//   // ==================== ACTIVE CHAT LOGIC ====================
//   useEffect(() => {
//     if (!user || !conversationId) {
//       setMessages([]); setOtherUser(null); setTypingUsers([]); return;
//     }
    
//     setLoadingMessages(true);
//     if (unsubscribeMessagesRef.current) unsubscribeMessagesRef.current();
//     if (unsubscribeTypingRef.current) unsubscribeTypingRef.current();

//     // Fetch User
//     const ids = conversationId.split('_');
//     const otherId = ids[0] === user.uid ? ids[1] : ids[0];
//     const fetchUser = async () => {
//       const q = query(collection(db, 'users'), where('__name__', '==', otherId));
//       const d = await getDocs(q);
//       if (!d.empty) setOtherUser(d.docs[0].data());
//     };
//     fetchUser();

//     // Messages Listener
//     const q = query(collection(db, 'messages'), where('conversationId', '==', conversationId), orderBy('timestamp', 'asc'));
//     unsubscribeMessagesRef.current = onSnapshot(q, (snap) => {
//       const msgs: Message[] = [];
//       snap.forEach(d => msgs.push({ id: d.id, ...d.data() } as Message));
//       setMessages(msgs);
//       setLoadingMessages(false);
//       markMessagesRead(msgs);
//     });

//     // Typing Listener
//     unsubscribeTypingRef.current = listenForTyping(conversationId, (users) => {
//       const others = users.filter(u => u !== user.uid);
//       setTypingUsers(others);
//     });

//     return () => {
//       if (unsubscribeMessagesRef.current) unsubscribeMessagesRef.current();
//       if (unsubscribeTypingRef.current) unsubscribeTypingRef.current();
//     };
//   }, [user, conversationId]);

//   const markMessagesRead = async (msgs: Message[]) => {
//     if (!user) return;
//     const unread = msgs.filter(m => m.receiverId === user.uid && m.status !== 'read');
//     for (const m of unread) await updateMessageStatus(m.id, 'read');
//     setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, unreadCount: 0 } : c));
//   };

//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !user || !conversationId || sending) return;
//     setSending(true);
//     try {
//       await stopTyping(conversationId, user.uid);
//       const ids = conversationId.split('_');
//       const receiverId = ids[0] === user.uid ? ids[1] : ids[0];
//       await addDoc(collection(db, 'messages'), {
//         text: newMessage,
//         senderId: user.uid,
//         receiverId,
//         timestamp: Timestamp.now(),
//         status: 'sent',
//         conversationId
//       });
//       setNewMessage('');
//     } catch (err) { console.error(err); } 
//     finally { setSending(false); }
//   };

//   const handleTyping = (text: string) => {
//     setNewMessage(text);
//     if (!user || !conversationId) return;
//     if (text.trim().length > 0) startTyping(conversationId, user.uid);
//     else debouncedStopTyping(conversationId, user.uid);
//   };

//   // --- SAFE FORMATTERS USING HELPER ---
//   const formatTime = (d?: any) => {
//     const date = toJSDate(d);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const formatDate = (d?: any) => {
//     const date = toJSDate(d);
//     const now = new Date();
//     if (now.getDate() === date.getDate()) return formatTime(date);
//     return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
//   };

//   const getStatusIcon = (status: string, isSender: boolean) => {
//     if (!isSender) return null;
//     switch (status) {
//       case 'sent': return <span className="text-[10px] text-orange-200">✓</span>;
//       case 'delivered': return <span className="text-[10px] text-orange-200">✓✓</span>;
//       case 'read': return <span className="text-[10px] text-white">✓✓</span>; 
//       default: return null;
//     }
//   };

//   if (loadingAuth) return <div className="h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;
//   if (!user) { router.push('/login'); return null; }

//   return (
//     <div className="flex h-screen bg-white overflow-hidden font-sans text-neutral-900">
      
//       {/* 1. LEFT SIDEBAR (Inbox) */}
//       <div className={`
//         w-full md:w-[400px] flex-shrink-0 flex flex-col border-r border-neutral-200 bg-white
//         ${conversationId ? 'hidden md:flex' : 'flex'} 
//       `}>
        
//         {/* Sidebar Header */}
//         <div className="p-5 border-b border-neutral-100">
//           <div className="flex items-center justify-between mb-5">
//             <h1 className="text-2xl font-black text-black tracking-tight">Messages</h1>
//             <div className="flex gap-2">
//               <Link href="/network" className="p-2 hover:bg-neutral-100 rounded-full transition-colors" title="New Message">
//                 <Users className="h-5 w-5 text-neutral-600" />
//               </Link>
//               <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
//                 <MoreVertical className="h-5 w-5 text-neutral-600" />
//               </button>
//             </div>
//           </div>
          
//           {/* Search */}
//           <div className="relative group mb-4">
//             <Search className="h-4 w-4 text-neutral-400 absolute left-3 top-3.5 group-focus-within:text-orange-600 transition-colors" />
//             <input
//               type="text"
//               placeholder="Search inbox..."
//               onChange={(e) => handleSearchChange(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium"
//             />
//           </div>

//           {/* Filters */}
//           <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
//             {['all', 'unread', 'archived'].map((f) => (
//               <button
//                 key={f}
//                 onClick={() => setActiveFilter(f as any)}
//                 className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${
//                   activeFilter === f 
//                     ? 'bg-black text-white' 
//                     : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
//                 }`}
//               >
//                 {f}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Conversation List */}
//         <div className="flex-1 overflow-y-auto">
//           {loadingConversations ? (
//             <div className="p-10 flex justify-center"><div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>
//           ) : filteredConversations.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full p-8 text-center opacity-60">
//               <MessageCircle className="h-12 w-12 text-neutral-300 mb-3" />
//               <p className="text-sm font-medium">No conversations found</p>
//             </div>
//           ) : (
//             <div className="divide-y divide-neutral-50">
//               {filteredConversations.map((conv) => (
//                 <div
//                   key={conv.id}
//                   onClick={() => router.push(`/dashboard/messages?id=${conv.id}`)}
//                   className={`group relative p-4 cursor-pointer transition-all hover:bg-neutral-50 ${
//                     conversationId === conv.id ? 'bg-orange-50/50' : ''
//                   }`}
//                 >
//                   {/* Active Indicator */}
//                   {conversationId === conv.id && (
//                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-600 rounded-r-full" />
//                   )}

//                   <div className="flex gap-4">
//                     {/* Avatar */}
//                     <div className="relative flex-shrink-0">
//                       {conv.otherUserData?.photoURL ? (
//                         <img src={conv.otherUserData.photoURL} alt="" className="w-12 h-12 rounded-full object-cover border border-neutral-100" />
//                       ) : (
//                         <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
//                           {conv.otherUserData?.displayName?.[0] || '?'}
//                         </div>
//                       )}
//                       <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
//                     </div>

//                     <div className="flex-1 min-w-0">
//                       <div className="flex justify-between items-baseline mb-1">
//                         <h3 className={`text-sm font-bold truncate ${conversationId === conv.id ? 'text-black' : 'text-neutral-800'}`}>
//                           {conv.otherUserData?.displayName || 'Unknown'}
//                         </h3>
//                         <span className={`text-[10px] font-medium ${conv.unreadCount ? 'text-orange-600' : 'text-neutral-400'}`}>
//                           {formatDate(conv.lastTimestamp)}
//                         </span>
//                       </div>
                      
//                       <div className="flex justify-between items-center">
//                         <p className={`text-xs truncate pr-4 ${conv.unreadCount ? 'font-bold text-black' : 'text-neutral-500'}`}>
//                           {conv.lastMessage || 'Start a conversation'}
//                         </p>
//                         {conv.unreadCount ? (
//                           <span className="h-5 min-w-[20px] px-1.5 flex items-center justify-center bg-orange-600 text-white text-[10px] font-bold rounded-full">
//                             {conv.unreadCount}
//                           </span>
//                         ) : null}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 2. RIGHT MAIN AREA (Chat) */}
//       <div className={`flex-1 flex flex-col bg-[#fcfcfc] relative ${!conversationId ? 'hidden md:flex' : 'flex'}`}>
        
//         {/* Background Pattern */}
//         <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
//              style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
//         </div>

//         {conversationId ? (
//           <>
//             {/* Chat Header */}
//             <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 py-3 flex justify-between items-center shadow-sm">
//               <div className="flex items-center gap-3">
//                 <button onClick={() => router.push('/dashboard/messages')} className="md:hidden p-2 -ml-2 text-neutral-500">
//                   <ChevronLeft className="h-6 w-6" />
//                 </button>
                
//                 <Link href={otherUser ? `/profile/${otherUser.uid}` : '#'} className="flex items-center gap-3 group">
//                   <div className="relative">
//                     {otherUser?.photoURL ? (
//                       <img src={otherUser.photoURL} alt="" className="w-10 h-10 rounded-full object-cover" />
//                     ) : (
//                       <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
//                         {otherUser?.displayName?.[0] || '?'}
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <h2 className="text-sm font-bold text-black group-hover:text-orange-600 transition-colors">
//                       {otherUser?.displayName || 'Loading...'}
//                     </h2>
//                     <p className="text-xs text-neutral-500 font-medium flex items-center gap-1">
//                       {typingUsers.length > 0 ? (
//                         <span className="text-orange-600 animate-pulse font-bold">typing...</span>
//                       ) : (
//                         <>
//                           <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Active Now
//                         </>
//                       )}
//                     </p>
//                   </div>
//                 </Link>
//               </div>

//               <div className="flex items-center gap-1">
//                 <button className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors">
//                   <Phone className="h-5 w-5" />
//                 </button>
//                 <button className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors">
//                   <Video className="h-5 w-5" />
//                 </button>
//                 <button className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors">
//                   <MoreHorizontal className="h-5 w-5" />
//                 </button>
//               </div>
//             </header>

//             {/* Messages Area */}
//             <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
//               {loadingMessages ? (
//                 <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-neutral-200 border-t-orange-500 rounded-full animate-spin"></div></div>
//               ) : messages.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full opacity-50">
//                   <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-4xl">👋</div>
//                   <p className="text-neutral-500 font-medium">Say hello to start the conversation!</p>
//                 </div>
//               ) : (
//                 <>
//                   {messages.map((msg, i) => {
//                     const isMe = msg.senderId === user.uid;
//                     return (
//                       <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
//                         <div className={`max-w-[75%] relative`}>
//                           <div className={`
//                             px-5 py-3 text-sm leading-relaxed shadow-sm break-words
//                             ${isMe 
//                               ? 'bg-orange-600 text-white rounded-2xl rounded-tr-sm' 
//                               : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-neutral-100'}
//                           `}>
//                             {msg.text}
//                           </div>
                          
//                           <div className={`flex items-center gap-1 mt-1 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
//                             <span className="text-[10px] text-neutral-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
//                               {formatTime(msg.timestamp)}
//                             </span>
//                             {isMe && (
//                               <span className="text-[10px]">
//                                 {msg.status === 'read' ? <CheckCheck className="h-3 w-3 text-blue-500" /> : <Check className="h-3 w-3 text-neutral-400" />}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
                  
//                   {/* Typing Bubble */}
//                   {typingUsers.length > 0 && (
//                     <div className="flex justify-start">
//                       <div className="bg-white border border-neutral-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
//                         <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></div>
//                         <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-100"></div>
//                         <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-200"></div>
//                       </div>
//                     </div>
//                   )}
//                   <div ref={messagesEndRef} />
//                 </>
//               )}
//             </div>

//             {/* Input Area - FIXED for feedback button overlap */}
//             <div className="sticky bottom-0 z-50 p-4 md:p-6 pt-2 bg-transparent">
//               <form onSubmit={handleSendMessage} className="flex items-end gap-2 bg-white p-2 rounded-[2rem] shadow-xl border border-neutral-100 ring-1 ring-black/5 relative">
//                 <div className="flex gap-1 pl-2 pb-2">
//                   <button type="button" className="p-2 text-neutral-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors">
//                     <Paperclip className="h-5 w-5" />
//                   </button>
//                 </div>

//                 <input
//                   type="text"
//                   value={newMessage}
//                   onChange={(e) => handleTyping(e.target.value)}
//                   placeholder="Type a message..."
//                   className="flex-1 max-h-32 py-3 px-2 bg-transparent outline-none text-black placeholder-neutral-400 text-sm"
//                   disabled={sending}
//                   autoFocus
//                 />

//                 <button
//                   type="submit"
//                   disabled={!newMessage.trim() || sending}
//                   className={`
//                     w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all relative z-50
//                     ${!newMessage.trim() || sending 
//                       ? 'bg-neutral-100 text-neutral-300' 
//                       : 'bg-black text-white hover:bg-orange-600 shadow-md transform hover:scale-105 active:scale-95'}
//                   `}
//                 >
//                   {sending ? (
//                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                   ) : (
//                     <Send className="h-4 w-4 ml-0.5" />
//                   )}
//                 </button>
//               </form>
//             </div>
//           </>
//         ) : (
//           /* Empty State (Desktop) */
//           <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-neutral-50/50">
//             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-neutral-100">
//               <span className="text-5xl">✨</span>
//             </div>
//             <h2 className="text-2xl font-black text-black mb-2">Select a Conversation</h2>
//             <p className="text-neutral-500 max-w-sm mb-8">
//               Choose a chat from the left to start messaging, or expand your network to find new opportunities.
//             </p>
//             <Link
//               href="/network"
//               className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg"
//             >
//               Start New Chat
//             </Link>
//           </div>
//         )}
//       </div>

//       {/* Custom CSS for preventing feedback button overlap */}
//       <style jsx global>{`
//         /* Ensure feedback button doesn't overlap chat input */
//         .feedback-button, 
//         [data-feedback-button],
//         button[aria-label*="feedback"],
//         button[aria-label*="Feedback"] {
//           bottom: 100px !important;
//           right: 20px !important;
//         }
        
//         /* Make sure our chat input stays on top */
//         .sticky.bottom-0.z-50 {
//           position: sticky;
//           z-index: 50;
//         }
        
//         /* Adjust for mobile */
//         @media (max-width: 768px) {
//           .feedback-button, 
//           [data-feedback-button],
//           button[aria-label*="feedback"],
//           button[aria-label*="Feedback"] {
//             bottom: 80px !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// // --- SERVER COMPONENT WITH SUSPENSE BOUNDARY ---
// export default function MessagesPage() {
//   return (
//     <Suspense fallback={
//       <div className="h-screen bg-white flex items-center justify-center">
//         <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     }>
//       <MessagesPageClient />
//     </Suspense>
//   );
// }


// ----------------------- main part --------------------------------------------


// "use client";

// import { Suspense } from 'react';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import {
//   collection,
//   query,
//   where,
//   orderBy,
//   getDocs,
//   onSnapshot,
//   DocumentData,
//   Timestamp,
//   addDoc
// } from 'firebase/firestore';
// import { useParams, useRouter, useSearchParams } from 'next/navigation';
// import Link from 'next/link';
// import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
// import { debounce } from 'lodash';
// import { updateMessageStatus } from '@/lib/sendMessage';
// import { startTyping, stopTyping, debouncedStopTyping, listenForTyping } from '@/lib/typing';
// import { useMultipleUserOnlineStatus } from '@/hooks/useOnlineStatus';
// import { 
//   Search, MessageCircle, Users, Send, MoreVertical, Phone, Video, 
//   Image as ImageIcon, Paperclip, Smile, Mic, Check, CheckCheck, 
//   Clock, ChevronLeft, X, Pin, Archive, Trash2, MoreHorizontal 
// } from 'lucide-react';

// // --- TYPES ---
// interface Message {
//   id: string;
//   text: string;
//   senderId: string;
//   receiverId: string;
//   timestamp: any;
//   status: 'sent' | 'delivered' | 'read';
//   conversationId: string;
// }

// interface Conversation {
//   id: string;
//   otherUserId: string;
//   lastMessage?: string;
//   lastTimestamp?: any;
//   otherUserData?: DocumentData;
//   unreadCount?: number;
//   isPinned?: boolean;
//   isArchived?: boolean;
// }

// // --- HELPER: SAFE DATE CONVERSION ---
// const toJSDate = (date: any): Date => {
//   if (!date) return new Date();
//   if (date instanceof Date) return date;
//   if (date && typeof date.toDate === 'function') {
//     return date.toDate();
//   }
//   return new Date(date);
// };

// // --- CLIENT COMPONENT (contains all original logic) ---
// function MessagesPageClient() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const conversationId = searchParams.get('id') || '';
//   const [user, loadingAuth] = useAuthState(auth);
//   const router = useRouter();
  
//   // State
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [allConversations, setAllConversations] = useState<Conversation[]>([]);
//   const [loadingConversations, setLoadingConversations] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'archived'>('all');
//   const [showConversationMenu, setShowConversationMenu] = useState<string | null>(null);
  
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [otherUser, setOtherUser] = useState<DocumentData | null>(null);
//   const [sending, setSending] = useState(false);
//   const [typingUsers, setTypingUsers] = useState<string[]>([]);
//   const [isUserTyping, setIsUserTyping] = useState(false);
  
//   // Refs
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const unsubscribeMessagesRef = useRef<(() => void) | null>(null);
//   const unsubscribeTypingRef = useRef<(() => void) | null>(null);
//   const messagesContainerRef = useRef<HTMLDivElement>(null);
//   const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   // Auto-scroll
//   const scrollToBottom = () => {
//     if (messagesContainerRef.current) {
//       messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
//     }
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, typingUsers]);

//   // ==================== CONVERSATIONS LOGIC ====================
//   useEffect(() => {
//     async function fetchConversations() {
//       if (user) {
//         try {
//           const messagesRef = collection(db, 'messages');
//           const sentQuery = query(messagesRef, where('senderId', '==', user.uid), orderBy('timestamp', 'desc'));
//           const receivedQuery = query(messagesRef, where('receiverId', '==', user.uid), orderBy('timestamp', 'desc'));
          
//           const [sentSnap, receivedSnap] = await Promise.all([getDocs(sentQuery), getDocs(receivedQuery)]);
          
//           const allMessages: any[] = [];
//           sentSnap.forEach(doc => allMessages.push({ id: doc.id, ...doc.data() }));
//           receivedSnap.forEach(doc => allMessages.push({ id: doc.id, ...doc.data() }));
          
//           const convMap = new Map<string, Conversation>();
          
//           allMessages.forEach(msg => {
//             const convId = msg.conversationId;
//             const existing = convMap.get(convId);
            
//             const msgTime = toJSDate(msg.timestamp);
//             const existingTime = toJSDate(existing?.lastTimestamp || new Date(0));
            
//             let unread = existing?.unreadCount || 0;
//             if (msg.receiverId === user.uid && msg.status !== 'read') unread++;
            
//             if (!existing || msgTime > existingTime) {
//               const otherId = msg.senderId === user.uid ? msg.receiverId : msg.senderId;
//               convMap.set(convId, {
//                 id: convId,
//                 otherUserId: otherId,
//                 lastMessage: msg.text,
//                 lastTimestamp: msg.timestamp,
//                 unreadCount: unread,
//                 isPinned: false,
//                 isArchived: false
//               });
//             } else if (existing) {
//               convMap.set(convId, { ...existing, unreadCount: unread });
//             }
//           });
          
//           const convArray = Array.from(convMap.values()).sort((a, b) => 
//             toJSDate(b.lastTimestamp).getTime() - toJSDate(a.lastTimestamp).getTime()
//           );
          
//           const convsWithUser = await Promise.all(convArray.map(async (conv) => {
//             try {
//               const userQuery = query(collection(db, 'users'), where('__name__', '==', conv.otherUserId));
//               const userDoc = await getDocs(userQuery);
//               if (!userDoc.empty) return { ...conv, otherUserData: userDoc.docs[0].data() };
//             } catch (e) { console.error(e); }
//             return conv;
//           }));
          
//           setConversations(convsWithUser);
//           setAllConversations(convsWithUser);
//         } catch (error) {
//           console.error("Error fetching conversations", error);
//         } finally {
//           setLoadingConversations(false);
//         }
//       }
//     }

//     if (user) {
//       fetchConversations();
//       const q = query(collection(db, 'messages'), where('receiverId', '==', user.uid), orderBy('timestamp', 'desc'));
//       const unsub = onSnapshot(q, () => fetchConversations());
//       return () => unsub();
//     }
//   }, [user]);

//   // Filters
//   const filteredConversations = useMemo(() => {
//     let filtered = allConversations;
//     if (activeFilter === 'unread') filtered = filtered.filter(c => (c.unreadCount || 0) > 0);
//     else if (activeFilter === 'archived') filtered = filtered.filter(c => c.isArchived);
//     else filtered = filtered.filter(c => !c.isArchived);
    
//     if (!searchQuery.trim()) return filtered;
//     const q = searchQuery.toLowerCase().trim();
//     return filtered.filter(c => 
//       c.otherUserData?.displayName?.toLowerCase().includes(q) || 
//       c.lastMessage?.toLowerCase().includes(q)
//     );
//   }, [allConversations, searchQuery, activeFilter]);

//   // Get list of other user IDs from filtered conversations for online status
//   const otherUserIds = useMemo(() => {
//     return filteredConversations.map(conv => conv.otherUserId);
//   }, [filteredConversations]);

//   // Get online statuses for all conversation participants
//   const { statusMap: userOnlineStatuses, loading: statusLoading } = useMultipleUserOnlineStatus(otherUserIds);

//   const handleSearchChange = debounce((val: string) => setSearchQuery(val), 300);

//   // ==================== ACTIVE CHAT LOGIC ====================
//   useEffect(() => {
//     if (!user || !conversationId) {
//       setMessages([]); setOtherUser(null); setTypingUsers([]); return;
//     }
    
//     setLoadingMessages(true);
//     if (unsubscribeMessagesRef.current) unsubscribeMessagesRef.current();
//     if (unsubscribeTypingRef.current) unsubscribeTypingRef.current();

//     // Fetch User
//     const ids = conversationId.split('_');
//     const otherId = ids[0] === user.uid ? ids[1] : ids[0];
//     const fetchUser = async () => {
//       const q = query(collection(db, 'users'), where('__name__', '==', otherId));
//       const d = await getDocs(q);
//       if (!d.empty) setOtherUser(d.docs[0].data());
//     };
//     fetchUser();

//     // Messages Listener
//     const q = query(collection(db, 'messages'), where('conversationId', '==', conversationId), orderBy('timestamp', 'asc'));
//     unsubscribeMessagesRef.current = onSnapshot(q, (snap) => {
//       const msgs: Message[] = [];
//       snap.forEach(d => msgs.push({ id: d.id, ...d.data() } as Message));
//       setMessages(msgs);
//       setLoadingMessages(false);
//       markMessagesRead(msgs);
//     });

//     // Typing Listener
//     unsubscribeTypingRef.current = listenForTyping(conversationId, (users) => {
//       const others = users.filter(u => u !== user.uid);
//       setTypingUsers(others);
//     });

//     return () => {
//       if (unsubscribeMessagesRef.current) unsubscribeMessagesRef.current();
//       if (unsubscribeTypingRef.current) unsubscribeTypingRef.current();
//     };
//   }, [user, conversationId]);

//   const markMessagesRead = async (msgs: Message[]) => {
//     if (!user) return;
//     const unread = msgs.filter(m => m.receiverId === user.uid && m.status !== 'read');
//     for (const m of unread) await updateMessageStatus(m.id, 'read');
//     setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, unreadCount: 0 } : c));
//   };

//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !user || !conversationId || sending) return;
//     setSending(true);
//     try {
//       await stopTyping(conversationId, user.uid);
//       const ids = conversationId.split('_');
//       const receiverId = ids[0] === user.uid ? ids[1] : ids[0];
//       await addDoc(collection(db, 'messages'), {
//         text: newMessage,
//         senderId: user.uid,
//         receiverId,
//         timestamp: Timestamp.now(),
//         status: 'sent',
//         conversationId
//       });
//       setNewMessage('');
//     } catch (err) { console.error(err); } 
//     finally { setSending(false); }
//   };

//   const handleTyping = (text: string) => {
//     setNewMessage(text);
//     if (!user || !conversationId) return;
//     if (text.trim().length > 0) startTyping(conversationId, user.uid);
//     else debouncedStopTyping(conversationId, user.uid);
//   };

//   // --- SAFE FORMATTERS USING HELPER ---
//   const formatTime = (d?: any) => {
//     const date = toJSDate(d);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const formatDate = (d?: any) => {
//     const date = toJSDate(d);
//     const now = new Date();
//     if (now.getDate() === date.getDate()) return formatTime(date);
//     return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
//   };

//   const getStatusIcon = (status: string, isSender: boolean) => {
//     if (!isSender) return null;
//     switch (status) {
//       case 'sent': return <span className="text-[10px] text-orange-200">✓</span>;
//       case 'delivered': return <span className="text-[10px] text-orange-200">✓✓</span>;
//       case 'read': return <span className="text-[10px] text-white">✓✓</span>; 
//       default: return null;
//     }
//   };

//   if (loadingAuth) return <div className="h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;
//   if (!user) { router.push('/login'); return null; }

//   return (
//     <div className="flex h-screen bg-white overflow-hidden font-sans text-neutral-900">
      
//       {/* 1. LEFT SIDEBAR (Inbox) */}
//       <div className={`
//         w-full md:w-[400px] flex-shrink-0 flex flex-col border-r border-neutral-200 bg-white
//         ${conversationId ? 'hidden md:flex' : 'flex'} 
//       `}>
        
//         {/* Sidebar Header */}
//         <div className="p-5 border-b border-neutral-100">
//           <div className="flex items-center justify-between mb-5">
//             <h1 className="text-2xl font-black text-black tracking-tight">Messages</h1>
//             <div className="flex gap-2">
//               <Link href="/network" className="p-2 hover:bg-neutral-100 rounded-full transition-colors" title="New Message">
//                 <Users className="h-5 w-5 text-neutral-600" />
//               </Link>
//               <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
//                 <MoreVertical className="h-5 w-5 text-neutral-600" />
//               </button>
//             </div>
//           </div>
          
//           {/* Search */}
//           <div className="relative group mb-4">
//             <Search className="h-4 w-4 text-neutral-400 absolute left-3 top-3.5 group-focus-within:text-orange-600 transition-colors" />
//             <input
//               type="text"
//               placeholder="Search inbox..."
//               onChange={(e) => handleSearchChange(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium"
//             />
//           </div>

//           {/* Filters */}
//           <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
//             {['all', 'unread', 'archived'].map((f) => (
//               <button
//                 key={f}
//                 onClick={() => setActiveFilter(f as any)}
//                 className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${
//                   activeFilter === f 
//                     ? 'bg-black text-white' 
//                     : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
//                 }`}
//               >
//                 {f}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Conversation List */}
//         <div className="flex-1 overflow-y-auto">
//           {loadingConversations ? (
//             <div className="p-10 flex justify-center"><div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>
//           ) : filteredConversations.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full p-8 text-center opacity-60">
//               <MessageCircle className="h-12 w-12 text-neutral-300 mb-3" />
//               <p className="text-sm font-medium">No conversations found</p>
//             </div>
//           ) : (
//             <div className="divide-y divide-neutral-50">
//               {filteredConversations.map((conv) => {
//                 const status = userOnlineStatuses[conv.otherUserId];
//                 const isOnline = status?.isOnline || false;
//                 const lastSeenText = status?.lastSeenText || 'Never online';
//                 return (
//                   <div
//                     key={conv.id}
//                     onClick={() => router.push(`/dashboard/messages?id=${conv.id}`)}
//                     className={`group relative p-4 cursor-pointer transition-all hover:bg-neutral-50 ${
//                       conversationId === conv.id ? 'bg-orange-50/50' : ''
//                     }`}
//                   >
//                     {/* Active Indicator */}
//                     {conversationId === conv.id && (
//                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-600 rounded-r-full" />
//                     )}

//                     <div className="flex gap-4">
//                       {/* Avatar with dynamic online status */}
//                       <div className="relative flex-shrink-0">
//                         {conv.otherUserData?.photoURL ? (
//                           <img src={conv.otherUserData.photoURL} alt="" className="w-12 h-12 rounded-full object-cover border border-neutral-100" />
//                         ) : (
//                           <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
//                             {conv.otherUserData?.displayName?.[0] || '?'}
//                           </div>
//                         )}
//                         {/* Online status dot */}
//                         {!statusLoading && (
//                           <div 
//                             className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
//                               isOnline ? 'bg-green-500' : 'bg-gray-400'
//                             }`}
//                             title={isOnline ? "Online now" : lastSeenText}
//                           />
//                         )}
//                       </div>

//                       <div className="flex-1 min-w-0">
//                         <div className="flex justify-between items-baseline mb-1">
//                           <h3 className={`text-sm font-bold truncate ${conversationId === conv.id ? 'text-black' : 'text-neutral-800'}`}>
//                             {conv.otherUserData?.displayName || 'Unknown'}
//                           </h3>
//                           <span className={`text-[10px] font-medium ${conv.unreadCount ? 'text-orange-600' : 'text-neutral-400'}`}>
//                             {formatDate(conv.lastTimestamp)}
//                           </span>
//                         </div>
                        
//                         <div className="flex justify-between items-center">
//                           <p className={`text-xs truncate pr-4 ${conv.unreadCount ? 'font-bold text-black' : 'text-neutral-500'}`}>
//                             {conv.lastMessage || 'Start a conversation'}
//                           </p>
//                           {conv.unreadCount ? (
//                             <span className="h-5 min-w-[20px] px-1.5 flex items-center justify-center bg-orange-600 text-white text-[10px] font-bold rounded-full">
//                               {conv.unreadCount}
//                             </span>
//                           ) : null}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 2. RIGHT MAIN AREA (Chat) */}
//       <div className={`flex-1 flex flex-col bg-[#fcfcfc] relative ${!conversationId ? 'hidden md:flex' : 'flex'}`}>
        
//         {/* Background Pattern */}
//         <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
//              style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
//         </div>

//         {conversationId ? (
//           <>
//             {/* Chat Header */}
//             <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 py-3 flex justify-between items-center shadow-sm">
//               <div className="flex items-center gap-3">
//                 <button onClick={() => router.push('/dashboard/messages')} className="md:hidden p-2 -ml-2 text-neutral-500">
//                   <ChevronLeft className="h-6 w-6" />
//                 </button>
                
//                 <Link href={otherUser ? `/profile/${otherUser.uid}` : '#'} className="flex items-center gap-3 group">
//                   <div className="relative">
//                     {otherUser?.photoURL ? (
//                       <img src={otherUser.photoURL} alt="" className="w-10 h-10 rounded-full object-cover" />
//                     ) : (
//                       <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
//                         {otherUser?.displayName?.[0] || '?'}
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <h2 className="text-sm font-bold text-black group-hover:text-orange-600 transition-colors">
//                       {otherUser?.displayName || 'Loading...'}
//                     </h2>
//                     <p className="text-xs text-neutral-500 font-medium flex items-center gap-1">
//                       {typingUsers.length > 0 ? (
//                         <span className="text-orange-600 animate-pulse font-bold">typing...</span>
//                       ) : (
//                         <>
//                           <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Active Now
//                         </>
//                       )}
//                     </p>
//                   </div>
//                 </Link>
//               </div>

//               <div className="flex items-center gap-1">
//                 <button className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors">
//                   <Phone className="h-5 w-5" />
//                 </button>
//                 <button className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors">
//                   <Video className="h-5 w-5" />
//                 </button>
//                 <button className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors">
//                   <MoreHorizontal className="h-5 w-5" />
//                 </button>
//               </div>
//             </header>

//             {/* Messages Area */}
//             <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
//               {loadingMessages ? (
//                 <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-neutral-200 border-t-orange-500 rounded-full animate-spin"></div></div>
//               ) : messages.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full opacity-50">
//                   <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-4xl">👋</div>
//                   <p className="text-neutral-500 font-medium">Say hello to start the conversation!</p>
//                 </div>
//               ) : (
//                 <>
//                   {messages.map((msg, i) => {
//                     const isMe = msg.senderId === user.uid;
//                     return (
//                       <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
//                         <div className={`max-w-[75%] relative`}>
//                           <div className={`
//                             px-5 py-3 text-sm leading-relaxed shadow-sm break-words
//                             ${isMe 
//                               ? 'bg-orange-600 text-white rounded-2xl rounded-tr-sm' 
//                               : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-neutral-100'}
//                           `}>
//                             {msg.text}
//                           </div>
                          
//                           <div className={`flex items-center gap-1 mt-1 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
//                             <span className="text-[10px] text-neutral-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
//                               {formatTime(msg.timestamp)}
//                             </span>
//                             {isMe && (
//                               <span className="text-[10px]">
//                                 {msg.status === 'read' ? <CheckCheck className="h-3 w-3 text-blue-500" /> : <Check className="h-3 w-3 text-neutral-400" />}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
                  
//                   {/* Typing Bubble */}
//                   {typingUsers.length > 0 && (
//                     <div className="flex justify-start">
//                       <div className="bg-white border border-neutral-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
//                         <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></div>
//                         <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-100"></div>
//                         <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-200"></div>
//                       </div>
//                     </div>
//                   )}
//                   <div ref={messagesEndRef} />
//                 </>
//               )}
//             </div>

//             {/* Input Area - FIXED for feedback button overlap */}
//             <div className="sticky bottom-0 z-50 p-4 md:p-6 pt-2 bg-transparent">
//               <form onSubmit={handleSendMessage} className="flex items-end gap-2 bg-white p-2 rounded-[2rem] shadow-xl border border-neutral-100 ring-1 ring-black/5 relative">
//                 <div className="flex gap-1 pl-2 pb-2">
//                   <button type="button" className="p-2 text-neutral-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors">
//                     <Paperclip className="h-5 w-5" />
//                   </button>
//                 </div>

//                 <input
//                   type="text"
//                   value={newMessage}
//                   onChange={(e) => handleTyping(e.target.value)}
//                   placeholder="Type a message..."
//                   className="flex-1 max-h-32 py-3 px-2 bg-transparent outline-none text-black placeholder-neutral-400 text-sm"
//                   disabled={sending}
//                   autoFocus
//                 />

//                 <button
//                   type="submit"
//                   disabled={!newMessage.trim() || sending}
//                   className={`
//                     w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all relative z-50
//                     ${!newMessage.trim() || sending 
//                       ? 'bg-neutral-100 text-neutral-300' 
//                       : 'bg-black text-white hover:bg-orange-600 shadow-md transform hover:scale-105 active:scale-95'}
//                   `}
//                 >
//                   {sending ? (
//                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                   ) : (
//                     <Send className="h-4 w-4 ml-0.5" />
//                   )}
//                 </button>
//               </form>
//             </div>
//           </>
//         ) : (
//           /* Empty State (Desktop) */
//           <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-neutral-50/50">
//             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-neutral-100">
//               <span className="text-5xl">✨</span>
//             </div>
//             <h2 className="text-2xl font-black text-black mb-2">Select a Conversation</h2>
//             <p className="text-neutral-500 max-w-sm mb-8">
//               Choose a chat from the left to start messaging, or expand your network to find new opportunities.
//             </p>
//             <Link
//               href="/network"
//               className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg"
//             >
//               Start New Chat
//             </Link>
//           </div>
//         )}
//       </div>

//       {/* Custom CSS for preventing feedback button overlap */}
//       <style jsx global>{`
//         /* Ensure feedback button doesn't overlap chat input */
//         .feedback-button, 
//         [data-feedback-button],
//         button[aria-label*="feedback"],
//         button[aria-label*="Feedback"] {
//           bottom: 100px !important;
//           right: 20px !important;
//         }
        
//         /* Make sure our chat input stays on top */
//         .sticky.bottom-0.z-50 {
//           position: sticky;
//           z-index: 50;
//         }
        
//         /* Adjust for mobile */
//         @media (max-width: 768px) {
//           .feedback-button, 
//           [data-feedback-button],
//           button[aria-label*="feedback"],
//           button[aria-label*="Feedback"] {
//             bottom: 80px !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// // --- SERVER COMPONENT WITH SUSPENSE BOUNDARY ---
// export default function MessagesPage() {
//   return (
//     <Suspense fallback={
//       <div className="h-screen bg-white flex items-center justify-center">
//         <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     }>
//       <MessagesPageClient />
//     </Suspense>
//   );
// }



//--------------------------------working version 2 

"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { debounce } from "lodash";
import { 
  Search, MessageCircle, Users, Send, MoreVertical, Phone, Video, 
  Paperclip, Check, CheckCheck, ChevronLeft, MoreHorizontal 
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { updateMessageStatus } from "@/lib/sendMessage";
import { startTyping, stopTyping, debouncedStopTyping, listenForTyping } from "@/lib/typing";
import { useMultipleUserOnlineStatus } from "@/hooks/useOnlineStatus";
import { 
  getUserConversations, 
  markConversationRead, 
  ConversationWithOtherUser 
} from "@/lib/conversations";
import { 
  collection, query, where, orderBy, onSnapshot, DocumentSnapshot, Timestamp, addDoc,
  getDocs, getDoc, doc
} from "firebase/firestore";

// --- TYPES ---
interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  timestamp: any;
  status: 'sent' | 'delivered' | 'read';
  conversationId: string;
}

// Helper: safe date conversion
const toJSDate = (date: any): Date => {
  if (!date) return new Date();
  if (date instanceof Date) return date;
  if (date && typeof date.toDate === "function") return date.toDate();
  return new Date(date);
};

function MessagesPageClient() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("id") || "";
  const [user, loadingAuth] = useAuthState(auth);
  const router = useRouter();

  // --- Conversations state (paginated) ---
  const [conversations, setConversations] = useState<ConversationWithOtherUser[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "archived">("all");

  // --- Chat state (active conversation) ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeMessagesRef = useRef<(() => void) | null>(null);
  const unsubscribeTypingRef = useRef<(() => void) | null>(null);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  // --- Load conversations with pagination ---
  const loadConversations = async (reset = true) => {
    if (!user) return;
    setLoadingConversations(true);
    try {
      const result = await getUserConversations(
        user.uid,
        20,
        reset ? undefined : lastDoc || undefined
      );
      if (reset) {
        setConversations(result.conversations);
      } else {
        setConversations(prev => [...prev, ...result.conversations]);
      }
      setLastDoc(result.lastDoc);
      setHasMore(result.lastDoc !== null);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoadingConversations(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (user) {
      loadConversations(true);
    }
  }, [user]);

  // Listener for real-time updates (optional but keeps inbox fresh)
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", user.uid),
      orderBy("updatedAt", "desc")
    );
    const unsubscribe = onSnapshot(q, () => {
      loadConversations(true);
    });
    return () => unsubscribe();
  }, [user]);

  // --- Filter conversations ---
  const filteredConversations = useMemo(() => {
    let filtered = conversations;
    if (activeFilter === "unread") {
      filtered = filtered.filter(c => c.unreadCountForCurrentUser > 0);
    } else if (activeFilter === "archived") {
      filtered = filtered.filter(c => (c as any).isArchived);
    } else {
      filtered = filtered.filter(c => !(c as any).isArchived);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(c =>
        c.otherUserData.displayName.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [conversations, searchQuery, activeFilter]);

  const otherUserIds = useMemo(() => filteredConversations.map(c => c.otherUserId), [filteredConversations]);
  const { statusMap: userOnlineStatuses, loading: statusLoading } = useMultipleUserOnlineStatus(otherUserIds);

  const handleSearchChange = debounce((val: string) => setSearchQuery(val), 300);

  // --- Active chat logic ---
  useEffect(() => {
    if (!user || !conversationId) {
      setMessages([]);
      setOtherUser(null);
      setTypingUsers([]);
      return;
    }

    setLoadingMessages(true);
    if (unsubscribeMessagesRef.current) unsubscribeMessagesRef.current();
    if (unsubscribeTypingRef.current) unsubscribeTypingRef.current();

    // Mark conversation as read in Firestore
    markConversationRead(conversationId, user.uid).catch(console.error);

    // Fetch other user data from conversation document
    const fetchOtherUser = async () => {
      const ids = conversationId.split("_");
      const otherId = ids[0] === user.uid ? ids[1] : ids[0];
      const convRef = doc(db, "conversations", conversationId);
      const convSnap = await getDoc(convRef);
      if (convSnap.exists()) {
        const data = convSnap.data();
        const otherData = data.participantData?.[otherId];
        if (otherData) {
          setOtherUser(otherData);
          return;
        }
      }
      // Fallback to users collection
      const userQuery = query(collection(db, "users"), where("__name__", "==", otherId));
      const snap = await getDocs(userQuery);
      if (!snap.empty) setOtherUser(snap.docs[0].data());
    };
    fetchOtherUser();

    // Messages listener
    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", conversationId),
      orderBy("timestamp", "asc")
    );
    unsubscribeMessagesRef.current = onSnapshot(q, (snap) => {
      const msgs: Message[] = [];
      snap.forEach(docSnap => msgs.push({ id: docSnap.id, ...docSnap.data() } as Message));
      setMessages(msgs);
      setLoadingMessages(false);
      const unread = msgs.filter(m => m.receiverId === user.uid && m.status !== "read");
      unread.forEach(m => updateMessageStatus(m.id, "read"));
      setConversations(prev =>
        prev.map(c => (c.id === conversationId ? { ...c, unreadCountForCurrentUser: 0 } : c))
      );
    });

    // Typing listener
    unsubscribeTypingRef.current = listenForTyping(conversationId, (users) => {
      const others = users.filter(u => u !== user.uid);
      setTypingUsers(others);
    });

    return () => {
      if (unsubscribeMessagesRef.current) unsubscribeMessagesRef.current();
      if (unsubscribeTypingRef.current) unsubscribeTypingRef.current();
    };
  }, [user, conversationId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !conversationId || sending) return;
    setSending(true);
    try {
      await stopTyping(conversationId, user.uid);
      const ids = conversationId.split("_");
      const receiverId = ids[0] === user.uid ? ids[1] : ids[0];
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        senderId: user.uid,
        receiverId,
        timestamp: Timestamp.now(),
        status: "sent",
        conversationId,
      });
      setNewMessage("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (text: string) => {
    setNewMessage(text);
    if (!user || !conversationId) return;
    if (text.trim().length > 0) startTyping(conversationId, user.uid);
    else debouncedStopTyping(conversationId, user.uid);
  };

  const formatDate = (d?: any) => {
    const date = toJSDate(d);
    const now = new Date();
    if (now.toDateString() === date.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  if (loadingAuth) return <div className="h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans text-neutral-900">
      {/* LEFT SIDEBAR (Inbox) */}
      <div className={`w-full md:w-[400px] flex-shrink-0 flex flex-col border-r border-neutral-200 bg-white ${conversationId ? "hidden md:flex" : "flex"}`}>
        <div className="p-5 border-b border-neutral-100">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-black text-black tracking-tight">Messages</h1>
            <div className="flex gap-2">
              <Link href="/network" className="p-2 hover:bg-neutral-100 rounded-full transition-colors" title="New Message">
                <Users className="h-5 w-5 text-neutral-600" />
              </Link>
              <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                <MoreVertical className="h-5 w-5 text-neutral-600" />
              </button>
            </div>
          </div>
          <div className="relative group mb-4">
            <Search className="h-4 w-4 text-neutral-400 absolute left-3 top-3.5 group-focus-within:text-orange-600 transition-colors" />
            <input
              type="text"
              placeholder="Search inbox..."
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {["all", "unread", "archived"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${
                  activeFilter === f ? "bg-black text-white" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingConversations ? (
            <div className="p-10 flex justify-center"><div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center opacity-60">
              <MessageCircle className="h-12 w-12 text-neutral-300 mb-3" />
              <p className="text-sm font-medium">No conversations found</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-50">
              {filteredConversations.map((conv) => {
                const status = userOnlineStatuses[conv.otherUserId];
                const isOnline = status?.isOnline || false;
                const lastSeenText = status?.lastSeenText || "Never online";
                return (
                  <div
                    key={conv.id}
                    onClick={() => router.push(`/dashboard/messages?id=${conv.id}`)}
                    className={`group relative p-4 cursor-pointer transition-all hover:bg-neutral-50 ${
                      conversationId === conv.id ? "bg-orange-50/50" : ""
                    }`}
                  >
                    {conversationId === conv.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-600 rounded-r-full" />}
                    <div className="flex gap-4">
                      <div className="relative flex-shrink-0">
                        {conv.otherUserData.photoURL ? (
                          <img src={conv.otherUserData.photoURL} alt="" className="w-12 h-12 rounded-full object-cover border border-neutral-100" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                            {conv.otherUserData.displayName?.[0] || "?"}
                          </div>
                        )}
                        {!statusLoading && (
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isOnline ? "bg-green-500" : "bg-gray-400"}`}
                               title={isOnline ? "Online now" : lastSeenText} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className={`text-sm font-bold truncate ${conversationId === conv.id ? "text-black" : "text-neutral-800"}`}>
                            {conv.otherUserData.displayName}
                          </h3>
                          <span className={`text-[10px] font-medium ${conv.unreadCountForCurrentUser ? "text-orange-600" : "text-neutral-400"}`}>
                            {formatDate(conv.lastTimestamp)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className={`text-xs truncate pr-4 ${conv.unreadCountForCurrentUser ? "font-bold text-black" : "text-neutral-500"}`}>
                            {conv.lastMessage || "Start a conversation"}
                          </p>
                          {conv.unreadCountForCurrentUser > 0 && (
                            <span className="h-5 min-w-[20px] px-1.5 flex items-center justify-center bg-orange-600 text-white text-[10px] font-bold rounded-full">
                              {conv.unreadCountForCurrentUser}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {hasMore && !loadingConversations && (
                <div className="p-4 text-center">
                  <button
                    onClick={() => loadConversations(false)}
                    className="px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700"
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT MAIN AREA (Chat) */}
      <div className={`flex-1 flex flex-col bg-[#fcfcfc] relative ${!conversationId ? "hidden md:flex" : "flex"}`}>
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        {conversationId ? (
          <>
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 py-3 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <button onClick={() => router.push("/dashboard/messages")} className="md:hidden p-2 -ml-2 text-neutral-500">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <Link href={otherUser ? `/profile/${otherUser.uid}` : "#"} className="flex items-center gap-3 group">
                  <div className="relative">
                    {otherUser?.photoURL ? (
                      <img src={otherUser.photoURL} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                        {otherUser?.displayName?.[0] || "?"}
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-black group-hover:text-orange-600 transition-colors">
                      {otherUser?.displayName || "Loading..."}
                    </h2>
                    <p className="text-xs text-neutral-500 font-medium flex items-center gap-1">
                      {typingUsers.length > 0 ? (
                        <span className="text-orange-600 animate-pulse font-bold">typing...</span>
                      ) : (
                        <><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Active Now</>
                      )}
                    </p>
                  </div>
                </Link>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors">
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </header>
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
              {loadingMessages ? (
                <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-neutral-200 border-t-orange-500 rounded-full animate-spin"></div></div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-50">
                  <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-4xl">👋</div>
                  <p className="text-neutral-500 font-medium">Say hello to start the conversation!</p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => {
                    const isMe = msg.senderId === user.uid;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`max-w-[75%] relative`}>
                          <div className={`px-5 py-3 text-sm leading-relaxed shadow-sm break-words ${
                            isMe ? "bg-orange-600 text-white rounded-2xl rounded-tr-sm" : "bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-neutral-100"
                          }`}>
                            {msg.text}
                          </div>
                          <div className={`flex items-center gap-1 mt-1 px-1 ${isMe ? "justify-end" : "justify-start"}`}>
                            <span className="text-[10px] text-neutral-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                              {formatDate(msg.timestamp)}
                            </span>
                            {isMe && (
                              <span className="text-[10px]">
                                {msg.status === "read" ? <CheckCheck className="h-3 w-3 text-blue-500" /> : <Check className="h-3 w-3 text-neutral-400" />}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {typingUsers.length > 0 && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-neutral-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            <div className="sticky bottom-0 z-50 p-4 md:p-6 pt-2 bg-transparent">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2 bg-white p-2 rounded-[2rem] shadow-xl border border-neutral-100 ring-1 ring-black/5 relative">
                <div className="flex gap-1 pl-2 pb-2">
                  <button type="button" className="p-2 text-neutral-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors">
                    <Paperclip className="h-5 w-5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => handleTyping(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 max-h-32 py-3 px-2 bg-transparent outline-none text-black placeholder-neutral-400 text-sm"
                  disabled={sending}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all relative z-50 ${
                    !newMessage.trim() || sending ? "bg-neutral-100 text-neutral-300" : "bg-black text-white hover:bg-orange-600 shadow-md transform hover:scale-105 active:scale-95"
                  }`}
                >
                  {sending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Send className="h-4 w-4 ml-0.5" />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-neutral-50/50">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-neutral-100">
              <span className="text-5xl">✨</span>
            </div>
            <h2 className="text-2xl font-black text-black mb-2">Select a Conversation</h2>
            <p className="text-neutral-500 max-w-sm mb-8">
              Choose a chat from the left to start messaging, or expand your network to find new opportunities.
            </p>
            <Link href="/network" className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg">
              Start New Chat
            </Link>
          </div>
        )}
      </div>
      <style jsx global>{`
        .feedback-button, [data-feedback-button], button[aria-label*="feedback"], button[aria-label*="Feedback"] {
          bottom: 100px !important;
          right: 20px !important;
        }
        .sticky.bottom-0.z-50 { position: sticky; z-index: 50; }
        @media (max-width: 768px) {
          .feedback-button, [data-feedback-button], button[aria-label*="feedback"], button[aria-label*="Feedback"] {
            bottom: 80px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <MessagesPageClient />
    </Suspense>
  );
}