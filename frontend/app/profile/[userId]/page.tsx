// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import Link from 'next/link';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '@/lib/firebase';
// import { sendConnectionRequest, getConnectionStatus, Connection } from '@/lib/connections';

// interface UserProfile {
//   uid: string;
//   displayName: string | null;
//   email: string | null;
//   headline: string;
//   bio: string;
//   skills: string[];
//   location: string;
//   profileImage: string;
//   projects: string[];
//   education: string;
//   experience: string;
//   website: string;
//   github: string;
//   linkedin: string;
//   createdAt?: any;
// }

// export default function UserProfile({ params }: { params: Promise<{ userId: string }> }) {
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [resolvedParams, setResolvedParams] = useState<{ userId: string } | null>(null);
//   const [connectionData, setConnectionData] = useState<Connection | null>(null);
//   const [connectionLoading, setConnectionLoading] = useState(true);
//   const [sendingRequest, setSendingRequest] = useState(false);
//   const router = useRouter();
//   const [user] = useAuthState(auth);

//   // Resolve the params promise
//   useEffect(() => {
//     params.then(resolved => {
//       setResolvedParams(resolved);
//     });
//   }, [params]);

//   useEffect(() => {
//     if (resolvedParams) {
//       fetchUserProfile();
//     }
//   }, [resolvedParams]);

//   useEffect(() => {
//     if (resolvedParams && user) {
//       fetchConnectionStatus();
//     } else {
//       setConnectionLoading(false);
//     }
//   }, [resolvedParams, user]);

//   const fetchUserProfile = async () => {
//     if (!resolvedParams) return;
    
//     try {
//       const userDoc = await getDoc(doc(db, 'users', resolvedParams.userId));
      
//       if (userDoc.exists()) {
//         setUserProfile({
//           uid: userDoc.id,
//           ...userDoc.data(),
//         } as UserProfile);
//       } else {
//         setError('User not found');
//       }
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//       setError('Error loading profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchConnectionStatus = async () => {
//     if (!user || !resolvedParams) return;
//     try {
//       const connection = await getConnectionStatus(user.uid, resolvedParams.userId);
//       setConnectionData(connection);
//     } catch (error) {
//       console.error('Error fetching connection status:', error);
//     } finally {
//       setConnectionLoading(false);
//     }
//   };

//   const handleConnect = async () => {
//     if (!user || !resolvedParams) return;
//     setSendingRequest(true);
//     try {
//       await sendConnectionRequest(user.uid, resolvedParams.userId);
//       // Refresh the connection status after sending the request
//       await fetchConnectionStatus();
//     } catch (error) {
//       console.error('Error sending connection request:', error);
//       alert('Failed to send connection request. Please try again.');
//     } finally {
//       setSendingRequest(false);
//     }
//   };

//   const formatDate = (timestamp: any) => {
//     if (!timestamp) return 'Unknown';
//     return new Date(timestamp.toDate()).toLocaleDateString();
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
//           <p className="mt-4 text-gray-700">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !userProfile) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <span className="text-2xl">❌</span>
//           </div>
//           <p className="text-gray-700 text-lg mb-4">{error || 'Profile not found'}</p>
//           <button 
//             onClick={() => router.push('/jobs')}
//             className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
//           >
//             Back to Jobs
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Check if the current user is viewing their own profile
//   const isOwnProfile = user && user.uid === resolvedParams?.userId;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         {/* Back Button */}
//         <div className="mb-6">
//           <button 
//             onClick={() => router.back()}
//             className="flex items-center text-orange-600 hover:text-orange-700 font-medium"
//           >
//             <span className="mr-2">←</span>
//             Back
//           </button>
//         </div>

//         {/* Profile Header */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
//             {/* Profile Image */}
//             <div className="flex-shrink-0">
//               {userProfile.profileImage ? (
//                 <img 
//                   src={userProfile.profileImage} 
//                   alt={userProfile.displayName || 'User'} 
//                   className="w-24 h-24 rounded-full object-cover border-2 border-orange-200"
//                 />
//               ) : (
//                 <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-200">
//                   <span className="text-2xl text-orange-500 font-bold">
//                     {userProfile.displayName?.[0]?.toUpperCase() || userProfile.email?.[0]?.toUpperCase() || 'U'}
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Basic Info */}
//             <div className="flex-grow">
//               <h1 className="text-3xl font-bold text-gray-800 mb-2">
//                 {userProfile.displayName || 'Anonymous User'}
//               </h1>
              
//               {userProfile.headline && (
//                 <p className="text-xl text-orange-600 font-semibold mb-3">
//                   {userProfile.headline}
//                 </p>
//               )}
              
//               <div className="flex flex-wrap gap-2 mb-4">
//                 {userProfile.location && (
//                   <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
//                     📍 {userProfile.location}
//                   </span>
//                 )}
//                 {userProfile.education && (
//                   <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
//                     🎓 {userProfile.education}
//                   </span>
//                 )}
//               </div>

//               {/* Connect Button - Only show if user is logged in and not viewing their own profile */}
//               {user && !isOwnProfile && (
//                 <div>
//                   {connectionLoading ? (
//                     <button disabled className="px-6 py-2 bg-gray-300 text-gray-500 rounded-md font-medium">
//                       Loading...
//                     </button>
//                   ) : connectionData ? (
//                     <button disabled className="px-6 py-2 bg-gray-300 text-gray-500 rounded-md font-medium">
//                       {connectionData.status === 'pending' ? 'Pending' : connectionData.status === 'accepted' ? 'Connected' : 'Rejected'}
//                     </button>
//                   ) : (
//                     <button 
//                       onClick={handleConnect}
//                       disabled={sendingRequest}
//                       className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium disabled:bg-orange-300 disabled:cursor-not-allowed"
//                     >
//                       {sendingRequest ? 'Sending...' : 'Connect'}
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Bio Section */}
//         {userProfile.bio && (
//           <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-orange-500 pb-2">About</h2>
//             <p className="text-gray-700 leading-relaxed">{userProfile.bio}</p>
//           </div>
//         )}

//         {/* Skills Section */}
//         {userProfile.skills && userProfile.skills.length > 0 && (
//           <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-orange-500 pb-2">Skills</h2>
//             <div className="flex flex-wrap gap-2">
//               {userProfile.skills.map((skill, index) => (
//                 <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
//                   {skill}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Experience Section */}
//         {userProfile.experience && (
//           <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-orange-500 pb-2">Experience</h2>
//             <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{userProfile.experience}</p>
//           </div>
//         )}

//         {/* Projects Section */}
//         {userProfile.projects && userProfile.projects.length > 0 && (
//           <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-orange-500 pb-2">Projects</h2>
//             <ul className="space-y-3">
//               {userProfile.projects.map((project, index) => (
//                 <li key={index} className="text-gray-700 border-l-4 border-orange-500 pl-4 py-1">
//                   {project}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Social Links */}
//         {(userProfile.website || userProfile.github || userProfile.linkedin) && (
//           <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-orange-500 pb-2">Connect</h2>
//             <div className="flex flex-wrap gap-4">
//               {userProfile.website && (
//                 <a 
//                   href={userProfile.website} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="flex items-center text-orange-600 hover:text-orange-700"
//                 >
//                   <span className="mr-2">🌐</span>
//                   Website
//                 </a>
//               )}
//               {userProfile.github && (
//                 <a 
//                   href={userProfile.github} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="flex items-center text-orange-600 hover:text-orange-700"
//                 >
//                   <span className="mr-2">💻</span>
//                   GitHub
//                 </a>
//               )}
//               {userProfile.linkedin && (
//                 <a 
//                   href={userProfile.linkedin} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="flex items-center text-orange-600 hover:text-orange-700"
//                 >
//                   <span className="mr-2">🔗</span>
//                   LinkedIn
//                 </a>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Member Since */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <p className="text-sm text-gray-600">
//             Member since {userProfile.createdAt ? formatDate(userProfile.createdAt) : 'recently'}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import Link from 'next/link';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '@/lib/firebase';
// import { sendConnectionRequest, getConnectionStatus, Connection } from '@/lib/connections';
// import { recordProfileView } from '@/lib/profileViews'; // Import the profile view tracking

// interface UserProfile {
//   uid: string;
//   displayName: string | null;
//   email: string | null;
//   headline: string;
//   bio: string;
//   skills: string[];
//   location: string;
//   profileImage: string;
//   projects: string[];
//   education: string;
//   experience: string;
//   website: string;
//   github: string;
//   linkedin: string;
//   createdAt?: any;
// }

// export default function UserProfile({ params }: { params: Promise<{ userId: string }> }) {
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [resolvedParams, setResolvedParams] = useState<{ userId: string } | null>(null);
//   const [connectionData, setConnectionData] = useState<Connection | null>(null);
//   const [connectionLoading, setConnectionLoading] = useState(true);
//   const [sendingRequest, setSendingRequest] = useState(false);
//   const router = useRouter();
//   const [user] = useAuthState(auth);

//   // Resolve the params promise
//   useEffect(() => {
//     params.then(resolved => {
//       setResolvedParams(resolved);
//     });
//   }, [params]);

//   useEffect(() => {
//     if (resolvedParams) {
//       fetchUserProfile();
//     }
//   }, [resolvedParams]);

//   useEffect(() => {
//     if (resolvedParams && user) {
//       fetchConnectionStatus();
//     } else {
//       setConnectionLoading(false);
//     }
//   }, [resolvedParams, user]);

//   const fetchUserProfile = async () => {
//     if (!resolvedParams) return;
    
//     try {
//       const userDoc = await getDoc(doc(db, 'users', resolvedParams.userId));
      
//       if (userDoc.exists()) {
//         const profileData = {
//           uid: userDoc.id,
//           ...userDoc.data(),
//         } as UserProfile;
        
//         setUserProfile(profileData);
        
//         // Record profile view if user is logged in and not viewing their own profile
//         if (user && user.uid !== resolvedParams.userId) {
//           console.log('Attempting to record profile view:', {
//             viewer: user.uid,
//             viewed: resolvedParams.userId
//           });
//           try {
//             await recordProfileView(resolvedParams.userId, user.uid);
//             console.log('Profile view recording completed');
//           } catch (viewError) {
//             console.error('Error recording profile view:', viewError);
//           }
//         } else {
//           console.log('Skipping profile view recording:', {
//             reason: user ? 'own profile' : 'not logged in',
//             viewer: user?.uid,
//             viewed: resolvedParams.userId
//           });
//         }
//       } else {
//         setError('User not found');
//       }
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//       setError('Error loading profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchConnectionStatus = async () => {
//     if (!user || !resolvedParams) return;
//     try {
//       const connection = await getConnectionStatus(user.uid, resolvedParams.userId);
//       setConnectionData(connection);
//     } catch (error) {
//       console.error('Error fetching connection status:', error);
//     } finally {
//       setConnectionLoading(false);
//     }
//   };

//   const handleConnect = async () => {
//     if (!user || !resolvedParams) return;
//     setSendingRequest(true);
//     try {
//       await sendConnectionRequest(user.uid, resolvedParams.userId);
//       // Refresh the connection status after sending the request
//       await fetchConnectionStatus();
//     } catch (error) {
//       console.error('Error sending connection request:', error);
//       alert('Failed to send connection request. Please try again.');
//     } finally {
//       setSendingRequest(false);
//     }
//   };

//   const formatDate = (timestamp: any) => {
//     if (!timestamp) return 'Unknown';
//     return new Date(timestamp.toDate()).toLocaleDateString();
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
//           <p className="mt-4 text-gray-700">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !userProfile) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <span className="text-2xl">❌</span>
//           </div>
//           <p className="text-gray-700 text-lg mb-4">{error || 'Profile not found'}</p>
//           <button 
//             onClick={() => router.push('/jobs')}
//             className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
//           >
//             Back to Jobs
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Check if the current user is viewing their own profile
//   const isOwnProfile = user && user.uid === resolvedParams?.userId;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         {/* Back Button */}
//         <div className="mb-6">
//           <button 
//             onClick={() => router.back()}
//             className="flex items-center text-orange-600 hover:text-orange-700 font-medium"
//           >
//             <span className="mr-2">←</span>
//             Back
//           </button>
//         </div>

//         {/* Profile Header */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
//             {/* Profile Image */}
//             <div className="flex-shrink-0">
//               {userProfile.profileImage ? (
//                 <img 
//                   src={userProfile.profileImage} 
//                   alt={userProfile.displayName || 'User'} 
//                   className="w-24 h-24 rounded-full object-cover border-2 border-orange-200"
//                 />
//               ) : (
//                 <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-200">
//                   <span className="text-2xl text-orange-500 font-bold">
//                     {userProfile.displayName?.[0]?.toUpperCase() || userProfile.email?.[0]?.toUpperCase() || 'U'}
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Basic Info */}
//             <div className="flex-grow">
//               <h1 className="text-3xl font-bold text-gray-800 mb-2">
//                 {userProfile.displayName || 'Anonymous User'}
//               </h1>
              
