// 'use client';
// import { useState, useRef, useEffect } from 'react';
// import Link from 'next/link';
// import { useNotifications } from '@/contexts/NotificationsContext';

// export default function NotificationsDropdown() {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleNotificationClick = (notificationId: string) => {
//     markAsRead(notificationId);
//     setIsOpen(false);
//   };

//   const handleViewAllClick = () => {
//     markAllAsRead();
//     setIsOpen(false);
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       {/* Notification Bell Icon */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors"
//       >
//         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//         </svg>
        
//         {/* Notification Badge */}
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//             {unreadCount > 9 ? '9+' : unreadCount}
//           </span>
//         )}
//       </button>

//       {/* Dropdown Menu */}
//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
//           <div className="p-4 border-b border-gray-200">
//             <div className="flex justify-between items-center">
//               <h3 className="font-semibold text-gray-800">Notifications</h3>
//               {unreadCount > 0 && (
//                 <button
//                   onClick={handleViewAllClick}
//                   className="text-sm text-orange-600 hover:text-orange-700"
//                 >
//                   Mark all as read
//                 </button>
//               )}
//             </div>
//           </div>
          
//           <div className="max-h-96 overflow-y-auto">
//             {notifications.length === 0 ? (
//               <div className="p-4 text-center text-gray-500">
//                 No notifications yet
//               </div>
//             ) : (
//               <div>
//                 {notifications.map((notification) => (
//                   <div
//                     key={notification.id}
//                     className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
//                       !notification.read ? 'bg-orange-50' : ''
//                     }`}
//                     onClick={() => handleNotificationClick(notification.id)}
//                   >
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0">
//                         <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
//                           <span className="text-orange-600 text-sm">🔗</span>
//                         </div>
//                       </div>
//                       <div className="ml-3">
//                         <p className="text-sm text-gray-800">
//                           <span className="font-medium">{notification.fromUserName}</span> wants to connect with you
//                         </p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           {notification.createdAt?.toDate ? 
//                             new Date(notification.createdAt.toDate()).toLocaleDateString() : 
//                             'Recently'}
//                         </p>
//                       </div>
//                       {!notification.read && (
//                         <div className="ml-auto">
//                           <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
          
//           <div className="p-4 border-t border-gray-200">
//             <Link
//               href="/dashboard/connections"
//               className="block text-center text-orange-600 hover:text-orange-700 font-medium"
//               onClick={() => setIsOpen(false)}
//             >
//               View all connections
//             </Link>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// 'use client';
// import { useState, useRef, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useNotifications } from '@/contexts/NotificationsContext';

// export default function NotificationsDropdown() {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();
//   const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleNotificationClick = (notification: any) => {
//     markAsRead(notification.id);
//     setIsOpen(false);
    
//     // Navigate based on notification type
//     switch (notification.type) {
//       case 'connection_request':
//         router.push('/dashboard/connections');
//         break;
//       case 'new_message':
//         if (notification.conversationId) {
//           router.push(`/dashboard/messages/${notification.conversationId}`);
//         } else {
//           router.push('/dashboard/messages');
//         }
//         break;
//       case 'profile_view':
//         router.push('/dashboard/profile-views');
//         break;
//       default:
//         break;
//     }
//   };

//   const handleViewAllClick = () => {
//     markAllAsRead();
//     setIsOpen(false);
//   };

//   // Get notification icon based on type
//   const getNotificationIcon = (type: string) => {
//     switch (type) {
//       case 'connection_request':
//         return '🔗';
//       case 'new_message':
//         return '💬';
//       case 'profile_view':
//         return '👁️';
//       default:
//         return '🔔';
//     }
//   };

//   // Get notification message based on type
//   const getNotificationMessage = (notification: any) => {
//     switch (notification.type) {
//       case 'connection_request':
//         return (
//           <p className="text-sm text-gray-800">
//             <span className="font-medium">{notification.fromUserName}</span> wants to connect with you
//           </p>
//         );
//       case 'new_message':
//         return (
//           <p className="text-sm text-gray-800">
//             <span className="font-medium">{notification.fromUserName}</span> sent you a message
//           </p>
//         );
//       case 'profile_view':
//         return (
//           <p className="text-sm text-gray-800">
//             <span className="font-medium">{notification.viewerName || notification.fromUserName}</span> viewed your profile
//           </p>
//         );
//       default:
//         return (
//           <p className="text-sm text-gray-800">
//             New notification
//           </p>
//         );
//     }
//   };

//   // Format date for display
//   const formatNotificationDate = (createdAt: any) => {
//     if (!createdAt) return 'Recently';
    
//     try {
//       const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
//       const now = new Date();
//       const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
//       if (diffInSeconds < 60) return 'Just now';
//       if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
//       if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
//       if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      
//       return date.toLocaleDateString();
//     } catch (error) {
//       return 'Recently';
//     }
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       {/* Notification Bell Icon */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors"
//       >
//         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//         </svg>
        
//         {/* Notification Badge */}
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//             {unreadCount > 9 ? '9+' : unreadCount}
//           </span>
//         )}
//       </button>

//       {/* Dropdown Menu */}
//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
//           <div className="p-4 border-b border-gray-200">
//             <div className="flex justify-between items-center">
//               <h3 className="font-semibold text-gray-800">Notifications</h3>
//               {unreadCount > 0 && (
//                 <button
//                   onClick={handleViewAllClick}
//                   className="text-sm text-orange-600 hover:text-orange-700"
//                 >
//                   Mark all as read
//                 </button>
//               )}
//             </div>
//           </div>
          
//           <div className="max-h-96 overflow-y-auto">
//             {notifications.length === 0 ? (
//               <div className="p-4 text-center text-gray-500">
//                 No notifications yet
//               </div>
//             ) : (
//               <div>
//                 {notifications.map((notification) => (
//                   <div
//                     key={notification.id}
//                     className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
//                       !notification.read ? 'bg-orange-50' : ''
//                     }`}
//                     onClick={() => handleNotificationClick(notification)}
//                   >
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0">
//                         <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
//                           <span className="text-orange-600 text-sm">
//                             {getNotificationIcon(notification.type)}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="ml-3 flex-1 min-w-0">
//                         {getNotificationMessage(notification)}
//                         <p className="text-xs text-gray-500 mt-1">
//                           {formatNotificationDate(notification.createdAt)}
//                         </p>
//                       </div>
//                       {!notification.read && (
//                         <div className="ml-2 flex-shrink-0">
//                           <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
          
//           <div className="p-4 border-t border-gray-200">
//             <div className="grid grid-cols-2 gap-2 text-sm">
//               <Link
//                 href="/dashboard/connections"
//                 className="text-center text-orange-600 hover:text-orange-700 font-medium py-2 rounded hover:bg-orange-50"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Connections
//               </Link>
//               <Link
//                 href="/dashboard/profile-views"
//                 className="text-center text-orange-600 hover:text-orange-700 font-medium py-2 rounded hover:bg-orange-50"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Profile Views
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/contexts/NotificationsContext';

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead, isSoundMuted, toggleSoundMute } = useNotifications(); // NEW: Added isSoundMuted and toggleSoundMute

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    setIsOpen(false);
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'connection_request':
        router.push('/dashboard/connections');
        break;
      case 'new_message':
        if (notification.conversationId) {
          router.push(`/dashboard/messages/${notification.conversationId}`);
        } else {
          router.push('/dashboard/messages');
        }
        break;
      case 'profile_view':
        router.push('/dashboard/profile-views');
        break;
      case 'new_referral_conversation':
        if (notification.conversationId) {
          router.push(`/dashboard/messages/${notification.conversationId}`);
        } else {
          router.push('/dashboard/messages');
        }
        break;
      default:
        break;
    }
  };

  const handleViewAllClick = () => {
    markAllAsRead();
    setIsOpen(false);
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'connection_request':
        return '🔗';
      case 'new_message':
        return '💬';
      case 'profile_view':
        return '👁️';
      case 'new_referral_conversation':
        return '💼'; // New icon for referral conversations
      default:
        return '🔔';
    }
  };

  // Get notification message based on type
  const getNotificationMessage = (notification: any) => {
    switch (notification.type) {
      case 'connection_request':
        return (
          <p className="text-sm text-gray-800">
            <span className="font-medium">{notification.fromUserName}</span> wants to connect with you
          </p>
        );
      case 'new_message':
        return (
          <p className="text-sm text-gray-800">
            <span className="font-medium">{notification.fromUserName}</span> sent you a message
          </p>
        );
      case 'profile_view':
        return (
          <p className="text-sm text-gray-800">
            <span className="font-medium">{notification.viewerName || notification.fromUserName}</span> viewed your profile
          </p>
        );
      case 'new_referral_conversation':
        return (
          <p className="text-sm text-gray-800">
            <span className="font-medium">{notification.fromUserName}</span> {notification.message}
          </p>
        );
      default:
        return (
          <p className="text-sm text-gray-800">
            New notification
          </p>
        );
    }
  };

  // Format date for display
  const formatNotificationDate = (createdAt: any) => {
    if (!createdAt) return 'Recently';
    
    try {
      const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      
      return date.toLocaleDateString();
    } catch (error) {
      return 'Recently';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              <div className="flex items-center space-x-2">
                {/* Sound Toggle Button */}
                <button
                  onClick={toggleSoundMute}
                  className="text-gray-500 hover:text-orange-600 p-1 rounded-full hover:bg-gray-100"
                  title={isSoundMuted ? "Enable sound" : "Mute sound"}
                >
                  {isSoundMuted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a9 9 0 010 12m4.5-15.5a13 13 0 010 19.5M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                </button>
                
                {unreadCount > 0 && (
                  <button
                    onClick={handleViewAllClick}
                    className="text-sm text-orange-600 hover:text-orange-700"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {isSoundMuted ? "🔇 Sound notifications muted" : "🔔 Sound notifications enabled"}
            </p>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? 'bg-orange-50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 text-sm">
                            {getNotificationIcon(notification.type)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        {getNotificationMessage(notification)}
                        <p className="text-xs text-gray-500 mt-1">
                          {formatNotificationDate(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="ml-2 flex-shrink-0">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link
                href="/dashboard/connections"
                className="text-center text-orange-600 hover:text-orange-700 font-medium py-2 rounded hover:bg-orange-50"
                onClick={() => setIsOpen(false)}
              >
                Connections
              </Link>
              <Link
                href="/dashboard/profile-views"
                className="text-center text-orange-600 hover:text-orange-700 font-medium py-2 rounded hover:bg-orange-50"
                onClick={() => setIsOpen(false)}
              >
                Profile Views
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}