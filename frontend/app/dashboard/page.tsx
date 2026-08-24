// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { signOut } from 'firebase/auth';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import NotificationsDropdown from '@/components/NotificationsDropdown';
// import TestMessageButton from '@/components/TestMessageButton';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';

// // Dashboard Content Component
// function DashboardContent() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [userJobs, setUserJobs] = useState<any[]>([]);
//   const [loadingJobs, setLoadingJobs] = useState(true);

//   // Fetch user's jobs
//   useEffect(() => {
//     async function fetchUserJobs() {
//       if (user) {
//         try {
//           const jobsRef = collection(db, 'jobs');
//           const q = query(jobsRef, where('postedBy', '==', user.uid));
//           const querySnapshot = await getDocs(q);
          
//           const jobs: any[] = [];
//           querySnapshot.forEach((doc) => {
//             jobs.push({ id: doc.id, ...doc.data() });
//           });
          
//           setUserJobs(jobs);
//         } catch (error) {
//           console.error('Error fetching user jobs:', error);
//           throw new Error('Failed to load your job data');
//         } finally {
//           setLoadingJobs(false);
//         }
//       }
//     }

//     if (user) {
//       fetchUserJobs();
//     }
//   }, [user]);

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/login');
//     }
//   }, [user, loading]);

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       router.push('/');
//     } catch (error) {
//       console.error('Error signing out:', error);
//       throw new Error('Failed to sign out');
//     }
//   };

//   if (loading || loadingJobs) return (
//     <div className="min-h-screen bg-white flex items-center justify-center">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
//         <p className="mt-4 text-black">Loading your dashboard...</p>
//       </div>
//     </div>
//   );
  
//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header with Notifications */}
//       <header className="bg-white border-b border-orange-200 p-4">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div className="flex items-center">
//             <h1 className="text-2xl font-bold text-black">ALL Dashboard</h1>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             {/* Notifications Dropdown */}
//             <NotificationsDropdown />
            
//             {/* User Profile */}
//             <div className="flex items-center">
//               {user.photoURL && (
//                 <img 
//                   src={user.photoURL} 
//                   alt="Profile" 
//                   className="w-8 h-8 rounded-full mr-2 border border-orange-500" 
//                 />
//               )}
//               <span className="text-black text-sm">{user.displayName}</span>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="p-6">
//         <div className="max-w-4xl mx-auto">
//           {/* Welcome Section */}
//           <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-orange-200">
//             <h1 className="text-3xl font-bold text-black mb-2">
//               Welcome back, {user.displayName}! 👋
//             </h1>
//             <p className="text-black">Manage your professional journey on ALL Platform</p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Profile Info Card */}
//             <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//               <h2 className="text-xl font-semibold text-black mb-4 border-b border-orange-200 pb-2">
//                 Your Profile
//               </h2>
//               <div className="flex items-center mb-4">
//                 {user.photoURL && (
//                   <img 
//                     src={user.photoURL} 
//                     alt="Profile" 
//                     className="w-16 h-16 rounded-full mr-4 border-2 border-orange-500" 
//                   />
//                 )}
//                 <div>
//                   <p className="text-black font-medium">{user.displayName}</p>
//                   <p className="text-black text-sm">{user.email}</p>
//                 </div>
//               </div>
//               <div className="bg-orange-100 rounded-lg p-3 mt-4">
//                 <p className="text-xs text-black">
//                   <span className="font-medium">User ID:</span> {user.uid.substring(0, 10)}...
//                 </p>
//               </div>
//             </div>

//             {/* Quick Actions Card */}
//             <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//               <h2 className="text-xl font-semibold text-black mb-4 border-b border-orange-200 pb-2">
//                 Quick Actions
//               </h2>
//               <div className="grid grid-cols-1 gap-3">
//                 <button 
//                   onClick={() => router.push('/dashboard/edit-profile')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">✏️</span>
//                   <span>Edit Profile</span>
//                 </button>

//                 <button 
//                   onClick={() => router.push('/dashboard/post-job')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">📝</span>
//                   <span>Post Job</span>
//                 </button>

//                 {userJobs.length > 0 && (
//                   <button 
//                     onClick={() => router.push('/dashboard/company')}
//                     className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                   >
//                     <span className="mr-2">🏢</span>
//                     <span>Company Dashboard</span>
//                   </button>
//                 )}

//                 <button 
//                   onClick={() => router.push('/dashboard/applications')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">📋</span>
//                   <span>My Applications</span>
//                 </button>

//                 <button 
//                   onClick={() => router.push('/jobs')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">🔍</span>
//                   <span>Browse Jobs</span>
//                 </button>

//                 {/* New Browse Network Button */}
//                 <button 
//                   onClick={() => router.push('/network')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">🌐</span>
//                   <span>Browse Network</span>
//                 </button>

//                 {/* New Messages Button */}
//                 <button 
//                   onClick={() => router.push('/dashboard/messages')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">💬</span>
//                   <span>Messages</span>
//                 </button>

//                 {/* Test Message Button (Temporary) */}
//                 <TestMessageButton />
                
//                 <button 
//                   onClick={handleSignOut}
//                   className="flex items-center px-4 py-3 bg-orange-500 text-white border border-orange-500 rounded-xl hover:bg-orange-600 transition-all duration-200 mt-2"
//                 >
//                   <span className="mr-2">🚪</span>
//                   <span>Sign Out</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* For Employers Section */}
//           {userJobs.length === 0 && (
//             <div className="bg-white rounded-2xl p-6 mt-6 shadow-lg border border-orange-200">
//               <div className="text-center">
//                 <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500">
//                   <span className="text-2xl">🏢</span>
//                 </div>
//                 <h3 className="text-xl font-semibold text-black mb-2">For Employers and Businesses</h3>
//                 <p className="text-black mb-4">
//                   <strong>Post your first job to unlock the Company Dashboard!</strong>
//                 </p>
                
//                 <div className="bg-orange-100 rounded-xl p-4 mb-5 text-left border border-orange-200">
//                   <p className="text-black font-medium mb-2">With the Company Dashboard, you can:</p>
//                   <ul className="text-black list-disc list-inside space-y-1 text-sm">
//                     <li>View analytics on your job posts</li>
//                     <li>Manage applications received</li>
//                     <li>Track candidate pipelines</li>
//                     <li>Manage multiple job postings</li>
//                   </ul>
//                 </div>
                
//                 <button 
//                   onClick={() => router.push('/dashboard/post-job')}
//                   className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-all duration-200"
//                 >
//                   🚀 Post Your First Job
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Main Dashboard Component with Error Boundary
// export default function Dashboard() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Dashboard failed to load">
//       <DashboardContent />
//     </ClientErrorBoundary>
//   );
// }



// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { signOut } from 'firebase/auth';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import NotificationsDropdown from '@/components/NotificationsDropdown';
// import TestMessageButton from '@/components/TestMessageButton';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';
// import { getProfileViewsCount } from '@/lib/profileViews';

// // Dashboard Content Component
// function DashboardContent() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [userJobs, setUserJobs] = useState<any[]>([]);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [profileViewsCount, setProfileViewsCount] = useState(0);
//   const [loadingViews, setLoadingViews] = useState(true);
//   const [isClient, setIsClient] = useState(false);

//   // Set client-side flag to prevent hydration mismatches
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   // Fetch user's jobs and profile views count
//   useEffect(() => {
//     async function fetchUserData() {
//       if (user) {
//         try {
//           // Fetch user's jobs
//           const jobsRef = collection(db, 'jobs');
//           const q = query(jobsRef, where('postedBy', '==', user.uid));
//           const querySnapshot = await getDocs(q);
          
//           const jobs: any[] = [];
//           querySnapshot.forEach((doc) => {
//             jobs.push({ id: doc.id, ...doc.data() });
//           });
          
//           setUserJobs(jobs);

//           // Fetch profile views count
//           const viewsCount = await getProfileViewsCount(user.uid);
//           setProfileViewsCount(viewsCount);
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         } finally {
//           setLoadingJobs(false);
//           setLoadingViews(false);
//         }
//       }
//     }

//     if (user) {
//       fetchUserData();
//     }
//   }, [user]);

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/login');
//     }
//   }, [user, loading]);

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       router.push('/');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   // Show loading state
//   if (loading || loadingJobs) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }
  
//   if (!user) return null;

//   // Don't render the main content until we're on the client to avoid hydration mismatches
//   if (!isClient) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Mobile-Optimized Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//         <div className="px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo/Brand */}
//             <div className="flex items-center">
//               <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
//                 <span className="text-white font-bold text-sm">A</span>
//               </div>
//               <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Dashboard</h1>
//             </div>
            
//             {/* Right side - Notifications & User */}
//             <div className="flex items-center space-x-3">
//               <NotificationsDropdown />
              
//               {/* Mobile User Menu */}
//               <div className="flex items-center space-x-2">
//                 {user.photoURL ? (
//                   <img 
//                     src={user.photoURL} 
//                     alt="Profile" 
//                     className="w-8 h-8 rounded-full border border-orange-300"
//                   />
//                 ) : (
//                   <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
//                     <span className="text-white text-sm font-medium">
//                       {user.displayName?.charAt(0).toUpperCase()}
//                     </span>
//                   </div>
//                 )}
//                 <span className="text-gray-700 text-sm hidden sm:block max-w-24 truncate">
//                   {user.displayName?.split(' ')[0]}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="px-4 sm:px-6 lg:px-8 py-6">
//         <div className="max-w-6xl mx-auto">
//           {/* Welcome Section - Mobile Optimized */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
//             <div className="flex items-start justify-between">
//               <div className="flex-1">
//                 <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
//                   Welcome back, {user.displayName?.split(' ')[0]}! 👋
//                 </h1>
//                 <p className="text-gray-600 text-sm sm:text-base">
//                   Manage your professional journey
//                 </p>
//               </div>
//               {/* Mobile Stats */}
//               <div className="hidden sm:flex items-center space-x-2 bg-orange-50 rounded-full px-3 py-1">
//                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                 <span className="text-orange-700 text-sm font-medium">Online</span>
//               </div>
//             </div>
//           </div>

//           {/* Quick Stats Row - Mobile Horizontal Scroll */}
//           <div className="flex space-x-4 mb-6 overflow-x-auto pb-2 -mx-2 px-2">
//             {/* Jobs Posted */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 min-w-[140px] flex-shrink-0">
//               <div className="text-2xl font-bold text-orange-600 text-center">{userJobs.length}</div>
//               <div className="text-gray-600 text-sm text-center mt-1">Jobs Posted</div>
//             </div>
            
//             {/* Profile Views */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 min-w-[140px] flex-shrink-0">
//               <div className="text-2xl font-bold text-orange-600 text-center">
//                 {loadingViews ? '...' : profileViewsCount}
//               </div>
//               <div className="text-gray-600 text-sm text-center mt-1">Profile Views</div>
//             </div>
            
//             {/* Connections */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 min-w-[140px] flex-shrink-0">
//               <div className="text-2xl font-bold text-orange-600 text-center">0</div>
//               <div className="text-gray-600 text-sm text-center mt-1">Connections</div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//             {/* Profile Card - Mobile Optimized */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold text-gray-900">Your Profile</h2>
//                 <button 
//                   onClick={() => router.push('/dashboard/edit-profile')}
//                   className="text-orange-600 hover:text-orange-700 text-sm font-medium"
//                 >
//                   Edit
//                 </button>
//               </div>
              
//               <div className="flex items-center space-x-4 mb-4">
//                 {user.photoURL ? (
//                   <img 
//                     src={user.photoURL} 
//                     alt="Profile" 
//                     className="w-16 h-16 rounded-full border-2 border-orange-300"
//                   />
//                 ) : (
//                   <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center border-2 border-orange-300">
//                     <span className="text-white text-xl font-bold">
//                       {user.displayName?.charAt(0).toUpperCase()}
//                     </span>
//                   </div>
//                 )}
//                 <div className="flex-1 min-w-0">
//                   <h3 className="font-semibold text-gray-900 truncate">{user.displayName}</h3>
//                   <p className="text-gray-600 text-sm truncate">{user.email}</p>
//                   <div className="flex items-center mt-1">
//                     <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
//                     <span className="text-gray-500 text-xs">Active now</span>
//                   </div>
//                 </div>
//               </div>

//               {/* User ID - Hidden on mobile, shown on desktop */}
//               <div className="bg-gray-50 rounded-lg p-3 mt-4 hidden sm:block">
//                 <p className="text-gray-600 text-xs">
//                   <span className="font-medium">User ID:</span> {user.uid.substring(0, 10)}...
//                 </p>
//               </div>
//             </div>

//             {/* Quick Actions - Mobile Grid */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              
//               {/* Mobile Grid - 2 columns on mobile, 1 column on larger screens */}
//               <div className="grid grid-cols-2 sm:grid-cols-1 gap-3">
//                 {/* Row 1 */}
//                 <button 
//                   onClick={() => router.push('/jobs')}
//                   className="flex flex-col items-center justify-center p-4 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors group"
//                 >
//                   <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white text-lg mb-2 group-hover:scale-110 transition-transform">
//                     🔍
//                   </div>
//                   <span className="text-gray-700 text-sm font-medium text-center">Browse Jobs</span>
//                 </button>

//                 <button 
//                   onClick={() => router.push('/network')}
//                   className="flex flex-col items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors group"
//                 >
//                   <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-lg mb-2 group-hover:scale-110 transition-transform">
//                     🌐
//                   </div>
//                   <span className="text-gray-700 text-sm font-medium text-center">Network</span>
//                 </button>

//                 {/* Row 2 */}
//                 <button 
//                   onClick={() => router.push('/dashboard/messages')}
//                   className="flex flex-col items-center justify-center p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors group"
//                 >
//                   <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white text-lg mb-2 group-hover:scale-110 transition-transform">
//                     💬
//                   </div>
//                   <span className="text-gray-700 text-sm font-medium text-center">Messages</span>
//                 </button>

//                 <button 
//                   onClick={() => router.push('/dashboard/applications')}
//                   className="flex flex-col items-center justify-center p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors group"
//                 >
//                   <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white text-lg mb-2 group-hover:scale-110 transition-transform">
//                     📋
//                   </div>
//                   <span className="text-gray-700 text-sm font-medium text-center">Applications</span>
//                 </button>

//                 {/* Row 3 - Conditional buttons */}
//                 {userJobs.length > 0 ? (
//                   <>
//                     <button 
//                       onClick={() => router.push('/dashboard/company')}
//                       className="flex flex-col items-center justify-center p-4 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors group"
//                     >
//                       <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-lg mb-2 group-hover:scale-110 transition-transform">
//                         🏢
//                       </div>
//                       <span className="text-gray-700 text-sm font-medium text-center">Company</span>
//                     </button>
//                   </>
//                 ) : (
//                   <button 
//                     onClick={() => router.push('/dashboard/post-job')}
//                     className="flex flex-col items-center justify-center p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors group"
//                   >
//                     <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white text-lg mb-2 group-hover:scale-110 transition-transform">
//                       📝
//                     </div>
//                     <span className="text-gray-700 text-sm font-medium text-center">Post Job</span>
//                   </button>
//                 )}

//                 <button 
//                   onClick={() => router.push('/dashboard/profile-views')}
//                   className="flex flex-col items-center justify-center p-4 bg-yellow-50 border border-yellow-200 rounded-xl hover:bg-yellow-100 transition-colors group relative"
//                 >
//                   <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white text-lg mb-2 group-hover:scale-110 transition-transform">
//                     👁️
//                   </div>
//                   <span className="text-gray-700 text-sm font-medium text-center">Profile Views</span>
//                   {!loadingViews && profileViewsCount > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                       {profileViewsCount}
//                     </span>
//                   )}
//                 </button>

//                 {/* Row 4 - Full width on mobile */}
//                 <div className="col-span-2 sm:col-span-1 space-y-3 mt-2">
//                   <TestMessageButton />
                  
//                   <button 
//                     onClick={handleSignOut}
//                     className="w-full flex items-center justify-center p-3 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 transition-colors group"
//                   >
//                     <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center text-white text-sm mr-3 group-hover:scale-110 transition-transform">
//                       🚪
//                     </div>
//                     <span className="text-gray-700 font-medium">Sign Out</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* For Employers Section - Mobile Optimized */}
//           {userJobs.length === 0 && (
//             <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-sm mt-6 p-6 text-white">
//               <div className="flex items-start space-x-4">
//                 <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
//                   <span className="text-xl">🏢</span>
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="font-bold text-lg mb-2">Ready to Hire?</h3>
//                   <p className="text-orange-100 text-sm mb-4">
//                     Post your first job and unlock powerful hiring tools
//                   </p>
//                   <button 
//                     onClick={() => router.push('/dashboard/post-job')}
//                     className="bg-white text-orange-600 rounded-lg px-4 py-2 font-semibold text-sm hover:bg-orange-50 transition-colors"
//                   >
//                     🚀 Post Your First Job
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Bottom Navigation for Mobile */}
//           <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:hidden z-50">
//             <div className="grid grid-cols-4 gap-2">
//               <button 
//                 onClick={() => router.push('/jobs')}
//                 className="flex flex-col items-center p-2 text-gray-600 hover:text-orange-600 transition-colors"
//               >
//                 <div className="text-lg">🔍</div>
//                 <span className="text-xs mt-1">Jobs</span>
//               </button>
              