//               {userProfile.headline && (
//                 <p className="text-xl text-orange-600 font-semibold mb-3">
//                   {userProfile.headline}
//                 </p>
//               )}
              
//               <div className="flex flex-wrap gap-2 mb-4">
//                 {userProfile.location && (
//                   <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
//                     📍 {userProfile.location}
//                   </span>
//                 )}
//                 {userProfile.education && (
//                   <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
//                     🎓 {userProfile.education}
//                   </span>
//                 )}
//               </div>

//               {/* Connect Button - Only show if user is logged in and not viewing their own profile */}
//               {user && !isOwnProfile && (
//                 <div>
//                   {connectionLoading ? (
//                     <button disabled className="px-6 py-2 bg-gray-300 text-gray-500 rounded-md font-medium">
//                       Loading...
//                     </button>
//                   ) : connectionData ? (
//                     <button disabled className="px-6 py-2 bg-gray-300 text-gray-500 rounded-md font-medium">
//                       {connectionData.status === 'pending' ? 'Pending' : connectionData.status === 'accepted' ? 'Connected' : 'Rejected'}
//                     </button>
//                   ) : (
//                     <button 
//                       onClick={handleConnect}
//                       disabled={sendingRequest}
//                       className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium disabled:bg-orange-300 disabled:cursor-not-allowed"
//                     >
//                       {sendingRequest ? 'Sending...' : 'Connect'}
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Bio Section */}
//         {userProfile.bio && (
//           <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-orange-500 pb-2">About</h2>
//             <p className="text-gray-700 leading-relaxed">{userProfile.bio}</p>
//           </div>
//         )}

//         {/* Skills Section */}
//         {userProfile.skills && userProfile.skills.length > 0 && (
//           <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-orange-500 pb-2">Skills</h2>
//             <div className="flex flex-wrap gap-2">
//               {userProfile.skills.map((skill, index) => (
//                 <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
//                   {skill}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Experience Section */}
//         {userProfile.experience && (
//           <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-orange-500 pb-2">Experience</h2>
//             <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{userProfile.experience}</p>
//           </div>
//         )}

//         {/* Projects Section */}
//         {userProfile.projects && userProfile.projects.length > 0 && (
//           <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-orange-500 pb-2">Projects</h2>
//             <ul className="space-y-3">
//               {userProfile.projects.map((project, index) => (
//                 <li key={index} className="text-gray-700 border-l-4 border-orange-500 pl-4 py-1">
//                   {project}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Social Links */}
//         {(userProfile.website || userProfile.github || userProfile.linkedin) && (
//           <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-orange-500 pb-2">Connect</h2>
//             <div className="flex flex-wrap gap-4">
//               {userProfile.website && (
//                 <a 
//                   href={userProfile.website} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="flex items-center text-orange-600 hover:text-orange-700"
//                 >
//                   <span className="mr-2">🌐</span>
//                   Website
//                 </a>
//               )}
//               {userProfile.github && (
//                 <a 
//                   href={userProfile.github} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="flex items-center text-orange-600 hover:text-orange-700"
//                 >
//                   <span className="mr-2">💻</span>
//                   GitHub
//                 </a>
//               )}
//               {userProfile.linkedin && (
//                 <a 
//                   href={userProfile.linkedin} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="flex items-center text-orange-600 hover:text-orange-700"
//                 >
//                   <span className="mr-2">🔗</span>
//                   LinkedIn
//                 </a>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Member Since */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <p className="text-sm text-gray-600">
//             Member since {userProfile.createdAt ? formatDate(userProfile.createdAt) : 'recently'}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// working main one 

// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '@/lib/firebase';
// import { sendConnectionRequest, getConnectionStatus, Connection } from '@/lib/connections';
// import { recordProfileView } from '@/lib/profileViews';
// import { 
//   ArrowLeft, Mail, MapPin, Briefcase, GraduationCap, 
//   Link as LinkIcon, Github, Linkedin, Globe, Calendar,
//   CheckCircle, Clock, Send, User, Award, BookOpen,
//   Building, Code, MessageSquare, ExternalLink, Star,
//   ChevronRight, Sparkles, Users, Eye
// } from 'lucide-react';

// interface UserProfile {
//   uid: string;
//   displayName: string | null;
//   email: string | null;
//   headline: string;
//   bio: string;
//   skills: string[];
//   location: string;
//   profileImage: string;
//   projects: string[];
//   education: string;
//   experience: string;
//   website: string;
//   github: string;
//   linkedin: string;
//   createdAt?: any;
// }

// export default function UserProfile({ params }: { params: Promise<{ userId: string }> }) {
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [resolvedParams, setResolvedParams] = useState<{ userId: string } | null>(null);
//   const [connectionData, setConnectionData] = useState<Connection | null>(null);
//   const [connectionLoading, setConnectionLoading] = useState(true);
//   const [sendingRequest, setSendingRequest] = useState(false);
//   const router = useRouter();
//   const [user] = useAuthState(auth);

//   // Resolve the params promise
//   useEffect(() => {
//     params.then(resolved => {
//       setResolvedParams(resolved);
//     });
//   }, [params]);

//   useEffect(() => {
//     if (resolvedParams) {
//       fetchUserProfile();
//     }
//   }, [resolvedParams]);

//   useEffect(() => {
//     if (resolvedParams && user) {
//       fetchConnectionStatus();
//     } else {
//       setConnectionLoading(false);
//     }
//   }, [resolvedParams, user]);

//   const fetchUserProfile = async () => {
//     if (!resolvedParams) return;
    
//     try {
//       const userDoc = await getDoc(doc(db, 'users', resolvedParams.userId));
      
//       if (userDoc.exists()) {
//         const profileData = {
//           uid: userDoc.id,
//           ...userDoc.data(),
//         } as UserProfile;
        
//         setUserProfile(profileData);
        
//         // Record profile view if user is logged in and not viewing their own profile
//         if (user && user.uid !== resolvedParams.userId) {
//           try {
//             await recordProfileView(resolvedParams.userId, user.uid);
//           } catch (viewError) {
//             console.error('Error recording profile view:', viewError);
//           }
//         }
//       } else {
//         setError('User not found');
//       }
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//       setError('Error loading profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchConnectionStatus = async () => {
//     if (!user || !resolvedParams) return;
//     try {
//       const connection = await getConnectionStatus(user.uid, resolvedParams.userId);
//       setConnectionData(connection);
//     } catch (error) {
//       console.error('Error fetching connection status:', error);
//     } finally {
//       setConnectionLoading(false);
//     }
//   };

//   const handleConnect = async () => {
//     if (!user || !resolvedParams) return;
//     setSendingRequest(true);
//     try {
//       await sendConnectionRequest(user.uid, resolvedParams.userId);
//       await fetchConnectionStatus();
//     } catch (error) {
//       console.error('Error sending connection request:', error);
//       alert('Failed to send connection request. Please try again.');
//     } finally {
//       setSendingRequest(false);
//     }
//   };

//   const handleMessage = () => {
//     if (!user || !resolvedParams) return;
//     router.push(`/dashboard/messages/${[user.uid, resolvedParams.userId].sort().join('_')}`);
//   };

//   const formatDate = (timestamp: any) => {
//     if (!timestamp?.toDate) return 'Recently';
//     const date = timestamp.toDate();
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - date.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     if (diffDays < 30) return `${diffDays} days ago`;
//     return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <div className="w-16 h-16 border-4 border-neutral-200 border-t-orange-600 rounded-full animate-spin mx-auto"></div>
//           <p className="text-neutral-600 font-medium">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !userProfile) {
//     return (
//       <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
//         <div className="bg-white rounded-2xl p-8 text-center max-w-md shadow-sm border border-neutral-200">
//           <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <User className="w-8 h-8 text-orange-600" />
//           </div>
//           <h2 className="text-xl font-bold text-black mb-2">Profile Not Found</h2>
//           <p className="text-neutral-600 mb-6">{error || 'This user profile could not be loaded.'}</p>
//           <button 
//             onClick={() => router.push('/network')}
//             className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors"
//           >
//             Browse Network
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Check if the current user is viewing their own profile
//   const isOwnProfile = user && user.uid === resolvedParams?.userId;

//   return (
//     <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6">
//       <div className="max-w-6xl mx-auto">
        
//         {/* Navigation Header */}
//         <div className="mb-8">
//           <button 
//             onClick={() => router.back()}
//             className="group flex items-center text-sm font-bold text-neutral-500 hover:text-black transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
//             Back to Network
//           </button>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
          
//           {/* Left Column - Profile Card */}
//           <div className="lg:col-span-1 space-y-6">
            
//             {/* Profile Card */}
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//               <div className="text-center mb-6">
//                 {/* Profile Image */}
//                 <div className="relative mb-4">
//                   {userProfile.profileImage ? (
//                     <img 
//                       src={userProfile.profileImage} 
//                       alt={userProfile.displayName || 'User'} 
//                       className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
//                     />
//                   ) : (
//                     <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center border-4 border-white shadow-lg mx-auto">
//                       <span className="text-4xl font-bold text-orange-600">
//                         {userProfile.displayName?.[0]?.toUpperCase() || userProfile.email?.[0]?.toUpperCase() || 'U'}
//                       </span>
//                     </div>
//                   )}
//                   {/* Online Status */}
//                   <div className="absolute bottom-2 right-1/4 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//                 </div>

//                 {/* Name and Headline */}
//                 <h1 className="text-2xl font-black text-black mb-2">
//                   {userProfile.displayName || 'Anonymous User'}
//                 </h1>
//                 {userProfile.headline && (
//                   <p className="text-orange-600 font-medium mb-4">
//                     {userProfile.headline}
//                   </p>
//                 )}
//               </div>

//               {/* Stats */}
//               <div className="grid grid-cols-2 gap-3 mb-6">
//                 <div className="bg-neutral-50 rounded-xl p-3 text-center">
//                   <div className="text-2xl font-bold text-black">0</div>
//                   <div className="text-xs text-neutral-500">Connections</div>
//                 </div>
//                 <div className="bg-neutral-50 rounded-xl p-3 text-center">
//                   <div className="text-2xl font-bold text-black">{userProfile.projects?.length || 0}</div>
//                   <div className="text-xs text-neutral-500">Projects</div>
//                 </div>
//               </div>

//               {/* Contact Info */}
//               <div className="space-y-3 mb-6">
//                 {userProfile.location && (
//                   <div className="flex items-center text-sm text-neutral-600">
//                     <MapPin className="w-4 h-4 mr-3 text-neutral-400" />
//                     {userProfile.location}
//                   </div>
//                 )}
//                 {userProfile.email && (
//                   <div className="flex items-center text-sm text-neutral-600">
//                     <Mail className="w-4 h-4 mr-3 text-neutral-400" />
//                     <span className="truncate">{userProfile.email}</span>
//                   </div>
//                 )}
//                 {userProfile.education && (
//                   <div className="flex items-center text-sm text-neutral-600">
//                     <GraduationCap className="w-4 h-4 mr-3 text-neutral-400" />
//                     {userProfile.education}
//                   </div>
//                 )}
//                 {userProfile.createdAt && (
//                   <div className="flex items-center text-sm text-neutral-600">
//                     <Calendar className="w-4 h-4 mr-3 text-neutral-400" />
//                     Joined {formatDate(userProfile.createdAt)}
//                   </div>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               {user && !isOwnProfile && (
//                 <div className="space-y-3">
//                   {connectionLoading ? (
//                     <button disabled className="w-full py-3 bg-neutral-200 text-neutral-400 rounded-xl font-bold flex items-center justify-center">
//                       <div className="w-5 h-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin mr-2" />
//                       Loading...
//                     </button>
//                   ) : connectionData ? (
//                     <button disabled className="w-full py-3 bg-neutral-200 text-neutral-600 rounded-xl font-bold flex items-center justify-center">
//                       {connectionData.status === 'pending' ? (
//                         <>
//                           <Clock className="w-5 h-5 mr-2" />
//                           Request Pending
//                         </>
//                       ) : connectionData.status === 'accepted' ? (
//                         <>
//                           <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
//                           Connected
//                         </>
//                       ) : (
//                         'Rejected'
//                       )}
//                     </button>
//                   ) : (
//                     <button 
//                       onClick={handleConnect}
//                       disabled={sendingRequest}
//                       className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center disabled:bg-neutral-300 disabled:cursor-not-allowed"
//                     >
//                       {sendingRequest ? (
//                         <>
//                           <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//                           Sending...
//                         </>
//                       ) : (
//                         <>
//                           <Users className="w-5 h-5 mr-2" />
//                           Connect
//                         </>
//                       )}
//                     </button>
//                   )}
                  
