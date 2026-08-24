// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { collection, query, where, orderBy, getDocs, onSnapshot, DocumentData, updateDoc, doc } from 'firebase/firestore';
// import Link from 'next/link';
// import { sendMessage, updateMessageStatus } from '@/lib/sendMessage';

// interface Message {
//   id: string;
//   text: string;
//   senderId: string;
//   receiverId: string;
//   timestamp: Date;
//   status: 'sent' | 'delivered' | 'read'; // NEW: Add status field
// }

// export default function ConversationPage() {
//   const params = useParams();
//   const conversationId = params.conversationId as string;
//   const [user] = useAuthState(auth);
//   const router = useRouter();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [otherUser, setOtherUser] = useState<DocumentData | null>(null);
//   const [sending, setSending] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const unsubscribeRef = useRef<(() => void) | null>(null);
//   const conversationViewedRef = useRef(false); // NEW: Track if conversation has been viewed

//   // Auto-scroll to bottom when messages change
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // NEW: Mark messages as read when conversation is viewed
//   useEffect(() => {
//     if (!user || !conversationId || conversationViewedRef.current) return;
    
//     conversationViewedRef.current = true;
//     markMessagesAsRead();
//   }, [user, conversationId, messages]);

//   // NEW: Function to mark messages as read
//   const markMessagesAsRead = async () => {
//     if (!user) return;
    
//     try {
//       // Find messages sent to current user that are not yet read
//       const messagesToMarkAsRead = messages.filter(
//         message => message.receiverId === user.uid && message.status !== 'read'
//       );
      
//       // Update each message status to 'read'
//       for (const message of messagesToMarkAsRead) {
//         await updateMessageStatus(message.id, 'read');
//       }
//     } catch (error) {
//       console.error('Error marking messages as read:', error);
//     }
//   };

//   // Fetch messages for this conversation
//   useEffect(() => {
//     if (!user || !conversationId) return;

//     const messagesRef = collection(db, 'messages');
//     const q = query(
//       messagesRef,
//       where('conversationId', '==', conversationId),
//       orderBy('timestamp', 'asc')
//     );

//     // Check if we're already subscribed
//     if (unsubscribeRef.current) {
//       unsubscribeRef.current();
//     }

//     try {
//       unsubscribeRef.current = onSnapshot(q, 
//         (snapshot) => {
//           const messagesData: Message[] = [];
//           snapshot.forEach((doc) => {
//             const data = doc.data();
//             messagesData.push({
//               id: doc.id,
//               text: data.text,
//               senderId: data.senderId,
//               receiverId: data.receiverId, // NEW: Include receiverId
//               timestamp: data.timestamp?.toDate() || new Date(),
//               status: data.status || 'sent', // NEW: Include status with default
//             });
//           });
//           setMessages(messagesData);
//           setLoading(false);
          
//           // NEW: Mark messages as delivered when they are received
//           markMessagesAsDelivered(messagesData);
//         },
//         (error) => {
//           console.error('Error in messages snapshot:', error);
//           setLoading(false);
//         }
//       );
//     } catch (error) {
//       console.error('Error setting up snapshot listener:', error);
//       setLoading(false);
//     }

//     // Cleanup on unmount or when dependencies change
//     return () => {
//       if (unsubscribeRef.current) {
//         unsubscribeRef.current();
//         unsubscribeRef.current = null;
//       }
//     };
//   }, [user, conversationId]);

//   // NEW: Function to mark messages as delivered
//   const markMessagesAsDelivered = async (messagesData: Message[]) => {
//     if (!user) return;
    
//     try {
//       // Find messages sent to current user that are still marked as 'sent'
//       const messagesToMarkAsDelivered = messagesData.filter(
//         message => message.receiverId === user.uid && message.status === 'sent'
//       );
      
//       // Update each message status to 'delivered'
//       for (const message of messagesToMarkAsDelivered) {
//         await updateMessageStatus(message.id, 'delivered');
//       }
//     } catch (error) {
//       console.error('Error marking messages as delivered:', error);
//     }
//   };

//   // Fetch the other user's profile data
//   useEffect(() => {
//     async function fetchOtherUser() {
//       if (!conversationId || !user) return;

//       const userIds = conversationId.split('_');
//       const otherUserId = userIds[0] === user.uid ? userIds[1] : userIds[0];

//       try {
//         const userQuery = query(collection(db, 'users'), where('__name__', '==', otherUserId));
//         const userDoc = await getDocs(userQuery);
//         if (!userDoc.empty) {
//           setOtherUser(userDoc.docs[0].data());
//         }
//       } catch (error) {
//         console.error('Error fetching other user:', error);
//       }
//     }

//     fetchOtherUser();
//   }, [conversationId, user]);

//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !user || !conversationId || sending) return;

//     setSending(true);
//     try {
//       await sendMessage({
//         text: newMessage,
//         senderId: user.uid,
//         receiverId: conversationId.split('_').find(id => id !== user.uid) || user.uid,
//       });
//       setNewMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     } finally {
//       setSending(false);
//     }
//   };

//   // NEW: Function to get status icon based on message status
//   const getStatusIcon = (status: string, isSender: boolean) => {
//     if (!isSender) return null;
    
//     switch (status) {
//       case 'sent':
//         return '✓'; // Single checkmark for sent
//       case 'delivered':
//         return '✓✓'; // Double checkmark for delivered
//       case 'read':
//         return '✓✓ ✓'; // Double checkmark with color for read
//       default:
//         return '';
//     }
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <p className="text-black">Please log in to view messages.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       {/* Header */}
//       <header className="bg-white border-b border-orange-200 p-4 sticky top-0 z-10">
//         <div className="max-w-4xl mx-auto flex items-center">
//           <Link 
//             href="/dashboard/messages"
//             className="text-orange-500 mr-4 p-2 hover:bg-orange-100 rounded-full"
//           >
//             ←
//           </Link>
//           <div>
//             <h1 className="text-xl font-semibold text-black">
//               {otherUser?.displayName || 'Loading...'}
//             </h1>
//             <p className="text-sm text-black">
//               {otherUser?.headline || 'Active now'}
//             </p>
//           </div>
//         </div>
//       </header>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 pb-20">
//         {loading ? (
//           <div className="text-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
//             <p className="mt-2 text-black">Loading messages...</p>
//           </div>
//         ) : messages.length === 0 ? (
//           <div className="text-center py-8">
//             <p className="text-black">No messages yet. Start the conversation!</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {messages.map((message) => {
//               const isSender = message.senderId === user.uid;
//               return (
//                 <div
//                   key={message.id}
//                   className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
//                 >
//                   <div
//                     className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
//                       isSender
//                         ? 'bg-orange-500 text-white'
//                         : 'bg-orange-100 text-black'
//                     }`}
//                   >
//                     <p className="text-sm">{message.text}</p>
//                     <div className="flex justify-between items-end mt-1">
//                       <p className={`text-xs ${isSender ? 'text-orange-100' : 'text-black'}`}>
//                         {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                       </p>
//                       {/* NEW: Status indicator */}
//                       <span className={`text-xs ml-2 ${message.status === 'read' ? 'text-blue-300' : 'text-orange-100'}`}>
//                         {getStatusIcon(message.status, isSender)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//             <div ref={messagesEndRef} />
//           </div>
//         )}
//       </div>

