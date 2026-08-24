// 'use client';
// import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';

// interface Notification {
//   id: string;
//   type: 'connection_request' | 'new_message';
//   fromUserId: string;
//   fromUserName: string;
//   message: string;
//   read: boolean;
//   createdAt: any;
//   connectionId: string;
//   conversationId?: string;
// }

// interface NotificationsContextType {
//   notifications: Notification[];
//   unreadCount: number;
//   markAsRead: (notificationId: string) => void;
//   markAllAsRead: () => void;
//   loading: boolean;
// }

// const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// export const useNotifications = () => {
//   const context = useContext(NotificationsContext);
//   if (context === undefined) {
//     throw new Error('useNotifications must be used within a NotificationsProvider');
//   }
//   return context;
// };

// interface NotificationsProviderProps {
//   children: ReactNode;
// }

// export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
//   const [user] = useAuthState(auth);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);
//   const unsubscribeRef = useRef<(() => void) | null>(null);

//   useEffect(() => {
//     if (!user) {
//       setNotifications([]);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
    
//     // Query for notifications - both connection requests and new messages
//     const q = query(
//       collection(db, 'notifications'),
//       where('userId', '==', user.uid),
//       where('type', 'in', ['connection_request', 'new_message']),
//       orderBy('createdAt', 'desc')
//     );

//     // Clean up any existing listener
//     if (unsubscribeRef.current) {
//       unsubscribeRef.current();
//     }

//     try {
//       unsubscribeRef.current = onSnapshot(q, 
//         (snapshot) => {
//           const newNotifications: Notification[] = [];
//           snapshot.forEach((doc) => {
//             const data = doc.data();
//             newNotifications.push({
//               id: doc.id,
//               type: data.type,
//               fromUserId: data.fromUserId,
//               fromUserName: data.fromUserName,
//               message: data.message,
//               read: data.read || false,
//               createdAt: data.createdAt,
//               connectionId: data.connectionId,
//               conversationId: data.conversationId
//             });
//           });
//           setNotifications(newNotifications);
//           setLoading(false);
//         },
//         (error) => {
//           console.error('Error listening to notifications:', error);
//           setLoading(false);
//         }
//       );
//     } catch (error) {
//       console.error('Error setting up notifications listener:', error);
//       setLoading(false);
//     }

//     // Cleanup on unmount or when dependencies change
//     return () => {
//       if (unsubscribeRef.current) {
//         unsubscribeRef.current();
//         unsubscribeRef.current = null;
//       }
//     };
//   }, [user]);

//   const markAsRead = async (notificationId: string) => {
//     try {
//       // Update in Firestore
//       await updateDoc(doc(db, 'notifications', notificationId), {
//         read: true
//       });
      