//                   <button 
//                     onClick={handleMessage}
//                     className="w-full py-3 bg-white border-2 border-black text-black rounded-xl font-bold hover:bg-neutral-50 transition-colors flex items-center justify-center"
//                   >
//                     <MessageSquare className="w-5 h-5 mr-2" />
//                     Message
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Social Links */}
//             {(userProfile.website || userProfile.github || userProfile.linkedin) && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4">Connect</h3>
//                 <div className="space-y-3">
//                   {userProfile.website && (
//                     <a 
//                       href={userProfile.website} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group"
//                     >
//                       <div className="flex items-center">
//                         <Globe className="w-5 h-5 mr-3 text-neutral-500" />
//                         <span className="font-medium text-black">Website</span>
//                       </div>
//                       <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black" />
//                     </a>
//                   )}
//                   {userProfile.github && (
//                     <a 
//                       href={userProfile.github} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group"
//                     >
//                       <div className="flex items-center">
//                         <Github className="w-5 h-5 mr-3 text-neutral-500" />
//                         <span className="font-medium text-black">GitHub</span>
//                       </div>
//                       <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black" />
//                     </a>
//                   )}
//                   {userProfile.linkedin && (
//                     <a 
//                       href={userProfile.linkedin} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group"
//                     >
//                       <div className="flex items-center">
//                         <Linkedin className="w-5 h-5 mr-3 text-neutral-500" />
//                         <span className="font-medium text-black">LinkedIn</span>
//                       </div>
//                       <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black" />
//                     </a>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Skills Preview */}
//             {userProfile.skills && userProfile.skills.length > 0 && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4">Top Skills</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {userProfile.skills.slice(0, 6).map((skill, index) => (
//                     <span key={index} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium">
//                       {skill}
//                     </span>
//                   ))}
//                   {userProfile.skills.length > 6 && (
//                     <span className="px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-lg text-sm font-medium">
//                       +{userProfile.skills.length - 6} more
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Column - Main Content */}
//           <div className="lg:col-span-2 space-y-6">
            
//             {/* About Section */}
//             {userProfile.bio && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-bold text-black">About</h2>
//                   <Sparkles className="w-5 h-5 text-orange-500" />
//                 </div>
//                 <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap">
//                   {userProfile.bio}
//                 </p>
//               </div>
//             )}

//             {/* Experience Section */}
//             {userProfile.experience && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-bold text-black">Experience</h2>
//                   <Briefcase className="w-5 h-5 text-orange-500" />
//                 </div>
//                 <div className="text-neutral-600 leading-relaxed whitespace-pre-wrap">
//                   {userProfile.experience.split('\n').map((line, index) => (
//                     <p key={index} className="mb-3 text-justify">{line}</p>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Skills Full Section */}
//             {userProfile.skills && userProfile.skills.length > 0 && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-bold text-black">Skills & Expertise</h2>
//                   <Award className="w-5 h-5 text-orange-500" />
//                 </div>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                   {userProfile.skills.map((skill, index) => (
//                     <div key={index} className="flex items-center p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group">
//                       <Code className="w-4 h-4 mr-3 text-neutral-500" />
//                       <span className="font-medium text-black">{skill}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Projects Section */}
//             {userProfile.projects && userProfile.projects.length > 0 && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-bold text-black">Projects</h2>
//                   <BookOpen className="w-5 h-5 text-orange-500" />
//                 </div>
//                 <div className="space-y-4">
//                   {userProfile.projects.map((project, index) => (
//                     <div key={index} className="p-4 bg-gradient-to-r from-orange-50 to-orange-50/50 rounded-xl border border-orange-100 group hover:border-orange-200 transition-colors">
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center mb-2">
//                             <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
//                               <Star className="w-4 h-4 text-orange-600" />
//                             </div>
//                             <h3 className="font-bold text-black">Project {index + 1}</h3>
//                           </div>
//                           <p className="text-neutral-600 leading-relaxed">{project}</p>
//                         </div>
//                         <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-orange-600 transition-colors" />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Empty State for Missing Sections */}
//             {(!userProfile.bio && !userProfile.experience && !userProfile.skills?.length && !userProfile.projects?.length) && (
//               <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-neutral-200">
//                 <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <User className="w-8 h-8 text-orange-600" />
//                 </div>
//                 <h3 className="text-lg font-bold text-black mb-2">Profile in Progress</h3>
//                 <p className="text-neutral-500 max-w-md mx-auto">
//                   This user hasn't added much information yet. Connect with them to learn more about their professional background.
//                 </p>
//               </div>
//             )}

//             {/* View Profile Views (For Own Profile) */}
//             {isOwnProfile && (
//               <div className="bg-gradient-to-r from-orange-50 to-orange-50/50 rounded-2xl p-6 border border-orange-100">
//                 <div className="flex items-center mb-4">
//                   <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mr-4">
//                     <Eye className="w-5 h-5 text-orange-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-black">Profile Visibility</h3>
//                     <p className="text-sm text-neutral-600">Your profile is public on the network</p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-white rounded-xl p-4 text-center border border-neutral-200">
//                     <div className="text-2xl font-bold text-black">0</div>
//                     <div className="text-xs text-neutral-500">Profile Views</div>
//                   </div>
//                   <div className="bg-white rounded-xl p-4 text-center border border-neutral-200">
//                     <div className="text-2xl font-bold text-black">0</div>
//                     <div className="text-xs text-neutral-500">Connections</div>
//                   </div>
//                 </div>
//                 <button 
//                   onClick={() => router.push('/dashboard')}
//                   className="mt-4 w-full py-3 bg-white border-2 border-black text-black rounded-xl font-bold hover:bg-neutral-50 transition-colors"
//                 >
//                   Edit Profile
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '@/lib/firebase';
// import { 
//   sendConnectionRequest, 
//   getConnectionStatus, 
//   Connection,
//   areUsersConnected  // Make sure this is imported
// } from '@/lib/connections';
// import { recordProfileView } from '@/lib/profileViews';
// import { 
//   ArrowLeft, Mail, MapPin, Briefcase, GraduationCap, 
//   Link as LinkIcon, Github, Linkedin, Globe, Calendar,
//   CheckCircle, Clock, Send, User, Award, BookOpen,
//   Building, Code, MessageSquare, ExternalLink, Star,
//   ChevronRight, Sparkles, Users, Eye
// } from 'lucide-react';

// interface UserProfile {
//   uid: string;
//   displayName: string | null;
//   email: string | null;
//   headline: string;
//   bio: string;
//   skills: string[];
//   location: string;
//   profileImage: string;
//   projects: string[];
//   education: string;
//   experience: string;
//   website: string;
//   github: string;
//   linkedin: string;
//   createdAt?: any;
// }

// export default function UserProfile({ params }: { params: Promise<{ userId: string }> }) {
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [resolvedParams, setResolvedParams] = useState<{ userId: string } | null>(null);
//   const [connectionData, setConnectionData] = useState<Connection | null>(null);
//   const [connectionLoading, setConnectionLoading] = useState(true);
//   const [sendingRequest, setSendingRequest] = useState(false);
//   const [checkingConnection, setCheckingConnection] = useState(false);
//   const router = useRouter();
//   const [user] = useAuthState(auth);

//   // Resolve the params promise
//   useEffect(() => {
//     params.then(resolved => {
//       setResolvedParams(resolved);
//     });
//   }, [params]);

//   useEffect(() => {
//     if (resolvedParams) {
//       fetchUserProfile();
//     }
//   }, [resolvedParams]);

//   useEffect(() => {
//     if (resolvedParams && user) {
//       fetchConnectionStatus();
//     } else {
//       setConnectionLoading(false);
//     }
//   }, [resolvedParams, user]);

//   const fetchUserProfile = async () => {
//     if (!resolvedParams) return;
    
//     try {
//       const userDoc = await getDoc(doc(db, 'users', resolvedParams.userId));
      
//       if (userDoc.exists()) {
//         const profileData = {
//           uid: userDoc.id,
//           ...userDoc.data(),
//         } as UserProfile;
        
//         setUserProfile(profileData);
        
//         // Record profile view if user is logged in and not viewing their own profile
//         if (user && user.uid !== resolvedParams.userId) {
//           try {
//             await recordProfileView(resolvedParams.userId, user.uid);
//           } catch (viewError) {
//             console.error('Error recording profile view:', viewError);
//           }
//         }
//       } else {
//         setError('User not found');
//       }
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//       setError('Error loading profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // FIXED: Check connection status in BOTH directions
//   const fetchConnectionStatus = async () => {
//     if (!user || !resolvedParams) return;
    
//     setConnectionLoading(true);
//     try {
//       console.log('Checking connection between:', user.uid, 'and', resolvedParams.userId);
      
//       // Check connection from current user to target user
//       const connection1 = await getConnectionStatus(user.uid, resolvedParams.userId);
//       console.log('Connection 1 (user → target):', connection1);
      
//       // Check connection from target user to current user
//       const connection2 = await getConnectionStatus(resolvedParams.userId, user.uid);
//       console.log('Connection 2 (target → user):', connection2);
      
//       // Use whichever connection exists
//       if (connection1) {
//         setConnectionData(connection1);
//       } else if (connection2) {
//         setConnectionData(connection2);
//       } else {
//         setConnectionData(null);
//       }
//     } catch (error) {
//       console.error('Error fetching connection status:', error);
//       setConnectionData(null);
//     } finally {
//       setConnectionLoading(false);
//     }
//   };

//   const handleConnect = async () => {
//     if (!user || !resolvedParams) return;
//     setSendingRequest(true);
//     try {
//       await sendConnectionRequest(user.uid, resolvedParams.userId);
//       await fetchConnectionStatus(); // Refresh connection status
//     } catch (error: any) {
//       console.error('Error sending connection request:', error);
//       alert(error.message || 'Failed to send connection request. Please try again.');
//     } finally {
//       setSendingRequest(false);
//     }
//   };

//   // FIXED: Proper connection check for messaging
//   const handleMessage = async () => {
//     if (!user || !resolvedParams) return;
    
//     setCheckingConnection(true);
    
//     try {
//       // Check if users are connected using the fixed function
//       const isConnected = await areUsersConnected(user.uid, resolvedParams.userId);
//       console.log('Are users connected?', isConnected);
      
//       if (!isConnected) {
//         // If not connected, show alert and suggest connecting first
//         const shouldConnect = window.confirm(
//           `You need to connect with ${userProfile?.displayName || 'this user'} before messaging. Would you like to send a connection request first?`
//         );
        
//         if (shouldConnect) {
//           // Send connection request
//           await handleConnect();
//         }
//         return; // Don't proceed to messaging
//       }
      
//       // If connected, navigate to messages
//       const sortedIds = [user.uid, resolvedParams.userId].sort();
//       const conversationId = `${sortedIds[0]}_${sortedIds[1]}`;
//       router.push(`/dashboard/messages/${conversationId}`);
      
//     } catch (error) {
//       console.error('Error checking connection for messaging:', error);
//       alert('Unable to start messaging. Please try again.');
//     } finally {
//       setCheckingConnection(false);
//     }
//   };

//   const formatDate = (timestamp: any) => {
//     if (!timestamp?.toDate) return 'Recently';
//     const date = timestamp.toDate();
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - date.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     if (diffDays < 30) return `${diffDays} days ago`;
//     return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <div className="w-16 h-16 border-4 border-neutral-200 border-t-orange-600 rounded-full animate-spin mx-auto"></div>
//           <p className="text-neutral-600 font-medium">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !userProfile) {
//     return (
//       <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
//         <div className="bg-white rounded-2xl p-8 text-center max-w-md shadow-sm border border-neutral-200">
//           <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <User className="w-8 h-8 text-orange-600" />
//           </div>
//           <h2 className="text-xl font-bold text-black mb-2">Profile Not Found</h2>
//           <p className="text-neutral-600 mb-6">{error || 'This user profile could not be loaded.'}</p>
//           <button 
//             onClick={() => router.push('/network')}
//             className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors"
//           >
//             Browse Network
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Check if the current user is viewing their own profile
//   const isOwnProfile = user && user.uid === resolvedParams?.userId;

//   // Determine message button text and state based on connection status
//   const getMessageButtonState = () => {
//     if (!user || isOwnProfile) return null;
    
//     if (checkingConnection) {
//       return {
//         text: 'Checking...',
//         disabled: true,
//         icon: <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />,
//         onClick: () => {} // No action
//       };
//     }
    