//               <button 
//                 onClick={() => router.push('/network')}
//                 className="flex flex-col items-center p-2 text-gray-600 hover:text-orange-600 transition-colors"
//               >
//                 <div className="text-lg">🌐</div>
//                 <span className="text-xs mt-1">Network</span>
//               </button>
              
//               <button 
//                 onClick={() => router.push('/dashboard/messages')}
//                 className="flex flex-col items-center p-2 text-gray-600 hover:text-orange-600 transition-colors"
//               >
//                 <div className="text-lg">💬</div>
//                 <span className="text-xs mt-1">Messages</span>
//               </button>
              
//               <button 
//                 onClick={() => router.push('/dashboard')}
//                 className="flex flex-col items-center p-2 text-orange-600"
//               >
//                 <div className="text-lg">🏠</div>
//                 <span className="text-xs mt-1">Home</span>
//               </button>
//             </div>
//           </div>

//           {/* Add padding at bottom for mobile nav */}
//           <div className="h-16 sm:h-0"></div>
//         </div>
//       </main>
//     </div>
//   );
// }

// // Main Dashboard Component with Error Boundary
// export default function Dashboard() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Dashboard failed to load">
//       <DashboardContent />
//     </ClientErrorBoundary>
//   );
// }

// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { signOut } from 'firebase/auth';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import NotificationsDropdown from '@/components/NotificationsDropdown';
// import TestMessageButton from '@/components/TestMessageButton';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';
// import { getProfileViewsCount } from '@/lib/profileViews'; // Import the profile views count function

// // Dashboard Content Component
// function DashboardContent() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [userJobs, setUserJobs] = useState<any[]>([]);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [profileViewsCount, setProfileViewsCount] = useState(0);
//   const [loadingViews, setLoadingViews] = useState(true);

//   // Fetch user's jobs and profile views count
//   useEffect(() => {
//     async function fetchUserData() {
//       if (user) {
//         try {
//           // Fetch user's jobs
//           const jobsRef = collection(db, 'jobs');
//           const q = query(jobsRef, where('postedBy', '==', user.uid));
//           const querySnapshot = await getDocs(q);
          
//           const jobs: any[] = [];
//           querySnapshot.forEach((doc) => {
//             jobs.push({ id: doc.id, ...doc.data() });
//           });
          
//           setUserJobs(jobs);