//       {/* Message Input */}
//       <footer className="bg-white border-t border-orange-200 p-4 sticky bottom-0">
//         <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-2">
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type a message..."
//             className="flex-1 border border-orange-300 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder-gray-500"
//             disabled={sending}
//           />
//           <button
//             type="submit"
//             disabled={!newMessage.trim() || sending}
//             className="bg-orange-500 text-white rounded-2xl px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
//           >
//             {sending ? 'Sending...' : 'Send'}
//           </button>
//         </form>
//       </footer>
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState, useRef, useCallback } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { collection, query, where, orderBy, getDocs, onSnapshot, DocumentData, updateDoc, doc } from 'firebase/firestore';
// import Link from 'next/link';
// import { sendMessage, updateMessageStatus } from '@/lib/sendMessage';
// import { startTyping, stopTyping, debouncedStopTyping, listenForTyping } from '@/lib/typing';
// import { debounce } from 'lodash';

// interface Message {
//   id: string;
//   text: string;
//   senderId: string;
//   receiverId: string;
//   timestamp: Date;
//   status: 'sent' | 'delivered' | 'read';
// }

// export default function ConversationPage() {
//   const params = useParams();
//   const conversationId = params.conversationId as string;
//   const [user] = useAuthState(auth);
//   const router = useRouter();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [otherUser, setOtherUser] = useState<DocumentData | null>(null);
//   const [sending, setSending] = useState(false);
//   const [typingUsers, setTypingUsers] = useState<string[]>([]); // NEW: Track typing users
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const unsubscribeRef = useRef<(() => void) | null>(null);
//   const unsubscribeTypingRef = useRef<(() => void) | null>(null); // NEW: Ref for typing listener
//   const conversationViewedRef = useRef(false);

//   // Auto-scroll to bottom when messages change
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Mark messages as read when conversation is viewed
//   useEffect(() => {
//     if (!user || !conversationId || conversationViewedRef.current) return;
    
//     conversationViewedRef.current = true;
//     markMessagesAsRead();
//   }, [user, conversationId, messages]);

//   // Function to mark messages as read
//   const markMessagesAsRead = async () => {
//     if (!user) return;
    
//     try {
//       // Find messages sent to current user that are not yet read
//       const messagesToMarkAsRead = messages.filter(
//         message => message.receiverId === user.uid && message.status !== 'read'
//       );
      
//       // Update each message status to 'read'
//       for (const message of messagesToMarkAsRead) {
//         await updateMessageStatus(message.id, 'read');
//       }
//     } catch (error) {
//       console.error('Error marking messages as read:', error);
//     }
//   };

//   // NEW: Debounced function to handle typing
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

//   // NEW: Handle input changes with typing detection
//   const handleMessageChange = (text: string) => {
//     setNewMessage(text);
//     handleInputChange(text);
//   };

//   // NEW: Clean up typing status when component unmounts
//   useEffect(() => {
//     return () => {
//       if (user && conversationId) {
//         debouncedStopTyping(conversationId, user.uid);
//       }
//     };
//   }, [user, conversationId]);

//   // Fetch messages for this conversation
//   useEffect(() => {
//     if (!user || !conversationId) return;

//     const messagesRef = collection(db, 'messages');
//     const q = query(
//       messagesRef,
//       where('conversationId', '==', conversationId),
//       orderBy('timestamp', 'asc')
//     );

//     // Check if we're already subscribed
//     if (unsubscribeRef.current) {
//       unsubscribeRef.current();
//     }

//     try {
//       unsubscribeRef.current = onSnapshot(q, 
//         (snapshot) => {
//           const messagesData: Message[] = [];
//           snapshot.forEach((doc) => {
//             const data = doc.data();
//             messagesData.push({
//               id: doc.id,
//               text: data.text,
//               senderId: data.senderId,
//               receiverId: data.receiverId,
//               timestamp: data.timestamp?.toDate() || new Date(),
//               status: data.status || 'sent',
//             });
//           });
//           setMessages(messagesData);
//           setLoading(false);
          
//           // Mark messages as delivered when they are received
//           markMessagesAsDelivered(messagesData);
//         },
//         (error) => {
//           console.error('Error in messages snapshot:', error);
//           setLoading(false);
//         }
//       );
//     } catch (error) {
//       console.error('Error setting up snapshot listener:', error);
//       setLoading(false);
//     }

//     // NEW: Set up typing listener
//     if (unsubscribeTypingRef.current) {
//       unsubscribeTypingRef.current();
//     }

//     unsubscribeTypingRef.current = listenForTyping(
//       conversationId,
//       (users) => {
//         // Filter out current user from typing indicators
//         const otherTypingUsers = users.filter((uid) => uid !== user?.uid);
//         setTypingUsers(otherTypingUsers);
//       }
//     );

//     // Cleanup on unmount or when dependencies change
//     return () => {
//       if (unsubscribeRef.current) {
//         unsubscribeRef.current();
//         unsubscribeRef.current = null;
//       }
//       if (unsubscribeTypingRef.current) {
//         unsubscribeTypingRef.current();
//         unsubscribeTypingRef.current = null;
//       }
//     };
//   }, [user, conversationId]);

//   // Function to mark messages as delivered
//   const markMessagesAsDelivered = async (messagesData: Message[]) => {
//     if (!user) return;
    
//     try {
//       // Find messages sent to current user that are still marked as 'sent'
//       const messagesToMarkAsDelivered = messagesData.filter(
//         message => message.receiverId === user.uid && message.status === 'sent'
//       );
      
//       // Update each message status to 'delivered'
//       for (const message of messagesToMarkAsDelivered) {
//         await updateMessageStatus(message.id, 'delivered');
//       }
//     } catch (error) {
//       console.error('Error marking messages as delivered:', error);
//     }
//   };