//     if (connectionData?.status === 'accepted') {
//       return {
//         text: 'Message',
//         disabled: false,
//         icon: <MessageSquare className="w-5 h-5 mr-2" />,
//         onClick: handleMessage
//       };
//     }
    
//     // If not connected or pending
//     return {
//       text: connectionData?.status === 'pending' ? 'Request Pending' : 'Connect to Message',
//       disabled: connectionData?.status === 'pending',
//       icon: connectionData?.status === 'pending' ? 
//         <Clock className="w-5 h-5 mr-2" /> : 
//         <Users className="w-5 h-5 mr-2" />,
//       onClick: connectionData?.status === 'pending' ? () => {} : handleConnect
//     };
//   };

//   const messageButtonState = getMessageButtonState();

//   return (
//     <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6">
//       <div className="max-w-6xl mx-auto">
        
//         {/* Navigation Header */}
//         <div className="mb-8">
//           <button 
//             onClick={() => router.back()}
//             className="group flex items-center text-sm font-bold text-neutral-500 hover:text-black transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
//             Back to Network
//           </button>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
          
//           {/* Left Column - Profile Card */}
//           <div className="lg:col-span-1 space-y-6">
            
//             {/* Profile Card */}
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//               <div className="text-center mb-6">
//                 {/* Profile Image */}
//                 <div className="relative mb-4">
//                   {userProfile.profileImage ? (
//                     <img 
//                       src={userProfile.profileImage} 
//                       alt={userProfile.displayName || 'User'} 
//                       className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
//                     />
//                   ) : (
//                     <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center border-4 border-white shadow-lg mx-auto">
//                       <span className="text-4xl font-bold text-orange-600">
//                         {userProfile.displayName?.[0]?.toUpperCase() || userProfile.email?.[0]?.toUpperCase() || 'U'}
//                       </span>
//                     </div>
//                   )}
//                   {/* Online Status */}
//                   <div className="absolute bottom-2 right-1/4 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//                 </div>

//                 {/* Name and Headline */}
//                 <h1 className="text-2xl font-black text-black mb-2">
//                   {userProfile.displayName || 'Anonymous User'}
//                 </h1>
//                 {userProfile.headline && (
//                   <p className="text-orange-600 font-medium mb-4">
//                     {userProfile.headline}
//                   </p>
//                 )}
//               </div>

//               {/* Stats */}
//               <div className="grid grid-cols-2 gap-3 mb-6">
//                 <div className="bg-neutral-50 rounded-xl p-3 text-center">
//                   <div className="text-2xl font-bold text-black">0</div>
//                   <div className="text-xs text-neutral-500">Connections</div>
//                 </div>
//                 <div className="bg-neutral-50 rounded-xl p-3 text-center">
//                   <div className="text-2xl font-bold text-black">{userProfile.projects?.length || 0}</div>
//                   <div className="text-xs text-neutral-500">Projects</div>
//                 </div>
//               </div>

//               {/* Contact Info */}
//               <div className="space-y-3 mb-6">
//                 {userProfile.location && (
//                   <div className="flex items-center text-sm text-neutral-600">
//                     <MapPin className="w-4 h-4 mr-3 text-neutral-400" />
//                     {userProfile.location}
//                   </div>
//                 )}
//                 {userProfile.email && (
//                   <div className="flex items-center text-sm text-neutral-600">
//                     <Mail className="w-4 h-4 mr-3 text-neutral-400" />
//                     <span className="truncate">{userProfile.email}</span>
//                   </div>
//                 )}
//                 {userProfile.education && (
//                   <div className="flex items-center text-sm text-neutral-600">
//                     <GraduationCap className="w-4 h-4 mr-3 text-neutral-400" />
//                     {userProfile.education}
//                   </div>
//                 )}
//                 {userProfile.createdAt && (
//                   <div className="flex items-center text-sm text-neutral-600">
//                     <Calendar className="w-4 h-4 mr-3 text-neutral-400" />
//                     Joined {formatDate(userProfile.createdAt)}
//                   </div>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               {user && !isOwnProfile && (
//                 <div className="space-y-3">
//                   {connectionLoading ? (
//                     <button disabled className="w-full py-3 bg-neutral-200 text-neutral-400 rounded-xl font-bold flex items-center justify-center">
//                       <div className="w-5 h-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin mr-2" />
//                       Loading...
//                     </button>
//                   ) : connectionData ? (
//                     <button disabled className="w-full py-3 bg-neutral-200 text-neutral-600 rounded-xl font-bold flex items-center justify-center">
//                       {connectionData.status === 'pending' ? (
//                         <>
//                           <Clock className="w-5 h-5 mr-2" />
//                           Request Pending
//                         </>
//                       ) : connectionData.status === 'accepted' ? (
//                         <>
//                           <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
//                           Connected
//                         </>
//                       ) : (
//                         'Rejected'
//                       )}
//                     </button>
//                   ) : (
//                     <button 
//                       onClick={handleConnect}
//                       disabled={sendingRequest}
//                       className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center disabled:bg-neutral-300 disabled:cursor-not-allowed"
//                     >
//                       {sendingRequest ? (
//                         <>
//                           <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//                           Sending...
//                         </>
//                       ) : (
//                         <>
//                           <Users className="w-5 h-5 mr-2" />
//                           Connect
//                         </>
//                       )}
//                     </button>
//                   )}
                  
//                   {/* Message Button with Proper Connection Check */}
//                   {messageButtonState && (
//                     <button 
//                       onClick={messageButtonState.onClick}
//                       disabled={messageButtonState.disabled}
//                       className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-colors ${
//                         connectionData?.status === 'accepted'
//                           ? 'bg-white border-2 border-black text-black hover:bg-neutral-50'
//                           : 'bg-orange-100 border-2 border-orange-300 text-orange-700 hover:bg-orange-200'
//                       } ${messageButtonState.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     >
//                       {messageButtonState.icon}
//                       {messageButtonState.text}
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Social Links */}
//             {(userProfile.website || userProfile.github || userProfile.linkedin) && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4">Connect</h3>
//                 <div className="space-y-3">
//                   {userProfile.website && (
//                     <a 
//                       href={userProfile.website} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group"
//                     >
//                       <div className="flex items-center">
//                         <Globe className="w-5 h-5 mr-3 text-neutral-500" />
//                         <span className="font-medium text-black">Website</span>
//                       </div>
//                       <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black" />
//                     </a>
//                   )}
//                   {userProfile.github && (
//                     <a 
//                       href={userProfile.github} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group"
//                     >
//                       <div className="flex items-center">
//                         <Github className="w-5 h-5 mr-3 text-neutral-500" />
//                         <span className="font-medium text-black">GitHub</span>
//                       </div>
//                       <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black" />
//                     </a>
//                   )}
//                   {userProfile.linkedin && (
//                     <a 
//                       href={userProfile.linkedin} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group"
//                     >
//                       <div className="flex items-center">
//                         <Linkedin className="w-5 h-5 mr-3 text-neutral-500" />
//                         <span className="font-medium text-black">LinkedIn</span>
//                       </div>
//                       <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black" />
//                     </a>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Skills Preview */}
//             {userProfile.skills && userProfile.skills.length > 0 && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4">Top Skills</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {userProfile.skills.slice(0, 6).map((skill, index) => (
//                     <span key={index} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium">
//                       {skill}
//                     </span>
//                   ))}
//                   {userProfile.skills.length > 6 && (
//                     <span className="px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-lg text-sm font-medium">
//                       +{userProfile.skills.length - 6} more
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Column - Main Content */}
//           <div className="lg:col-span-2 space-y-6">
            
//             {/* About Section */}
//             {userProfile.bio && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-bold text-black">About</h2>
//                   <Sparkles className="w-5 h-5 text-orange-500" />
//                 </div>
//                 <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap">
//                   {userProfile.bio}
//                 </p>
//               </div>
//             )}

//             {/* Experience Section */}
//             {userProfile.experience && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-bold text-black">Experience</h2>
//                   <Briefcase className="w-5 h-5 text-orange-500" />
//                 </div>
//                 <div className="text-neutral-600 leading-relaxed whitespace-pre-wrap">
//                   {userProfile.experience.split('\n').map((line, index) => (
//                     <p key={index} className="mb-3 text-justify">{line}</p>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Skills Full Section */}
//             {userProfile.skills && userProfile.skills.length > 0 && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-bold text-black">Skills & Expertise</h2>
//                   <Award className="w-5 h-5 text-orange-500" />
//                 </div>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                   {userProfile.skills.map((skill, index) => (
//                     <div key={index} className="flex items-center p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group">
//                       <Code className="w-4 h-4 mr-3 text-neutral-500" />
//                       <span className="font-medium text-black">{skill}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Projects Section */}
//             {userProfile.projects && userProfile.projects.length > 0 && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-bold text-black">Projects</h2>
//                   <BookOpen className="w-5 h-5 text-orange-500" />
//                 </div>
//                 <div className="space-y-4">
//                   {userProfile.projects.map((project, index) => (
//                     <div key={index} className="p-4 bg-gradient-to-r from-orange-50 to-orange-50/50 rounded-xl border border-orange-100 group hover:border-orange-200 transition-colors">
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center mb-2">
//                             <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
//                               <Star className="w-4 h-4 text-orange-600" />
//                             </div>
//                             <h3 className="font-bold text-black">Project {index + 1}</h3>
//                           </div>
//                           <p className="text-neutral-600 leading-relaxed">{project}</p>
//                         </div>
//                         <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-orange-600 transition-colors" />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Empty State for Missing Sections */}
//             {(!userProfile.bio && !userProfile.experience && !userProfile.skills?.length && !userProfile.projects?.length) && (
//               <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-neutral-200">
//                 <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <User className="w-8 h-8 text-orange-600" />
//                 </div>
//                 <h3 className="text-lg font-bold text-black mb-2">Profile in Progress</h3>
//                 <p className="text-neutral-500 max-w-md mx-auto">
//                   This user hasn't added much information yet. Connect with them to learn more about their professional background.
//                 </p>
//               </div>
//             )}

//             {/* View Profile Views (For Own Profile) */}
//             {isOwnProfile && (
//               <div className="bg-gradient-to-r from-orange-50 to-orange-50/50 rounded-2xl p-6 border border-orange-100">
//                 <div className="flex items-center mb-4">
//                   <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mr-4">
//                     <Eye className="w-5 h-5 text-orange-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-black">Profile Visibility</h3>
//                     <p className="text-sm text-neutral-600">Your profile is public on the network</p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-white rounded-xl p-4 text-center border border-neutral-200">
//                     <div className="text-2xl font-bold text-black">0</div>
//                     <div className="text-xs text-neutral-500">Profile Views</div>
//                   </div>
//                   <div className="bg-white rounded-xl p-4 text-center border border-neutral-200">
//                     <div className="text-2xl font-bold text-black">0</div>
//                     <div className="text-xs text-neutral-500">Connections</div>
//                   </div>
//                 </div>
//                 <button 
//                   onClick={() => router.push('/dashboard')}
//                   className="mt-4 w-full py-3 bg-white border-2 border-black text-black rounded-xl font-bold hover:bg-neutral-50 transition-colors"
//                 >
//                   Edit Profile
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// the main working ----------------------------------------------------------------------------

// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '@/lib/firebase';
// import { 
//   sendConnectionRequest, 
//   getConnectionStatus, 
//   Connection,
//   areUsersConnected  // Make sure this is imported
// } from '@/lib/connections';
// import { recordProfileView } from '@/lib/profileViews';
// import { 
//   ArrowLeft, Mail, MapPin, Briefcase, GraduationCap, 
//   Link as LinkIcon, Github, Linkedin, Globe, Calendar,
//   CheckCircle, Clock, Send, User, Award, BookOpen,
//   Building, Code, MessageSquare, ExternalLink, Star,
//   ChevronRight, Sparkles, Users, Eye
// } from 'lucide-react';

// interface UserProfile {
//   uid: string;
//   displayName: string | null;
//   email: string | null;
//   headline: string;
//   bio: string;
//   skills: string[];
//   location: string;
//   profileImage: string;
//   projects: string[];
//   education: string;
//   experience: string;
//   website: string;
//   github: string;
//   linkedin: string;
//   createdAt?: any;
// }

// // Helper function to generate consistent connection ID regardless of direction
// function getConnectionId(userId1: string, userId2: string): string {
//   // Sort IDs to ensure consistent connection ID regardless of direction
//   const [id1, id2] = [userId1, userId2].sort();
//   return `${id1}_${id2}`;
// }