//           // Fetch profile views count
//           const viewsCount = await getProfileViewsCount(user.uid);
//           setProfileViewsCount(viewsCount);
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         } finally {
//           setLoadingJobs(false);
//           setLoadingViews(false);
//         }
//       }
//     }

//     if (user) {
//       fetchUserData();
//     }
//   }, [user]);

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/login');
//     }
//   }, [user, loading]);

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       router.push('/');
//     } catch (error) {
//       console.error('Error signing out:', error);
//       throw new Error('Failed to sign out');
//     }
//   };

//   if (loading || loadingJobs) return (
//     <div className="min-h-screen bg-white flex items-center justify-center">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
//         <p className="mt-4 text-black">Loading your dashboard...</p>
//       </div>
//     </div>
//   );
  
//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header with Notifications */}
//       <header className="bg-white border-b border-orange-200 p-4">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div className="flex items-center">
//             <h1 className="text-2xl font-bold text-black">ALL Dashboard</h1>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             {/* Notifications Dropdown */}
//             <NotificationsDropdown />
            
//             {/* User Profile */}
//             <div className="flex items-center">
//               {user.photoURL && (
//                 <img 
//                   src={user.photoURL} 
//                   alt="Profile" 
//                   className="w-8 h-8 rounded-full mr-2 border border-orange-500" 
//                 />
//               )}
//               <span className="text-black text-sm">{user.displayName}</span>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="p-6">
//         <div className="max-w-4xl mx-auto">
//           {/* Welcome Section */}
//           <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-orange-200">
//             <h1 className="text-3xl font-bold text-black mb-2">
//               Welcome back, {user.displayName}! 👋
//             </h1>
//             <p className="text-black">Manage your professional journey on ALL Platform</p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Profile Info Card */}
//             <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//               <h2 className="text-xl font-semibold text-black mb-4 border-b border-orange-200 pb-2">
//                 Your Profile
//               </h2>
//               <div className="flex items-center mb-4">
//                 {user.photoURL && (
//                   <img 
//                     src={user.photoURL} 
//                     alt="Profile" 
//                     className="w-16 h-16 rounded-full mr-4 border-2 border-orange-500" 
//                   />
//                 )}
//                 <div>
//                   <p className="text-black font-medium">{user.displayName}</p>
//                   <p className="text-black text-sm">{user.email}</p>
//                 </div>
//               </div>
              
//               {/* Profile Stats */}
//               <div className="grid grid-cols-2 gap-3 mb-4">
//                 <div className="bg-orange-100 rounded-lg p-3 text-center">
//                   <div className="text-lg font-bold text-orange-600">{userJobs.length}</div>
//                   <div className="text-xs text-black">Jobs Posted</div>
//                 </div>
//                 <div className="bg-orange-100 rounded-lg p-3 text-center">
//                   <div className="text-lg font-bold text-orange-600">
//                     {loadingViews ? '...' : profileViewsCount}
//                   </div>
//                   <div className="text-xs text-black">Profile Views</div>
//                 </div>
//               </div>

//               <div className="bg-orange-100 rounded-lg p-3 mt-4">
//                 <p className="text-xs text-black">
//                   <span className="font-medium">User ID:</span> {user.uid.substring(0, 10)}...
//                 </p>
//               </div>
//             </div>

//             {/* Quick Actions Card */}
//             <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//               <h2 className="text-xl font-semibold text-black mb-4 border-b border-orange-200 pb-2">
//                 Quick Actions
//               </h2>
//               <div className="grid grid-cols-1 gap-3">
//                 <button 
//                   onClick={() => router.push('/dashboard/edit-profile')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">✏️</span>
//                   <span>Edit Profile</span>
//                 </button>

//                 <button 
//                   onClick={() => router.push('/dashboard/post-job')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">📝</span>
//                   <span>Post Job</span>
//                 </button>

//                 {userJobs.length > 0 && (
//                   <button 
//                     onClick={() => router.push('/dashboard/company')}
//                     className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                   >
//                     <span className="mr-2">🏢</span>
//                     <span>Company Dashboard</span>
//                   </button>
//                 )}

//                 <button 
//                   onClick={() => router.push('/dashboard/applications')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">📋</span>
//                   <span>My Applications</span>
//                 </button>

//                 {/* NEW: Profile Views Button */}
//                 <button 
//                   onClick={() => router.push('/dashboard/profile-views')}
//                   className="flex items-center justify-between px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200 group"
//                 >
//                   <div className="flex items-center">
//                     <span className="mr-2">👁️</span>
//                     <span>Profile Views</span>
//                   </div>
//                   {!loadingViews && profileViewsCount > 0 && (
//                     <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium group-hover:bg-orange-600">
//                       {profileViewsCount}
//                     </span>
//                   )}
//                 </button>

//                 <button 
//                   onClick={() => router.push('/jobs')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">🔍</span>
//                   <span>Browse Jobs</span>
//                 </button>

//                 {/* Browse Network Button */}
//                 <button 
//                   onClick={() => router.push('/network')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">🌐</span>
//                   <span>Browse Network</span>
//                 </button>

//                 {/* Messages Button */}
//                 <button 
//                   onClick={() => router.push('/dashboard/messages')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">💬</span>
//                   <span>Messages</span>
//                 </button>

//                 {/* Test Message Button (Temporary) */}
//                 <TestMessageButton />
                
//                 <button 
//                   onClick={handleSignOut}
//                   className="flex items-center px-4 py-3 bg-orange-500 text-white border border-orange-500 rounded-xl hover:bg-orange-600 transition-all duration-200 mt-2"
//                 >
//                   <span className="mr-2">🚪</span>
//                   <span>Sign Out</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* For Employers Section */}
//           {userJobs.length === 0 && (
//             <div className="bg-white rounded-2xl p-6 mt-6 shadow-lg border border-orange-200">
//               <div className="text-center">
//                 <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500">
//                   <span className="text-2xl">🏢</span>
//                 </div>
//                 <h3 className="text-xl font-semibold text-black mb-2">For Employers and Businesses</h3>
//                 <p className="text-black mb-4">
//                   <strong>Post your first job to unlock the Company Dashboard!</strong>
//                 </p>
                
//                 <div className="bg-orange-100 rounded-xl p-4 mb-5 text-left border border-orange-200">
//                   <p className="text-black font-medium mb-2">With the Company Dashboard, you can:</p>
//                   <ul className="text-black list-disc list-inside space-y-1 text-sm">
//                     <li>View analytics on your job posts</li>
//                     <li>Manage applications received</li>
//                     <li>Track candidate pipelines</li>
//                     <li>Manage multiple job postings</li>
//                   </ul>
//                 </div>
                
//                 <button 
//                   onClick={() => router.push('/dashboard/post-job')}
//                   className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-all duration-200"
//                 >
//                   🚀 Post Your First Job
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Main Dashboard Component with Error Boundary
// export default function Dashboard() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Dashboard failed to load">
//       <DashboardContent />
//     </ClientErrorBoundary>
//   );
// }



// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { signOut } from 'firebase/auth';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import NotificationsDropdown from '@/components/NotificationsDropdown';
// import TestMessageButton from '@/components/TestMessageButton';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';
// import { getProfileViewsCount } from '@/lib/profileViews'; // Import the profile views count function

// // Dashboard Content Component
// function DashboardContent() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [userJobs, setUserJobs] = useState<any[]>([]);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [profileViewsCount, setProfileViewsCount] = useState(0);
//   const [loadingViews, setLoadingViews] = useState(true);

//   // Fetch user's jobs and profile views count
//   useEffect(() => {
//     async function fetchUserData() {
//       if (user) {
//         try {
//           // Fetch user's jobs
//           const jobsRef = collection(db, 'jobs');
//           const q = query(jobsRef, where('postedBy', '==', user.uid));
//           const querySnapshot = await getDocs(q);
          
//           const jobs: any[] = [];
//           querySnapshot.forEach((doc) => {
//             jobs.push({ id: doc.id, ...doc.data() });
//           });
          
//           setUserJobs(jobs);

//           // Fetch profile views count
//           const viewsCount = await getProfileViewsCount(user.uid);
//           setProfileViewsCount(viewsCount);
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         } finally {
//           setLoadingJobs(false);
//           setLoadingViews(false);
//         }
//       }
//     }

//     if (user) {
//       fetchUserData();
//     }
//   }, [user]);

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/login');
//     }
//   }, [user, loading]);

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       router.push('/');
//     } catch (error) {
//       console.error('Error signing out:', error);
//       throw new Error('Failed to sign out');
//     }
//   };

//   if (loading || loadingJobs) return (
//     <div className="min-h-screen bg-white flex items-center justify-center">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
//         <p className="mt-4 text-black">Loading your dashboard...</p>
//       </div>
//     </div>
//   );
  
//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header with Notifications */}
//       <header className="bg-white border-b border-orange-200 p-4">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div className="flex items-center">
//             <h1 className="text-2xl font-bold text-black">ALL Dashboard</h1>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             {/* Notifications Dropdown */}
//             <NotificationsDropdown />
            
//             {/* User Profile */}
//             <div className="flex items-center">
//               {user.photoURL && (
//                 <img 
//                   src={user.photoURL} 
//                   alt="Profile" 
//                   className="w-8 h-8 rounded-full mr-2 border border-orange-500" 
//                 />
//               )}
//               <span className="text-black text-sm">{user.displayName}</span>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="p-6">
//         <div className="max-w-4xl mx-auto">
//           {/* Welcome Section */}
//           <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-orange-200">
//             <h1 className="text-3xl font-bold text-black mb-2">
//               Welcome back, {user.displayName}! 👋
//             </h1>
//             <p className="text-black">Manage your professional journey on ALL Platform</p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Profile Info Card */}
//             <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//               <h2 className="text-xl font-semibold text-black mb-4 border-b border-orange-200 pb-2">
//                 Your Profile
//               </h2>
//               <div className="flex items-center mb-4">
//                 {user.photoURL && (
//                   <img 
//                     src={user.photoURL} 
//                     alt="Profile" 
//                     className="w-16 h-16 rounded-full mr-4 border-2 border-orange-500" 
//                   />
//                 )}
//                 <div>
//                   <p className="text-black font-medium">{user.displayName}</p>
//                   <p className="text-black text-sm">{user.email}</p>
//                 </div>
//               </div>
              
//               {/* Profile Stats */}
//               <div className="grid grid-cols-2 gap-3 mb-4">
//                 <div className="bg-orange-100 rounded-lg p-3 text-center">
//                   <div className="text-lg font-bold text-orange-600">{userJobs.length}</div>
//                   <div className="text-xs text-black">Jobs Posted</div>
//                 </div>
//                 <div className="bg-orange-100 rounded-lg p-3 text-center">
//                   <div className="text-lg font-bold text-orange-600">
//                     {loadingViews ? '...' : profileViewsCount}
//                   </div>
//                   <div className="text-xs text-black">Profile Views</div>
//                 </div>
//               </div>

//               <div className="bg-orange-100 rounded-lg p-3 mt-4">
//                 <p className="text-xs text-black">
//                   <span className="font-medium">User ID:</span> {user.uid.substring(0, 10)}...
//                 </p>
//               </div>
//             </div>

//             {/* Quick Actions Card */}
//             <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//               <h2 className="text-xl font-semibold text-black mb-4 border-b border-orange-200 pb-2">
//                 Quick Actions
//               </h2>
//               <div className="grid grid-cols-1 gap-3">
//                 <button 
//                   onClick={() => router.push('/dashboard/edit-profile')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">✏️</span>
//                   <span>Edit Profile</span>
//                 </button>

//                 <button 
//                   onClick={() => router.push('/dashboard/post-job')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">📝</span>
//                   <span>Post Job</span>
//                 </button>

//                 {userJobs.length > 0 && (
//                   <button 
//                     onClick={() => router.push('/dashboard/company')}
//                     className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                   >
//                     <span className="mr-2">🏢</span>
//                     <span>Company Dashboard</span>
//                   </button>
//                 )}

//                 <button 
//                   onClick={() => router.push('/dashboard/applications')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">📋</span>
//                   <span>My Applications</span>
//                 </button>

//                 {/* NEW: Profile Views Button */}
//                 <button 
//                   onClick={() => router.push('/dashboard/profile-views')}
//                   className="flex items-center justify-between px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200 group"
//                 >
//                   <div className="flex items-center">
//                     <span className="mr-2">👁️</span>
//                     <span>Profile Views</span>
//                   </div>
//                   {!loadingViews && profileViewsCount > 0 && (
//                     <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium group-hover:bg-orange-600">
//                       {profileViewsCount}
//                     </span>
//                   )}
//                 </button>

//                 <button 
//                   onClick={() => router.push('/jobs')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">🔍</span>
//                   <span>Browse Jobs</span>
//                 </button>

//                 {/* Browse Network Button */}
//                 <button 
//                   onClick={() => router.push('/network')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">🌐</span>
//                   <span>Browse Network</span>
//                 </button>

//                 {/* Messages Button */}
//                 <button 
//                   onClick={() => router.push('/dashboard/messages')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">💬</span>
//                   <span>Messages</span>
//                 </button>

//                 {/* NEW: Referral Marketplace Button */}
//                 <button 
//                   onClick={() => router.push('/referral')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">🤝</span>
//                   <span>Referral Marketplace</span>
//                 </button>

//                 {/* Test Message Button (Temporary) */}
//                 <TestMessageButton />
                
//                 <button 
//                   onClick={handleSignOut}
//                   className="flex items-center px-4 py-3 bg-orange-500 text-white border border-orange-500 rounded-xl hover:bg-orange-600 transition-all duration-200 mt-2"
//                 >
//                   <span className="mr-2">🚪</span>
//                   <span>Sign Out</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* For Employers Section */}
//           {userJobs.length === 0 && (
//             <div className="bg-white rounded-2xl p-6 mt-6 shadow-lg border border-orange-200">
//               <div className="text-center">
//                 <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500">
//                   <span className="text-2xl">🏢</span>
//                 </div>
//                 <h3 className="text-xl font-semibold text-black mb-2">For Employers and Businesses</h3>
//                 <p className="text-black mb-4">
//                   <strong>Post your first job to unlock the Company Dashboard!</strong>
//                 </p>
                
//                 <div className="bg-orange-100 rounded-xl p-4 mb-5 text-left border border-orange-200">
//                   <p className="text-black font-medium mb-2">With the Company Dashboard, you can:</p>
//                   <ul className="text-black list-disc list-inside space-y-1 text-sm">
//                     <li>View analytics on your job posts</li>
//                     <li>Manage applications received</li>
//                     <li>Track candidate pipelines</li>
//                     <li>Manage multiple job postings</li>
//                   </ul>
//                 </div>
                
//                 <button 
//                   onClick={() => router.push('/dashboard/post-job')}
//                   className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-all duration-200"
//                 >
//                   🚀 Post Your First Job
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Main Dashboard Component with Error Boundary
// export default function Dashboard() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Dashboard failed to load">
//       <DashboardContent />
//     </ClientErrorBoundary>
//   );
// }

// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { signOut } from 'firebase/auth';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import NotificationsDropdown from '@/components/NotificationsDropdown';
// import TestMessageButton from '@/components/TestMessageButton';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';
// import { getProfileViewsCount } from '@/lib/profileViews';

// function DashboardContent() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [userJobs, setUserJobs] = useState<any[]>([]);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [profileViewsCount, setProfileViewsCount] = useState(0);
//   const [loadingViews, setLoadingViews] = useState(true);

//   useEffect(() => {
//     async function fetchUserData() {
//       if (user) {
//         try {
//           const jobsRef = collection(db, 'jobs');
//           const q = query(jobsRef, where('postedBy', '==', user.uid));
//           const querySnapshot = await getDocs(q);
          
//           const jobs: any[] = [];
//           querySnapshot.forEach((doc) => {
//             jobs.push({ id: doc.id, ...doc.data() });
//           });
          
//           setUserJobs(jobs);

//           const viewsCount = await getProfileViewsCount(user.uid);
//           setProfileViewsCount(viewsCount);
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         } finally {
//           setLoadingJobs(false);
//           setLoadingViews(false);
//         }
//       }
//     }

//     if (user) {
//       fetchUserData();
//     }
//   }, [user]);

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/login');
//     }
//   }, [user, loading]);

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       router.push('/');
//     } catch (error) {
//       console.error('Error signing out:', error);
//       throw new Error('Failed to sign out');
//     }
//   };

//   if (loading || loadingJobs) return (
//     <div className="min-h-screen bg-white flex items-center justify-center">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
//         <p className="mt-4 text-black">Loading your dashboard...</p>
//       </div>
//     </div>
//   );
  
//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-white">
//       <header className="bg-white border-b border-orange-200 p-4">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div className="flex items-center">
//             <h1 className="text-2xl font-bold text-black">ALL Dashboard</h1>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <NotificationsDropdown />
            
//             <div className="flex items-center">
//               {user.photoURL && (
//                 <img 
//                   src={user.photoURL} 
//                   alt="Profile" 
//                   className="w-8 h-8 rounded-full mr-2 border border-orange-500" 
//                 />
//               )}
//               <span className="text-black text-sm">{user.displayName}</span>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="p-6">
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-orange-200">
//             <h1 className="text-3xl font-bold text-black mb-2">
//               Welcome back, {user.displayName}! 👋
//             </h1>
//             <p className="text-black">Manage your professional journey on ALL Platform</p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//               <h2 className="text-xl font-semibold text-black mb-4 border-b border-orange-200 pb-2">
//                 Your Profile
//               </h2>
//               <div className="flex items-center mb-4">
//                 {user.photoURL && (
//                   <img 
//                     src={user.photoURL} 
//                     alt="Profile" 
//                     className="w-16 h-16 rounded-full mr-4 border-2 border-orange-500" 
//                   />
//                 )}
//                 <div>
//                   <p className="text-black font-medium">{user.displayName}</p>
//                   <p className="text-black text-sm">{user.email}</p>
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-2 gap-3 mb-4">
//                 <div className="bg-orange-100 rounded-lg p-3 text-center">
//                   <div className="text-lg font-bold text-orange-600">{userJobs.length}</div>
//                   <div className="text-xs text-black">Jobs Posted</div>
//                 </div>
//                 <div className="bg-orange-100 rounded-lg p-3 text-center">
//                   <div className="text-lg font-bold text-orange-600">
//                     {loadingViews ? '...' : profileViewsCount}
//                   </div>
//                   <div className="text-xs text-black">Profile Views</div>
//                 </div>
//               </div>

//               <div className="bg-orange-100 rounded-lg p-3 mt-4">
//                 <p className="text-xs text-black">
//                   <span className="font-medium">User ID:</span> {user.uid.substring(0, 10)}...
//                 </p>
//               </div>
//             </div>

//             {/* QUICK ACTIONS CARD - WITH REFERRAL BUTTON */}
//             <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//               <h2 className="text-xl font-semibold text-black mb-4 border-b border-orange-200 pb-2">
//                 Quick Actions
//               </h2>
//               <div className="grid grid-cols-1 gap-3">
//                 <button 
//                   onClick={() => router.push('/dashboard/edit-profile')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">✏️</span>
//                   <span>Edit Profile</span>
//                 </button>

//                 <button 
//                   onClick={() => router.push('/dashboard/post-job')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">📝</span>
//                   <span>Post Job</span>
//                 </button>

//                 {userJobs.length > 0 && (
//                   <button 
//                     onClick={() => router.push('/dashboard/company')}
//                     className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                   >
//                     <span className="mr-2">🏢</span>
//                     <span>Company Dashboard</span>
//                   </button>
//                 )}

//                 <button 
//                   onClick={() => router.push('/dashboard/applications')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">📋</span>
//                   <span>My Applications</span>
//                 </button>

//                 <button 
//                   onClick={() => router.push('/dashboard/profile-views')}
//                   className="flex items-center justify-between px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200 group"
//                 >
//                   <div className="flex items-center">
//                     <span className="mr-2">👁️</span>
//                     <span>Profile Views</span>
//                   </div>
//                   {!loadingViews && profileViewsCount > 0 && (
//                     <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium group-hover:bg-orange-600">
//                       {profileViewsCount}
//                     </span>
//                   )}
//                 </button>

//                 <button 
//                   onClick={() => router.push('/jobs')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">🔍</span>
//                   <span>Browse Jobs</span>
//                 </button>

//                 <button 
//                   onClick={() => router.push('/network')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">🌐</span>
//                   <span>Browse Network</span>
//                 </button>

//                 <button 
//                   onClick={() => router.push('/dashboard/messages')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">💬</span>
//                   <span>Messages</span>
//                 </button>

//                 {/* REFERRAL MARKETPLACE BUTTON - ADDED HERE */}
//                 <button 
//                   onClick={() => router.push('/referral')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">🤝</span>
//                   <span>Referral Marketplace</span>
//                 </button>

//                 <TestMessageButton />
                
//                 <button 
//                   onClick={handleSignOut}
//                   className="flex items-center px-4 py-3 bg-orange-500 text-white border border-orange-500 rounded-xl hover:bg-orange-600 transition-all duration-200 mt-2"
//                 >
//                   <span className="mr-2">🚪</span>
//                   <span>Sign Out</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {userJobs.length === 0 && (
//             <div className="bg-white rounded-2xl p-6 mt-6 shadow-lg border border-orange-200">
//               <div className="text-center">
//                 <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500">
//                   <span className="text-2xl">🏢</span>
//                 </div>
//                 <h3 className="text-xl font-semibold text-black mb-2">For Employers and Businesses</h3>
//                 <p className="text-black mb-4">
//                   <strong>Post your first job to unlock the Company Dashboard!</strong>
//                 </p>
                
//                 <div className="bg-orange-100 rounded-xl p-4 mb-5 text-left border border-orange-200">
//                   <p className="text-black font-medium mb-2">With the Company Dashboard, you can:</p>
//                   <ul className="text-black list-disc list-inside space-y-1 text-sm">
//                     <li>View analytics on your job posts</li>
//                     <li>Manage applications received</li>
//                     <li>Track candidate pipelines</li>
//                     <li>Manage multiple job postings</li>
//                   </ul>
//                 </div>
                
//                 <button 
//                   onClick={() => router.push('/dashboard/post-job')}
//                   className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-all duration-200"
//                 >
//                   🚀 Post Your First Job
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function Dashboard() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Dashboard failed to load">
//       <DashboardContent />
//     </ClientErrorBoundary>
//   );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { useRouter } from 'next/navigation';
// import { 
//   collection, addDoc, getDocs, query, where, orderBy, limit,
//   deleteDoc, updateDoc, doc, setDoc, getDoc, writeBatch 
// } from 'firebase/firestore';
// import { rapidApiConfig } from '@/lib/config';
// import { isAdmin, setUserAsAdmin, removeAdminRole, getAllAdmins } from '@/lib/admin';
// import ErrorBoundary from '@/components/ErrorBoundary';
// import ErrorFallback from '@/components/ErrorFallback';
// import { fetchAdzunaJobs, saveAdzunaJobsToFirestore, AdzunaJob } from '@/lib/adzuna-new';

// // Admin Dashboard Content Component
// function AdminDashboardContent() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [isUserAdmin, setIsUserAdmin] = useState(false);
//   const [loadingAdminCheck, setLoadingAdminCheck] = useState(true);
  
//   // State for different sections
//   const [activeTab, setActiveTab] = useState<'jobs' | 'users' | 'api' | 'config' | 'referral' | 'messages'>('jobs');
  
//   // Jobs state
//   const [apiJobs, setApiJobs] = useState<any[]>([]);
//   const [adzunaJobs, setAdzunaJobs] = useState<AdzunaJob[]>([]);
//   const [importedJobs, setImportedJobs] = useState<any[]>([]);
//   const [regularJobs, setRegularJobs] = useState<any[]>([]);
//   const [referralJobs, setReferralJobs] = useState<any[]>([]);
//   const [showAllImportedJobs, setShowAllImportedJobs] = useState(false);
  
//   // API state
//   const [fetchingJobs, setFetchingJobs] = useState(false);
//   const [fetchingAdzunaJobs, setFetchingAdzunaJobs] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('developer');
//   const [searchLocation, setSearchLocation] = useState('India');
//   const [message, setMessage] = useState('');
  
//   // Users state
//   const [users, setUsers] = useState<any[]>([]);
//   const [admins, setAdmins] = useState<any[]>([]);
//   const [editingUser, setEditingUser] = useState<any>(null);
//   const [showUserEditModal, setShowUserEditModal] = useState(false);
  
//   // Configuration state
//   const [configData, setConfigData] = useState({
//     launchDate: '2025-01-01',
//     freePeriodMonths: 3,
//     platformName: 'ALL Platform',
//     isMaintenanceMode: false
//   });
//   const [showConfigModal, setShowConfigModal] = useState(false);
  
//   // Messages state
//   const [messages, setMessages] = useState<any[]>([]);
  
//   // Search/filter state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedUserType, setSelectedUserType] = useState('all');

//   // Check if user is admin
//   useEffect(() => {
//     async function checkAdminStatus() {
//       if (user) {
//         try {
//           const adminStatus = await isAdmin(user);
//           setIsUserAdmin(adminStatus);
//           if (adminStatus) {
//             await fetchAllAdmins();
//           }
//         } catch (error) {
//           console.error('Error checking admin status:', error);
//           throw new Error('Failed to verify admin permissions');
//         } finally {
//           setLoadingAdminCheck(false);
//         }
//       } else {
//         setLoadingAdminCheck(false);
//       }
//     }

//     if (!loading) {
//       checkAdminStatus();
//     }
//   }, [user, loading]);

//   // Fetch data based on active tab
//   useEffect(() => {
//     if (isUserAdmin) {
//       const fetchData = async () => {
//         try {
//           if (activeTab === 'jobs') {
//             await fetchImportedJobs();
//             await fetchRegularJobs();
//           } else if (activeTab === 'users') {
//             await fetchAllUsers();
//           } else if (activeTab === 'referral') {
//             await fetchReferralJobs();
//           } else if (activeTab === 'messages') {
//             await fetchMessages();
//           } else if (activeTab === 'config') {
//             await fetchConfig();
//           }
//         } catch (error) {
//           console.error(`Error fetching ${activeTab}:`, error);
//           setMessage(`Error fetching ${activeTab} data: ${error instanceof Error ? error.message : 'Unknown error'}`);
//         }
//       };

//       fetchData();
//     }
//   }, [isUserAdmin, activeTab, showAllImportedJobs]);

//   // Data fetching functions
//   const fetchImportedJobs = async () => {
//     const apiJobsQuery = query(
//       collection(db, 'apiJobs'), 
//       orderBy('fetchedAt', 'desc'),
//       showAllImportedJobs ? limit(1000) : limit(50)
//     );
//     const apiJobsSnapshot = await getDocs(apiJobsQuery);
//     const jobsData = apiJobsSnapshot.docs.map(doc => ({ 
//       id: doc.id, 
//       ...doc.data(),
//       displayDate: doc.data().fetchedAt?.toDate ? doc.data().fetchedAt.toDate() : new Date()
//     }));
//     setImportedJobs(jobsData);
//   };

//   const fetchRegularJobs = async () => {
//     const jobsQuery = query(collection(db, 'jobs'), orderBy('postedAt', 'desc'), limit(100));
//     const jobsSnapshot = await getDocs(jobsQuery);
//     setRegularJobs(jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//   };

//   const fetchReferralJobs = async () => {
//     const referralQuery = query(collection(db, 'referralJobs'), orderBy('postedAt', 'desc'), limit(100));
//     const referralSnapshot = await getDocs(referralQuery);
//     setReferralJobs(referralSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//   };

//   const fetchAllUsers = async () => {
//     const usersQuery = query(collection(db, 'users'), orderBy('displayName'));
//     const usersSnapshot = await getDocs(usersQuery);
//     setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//   };

//   const fetchAllAdmins = async () => {
//     const adminsList = await getAllAdmins();
//     setAdmins(adminsList);
//   };

//   const fetchMessages = async () => {
//     const messagesQuery = query(collection(db, 'messages'), orderBy('timestamp', 'desc'), limit(100));
//     const messagesSnapshot = await getDocs(messagesQuery);
//     setMessages(messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//   };

//   const fetchConfig = async () => {
//     try {
//       const configDoc = await getDoc(doc(db, 'config', 'subscription'));
//       if (configDoc.exists()) {
//         setConfigData(configDoc.data() as any);
//       }
//     } catch (error) {
//       console.error('Error fetching config:', error);
//     }
//   };

//   // ==================== USER CRUD OPERATIONS ====================
//   const handleMakeAdmin = async (userId: string, userData: any) => {
//     try {
//       await setUserAsAdmin(userId, userData);
//       setMessage(`✅ ${userData.displayName || userId} is now an admin`);
//       await fetchAllUsers();
//       await fetchAllAdmins();
//     } catch (error) {
//       setMessage(`❌ Error making user admin: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     }
//   };

//   const handleRemoveAdmin = async (userId: string, userName: string) => {
//     if (!confirm(`Are you sure you want to remove admin role from ${userName}?`)) return;
    
//     try {
//       await removeAdminRole(userId);
//       setMessage(`✅ Admin role removed from ${userName}`);
//       await fetchAllUsers();
//       await fetchAllAdmins();
//     } catch (error) {
//       setMessage(`❌ Error removing admin role: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     }
//   };

//   const handleDeleteUser = async (userId: string, userName: string) => {
//     if (!confirm(`Permanently delete user "${userName}"? This cannot be undone!`)) return;
    
//     try {
//       // Delete user document
//       await deleteDoc(doc(db, 'users', userId));
      
//       // Delete user's jobs
//       const userJobsQuery = query(collection(db, 'jobs'), where('postedBy', '==', userId));
//       const userJobsSnapshot = await getDocs(userJobsQuery);
//       const deletePromises = userJobsSnapshot.docs.map(doc => deleteDoc(doc.ref));
//       await Promise.all(deletePromises);
      
//       setMessage(`✅ User "${userName}" deleted successfully`);
//       await fetchAllUsers();
//     } catch (error) {
//       setMessage(`❌ Error deleting user: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     }
//   };

//   const handleEditUser = (user: any) => {
//     setEditingUser(user);
//     setShowUserEditModal(true);
//   };

//   const handleSaveUser = async (updatedUser: any) => {
//     try {
//       await updateDoc(doc(db, 'users', updatedUser.id), {
//         displayName: updatedUser.displayName,
//         email: updatedUser.email,
//         headline: updatedUser.headline,
//         phoneNumber: updatedUser.phoneNumber,
//         updatedAt: new Date()
//       });
//       setMessage(`✅ User "${updatedUser.displayName}" updated successfully`);
//       setShowUserEditModal(false);
//       setEditingUser(null);
//       await fetchAllUsers();
//     } catch (error) {
//       setMessage(`❌ Error updating user: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     }
//   };

//   // ==================== JOB CRUD OPERATIONS ====================
//   const handleDeleteJob = async (jobId: string, jobTitle: string, collectionName: string) => {
//     if (!confirm(`Delete job "${jobTitle}"?`)) return;
    
//     try {
//       await deleteDoc(doc(db, collectionName, jobId));
//       setMessage(`✅ Job "${jobTitle}" deleted`);
      
//       if (collectionName === 'jobs') {
//         await fetchRegularJobs();
//       } else if (collectionName === 'referralJobs') {
//         await fetchReferralJobs();
//       } else if (collectionName === 'apiJobs') {
//         await fetchImportedJobs();
//       }
//     } catch (error) {
//       setMessage(`❌ Error deleting job: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     }
//   };

//   const handleToggleJobStatus = async (jobId: string, currentStatus: boolean, collectionName: string) => {
//     try {
//       await updateDoc(doc(db, collectionName, jobId), {
//         isActive: !currentStatus,
//         updatedAt: new Date()
//       });
//       setMessage(`✅ Job status updated`);
      
//       if (collectionName === 'jobs') {
//         await fetchRegularJobs();
//       } else if (collectionName === 'referralJobs') {
//         await fetchReferralJobs();
//       }
//     } catch (error) {
//       setMessage(`❌ Error updating job: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     }
//   };

//   // ==================== CONFIGURATION OPERATIONS ====================
//   const handleSaveConfig = async () => {
//     try {
//       await setDoc(doc(db, 'config', 'subscription'), {
//         ...configData,
//         updatedAt: new Date()
//       }, { merge: true });
//       setMessage('✅ Configuration saved successfully');
//       setShowConfigModal(false);
//     } catch (error) {
//       setMessage(`❌ Error saving config: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     }
//   };

//   const calculateFreePeriodEnd = () => {
//     const launchDate = new Date(configData.launchDate);
//     const endDate = new Date(launchDate);
//     endDate.setMonth(endDate.getMonth() + configData.freePeriodMonths);
//     return endDate.toLocaleDateString();
//   };

//   // ==================== API FUNCTIONS (KEEP EXISTING) ====================
//   const fetchJobsFromAPI = async (query: string, location: string) => {
//     try {
//       const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || rapidApiConfig.key;
//       const apiHost = process.env.NEXT_PUBLIC_RAPIDAPI_HOST || rapidApiConfig.host;

//       if (!apiKey || !apiHost) {
//         throw new Error('API credentials missing');
//       }

//       const safeLocation = location.trim() || 'India';
//       let apiQuery = query;
//       if (safeLocation.toLowerCase() !== 'usa' && safeLocation.toLowerCase() !== 'united states') {
//         apiQuery = `${query} ${safeLocation}`;
//       }
      
//       const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(apiQuery)}&location=${encodeURIComponent(safeLocation)}&page=1`;
      
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'X-RapidAPI-Key': apiKey,
//           'X-RapidAPI-Host': apiHost,
//         },
//       });

//       if (response.status === 429) throw new Error('Rate limit exceeded');
//       if (response.status === 403) throw new Error('API access forbidden');
//       if (!response.ok) throw new Error(`API error: ${response.status}`);

//       const data = await response.json();
//       return data.data || [];
//     } catch (error) {
//       console.error('Error fetching jobs from API:', error);
//       throw error;
//     }
//   };

//   const fetchJobs = async () => {
//     if (!searchQuery.trim()) {
//       setMessage('Please enter a search query');
//       return;
//     }

//     setFetchingJobs(true);
//     setMessage('');
    
//     try {
//       const jobs = await fetchJobsFromAPI(searchQuery, searchLocation);
//       setApiJobs(jobs);
//       setMessage(jobs.length > 0 
//         ? `Found ${jobs.length} jobs from JSearch` 
//         : 'No jobs found for your search'
//       );
//     } catch (error: any) {
//       setMessage(`Error: ${error.message || 'Failed to fetch jobs'}`);
//     } finally {
//       setFetchingJobs(false);
//     }
//   };

//   const fetchAdzunaJobsHandler = async () => {
//     if (!user) {
//       setMessage('You must be logged in to fetch jobs');
//       return;
//     }

//     setFetchingAdzunaJobs(true);
//     setMessage('');

//     try {
//       const jobs = await fetchAdzunaJobs('in', 20);
//       setAdzunaJobs(jobs);
//       setMessage(`Found ${jobs.length} jobs from Adzuna API`);
//     } catch (error: any) {
//       setMessage(`Error fetching Adzuna jobs: ${error.message || 'Unknown error'}`);
//     } finally {
//       setFetchingAdzunaJobs(false);
//     }
//   };

//   const mapJSearchJobToOurFormat = (job: any) => {
//     return {
//       title: job.job_title,
//       company: job.employer_name,
//       location: `${job.job_city}, ${job.job_country}`,
//       type: job.job_employment_type || 'Full-time',
//       salary: job.job_min_salary && job.job_max_salary 
//         ? `${job.job_min_salary} - ${job.job_max_salary}` 
//         : 'Not specified',
//       description: job.job_description,
//       requirements: 'Not specified',
//       postedBy: 'api-source',
//       postedAt: new Date(),
//       source: 'jsearch',
//       externalId: job.job_id,
//       isExternal: true,
//       jobLink: job.job_apply_link
//     };
//   };

//   const saveJobToFirestore = async (jobData: any) => {
//     try {
//       const jobsRef = collection(db, 'jobs');
//       await addDoc(jobsRef, jobData);
      
//       const apiJobsRef = collection(db, 'apiJobs');
//       await addDoc(apiJobsRef, {
//         ...jobData,
//         fetchedAt: new Date(),
//       });
      
//       return true;
//     } catch (error) {
//       console.error('Error saving job:', error);
//       throw new Error('Failed to save job to database');
//     }
//   };

//   const importJob = async (job: any, source: 'jsearch' | 'adzuna') => {
//     try {
//       let ourJobFormat;
//       if (source === 'jsearch') {
//         ourJobFormat = mapJSearchJobToOurFormat(job);
//       } else {
//         const savedCount = await saveAdzunaJobsToFirestore([job], user!.uid);
//         if (savedCount > 0) {
//           setMessage('Job imported successfully!');
//           setAdzunaJobs(adzunaJobs.filter(j => j.id !== job.id));
//           return;
//         }
//       }

//       if (source === 'jsearch') {
//         const success = await saveJobToFirestore(ourJobFormat);
//         if (success) {
//           setMessage('Job imported successfully!');
//           setApiJobs(apiJobs.filter(j => j.job_id !== job.job_id));
//         }
//       }
      
//       // Refresh imported jobs list
//       await fetchImportedJobs();
      
//     } catch (error) {
//       console.error('Error importing job:', error);
//       setMessage('Error importing job');
//     }
//   };

//   const importAllJobs = async (source: 'jsearch' | 'adzuna') => {
//     const jobs = source === 'jsearch' ? apiJobs : adzunaJobs;
    
//     if (jobs.length === 0) {
//       setMessage(`No ${source} jobs to import`);
//       return;
//     }

//     try {
//       let importedCount = 0;
      
//       if (source === 'adzuna') {
//         importedCount = await saveAdzunaJobsToFirestore(jobs, user!.uid);
//         setMessage(`Imported ${importedCount} of ${jobs.length} Adzuna jobs successfully!`);
//         setAdzunaJobs([]);
//       } else {
//         for (const job of jobs) {
//           const ourJobFormat = mapJSearchJobToOurFormat(job);
//           const success = await saveJobToFirestore(ourJobFormat);
//           if (success) importedCount++;
//           await new Promise(resolve => setTimeout(resolve, 100));
//         }
//         setMessage(`Imported ${importedCount} of ${jobs.length} JSearch jobs successfully!`);
//         setApiJobs([]);
//       }
      
//       // Refresh imported jobs list
//       await fetchImportedJobs();
      
//     } catch (error) {
//       console.error('Error importing all jobs:', error);
//       setMessage('Error importing jobs');
//     }
//   };

//   // Filter functions
//   const filteredUsers = () => {
//     let filtered = users;
    
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(user => 
//         (user.displayName?.toLowerCase().includes(term)) ||
//         (user.email?.toLowerCase().includes(term)) ||
//         (user.headline?.toLowerCase().includes(term))
//       );
//     }
    
//     if (selectedUserType === 'admin') {
//       filtered = filtered.filter(user => user.role === 'admin');
//     } else if (selectedUserType === 'regular') {
//       filtered = filtered.filter(user => user.role !== 'admin');
//     }
    
//     return filtered;
//   };

//   // ==================== UI RENDER HELPERS ====================
//   const getDisplayedImportedJobs = () => {
//     return showAllImportedJobs ? importedJobs : importedJobs.slice(0, 20);
//   };

//   // Loading and Access Denied States
//   if (loading || loadingAdminCheck) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
//           <p className="mt-4 text-black">Loading admin dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isUserAdmin) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <span className="text-2xl">⛔</span>
//           </div>
//           <h2 className="text-xl font-semibold text-black mb-2">Access Denied</h2>
//           <p className="text-black mb-4">You need admin privileges to access this page.</p>
//           <button 
//             onClick={() => router.push('/dashboard')}
//             className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
//           >
//             Go to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-orange-200">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-black mb-2">🚀 Admin Dashboard</h1>
//               <p className="text-black">Complete CRUD control over the platform</p>
//             </div>
//             <div className="text-right">
//               <p className="text-sm text-gray-600">Welcome, {user?.displayName || 'Admin'}</p>
//               <p className="text-xs text-gray-500">{user?.email}</p>
//               <button
//                 onClick={async () => {
//                   if (user) {
//                     await setUserAsAdmin(user.uid, {
//                       email: user.email,
//                       displayName: user.displayName
//                     });
//                     alert('✅ Admin role confirmed! Refreshing...');
//                     window.location.reload();
//                   }
//                 }}
//                 className="mt-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
//               >
//                 🔧 Confirm Admin Role
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="bg-white rounded-2xl p-1 mb-6 shadow-lg border border-orange-200">
//           <div className="flex space-x-1 overflow-x-auto">
//             <button
//               onClick={() => setActiveTab('jobs')}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all ${
//                 activeTab === 'jobs'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               📊 All Jobs
//             </button>
//             <button
//               onClick={() => setActiveTab('referral')}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all ${
//                 activeTab === 'referral'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               🤝 Referral Jobs
//             </button>
//             <button
//               onClick={() => setActiveTab('users')}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all ${
//                 activeTab === 'users'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               👥 Users ({users.length})
//             </button>
//             <button
//               onClick={() => setActiveTab('api')}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all ${
//                 activeTab === 'api'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               🔌 API Jobs
//             </button>
//             <button
//               onClick={() => setActiveTab('messages')}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all ${
//                 activeTab === 'messages'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               💬 Messages
//             </button>
//             <button
//               onClick={() => setActiveTab('config')}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all ${
//                 activeTab === 'config'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               ⚙️ Configuration
//             </button>
//           </div>
//         </div>

//         {/* Message Alert */}
//         {message && (
//           <div className={`mb-6 p-4 rounded-2xl ${
//             message.includes('❌') ? 'bg-red-100 text-red-800 border border-red-200' : 
//             message.includes('✅') ? 'bg-green-100 text-green-800 border border-green-200' :
//             'bg-blue-100 text-blue-800 border border-blue-200'
//           }`}>
//             {message}
//           </div>
//         )}

//         {/* Tab Content */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//           {/* Jobs Tab - All Jobs */}
//           {activeTab === 'jobs' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">All Platform Jobs</h2>
//                 <div className="flex items-center space-x-4">
//                   <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                     {regularJobs.length} regular jobs
//                   </span>
//                   <button
//                     onClick={fetchRegularJobs}
//                     className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors"
//                   >
//                     🔄 Refresh
//                   </button>
//                 </div>
//               </div>

//               {regularJobs.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <span className="text-2xl">📭</span>
//                   </div>
//                   <p className="text-black text-lg mb-2">No jobs found</p>
//                   <p className="text-gray-600">Jobs posted by users will appear here</p>
//                 </div>
//               ) : (
//                 <div className="grid gap-4 max-h-[600px] overflow-y-auto">
//                   {regularJobs.map(job => (
//                     <div key={job.id} className="p-4 border border-orange-200 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
//                       <div className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <h3 className="text-lg font-semibold text-black mb-2">{job.title}</h3>
//                           <p className="text-black mb-1">
//                             <span className="font-medium">Company:</span> {job.company}
//                           </p>
//                           <p className="text-black mb-1">
//                             <span className="font-medium">Posted by:</span> {job.postedBy || 'Unknown'}
//                           </p>
//                           <div className="flex items-center space-x-2 mt-2">
//                             <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
//                               {job.type || 'Full-time'}
//                             </span>
//                             <span className="text-gray-600 text-sm">
//                               Posted: {job.postedAt?.toDate?.().toLocaleDateString() || 'Unknown date'}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => handleToggleJobStatus(job.id, job.isActive || true, 'jobs')}
//                             className={`px-3 py-1 rounded-lg text-sm ${
//                               job.isActive === false 
//                                 ? 'bg-green-500 text-white hover:bg-green-600'
//                                 : 'bg-yellow-500 text-white hover:bg-yellow-600'
//                             }`}
//                           >
//                             {job.isActive === false ? 'Activate' : 'Deactivate'}
//                           </button>
//                           <button
//                             onClick={() => handleDeleteJob(job.id, job.title, 'jobs')}
//                             className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Referral Jobs Tab */}
//           {activeTab === 'referral' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">Referral Jobs Management</h2>
//                 <div className="flex items-center space-x-4">
//                   <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                     {referralJobs.length} referral jobs
//                   </span>
//                   <button
//                     onClick={fetchReferralJobs}
//                     className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors"
//                   >
//                     🔄 Refresh
//                   </button>
//                 </div>
//               </div>

//               {referralJobs.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <span className="text-2xl">🤝</span>
//                   </div>
//                   <p className="text-black text-lg mb-2">No referral jobs found</p>
//                   <p className="text-gray-600">Employees haven't posted any referral jobs yet</p>
//                 </div>
//               ) : (
//                 <div className="grid gap-4 max-h-[600px] overflow-y-auto">
//                   {referralJobs.map(job => (
//                     <div key={job.id} className="p-4 border border-green-200 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
//                       <div className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <h3 className="text-lg font-semibold text-black mb-2">{job.title}</h3>
//                           <p className="text-black mb-1">
//                             <span className="font-medium">Company:</span> {job.company}
//                           </p>
//                           <p className="text-black mb-1">
//                             <span className="font-medium">Location:</span> {job.location}
//                           </p>
//                           <div className="flex items-center space-x-2 mt-2">
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                               job.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                             }`}>
//                               {job.isActive ? 'Active' : 'Inactive'}
//                             </span>
//                             <span className="text-gray-600 text-sm">
//                               Skills: {job.skills?.slice(0, 3).join(', ')}...
//                             </span>
//                           </div>
//                         </div>
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => handleToggleJobStatus(job.id, job.isActive || true, 'referralJobs')}
//                             className={`px-3 py-1 rounded-lg text-sm ${
//                               job.isActive === false 
//                                 ? 'bg-green-500 text-white hover:bg-green-600'
//                                 : 'bg-yellow-500 text-white hover:bg-yellow-600'
//                             }`}
//                           >
//                             {job.isActive === false ? 'Activate' : 'Deactivate'}
//                           </button>
//                           <button
//                             onClick={() => handleDeleteJob(job.id, job.title, 'referralJobs')}
//                             className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Users Tab */}
//           {activeTab === 'users' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">User Management</h2>
//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="text"
//                       placeholder="Search users..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                     <select
//                       value={selectedUserType}
//                       onChange={(e) => setSelectedUserType(e.target.value)}
//                       className="p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     >
//                       <option value="all">All Users</option>
//                       <option value="admin">Admins Only</option>
//                       <option value="regular">Regular Users</option>
//                     </select>
//                   </div>
//                   <button
//                     onClick={fetchAllUsers}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//                   >
//                     🔄 Refresh Users
//                   </button>
//                 </div>
//               </div>

//               {filteredUsers().length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <span className="text-2xl">👥</span>
//                   </div>
//                   <p className="text-black text-lg mb-2">No users found</p>
//                   <p className="text-gray-600">Try changing your search criteria</p>
//                 </div>
//               ) : (
//                 <div className="grid gap-4 max-h-[600px] overflow-y-auto">
//                   {filteredUsers().map(user => (
//                     <div key={user.id} className="p-4 border border-orange-200 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h3 className="text-lg font-semibold text-black">{user.displayName || 'Anonymous User'}</h3>
//                           <p className="text-black">{user.email}</p>
//                           {user.headline && (
//                             <p className="text-sm text-gray-600 mt-1">{user.headline}</p>
//                           )}
//                           <div className="flex items-center space-x-2 mt-2">
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                               user.role === 'admin' 
//                                 ? 'bg-red-100 text-red-800' 
//                                 : 'bg-green-100 text-green-800'
//                             }`}>
//                               {user.role || 'user'}
//                             </span>
//                             {user.phoneNumber && (
//                               <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
//                                 📱 {user.phoneNumber}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => handleEditUser(user)}
//                             className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
//                           >
//                             Edit
//                           </button>
//                           {user.role === 'admin' ? (
//                             <button
//                               onClick={() => handleRemoveAdmin(user.id, user.displayName)}
//                               className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-600"
//                             >
//                               Remove Admin
//                             </button>
//                           ) : (
//                             <button
//                               onClick={() => handleMakeAdmin(user.id, user)}
//                               className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-600"
//                             >
//                               Make Admin
//                             </button>
//                           )}
//                           {user.id !== user?.uid && (
//                             <button
//                               onClick={() => handleDeleteUser(user.id, user.displayName)}
//                               className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
//                             >
//                               Delete
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* API Tab - Job Fetching (Keep existing) */}
//           {activeTab === 'api' && (
//             <div>
//               <h2 className="text-2xl font-bold text-black mb-6">Fetch Jobs from APIs</h2>
              
//               {/* JSearch API Section */}
//               <div className="mb-8 p-6 bg-orange-50 rounded-2xl border border-orange-200">
//                 <h3 className="text-xl font-semibold text-black mb-4">JSearch API</h3>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block mb-2 font-medium text-black">Job Title/Keywords</label>
//                     <input
//                       type="text"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       placeholder="e.g., developer, marketing, etc."
//                       className="w-full p-3 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-black bg-white"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-2 font-medium text-black">Location</label>
//                     <input
//                       type="text"
//                       value={searchLocation}
//                       onChange={(e) => setSearchLocation(e.target.value)}
//                       placeholder="e.g., India, Bangalore, etc."
//                       className="w-full p-3 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-black bg-white"
//                     />
//                   </div>
//                 </div>
                
//                 <div className="flex space-x-3">
//                   <button
//                     onClick={fetchJobs}
//                     disabled={fetchingJobs}
//                     className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 disabled:bg-orange-300 transition-colors font-medium"
//                   >
//                     {fetchingJobs ? '🔍 Searching...' : '🚀 Fetch JSearch Jobs'}
//                   </button>
                  
//                   {apiJobs.length > 0 && (
//                     <button
//                       onClick={() => importAllJobs('jsearch')}
//                       className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-colors font-medium"
//                     >
//                       📥 Import All ({apiJobs.length})
//                     </button>
//                   )}
//                 </div>

//                 {/* JSearch Results */}
//                 {apiJobs.length > 0 && (
//                   <div className="mt-6">
//                     <h4 className="text-lg font-semibold text-black mb-3">
//                       JSearch Results ({apiJobs.length} jobs found)
//                     </h4>
//                     <div className="grid gap-3 max-h-96 overflow-y-auto">
//                       {apiJobs.map((job) => (
//                         <div key={job.job_id} className="p-3 border border-orange-200 rounded-lg bg-white">
//                           <h5 className="font-medium text-black">{job.job_title}</h5>
//                           <p className="text-sm text-black">{job.employer_name} - {job.job_city}, {job.job_country}</p>
//                           <p className="text-xs text-gray-600 mt-1">{job.job_employment_type}</p>
//                           <button
//                             onClick={() => importJob(job, 'jsearch')}
//                             className="mt-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600 transition-colors"
//                           >
//                             Import This Job
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Adzuna API Section */}
//               <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
//                 <h3 className="text-xl font-semibold text-black mb-4">Adzuna API</h3>
//                 <p className="text-black mb-4">
//                   Adzuna provides 1,000 free requests per day with 50 jobs per request. 
//                   Currently fetches Indian tech jobs automatically.
//                 </p>
                