//       // Also update local state for immediate UI update
//       setNotifications(prev => prev.map(notif => 
//         notif.id === notificationId ? { ...notif, read: true } : notif
//       ));
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   const markAllAsRead = async () => {
//     try {
//       // Update all unread notifications in Firestore
//       const unreadNotifications = notifications.filter(notif => !notif.read);
//       const updatePromises = unreadNotifications.map(notif => 
//         updateDoc(doc(db, 'notifications', notif.id), { read: true })
//       );
      
//       await Promise.all(updatePromises);
      
//       // Update local state
//       setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
//     } catch (error) {
//       console.error('Error marking all notifications as read:', error);
//     }
//   };

//   const unreadCount = notifications.filter(notif => !notif.read).length;

//   const value: NotificationsContextType = {
//     notifications,
//     unreadCount,
//     markAsRead,
//     markAllAsRead,
//     loading
//   };

//   return (
//     <NotificationsContext.Provider value={value}>
//       {children}
//     </NotificationsContext.Provider>
//   );
// };

// 'use client';
// import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';

// interface Notification {
//   id: string;
//   type: 'connection_request' | 'new_message' | 'profile_view';
//   fromUserId: string;
//   fromUserName: string;
//   message: string;
//   read: boolean;
//   createdAt: any;
//   connectionId: string;
//   conversationId?: string;
//   // New fields for profile_view notifications
//   viewerUserId?: string;
//   viewerName?: string;
//   viewerPhoto?: string;
//   viewerHeadline?: string;
//   relatedId?: string;
// }

// interface NotificationsContextType {
//   notifications: Notification[];
//   unreadCount: number;
//   markAsRead: (notificationId: string) => void;
//   markAllAsRead: () => void;
//   loading: boolean;
// }

// const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// export const useNotifications = () => {
//   const context = useContext(NotificationsContext);
//   if (context === undefined) {
//     throw new Error('useNotifications must be used within a NotificationsProvider');
//   }
//   return context;
// };

// interface NotificationsProviderProps {
//   children: ReactNode;
// }

// export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
//   const [user] = useAuthState(auth);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);
//   const unsubscribeRef = useRef<(() => void) | null>(null);

//   useEffect(() => {
//     if (!user) {
//       setNotifications([]);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
    
//     // Updated query to include profile_view notifications
//     const q = query(
//       collection(db, 'notifications'),
//       where('userId', '==', user.uid),
//       where('type', 'in', ['connection_request', 'new_message', 'profile_view']),
//       orderBy('createdAt', 'desc')
//     );

//     // Clean up any existing listener
//     if (unsubscribeRef.current) {
//       unsubscribeRef.current();
//     }

//     try {
//       unsubscribeRef.current = onSnapshot(q, 
//         (snapshot) => {
//           const newNotifications: Notification[] = [];
//           snapshot.forEach((doc) => {
//             const data = doc.data();
//             newNotifications.push({
//               id: doc.id,
//               type: data.type,
//               fromUserId: data.fromUserId || data.viewerUserId, // Support both field names
//               fromUserName: data.fromUserName || data.viewerName, // Support both field names
//               message: data.message,
//               read: data.read || false,
//               createdAt: data.createdAt,
//               connectionId: data.connectionId,
//               conversationId: data.conversationId,
//               // Profile view specific fields
//               viewerUserId: data.viewerUserId,
//               viewerName: data.viewerName,
//               viewerPhoto: data.viewerPhoto,
//               viewerHeadline: data.viewerHeadline,
//               relatedId: data.relatedId
//             });
//           });
//           setNotifications(newNotifications);
//           setLoading(false);
//         },
//         (error) => {
//           console.error('Error listening to notifications:', error);
//           setLoading(false);
//         }
//       );
//     } catch (error) {
//       console.error('Error setting up notifications listener:', error);
//       setLoading(false);
//     }

//     // Cleanup on unmount or when dependencies change
//     return () => {
//       if (unsubscribeRef.current) {
//         unsubscribeRef.current();
//         unsubscribeRef.current = null;
//       }
//     };
//   }, [user]);

//   const markAsRead = async (notificationId: string) => {
//     try {
//       // Update in Firestore
//       await updateDoc(doc(db, 'notifications', notificationId), {
//         read: true
//       });
      
//       // Also update local state for immediate UI update
//       setNotifications(prev => prev.map(notif => 
//         notif.id === notificationId ? { ...notif, read: true } : notif
//       ));
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   const markAllAsRead = async () => {
//     try {
//       // Update all unread notifications in Firestore
//       const unreadNotifications = notifications.filter(notif => !notif.read);
//       const updatePromises = unreadNotifications.map(notif => 
//         updateDoc(doc(db, 'notifications', notif.id), { read: true })
//       );
      
//       await Promise.all(updatePromises);
      
//       // Update local state
//       setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
//     } catch (error) {
//       console.error('Error marking all notifications as read:', error);
//     }
//   };

//   const unreadCount = notifications.filter(notif => !notif.read).length;

//   const value: NotificationsContextType = {
//     notifications,
//     unreadCount,
//     markAsRead,
//     markAllAsRead,
//     loading
//   };

//   return (
//     <NotificationsContext.Provider value={value}>
//       {children}
//     </NotificationsContext.Provider>
//   );
// };

'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import notificationSound from '@/lib/notificationSound'; // NEW IMPORT

interface Notification {
  id: string;
  type: 'connection_request' | 'new_message' | 'profile_view' | 'new_referral_conversation';
  fromUserId: string;
  fromUserName: string;
  message: string;
  read: boolean;
  createdAt: any;
  connectionId: string;
  conversationId?: string;
  // New fields for profile_view notifications
  viewerUserId?: string;
  viewerName?: string;
  viewerPhoto?: string;
  viewerHeadline?: string;
  relatedId?: string;
  // Referral conversation fields
  jobId?: string;
  jobTitle?: string;
  jobCompany?: string;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  loading: boolean;
  isSoundMuted: boolean; // NEW
  toggleSoundMute: () => void; // NEW
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const [user] = useAuthState(auth);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSoundMuted, setIsSoundMuted] = useState(false); // NEW STATE
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const previousNotificationsRef = useRef<Set<string>>(new Set()); // NEW: Track seen notifications

  // Initialize sound and load mute preference
  useEffect(() => {
    notificationSound.init();
    setIsSoundMuted(notificationSound.isSoundMuted());
  }, []);

  // NEW: Function to toggle sound mute
  const toggleSoundMute = () => {
    const newMutedState = notificationSound.toggleMute();
    setIsSoundMuted(newMutedState);
  };

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      previousNotificationsRef.current.clear(); // Clear tracked notifications
      return;
    }

    setLoading(true);
    
    // Updated query to include new_referral_conversation notifications
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      where('type', 'in', ['connection_request', 'new_message', 'profile_view', 'new_referral_conversation']),
      orderBy('createdAt', 'desc')
    );

    // Clean up any existing listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    try {
      unsubscribeRef.current = onSnapshot(q, 
        (snapshot) => {
          const newNotifications: Notification[] = [];
          const newNotificationIds = new Set<string>();
          
          snapshot.forEach((doc) => {
            const data = doc.data();
            const notificationId = doc.id;
            newNotificationIds.add(notificationId);
            
            newNotifications.push({
              id: notificationId,
              type: data.type,
              fromUserId: data.fromUserId || data.viewerUserId, // Support both field names
              fromUserName: data.fromUserName || data.viewerName, // Support both field names
              message: data.message,
              read: data.read || false,
              createdAt: data.createdAt,
              connectionId: data.connectionId,
              conversationId: data.conversationId,
              // Profile view specific fields
              viewerUserId: data.viewerUserId,
              viewerName: data.viewerName,
              viewerPhoto: data.viewerPhoto,
              viewerHeadline: data.viewerHeadline,
              relatedId: data.relatedId,
              // Referral conversation fields
              jobId: data.jobId,
              jobTitle: data.jobTitle,
              jobCompany: data.jobCompany
            });
          });
          
          // NEW: Play sound for new notifications
          newNotifications.forEach(notification => {
            if (!notification.read && !previousNotificationsRef.current.has(notification.id)) {
              // This is a new unread notification - play sound
              notificationSound.playNotificationSound();
            }
          });
          
          // Update tracked notifications
          previousNotificationsRef.current = newNotificationIds;
          
          setNotifications(newNotifications);
          setLoading(false);
        },
        (error) => {
          console.error('Error listening to notifications:', error);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Error setting up notifications listener:', error);
      setLoading(false);
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      // Don't clear previousNotificationsRef on cleanup to persist across component re-renders
    };
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      // Update in Firestore
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true
      });
      
      // Also update local state for immediate UI update
      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Update all unread notifications in Firestore
      const unreadNotifications = notifications.filter(notif => !notif.read);
      const updatePromises = unreadNotifications.map(notif => 
        updateDoc(doc(db, 'notifications', notif.id), { read: true })
      );
      
      await Promise.all(updatePromises);
      
      // Update local state
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const value: NotificationsContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    loading,
    isSoundMuted, // NEW
    toggleSoundMute // NEW
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};