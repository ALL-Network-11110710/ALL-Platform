// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { collection, getDocs, query, orderBy } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebase';
// import Link from 'next/link';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';

// interface UserProfile {
//   id: string;
//   displayName: string | null;
//   email: string | null;
//   headline: string;
//   skills: string[];
//   location: string;
//   profileImage: string;
// }

// // Network Content Component
// function NetworkContent() {
//   const [user] = useAuthState(auth);
//   const router = useRouter();
//   const [users, setUsers] = useState<UserProfile[]>([]);
//   const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const usersQuery = query(collection(db, 'users'), orderBy('displayName'));
//         const querySnapshot = await getDocs(usersQuery);
//         const usersData: UserProfile[] = [];
        
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           if (data.displayName || data.headline) {
//             usersData.push({
//               id: doc.id,
//               displayName: data.displayName || null,
//               email: data.email || null,
//               headline: data.headline || '',
//               skills: data.skills || [],
//               location: data.location || '',
//               profileImage: data.profileImage || '',
//             });
//           }
//         });
        
//         setUsers(usersData);
//         setFilteredUsers(usersData);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//         throw new Error('Failed to load network users');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setFilteredUsers(users);
//       return;
//     }

//     const term = searchTerm.toLowerCase();
//     const filtered = users.filter(user => {
//       const nameMatch = user.displayName?.toLowerCase().includes(term) || false;
//       const headlineMatch = user.headline.toLowerCase().includes(term);
//       const skillsMatch = user.skills.some(skill => 
//         skill.toLowerCase().includes(term)
//       );
//       const locationMatch = user.location.toLowerCase().includes(term);

//       return nameMatch || headlineMatch || skillsMatch || locationMatch;
//     });

//     setFilteredUsers(filtered);
//   }, [searchTerm, users]);

//   const handleStartConversation = (otherUserId: string) => {
//     if (!user) return;
    
//     try {
//       // Generate conversation ID (same format as in sendMessage)
//       const sortedIds = [user.uid, otherUserId].sort();
//       const conversationId = `${sortedIds[0]}_${sortedIds[1]}`;
      
//       // Navigate to the conversation page
//       router.push(`/dashboard/messages/${conversationId}`);
//     } catch (error) {
//       console.error('Error starting conversation:', error);
//       throw new Error('Failed to start conversation');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
//           <p className="mt-2 text-gray-600 text-sm">Loading professionals...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-6">
//       <div className="max-w-6xl mx-auto px-4">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-800 mb-1">Network</h1>
//           <p className="text-gray-500 text-sm">Connect with professionals on ALL</p>
//         </div>
        
//         {/* Search Bar */}
//         <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
//           <input
//             type="text"
//             placeholder="Search by name, skills, location, or headline..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm"
//           />
//         </div>

//         {/* Results Info */}
//         <div className="mb-4 flex justify-between items-center">
//           <p className="text-gray-600 text-sm">
//             {filteredUsers.length} of {users.length} professionals
//             {searchTerm && <span> for "<strong>{searchTerm}</strong>"</span>}
//           </p>
//           {searchTerm && (
//             <button
//               onClick={() => setSearchTerm('')}
//               className="text-orange-600 text-sm hover:text-orange-700"
//             >
//               Clear
//             </button>
//           )}
//         </div>
        
//         {filteredUsers.length === 0 ? (
//           <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
//             <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
//               <span className="text-xl">🔍</span>
//             </div>
//             <p className="text-gray-700 text-sm mb-2">
//               {searchTerm 
//                 ? `No results for "${searchTerm}"` 
//                 : 'No professionals found'
//               }
//             </p>
//             <p className="text-gray-500 text-xs">
//               {searchTerm 
//                 ? 'Try different keywords' 
//                 : 'Profiles will appear as users join and complete their profiles'
//               }
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {filteredUsers.map((userProfile) => (
//               <div key={userProfile.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
//                 <div className="flex items-center gap-3 mb-3">
//                   {/* Profile Image */}
//                   {userProfile.profileImage ? (
//                     <img 
//                       src={userProfile.profileImage} 
//                       alt={userProfile.displayName || 'User'} 
//                       className="w-10 h-10 rounded-full object-cover border border-orange-200"
//                     />
//                   ) : (
//                     <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200">
//                       <span className="text-sm text-orange-500 font-medium">
//                         {userProfile.displayName?.[0]?.toUpperCase() || userProfile.email?.[0]?.toUpperCase() || 'U'}
//                       </span>
//                     </div>
//                   )}
                  
//                   <div className="flex-1 min-w-0">
//                     <h2 className="text-sm font-semibold text-gray-800 truncate">
//                       {userProfile.displayName || 'Anonymous User'}
//                     </h2>
//                     {userProfile.headline && (
//                       <p className="text-orange-600 text-xs truncate">{userProfile.headline}</p>
//                     )}
//                   </div>
//                 </div>
                
//                 {userProfile.skills.length > 0 && (
//                   <div className="mb-3">
//                     <div className="flex flex-wrap gap-1">
//                       {userProfile.skills.slice(0, 4).map((skill, index) => (
//                         <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
//                           {skill}
//                         </span>
//                       ))}
//                       {userProfile.skills.length > 4 && (
//                         <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
//                           +{userProfile.skills.length - 4}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 )}
                
//                 {userProfile.location && (
//                   <p className="text-gray-500 text-xs mb-3 flex items-center">
//                     <span className="mr-1">📍</span>
//                     {userProfile.location}
//                   </p>
//                 )}
                
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-400 text-xs">
//                     {userProfile.email ? userProfile.email.replace(/@.*/, '') : ''}
//                   </span>
//                   <div className="flex gap-2">
//                     <Link 
//                       href={`/profile/${userProfile.id}`}
//                       className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-xs"
//                     >
//                       View Profile
//                     </Link>
//                     {user && user.uid !== userProfile.id && (
//                       <button
//                         onClick={() => handleStartConversation(userProfile.id)}
//                         className="px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-xs"
//                       >
//                         Message
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Main Network Page Component with Error Boundary
// export default function NetworkPage() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Network page failed to load">
//       <NetworkContent />
//     </ClientErrorBoundary>
//   );
// }

// 2nd working main one

// 'use client';

// import { useState, useEffect, useMemo } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebase';
// import Link from 'next/link';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';
// import { sendConnectionRequest, getConnectionStatus, areUsersConnected } from '@/lib/connections';
// import { 
//   Search, Filter, MapPin, Briefcase, Users, MessageSquare, 
//   UserPlus, Grid, List, X, Sparkles, Zap, ArrowRight, 
//   TrendingUp, Star, Heart, Eye, Clock, CheckCircle, 
//   ChevronRight, Target, Building, GraduationCap, Award,
//   Mail, Globe, Linkedin, Github, ExternalLink
// } from 'lucide-react';

// interface UserProfile {
//   id: string;
//   displayName: string | null;
//   email: string | null;
//   headline: string;
//   skills: string[];
//   location: string;
//   profileImage: string;
//   createdAt?: any;
//   experience?: string;
//   education?: string;
//   website?: string;
//   linkedin?: string;
//   github?: string;
// }

// type ViewMode = 'grid' | 'list';

// function NetworkContent() {
//   const [user] = useAuthState(auth);
//   const router = useRouter();
//   const [users, setUsers] = useState<UserProfile[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [viewMode, setViewMode] = useState<ViewMode>('grid');
//   const [activeFilter, setActiveFilter] = useState<string>('all');
//   const [connections, setConnections] = useState<Record<string, any>>({});
//   const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
//   const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
//   const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

//   // Fetch users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const usersQuery = query(
//           collection(db, 'users'), 
//           orderBy('createdAt', 'desc'),
//           limit(100)
//         );
//         const querySnapshot = await getDocs(usersQuery);
//         const usersData: UserProfile[] = [];
        
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           if (data.displayName || data.headline) {
//             usersData.push({
//               id: doc.id,
//               displayName: data.displayName || null,
//               email: data.email || null,
//               headline: data.headline || '',
//               skills: data.skills || [],
//               location: data.location || '',
//               profileImage: data.profileImage || '',
//               createdAt: data.createdAt,
//               experience: data.experience || '',
//               education: data.education || '',
//               website: data.website || '',
//               linkedin: data.linkedin || '',
//               github: data.github || ''
//             });
//           }
//         });
        
//         setUsers(usersData);
        
//         // Load connection statuses for current user
//         if (user) {
//           const connectionMap: Record<string, any> = {};
//           for (const userProfile of usersData) {
//             if (user.uid !== userProfile.id) {
//               const connection = await getConnectionStatus(user.uid, userProfile.id);
//               const reverseConnection = await getConnectionStatus(userProfile.id, user.uid);
//               connectionMap[userProfile.id] = connection || reverseConnection;
//             }
//           }
//           setConnections(connectionMap);
//         }
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [user]);

//   // Get unique skills and locations for filters
//   const { uniqueSkills, uniqueLocations } = useMemo(() => {
//     const skills = new Set<string>();
//     const locations = new Set<string>();
    
//     users.forEach(user => {
//       user.skills?.forEach(skill => skills.add(skill));
//       if (user.location) locations.add(user.location);
//     });
    
//     return {
//       uniqueSkills: Array.from(skills).sort(),
//       uniqueLocations: Array.from(locations).sort()
//     };
//   }, [users]);

//   // Filter and search users
//   const filteredUsers = useMemo(() => {
//     let result = [...users];
    
//     // Apply search term
//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(user => {
//         const nameMatch = user.displayName?.toLowerCase().includes(term) || false;
//         const headlineMatch = user.headline.toLowerCase().includes(term);
//         const skillsMatch = user.skills.some(skill => 
//           skill.toLowerCase().includes(term)
//         );
//         const locationMatch = user.location.toLowerCase().includes(term);
//         const experienceMatch = user.experience?.toLowerCase().includes(term) || false;
//         const educationMatch = user.education?.toLowerCase().includes(term) || false;
//         return nameMatch || headlineMatch || skillsMatch || locationMatch || experienceMatch || educationMatch;
//       });
//     }
    
//     // Apply location filter
//     if (selectedLocations.length > 0) {
//       result = result.filter(user => selectedLocations.includes(user.location));
//     }
    
//     // Apply skills filter
//     if (selectedSkills.length > 0) {
//       result = result.filter(user => 
//         selectedSkills.some(skill => user.skills.includes(skill))
//       );
//     }
    
//     // Apply basic filters
//     if (activeFilter === 'withLocation') {
//       result = result.filter(user => user.location);
//     } else if (activeFilter === 'withSkills') {
//       result = result.filter(user => user.skills.length > 0);
//     } else if (activeFilter === 'recent') {
//       result = result.slice(0, 20); // Most recent 20
//     }
    
//     return result;
//   }, [users, searchTerm, activeFilter, selectedSkills, selectedLocations]);

//   const handleMessage = async (otherUserId: string, otherUserName: string) => {
//     if (!user) {
//       router.push('/login');
//       return;
//     }
    
//     try {
//       const isConnected = await areUsersConnected(user.uid, otherUserId);
      
//       if (!isConnected) {
//         const shouldConnect = window.confirm(
//           `Connect with ${otherUserName || 'this user'} to start messaging?`
//         );
        
//         if (shouldConnect) {
//           await handleConnect(otherUserId, otherUserName);
//         }
//         return;
//       }
      
//       const sortedIds = [user.uid, otherUserId].sort();
//       const conversationId = `${sortedIds[0]}_${sortedIds[1]}`;
//       router.push(`/dashboard/messages/${conversationId}`);
//     } catch (error) {
//       console.error('Error starting conversation:', error);
//       alert('Unable to start conversation. Please try again.');
//     }
//   };

//   const handleConnect = async (userId: string, userName: string) => {
//     if (!user) {
//       router.push('/login');
//       return;
//     }
    
//     try {
//       await sendConnectionRequest(user.uid, userId);
      
//       // Update connection status locally
//       setConnections(prev => ({
//         ...prev,
//         [userId]: { status: 'pending', fromUserId: user.uid, toUserId: userId }
//       }));
      
//       // Show success message
//       const event = new CustomEvent('showToast', {
//         detail: { 
//           message: `Connection request sent to ${userName}!`, 
//           type: 'success' 
//         }
//       });
//       window.dispatchEvent(event);
      
//     } catch (error: any) {
//       console.error('Error sending connection request:', error);
//       const event = new CustomEvent('showToast', {
//         detail: { 
//           message: error.message || 'Failed to send connection request', 
//           type: 'error' 
//         }
//       });
//       window.dispatchEvent(event);
//     }
//   };

//   const clearAllFilters = () => {
//     setSearchTerm('');
//     setActiveFilter('all');
//     setSelectedSkills([]);
//     setSelectedLocations([]);
//   };

//   const toggleSkillFilter = (skill: string) => {
//     setSelectedSkills(prev =>
//       prev.includes(skill)
//         ? prev.filter(s => s !== skill)
//         : [...prev, skill]
//     );
//   };

//   const toggleLocationFilter = (location: string) => {
//     setSelectedLocations(prev =>
//       prev.includes(location)
//         ? prev.filter(l => l !== location)
//         : [...prev, location]
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 py-12 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center space-y-6 py-20">
//             <div className="relative">
//               <div className="w-16 h-16 border-4 border-orange-100 rounded-full animate-spin mx-auto"></div>
//               <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 transform -translate-x-1/2"></div>
//             </div>
//             <div>
//               <p className="text-black font-medium mb-2">Discovering amazing professionals</p>
//               <p className="text-gray-500 text-sm">Building your network...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 py-8 px-4">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header Section */}
//         <div className="mb-10 text-center">
//           <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-orange-50 rounded-full px-5 py-2 mb-5">
//             <Sparkles className="w-4 h-4 text-orange-600" />
//             <span className="text-sm font-semibold text-orange-700">
//               PROFESSIONAL NETWORK
//             </span>
//           </div>
          
//           <h1 className="text-4xl md:text-5xl font-black text-black mb-3">
//             Connect with <span className="text-orange-600">Amazing</span> People
//           </h1>
//           <p className="text-gray-600 text-base max-w-2xl mx-auto">
//             Discover professionals, build meaningful connections, and grow your network
//           </p>
          
//           {/* Stats Bar */}
//           <div className="flex flex-wrap justify-center gap-4 mt-6">
//             <div className="px-4 py-2 bg-white rounded-full border border-orange-100 shadow-sm">
//               <span className="text-black text-sm font-bold">{users.length}</span>
//               <span className="text-gray-500 text-sm ml-2">Professionals</span>
//             </div>
//             <div className="px-4 py-2 bg-white rounded-full border border-orange-100 shadow-sm">
//               <span className="text-black text-sm font-bold">{users.filter(u => u.location).length}</span>
//               <span className="text-gray-500 text-sm ml-2">Cities</span>
//             </div>
//             <div className="px-4 py-2 bg-white rounded-full border border-orange-100 shadow-sm">
//               <span className="text-black text-sm font-bold">{new Set(users.flatMap(u => u.skills)).size}</span>
//               <span className="text-gray-500 text-sm ml-2">Skills</span>
//             </div>
//           </div>
//         </div>

//         {/* Search & Controls Section */}
//         <div className="mb-8">
//           {/* Search Bar */}
//           <div className="relative max-w-3xl mx-auto mb-6">
//             <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm p-1 hover:border-orange-300 transition-colors">
//               <div className="flex items-center px-4">
//                 <Search className="w-5 h-5 text-orange-600 flex-shrink-0" />
//                 <input
//                   type="text"
//                   placeholder="Search by name, skills, location, or company..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-3 pr-4 py-3 bg-transparent outline-none text-black placeholder-gray-400 text-sm"
//                   autoComplete="off"
//                   spellCheck="false"
//                 />
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm('')}
//                     className="p-2 text-gray-400 hover:text-black transition-colors"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Controls */}
//           <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
//             <div className="flex flex-wrap gap-2">
//               <button
//                 onClick={() => setActiveFilter('all')}
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                   activeFilter === 'all'
//                     ? 'bg-orange-600 text-white shadow-md'
//                     : 'bg-white text-gray-600 hover:text-black hover:bg-gray-50 border border-gray-200'
//                 }`}
//               >
//                 All Professionals
//               </button>
//               <button
//                 onClick={() => setActiveFilter('withLocation')}
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                   activeFilter === 'withLocation'
//                     ? 'bg-orange-600 text-white shadow-md'
//                     : 'bg-white text-gray-600 hover:text-black hover:bg-gray-50 border border-gray-200'
//                 }`}
//               >
//                 <MapPin className="inline w-3 h-3 mr-1.5" />
//                 With Location
//               </button>
//               <button
//                 onClick={() => setActiveFilter('withSkills')}
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                   activeFilter === 'withSkills'
//                     ? 'bg-orange-600 text-white shadow-md'
//                     : 'bg-white text-gray-600 hover:text-black hover:bg-gray-50 border border-gray-200'
//                 }`}
//               >
//                 <Briefcase className="inline w-3 h-3 mr-1.5" />
//                 With Skills
//               </button>
//               <button
//                 onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                   showAdvancedFilters
//                     ? 'bg-orange-600 text-white shadow-md'
//                     : 'bg-white text-gray-600 hover:text-black hover:bg-gray-50 border border-gray-200'
//                 }`}
//               >
//                 <Filter className="inline w-3 h-3 mr-1.5" />
//                 Advanced Filters
//               </button>
//             </div>

//             <div className="flex items-center gap-2 bg-white rounded-full p-1 border border-gray-200">
//               <button
//                 onClick={() => setViewMode('grid')}
//                 className={`p-2 rounded-full transition-all ${
//                   viewMode === 'grid' 
//                     ? 'bg-orange-600 text-white shadow-sm' 
//                     : 'text-gray-400 hover:text-black hover:bg-gray-50'
//                 }`}
//               >
//                 <Grid className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => setViewMode('list')}
//                 className={`p-2 rounded-full transition-all ${
//                   viewMode === 'list' 
//                     ? 'bg-orange-600 text-white shadow-sm' 
//                     : 'text-gray-400 hover:text-black hover:bg-gray-50'
//                 }`}
//               >
//                 <List className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           {/* Advanced Filters */}
//           {showAdvancedFilters && (
//             <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4 shadow-sm">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Skills Filter */}
//                 <div>
//                   <div className="flex items-center gap-2 mb-3">
//                     <Award className="w-5 h-5 text-orange-600" />
//                     <h3 className="font-bold text-black">Filter by Skills</h3>
//                   </div>
//                   <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2">
//                     {uniqueSkills.slice(0, 30).map((skill) => (
//                       <button
//                         key={skill}
//                         onClick={() => toggleSkillFilter(skill)}
//                         className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
//                           selectedSkills.includes(skill)
//                             ? 'bg-orange-600 text-white'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                         }`}
//                       >
//                         {skill}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
                
//                 {/* Locations Filter */}
//                 <div>
//                   <div className="flex items-center gap-2 mb-3">
//                     <MapPin className="w-5 h-5 text-orange-600" />
//                     <h3 className="font-bold text-black">Filter by Location</h3>
//                   </div>
//                   <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2">
//                     {uniqueLocations.slice(0, 20).map((location) => (
//                       <button
//                         key={location}
//                         onClick={() => toggleLocationFilter(location)}
//                         className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
//                           selectedLocations.includes(location)
//                             ? 'bg-orange-600 text-white'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                         }`}
//                       >
//                         {location}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
              
//               {/* Clear Filters */}
//               {(selectedSkills.length > 0 || selectedLocations.length > 0) && (
//                 <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
//                   <button
//                     onClick={() => {
//                       setSelectedSkills([]);
//                       setSelectedLocations([]);
//                     }}
//                     className="px-4 py-2 text-sm text-gray-600 hover:text-black flex items-center gap-2"
//                   >
//                     <X className="w-4 h-4" />
//                     Clear Advanced Filters
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Active Filters Display */}
//           {(selectedSkills.length > 0 || selectedLocations.length > 0 || searchTerm) && (
//             <div className="mb-4 flex flex-wrap items-center gap-2">
//               <span className="text-sm text-gray-500">Active filters:</span>
//               {searchTerm && (
//                 <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
//                   Search: "{searchTerm}"
//                 </span>
//               )}
//               {selectedSkills.map(skill => (
//                 <span key={skill} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
//                   Skill: {skill}
//                 </span>
//               ))}
//               {selectedLocations.map(location => (
//                 <span key={location} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
//                   Location: {location}
//                 </span>
//               ))}
//               <button
//                 onClick={clearAllFilters}
//                 className="ml-2 px-3 py-1 text-sm text-gray-600 hover:text-black hover:bg-gray-100 rounded-full"
//               >
//                 Clear all
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Results Count */}
//         <div className="mb-6">
//           <p className="text-gray-600 text-sm">
//             Showing <span className="font-bold text-black">{filteredUsers.length}</span> of {users.length} professionals
//             {searchTerm && (
//               <span> for "<span className="text-orange-600">{searchTerm}"</span></span>
//             )}
//           </p>
//         </div>

//         {/* User Cards Grid */}
//         {filteredUsers.length === 0 ? (
//           <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
//             <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Search className="w-10 h-10 text-orange-600" />
//             </div>
//             <h3 className="text-xl font-bold text-black mb-2">No results found</h3>
//             <p className="text-gray-500 mb-6 max-w-sm mx-auto">
//               {searchTerm 
//                 ? `Try different keywords or clear search`
//                 : 'No professionals match your current filters'
//               }
//             </p>
//             <button
//               onClick={clearAllFilters}
//               className="px-6 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors"
//             >
//               Clear All Filters
//             </button>
//           </div>
//         ) : (
//           <div className={`gap-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}`}>
//             {filteredUsers.map((userProfile) => {
//               const connection = connections[userProfile.id];
//               const isConnected = connection?.status === 'accepted';
//               const isPending = connection?.status === 'pending';
//               const isOwnProfile = user && user.uid === userProfile.id;
              
//               return (
//                 <div 
//                   key={userProfile.id} 
//                   className={`group relative bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:border-orange-300 hover:shadow-lg ${
//                     viewMode === 'list' ? 'flex items-center p-6' : 'p-6'
//                   }`}
//                 >
//                   {/* Profile Section */}
//                   <div className={`flex ${viewMode === 'list' ? 'items-start gap-4' : 'flex-col items-center text-center gap-3'}`}>
//                     {/* Profile Image */}
//                     <div className="relative">
//                       {userProfile.profileImage ? (
//                         <img 
//                           src={userProfile.profileImage} 
//                           alt={userProfile.displayName || 'User'} 
//                           className={`rounded-xl object-cover border-2 border-white shadow-sm group-hover:border-orange-100 transition-colors ${
//                             viewMode === 'list' ? 'w-16 h-16' : 'w-20 h-20'
//                           }`}
//                         />
//                       ) : (
//                         <div className={`rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center border-2 border-white shadow-sm group-hover:border-orange-100 transition-colors ${
//                           viewMode === 'list' ? 'w-16 h-16' : 'w-20 h-20'
//                         }`}>
//                           <span className={`font-bold text-orange-600 ${
//                             viewMode === 'list' ? 'text-xl' : 'text-2xl'
//                           }`}>
//                             {userProfile.displayName?.[0]?.toUpperCase() || userProfile.email?.[0]?.toUpperCase() || 'U'}
//                           </span>
//                         </div>
//                       )}
                      
//                       {/* Online Status */}
//                       <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//                     </div>
                    
//                     {/* User Info */}
//                     <div className={`flex-1 ${viewMode === 'list' ? '' : 'mt-2'}`}>
//                       <div className="mb-2">
//                         <h3 className="font-bold text-black text-base line-clamp-1">
//                           {userProfile.displayName || 'Anonymous User'}
//                         </h3>
//                         {userProfile.headline && (
//                           <p className="text-orange-600 text-sm line-clamp-1">
//                             {userProfile.headline}
//                           </p>
//                         )}
//                       </div>
                      
//                       {/* Location & Connection Status */}
//                       <div className={`flex items-center ${viewMode === 'list' ? 'gap-3' : 'justify-center gap-2'} mb-3`}>
//                         {userProfile.location && (
//                           <div className="flex items-center text-gray-500 text-xs">
//                             <MapPin className="w-3 h-3 mr-1" />
//                             {userProfile.location}
//                           </div>
//                         )}
                        
//                         {isConnected && (
//                           <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
//                             <CheckCircle className="inline w-3 h-3 mr-1" />
//                             Connected
//                           </span>
//                         )}
                        
//                         {isPending && (
//                           <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">
//                             <Clock className="inline w-3 h-3 mr-1" />
//                             Pending
//                           </span>
//                         )}
//                       </div>
                      
//                       {/* Skills (Grid View Only) */}
//                       {viewMode === 'grid' && userProfile.skills.length > 0 && (
//                         <div className="flex flex-wrap justify-center gap-1.5 mb-4">
//                           {userProfile.skills.slice(0, 3).map((skill, idx) => (
//                             <span 
//                               key={idx} 
//                               className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-orange-50 hover:text-orange-700 transition-colors cursor-default"
//                             >
//                               {skill}
//                             </span>
//                           ))}
//                           {userProfile.skills.length > 3 && (
//                             <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
//                               +{userProfile.skills.length - 3}
//                             </span>
//                           )}
//                         </div>
//                       )}
                      
//                       {/* Action Buttons */}
//                       <div className={`flex ${viewMode === 'list' ? 'gap-3' : 'gap-2 justify-center'}`}>
//                         <button
//                           onClick={() => router.push(`/profile/${userProfile.id}`)}
//                           className={`py-2 rounded-lg font-medium text-xs transition-colors ${
//                             viewMode === 'list'
//                               ? 'flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200'
//                               : 'flex-1 bg-blue-600 text-white hover:bg-blue-700'
//                           }`}
//                         >
//                           View Profile
//                         </button>
                        
//                         {user && !isOwnProfile && (
//                           <>
//                             <button
//                               onClick={() => handleMessage(userProfile.id, userProfile.displayName || 'User')}
//                               className={`py-2 rounded-lg font-medium text-xs transition-colors ${
//                                 viewMode === 'list'
//                                   ? 'flex-1 bg-orange-100 text-orange-700 hover:bg-orange-200'
//                                   : 'flex-1 bg-orange-600 text-white hover:bg-orange-700'
//                               }`}
//                             >
//                               <MessageSquare className="inline w-3 h-3 mr-1.5" />
//                               Message
//                             </button>
                            
//                             {viewMode === 'grid' && !isConnected && !isPending && (
//                               <button
//                                 onClick={() => handleConnect(userProfile.id, userProfile.displayName || 'User')}
//                                 className="flex-1 py-2 bg-black text-white rounded-lg font-medium text-xs hover:bg-gray-800 transition-colors"
//                               >
//                                 <UserPlus className="inline w-3 h-3 mr-1.5" />
//                                 Connect
//                               </button>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     </div>
                    
//                     {/* List View Extras */}
//                     {viewMode === 'list' && userProfile.skills.length > 0 && (
//                       <div className="hidden lg:flex items-center gap-2 ml-4">
//                         <span className="text-gray-500 text-xs">Skills:</span>
//                         {userProfile.skills.slice(0, 2).map((skill, idx) => (
//                           <span 
//                             key={idx} 
//                             className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
//                           >
//                             {skill}
//                           </span>
//                         ))}
//                         {userProfile.skills.length > 2 && (
//                           <span className="text-gray-400 text-xs">
//                             +{userProfile.skills.length - 2}
//                           </span>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Footer CTA */}
//         {filteredUsers.length > 0 && (
//           <div className="mt-12 text-center">
//             <div className="inline-flex items-center gap-2 bg-orange-100 rounded-full px-5 py-2 mb-5">
//               <Zap className="w-4 h-4 text-orange-600" />
//               <span className="text-sm font-semibold text-orange-700">
//                 GROW YOUR NETWORK
//               </span>
//             </div>
            
//             <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">
//               Every connection is a new opportunity. Start building meaningful professional relationships today.
//             </p>
            
//             <div className="flex flex-col sm:flex-row gap-3 justify-center">
//               <Link 
//                 href="/dashboard"
//                 className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors inline-flex items-center justify-center gap-2"
//               >
//                 <Users className="w-4 h-4" />
//                 My Dashboard
//               </Link>
//               <Link 
//                 href="/referral/marketplace"
//                 className="px-6 py-3 bg-white border-2 border-black text-black rounded-xl font-bold hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
//               >
//                 <Briefcase className="w-4 h-4" />
//                 Explore Jobs
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function NetworkPage() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Network page failed to load">
//       <NetworkContent />
//     </ClientErrorBoundary>
//   );
// }


// 'use client';

// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { collection, getDocs, query, orderBy, limit, getDoc, doc, or, where } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebase';
// import Link from 'next/link';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';
// import { 
//   sendConnectionRequest, 
//   getConnectionStatus, 
//   areUsersConnected,
//   getUserConnectionsWithProfiles,
//   getIncomingConnectionRequests,
//   getSentConnectionRequests,
//   acceptConnectionRequest,
//   rejectConnectionRequest,
//   cancelConnectionRequest,
//   removeConnection,
//   updateConnectionNote,
//   updateConnectionTags,
//   bulkAcceptConnectionRequests,
//   bulkRejectConnectionRequests,
//   getConnectionStatistics,
//   getAllConnectionsForUser,
//   UserProfile,
//   ConnectionWithUser,
//   IncomingRequest,
//   SentRequest,
//   Connection
// } from '@/lib/connections';
// import { startConversation } from '@/lib/startConversation';
// import { 
//   Search, 
//   Users, 
//   UserPlus, 
//   MessageSquare, 
//   CheckCircle, 
//   Clock, 
//   X,
//   Trash2,
//   Tag,
//   Globe,
//   Network,
//   UserCheck,
//   UserX,
//   Send,
//   Edit,
//   BarChart3,
//   Check,
//   XCircle,
//   Filter,
//   Eye
// } from 'lucide-react';

// type TabType = 'discover' | 'network';
// type NetworkTabType = 'connections' | 'received' | 'sent';

// function NetworkContent() {
//   const [user] = useAuthState(auth);
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState<TabType>('discover');
//   const [activeNetworkTab, setActiveNetworkTab] = useState<NetworkTabType>('connections');
  
//   // Discover Tab States
//   const [discoverUsers, setDiscoverUsers] = useState<UserProfile[]>([]);
//   const [loadingDiscover, setLoadingDiscover] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [connectionStatuses, setConnectionStatuses] = useState<Record<string, Connection>>({});
  
//   // Network Tab States
//   const [connections, setConnections] = useState<ConnectionWithUser[]>([]);
//   const [receivedRequests, setReceivedRequests] = useState<IncomingRequest[]>([]);
//   const [sentRequests, setSentRequests] = useState<SentRequest[]>([]);
//   const [loadingNetwork, setLoadingNetwork] = useState(false);
//   const [networkStats, setNetworkStats] = useState({
//     totalConnections: 0,
//     pendingReceived: 0,
//     pendingSent: 0,
//     mutualConnectionsAverage: 0
//   });
  
//   // Advanced Features
//   const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
//   const [editingNote, setEditingNote] = useState<string | null>(null);
//   const [noteText, setNoteText] = useState('');
//   const [showTagsModal, setShowTagsModal] = useState<string | null>(null);
//   const [selectedTags, setSelectedTags] = useState<string[]>([]);
//   const [bulkMode, setBulkMode] = useState(false);

//   const availableTags = [
//     'Recruiter', 'Mentor', 'Colleague', 'Former Colleague',
//     'Industry Expert', 'Potential Client', 'Friend', 'Alumni',
//     'Conference Contact', 'Referral Source', 'Business Partner'
//   ];

//   // Fetch users for Discover tab - FIXED VERSION
//   useEffect(() => {
//     const fetchDiscoverUsers = async () => {
//       try {
//         setLoadingDiscover(true);
        
//         const usersQuery = query(
//           collection(db, 'users'), 
//           orderBy('createdAt', 'desc'),
//           limit(50)
//         );
        
//         const querySnapshot = await getDocs(usersQuery);
//         const usersData: UserProfile[] = [];
        
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           if (data.displayName || data.headline) {
//             usersData.push({
//               uid: doc.id,
//               displayName: data.displayName || null,
//               email: data.email || null,
//               headline: data.headline || '',
//               bio: data.bio || '',
//               skills: data.skills || [],
//               location: data.location || '',
//               profileImage: data.profileImage || '',
//               projects: data.projects || [],
//               education: data.education || '',
//               experience: data.experience || '',
//               website: data.website || '',
//               github: data.github || '',
//               linkedin: data.linkedin || '',
//               createdAt: data.createdAt
//             });
//           }
//         });
        
//         setDiscoverUsers(usersData);
        
//         // Load ALL connections for current user at once (optimized) - FIXED
//         if (user) {
//           const allConnections = await getAllConnectionsForUser(user.uid);
//           setConnectionStatuses(allConnections);
//         }
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       } finally {
//         setLoadingDiscover(false);
//       }
//     };

//     if (activeTab === 'discover') {
//       fetchDiscoverUsers();
//     }
//   }, [user, activeTab]);

//   // Fetch network data
//   const fetchNetworkData = useCallback(async () => {
//     if (!user) return;
    
//     try {
//       setLoadingNetwork(true);
      
//       const [
//         connectionsData,
//         incomingData,
//         sentData,
//         stats
//       ] = await Promise.all([
//         getUserConnectionsWithProfiles(user.uid),
//         getIncomingConnectionRequests(user.uid),
//         getSentConnectionRequests(user.uid),
//         getConnectionStatistics(user.uid)
//       ]);
      
//       setConnections(connectionsData);
//       setReceivedRequests(incomingData);
//       setSentRequests(sentData);
//       setNetworkStats(stats);
      
//       setSelectedRequests([]);
//       setBulkMode(false);
      
//     } catch (error) {
//       console.error('Error fetching network data:', error);
//       showToast('Failed to load network data', 'error');
//     } finally {
//       setLoadingNetwork(false);
//     }
//   }, [user]);

//   useEffect(() => {
//     if (activeTab === 'network' && user) {
//       fetchNetworkData();
//     }
//   }, [activeTab, user, fetchNetworkData]);

//   // Filter discover users
//   const filteredDiscoverUsers = useMemo(() => {
//     let result = [...discoverUsers];
    
//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(user => {
//         const nameMatch = user.displayName?.toLowerCase().includes(term) || false;
//         const headlineMatch = user.headline.toLowerCase().includes(term);
//         const skillsMatch = user.skills.some(skill => skill.toLowerCase().includes(term));
//         const locationMatch = user.location.toLowerCase().includes(term);
//         return nameMatch || headlineMatch || skillsMatch || locationMatch;
//       });
//     }
    
//     // Filter out current user and people already connected
//     if (user) {
//       result = result.filter(userProfile => {
//         if (userProfile.uid === user.uid) return false;
//         const status = connectionStatuses[userProfile.uid];
//         return !status || status.status !== 'accepted';
//       });
//     }
    
//     return result;
//   }, [discoverUsers, searchTerm, user, connectionStatuses]);

//   // Handle sending connection request - IMPROVED VERSION
//   const handleConnect = async (userId: string, userName: string) => {
//     if (!user) {
//       router.push('/login');
//       return;
//     }
    
//     try {
//       const connectionId = await sendConnectionRequest(user.uid, userId);
      
//       // Refresh connection statuses
//       if (activeTab === 'discover' && user) {
//         const allConnections = await getAllConnectionsForUser(user.uid);
//         setConnectionStatuses(allConnections);
//       }
      
//       showToast(`Connected with ${userName}!`, 'success');
      
//       if (activeTab === 'network') {
//         fetchNetworkData();
//       }
      
//     } catch (error: any) {
//       console.error('Error sending connection request:', error);
      
//       // Handle specific error messages better
//       if (error.message.includes('already sent you')) {
//         // This should not happen with the new logic, but just in case
//         showToast(`${userName} already sent you a connection request. Check your incoming requests.`, 'info');
        
//         // Refresh to show the correct status
//         if (user) {
//           const allConnections = await getAllConnectionsForUser(user.uid);
//           setConnectionStatuses(allConnections);
//         }
//       } else if (error.message.includes('Already connected')) {
//         showToast(`Already connected with ${userName}`, 'info');
        
//         // Refresh to show the correct status
//         if (user) {
//           const allConnections = await getAllConnectionsForUser(user.uid);
//           setConnectionStatuses(allConnections);
//         }
//       } else if (error.message.includes('already pending')) {
//         showToast(`Connection request already sent to ${userName}`, 'info');
//       } else {
//         showToast(error.message || 'Failed to send connection request', 'error');
//       }
//     }
//   };

//   // Handle messaging
//   const handleMessage = async (otherUserId: string, otherUserName: string) => {
//     if (!user) {
//       router.push('/login');
//       return;
//     }
    
//     try {
//       const isConnected = await areUsersConnected(user.uid, otherUserId);
      
//       if (!isConnected) {
//         const shouldConnect = window.confirm(
//           `Connect with ${otherUserName || 'this user'} to start messaging?`
//         );
        
//         if (shouldConnect) {
//           await handleConnect(otherUserId, otherUserName);
//         }
//         return;
//       }
      
//       const conversationId = await startConversation(user.uid, otherUserId);
//       router.push(`/dashboard/messages/${conversationId}`);
      
//     } catch (error: any) {
//       console.error('Error starting conversation:', error);
//       showToast(error.message || 'Unable to start conversation', 'error');
//     }
//   };

//   // Handle accepting connection request
//   const handleAcceptRequest = async (connectionId: string) => {
//     try {
//       await acceptConnectionRequest(connectionId);
//       showToast('Connection request accepted!', 'success');
//       fetchNetworkData();
      
//       // Also update the discover tab status
//       if (activeTab === 'discover' && user) {
//         const allConnections = await getAllConnectionsForUser(user.uid);
//         setConnectionStatuses(allConnections);
//       }
//     } catch (error) {
//       console.error('Error accepting request:', error);
//       showToast('Failed to accept request', 'error');
//     }
//   };

//   // Handle rejecting connection request
//   const handleRejectRequest = async (connectionId: string) => {
//     try {
//       await rejectConnectionRequest(connectionId);
//       showToast('Connection request declined', 'info');
//       fetchNetworkData();
      
//       // Also update the discover tab status
//       if (activeTab === 'discover' && user) {
//         const allConnections = await getAllConnectionsForUser(user.uid);
//         setConnectionStatuses(allConnections);
//       }
//     } catch (error) {
//       console.error('Error rejecting request:', error);
//       showToast('Failed to decline request', 'error');
//     }
//   };

//   // Handle cancelling sent request
//   const handleCancelRequest = async (connectionId: string) => {
//     if (window.confirm('Are you sure you want to cancel this connection request?')) {
//       try {
//         await cancelConnectionRequest(connectionId);
//         showToast('Connection request cancelled', 'info');
//         fetchNetworkData();
        
//         // Also update the discover tab status
//         if (activeTab === 'discover' && user) {
//           const allConnections = await getAllConnectionsForUser(user.uid);
//           setConnectionStatuses(allConnections);
//         }
//       } catch (error) {
//         console.error('Error cancelling request:', error);
//         showToast('Failed to cancel request', 'error');
//       }
//     }
//   };

//   // Handle removing connection
//   const handleRemoveConnection = async (connectionId: string) => {
//     if (window.confirm('Are you sure you want to remove this connection?')) {
//       try {
//         await removeConnection(connectionId);
//         showToast('Connection removed', 'info');
//         fetchNetworkData();
        
//         // Also update the discover tab status
//         if (activeTab === 'discover' && user) {
//           const allConnections = await getAllConnectionsForUser(user.uid);
//           setConnectionStatuses(allConnections);
//         }
//       } catch (error) {
//         console.error('Error removing connection:', error);
//         showToast('Failed to remove connection', 'error');
//       }
//     }
//   };

//   // Handle updating connection note
//   const handleUpdateNote = async (connectionId: string) => {
//     if (!noteText.trim()) return;
    
//     try {
//       await updateConnectionNote(connectionId, noteText);
//       showToast('Note updated successfully', 'success');
//       setEditingNote(null);
//       setNoteText('');
//       fetchNetworkData();
//     } catch (error) {
//       console.error('Error updating note:', error);
//       showToast('Failed to update note', 'error');
//     }
//   };

//   // Handle updating connection tags
//   const handleUpdateTags = async (connectionId: string) => {
//     try {
//       await updateConnectionTags(connectionId, selectedTags);
//       showToast('Tags updated successfully', 'success');
//       setShowTagsModal(null);
//       setSelectedTags([]);
//       fetchNetworkData();
//     } catch (error) {
//       console.error('Error updating tags:', error);
//       showToast('Failed to update tags', 'error');
//     }
//   };

//   // Bulk accept requests
//   const handleBulkAccept = async () => {
//     if (selectedRequests.length === 0) return;
    
//     try {
//       await bulkAcceptConnectionRequests(selectedRequests);
//       showToast(`${selectedRequests.length} requests accepted!`, 'success');
//       fetchNetworkData();
      
//       // Also update the discover tab status
//       if (activeTab === 'discover' && user) {
//         const allConnections = await getAllConnectionsForUser(user.uid);
//         setConnectionStatuses(allConnections);
//       }
//     } catch (error) {
//       console.error('Error bulk accepting requests:', error);
//       showToast('Failed to accept requests', 'error');
//     }
//   };

//   // Bulk reject requests
//   const handleBulkReject = async () => {
//     if (selectedRequests.length === 0) return;
    
//     try {
//       await bulkRejectConnectionRequests(selectedRequests);
//       showToast(`${selectedRequests.length} requests declined`, 'info');
//       fetchNetworkData();
      
//       // Also update the discover tab status
//       if (activeTab === 'discover' && user) {
//         const allConnections = await getAllConnectionsForUser(user.uid);
//         setConnectionStatuses(allConnections);
//       }
//     } catch (error) {
//       console.error('Error bulk rejecting requests:', error);
//       showToast('Failed to decline requests', 'error');
//     }
//   };

//   // Toggle request selection for bulk operations
//   const toggleRequestSelection = (connectionId: string) => {
//     setSelectedRequests(prev =>
//       prev.includes(connectionId)
//         ? prev.filter(id => id !== connectionId)
//         : [...prev, connectionId]
//     );
//   };

//   // Select all requests
//   const selectAllRequests = () => {
//     const allIds = receivedRequests.map(req => req.id);
//     setSelectedRequests(allIds);
//   };

//   // Clear all selections
//   const clearSelections = () => {
//     setSelectedRequests([]);
//     setBulkMode(false);
//   };

//   // Toast helper
//   const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
//     const event = new CustomEvent('showToast', {
//       detail: { message, type }
//     });
//     window.dispatchEvent(event);
//   };

//   if (loadingDiscover && activeTab === 'discover') {
//     return (
//       <div className="min-h-screen bg-white py-12">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-7xl mx-auto px-4 py-8">
        
//         {/* Header */}
//         <div className="mb-10">
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center gap-2">
//               <Network className="w-8 h-8 text-orange-600" />
//               <h1 className="text-3xl font-bold text-gray-900">Professional Network</h1>
//             </div>
//             {user && (
//               <div className="flex items-center gap-2">
//                 <Link
//                   href="/dashboard"
//                   className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
//                 >
//                   Dashboard
//                 </Link>
//                 <Link
//                   href="/referral/marketplace"
//                   className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
//                 >
//                   Referral Jobs
//                 </Link>
//               </div>
//             )}
//           </div>
//           <p className="text-gray-600">
//             Connect with professionals, manage your network, and grow your career
//           </p>
//         </div>

//         {/* Main Tabs */}
//         <div className="mb-8">
//           <div className="flex space-x-1 border-b border-gray-200">
//             <button
//               onClick={() => setActiveTab('discover')}
//               className={`py-3 px-6 text-sm font-medium rounded-t-lg transition-all ${
//                 activeTab === 'discover'
//                   ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
//                   : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <div className="flex items-center gap-2">
//                 <UserPlus className="w-4 h-4" />
//                 Discover Professionals
//               </div>
//             </button>
//             <button
//               onClick={() => setActiveTab('network')}
//               className={`py-3 px-6 text-sm font-medium rounded-t-lg transition-all relative ${
//                 activeTab === 'network'
//                   ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
//                   : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <div className="flex items-center gap-2">
//                 <Users className="w-4 h-4" />
//                 My Network
//                 {networkStats.pendingReceived > 0 && (
//                   <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
//                     {networkStats.pendingReceived}
//                   </span>
//                 )}
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Discover Tab */}
//         {activeTab === 'discover' && (
//           <div className="space-y-6">
//             {/* Search Bar */}
//             <div className="relative">
//               <div className="relative max-w-2xl mx-auto">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search professionals by name, skills, location, or company..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all shadow-sm"
//                   autoComplete="off"
//                 />
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm('')}
//                     className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Results */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredDiscoverUsers.map((userProfile) => {
//                 const connection = connectionStatuses[userProfile.uid];
//                 const isConnected = connection?.status === 'accepted';
//                 const isPending = connection?.status === 'pending';
//                 const isOwnProfile = user && user.uid === userProfile.uid;
//                 const isIncomingRequest = connection && connection.toUserId === user?.uid;
                