//                 <div className="flex space-x-3">
//                   <button
//                     onClick={fetchAdzunaJobsHandler}
//                     disabled={fetchingAdzunaJobs}
//                     className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 disabled:bg-blue-300 transition-colors font-medium"
//                   >
//                     {fetchingAdzunaJobs ? '🔍 Searching...' : '🚀 Fetch Adzuna Jobs'}
//                   </button>
                  
//                   {adzunaJobs.length > 0 && (
//                     <button
//                       onClick={() => importAllJobs('adzuna')}
//                       className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-colors font-medium"
//                     >
//                       📥 Import All ({adzunaJobs.length})
//                     </button>
//                   )}
//                 </div>

//                 {/* Adzuna Results */}
//                 {adzunaJobs.length > 0 && (
//                   <div className="mt-6">
//                     <h4 className="text-lg font-semibold text-black mb-3">
//                       Adzuna Results ({adzunaJobs.length} jobs found)
//                     </h4>
//                     <div className="grid gap-3 max-h-96 overflow-y-auto">
//                       {adzunaJobs.map((job) => (
//                         <div key={job.id} className="p-3 border border-blue-200 rounded-lg bg-white">
//                           <h5 className="font-medium text-black">{job.title}</h5>
//                           <p className="text-sm text-black">{job.company.display_name} - {job.location.display_name}</p>
//                           <p className="text-xs text-gray-600 mt-1">
//                             {job.salary_min && job.salary_max 
//                               ? `₹${job.salary_min.toLocaleString()} - ₹${job.salary_max.toLocaleString()}` 
//                               : 'Salary not specified'}
//                           </p>
//                           <button
//                             onClick={() => importJob(job, 'adzuna')}
//                             className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors"
//                           >
//                             Import This Job
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Messages Tab */}
//           {activeTab === 'messages' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">Recent Messages</h2>
//                 <div className="flex items-center space-x-4">
//                   <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                     {messages.length} messages
//                   </span>
//                   <button
//                     onClick={fetchMessages}
//                     className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors"
//                   >
//                     🔄 Refresh
//                   </button>
//                 </div>
//               </div>