// export default function UserProfile({ params }: { params: Promise<{ userId: string }> }) {
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [resolvedParams, setResolvedParams] = useState<{ userId: string } | null>(null);
//   const [connectionData, setConnectionData] = useState<Connection | null>(null);
//   const [connectionLoading, setConnectionLoading] = useState(true);
//   const [sendingRequest, setSendingRequest] = useState(false);
//   const [checkingConnection, setCheckingConnection] = useState(false);
//   const router = useRouter();
//   const [user] = useAuthState(auth);

//   // Resolve the params promise
//   useEffect(() => {
//     params.then(resolved => {
//       setResolvedParams(resolved);
//     });
//   }, [params]);

//   useEffect(() => {
//     if (resolvedParams) {
//       fetchUserProfile();
//     }
//   }, [resolvedParams]);

//   useEffect(() => {
//     if (resolvedParams && user) {
//       fetchConnectionStatus();
//     } else {
//       setConnectionLoading(false);
//     }
//   }, [resolvedParams, user]);

//   const fetchUserProfile = async () => {
//     if (!resolvedParams) return;
    
//     try {
//       const userDoc = await getDoc(doc(db, 'users', resolvedParams.userId));
      
//       if (userDoc.exists()) {
//         const profileData = {
//           uid: userDoc.id,
//           ...userDoc.data(),
//         } as UserProfile;
        
//         setUserProfile(profileData);
        
//         // Record profile view if user is logged in and not viewing their own profile
//         if (user && user.uid !== resolvedParams.userId) {
//           try {
//             await recordProfileView(resolvedParams.userId, user.uid);
//           } catch (viewError) {
//             console.error('Error recording profile view:', viewError);
//           }
//         }
//       } else {
//         setError('User not found');
//       }
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//       setError('Error loading profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // FIXED: Check connection status properly using multiple methods
//   const fetchConnectionStatus = async () => {
//     if (!user || !resolvedParams) return;
    
//     setConnectionLoading(true);
//     try {
//       console.log('Checking connection between:', user.uid, 'and', resolvedParams.userId);
      
//       // METHOD 1: Check if users are connected (accepted status)
//       const isConnected = await areUsersConnected(user.uid, resolvedParams.userId);
//       console.log('areUsersConnected result:', isConnected);
      
//       // METHOD 2: Get the actual connection document between users
//       const connectionId = getConnectionId(user.uid, resolvedParams.userId);
//       const connectionRef = doc(db, 'connections', connectionId);
//       const connectionSnap = await getDoc(connectionRef);
      
//       if (connectionSnap.exists()) {
//         const connectionData = { id: connectionSnap.id, ...connectionSnap.data() } as Connection;
//         console.log('Connection document found:', connectionData);
        
//         // If users are connected (accepted) OR connection status is accepted
//         if (isConnected || connectionData.status === 'accepted') {
//           // Show as connected
//           setConnectionData({
//             ...connectionData,
//             status: 'accepted' // Force accepted status if areUsersConnected says yes
//           });
//         } else {
//           // Show actual connection status (pending, rejected, etc.)
//           setConnectionData(connectionData);
//         }
//       } else {
//         console.log('No connection document found');
//         setConnectionData(null);
//       }
//     } catch (error) {
//       console.error('Error fetching connection status:', error);
//       setConnectionData(null);
//     } finally {
//       setConnectionLoading(false);
//     }
//   };

//   const handleConnect = async () => {
//     if (!user || !resolvedParams) return;
//     setSendingRequest(true);
//     try {
//       await sendConnectionRequest(user.uid, resolvedParams.userId);
//       await fetchConnectionStatus(); // Refresh connection status
//     } catch (error: any) {
//       console.error('Error sending connection request:', error);
//       alert(error.message || 'Failed to send connection request. Please try again.');
//     } finally {
//       setSendingRequest(false);
//     }
//   };

//   // FIXED: Proper connection check for messaging
//   const handleMessage = async () => {
//     if (!user || !resolvedParams) return;
    
//     setCheckingConnection(true);
    
//     try {
//       // Check if users are connected using the fixed function
//       const isConnected = await areUsersConnected(user.uid, resolvedParams.userId);
//       console.log('Are users connected?', isConnected);
      
//       if (!isConnected) {
//         // If not connected, show alert and suggest connecting first
//         const shouldConnect = window.confirm(
//           `You need to connect with ${userProfile?.displayName || 'this user'} before messaging. Would you like to send a connection request first?`
//         );
        
//         if (shouldConnect) {
//           // Send connection request
//           await handleConnect();
//         }
//         return; // Don't proceed to messaging
//       }
      
//       // If connected, navigate to messages
//       const sortedIds = [user.uid, resolvedParams.userId].sort();
//       const conversationId = `${sortedIds[0]}_${sortedIds[1]}`;
//       router.push(`/dashboard/messages/${conversationId}`);
      
//     } catch (error) {
//       console.error('Error checking connection for messaging:', error);
//       alert('Unable to start messaging. Please try again.');
//     } finally {
//       setCheckingConnection(false);
//     }
//   };

//   // Determine message button text and state based on connection status
//   const getMessageButtonState = () => {
//     if (!user || isOwnProfile) return null;
    
//     if (checkingConnection) {
//       return {
//         text: 'Checking...',
//         disabled: true,
//         icon: <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />,
//         onClick: () => {} // No action
//       };
//     }
    
//     // First check if we have connection data and it's accepted
//     if (connectionData?.status === 'accepted') {
//       return {
//         text: 'Message',
//         disabled: false,
//         icon: <MessageSquare className="w-5 h-5 mr-2" />,
//         onClick: handleMessage
//       };
//     }
    
//     // If no connection data, check directly if users are connected
//     if (!connectionData) {
//       // We need to check again
//       return {
//         text: 'Connect to Message',
//         disabled: false,
//         icon: <Users className="w-5 h-5 mr-2" />,
//         onClick: handleConnect
//       };
//     }
    
//     // If connection exists but not accepted
//     return {
//       text: connectionData.status === 'pending' ? 'Request Pending' : 'Connect to Message',
//       disabled: connectionData.status === 'pending',
//       icon: connectionData.status === 'pending' ? 
//         <Clock className="w-5 h-5 mr-2" /> : 
//         <Users className="w-5 h-5 mr-2" />,
//       onClick: connectionData.status === 'pending' ? () => {} : handleConnect
//     };
//   };

//   const formatDate = (timestamp: any) => {
//     if (!timestamp?.toDate) return 'Recently';
//     const date = timestamp.toDate();
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - date.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     if (diffDays < 30) return `${diffDays} days ago`;
//     return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <div className="w-16 h-16 border-4 border-neutral-200 border-t-orange-600 rounded-full animate-spin mx-auto"></div>
//           <p className="text-neutral-600 font-medium">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !userProfile) {
//     return (
//       <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
//         <div className="bg-white rounded-2xl p-8 text-center max-w-md shadow-sm border border-neutral-200">
//           <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <User className="w-8 h-8 text-orange-600" />
//           </div>
//           <h2 className="text-xl font-bold text-black mb-2">Profile Not Found</h2>
//           <p className="text-neutral-600 mb-6">{error || 'This user profile could not be loaded.'}</p>
//           <button 
//             onClick={() => router.push('/network')}
//             className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors"
//           >
//             Browse Network
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Check if the current user is viewing their own profile
//   const isOwnProfile = user && user.uid === resolvedParams?.userId;

//   const messageButtonState = getMessageButtonState();

//   return (
//     <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6">
//       <div className="max-w-6xl mx-auto">
        
//         {/* Navigation Header */}
//         <div className="mb-8">
//           <button 
//             onClick={() => router.back()}
//             className="group flex items-center text-sm font-bold text-neutral-500 hover:text-black transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
//             Back to Network
//           </button>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
          
//           {/* Left Column - Profile Card */}
//           <div className="lg:col-span-1 space-y-6">
            
//             {/* Profile Card */}
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//               <div className="text-center mb-6">
//                 {/* Profile Image */}
//                 <div className="relative mb-4">
//                   {userProfile.profileImage ? (
//                     <img 
//                       src={userProfile.profileImage} 
//                       alt={userProfile.displayName || 'User'} 
//                       className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
//                     />
//                   ) : (
//                     <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center border-4 border-white shadow-lg mx-auto">
//                       <span className="text-4xl font-bold text-orange-600">
//                         {userProfile.displayName?.[0]?.toUpperCase() || userProfile.email?.[0]?.toUpperCase() || 'U'}
//                       </span>
//                     </div>
//                   )}
//                   {/* Online Status */}
//                   <div className="absolute bottom-2 right-1/4 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//                 </div>

//                 {/* Name and Headline */}
//                 <h1 className="text-2xl font-black text-black mb-2">
//                   {userProfile.displayName || 'Anonymous User'}
//                 </h1>
//                 {userProfile.headline && (
//                   <p className="text-orange-600 font-medium mb-4">
//                     {userProfile.headline}
//                   </p>
//                 )}
//               </div>

//               {/* Stats */}
//               <div className="grid grid-cols-2 gap-3 mb-6">
//                 <div className="bg-neutral-50 rounded-xl p-3 text-center">
//                   <div className="text-2xl font-bold text-black">0</div>
//                   <div className="text-xs text-neutral-500">Connections</div>
//                 </div>
//                 <div className="bg-neutral-50 rounded-xl p-3 text-center">
//                   <div className="text-2xl font-bold text-black">{userProfile.projects?.length || 0}</div>
//                   <div className="text-xs text-neutral-500">Projects</div>
//                 </div>
//               </div>

//               {/* Contact Info */}
//               <div className="space-y-3 mb-6">
//                 {userProfile.location && (
//                   <div className="flex items-center text-sm text-neutral-600">
//                     <MapPin className="w-4 h-4 mr-3 text-neutral-400" />
//                     {userProfile.location}
//                   </div>
//                 )}
//                 {userProfile.email && (
//                   <div className="flex items-center text-sm text-neutral-600">
//                     <Mail className="w-4 h-4 mr-3 text-neutral-400" />
//                     <span className="truncate">{userProfile.email}</span>
//                   </div>
//                 )}
//                 {userProfile.education && (
//                   <div className="flex items-center text-sm text-neutral-600">
//                     <GraduationCap className="w-4 h-4 mr-3 text-neutral-400" />
//                     {userProfile.education}
//                   </div>
//                 )}
//                 {userProfile.createdAt && (
//                   <div className="flex items-center text-sm text-neutral-600">
//                     <Calendar className="w-4 h-4 mr-3 text-neutral-400" />
//                     Joined {formatDate(userProfile.createdAt)}
//                   </div>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               {user && !isOwnProfile && (
//                 <div className="space-y-3">
//                   {connectionLoading ? (
//                     <button disabled className="w-full py-3 bg-neutral-200 text-neutral-400 rounded-xl font-bold flex items-center justify-center">
//                       <div className="w-5 h-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin mr-2" />
//                       Loading...
//                     </button>
//                   ) : connectionData ? (
//                     <button disabled className="w-full py-3 bg-neutral-200 text-neutral-600 rounded-xl font-bold flex items-center justify-center">
//                       {connectionData.status === 'pending' ? (
//                         <>
//                           <Clock className="w-5 h-5 mr-2" />
//                           Request Pending
//                         </>
//                       ) : connectionData.status === 'accepted' ? (
//                         <>
//                           <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
//                           Connected
//                         </>
//                       ) : (
//                         'Rejected'
//                       )}
//                     </button>
//                   ) : (
//                     <button 
//                       onClick={handleConnect}
//                       disabled={sendingRequest}
//                       className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center disabled:bg-neutral-300 disabled:cursor-not-allowed"
//                     >
//                       {sendingRequest ? (
//                         <>
//                           <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//                           Sending...
//                         </>
//                       ) : (
//                         <>
//                           <Users className="w-5 h-5 mr-2" />
//                           Connect
//                         </>
//                       )}
//                     </button>
//                   )}
                  