//   // Fetch the other user's profile data
//   useEffect(() => {
//     async function fetchOtherUser() {
//       if (!conversationId || !user) return;

//       const userIds = conversationId.split('_');
//       const otherUserId = userIds[0] === user.uid ? userIds[1] : userIds[0];

//       try {
//         const userQuery = query(collection(db, 'users'), where('__name__', '==', otherUserId));
//         const userDoc = await getDocs(userQuery);
//         if (!userDoc.empty) {
//           setOtherUser(userDoc.docs[0].data());
//         }
//       } catch (error) {
//         console.error('Error fetching other user:', error);
//       }
//     }

//     fetchOtherUser();
//   }, [conversationId, user]);

//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !user || !conversationId || sending) return;

//     setSending(true);
//     try {
//       // NEW: Stop typing before sending
//       await stopTyping(conversationId, user.uid);
      
//       await sendMessage({
//         text: newMessage,
//         senderId: user.uid,
//         receiverId: conversationId.split('_').find(id => id !== user.uid) || user.uid,
//       });
//       setNewMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     } finally {
//       setSending(false);
//     }
//   };

//   // Function to get status icon based on message status
//   const getStatusIcon = (status: string, isSender: boolean) => {
//     if (!isSender) return null;
    
//     switch (status) {
//       case 'sent':
//         return '✓'; // Single checkmark for sent
//       case 'delivered':
//         return '✓✓'; // Double checkmark for delivered
//       case 'read':
//         return '✓✓ ✓'; // Double checkmark with color for read
//       default:
//         return '';
//     }
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <p className="text-black">Please log in to view messages.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       {/* Header */}
//       <header className="bg-white border-b border-orange-200 p-4 sticky top-0 z-10">
//         <div className="max-w-4xl mx-auto flex items-center">
//           <Link 
//             href="/dashboard/messages"
//             className="text-orange-500 mr-4 p-2 hover:bg-orange-100 rounded-full"
//           >
//             ←
//           </Link>
//           <div>
//             <h1 className="text-xl font-semibold text-black">
//               {otherUser?.displayName || 'Loading...'}
//             </h1>
//             <p className="text-sm text-black">
//               {otherUser?.headline || 'Active now'}
//             </p>
//           </div>
//         </div>
//       </header>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 pb-20">
//         {loading ? (
//           <div className="text-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
//             <p className="mt-2 text-black">Loading messages...</p>
//           </div>
//         ) : messages.length === 0 ? (
//           <div className="text-center py-8">
//             <p className="text-black">No messages yet. Start the conversation!</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {messages.map((message) => {
//               const isSender = message.senderId === user.uid;
//               return (
//                 <div
//                   key={message.id}
//                   className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
//                 >
//                   <div
//                     className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
//                       isSender
//                         ? 'bg-orange-500 text-white'
//                         : 'bg-orange-100 text-black'
//                     }`}
//                   >
//                     <p className="text-sm">{message.text}</p>
//                     <div className="flex justify-between items-end mt-1">
//                       <p className={`text-xs ${isSender ? 'text-orange-100' : 'text-black'}`}>
//                         {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                       </p>
//                       {/* Status indicator */}
//                       <span className={`text-xs ml-2 ${message.status === 'read' ? 'text-blue-300' : 'text-orange-100'}`}>
//                         {getStatusIcon(message.status, isSender)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
            
//             {/* NEW: Typing indicator */}
//             {typingUsers.length > 0 && (
//               <div className="flex justify-start">
//                 <div className="bg-orange-100 text-black max-w-xs lg:max-w-md px-4 py-2 rounded-2xl">
//                   <div className="flex items-center">
//                     <div className="typing-dots flex space-x-1">
//                       <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
//                       <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                       <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
//                     </div>
//                     <span className="ml-2 text-sm">typing...</span>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             <div ref={messagesEndRef} />
//           </div>
//         )}
//       </div>

//       {/* Message Input */}
//       <footer className="bg-white border-t border-orange-200 p-4 sticky bottom-0">
//         <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-2">
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => handleMessageChange(e.target.value)} // Updated to use handleMessageChange
//             placeholder="Type a message..."
//             className="flex-1 border border-orange-300 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder-gray-500"
//             disabled={sending}
//           />
//           <button
//             type="submit"
//             disabled={!newMessage.trim() || sending}
//             className="bg-orange-500 text-white rounded-2xl px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
//           >
//             {sending ? 'Sending...' : 'Send'}
//           </button>
//         </form>
//       </footer>
//     </div>
//   );
// }

// working main one

// 'use client';

// import { useEffect, useState, useRef, useCallback } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { collection, query, where, orderBy, getDocs, onSnapshot, DocumentData, updateDoc, doc } from 'firebase/firestore';
// import Link from 'next/link';
// import { sendMessage, updateMessageStatus } from '@/lib/sendMessage';
// import { startTyping, stopTyping, debouncedStopTyping, listenForTyping } from '@/lib/typing';
// import { debounce } from 'lodash';

// interface Message {
//   id: string;
//   text: string;
//   senderId: string;
//   receiverId: string;
//   timestamp: Date;
//   status: 'sent' | 'delivered' | 'read';
// }

// export default function ConversationPage() {
//   const params = useParams();
//   const conversationId = params.conversationId as string;
//   const [user] = useAuthState(auth);
//   const router = useRouter();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [otherUser, setOtherUser] = useState<DocumentData | null>(null);
//   const [sending, setSending] = useState(false);
//   const [typingUsers, setTypingUsers] = useState<string[]>([]);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const unsubscribeRef = useRef<(() => void) | null>(null);
//   const unsubscribeTypingRef = useRef<(() => void) | null>(null);
//   const conversationViewedRef = useRef(false);

//   // LOGIC PRESERVED: Auto-scroll
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, typingUsers]);

//   // LOGIC PRESERVED: Mark Read
//   useEffect(() => {
//     if (!user || !conversationId || conversationViewedRef.current) return;
//     conversationViewedRef.current = true;
//     markMessagesAsRead();
//   }, [user, conversationId, messages]);

//   const markMessagesAsRead = async () => {
//     if (!user) return;
//     try {
//       const messagesToMarkAsRead = messages.filter(
//         message => message.receiverId === user.uid && message.status !== 'read'
//       );
//       for (const message of messagesToMarkAsRead) {
//         await updateMessageStatus(message.id, 'read');
//       }
//     } catch (error) {
//       console.error('Error marking messages as read:', error);
//     }
//   };