//               {messages.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <span className="text-2xl">💬</span>
//                   </div>
//                   <p className="text-black text-lg mb-2">No messages found</p>
//                   <p className="text-gray-600">Users haven't sent any messages yet</p>
//                 </div>
//               ) : (
//                 <div className="grid gap-4 max-h-[600px] overflow-y-auto">
//                   {messages.map(msg => (
//                     <div key={msg.id} className="p-4 border border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
//                       <div className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <p className="text-black mb-2">{msg.text}</p>
//                           <div className="flex items-center space-x-2">
//                             <span className="text-sm text-gray-600">
//                               From: {msg.senderId?.substring(0, 8)}...
//                             </span>
//                             <span className="text-sm text-gray-600">
//                               To: {msg.receiverId?.substring(0, 8)}...
//                             </span>
//                           </div>
//                           <p className="text-xs text-gray-500 mt-1">
//                             {msg.timestamp?.toDate?.().toLocaleString() || 'Unknown time'}
//                           </p>
//                         </div>
//                         <button
//                           onClick={() => handleDeleteJob(msg.id, 'message', 'messages')}
//                           className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Configuration Tab */}
//           {activeTab === 'config' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">Platform Configuration</h2>
//                 <button
//                   onClick={() => setShowConfigModal(true)}
//                   className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
//                 >
//                   ⚙️ Edit Configuration
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200">
//                   <h3 className="text-lg font-semibold text-black mb-4">Subscription Settings</h3>
//                   <div className="space-y-4">
//                     <div>
//                       <p className="text-sm text-gray-600">Launch Date</p>
//                       <p className="text-black font-medium">{configData.launchDate}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Free Period (Months)</p>
//                       <p className="text-black font-medium">{configData.freePeriodMonths}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Free Period Ends</p>
//                       <p className="text-black font-medium">{calculateFreePeriodEnd()}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
//                   <h3 className="text-lg font-semibold text-black mb-4">Platform Status</h3>
//                   <div className="space-y-4">
//                     <div>
//                       <p className="text-sm text-gray-600">Platform Name</p>
//                       <p className="text-black font-medium">{configData.platformName}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Maintenance Mode</p>
//                       <p className={`font-medium ${configData.isMaintenanceMode ? 'text-red-600' : 'text-green-600'}`}>
//                         {configData.isMaintenanceMode ? '🔴 Active' : '🟢 Inactive'}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Current Admins</p>
//                       <p className="text-black font-medium">{admins.length} administrators</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-200">
//                 <h3 className="text-lg font-semibold text-black mb-4">Quick Actions</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <button
//                     onClick={() => {
//                       setConfigData(prev => ({...prev, isMaintenanceMode: !prev.isMaintenanceMode}));
//                       handleSaveConfig();
//                     }}
//                     className={`p-4 rounded-xl text-center font-medium ${
//                       configData.isMaintenanceMode 
//                         ? 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-200'
//                         : 'bg-red-100 text-red-800 border border-red-300 hover:bg-red-200'
//                     }`}
//                   >
//                     {configData.isMaintenanceMode ? 'Disable Maintenance' : 'Enable Maintenance'}
//                   </button>
                  
//                   <button
//                     onClick={() => {
//                       if (confirm('Clear all API imported jobs? This cannot be undone.')) {
//                         // Implementation would go here
//                         setMessage('Feature not implemented yet');
//                       }
//                     }}
//                     className="bg-yellow-100 text-yellow-800 p-4 rounded-xl border border-yellow-300 hover:bg-yellow-200 font-medium"
//                   >
//                     Clear API Jobs
//                   </button>
                  
//                   <button
//                     onClick={() => {
//                       if (confirm('Reset all user notifications? This cannot be undone.')) {
//                         // Implementation would go here
//                         setMessage('Feature not implemented yet');
//                       }
//                     }}
//                     className="bg-purple-100 text-purple-800 p-4 rounded-xl border border-purple-300 hover:bg-purple-200 font-medium"
//                   >
//                     Reset Notifications
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* User Edit Modal */}
//       {showUserEditModal && editingUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-md">
//             <h3 className="text-xl font-bold text-black mb-4">Edit User: {editingUser.displayName}</h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-black mb-1">Display Name</label>
//                 <input
//                   type="text"
//                   value={editingUser.displayName || ''}
//                   onChange={(e) => setEditingUser({...editingUser, displayName: e.target.value})}
//                   className="w-full p-2 border border-gray-300 rounded-lg"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-black mb-1">Email</label>
//                 <input
//                   type="email"
//                   value={editingUser.email || ''}
//                   onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
//                   className="w-full p-2 border border-gray-300 rounded-lg"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-black mb-1">Headline</label>
//                 <input
//                   type="text"
//                   value={editingUser.headline || ''}
//                   onChange={(e) => setEditingUser({...editingUser, headline: e.target.value})}
//                   className="w-full p-2 border border-gray-300 rounded-lg"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-black mb-1">Phone Number</label>
//                 <input
//                   type="text"
//                   value={editingUser.phoneNumber || ''}
//                   onChange={(e) => setEditingUser({...editingUser, phoneNumber: e.target.value})}
//                   className="w-full p-2 border border-gray-300 rounded-lg"
//                 />
//               </div>
//             </div>
//             <div className="flex justify-end space-x-3 mt-6">
//               <button
//                 onClick={() => {
//                   setShowUserEditModal(false);
//                   setEditingUser(null);
//                 }}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleSaveUser(editingUser)}
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Config Modal */}
//       {showConfigModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-md">
//             <h3 className="text-xl font-bold text-black mb-4">Platform Configuration</h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-black mb-1">Launch Date</label>
//                 <input
//                   type="date"
//                   value={configData.launchDate}
//                   onChange={(e) => setConfigData({...configData, launchDate: e.target.value})}
//                   className="w-full p-2 border border-gray-300 rounded-lg"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-black mb-1">Free Period (Months)</label>
//                 <input
//                   type="number"
//                   value={configData.freePeriodMonths}
//                   onChange={(e) => setConfigData({...configData, freePeriodMonths: parseInt(e.target.value) || 3})}
//                   className="w-full p-2 border border-gray-300 rounded-lg"
//                   min="1"
//                   max="12"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-black mb-1">Platform Name</label>
//                 <input
//                   type="text"
//                   value={configData.platformName}
//                   onChange={(e) => setConfigData({...configData, platformName: e.target.value})}
//                   className="w-full p-2 border border-gray-300 rounded-lg"
//                 />
//               </div>
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id="maintenance"
//                   checked={configData.isMaintenanceMode}
//                   onChange={(e) => setConfigData({...configData, isMaintenanceMode: e.target.checked})}
//                   className="mr-2"
//                 />
//                 <label htmlFor="maintenance" className="text-black">Enable Maintenance Mode</label>
//               </div>
//             </div>
//             <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//               <p className="text-sm text-blue-800">
//                 <strong>Free Period End:</strong> {calculateFreePeriodEnd()}
//               </p>
//               <p className="text-sm text-blue-800 mt-1">
//                 All users can post referral jobs for free until this date.
//               </p>
//             </div>
//             <div className="flex justify-end space-x-3 mt-6">
//               <button
//                 onClick={() => setShowConfigModal(false)}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSaveConfig}
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
//               >
//                 Save Configuration
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Main Admin Dashboard Component with Error Boundary
// export default function AdminDashboard() {
//   return (
//     <ErrorBoundary 
//       fallback={<ErrorFallback error={new Error('Admin dashboard failed to load')} resetErrorBoundary={() => window.location.reload()} />}
//     >
//       <AdminDashboardContent />
//     </ErrorBoundary>
//   );
// }


// here is the main working code 

// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { signOut } from 'firebase/auth';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import NotificationsDropdown from '@/components/NotificationsDropdown';
// import TestMessageButton from '@/components/TestMessageButton';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';
// import { getProfileViewsCount } from '@/lib/profileViews';

// function DashboardContent() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [userJobs, setUserJobs] = useState<any[]>([]);
//   const [profileViewsCount, setProfileViewsCount] = useState(0);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [loadingViews, setLoadingViews] = useState(true);

//   // Debug logging
//   console.log('Dashboard - User state:', { 
//     user: !!user, 
//     loading, 
//     uid: user?.uid,
//     email: user?.email 
//   });

//   useEffect(() => {
//     if (!loading && !user) {
//       console.log('No user found, redirecting to login');
//       router.push('/login');
//     }
//   }, [user, loading, router]);

//   useEffect(() => {
//     async function fetchUserData() {
//       if (user) {
//         console.log('Fetching data for user:', user.uid);
//         try {
//           // Fetch user's jobs
//           const jobsRef = collection(db, 'jobs');
//           const q = query(jobsRef, where('postedBy', '==', user.uid));
//           const querySnapshot = await getDocs(q);
          
//           const jobs: any[] = [];
//           querySnapshot.forEach((doc) => {
//             jobs.push({ id: doc.id, ...doc.data() });
//           });
          
//           setUserJobs(jobs);
//           console.log('User jobs:', jobs.length);