//                   {/* Message Button with Proper Connection Check */}
//                   {messageButtonState && (
//                     <button 
//                       onClick={messageButtonState.onClick}
//                       disabled={messageButtonState.disabled}
//                       className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-colors ${
//                         connectionData?.status === 'accepted'
//                           ? 'bg-white border-2 border-black text-black hover:bg-neutral-50'
//                           : 'bg-orange-100 border-2 border-orange-300 text-orange-700 hover:bg-orange-200'
//                       } ${messageButtonState.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     >
//                       {messageButtonState.icon}
//                       {messageButtonState.text}
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Social Links */}
//             {(userProfile.website || userProfile.github || userProfile.linkedin) && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4">Connect</h3>
//                 <div className="space-y-3">
//                   {userProfile.website && (
//                     <a 
//                       href={userProfile.website} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group"
//                     >
//                       <div className="flex items-center">
//                         <Globe className="w-5 h-5 mr-3 text-neutral-500" />
//                         <span className="font-medium text-black">Website</span>
//                       </div>
//                       <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black" />
//                     </a>
//                   )}
//                   {userProfile.github && (
//                     <a 
//                       href={userProfile.github} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group"
//                     >
//                       <div className="flex items-center">
//                         <Github className="w-5 h-5 mr-3 text-neutral-500" />
//                         <span className="font-medium text-black">GitHub</span>
//                       </div>
//                       <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black" />
//                     </a>
//                   )}
//                   {userProfile.linkedin && (
//                     <a 
//                       href={userProfile.linkedin} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group"
//                     >
//                       <div className="flex items-center">
//                         <Linkedin className="w-5 h-5 mr-3 text-neutral-500" />
//                         <span className="font-medium text-black">LinkedIn</span>
//                       </div>
//                       <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black" />
//                     </a>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Skills Preview */}
//             {userProfile.skills && userProfile.skills.length > 0 && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4">Top Skills</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {userProfile.skills.slice(0, 6).map((skill, index) => (
//                     <span key={index} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium">
//                       {skill}
//                     </span>
//                   ))}
//                   {userProfile.skills.length > 6 && (
//                     <span className="px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-lg text-sm font-medium">
//                       +{userProfile.skills.length - 6} more
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Column - Main Content */}
//           <div className="lg:col-span-2 space-y-6">
            
//             {/* About Section */}
//             {userProfile.bio && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-bold text-black">About</h2>
//                   <Sparkles className="w-5 h-5 text-orange-500" />
//                 </div>
//                 <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap">
//                   {userProfile.bio}
//                 </p>
//               </div>
//             )}

//             {/* Experience Section */}
//             {userProfile.experience && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-bold text-black">Experience</h2>
//                   <Briefcase className="w-5 h-5 text-orange-500" />
//                 </div>
//                 <div className="text-neutral-600 leading-relaxed whitespace-pre-wrap">
//                   {userProfile.experience.split('\n').map((line, index) => (
//                     <p key={index} className="mb-3 text-justify">{line}</p>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Skills Full Section */}
//             {userProfile.skills && userProfile.skills.length > 0 && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-bold text-black">Skills & Expertise</h2>
//                   <Award className="w-5 h-5 text-orange-500" />
//                 </div>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                   {userProfile.skills.map((skill, index) => (
//                     <div key={index} className="flex items-center p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group">
//                       <Code className="w-4 h-4 mr-3 text-neutral-500" />
//                       <span className="font-medium text-black">{skill}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Projects Section */}
//             {userProfile.projects && userProfile.projects.length > 0 && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-bold text-black">Projects</h2>
//                   <BookOpen className="w-5 h-5 text-orange-500" />
//                 </div>
//                 <div className="space-y-4">
//                   {userProfile.projects.map((project, index) => (
//                     <div key={index} className="p-4 bg-gradient-to-r from-orange-50 to-orange-50/50 rounded-xl border border-orange-100 group hover:border-orange-200 transition-colors">
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center mb-2">
//                             <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
//                               <Star className="w-4 h-4 text-orange-600" />
//                             </div>
//                             <h3 className="font-bold text-black">Project {index + 1}</h3>
//                           </div>
//                           <p className="text-neutral-600 leading-relaxed">{project}</p>
//                         </div>
//                         <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-orange-600 transition-colors" />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Empty State for Missing Sections */}
//             {(!userProfile.bio && !userProfile.experience && !userProfile.skills?.length && !userProfile.projects?.length) && (
//               <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-neutral-200">
//                 <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <User className="w-8 h-8 text-orange-600" />
//                 </div>
//                 <h3 className="text-lg font-bold text-black mb-2">Profile in Progress</h3>
//                 <p className="text-neutral-500 max-w-md mx-auto">
//                   This user hasn't added much information yet. Connect with them to learn more about their professional background.
//                 </p>
//               </div>
//             )}

//             {/* View Profile Views (For Own Profile) */}
//             {isOwnProfile && (
//               <div className="bg-gradient-to-r from-orange-50 to-orange-50/50 rounded-2xl p-6 border border-orange-100">
//                 <div className="flex items-center mb-4">
//                   <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mr-4">
//                     <Eye className="w-5 h-5 text-orange-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-black">Profile Visibility</h3>
//                     <p className="text-sm text-neutral-600">Your profile is public on the network</p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-white rounded-xl p-4 text-center border border-neutral-200">
//                     <div className="text-2xl font-bold text-black">0</div>
//                     <div className="text-xs text-neutral-500">Profile Views</div>
//                   </div>
//                   <div className="bg-white rounded-xl p-4 text-center border border-neutral-200">
//                     <div className="text-2xl font-bold text-black">0</div>
//                     <div className="text-xs text-neutral-500">Connections</div>
//                   </div>
//                 </div>
//                 <button 
//                   onClick={() => router.push('/dashboard')}
//                   className="mt-4 w-full py-3 bg-white border-2 border-black text-black rounded-xl font-bold hover:bg-neutral-50 transition-colors"
//                 >
//                   Edit Profile
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '@/lib/firebase';
// import { 
//   sendConnectionRequest, 
//   getConnectionStatus, 
//   Connection,
//   areUsersConnected  // Make sure this is imported
// } from '@/lib/connections';
// import { recordProfileView } from '@/lib/profileViews';
// import { 
//   ArrowLeft, Mail, MapPin, Briefcase, GraduationCap, 
//   Link as LinkIcon, Github, Linkedin, Globe, Calendar,
//   CheckCircle, Clock, Send, User, Award, BookOpen,
//   Building, Code, MessageSquare, ExternalLink, Star,
//   ChevronRight, Sparkles, Users, Eye
// } from 'lucide-react';

// interface UserProfile {
//   uid: string;
//   displayName: string | null;
//   email: string | null;
//   headline: string;
//   bio: string;
//   skills: string[];
//   location: string;
//   profileImage: string;
//   projects: string[];
//   education: string;
//   experience: string;
//   website: string;
//   github: string;
//   linkedin: string;
//   createdAt?: any;
// }

// // Helper function to generate consistent connection ID regardless of direction
// function getConnectionId(userId1: string, userId2: string): string {
//   // Sort IDs to ensure consistent connection ID regardless of direction
//   const [id1, id2] = [userId1, userId2].sort();
//   return `${id1}_${id2}`;
// }

// export default function UserProfile({ params }: { params: Promise<{ userId: string }> }) {
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [resolvedParams, setResolvedParams] = useState<{ userId: string } | null>(null);
//   const [connectionData, setConnectionData] = useState<Connection | null>(null);
//   const [connectionLoading, setConnectionLoading] = useState(true);
//   const [sendingRequest, setSendingRequest] = useState(false);
//   const [checkingConnection, setCheckingConnection] = useState(false);
//   const router = useRouter();
//   const [user] = useAuthState(auth);

//   // Resolve the params promise
//   useEffect(() => {
//     params.then(resolved => {
//       setResolvedParams(resolved);
//     });
//   }, [params]);

//   useEffect(() => {
//     if (resolvedParams) {
//       fetchUserProfile();
//     }
//   }, [resolvedParams]);

//   useEffect(() => {
//     if (resolvedParams && user) {
//       fetchConnectionStatus();
//     } else {
//       setConnectionLoading(false);
//     }
//   }, [resolvedParams, user]);

//   const fetchUserProfile = async () => {
//     if (!resolvedParams) return;
    
//     try {
//       const userDoc = await getDoc(doc(db, 'users', resolvedParams.userId));
      
//       if (userDoc.exists()) {
//         const profileData = {
//           uid: userDoc.id,
//           ...userDoc.data(),
//         } as UserProfile;
        
//         setUserProfile(profileData);
        
//         // Record profile view if user is logged in and not viewing their own profile
//         if (user && user.uid !== resolvedParams.userId) {
//           try {
//             await recordProfileView(resolvedParams.userId, user.uid);
//           } catch (viewError) {
//             console.error('Error recording profile view:', viewError);
//           }
//         }
//       } else {
//         setError('User not found');
//       }
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//       setError('Error loading profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // FIXED: Check connection status properly using multiple methods
//   const fetchConnectionStatus = async () => {
//     if (!user || !resolvedParams) return;
    
//     setConnectionLoading(true);
//     try {
//       console.log('Checking connection between:', user.uid, 'and', resolvedParams.userId);
      
//       // METHOD 1: Check if users are connected (accepted status)
//       const isConnected = await areUsersConnected(user.uid, resolvedParams.userId);
//       console.log('areUsersConnected result:', isConnected);
      
//       // METHOD 2: Get the actual connection document between users
//       const connectionId = getConnectionId(user.uid, resolvedParams.userId);
//       const connectionRef = doc(db, 'connections', connectionId);
//       const connectionSnap = await getDoc(connectionRef);
      
//       if (connectionSnap.exists()) {
//         const connectionData = { id: connectionSnap.id, ...connectionSnap.data() } as Connection;
//         console.log('Connection document found:', connectionData);
        
//         // If users are connected (accepted) OR connection status is accepted
//         if (isConnected || connectionData.status === 'accepted') {
//           // Show as connected
//           setConnectionData({
//             ...connectionData,
//             status: 'accepted' // Force accepted status if areUsersConnected says yes
//           });
//         } else {
//           // Show actual connection status (pending, rejected, etc.)
//           setConnectionData(connectionData);
//         }
//       } else {
//         console.log('No connection document found');
//         setConnectionData(null);
//       }
//     } catch (error) {
//       console.error('Error fetching connection status:', error);
//       setConnectionData(null);
//     } finally {
//       setConnectionLoading(false);
//     }
//   };

//   const handleConnect = async () => {
//     if (!user || !resolvedParams) return;
//     setSendingRequest(true);
//     try {
//       await sendConnectionRequest(user.uid, resolvedParams.userId);
//       await fetchConnectionStatus(); // Refresh connection status
//     } catch (error: any) {
//       console.error('Error sending connection request:', error);
//       alert(error.message || 'Failed to send connection request. Please try again.');
//     } finally {
//       setSendingRequest(false);
//     }
//   };

//   // FIXED: Proper connection check for messaging
//   const handleMessage = async () => {
//     if (!user || !resolvedParams) return;
    
//     setCheckingConnection(true);
    
//     try {
//       // Check if users are connected using the fixed function
//       const isConnected = await areUsersConnected(user.uid, resolvedParams.userId);
//       console.log('Are users connected?', isConnected);
      
//       if (!isConnected) {
//         // If not connected, show alert and suggest connecting first
//         const shouldConnect = window.confirm(
//           `You need to connect with ${userProfile?.displayName || 'this user'} before messaging. Would you like to send a connection request first?`
//         );
        
//         if (shouldConnect) {
//           // Send connection request
//           await handleConnect();
//         }
//         return; // Don't proceed to messaging
//       }
      
//       // If connected, navigate to messages
//       const sortedIds = [user.uid, resolvedParams.userId].sort();
//       const conversationId = `${sortedIds[0]}_${sortedIds[1]}`;
//       router.push(`/dashboard/messages/${conversationId}`);
      
//     } catch (error) {
//       console.error('Error checking connection for messaging:', error);
//       alert('Unable to start messaging. Please try again.');
//     } finally {
//       setCheckingConnection(false);
//     }
//   };

//   // Determine message button text and state based on connection status
//   const getMessageButtonState = () => {
//     if (!user || isOwnProfile) return null;
    
//     if (checkingConnection) {
//       return {
//         text: 'Checking...',
//         disabled: true,
//         icon: <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />,
//         onClick: () => {} // No action
//       };
//     }
    
//     // First check if we have connection data and it's accepted
//     if (connectionData?.status === 'accepted') {
//       return {
//         text: 'Message',
//         disabled: false,
//         icon: <MessageSquare className="w-5 h-5 mr-2" />,
//         onClick: handleMessage
//       };
//     }
    
//     // If no connection data, check directly if users are connected
//     if (!connectionData) {
//       // We need to check again
//       return {
//         text: 'Connect to Message',
//         disabled: false,
//         icon: <Users className="w-5 h-5 mr-2" />,
//         onClick: handleConnect
//       };
//     }
    
//     // If connection exists but not accepted
//     return {
//       text: connectionData.status === 'pending' ? 'Request Pending' : 'Connect to Message',
//       disabled: connectionData.status === 'pending',
//       icon: connectionData.status === 'pending' ? 
//         <Clock className="w-5 h-5 mr-2" /> : 
//         <Users className="w-5 h-5 mr-2" />,
//       onClick: connectionData.status === 'pending' ? () => {} : handleConnect
//     };
//   };