//                 return (
//                   <div 
//                     key={userProfile.uid}
//                     className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 group hover:border-orange-300"
//                   >
//                     {/* Profile Header */}
//                     <div className="flex items-start gap-3 mb-3">
//                       {/* Avatar */}
//                       <div className="relative">
//                         {userProfile.profileImage ? (
//                           <img 
//                             src={userProfile.profileImage} 
//                             alt={userProfile.displayName || 'User'} 
//                             className="w-14 h-14 rounded-lg object-cover border-2 border-white shadow-sm group-hover:border-orange-100 transition-colors"
//                           />
//                         ) : (
//                           <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center border-2 border-white shadow-sm group-hover:border-orange-100 transition-colors">
//                             <span className="font-bold text-orange-600 text-xl">
//                               {userProfile.displayName?.[0]?.toUpperCase() || userProfile.email?.[0]?.toUpperCase() || 'U'}
//                             </span>
//                           </div>
//                         )}
//                         <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//                       </div>
                      
//                       {/* User Info */}
//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-semibold text-gray-900 truncate">
//                           {userProfile.displayName || 'Anonymous User'}
//                         </h3>
//                         {userProfile.headline && (
//                           <p className="text-sm text-orange-600 truncate">
//                             {userProfile.headline}
//                           </p>
//                         )}
//                         {userProfile.location && (
//                           <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
//                             <Globe className="w-3 h-3" />
//                             {userProfile.location}
//                           </p>
//                         )}
//                       </div>
//                     </div>
                    
//                     {/* Skills */}
//                     {userProfile.skills.length > 0 && (
//                       <div className="mb-4">
//                         <div className="flex flex-wrap gap-1">
//                           {userProfile.skills.slice(0, 3).map((skill, idx) => (
//                             <span 
//                               key={idx}
//                               className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-orange-50 hover:text-orange-700 transition-colors cursor-default"
//                             >
//                               {skill}
//                             </span>
//                           ))}
//                           {userProfile.skills.length > 3 && (
//                             <span className="px-2 py-1 text-gray-400 text-xs">
//                               +{userProfile.skills.length - 3}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     )}
                    
//                     {/* Connection Status */}
//                     {connection && (
//                       <div className="mb-3">
//                         {isConnected ? (
//                           <div className="flex items-center gap-1 text-green-600 text-xs">
//                             <CheckCircle className="w-3 h-3" />
//                             <span>Connected</span>
//                           </div>
//                         ) : isPending ? (
//                           <div className="flex items-center gap-1 text-orange-500 text-xs">
//                             <Clock className="w-3 h-3 animate-pulse" />
//                             <span>{isIncomingRequest ? 'Request received' : 'Request sent'}</span>
//                           </div>
//                         ) : null}
//                       </div>
//                     )}
                    
//                     {/* Action Buttons */}
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => router.push(`/profile/${userProfile.uid}`)}
//                         className="flex-1 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
//                       >
//                         <Eye className="w-4 h-4" />
//                         View
//                       </button>
                      
//                       {user && !isOwnProfile && (
//                         <>
//                           {!isConnected && !isPending && (
//                             <button
//                               onClick={() => handleConnect(userProfile.uid, userProfile.displayName || 'User')}
//                               className="flex-1 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-1"
//                             >
//                               <UserPlus className="w-4 h-4" />
//                               Connect
//                             </button>
//                           )}
                          
//                           {isPending && isIncomingRequest && (
//                             <div className="flex gap-1 flex-1">
//                               <button
//                                 onClick={() => handleAcceptRequest(connection.id)}
//                                 className="flex-1 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
//                               >
//                                 <Check className="w-4 h-4" />
//                                 Accept
//                               </button>
//                               <button
//                                 onClick={() => handleRejectRequest(connection.id)}
//                                 className="flex-1 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
//                               >
//                                 <XCircle className="w-4 h-4" />
//                                 Decline
//                               </button>
//                             </div>
//                           )}
                          
//                           {isPending && !isIncomingRequest && (
//                             <button
//                               onClick={() => handleCancelRequest(connection.id)}
//                               className="flex-1 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-1"
//                             >
//                               <Clock className="w-4 h-4" />
//                               Cancel
//                             </button>
//                           )}
                          
//                           {isConnected && (
//                             <button
//                               onClick={() => handleMessage(userProfile.uid, userProfile.displayName || 'User')}
//                               className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
//                             >
//                               <MessageSquare className="w-4 h-4" />
//                               Message
//                             </button>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
            
//             {filteredDiscoverUsers.length === 0 && (
//               <div className="text-center py-12">
//                 <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Users className="w-10 h-10 text-gray-400" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">No professionals found</h3>
//                 <p className="text-gray-600 mb-6">
//                   {searchTerm ? 'Try different search terms or clear search' : 'Check back soon for new professionals'}
//                 </p>
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm('')}
//                     className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
//                   >
//                     Clear Search
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {/* My Network Tab */}
//         {activeTab === 'network' && (
//           <div className="space-y-6">
//             {/* Network Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="bg-white border border-gray-200 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-500">Total Connections</p>
//                     <p className="text-2xl font-bold text-gray-900">{networkStats.totalConnections}</p>
//                   </div>
//                   <Users className="w-8 h-8 text-orange-500" />
//                 </div>
//               </div>
              
//               <div className="bg-white border border-gray-200 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-500">Pending Received</p>
//                     <p className="text-2xl font-bold text-gray-900">{networkStats.pendingReceived}</p>
//                   </div>
//                   <UserPlus className="w-8 h-8 text-blue-500" />
//                 </div>
//               </div>
              
//               <div className="bg-white border border-gray-200 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-500">Pending Sent</p>
//                     <p className="text-2xl font-bold text-gray-900">{networkStats.pendingSent}</p>
//                   </div>
//                   <Send className="w-8 h-8 text-green-500" />
//                 </div>
//               </div>
              
//               <div className="bg-white border border-gray-200 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-500">Avg. Mutual</p>
//                     <p className="text-2xl font-bold text-gray-900">{networkStats.mutualConnectionsAverage}</p>
//                   </div>
//                   <BarChart3 className="w-8 h-8 text-purple-500" />
//                 </div>
//               </div>
//             </div>

//             {/* Network Tabs */}
//             <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
//               <div className="flex border-b border-gray-200">
//                 <button
//                   onClick={() => setActiveNetworkTab('connections')}
//                   className={`flex-1 py-3 text-sm font-medium ${
//                     activeNetworkTab === 'connections'
//                       ? 'text-orange-600 border-b-2 border-orange-600'
//                       : 'text-gray-500 hover:text-gray-700'
//                   }`}
//                 >
//                   <div className="flex items-center justify-center gap-2">
//                     <UserCheck className="w-4 h-4" />
//                     Connections ({connections.length})
//                   </div>
//                 </button>
//                 <button
//                   onClick={() => setActiveNetworkTab('received')}
//                   className={`flex-1 py-3 text-sm font-medium relative ${
//                     activeNetworkTab === 'received'
//                       ? 'text-orange-600 border-b-2 border-orange-600'
//                       : 'text-gray-500 hover:text-gray-700'
//                   }`}
//                 >
//                   <div className="flex items-center justify-center gap-2">
//                     <UserPlus className="w-4 h-4" />
//                     Received ({receivedRequests.length})
//                     {receivedRequests.length > 0 && (
//                       <span className="absolute top-2 right-6 bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
//                         {receivedRequests.length}
//                       </span>
//                     )}
//                   </div>
//                 </button>
//                 <button
//                   onClick={() => setActiveNetworkTab('sent')}
//                   className={`flex-1 py-3 text-sm font-medium ${
//                     activeNetworkTab === 'sent'
//                       ? 'text-orange-600 border-b-2 border-orange-600'
//                       : 'text-gray-500 hover:text-gray-700'
//                   }`}
//                 >
//                   <div className="flex items-center justify-center gap-2">
//                     <Send className="w-4 h-4" />
//                     Sent ({sentRequests.length})
//                   </div>
//                 </button>
//               </div>

//               {/* Connections Tab */}
//               {activeNetworkTab === 'connections' && (
//                 <div className="p-6">
//                   {loadingNetwork ? (
//                     <div className="flex justify-center items-center h-40">
//                       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
//                     </div>
//                   ) : connections.length === 0 ? (
//                     <div className="text-center py-12">
//                       <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                       <h3 className="text-lg font-semibold text-gray-900 mb-2">No connections yet</h3>
//                       <p className="text-gray-600 mb-6">
//                         Start connecting with professionals to build your network
//                       </p>
//                       <button
//                         onClick={() => setActiveTab('discover')}
//                         className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
//                       >
//                         Discover Professionals
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <div className="flex justify-between items-center mb-4">
//                         <h3 className="text-lg font-semibold text-gray-900">
//                           Your Connections ({connections.length})
//                         </h3>
//                         <div className="text-sm text-gray-500">
//                           Sorted by most recent
//                         </div>
//                       </div>
                      
//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {connections.map((connection) => (
//                           <div key={connection.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
//                             <div className="flex items-start gap-3 mb-3">
//                               {connection.otherUser.profileImage ? (
//                                 <img 
//                                   src={connection.otherUser.profileImage} 
//                                   alt={connection.otherUser.displayName || 'User'} 
//                                   className="w-12 h-12 rounded-lg object-cover"
//                                 />
//                               ) : (
//                                 <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
//                                   <span className="font-bold text-orange-600">
//                                     {connection.otherUser.displayName?.[0]?.toUpperCase() || 'U'}
//                                   </span>
//                                 </div>
//                               )}
//                               <div className="flex-1 min-w-0">
//                                 <h4 className="font-semibold text-gray-900 truncate">
//                                   {connection.otherUser.displayName || 'Anonymous User'}
//                                 </h4>
//                                 <p className="text-sm text-orange-600 truncate">
//                                   {connection.otherUser.headline}
//                                 </p>
//                                 <p className="text-xs text-gray-500 truncate">
//                                   {connection.otherUser.location}
//                                 </p>
//                               </div>
//                             </div>
                            
//                             <div className="flex gap-2">
//                               <button
//                                 onClick={() => router.push(`/profile/${connection.otherUser.uid}`)}
//                                 className="flex-1 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
//                               >
//                                 View Profile
//                               </button>
//                               <button
//                                 onClick={() => handleMessage(connection.otherUser.uid, connection.otherUser.displayName || 'User')}
//                                 className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
//                               >
//                                 Message
//                               </button>
//                             </div>
                            