//           // Fetch profile views
//           const viewsCount = await getProfileViewsCount(user.uid);
//           setProfileViewsCount(viewsCount);
//           console.log('Profile views:', viewsCount);
          
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         } finally {
//           setLoadingJobs(false);
//           setLoadingViews(false);
//         }
//       }
//     }

//     if (user) {
//       fetchUserData();
//     }
//   }, [user]);

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       router.push('/');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   if (loading) {
//     console.log('Dashboard loading...');
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
//           <p className="mt-4 text-black">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }
  
//   if (!user) {
//     console.log('No user, showing nothing');
//     return null;
//   }

//   console.log('Rendering dashboard for user:', user.email);

//   return (
//     <div className="min-h-screen bg-white">
//       <header className="bg-white border-b border-orange-200 p-4">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div className="flex items-center">
//             <h1 className="text-2xl font-bold text-black">ALL Dashboard</h1>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <NotificationsDropdown />
            
//             <div className="flex items-center">
//               {user.photoURL && (
//                 <img 
//                   src={user.photoURL} 
//                   alt="Profile" 
//                   className="w-8 h-8 rounded-full mr-2 border border-orange-500" 
//                 />
//               )}
//               <span className="text-black text-sm">{user.displayName}</span>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="p-6">
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-orange-200">
//             <h1 className="text-3xl font-bold text-black mb-2">
//               Welcome back, {user.displayName}! 👋
//             </h1>
//             <p className="text-black">Manage your professional journey on ALL Platform</p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//               <h2 className="text-xl font-semibold text-black mb-4 border-b border-orange-200 pb-2">
//                 Your Profile
//               </h2>
//               <div className="flex items-center mb-4">
//                 {user.photoURL && (
//                   <img 
//                     src={user.photoURL} 
//                     alt="Profile" 
//                     className="w-16 h-16 rounded-full mr-4 border-2 border-orange-500" 
//                   />
//                 )}
//                 <div>
//                   <p className="text-black font-medium">{user.displayName}</p>
//                   <p className="text-black text-sm">{user.email}</p>
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-2 gap-3 mb-4">
//                 <div className="bg-orange-100 rounded-lg p-3 text-center">
//                   <div className="text-lg font-bold text-orange-600">{userJobs.length}</div>
//                   <div className="text-xs text-black">Jobs Posted</div>
//                 </div>
//                 <div className="bg-orange-100 rounded-lg p-3 text-center">
//                   <div className="text-lg font-bold text-orange-600">
//                     {loadingViews ? '...' : profileViewsCount}
//                   </div>
//                   <div className="text-xs text-black">Profile Views</div>
//                 </div>
//               </div>

//               <div className="bg-orange-100 rounded-lg p-3 mt-4">
//                 <p className="text-xs text-black">
//                   <span className="font-medium">User ID:</span> {user.uid.substring(0, 10)}...
//                 </p>
//               </div>
//             </div>

//             {/* QUICK ACTIONS CARD */}
//             <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//               <h2 className="text-xl font-semibold text-black mb-4 border-b border-orange-200 pb-2">
//                 Quick Actions
//               </h2>
//               <div className="grid grid-cols-1 gap-3">
//                 <button 
//                   onClick={() => router.push('/dashboard/edit-profile')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">✏️</span>
//                   <span>Edit Profile</span>
//                 </button>

//                 <button 
//                   onClick={() => router.push('/dashboard/post-job')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">📝</span>
//                   <span>Post Job</span>
//                 </button>

//                 {userJobs.length > 0 && (
//                   <button 
//                     onClick={() => router.push('/dashboard/company')}
//                     className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                   >
//                     <span className="mr-2">🏢</span>
//                     <span>Company Dashboard</span>
//                   </button>
//                 )}

//                 <button 
//                   onClick={() => router.push('/dashboard/applications')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">📋</span>
//                   <span>My Applications</span>
//                 </button>

//                 <button 
//                   onClick={() => router.push('/dashboard/profile-views')}
//                   className="flex items-center justify-between px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200 group"
//                 >
//                   <div className="flex items-center">
//                     <span className="mr-2">👁️</span>
//                     <span>Profile Views</span>
//                   </div>
//                   {!loadingViews && profileViewsCount > 0 && (
//                     <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium group-hover:bg-orange-600">
//                       {profileViewsCount}
//                     </span>
//                   )}
//                 </button>

//                 <button 
//                   onClick={() => router.push('/jobs')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">🔍</span>
//                   <span>Browse Jobs</span>
//                 </button>

//                 <button 
//                   onClick={() => router.push('/network')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">🌐</span>
//                   <span>Browse Network</span>
//                 </button>

//                 <button 
//                   onClick={() => router.push('/dashboard/messages')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">💬</span>
//                   <span>Messages</span>
//                 </button>

//                 {/* REFERRAL MARKETPLACE BUTTON */}
//                 <button 
//                   onClick={() => router.push('/referral')}
//                   className="flex items-center px-4 py-3 bg-white border border-orange-500 rounded-xl text-black hover:bg-orange-100 transition-all duration-200"
//                 >
//                   <span className="mr-2">🤝</span>
//                   <span>Referral Marketplace</span>
//                 </button>

//                 <TestMessageButton />
                
//                 <button 
//                   onClick={handleSignOut}
//                   className="flex items-center px-4 py-3 bg-orange-500 text-white border border-orange-500 rounded-xl hover:bg-orange-600 transition-all duration-200 mt-2"
//                 >
//                   <span className="mr-2">🚪</span>
//                   <span>Sign Out</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {userJobs.length === 0 && (
//             <div className="bg-white rounded-2xl p-6 mt-6 shadow-lg border border-orange-200">
//               <div className="text-center">
//                 <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500">
//                   <span className="text-2xl">🏢</span>
//                 </div>
//                 <h3 className="text-xl font-semibold text-black mb-2">For Employers and Businesses</h3>
//                 <p className="text-black mb-4">
//                   <strong>Post your first job to unlock the Company Dashboard!</strong>
//                 </p>
                
//                 <div className="bg-orange-100 rounded-xl p-4 mb-5 text-left border border-orange-200">
//                   <p className="text-black font-medium mb-2">With the Company Dashboard, you can:</p>
//                   <ul className="text-black list-disc list-inside space-y-1 text-sm">
//                     <li>View analytics on your job posts</li>
//                     <li>Manage applications received</li>
//                     <li>Track candidate pipelines</li>
//                     <li>Manage multiple job postings</li>
//                   </ul>
//                 </div>
                
//                 <button 
//                   onClick={() => router.push('/dashboard/post-job')}
//                   className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-all duration-200"
//                 >
//                   🚀 Post Your First Job
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function Dashboard() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Dashboard failed to load">
//       <DashboardContent />
//     </ClientErrorBoundary>
//   );
// }

// main worjking one -----------------------------------------------------------------------------------

// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { signOut } from 'firebase/auth';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import NotificationsDropdown from '@/components/NotificationsDropdown';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';
// import { getProfileViewsCount } from '@/lib/profileViews';
// import Link from 'next/link';

// function DashboardContent() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [userJobs, setUserJobs] = useState<any[]>([]);
//   const [profileViewsCount, setProfileViewsCount] = useState(0);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [loadingViews, setLoadingViews] = useState(true);

//   // LOGIC PRESERVED: Debug logging
//   console.log('Dashboard - User state:', { 
//     user: !!user, 
//     loading, 
//     uid: user?.uid,
//     email: user?.email 
//   });

//   // LOGIC PRESERVED: Auth check
//   useEffect(() => {
//     if (!loading && !user) {
//       console.log('No user found, redirecting to login');
//       router.push('/login');
//     }
//   }, [user, loading, router]);

//   // LOGIC PRESERVED: Data fetching
//   useEffect(() => {
//     async function fetchUserData() {
//       if (user) {
//         console.log('Fetching data for user:', user.uid);
//         try {
//           // Fetch user's jobs
//           const jobsRef = collection(db, 'jobs');
//           const q = query(jobsRef, where('postedBy', '==', user.uid));
//           const querySnapshot = await getDocs(q);
          
//           const jobs: any[] = [];
//           querySnapshot.forEach((doc) => {
//             jobs.push({ id: doc.id, ...doc.data() });
//           });
          
//           setUserJobs(jobs);
//           console.log('User jobs:', jobs.length);

//           // Fetch profile views
//           const viewsCount = await getProfileViewsCount(user.uid);
//           setProfileViewsCount(viewsCount);
//           console.log('Profile views:', viewsCount);
          
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         } finally {
//           setLoadingJobs(false);
//           setLoadingViews(false);
//         }
//       }
//     }

//     if (user) {
//       fetchUserData();
//     }
//   }, [user]);

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       router.push('/');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   // LOGIC PRESERVED: Loading State
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
//         <div className="w-12 h-12 border-4 border-neutral-100 border-t-orange-600 rounded-full animate-spin"></div>
//         <p className="text-neutral-500 font-medium">Loading Dashboard...</p>
//       </div>
//     );
//   }
  
//   // LOGIC PRESERVED: No user check
//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-neutral-50">
//       {/* Header - Professional & Clean */}
//       <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
//           {/* LOGO FIXED: Just Orange Text */}
//           <Link href="/" className="flex items-center gap-3 group">
//             <span className="text-3xl font-black text-orange-600 tracking-tighter">ALL</span>
//             <span className="text-lg font-bold text-neutral-300">|</span>
//             <span className="text-lg font-bold text-black tracking-tight">Dashboard</span>
//           </Link>
          
//           <div className="flex items-center gap-6">
//             <NotificationsDropdown />
            
//             <div className="flex items-center gap-3 pl-6 border-l border-neutral-100">
//               <div className="text-right hidden md:block">
//                 <p className="text-sm font-bold text-black">{user.displayName}</p>
//                 <p className="text-xs text-neutral-500">Professional Account</p>
//               </div>
//               {user.photoURL ? (
//                 <img 
//                   src={user.photoURL} 
//                   alt="Profile" 
//                   className="w-10 h-10 rounded-full border-2 border-white shadow-sm" 
//                 />
//               ) : (
//                 <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
//                   {user.displayName?.charAt(0)}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Welcome Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-black tracking-tight mb-2">
//             Welcome back, {user.displayName?.split(' ')[0]} 👋
//           </h1>
//           <p className="text-neutral-500">Here's what's happening with your professional profile today.</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
//           {/* LEFT COLUMN: Profile & Stats */}
//           <div className="space-y-6">
//             {/* Stats Card */}
//             <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="font-bold text-black">Profile Overview</h2>
//                 <button 
//                   onClick={() => router.push('/dashboard/edit-profile')}
//                   className="text-xs font-bold text-orange-600 hover:text-orange-700 uppercase tracking-wide"
//                 >
//                   Edit
//                 </button>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 {/* PROFILE VIEWS FIXED: Now Clickable with Details Link */}
//                 <button 
//                   onClick={() => router.push('/dashboard/profile-views')}
//                   className="p-4 bg-orange-50 rounded-xl border border-orange-100 text-left hover:bg-orange-100 transition-colors group"
//                 >
//                   <div className="flex justify-between items-start">
//                     <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Profile Views</p>
//                     <span className="text-xs text-orange-400 group-hover:translate-x-1 transition-transform">→</span>
//                   </div>
//                   <p className="text-3xl font-black text-black">
//                     {loadingViews ? '-' : profileViewsCount}
//                   </p>
//                   <p className="text-[10px] text-orange-400 mt-1 font-medium">View Details</p>
//                 </button>

//                 <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
//                   <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Jobs Posted</p>
//                   <p className="text-3xl font-black text-black">{userJobs.length}</p>
//                 </div>
//               </div>

//               <div className="mt-6 pt-6 border-t border-neutral-100">
//                 <div className="flex justify-between items-center text-sm">
//                   <span className="text-neutral-500">Account Status</span>
//                   <span className="flex items-center gap-2 text-green-600 font-medium">
//                     <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//                     Active
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Navigation - List Style */}
//             <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
//               <div className="p-4 bg-neutral-50 border-b border-neutral-200">
//                 <h3 className="font-bold text-black text-sm uppercase tracking-wide">Shortcuts</h3>
//               </div>
//               <div className="divide-y divide-neutral-100">
//                 <button onClick={() => router.push('/dashboard/applications')} className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left group">
//                   <span className="text-neutral-600 font-medium group-hover:text-black">My Applications</span>
//                   <span className="text-neutral-300 group-hover:text-orange-600">→</span>
//                 </button>
//                 <button onClick={() => router.push('/dashboard/messages')} className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left group">
//                   <span className="text-neutral-600 font-medium group-hover:text-black">Messages</span>
//                   <span className="text-neutral-300 group-hover:text-orange-600">→</span>
//                 </button>
//                 {userJobs.length > 0 && (
//                   <button onClick={() => router.push('/dashboard/company')} className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left group">
//                     <span className="text-neutral-600 font-medium group-hover:text-black">Company Dashboard</span>
//                     <span className="text-neutral-300 group-hover:text-orange-600">→</span>
//                   </button>
//                 )}
//                 <button onClick={handleSignOut} className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors text-left group">
//                   <span className="text-neutral-600 font-medium group-hover:text-red-600">Sign Out</span>
//                   <span className="text-neutral-300 group-hover:text-red-600">→</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN: Action Grid */}
//           <div className="lg:col-span-2 space-y-6">
            
//             {/* Primary Actions Grid */}
//             <div className="grid sm:grid-cols-2 gap-4">
//               {/* Card 1: Find Jobs */}
//               <button 
//                 onClick={() => router.push('/jobs')}
//                 className="group relative p-6 bg-black rounded-2xl text-left overflow-hidden hover:shadow-xl transition-all duration-300"
//               >
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
//                 <div className="relative z-10">
//                   <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl mb-4 text-white group-hover:scale-110 transition-transform">
//                     🔍
//                   </div>
//                   <h3 className="text-xl font-bold text-white mb-1">Find Work</h3>
//                   <p className="text-neutral-400 text-sm">Browse latest opportunities</p>
//                 </div>
//               </button>

//               {/* Card 2: Network */}
//               <button 
//                 onClick={() => router.push('/network')}
//                 className="group p-6 bg-white border border-neutral-200 rounded-2xl text-left hover:border-orange-500 hover:shadow-lg transition-all duration-300"
//               >
//                 <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl mb-4 text-orange-600 group-hover:scale-110 transition-transform">
//                   🌐
//                 </div>
//                 <h3 className="text-xl font-bold text-black mb-1">Grow Network</h3>
//                 <p className="text-neutral-500 text-sm">Connect with professionals</p>
//               </button>

//               {/* Card 3: Referral */}
//               <button 
//                 onClick={() => router.push('/referral')}
//                 className="group p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl text-left hover:shadow-xl transition-all duration-300"
//               >
//                 <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mb-4 text-white group-hover:scale-110 transition-transform">
//                   🤝
//                 </div>
//                 <h3 className="text-xl font-bold text-white mb-1">Get Referred</h3>
//                 <p className="text-orange-100 text-sm">Direct employee connections</p>
//               </button>

//               {/* Card 4: Post Job */}
//               <button 
//                 onClick={() => router.push('/dashboard/post-job')}
//                 className="group p-6 bg-white border border-neutral-200 rounded-2xl text-left hover:border-black hover:shadow-lg transition-all duration-300"
//               >
//                 <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center text-2xl mb-4 text-black group-hover:scale-110 transition-transform">
//                   📝
//                 </div>
//                 <h3 className="text-xl font-bold text-black mb-1">Post a Job</h3>
//                 <p className="text-neutral-500 text-sm">Hire talent for free</p>
//               </button>
//             </div>

//             {/* Empty State / Employer CTA */}
//             {userJobs.length === 0 && (
//               <div className="bg-white rounded-2xl p-8 border border-neutral-200 text-center relative overflow-hidden">
//                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
//                 <div className="max-w-md mx-auto relative z-10">
//                   <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
//                     🏢
//                   </div>
//                   <h3 className="text-2xl font-bold text-black mb-3">Hiring? Unlock the Dashboard.</h3>
//                   <p className="text-neutral-500 mb-8 leading-relaxed">
//                     Post your first job to unlock powerful analytics, candidate tracking, and pipeline management tools. It takes less than 2 minutes.
//                   </p>
//                   <button 
//                     onClick={() => router.push('/dashboard/post-job')}
//                     className="px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg"
//                   >
//                     Post Your First Job
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function Dashboard() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Dashboard failed to load">
//       <DashboardContent />
//     </ClientErrorBoundary>
//   );
// }

// ---------------------------- check above 

// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { signOut } from 'firebase/auth';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import NotificationsDropdown from '@/components/NotificationsDropdown';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';
// import { getProfileViewsCount } from '@/lib/profileViews';
// import Link from 'next/link';
// import { useCurrentUserOnlineStatus } from '@/hooks/useOnlineStatus'; // NEW IMPORT

// function DashboardContent() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [userJobs, setUserJobs] = useState<any[]>([]);
//   const [profileViewsCount, setProfileViewsCount] = useState(0);
//   const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [loadingViews, setLoadingViews] = useState(true);
  
//   // NEW: Get current user's online status
//   const { isOnline } = useCurrentUserOnlineStatus();

//   // LOGIC PRESERVED: Debug logging
//   console.log('Dashboard - User state:', { 
//     user: !!user, 
//     loading, 
//     uid: user?.uid,
//     email: user?.email 
//   });

//   // LOGIC PRESERVED: Auth check
//   useEffect(() => {
//     if (!loading && !user) {
//       console.log('No user found, redirecting to login');
//       router.push('/login');
//     }
//   }, [user, loading, router]);

//   // LOGIC PRESERVED: Data fetching
//   useEffect(() => {
//     async function fetchUserData() {
//       if (user) {
//         console.log('Fetching data for user:', user.uid);
//         try {
//           // Fetch user's jobs
//           const jobsRef = collection(db, 'jobs');
//           const q = query(jobsRef, where('postedBy', '==', user.uid));
//           const querySnapshot = await getDocs(q);
          
//           const jobs: any[] = [];
//           querySnapshot.forEach((doc) => {
//             jobs.push({ id: doc.id, ...doc.data() });
//           });
          
//           setUserJobs(jobs);
//           console.log('User jobs:', jobs.length);

//           // Fetch profile views
//           const viewsCount = await getProfileViewsCount(user.uid);
//           setProfileViewsCount(viewsCount);
//           console.log('Profile views:', viewsCount);
          
//           // Fetch pending connection requests count
//           const connectionsRef = collection(db, 'connections');
//           const pendingQuery = query(
//             connectionsRef, 
//             where('toUser', '==', user.uid), 
//             where('status', '==', 'pending')
//           );
//           const pendingSnapshot = await getDocs(pendingQuery);
//           setPendingRequestsCount(pendingSnapshot.size);
//           console.log('Pending connection requests:', pendingSnapshot.size);
          
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         } finally {
//           setLoadingJobs(false);
//           setLoadingViews(false);
//         }
//       }
//     }

//     if (user) {
//       fetchUserData();
//     }
//   }, [user]);

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       router.push('/');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   // LOGIC PRESERVED: Loading State
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
//         <div className="w-12 h-12 border-4 border-neutral-100 border-t-orange-600 rounded-full animate-spin"></div>
//         <p className="text-neutral-500 font-medium">Loading Dashboard...</p>
//       </div>
//     );
//   }
  
//   // LOGIC PRESERVED: No user check
//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-neutral-50">
//       {/* Header - Professional & Clean */}
//       <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
//           {/* LOGO FIXED: Just Orange Text */}
//           <Link href="/" className="flex items-center gap-3 group">
//             <span className="text-3xl font-black text-orange-600 tracking-tighter">ALL</span>
//             <span className="text-lg font-bold text-neutral-300">|</span>
//             <span className="text-lg font-bold text-black tracking-tight">Dashboard</span>
//           </Link>
          
//           <div className="flex items-center gap-6">
//             <NotificationsDropdown />
            
//             <div className="flex items-center gap-3 pl-6 border-l border-neutral-100">
//               <div className="text-right hidden md:block">
//                 <p className="text-sm font-bold text-black">{user.displayName}</p>
//                 <div className="flex items-center gap-1">
//                   {/* NEW: Online status indicator */}
//                   <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-neutral-400'}`}></span>
//                   <p className="text-xs text-neutral-500">
//                     {isOnline ? 'Online now' : 'Offline'}
//                   </p>
//                 </div>
//               </div>
//               {user.photoURL ? (
//                 <img 
//                   src={user.photoURL} 
//                   alt="Profile" 
//                   className="w-10 h-10 rounded-full border-2 border-white shadow-sm" 
//                 />
//               ) : (
//                 <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
//                   {user.displayName?.charAt(0)}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Welcome Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-black tracking-tight mb-2">
//             Welcome back, {user.displayName?.split(' ')[0]} 👋
//           </h1>
//           <p className="text-neutral-500">Here's what's happening with your professional profile today.</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
//           {/* LEFT COLUMN: Profile & Stats */}
//           <div className="space-y-6">
//             {/* Stats Card */}
//             <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="font-bold text-black">Profile Overview</h2>
//                 <button 
//                   onClick={() => router.push('/dashboard/edit-profile')}
//                   className="text-xs font-bold text-orange-600 hover:text-orange-700 uppercase tracking-wide"
//                 >
//                   Edit
//                 </button>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 {/* PROFILE VIEWS FIXED: Now Clickable with Details Link */}
//                 <button 
//                   onClick={() => router.push('/dashboard/profile-views')}
//                   className="p-4 bg-orange-50 rounded-xl border border-orange-100 text-left hover:bg-orange-100 transition-colors group"
//                 >
//                   <div className="flex justify-between items-start">
//                     <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Profile Views</p>
//                     <span className="text-xs text-orange-400 group-hover:translate-x-1 transition-transform">→</span>
//                   </div>
//                   <p className="text-3xl font-black text-black">
//                     {loadingViews ? '-' : profileViewsCount}
//                   </p>
//                   <p className="text-[10px] text-orange-400 mt-1 font-medium">View Details</p>
//                 </button>

//                 <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
//                   <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Jobs Posted</p>
//                   <p className="text-3xl font-black text-black">{userJobs.length}</p>
//                 </div>
//               </div>

//               <div className="mt-6 pt-6 border-t border-neutral-100">
//                 <div className="flex justify-between items-center text-sm">
//                   <span className="text-neutral-500">Account Status</span>
//                   <span className="flex items-center gap-2 text-green-600 font-medium">
//                     <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//                     Active
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Navigation - List Style */}
//             <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
//               <div className="p-4 bg-neutral-50 border-b border-neutral-200">
//                 <h3 className="font-bold text-black text-sm uppercase tracking-wide">Shortcuts</h3>
//               </div>
//               <div className="divide-y divide-neutral-100">
//                 <button onClick={() => router.push('/dashboard/applications')} className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left group">
//                   <span className="text-neutral-600 font-medium group-hover:text-black">My Applications</span>
//                   <span className="text-neutral-300 group-hover:text-orange-600">→</span>
//                 </button>
//                 <button onClick={() => router.push('/dashboard/messages')} className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left group">
//                   <span className="text-neutral-600 font-medium group-hover:text-black">Messages</span>
//                   <span className="text-neutral-300 group-hover:text-orange-600">→</span>
//                 </button>
//                 {/* Connection Requests Button with Notification Badge */}
//                 <button onClick={() => router.push('/dashboard/connections')} className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left group relative">
//                   <span className="text-neutral-600 font-medium group-hover:text-black">Connection Requests</span>
//                   <div className="flex items-center gap-2">
//                     {/* Notification badge for pending requests */}
//                     {pendingRequestsCount > 0 && (
//                       <span className="bg-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
//                         {pendingRequestsCount}
//                       </span>
//                     )}
//                     <span className="text-neutral-300 group-hover:text-orange-600">→</span>
//                   </div>
//                 </button>
//                 {userJobs.length > 0 && (
//                   <button onClick={() => router.push('/dashboard/company')} className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left group">
//                     <span className="text-neutral-600 font-medium group-hover:text-black">Company Dashboard</span>
//                     <span className="text-neutral-300 group-hover:text-orange-600">→</span>
//                   </button>
//                 )}
//                 <button onClick={handleSignOut} className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors text-left group">
//                   <span className="text-neutral-600 font-medium group-hover:text-red-600">Sign Out</span>
//                   <span className="text-neutral-300 group-hover:text-red-600">→</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN: Action Grid */}
//           <div className="lg:col-span-2 space-y-6">
            