//   const formatDate = (timestamp: any) => {
//     if (!timestamp?.toDate) return 'Recently';
//     const date = timestamp.toDate();
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - date.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     if (diffDays < 30) return `${diffDays} days ago`;
//     return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <div className="w-16 h-16 border-4 border-neutral-200 border-t-orange-600 rounded-full animate-spin mx-auto"></div>
//           <p className="text-neutral-600 font-medium">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !userProfile) {
//     return (
//       <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
//         <div className="bg-white rounded-2xl p-8 text-center max-w-md shadow-sm border border-neutral-200">
//           <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <User className="w-8 h-8 text-orange-600" />
//           </div>
//           <h2 className="text-xl font-bold text-black mb-2">Profile Not Found</h2>
//           <p className="text-neutral-600 mb-6">{error || 'This user profile could not be loaded.'}</p>
//           <button 
//             onClick={() => router.push('/network')}
//             className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors"
//           >
//             Browse Network
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Check if the current user is viewing their own profile
//   const isOwnProfile = user && user.uid === resolvedParams?.userId;

//   const messageButtonState = getMessageButtonState();

//   return (
//     <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6">
//       <div className="max-w-6xl mx-auto">
        
//         {/* Navigation Header */}
//         <div className="mb-8">
//           <button 
//             onClick={() => router.back()}
//             className="group flex items-center text-sm font-bold text-neutral-500 hover:text-black transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
//             Back to Network
//           </button>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
          
//           {/* Left Column - Profile Card */}
//           <div className="lg:col-span-1 space-y-6">
            
//             {/* Profile Card */}
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//               <div className="text-center mb-6">
//                 {/* Profile Image */}
//                 <div className="relative mb-4">
//                   {userProfile.profileImage ? (
//                     <img 
//                       src={userProfile.profileImage} 
//                       alt={userProfile.displayName || 'User'} 
//                       className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
//                     />
//                   ) : (
//                     <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center border-4 border-white shadow-lg mx-auto">
//                       <span className="text-4xl font-bold text-orange-600">
//                         {userProfile.displayName?.[0]?.toUpperCase() || userProfile.email?.[0]?.toUpperCase() || 'U'}
//                       </span>
//                     </div>
//                   )}
//                   {/* Online Status */}
//                   <div className="absolute bottom-2 right-1/4 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//                 </div>

//                 {/* Name and Headline */}
//                 <h1 className="text-2xl font-black text-black mb-2">
//                   {userProfile.displayName || 'Anonymous User'}
//                 </h1>
//                 {userProfile.headline && (
//                   <p className="text-orange-600 font-medium mb-4">
//                     {userProfile.headline}
//                   </p>
//                 )}
//               </div>

//               {/* Stats */}
//               <div className="grid grid-cols-2 gap-3 mb-6">
//                 <div className="bg-neutral-50 rounded-xl p-3 text-center">
//                   <div className="text-2xl font-bold text-black">0</div>
//                   <div className="text-xs text-neutral-500">Connections</div>
//                 </div>
//                 <div className="bg-neutral-50 rounded-xl p-3 text-center">
//                   <div className="text-2xl font-bold text-black">{userProfile.projects?.length || 0}</div>
//                   <div className="text-xs text-neutral-500">Projects</div>
//                 </div>
//               </div>

//               {/* Contact Info */}
//               <div className="space-y-3 mb-6">
//                 {userProfile.location && (
//                   <div className="flex items-center text-sm text-neutral-600">
//                     <MapPin className="w-4 h-4 mr-3 text-neutral-400" />
//                     {userProfile.location}
//                   </div>
//                 )}
//                 {isOwnProfile && userProfile.email && (
//                   <div className="flex items-center text-sm text-neutral-600">
//                     <Mail className="w-4 h-4 mr-3 text-neutral-400" />
//                     <span className="truncate">{userProfile.email}</span>
//                   </div>
//                 )}
//                 {userProfile.education && (
//                   <div className="flex items-center text-sm text-neutral-600">
//                     <GraduationCap className="w-4 h-4 mr-3 text-neutral-400" />
//                     {userProfile.education}
//                   </div>
//                 )}
//                 {userProfile.createdAt && (
//                   <div className="flex items-center text-sm text-neutral-600">
//                     <Calendar className="w-4 h-4 mr-3 text-neutral-400" />
//                     Joined {formatDate(userProfile.createdAt)}
//                   </div>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               {user && !isOwnProfile && (
//                 <div className="space-y-3">
//                   {connectionLoading ? (
//                     <button disabled className="w-full py-3 bg-neutral-200 text-neutral-400 rounded-xl font-bold flex items-center justify-center">
//                       <div className="w-5 h-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin mr-2" />
//                       Loading...
//                     </button>
//                   ) : connectionData ? (
//                     <button disabled className="w-full py-3 bg-neutral-200 text-neutral-600 rounded-xl font-bold flex items-center justify-center">
//                       {connectionData.status === 'pending' ? (
//                         <>
//                           <Clock className="w-5 h-5 mr-2" />
//                           Request Pending
//                         </>
//                       ) : connectionData.status === 'accepted' ? (
//                         <>
//                           <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
//                           Connected
//                         </>
//                       ) : (
//                         'Rejected'
//                       )}
//                     </button>
//                   ) : (
//                     <button 
//                       onClick={handleConnect}
//                       disabled={sendingRequest}
//                       className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center disabled:bg-neutral-300 disabled:cursor-not-allowed"
//                     >
//                       {sendingRequest ? (
//                         <>
//                           <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//                           Sending...
//                         </>
//                       ) : (
//                         <>
//                           <Users className="w-5 h-5 mr-2" />
//                           Connect
//                         </>
//                       )}
//                     </button>
//                   )}
                  
//                   {/* Message Button with Proper Connection Check */}
//                   {messageButtonState && (
//                     <button 
//                       onClick={messageButtonState.onClick}
//                       disabled={messageButtonState.disabled}
//                       className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-colors ${
//                         connectionData?.status === 'accepted'
//                           ? 'bg-white border-2 border-black text-black hover:bg-neutral-50'
//                           : 'bg-orange-100 border-2 border-orange-300 text-orange-700 hover:bg-orange-200'
//                       } ${messageButtonState.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     >
//                       {messageButtonState.icon}
//                       {messageButtonState.text}
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Social Links */}
//             {(userProfile.website || userProfile.github || userProfile.linkedin) && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4">Connect</h3>
//                 <div className="space-y-3">
//                   {userProfile.website && (
//                     <a 
//                       href={userProfile.website} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group"
//                     >
//                       <div className="flex items-center">
//                         <Globe className="w-5 h-5 mr-3 text-neutral-500" />
//                         <span className="font-medium text-black">Website</span>
//                       </div>
//                       <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black" />
//                     </a>
//                   )}
//                   {userProfile.github && (
//                     <a 
//                       href={userProfile.github} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group"
//                     >
//                       <div className="flex items-center">
//                         <Github className="w-5 h-5 mr-3 text-neutral-500" />
//                         <span className="font-medium text-black">GitHub</span>
//                       </div>
//                       <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black" />
//                     </a>
//                   )}
//                   {userProfile.linkedin && (
//                     <a 
//                       href={userProfile.linkedin} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group"
//                     >
//                       <div className="flex items-center">
//                         <Linkedin className="w-5 h-5 mr-3 text-neutral-500" />
//                         <span className="font-medium text-black">LinkedIn</span>
//                       </div>
//                       <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black" />
//                     </a>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Skills Preview */}
//             {userProfile.skills && userProfile.skills.length > 0 && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4">Top Skills</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {userProfile.skills.slice(0, 6).map((skill, index) => (
//                     <span key={index} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium">
//                       {skill}
//                     </span>
//                   ))}
//                   {userProfile.skills.length > 6 && (
//                     <span className="px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-lg text-sm font-medium">
//                       +{userProfile.skills.length - 6} more
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Column - Main Content */}
//           <div className="lg:col-span-2 space-y-6">
            
//             {/* About Section */}
//             {userProfile.bio && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-bold text-black">About</h2>
//                   <Sparkles className="w-5 h-5 text-orange-500" />
//                 </div>
//                 <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap">
//                   {userProfile.bio}
//                 </p>
//               </div>
//             )}

//             {/* Experience Section */}
//             {userProfile.experience && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-bold text-black">Experience</h2>
//                   <Briefcase className="w-5 h-5 text-orange-500" />
//                 </div>
//                 <div className="text-neutral-600 leading-relaxed whitespace-pre-wrap">
//                   {userProfile.experience.split('\n').map((line, index) => (
//                     <p key={index} className="mb-3 text-justify">{line}</p>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Skills Full Section */}
//             {userProfile.skills && userProfile.skills.length > 0 && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-bold text-black">Skills & Expertise</h2>
//                   <Award className="w-5 h-5 text-orange-500" />
//                 </div>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                   {userProfile.skills.map((skill, index) => (
//                     <div key={index} className="flex items-center p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group">
//                       <Code className="w-4 h-4 mr-3 text-neutral-500" />
//                       <span className="font-medium text-black">{skill}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Projects Section */}
//             {userProfile.projects && userProfile.projects.length > 0 && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-bold text-black">Projects</h2>
//                   <BookOpen className="w-5 h-5 text-orange-500" />
//                 </div>
//                 <div className="space-y-4">
//                   {userProfile.projects.map((project, index) => (
//                     <div key={index} className="p-4 bg-gradient-to-r from-orange-50 to-orange-50/50 rounded-xl border border-orange-100 group hover:border-orange-200 transition-colors">
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center mb-2">
//                             <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
//                               <Star className="w-4 h-4 text-orange-600" />
//                             </div>
//                             <h3 className="font-bold text-black">Project {index + 1}</h3>
//                           </div>
//                           <p className="text-neutral-600 leading-relaxed">{project}</p>
//                         </div>
//                         <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-orange-600 transition-colors" />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Empty State for Missing Sections */}
//             {(!userProfile.bio && !userProfile.experience && !userProfile.skills?.length && !userProfile.projects?.length) && (
//               <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-neutral-200">
//                 <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <User className="w-8 h-8 text-orange-600" />
//                 </div>
//                 <h3 className="text-lg font-bold text-black mb-2">Profile in Progress</h3>
//                 <p className="text-neutral-500 max-w-md mx-auto">
//                   This user hasn't added much information yet. Connect with them to learn more about their professional background.
//                 </p>
//               </div>
//             )}

//             {/* View Profile Views (For Own Profile) */}
//             {isOwnProfile && (
//               <div className="bg-gradient-to-r from-orange-50 to-orange-50/50 rounded-2xl p-6 border border-orange-100">
//                 <div className="flex items-center mb-4">
//                   <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mr-4">
//                     <Eye className="w-5 h-5 text-orange-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-black">Profile Visibility</h3>
//                     <p className="text-sm text-neutral-600">Your profile is public on the network</p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-white rounded-xl p-4 text-center border border-neutral-200">
//                     <div className="text-2xl font-bold text-black">0</div>
//                     <div className="text-xs text-neutral-500">Profile Views</div>
//                   </div>
//                   <div className="bg-white rounded-xl p-4 text-center border border-neutral-200">
//                     <div className="text-2xl font-bold text-black">0</div>
//                     <div className="text-xs text-neutral-500">Connections</div>
//                   </div>
//                 </div>
//                 <button 
//                   onClick={() => router.push('/dashboard')}
//                   className="mt-4 w-full py-3 bg-white border-2 border-black text-black rounded-xl font-bold hover:bg-neutral-50 transition-colors"
//                 >
//                   Edit Profile
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { 
  sendConnectionRequest,  
  Connection,
  areUsersConnected
} from '@/lib/connections';
import { recordProfileView } from '@/lib/profileViews';
import { useUserOnlineStatus } from '@/hooks/useOnlineStatus';
import { 
  ArrowLeft, Mail, MapPin, Briefcase, GraduationCap, 
  Link as LinkIcon, Github, Linkedin, Globe, Calendar,
  CheckCircle, Clock, Send, User, Award, BookOpen,
  Building, Code, MessageSquare, ExternalLink, Star,
  ChevronRight, Sparkles, Users, Eye
} from 'lucide-react';

interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  headline: string;
  bio: string;
  skills: string[];
  location: string;
  profileImage: string;
  projects: string[];
  education: string;
  experience: string;
  website: string;
  github: string;
  linkedin: string;
  createdAt?: any;
}

function getConnectionId(userId1: string, userId2: string): string {
  const [id1, id2] = [userId1, userId2].sort();
  return `${id1}_${id2}`;
}

