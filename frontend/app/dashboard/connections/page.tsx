// 'use client';
// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '@/lib/firebase';
// import Link from 'next/link';
// import { getIncomingConnectionRequests, acceptConnectionRequest, rejectConnectionRequest, Connection } from '@/lib/connections';

// // We'll define this interface in the updated lib/connections.ts
// interface UserProfile {
//   uid: string;
//   displayName: string | null;
//   headline: string;
//   profileImage: string;
// }

// export default function ConnectionRequestsPage() {
//   const [user, userLoading] = useAuthState(auth);
//   const [requests, setRequests] = useState<(Connection & { fromUser: UserProfile })[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [updatingId, setUpdatingId] = useState<string | null>(null); // Tracks which request is being acted upon

//   useEffect(() => {
//     if (user) {
//       fetchRequests();
//     }
//   }, [user]);

//   const fetchRequests = async () => {
//     if (!user) return;
//     try {
//       const incomingRequests = await getIncomingConnectionRequests(user.uid);
//       setRequests(incomingRequests);
//     } catch (error) {
//       console.error("Error fetching connection requests:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAccept = async (connectionId: string, fromUserId: string) => {
//     setUpdatingId(connectionId);
//     try {
//       await acceptConnectionRequest(connectionId);
//       // Optimistically update the UI
//       setRequests(prev => prev.filter(req => req.id !== connectionId));
//     } catch (error) {
//       console.error("Error accepting connection:", error);
//       alert("Failed to accept connection. Please try again.");
//       // Re-fetch to reset UI on error
//       fetchRequests();
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const handleReject = async (connectionId: string) => {
//     setUpdatingId(connectionId);
//     try {
//       await rejectConnectionRequest(connectionId);
//       // Optimistically update the UI
//       setRequests(prev => prev.filter(req => req.id !== connectionId));
//     } catch (error) {
//       console.error("Error rejecting connection:", error);
//       alert("Failed to reject connection. Please try again.");
//       // Re-fetch to reset UI on error
//       fetchRequests();
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   if (userLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <p>Please log in to view connection requests.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800">Connection Requests</h1>
//           <p className="text-gray-600 mt-2">Manage your incoming connection requests.</p>
//           <Link 
//             href="/dashboard" 
//             className="inline-block mt-4 text-orange-600 hover:text-orange-700 font-medium"
//           >
//             &larr; Back to Dashboard
//           </Link>
//         </div>

//         {/* Requests List */}
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           {loading ? (
//             <div className="p-8 text-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
//               <p className="mt-2 text-gray-700">Loading requests...</p>
//             </div>
//           ) : requests.length === 0 ? (
//             <div className="p-8 text-center">
//               <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-2xl">📥</span>
//               </div>
//               <p className="text-gray-700">You don't have any pending connection requests.</p>
//               <Link 
//                 href="/network" 
//                 className="inline-block mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
//               >
//                 Browse Network
//               </Link>
//             </div>
//           ) : (
//             <ul className="divide-y divide-gray-200">
//               {requests.map((request) => (
//                 <li key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
//                   <div className="flex items-center justify-between">
//                     {/* User Info */}
//                     <div className="flex items-center space-x-4">
//                       {/* Profile Image */}
//                       <div className="flex-shrink-0">
//                         {request.fromUser.profileImage ? (
//                           <img 
//                             src={request.fromUser.profileImage} 
//                             alt={request.fromUser.displayName || 'User'} 
//                             className="w-12 h-12 rounded-full object-cover"
//                           />
//                         ) : (
//                           <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
//                             <span className="text-lg text-orange-500 font-bold">
//                               {request.fromUser.displayName?.[0]?.toUpperCase() || 'U'}
//                             </span>
//                           </div>
//                         )}
//                       </div>
                      
//                       {/* Name and Headline */}
//                       <div>
//                         <Link 
//                           href={`/profile/${request.fromUser.uid}`}
//                           className="font-semibold text-gray-800 hover:text-orange-600 transition-colors"
//                         >
//                           {request.fromUser.displayName || 'Anonymous User'}
//                         </Link>
//                         {request.fromUser.headline && (
//                           <p className="text-sm text-gray-600 mt-1">{request.fromUser.headline}</p>
//                         )}
//                         <p className="text-xs text-gray-500 mt-1">Sent on {new Date(request.createdAt?.toDate()).toLocaleDateString()}</p>
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleReject(request.id)}
//                         disabled={updatingId === request.id}
//                         className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         {updatingId === request.id ? 'Processing...' : 'Reject'}
//                       </button>
//                       <button
//                         onClick={() => handleAccept(request.id, request.fromUserId)}
//                         disabled={updatingId === request.id}
//                         className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         {updatingId === request.id ? 'Processing...' : 'Accept'}
//                       </button>
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// ---------------------------------- Previous one ------------------------------

// 'use client';
// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '@/lib/firebase';
// import Link from 'next/link';
// import { getIncomingConnectionRequests, acceptConnectionRequest, rejectConnectionRequest, Connection } from '@/lib/connections';
// import { useRouter } from 'next/navigation';

// // Interface definition preserved
// interface UserProfile {
//   uid: string;
//   displayName: string | null;
//   headline: string;
//   profileImage: string;
// }

// export default function ConnectionRequestsPage() {
//   const [user, userLoading] = useAuthState(auth);
//   const router = useRouter();
//   const [requests, setRequests] = useState<(Connection & { fromUser: UserProfile })[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [updatingId, setUpdatingId] = useState<string | null>(null);

//   // LOGIC PRESERVED: Fetching data
//   useEffect(() => {
//     if (user) {
//       fetchRequests();
//     }
//   }, [user]);

//   const fetchRequests = async () => {
//     if (!user) return;
//     try {
//       const incomingRequests = await getIncomingConnectionRequests(user.uid);
//       setRequests(incomingRequests);
//     } catch (error) {
//       console.error("Error fetching connection requests:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAccept = async (connectionId: string, fromUserId: string) => {
//     setUpdatingId(connectionId);
//     try {
//       await acceptConnectionRequest(connectionId);
//       setRequests(prev => prev.filter(req => req.id !== connectionId));
//     } catch (error) {
//       console.error("Error accepting connection:", error);
//       alert("Failed to accept connection. Please try again.");
//       fetchRequests();
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const handleReject = async (connectionId: string) => {
//     setUpdatingId(connectionId);
//     try {
//       await rejectConnectionRequest(connectionId);
//       setRequests(prev => prev.filter(req => req.id !== connectionId));
//     } catch (error) {
//       console.error("Error rejecting connection:", error);
//       alert("Failed to reject connection. Please try again.");
//       fetchRequests();
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   // Loading State
//   if (userLoading || (loading && !requests.length)) {
//     return (
//       <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
//         <div className="w-12 h-12 border-4 border-neutral-100 border-t-orange-600 rounded-full animate-spin"></div>
//         <p className="text-neutral-500 font-medium">Checking invitations...</p>
//       </div>
//     );
//   }

//   // Auth Guard
//   if (!user) {
//     router.push('/login');
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6">
//       <div className="max-w-3xl mx-auto">
        
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-black text-black tracking-tight">Invitations</h1>
//             <p className="text-neutral-500 mt-1">Manage your professional network growth</p>
//           </div>
//           <Link 
//             href="/dashboard" 
//             className="text-sm font-bold text-neutral-500 hover:text-black transition-colors"
//           >
//             Done
//           </Link>
//         </div>

//         {/* Requests List */}
//         <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
//           {requests.length === 0 ? (
//             <div className="p-16 text-center">
//               <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
//                 📭
//               </div>
//               <h3 className="text-xl font-bold text-black mb-2">No Pending Requests</h3>
//               <p className="text-neutral-500 mb-8 max-w-sm mx-auto">
//                 You're all caught up! Expand your network by discovering new professionals.
//               </p>
//               <Link 
//                 href="/network" 
//                 className="inline-flex items-center justify-center px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg"
//               >
//                 Find People to Connect
//               </Link>
//             </div>
//           ) : (
//             <div className="divide-y divide-neutral-100">
//               {requests.map((request) => (
//                 <div key={request.id} className="p-6 hover:bg-neutral-50 transition-colors group">
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    
//                     {/* User Info */}
//                     <div className="flex items-start gap-4">
//                       {/* Avatar */}
//                       <Link href={`/profile/${request.fromUser.uid}`} className="flex-shrink-0">
//                         {request.fromUser.profileImage ? (
//                           <img 
//                             src={request.fromUser.profileImage} 
//                             alt={request.fromUser.displayName || 'User'} 
//                             className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-orange-200 transition-colors"
//                           />
//                         ) : (
//                           <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center border-2 border-white shadow-sm">
//                             <span className="text-xl text-neutral-400 font-bold">
//                               {request.fromUser.displayName?.[0]?.toUpperCase() || 'U'}
//                             </span>
//                           </div>
//                         )}
//                       </Link>
                      
//                       {/* Text Details */}
//                       <div>
//                         <Link 
//                           href={`/profile/${request.fromUser.uid}`}
//                           className="font-bold text-lg text-black hover:text-orange-600 transition-colors"
//                         >
//                           {request.fromUser.displayName || 'Anonymous User'}
//                         </Link>
//                         {request.fromUser.headline && (
//                           <p className="text-sm text-neutral-500 line-clamp-1">{request.fromUser.headline}</p>
//                         )}
//                         <p className="text-xs text-neutral-400 mt-2 font-medium">
//                           Sent {new Date(request.createdAt?.toDate()).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex items-center gap-3 pl-18 sm:pl-0">
//                       <button
//                         onClick={() => handleReject(request.id)}
//                         disabled={updatingId === request.id}
//                         className="px-4 py-2 text-sm font-bold text-neutral-400 hover:text-red-600 transition-colors disabled:opacity-50"
//                       >
//                         {updatingId === request.id ? '...' : 'Ignore'}
//                       </button>
                      
//                       <button
//                         onClick={() => handleAccept(request.id, request.fromUserId)}
//                         disabled={updatingId === request.id}
//                         className="px-6 py-2 bg-black text-white text-sm font-bold rounded-xl hover:bg-orange-600 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
//                       >
//                         {updatingId === request.id ? 'Accepting...' : 'Accept'}
//                       </button>
//                     </div>

//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { getIncomingConnectionRequests, acceptConnectionRequest, rejectConnectionRequest, Connection } from '@/lib/connections';
import { useRouter } from 'next/navigation';

// Interface definition preserved
interface UserProfile {
  uid: string;
  displayName: string | null;
  headline: string;
  profileImage: string;
}

export default function ConnectionRequestsPage() {
  const [user, userLoading] = useAuthState(auth);
  const router = useRouter();
  const [requests, setRequests] = useState<(Connection & { fromUser: UserProfile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // LOGIC PRESERVED: Fetching data
  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;
    try {
      // ✅ FIX: The function returns an object { requests: [], lastDoc: ... }
      const result = await getIncomingConnectionRequests(user.uid);
      
      // Extract the array safely, default to empty array if not found or null
      const requestsArray = (result && typeof result === 'object' && 'requests' in result) 
        ? result.requests 
        : (Array.isArray(result) ? result : []);
      
      setRequests(requestsArray);
    } catch (error) {
      console.error("Error fetching connection requests:", error);
      setRequests([]); // Fallback to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (connectionId: string, fromUserId: string) => {
    setUpdatingId(connectionId);
    try {
      await acceptConnectionRequest(connectionId);
      setRequests(prev => prev.filter(req => req.id !== connectionId));
    } catch (error) {
      console.error("Error accepting connection:", error);
      alert("Failed to accept connection. Please try again.");
      fetchRequests();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReject = async (connectionId: string) => {
    setUpdatingId(connectionId);
    try {
      await rejectConnectionRequest(connectionId);
      setRequests(prev => prev.filter(req => req.id !== connectionId));
    } catch (error) {
      console.error("Error rejecting connection:", error);
      alert("Failed to reject connection. Please try again.");
      fetchRequests();
    } finally {
      setUpdatingId(null);
    }
  };

  // Loading State – ✅ Updated condition to avoid infinite loading
  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-neutral-100 border-t-orange-600 rounded-full animate-spin"></div>
        <p className="text-neutral-500 font-medium">Checking invitations...</p>
      </div>
    );
  }

  // Auth Guard
  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-black tracking-tight">Invitations</h1>
            <p className="text-neutral-500 mt-1">Manage your professional network growth</p>
          </div>
          <Link 
            href="/dashboard" 
            className="text-sm font-bold text-neutral-500 hover:text-black transition-colors"
          >
            Done
          </Link>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
          {requests.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                📭
              </div>
              <h3 className="text-xl font-bold text-black mb-2">No Pending Requests</h3>
              <p className="text-neutral-500 mb-8 max-w-sm mx-auto">
                You're all caught up! Expand your network by discovering new professionals.
              </p>
              <Link 
                href="/network" 
                className="inline-flex items-center justify-center px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg"
              >
                Find People to Connect
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {requests.map((request) => (
                <div key={request.id} className="p-6 hover:bg-neutral-50 transition-colors group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    
                    {/* User Info */}
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <Link href={`/profile/${request.fromUser.uid}`} className="flex-shrink-0">
                        {request.fromUser.profileImage ? (
                          <img 
                            src={request.fromUser.profileImage} 
                            alt={request.fromUser.displayName || 'User'} 
                            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-orange-200 transition-colors"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center border-2 border-white shadow-sm">
                            <span className="text-xl text-neutral-400 font-bold">
                              {request.fromUser.displayName?.[0]?.toUpperCase() || 'U'}
                            </span>
                          </div>
                        )}
                      </Link>
                      
                      {/* Text Details */}
                      <div>
                        <Link 
                          href={`/profile/${request.fromUser.uid}`}
                          className="font-bold text-lg text-black hover:text-orange-600 transition-colors"
                        >
                          {request.fromUser.displayName || 'Anonymous User'}
                        </Link>
                        {request.fromUser.headline && (
                          <p className="text-sm text-neutral-500 line-clamp-1">{request.fromUser.headline}</p>
                        )}
                        <p className="text-xs text-neutral-400 mt-2 font-medium">
                          Sent {new Date(request.createdAt?.toDate()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pl-18 sm:pl-0">
                      <button
                        onClick={() => handleReject(request.id)}
                        disabled={updatingId === request.id}
                        className="px-4 py-2 text-sm font-bold text-neutral-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        {updatingId === request.id ? '...' : 'Ignore'}
                      </button>
                      
                      <button
                        onClick={() => handleAccept(request.id, request.fromUserId)}
                        disabled={updatingId === request.id}
                        className="px-6 py-2 bg-black text-white text-sm font-bold rounded-xl hover:bg-orange-600 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                      >
                        {updatingId === request.id ? 'Accepting...' : 'Accept'}
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}