//                             <button
//                               onClick={() => handleRemoveConnection(connection.id)}
//                               className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
//                             >
//                               Remove Connection
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Received Requests Tab */}
//               {activeNetworkTab === 'received' && (
//                 <div className="p-6">
//                   {loadingNetwork ? (
//                     <div className="flex justify-center items-center h-40">
//                       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
//                     </div>
//                   ) : receivedRequests.length === 0 ? (
//                     <div className="text-center py-12">
//                       <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                       <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending requests</h3>
//                       <p className="text-gray-600">
//                         You don't have any pending connection requests
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <div className="flex justify-between items-center mb-4">
//                         <h3 className="text-lg font-semibold text-gray-900">
//                           Connection Requests ({receivedRequests.length})
//                         </h3>
//                         <div className="flex gap-2">
//                           {!bulkMode ? (
//                             <button
//                               onClick={() => setBulkMode(true)}
//                               className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
//                             >
//                               Bulk Actions
//                             </button>
//                           ) : (
//                             <>
//                               <button
//                                 onClick={selectAllRequests}
//                                 className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
//                               >
//                                 Select All
//                               </button>
//                               <button
//                                 onClick={clearSelections}
//                                 className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
//                               >
//                                 Clear
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       </div>

//                       {bulkMode && selectedRequests.length > 0 && (
//                         <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-2">
//                               <CheckCircle className="w-5 h-5 text-orange-600" />
//                               <span className="font-medium text-orange-800">
//                                 {selectedRequests.length} request(s) selected
//                               </span>
//                             </div>
//                             <div className="flex gap-2">
//                               <button
//                                 onClick={handleBulkAccept}
//                                 className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
//                               >
//                                 Accept Selected
//                               </button>
//                               <button
//                                 onClick={handleBulkReject}
//                                 className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
//                               >
//                                 Reject Selected
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       <div className="space-y-3">
//                         {receivedRequests.map((request) => (
//                           <div key={request.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4">
//                             <div className="flex items-center gap-3">
//                               {bulkMode && (
//                                 <input
//                                   type="checkbox"
//                                   checked={selectedRequests.includes(request.id)}
//                                   onChange={() => toggleRequestSelection(request.id)}
//                                   className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
//                                 />
//                               )}
//                               {request.fromUser.profileImage ? (
//                                 <img 
//                                   src={request.fromUser.profileImage} 
//                                   alt={request.fromUser.displayName || 'User'} 
//                                   className="w-12 h-12 rounded-lg object-cover"
//                                 />
//                               ) : (
//                                 <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
//                                   <span className="font-bold text-orange-600">
//                                     {request.fromUser.displayName?.[0]?.toUpperCase() || 'U'}
//                                   </span>
//                                 </div>
//                               )}
//                               <div>
//                                 <h4 className="font-semibold text-gray-900">
//                                   {request.fromUser.displayName || 'Anonymous User'}
//                                 </h4>
//                                 <p className="text-sm text-gray-600">
//                                   {request.fromUser.headline}
//                                 </p>
//                                 <p className="text-xs text-gray-500">
//                                   {request.mutualConnections || 0} mutual connections
//                                 </p>
//                               </div>
//                             </div>
                            
//                             {!bulkMode && (
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => router.push(`/profile/${request.fromUser.uid}`)}
//                                   className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
//                                 >
//                                   View Profile
//                                 </button>
//                                 <button
//                                   onClick={() => handleAcceptRequest(request.id)}
//                                   className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
//                                 >
//                                   Accept
//                                 </button>
//                                 <button
//                                   onClick={() => handleRejectRequest(request.id)}
//                                   className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
//                                 >
//                                   Decline
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Sent Requests Tab */}
//               {activeNetworkTab === 'sent' && (
//                 <div className="p-6">
//                   {loadingNetwork ? (
//                     <div className="flex justify-center items-center h-40">
//                       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
//                     </div>
//                   ) : sentRequests.length === 0 ? (
//                     <div className="text-center py-12">
//                       <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                       <h3 className="text-lg font-semibold text-gray-900 mb-2">No sent requests</h3>
//                       <p className="text-gray-600">
//                         You haven't sent any connection requests yet
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                         Sent Requests ({sentRequests.length})
//                       </h3>
                      
//                       <div className="space-y-3">
//                         {sentRequests.map((request) => (
//                           <div key={request.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4">
//                             <div className="flex items-center gap-3">
//                               {request.toUser.profileImage ? (
//                                 <img 
//                                   src={request.toUser.profileImage} 
//                                   alt={request.toUser.displayName || 'User'} 
//                                   className="w-12 h-12 rounded-lg object-cover"
//                                 />
//                               ) : (
//                                 <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
//                                   <span className="font-bold text-orange-600">
//                                     {request.toUser.displayName?.[0]?.toUpperCase() || 'U'}
//                                   </span>
//                                 </div>
//                               )}
//                               <div>
//                                 <h4 className="font-semibold text-gray-900">
//                                   {request.toUser.displayName || 'Anonymous User'}
//                                 </h4>
//                                 <p className="text-sm text-gray-600">
//                                   {request.toUser.headline}
//                                 </p>
//                                 <p className="text-xs text-gray-500">
//                                   Sent {request.createdAt?.toDate ? request.createdAt.toDate().toLocaleDateString() : 'recently'}
//                                 </p>
//                               </div>
//                             </div>
                            
//                             <div className="flex gap-2">
//                               <button
//                                 onClick={() => router.push(`/profile/${request.toUser.uid}`)}
//                                 className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
//                               >
//                                 View Profile
//                               </button>
//                               <button
//                                 onClick={() => handleCancelRequest(request.id)}
//                                 className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
//                               >
//                                 Cancel
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function NetworkPage() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Network page failed to load">
//       <NetworkContent />
//     </ClientErrorBoundary>
//   );
// }

// 'use client';

// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { collection, getDocs, query, orderBy, limit, getDoc, doc, or, where } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebase';
// import Link from 'next/link';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';
// import { 
//   sendConnectionRequest, 
//   getConnectionStatus, 
//   areUsersConnected,
//   getUserConnectionsWithProfiles,
//   getIncomingConnectionRequests,
//   getSentConnectionRequests,
//   acceptConnectionRequest,
//   rejectConnectionRequest,
//   cancelConnectionRequest,
//   removeConnection,
//   updateConnectionNote,
//   updateConnectionTags,
//   bulkAcceptConnectionRequests,
//   bulkRejectConnectionRequests,
//   getConnectionStatistics,
//   getAllConnectionsForUser,
//   UserProfile,
//   ConnectionWithUser,
//   IncomingRequest,
//   SentRequest,
//   Connection
// } from '@/lib/connections';
// import { startConversation } from '@/lib/startConversation';
// // REMOVE getLastSeenText import from onlineStatus
// import { useMultipleUserOnlineStatus } from '@/hooks/useOnlineStatus';
// import { 
//   Search, 
//   Users, 
//   UserPlus, 
//   MessageSquare, 
//   CheckCircle, 
//   Clock, 
//   X,
//   Trash2,
//   Tag,
//   Globe,
//   Network,
//   UserCheck,
//   UserX,
//   Send,
//   Edit,
//   BarChart3,
//   Check,
//   XCircle,
//   Filter,
//   Eye
// } from 'lucide-react';

// type TabType = 'discover' | 'network';
// type NetworkTabType = 'connections' | 'received' | 'sent';

// function NetworkContent() {
//   const [user] = useAuthState(auth);
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState<TabType>('discover');
//   const [activeNetworkTab, setActiveNetworkTab] = useState<NetworkTabType>('connections');
  
//   // Discover Tab States
//   const [discoverUsers, setDiscoverUsers] = useState<UserProfile[]>([]);
//   const [loadingDiscover, setLoadingDiscover] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [connectionStatuses, setConnectionStatuses] = useState<Record<string, Connection>>({});
  
//   // Network Tab States
//   const [connections, setConnections] = useState<ConnectionWithUser[]>([]);
//   const [receivedRequests, setReceivedRequests] = useState<IncomingRequest[]>([]);
//   const [sentRequests, setSentRequests] = useState<SentRequest[]>([]);
//   const [loadingNetwork, setLoadingNetwork] = useState(false);
//   const [networkStats, setNetworkStats] = useState({
//     totalConnections: 0,
//     pendingReceived: 0,
//     pendingSent: 0,
//     mutualConnectionsAverage: 0
//   });
  
//   // Advanced Features
//   const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
//   const [editingNote, setEditingNote] = useState<string | null>(null);
//   const [noteText, setNoteText] = useState('');
//   const [showTagsModal, setShowTagsModal] = useState<string | null>(null);
//   const [selectedTags, setSelectedTags] = useState<string[]>([]);
//   const [bulkMode, setBulkMode] = useState(false);

//   const availableTags = [
//     'Recruiter', 'Mentor', 'Colleague', 'Former Colleague',
//     'Industry Expert', 'Potential Client', 'Friend', 'Alumni',
//     'Conference Contact', 'Referral Source', 'Business Partner'
//   ];

//   // ONLINE STATUS: Get user IDs for batch checking
//   const discoverUserIds = useMemo(() => {
//     return discoverUsers.map(user => user.uid);
//   }, [discoverUsers]);

//   const connectionUserIds = useMemo(() => {
//     return connections.map(conn => conn.otherUser.uid);
//   }, [connections]);

//   const receivedRequestUserIds = useMemo(() => {
//     return receivedRequests.map(req => req.fromUser.uid);
//   }, [receivedRequests]);

//   const sentRequestUserIds = useMemo(() => {
//     return sentRequests.map(req => req.toUser.uid);
//   }, [sentRequests]);

//   // ONLINE STATUS: Determine which user IDs to check based on active tab
//   const userIdsForStatusCheck = useMemo(() => {
//     if (activeTab === 'discover') {
//       return discoverUserIds;
//     } else if (activeTab === 'network') {
//       if (activeNetworkTab === 'connections') {
//         return connectionUserIds;
//       } else if (activeNetworkTab === 'received') {
//         return receivedRequestUserIds;
//       } else if (activeNetworkTab === 'sent') {
//         return sentRequestUserIds;
//       }
//     }
//     return [];
//   }, [activeTab, activeNetworkTab, discoverUserIds, connectionUserIds, receivedRequestUserIds, sentRequestUserIds]);

//   // ONLINE STATUS: Use batch online status hook - FIXED
//   const { statusMap: userOnlineStatuses, loading: statusLoading } = useMultipleUserOnlineStatus(userIdsForStatusCheck);

//   // Fetch users for Discover tab - FIXED VERSION
//   useEffect(() => {
//     const fetchDiscoverUsers = async () => {
//       try {
//         setLoadingDiscover(true);
        
//         const usersQuery = query(
//           collection(db, 'users'), 
//           orderBy('createdAt', 'desc'),
//           limit(50)
//         );
        
//         const querySnapshot = await getDocs(usersQuery);
//         const usersData: UserProfile[] = [];
        
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           if (data.displayName || data.headline) {
//             usersData.push({
//               uid: doc.id,
//               displayName: data.displayName || null,
//               email: data.email || null,
//               headline: data.headline || '',
//               bio: data.bio || '',
//               skills: data.skills || [],
//               location: data.location || '',
//               profileImage: data.profileImage || '',
//               projects: data.projects || [],
//               education: data.education || '',
//               experience: data.experience || '',
//               website: data.website || '',
//               github: data.github || '',
//               linkedin: data.linkedin || '',
//               createdAt: data.createdAt
//             });
//           }
//         });
        
//         setDiscoverUsers(usersData);
        
//         // Load ALL connections for current user at once (optimized) - FIXED
//         if (user) {
//           const allConnections = await getAllConnectionsForUser(user.uid);
//           setConnectionStatuses(allConnections);
//         }
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       } finally {
//         setLoadingDiscover(false);
//       }
//     };

//     if (activeTab === 'discover') {
//       fetchDiscoverUsers();
//     }
//   }, [user, activeTab]);

//   // Fetch network data
//   const fetchNetworkData = useCallback(async () => {
//     if (!user) return;
    
//     try {
//       setLoadingNetwork(true);
      
//       const [
//         connectionsData,
//         incomingData,
//         sentData,
//         stats
//       ] = await Promise.all([
//         getUserConnectionsWithProfiles(user.uid),
//         getIncomingConnectionRequests(user.uid),
//         getSentConnectionRequests(user.uid),
//         getConnectionStatistics(user.uid)
//       ]);
      
//       setConnections(connectionsData);
//       setReceivedRequests(incomingData);
//       setSentRequests(sentData);
//       setNetworkStats(stats);
      
//       setSelectedRequests([]);
//       setBulkMode(false);
      
//     } catch (error) {
//       console.error('Error fetching network data:', error);
//       showToast('Failed to load network data', 'error');
//     } finally {
//       setLoadingNetwork(false);
//     }
//   }, [user]);

//   useEffect(() => {
//     if (activeTab === 'network' && user) {
//       fetchNetworkData();
//     }
//   }, [activeTab, user, fetchNetworkData]);

//   // Filter discover users
//   const filteredDiscoverUsers = useMemo(() => {
//     let result = [...discoverUsers];
    
//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(user => {
//         const nameMatch = user.displayName?.toLowerCase().includes(term) || false;
//         const headlineMatch = user.headline.toLowerCase().includes(term);
//         const skillsMatch = user.skills.some(skill => skill.toLowerCase().includes(term));
//         const locationMatch = user.location.toLowerCase().includes(term);
//         return nameMatch || headlineMatch || skillsMatch || locationMatch;
//       });
//     }
    
//     // Filter out current user and people already connected
//     if (user) {
//       result = result.filter(userProfile => {
//         if (userProfile.uid === user.uid) return false;
//         const status = connectionStatuses[userProfile.uid];
//         return !status || status.status !== 'accepted';
//       });
//     }
    
//     return result;
//   }, [discoverUsers, searchTerm, user, connectionStatuses]);

//   // Handle sending connection request - IMPROVED VERSION
//   const handleConnect = async (userId: string, userName: string) => {
//     if (!user) {
//       router.push('/login');
//       return;
//     }
    
//     try {
//       const connectionId = await sendConnectionRequest(user.uid, userId);
      
//       // Refresh connection statuses
//       if (activeTab === 'discover' && user) {
//         const allConnections = await getAllConnectionsForUser(user.uid);
//         setConnectionStatuses(allConnections);
//       }
      
//       showToast(`Connected with ${userName}!`, 'success');
      
//       if (activeTab === 'network') {
//         fetchNetworkData();
//       }
      
//     } catch (error: any) {
//       console.error('Error sending connection request:', error);
      
//       // Handle specific error messages better
//       if (error.message.includes('already sent you')) {
//         // This should not happen with the new logic, but just in case
//         showToast(`${userName} already sent you a connection request. Check your incoming requests.`, 'info');
        
//         // Refresh to show the correct status
//         if (user) {
//           const allConnections = await getAllConnectionsForUser(user.uid);
//           setConnectionStatuses(allConnections);
//         }
//       } else if (error.message.includes('Already connected')) {
//         showToast(`Already connected with ${userName}`, 'info');
        
//         // Refresh to show the correct status
//         if (user) {
//           const allConnections = await getAllConnectionsForUser(user.uid);
//           setConnectionStatuses(allConnections);
//         }
//       } else if (error.message.includes('already pending')) {
//         showToast(`Connection request already sent to ${userName}`, 'info');
//       } else {
//         showToast(error.message || 'Failed to send connection request', 'error');
//       }
//     }
//   };

//   // Handle messaging
//   const handleMessage = async (otherUserId: string, otherUserName: string) => {
//     if (!user) {
//       router.push('/login');
//       return;
//     }
    
//     try {
//       const isConnected = await areUsersConnected(user.uid, otherUserId);
      
//       if (!isConnected) {
//         const shouldConnect = window.confirm(
//           `Connect with ${otherUserName || 'this user'} to start messaging?`
//         );
        
//         if (shouldConnect) {
//           await handleConnect(otherUserId, otherUserName);
//         }
//         return;
//       }
      
//       const conversationId = await startConversation(user.uid, otherUserId);
//       router.push(`/dashboard/messages/${conversationId}`);
      
//     } catch (error: any) {
//       console.error('Error starting conversation:', error);
//       showToast(error.message || 'Unable to start conversation', 'error');
//     }
//   };

//   // Handle accepting connection request
//   const handleAcceptRequest = async (connectionId: string) => {
//     try {
//       await acceptConnectionRequest(connectionId);
//       showToast('Connection request accepted!', 'success');
//       fetchNetworkData();
      
//       // Also update the discover tab status
//       if (activeTab === 'discover' && user) {
//         const allConnections = await getAllConnectionsForUser(user.uid);
//         setConnectionStatuses(allConnections);
//       }
//     } catch (error) {
//       console.error('Error accepting request:', error);
//       showToast('Failed to accept request', 'error');
//     }
//   };

//   // Handle rejecting connection request
//   const handleRejectRequest = async (connectionId: string) => {
//     try {
//       await rejectConnectionRequest(connectionId);
//       showToast('Connection request declined', 'info');
//       fetchNetworkData();
      
//       // Also update the discover tab status
//       if (activeTab === 'discover' && user) {
//         const allConnections = await getAllConnectionsForUser(user.uid);
//         setConnectionStatuses(allConnections);
//       }
//     } catch (error) {
//       console.error('Error rejecting request:', error);
//       showToast('Failed to decline request', 'error');
//     }
//   };

//   // Handle cancelling sent request
//   const handleCancelRequest = async (connectionId: string) => {
//     if (window.confirm('Are you sure you want to cancel this connection request?')) {
//       try {
//         await cancelConnectionRequest(connectionId);
//         showToast('Connection request cancelled', 'info');
//         fetchNetworkData();
        
//         // Also update the discover tab status
//         if (activeTab === 'discover' && user) {
//           const allConnections = await getAllConnectionsForUser(user.uid);
//           setConnectionStatuses(allConnections);
//         }
//       } catch (error) {
//         console.error('Error cancelling request:', error);
//         showToast('Failed to cancel request', 'error');
//       }
//     }
//   };

//   // Handle removing connection
//   const handleRemoveConnection = async (connectionId: string) => {
//     if (window.confirm('Are you sure you want to remove this connection?')) {
//       try {
//         await removeConnection(connectionId);
//         showToast('Connection removed', 'info');
//         fetchNetworkData();
        
//         // Also update the discover tab status
//         if (activeTab === 'discover' && user) {
//           const allConnections = await getAllConnectionsForUser(user.uid);
//           setConnectionStatuses(allConnections);
//         }
//       } catch (error) {
//         console.error('Error removing connection:', error);
//         showToast('Failed to remove connection', 'error');
//       }
//     }
//   };

//   // Handle updating connection note
//   const handleUpdateNote = async (connectionId: string) => {
//     if (!noteText.trim()) return;
    
//     try {
//       await updateConnectionNote(connectionId, noteText);
//       showToast('Note updated successfully', 'success');
//       setEditingNote(null);
//       setNoteText('');
//       fetchNetworkData();
//     } catch (error) {
//       console.error('Error updating note:', error);
//       showToast('Failed to update note', 'error');
//     }
//   };

//   // Handle updating connection tags
//   const handleUpdateTags = async (connectionId: string) => {
//     try {
//       await updateConnectionTags(connectionId, selectedTags);
//       showToast('Tags updated successfully', 'success');
//       setShowTagsModal(null);
//       setSelectedTags([]);
//       fetchNetworkData();
//     } catch (error) {
//       console.error('Error updating tags:', error);
//       showToast('Failed to update tags', 'error');
//     }
//   };

//   // Bulk accept requests
//   const handleBulkAccept = async () => {
//     if (selectedRequests.length === 0) return;
    
//     try {
//       await bulkAcceptConnectionRequests(selectedRequests);
//       showToast(`${selectedRequests.length} requests accepted!`, 'success');
//       fetchNetworkData();
      
//       // Also update the discover tab status
//       if (activeTab === 'discover' && user) {
//         const allConnections = await getAllConnectionsForUser(user.uid);
//         setConnectionStatuses(allConnections);
//       }
//     } catch (error) {
//       console.error('Error bulk accepting requests:', error);
//       showToast('Failed to accept requests', 'error');
//     }
//   };

//   // Bulk reject requests
//   const handleBulkReject = async () => {
//     if (selectedRequests.length === 0) return;
    
//     try {
//       await bulkRejectConnectionRequests(selectedRequests);
//       showToast(`${selectedRequests.length} requests declined`, 'info');
//       fetchNetworkData();
      
//       // Also update the discover tab status
//       if (activeTab === 'discover' && user) {
//         const allConnections = await getAllConnectionsForUser(user.uid);
//         setConnectionStatuses(allConnections);
//       }
//     } catch (error) {
//       console.error('Error bulk rejecting requests:', error);
//       showToast('Failed to decline requests', 'error');
//     }
//   };

//   // Toggle request selection for bulk operations
//   const toggleRequestSelection = (connectionId: string) => {
//     setSelectedRequests(prev =>
//       prev.includes(connectionId)
//         ? prev.filter(id => id !== connectionId)
//         : [...prev, connectionId]
//     );
//   };

//   // Select all requests
//   const selectAllRequests = () => {
//     const allIds = receivedRequests.map(req => req.id);
//     setSelectedRequests(allIds);
//   };

//   // Clear all selections
//   const clearSelections = () => {
//     setSelectedRequests([]);
//     setBulkMode(false);
//   };

//   // Toast helper
//   const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
//     const event = new CustomEvent('showToast', {
//       detail: { message, type }
//     });
//     window.dispatchEvent(event);
//   };

//   if (loadingDiscover && activeTab === 'discover') {
//     return (
//       <div className="min-h-screen bg-white py-12">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-7xl mx-auto px-4 py-8">
        
//         {/* Header */}
//         <div className="mb-10">
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center gap-2">
//               <Network className="w-8 h-8 text-orange-600" />
//               <h1 className="text-3xl font-bold text-gray-900">Professional Network</h1>
//             </div>
//             {user && (
//               <div className="flex items-center gap-2">
//                 <Link
//                   href="/dashboard"
//                   className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
//                 >
//                   Dashboard
//                 </Link>
//                 <Link
//                   href="/referral/marketplace"
//                   className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
//                 >
//                   Referral Jobs
//                 </Link>
//               </div>
//             )}
//           </div>
//           <p className="text-gray-600">
//             Connect with professionals, manage your network, and grow your career
//           </p>
//         </div>

//         {/* Main Tabs */}
//         <div className="mb-8">
//           <div className="flex space-x-1 border-b border-gray-200">
//             <button
//               onClick={() => setActiveTab('discover')}
//               className={`py-3 px-6 text-sm font-medium rounded-t-lg transition-all ${
//                 activeTab === 'discover'
//                   ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
//                   : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <div className="flex items-center gap-2">
//                 <UserPlus className="w-4 h-4" />
//                 Discover Professionals
//               </div>
//             </button>
//             <button
//               onClick={() => setActiveTab('network')}
//               className={`py-3 px-6 text-sm font-medium rounded-t-lg transition-all relative ${
//                 activeTab === 'network'
//                   ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
//                   : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <div className="flex items-center gap-2">
//                 <Users className="w-4 h-4" />
//                 My Network
//                 {networkStats.pendingReceived > 0 && (
//                   <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
//                     {networkStats.pendingReceived}
//                   </span>
//                 )}
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Discover Tab */}
//         {activeTab === 'discover' && (
//           <div className="space-y-6">
//             {/* Search Bar */}
//             <div className="relative">
//               <div className="relative max-w-2xl mx-auto">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search professionals by name, skills, location, or company..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all shadow-sm"
//                   autoComplete="off"
//                 />
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm('')}
//                     className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Results */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredDiscoverUsers.map((userProfile) => {
//                 const connection = connectionStatuses[userProfile.uid];
//                 const isConnected = connection?.status === 'accepted';
//                 const isPending = connection?.status === 'pending';
//                 const isOwnProfile = user && user.uid === userProfile.uid;
//                 const isIncomingRequest = connection && connection.toUserId === user?.uid;
                
//                 // ONLINE STATUS: Get the online status for this user - FIXED
//                 const userOnlineStatus = userOnlineStatuses[userProfile.uid];
//                 const isOnline = userOnlineStatus?.isOnline || false;
//                 const lastSeenText = userOnlineStatus?.lastSeenText || 'Never online';
                
//                 return (
//                   <div 
//                     key={userProfile.uid}
//                     className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 group hover:border-orange-300"
//                   >
//                     {/* Profile Header */}
//                     <div className="flex items-start gap-3 mb-3">
//                       {/* Avatar */}
//                       <div className="relative">
//                         {userProfile.profileImage ? (
//                           <img 
//                             src={userProfile.profileImage} 
//                             alt={userProfile.displayName || 'User'} 
//                             className="w-14 h-14 rounded-lg object-cover border-2 border-white shadow-sm group-hover:border-orange-100 transition-colors"
//                           />
//                         ) : (
//                           <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center border-2 border-white shadow-sm group-hover:border-orange-100 transition-colors">
//                             <span className="font-bold text-orange-600 text-xl">
//                               {userProfile.displayName?.[0]?.toUpperCase() || userProfile.email?.[0]?.toUpperCase() || 'U'}
//                             </span>
//                           </div>
//                         )}
//                         {/* ONLINE STATUS: Dynamic green dot */}
//                         <div 
//                           className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
//                             isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
//                           }`}
//                           title={isOnline ? "Online now" : `Last seen ${lastSeenText}`}
//                         ></div>
//                       </div>
                      
//                       {/* User Info */}
//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-semibold text-gray-900 truncate">
//                           {userProfile.displayName || 'Anonymous User'}
//                         </h3>
//                         {userProfile.headline && (
//                           <p className="text-sm text-orange-600 truncate">
//                             {userProfile.headline}
//                           </p>
//                         )}
//                         {userProfile.location && (
//                           <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
//                             <Globe className="w-3 h-3" />
//                             {userProfile.location}
//                           </p>
//                         )}
//                         {/* ONLINE STATUS: Show last seen text for offline users */}
//                         {!isOnline && lastSeenText && (
//                           <p className="text-xs text-gray-400 mt-1">
//                             {lastSeenText}
//                           </p>
//                         )}
//                       </div>
//                     </div>
                    
//                     {/* Skills */}
//                     {userProfile.skills.length > 0 && (
//                       <div className="mb-4">
//                         <div className="flex flex-wrap gap-1">
//                           {userProfile.skills.slice(0, 3).map((skill, idx) => (
//                             <span 
//                               key={idx}
//                               className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-orange-50 hover:text-orange-700 transition-colors cursor-default"
//                             >
//                               {skill}
//                             </span>
//                           ))}
//                           {userProfile.skills.length > 3 && (
//                             <span className="px-2 py-1 text-gray-400 text-xs">
//                               +{userProfile.skills.length - 3}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     )}
                    
//                     {/* Connection Status */}
//                     {connection && (
//                       <div className="mb-3">
//                         {isConnected ? (
//                           <div className="flex items-center gap-1 text-green-600 text-xs">
//                             <CheckCircle className="w-3 h-3" />
//                             <span>Connected</span>
//                           </div>
//                         ) : isPending ? (
//                           <div className="flex items-center gap-1 text-orange-500 text-xs">
//                             <Clock className="w-3 h-3 animate-pulse" />
//                             <span>{isIncomingRequest ? 'Request received' : 'Request sent'}</span>
//                           </div>
//                         ) : null}
//                       </div>
//                     )}
                    
//                     {/* Action Buttons */}
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => router.push(`/profile/${userProfile.uid}`)}
//                         className="flex-1 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
//                       >
//                         <Eye className="w-4 h-4" />
//                         View
//                       </button>
                      