//   // LOGIC PRESERVED: Typing Handling
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

//   const handleMessageChange = (text: string) => {
//     setNewMessage(text);
//     handleInputChange(text);
//   };

//   useEffect(() => {
//     return () => {
//       if (user && conversationId) {
//         debouncedStopTyping(conversationId, user.uid);
//       }
//     };
//   }, [user, conversationId]);

//   // LOGIC PRESERVED: Fetch Messages
//   useEffect(() => {
//     if (!user || !conversationId) return;

//     const messagesRef = collection(db, 'messages');
//     const q = query(
//       messagesRef,
//       where('conversationId', '==', conversationId),
//       orderBy('timestamp', 'asc')
//     );

//     if (unsubscribeRef.current) {
//       unsubscribeRef.current();
//     }

//     try {
//       unsubscribeRef.current = onSnapshot(q, 
//         (snapshot) => {
//           const messagesData: Message[] = [];
//           snapshot.forEach((doc) => {
//             const data = doc.data();
//             messagesData.push({
//               id: doc.id,
//               text: data.text,
//               senderId: data.senderId,
//               receiverId: data.receiverId,
//               timestamp: data.timestamp?.toDate() || new Date(),
//               status: data.status || 'sent',
//             });
//           });
//           setMessages(messagesData);
//           setLoading(false);
//           markMessagesAsDelivered(messagesData);
//         },
//         (error) => {
//           console.error('Error in messages snapshot:', error);
//           setLoading(false);
//         }
//       );
//     } catch (error) {
//       console.error('Error setting up snapshot listener:', error);
//       setLoading(false);
//     }

//     // Typing Listener
//     if (unsubscribeTypingRef.current) {
//       unsubscribeTypingRef.current();
//     }

//     unsubscribeTypingRef.current = listenForTyping(
//       conversationId,
//       (users) => {
//         const otherTypingUsers = users.filter((uid) => uid !== user?.uid);
//         setTypingUsers(otherTypingUsers);
//       }
//     );

//     return () => {
//       if (unsubscribeRef.current) {
//         unsubscribeRef.current();
//         unsubscribeRef.current = null;
//       }
//       if (unsubscribeTypingRef.current) {
//         unsubscribeTypingRef.current();
//         unsubscribeTypingRef.current = null;
//       }
//     };
//   }, [user, conversationId]);

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

//   // LOGIC PRESERVED: Fetch Other User
//   useEffect(() => {
//     async function fetchOtherUser() {
//       if (!conversationId || !user) return;
//       const userIds = conversationId.split('_');
//       const otherUserId = userIds[0] === user.uid ? userIds[1] : userIds[0];

//       try {
//         const userQuery = query(collection(db, 'users'), where('__name__', '==', otherUserId));
//         const userDoc = await getDocs(userQuery);
//         if (!userDoc.empty) {
//           setOtherUser(userDoc.docs[0].data());
//         }
//       } catch (error) {
//         console.error('Error fetching other user:', error);
//       }
//     }
//     fetchOtherUser();
//   }, [conversationId, user]);

//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !user || !conversationId || sending) return;

//     setSending(true);
//     try {
//       await stopTyping(conversationId, user.uid);
//       await sendMessage({
//         text: newMessage,
//         senderId: user.uid,
//         receiverId: conversationId.split('_').find(id => id !== user.uid) || user.uid,
//       });
//       setNewMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     } finally {
//       setSending(false);
//     }
//   };

//   // Visual Helper: Status Icon
//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'sent':
//         return (
//           <svg className="w-3 h-3 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//           </svg>
//         );
//       case 'delivered':
//         return (
//           <div className="flex -space-x-1">
//             <svg className="w-3 h-3 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//             </svg>
//             <svg className="w-3 h-3 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//         );
//       case 'read':
//         return (
//           <div className="flex -space-x-1">
//             <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//             </svg>
//             <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//             </svg>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   if (!user) return null;

//   return (
//     <div className="flex flex-col h-screen bg-neutral-100 relative">
      
//       {/* 1. Glassmorphism Header */}
//       <header className="absolute top-0 w-full z-20 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-4 py-3 shadow-sm">
//         <div className="max-w-3xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Link 
//               href="/dashboard/messages"
//               className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-600"
//             >
//               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
//               </svg>
//             </Link>
            
//             <Link href={otherUser ? `/profile/${otherUser.uid}` : '#'} className="flex items-center gap-3 group">
//               <div className="relative">
//                 {otherUser?.photoURL ? (
//                   <img src={otherUser.photoURL} alt="User" className="w-10 h-10 rounded-full object-cover border border-neutral-200" />
//                 ) : (
//                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
//                     {otherUser?.displayName?.charAt(0) || '?'}
//                   </div>
//                 )}
//                 {/* Online Status Dot (Visual only for now) */}
//                 <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
//               </div>
              
//               <div>
//                 <h1 className="text-base font-bold text-black group-hover:text-orange-600 transition-colors leading-tight">
//                   {otherUser?.displayName || 'Loading User...'}
//                 </h1>
//                 <p className="text-xs text-neutral-500 font-medium">
//                   {typingUsers.length > 0 ? (
//                     <span className="text-orange-500 font-bold animate-pulse">typing...</span>
//                   ) : (
//                     otherUser?.headline || 'Professional Network'
//                   )}
//                 </p>
//               </div>
//             </Link>
//           </div>
          
//           <button className="p-2 text-neutral-400 hover:text-black transition-colors">
//             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
//             </svg>
//           </button>
//         </div>
//       </header>

//       {/* 2. Message Area with subtle pattern */}
//       <div className="flex-1 overflow-y-auto pt-20 pb-4 px-4 bg-[#f2f2f2]" 
//            style={{ backgroundImage: 'radial-gradient(#ddd 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
//         <div className="max-w-3xl mx-auto flex flex-col justify-end min-h-full">
          
//           {/* Loading State */}
//           {loading && (
//             <div className="flex flex-col items-center justify-center space-y-4 py-10 opacity-50">
//               <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
//               <p className="text-xs text-neutral-500 uppercase tracking-widest">Decrypting messages...</p>
//             </div>
//           )}

//           {/* Empty State */}
//           {!loading && messages.length === 0 && (
//             <div className="text-center py-12">
//               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-3xl">
//                 👋
//               </div>
//               <p className="text-neutral-500 font-medium">Say hello to {otherUser?.displayName?.split(' ')[0]}!</p>
//               <p className="text-xs text-neutral-400 mt-1">Start a professional conversation.</p>
//             </div>
//           )}