//             {/* Primary Actions Grid */}
//             <div className="grid sm:grid-cols-2 gap-4">
//               {/* Card 1: Find Jobs */}
//               <button 
//                 onClick={() => router.push('/jobs')}
//                 className="group relative p-6 bg-black rounded-2xl text-left overflow-hidden hover:shadow-xl transition-all duration-300"
//               >
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
//                 <div className="relative z-10">
//                   <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl mb-4 text-white group-hover:scale-110 transition-transform">
//                     🔍
//                   </div>
//                   <h3 className="text-xl font-bold text-white mb-1">Find Work</h3>
//                   <p className="text-neutral-400 text-sm">Browse latest opportunities</p>
//                 </div>
//               </button>

//               {/* Card 2: Network */}
//               <button 
//                 onClick={() => router.push('/network')}
//                 className="group p-6 bg-white border border-neutral-200 rounded-2xl text-left hover:border-orange-500 hover:shadow-lg transition-all duration-300"
//               >
//                 <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl mb-4 text-orange-600 group-hover:scale-110 transition-transform">
//                   🌐
//                 </div>
//                 <h3 className="text-xl font-bold text-black mb-1">Grow Network</h3>
//                 <p className="text-neutral-500 text-sm">Connect with professionals</p>
//               </button>

//               {/* Card 3: Referral */}
//               <button 
//                 onClick={() => router.push('/referral')}
//                 className="group p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl text-left hover:shadow-xl transition-all duration-300"
//               >
//                 <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mb-4 text-white group-hover:scale-110 transition-transform">
//                   🤝
//                 </div>
//                 <h3 className="text-xl font-bold text-white mb-1">Get Referred</h3>
//                 <p className="text-orange-100 text-sm">Direct employee connections</p>
//               </button>

//               {/* Card 4: Post Job */}
//               <button 
//                 onClick={() => router.push('/dashboard/post-job')}
//                 className="group p-6 bg-white border border-neutral-200 rounded-2xl text-left hover:border-black hover:shadow-lg transition-all duration-300"
//               >
//                 <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center text-2xl mb-4 text-black group-hover:scale-110 transition-transform">
//                   📝
//                 </div>
//                 <h3 className="text-xl font-bold text-black mb-1">Post a Job</h3>
//                 <p className="text-neutral-500 text-sm">Hire talent for free</p>
//               </button>
//             </div>

//             {/* Empty State / Employer CTA */}
//             {userJobs.length === 0 && (
//               <div className="bg-white rounded-2xl p-8 border border-neutral-200 text-center relative overflow-hidden">
//                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
//                 <div className="max-w-md mx-auto relative z-10">
//                   <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
//                     🏢
//                   </div>
//                   <h3 className="text-2xl font-bold text-black mb-3">Hiring? Unlock the Dashboard.</h3>
//                   <p className="text-neutral-500 mb-8 leading-relaxed">
//                     Post your first job to unlock powerful analytics, candidate tracking, and pipeline management tools. It takes less than 2 minutes.
//                   </p>
//                   <button 
//                     onClick={() => router.push('/dashboard/post-job')}
//                     className="px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg"
//                   >
//                     Post Your First Job
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function Dashboard() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Dashboard failed to load">
//       <DashboardContent />
//     </ClientErrorBoundary>
//   );
// }

// ------------------------------  working one --------------------------------

// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { signOut } from 'firebase/auth';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import NotificationsDropdown from '@/components/NotificationsDropdown';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';
// import { getProfileViewsCount } from '@/lib/profileViews';
// import Link from 'next/link';
// import { useCurrentUserOnlineStatus } from '@/hooks/useOnlineStatus'; // NEW IMPORT

// function DashboardContent() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [userJobs, setUserJobs] = useState<any[]>([]);
//   const [profileViewsCount, setProfileViewsCount] = useState(0);
//   const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [loadingViews, setLoadingViews] = useState(true);
  
//   // NEW: Get current user's online status
//   const { isOnline, refresh, debugLogs } = useCurrentUserOnlineStatus();

//   // LOGIC PRESERVED: Debug logging
//   console.log('Dashboard - User state:', { 
//     user: !!user, 
//     loading, 
//     uid: user?.uid,
//     email: user?.email 
//   });

//   // LOGIC PRESERVED: Auth check
//   useEffect(() => {
//     if (!loading && !user) {
//       console.log('No user found, redirecting to login');
//       router.push('/login');
//     }
//   }, [user, loading, router]);

//   // LOGIC PRESERVED: Data fetching
//   useEffect(() => {
//     async function fetchUserData() {
//       if (user) {
//         console.log('Fetching data for user:', user.uid);
//         try {
//           // Fetch user's jobs
//           const jobsRef = collection(db, 'jobs');
//           const q = query(jobsRef, where('postedBy', '==', user.uid));
//           const querySnapshot = await getDocs(q);
          
//           const jobs: any[] = [];
//           querySnapshot.forEach((doc) => {
//             jobs.push({ id: doc.id, ...doc.data() });
//           });
          
//           setUserJobs(jobs);
//           console.log('User jobs:', jobs.length);

//           // Fetch profile views
//           const viewsCount = await getProfileViewsCount(user.uid);
//           setProfileViewsCount(viewsCount);
//           console.log('Profile views:', viewsCount);
          