//                       {user && !isOwnProfile && (
//                         <>
//                           {!isConnected && !isPending && (
//                             <button
//                               onClick={() => handleConnect(userProfile.uid, userProfile.displayName || 'User')}
//                               className="flex-1 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-1"
//                             >
//                               <UserPlus className="w-4 h-4" />
//                               Connect
//                             </button>
//                           )}
                          
//                           {isPending && isIncomingRequest && (
//                             <div className="flex gap-1 flex-1">
//                               <button
//                                 onClick={() => handleAcceptRequest(connection.id)}
//                                 className="flex-1 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
//                               >
//                                 <Check className="w-4 h-4" />
//                                 Accept
//                               </button>
//                               <button
//                                 onClick={() => handleRejectRequest(connection.id)}
//                                 className="flex-1 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
//                               >
//                                 <XCircle className="w-4 h-4" />
//                                 Decline
//                               </button>
//                             </div>
//                           )}
                          
//                           {isPending && !isIncomingRequest && (
//                             <button
//                               onClick={() => handleCancelRequest(connection.id)}
//                               className="flex-1 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-1"
//                             >
//                               <Clock className="w-4 h-4" />
//                               Cancel
//                             </button>
//                           )}
                          
//                           {isConnected && (
//                             <button
//                               onClick={() => handleMessage(userProfile.uid, userProfile.displayName || 'User')}
//                               className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
//                             >
//                               <MessageSquare className="w-4 h-4" />
//                               Message
//                             </button>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
            
//             {filteredDiscoverUsers.length === 0 && (
//               <div className="text-center py-12">
//                 <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Users className="w-10 h-10 text-gray-400" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">No professionals found</h3>
//                 <p className="text-gray-600 mb-6">
//                   {searchTerm ? 'Try different search terms or clear search' : 'Check back soon for new professionals'}
//                 </p>
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm('')}
//                     className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
//                   >
//                     Clear Search
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {/* My Network Tab */}
//         {activeTab === 'network' && (
//           <div className="space-y-6">
//             {/* Network Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="bg-white border border-gray-200 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-500">Total Connections</p>
//                     <p className="text-2xl font-bold text-gray-900">{networkStats.totalConnections}</p>
//                   </div>
//                   <Users className="w-8 h-8 text-orange-500" />
//                 </div>
//               </div>
              
//               <div className="bg-white border border-gray-200 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-500">Pending Received</p>
//                     <p className="text-2xl font-bold text-gray-900">{networkStats.pendingReceived}</p>
//                   </div>
//                   <UserPlus className="w-8 h-8 text-blue-500" />
//                 </div>
//               </div>
              
//               <div className="bg-white border border-gray-200 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-500">Pending Sent</p>
//                     <p className="text-2xl font-bold text-gray-900">{networkStats.pendingSent}</p>
//                   </div>
//                   <Send className="w-8 h-8 text-green-500" />
//                 </div>
//               </div>
              
//               <div className="bg-white border border-gray-200 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-500">Avg. Mutual</p>
//                     <p className="text-2xl font-bold text-gray-900">{networkStats.mutualConnectionsAverage}</p>
//                   </div>
//                   <BarChart3 className="w-8 h-8 text-purple-500" />
//                 </div>
//               </div>
//             </div>

//             {/* Network Tabs */}
//             <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
//               <div className="flex border-b border-gray-200">
//                 <button
//                   onClick={() => setActiveNetworkTab('connections')}
//                   className={`flex-1 py-3 text-sm font-medium ${
//                     activeNetworkTab === 'connections'
//                       ? 'text-orange-600 border-b-2 border-orange-600'
//                       : 'text-gray-500 hover:text-gray-700'
//                   }`}
//                 >
//                   <div className="flex items-center justify-center gap-2">
//                     <UserCheck className="w-4 h-4" />
//                     Connections ({connections.length})
//                   </div>
//                 </button>
//                 <button
//                   onClick={() => setActiveNetworkTab('received')}
//                   className={`flex-1 py-3 text-sm font-medium relative ${
//                     activeNetworkTab === 'received'
//                       ? 'text-orange-600 border-b-2 border-orange-600'
//                       : 'text-gray-500 hover:text-gray-700'
//                   }`}
//                 >
//                   <div className="flex items-center justify-center gap-2">
//                     <UserPlus className="w-4 h-4" />
//                     Received ({receivedRequests.length})
//                     {receivedRequests.length > 0 && (
//                       <span className="absolute top-2 right-6 bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
//                         {receivedRequests.length}
//                       </span>
//                     )}
//                   </div>
//                 </button>
//                 <button
//                   onClick={() => setActiveNetworkTab('sent')}
//                   className={`flex-1 py-3 text-sm font-medium ${
//                     activeNetworkTab === 'sent'
//                       ? 'text-orange-600 border-b-2 border-orange-600'
//                       : 'text-gray-500 hover:text-gray-700'
//                   }`}
//                 >
//                   <div className="flex items-center justify-center gap-2">
//                     <Send className="w-4 h-4" />
//                     Sent ({sentRequests.length})
//                   </div>
//                 </button>
//               </div>

//               {/* Connections Tab */}
//               {activeNetworkTab === 'connections' && (
//                 <div className="p-6">
//                   {loadingNetwork ? (
//                     <div className="flex justify-center items-center h-40">
//                       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
//                     </div>
//                   ) : connections.length === 0 ? (
//                     <div className="text-center py-12">
//                       <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                       <h3 className="text-lg font-semibold text-gray-900 mb-2">No connections yet</h3>
//                       <p className="text-gray-600 mb-6">
//                         Start connecting with professionals to build your network
//                       </p>
//                       <button
//                         onClick={() => setActiveTab('discover')}
//                         className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
//                       >
//                         Discover Professionals
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <div className="flex justify-between items-center mb-4">
//                         <h3 className="text-lg font-semibold text-gray-900">
//                           Your Connections ({connections.length})
//                         </h3>
//                         <div className="text-sm text-gray-500">
//                           Sorted by most recent
//                         </div>
//                       </div>
                      
//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {connections.map((connection) => {
//                           // ONLINE STATUS: Get the online status for this connection - FIXED
//                           const userOnlineStatus = userOnlineStatuses[connection.otherUser.uid];
//                           const isOnline = userOnlineStatus?.isOnline || false;
//                           const lastSeenText = userOnlineStatus?.lastSeenText || 'Never online';
                          
//                           return (
//                             <div key={connection.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
//                               <div className="flex items-start gap-3 mb-3">
//                                 <div className="relative">
//                                   {connection.otherUser.profileImage ? (
//                                     <img 
//                                       src={connection.otherUser.profileImage} 
//                                       alt={connection.otherUser.displayName || 'User'} 
//                                       className="w-12 h-12 rounded-lg object-cover"
//                                     />
//                                   ) : (
//                                     <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
//                                       <span className="font-bold text-orange-600">
//                                         {connection.otherUser.displayName?.[0]?.toUpperCase() || 'U'}
//                                       </span>
//                                     </div>
//                                   )}
//                                   {/* ONLINE STATUS: Dynamic green dot */}
//                                   <div 
//                                     className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
//                                       isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
//                                     }`}
//                                     title={isOnline ? "Online now" : `Last seen ${lastSeenText}`}
//                                   ></div>
//                                 </div>
//                                 <div className="flex-1 min-w-0">
//                                   <h4 className="font-semibold text-gray-900 truncate">
//                                     {connection.otherUser.displayName || 'Anonymous User'}
//                                   </h4>
//                                   <p className="text-sm text-orange-600 truncate">
//                                     {connection.otherUser.headline}
//                                   </p>
//                                   <p className="text-xs text-gray-500 truncate">
//                                     {connection.otherUser.location}
//                                   </p>
//                                   {/* ONLINE STATUS: Show last seen text for offline users */}
//                                   {!isOnline && lastSeenText && (
//                                     <p className="text-xs text-gray-400 truncate">
//                                       {lastSeenText}
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>
                              
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => router.push(`/profile/${connection.otherUser.uid}`)}
//                                   className="flex-1 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
//                                 >
//                                   View Profile
//                                 </button>
//                                 <button
//                                   onClick={() => handleMessage(connection.otherUser.uid, connection.otherUser.displayName || 'User')}
//                                   className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
//                                 >
//                                   Message
//                                 </button>
//                               </div>
                              
//                               <button
//                                 onClick={() => handleRemoveConnection(connection.id)}
//                                 className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
//                               >
//                                 Remove Connection
//                               </button>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Received Requests Tab */}
//               {activeNetworkTab === 'received' && (
//                 <div className="p-6">
//                   {loadingNetwork ? (
//                     <div className="flex justify-center items-center h-40">
//                       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
//                     </div>
//                   ) : receivedRequests.length === 0 ? (
//                     <div className="text-center py-12">
//                       <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                       <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending requests</h3>
//                       <p className="text-gray-600">
//                         You don't have any pending connection requests
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <div className="flex justify-between items-center mb-4">
//                         <h3 className="text-lg font-semibold text-gray-900">
//                           Connection Requests ({receivedRequests.length})
//                         </h3>
//                         <div className="flex gap-2">
//                           {!bulkMode ? (
//                             <button
//                               onClick={() => setBulkMode(true)}
//                               className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
//                             >
//                               Bulk Actions
//                             </button>
//                           ) : (
//                             <>
//                               <button
//                                 onClick={selectAllRequests}
//                                 className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
//                               >
//                                 Select All
//                               </button>
//                               <button
//                                 onClick={clearSelections}
//                                 className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
//                               >
//                                 Clear
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       </div>

//                       {bulkMode && selectedRequests.length > 0 && (
//                         <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-2">
//                               <CheckCircle className="w-5 h-5 text-orange-600" />
//                               <span className="font-medium text-orange-800">
//                                 {selectedRequests.length} request(s) selected
//                               </span>
//                             </div>
//                             <div className="flex gap-2">
//                               <button
//                                 onClick={handleBulkAccept}
//                                 className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
//                               >
//                                 Accept Selected
//                               </button>
//                               <button
//                                 onClick={handleBulkReject}
//                                 className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
//                               >
//                                 Reject Selected
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       <div className="space-y-3">
//                         {receivedRequests.map((request) => {
//                           // ONLINE STATUS: Get the online status for this user - FIXED
//                           const userOnlineStatus = userOnlineStatuses[request.fromUser.uid];
//                           const isOnline = userOnlineStatus?.isOnline || false;
//                           const lastSeenText = userOnlineStatus?.lastSeenText || 'Never online';
                          
//                           return (
//                             <div key={request.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4">
//                               <div className="flex items-center gap-3">
//                                 {bulkMode && (
//                                   <input
//                                     type="checkbox"
//                                     checked={selectedRequests.includes(request.id)}
//                                     onChange={() => toggleRequestSelection(request.id)}
//                                     className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
//                                   />
//                                 )}
//                                 <div className="relative">
//                                   {request.fromUser.profileImage ? (
//                                     <img 
//                                       src={request.fromUser.profileImage} 
//                                       alt={request.fromUser.displayName || 'User'} 
//                                       className="w-12 h-12 rounded-lg object-cover"
//                                     />
//                                   ) : (
//                                     <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
//                                       <span className="font-bold text-orange-600">
//                                         {request.fromUser.displayName?.[0]?.toUpperCase() || 'U'}
//                                       </span>
//                                     </div>
//                                   )}
//                                   {/* ONLINE STATUS: Dynamic green dot */}
//                                   <div 
//                                     className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
//                                       isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
//                                     }`}
//                                     title={isOnline ? "Online now" : `Last seen ${lastSeenText}`}
//                                   ></div>
//                                 </div>
//                                 <div>
//                                   <h4 className="font-semibold text-gray-900">
//                                     {request.fromUser.displayName || 'Anonymous User'}
//                                   </h4>
//                                   <p className="text-sm text-gray-600">
//                                     {request.fromUser.headline}
//                                   </p>
//                                   <p className="text-xs text-gray-500">
//                                     {request.mutualConnections || 0} mutual connections
//                                   </p>
//                                   {/* ONLINE STATUS: Show last seen text for offline users */}
//                                   {!isOnline && lastSeenText && (
//                                     <p className="text-xs text-gray-400">
//                                       {lastSeenText}
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>
                              
//                               {!bulkMode && (
//                                 <div className="flex gap-2">
//                                   <button
//                                     onClick={() => router.push(`/profile/${request.fromUser.uid}`)}
//                                     className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
//                                   >
//                                     View Profile
//                                   </button>
//                                   <button
//                                     onClick={() => handleAcceptRequest(request.id)}
//                                     className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
//                                   >
//                                     Accept
//                                   </button>
//                                   <button
//                                     onClick={() => handleRejectRequest(request.id)}
//                                     className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
//                                   >
//                                     Decline
//                                   </button>
//                                 </div>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Sent Requests Tab */}
//               {activeNetworkTab === 'sent' && (
//                 <div className="p-6">
//                   {loadingNetwork ? (
//                     <div className="flex justify-center items-center h-40">
//                       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
//                     </div>
//                   ) : sentRequests.length === 0 ? (
//                     <div className="text-center py-12">
//                       <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                       <h3 className="text-lg font-semibold text-gray-900 mb-2">No sent requests</h3>
//                       <p className="text-gray-600">
//                         You haven't sent any connection requests yet
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                         Sent Requests ({sentRequests.length})
//                       </h3>
                      
//                       <div className="space-y-3">
//                         {sentRequests.map((request) => {
//                           // ONLINE STATUS: Get the online status for this user - FIXED
//                           const userOnlineStatus = userOnlineStatuses[request.toUser.uid];
//                           const isOnline = userOnlineStatus?.isOnline || false;
//                           const lastSeenText = userOnlineStatus?.lastSeenText || 'Never online';
                          
//                           return (
//                             <div key={request.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4">
//                               <div className="flex items-center gap-3">
//                                 <div className="relative">
//                                   {request.toUser.profileImage ? (
//                                     <img 
//                                       src={request.toUser.profileImage} 
//                                       alt={request.toUser.displayName || 'User'} 
//                                       className="w-12 h-12 rounded-lg object-cover"
//                                     />
//                                   ) : (
//                                     <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
//                                       <span className="font-bold text-orange-600">
//                                         {request.toUser.displayName?.[0]?.toUpperCase() || 'U'}
//                                       </span>
//                                     </div>
//                                   )}
//                                   {/* ONLINE STATUS: Dynamic green dot */}
//                                   <div 
//                                     className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
//                                       isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
//                                     }`}
//                                     title={isOnline ? "Online now" : `Last seen ${lastSeenText}`}
//                                   ></div>
//                                 </div>
//                                 <div>
//                                   <h4 className="font-semibold text-gray-900">
//                                     {request.toUser.displayName || 'Anonymous User'}
//                                   </h4>
//                                   <p className="text-sm text-gray-600">
//                                     {request.toUser.headline}
//                                   </p>
//                                   <p className="text-xs text-gray-500">
//                                     Sent {request.createdAt?.toDate ? request.createdAt.toDate().toLocaleDateString() : 'recently'}
//                                   </p>
//                                   {/* ONLINE STATUS: Show last seen text for offline users */}
//                                   {!isOnline && lastSeenText && (
//                                     <p className="text-xs text-gray-400">
//                                       {lastSeenText}
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>
                              
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => router.push(`/profile/${request.toUser.uid}`)}
//                                   className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
//                                 >
//                                   View Profile
//                                 </button>
//                                 <button
//                                   onClick={() => handleCancelRequest(request.id)}
//                                   className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
//                                 >
//                                   Cancel
//                                 </button>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function NetworkPage() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Network page failed to load">
//       <NetworkContent />
//     </ClientErrorBoundary>
//   );
// }


//---------------------------------- Main we were using this


// 'use client';

// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { collection, getDocs, query, orderBy, limit, getDoc, doc, or, where } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebase';
// import Link from 'next/link';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';
// import { 
//   sendConnectionRequest, 
//   getConnectionStatus, 
//   areUsersConnected,
//   getUserConnectionsWithProfiles,
//   getIncomingConnectionRequests,
//   getSentConnectionRequests,
//   acceptConnectionRequest,
//   rejectConnectionRequest,
//   cancelConnectionRequest,
//   removeConnection,
//   updateConnectionNote,
//   updateConnectionTags,
//   bulkAcceptConnectionRequests,
//   bulkRejectConnectionRequests,
//   getConnectionStatistics,
//   getAllConnectionsForUser,
//   UserProfile,
//   ConnectionWithUser,
//   IncomingRequest,
//   SentRequest,
//   Connection
// } from '@/lib/connections';
// import { startConversation } from '@/lib/startConversation';
// import { useMultipleUserOnlineStatus } from '@/hooks/useOnlineStatus';
// import { 
//   Search, 
//   Users, 
//   UserPlus, 
//   MessageSquare, 
//   CheckCircle, 
//   Clock, 
//   X,
//   Trash2,
//   Tag,
//   Globe,
//   Network,
//   UserCheck,
//   UserX,
//   Send,
//   Edit,
//   BarChart3,
//   Check,
//   XCircle,
//   Filter,
//   Eye,
//   AlertTriangle
// } from 'lucide-react';

// type TabType = 'discover' | 'network';
// type NetworkTabType = 'connections' | 'received' | 'sent';

// // Helper function to normalize text for duplicate detection
// function normalizeForComparison(text: string | null | undefined): string {
//   if (!text) return '';
//   return text
//     .trim()
//     .toLowerCase()
//     .replace(/\s+/g, ' ') // Replace multiple spaces with single space
//     .replace(/[^\w\s]/g, '') // Remove special characters
//     .replace(/\b(mohd|mohammed|md|mohammad|mohamed)\b/gi, '') // Common name variations
//     .replace(/\b(shaikh|sheikh|shaik|sheik)\b/gi, '') // Common surname variations
//     .trim();
// }

// function NetworkContent() {
//   const [user] = useAuthState(auth);
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState<TabType>('discover');
//   const [activeNetworkTab, setActiveNetworkTab] = useState<NetworkTabType>('connections');
  
//   // Discover Tab States
//   const [discoverUsers, setDiscoverUsers] = useState<UserProfile[]>([]);
//   const [loadingDiscover, setLoadingDiscover] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [connectionStatuses, setConnectionStatuses] = useState<Record<string, Connection>>({});
  
//   // Network Tab States
//   const [connections, setConnections] = useState<ConnectionWithUser[]>([]);
//   const [receivedRequests, setReceivedRequests] = useState<IncomingRequest[]>([]);
//   const [sentRequests, setSentRequests] = useState<SentRequest[]>([]);
//   const [loadingNetwork, setLoadingNetwork] = useState(false);
//   const [networkStats, setNetworkStats] = useState({
//     totalConnections: 0,
//     pendingReceived: 0,
//     pendingSent: 0,
//     mutualConnectionsAverage: 0
//   });
  
//   // Advanced Features
//   const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
//   const [editingNote, setEditingNote] = useState<string | null>(null);
//   const [noteText, setNoteText] = useState('');
//   const [showTagsModal, setShowTagsModal] = useState<string | null>(null);
//   const [selectedTags, setSelectedTags] = useState<string[]>([]);
//   const [bulkMode, setBulkMode] = useState(false);

//   const availableTags = [
//     'Recruiter', 'Mentor', 'Colleague', 'Former Colleague',
//     'Industry Expert', 'Potential Client', 'Friend', 'Alumni',
//     'Conference Contact', 'Referral Source', 'Business Partner'
//   ];

//   // Process connections to remove duplicates
//   const processedConnections = useMemo(() => {
//     if (connections.length === 0) return [];
    
//     const seen = new Set<string>();
//     const uniqueConnections: ConnectionWithUser[] = [];
    
//     connections.forEach(conn => {
//       const key = normalizeForComparison(conn.otherUser.displayName);
//       if (!seen.has(key) && key) {
//         seen.add(key);
//         uniqueConnections.push(conn);
//       } else if (!key) {
//         // If no name, use UID
//         if (!seen.has(conn.otherUser.uid)) {
//           seen.add(conn.otherUser.uid);
//           uniqueConnections.push(conn);
//         }
//       }
//     });
    
//     return uniqueConnections;
//   }, [connections]);

//   // Process received requests to remove duplicates
//   const processedReceivedRequests = useMemo(() => {
//     if (receivedRequests.length === 0) return [];
    
//     const seen = new Set<string>();
//     const uniqueRequests: IncomingRequest[] = [];
    
//     receivedRequests.forEach(req => {
//       const key = normalizeForComparison(req.fromUser.displayName);
//       if (!seen.has(key) && key) {
//         seen.add(key);
//         uniqueRequests.push(req);
//       } else if (!key) {
//         // If no name, use UID
//         if (!seen.has(req.fromUser.uid)) {
//           seen.add(req.fromUser.uid);
//           uniqueRequests.push(req);
//         }
//       }
//     });
    
//     return uniqueRequests;
//   }, [receivedRequests]);

//   // Process sent requests to remove duplicates AND filter out connected users
//   const processedSentRequests = useMemo(() => {
//     if (sentRequests.length === 0) return [];
    
//     const seen = new Set<string>();
//     const uniqueRequests: SentRequest[] = [];
//     const connectedUserIds = new Set(connections.map(c => c.otherUser.uid));
    
//     sentRequests.forEach(req => {
//       // Skip if already connected
//       if (connectedUserIds.has(req.toUser.uid)) return;
      
//       const key = normalizeForComparison(req.toUser.displayName);
//       if (!seen.has(key) && key) {
//         seen.add(key);
//         uniqueRequests.push(req);
//       } else if (!key) {
//         // If no name, use UID
//         if (!seen.has(req.toUser.uid)) {
//           seen.add(req.toUser.uid);
//           uniqueRequests.push(req);
//         }
//       }
//     });
    
//     return uniqueRequests;
//   }, [sentRequests, connections]);

//   // ONLINE STATUS: Get user IDs for batch checking
//   const discoverUserIds = useMemo(() => {
//     return discoverUsers.map(user => user.uid);
//   }, [discoverUsers]);

//   const connectionUserIds = useMemo(() => {
//     return processedConnections.map(conn => conn.otherUser.uid);
//   }, [processedConnections]);

//   const receivedRequestUserIds = useMemo(() => {
//     return processedReceivedRequests.map(req => req.fromUser.uid);
//   }, [processedReceivedRequests]);

//   const sentRequestUserIds = useMemo(() => {
//     return processedSentRequests.map(req => req.toUser.uid);
//   }, [processedSentRequests]);

//   // ONLINE STATUS: Determine which user IDs to check based on active tab
//   const userIdsForStatusCheck = useMemo(() => {
//     if (activeTab === 'discover') {
//       return discoverUserIds;
//     } else if (activeTab === 'network') {
//       if (activeNetworkTab === 'connections') {
//         return connectionUserIds;
//       } else if (activeNetworkTab === 'received') {
//         return receivedRequestUserIds;
//       } else if (activeNetworkTab === 'sent') {
//         return sentRequestUserIds;
//       }
//     }
//     return [];
//   }, [activeTab, activeNetworkTab, discoverUserIds, connectionUserIds, receivedRequestUserIds, sentRequestUserIds]);

//   // ONLINE STATUS: Use batch online status hook - FIXED
//   const { statusMap: userOnlineStatuses, loading: statusLoading } = useMultipleUserOnlineStatus(userIdsForStatusCheck);

//   // Fetch users for Discover tab - SIMPLIFIED VERSION
//   useEffect(() => {
//     const fetchDiscoverUsers = async () => {
//       try {
//         setLoadingDiscover(true);
        
//         const usersQuery = query(
//           collection(db, 'users'), 
//           orderBy('createdAt', 'desc'),
//           limit(50)
//         );
        