//           {/* Message List */}
//           <div className="space-y-3 pb-24">
//             {messages.map((message, index) => {
//               const isSender = message.senderId === user.uid;
//               const showTime = index === messages.length - 1 || messages[index + 1]?.senderId !== message.senderId;

//               return (
//                 <div
//                   key={message.id}
//                   className={`flex ${isSender ? 'justify-end' : 'justify-start'} group`}
//                 >
//                   <div
//                     className={`max-w-[85%] sm:max-w-[70%] relative px-4 py-3 shadow-sm text-sm leading-relaxed ${
//                       isSender
//                         ? 'bg-orange-600 text-white rounded-2xl rounded-tr-sm'
//                         : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm'
//                     }`}
//                   >
//                     <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    
//                     <div className={`flex items-center justify-end gap-1 mt-1 select-none ${isSender ? 'opacity-80' : 'opacity-40'}`}>
//                       <span className="text-[10px]">
//                         {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                       </span>
//                       {isSender && (
//                         <span className="ml-1">
//                           {getStatusIcon(message.status)}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}

//             {/* Typing Bubbles */}
//             {typingUsers.length > 0 && (
//               <div className="flex justify-start animate-fade-in">
//                 <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
//                   <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></div>
//                   <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-100"></div>
//                   <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-200"></div>
//                 </div>
//               </div>
//             )}
            
//             <div ref={messagesEndRef} />
//           </div>
//         </div>
//       </div>

//       {/* 3. Floating Input Area */}
//       <div className="fixed bottom-0 w-full p-4 bg-gradient-to-t from-white via-white to-transparent z-20">
//         <div className="max-w-3xl mx-auto">
//           <form 
//             onSubmit={handleSendMessage} 
//             className="flex items-end gap-2 bg-white p-2 rounded-3xl shadow-xl border border-neutral-100"
//           >
//             {/* Attachment Button (Visual Only for now) */}
//             <button 
//               type="button" 
//               className="p-3 text-neutral-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors"
//             >
//               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
//               </svg>
//             </button>

//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => handleMessageChange(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-1 max-h-32 py-3 px-2 bg-transparent outline-none text-black placeholder-neutral-400"
//               disabled={sending}
//               autoFocus
//             />

//             <button
//               type="submit"
//               disabled={!newMessage.trim() || sending}
//               className={`p-3 rounded-full transition-all duration-200 flex-shrink-0 ${
//                 !newMessage.trim() || sending
//                   ? 'bg-neutral-100 text-neutral-300'
//                   : 'bg-orange-600 text-white shadow-md hover:bg-black hover:scale-105 active:scale-95'
//               }`}
//             >
//               {sending ? (
//                 <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//               ) : (
//                 <svg className="w-5 h-5 transform rotate-90 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                 </svg>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }



// ------------------------------------ main code -----------------------------

// 'use client';

// import { useEffect, useState, useRef, useCallback } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { collection, query, where, orderBy, getDocs, onSnapshot, DocumentData, updateDoc, doc } from 'firebase/firestore';
// import Link from 'next/link';
// import { sendMessage, updateMessageStatus } from '@/lib/sendMessage';
// import { startTyping, stopTyping, debouncedStopTyping, listenForTyping } from '@/lib/typing';
// import { areUsersConnected } from '@/lib/connections'; // NEW IMPORT
// import { debounce } from 'lodash';

// interface Message {
//   id: string;
//   text: string;
//   senderId: string;
//   receiverId: string;
//   timestamp: Date;
//   status: 'sent' | 'delivered' | 'read';
// }

// export default function ConversationPage() {
//   const params = useParams();
//   const conversationId = params.conversationId as string;
//   const [user] = useAuthState(auth);
//   const router = useRouter();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [otherUser, setOtherUser] = useState<DocumentData | null>(null);
//   const [sending, setSending] = useState(false);
//   const [typingUsers, setTypingUsers] = useState<string[]>([]);
//   const [connectionError, setConnectionError] = useState<string | null>(null); // NEW: Track connection error
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const unsubscribeRef = useRef<(() => void) | null>(null);
//   const unsubscribeTypingRef = useRef<(() => void) | null>(null);
//   const conversationViewedRef = useRef(false);

//   // NEW: Check if users are connected
//   useEffect(() => {
//     async function checkConnection() {
//       if (!user || !conversationId) return;
      
//       try {
//         // Extract user IDs from conversationId
//         const userIds = conversationId.split('_');
//         const otherUserId = userIds[0] === user.uid ? userIds[1] : userIds[0];
        
//         // Check if users are connected
//         const connected = await areUsersConnected(user.uid, otherUserId);
        
//         if (!connected) {
//           setConnectionError('You must be connected with this user to send messages.');
//           setLoading(false);
//           return;
//         }
        
//         // If connected, proceed with normal flow
//         setConnectionError(null);
        
//         // Fetch other user info
//         const userQuery = query(collection(db, 'users'), where('__name__', '==', otherUserId));
//         const userDoc = await getDocs(userQuery);
//         if (!userDoc.empty) {
//           setOtherUser(userDoc.docs[0].data());
//         }
        
//       } catch (error) {
//         console.error('Error checking connection:', error);
//         setConnectionError('Unable to verify connection. Please try again.');
//         setLoading(false);
//       }
//     }
    
//     checkConnection();
//   }, [user, conversationId]);

//   // LOGIC PRESERVED: Auto-scroll
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, typingUsers]);

//   // LOGIC PRESERVED: Mark Read
//   useEffect(() => {
//     if (!user || !conversationId || conversationViewedRef.current || connectionError) return;
//     conversationViewedRef.current = true;
//     markMessagesAsRead();
//   }, [user, conversationId, messages, connectionError]);

//   const markMessagesAsRead = async () => {
//     if (!user) return;
//     try {
//       const messagesToMarkAsRead = messages.filter(
//         message => message.receiverId === user.uid && message.status !== 'read'
//       );
//       for (const message of messagesToMarkAsRead) {
//         await updateMessageStatus(message.id, 'read');
//       }
//     } catch (error) {
//       console.error('Error marking messages as read:', error);
//     }
//   };

//   // LOGIC PRESERVED: Typing Handling
//   const handleInputChange = useCallback(
//     debounce((text: string) => {
//       if (!user || !conversationId || connectionError) return;
//       if (text.trim().length > 0) {
//         startTyping(conversationId, user.uid);
//       } else {
//         debouncedStopTyping(conversationId, user.uid);
//       }
//     }, 500),
//     [user, conversationId, connectionError]
//   );