export default function UserProfile({ params }: { params: Promise<{ userId: string }> }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{ userId: string } | null>(null);
  const [connectionData, setConnectionData] = useState<Connection | null>(null);
  const [connectionLoading, setConnectionLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(false);
  const router = useRouter();
  const [user] = useAuthState(auth);

  // Resolve the params promise
  useEffect(() => {
    params.then(resolved => {
      setResolvedParams(resolved);
    });
  }, [params]);

  useEffect(() => {
    if (resolvedParams) {
      fetchUserProfile();
    }
  }, [resolvedParams]);

  useEffect(() => {
    if (resolvedParams && user) {
      fetchConnectionStatus();
    } else {
      setConnectionLoading(false);
    }
  }, [resolvedParams, user]);

  // ========== HOOKS – ALL CALLED BEFORE EARLY RETURNS ==========
  // Get online status for the profile being viewed (pass null while still loading)
  const { isOnline, loading: statusLoading, lastSeenText } = useUserOnlineStatus(resolvedParams?.userId || null);
  // ==============================================================

  const fetchUserProfile = async () => {
    if (!resolvedParams) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', resolvedParams.userId));
      
      if (userDoc.exists()) {
        const profileData = {
          uid: userDoc.id,
          ...userDoc.data(),
        } as UserProfile;
        
        setUserProfile(profileData);
        
        if (user && user.uid !== resolvedParams.userId) {
          try {
            await recordProfileView(resolvedParams.userId, user.uid);
          } catch (viewError) {
            console.error('Error recording profile view:', viewError);
          }
        }
      } else {
        setError('User not found');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchConnectionStatus = async () => {
    if (!user || !resolvedParams) return;
    
    setConnectionLoading(true);
    try {
      const isConnected = await areUsersConnected(user.uid, resolvedParams.userId);
      
      const connectionId = getConnectionId(user.uid, resolvedParams.userId);
      const connectionRef = doc(db, 'connections', connectionId);
      const connectionSnap = await getDoc(connectionRef);
      
      if (connectionSnap.exists()) {
        const connectionData = { id: connectionSnap.id, ...connectionSnap.data() } as Connection;
        if (isConnected || connectionData.status === 'accepted') {
          setConnectionData({
            ...connectionData,
            status: 'accepted'
          });
        } else {
          setConnectionData(connectionData);
        }
      } else {
        setConnectionData(null);
      }
    } catch (error) {
      console.error('Error fetching connection status:', error);
      setConnectionData(null);
    } finally {
      setConnectionLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!user || !resolvedParams) return;
    setSendingRequest(true);
    try {
      await sendConnectionRequest(user.uid, resolvedParams.userId);
      await fetchConnectionStatus();
    } catch (error: any) {
      console.error('Error sending connection request:', error);
      alert(error.message || 'Failed to send connection request. Please try again.');
    } finally {
      setSendingRequest(false);
    }
  };

  const handleMessage = async () => {
    if (!user || !resolvedParams) return;
    
    setCheckingConnection(true);
    
    try {
      const isConnected = await areUsersConnected(user.uid, resolvedParams.userId);
      
      if (!isConnected) {
        const shouldConnect = window.confirm(
          `You need to connect with ${userProfile?.displayName || 'this user'} before messaging. Would you like to send a connection request first?`
        );
        if (shouldConnect) {
          await handleConnect();
        }
        return;
      }
      
      const sortedIds = [user.uid, resolvedParams.userId].sort();
      const conversationId = `${sortedIds[0]}_${sortedIds[1]}`;
      router.push(`/dashboard/messages/${conversationId}`);
    } catch (error) {
      console.error('Error checking connection for messaging:', error);
      alert('Unable to start messaging. Please try again.');
    } finally {
      setCheckingConnection(false);
    }
  };

  const getMessageButtonState = () => {
    if (!user || isOwnProfile) return null;
    
    if (checkingConnection) {
      return {
        text: 'Checking...',
        disabled: true,
        icon: <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />,
        onClick: () => {}
      };
    }
    
    if (connectionData?.status === 'accepted') {
      return {
        text: 'Message',
        disabled: false,
        icon: <MessageSquare className="w-5 h-5 mr-2" />,
        onClick: handleMessage
      };
    }
    
    if (!connectionData) {
      return {
        text: 'Connect to Message',
        disabled: false,
        icon: <Users className="w-5 h-5 mr-2" />,
        onClick: handleConnect
      };
    }
    
    return {
      text: connectionData.status === 'pending' ? 'Request Pending' : 'Connect to Message',
      disabled: connectionData.status === 'pending',
      icon: connectionData.status === 'pending' ? 
        <Clock className="w-5 h-5 mr-2" /> : 
        <Users className="w-5 h-5 mr-2" />,
      onClick: connectionData.status === 'pending' ? () => {} : handleConnect
    };
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.toDate) return 'Recently';
    const date = timestamp.toDate();
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 30) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Now it's safe to have early returns because all hooks have been called
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-neutral-200 border-t-orange-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-neutral-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md shadow-sm border border-neutral-200">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-black mb-2">Profile Not Found</h2>
          <p className="text-neutral-600 mb-6">{error || 'This user profile could not be loaded.'}</p>
          <button 
            onClick={() => router.push('/network')}
            className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors"
          >
            Browse Network
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = user && user.uid === resolvedParams?.userId;
  const messageButtonState = getMessageButtonState();

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="group flex items-center text-sm font-bold text-neutral-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Network
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
              <div className="text-center mb-6">
                {/* Profile Image */}
                <div className="relative mb-4">
                  {userProfile.profileImage ? (
                    <img 
                      src={userProfile.profileImage} 
                      alt={userProfile.displayName || 'User'} 
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center border-4 border-white shadow-lg mx-auto">
                      <span className="text-4xl font-bold text-orange-600">
                        {userProfile.displayName?.[0]?.toUpperCase() || userProfile.email?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  {/* Dynamic Online Status */}
                  {!statusLoading && (
                    <div 
                      className={`absolute bottom-2 right-1/4 w-4 h-4 rounded-full border-2 border-white ${
                        isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                      title={isOnline ? "Online now" : lastSeenText}
                    />
                  )}
                </div>

                {/* Name and Headline */}
                <h1 className="text-2xl font-black text-black mb-2">
                  {userProfile.displayName || 'Anonymous User'}
                </h1>
                {userProfile.headline && (
                  <p className="text-orange-600 font-medium mb-4">
                    {userProfile.headline}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-neutral-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-black">0</div>
                  <div className="text-xs text-neutral-500">Connections</div>
                </div>
                <div className="bg-neutral-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-black">{userProfile.projects?.length || 0}</div>
                  <div className="text-xs text-neutral-500">Projects</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                {userProfile.location && (
                  <div className="flex items-center text-sm text-neutral-600">
                    <MapPin className="w-4 h-4 mr-3 text-neutral-400" />
                    {userProfile.location}
                  </div>
                )}
                {isOwnProfile && userProfile.email && (
                  <div className="flex items-center text-sm text-neutral-600">
                    <Mail className="w-4 h-4 mr-3 text-neutral-400" />
                    <span className="truncate">{userProfile.email}</span>
                  </div>
                )}
                {userProfile.education && (
                  <div className="flex items-center text-sm text-neutral-600">
                    <GraduationCap className="w-4 h-4 mr-3 text-neutral-400" />
                    {userProfile.education}
                  </div>
                )}
                {userProfile.createdAt && (
                  <div className="flex items-center text-sm text-neutral-600">
                    <Calendar className="w-4 h-4 mr-3 text-neutral-400" />
                    Joined {formatDate(userProfile.createdAt)}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {user && !isOwnProfile && (
                <div className="space-y-3">
                  {connectionLoading ? (
                    <button disabled className="w-full py-3 bg-neutral-200 text-neutral-400 rounded-xl font-bold flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin mr-2" />
                      Loading...
                    </button>
                  ) : connectionData ? (
                    <button disabled className="w-full py-3 bg-neutral-200 text-neutral-600 rounded-xl font-bold flex items-center justify-center">
                      {connectionData.status === 'pending' ? (
                        <>
                          <Clock className="w-5 h-5 mr-2" />
                          Request Pending
                        </>
                      ) : connectionData.status === 'accepted' ? (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                          Connected
                        </>
                      ) : (
                        'Rejected'
                      )}
                    </button>
                  ) : (
                    <button 
                      onClick={handleConnect}
                      disabled={sendingRequest}
                      className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center disabled:bg-neutral-300 disabled:cursor-not-allowed"
                    >
                      {sendingRequest ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Users className="w-5 h-5 mr-2" />
                          Connect
                        </>
                      )}
                    </button>
                  )}
                  
                  {/* Message Button with Proper Connection Check */}
                  {messageButtonState && (
                    <button 
                      onClick={messageButtonState.onClick}
                      disabled={messageButtonState.disabled}
                      className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-colors ${
                        connectionData?.status === 'accepted'
                          ? 'bg-white border-2 border-black text-black hover:bg-neutral-50'
                          : 'bg-orange-100 border-2 border-orange-300 text-orange-700 hover:bg-orange-200'
                      } ${messageButtonState.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {messageButtonState.icon}
                      {messageButtonState.text}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Social Links */}
            {(userProfile.website || userProfile.github || userProfile.linkedin) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4">Connect</h3>
                <div className="space-y-3">
                  {userProfile.website && (
                    <a 
                      href={userProfile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center">
                        <Globe className="w-5 h-5 mr-3 text-neutral-500" />
                        <span className="font-medium text-black">Website</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black" />
                    </a>
                  )}
                  {userProfile.github && (
                    <a 
                      href={userProfile.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center">
                        <Github className="w-5 h-5 mr-3 text-neutral-500" />
                        <span className="font-medium text-black">GitHub</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black" />
                    </a>
                  )}
                  {userProfile.linkedin && (
                    <a 
                      href={userProfile.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center">
                        <Linkedin className="w-5 h-5 mr-3 text-neutral-500" />
                        <span className="font-medium text-black">LinkedIn</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Skills Preview */}
            {userProfile.skills && userProfile.skills.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4">Top Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills.slice(0, 6).map((skill, index) => (
                    <span key={index} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                  {userProfile.skills.length > 6 && (
                    <span className="px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-lg text-sm font-medium">
                      +{userProfile.skills.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* About Section */}
            {userProfile.bio && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-black">About</h2>
                  <Sparkles className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap">
                  {userProfile.bio}
                </p>
              </div>
            )}

            {/* Experience Section */}
            {userProfile.experience && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-black">Experience</h2>
                  <Briefcase className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-neutral-600 leading-relaxed whitespace-pre-wrap">
                  {userProfile.experience.split('\n').map((line, index) => (
                    <p key={index} className="mb-3 text-justify">{line}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Full Section */}
            {userProfile.skills && userProfile.skills.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-black">Skills & Expertise</h2>
                  <Award className="w-5 h-5 text-orange-500" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {userProfile.skills.map((skill, index) => (
                    <div key={index} className="flex items-center p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group">
                      <Code className="w-4 h-4 mr-3 text-neutral-500" />
                      <span className="font-medium text-black">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {userProfile.projects && userProfile.projects.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-black">Projects</h2>
                  <BookOpen className="w-5 h-5 text-orange-500" />
                </div>
                <div className="space-y-4">
                  {userProfile.projects.map((project, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-orange-50 to-orange-50/50 rounded-xl border border-orange-100 group hover:border-orange-200 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
                              <Star className="w-4 h-4 text-orange-600" />
                            </div>
                            <h3 className="font-bold text-black">Project {index + 1}</h3>
                          </div>
                          <p className="text-neutral-600 leading-relaxed">{project}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-orange-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State for Missing Sections */}
            {(!userProfile.bio && !userProfile.experience && !userProfile.skills?.length && !userProfile.projects?.length) && (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-neutral-200">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">Profile in Progress</h3>
                <p className="text-neutral-500 max-w-md mx-auto">
                  This user hasn't added much information yet. Connect with them to learn more about their professional background.
                </p>
              </div>
            )}

            {/* View Profile Views (For Own Profile) */}
            {isOwnProfile && (
              <div className="bg-gradient-to-r from-orange-50 to-orange-50/50 rounded-2xl p-6 border border-orange-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mr-4">
                    <Eye className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black">Profile Visibility</h3>
                    <p className="text-sm text-neutral-600">Your profile is public on the network</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 text-center border border-neutral-200">
                    <div className="text-2xl font-bold text-black">0</div>
                    <div className="text-xs text-neutral-500">Profile Views</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center border border-neutral-200">
                    <div className="text-2xl font-bold text-black">0</div>
                    <div className="text-xs text-neutral-500">Connections</div>
                  </div>
                </div>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="mt-4 w-full py-3 bg-white border-2 border-black text-black rounded-xl font-bold hover:bg-neutral-50 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}