//         const querySnapshot = await getDocs(usersQuery);
//         const usersData: UserProfile[] = [];
//         const seenNames = new Set<string>();
        
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           if (data.displayName || data.headline) {
//             const normalizedName = normalizeForComparison(data.displayName);
            
//             // Skip duplicates by normalized name
//             if (normalizedName && seenNames.has(normalizedName)) {
//               console.log(`⚠️ Skipping duplicate: ${data.displayName} → ${normalizedName}`);
//               return;
//             }
            
//             if (normalizedName) seenNames.add(normalizedName);
            
//             usersData.push({
//               uid: doc.id,
//               displayName: data.displayName || null,
//               email: data.email || null,
//               headline: data.headline || '',
//               bio: data.bio || '',
//               skills: data.skills || [],
//               location: data.location || '',
//               profileImage: data.profileImage || '',
//               projects: data.projects || [],
//               education: data.education || '',
//               experience: data.experience || '',
//               website: data.website || '',
//               github: data.github || '',
//               linkedin: data.linkedin || '',
//               createdAt: data.createdAt
//             });
//           }
//         });
        
//         console.log(`📊 Loaded ${usersData.length} unique users (filtered duplicates)`);
//         setDiscoverUsers(usersData);
        
//         // Load ALL connections for current user at once (optimized) - FIXED
//         if (user) {
//           const allConnections = await getAllConnectionsForUser(user.uid);
//           setConnectionStatuses(allConnections);
//         }
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       } finally {
//         setLoadingDiscover(false);
//       }
//     };

//     if (activeTab === 'discover') {
//       fetchDiscoverUsers();
//     }
//   }, [user, activeTab]);

//   // Fetch network data
//   const fetchNetworkData = useCallback(async () => {
//     if (!user) return;
    
//     try {
//       setLoadingNetwork(true);
      
//       const [
//         connectionsData,
//         incomingData,
//         sentData,
//         stats
//       ] = await Promise.all([
//         getUserConnectionsWithProfiles(user.uid),
//         getIncomingConnectionRequests(user.uid),
//         getSentConnectionRequests(user.uid),
//         getConnectionStatistics(user.uid)
//       ]);
      
//       console.log(`📊 Raw data: ${connectionsData.length} connections, ${incomingData.length} received, ${sentData.length} sent`);
      
//       setConnections(connectionsData);
//       setReceivedRequests(incomingData);
//       setSentRequests(sentData);
//       setNetworkStats(stats);
      
//       setSelectedRequests([]);
//       setBulkMode(false);
      
//     } catch (error) {
//       console.error('Error fetching network data:', error);
//       showToast('Failed to load network data', 'error');
//     } finally {
//       setLoadingNetwork(false);
//     }
//   }, [user]);

//   useEffect(() => {
//     if (activeTab === 'network' && user) {
//       fetchNetworkData();
//     }
//   }, [activeTab, user, fetchNetworkData]);

//   // Filter discover users
//   const filteredDiscoverUsers = useMemo(() => {
//     let result = [...discoverUsers];
    
//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(user => {
//         const nameMatch = user.displayName?.toLowerCase().includes(term) || false;
//         const headlineMatch = user.headline.toLowerCase().includes(term);
//         const skillsMatch = user.skills.some(skill => skill.toLowerCase().includes(term));
//         const locationMatch = user.location.toLowerCase().includes(term);
//         return nameMatch || headlineMatch || skillsMatch || locationMatch;
//       });
//     }
    
//     // Filter out current user and people already connected
//     if (user) {
//       result = result.filter(userProfile => {
//         if (userProfile.uid === user.uid) return false;
//         const status = connectionStatuses[userProfile.uid];
//         return !status || status.status !== 'accepted';
//       });
//     }
    
//     return result;
//   }, [discoverUsers, searchTerm, user, connectionStatuses]);

//   // Handle sending connection request - IMPROVED VERSION
//   const handleConnect = async (userId: string, userName: string) => {
//     if (!user) {
//       router.push('/login');
//       return;
//     }
    
//     try {
//       const connectionId = await sendConnectionRequest(user.uid, userId);
      
//       // Refresh connection statuses
//       if (activeTab === 'discover' && user) {
//         const allConnections = await getAllConnectionsForUser(user.uid);
//         setConnectionStatuses(allConnections);
//       }
      
//       showToast(`Connected with ${userName}!`, 'success');
      
//       if (activeTab === 'network') {
//         fetchNetworkData();
//       }
      
//     } catch (error: any) {
//       console.error('Error sending connection request:', error);
      
//       // Handle specific error messages better
//       if (error.message.includes('already sent you')) {
//         // This should not happen with the new logic, but just in case
//         showToast(`${userName} already sent you a connection request. Check your incoming requests.`, 'info');
        
//         // Refresh to show the correct status
//         if (user) {
//           const allConnections = await getAllConnectionsForUser(user.uid);
//           setConnectionStatuses(allConnections);
//         }
//       } else if (error.message.includes('Already connected')) {
//         showToast(`Already connected with ${userName}`, 'info');
        
//         // Refresh to show the correct status
//         if (user) {
//           const allConnections = await getAllConnectionsForUser(user.uid);
//           setConnectionStatuses(allConnections);
//         }
//       } else if (error.message.includes('already pending')) {
//         showToast(`Connection request already sent to ${userName}`, 'info');
//       } else {
//         showToast(error.message || 'Failed to send connection request', 'error');
//       }
//     }
//   };

//   // Handle messaging
//   const handleMessage = async (otherUserId: string, otherUserName: string) => {
//     if (!user) {
//       router.push('/login');
//       return;
//     }
    
//     try {
//       const isConnected = await areUsersConnected(user.uid, otherUserId);
      
//       if (!isConnected) {
//         const shouldConnect = window.confirm(
//           `Connect with ${otherUserName || 'this user'} to start messaging?`
//         );
        
//         if (shouldConnect) {
//           await handleConnect(otherUserId, otherUserName);
//         }
//         return;
//       }
      
//       const conversationId = await startConversation(user.uid, otherUserId);
//       router.push(`/dashboard/messages/${conversationId}`);
      
//     } catch (error: any) {
//       console.error('Error starting conversation:', error);
//       showToast(error.message || 'Unable to start conversation', 'error');
//     }
//   };

//   // Handle accepting connection request
//   const handleAcceptRequest = async (connectionId: string) => {
//     try {
//       await acceptConnectionRequest(connectionId);
//       showToast('Connection request accepted!', 'success');
//       fetchNetworkData();
      
//       // Also update the discover tab status
//       if (activeTab === 'discover' && user) {
//         const allConnections = await getAllConnectionsForUser(user.uid);
//         setConnectionStatuses(allConnections);
//       }
//     } catch (error) {
//       console.error('Error accepting request:', error);
//       showToast('Failed to accept request', 'error');
//     }
//   };

//   // Handle rejecting connection request
//   const handleRejectRequest = async (connectionId: string) => {
//     try {
//       await rejectConnectionRequest(connectionId);
//       showToast('Connection request declined', 'info');
//       fetchNetworkData();
      
//       // Also update the discover tab status
//       if (activeTab === 'discover' && user) {
//         const allConnections = await getAllConnectionsForUser(user.uid);
//         setConnectionStatuses(allConnections);
//       }
//     } catch (error) {
//       console.error('Error rejecting request:', error);
//       showToast('Failed to decline request', 'error');
//     }
//   };

//   // Handle cancelling sent request
//   const handleCancelRequest = async (connectionId: string) => {
//     if (window.confirm('Are you sure you want to cancel this connection request?')) {
//       try {
//         await cancelConnectionRequest(connectionId);
//         showToast('Connection request cancelled', 'info');
//         fetchNetworkData();
        
//         // Also update the discover tab status
//         if (activeTab === 'discover' && user) {
//           const allConnections = await getAllConnectionsForUser(user.uid);
//           setConnectionStatuses(allConnections);
//         }
//       } catch (error) {
//         console.error('Error cancelling request:', error);
//         showToast('Failed to cancel request', 'error');
//       }
//     }
//   };

//   // Handle removing connection
//   const handleRemoveConnection = async (connectionId: string) => {
//     if (window.confirm('Are you sure you want to remove this connection?')) {
//       try {
//         await removeConnection(connectionId);
//         showToast('Connection removed', 'info');
//         fetchNetworkData();
        
//         // Also update the discover tab status
//         if (activeTab === 'discover' && user) {
//           const allConnections = await getAllConnectionsForUser(user.uid);
//           setConnectionStatuses(allConnections);
//         }
//       } catch (error) {
//         console.error('Error removing connection:', error);
//         showToast('Failed to remove connection', 'error');
//       }
//     }
//   };

//   // Handle updating connection note
//   const handleUpdateNote = async (connectionId: string) => {
//     if (!noteText.trim()) return;
    
//     try {
//       await updateConnectionNote(connectionId, noteText);
//       showToast('Note updated successfully', 'success');
//       setEditingNote(null);
//       setNoteText('');
//       fetchNetworkData();
//     } catch (error) {
//       console.error('Error updating note:', error);
//       showToast('Failed to update note', 'error');
//     }
//   };

//   // Handle updating connection tags
//   const handleUpdateTags = async (connectionId: string) => {
//     try {
//       await updateConnectionTags(connectionId, selectedTags);
//       showToast('Tags updated successfully', 'success');
//       setShowTagsModal(null);
//       setSelectedTags([]);
//       fetchNetworkData();
//     } catch (error) {
//       console.error('Error updating tags:', error);
//       showToast('Failed to update tags', 'error');
//     }
//   };

//   // Bulk accept requests
//   const handleBulkAccept = async () => {
//     if (selectedRequests.length === 0) return;
    
//     try {
//       await bulkAcceptConnectionRequests(selectedRequests);
//       showToast(`${selectedRequests.length} requests accepted!`, 'success');
//       fetchNetworkData();
      
//       // Also update the discover tab status
//       if (activeTab === 'discover' && user) {
//         const allConnections = await getAllConnectionsForUser(user.uid);
//         setConnectionStatuses(allConnections);
//       }
//     } catch (error) {
//       console.error('Error bulk accepting requests:', error);
//       showToast('Failed to accept requests', 'error');
//     }
//   };

//   // Bulk reject requests
//   const handleBulkReject = async () => {
//     if (selectedRequests.length === 0) return;
    
//     try {
//       await bulkRejectConnectionRequests(selectedRequests);
//       showToast(`${selectedRequests.length} requests declined`, 'info');
//       fetchNetworkData();
      
//       // Also update the discover tab status
//       if (activeTab === 'discover' && user) {
//         const allConnections = await getAllConnectionsForUser(user.uid);
//         setConnectionStatuses(allConnections);
//       }
//     } catch (error) {
//       console.error('Error bulk rejecting requests:', error);
//       showToast('Failed to decline requests', 'error');
//     }
//   };

//   // Toggle request selection for bulk operations
//   const toggleRequestSelection = (connectionId: string) => {
//     setSelectedRequests(prev =>
//       prev.includes(connectionId)
//         ? prev.filter(id => id !== connectionId)
//         : [...prev, connectionId]
//     );
//   };

//   // Select all requests
//   const selectAllRequests = () => {
//     const allIds = processedReceivedRequests.map(req => req.id);
//     setSelectedRequests(allIds);
//   };

//   // Clear all selections
//   const clearSelections = () => {
//     setSelectedRequests([]);
//     setBulkMode(false);
//   };

//   // Toast helper
//   const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
//     const event = new CustomEvent('showToast', {
//       detail: { message, type }
//     });
//     window.dispatchEvent(event);
//   };

//   if (loadingDiscover && activeTab === 'discover') {
//     return (
//       <div className="min-h-screen bg-white py-12">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-7xl mx-auto px-4 py-8">
        
//         {/* Header */}
//         <div className="mb-10">
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center gap-2">
//               <Network className="w-8 h-8 text-orange-600" />
//               <h1 className="text-3xl font-bold text-gray-900">Professional Network</h1>
//             </div>
//             {user && (
//               <div className="flex items-center gap-2">
//                 <Link
//                   href="/dashboard"
//                   className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
//                 >
//                   Dashboard
//                 </Link>
//                 <Link
//                   href="/referral/marketplace"
//                   className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
//                 >
//                   Referral Jobs
//                 </Link>
//               </div>
//             )}
//           </div>
//           <p className="text-gray-600">
//             Connect with professionals, manage your network, and grow your career
//           </p>
//         </div>

//         {/* Main Tabs */}
//         <div className="mb-8">
//           <div className="flex space-x-1 border-b border-gray-200">
//             <button
//               onClick={() => setActiveTab('discover')}
//               className={`py-3 px-6 text-sm font-medium rounded-t-lg transition-all ${
//                 activeTab === 'discover'
//                   ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
//                   : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <div className="flex items-center gap-2">
//                 <UserPlus className="w-4 h-4" />
//                 Discover Professionals
//               </div>
//             </button>
//             <button
//               onClick={() => setActiveTab('network')}
//               className={`py-3 px-6 text-sm font-medium rounded-t-lg transition-all relative ${
//                 activeTab === 'network'
//                   ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
//                   : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <div className="flex items-center gap-2">
//                 <Users className="w-4 h-4" />
//                 My Network
//                 {networkStats.pendingReceived > 0 && (
//                   <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
//                     {networkStats.pendingReceived}
//                   </span>
//                 )}
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Discover Tab */}
//         {activeTab === 'discover' && (
//           <div className="space-y-6">
//             {/* Search Bar */}
//             <div className="relative">
//               <div className="relative max-w-2xl mx-auto">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search professionals by name, skills, location, or company..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all shadow-sm"
//                   autoComplete="off"
//                 />
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm('')}
//                     className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Results */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredDiscoverUsers.map((userProfile) => {
//                 const connection = connectionStatuses[userProfile.uid];
//                 const isConnected = connection?.status === 'accepted';
//                 const isPending = connection?.status === 'pending';
//                 const isOwnProfile = user && user.uid === userProfile.uid;
//                 const isIncomingRequest = connection && connection.toUserId === user?.uid;
                
//                 // ONLINE STATUS: Get the online status for this user - FIXED
//                 const userOnlineStatus = userOnlineStatuses[userProfile.uid];
//                 const isOnline = userOnlineStatus?.isOnline || false;
//                 const lastSeenText = userOnlineStatus?.lastSeenText || 'Never online';
                
//                 return (
//                   <div 
//                     key={userProfile.uid}
//                     className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 group hover:border-orange-300"
//                   >
//                     {/* Profile Header */}
//                     <div className="flex items-start gap-3 mb-3">
//                       {/* Avatar */}
//                       <div className="relative">
//                         {userProfile.profileImage ? (
//                           <img 
//                             src={userProfile.profileImage} 
//                             alt={userProfile.displayName || 'User'} 
//                             className="w-14 h-14 rounded-lg object-cover border-2 border-white shadow-sm group-hover:border-orange-100 transition-colors"
//                           />
//                         ) : (
//                           <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center border-2 border-white shadow-sm group-hover:border-orange-100 transition-colors">
//                             <span className="font-bold text-orange-600 text-xl">
//                               {userProfile.displayName?.[0]?.toUpperCase() || userProfile.email?.[0]?.toUpperCase() || 'U'}
//                             </span>
//                           </div>
//                         )}
//                         {/* ONLINE STATUS: Dynamic green dot */}
//                         <div 
//                           className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
//                             isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
//                           }`}
//                           title={isOnline ? "Online now" : `Last seen ${lastSeenText}`}
//                         ></div>
//                       </div>
                      
//                       {/* User Info */}
//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-semibold text-gray-900 truncate">
//                           {userProfile.displayName || 'Anonymous User'}
//                         </h3>
//                         {userProfile.headline && (
//                           <p className="text-sm text-orange-600 truncate">
//                             {userProfile.headline}
//                           </p>
//                         )}
//                         {userProfile.location && (
//                           <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
//                             <Globe className="w-3 h-3" />
//                             {userProfile.location}
//                           </p>
//                         )}
//                         {/* ONLINE STATUS: Show last seen text for offline users */}
//                         {!isOnline && lastSeenText && (
//                           <p className="text-xs text-gray-400 mt-1">
//                             {lastSeenText}
//                           </p>
//                         )}
//                       </div>
//                     </div>
                    
//                     {/* Skills */}
//                     {userProfile.skills.length > 0 && (
//                       <div className="mb-4">
//                         <div className="flex flex-wrap gap-1">
//                           {userProfile.skills.slice(0, 3).map((skill, idx) => (
//                             <span 
//                               key={idx}
//                               className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-orange-50 hover:text-orange-700 transition-colors cursor-default"
//                             >
//                               {skill}
//                             </span>
//                           ))}
//                           {userProfile.skills.length > 3 && (
//                             <span className="px-2 py-1 text-gray-400 text-xs">
//                               +{userProfile.skills.length - 3}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     )}
                    
//                     {/* Connection Status */}
//                     {connection && (
//                       <div className="mb-3">
//                         {isConnected ? (
//                           <div className="flex items-center gap-1 text-green-600 text-xs">
//                             <CheckCircle className="w-3 h-3" />
//                             <span>Connected</span>
//                           </div>
//                         ) : isPending ? (
//                           <div className="flex items-center gap-1 text-orange-500 text-xs">
//                             <Clock className="w-3 h-3 animate-pulse" />
//                             <span>{isIncomingRequest ? 'Request received' : 'Request sent'}</span>
//                           </div>
//                         ) : null}
//                       </div>
//                     )}
                    
//                     {/* Action Buttons */}
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => router.push(`/profile/${userProfile.uid}`)}
//                         className="flex-1 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
//                       >
//                         <Eye className="w-4 h-4" />
//                         View
//                       </button>
                      
//                       {user && !isOwnProfile && (
//                         <>
//                           {!isConnected && !isPending && (
//                             <button
//                               onClick={() => handleConnect(userProfile.uid, userProfile.displayName || 'User')}
//                               className="flex-1 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-1"
//                             >
//                               <UserPlus className="w-4 h-4" />
//                               Connect
//                             </button>
//                           )}
                          
//                           {isPending && isIncomingRequest && (
//                             <div className="flex gap-1 flex-1">
//                               <button
//                                 onClick={() => handleAcceptRequest(connection.id)}
//                                 className="flex-1 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
//                               >
//                                 <Check className="w-4 h-4" />
//                                 Accept
//                               </button>
//                               <button
//                                 onClick={() => handleRejectRequest(connection.id)}
//                                 className="flex-1 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
//                               >
//                                 <XCircle className="w-4 h-4" />
//                                 Decline
//                               </button>
//                             </div>
//                           )}
                          
//                           {isPending && !isIncomingRequest && (
//                             <button
//                               onClick={() => handleCancelRequest(connection.id)}
//                               className="flex-1 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-1"
//                             >
//                               <Clock className="w-4 h-4" />
//                               Cancel
//                             </button>
//                           )}
                          
//                           {isConnected && (
//                             <button
//                               onClick={() => handleMessage(userProfile.uid, userProfile.displayName || 'User')}
//                               className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
//                             >
//                               <MessageSquare className="w-4 h-4" />
//                               Message
//                             </button>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
            
//             {filteredDiscoverUsers.length === 0 && (
//               <div className="text-center py-12">
//                 <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Users className="w-10 h-10 text-gray-400" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">No professionals found</h3>
//                 <p className="text-gray-600 mb-6">
//                   {searchTerm ? 'Try different search terms or clear search' : 'Check back soon for new professionals'}
//                 </p>
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm('')}
//                     className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
//                   >
//                     Clear Search
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {/* My Network Tab */}
//         {activeTab === 'network' && (
//           <div className="space-y-6">
//             {/* Network Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="bg-white border border-gray-200 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-500">Total Connections</p>
//                     <p className="text-2xl font-bold text-gray-900">{processedConnections.length}</p>
//                   </div>
//                   <Users className="w-8 h-8 text-orange-500" />
//                 </div>
//               </div>
              
//               <div className="bg-white border border-gray-200 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-500">Pending Received</p>
//                     <p className="text-2xl font-bold text-gray-900">{processedReceivedRequests.length}</p>
//                   </div>
//                   <UserPlus className="w-8 h-8 text-blue-500" />
//                 </div>
//               </div>
              
//               <div className="bg-white border border-gray-200 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-500">Pending Sent</p>
//                     <p className="text-2xl font-bold text-gray-900">{processedSentRequests.length}</p>
//                   </div>
//                   <Send className="w-8 h-8 text-green-500" />
//                 </div>
//               </div>
              
//               <div className="bg-white border border-gray-200 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-500">Avg. Mutual</p>
//                     <p className="text-2xl font-bold text-gray-900">{networkStats.mutualConnectionsAverage}</p>
//                   </div>
//                   <BarChart3 className="w-8 h-8 text-purple-500" />
//                 </div>
//               </div>
//             </div>

//             {/* Network Tabs */}
//             <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
//               <div className="flex border-b border-gray-200">
//                 <button
//                   onClick={() => setActiveNetworkTab('connections')}
//                   className={`flex-1 py-3 text-sm font-medium ${
//                     activeNetworkTab === 'connections'
//                       ? 'text-orange-600 border-b-2 border-orange-600'
//                       : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   <div className="flex items-center justify-center gap-2">
//                     <UserCheck className="w-4 h-4" />
//                     Connections ({processedConnections.length})
//                     {processedConnections.length < connections.length && (
//                       <span 
//                         className="bg-yellow-500 text-white text-xs rounded-full px-1.5 py-0.5"
//                         title={`Filtered ${connections.length - processedConnections.length} duplicates`}
//                       >
//                         -{connections.length - processedConnections.length}
//                       </span>
//                     )}
//                   </div>
//                 </button>
//                 <button
//                   onClick={() => setActiveNetworkTab('received')}
//                   className={`flex-1 py-3 text-sm font-medium relative ${
//                     activeNetworkTab === 'received'
//                       ? 'text-orange-600 border-b-2 border-orange-600'
//                       : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   <div className="flex items-center justify-center gap-2">
//                     <UserPlus className="w-4 h-4" />
//                     Received ({processedReceivedRequests.length})
//                     {processedReceivedRequests.length > 0 && (
//                       <span className="absolute top-2 right-6 bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
//                         {processedReceivedRequests.length}
//                       </span>
//                     )}
//                     {processedReceivedRequests.length < receivedRequests.length && (
//                       <span 
//                         className="absolute top-2 right-16 bg-yellow-500 text-white text-xs rounded-full px-1.5 py-0.5"
//                         title={`Filtered ${receivedRequests.length - processedReceivedRequests.length} duplicates`}
//                       >
//                         -{receivedRequests.length - processedReceivedRequests.length}
//                       </span>
//                     )}
//                   </div>
//                 </button>
//                 <button
//                   onClick={() => setActiveNetworkTab('sent')}
//                   className={`flex-1 py-3 text-sm font-medium ${
//                     activeNetworkTab === 'sent'
//                       ? 'text-orange-600 border-b-2 border-orange-600'
//                       : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   <div className="flex items-center justify-center gap-2">
//                     <Send className="w-4 h-4" />
//                     Sent ({processedSentRequests.length})
//                     {processedSentRequests.length < sentRequests.length && (
//                       <span 
//                         className="bg-yellow-500 text-white text-xs rounded-full px-1.5 py-0.5"
//                         title={`Filtered ${sentRequests.length - processedSentRequests.length} duplicates`}
//                       >
//                         -{sentRequests.length - processedSentRequests.length}
//                       </span>
//                     )}
//                   </div>
//                 </button>
//               </div>

//               {/* Connections Tab */}
//               {activeNetworkTab === 'connections' && (
//                 <div className="p-6">
//                   {loadingNetwork ? (
//                     <div className="flex justify-center items-center h-40">
//                       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
//                     </div>
//                   ) : processedConnections.length === 0 ? (
//                     <div className="text-center py-12">
//                       <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                       <h3 className="text-lg font-semibold text-gray-900 mb-2">No connections yet</h3>
//                       <p className="text-gray-600 mb-6">
//                         Start connecting with professionals to build your network
//                       </p>
//                       <button
//                         onClick={() => setActiveTab('discover')}
//                         className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
//                       >
//                         Discover Professionals
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <div className="flex justify-between items-center mb-4">
//                         <h3 className="text-lg font-semibold text-gray-900">
//                           Your Connections ({processedConnections.length})
//                           {processedConnections.length < connections.length && (
//                             <span className="ml-2 text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
//                               <AlertTriangle className="inline w-3 h-3 mr-1" />
//                               {connections.length - processedConnections.length} duplicates filtered
//                             </span>
//                           )}
//                         </h3>
//                         <div className="text-sm text-gray-500">
//                           Sorted by most recent
//                         </div>
//                       </div>
                      
//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {processedConnections.map((connection) => {
//                           // ONLINE STATUS: Get the online status for this connection - FIXED
//                           const userOnlineStatus = userOnlineStatuses[connection.otherUser.uid];
//                           const isOnline = userOnlineStatus?.isOnline || false;
//                           const lastSeenText = userOnlineStatus?.lastSeenText || 'Never online';
                          
//                           return (
//                             <div key={connection.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
//                               <div className="flex items-start gap-3 mb-3">
//                                 <div className="relative">
//                                   {connection.otherUser.profileImage ? (
//                                     <img 
//                                       src={connection.otherUser.profileImage} 
//                                       alt={connection.otherUser.displayName || 'User'} 
//                                       className="w-12 h-12 rounded-lg object-cover"
//                                     />
//                                   ) : (
//                                     <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
//                                       <span className="font-bold text-orange-600">
//                                         {connection.otherUser.displayName?.[0]?.toUpperCase() || 'U'}
//                                       </span>
//                                     </div>
//                                   )}
//                                   {/* ONLINE STATUS: Dynamic green dot */}
//                                   <div 
//                                     className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
//                                       isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
//                                     }`}
//                                     title={isOnline ? "Online now" : `Last seen ${lastSeenText}`}
//                                   ></div>
//                                 </div>
//                                 <div className="flex-1 min-w-0">
//                                   <h4 className="font-semibold text-gray-900 truncate">
//                                     {connection.otherUser.displayName || 'Anonymous User'}
//                                   </h4>
//                                   <p className="text-sm text-orange-600 truncate">
//                                     {connection.otherUser.headline}
//                                   </p>
//                                   <p className="text-xs text-gray-500 truncate">
//                                     {connection.otherUser.location}
//                                   </p>
//                                   {/* ONLINE STATUS: Show last seen text for offline users */}
//                                   {!isOnline && lastSeenText && (
//                                     <p className="text-xs text-gray-400 truncate">
//                                       {lastSeenText}
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>
                              
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => router.push(`/profile/${connection.otherUser.uid}`)}
//                                   className="flex-1 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
//                                 >
//                                   View Profile
//                                 </button>
//                                 <button
//                                   onClick={() => handleMessage(connection.otherUser.uid, connection.otherUser.displayName || 'User')}
//                                   className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
//                                 >
//                                   Message
//                                 </button>
//                               </div>
                              
//                               <button
//                                 onClick={() => handleRemoveConnection(connection.id)}
//                                 className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
//                               >
//                                 Remove Connection
//                               </button>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Received Requests Tab */}
//               {activeNetworkTab === 'received' && (
//                 <div className="p-6">
//                   {loadingNetwork ? (
//                     <div className="flex justify-center items-center h-40">
//                       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
//                     </div>
//                   ) : processedReceivedRequests.length === 0 ? (
//                     <div className="text-center py-12">
//                       <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                       <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending requests</h3>
//                       <p className="text-gray-600">
//                         You don't have any pending connection requests
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <div className="flex justify-between items-center mb-4">
//                         <h3 className="text-lg font-semibold text-gray-900">
//                           Connection Requests ({processedReceivedRequests.length})
//                           {processedReceivedRequests.length < receivedRequests.length && (
//                             <span className="ml-2 text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
//                               <AlertTriangle className="inline w-3 h-3 mr-1" />
//                               {receivedRequests.length - processedReceivedRequests.length} duplicates filtered
//                             </span>
//                           )}
//                         </h3>
//                         <div className="flex gap-2">
//                           {!bulkMode ? (
//                             <button
//                               onClick={() => setBulkMode(true)}
//                               className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
//                             >
//                               Bulk Actions
//                             </button>
//                           ) : (
//                             <>
//                               <button
//                                 onClick={selectAllRequests}
//                                 className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
//                               >
//                                 Select All
//                               </button>
//                               <button
//                                 onClick={clearSelections}
//                                 className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
//                               >
//                                 Clear
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       </div>

//                       {bulkMode && selectedRequests.length > 0 && (
//                         <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-2">
//                               <CheckCircle className="w-5 h-5 text-orange-600" />
//                               <span className="font-medium text-orange-800">
//                                 {selectedRequests.length} request(s) selected
//                               </span>
//                             </div>
//                             <div className="flex gap-2">
//                               <button
//                                 onClick={handleBulkAccept}
//                                 className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
//                               >
//                                 Accept Selected
//                               </button>
//                               <button
//                                 onClick={handleBulkReject}
//                                 className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
//                               >
//                                 Reject Selected
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       <div className="space-y-3">
//                         {processedReceivedRequests.map((request) => {
//                           // ONLINE STATUS: Get the online status for this user - FIXED
//                           const userOnlineStatus = userOnlineStatuses[request.fromUser.uid];
//                           const isOnline = userOnlineStatus?.isOnline || false;
//                           const lastSeenText = userOnlineStatus?.lastSeenText || 'Never online';
                          
//                           return (
//                             <div key={request.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4">
//                               <div className="flex items-center gap-3">
//                                 {bulkMode && (
//                                   <input
//                                     type="checkbox"
//                                     checked={selectedRequests.includes(request.id)}
//                                     onChange={() => toggleRequestSelection(request.id)}
//                                     className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
//                                   />
//                                 )}
//                                 <div className="relative">
//                                   {request.fromUser.profileImage ? (
//                                     <img 
//                                       src={request.fromUser.profileImage} 
//                                       alt={request.fromUser.displayName || 'User'} 
//                                       className="w-12 h-12 rounded-lg object-cover"
//                                     />
//                                   ) : (
//                                     <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
//                                       <span className="font-bold text-orange-600">
//                                         {request.fromUser.displayName?.[0]?.toUpperCase() || 'U'}
//                                       </span>
//                                     </div>
//                                   )}
//                                   {/* ONLINE STATUS: Dynamic green dot */}
//                                   <div 
//                                     className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
//                                       isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
//                                     }`}
//                                     title={isOnline ? "Online now" : `Last seen ${lastSeenText}`}
//                                   ></div>
//                                 </div>
//                                 <div>
//                                   <h4 className="font-semibold text-gray-900">
//                                     {request.fromUser.displayName || 'Anonymous User'}
//                                   </h4>
//                                   <p className="text-sm text-gray-600">
//                                     {request.fromUser.headline}
//                                   </p>
//                                   <p className="text-xs text-gray-500">
//                                     {request.mutualConnections || 0} mutual connections
//                                   </p>
//                                   {/* ONLINE STATUS: Show last seen text for offline users */}
//                                   {!isOnline && lastSeenText && (
//                                     <p className="text-xs text-gray-400">
//                                       {lastSeenText}
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>
                              