//   const handleMessageChange = (text: string) => {
//     setNewMessage(text);
//     handleInputChange(text);
//   };

//   useEffect(() => {
//     return () => {
//       if (user && conversationId) {
//         debouncedStopTyping(conversationId, user.uid);
//       }
//     };
//   }, [user, conversationId]);

//   // UPDATED: Fetch Messages - Only if connected
//   useEffect(() => {
//     if (!user || !conversationId || connectionError) return;

//     const messagesRef = collection(db, 'messages');
//     const q = query(
//       messagesRef,
//       where('conversationId', '==', conversationId),
//       orderBy('timestamp', 'asc')
//     );

//     if (unsubscribeRef.current) {
//       unsubscribeRef.current();
//     }

//     try {
//       unsubscribeRef.current = onSnapshot(q, 
//         (snapshot) => {
//           const messagesData: Message[] = [];
//           snapshot.forEach((doc) => {
//             const data = doc.data();
//             messagesData.push({
//               id: doc.id,
//               text: data.text,
//               senderId: data.senderId,
//               receiverId: data.receiverId,
//               timestamp: data.timestamp?.toDate() || new Date(),
//               status: data.status || 'sent',
//             });
//           });
//           setMessages(messagesData);
//           setLoading(false);
//           markMessagesAsDelivered(messagesData);
//         },
//         (error) => {
//           console.error('Error in messages snapshot:', error);
//           setLoading(false);
//         }
//       );
//     } catch (error) {
//       console.error('Error setting up snapshot listener:', error);
//       setLoading(false);
//     }

//     // Typing Listener
//     if (unsubscribeTypingRef.current) {
//       unsubscribeTypingRef.current();
//     }

//     unsubscribeTypingRef.current = listenForTyping(
//       conversationId,
//       (users) => {
//         const otherTypingUsers = users.filter((uid) => uid !== user?.uid);
//         setTypingUsers(otherTypingUsers);
//       }
//     );

//     return () => {
//       if (unsubscribeRef.current) {
//         unsubscribeRef.current();
//         unsubscribeRef.current = null;
//       }
//       if (unsubscribeTypingRef.current) {
//         unsubscribeTypingRef.current();
//         unsubscribeTypingRef.current = null;
//       }
//     };
//   }, [user, conversationId, connectionError]);

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

//   // UPDATED: Handle Send Message with connection check
//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !user || !conversationId || sending || connectionError) return;

//     setSending(true);
//     try {
//       await stopTyping(conversationId, user.uid);
//       await sendMessage({
//         text: newMessage,
//         senderId: user.uid,
//         receiverId: conversationId.split('_').find(id => id !== user.uid) || user.uid,
//       });
//       setNewMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     } finally {
//       setSending(false);
//     }
//   };

//   // Visual Helper: Status Icon
//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'sent':
//         return (
//           <svg className="w-3 h-3 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//           </svg>
//         );
//       case 'delivered':
//         return (
//           <div className="flex -space-x-1">
//             <svg className="w-3 h-3 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//             </svg>
//             <svg className="w-3 h-3 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//         );
//       case 'read':
//         return (
//           <div className="flex -space-x-1">
//             <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//             </svg>
//             <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//             </svg>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   // NEW: Handle sending connection request
//   const handleSendConnectionRequest = async () => {
//     if (!user || !otherUser) return;
    
//     try {
//       // Get other user's ID from conversationId
//       const userIds = conversationId.split('_');
//       const otherUserId = userIds[0] === user.uid ? userIds[1] : userIds[0];
      
//       // Import sendConnectionRequest
//       const { sendConnectionRequest } = await import('@/lib/connections');
//       await sendConnectionRequest(user.uid, otherUserId);
      
//       alert(`Connection request sent to ${otherUser.displayName || 'user'}. You can message them once they accept.`);
//       router.push('/network'); // Redirect to network page
//     } catch (error: any) {
//       alert(`Failed to send connection request: ${error.message}`);
//     }
//   };

//   if (!user) return null;

//   // NEW: Connection Error Display
//   if (connectionError) {
//     return (
//       <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl p-8 text-center max-w-md shadow-sm border border-neutral-200">
//           <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
//             </svg>
//           </div>
//           <h2 className="text-xl font-bold text-black mb-2">Connection Required</h2>
//           <p className="text-neutral-600 mb-6">{connectionError}</p>
          
//           {otherUser && (
//             <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
//               <div className="flex items-center justify-center space-x-3">
//                 {otherUser.photoURL ? (
//                   <img src={otherUser.photoURL} alt="User" className="w-10 h-10 rounded-full object-cover" />
//                 ) : (
//                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
//                     {otherUser?.displayName?.charAt(0) || '?'}
//                   </div>
//                 )}
//                 <div className="text-left">
//                   <p className="font-medium text-black">{otherUser.displayName || 'User'}</p>
//                   <p className="text-sm text-neutral-500">{otherUser.headline || 'Professional'}</p>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           <div className="space-y-3">
//             <button 
//               onClick={handleSendConnectionRequest}
//               className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors"
//             >
//               Send Connection Request
//             </button>
//             <button 
//               onClick={() => router.push('/network')}
//               className="w-full py-3 bg-white border-2 border-black text-black rounded-xl font-bold hover:bg-neutral-50 transition-colors"
//             >
//               Browse Network
//             </button>
//             <button 
//               onClick={() => router.push('/dashboard/messages')}
//               className="w-full py-3 bg-white border border-neutral-300 text-neutral-600 rounded-xl font-bold hover:bg-neutral-100 transition-colors"
//             >
//               Back to Messages
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-screen bg-neutral-100 relative">
      
//       {/* 1. Glassmorphism Header */}
//       <header className="absolute top-0 w-full z-20 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-4 py-3 shadow-sm">
//         <div className="max-w-3xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Link 
//               href="/dashboard/messages"
//               className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-600"
//             >
//               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
//               </svg>
//             </Link>
            
//             <Link href={otherUser ? `/profile/${otherUser.uid}` : '#'} className="flex items-center gap-3 group">
//               <div className="relative">
//                 {otherUser?.photoURL ? (
//                   <img src={otherUser.photoURL} alt="User" className="w-10 h-10 rounded-full object-cover border border-neutral-200" />
//                 ) : (
//                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
//                     {otherUser?.displayName?.charAt(0) || '?'}
//                   </div>
//                 )}
//                 {/* Online Status Dot (Visual only for now) */}
//                 <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
//               </div>
              