//           // Fetch pending connection requests count
//           const connectionsRef = collection(db, 'connections');
//           const pendingQuery = query(
//             connectionsRef, 
//             where('toUser', '==', user.uid), 
//             where('status', '==', 'pending')
//           );
//           const pendingSnapshot = await getDocs(pendingQuery);
//           setPendingRequestsCount(pendingSnapshot.size);
//           console.log('Pending connection requests:', pendingSnapshot.size);
          
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         } finally {
//           setLoadingJobs(false);
//           setLoadingViews(false);
//         }
//       }
//     }

//     if (user) {
//       fetchUserData();
//     }
//   }, [user]);

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       router.push('/');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   // Test online status manually
//   const handleTestOnlineStatus = async () => {
//     if (user?.uid) {
//       console.log('🔄 Manual online status test');
//       const result = await refresh();
//       console.log('Test result:', result);
      
//       if (result !== false) {
//         alert(`Test completed!\nOnline: ${result ? 'YES' : 'NO'}`);
//       } else {
//         alert('Test failed - check console for details');
//       }
//     }
//   };

//   // LOGIC PRESERVED: Loading State
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
//         <div className="w-12 h-12 border-4 border-neutral-100 border-t-orange-600 rounded-full animate-spin"></div>
//         <p className="text-neutral-500 font-medium">Loading Dashboard...</p>
//       </div>
//     );
//   }
  
//   // LOGIC PRESERVED: No user check
//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-neutral-50">
//       {/* Header - Professional & Clean */}
//       <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
//           {/* LOGO FIXED: Just Orange Text */}
//           <Link href="/" className="flex items-center gap-3 group">
//             <span className="text-3xl font-black text-orange-600 tracking-tighter">ALL</span>
//             <span className="text-lg font-bold text-neutral-300">|</span>
//             <span className="text-lg font-bold text-black tracking-tight">Dashboard</span>
//           </Link>
          
//           <div className="flex items-center gap-4">
//             {/* Test button - visible for debugging */}
//             <button
//               onClick={handleTestOnlineStatus}
//               className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
//             >
//               Test Online
//             </button>
            
//             <NotificationsDropdown />
            
//             <div className="flex items-center gap-3 pl-6 border-l border-neutral-100">
//               <div className="text-right hidden md:block">
//                 <p className="text-sm font-bold text-black">{user.displayName}</p>
//                 <div className="flex items-center gap-1">
//                   {/* NEW: Online status indicator */}
//                   <span 
//                     className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-neutral-400'}`}
//                     title={isOnline ? 'Online now' : 'Offline'}
//                   ></span>
//                   <p className="text-xs text-neutral-500">
//                     {isOnline ? 'Online now' : 'Offline'}
//                   </p>
//                 </div>
//               </div>
//               {user.photoURL ? (
//                 <img 
//                   src={user.photoURL} 
//                   alt="Profile" 
//                   className="w-10 h-10 rounded-full border-2 border-white shadow-sm" 
//                 />
//               ) : (
//                 <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
//                   {user.displayName?.charAt(0)}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Welcome Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-black tracking-tight mb-2">
//             Welcome back, {user.displayName?.split(' ')[0]} 👋
//           </h1>
//           <p className="text-neutral-500">Here's what's happening with your professional profile today.</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
//           {/* LEFT COLUMN: Profile & Stats */}
//           <div className="space-y-6">
//             {/* Stats Card */}
//             <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="font-bold text-black">Profile Overview</h2>
//                 <button 
//                   onClick={() => router.push('/dashboard/edit-profile')}
//                   className="text-xs font-bold text-orange-600 hover:text-orange-700 uppercase tracking-wide"
//                 >
//                   Edit
//                 </button>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 {/* PROFILE VIEWS FIXED: Now Clickable with Details Link */}
//                 <button 
//                   onClick={() => router.push('/dashboard/profile-views')}
//                   className="p-4 bg-orange-50 rounded-xl border border-orange-100 text-left hover:bg-orange-100 transition-colors group"
//                 >
//                   <div className="flex justify-between items-start">
//                     <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Profile Views</p>
//                     <span className="text-xs text-orange-400 group-hover:translate-x-1 transition-transform">→</span>
//                   </div>
//                   <p className="text-3xl font-black text-black">
//                     {loadingViews ? '-' : profileViewsCount}
//                   </p>
//                   <p className="text-[10px] text-orange-400 mt-1 font-medium">View Details</p>
//                 </button>

//                 <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
//                   <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Jobs Posted</p>
//                   <p className="text-3xl font-black text-black">{userJobs.length}</p>
//                 </div>
//               </div>

//               <div className="mt-6 pt-6 border-t border-neutral-100">
//                 <div className="flex justify-between items-center text-sm">
//                   <span className="text-neutral-500">Online Status</span>
//                   <span className="flex items-center gap-2 text-green-600 font-medium">
//                     <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-neutral-400'}`}></span>
//                     {isOnline ? 'Online' : 'Offline'}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Navigation - List Style */}
//             <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
//               <div className="p-4 bg-neutral-50 border-b border-neutral-200">
//                 <h3 className="font-bold text-black text-sm uppercase tracking-wide">Shortcuts</h3>
//               </div>
//               <div className="divide-y divide-neutral-100">
//                 <button onClick={() => router.push('/dashboard/applications')} className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left group">
//                   <span className="text-neutral-600 font-medium group-hover:text-black">My Applications</span>
//                   <span className="text-neutral-300 group-hover:text-orange-600">→</span>
//                 </button>
//                 <button onClick={() => router.push('/dashboard/messages')} className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left group">
//                   <span className="text-neutral-600 font-medium group-hover:text-black">Messages</span>
//                   <span className="text-neutral-300 group-hover:text-orange-600">→</span>
//                 </button>
//                 {/* Connection Requests Button with Notification Badge */}
//                 <button onClick={() => router.push('/dashboard/connections')} className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left group relative">
//                   <span className="text-neutral-600 font-medium group-hover:text-black">Connection Requests</span>
//                   <div className="flex items-center gap-2">
//                     {/* Notification badge for pending requests */}
//                     {pendingRequestsCount > 0 && (
//                       <span className="bg-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
//                         {pendingRequestsCount}
//                       </span>
//                     )}
//                     <span className="text-neutral-300 group-hover:text-orange-600">→</span>
//                   </div>
//                 </button>
//                 {userJobs.length > 0 && (
//                   <button onClick={() => router.push('/dashboard/company')} className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left group">
//                     <span className="text-neutral-600 font-medium group-hover:text-black">Company Dashboard</span>
//                     <span className="text-neutral-300 group-hover:text-orange-600">→</span>
//                   </button>
//                 )}
//                 <button onClick={handleSignOut} className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors text-left group">
//                   <span className="text-neutral-600 font-medium group-hover:text-red-600">Sign Out</span>
//                   <span className="text-neutral-300 group-hover:text-red-600">→</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN: Action Grid */}
//           <div className="lg:col-span-2 space-y-6">
            
//             {/* Primary Actions Grid */}
//             <div className="grid sm:grid-cols-2 gap-4">
//               {/* Card 1: Find Jobs */}
//               <button 
//                 onClick={() => router.push('/jobs')}
//                 className="group relative p-6 bg-black rounded-2xl text-left overflow-hidden hover:shadow-xl transition-all duration-300"
//               >
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
//                 <div className="relative z-10">
//                   <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl mb-4 text-white group-hover:scale-110 transition-transform">
//                     🔍
//                   </div>
//                   <h3 className="text-xl font-bold text-white mb-1">Find Work</h3>
//                   <p className="text-neutral-400 text-sm">Browse latest opportunities</p>
//                 </div>
//               </button>

//               {/* Card 2: Network */}
//               <button 
//                 onClick={() => router.push('/network')}
//                 className="group p-6 bg-white border border-neutral-200 rounded-2xl text-left hover:border-orange-500 hover:shadow-lg transition-all duration-300"
//               >
//                 <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl mb-4 text-orange-600 group-hover:scale-110 transition-transform">
//                   🌐
//                 </div>
//                 <h3 className="text-xl font-bold text-black mb-1">Grow Network</h3>
//                 <p className="text-neutral-500 text-sm">Connect with professionals</p>
//               </button>

//               {/* Card 3: Referral */}
//               <button 
//                 onClick={() => router.push('/referral')}
//                 className="group p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl text-left hover:shadow-xl transition-all duration-300"
//               >
//                 <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mb-4 text-white group-hover:scale-110 transition-transform">
//                   🤝
//                 </div>
//                 <h3 className="text-xl font-bold text-white mb-1">Get Referred</h3>
//                 <p className="text-orange-100 text-sm">Direct employee connections</p>
//               </button>

//               {/* Card 4: Post Job */}
//               <button 
//                 onClick={() => router.push('/dashboard/post-job')}
//                 className="group p-6 bg-white border border-neutral-200 rounded-2xl text-left hover:border-black hover:shadow-lg transition-all duration-300"
//               >
//                 <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center text-2xl mb-4 text-black group-hover:scale-110 transition-transform">
//                   📝
//                 </div>
//                 <h3 className="text-xl font-bold text-black mb-1">Post a Job</h3>
//                 <p className="text-neutral-500 text-sm">Hire talent for free</p>
//               </button>
//             </div>

//             {/* Empty State / Employer CTA */}
//             {userJobs.length === 0 && (
//               <div className="bg-white rounded-2xl p-8 border border-neutral-200 text-center relative overflow-hidden">
//                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
//                 <div className="max-w-md mx-auto relative z-10">
//                   <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
//                     🏢
//                   </div>
//                   <h3 className="text-2xl font-bold text-black mb-3">Hiring? Unlock the Dashboard.</h3>
//                   <p className="text-neutral-500 mb-8 leading-relaxed">
//                     Post your first job to unlock powerful analytics, candidate tracking, and pipeline management tools. It takes less than 2 minutes.
//                   </p>
//                   <button 
//                     onClick={() => router.push('/dashboard/post-job')}
//                     className="px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg"
//                   >
//                     Post Your First Job
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Debug Panel (Visible in development - optional) */}
//             {process.env.NODE_ENV === 'development' && (
//               <div className="mt-8 p-4 bg-gray-900 text-gray-100 rounded-lg text-xs font-mono">
//                 <div className="flex justify-between items-center mb-2">
//                   <h4 className="font-bold">Debug Logs</h4>
//                   <button 
//                     onClick={() => console.clear()}
//                     className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
//                   >
//                     Clear Console
//                   </button>
//                 </div>
//                 <div className="h-32 overflow-y-auto">
//                   {debugLogs.length > 0 ? (
//                     debugLogs.map((log, index) => (
//                       <div key={index} className="py-1 border-b border-gray-800">
//                         {log}
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-gray-500 italic">No logs yet. Click "Test Online" button.</div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function Dashboard() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Dashboard failed to load">
//       <DashboardContent />
//     </ClientErrorBoundary>
//   );
// }



'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore';
import NotificationsDropdown from '@/components/NotificationsDropdown';
import ClientErrorBoundary from '@/components/ClientErrorBoundary';
import { getProfileViewsCount } from '@/lib/profileViews';
import Link from 'next/link';
import { useCurrentUserOnlineStatus } from '@/hooks/useOnlineStatus';

// ==================== 🚀 CACHE HELPERS (Minimal) ====================
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key: string) => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - data.timestamp > CACHE_EXPIRY_MS) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data.data;
  } catch {
    return null;
  }
};

const setCachedData = (key: string, data: any) => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // Ignore
  }
};

// ==================== MAIN COMPONENT ====================
function DashboardContent() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  
  // State
  const [userJobs, setUserJobs] = useState<any[]>([]);
  const [profileViewsCount, setProfileViewsCount] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [appliedJobsCount, setAppliedJobsCount] = useState(0);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingViews, setLoadingViews] = useState(true);
  
  const { isOnline } = useCurrentUserOnlineStatus();

  // Auth check
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // ==================== DATA FETCHING (HYBRID) ====================
  const fetchUserData = useCallback(async () => {
    if (!user) return;

    const cacheKey = `dashboard_${user.uid}`;
    
    // 1. Try to restore cached counts (for fast display)
    const cached = getCachedData(cacheKey);
    if (cached) {
      setProfileViewsCount(cached.profileViews || 0);
      setAppliedJobsCount(cached.appliedJobs || 0);
      setPendingRequestsCount(cached.pendingRequests || 0);
      setLoadingViews(false);
      setLoadingJobs(false);
      // Note: userJobs are not cached because they might be used for the "Company Dashboard" button
      // but we'll still fetch them fresh.
    }

    // 2. Always fetch fresh data (for accuracy)
    setLoadingJobs(true);
    setLoadingViews(true);

    try {
      // Query references
      const jobsRef = collection(db, 'jobs');
      const jobsQuery = query(jobsRef, where('postedBy', '==', user.uid));
      
      const applicationsRef = collection(db, 'applications');
      const appliedQuery = query(applicationsRef, where('userId', '==', user.uid));
      
      const connectionsRef = collection(db, 'connections');
      const pendingQuery = query(
        connectionsRef,
        where('toUser', '==', user.uid),
        where('status', '==', 'pending')
      );

      // 🚀 HYBRID: Run all queries in parallel (DeepSeek's optimization)
      const [jobsSnapshot, viewsCount, appliedSnapshot, pendingSnapshot] = await Promise.all([
        getDocs(jobsQuery),
        getProfileViewsCount(user.uid),
        getCountFromServer(appliedQuery),
        getCountFromServer(pendingQuery)
      ]);

      // Process jobs
      const jobs: any[] = [];
      jobsSnapshot.forEach((doc) => {
        jobs.push({ id: doc.id, ...doc.data() });
      });

      // Update state
      setUserJobs(jobs);
      setProfileViewsCount(viewsCount);
      setAppliedJobsCount(appliedSnapshot.data().count);
      setPendingRequestsCount(pendingSnapshot.data().count);

      // 💾 Cache the counts for next time (DeepSeek's caching)
      setCachedData(cacheKey, {
        profileViews: viewsCount,
        appliedJobs: appliedSnapshot.data().count,
        pendingRequests: pendingSnapshot.data().count,
      });

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingJobs(false);
      setLoadingViews(false);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  // ==================== HANDLERS ====================
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Clear cache on sign out
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(`dashboard_${user?.uid}`);
      }
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // ==================== RENDER ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-neutral-100 border-t-orange-600 rounded-full animate-spin"></div>
        <p className="text-neutral-500 font-medium">Loading Dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-3xl font-black text-orange-600 tracking-tighter">ALL</span>
            <span className="text-lg font-bold text-neutral-300">|</span>
            <span className="text-lg font-bold text-black tracking-tight">Dashboard</span>
          </Link>

          <div className="flex items-center gap-4">
            <NotificationsDropdown />
            <div className="flex items-center gap-3 pl-6 border-l border-neutral-100">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-black">{user.displayName}</p>
                <div className="flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-neutral-400'}`}
                    title={isOnline ? 'Online now' : 'Offline'}
                  />
                  <p className="text-xs text-neutral-500">
                    {isOnline ? 'Online now' : 'Offline'}
                  </p>
                </div>
              </div>
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  {user.displayName?.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black tracking-tight mb-2">
            Welcome back, {user.displayName?.split(' ')[0]} 👋
          </h1>
          <p className="text-neutral-500">Here's what's happening with your professional profile today.</p>
          {/* <p className="text-xs text-neutral-400 mt-1">💾 Data cached for 5 minutes</p> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN: Profile & Stats */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-black">Profile Overview</h2>
                <button
                  onClick={() => router.push('/dashboard/edit-profile')}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 uppercase tracking-wide"
                >
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Profile Views */}
                <button
                  onClick={() => router.push('/dashboard/profile-views')}
                  className="p-4 bg-orange-50 rounded-xl border border-orange-100 text-left hover:bg-orange-100 transition-colors group"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Profile Views</p>
                    <span className="text-xs text-orange-400 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                  <p className="text-3xl font-black text-black">
                    {loadingViews ? '-' : profileViewsCount}
                  </p>
                  <p className="text-[10px] text-orange-400 mt-1 font-medium">View Details</p>
                </button>

                {/* Jobs Applied (NEW) */}
                <button
                  onClick={() => router.push('/dashboard/applications')}
                  className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-left hover:bg-blue-100 transition-colors group"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Jobs Applied</p>
                    <span className="text-xs text-blue-400 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                  <p className="text-3xl font-black text-black">
                    {loadingJobs ? '-' : appliedJobsCount}
                  </p>
                  <p className="text-[10px] text-blue-400 mt-1 font-medium">View Applications</p>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-100 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500">Online Status</span>
                  <span className="flex items-center gap-2 text-green-600 font-medium">
                    <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-neutral-400'}`} />
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500">Pending Requests</span>
                  <span className="font-bold text-black">{pendingRequestsCount}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500">Jobs Posted</span>
                  <span className="font-bold text-black">{userJobs.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-neutral-50 border-b border-neutral-200">
                <h3 className="font-bold text-black text-sm uppercase tracking-wide">Shortcuts</h3>
              </div>
              <div className="divide-y divide-neutral-100">
                <button onClick={() => router.push('/dashboard/applications')} className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left group">
                  <span className="text-neutral-600 font-medium group-hover:text-black">My Applications</span>
                  <span className="text-neutral-300 group-hover:text-orange-600">→</span>
                </button>
                <button onClick={() => router.push('/dashboard/messages')} className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left group">
                  <span className="text-neutral-600 font-medium group-hover:text-black">Messages</span>
                  <span className="text-neutral-300 group-hover:text-orange-600">→</span>
                </button>
                <button onClick={() => router.push('/dashboard/connections')} className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left group relative">
                  <span className="text-neutral-600 font-medium group-hover:text-black">Connection Requests</span>
                  <div className="flex items-center gap-2">
                    {pendingRequestsCount > 0 && (
                      <span className="bg-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {pendingRequestsCount}
                      </span>
                    )}
                    <span className="text-neutral-300 group-hover:text-orange-600">→</span>
                  </div>
                </button>
                {userJobs.length > 0 && (
                  <button onClick={() => router.push('/dashboard/company')} className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left group">
                    <span className="text-neutral-600 font-medium group-hover:text-black">Company Dashboard</span>
                    <span className="text-neutral-300 group-hover:text-orange-600">→</span>
                  </button>
                )}
                <button onClick={handleSignOut} className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors text-left group">
                  <span className="text-neutral-600 font-medium group-hover:text-red-600">Sign Out</span>
                  <span className="text-neutral-300 group-hover:text-red-600">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Action Grid */}
          <div className="lg:col-span-2 space-y-6">

            {/* Primary Actions Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/jobs')}
                className="group relative p-6 bg-black rounded-2xl text-left overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl mb-4 text-white group-hover:scale-110 transition-transform">
                    🔍
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Find Work</h3>
                  <p className="text-neutral-400 text-sm">Browse latest opportunities</p>
                </div>
              </button>

              <button
                onClick={() => router.push('/network')}
                className="group p-6 bg-white border border-neutral-200 rounded-2xl text-left hover:border-orange-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl mb-4 text-orange-600 group-hover:scale-110 transition-transform">
                  🌐
                </div>
                <h3 className="text-xl font-bold text-black mb-1">Grow Network</h3>
                <p className="text-neutral-500 text-sm">Connect with professionals</p>
              </button>

              <button
                onClick={() => router.push('/referral')}
                className="group p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl text-left hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mb-4 text-white group-hover:scale-110 transition-transform">
                  🤝
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Get Referred</h3>
                <p className="text-orange-100 text-sm">Direct employee connections</p>
              </button>

              <button
                onClick={() => router.push('/dashboard/post-job')}
                className="group p-6 bg-white border border-neutral-200 rounded-2xl text-left hover:border-black hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center text-2xl mb-4 text-black group-hover:scale-110 transition-transform">
                  📝
                </div>
                <h3 className="text-xl font-bold text-black mb-1">Post a Job</h3>
                <p className="text-neutral-500 text-sm">Hire talent for free</p>
              </button>
            </div>

            {/* Empty State / Employer CTA */}
            {userJobs.length === 0 && (
              <div className="bg-white rounded-2xl p-8 border border-neutral-200 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600" />
                <div className="max-w-md mx-auto relative z-10">
                  <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                    🏢
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-3">Hiring? Unlock the Dashboard.</h3>
                  <p className="text-neutral-500 mb-8 leading-relaxed">
                    Post your first job to unlock powerful analytics, candidate tracking, and pipeline management tools. It takes less than 2 minutes.
                  </p>
                  <button
                    onClick={() => router.push('/dashboard/post-job')}
                    className="px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg"
                  >
                    Post Your First Job
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ClientErrorBoundary fallbackMessage="Dashboard failed to load">
      <DashboardContent />
    </ClientErrorBoundary>
  );
}