//                               {!bulkMode && (
//                                 <div className="flex gap-2">
//                                   <button
//                                     onClick={() => router.push(`/profile/${request.fromUser.uid}`)}
//                                     className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
//                                   >
//                                     View Profile
//                                   </button>
//                                   <button
//                                     onClick={() => handleAcceptRequest(request.id)}
//                                     className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
//                                   >
//                                     Accept
//                                   </button>
//                                   <button
//                                     onClick={() => handleRejectRequest(request.id)}
//                                     className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
//                                   >
//                                     Decline
//                                   </button>
//                                 </div>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Sent Requests Tab */}
//               {activeNetworkTab === 'sent' && (
//                 <div className="p-6">
//                   {loadingNetwork ? (
//                     <div className="flex justify-center items-center h-40">
//                       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
//                     </div>
//                   ) : processedSentRequests.length === 0 ? (
//                     <div className="text-center py-12">
//                       <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                       <h3 className="text-lg font-semibold text-gray-900 mb-2">No sent requests</h3>
//                       <p className="text-gray-600">
//                         You haven't sent any connection requests yet
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                         Sent Requests ({processedSentRequests.length})
//                         {processedSentRequests.length < sentRequests.length && (
//                           <span className="ml-2 text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
//                             <AlertTriangle className="inline w-3 h-3 mr-1" />
//                             {sentRequests.length - processedSentRequests.length} filtered
//                           </span>
//                         )}
//                       </h3>
                      
//                       <div className="space-y-3">
//                         {processedSentRequests.map((request) => {
//                           // ONLINE STATUS: Get the online status for this user - FIXED
//                           const userOnlineStatus = userOnlineStatuses[request.toUser.uid];
//                           const isOnline = userOnlineStatus?.isOnline || false;
//                           const lastSeenText = userOnlineStatus?.lastSeenText || 'Never online';
                          
//                           return (
//                             <div key={request.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4">
//                               <div className="flex items-center gap-3">
//                                 <div className="relative">
//                                   {request.toUser.profileImage ? (
//                                     <img 
//                                       src={request.toUser.profileImage} 
//                                       alt={request.toUser.displayName || 'User'} 
//                                       className="w-12 h-12 rounded-lg object-cover"
//                                     />
//                                   ) : (
//                                     <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
//                                       <span className="font-bold text-orange-600">
//                                         {request.toUser.displayName?.[0]?.toUpperCase() || 'U'}
//                                       </span>
//                                     </div>
//                                   )}
//                                   {/* ONLINE STATUS: Dynamic green dot */}
//                                   <div 
//                                     className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
//                                       isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
//                                     }`}
//                                     title={isOnline ? "Online now" : `Last seen ${lastSeenText}`}
//                                   ></div>
//                                 </div>
//                                 <div>
//                                   <h4 className="font-semibold text-gray-900">
//                                     {request.toUser.displayName || 'Anonymous User'}
//                                   </h4>
//                                   <p className="text-sm text-gray-600">
//                                     {request.toUser.headline}
//                                   </p>
//                                   <p className="text-xs text-gray-500">
//                                     Sent {request.createdAt?.toDate ? request.createdAt.toDate().toLocaleDateString() : 'recently'}
//                                   </p>
//                                   {/* ONLINE STATUS: Show last seen text for offline users */}
//                                   {!isOnline && lastSeenText && (
//                                     <p className="text-xs text-gray-400">
//                                       {lastSeenText}
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>
                              
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => router.push(`/profile/${request.toUser.uid}`)}
//                                   className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
//                                 >
//                                   View Profile
//                                 </button>
//                                 <button
//                                   onClick={() => handleCancelRequest(request.id)}
//                                   className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
//                                 >
//                                   Cancel
//                                 </button>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function NetworkPage() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Network page failed to load">
//       <NetworkContent />
//     </ClientErrorBoundary>
//   );
// }


// --------------------------------------           main working one brofre optimizesd------------------

// 'use client';

// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { collection, getDocs, query, orderBy, limit, getDoc, doc, or, where } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebase';
// import Link from 'next/link';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';
// import { 
//   sendConnectionRequest, 
//   getConnectionStatus, 
//   areUsersConnected,
//   getUserConnectionsWithProfiles,
//   getIncomingConnectionRequests,
//   getSentConnectionRequests,
//   acceptConnectionRequest,
//   rejectConnectionRequest,
//   cancelConnectionRequest,
//   removeConnection,
//   updateConnectionNote,
//   updateConnectionTags,
//   bulkAcceptConnectionRequests,
//   bulkRejectConnectionRequests,
//   getConnectionStatistics,
//   getAllConnectionsForUser,
//   UserProfile,
//   ConnectionWithUser,
//   IncomingRequest,
//   SentRequest,
//   Connection
// } from '@/lib/connections';
// import { startConversation } from '@/lib/startConversation';
// import { useMultipleUserOnlineStatus } from '@/hooks/useOnlineStatus';
// import { updateUserOnlineStatus } from '@/lib/onlineStatus';
// import { 
//   Search, 
//   Users, 
//   UserPlus, 
//   MessageSquare, 
//   CheckCircle, 
//   Clock, 
//   X,
//   Trash2,
//   Tag,
//   Globe,
//   Network,
//   UserCheck,
//   UserX,
//   Send,
//   Edit,
//   BarChart3,
//   Check,
//   XCircle,
//   Filter,
//   Eye,
//   AlertTriangle
// } from 'lucide-react';

// type TabType = 'discover' | 'network';
// type NetworkTabType = 'connections' | 'received' | 'sent';

// // Helper function to normalize text for duplicate detection
// function normalizeForComparison(text: string | null | undefined): string {
//   if (!text) return '';
//   return text
//     .trim()
//     .toLowerCase()
//     .replace(/\s+/g, ' ') // Replace multiple spaces with single space
//     .replace(/[^\w\s]/g, '') // Remove special characters
//     .replace(/\b(mohd|mohammed|md|mohammad|mohamed)\b/gi, '') // Common name variations
//     .replace(/\b(shaikh|sheikh|shaik|sheik)\b/gi, '') // Common surname variations
//     .trim();
// }

// function NetworkContent() {
//   const [user] = useAuthState(auth);
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState<TabType>('discover');
//   const [activeNetworkTab, setActiveNetworkTab] = useState<NetworkTabType>('connections');
  
//   // Discover Tab States
//   const [discoverUsers, setDiscoverUsers] = useState<UserProfile[]>([]);
//   const [loadingDiscover, setLoadingDiscover] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [connectionStatuses, setConnectionStatuses] = useState<Record<string, Connection>>({});
  
//   // Network Tab States
//   const [connections, setConnections] = useState<ConnectionWithUser[]>([]);
//   const [receivedRequests, setReceivedRequests] = useState<IncomingRequest[]>([]);
//   const [sentRequests, setSentRequests] = useState<SentRequest[]>([]);
//   const [loadingNetwork, setLoadingNetwork] = useState(false);
//   const [networkStats, setNetworkStats] = useState({
//     totalConnections: 0,
//     pendingReceived: 0,
//     pendingSent: 0,
//     mutualConnectionsAverage: 0
//   });
  
//   // Advanced Features
//   const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
//   const [editingNote, setEditingNote] = useState<string | null>(null);
//   const [noteText, setNoteText] = useState('');
//   const [showTagsModal, setShowTagsModal] = useState<string | null>(null);
//   const [selectedTags, setSelectedTags] = useState<string[]>([]);
//   const [bulkMode, setBulkMode] = useState(false);

//   const availableTags = [
//     'Recruiter', 'Mentor', 'Colleague', 'Former Colleague',
//     'Industry Expert', 'Potential Client', 'Friend', 'Alumni',
//     'Conference Contact', 'Referral Source', 'Business Partner'
//   ];

//   // Process connections to remove duplicates
//   const processedConnections = useMemo(() => {
//     if (connections.length === 0) return [];
    
//     const seen = new Set<string>();
//     const uniqueConnections: ConnectionWithUser[] = [];
    
//     connections.forEach(conn => {
//       const key = normalizeForComparison(conn.otherUser.displayName);
//       if (!seen.has(key) && key) {
//         seen.add(key);
//         uniqueConnections.push(conn);
//       } else if (!key) {
//         // If no name, use UID
//         if (!seen.has(conn.otherUser.uid)) {
//           seen.add(conn.otherUser.uid);
//           uniqueConnections.push(conn);
//         }
//       }
//     });
    
//     return uniqueConnections;
//   }, [connections]);

//   // Process received requests to remove duplicates
//   const processedReceivedRequests = useMemo(() => {
//     if (receivedRequests.length === 0) return [];
    
//     const seen = new Set<string>();
//     const uniqueRequests: IncomingRequest[] = [];
    
//     receivedRequests.forEach(req => {
//       const key = normalizeForComparison(req.fromUser.displayName);
//       if (!seen.has(key) && key) {
//         seen.add(key);
//         uniqueRequests.push(req);
//       } else if (!key) {
//         // If no name, use UID
//         if (!seen.has(req.fromUser.uid)) {
//           seen.add(req.fromUser.uid);
//           uniqueRequests.push(req);
//         }
//       }
//     });
    
//     return uniqueRequests;
//   }, [receivedRequests]);

//   // Process sent requests to remove duplicates AND filter out connected users
//   const processedSentRequests = useMemo(() => {
//     if (sentRequests.length === 0) return [];
    
//     const seen = new Set<string>();
//     const uniqueRequests: SentRequest[] = [];
//     const connectedUserIds = new Set(connections.map(c => c.otherUser.uid));
    
//     sentRequests.forEach(req => {
//       // Skip if already connected
//       if (connectedUserIds.has(req.toUser.uid)) return;
      
//       const key = normalizeForComparison(req.toUser.displayName);
//       if (!seen.has(key) && key) {
//         seen.add(key);
//         uniqueRequests.push(req);
//       } else if (!key) {
//         // If no name, use UID
//         if (!seen.has(req.toUser.uid)) {
//           seen.add(req.toUser.uid);
//           uniqueRequests.push(req);
//         }
//       }
//     });
    
//     return uniqueRequests;
//   }, [sentRequests, connections]);

//   // ONLINE STATUS: Get user IDs for batch checking
//   const discoverUserIds = useMemo(() => {
//     return discoverUsers.map(user => user.uid);
//   }, [discoverUsers]);

//   const connectionUserIds = useMemo(() => {
//     return processedConnections.map(conn => conn.otherUser.uid);
//   }, [processedConnections]);

//   const receivedRequestUserIds = useMemo(() => {
//     return processedReceivedRequests.map(req => req.fromUser.uid);
//   }, [processedReceivedRequests]);

//   const sentRequestUserIds = useMemo(() => {
//     return processedSentRequests.map(req => req.toUser.uid);
//   }, [processedSentRequests]);

//   // ONLINE STATUS: Determine which user IDs to check based on active tab
//   const userIdsForStatusCheck = useMemo(() => {
//     if (activeTab === 'discover') {
//       return discoverUserIds;
//     } else if (activeTab === 'network') {
//       if (activeNetworkTab === 'connections') {
//         return connectionUserIds;
//       } else if (activeNetworkTab === 'received') {
//         return receivedRequestUserIds;
//       } else if (activeNetworkTab === 'sent') {
//         return sentRequestUserIds;
//       }
//     }
//     return [];
//   }, [activeTab, activeNetworkTab, discoverUserIds, connectionUserIds, receivedRequestUserIds, sentRequestUserIds]);

//   // ONLINE STATUS: Use batch online status hook - FIXED
//   const { statusMap: userOnlineStatuses, loading: statusLoading } = useMultipleUserOnlineStatus(userIdsForStatusCheck);

//   // Force update current user's online status on page load
//   useEffect(() => {
//     if (user?.uid) {
//       updateUserOnlineStatus(user.uid);
//     }
//   }, [user?.uid]);

//   // Fetch users for Discover tab - SIMPLIFIED VERSION
//   useEffect(() => {
//     const fetchDiscoverUsers = async () => {
//       try {
//         setLoadingDiscover(true);
        
//         const usersQuery = query(
//           collection(db, 'users'), 
//           orderBy('createdAt', 'desc'),
//           limit(50)
//         );
        
//         const querySnapshot = await getDocs(usersQuery);
//         const usersData: UserProfile[] = [];
//         const seenNames = new Set<string>();
        
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           if (data.displayName || data.headline) {
//             const normalizedName = normalizeForComparison(data.displayName);
            
//             // Skip duplicates by normalized name
//             if (normalizedName && seenNames.has(normalizedName)) {
//               console.log(`⚠️ Skipping duplicate: ${data.displayName} → ${normalizedName}`);
//               return;
//             }
            
//             if (normalizedName) seenNames.add(normalizedName);
            
//             usersData.push({
//               uid: doc.id,
//               displayName: data.displayName || null,
//               email: data.email || null,
//               headline: data.headline || '',
//               bio: data.bio || '',
//               skills: data.skills || [],
//               location: data.location || '',
//               profileImage: data.profileImage || '',
//               projects: data.projects || [],
//               education: data.education || '',
//               experience: data.experience || '',
//               website: data.website || '',
//               github: data.github || '',
//               linkedin: data.linkedin || '',
//               createdAt: data.createdAt
//             });
//           }
//         });
        
//         console.log(`📊 Loaded ${usersData.length} unique users (filtered duplicates)`);
//         setDiscoverUsers(usersData);
        
//         // Load ALL connections for current user at once (optimized) - FIXED
//         if (user) {
//           const allConnections = await getAllConnectionsForUser(user.uid);
//           setConnectionStatuses(allConnections);
//         }
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       } finally {
//         setLoadingDiscover(false);
//       }
//     };

//     if (activeTab === 'discover') {
//       fetchDiscoverUsers();
//     }
//   }, [user, activeTab]);

//   // Fetch network data
//   const fetchNetworkData = useCallback(async () => {
//     if (!user) return;
    
//     try {
//       setLoadingNetwork(true);
      
//       const [
//         connectionsData,
//         incomingData,
//         sentData,
//         stats
//       ] = await Promise.all([
//         getUserConnectionsWithProfiles(user.uid),
//         getIncomingConnectionRequests(user.uid),
//         getSentConnectionRequests(user.uid),
//         getConnectionStatistics(user.uid)
//       ]);
      
//       console.log(`📊 Raw data: ${connectionsData.length} connections, ${incomingData.length} received, ${sentData.length} sent`);
      
//       setConnections(connectionsData);
//       setReceivedRequests(incomingData);
//       setSentRequests(sentData);
//       setNetworkStats(stats);
      
//       setSelectedRequests([]);
//       setBulkMode(false);
      
//     } catch (error) {
//       console.error('Error fetching network data:', error);
//       showToast('Failed to load network data', 'error');
//     } finally {
//       setLoadingNetwork(false);
//     }
//   }, [user]);

//   useEffect(() => {
//     if (activeTab === 'network' && user) {
//       fetchNetworkData();
//     }
//   }, [activeTab, user, fetchNetworkData]);

//   // Filter discover users
//   const filteredDiscoverUsers = useMemo(() => {
//     let result = [...discoverUsers];
    
//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(user => {
//         const nameMatch = user.displayName?.toLowerCase().includes(term) || false;
//         const headlineMatch = user.headline.toLowerCase().includes(term);
//         const skillsMatch = user.skills.some(skill => skill.toLowerCase().includes(term));
//         const locationMatch = user.location.toLowerCase().includes(term);
//         return nameMatch || headlineMatch || skillsMatch || locationMatch;
//       });
//     }
    
//     // Filter out current user and people already connected
//     if (user) {
//       result = result.filter(userProfile => {
//         if (userProfile.uid === user.uid) return false;
//         const status = connectionStatuses[userProfile.uid];
//         return !status || status.status !== 'accepted';
//       });
//     }
    
//     return result;
//   }, [discoverUsers, searchTerm, user, connectionStatuses]);

//   // Handle sending connection request - IMPROVED VERSION
//   const handleConnect = async (userId: string, userName: string) => {
//     if (!user) {
//       router.push('/login');
//       return;
//     }
    
//     try {
//       const connectionId = await sendConnectionRequest(user.uid, userId);
      
//       // Refresh connection statuses
//       if (activeTab === 'discover' && user) {
//         const allConnections = await getAllConnectionsForUser(user.uid);
//         setConnectionStatuses(allConnections);
//       }
      
//       showToast(`Connected with ${userName}!`, 'success');
      
//       if (activeTab === 'network') {
//         fetchNetworkData();
//       }
      
//     } catch (error: any) {
//       console.error('Error sending connection request:', error);
      
//       // Handle specific error messages better
//       if (error.message.includes('already sent you')) {
//         // This should not happen with the new logic, but just in case
//         showToast(`${userName} already sent you a connection request. Check your incoming requests.`, 'info');
        
//         // Refresh to show the correct status
//         if (user) {
//           const allConnections = await getAllConnectionsForUser(user.uid);
//           setConnectionStatuses(allConnections);
//         }
//       } else if (error.message.includes('Already connected')) {
//         showToast(`Already connected with ${userName}`, 'info');
        
//         // Refresh to show the correct status
//         if (user) {
//           const allConnections = await getAllConnectionsForUser(user.uid);
//           setConnectionStatuses(allConnections);
//         }
//       } else if (error.message.includes('already pending')) {
//         showToast(`Connection request already sent to ${userName}`, 'info');
//       } else {
//         showToast(error.message || 'Failed to send connection request', 'error');
//       }
//     }
//   };

//   // Handle messaging
//   const handleMessage = async (otherUserId: string, otherUserName: string) => {
//     if (!user) {
//       router.push('/login');
//       return;
//     }
    
//     try {
//       const isConnected = await areUsersConnected(user.uid, otherUserId);
      
//       if (!isConnected) {
//         const shouldConnect = window.confirm(
//           `Connect with ${otherUserName || 'this user'} to start messaging?`
//         );
        
//         if (shouldConnect) {
//           await handleConnect(otherUserId, otherUserName);
//         }
//         return;
//       }
      
//       const conversationId = await startConversation(user.uid, otherUserId);
//       router.push(`/dashboard/messages/${conversationId}`);
      
//     } catch (error: any) {
//       console.error('Error starting conversation:', error);
//       showToast(error.message || 'Unable to start conversation', 'error');
//     }
//   };

//   // Handle accepting connection request
//   const handleAcceptRequest = async (connectionId: string) => {
//     try {
//       await acceptConnectionRequest(connectionId);
//       showToast('Connection request accepted!', 'success');
//       fetchNetworkData();
      
//       // Also update the discover tab status
//       if (activeTab === 'discover' && user) {
//         const allConnections = await getAllConnectionsForUser(user.uid);
//         setConnectionStatuses(allConnections);
//       }
//     } catch (error) {
//       console.error('Error accepting request:', error);
//       showToast('Failed to accept request', 'error');
//     }
//   };

//   // Handle rejecting connection request
//   const handleRejectRequest = async (connectionId: string) => {
//     try {
//       await rejectConnectionRequest(connectionId);
//       showToast('Connection request declined', 'info');
//       fetchNetworkData();
      
//       // Also update the discover tab status
//       if (activeTab === 'discover' && user) {
//         const allConnections = await getAllConnectionsForUser(user.uid);
//         setConnectionStatuses(allConnections);
//       }
//     } catch (error) {
//       console.error('Error rejecting request:', error);
//       showToast('Failed to decline request', 'error');
//     }
//   };

//   // Handle cancelling sent request
//   const handleCancelRequest = async (connectionId: string) => {
//     if (window.confirm('Are you sure you want to cancel this connection request?')) {
//       try {
//         await cancelConnectionRequest(connectionId);
//         showToast('Connection request cancelled', 'info');
//         fetchNetworkData();
        
//         // Also update the discover tab status
//         if (activeTab === 'discover' && user) {
//           const allConnections = await getAllConnectionsForUser(user.uid);
//           setConnectionStatuses(allConnections);
//         }
//       } catch (error) {
//         console.error('Error cancelling request:', error);
//         showToast('Failed to cancel request', 'error');
//       }
//     }
//   };

//   // Handle removing connection
//   const handleRemoveConnection = async (connectionId: string) => {
//     if (window.confirm('Are you sure you want to remove this connection?')) {
//       try {
//         await removeConnection(connectionId);
//         showToast('Connection removed', 'info');
//         fetchNetworkData();
        
//         // Also update the discover tab status
//         if (activeTab === 'discover' && user) {
//           const allConnections = await getAllConnectionsForUser(user.uid);
//           setConnectionStatuses(allConnections);
//         }
//       } catch (error) {
//         console.error('Error removing connection:', error);
//         showToast('Failed to remove connection', 'error');
//       }
//     }
//   };

//   // Handle updating connection note
//   const handleUpdateNote = async (connectionId: string) => {
//     if (!noteText.trim()) return;
    
//     try {
//       await updateConnectionNote(connectionId, noteText);
//       showToast('Note updated successfully', 'success');
//       setEditingNote(null);
//       setNoteText('');
//       fetchNetworkData();
//     } catch (error) {
//       console.error('Error updating note:', error);
//       showToast('Failed to update note', 'error');
//     }
//   };

//   // Handle updating connection tags
//   const handleUpdateTags = async (connectionId: string) => {
//     try {
//       await updateConnectionTags(connectionId, selectedTags);
//       showToast('Tags updated successfully', 'success');
//       setShowTagsModal(null);
//       setSelectedTags([]);
//       fetchNetworkData();
//     } catch (error) {
//       console.error('Error updating tags:', error);
//       showToast('Failed to update tags', 'error');
//     }
//   };

//   // Bulk accept requests
//   const handleBulkAccept = async () => {
//     if (selectedRequests.length === 0) return;
    
//     try {
//       await bulkAcceptConnectionRequests(selectedRequests);
//       showToast(`${selectedRequests.length} requests accepted!`, 'success');
//       fetchNetworkData();
      
//       // Also update the discover tab status
//       if (activeTab === 'discover' && user) {
//         const allConnections = await getAllConnectionsForUser(user.uid);
//         setConnectionStatuses(allConnections);
//       }
//     } catch (error) {
//       console.error('Error bulk accepting requests:', error);
//       showToast('Failed to accept requests', 'error');
//     }
//   };

//   // Bulk reject requests
//   const handleBulkReject = async () => {
//     if (selectedRequests.length === 0) return;
    
//     try {
//       await bulkRejectConnectionRequests(selectedRequests);
//       showToast(`${selectedRequests.length} requests declined`, 'info');
//       fetchNetworkData();
      
//       // Also update the discover tab status
//       if (activeTab === 'discover' && user) {
//         const allConnections = await getAllConnectionsForUser(user.uid);
//         setConnectionStatuses(allConnections);
//       }
//     } catch (error) {
//       console.error('Error bulk rejecting requests:', error);
//       showToast('Failed to decline requests', 'error');
//     }
//   };

//   // Toggle request selection for bulk operations
//   const toggleRequestSelection = (connectionId: string) => {
//     setSelectedRequests(prev =>
//       prev.includes(connectionId)
//         ? prev.filter(id => id !== connectionId)
//         : [...prev, connectionId]
//     );
//   };

//   // Select all requests
//   const selectAllRequests = () => {
//     const allIds = processedReceivedRequests.map(req => req.id);
//     setSelectedRequests(allIds);
//   };

//   // Clear all selections
//   const clearSelections = () => {
//     setSelectedRequests([]);
//     setBulkMode(false);
//   };

//   // Toast helper
//   const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
//     const event = new CustomEvent('showToast', {
//       detail: { message, type }
//     });
//     window.dispatchEvent(event);
//   };

//   if (loadingDiscover && activeTab === 'discover') {
//     return (
//       <div className="min-h-screen bg-white py-12">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-7xl mx-auto px-4 py-8">
        
//         {/* Header */}
//         <div className="mb-10">
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center gap-2">
//               <Network className="w-8 h-8 text-orange-600" />
//               <h1 className="text-3xl font-bold text-gray-900">Professional Network</h1>
//             </div>
//             {user && (
//               <div className="flex items-center gap-2">
//                 <Link
//                   href="/dashboard"
//                   className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
//                 >
//                   Dashboard
//                 </Link>
//                 <Link
//                   href="/referral/marketplace"
//                   className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
//                 >
//                   Referral Jobs
//                 </Link>
//               </div>
//             )}
//           </div>
//           <p className="text-gray-600">
//             Connect with professionals, manage your network, and grow your career
//           </p>
//         </div>

//         {/* Main Tabs */}
//         <div className="mb-8">
//           <div className="flex space-x-1 border-b border-gray-200">
//             <button
//               onClick={() => setActiveTab('discover')}
//               className={`py-3 px-6 text-sm font-medium rounded-t-lg transition-all ${
//                 activeTab === 'discover'
//                   ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
//                   : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <div className="flex items-center gap-2">
//                 <UserPlus className="w-4 h-4" />
//                 Discover Professionals
//               </div>
//             </button>
//             <button
//               onClick={() => setActiveTab('network')}
//               className={`py-3 px-6 text-sm font-medium rounded-t-lg transition-all relative ${
//                 activeTab === 'network'
//                   ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
//                   : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <div className="flex items-center gap-2">
//                 <Users className="w-4 h-4" />
//                 My Network
//                 {networkStats.pendingReceived > 0 && (
//                   <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
//                     {networkStats.pendingReceived}
//                   </span>
//                 )}
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Discover Tab */}
//         {activeTab === 'discover' && (
//           <div className="space-y-6">
//             {/* Search Bar */}
//             <div className="relative">
//               <div className="relative max-w-2xl mx-auto">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search professionals by name, skills, location, or company..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all shadow-sm"
//                   autoComplete="off"
//                 />
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm('')}
//                     className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Results */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredDiscoverUsers.map((userProfile) => {
//                 const connection = connectionStatuses[userProfile.uid];
//                 const isConnected = connection?.status === 'accepted';
//                 const isPending = connection?.status === 'pending';
//                 const isOwnProfile = user && user.uid === userProfile.uid;
//                 const isIncomingRequest = connection && connection.toUserId === user?.uid;
                
//                 // ONLINE STATUS: Get the online status for this user - FIXED
//                 const userOnlineStatus = userOnlineStatuses[userProfile.uid];
//                 const isOnline = userOnlineStatus?.isOnline || false;
//                 const lastSeenText = userOnlineStatus?.lastSeenText || 'Never online';
                
//                 return (
//                   <div 
//                     key={userProfile.uid}
//                     className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 group hover:border-orange-300"
//                   >
//                     {/* Profile Header */}
//                     <div className="flex items-start gap-3 mb-3">
//                       {/* Avatar */}
//                       <div className="relative">
//                         {userProfile.profileImage ? (
//                           <img 
//                             src={userProfile.profileImage} 
//                             alt={userProfile.displayName || 'User'} 
//                             className="w-14 h-14 rounded-lg object-cover border-2 border-white shadow-sm group-hover:border-orange-100 transition-colors"
//                           />
//                         ) : (
//                           <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center border-2 border-white shadow-sm group-hover:border-orange-100 transition-colors">
//                             <span className="font-bold text-orange-600 text-xl">
//                               {userProfile.displayName?.[0]?.toUpperCase() || userProfile.email?.[0]?.toUpperCase() || 'U'}
//                             </span>
//                           </div>
//                         )}
//                         {/* ONLINE STATUS: Dynamic green dot */}
//                         <div 
//                           className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
//                             isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
//                           }`}
//                           title={isOnline ? "Online now" : `Last seen ${lastSeenText}`}
//                         ></div>
//                       </div>
                      
//                       {/* User Info */}
//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-semibold text-gray-900 truncate">
//                           {userProfile.displayName || 'Anonymous User'}
//                         </h3>
//                         {userProfile.headline && (
//                           <p className="text-sm text-orange-600 truncate">
//                             {userProfile.headline}
//                           </p>
//                         )}
//                         {userProfile.location && (
//                           <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
//                             <Globe className="w-3 h-3" />
//                             {userProfile.location}
//                           </p>
//                         )}
//                         {/* ONLINE STATUS: Show last seen text for offline users */}
//                         {!isOnline && lastSeenText && (
//                           <p className="text-xs text-gray-400 mt-1">
//                             {lastSeenText}
//                           </p>
//                         )}
//                       </div>
//                     </div>
                    