//               <div>
//                 <h1 className="text-base font-bold text-black group-hover:text-orange-600 transition-colors leading-tight">
//                   {otherUser?.displayName || 'Loading User...'}
//                 </h1>
//                 <p className="text-xs text-neutral-500 font-medium">
//                   {typingUsers.length > 0 ? (
//                     <span className="text-orange-500 font-bold animate-pulse">typing...</span>
//                   ) : (
//                     otherUser?.headline || 'Professional Network'
//                   )}
//                 </p>
//               </div>
//             </Link>
//           </div>
          
//           <button className="p-2 text-neutral-400 hover:text-black transition-colors">
//             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
//             </svg>
//           </button>
//         </div>
//       </header>

//       {/* 2. Message Area with subtle pattern */}
//       <div className="flex-1 overflow-y-auto pt-20 pb-4 px-4 bg-[#f2f2f2]" 
//            style={{ backgroundImage: 'radial-gradient(#ddd 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
//         <div className="max-w-3xl mx-auto flex flex-col justify-end min-h-full">
          
//           {/* Loading State */}
//           {loading && (
//             <div className="flex flex-col items-center justify-center space-y-4 py-10 opacity-50">
//               <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
//               <p className="text-xs text-neutral-500 uppercase tracking-widest">Decrypting messages...</p>
//             </div>
//           )}

//           {/* Empty State */}
//           {!loading && messages.length === 0 && (
//             <div className="text-center py-12">
//               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-3xl">
//                 👋
//               </div>
//               <p className="text-neutral-500 font-medium">Say hello to {otherUser?.displayName?.split(' ')[0]}!</p>
//               <p className="text-xs text-neutral-400 mt-1">Start a professional conversation.</p>
//             </div>
//           )}

//           {/* Message List */}
//           <div className="space-y-3 pb-24">
//             {messages.map((message, index) => {
//               const isSender = message.senderId === user.uid;
//               const showTime = index === messages.length - 1 || messages[index + 1]?.senderId !== message.senderId;

//               return (
//                 <div
//                   key={message.id}
//                   className={`flex ${isSender ? 'justify-end' : 'justify-start'} group`}
//                 >
//                   <div
//                     className={`max-w-[85%] sm:max-w-[70%] relative px-4 py-3 shadow-sm text-sm leading-relaxed ${
//                       isSender
//                         ? 'bg-orange-600 text-white rounded-2xl rounded-tr-sm'
//                         : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm'
//                     }`}
//                   >
//                     <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    
//                     <div className={`flex items-center justify-end gap-1 mt-1 select-none ${isSender ? 'opacity-80' : 'opacity-40'}`}>
//                       <span className="text-[10px]">
//                         {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                       </span>
//                       {isSender && (
//                         <span className="ml-1">
//                           {getStatusIcon(message.status)}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}

//             {/* Typing Bubbles */}
//             {typingUsers.length > 0 && (
//               <div className="flex justify-start animate-fade-in">
//                 <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
//                   <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></div>
//                   <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-100"></div>
//                   <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-200"></div>
//                 </div>
//               </div>
//             )}
            
//             <div ref={messagesEndRef} />
//           </div>
//         </div>
//       </div>

//       {/* 3. Floating Input Area */}
//       <div className="fixed bottom-0 w-full p-4 bg-gradient-to-t from-white via-white to-transparent z-20">
//         <div className="max-w-3xl mx-auto">
//           <form 
//             onSubmit={handleSendMessage} 
//             className="flex items-end gap-2 bg-white p-2 rounded-3xl shadow-xl border border-neutral-100"
//           >
//             {/* Attachment Button (Visual Only for now) */}
//             <button 
//               type="button" 
//               className="p-3 text-neutral-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors"
//             >
//               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
//               </svg>
//             </button>

//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => handleMessageChange(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-1 max-h-32 py-3 px-2 bg-transparent outline-none text-black placeholder-neutral-400"
//               disabled={sending}
//               autoFocus
//             />

//             <button
//               type="submit"
//               disabled={!newMessage.trim() || sending}
//               className={`p-3 rounded-full transition-all duration-200 flex-shrink-0 ${
//                 !newMessage.trim() || sending
//                   ? 'bg-neutral-100 text-neutral-300'
//                   : 'bg-orange-600 text-white shadow-md hover:bg-black hover:scale-105 active:scale-95'
//               }`}
//             >
//               {sending ? (
//                 <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//               ) : (
//                 <svg className="w-5 h-5 transform rotate-90 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                 </svg>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, orderBy, onSnapshot, DocumentData, doc, getDoc, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { sendMessage, updateMessageStatus } from '@/lib/sendMessage';
import { startTyping, stopTyping, debouncedStopTyping, listenForTyping } from '@/lib/typing';
import { markConversationRead } from '@/lib/conversations';
import { debounce } from 'lodash';

interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState<DocumentData | null>(null);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const unsubscribeTypingRef = useRef<(() => void) | null>(null);
  const conversationViewedRef = useRef(false);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  // Mark messages as read (batch update)
  const markMessagesAsRead = async () => {
    if (!user) return;
    try {
      const messagesToMarkAsRead = messages.filter(
        message => message.receiverId === user.uid && message.status !== 'read'
      );
      for (const message of messagesToMarkAsRead) {
        await updateMessageStatus(message.id, 'read');
      }
      // Also mark conversation as read in Firestore (reset unread count)
      await markConversationRead(conversationId, user.uid);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Mark as read when conversation is viewed
  useEffect(() => {
    if (!user || !conversationId || conversationViewedRef.current) return;
    conversationViewedRef.current = true;
    markMessagesAsRead();
  }, [user, conversationId, messages]);

  // Typing handling
  const handleInputChange = useCallback(
    debounce((text: string) => {
      if (!user || !conversationId) return;
      if (text.trim().length > 0) {
        startTyping(conversationId, user.uid);
      } else {
        debouncedStopTyping(conversationId, user.uid);
      }
    }, 500),
    [user, conversationId]
  );

  const handleMessageChange = (text: string) => {
    setNewMessage(text);
    handleInputChange(text);
  };

  useEffect(() => {
    return () => {
      if (user && conversationId) {
        debouncedStopTyping(conversationId, user.uid);
      }
    };
  }, [user, conversationId]);

  // Fetch other user data from conversation document (denormalised)
  useEffect(() => {
    async function fetchOtherUser() {
      if (!user || !conversationId) return;
      try {
        const userIds = conversationId.split('_');
        const otherId = userIds[0] === user.uid ? userIds[1] : userIds[0];
        
        const convRef = doc(db, 'conversations', conversationId);
        const convSnap = await getDoc(convRef);
        if (convSnap.exists()) {
          const data = convSnap.data();
          const otherData = data.participantData?.[otherId];
          if (otherData) {
            setOtherUser(otherData);
            return;
          }
        }
        // Fallback: fetch from users collection (should rarely happen)
        const userQuery = query(collection(db, 'users'), where('__name__', '==', otherId));
        const userSnap = await getDocs(userQuery);
        if (!userSnap.empty) setOtherUser(userSnap.docs[0].data());
      } catch (error) {
        console.error('Error fetching other user:', error);
      }
    }
    fetchOtherUser();
  }, [user, conversationId]);

  // Fetch messages (real‑time)
  useEffect(() => {
    if (!user || !conversationId) return;

    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );

    if (unsubscribeRef.current) unsubscribeRef.current();

    try {
      unsubscribeRef.current = onSnapshot(q, 
        (snapshot) => {
          const messagesData: Message[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            messagesData.push({
              id: docSnap.id,
              text: data.text,
              senderId: data.senderId,
              receiverId: data.receiverId,
              timestamp: data.timestamp?.toDate() || new Date(),
              status: data.status || 'sent',
            });
          });
          setMessages(messagesData);
          setLoading(false);
          markMessagesAsDelivered(messagesData);
        },
        (error) => {
          console.error('Error in messages snapshot:', error);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Error setting up snapshot listener:', error);
      setLoading(false);
    }

    // Typing listener
    if (unsubscribeTypingRef.current) unsubscribeTypingRef.current();
    unsubscribeTypingRef.current = listenForTyping(
      conversationId,
      (users) => {
        const otherTypingUsers = users.filter((uid) => uid !== user?.uid);
        setTypingUsers(otherTypingUsers);
      }
    );

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      if (unsubscribeTypingRef.current) {
        unsubscribeTypingRef.current();
        unsubscribeTypingRef.current = null;
      }
    };
  }, [user, conversationId]);

  const markMessagesAsDelivered = async (messagesData: Message[]) => {
    if (!user) return;
    try {
      const messagesToMarkAsDelivered = messagesData.filter(
        message => message.receiverId === user.uid && message.status === 'sent'
      );
      for (const message of messagesToMarkAsDelivered) {
        await updateMessageStatus(message.id, 'delivered');
      }
    } catch (error) {
      console.error('Error marking messages as delivered:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !conversationId || sending) return;

    setSending(true);
    try {
      await stopTyping(conversationId, user.uid);
      await sendMessage({
        text: newMessage,
        senderId: user.uid,
        receiverId: conversationId.split('_').find(id => id !== user.uid) || user.uid,
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return (
          <svg className="w-3 h-3 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'delivered':
        return (
          <div className="flex -space-x-1">
            <svg className="w-3 h-3 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg className="w-3 h-3 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'read':
        return (
          <div className="flex -space-x-1">
            <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen bg-neutral-100 relative">
      
      {/* Header */}
      <header className="absolute top-0 w-full z-20 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-4 py-3 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/messages"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            
            <Link href={otherUser ? `/profile/${otherUser.uid}` : '#'} className="flex items-center gap-3 group">
              <div className="relative">
                {otherUser?.photoURL ? (
                  <img src={otherUser.photoURL} alt="User" className="w-10 h-10 rounded-full object-cover border border-neutral-200" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                    {otherUser?.displayName?.charAt(0) || '?'}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              
              <div>
                <h1 className="text-base font-bold text-black group-hover:text-orange-600 transition-colors leading-tight">
                  {otherUser?.displayName || 'Loading...'}
                </h1>
                <p className="text-xs text-neutral-500 font-medium">
                  {typingUsers.length > 0 ? (
                    <span className="text-orange-500 font-bold animate-pulse">typing...</span>
                  ) : (
                    otherUser?.headline || 'Professional Network'
                  )}
                </p>
              </div>
            </Link>
          </div>
          
          <button className="p-2 text-neutral-400 hover:text-black transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto pt-20 pb-4 px-4 bg-[#f2f2f2]" 
           style={{ backgroundImage: 'radial-gradient(#ddd 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        <div className="max-w-3xl mx-auto flex flex-col justify-end min-h-full">
          
          {loading && (
            <div className="flex flex-col items-center justify-center space-y-4 py-10 opacity-50">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-neutral-500 uppercase tracking-widest">Decrypting messages...</p>
            </div>
          )}

          {!loading && messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-3xl">
                👋
              </div>
              <p className="text-neutral-500 font-medium">Say hello to {otherUser?.displayName?.split(' ')[0] || 'them'}!</p>
              <p className="text-xs text-neutral-400 mt-1">Start a professional conversation.</p>
            </div>
          )}

          <div className="space-y-3 pb-24">
            {messages.map((message) => {
              const isSender = message.senderId === user.uid;
              return (
                <div
                  key={message.id}
                  className={`flex ${isSender ? 'justify-end' : 'justify-start'} group`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] relative px-4 py-3 shadow-sm text-sm leading-relaxed ${
                      isSender
                        ? 'bg-orange-600 text-white rounded-2xl rounded-tr-sm'
                        : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    
                    <div className={`flex items-center justify-end gap-1 mt-1 select-none ${isSender ? 'opacity-80' : 'opacity-40'}`}>
                      <span className="text-[10px]">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isSender && (
                        <span className="ml-1">
                          {getStatusIcon(message.status)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {typingUsers.length > 0 && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 w-full p-4 bg-gradient-to-t from-white via-white to-transparent z-20">
        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleSendMessage} 
            className="flex items-end gap-2 bg-white p-2 rounded-3xl shadow-xl border border-neutral-100"
          >
            <button 
              type="button" 
              className="p-3 text-neutral-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>

            <input
              type="text"
              value={newMessage}
              onChange={(e) => handleMessageChange(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 max-h-32 py-3 px-2 bg-transparent outline-none text-black placeholder-neutral-400"
              disabled={sending}
              autoFocus
            />

            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className={`p-3 rounded-full transition-all duration-200 flex-shrink-0 ${
                !newMessage.trim() || sending
                  ? 'bg-neutral-100 text-neutral-300'
                  : 'bg-orange-600 text-white shadow-md hover:bg-black hover:scale-105 active:scale-95'
              }`}
            >
              {sending ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 transform rotate-90 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}