//                     {/* Skills */}
//                     {userProfile.skills.length > 0 && (
//                       <div className="mb-4">
//                         <div className="flex flex-wrap gap-1">
//                           {userProfile.skills.slice(0, 3).map((skill, idx) => (
//                             <span 
//                               key={idx}
//                               className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-orange-50 hover:text-orange-700 transition-colors cursor-default"
//                             >
//                               {skill}
//                             </span>
//                           ))}
//                           {userProfile.skills.length > 3 && (
//                             <span className="px-2 py-1 text-gray-400 text-xs">
//                               +{userProfile.skills.length - 3}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     )}
                    
//                     {/* Connection Status */}
//                     {connection && (
//                       <div className="mb-3">
//                         {isConnected ? (
//                           <div className="flex items-center gap-1 text-green-600 text-xs">
//                             <CheckCircle className="w-3 h-3" />
//                             <span>Connected</span>
//                           </div>
//                         ) : isPending ? (
//                           <div className="flex items-center gap-1 text-orange-500 text-xs">
//                             <Clock className="w-3 h-3 animate-pulse" />
//                             <span>{isIncomingRequest ? 'Request received' : 'Request sent'}</span>
//                           </div>
//                         ) : null}
//                       </div>
//                     )}
                    
//                     {/* Action Buttons */}
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => router.push(`/profile/${userProfile.uid}`)}
//                         className="flex-1 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
//                       >
//                         <Eye className="w-4 h-4" />
//                         View
//                       </button>
                      
//                       {user && !isOwnProfile && (
//                         <>
//                           {!isConnected && !isPending && (
//                             <button
//                               onClick={() => handleConnect(userProfile.uid, userProfile.displayName || 'User')}
//                               className="flex-1 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-1"
//                             >
//                               <UserPlus className="w-4 h-4" />
//                               Connect
//                             </button>
//                           )}
                          
//                           {isPending && isIncomingRequest && (
//                             <div className="flex gap-1 flex-1">
//                               <button
//                                 onClick={() => handleAcceptRequest(connection.id)}
//                                 className="flex-1 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
//                               >
//                                 <Check className="w-4 h-4" />
//                                 Accept
//                               </button>
//                               <button
//                                 onClick={() => handleRejectRequest(connection.id)}
//                                 className="flex-1 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
//                               >
//                                 <XCircle className="w-4 h-4" />
//                                 Decline
//                               </button>
//                             </div>
//                           )}
                          
//                           {isPending && !isIncomingRequest && (
//                             <button
//                               onClick={() => handleCancelRequest(connection.id)}
//                               className="flex-1 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-1"
//                             >
//                               <Clock className="w-4 h-4" />
//                               Cancel
//                             </button>
//                           )}
                          
//                           {isConnected && (
//                             <button
//                               onClick={() => handleMessage(userProfile.uid, userProfile.displayName || 'User')}
//                               className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
//                             >
//                               <MessageSquare className="w-4 h-4" />
//                               Message
//                             </button>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
            
//             {filteredDiscoverUsers.length === 0 && (
//               <div className="text-center py-12">
//                 <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Users className="w-10 h-10 text-gray-400" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">No professionals found</h3>
//                 <p className="text-gray-600 mb-6">
//                   {searchTerm ? 'Try different search terms or clear search' : 'Check back soon for new professionals'}
//                 </p>
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm('')}
//                     className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
//                   >
//                     Clear Search
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {/* My Network Tab */}
//         {activeTab === 'network' && (
//           <div className="space-y-6">
//             {/* Network Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="bg-white border border-gray-200 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-500">Total Connections</p>
//                     <p className="text-2xl font-bold text-gray-900">{processedConnections.length}</p>
//                   </div>
//                   <Users className="w-8 h-8 text-orange-500" />
//                 </div>
//               </div>
              
//               <div className="bg-white border border-gray-200 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-500">Pending Received</p>
//                     <p className="text-2xl font-bold text-gray-900">{processedReceivedRequests.length}</p>
//                   </div>
//                   <UserPlus className="w-8 h-8 text-blue-500" />
//                 </div>
//               </div>
              
//               <div className="bg-white border border-gray-200 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-500">Pending Sent</p>
//                     <p className="text-2xl font-bold text-gray-900">{processedSentRequests.length}</p>
//                   </div>
//                   <Send className="w-8 h-8 text-green-500" />
//                 </div>
//               </div>
              
//               <div className="bg-white border border-gray-200 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-500">Avg. Mutual</p>
//                     <p className="text-2xl font-bold text-gray-900">{networkStats.mutualConnectionsAverage}</p>
//                   </div>
//                   <BarChart3 className="w-8 h-8 text-purple-500" />
//                 </div>
//               </div>
//             </div>

//             {/* Network Tabs */}
//             <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
//               <div className="flex border-b border-gray-200">
//                 <button
//                   onClick={() => setActiveNetworkTab('connections')}
//                   className={`flex-1 py-3 text-sm font-medium ${
//                     activeNetworkTab === 'connections'
//                       ? 'text-orange-600 border-b-2 border-orange-600'
//                       : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   <div className="flex items-center justify-center gap-2">
//                     <UserCheck className="w-4 h-4" />
//                     Connections ({processedConnections.length})
//                     {processedConnections.length < connections.length && (
//                       <span 
//                         className="bg-yellow-500 text-white text-xs rounded-full px-1.5 py-0.5"
//                         title={`Filtered ${connections.length - processedConnections.length} duplicates`}
//                       >
//                         -{connections.length - processedConnections.length}
//                       </span>
//                     )}
//                   </div>
//                 </button>
//                 <button
//                   onClick={() => setActiveNetworkTab('received')}
//                   className={`flex-1 py-3 text-sm font-medium relative ${
//                     activeNetworkTab === 'received'
//                       ? 'text-orange-600 border-b-2 border-orange-600'
//                       : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   <div className="flex items-center justify-center gap-2">
//                     <UserPlus className="w-4 h-4" />
//                     Received ({processedReceivedRequests.length})
//                     {processedReceivedRequests.length > 0 && (
//                       <span className="absolute top-2 right-6 bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
//                         {processedReceivedRequests.length}
//                       </span>
//                     )}
//                     {processedReceivedRequests.length < receivedRequests.length && (
//                       <span 
//                         className="absolute top-2 right-16 bg-yellow-500 text-white text-xs rounded-full px-1.5 py-0.5"
//                         title={`Filtered ${receivedRequests.length - processedReceivedRequests.length} duplicates`}
//                       >
//                         -{receivedRequests.length - processedReceivedRequests.length}
//                       </span>
//                     )}
//                   </div>
//                 </button>
//                 <button
//                   onClick={() => setActiveNetworkTab('sent')}
//                   className={`flex-1 py-3 text-sm font-medium ${
//                     activeNetworkTab === 'sent'
//                       ? 'text-orange-600 border-b-2 border-orange-600'
//                       : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   <div className="flex items-center justify-center gap-2">
//                     <Send className="w-4 h-4" />
//                     Sent ({processedSentRequests.length})
//                     {processedSentRequests.length < sentRequests.length && (
//                       <span 
//                         className="bg-yellow-500 text-white text-xs rounded-full px-1.5 py-0.5"
//                         title={`Filtered ${sentRequests.length - processedSentRequests.length} duplicates`}
//                       >
//                         -{sentRequests.length - processedSentRequests.length}
//                       </span>
//                     )}
//                   </div>
//                 </button>
//               </div>

//               {/* Connections Tab */}
//               {activeNetworkTab === 'connections' && (
//                 <div className="p-6">
//                   {loadingNetwork ? (
//                     <div className="flex justify-center items-center h-40">
//                       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
//                     </div>
//                   ) : processedConnections.length === 0 ? (
//                     <div className="text-center py-12">
//                       <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                       <h3 className="text-lg font-semibold text-gray-900 mb-2">No connections yet</h3>
//                       <p className="text-gray-600 mb-6">
//                         Start connecting with professionals to build your network
//                       </p>
//                       <button
//                         onClick={() => setActiveTab('discover')}
//                         className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
//                       >
//                         Discover Professionals
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <div className="flex justify-between items-center mb-4">
//                         <h3 className="text-lg font-semibold text-gray-900">
//                           Your Connections ({processedConnections.length})
//                           {processedConnections.length < connections.length && (
//                             <span className="ml-2 text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
//                               <AlertTriangle className="inline w-3 h-3 mr-1" />
//                               {connections.length - processedConnections.length} duplicates filtered
//                             </span>
//                           )}
//                         </h3>
//                         <div className="text-sm text-gray-500">
//                           Sorted by most recent
//                         </div>
//                       </div>
                      
//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {processedConnections.map((connection) => {
//                           // ONLINE STATUS: Get the online status for this connection - FIXED
//                           const userOnlineStatus = userOnlineStatuses[connection.otherUser.uid];
//                           const isOnline = userOnlineStatus?.isOnline || false;
//                           const lastSeenText = userOnlineStatus?.lastSeenText || 'Never online';
                          
//                           return (
//                             <div key={connection.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
//                               <div className="flex items-start gap-3 mb-3">
//                                 <div className="relative">
//                                   {connection.otherUser.profileImage ? (
//                                     <img 
//                                       src={connection.otherUser.profileImage} 
//                                       alt={connection.otherUser.displayName || 'User'} 
//                                       className="w-12 h-12 rounded-lg object-cover"
//                                     />
//                                   ) : (
//                                     <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
//                                       <span className="font-bold text-orange-600">
//                                         {connection.otherUser.displayName?.[0]?.toUpperCase() || 'U'}
//                                       </span>
//                                     </div>
//                                   )}
//                                   {/* ONLINE STATUS: Dynamic green dot */}
//                                   <div 
//                                     className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
//                                       isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
//                                     }`}
//                                     title={isOnline ? "Online now" : `Last seen ${lastSeenText}`}
//                                   ></div>
//                                 </div>
//                                 <div className="flex-1 min-w-0">
//                                   <h4 className="font-semibold text-gray-900 truncate">
//                                     {connection.otherUser.displayName || 'Anonymous User'}
//                                   </h4>
//                                   <p className="text-sm text-orange-600 truncate">
//                                     {connection.otherUser.headline}
//                                   </p>
//                                   <p className="text-xs text-gray-500 truncate">
//                                     {connection.otherUser.location}
//                                   </p>
//                                   {/* ONLINE STATUS: Show last seen text for offline users */}
//                                   {!isOnline && lastSeenText && (
//                                     <p className="text-xs text-gray-400 truncate">
//                                       {lastSeenText}
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>
                              
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => router.push(`/profile/${connection.otherUser.uid}`)}
//                                   className="flex-1 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
//                                 >
//                                   View Profile
//                                 </button>
//                                 <button
//                                   onClick={() => handleMessage(connection.otherUser.uid, connection.otherUser.displayName || 'User')}
//                                   className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
//                                 >
//                                   Message
//                                 </button>
//                               </div>
                              
//                               <button
//                                 onClick={() => handleRemoveConnection(connection.id)}
//                                 className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
//                               >
//                                 Remove Connection
//                               </button>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Received Requests Tab */}
//               {activeNetworkTab === 'received' && (
//                 <div className="p-6">
//                   {loadingNetwork ? (
//                     <div className="flex justify-center items-center h-40">
//                       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
//                     </div>
//                   ) : processedReceivedRequests.length === 0 ? (
//                     <div className="text-center py-12">
//                       <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                       <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending requests</h3>
//                       <p className="text-gray-600">
//                         You don't have any pending connection requests
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <div className="flex justify-between items-center mb-4">
//                         <h3 className="text-lg font-semibold text-gray-900">
//                           Connection Requests ({processedReceivedRequests.length})
//                           {processedReceivedRequests.length < receivedRequests.length && (
//                             <span className="ml-2 text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
//                               <AlertTriangle className="inline w-3 h-3 mr-1" />
//                               {receivedRequests.length - processedReceivedRequests.length} duplicates filtered
//                             </span>
//                           )}
//                         </h3>
//                         <div className="flex gap-2">
//                           {!bulkMode ? (
//                             <button
//                               onClick={() => setBulkMode(true)}
//                               className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
//                             >
//                               Bulk Actions
//                             </button>
//                           ) : (
//                             <>
//                               <button
//                                 onClick={selectAllRequests}
//                                 className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
//                               >
//                                 Select All
//                               </button>
//                               <button
//                                 onClick={clearSelections}
//                                 className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
//                               >
//                                 Clear
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       </div>

//                       {bulkMode && selectedRequests.length > 0 && (
//                         <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-2">
//                               <CheckCircle className="w-5 h-5 text-orange-600" />
//                               <span className="font-medium text-orange-800">
//                                 {selectedRequests.length} request(s) selected
//                               </span>
//                             </div>
//                             <div className="flex gap-2">
//                               <button
//                                 onClick={handleBulkAccept}
//                                 className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
//                               >
//                                 Accept Selected
//                               </button>
//                               <button
//                                 onClick={handleBulkReject}
//                                 className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
//                               >
//                                 Reject Selected
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       <div className="space-y-3">
//                         {processedReceivedRequests.map((request) => {
//                           // ONLINE STATUS: Get the online status for this user - FIXED
//                           const userOnlineStatus = userOnlineStatuses[request.fromUser.uid];
//                           const isOnline = userOnlineStatus?.isOnline || false;
//                           const lastSeenText = userOnlineStatus?.lastSeenText || 'Never online';
                          
//                           return (
//                             <div key={request.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4">
//                               <div className="flex items-center gap-3">
//                                 {bulkMode && (
//                                   <input
//                                     type="checkbox"
//                                     checked={selectedRequests.includes(request.id)}
//                                     onChange={() => toggleRequestSelection(request.id)}
//                                     className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
//                                   />
//                                 )}
//                                 <div className="relative">
//                                   {request.fromUser.profileImage ? (
//                                     <img 
//                                       src={request.fromUser.profileImage} 
//                                       alt={request.fromUser.displayName || 'User'} 
//                                       className="w-12 h-12 rounded-lg object-cover"
//                                     />
//                                   ) : (
//                                     <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
//                                       <span className="font-bold text-orange-600">
//                                         {request.fromUser.displayName?.[0]?.toUpperCase() || 'U'}
//                                       </span>
//                                     </div>
//                                   )}
//                                   {/* ONLINE STATUS: Dynamic green dot */}
//                                   <div 
//                                     className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
//                                       isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
//                                     }`}
//                                     title={isOnline ? "Online now" : `Last seen ${lastSeenText}`}
//                                   ></div>
//                                 </div>
//                                 <div>
//                                   <h4 className="font-semibold text-gray-900">
//                                     {request.fromUser.displayName || 'Anonymous User'}
//                                   </h4>
//                                   <p className="text-sm text-gray-600">
//                                     {request.fromUser.headline}
//                                   </p>
//                                   <p className="text-xs text-gray-500">
//                                     {request.mutualConnections || 0} mutual connections
//                                   </p>
//                                   {/* ONLINE STATUS: Show last seen text for offline users */}
//                                   {!isOnline && lastSeenText && (
//                                     <p className="text-xs text-gray-400">
//                                       {lastSeenText}
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>
                              
//                               {!bulkMode && (
//                                 <div className="flex gap-2">
//                                   <button
//                                     onClick={() => router.push(`/profile/${request.fromUser.uid}`)}
//                                     className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
//                                   >
//                                     View Profile
//                                   </button>
//                                   <button
//                                     onClick={() => handleAcceptRequest(request.id)}
//                                     className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
//                                   >
//                                     Accept
//                                   </button>
//                                   <button
//                                     onClick={() => handleRejectRequest(request.id)}
//                                     className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
//                                   >
//                                     Decline
//                                   </button>
//                                 </div>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Sent Requests Tab */}
//               {activeNetworkTab === 'sent' && (
//                 <div className="p-6">
//                   {loadingNetwork ? (
//                     <div className="flex justify-center items-center h-40">
//                       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
//                     </div>
//                   ) : processedSentRequests.length === 0 ? (
//                     <div className="text-center py-12">
//                       <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                       <h3 className="text-lg font-semibold text-gray-900 mb-2">No sent requests</h3>
//                       <p className="text-gray-600">
//                         You haven't sent any connection requests yet
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                         Sent Requests ({processedSentRequests.length})
//                         {processedSentRequests.length < sentRequests.length && (
//                           <span className="ml-2 text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
//                             <AlertTriangle className="inline w-3 h-3 mr-1" />
//                             {sentRequests.length - processedSentRequests.length} filtered
//                           </span>
//                         )}
//                       </h3>
                      
//                       <div className="space-y-3">
//                         {processedSentRequests.map((request) => {
//                           // ONLINE STATUS: Get the online status for this user - FIXED
//                           const userOnlineStatus = userOnlineStatuses[request.toUser.uid];
//                           const isOnline = userOnlineStatus?.isOnline || false;
//                           const lastSeenText = userOnlineStatus?.lastSeenText || 'Never online';
                          
//                           return (
//                             <div key={request.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4">
//                               <div className="flex items-center gap-3">
//                                 <div className="relative">
//                                   {request.toUser.profileImage ? (
//                                     <img 
//                                       src={request.toUser.profileImage} 
//                                       alt={request.toUser.displayName || 'User'} 
//                                       className="w-12 h-12 rounded-lg object-cover"
//                                     />
//                                   ) : (
//                                     <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
//                                       <span className="font-bold text-orange-600">
//                                         {request.toUser.displayName?.[0]?.toUpperCase() || 'U'}
//                                       </span>
//                                     </div>
//                                   )}
//                                   {/* ONLINE STATUS: Dynamic green dot */}
//                                   <div 
//                                     className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
//                                       isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
//                                     }`}
//                                     title={isOnline ? "Online now" : `Last seen ${lastSeenText}`}
//                                   ></div>
//                                 </div>
//                                 <div>
//                                   <h4 className="font-semibold text-gray-900">
//                                     {request.toUser.displayName || 'Anonymous User'}
//                                   </h4>
//                                   <p className="text-sm text-gray-600">
//                                     {request.toUser.headline}
//                                   </p>
//                                   <p className="text-xs text-gray-500">
//                                     Sent {request.createdAt?.toDate ? request.createdAt.toDate().toLocaleDateString() : 'recently'}
//                                   </p>
//                                   {/* ONLINE STATUS: Show last seen text for offline users */}
//                                   {!isOnline && lastSeenText && (
//                                     <p className="text-xs text-gray-400">
//                                       {lastSeenText}
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>
                              
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => router.push(`/profile/${request.toUser.uid}`)}
//                                   className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
//                                 >
//                                   View Profile
//                                 </button>
//                                 <button
//                                   onClick={() => handleCancelRequest(request.id)}
//                                   className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
//                                 >
//                                   Cancel
//                                 </button>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function NetworkPage() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Network page failed to load">
//       <NetworkContent />
//     </ClientErrorBoundary>
//   );
// }


'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getDocs, query, orderBy, limit, startAfter, DocumentData, QueryDocumentSnapshot, where, getDocs as getDocsFirestore } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Link from 'next/link';
import ClientErrorBoundary from '@/components/ClientErrorBoundary';
import { 
  sendConnectionRequest, 
  getUserConnectionsWithProfiles,
  getIncomingConnectionRequests,
  getSentConnectionRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  cancelConnectionRequest,
  removeConnection,
  bulkAcceptConnectionRequests,
  bulkRejectConnectionRequests,
  getConnectionStatistics,
  UserProfile,
  ConnectionWithUser,
  IncomingRequest,
  SentRequest,
  Connection
} from '@/lib/connections';
import { startConversation } from '@/lib/startConversation';
import { useMultipleUserOnlineStatus } from '@/hooks/useOnlineStatus';
import { updateUserOnlineStatus } from '@/lib/onlineStatus';
import { 
  Search, 
  Users, 
  UserPlus, 
  MessageSquare, 
  Clock, 
  X,
  Globe,
  Network,
  Send,
  BarChart3,
  Check,
  XCircle,
  Eye,
  Loader2,
  RefreshCw
} from 'lucide-react';

type TabType = 'discover' | 'network';
type NetworkTabType = 'connections' | 'received' | 'sent';

const PAGE_SIZE = 20;

function normalizeForComparison(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .replace(/\b(mohd|mohammed|md|mohammad|mohamed)\b/gi, '')
    .replace(/\b(shaikh|sheikh|shaik|sheik)\b/gi, '')
    .trim();
}

async function getConnectionStatusForUserIds(currentUserId: string, targetUserIds: string[]): Promise<Record<string, Connection>> {
  if (targetUserIds.length === 0) return {};
  const result: Record<string, Connection> = {};
  const chunkSize = 10;
  for (let i = 0; i < targetUserIds.length; i += chunkSize) {
    const chunk = targetUserIds.slice(i, i + chunkSize);
    const q1 = query(collection(db, 'connections'), where('fromUserId', '==', currentUserId), where('toUserId', 'in', chunk));
    const q2 = query(collection(db, 'connections'), where('toUserId', '==', currentUserId), where('fromUserId', 'in', chunk));
    const [snap1, snap2] = await Promise.all([getDocsFirestore(q1), getDocsFirestore(q2)]);
    snap1.forEach(doc => { const data = doc.data(); result[data.toUserId] = { id: doc.id, status: data.status, fromUserId: data.fromUserId, toUserId: data.toUserId, createdAt: data.createdAt, updatedAt: data.updatedAt } as Connection; });
    snap2.forEach(doc => { const data = doc.data(); result[data.fromUserId] = { id: doc.id, status: data.status, fromUserId: data.fromUserId, toUserId: data.toUserId, createdAt: data.createdAt, updatedAt: data.updatedAt } as Connection; });
  }
  return result;
}

function NetworkContent() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const [activeNetworkTab, setActiveNetworkTab] = useState<NetworkTabType>('connections');
  
  // Discover Tab
  const [discoverUsers, setDiscoverUsers] = useState<UserProfile[]>([]);
  const [loadingDiscover, setLoadingDiscover] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [connectionStatuses, setConnectionStatuses] = useState<Record<string, Connection>>({});
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [discoverInitialized, setDiscoverInitialized] = useState(false);
  const [refreshingDiscover, setRefreshingDiscover] = useState(false);
  
  // Network Tab - Pagination states
  const [connections, setConnections] = useState<ConnectionWithUser[]>([]);
  const [connectionsLastDoc, setConnectionsLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMoreConnections, setHasMoreConnections] = useState(true);
  const [loadingConnections, setLoadingConnections] = useState(false);
  
  const [receivedRequests, setReceivedRequests] = useState<IncomingRequest[]>([]);
  const [receivedLastDoc, setReceivedLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMoreReceived, setHasMoreReceived] = useState(true);
  const [loadingReceived, setLoadingReceived] = useState(false);
  
  const [sentRequests, setSentRequests] = useState<SentRequest[]>([]);
  const [sentLastDoc, setSentLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMoreSent, setHasMoreSent] = useState(true);
  const [loadingSent, setLoadingSent] = useState(false);
  
  const [networkStats, setNetworkStats] = useState({ totalConnections: 0, pendingReceived: 0, pendingSent: 0, mutualConnectionsAverage: 0 });
  const [networkInitialized, setNetworkInitialized] = useState(false);
  const [refreshingNetwork, setRefreshingNetwork] = useState(false);
  
  // Bulk & UI
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);
  
  const lastOnlineUpdateRef = useRef<number>(0);
  
  const fetchConnectionStatusForDiscoverUsers = useCallback(async (users: UserProfile[]) => {
    if (!user?.uid || users.length === 0) return;
    const targetIds = users.map(u => u.uid).filter(id => id !== user.uid);
    if (targetIds.length === 0) return;
    const statusMap = await getConnectionStatusForUserIds(user.uid, targetIds);
    setConnectionStatuses(prev => ({ ...prev, ...statusMap }));
  }, [user?.uid]);
  
  const fetchInitialDiscoverUsers = useCallback(async () => {
    if (!user) return;
    try {
      setLoadingDiscover(true);
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(PAGE_SIZE));
      const snap = await getDocs(q);
      const usersData: UserProfile[] = [];
      const seenNames = new Set<string>();
      snap.forEach(doc => {
        const data = doc.data();
        if (!data.displayName && !data.headline) return;
        const norm = normalizeForComparison(data.displayName);
        if (norm && seenNames.has(norm)) return;
        if (norm) seenNames.add(norm);
        usersData.push({
          uid: doc.id,
          displayName: data.displayName || null,
          email: data.email || null,
          headline: data.headline || '',
          bio: data.bio || '',
          skills: data.skills || [],
          location: data.location || '',
          profileImage: data.profileImage || '',
          projects: data.projects || [],
          education: data.education || '',
          experience: data.experience || '',
          website: data.website || '',
          github: data.github || '',
          linkedin: data.linkedin || '',
          createdAt: data.createdAt
        });
      });
      const last = snap.docs[snap.docs.length - 1];
      setLastVisible(last || null);
      setHasMore(snap.docs.length === PAGE_SIZE);
      setDiscoverUsers(usersData);
      await fetchConnectionStatusForDiscoverUsers(usersData);
    } catch (err) { console.error(err); } finally { setLoadingDiscover(false); }
  }, [user, fetchConnectionStatusForDiscoverUsers]);
  
  const handleRefreshDiscover = useCallback(async () => {
    if (!user) return;
    setRefreshingDiscover(true);
    setDiscoverUsers([]);
    setLastVisible(null);
    setHasMore(true);
    setSearchTerm('');
    await fetchInitialDiscoverUsers();
    setRefreshingDiscover(false);
    window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Discover feed refreshed', type: 'success' } }));
  }, [user, fetchInitialDiscoverUsers]);
  
  const loadMoreUsers = useCallback(async () => {
    if (!user || !lastVisible || loadingMore || !hasMore) return;
    try {
      setLoadingMore(true);
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(PAGE_SIZE));
      const snap = await getDocs(q);
      const usersData: UserProfile[] = [];
      const seenNames = new Set(discoverUsers.map(u => normalizeForComparison(u.displayName)));
      snap.forEach(doc => {
        const data = doc.data();
        const norm = normalizeForComparison(data.displayName);
        if (norm && seenNames.has(norm)) return;
        if (norm) seenNames.add(norm);
        usersData.push({
          uid: doc.id,
          displayName: data.displayName || null,
          email: data.email || null,
          headline: data.headline || '',
          bio: data.bio || '',
          skills: data.skills || [],
          location: data.location || '',
          profileImage: data.profileImage || '',
          projects: data.projects || [],
          education: data.education || '',
          experience: data.experience || '',
          website: data.website || '',
          github: data.github || '',
          linkedin: data.linkedin || '',
          createdAt: data.createdAt
        });
      });
      const last = snap.docs[snap.docs.length - 1];
      setLastVisible(last || null);
      setHasMore(snap.docs.length === PAGE_SIZE);
      setDiscoverUsers(prev => [...prev, ...usersData]);
      await fetchConnectionStatusForDiscoverUsers(usersData);
    } catch (err) { console.error(err); } finally { setLoadingMore(false); }
  }, [user, lastVisible, loadingMore, hasMore, discoverUsers, fetchConnectionStatusForDiscoverUsers]);
  
  useEffect(() => {
    if (activeTab === 'discover' && user && !discoverInitialized) {
      fetchInitialDiscoverUsers();
      setDiscoverInitialized(true);
    }
  }, [activeTab, user, discoverInitialized, fetchInitialDiscoverUsers]);
  
  const fetchConnections = useCallback(async (reset: boolean = true) => {
    if (!user) return;
    try {
      setLoadingConnections(true);
      const result = await getUserConnectionsWithProfiles(user.uid, PAGE_SIZE, reset ? undefined : connectionsLastDoc || undefined);
      if (reset) { setConnections(result.connections); setHasMoreConnections(result.lastDoc !== null); }
      else { setConnections(prev => [...prev, ...result.connections]); setHasMoreConnections(result.lastDoc !== null); }
      setConnectionsLastDoc(result.lastDoc);
    } catch (err) { console.error(err); window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Failed to load connections', type: 'error' } })); } finally { setLoadingConnections(false); }
  }, [user, connectionsLastDoc]);
  
  const fetchReceivedRequests = useCallback(async (reset: boolean = true) => {
    if (!user) return;
    try {
      setLoadingReceived(true);
      const result = await getIncomingConnectionRequests(user.uid, PAGE_SIZE, reset ? undefined : receivedLastDoc || undefined);
      if (reset) { setReceivedRequests(result.requests); setHasMoreReceived(result.lastDoc !== null); }
      else { setReceivedRequests(prev => [...prev, ...result.requests]); setHasMoreReceived(result.lastDoc !== null); }
      setReceivedLastDoc(result.lastDoc);
    } catch (err) { console.error(err); window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Failed to load received requests', type: 'error' } })); } finally { setLoadingReceived(false); }
  }, [user, receivedLastDoc]);
  
  const fetchSentRequests = useCallback(async (reset: boolean = true) => {
    if (!user) return;
    try {
      setLoadingSent(true);
      const result = await getSentConnectionRequests(user.uid, PAGE_SIZE, reset ? undefined : sentLastDoc || undefined);
      if (reset) { setSentRequests(result.requests); setHasMoreSent(result.lastDoc !== null); }
      else { setSentRequests(prev => [...prev, ...result.requests]); setHasMoreSent(result.lastDoc !== null); }
      setSentLastDoc(result.lastDoc);
    } catch (err) { console.error(err); window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Failed to load sent requests', type: 'error' } })); } finally { setLoadingSent(false); }
  }, [user, sentLastDoc]);
  
  const fetchNetworkStats = useCallback(async () => {
    if (!user) return;
    try { const stats = await getConnectionStatistics(user.uid); setNetworkStats(stats); } catch (err) { console.error(err); }
  }, [user]);
  
  const fetchNetworkData = useCallback(async (reset: boolean = true) => {
    if (!user) return;
    try {
      await Promise.all([fetchConnections(reset), fetchReceivedRequests(reset), fetchSentRequests(reset), fetchNetworkStats()]);
    } catch (err) { console.error(err); }
  }, [user, fetchConnections, fetchReceivedRequests, fetchSentRequests, fetchNetworkStats]);
  
  const handleRefreshNetwork = useCallback(async () => {
    setRefreshingNetwork(true);
    setConnectionsLastDoc(null); setReceivedLastDoc(null); setSentLastDoc(null);
    await fetchNetworkData(true);
    setRefreshingNetwork(false);
    window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Network refreshed', type: 'success' } }));
  }, [fetchNetworkData]);
  
  useEffect(() => {
    if (activeTab === 'network' && user && !networkInitialized) {
      fetchNetworkData(true);
      setNetworkInitialized(true);
    }
  }, [activeTab, user, networkInitialized, fetchNetworkData]);
  
  const loadMoreConnections = useCallback(() => { if (hasMoreConnections && !loadingConnections && connectionsLastDoc) fetchConnections(false); }, [hasMoreConnections, loadingConnections, connectionsLastDoc, fetchConnections]);
  const loadMoreReceived = useCallback(() => { if (hasMoreReceived && !loadingReceived && receivedLastDoc) fetchReceivedRequests(false); }, [hasMoreReceived, loadingReceived, receivedLastDoc, fetchReceivedRequests]);
  const loadMoreSent = useCallback(() => { if (hasMoreSent && !loadingSent && sentLastDoc) fetchSentRequests(false); }, [hasMoreSent, loadingSent, sentLastDoc, fetchSentRequests]);
  
  useEffect(() => {
    if (!user?.uid) return;
    const now = Date.now();
    if (now - lastOnlineUpdateRef.current > 60000) { updateUserOnlineStatus(user.uid); lastOnlineUpdateRef.current = now; }
  }, [user?.uid]);
  
  const filteredDiscoverUsers = useMemo(() => {
    let result = [...discoverUsers];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(u => u.displayName?.toLowerCase().includes(term) || u.headline.toLowerCase().includes(term) || u.skills.some(s => s.toLowerCase().includes(term)) || u.location.toLowerCase().includes(term));
    }
    if (user) result = result.filter(u => u.uid !== user.uid && (!connectionStatuses[u.uid] || connectionStatuses[u.uid].status !== 'accepted'));
    return result;
  }, [discoverUsers, searchTerm, user, connectionStatuses]);
  
  const uniqueConnections = useMemo(() => { const seen = new Set<string>(); return connections.filter(conn => { if (seen.has(conn.otherUser.uid)) return false; seen.add(conn.otherUser.uid); return true; }); }, [connections]);
  const uniqueReceivedRequests = useMemo(() => { const seen = new Set<string>(); return receivedRequests.filter(req => { if (seen.has(req.fromUser.uid)) return false; seen.add(req.fromUser.uid); return true; }); }, [receivedRequests]);
  const uniqueSentRequests = useMemo(() => { const connectedUserIds = new Set(uniqueConnections.map(c => c.otherUser.uid)); const seen = new Set<string>(); return sentRequests.filter(req => { if (connectedUserIds.has(req.toUser.uid)) return false; if (seen.has(req.toUser.uid)) return false; seen.add(req.toUser.uid); return true; }); }, [sentRequests, uniqueConnections]);
  
  const discoverUserIds = useMemo(() => filteredDiscoverUsers.slice(0,10).map(u=>u.uid), [filteredDiscoverUsers]);
  const connectionUserIds = useMemo(() => uniqueConnections.slice(0,10).map(c=>c.otherUser.uid), [uniqueConnections]);
  const receivedUserIds = useMemo(() => uniqueReceivedRequests.slice(0,10).map(r=>r.fromUser.uid), [uniqueReceivedRequests]);
  const sentUserIds = useMemo(() => uniqueSentRequests.slice(0,10).map(r=>r.toUser.uid), [uniqueSentRequests]);
  
  const userIdsForStatusCheck = useMemo(() => {
    if (activeTab === 'discover') return discoverUserIds;
    if (activeTab === 'network') {
      if (activeNetworkTab === 'connections') return connectionUserIds;
      if (activeNetworkTab === 'received') return receivedUserIds;
      if (activeNetworkTab === 'sent') return sentUserIds;
    }
    return [];
  }, [activeTab, activeNetworkTab, discoverUserIds, connectionUserIds, receivedUserIds, sentUserIds]);
  
  const { statusMap: userOnlineStatuses } = useMultipleUserOnlineStatus(userIdsForStatusCheck);
  
  // Action handlers (same as before, omitted for brevity but must be included)
  const handleConnect = async (userId: string, userName: string) => {
    if (!user) return router.push('/login');
    try {
      const connectionId = await sendConnectionRequest(user.uid, userId);
      setConnectionStatuses(prev => ({ ...prev, [userId]: { id: connectionId, status: 'pending', fromUserId: user.uid, toUserId: userId, createdAt: new Date(), updatedAt: new Date() } as Connection }));
      window.dispatchEvent(new CustomEvent('showToast', { detail: { message: `Request sent to ${userName}`, type: 'success' } }));
    } catch (error: any) {
      console.error(error);
      window.dispatchEvent(new CustomEvent('showToast', { detail: { message: error.message || 'Failed to send request', type: 'error' } }));
      setConnectionStatuses(prev => { const newStatus = { ...prev }; delete newStatus[userId]; return newStatus; });
    }
  };
  
  const handleAcceptRequest = async (connectionId: string, fromUserId: string) => {
    try {
      await acceptConnectionRequest(connectionId);
      const acceptedRequest = receivedRequests.find(r => r.id === connectionId);
      if (acceptedRequest) {
        setReceivedRequests(prev => prev.filter(r => r.id !== connectionId));
        const newConnection = { id: connectionId, fromUserId: fromUserId, toUserId: user!.uid, status: 'accepted', createdAt: new Date(), updatedAt: new Date(), otherUser: acceptedRequest.fromUser } as ConnectionWithUser;
        setConnections(prev => [newConnection, ...prev]);
        setConnectionStatuses(prev => ({ ...prev, [fromUserId]: { id: connectionId, status: 'accepted', fromUserId: fromUserId, toUserId: user!.uid, createdAt: new Date(), updatedAt: new Date() } as Connection }));
      }
      window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Request accepted!', type: 'success' } }));
    } catch (error) { console.error(error); window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Failed to accept', type: 'error' } })); }
  };
  
  const handleRejectRequest = async (connectionId: string, fromUserId: string) => {
    try {
      await rejectConnectionRequest(connectionId);
      setReceivedRequests(prev => prev.filter(r => r.id !== connectionId));
      setConnectionStatuses(prev => { const newStatus = { ...prev }; delete newStatus[fromUserId]; return newStatus; });
      window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Request declined', type: 'info' } }));
    } catch (error) { console.error(error); window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Failed to decline', type: 'error' } })); }
  };
  
  const handleCancelRequest = async (connectionId: string, toUserId: string) => {
    if (!window.confirm('Cancel this request?')) return;
    try {
      await cancelConnectionRequest(connectionId);
      setSentRequests(prev => prev.filter(r => r.id !== connectionId));
      setConnectionStatuses(prev => { const newStatus = { ...prev }; delete newStatus[toUserId]; return newStatus; });
      window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Request cancelled', type: 'info' } }));
    } catch (error) { console.error(error); window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Failed to cancel', type: 'error' } })); }
  };
  
  const handleRemoveConnection = async (connectionId: string, otherUserId: string) => {
    if (!window.confirm('Remove this connection?')) return;
    try {
      await removeConnection(connectionId);
      setConnections(prev => prev.filter(c => c.id !== connectionId));
      setConnectionStatuses(prev => { const newStatus = { ...prev }; delete newStatus[otherUserId]; return newStatus; });
      window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Connection removed', type: 'info' } }));
    } catch (error) { console.error(error); window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Failed to remove', type: 'error' } })); }
  };
  
  const handleMessage = async (otherUserId: string, otherUserName: string) => {
    if (!user) return router.push('/login');
    const localStatus = connectionStatuses[otherUserId];
    const isConnected = localStatus?.status === 'accepted';
    if (!isConnected) {
      const shouldConnect = window.confirm(`Connect with ${otherUserName} to start messaging?`);
      if (shouldConnect) await handleConnect(otherUserId, otherUserName);
      return;
    }
    const conversationId = await startConversation(user.uid, otherUserId);
    router.push(`/dashboard/messages/${conversationId}`);
  };
  
  const toggleRequestSelection = (id: string) => setSelectedRequests(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const selectAllRequests = () => setSelectedRequests(uniqueReceivedRequests.map(r => r.id));
  const clearSelections = () => { setSelectedRequests([]); setBulkMode(false); };
  
  const handleBulkAccept = async () => {
    if (selectedRequests.length === 0) return;
    try {
      await bulkAcceptConnectionRequests(selectedRequests);
      const acceptedIds = new Set(selectedRequests);
      const acceptedRequestsList = receivedRequests.filter(r => acceptedIds.has(r.id));
      setReceivedRequests(prev => prev.filter(r => !acceptedIds.has(r.id)));
      for (const req of acceptedRequestsList) {
        const newConnection = { id: req.id, fromUserId: req.fromUser.uid, toUserId: user!.uid, status: 'accepted', createdAt: new Date(), updatedAt: new Date(), otherUser: req.fromUser } as ConnectionWithUser;
        setConnections(prev => [newConnection, ...prev]);
        setConnectionStatuses(prevStatus => ({ ...prevStatus, [req.fromUser.uid]: { id: req.id, status: 'accepted', fromUserId: req.fromUser.uid, toUserId: user!.uid, createdAt: new Date(), updatedAt: new Date() } as Connection }));
      }
      window.dispatchEvent(new CustomEvent('showToast', { detail: { message: `${selectedRequests.length} requests accepted`, type: 'success' } }));
      setSelectedRequests([]); setBulkMode(false);
    } catch (error) { console.error(error); window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Bulk accept failed', type: 'error' } })); }
  };
  
  const handleBulkReject = async () => {
    if (selectedRequests.length === 0) return;
    try {
      await bulkRejectConnectionRequests(selectedRequests);
      const rejectedIds = new Set(selectedRequests);
      setReceivedRequests(prev => prev.filter(r => !rejectedIds.has(r.id)));
      for (const req of receivedRequests.filter(r => rejectedIds.has(r.id))) {
        setConnectionStatuses(prev => { const newStatus = { ...prev }; delete newStatus[req.fromUser.uid]; return newStatus; });
      }
      window.dispatchEvent(new CustomEvent('showToast', { detail: { message: `${selectedRequests.length} requests declined`, type: 'info' } }));
      setSelectedRequests([]); setBulkMode(false);
    } catch (error) { console.error(error); window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Bulk reject failed', type: 'error' } })); }
  };
  
  if (loadingDiscover && activeTab === 'discover') {
    return <div className="min-h-screen bg-white py-12"><div className="max-w-7xl mx-auto px-4 flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div></div>;
  }
  
  const loadingSpinner = () => <div className="flex justify-center py-6"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div></div>;
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><Network className="w-8 h-8 text-orange-600" /><h1 className="text-3xl font-bold text-gray-900">Professional Network</h1></div>
            {user && (<div className="flex items-center gap-2"><Link href="/dashboard" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">Dashboard</Link><Link href="/referral/marketplace" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">Referral Jobs</Link></div>)}
          </div>
          <p className="text-gray-600">Connect with professionals, manage your network, and grow your career</p>
        </div>
        
        {/* Main Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 border-b border-gray-200">
            <button onClick={() => setActiveTab('discover')} className={`py-3 px-6 text-sm font-medium rounded-t-lg transition-all ${activeTab === 'discover' ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}><div className="flex items-center gap-2"><UserPlus className="w-4 h-4" /> Discover Professionals</div></button>
            <button onClick={() => setActiveTab('network')} className={`py-3 px-6 text-sm font-medium rounded-t-lg transition-all relative ${activeTab === 'network' ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}><div className="flex items-center gap-2"><Users className="w-4 h-4" /> My Network {networkStats.pendingReceived > 0 && <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">{networkStats.pendingReceived}</span>}</div></button>
          </div>
        </div>
        
        {/* Discover Tab (unchanged layout, but keep JSX as before) */}
        {activeTab === 'discover' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
              <div className="relative flex-1 max-w-2xl"><Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Search professionals..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />{searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}</div>
              <button onClick={handleRefreshDiscover} disabled={refreshingDiscover} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm"><RefreshCw className={`w-4 h-4 ${refreshingDiscover ? 'animate-spin' : ''}`} /> Refresh</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDiscoverUsers.map(userProfile => {
                const conn = connectionStatuses[userProfile.uid];
                const isConnected = conn?.status === 'accepted';
                const isPending = conn?.status === 'pending';
                const isIncoming = conn && conn.toUserId === user?.uid;
                const online = userOnlineStatuses[userProfile.uid]?.isOnline || false;
                const lastSeen = userOnlineStatuses[userProfile.uid]?.lastSeenText || 'Never online';
                return (
                  <div key={userProfile.uid} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all group hover:border-orange-300">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative">{userProfile.profileImage ? <img src={userProfile.profileImage} alt={userProfile.displayName || 'User'} className="w-14 h-14 rounded-lg object-cover border-2 border-white shadow-sm" /> : <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center"><span className="font-bold text-orange-600 text-xl">{userProfile.displayName?.[0]?.toUpperCase() || userProfile.email?.[0]?.toUpperCase() || 'U'}</span></div>}<div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${online ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} title={online ? 'Online now' : `Last seen ${lastSeen}`}></div></div>
                      <div className="flex-1 min-w-0"><h3 className="font-semibold text-gray-900 truncate">{userProfile.displayName || 'Anonymous'}</h3>{userProfile.headline && <p className="text-sm text-orange-600 truncate">{userProfile.headline}</p>}{userProfile.location && <p className="text-xs text-gray-500 flex items-center gap-1"><Globe className="w-3 h-3" /> {userProfile.location}</p>}{!online && lastSeen && <p className="text-xs text-gray-400 mt-1">{lastSeen}</p>}</div>
                    </div>
                    {userProfile.skills.length > 0 && <div className="mb-4 flex flex-wrap gap-1">{userProfile.skills.slice(0,3).map((s,i) => <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">{s}</span>)}</div>}
                    <div className="flex gap-2">
                      <button onClick={() => router.push(`/profile/${userProfile.uid}`)} className="flex-1 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 flex items-center justify-center gap-1"><Eye className="w-4 h-4" /> View</button>
                      {user && user.uid !== userProfile.uid && (
                        !isConnected && !isPending ? <button onClick={() => handleConnect(userProfile.uid, userProfile.displayName || 'User')} className="flex-1 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center justify-center gap-1"><UserPlus className="w-4 h-4" /> Connect</button>
                        : isPending && isIncoming ? <div className="flex gap-1 flex-1"><button onClick={() => handleAcceptRequest(conn!.id, userProfile.uid)} className="flex-1 py-2 bg-green-600 text-white rounded-lg"><Check className="w-4 h-4 inline mr-1" /> Accept</button><button onClick={() => handleRejectRequest(conn!.id, userProfile.uid)} className="flex-1 py-2 bg-red-600 text-white rounded-lg"><XCircle className="w-4 h-4 inline mr-1" /> Decline</button></div>
                        : isPending && !isIncoming ? <button onClick={() => handleCancelRequest(conn!.id, userProfile.uid)} className="flex-1 py-2 bg-gray-500 text-white rounded-lg"><Clock className="w-4 h-4 inline mr-1" /> Cancel</button>
                        : isConnected && <button onClick={() => handleMessage(userProfile.uid, userProfile.displayName || 'User')} className="flex-1 py-2 bg-blue-600 text-white rounded-lg"><MessageSquare className="w-4 h-4 inline mr-1" /> Message</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {hasMore && discoverUsers.length > 0 && (<div className="flex justify-center pt-6"><button onClick={loadMoreUsers} disabled={loadingMore} className="px-6 py-3 bg-white border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 flex items-center gap-2 disabled:opacity-50">{loadingMore ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</> : <><Users className="w-4 h-4" /> Load More</>}</button></div>)}
            {filteredDiscoverUsers.length === 0 && (<div className="text-center py-12"><div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Users className="w-10 h-10 text-gray-400" /></div><h3 className="text-lg font-semibold mb-2">No professionals found</h3><p className="text-gray-600 mb-6">{searchTerm ? 'Try different search terms' : 'Check back soon'}</p></div>)}
          </div>
        )}
        
        {/* My Network Tab - with pagination */}
        {activeTab === 'network' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Total Connections</p><p className="text-2xl font-bold text-gray-900">{uniqueConnections.length}</p></div><Users className="w-8 h-8 text-orange-500" /></div></div>
              <div className="bg-white border border-gray-200 rounded-xl p-4"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Pending Received</p><p className="text-2xl font-bold text-gray-900">{uniqueReceivedRequests.length}</p></div><UserPlus className="w-8 h-8 text-blue-500" /></div></div>
              <div className="bg-white border border-gray-200 rounded-xl p-4"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Pending Sent</p><p className="text-2xl font-bold text-gray-900">{uniqueSentRequests.length}</p></div><Send className="w-8 h-8 text-green-500" /></div></div>
              <div className="bg-white border border-gray-200 rounded-xl p-4"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Avg. Mutual</p><p className="text-2xl font-bold text-gray-900">{networkStats.mutualConnectionsAverage}</p></div><BarChart3 className="w-8 h-8 text-purple-500" /></div></div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button onClick={() => setActiveNetworkTab('connections')} className={`flex-1 py-3 text-sm font-medium ${activeNetworkTab === 'connections' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>Connections ({uniqueConnections.length})</button>
                <button onClick={() => setActiveNetworkTab('received')} className={`flex-1 py-3 text-sm font-medium ${activeNetworkTab === 'received' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>Received ({uniqueReceivedRequests.length})</button>
                <button onClick={() => setActiveNetworkTab('sent')} className={`flex-1 py-3 text-sm font-medium ${activeNetworkTab === 'sent' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>Sent ({uniqueSentRequests.length})</button>
              </div>
              
              {/* Connections Panel */}
              {activeNetworkTab === 'connections' && (
                <div className="p-6">
                  {(loadingConnections && connections.length === 0) ? loadingSpinner() : uniqueConnections.length === 0 ? (<div className="text-center py-12"><Users className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-semibold mb-2">No connections yet</h3><button onClick={() => setActiveTab('discover')} className="px-6 py-2 bg-orange-600 text-white rounded-lg">Discover Professionals</button></div>) : (<div className="space-y-4"><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold">Your Connections ({uniqueConnections.length})</h3><button onClick={handleRefreshNetwork} disabled={refreshingNetwork} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-1 text-sm"><RefreshCw className={`w-4 h-4 ${refreshingNetwork ? 'animate-spin' : ''}`} /> Refresh</button></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{uniqueConnections.map(conn => { const online = userOnlineStatuses[conn.otherUser.uid]?.isOnline || false; const lastSeen = userOnlineStatuses[conn.otherUser.uid]?.lastSeenText || 'Never online'; return (<div key={conn.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4"><div className="flex items-start gap-3 mb-3"><div className="relative">{conn.otherUser.profileImage ? <img src={conn.otherUser.profileImage} alt="avatar" className="w-12 h-12 rounded-lg object-cover" /> : <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center"><span className="font-bold text-orange-600">{conn.otherUser.displayName?.[0]?.toUpperCase() || 'U'}</span></div>}<div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${online ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} title={online ? 'Online' : lastSeen}></div></div><div><h4 className="font-semibold">{conn.otherUser.displayName || 'Anonymous'}</h4><p className="text-sm text-orange-600 truncate">{conn.otherUser.headline}</p><p className="text-xs text-gray-500">{conn.otherUser.location}</p></div></div><div className="flex gap-2"><button onClick={() => router.push(`/profile/${conn.otherUser.uid}`)} className="flex-1 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">View</button><button onClick={() => handleMessage(conn.otherUser.uid, conn.otherUser.displayName || 'User')} className="flex-1 py-2 bg-blue-600 text-white rounded-lg">Message</button></div><button onClick={() => handleRemoveConnection(conn.id, conn.otherUser.uid)} className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-red-600">Remove Connection</button></div>);})}</div>{hasMoreConnections && (<div className="flex justify-center pt-4"><button onClick={loadMoreConnections} disabled={loadingConnections} className="px-6 py-2 bg-white border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 flex items-center gap-2 disabled:opacity-50">{loadingConnections ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</> : <>Load More Connections</>}</button></div>)}</div>)}
                </div>
              )}
              
              {/* Received Panel */}
              {activeNetworkTab === 'received' && (
                <div className="p-6">
                  {(loadingReceived && receivedRequests.length === 0) ? loadingSpinner() : uniqueReceivedRequests.length === 0 ? (<div className="text-center py-12"><UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-semibold">No pending requests</h3></div>) : (<div className="space-y-4"><div className="flex justify-between"><h3 className="text-lg font-semibold">Connection Requests ({uniqueReceivedRequests.length})</h3><div className="flex gap-2">{!bulkMode ? <button onClick={() => setBulkMode(true)} className="px-4 py-2 bg-gray-100 rounded-lg">Bulk Actions</button> : <><button onClick={selectAllRequests} className="px-4 py-2 bg-gray-100 rounded-lg">Select All</button><button onClick={clearSelections} className="px-4 py-2 bg-gray-100 rounded-lg">Clear</button></>}</div></div>{bulkMode && selectedRequests.length > 0 && <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex justify-between"><span>{selectedRequests.length} selected</span><div className="flex gap-2"><button onClick={handleBulkAccept} className="px-4 py-2 bg-green-600 text-white rounded-lg">Accept All</button><button onClick={handleBulkReject} className="px-4 py-2 bg-red-600 text-white rounded-lg">Reject All</button></div></div>}<div className="space-y-3">{uniqueReceivedRequests.map(req => { const online = userOnlineStatuses[req.fromUser.uid]?.isOnline || false; const lastSeen = userOnlineStatuses[req.fromUser.uid]?.lastSeenText || 'Never online'; return (<div key={req.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4"><div className="flex items-center gap-3">{bulkMode && <input type="checkbox" checked={selectedRequests.includes(req.id)} onChange={() => toggleRequestSelection(req.id)} className="w-4 h-4 text-orange-600" />}<div className="relative">{req.fromUser.profileImage ? <img src={req.fromUser.profileImage} alt="avatar" className="w-12 h-12 rounded-lg" /> : <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center"><span className="font-bold text-orange-600">{req.fromUser.displayName?.[0]?.toUpperCase() || 'U'}</span></div>}<div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${online ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} title={online ? 'Online' : lastSeen}></div></div><div><h4 className="font-semibold">{req.fromUser.displayName || 'Anonymous'}</h4><p className="text-sm text-gray-600">{req.fromUser.headline}</p><p className="text-xs text-gray-500">{req.mutualConnections || 0} mutual connections</p></div></div>{!bulkMode && <div className="flex gap-2"><button onClick={() => router.push(`/profile/${req.fromUser.uid}`)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg">View</button><button onClick={() => handleAcceptRequest(req.id, req.fromUser.uid)} className="px-4 py-2 bg-green-600 text-white rounded-lg">Accept</button><button onClick={() => handleRejectRequest(req.id, req.fromUser.uid)} className="px-4 py-2 bg-red-600 text-white rounded-lg">Decline</button></div>}</div>);})}</div>{hasMoreReceived && (<div className="flex justify-center pt-4"><button onClick={loadMoreReceived} disabled={loadingReceived} className="px-6 py-2 bg-white border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 flex items-center gap-2 disabled:opacity-50">{loadingReceived ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</> : <>Load More Requests</>}</button></div>)}</div>)}
                </div>
              )}
              
              {/* Sent Panel */}
              {activeNetworkTab === 'sent' && (
                <div className="p-6">
                  {(loadingSent && sentRequests.length === 0) ? loadingSpinner() : uniqueSentRequests.length === 0 ? (<div className="text-center py-12"><Send className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-semibold">No sent requests</h3></div>) : (<div className="space-y-3">{uniqueSentRequests.map(req => { const online = userOnlineStatuses[req.toUser.uid]?.isOnline || false; const lastSeen = userOnlineStatuses[req.toUser.uid]?.lastSeenText || 'Never online'; return (<div key={req.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4"><div className="flex items-center gap-3"><div className="relative">{req.toUser.profileImage ? <img src={req.toUser.profileImage} alt="avatar" className="w-12 h-12 rounded-lg" /> : <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center"><span className="font-bold text-orange-600">{req.toUser.displayName?.[0]?.toUpperCase() || 'U'}</span></div>}<div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${online ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} title={online ? 'Online' : lastSeen}></div></div><div><h4 className="font-semibold">{req.toUser.displayName || 'Anonymous'}</h4><p className="text-sm text-gray-600">{req.toUser.headline}</p><p className="text-xs text-gray-500">Sent {req.createdAt?.toDate ? req.createdAt.toDate().toLocaleDateString() : 'recently'}</p></div></div><div className="flex gap-2"><button onClick={() => router.push(`/profile/${req.toUser.uid}`)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg">View</button><button onClick={() => handleCancelRequest(req.id, req.toUser.uid)} className="px-4 py-2 bg-gray-600 text-white rounded-lg">Cancel</button></div></div>);})}</div>)}
                  {hasMoreSent && (<div className="flex justify-center pt-4"><button onClick={loadMoreSent} disabled={loadingSent} className="px-6 py-2 bg-white border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 flex items-center gap-2 disabled:opacity-50">{loadingSent ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</> : <>Load More Sent</>}</button></div>)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NetworkPage() {
  return (
    <ClientErrorBoundary fallbackMessage="Network page failed to load">
      <NetworkContent />
    </ClientErrorBoundary>
  );
}