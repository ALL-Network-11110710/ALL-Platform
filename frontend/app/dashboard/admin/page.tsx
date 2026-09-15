// // app/dashboard/admin/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { useRouter } from 'next/navigation';
// import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
// import { rapidApiConfig } from '@/lib/config';

// export default function AdminDashboard() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [loadingAdminCheck, setLoadingAdminCheck] = useState(true);
//   const [apiJobs, setApiJobs] = useState<any[]>([]);
//   const [fetchingJobs, setFetchingJobs] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('developer');
//   const [searchLocation, setSearchLocation] = useState('India');
//   const [message, setMessage] = useState('');

//   // Check if user is admin

// useEffect(() => {
//   async function checkAdminStatus() {
//     if (user) {
//       try {
//         const usersRef = collection(db, 'users');
//         const q = query(usersRef, where('uid', '==', user.uid));
//         const querySnapshot = await getDocs(q);
        
//         let adminStatus = false;
        
//         if (!querySnapshot.empty) {
//           const userData = querySnapshot.docs[0].data();
//           adminStatus = userData.role === 'admin';
//         }
        
        
        
//         setIsAdmin(adminStatus);
//       } catch (error) {
//         console.error('Error checking admin status:', error);
//       } finally {
//         setLoadingAdminCheck(false);
//       }
//     } else {
//       setLoadingAdminCheck(false);
//     }
//   }

//   if (!loading) {
//     checkAdminStatus();
//   }
// }, [user, loading]);

//   // Redirect if not admin
//   useEffect(() => {
//     if (!loading && !loadingAdminCheck && !isAdmin) {
//       router.push('/dashboard');
//     }
//   }, [loading, loadingAdminCheck, isAdmin, router]);

//   const fetchJobsFromAPI = async (query: string, location: string) => {
//     try {
//       const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&page=1`;
      
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'X-RapidAPI-Key': rapidApiConfig.key,
//           'X-RapidAPI-Host': rapidApiConfig.host,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`API responded with status ${response.status}`);
//       }

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
//       setMessage(`Found ${jobs.length} jobs from API`);
//     } catch (error: any) {
//       console.error('Error fetching jobs:', error);
//       setMessage(`Error: ${error.message || 'Failed to fetch jobs'}`);
//     } finally {
//       setFetchingJobs(false);
//     }
//   };

//   const mapJSearchJobToOurFormat = (job: any) => {
//   return {
//     title: job.job_title,
//     company: job.employer_name,
//     location: `${job.job_city}, ${job.job_country}`,
//     type: job.job_employment_type || 'Full-time',
//     salary: job.job_min_salary && job.job_max_salary 
//       ? `${job.job_min_salary} - ${job.job_max_salary}` 
//       : 'Not specified',
//     description: job.job_description,
//     // Ensure requirements is always a string
//     requirements: 'Not specified', // JSearch doesn't provide separate requirements
//     applicationLink: job.job_apply_link,
//     postedAt: new Date(),
//     posterId: 'api-source',
//     source: 'jsearch',
//     externalId: job.job_id,
//     companyLogo: job.employer_logo,
//   };
// };

//   const saveJobToFirestore = async (jobData: any) => {
//     try {
//       const jobsRef = collection(db, 'jobs');
//       await addDoc(jobsRef, jobData);
      
//       // Also save to apiJobs collection for tracking
//       const apiJobsRef = collection(db, 'apiJobs');
//       await addDoc(apiJobsRef, {
//         ...jobData,
//         fetchedAt: new Date(),
//       });
      
//       return true;
//     } catch (error) {
//       console.error('Error saving job:', error);
//       return false;
//     }
//   };

//   const importJob = async (job: any) => {
//     try {
//       const ourJobFormat = mapJSearchJobToOurFormat(job);
//       const success = await saveJobToFirestore(ourJobFormat);
      
//       if (success) {
//         setMessage('Job imported successfully!');
//         setApiJobs(apiJobs.filter(j => j.job_id !== job.job_id));
//       } else {
//         setMessage('Failed to import job');
//       }
//     } catch (error) {
//       console.error('Error importing job:', error);
//       setMessage('Error importing job');
//     }
//   };

//   const importAllJobs = async () => {
//     if (apiJobs.length === 0) {
//       setMessage('No jobs to import');
//       return;
//     }

//     try {
//       let importedCount = 0;
      
//       for (const job of apiJobs) {
//         const ourJobFormat = mapJSearchJobToOurFormat(job);
//         const success = await saveJobToFirestore(ourJobFormat);
//         if (success) importedCount++;
        
//         // Add a small delay to avoid overwhelming Firebase
//         await new Promise(resolve => setTimeout(resolve, 100));
//       }
      
//       setMessage(`Imported ${importedCount} of ${apiJobs.length} jobs successfully!`);
//       setApiJobs([]);
//     } catch (error) {
//       console.error('Error importing all jobs:', error);
//       setMessage('Error importing jobs');
//     }
//   };

//   if (loading || loadingAdminCheck) {
//     return (
//       <div className="p-8">
//         <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   if (!isAdmin) {
//     return (
//       <div className="p-8">
//         <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
//         <p>You do not have permission to access this page.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
//       <div className="mb-8 p-4 bg-gray-100 rounded-lg">
//         <h2 className="text-xl font-semibold mb-4">Fetch Jobs from JSearch API</h2>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <div>
//             <label className="block mb-2 font-medium">Job Title/Keywords</label>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="e.g., developer, marketing, etc."
//               className="w-full p-2 border rounded"
//             />
//           </div>
          
//           <div>
//             <label className="block mb-2 font-medium">Location</label>
//             <input
//               type="text"
//               value={searchLocation}
//               onChange={(e) => setSearchLocation(e.target.value)}
//               placeholder="e.g., India, Bangalore, etc."
//               className="w-full p-2 border rounded"
//             />
//           </div>
//         </div>
        
//         <button
//           onClick={fetchJobs}
//           disabled={fetchingJobs}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
//         >
//           {fetchingJobs ? 'Fetching Jobs...' : 'Fetch Jobs from API'}
//         </button>
        
//         {message && (
//           <div className={`mt-4 p-3 rounded ${
//             message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
//           }`}>
//             {message}
//           </div>
//         )}
//       </div>
      
//       {apiJobs.length > 0 && (
//         <div className="mb-8">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">API Jobs ({apiJobs.length} found)</h2>
//             <button
//               onClick={importAllJobs}
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//             >
//               Import All Jobs
//             </button>
//           </div>
          
//           <div className="grid grid-cols-1 gap-4">
//             {apiJobs.slice(0, 10).map((job) => (
//               <div key={job.job_id} className="p-4 border rounded-lg bg-white">
//                 <h3 className="text-lg font-semibold">{job.job_title}</h3>
//                 <p className="text-gray-600">{job.employer_name} - {job.job_city}, {job.job_country}</p>
//                 <p className="text-gray-600">{job.job_employment_type}</p>
//                 <p className="mt-2 text-sm">{job.job_description.substring(0, 150)}...</p>
                
//                 <button
//                   onClick={() => importJob(job)}
//                   className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
//                 >
//                   Import Job
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
      
//       <div className="p-4 bg-yellow-100 rounded-lg">
//         <h2 className="text-xl font-semibold mb-2">Admin Tools</h2>
//         <p className="text-gray-700">More admin tools will be added here soon.</p>
//       </div>
//     </div>
//   );
// }

// app/dashboard/admin/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { useRouter } from 'next/navigation';
// import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
// import { rapidApiConfig } from '@/lib/config';
// import { isAdmin } from '@/lib/admin';

// export default function AdminDashboard() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [isUserAdmin, setIsUserAdmin] = useState(false);
//   const [loadingAdminCheck, setLoadingAdminCheck] = useState(true);
//   const [apiJobs, setApiJobs] = useState<any[]>([]);
//   const [importedJobs, setImportedJobs] = useState<any[]>([]);
//   const [users, setUsers] = useState<any[]>([]);
//   const [fetchingJobs, setFetchingJobs] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('developer');
//   const [searchLocation, setSearchLocation] = useState('India');
//   const [message, setMessage] = useState('');

//   // Check if user is admin
//   useEffect(() => {
//     async function checkAdminStatus() {
//       if (user) {
//         try {
//           const adminStatus = await isAdmin(user);
//           setIsUserAdmin(adminStatus);
//         } catch (error) {
//           console.error('Error checking admin status:', error);
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

//   // Fetch imported jobs and users if admin
//   useEffect(() => {
//     if (isUserAdmin) {
//       const fetchImportedJobs = async () => {
//         try {
//           const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//           const apiJobsSnapshot = await getDocs(apiJobsQuery);
//           setImportedJobs(apiJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//         } catch (error) {
//           console.error('Error fetching imported jobs:', error);
//         }
//       };

//       const fetchUsers = async () => {
//         try {
//           const usersQuery = query(collection(db, 'users'), orderBy('displayName'));
//           const usersSnapshot = await getDocs(usersQuery);
//           setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//         } catch (error) {
//           console.error('Error fetching users:', error);
//         }
//       };

//       fetchImportedJobs();
//       fetchUsers();
//     }
//   }, [isUserAdmin]);

//   const fetchJobsFromAPI = async (query: string, location: string) => {
//     try {
//       const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&page=1`;
      
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'X-RapidAPI-Key': rapidApiConfig.key,
//           'X-RapidAPI-Host': rapidApiConfig.host,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`API responded with status ${response.status}`);
//       }

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
//       setMessage(`Found ${jobs.length} jobs from API`);
//     } catch (error: any) {
//       console.error('Error fetching jobs:', error);
//       setMessage(`Error: ${error.message || 'Failed to fetch jobs'}`);
//     } finally {
//       setFetchingJobs(false);
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
//       applicationLink: job.job_apply_link,
//       postedAt: new Date(),
//       postedBy: 'api-source',
//       source: 'jsearch',
//       externalId: job.job_id,
//       companyLogo: job.employer_logo,
//       isExternal: true,
//       jobLink: job.job_apply_link
//     };
//   };

//   const saveJobToFirestore = async (jobData: any) => {
//     try {
//       const jobsRef = collection(db, 'jobs');
//       await addDoc(jobsRef, jobData);
      
//       // Also save to apiJobs collection for tracking
//       const apiJobsRef = collection(db, 'apiJobs');
//       await addDoc(apiJobsRef, {
//         ...jobData,
//         fetchedAt: new Date(),
//       });
      
//       return true;
//     } catch (error) {
//       console.error('Error saving job:', error);
//       return false;
//     }
//   };

//   const importJob = async (job: any) => {
//     try {
//       const ourJobFormat = mapJSearchJobToOurFormat(job);
//       const success = await saveJobToFirestore(ourJobFormat);
      
//       if (success) {
//         setMessage('Job imported successfully!');
//         setApiJobs(apiJobs.filter(j => j.job_id !== job.job_id));
        
//         // Refresh imported jobs list
//         const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//         const apiJobsSnapshot = await getDocs(apiJobsQuery);
//         setImportedJobs(apiJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//       } else {
//         setMessage('Failed to import job');
//       }
//     } catch (error) {
//       console.error('Error importing job:', error);
//       setMessage('Error importing job');
//     }
//   };

//   const importAllJobs = async () => {
//     if (apiJobs.length === 0) {
//       setMessage('No jobs to import');
//       return;
//     }

//     try {
//       let importedCount = 0;
      
//       for (const job of apiJobs) {
//         const ourJobFormat = mapJSearchJobToOurFormat(job);
//         const success = await saveJobToFirestore(ourJobFormat);
//         if (success) importedCount++;
        
//         // Add a small delay to avoid overwhelming Firebase
//         await new Promise(resolve => setTimeout(resolve, 100));
//       }
      
//       setMessage(`Imported ${importedCount} of ${apiJobs.length} jobs successfully!`);
//       setApiJobs([]);
      
//       // Refresh imported jobs list
//       const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//       const apiJobsSnapshot = await getDocs(apiJobsQuery);
//       setImportedJobs(apiJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     } catch (error) {
//       console.error('Error importing all jobs:', error);
//       setMessage('Error importing jobs');
//     }
//   };

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
//     <div className="min-h-screen bg-white p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-black mb-6">Admin Dashboard</h1>
        
//         {/* API Jobs Fetching Section */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 mb-6">
//           <h2 className="text-xl font-semibold text-black mb-4">Fetch Jobs from JSearch API</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block mb-2 font-medium text-black">Job Title/Keywords</label>
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="e.g., developer, marketing, etc."
//                 className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
//               />
//             </div>
            
//             <div>
//               <label className="block mb-2 font-medium text-black">Location</label>
//               <input
//                 type="text"
//                 value={searchLocation}
//                 onChange={(e) => setSearchLocation(e.target.value)}
//                 placeholder="e.g., India, Bangalore, etc."
//                 className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
//               />
//             </div>
//           </div>
          
//           <button
//             onClick={fetchJobs}
//             disabled={fetchingJobs}
//             className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-colors"
//           >
//             {fetchingJobs ? 'Fetching Jobs...' : 'Fetch Jobs from API'}
//           </button>
          
//           {message && (
//             <div className={`mt-4 p-3 rounded-lg ${
//               message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-black'
//             }`}>
//               {message}
//             </div>
//           )}
//         </div>
        
//         {/* API Jobs Results */}
//         {apiJobs.length > 0 && (
//           <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-black">API Jobs ({apiJobs.length} found)</h2>
//               <button
//                 onClick={importAllJobs}
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
//               >
//                 Import All Jobs
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 gap-4">
//               {apiJobs.slice(0, 10).map((job) => (
//                 <div key={job.job_id} className="p-4 border border-orange-200 rounded-lg bg-orange-50">
//                   <h3 className="text-lg font-semibold text-black">{job.job_title}</h3>
//                   <p className="text-black">{job.employer_name} - {job.job_city}, {job.job_country}</p>
//                   <p className="text-black">{job.job_employment_type}</p>
//                   <p className="mt-2 text-sm text-black">{job.job_description.substring(0, 150)}...</p>
                  
//                   <button
//                     onClick={() => importJob(job)}
//                     className="mt-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600 transition-colors"
//                   >
//                     Import Job
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
        
//         {/* Imported Jobs */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 mb-6">
//           <h2 className="text-xl font-semibold text-black mb-4">Imported Jobs ({importedJobs.length})</h2>
          
//           <div className="overflow-y-auto max-h-96">
//             {importedJobs.map(job => (
//               <div key={job.id} className="p-4 border border-orange-200 rounded-lg mb-3 bg-orange-50">
//                 <h3 className="text-lg font-semibold text-black">{job.title}</h3>
//                 <p className="text-black">{job.company} - {job.location}</p>
//                 <p className="text-black text-sm">Imported on: {job.fetchedAt?.toDate?.().toLocaleDateString() || 'Unknown date'}</p>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         {/* Users List */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//           <h2 className="text-xl font-semibold text-black mb-4">Users ({users.length})</h2>
          
//           <div className="overflow-y-auto max-h-96">
//             {users.map(user => (
//               <div key={user.id} className="p-4 border border-orange-200 rounded-lg mb-3 bg-orange-50">
//                 <h3 className="text-lg font-semibold text-black">{user.displayName || 'Anonymous User'}</h3>
//                 <p className="text-black">{user.email}</p>
//                 <p className="text-black text-sm">Role: {user.role || 'user'}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { useRouter } from 'next/navigation';
// import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
// import { rapidApiConfig } from '@/lib/config';
// import { isAdmin } from '@/lib/admin';

// export default function AdminDashboard() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [isUserAdmin, setIsUserAdmin] = useState(false);
//   const [loadingAdminCheck, setLoadingAdminCheck] = useState(true);
//   const [apiJobs, setApiJobs] = useState<any[]>([]);
//   const [importedJobs, setImportedJobs] = useState<any[]>([]);
//   const [users, setUsers] = useState<any[]>([]);
//   const [fetchingJobs, setFetchingJobs] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('developer');
//   const [searchLocation, setSearchLocation] = useState('India');
//   const [message, setMessage] = useState('');

//   // Check if user is admin
//   useEffect(() => {
//     async function checkAdminStatus() {
//       if (user) {
//         try {
//           const adminStatus = await isAdmin(user);
//           setIsUserAdmin(adminStatus);
//         } catch (error) {
//           console.error('Error checking admin status:', error);
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

//   // Fetch imported jobs and users if admin
//   useEffect(() => {
//     if (isUserAdmin) {
//       const fetchImportedJobs = async () => {
//         try {
//           const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//           const apiJobsSnapshot = await getDocs(apiJobsQuery);
//           setImportedJobs(apiJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//         } catch (error) {
//           console.error('Error fetching imported jobs:', error);
//         }
//       };

//       const fetchUsers = async () => {
//         try {
//           const usersQuery = query(collection(db, 'users'), orderBy('displayName'));
//           const usersSnapshot = await getDocs(usersQuery);
//           setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//         } catch (error) {
//           console.error('Error fetching users:', error);
//         }
//       };

//       fetchImportedJobs();
//       fetchUsers();
//     }
//   }, [isUserAdmin]);

//   const fetchJobsFromAPI = async (query: string, location: string) => {
//     try {
//       const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&page=1`;
      
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'X-RapidAPI-Key': rapidApiConfig.key,
//           'X-RapidAPI-Host': rapidApiConfig.host,
//         },
//       });

//       // Check for rate limiting (429 status code)
//       if (response.status === 429) {
//         throw new Error('Rate limit exceeded. Please wait and try again later.');
//       }

//       if (!response.ok) {
//         throw new Error(`API responded with status ${response.status}`);
//       }

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
//       setMessage(`Found ${jobs.length} jobs from API`);
//     } catch (error: any) {
//       console.error('Error fetching jobs:', error);
//       setMessage(`Error: ${error.message || 'Failed to fetch jobs. Please check your API limits and connection.'}`);
//     } finally {
//       setFetchingJobs(false);
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
//       applicationLink: job.job_apply_link,
//       postedAt: new Date(),
//       postedBy: 'api-source',
//       source: 'jsearch',
//       externalId: job.job_id,
//       companyLogo: job.employer_logo,
//       isExternal: true,
//       jobLink: job.job_apply_link
//     };
//   };

//   const saveJobToFirestore = async (jobData: any) => {
//     try {
//       const jobsRef = collection(db, 'jobs');
//       await addDoc(jobsRef, jobData);
      
//       // Also save to apiJobs collection for tracking
//       const apiJobsRef = collection(db, 'apiJobs');
//       await addDoc(apiJobsRef, {
//         ...jobData,
//         fetchedAt: new Date(),
//       });
      
//       return true;
//     } catch (error) {
//       console.error('Error saving job:', error);
//       return false;
//     }
//   };

//   const importJob = async (job: any) => {
//     try {
//       const ourJobFormat = mapJSearchJobToOurFormat(job);
//       const success = await saveJobToFirestore(ourJobFormat);
      
//       if (success) {
//         setMessage('Job imported successfully!');
//         setApiJobs(apiJobs.filter(j => j.job_id !== job.job_id));
        
//         // Refresh imported jobs list
//         const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//         const apiJobsSnapshot = await getDocs(apiJobsQuery);
//         setImportedJobs(apiJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//       } else {
//         setMessage('Failed to import job');
//       }
//     } catch (error) {
//       console.error('Error importing job:', error);
//       setMessage('Error importing job');
//     }
//   };

//   const importAllJobs = async () => {
//     if (apiJobs.length === 0) {
//       setMessage('No jobs to import');
//       return;
//     }

//     try {
//       let importedCount = 0;
      
//       for (const job of apiJobs) {
//         const ourJobFormat = mapJSearchJobToOurFormat(job);
//         const success = await saveJobToFirestore(ourJobFormat);
//         if (success) importedCount++;
        
//         // Add a small delay to avoid overwhelming Firebase and API limits
//         await new Promise(resolve => setTimeout(resolve, 100));
//       }
      
//       setMessage(`Imported ${importedCount} of ${apiJobs.length} jobs successfully!`);
//       setApiJobs([]);
      
//       // Refresh imported jobs list
//       const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//       const apiJobsSnapshot = await getDocs(apiJobsQuery);
//       setImportedJobs(apiJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     } catch (error) {
//       console.error('Error importing all jobs:', error);
//       setMessage('Error importing jobs');
//     }
//   };

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
//     <div className="min-h-screen bg-white p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-black mb-6">Admin Dashboard</h1>
        
//         {/* API Jobs Fetching Section */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 mb-6">
//           <h2 className="text-xl font-semibold text-black mb-4">Fetch Jobs from JSearch API</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block mb-2 font-medium text-black">Job Title/Keywords</label>
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="e.g., developer, marketing, etc."
//                 className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
//               />
//             </div>
            
//             <div>
//               <label className="block mb-2 font-medium text-black">Location</label>
//               <input
//                 type="text"
//                 value={searchLocation}
//                 onChange={(e) => setSearchLocation(e.target.value)}
//                 placeholder="e.g., India, Bangalore, etc."
//                 className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
//               />
//             </div>
//           </div>
          
//           <button
//             onClick={fetchJobs}
//             disabled={fetchingJobs}
//             className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-colors"
//           >
//             {fetchingJobs ? 'Fetching Jobs...' : 'Fetch Jobs from API'}
//           </button>
          
//           {message && (
//             <div className={`mt-4 p-3 rounded-lg ${
//               message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-black'
//             }`}>
//               {message}
//             </div>
//           )}
//         </div>
        
//         {/* API Jobs Results */}
//         {apiJobs.length > 0 && (
//           <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-black">API Jobs ({apiJobs.length} found)</h2>
//               <button
//                 onClick={importAllJobs}
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
//               >
//                 Import All Jobs
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 gap-4">
//               {apiJobs.slice(0, 10).map((job) => (
//                 <div key={job.job_id} className="p-4 border border-orange-200 rounded-lg bg-orange-50">
//                   <h3 className="text-lg font-semibold text-black">{job.job_title}</h3>
//                   <p className="text-black">{job.employer_name} - {job.job_city}, {job.job_country}</p>
//                   <p className="text-black">{job.job_employment_type}</p>
//                   <p className="mt-2 text-sm text-black">{job.job_description.substring(0, 150)}...</p>
                  
//                   <button
//                     onClick={() => importJob(job)}
//                     className="mt-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600 transition-colors"
//                   >
//                     Import Job
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
        
//         {/* Imported Jobs */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 mb-6">
//           <h2 className="text-xl font-semibold text-black mb-4">Imported Jobs ({importedJobs.length})</h2>
          
//           <div className="overflow-y-auto max-h-96">
//             {importedJobs.map(job => (
//               <div key={job.id} className="p-4 border border-orange-200 rounded-lg mb-3 bg-orange-50">
//                 <h3 className="text-lg font-semibold text-black">{job.title}</h3>
//                 <p className="text-black">{job.company} - {job.location}</p>
//                 <p className="text-black text-sm">Imported on: {job.fetchedAt?.toDate?.().toLocaleDateString() || 'Unknown date'}</p>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         {/* Users List */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//           <h2 className="text-xl font-semibold text-black mb-4">Users ({users.length})</h2>
          
//           <div className="overflow-y-auto max-h-96">
//             {users.map(user => (
//               <div key={user.id} className="p-4 border border-orange-200 rounded-lg mb-3 bg-orange-50">
//                 <h3 className="text-lg font-semibold text-black">{user.displayName || 'Anonymous User'}</h3>
//                 <p className="text-black">{user.email}</p>
//                 <p className="text-black text-sm">Role: {user.role || 'user'}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { useRouter } from 'next/navigation';
// import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
// import { rapidApiConfig } from '@/lib/config';
// import { isAdmin } from '@/lib/admin';
// import ErrorBoundary from '@/components/ErrorBoundary';
// import ErrorFallback from '@/components/ErrorFallback';

// // Admin Dashboard Content Component
// function AdminDashboardContent() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [isUserAdmin, setIsUserAdmin] = useState(false);
//   const [loadingAdminCheck, setLoadingAdminCheck] = useState(true);
//   const [apiJobs, setApiJobs] = useState<any[]>([]);
//   const [importedJobs, setImportedJobs] = useState<any[]>([]);
//   const [users, setUsers] = useState<any[]>([]);
//   const [fetchingJobs, setFetchingJobs] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('developer');
//   const [searchLocation, setSearchLocation] = useState('India');
//   const [message, setMessage] = useState('');

//   // Check if user is admin
//   useEffect(() => {
//     async function checkAdminStatus() {
//       if (user) {
//         try {
//           const adminStatus = await isAdmin(user);
//           setIsUserAdmin(adminStatus);
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

//   // Fetch imported jobs and users if admin
//   useEffect(() => {
//     if (isUserAdmin) {
//       const fetchImportedJobs = async () => {
//         try {
//           const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//           const apiJobsSnapshot = await getDocs(apiJobsQuery);
//           setImportedJobs(apiJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//         } catch (error) {
//           console.error('Error fetching imported jobs:', error);
//           throw new Error('Failed to load imported jobs');
//         }
//       };

//       const fetchUsers = async () => {
//         try {
//           const usersQuery = query(collection(db, 'users'), orderBy('displayName'));
//           const usersSnapshot = await getDocs(usersQuery);
//           setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//         } catch (error) {
//           console.error('Error fetching users:', error);
//           throw new Error('Failed to load users');
//         }
//       };

//       fetchImportedJobs();
//       fetchUsers();
//     }
//   }, [isUserAdmin]);

//   const fetchJobsFromAPI = async (query: string, location: string) => {
//     try {
//       // For Indian locations, we'll prioritize them more strongly in the query
//       let apiQuery = query;
//       if (location.toLowerCase() !== 'usa' && location.toLowerCase() !== 'united states') {
//         // Add location to the query itself to increase relevance for non-US locations
//         apiQuery = `${query} ${location}`;
//       }
      
//       const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(apiQuery)}&location=${encodeURIComponent(location)}&page=1`;
      
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'X-RapidAPI-Key': rapidApiConfig.key,
//           'X-RapidAPI-Host': rapidApiConfig.host,
//         },
//       });

//       // Check for rate limiting (429 status code)
//       if (response.status === 429) {
//         throw new Error('Rate limit exceeded. Please wait and try again later.');
//       }

//       if (!response.ok) {
//         throw new Error(`API responded with status ${response.status}`);
//       }

//       const data = await response.json();
      
//       // Filter results to prioritize the requested location
//       let jobs = data.data || [];
      
//       // If we specifically searched for an Indian location, try to filter out non-Indian jobs
//       if (location.toLowerCase().includes('india') || 
//           location.toLowerCase().includes('bangalore') ||
//           location.toLowerCase().includes('bengaluru') ||
//           location.toLowerCase().includes('delhi') ||
//           location.toLowerCase().includes('mumbai') ||
//           location.toLowerCase().includes('hyderabad') ||
//           location.toLowerCase().includes('chennai') ||
//           location.toLowerCase().includes('pune')) {
        
//         // First, try to find jobs that actually match our location
//         const locationSpecificJobs = jobs.filter((job: any) => 
//           job.job_country && job.job_country.toLowerCase().includes('india') ||
//           job.job_city && (
//             job.job_city.toLowerCase().includes(location.toLowerCase()) ||
//             location.toLowerCase().includes(job.job_city.toLowerCase())
//           )
//         );
        
//         // If we found location-specific jobs, use them
//         if (locationSpecificJobs.length > 0) {
//           jobs = locationSpecificJobs;
//         }
//         // If no location-specific jobs found, show a message
//         else if (jobs.length > 0) {
//           throw new Error(`Found ${jobs.length} jobs, but none specifically in ${location}. Showing available jobs.`);
//         }
//       }
      
//       return jobs;
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
//       setMessage(`Found ${jobs.length} jobs from API`);
//     } catch (error: any) {
//       console.error('Error fetching jobs:', error);
//       setMessage(`Error: ${error.message || 'Failed to fetch jobs. Please check your API limits and connection.'}`);
//     } finally {
//       setFetchingJobs(false);
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
//       applicationLink: job.job_apply_link,
//       postedAt: new Date(),
//       postedBy: 'api-source',
//       source: 'jsearch',
//       externalId: job.job_id,
//       companyLogo: job.employer_logo,
//       isExternal: true,
//       jobLink: job.job_apply_link
//     };
//   };

//   const saveJobToFirestore = async (jobData: any) => {
//     try {
//       const jobsRef = collection(db, 'jobs');
//       await addDoc(jobsRef, jobData);
      
//       // Also save to apiJobs collection for tracking
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

//   const importJob = async (job: any) => {
//     try {
//       const ourJobFormat = mapJSearchJobToOurFormat(job);
//       const success = await saveJobToFirestore(ourJobFormat);
      
//       if (success) {
//         setMessage('Job imported successfully!');
//         setApiJobs(apiJobs.filter(j => j.job_id !== job.job_id));
        
//         // Refresh imported jobs list
//         const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//         const apiJobsSnapshot = await getDocs(apiJobsQuery);
//         setImportedJobs(apiJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//       } else {
//         setMessage('Failed to import job');
//       }
//     } catch (error) {
//       console.error('Error importing job:', error);
//       setMessage('Error importing job');
//     }
//   };

//   const importAllJobs = async () => {
//     if (apiJobs.length === 0) {
//       setMessage('No jobs to import');
//       return;
//     }

//     try {
//       let importedCount = 0;
      
//       for (const job of apiJobs) {
//         const ourJobFormat = mapJSearchJobToOurFormat(job);
//         const success = await saveJobToFirestore(ourJobFormat);
//         if (success) importedCount++;
        
//         // Add a small delay to avoid overwhelming Firebase and API limits
//         await new Promise(resolve => setTimeout(resolve, 100));
//       }
      
//       setMessage(`Imported ${importedCount} of ${apiJobs.length} jobs successfully!`);
//       setApiJobs([]);
      
//       // Refresh imported jobs list
//       const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//       const apiJobsSnapshot = await getDocs(apiJobsQuery);
//       setImportedJobs(apiJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     } catch (error) {
//       console.error('Error importing all jobs:', error);
//       setMessage('Error importing jobs');
//     }
//   };

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
//     <div className="min-h-screen bg-white p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-black mb-6">Admin Dashboard</h1>
        
//         {/* API Jobs Fetching Section */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 mb-6">
//           <h2 className="text-xl font-semibold text-black mb-4">Fetch Jobs from JSearch API</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block mb-2 font-medium text-black">Job Title/Keywords</label>
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="e.g., developer, marketing, etc."
//                 className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
//               />
//             </div>
            
//             <div>
//               <label className="block mb-2 font-medium text-black">Location</label>
//               <input
//                 type="text"
//                 value={searchLocation}
//                 onChange={(e) => setSearchLocation(e.target.value)}
//                 placeholder="e.g., India, Bangalore, etc."
//                 className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
//               />
//             </div>
//           </div>
          
//           <button
//             onClick={fetchJobs}
//             disabled={fetchingJobs}
//             className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-colors"
//           >
//             {fetchingJobs ? 'Fetching Jobs...' : 'Fetch Jobs from API'}
//           </button>
          
//           {message && (
//             <div className={`mt-4 p-3 rounded-lg ${
//               message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-black'
//             }`}>
//               {message}
//             </div>
//           )}
//         </div>
        
//         {/* API Jobs Results */}
//         {apiJobs.length > 0 && (
//           <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-black">API Jobs ({apiJobs.length} found)</h2>
//               <button
//                 onClick={importAllJobs}
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
//               >
//                 Import All Jobs
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 gap-4">
//               {apiJobs.slice(0, 10).map((job) => (
//                 <div key={job.job_id} className="p-4 border border-orange-200 rounded-lg bg-orange-50">
//                   <h3 className="text-lg font-semibold text-black">{job.job_title}</h3>
//                   <p className="text-black">{job.employer_name} - {job.job_city}, {job.job_country}</p>
//                   <p className="text-black">{job.job_employment_type}</p>
//                   <p className="mt-2 text-sm text-black">{job.job_description.substring(0, 150)}...</p>
                  
//                   <button
//                     onClick={() => importJob(job)}
//                     className="mt-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600 transition-colors"
//                   >
//                     Import Job
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
        
//         {/* Imported Jobs */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 mb-6">
//           <h2 className="text-xl font-semibold text-black mb-4">Imported Jobs ({importedJobs.length})</h2>
          
//           <div className="overflow-y-auto max-h-96">
//             {importedJobs.map(job => (
//               <div key={job.id} className="p-4 border border-orange-200 rounded-lg mb-3 bg-orange-50">
//                 <h3 className="text-lg font-semibold text-black">{job.title}</h3>
//                 <p className="text-black">{job.company} - {job.location}</p>
//                 <p className="text-black text-sm">Imported on: {job.fetchedAt?.toDate?.().toLocaleDateString() || 'Unknown date'}</p>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         {/* Users List */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//           <h2 className="text-xl font-semibold text-black mb-4">Users ({users.length})</h2>
          
//           <div className="overflow-y-auto max-h-96">
//             {users.map(user => (
//               <div key={user.id} className="p-4 border border-orange-200 rounded-lg mb-3 bg-orange-50">
//                 <h3 className="text-lg font-semibold text-black">{user.displayName || 'Anonymous User'}</h3>
//                 <p className="text-black">{user.email}</p>
//                 <p className="text-black text-sm">Role: {user.role || 'user'}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
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

// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { useRouter } from 'next/navigation';
// import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
// import { rapidApiConfig } from '@/lib/config';
// import { isAdmin } from '@/lib/admin';
// import ErrorBoundary from '@/components/ErrorBoundary';
// import ErrorFallback from '@/components/ErrorFallback';

// // Admin Dashboard Content Component
// function AdminDashboardContent() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [isUserAdmin, setIsUserAdmin] = useState(false);
//   const [loadingAdminCheck, setLoadingAdminCheck] = useState(true);
//   const [apiJobs, setApiJobs] = useState<any[]>([]);
//   const [importedJobs, setImportedJobs] = useState<any[]>([]);
//   const [users, setUsers] = useState<any[]>([]);
//   const [fetchingJobs, setFetchingJobs] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('developer');
//   const [searchLocation, setSearchLocation] = useState('India');
//   const [message, setMessage] = useState('');

//   // Debug environment variables
//   useEffect(() => {
//     console.log('Environment Check:');
//     console.log('RapidAPI Key Available:', !!process.env.NEXT_PUBLIC_RAPIDAPI_KEY);
//     console.log('RapidAPI Host Available:', !!process.env.NEXT_PUBLIC_RAPIDAPI_HOST);
//     console.log('Config Key:', rapidApiConfig.key ? 'LOADED' : 'MISSING');
//     console.log('Config Host:', rapidApiConfig.host ? 'LOADED' : 'MISSING');
//   }, []);

//   // Check if user is admin
//   useEffect(() => {
//     async function checkAdminStatus() {
//       if (user) {
//         try {
//           const adminStatus = await isAdmin(user);
//           setIsUserAdmin(adminStatus);
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

//   // Fetch imported jobs and users if admin
//   useEffect(() => {
//     if (isUserAdmin) {
//       const fetchImportedJobs = async () => {
//         try {
//           const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//           const apiJobsSnapshot = await getDocs(apiJobsQuery);
//           setImportedJobs(apiJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//         } catch (error) {
//           console.error('Error fetching imported jobs:', error);
//           throw new Error('Failed to load imported jobs');
//         }
//       };

//       const fetchUsers = async () => {
//         try {
//           const usersQuery = query(collection(db, 'users'), orderBy('displayName'));
//           const usersSnapshot = await getDocs(usersQuery);
//           setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//         } catch (error) {
//           console.error('Error fetching users:', error);
//           throw new Error('Failed to load users');
//         }
//       };

//       fetchImportedJobs();
//       fetchUsers();
//     }
//   }, [isUserAdmin]);

//   const fetchJobsFromAPI = async (query: string, location: string) => {
//     try {
//       // Use environment variables directly as fallback
//       const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || rapidApiConfig.key;
//       const apiHost = process.env.NEXT_PUBLIC_RAPIDAPI_HOST || rapidApiConfig.host;

//       console.log('API Key being used:', apiKey ? 'PRESENT' : 'MISSING');
//       console.log('API Host being used:', apiHost);

//       if (!apiKey) {
//         throw new Error('RapidAPI key is missing. Please check your environment variables.');
//       }

//       if (!apiHost) {
//         throw new Error('RapidAPI host is missing. Please check your environment variables.');
//       }

//       // For Indian locations, we'll prioritize them more strongly in the query
//       let apiQuery = query;
//       if (location.toLowerCase() !== 'usa' && location.toLowerCase() !== 'united states') {
//         // Add location to the query itself to increase relevance for non-US locations
//         apiQuery = `${query} ${location}`;
//       }
      
//       const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(apiQuery)}&location=${encodeURIComponent(location)}&page=1`;
      
//       console.log('Making API request to:', url);

//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'X-RapidAPI-Key': apiKey,
//           'X-RapidAPI-Host': apiHost,
//         },
//       });

//       console.log('API Response Status:', response.status);

//       // Check for rate limiting (429 status code)
//       if (response.status === 429) {
//         throw new Error('Rate limit exceeded. Please wait and try again later.');
//       }

//       if (response.status === 403) {
//         throw new Error('API access forbidden. Please check your RapidAPI subscription and API key.');
//       }

//       if (!response.ok) {
//         throw new Error(`API responded with status ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log('API Response Data:', data);
      
//       // Filter results to prioritize the requested location
//       let jobs = data.data || [];
      
//       // If we specifically searched for an Indian location, try to filter out non-Indian jobs
//       if (location.toLowerCase().includes('india') || 
//           location.toLowerCase().includes('bangalore') ||
//           location.toLowerCase().includes('bengaluru') ||
//           location.toLowerCase().includes('delhi') ||
//           location.toLowerCase().includes('mumbai') ||
//           location.toLowerCase().includes('hyderabad') ||
//           location.toLowerCase().includes('chennai') ||
//           location.toLowerCase().includes('pune')) {
        
//         // First, try to find jobs that actually match our location
//         const locationSpecificJobs = jobs.filter((job: any) => 
//           job.job_country && job.job_country.toLowerCase().includes('india') ||
//           job.job_city && (
//             job.job_city.toLowerCase().includes(location.toLowerCase()) ||
//             location.toLowerCase().includes(job.job_city.toLowerCase())
//           )
//         );
        
//         // If we found location-specific jobs, use them
//         if (locationSpecificJobs.length > 0) {
//           jobs = locationSpecificJobs;
//         }
//         // If no location-specific jobs found, show available jobs with info message
//         else if (jobs.length > 0) {
//           // FIXED: Show warning message but don't throw error - return jobs normally
//           console.warn(`Found ${jobs.length} jobs, but none specifically in ${location}. Showing available jobs.`);
//           return jobs;
//         }
//       }
      
//       return jobs;
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
      
//       // Set appropriate message based on results
//       if (jobs.length > 0) {
//         // Check if we're showing location-specific jobs or general jobs
//         const hasIndianJobs = jobs.some((job: any) => 
//           job.job_country && job.job_country.toLowerCase().includes('india')
//         );
        
//         if (hasIndianJobs) {
//           setMessage(`Found ${jobs.length} jobs in ${searchLocation}`);
//         } else {
//           setMessage(`Found ${jobs.length} jobs (showing available jobs since no specific ${searchLocation} jobs found)`);
//         }
//       } else {
//         setMessage('No jobs found for your search criteria');
//       }
//     } catch (error: any) {
//       console.error('Error fetching jobs:', error);
//       setMessage(`Error: ${error.message || 'Failed to fetch jobs. Please check your API limits and connection.'}`);
//     } finally {
//       setFetchingJobs(false);
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
//       applicationLink: job.job_apply_link,
//       postedAt: new Date(),
//       postedBy: 'api-source',
//       source: 'jsearch',
//       externalId: job.job_id,
//       companyLogo: job.employer_logo,
//       isExternal: true,
//       jobLink: job.job_apply_link
//     };
//   };

//   const saveJobToFirestore = async (jobData: any) => {
//     try {
//       const jobsRef = collection(db, 'jobs');
//       await addDoc(jobsRef, jobData);
      
//       // Also save to apiJobs collection for tracking
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

//   const importJob = async (job: any) => {
//     try {
//       const ourJobFormat = mapJSearchJobToOurFormat(job);
//       const success = await saveJobToFirestore(ourJobFormat);
      
//       if (success) {
//         setMessage('Job imported successfully!');
//         setApiJobs(apiJobs.filter(j => j.job_id !== job.job_id));
        
//         // Refresh imported jobs list
//         const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//         const apiJobsSnapshot = await getDocs(apiJobsQuery);
//         setImportedJobs(apiJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//       } else {
//         setMessage('Failed to import job');
//       }
//     } catch (error) {
//       console.error('Error importing job:', error);
//       setMessage('Error importing job');
//     }
//   };

//   const importAllJobs = async () => {
//     if (apiJobs.length === 0) {
//       setMessage('No jobs to import');
//       return;
//     }

//     try {
//       let importedCount = 0;
      
//       for (const job of apiJobs) {
//         const ourJobFormat = mapJSearchJobToOurFormat(job);
//         const success = await saveJobToFirestore(ourJobFormat);
//         if (success) importedCount++;
        
//         // Add a small delay to avoid overwhelming Firebase and API limits
//         await new Promise(resolve => setTimeout(resolve, 100));
//       }
      
//       setMessage(`Imported ${importedCount} of ${apiJobs.length} jobs successfully!`);
//       setApiJobs([]);
      
//       // Refresh imported jobs list
//       const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//       const apiJobsSnapshot = await getDocs(apiJobsQuery);
//       setImportedJobs(apiJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     } catch (error) {
//       console.error('Error importing all jobs:', error);
//       setMessage('Error importing jobs');
//     }
//   };

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
//     <div className="min-h-screen bg-white p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-black mb-6">Admin Dashboard</h1>
        
//         {/* API Jobs Fetching Section */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 mb-6">
//           <h2 className="text-xl font-semibold text-black mb-4">Fetch Jobs from JSearch API</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block mb-2 font-medium text-black">Job Title/Keywords</label>
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="e.g., developer, marketing, etc."
//                 className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
//               />
//             </div>
            
//             <div>
//               <label className="block mb-2 font-medium text-black">Location</label>
//               <input
//                 type="text"
//                 value={searchLocation}
//                 onChange={(e) => setSearchLocation(e.target.value)}
//                 placeholder="e.g., India, Bangalore, etc."
//                 className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
//               />
//             </div>
//           </div>
          
//           <button
//             onClick={fetchJobs}
//             disabled={fetchingJobs}
//             className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-colors"
//           >
//             {fetchingJobs ? 'Fetching Jobs...' : 'Fetch Jobs from API'}
//           </button>
          
//           {message && (
//             <div className={`mt-4 p-3 rounded-lg ${
//               message.includes('Error') ? 'bg-red-100 text-red-800' : 
//               message.includes('showing available jobs') ? 'bg-yellow-100 text-yellow-800' : 
//               'bg-green-100 text-green-800'
//             }`}>
//               {message}
//             </div>
//           )}
//         </div>
        
//         {/* API Jobs Results */}
//         {apiJobs.length > 0 && (
//           <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-black">API Jobs ({apiJobs.length} found)</h2>
//               <button
//                 onClick={importAllJobs}
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
//               >
//                 Import All Jobs
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 gap-4">
//               {apiJobs.slice(0, 10).map((job) => (
//                 <div key={job.job_id} className="p-4 border border-orange-200 rounded-lg bg-orange-50">
//                   <h3 className="text-lg font-semibold text-black">{job.job_title}</h3>
//                   <p className="text-black">{job.employer_name} - {job.job_city}, {job.job_country}</p>
//                   <p className="text-black">{job.job_employment_type}</p>
//                   <p className="mt-2 text-sm text-black">{job.job_description.substring(0, 150)}...</p>
                  
//                   <button
//                     onClick={() => importJob(job)}
//                     className="mt-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600 transition-colors"
//                   >
//                     Import Job
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
        
//         {/* Imported Jobs */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 mb-6">
//           <h2 className="text-xl font-semibold text-black mb-4">Imported Jobs ({importedJobs.length})</h2>
          
//           <div className="overflow-y-auto max-h-96">
//             {importedJobs.map(job => (
//               <div key={job.id} className="p-4 border border-orange-200 rounded-lg mb-3 bg-orange-50">
//                 <h3 className="text-lg font-semibold text-black">{job.title}</h3>
//                 <p className="text-black">{job.company} - {job.location}</p>
//                 <p className="text-black text-sm">Imported on: {job.fetchedAt?.toDate?.().toLocaleDateString() || 'Unknown date'}</p>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         {/* Users List */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//           <h2 className="text-xl font-semibold text-black mb-4">Users ({users.length})</h2>
          
//           <div className="overflow-y-auto max-h-96">
//             {users.map(user => (
//               <div key={user.id} className="p-4 border border-orange-200 rounded-lg mb-3 bg-orange-50">
//                 <h3 className="text-lg font-semibold text-black">{user.displayName || 'Anonymous User'}</h3>
//                 <p className="text-black">{user.email}</p>
//                 <p className="text-black text-sm">Role: {user.role || 'user'}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
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

// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { useRouter } from 'next/navigation';
// import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
// import { rapidApiConfig } from '@/lib/config';
// import { isAdmin } from '@/lib/admin';
// import ErrorBoundary from '@/components/ErrorBoundary';
// import ErrorFallback from '@/components/ErrorFallback';

// // Admin Dashboard Content Component
// function AdminDashboardContent() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [isUserAdmin, setIsUserAdmin] = useState(false);
//   const [loadingAdminCheck, setLoadingAdminCheck] = useState(true);
//   const [apiJobs, setApiJobs] = useState<any[]>([]);
//   const [importedJobs, setImportedJobs] = useState<any[]>([]);
//   const [users, setUsers] = useState<any[]>([]);
//   const [fetchingJobs, setFetchingJobs] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('developer');
//   const [searchLocation, setSearchLocation] = useState('India');
//   const [message, setMessage] = useState('');

//   // Debug environment variables
//   useEffect(() => {
//     console.log('Environment Check:');
//     console.log('RapidAPI Key Available:', !!process.env.NEXT_PUBLIC_RAPIDAPI_KEY);
//     console.log('RapidAPI Host Available:', !!process.env.NEXT_PUBLIC_RAPIDAPI_HOST);
//     console.log('Config Key:', rapidApiConfig.key ? 'LOADED' : 'MISSING');
//     console.log('Config Host:', rapidApiConfig.host ? 'LOADED' : 'MISSING');
//   }, []);

//   // Check if user is admin
//   useEffect(() => {
//     async function checkAdminStatus() {
//       if (user) {
//         try {
//           const adminStatus = await isAdmin(user);
//           setIsUserAdmin(adminStatus);
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

//   // Fetch imported jobs and users if admin
//   useEffect(() => {
//     if (isUserAdmin) {
//       const fetchImportedJobs = async () => {
//         try {
//           const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//           const apiJobsSnapshot = await getDocs(apiJobsQuery);
//           setImportedJobs(apiJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//         } catch (error) {
//           console.error('Error fetching imported jobs:', error);
//           throw new Error('Failed to load imported jobs');
//         }
//       };

//       const fetchUsers = async () => {
//         try {
//           const usersQuery = query(collection(db, 'users'), orderBy('displayName'));
//           const usersSnapshot = await getDocs(usersQuery);
//           setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//         } catch (error) {
//           console.error('Error fetching users:', error);
//           throw new Error('Failed to load users');
//         }
//       };

//       fetchImportedJobs();
//       fetchUsers();
//     }
//   }, [isUserAdmin]);

//   const fetchJobsFromAPI = async (query: string, location: string) => {
//     try {
//       // Use environment variables directly as fallback
//       const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || rapidApiConfig.key;
//       const apiHost = process.env.NEXT_PUBLIC_RAPIDAPI_HOST || rapidApiConfig.host;

//       console.log('API Key being used:', apiKey ? 'PRESENT' : 'MISSING');
//       console.log('API Host being used:', apiHost);

//       if (!apiKey) {
//         throw new Error('RapidAPI key is missing. Please check your environment variables.');
//       }

//       if (!apiHost) {
//         throw new Error('RapidAPI host is missing. Please check your environment variables.');
//       }

//       // FIXED: Ensure location has a default value if empty
//       const safeLocation = location.trim() || 'India';
//       console.log('Using location:', safeLocation);

//       // For Indian locations, we'll prioritize them more strongly in the query
//       let apiQuery = query;
//       if (safeLocation.toLowerCase() !== 'usa' && safeLocation.toLowerCase() !== 'united states') {
//         // Add location to the query itself to increase relevance for non-US locations
//         apiQuery = `${query} ${safeLocation}`;
//       }
      
//       const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(apiQuery)}&location=${encodeURIComponent(safeLocation)}&page=1`;
      
//       console.log('Making API request to:', url);

//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'X-RapidAPI-Key': apiKey,
//           'X-RapidAPI-Host': apiHost,
//         },
//       });

//       console.log('API Response Status:', response.status);

//       // Check for rate limiting (429 status code)
//       if (response.status === 429) {
//         throw new Error('Rate limit exceeded. Please wait and try again later.');
//       }

//       if (response.status === 403) {
//         // More detailed 403 error messages
//         if (!apiKey || apiKey === '') {
//           throw new Error('API access forbidden: RapidAPI key is missing or empty.');
//         } else if (apiKey.includes('old-key') || apiKey.length < 20) {
//           throw new Error('API access forbidden: RapidAPI key appears to be invalid.');
//         } else {
//           throw new Error('API access forbidden. Please check your RapidAPI subscription and ensure your API key is valid.');
//         }
//       }

//       if (!response.ok) {
//         throw new Error(`API responded with status ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log('API Response Data:', data);
      
//       // Filter results to prioritize the requested location
//       let jobs = data.data || [];
      
//       // If we specifically searched for an Indian location, try to filter out non-Indian jobs
//       if (safeLocation.toLowerCase().includes('india') || 
//           safeLocation.toLowerCase().includes('bangalore') ||
//           safeLocation.toLowerCase().includes('bengaluru') ||
//           safeLocation.toLowerCase().includes('delhi') ||
//           safeLocation.toLowerCase().includes('mumbai') ||
//           safeLocation.toLowerCase().includes('hyderabad') ||
//           safeLocation.toLowerCase().includes('chennai') ||
//           safeLocation.toLowerCase().includes('pune')) {
        
//         // First, try to find jobs that actually match our location
//         const locationSpecificJobs = jobs.filter((job: any) => 
//           job.job_country && job.job_country.toLowerCase().includes('india') ||
//           job.job_city && (
//             job.job_city.toLowerCase().includes(safeLocation.toLowerCase()) ||
//             safeLocation.toLowerCase().includes(job.job_city.toLowerCase())
//           )
//         );
        
//         // If we found location-specific jobs, use them
//         if (locationSpecificJobs.length > 0) {
//           jobs = locationSpecificJobs;
//         }
//         // If no location-specific jobs found, show available jobs with info message
//         else if (jobs.length > 0) {
//           // FIXED: Show warning message but don't throw error - return jobs normally
//           console.warn(`Found ${jobs.length} jobs, but none specifically in ${safeLocation}. Showing available jobs.`);
//           return jobs;
//         }
//       }
      
//       return jobs;
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

//     // FIXED: Ensure location has a value before making API call
//     const locationToUse = searchLocation.trim() || 'India';
    
//     setFetchingJobs(true);
//     setMessage('');
    
//     try {
//       const jobs = await fetchJobsFromAPI(searchQuery, locationToUse);
//       setApiJobs(jobs);
      
//       // Set appropriate message based on results
//       if (jobs.length > 0) {
//         // Check if we're showing location-specific jobs or general jobs
//         const hasIndianJobs = jobs.some((job: any) => 
//           job.job_country && job.job_country.toLowerCase().includes('india')
//         );
        
//         if (hasIndianJobs) {
//           setMessage(`Found ${jobs.length} jobs in ${locationToUse}`);
//         } else {
//           setMessage(`Found ${jobs.length} jobs (showing available jobs since no specific ${locationToUse} jobs found)`);
//         }
//       } else {
//         setMessage('No jobs found for your search criteria');
//       }
//     } catch (error: any) {
//       console.error('Error fetching jobs:', error);
//       setMessage(`Error: ${error.message || 'Failed to fetch jobs. Please check your API limits and connection.'}`);
//     } finally {
//       setFetchingJobs(false);
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
//       applicationLink: job.job_apply_link,
//       postedAt: new Date(),
//       postedBy: 'api-source',
//       source: 'jsearch',
//       externalId: job.job_id,
//       companyLogo: job.employer_logo,
//       isExternal: true,
//       jobLink: job.job_apply_link
//     };
//   };

//   const saveJobToFirestore = async (jobData: any) => {
//     try {
//       const jobsRef = collection(db, 'jobs');
//       await addDoc(jobsRef, jobData);
      
//       // Also save to apiJobs collection for tracking
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

//   const importJob = async (job: any) => {
//     try {
//       const ourJobFormat = mapJSearchJobToOurFormat(job);
//       const success = await saveJobToFirestore(ourJobFormat);
      
//       if (success) {
//         setMessage('Job imported successfully!');
//         setApiJobs(apiJobs.filter(j => j.job_id !== job.job_id));
        
//         // Refresh imported jobs list
//         const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//         const apiJobsSnapshot = await getDocs(apiJobsQuery);
//         setImportedJobs(apiJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//       } else {
//         setMessage('Failed to import job');
//       }
//     } catch (error) {
//       console.error('Error importing job:', error);
//       setMessage('Error importing job');
//     }
//   };

//   const importAllJobs = async () => {
//     if (apiJobs.length === 0) {
//       setMessage('No jobs to import');
//       return;
//     }

//     try {
//       let importedCount = 0;
      
//       for (const job of apiJobs) {
//         const ourJobFormat = mapJSearchJobToOurFormat(job);
//         const success = await saveJobToFirestore(ourJobFormat);
//         if (success) importedCount++;
        
//         // Add a small delay to avoid overwhelming Firebase and API limits
//         await new Promise(resolve => setTimeout(resolve, 100));
//       }
      
//       setMessage(`Imported ${importedCount} of ${apiJobs.length} jobs successfully!`);
//       setApiJobs([]);
      
//       // Refresh imported jobs list
//       const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//       const apiJobsSnapshot = await getDocs(apiJobsQuery);
//       setImportedJobs(apiJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     } catch (error) {
//       console.error('Error importing all jobs:', error);
//       setMessage('Error importing jobs');
//     }
//   };

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
//     <div className="min-h-screen bg-white p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-black mb-6">Admin Dashboard</h1>
        
//         {/* API Jobs Fetching Section */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 mb-6">
//           <h2 className="text-xl font-semibold text-black mb-4">Fetch Jobs from JSearch API</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block mb-2 font-medium text-black">Job Title/Keywords</label>
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="e.g., developer, marketing, etc."
//                 className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
//               />
//             </div>
            
//             <div>
//               <label className="block mb-2 font-medium text-black">Location</label>
//               <input
//                 type="text"
//                 value={searchLocation}
//                 onChange={(e) => setSearchLocation(e.target.value)}
//                 placeholder="e.g., India, Bangalore, etc."
//                 className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
//               />
//             </div>
//           </div>
          
//           <button
//             onClick={fetchJobs}
//             disabled={fetchingJobs}
//             className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-colors"
//           >
//             {fetchingJobs ? 'Fetching Jobs...' : 'Fetch Jobs from API'}
//           </button>
          
//           {message && (
//             <div className={`mt-4 p-3 rounded-lg ${
//               message.includes('Error') ? 'bg-red-100 text-red-800' : 
//               message.includes('showing available jobs') ? 'bg-yellow-100 text-yellow-800' : 
//               'bg-green-100 text-green-800'
//             }`}>
//               {message}
//             </div>
//           )}
//         </div>
        
//         {/* API Jobs Results */}
//         {apiJobs.length > 0 && (
//           <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-black">API Jobs ({apiJobs.length} found)</h2>
//               <button
//                 onClick={importAllJobs}
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
//               >
//                 Import All Jobs
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 gap-4">
//               {apiJobs.slice(0, 10).map((job) => (
//                 <div key={job.job_id} className="p-4 border border-orange-200 rounded-lg bg-orange-50">
//                   <h3 className="text-lg font-semibold text-black">{job.job_title}</h3>
//                   <p className="text-black">{job.employer_name} - {job.job_city}, {job.job_country}</p>
//                   <p className="text-black">{job.job_employment_type}</p>
//                   <p className="mt-2 text-sm text-black">{job.job_description.substring(0, 150)}...</p>
                  
//                   <button
//                     onClick={() => importJob(job)}
//                     className="mt-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600 transition-colors"
//                   >
//                     Import Job
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
        
//         {/* Imported Jobs */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 mb-6">
//           <h2 className="text-xl font-semibold text-black mb-4">Imported Jobs ({importedJobs.length})</h2>
          
//           <div className="overflow-y-auto max-h-96">
//             {importedJobs.map(job => (
//               <div key={job.id} className="p-4 border border-orange-200 rounded-lg mb-3 bg-orange-50">
//                 <h3 className="text-lg font-semibold text-black">{job.title}</h3>
//                 <p className="text-black">{job.company} - {job.location}</p>
//                 <p className="text-black text-sm">Imported on: {job.fetchedAt?.toDate?.().toLocaleDateString() || 'Unknown date'}</p>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         {/* Users List */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//           <h2 className="text-xl font-semibold text-black mb-4">Users ({users.length})</h2>
          
//           <div className="overflow-y-auto max-h-96">
//             {users.map(user => (
//               <div key={user.id} className="p-4 border border-orange-200 rounded-lg mb-3 bg-orange-50">
//                 <h3 className="text-lg font-semibold text-black">{user.displayName || 'Anonymous User'}</h3>
//                 <p className="text-black">{user.email}</p>
//                 <p className="text-black text-sm">Role: {user.role || 'user'}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
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


// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { useRouter } from 'next/navigation';
// import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
// import { rapidApiConfig } from '@/lib/config';
// import { isAdmin } from '@/lib/admin';
// import ErrorBoundary from '@/components/ErrorBoundary';
// import ErrorFallback from '@/components/ErrorFallback';
// import { fetchAdzunaJobs, saveAdzunaJobsToFirestore, AdzunaJob } from '@/lib/adzuna-new';

// // Admin Dashboard Content Component
// function AdminDashboardContent() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [isUserAdmin, setIsUserAdmin] = useState(false);
//   const [loadingAdminCheck, setLoadingAdminCheck] = useState(true);
//   const [apiJobs, setApiJobs] = useState<any[]>([]);
//   const [adzunaJobs, setAdzunaJobs] = useState<AdzunaJob[]>([]);
//   const [importedJobs, setImportedJobs] = useState<any[]>([]);
//   const [users, setUsers] = useState<any[]>([]);
//   const [fetchingJobs, setFetchingJobs] = useState(false);
//   const [fetchingAdzunaJobs, setFetchingAdzunaJobs] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('developer');
//   const [searchLocation, setSearchLocation] = useState('India');
//   const [message, setMessage] = useState('');

//   // Debug environment variables
//   useEffect(() => {
//     console.log('Environment Check:');
//     console.log('RapidAPI Key Available:', !!process.env.NEXT_PUBLIC_RAPIDAPI_KEY);
//     console.log('RapidAPI Host Available:', !!process.env.NEXT_PUBLIC_RAPIDAPI_HOST);
//     console.log('Config Key:', rapidApiConfig.key ? 'LOADED' : 'MISSING');
//     console.log('Config Host:', rapidApiConfig.host ? 'LOADED' : 'MISSING');
//     console.log('Adzuna App ID Available:', !!process.env.NEXT_PUBLIC_ADZUNA_APP_ID);
//     console.log('Adzuna API Key Available:', !!process.env.NEXT_PUBLIC_ADZUNA_API_KEY);
//   }, []);

//   // Check if user is admin
//   useEffect(() => {
//     async function checkAdminStatus() {
//       if (user) {
//         try {
//           const adminStatus = await isAdmin(user);
//           setIsUserAdmin(adminStatus);
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

//   // Fetch imported jobs and users if admin
//   useEffect(() => {
//     if (isUserAdmin) {
//       const fetchImportedJobs = async () => {
//         try {
//           const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//           const apiJobsSnapshot = await getDocs(apiJobsQuery);
//           setImportedJobs(apiJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//         } catch (error) {
//           console.error('Error fetching imported jobs:', error);
//           throw new Error('Failed to load imported jobs');
//         }
//       };

//       const fetchUsers = async () => {
//         try {
//           const usersQuery = query(collection(db, 'users'), orderBy('displayName'));
//           const usersSnapshot = await getDocs(usersQuery);
//           setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//         } catch (error) {
//           console.error('Error fetching users:', error);
//           throw new Error('Failed to load users');
//         }
//       };

//       fetchImportedJobs();
//       fetchUsers();
//     }
//   }, [isUserAdmin]);

//   // Fetch jobs from JSearch API
//   const fetchJobsFromAPI = async (query: string, location: string) => {
//     try {
//       // Use environment variables directly as fallback
//       const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || rapidApiConfig.key;
//       const apiHost = process.env.NEXT_PUBLIC_RAPIDAPI_HOST || rapidApiConfig.host;

//       console.log('API Key being used:', apiKey ? 'PRESENT' : 'MISSING');
//       console.log('API Host being used:', apiHost);

//       if (!apiKey) {
//         throw new Error('RapidAPI key is missing. Please check your environment variables.');
//       }

//       if (!apiHost) {
//         throw new Error('RapidAPI host is missing. Please check your environment variables.');
//       }

//       // FIXED: Ensure location has a default value if empty
//       const safeLocation = location.trim() || 'India';
//       console.log('Using location:', safeLocation);

//       // For Indian locations, we'll prioritize them more strongly in the query
//       let apiQuery = query;
//       if (safeLocation.toLowerCase() !== 'usa' && safeLocation.toLowerCase() !== 'united states') {
//         // Add location to the query itself to increase relevance for non-US locations
//         apiQuery = `${query} ${safeLocation}`;
//       }
      
//       const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(apiQuery)}&location=${encodeURIComponent(safeLocation)}&page=1`;
      
//       console.log('Making API request to:', url);

//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'X-RapidAPI-Key': apiKey,
//           'X-RapidAPI-Host': apiHost,
//         },
//       });

//       console.log('API Response Status:', response.status);

//       // Check for rate limiting (429 status code)
//       if (response.status === 429) {
//         throw new Error('Rate limit exceeded. Please wait and try again later.');
//       }

//       if (response.status === 403) {
//         // More detailed 403 error messages
//         if (!apiKey || apiKey === '') {
//           throw new Error('API access forbidden: RapidAPI key is missing or empty.');
//         } else if (apiKey.includes('old-key') || apiKey.length < 20) {
//           throw new Error('API access forbidden: RapidAPI key appears to be invalid.');
//         } else {
//           throw new Error('API access forbidden. Please check your RapidAPI subscription and ensure your API key is valid.');
//         }
//       }

//       if (!response.ok) {
//         throw new Error(`API responded with status ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log('API Response Data:', data);
      
//       // Filter results to prioritize the requested location
//       let jobs = data.data || [];
      
//       // If we specifically searched for an Indian location, try to filter out non-Indian jobs
//       if (safeLocation.toLowerCase().includes('india') || 
//           safeLocation.toLowerCase().includes('bangalore') ||
//           safeLocation.toLowerCase().includes('bengaluru') ||
//           safeLocation.toLowerCase().includes('delhi') ||
//           safeLocation.toLowerCase().includes('mumbai') ||
//           safeLocation.toLowerCase().includes('hyderabad') ||
//           safeLocation.toLowerCase().includes('chennai') ||
//           safeLocation.toLowerCase().includes('pune')) {
        
//         // First, try to find jobs that actually match our location
//         const locationSpecificJobs = jobs.filter((job: any) => 
//           job.job_country && job.job_country.toLowerCase().includes('india') ||
//           job.job_city && (
//             job.job_city.toLowerCase().includes(safeLocation.toLowerCase()) ||
//             safeLocation.toLowerCase().includes(job.job_city.toLowerCase())
//           )
//         );
        
//         // If we found location-specific jobs, use them
//         if (locationSpecificJobs.length > 0) {
//           jobs = locationSpecificJobs;
//         }
//         // If no location-specific jobs found, show available jobs with info message
//         else if (jobs.length > 0) {
//           // FIXED: Show warning message but don't throw error - return jobs normally
//           console.warn(`Found ${jobs.length} jobs, but none specifically in ${safeLocation}. Showing available jobs.`);
//           return jobs;
//         }
//       }
      
//       return jobs;
//     } catch (error) {
//       console.error('Error fetching jobs from API:', error);
//       throw error;
//     }
//   };

//   // Fetch jobs from Adzuna API
//   const fetchAdzunaJobsHandler = async () => {
//     if (!user) {
//       setMessage('You must be logged in to fetch jobs');
//       return;
//     }

//     setFetchingAdzunaJobs(true);
//     setMessage('');

//     try {
//       const jobs = await fetchAdzunaJobs('in', 20); // Fetch 20 jobs from India
//       setAdzunaJobs(jobs);
//       setMessage(`Found ${jobs.length} jobs from Adzuna API`);
//     } catch (error: any) {
//       console.error('Error fetching Adzuna jobs:', error);
//       setMessage(`Error fetching Adzuna jobs: ${error.message || 'Unknown error'}`);
//     } finally {
//       setFetchingAdzunaJobs(false);
//     }
//   };

//   const fetchJobs = async () => {
//     if (!searchQuery.trim()) {
//       setMessage('Please enter a search query');
//       return;
//     }

//     // FIXED: Ensure location has a value before making API call
//     const locationToUse = searchLocation.trim() || 'India';
    
//     setFetchingJobs(true);
//     setMessage('');
    
//     try {
//       const jobs = await fetchJobsFromAPI(searchQuery, locationToUse);
//       setApiJobs(jobs);
      
//       // Set appropriate message based on results
//       if (jobs.length > 0) {
//         // Check if we're showing location-specific jobs or general jobs
//         const hasIndianJobs = jobs.some((job: any) => 
//           job.job_country && job.job_country.toLowerCase().includes('india')
//         );
        
//         if (hasIndianJobs) {
//           setMessage(`Found ${jobs.length} jobs in ${locationToUse}`);
//         } else {
//           setMessage(`Found ${jobs.length} jobs (showing available jobs since no specific ${locationToUse} jobs found)`);
//         }
//       } else {
//         setMessage('No jobs found for your search criteria');
//       }
//     } catch (error: any) {
//       console.error('Error fetching jobs:', error);
//       setMessage(`Error: ${error.message || 'Failed to fetch jobs. Please check your API limits and connection.'}`);
//     } finally {
//       setFetchingJobs(false);
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
//       applicationLink: job.job_apply_link,
//       postedAt: new Date(),
//       postedBy: 'api-source',
//       source: 'jsearch',
//       externalId: job.job_id,
//       companyLogo: job.employer_logo,
//       isExternal: true,
//       jobLink: job.job_apply_link
//     };
//   };

//   const saveJobToFirestore = async (jobData: any) => {
//     try {
//       const jobsRef = collection(db, 'jobs');
//       await addDoc(jobsRef, jobData);
      
//       // Also save to apiJobs collection for tracking
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

//   const importJob = async (job: any) => {
//     try {
//       const ourJobFormat = mapJSearchJobToOurFormat(job);
//       const success = await saveJobToFirestore(ourJobFormat);
      
//       if (success) {
//         setMessage('Job imported successfully!');
//         setApiJobs(apiJobs.filter(j => j.job_id !== job.job_id));
        
//         // Refresh imported jobs list
//         const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//         const apiJobsSnapshot = await getDocs(apiJobsQuery);
//         setImportedJobs(apiJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//       } else {
//         setMessage('Failed to import job');
//       }
//     } catch (error) {
//       console.error('Error importing job:', error);
//       setMessage('Error importing job');
//     }
//   };

//   const importAdzunaJob = async (job: AdzunaJob) => {
//     if (!user) {
//       setMessage('You must be logged in to import jobs');
//       return;
//     }

//     try {
//       const savedCount = await saveAdzunaJobsToFirestore([job], user.uid);
      
//       if (savedCount > 0) {
//         setMessage('Adzuna job imported successfully!');
//         setAdzunaJobs(adzunaJobs.filter(j => j.id !== job.id));
        
//         // Refresh imported jobs list
//         const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//         const apiJobsSnapshot = await getDocs(apiJobsQuery);
//         setImportedJobs(apiJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//       } else {
//         setMessage('Failed to import Adzuna job');
//       }
//     } catch (error) {
//       console.error('Error importing Adzuna job:', error);
//       setMessage('Error importing Adzuna job');
//     }
//   };

//   const importAllJobs = async () => {
//     if (apiJobs.length === 0) {
//       setMessage('No jobs to import');
//       return;
//     }

//     try {
//       let importedCount = 0;
      
//       for (const job of apiJobs) {
//         const ourJobFormat = mapJSearchJobToOurFormat(job);
//         const success = await saveJobToFirestore(ourJobFormat);
//         if (success) importedCount++;
        
//         // Add a small delay to avoid overwhelming Firebase and API limits
//         await new Promise(resolve => setTimeout(resolve, 100));
//       }
      
//       setMessage(`Imported ${importedCount} of ${apiJobs.length} jobs successfully!`);
//       setApiJobs([]);
      
//       // Refresh imported jobs list
//       const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//       const apiJobsSnapshot = await getDocs(apiJobsQuery);
//       setImportedJobs(apiJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     } catch (error) {
//       console.error('Error importing all jobs:', error);
//       setMessage('Error importing jobs');
//     }
//   };

//   const importAllAdzunaJobs = async () => {
//     if (adzunaJobs.length === 0 || !user) {
//       setMessage('No Adzuna jobs to import or user not logged in');
//       return;
//     }

//     try {
//       const savedCount = await saveAdzunaJobsToFirestore(adzunaJobs, user.uid);
      
//       setMessage(`Imported ${savedCount} of ${adzunaJobs.length} Adzuna jobs successfully!`);
//       setAdzunaJobs([]);
      
//       // Refresh imported jobs list
//       const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//       const apiJobsSnapshot = await getDocs(apiJobsQuery);
//       setImportedJobs(apiJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     } catch (error) {
//       console.error('Error importing all Adzuna jobs:', error);
//       setMessage('Error importing Adzuna jobs');
//     }
//   };

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
//     <div className="min-h-screen bg-white p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-black mb-6">Admin Dashboard</h1>
        
//         {/* JSearch API Jobs Fetching Section */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 mb-6">
//           <h2 className="text-xl font-semibold text-black mb-4">Fetch Jobs from JSearch API</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block mb-2 font-medium text-black">Job Title/Keywords</label>
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="e.g., developer, marketing, etc."
//                 className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
//               />
//             </div>
            
//             <div>
//               <label className="block mb-2 font-medium text-black">Location</label>
//               <input
//                 type="text"
//                 value={searchLocation}
//                 onChange={(e) => setSearchLocation(e.target.value)}
//                 placeholder="e.g., India, Bangalore, etc."
//                 className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
//               />
//             </div>
//           </div>
          
//           <button
//             onClick={fetchJobs}
//             disabled={fetchingJobs}
//             className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-colors"
//           >
//             {fetchingJobs ? 'Fetching JSearch Jobs...' : 'Fetch Jobs from JSearch API'}
//           </button>
//         </div>

//         {/* Adzuna API Jobs Fetching Section */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200 mb-6">
//           <h2 className="text-xl font-semibold text-black mb-4">Fetch Jobs from Adzuna API</h2>
//           <p className="text-black mb-4">
//             Adzuna provides 1,000 free requests per day with 50 jobs per request. 
//             Currently fetching Indian tech jobs.
//           </p>
          
//           <button
//             onClick={fetchAdzunaJobsHandler}
//             disabled={fetchingAdzunaJobs}
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
//           >
//             {fetchingAdzunaJobs ? 'Fetching Adzuna Jobs...' : 'Fetch Jobs from Adzuna API'}
//           </button>
//         </div>
        
//         {message && (
//           <div className={`mb-6 p-3 rounded-lg ${
//             message.includes('Error') ? 'bg-red-100 text-red-800' : 
//             message.includes('showing available jobs') ? 'bg-yellow-100 text-yellow-800' : 
//             'bg-green-100 text-green-800'
//           }`}>
//             {message}
//           </div>
//         )}
        
//         {/* JSearch API Jobs Results */}
//         {apiJobs.length > 0 && (
//           <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-black">JSearch API Jobs ({apiJobs.length} found)</h2>
//               <button
//                 onClick={importAllJobs}
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
//               >
//                 Import All JSearch Jobs
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 gap-4">
//               {apiJobs.slice(0, 10).map((job) => (
//                 <div key={job.job_id} className="p-4 border border-orange-200 rounded-lg bg-orange-50">
//                   <h3 className="text-lg font-semibold text-black">{job.job_title}</h3>
//                   <p className="text-black">{job.employer_name} - {job.job_city}, {job.job_country}</p>
//                   <p className="text-black">{job.job_employment_type}</p>
//                   <p className="mt-2 text-sm text-black">{job.job_description.substring(0, 150)}...</p>
                  
//                   <button
//                     onClick={() => importJob(job)}
//                     className="mt-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600 transition-colors"
//                   >
//                     Import Job
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Adzuna API Jobs Results */}
//         {adzunaJobs.length > 0 && (
//           <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200 mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-black">Adzuna API Jobs ({adzunaJobs.length} found)</h2>
//               <button
//                 onClick={importAllAdzunaJobs}
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
//               >
//                 Import All Adzuna Jobs
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 gap-4">
//               {adzunaJobs.slice(0, 10).map((job) => (
//                 <div key={job.id} className="p-4 border border-blue-200 rounded-lg bg-blue-50">
//                   <h3 className="text-lg font-semibold text-black">{job.title}</h3>
//                   <p className="text-black">{job.company.display_name} - {job.location.display_name}</p>
//                   <p className="text-black">
//                     {job.salary_min && job.salary_max 
//                       ? `₹${job.salary_min.toLocaleString()} - ₹${job.salary_max.toLocaleString()}` 
//                       : 'Salary not specified'}
//                   </p>
//                   <p className="mt-2 text-sm text-black">{job.description.substring(0, 150)}...</p>
                  
//                   <button
//                     onClick={() => importAdzunaJob(job)}
//                     className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors"
//                   >
//                     Import Job
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
        
//         {/* Imported Jobs */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 mb-6">
//           <h2 className="text-xl font-semibold text-black mb-4">Imported Jobs ({importedJobs.length})</h2>
          
//           <div className="overflow-y-auto max-h-96">
//             {importedJobs.map(job => (
//               <div key={job.id} className="p-4 border border-orange-200 rounded-lg mb-3 bg-orange-50">
//                 <h3 className="text-lg font-semibold text-black">{job.title}</h3>
//                 <p className="text-black">{job.company} - {job.location}</p>
//                 <p className="text-black text-sm">
//                   Source: {job.source || 'unknown'} | 
//                   Imported on: {job.fetchedAt?.toDate?.().toLocaleDateString() || 'Unknown date'}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         {/* Users List */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//           <h2 className="text-xl font-semibold text-black mb-4">Users ({users.length})</h2>
          
//           <div className="overflow-y-auto max-h-96">
//             {users.map(user => (
//               <div key={user.id} className="p-4 border border-orange-200 rounded-lg mb-3 bg-orange-50">
//                 <h3 className="text-lg font-semibold text-black">{user.displayName || 'Anonymous User'}</h3>
//                 <p className="text-black">{user.email}</p>
//                 <p className="text-black text-sm">Role: {user.role || 'user'}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
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

// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { useRouter } from 'next/navigation';
// import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
// import { rapidApiConfig } from '@/lib/config';
// import { isAdmin } from '@/lib/admin';
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
//   const [activeTab, setActiveTab] = useState<'jobs' | 'users' | 'api'>('jobs');
  
//   // Jobs state
//   const [apiJobs, setApiJobs] = useState<any[]>([]);
//   const [adzunaJobs, setAdzunaJobs] = useState<AdzunaJob[]>([]);
//   const [importedJobs, setImportedJobs] = useState<any[]>([]);
//   const [showAllImportedJobs, setShowAllImportedJobs] = useState(false);
  
//   // API state
//   const [fetchingJobs, setFetchingJobs] = useState(false);
//   const [fetchingAdzunaJobs, setFetchingAdzunaJobs] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('developer');
//   const [searchLocation, setSearchLocation] = useState('India');
//   const [message, setMessage] = useState('');
  
//   // Users state
//   const [users, setUsers] = useState<any[]>([]);

//   // Check if user is admin
//   useEffect(() => {
//     async function checkAdminStatus() {
//       if (user) {
//         try {
//           const adminStatus = await isAdmin(user);
//           setIsUserAdmin(adminStatus);
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
//             const apiJobsQuery = query(
//               collection(db, 'apiJobs'), 
//               orderBy('fetchedAt', 'desc'),
//               showAllImportedJobs ? limit(1000) : limit(50) // Show more jobs when requested
//             );
//             const apiJobsSnapshot = await getDocs(apiJobsQuery);
//             const jobsData = apiJobsSnapshot.docs.map(doc => ({ 
//               id: doc.id, 
//               ...doc.data(),
//               // Ensure we have a proper date for display
//               displayDate: doc.data().fetchedAt?.toDate ? doc.data().fetchedAt.toDate() : new Date()
//             }));
//             setImportedJobs(jobsData);
//           } else if (activeTab === 'users') {
//             const usersQuery = query(collection(db, 'users'), orderBy('displayName'));
//             const usersSnapshot = await getDocs(usersQuery);
//             setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//           }
//         } catch (error) {
//           console.error(`Error fetching ${activeTab}:`, error);
//         }
//       };

//       fetchData();
//     }
//   }, [isUserAdmin, activeTab, showAllImportedJobs]);

//   // JSearch API Functions
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

//   // Adzuna API Functions
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

//   // Job Import Functions
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
//       const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//       const apiJobsSnapshot = await getDocs(apiJobsQuery);
//       setImportedJobs(apiJobsSnapshot.docs.map(doc => ({ 
//         id: doc.id, 
//         ...doc.data(),
//         displayDate: doc.data().fetchedAt?.toDate ? doc.data().fetchedAt.toDate() : new Date()
//       })));
      
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
      
//       // Refresh imported jobs list with proper date handling
//       const apiJobsQuery = query(collection(db, 'apiJobs'), orderBy('fetchedAt', 'desc'));
//       const apiJobsSnapshot = await getDocs(apiJobsQuery);
//       const refreshedJobs = apiJobsSnapshot.docs.map(doc => ({ 
//         id: doc.id, 
//         ...doc.data(),
//         displayDate: doc.data().fetchedAt?.toDate ? doc.data().fetchedAt.toDate() : new Date()
//       }));
//       setImportedJobs(refreshedJobs);
      
//       console.log(`🔄 Refreshed imported jobs list: ${refreshedJobs.length} total jobs`);
      
//     } catch (error) {
//       console.error('Error importing all jobs:', error);
//       setMessage('Error importing jobs');
//     }
//   };

//   // Get displayed jobs based on showAll setting
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
//               <h1 className="text-3xl font-bold text-black mb-2">Admin Dashboard</h1>
//               <p className="text-black">Manage jobs, users, and platform data</p>
//             </div>
//             <div className="text-right">
//               <p className="text-sm text-gray-600">Welcome, {user?.displayName || 'Admin'}</p>
//               <p className="text-xs text-gray-500">{user?.email}</p>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="bg-white rounded-2xl p-1 mb-6 shadow-lg border border-orange-200">
//           <div className="flex space-x-1">
//             <button
//               onClick={() => setActiveTab('jobs')}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all ${
//                 activeTab === 'jobs'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               📊 Imported Jobs
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
//               onClick={() => setActiveTab('users')}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all ${
//                 activeTab === 'users'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               👥 Users
//             </button>
//           </div>
//         </div>

//         {/* Message Alert */}
//         {message && (
//           <div className={`mb-6 p-4 rounded-2xl ${
//             message.includes('Error') ? 'bg-red-100 text-red-800 border border-red-200' : 
//             'bg-green-100 text-green-800 border border-green-200'
//           }`}>
//             {message}
//           </div>
//         )}

//         {/* Tab Content */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//           {/* Jobs Tab - Imported Jobs */}
//           {activeTab === 'jobs' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">Imported Jobs</h2>
//                 <div className="flex items-center space-x-4">
//                   <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                     {importedJobs.length} total jobs
//                   </span>
//                   <button
//                     onClick={() => setShowAllImportedJobs(!showAllImportedJobs)}
//                     className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors"
//                   >
//                     {showAllImportedJobs ? '📋 Show Less' : '📋 Show All'}
//                   </button>
//                 </div>
//               </div>

//               {importedJobs.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <span className="text-2xl">📭</span>
//                   </div>
//                   <p className="text-black text-lg mb-2">No jobs imported yet</p>
//                   <p className="text-gray-600">Use the API Jobs tab to fetch and import jobs</p>
//                 </div>
//               ) : (
//                 <div>
//                   <p className="text-gray-600 mb-4">
//                     Showing {getDisplayedImportedJobs().length} of {importedJobs.length} jobs
//                     {!showAllImportedJobs && ' (recent 20). Click "Show All" to see all jobs.'}
//                   </p>
//                   <div className="grid gap-4 max-h-[600px] overflow-y-auto">
//                     {getDisplayedImportedJobs().map(job => (
//                       <div key={job.id} className="p-4 border border-orange-200 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
//                         <div className="flex justify-between items-start">
//                           <div className="flex-1">
//                             <h3 className="text-lg font-semibold text-black mb-2">{job.title}</h3>
//                             <p className="text-black mb-1">
//                               <span className="font-medium">Company:</span> {job.company}
//                             </p>
//                             <p className="text-black mb-1">
//                               <span className="font-medium">Location:</span> {job.location}
//                             </p>
//                             <div className="flex items-center space-x-2 mt-2">
//                               <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                 job.source === 'adzuna' ? 'bg-blue-100 text-blue-800' : 
//                                 job.source === 'jsearch' ? 'bg-orange-100 text-orange-800' :
//                                 'bg-gray-100 text-gray-800'
//                               }`}>
//                                 {job.source || 'unknown'}
//                               </span>
//                               <span className="text-gray-600 text-sm">
//                                 Imported: {job.displayDate?.toLocaleDateString?.() || job.fetchedAt?.toDate?.().toLocaleDateString() || 'Unknown date'}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                               job.isExternal ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
//                             }`}>
//                               {job.isExternal ? 'External' : 'Internal'}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* API Tab - Job Fetching */}
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

//           {/* Users Tab */}
//           {activeTab === 'users' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">Platform Users</h2>
//                 <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                   {users.length} users
//                 </span>
//               </div>

//               {users.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <span className="text-2xl">👥</span>
//                   </div>
//                   <p className="text-black text-lg mb-2">No users found</p>
//                   <p className="text-gray-600">Users will appear here when they sign up</p>
//                 </div>
//               ) : (
//                 <div className="grid gap-4 max-h-96 overflow-y-auto">
//                   {users.map(user => (
//                     <div key={user.id} className="p-4 border border-orange-200 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h3 className="text-lg font-semibold text-black">{user.displayName || 'Anonymous User'}</h3>
//                           <p className="text-black">{user.email}</p>
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
//                                 {user.phoneNumber}
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
//           )}
//         </div>
//       </div>
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

// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { useRouter } from 'next/navigation';
// import { 
//   collection, addDoc, getDocs, query, where, orderBy, limit,
//   deleteDoc, updateDoc, doc, setDoc, getDoc, writeBatch, Timestamp 
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
//   const [activeTab, setActiveTab] = useState<'jobs' | 'users' | 'api' | 'config' | 'referral' | 'messages' | 'analytics'>('jobs');
  
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
  
//   // Analytics state
//   const [analyticsData, setAnalyticsData] = useState({
//     totalUsers: 0,
//     totalJobs: 0,
//     totalReferralJobs: 0,
//     totalMessages: 0,
//     totalApplications: 0,
//     totalConnections: 0,
//     dailySignups: [] as { date: string, count: number }[],
//     dailyJobs: [] as { date: string, count: number }[],
//     topLocations: [] as { location: string, count: number }[]
//   });
//   const [analyticsLoading, setAnalyticsLoading] = useState(false);
  
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
//           } else if (activeTab === 'analytics') {
//             await fetchAnalyticsData();
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

//   // Analytics data fetching - FIXED VERSION
//   const fetchAnalyticsData = async () => {
//     setAnalyticsLoading(true);
//     try {
//       // Fetch all collections for counts
//       const [usersSnapshot, jobsSnapshot, referralJobsSnapshot, messagesSnapshot, applicationsSnapshot, connectionsSnapshot] = await Promise.all([
//         getDocs(collection(db, 'users')),
//         getDocs(collection(db, 'jobs')),
//         getDocs(collection(db, 'referralJobs')),
//         getDocs(collection(db, 'messages')),
//         getDocs(collection(db, 'applications')),
//         getDocs(collection(db, 'connections'))
//       ]);

//       // Calculate daily signups (last 7 days)
//       const last7Days = Array.from({ length: 7 }, (_, i) => {
//         const date = new Date();
//         date.setDate(date.getDate() - i);
//         return date.toISOString().split('T')[0];
//       }).reverse();

//       // Type-safe user data extraction
//       const userDocs = usersSnapshot.docs.map(doc => {
//         const data = doc.data();
//         return {
//           id: doc.id,
//           ...data,
//           location: data.location || null, // Handle missing location field
//           createdAt: data.createdAt || null // Handle missing createdAt field
//         };
//       });

//       const dailySignups = last7Days.map(date => {
//         const count = userDocs.filter(user => {
//           if (!user.createdAt) return false;
//           const userDate = user.createdAt.toDate 
//             ? user.createdAt.toDate().toISOString().split('T')[0] 
//             : null;
//           return userDate === date;
//         }).length;
//         return { date, count };
//       });

//       // Calculate daily jobs (last 7 days)
//       const jobDocs = jobsSnapshot.docs.map(doc => {
//         const data = doc.data();
//         return {
//           id: doc.id,
//           ...data,
//           postedAt: data.postedAt || null
//         };
//       });

//       const dailyJobs = last7Days.map(date => {
//         const count = jobDocs.filter(job => {
//           if (!job.postedAt) return false;
//           const jobDate = job.postedAt.toDate 
//             ? job.postedAt.toDate().toISOString().split('T')[0] 
//             : null;
//           return jobDate === date;
//         }).length;
//         return { date, count };
//       });

//       // Calculate top locations - FIXED: Using type-safe approach
//       const locationCounts: Record<string, number> = {};
//       userDocs.forEach(user => {
//         // Type-safe check for location
//         const userData = user as any; // Type assertion to bypass TypeScript error
//         if (userData.location && typeof userData.location === 'string') {
//           locationCounts[userData.location] = (locationCounts[userData.location] || 0) + 1;
//         }
//       });

//       const topLocations = Object.entries(locationCounts)
//         .map(([location, count]) => ({ location, count }))
//         .sort((a, b) => b.count - a.count)
//         .slice(0, 5);

//       setAnalyticsData({
//         totalUsers: usersSnapshot.size,
//         totalJobs: jobsSnapshot.size,
//         totalReferralJobs: referralJobsSnapshot.size,
//         totalMessages: messagesSnapshot.size,
//         totalApplications: applicationsSnapshot.size,
//         totalConnections: connectionsSnapshot.size,
//         dailySignups,
//         dailyJobs,
//         topLocations
//       });
//     } catch (error) {
//       console.error('Error fetching analytics:', error);
//       setMessage('Error fetching analytics data');
//     } finally {
//       setAnalyticsLoading(false);
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
//               onClick={() => setActiveTab('analytics')}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all ${
//                 activeTab === 'analytics'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               📈 Analytics
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

//           {/* Analytics Tab */}
//           {activeTab === 'analytics' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">Platform Analytics</h2>
//                 <div className="flex items-center space-x-4">
//                   <button
//                     onClick={fetchAnalyticsData}
//                     disabled={analyticsLoading}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors flex items-center"
//                   >
//                     {analyticsLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Loading...
//                       </>
//                     ) : (
//                       '🔄 Refresh Analytics'
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {analyticsLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
//                   <p className="mt-4 text-black text-lg">Loading analytics data...</p>
//                 </div>
//               ) : (
//                 <>
//                   {/* Summary Cards */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Total Users</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalUsers}</p>
//                         </div>
//                         <div className="text-3xl">👥</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Total Jobs</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalJobs}</p>
//                         </div>
//                         <div className="text-3xl">💼</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Referral Jobs</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalReferralJobs}</p>
//                         </div>
//                         <div className="text-3xl">🤝</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Messages</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalMessages}</p>
//                         </div>
//                         <div className="text-3xl">💬</div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Additional Metrics */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                     <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Applications</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalApplications}</p>
//                         </div>
//                         <div className="text-3xl">📄</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Connections</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalConnections}</p>
//                         </div>
//                         <div className="text-3xl">🔗</div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Daily Stats */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {/* Daily Signups */}
//                     <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-md">
//                       <h3 className="text-xl font-semibold text-black mb-4">Daily User Signups (Last 7 Days)</h3>
//                       <div className="space-y-4">
//                         {analyticsData.dailySignups.map((item, index) => (
//                           <div key={index} className="flex items-center justify-between">
//                             <span className="text-black">{item.date}</span>
//                             <div className="flex items-center space-x-3">
//                               <span className="font-medium text-black">{item.count} users</span>
//                               <div className="w-32 bg-gray-200 rounded-full h-3">
//                                 <div 
//                                   className="bg-green-500 h-3 rounded-full" 
//                                   style={{ width: `${(item.count / Math.max(...analyticsData.dailySignups.map(d => d.count)) * 100) || 0}%` }}
//                                 ></div>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Daily Jobs */}
//                     <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-md">
//                       <h3 className="text-xl font-semibold text-black mb-4">Daily Job Posts (Last 7 Days)</h3>
//                       <div className="space-y-4">
//                         {analyticsData.dailyJobs.map((item, index) => (
//                           <div key={index} className="flex items-center justify-between">
//                             <span className="text-black">{item.date}</span>
//                             <div className="flex items-center space-x-3">
//                               <span className="font-medium text-black">{item.count} jobs</span>
//                               <div className="w-32 bg-gray-200 rounded-full h-3">
//                                 <div 
//                                   className="bg-blue-500 h-3 rounded-full" 
//                                   style={{ width: `${(item.count / Math.max(...analyticsData.dailyJobs.map(d => d.count)) * 100) || 0}%` }}
//                                 ></div>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Top Locations */}
//                   {analyticsData.topLocations.length > 0 && (
//                     <div className="mt-8 bg-white p-6 rounded-2xl border border-green-200 shadow-md">
//                       <h3 className="text-xl font-semibold text-black mb-4">Top User Locations</h3>
//                       <div className="space-y-4">
//                         {analyticsData.topLocations.map((location, index) => (
//                           <div key={index} className="flex items-center justify-between">
//                             <div className="flex items-center space-x-3">
//                               <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
//                               <span className="text-black">{location.location}</span>
//                             </div>
//                             <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
//                               {location.count} users
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Export Data */}
//                   <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-300">
//                     <h3 className="text-xl font-semibold text-black mb-4">Data Export</h3>
//                     <p className="text-gray-600 mb-4">Download platform data for further analysis</p>
//                     <button
//                       onClick={() => {
//                         const dataStr = JSON.stringify(analyticsData, null, 2);
//                         const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
//                         const exportFileDefaultName = `all-platform-analytics-${new Date().toISOString().split('T')[0]}.json`;
//                         const linkElement = document.createElement('a');
//                         linkElement.setAttribute('href', dataUri);
//                         linkElement.setAttribute('download', exportFileDefaultName);
//                         linkElement.click();
//                       }}
//                       className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium"
//                     >
//                       📥 Download JSON Export
//                     </button>
//                   </div>
//                 </>
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

// Working One 

// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { useRouter } from 'next/navigation';
// import { 
//   collection, addDoc, getDocs, query, where, orderBy, limit,
//   deleteDoc, updateDoc, doc, setDoc, getDoc, writeBatch, Timestamp 
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
//   const [activeTab, setActiveTab] = useState<'jobs' | 'users' | 'api' | 'config' | 'referral' | 'messages' | 'analytics' | 'feedback'>('jobs');
  
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
  
//   // Analytics state
//   const [analyticsData, setAnalyticsData] = useState({
//     totalUsers: 0,
//     totalJobs: 0,
//     totalReferralJobs: 0,
//     totalMessages: 0,
//     totalApplications: 0,
//     totalConnections: 0,
//     dailySignups: [] as { date: string, count: number }[],
//     dailyJobs: [] as { date: string, count: number }[],
//     topLocations: [] as { location: string, count: number }[]
//   });
//   const [analyticsLoading, setAnalyticsLoading] = useState(false);
  
//   // Search/filter state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedUserType, setSelectedUserType] = useState('all');

//   // FEEDBACK STATE - NEW
//   const [feedbacks, setFeedbacks] = useState<any[]>([]);
//   const [feedbackLoading, setFeedbackLoading] = useState(false);
//   const [feedbackStatusFilter, setFeedbackStatusFilter] = useState('all'); // 'all', 'new', 'reviewed', 'implemented'
//   const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState('all'); // 'all', 'bug', 'improvement', 'feature'

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
//           } else if (activeTab === 'analytics') {
//             await fetchAnalyticsData();
//           } else if (activeTab === 'feedback') {
//             await fetchFeedbacks();
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

//   // FEEDBACK FETCHING FUNCTION - NEW
//   const fetchFeedbacks = async () => {
//     setFeedbackLoading(true);
//     try {
//       const feedbackQuery = query(
//         collection(db, 'feedback'), 
//         orderBy('createdAt', 'desc')
//       );
//       const feedbackSnapshot = await getDocs(feedbackQuery);
//       const feedbackData = feedbackSnapshot.docs.map(doc => ({ 
//         id: doc.id, 
//         ...doc.data(),
//         // Convert Firestore timestamp to Date if needed
//         createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
//       }));
//       setFeedbacks(feedbackData);
//     } catch (error) {
//       console.error('Error fetching feedback:', error);
//       setMessage('Error fetching feedback data');
//     } finally {
//       setFeedbackLoading(false);
//     }
//   };

//   // FEEDBACK STATUS UPDATE FUNCTION - NEW
//   const updateFeedbackStatus = async (feedbackId: string, newStatus: string) => {
//     try {
//       await updateDoc(doc(db, 'feedback', feedbackId), {
//         status: newStatus,
//         reviewedAt: new Date()
//       });
      
//       setMessage(`✅ Feedback status updated to ${newStatus}`);
      
//       // Refresh feedback list
//       await fetchFeedbacks();
//     } catch (error) {
//       console.error('Error updating feedback status:', error);
//       setMessage('❌ Error updating feedback status');
//     }
//   };

//   // Analytics data fetching - FIXED VERSION
//   const fetchAnalyticsData = async () => {
//     setAnalyticsLoading(true);
//     try {
//       // Fetch all collections for counts
//       const [usersSnapshot, jobsSnapshot, referralJobsSnapshot, messagesSnapshot, applicationsSnapshot, connectionsSnapshot] = await Promise.all([
//         getDocs(collection(db, 'users')),
//         getDocs(collection(db, 'jobs')),
//         getDocs(collection(db, 'referralJobs')),
//         getDocs(collection(db, 'messages')),
//         getDocs(collection(db, 'applications')),
//         getDocs(collection(db, 'connections'))
//       ]);

//       // Calculate daily signups (last 7 days)
//       const last7Days = Array.from({ length: 7 }, (_, i) => {
//         const date = new Date();
//         date.setDate(date.getDate() - i);
//         return date.toISOString().split('T')[0];
//       }).reverse();

//       // Type-safe user data extraction
//       const userDocs = usersSnapshot.docs.map(doc => {
//         const data = doc.data();
//         return {
//           id: doc.id,
//           ...data,
//           location: data.location || null, // Handle missing location field
//           createdAt: data.createdAt || null // Handle missing createdAt field
//         };
//       });

//       const dailySignups = last7Days.map(date => {
//         const count = userDocs.filter(user => {
//           if (!user.createdAt) return false;
//           const userDate = user.createdAt.toDate 
//             ? user.createdAt.toDate().toISOString().split('T')[0] 
//             : null;
//           return userDate === date;
//         }).length;
//         return { date, count };
//       });

//       // Calculate daily jobs (last 7 days)
//       const jobDocs = jobsSnapshot.docs.map(doc => {
//         const data = doc.data();
//         return {
//           id: doc.id,
//           ...data,
//           postedAt: data.postedAt || null
//         };
//       });

//       const dailyJobs = last7Days.map(date => {
//         const count = jobDocs.filter(job => {
//           if (!job.postedAt) return false;
//           const jobDate = job.postedAt.toDate 
//             ? job.postedAt.toDate().toISOString().split('T')[0] 
//             : null;
//           return jobDate === date;
//         }).length;
//         return { date, count };
//       });

//       // Calculate top locations - FIXED: Using type-safe approach
//       const locationCounts: Record<string, number> = {};
//       userDocs.forEach(user => {
//         // Type-safe check for location
//         const userData = user as any; // Type assertion to bypass TypeScript error
//         if (userData.location && typeof userData.location === 'string') {
//           locationCounts[userData.location] = (locationCounts[userData.location] || 0) + 1;
//         }
//       });

//       const topLocations = Object.entries(locationCounts)
//         .map(([location, count]) => ({ location, count }))
//         .sort((a, b) => b.count - a.count)
//         .slice(0, 5);

//       setAnalyticsData({
//         totalUsers: usersSnapshot.size,
//         totalJobs: jobsSnapshot.size,
//         totalReferralJobs: referralJobsSnapshot.size,
//         totalMessages: messagesSnapshot.size,
//         totalApplications: applicationsSnapshot.size,
//         totalConnections: connectionsSnapshot.size,
//         dailySignups,
//         dailyJobs,
//         topLocations
//       });
//     } catch (error) {
//       console.error('Error fetching analytics:', error);
//       setMessage('Error fetching analytics data');
//     } finally {
//       setAnalyticsLoading(false);
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

//   // FEEDBACK FILTER FUNCTION - NEW
//   const filteredFeedbacks = () => {
//     let filtered = feedbacks;
    
//     // Filter by status
//     if (feedbackStatusFilter !== 'all') {
//       filtered = filtered.filter(feedback => feedback.status === feedbackStatusFilter);
//     }
    
//     // Filter by category
//     if (feedbackCategoryFilter !== 'all') {
//       filtered = filtered.filter(feedback => feedback.category === feedbackCategoryFilter);
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

//         {/* Navigation Tabs - UPDATED WITH FEEDBACK TAB */}
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
//               onClick={() => setActiveTab('analytics')}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all ${
//                 activeTab === 'analytics'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               📈 Analytics
//             </button>
//             {/* NEW FEEDBACK TAB */}
//             <button
//               onClick={() => setActiveTab('feedback')}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all ${
//                 activeTab === 'feedback'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               📝 Feedback ({feedbacks.filter(f => f.status === 'new').length})
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

//           {/* Analytics Tab */}
//           {activeTab === 'analytics' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">Platform Analytics</h2>
//                 <div className="flex items-center space-x-4">
//                   <button
//                     onClick={fetchAnalyticsData}
//                     disabled={analyticsLoading}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors flex items-center"
//                   >
//                     {analyticsLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Loading...
//                       </>
//                     ) : (
//                       '🔄 Refresh Analytics'
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {analyticsLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
//                   <p className="mt-4 text-black text-lg">Loading analytics data...</p>
//                 </div>
//               ) : (
//                 <>
//                   {/* Summary Cards */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Total Users</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalUsers}</p>
//                         </div>
//                         <div className="text-3xl">👥</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Total Jobs</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalJobs}</p>
//                         </div>
//                         <div className="text-3xl">💼</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Referral Jobs</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalReferralJobs}</p>
//                         </div>
//                         <div className="text-3xl">🤝</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Messages</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalMessages}</p>
//                         </div>
//                         <div className="text-3xl">💬</div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Additional Metrics */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                     <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Applications</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalApplications}</p>
//                         </div>
//                         <div className="text-3xl">📄</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Connections</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalConnections}</p>
//                         </div>
//                         <div className="text-3xl">🔗</div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Daily Stats */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {/* Daily Signups */}
//                     <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-md">
//                       <h3 className="text-xl font-semibold text-black mb-4">Daily User Signups (Last 7 Days)</h3>
//                       <div className="space-y-4">
//                         {analyticsData.dailySignups.map((item, index) => (
//                           <div key={index} className="flex items-center justify-between">
//                             <span className="text-black">{item.date}</span>
//                             <div className="flex items-center space-x-3">
//                               <span className="font-medium text-black">{item.count} users</span>
//                               <div className="w-32 bg-gray-200 rounded-full h-3">
//                                 <div 
//                                   className="bg-green-500 h-3 rounded-full" 
//                                   style={{ width: `${(item.count / Math.max(...analyticsData.dailySignups.map(d => d.count)) * 100) || 0}%` }}
//                                 ></div>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Daily Jobs */}
//                     <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-md">
//                       <h3 className="text-xl font-semibold text-black mb-4">Daily Job Posts (Last 7 Days)</h3>
//                       <div className="space-y-4">
//                         {analyticsData.dailyJobs.map((item, index) => (
//                           <div key={index} className="flex items-center justify-between">
//                             <span className="text-black">{item.date}</span>
//                             <div className="flex items-center space-x-3">
//                               <span className="font-medium text-black">{item.count} jobs</span>
//                               <div className="w-32 bg-gray-200 rounded-full h-3">
//                                 <div 
//                                   className="bg-blue-500 h-3 rounded-full" 
//                                   style={{ width: `${(item.count / Math.max(...analyticsData.dailyJobs.map(d => d.count)) * 100) || 0}%` }}
//                                 ></div>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Top Locations */}
//                   {analyticsData.topLocations.length > 0 && (
//                     <div className="mt-8 bg-white p-6 rounded-2xl border border-green-200 shadow-md">
//                       <h3 className="text-xl font-semibold text-black mb-4">Top User Locations</h3>
//                       <div className="space-y-4">
//                         {analyticsData.topLocations.map((location, index) => (
//                           <div key={index} className="flex items-center justify-between">
//                             <div className="flex items-center space-x-3">
//                               <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
//                               <span className="text-black">{location.location}</span>
//                             </div>
//                             <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
//                               {location.count} users
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Export Data */}
//                   <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-300">
//                     <h3 className="text-xl font-semibold text-black mb-4">Data Export</h3>
//                     <p className="text-gray-600 mb-4">Download platform data for further analysis</p>
//                     <button
//                       onClick={() => {
//                         const dataStr = JSON.stringify(analyticsData, null, 2);
//                         const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
//                         const exportFileDefaultName = `all-platform-analytics-${new Date().toISOString().split('T')[0]}.json`;
//                         const linkElement = document.createElement('a');
//                         linkElement.setAttribute('href', dataUri);
//                         linkElement.setAttribute('download', exportFileDefaultName);
//                         linkElement.click();
//                       }}
//                       className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium"
//                     >
//                       📥 Download JSON Export
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* NEW FEEDBACK TAB */}
//           {activeTab === 'feedback' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">User Feedback Management</h2>
//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center space-x-2">
//                     <select
//                       value={feedbackStatusFilter}
//                       onChange={(e) => setFeedbackStatusFilter(e.target.value)}
//                       className="p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     >
//                       <option value="all">All Status</option>
//                       <option value="new">New</option>
//                       <option value="reviewed">Reviewed</option>
//                       <option value="implemented">Implemented</option>
//                     </select>
//                     <select
//                       value={feedbackCategoryFilter}
//                       onChange={(e) => setFeedbackCategoryFilter(e.target.value)}
//                       className="p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     >
//                       <option value="all">All Categories</option>
//                       <option value="bug">Bug</option>
//                       <option value="improvement">Improvement</option>
//                       <option value="feature">Feature Request</option>
//                       <option value="general">General</option>
//                     </select>
//                   </div>
//                   <button
//                     onClick={fetchFeedbacks}
//                     disabled={feedbackLoading}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors flex items-center"
//                   >
//                     {feedbackLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Loading...
//                       </>
//                     ) : (
//                       '🔄 Refresh Feedback'
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {feedbackLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
//                   <p className="mt-4 text-black text-lg">Loading feedback data...</p>
//                 </div>
//               ) : filteredFeedbacks().length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <span className="text-2xl">📝</span>
//                   </div>
//                   <p className="text-black text-lg mb-2">No feedback found</p>
//                   <p className="text-gray-600">Try changing your filter criteria</p>
//                 </div>
//               ) : (
//                 <>
//                   {/* Feedback Stats */}
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                     <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow">
//                       <p className="text-sm opacity-80">Total Feedback</p>
//                       <p className="text-2xl font-bold mt-1">{feedbacks.length}</p>
//                     </div>
//                     <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow">
//                       <p className="text-sm opacity-80">New</p>
//                       <p className="text-2xl font-bold mt-1">{feedbacks.filter(f => f.status === 'new').length}</p>
//                     </div>
//                     <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl shadow">
//                       <p className="text-sm opacity-80">Reviewed</p>
//                       <p className="text-2xl font-bold mt-1">{feedbacks.filter(f => f.status === 'reviewed').length}</p>
//                     </div>
//                     <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-xl shadow">
//                       <p className="text-sm opacity-80">Implemented</p>
//                       <p className="text-2xl font-bold mt-1">{feedbacks.filter(f => f.status === 'implemented').length}</p>
//                     </div>
//                   </div>

//                   {/* Feedback List */}
//                   <div className="grid gap-4 max-h-[600px] overflow-y-auto">
//                     {filteredFeedbacks().map(feedback => (
//                       <div key={feedback.id} className="p-4 border border-purple-200 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
//                         <div className="flex justify-between items-start">
//                           <div className="flex-1">
//                             <div className="flex justify-between items-start mb-3">
//                               <div>
//                                 <h3 className="text-lg font-semibold text-black">{feedback.userName || 'Anonymous User'}</h3>
//                                 <p className="text-sm text-black">{feedback.userEmail}</p>
//                               </div>
//                               <div className="flex items-center space-x-2">
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                   feedback.status === 'new' ? 'bg-blue-100 text-blue-800' :
//                                   feedback.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
//                                   'bg-green-100 text-green-800'
//                                 }`}>
//                                   {feedback.status}
//                                 </span>
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                   feedback.category === 'bug' ? 'bg-red-100 text-red-800' :
//                                   feedback.category === 'improvement' ? 'bg-blue-100 text-blue-800' :
//                                   feedback.category === 'feature' ? 'bg-green-100 text-green-800' :
//                                   'bg-gray-100 text-gray-800'
//                                 }`}>
//                                   {feedback.category}
//                                 </span>
//                                 {feedback.rating && (
//                                   <div className="flex items-center">
//                                     <span className="text-yellow-500 mr-1">★</span>
//                                     <span className="text-sm font-medium">{feedback.rating}/5</span>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
                            
//                             <p className="text-black mb-3 bg-white p-3 rounded-lg border border-gray-200">
//                               {feedback.message}
//                             </p>
                            
//                             <div className="flex flex-wrap gap-2 text-sm text-gray-600">
//                               <span>From page: {feedback.pageUrl?.split('/').pop() || 'Unknown'}</span>
//                               <span>•</span>
//                               <span>Submitted: {feedback.createdAt?.toLocaleDateString?.() || 'Unknown date'}</span>
//                               <span>•</span>
//                               <span>User ID: {feedback.userId?.substring(0, 8)}...</span>
//                             </div>
//                           </div>
                          
//                           <div className="flex flex-col space-y-2 ml-4">
//                             {/* Status Update Buttons */}
//                             {feedback.status !== 'reviewed' && (
//                               <button
//                                 onClick={() => updateFeedbackStatus(feedback.id, 'reviewed')}
//                                 className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-600 whitespace-nowrap"
//                               >
//                                 Mark as Reviewed
//                               </button>
//                             )}
//                             {feedback.status !== 'implemented' && (
//                               <button
//                                 onClick={() => updateFeedbackStatus(feedback.id, 'implemented')}
//                                 className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 whitespace-nowrap"
//                               >
//                                 Mark as Implemented
//                               </button>
//                             )}
//                             {feedback.status === 'new' && (
//                               <button
//                                 onClick={() => {
//                                   if (confirm('Delete this feedback?')) {
//                                     handleDeleteJob(feedback.id, 'feedback', 'feedback');
//                                   }
//                                 }}
//                                 className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 whitespace-nowrap"
//                               >
//                                 Delete
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </>
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

//  Main workin one -----------------------------------------------------------------------------------

// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { useRouter } from 'next/navigation';
// import { 
//   collection, addDoc, getDocs, query, where, orderBy, limit,
//   deleteDoc, updateDoc, doc, setDoc, getDoc, writeBatch, Timestamp 
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
  
//   // State for different sections - ADDED 'storage' TAB
//   const [activeTab, setActiveTab] = useState<'jobs' | 'users' | 'api' | 'config' | 'referral' | 'messages' | 'analytics' | 'feedback' | 'storage'>('jobs');
  
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
  
//   // Analytics state
//   const [analyticsData, setAnalyticsData] = useState({
//     totalUsers: 0,
//     totalJobs: 0,
//     totalReferralJobs: 0,
//     totalMessages: 0,
//     totalApplications: 0,
//     totalConnections: 0,
//     dailySignups: [] as { date: string, count: number }[],
//     dailyJobs: [] as { date: string, count: number }[],
//     topLocations: [] as { location: string, count: number }[]
//   });
//   const [analyticsLoading, setAnalyticsLoading] = useState(false);
  
//   // Search/filter state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedUserType, setSelectedUserType] = useState('all');

//   // FEEDBACK STATE - NEW
//   const [feedbacks, setFeedbacks] = useState<any[]>([]);
//   const [feedbackLoading, setFeedbackLoading] = useState(false);
//   const [feedbackStatusFilter, setFeedbackStatusFilter] = useState('all'); // 'all', 'new', 'reviewed', 'implemented'
//   const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState('all'); // 'all', 'bug', 'improvement', 'feature'

//   // STORAGE MONITORING STATE - NEW
//   const [storageData, setStorageData] = useState({
//     collections: [] as Array<{
//       name: string;
//       documentCount: number;
//       estimatedSizeKB: number;
//       estimatedSizeMB: number;
//       lastUpdated: string;
//     }>,
//     totalDocuments: 0,
//     totalEstimatedSizeKB: 0,
//     totalEstimatedSizeMB: 0,
//     totalEstimatedSizeGB: 0,
//     storageUsagePercentage: 0,
//     oldMessagesCount: 0,
//     oldMessagesSizeMB: 0,
//     cleanupAvailable: false,
//     lastUpdated: new Date().toLocaleString()
//   });
//   const [storageLoading, setStorageLoading] = useState(false);

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

//   // Fetch data based on active tab - ADDED STORAGE TAB
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
//           } else if (activeTab === 'analytics') {
//             await fetchAnalyticsData();
//           } else if (activeTab === 'feedback') {
//             await fetchFeedbacks();
//           } else if (activeTab === 'storage') {
//             await fetchStorageData();
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

//   // FEEDBACK FETCHING FUNCTION - NEW
//   const fetchFeedbacks = async () => {
//     setFeedbackLoading(true);
//     try {
//       const feedbackQuery = query(
//         collection(db, 'feedback'), 
//         orderBy('createdAt', 'desc')
//       );
//       const feedbackSnapshot = await getDocs(feedbackQuery);
//       const feedbackData = feedbackSnapshot.docs.map(doc => ({ 
//         id: doc.id, 
//         ...doc.data(),
//         // Convert Firestore timestamp to Date if needed
//         createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
//       }));
//       setFeedbacks(feedbackData);
//     } catch (error) {
//       console.error('Error fetching feedback:', error);
//       setMessage('Error fetching feedback data');
//     } finally {
//       setFeedbackLoading(false);
//     }
//   };

//   // STORAGE MONITORING FUNCTION - NEW
//   const fetchStorageData = async () => {
//     setStorageLoading(true);
//     try {
//       // List of all collections to monitor
//       const collections = [
//         'users', 'jobs', 'referralJobs', 'apiJobs', 'messages', 
//         'applications', 'connections', 'feedback', 'notifications'
//       ];
      
//       const collectionData = [];
//       let totalDocuments = 0;
//       let totalEstimatedSizeKB = 0;

//       // Average document sizes in KB (estimates based on typical data)
//       const avgSizePerDocKB: Record<string, number> = {
//         'users': 2.5,           // User profiles with bio, skills, etc.
//         'jobs': 3.0,           // Job listings with descriptions
//         'referralJobs': 2.0,   // Referral job posts
//         'apiJobs': 4.0,        // External API jobs with full details
//         'messages': 0.5,       // Text messages (usually small)
//         'applications': 1.5,   // Job applications with cover letters
//         'connections': 0.3,    // Connection requests (small)
//         'feedback': 0.8,       // Feedback submissions
//         'notifications': 0.2   // Notifications (very small)
//       };

//       // Fetch document counts for each collection
//       for (const collectionName of collections) {
//         try {
//           const querySnapshot = await getDocs(collection(db, collectionName));
//           const count = querySnapshot.size;
//           const avgSize = avgSizePerDocKB[collectionName] || 1.0;
//           const estimatedSizeKB = count * avgSize;
          
//           collectionData.push({
//             name: collectionName,
//             documentCount: count,
//             estimatedSizeKB: Math.round(estimatedSizeKB * 100) / 100,
//             estimatedSizeMB: Math.round((estimatedSizeKB / 1024) * 100) / 100,
//             lastUpdated: new Date().toLocaleTimeString()
//           });
          
//           totalDocuments += count;
//           totalEstimatedSizeKB += estimatedSizeKB;
          
//         } catch (error) {
//           console.error(`Error fetching ${collectionName}:`, error);
//           collectionData.push({
//             name: collectionName,
//             documentCount: 0,
//             estimatedSizeKB: 0,
//             estimatedSizeMB: 0,
//             lastUpdated: 'Error'
//           });
//         }
//       }

//       // Calculate total sizes
//       const totalEstimatedSizeMB = Math.round((totalEstimatedSizeKB / 1024) * 100) / 100;
//       const totalEstimatedSizeGB = Math.round((totalEstimatedSizeMB / 1024) * 100) / 100;
      
//       // Calculate storage usage percentage (1GB free tier limit)
//       const storageUsagePercentage = Math.min(100, Math.round((totalEstimatedSizeMB / 1024) * 100));
      
//       // Check for old messages (older than 30 days) for cleanup
//       const thirtyDaysAgo = new Date();
//       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
//       const oldMessagesQuery = query(
//         collection(db, 'messages'),
//         where('timestamp', '<', thirtyDaysAgo)
//       );
      
//       const oldMessagesSnapshot = await getDocs(oldMessagesQuery);
//       const oldMessagesCount = oldMessagesSnapshot.size;
//       const oldMessagesSizeMB = Math.round((oldMessagesCount * avgSizePerDocKB['messages'] / 1024) * 100) / 100;

//       setStorageData({
//         collections: collectionData,
//         totalDocuments,
//         totalEstimatedSizeKB: Math.round(totalEstimatedSizeKB * 100) / 100,
//         totalEstimatedSizeMB,
//         totalEstimatedSizeGB,
//         storageUsagePercentage,
//         oldMessagesCount,
//         oldMessagesSizeMB,
//         cleanupAvailable: oldMessagesCount > 0,
//         lastUpdated: new Date().toLocaleString()
//       });

//     } catch (error) {
//       console.error('Error fetching storage data:', error);
//       setMessage('Error fetching storage data');
//     } finally {
//       setStorageLoading(false);
//     }
//   };

//   // CLEANUP OLD MESSAGES FUNCTION - NEW
//   const cleanupOldMessages = async () => {
//     if (!confirm(`Delete all messages older than 30 days? This will remove ${storageData.oldMessagesCount} messages and free up ${storageData.oldMessagesSizeMB}MB. This action cannot be undone!`)) {
//       return;
//     }

//     setStorageLoading(true);
//     try {
//       const thirtyDaysAgo = new Date();
//       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
//       const oldMessagesQuery = query(
//         collection(db, 'messages'),
//         where('timestamp', '<', thirtyDaysAgo)
//       );
      
//       const oldMessagesSnapshot = await getDocs(oldMessagesQuery);
//       const batch = writeBatch(db);
//       let deletedCount = 0;
      
//       oldMessagesSnapshot.docs.forEach(doc => {
//         batch.delete(doc.ref);
//         deletedCount++;
//       });
      
//       if (deletedCount > 0) {
//         await batch.commit();
//         setMessage(`✅ Successfully deleted ${deletedCount} old messages (older than 30 days)`);
//         await fetchStorageData(); // Refresh storage data
//       } else {
//         setMessage('No old messages found to delete');
//       }
      
//     } catch (error) {
//       console.error('Error cleaning up old messages:', error);
//       setMessage(`❌ Error cleaning up messages: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     } finally {
//       setStorageLoading(false);
//     }
//   };

//   // CLEANUP SPECIFIC COLLECTION FUNCTION - NEW
//   const cleanupCollection = async (collectionName: string) => {
//     if (!confirm(`Delete ALL documents from "${collectionName}" collection? This action cannot be undone!`)) {
//       return;
//     }

//     setStorageLoading(true);
//     try {
//       const querySnapshot = await getDocs(collection(db, collectionName));
//       const batch = writeBatch(db);
//       let deletedCount = 0;
      
//       querySnapshot.docs.forEach(doc => {
//         batch.delete(doc.ref);
//         deletedCount++;
//       });
      
//       if (deletedCount > 0) {
//         await batch.commit();
//         setMessage(`✅ Successfully deleted ${deletedCount} documents from ${collectionName}`);
//         await fetchStorageData(); // Refresh storage data
//       } else {
//         setMessage(`No documents found in ${collectionName}`);
//       }
      
//     } catch (error) {
//       console.error(`Error cleaning up ${collectionName}:`, error);
//       setMessage(`❌ Error cleaning up ${collectionName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     } finally {
//       setStorageLoading(false);
//     }
//   };

//   // FEEDBACK STATUS UPDATE FUNCTION - NEW
//   const updateFeedbackStatus = async (feedbackId: string, newStatus: string) => {
//     try {
//       await updateDoc(doc(db, 'feedback', feedbackId), {
//         status: newStatus,
//         reviewedAt: new Date()
//       });
      
//       setMessage(`✅ Feedback status updated to ${newStatus}`);
      
//       // Refresh feedback list
//       await fetchFeedbacks();
//     } catch (error) {
//       console.error('Error updating feedback status:', error);
//       setMessage('❌ Error updating feedback status');
//     }
//   };

//   // Analytics data fetching - FIXED VERSION
//   const fetchAnalyticsData = async () => {
//     setAnalyticsLoading(true);
//     try {
//       // Fetch all collections for counts
//       const [usersSnapshot, jobsSnapshot, referralJobsSnapshot, messagesSnapshot, applicationsSnapshot, connectionsSnapshot] = await Promise.all([
//         getDocs(collection(db, 'users')),
//         getDocs(collection(db, 'jobs')),
//         getDocs(collection(db, 'referralJobs')),
//         getDocs(collection(db, 'messages')),
//         getDocs(collection(db, 'applications')),
//         getDocs(collection(db, 'connections'))
//       ]);

//       // Calculate daily signups (last 7 days)
//       const last7Days = Array.from({ length: 7 }, (_, i) => {
//         const date = new Date();
//         date.setDate(date.getDate() - i);
//         return date.toISOString().split('T')[0];
//       }).reverse();

//       // Type-safe user data extraction
//       const userDocs = usersSnapshot.docs.map(doc => {
//         const data = doc.data();
//         return {
//           id: doc.id,
//           ...data,
//           location: data.location || null, // Handle missing location field
//           createdAt: data.createdAt || null // Handle missing createdAt field
//         };
//       });

//       const dailySignups = last7Days.map(date => {
//         const count = userDocs.filter(user => {
//           if (!user.createdAt) return false;
//           const userDate = user.createdAt.toDate 
//             ? user.createdAt.toDate().toISOString().split('T')[0] 
//             : null;
//           return userDate === date;
//         }).length;
//         return { date, count };
//       });

//       // Calculate daily jobs (last 7 days)
//       const jobDocs = jobsSnapshot.docs.map(doc => {
//         const data = doc.data();
//         return {
//           id: doc.id,
//           ...data,
//           postedAt: data.postedAt || null
//         };
//       });

//       const dailyJobs = last7Days.map(date => {
//         const count = jobDocs.filter(job => {
//           if (!job.postedAt) return false;
//           const jobDate = job.postedAt.toDate 
//             ? job.postedAt.toDate().toISOString().split('T')[0] 
//             : null;
//           return jobDate === date;
//         }).length;
//         return { date, count };
//       });

//       // Calculate top locations - FIXED: Using type-safe approach
//       const locationCounts: Record<string, number> = {};
//       userDocs.forEach(user => {
//         // Type-safe check for location
//         const userData = user as any; // Type assertion to bypass TypeScript error
//         if (userData.location && typeof userData.location === 'string') {
//           locationCounts[userData.location] = (locationCounts[userData.location] || 0) + 1;
//         }
//       });

//       const topLocations = Object.entries(locationCounts)
//         .map(([location, count]) => ({ location, count }))
//         .sort((a, b) => b.count - a.count)
//         .slice(0, 5);

//       setAnalyticsData({
//         totalUsers: usersSnapshot.size,
//         totalJobs: jobsSnapshot.size,
//         totalReferralJobs: referralJobsSnapshot.size,
//         totalMessages: messagesSnapshot.size,
//         totalApplications: applicationsSnapshot.size,
//         totalConnections: connectionsSnapshot.size,
//         dailySignups,
//         dailyJobs,
//         topLocations
//       });
//     } catch (error) {
//       console.error('Error fetching analytics:', error);
//       setMessage('Error fetching analytics data');
//     } finally {
//       setAnalyticsLoading(false);
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

//   // FEEDBACK FILTER FUNCTION - NEW
//   const filteredFeedbacks = () => {
//     let filtered = feedbacks;
    
//     // Filter by status
//     if (feedbackStatusFilter !== 'all') {
//       filtered = filtered.filter(feedback => feedback.status === feedbackStatusFilter);
//     }
    
//     // Filter by category
//     if (feedbackCategoryFilter !== 'all') {
//       filtered = filtered.filter(feedback => feedback.category === feedbackCategoryFilter);
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

//         {/* Navigation Tabs - UPDATED WITH STORAGE TAB */}
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
//               onClick={() => setActiveTab('analytics')}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all ${
//                 activeTab === 'analytics'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               📈 Analytics
//             </button>
//             {/* NEW STORAGE TAB */}
//             <button
//               onClick={() => setActiveTab('storage')}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all ${
//                 activeTab === 'storage'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               💾 Storage
//             </button>
//             <button
//               onClick={() => setActiveTab('feedback')}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all ${
//                 activeTab === 'feedback'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               📝 Feedback ({feedbacks.filter(f => f.status === 'new').length})
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

//           {/* Analytics Tab */}
//           {activeTab === 'analytics' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">Platform Analytics</h2>
//                 <div className="flex items-center space-x-4">
//                   <button
//                     onClick={fetchAnalyticsData}
//                     disabled={analyticsLoading}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors flex items-center"
//                   >
//                     {analyticsLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Loading...
//                       </>
//                     ) : (
//                       '🔄 Refresh Analytics'
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {analyticsLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
//                   <p className="mt-4 text-black text-lg">Loading analytics data...</p>
//                 </div>
//               ) : (
//                 <>
//                   {/* Summary Cards */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Total Users</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalUsers}</p>
//                         </div>
//                         <div className="text-3xl">👥</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Total Jobs</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalJobs}</p>
//                         </div>
//                         <div className="text-3xl">💼</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Referral Jobs</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalReferralJobs}</p>
//                         </div>
//                         <div className="text-3xl">🤝</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Messages</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalMessages}</p>
//                         </div>
//                         <div className="text-3xl">💬</div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Additional Metrics */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                     <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Applications</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalApplications}</p>
//                         </div>
//                         <div className="text-3xl">📄</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Connections</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalConnections}</p>
//                         </div>
//                         <div className="text-3xl">🔗</div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Daily Stats */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {/* Daily Signups */}
//                     <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-md">
//                       <h3 className="text-xl font-semibold text-black mb-4">Daily User Signups (Last 7 Days)</h3>
//                       <div className="space-y-4">
//                         {analyticsData.dailySignups.map((item, index) => (
//                           <div key={index} className="flex items-center justify-between">
//                             <span className="text-black">{item.date}</span>
//                             <div className="flex items-center space-x-3">
//                               <span className="font-medium text-black">{item.count} users</span>
//                               <div className="w-32 bg-gray-200 rounded-full h-3">
//                                 <div 
//                                   className="bg-green-500 h-3 rounded-full" 
//                                   style={{ width: `${(item.count / Math.max(...analyticsData.dailySignups.map(d => d.count)) * 100) || 0}%` }}
//                                 ></div>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Daily Jobs */}
//                     <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-md">
//                       <h3 className="text-xl font-semibold text-black mb-4">Daily Job Posts (Last 7 Days)</h3>
//                       <div className="space-y-4">
//                         {analyticsData.dailyJobs.map((item, index) => (
//                           <div key={index} className="flex items-center justify-between">
//                             <span className="text-black">{item.date}</span>
//                             <div className="flex items-center space-x-3">
//                               <span className="font-medium text-black">{item.count} jobs</span>
//                               <div className="w-32 bg-gray-200 rounded-full h-3">
//                                 <div 
//                                   className="bg-blue-500 h-3 rounded-full" 
//                                   style={{ width: `${(item.count / Math.max(...analyticsData.dailyJobs.map(d => d.count)) * 100) || 0}%` }}
//                                 ></div>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Top Locations */}
//                   {analyticsData.topLocations.length > 0 && (
//                     <div className="mt-8 bg-white p-6 rounded-2xl border border-green-200 shadow-md">
//                       <h3 className="text-xl font-semibold text-black mb-4">Top User Locations</h3>
//                       <div className="space-y-4">
//                         {analyticsData.topLocations.map((location, index) => (
//                           <div key={index} className="flex items-center justify-between">
//                             <div className="flex items-center space-x-3">
//                               <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
//                               <span className="text-black">{location.location}</span>
//                             </div>
//                             <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
//                               {location.count} users
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Export Data */}
//                   <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-300">
//                     <h3 className="text-xl font-semibold text-black mb-4">Data Export</h3>
//                     <p className="text-gray-600 mb-4">Download platform data for further analysis</p>
//                     <button
//                       onClick={() => {
//                         const dataStr = JSON.stringify(analyticsData, null, 2);
//                         const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
//                         const exportFileDefaultName = `all-platform-analytics-${new Date().toISOString().split('T')[0]}.json`;
//                         const linkElement = document.createElement('a');
//                         linkElement.setAttribute('href', dataUri);
//                         linkElement.setAttribute('download', exportFileDefaultName);
//                         linkElement.click();
//                       }}
//                       className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium"
//                     >
//                       📥 Download JSON Export
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* NEW STORAGE MONITORING TAB */}
//           {activeTab === 'storage' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">Firebase Storage Monitoring</h2>
//                 <div className="flex items-center space-x-4">
//                   <button
//                     onClick={fetchStorageData}
//                     disabled={storageLoading}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors flex items-center"
//                   >
//                     {storageLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Loading...
//                       </>
//                     ) : (
//                       '🔄 Refresh Storage Data'
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {storageLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
//                   <p className="mt-4 text-black text-lg">Loading storage data...</p>
//                 </div>
//               ) : (
//                 <>
//                   {/* Storage Warning Banner */}
//                   {storageData.storageUsagePercentage > 80 && (
//                     <div className="mb-6 p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-3">
//                           <span className="text-2xl">⚠️</span>
//                           <div>
//                             <h3 className="font-bold text-lg">Storage Limit Warning!</h3>
//                             <p className="opacity-90">You're using {storageData.storageUsagePercentage}% of your 1GB Firebase free tier.</p>
//                           </div>
//                         </div>
//                         <button
//                           onClick={cleanupOldMessages}
//                           className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50"
//                         >
//                           Clean Up Now
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   {/* Storage Summary Cards */}
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//                     <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Total Documents</p>
//                           <p className="text-3xl font-bold mt-1">{storageData.totalDocuments.toLocaleString()}</p>
//                         </div>
//                         <div className="text-3xl">📊</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Total Size</p>
//                           <p className="text-3xl font-bold mt-1">{storageData.totalEstimatedSizeMB.toFixed(2)} MB</p>
//                         </div>
//                         <div className="text-3xl">💾</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Free Tier Usage</p>
//                           <p className="text-3xl font-bold mt-1">{storageData.storageUsagePercentage}%</p>
//                         </div>
//                         <div className="text-3xl">📈</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Old Messages</p>
//                           <p className="text-3xl font-bold mt-1">{storageData.oldMessagesCount}</p>
//                         </div>
//                         <div className="text-3xl">🗑️</div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Collection Details Table */}
//                   <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden mb-8">
//                     <div className="p-6 border-b border-gray-200">
//                       <h3 className="text-xl font-semibold text-black">Collection Storage Details</h3>
//                       <p className="text-gray-600 mt-1">Estimated sizes based on document counts</p>
//                     </div>
//                     <div className="overflow-x-auto">
//                       <table className="w-full">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             <th className="p-4 text-left text-black font-semibold">Collection</th>
//                             <th className="p-4 text-left text-black font-semibold">Documents</th>
//                             <th className="p-4 text-left text-black font-semibold">Size (KB)</th>
//                             <th className="p-4 text-left text-black font-semibold">Size (MB)</th>
//                             <th className="p-4 text-left text-black font-semibold">Last Updated</th>
//                             <th className="p-4 text-left text-black font-semibold">Actions</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {storageData.collections.map((collection, index) => (
//                             <tr key={collection.name} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
//                               <td className="p-4 font-medium text-black">{collection.name}</td>
//                               <td className="p-4">
//                                 <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
//                                   {collection.documentCount.toLocaleString()}
//                                 </span>
//                               </td>
//                               <td className="p-4 text-black">{collection.estimatedSizeKB.toFixed(2)} KB</td>
//                               <td className="p-4 text-black">{collection.estimatedSizeMB.toFixed(2)} MB</td>
//                               <td className="p-4 text-gray-600">{collection.lastUpdated}</td>
//                               <td className="p-4">
//                                 {collection.documentCount > 1000 && (
//                                   <button
//                                     onClick={() => cleanupCollection(collection.name)}
//                                     className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
//                                   >
//                                     Cleanup
//                                   </button>
//                                 )}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>

//                   {/* Auto-Cleanup Section */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200">
//                       <h3 className="text-xl font-semibold text-red-800 mb-4">Auto-Cleanup Available</h3>
//                       <div className="space-y-4">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="font-medium text-red-800">Old Messages (&gt;30 days)</p>
//                             <p className="text-sm text-red-600">Messages older than 30 days can be safely deleted</p>
//                           </div>
//                           <span className="bg-red-500 text-white px-3 py-1 rounded-full">
//                             {storageData.oldMessagesCount} messages
//                           </span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="font-medium text-red-800">Storage to Free</p>
//                             <p className="text-sm text-red-600">Estimated space that will be recovered</p>
//                           </div>
//                           <span className="bg-green-500 text-white px-3 py-1 rounded-full">
//                             {storageData.oldMessagesSizeMB.toFixed(2)} MB
//                           </span>
//                         </div>
//                         <button
//                           onClick={cleanupOldMessages}
//                           disabled={!storageData.cleanupAvailable}
//                           className={`w-full py-3 rounded-xl font-medium ${
//                             storageData.cleanupAvailable
//                               ? 'bg-red-500 text-white hover:bg-red-600'
//                               : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                           }`}
//                         >
//                           {storageData.cleanupAvailable 
//                             ? `🗑️ Clean Up ${storageData.oldMessagesCount} Old Messages`
//                             : 'No old messages to clean up'
//                           }
//                         </button>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
//                       <h3 className="text-xl font-semibold text-blue-800 mb-4">Storage Recommendations</h3>
//                       <div className="space-y-3">
//                         <div className="flex items-start space-x-3">
//                           <span className="text-blue-600">💡</span>
//                           <div>
//                             <p className="font-medium text-blue-800">Firebase Free Tier: 1GB</p>
//                             <p className="text-sm text-blue-600">You're using {storageData.totalEstimatedSizeMB.toFixed(2)}MB of 1024MB</p>
//                           </div>
//                         </div>
//                         <div className="flex items-start space-x-3">
//                           <span className="text-green-600">✅</span>
//                           <div>
//                             <p className="font-medium text-blue-800">Regular Cleanup</p>
//                             <p className="text-sm text-blue-600">Clean messages older than 30 days monthly</p>
//                           </div>
//                         </div>
//                         <div className="flex items-start space-x-3">
//                           <span className="text-yellow-600">⚠️</span>
//                           <div>
//                             <p className="font-medium text-blue-800">Monitor Growth</p>
//                             <p className="text-sm text-blue-600">Largest collections: {storageData.collections.slice(0, 3).map(c => c.name).join(', ')}</p>
//                           </div>
//                         </div>
//                         <div className="mt-4 pt-4 border-t border-blue-200">
//                           <p className="text-sm text-blue-600">Last Updated: {storageData.lastUpdated}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Danger Zone */}
//                   <div className="mt-8 bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-300">
//                     <h3 className="text-xl font-semibold text-red-800 mb-4">⚠️ Danger Zone</h3>
//                     <p className="text-red-600 mb-4">These actions will permanently delete data. Use with extreme caution!</p>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <button
//                         onClick={() => cleanupCollection('apiJobs')}
//                         className="bg-red-500 text-white p-4 rounded-xl hover:bg-red-600 font-medium"
//                       >
//                         Clear All API Jobs
//                       </button>
//                       <button
//                         onClick={() => cleanupCollection('messages')}
//                         className="bg-red-500 text-white p-4 rounded-xl hover:bg-red-600 font-medium"
//                       >
//                         Clear All Messages
//                       </button>
//                       <button
//                         onClick={() => {
//                           if (confirm('Delete ALL documents from ALL collections? This will destroy all platform data!')) {
//                             setMessage('Feature not implemented - would require backend function');
//                           }
//                         }}
//                         className="bg-black text-white p-4 rounded-xl hover:bg-gray-800 font-medium"
//                       >
//                         🔥 Nuke Everything
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* NEW FEEDBACK TAB */}
//           {activeTab === 'feedback' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">User Feedback Management</h2>
//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center space-x-2">
//                     <select
//                       value={feedbackStatusFilter}
//                       onChange={(e) => setFeedbackStatusFilter(e.target.value)}
//                       className="p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     >
//                       <option value="all">All Status</option>
//                       <option value="new">New</option>
//                       <option value="reviewed">Reviewed</option>
//                       <option value="implemented">Implemented</option>
//                     </select>
//                     <select
//                       value={feedbackCategoryFilter}
//                       onChange={(e) => setFeedbackCategoryFilter(e.target.value)}
//                       className="p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     >
//                       <option value="all">All Categories</option>
//                       <option value="bug">Bug</option>
//                       <option value="improvement">Improvement</option>
//                       <option value="feature">Feature Request</option>
//                       <option value="general">General</option>
//                     </select>
//                   </div>
//                   <button
//                     onClick={fetchFeedbacks}
//                     disabled={feedbackLoading}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors flex items-center"
//                   >
//                     {feedbackLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Loading...
//                       </>
//                     ) : (
//                       '🔄 Refresh Feedback'
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {feedbackLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
//                   <p className="mt-4 text-black text-lg">Loading feedback data...</p>
//                 </div>
//               ) : filteredFeedbacks().length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <span className="text-2xl">📝</span>
//                   </div>
//                   <p className="text-black text-lg mb-2">No feedback found</p>
//                   <p className="text-gray-600">Try changing your filter criteria</p>
//                 </div>
//               ) : (
//                 <>
//                   {/* Feedback Stats */}
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                     <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow">
//                       <p className="text-sm opacity-80">Total Feedback</p>
//                       <p className="text-2xl font-bold mt-1">{feedbacks.length}</p>
//                     </div>
//                     <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow">
//                       <p className="text-sm opacity-80">New</p>
//                       <p className="text-2xl font-bold mt-1">{feedbacks.filter(f => f.status === 'new').length}</p>
//                     </div>
//                     <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl shadow">
//                       <p className="text-sm opacity-80">Reviewed</p>
//                       <p className="text-2xl font-bold mt-1">{feedbacks.filter(f => f.status === 'reviewed').length}</p>
//                     </div>
//                     <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-xl shadow">
//                       <p className="text-sm opacity-80">Implemented</p>
//                       <p className="text-2xl font-bold mt-1">{feedbacks.filter(f => f.status === 'implemented').length}</p>
//                     </div>
//                   </div>

//                   {/* Feedback List */}
//                   <div className="grid gap-4 max-h-[600px] overflow-y-auto">
//                     {filteredFeedbacks().map(feedback => (
//                       <div key={feedback.id} className="p-4 border border-purple-200 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
//                         <div className="flex justify-between items-start">
//                           <div className="flex-1">
//                             <div className="flex justify-between items-start mb-3">
//                               <div>
//                                 <h3 className="text-lg font-semibold text-black">{feedback.userName || 'Anonymous User'}</h3>
//                                 <p className="text-sm text-black">{feedback.userEmail}</p>
//                               </div>
//                               <div className="flex items-center space-x-2">
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                   feedback.status === 'new' ? 'bg-blue-100 text-blue-800' :
//                                   feedback.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
//                                   'bg-green-100 text-green-800'
//                                 }`}>
//                                   {feedback.status}
//                                 </span>
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                   feedback.category === 'bug' ? 'bg-red-100 text-red-800' :
//                                   feedback.category === 'improvement' ? 'bg-blue-100 text-blue-800' :
//                                   feedback.category === 'feature' ? 'bg-green-100 text-green-800' :
//                                   'bg-gray-100 text-gray-800'
//                                 }`}>
//                                   {feedback.category}
//                                 </span>
//                                 {feedback.rating && (
//                                   <div className="flex items-center">
//                                     <span className="text-yellow-500 mr-1">★</span>
//                                     <span className="text-sm font-medium">{feedback.rating}/5</span>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
                            
//                             <p className="text-black mb-3 bg-white p-3 rounded-lg border border-gray-200">
//                               {feedback.message}
//                             </p>
                            
//                             <div className="flex flex-wrap gap-2 text-sm text-gray-600">
//                               <span>From page: {feedback.pageUrl?.split('/').pop() || 'Unknown'}</span>
//                               <span>•</span>
//                               <span>Submitted: {feedback.createdAt?.toLocaleDateString?.() || 'Unknown date'}</span>
//                               <span>•</span>
//                               <span>User ID: {feedback.userId?.substring(0, 8)}...</span>
//                             </div>
//                           </div>
                          
//                           <div className="flex flex-col space-y-2 ml-4">
//                             {/* Status Update Buttons */}
//                             {feedback.status !== 'reviewed' && (
//                               <button
//                                 onClick={() => updateFeedbackStatus(feedback.id, 'reviewed')}
//                                 className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-600 whitespace-nowrap"
//                               >
//                                 Mark as Reviewed
//                               </button>
//                             )}
//                             {feedback.status !== 'implemented' && (
//                               <button
//                                 onClick={() => updateFeedbackStatus(feedback.id, 'implemented')}
//                                 className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 whitespace-nowrap"
//                               >
//                                 Mark as Implemented
//                               </button>
//                             )}
//                             {feedback.status === 'new' && (
//                               <button
//                                 onClick={() => {
//                                   if (confirm('Delete this feedback?')) {
//                                     handleDeleteJob(feedback.id, 'feedback', 'feedback');
//                                   }
//                                 }}
//                                 className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 whitespace-nowrap"
//                               >
//                                 Delete
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </>
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

// ----------------------- working one -------------------------------------------


// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { useRouter } from 'next/navigation';
// import { 
//   collection, addDoc, getDocs, query, where, orderBy, limit,
//   deleteDoc, updateDoc, doc, setDoc, getDoc, writeBatch, Timestamp,
//   serverTimestamp 
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
  
//   // State for different sections - ADDED 'storage' TAB
//   const [activeTab, setActiveTab] = useState<'jobs' | 'users' | 'api' | 'config' | 'referral' | 'messages' | 'analytics' | 'feedback' | 'storage'>('jobs');
  
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
  
//   // Configuration state - UPDATED WITH AUDIT FIELDS
//   const [configData, setConfigData] = useState({
//     launchDate: '2025-01-01',
//     freePeriodMonths: 3,
//     platformName: 'ALL Platform',
//     isMaintenanceMode: false,
//     maintenanceMessage: 'The platform is currently undergoing maintenance. Please check back soon.',
//     maintenanceToggledAt: null as any,
//     maintenanceToggledBy: '',
//     updatedAt: new Date()
//   });
//   const [showConfigModal, setShowConfigModal] = useState(false);
  
//   // Messages state
//   const [messages, setMessages] = useState<any[]>([]);
  
//   // Analytics state
//   const [analyticsData, setAnalyticsData] = useState({
//     totalUsers: 0,
//     totalJobs: 0,
//     totalReferralJobs: 0,
//     totalMessages: 0,
//     totalApplications: 0,
//     totalConnections: 0,
//     dailySignups: [] as { date: string, count: number }[],
//     dailyJobs: [] as { date: string, count: number }[],
//     topLocations: [] as { location: string, count: number }[]
//   });
//   const [analyticsLoading, setAnalyticsLoading] = useState(false);
  
//   // Search/filter state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedUserType, setSelectedUserType] = useState('all');

//   // FEEDBACK STATE - NEW
//   const [feedbacks, setFeedbacks] = useState<any[]>([]);
//   const [feedbackLoading, setFeedbackLoading] = useState(false);
//   const [feedbackStatusFilter, setFeedbackStatusFilter] = useState('all'); // 'all', 'new', 'reviewed', 'implemented'
//   const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState('all'); // 'all', 'bug', 'improvement', 'feature'

//   // STORAGE MONITORING STATE - NEW
//   const [storageData, setStorageData] = useState({
//     collections: [] as Array<{
//       name: string;
//       documentCount: number;
//       estimatedSizeKB: number;
//       estimatedSizeMB: number;
//       lastUpdated: string;
//     }>,
//     totalDocuments: 0,
//     totalEstimatedSizeKB: 0,
//     totalEstimatedSizeMB: 0,
//     totalEstimatedSizeGB: 0,
//     storageUsagePercentage: 0,
//     oldMessagesCount: 0,
//     oldMessagesSizeMB: 0,
//     cleanupAvailable: false,
//     lastUpdated: new Date().toLocaleString()
//   });
//   const [storageLoading, setStorageLoading] = useState(false);

//   // ==================== AUDIT LOGGING FUNCTION ====================
//   const logAdminAction = async (action: string, details: any = {}) => {
//     try {
//       const auditId = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//       await setDoc(doc(db, 'adminLogs', auditId), {
//         action,
//         userId: user?.uid,
//         userName: user?.displayName || 'Unknown',
//         userEmail: user?.email || 'Unknown',
//         details,
//         timestamp: serverTimestamp(),
//         ipAddress: 'admin_dashboard' // In production, use actual IP detection
//       });
//     } catch (error) {
//       console.error('Failed to log admin action:', error);
//     }
//   };

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

//   // Fetch data based on active tab - ADDED STORAGE TAB
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
//           } else if (activeTab === 'analytics') {
//             await fetchAnalyticsData();
//           } else if (activeTab === 'feedback') {
//             await fetchFeedbacks();
//           } else if (activeTab === 'storage') {
//             await fetchStorageData();
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
//         const data = configDoc.data();
//         setConfigData({
//           launchDate: data.launchDate || '2025-01-01',
//           freePeriodMonths: data.freePeriodMonths || 3,
//           platformName: data.platformName || 'ALL Platform',
//           isMaintenanceMode: data.isMaintenanceMode || false,
//           maintenanceMessage: data.maintenanceMessage || 'The platform is currently undergoing maintenance. Please check back soon.',
//           maintenanceToggledAt: data.maintenanceToggledAt || null,
//           maintenanceToggledBy: data.maintenanceToggledBy || '',
//           updatedAt: data.updatedAt || new Date()
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching config:', error);
//     }
//   };

//   // FEEDBACK FETCHING FUNCTION - NEW
//   const fetchFeedbacks = async () => {
//     setFeedbackLoading(true);
//     try {
//       const feedbackQuery = query(
//         collection(db, 'feedback'), 
//         orderBy('createdAt', 'desc')
//       );
//       const feedbackSnapshot = await getDocs(feedbackQuery);
//       const feedbackData = feedbackSnapshot.docs.map(doc => ({ 
//         id: doc.id, 
//         ...doc.data(),
//         // Convert Firestore timestamp to Date if needed
//         createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
//       }));
//       setFeedbacks(feedbackData);
//     } catch (error) {
//       console.error('Error fetching feedback:', error);
//       setMessage('Error fetching feedback data');
//     } finally {
//       setFeedbackLoading(false);
//     }
//   };

//   // STORAGE MONITORING FUNCTION - NEW
//   const fetchStorageData = async () => {
//     setStorageLoading(true);
//     try {
//       // List of all collections to monitor
//       const collections = [
//         'users', 'jobs', 'referralJobs', 'apiJobs', 'messages', 
//         'applications', 'connections', 'feedback', 'notifications'
//       ];
      
//       const collectionData = [];
//       let totalDocuments = 0;
//       let totalEstimatedSizeKB = 0;

//       // Average document sizes in KB (estimates based on typical data)
//       const avgSizePerDocKB: Record<string, number> = {
//         'users': 2.5,           // User profiles with bio, skills, etc.
//         'jobs': 3.0,           // Job listings with descriptions
//         'referralJobs': 2.0,   // Referral job posts
//         'apiJobs': 4.0,        // External API jobs with full details
//         'messages': 0.5,       // Text messages (usually small)
//         'applications': 1.5,   // Job applications with cover letters
//         'connections': 0.3,    // Connection requests (small)
//         'feedback': 0.8,       // Feedback submissions
//         'notifications': 0.2   // Notifications (very small)
//       };

//       // Fetch document counts for each collection
//       for (const collectionName of collections) {
//         try {
//           const querySnapshot = await getDocs(collection(db, collectionName));
//           const count = querySnapshot.size;
//           const avgSize = avgSizePerDocKB[collectionName] || 1.0;
//           const estimatedSizeKB = count * avgSize;
          
//           collectionData.push({
//             name: collectionName,
//             documentCount: count,
//             estimatedSizeKB: Math.round(estimatedSizeKB * 100) / 100,
//             estimatedSizeMB: Math.round((estimatedSizeKB / 1024) * 100) / 100,
//             lastUpdated: new Date().toLocaleTimeString()
//           });
          
//           totalDocuments += count;
//           totalEstimatedSizeKB += estimatedSizeKB;
          
//         } catch (error) {
//           console.error(`Error fetching ${collectionName}:`, error);
//           collectionData.push({
//             name: collectionName,
//             documentCount: 0,
//             estimatedSizeKB: 0,
//             estimatedSizeMB: 0,
//             lastUpdated: 'Error'
//           });
//         }
//       }

//       // Calculate total sizes
//       const totalEstimatedSizeMB = Math.round((totalEstimatedSizeKB / 1024) * 100) / 100;
//       const totalEstimatedSizeGB = Math.round((totalEstimatedSizeMB / 1024) * 100) / 100;
      
//       // Calculate storage usage percentage (1GB free tier limit)
//       const storageUsagePercentage = Math.min(100, Math.round((totalEstimatedSizeMB / 1024) * 100));
      
//       // Check for old messages (older than 30 days) for cleanup
//       const thirtyDaysAgo = new Date();
//       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
//       const oldMessagesQuery = query(
//         collection(db, 'messages'),
//         where('timestamp', '<', thirtyDaysAgo)
//       );
      
//       const oldMessagesSnapshot = await getDocs(oldMessagesQuery);
//       const oldMessagesCount = oldMessagesSnapshot.size;
//       const oldMessagesSizeMB = Math.round((oldMessagesCount * avgSizePerDocKB['messages'] / 1024) * 100) / 100;

//       setStorageData({
//         collections: collectionData,
//         totalDocuments,
//         totalEstimatedSizeKB: Math.round(totalEstimatedSizeKB * 100) / 100,
//         totalEstimatedSizeMB,
//         totalEstimatedSizeGB,
//         storageUsagePercentage,
//         oldMessagesCount,
//         oldMessagesSizeMB,
//         cleanupAvailable: oldMessagesCount > 0,
//         lastUpdated: new Date().toLocaleString()
//       });

//     } catch (error) {
//       console.error('Error fetching storage data:', error);
//       setMessage('Error fetching storage data');
//     } finally {
//       setStorageLoading(false);
//     }
//   };

//   // CLEANUP OLD MESSAGES FUNCTION - NEW
//   const cleanupOldMessages = async () => {
//     if (!confirm(`Delete all messages older than 30 days? This will remove ${storageData.oldMessagesCount} messages and free up ${storageData.oldMessagesSizeMB}MB. This action cannot be undone!`)) {
//       return;
//     }

//     setStorageLoading(true);
//     try {
//       const thirtyDaysAgo = new Date();
//       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
//       const oldMessagesQuery = query(
//         collection(db, 'messages'),
//         where('timestamp', '<', thirtyDaysAgo)
//       );
      
//       const oldMessagesSnapshot = await getDocs(oldMessagesQuery);
//       const batch = writeBatch(db);
//       let deletedCount = 0;
      
//       oldMessagesSnapshot.docs.forEach(doc => {
//         batch.delete(doc.ref);
//         deletedCount++;
//       });
      
//       if (deletedCount > 0) {
//         await batch.commit();
        
//         // Log the cleanup action
//         await logAdminAction('cleanup_old_messages', {
//           messageCount: deletedCount,
//           freedSpaceMB: storageData.oldMessagesSizeMB,
//           olderThanDays: 30
//         });
        
//         setMessage(`✅ Successfully deleted ${deletedCount} old messages (older than 30 days)`);
//         await fetchStorageData(); // Refresh storage data
//       } else {
//         setMessage('No old messages found to delete');
//       }
      
//     } catch (error) {
//       console.error('Error cleaning up old messages:', error);
//       setMessage(`❌ Error cleaning up messages: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     } finally {
//       setStorageLoading(false);
//     }
//   };

//   // CLEANUP SPECIFIC COLLECTION FUNCTION - NEW
//   const cleanupCollection = async (collectionName: string) => {
//     if (!confirm(`Delete ALL documents from "${collectionName}" collection? This action cannot be undone!`)) {
//       return;
//     }

//     setStorageLoading(true);
//     try {
//       const querySnapshot = await getDocs(collection(db, collectionName));
//       const batch = writeBatch(db);
//       let deletedCount = 0;
      
//       querySnapshot.docs.forEach(doc => {
//         batch.delete(doc.ref);
//         deletedCount++;
//       });
      
//       if (deletedCount > 0) {
//         await batch.commit();
        
//         // Log the cleanup action
//         await logAdminAction('cleanup_collection', {
//           collectionName,
//           documentCount: deletedCount
//         });
        
//         setMessage(`✅ Successfully deleted ${deletedCount} documents from ${collectionName}`);
//         await fetchStorageData(); // Refresh storage data
//       } else {
//         setMessage(`No documents found in ${collectionName}`);
//       }
      
//     } catch (error) {
//       console.error(`Error cleaning up ${collectionName}:`, error);
//       setMessage(`❌ Error cleaning up ${collectionName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     } finally {
//       setStorageLoading(false);
//     }
//   };

//   // FEEDBACK STATUS UPDATE FUNCTION - NEW
//   const updateFeedbackStatus = async (feedbackId: string, newStatus: string) => {
//     try {
//       await updateDoc(doc(db, 'feedback', feedbackId), {
//         status: newStatus,
//         reviewedAt: new Date()
//       });
      
//       // Log the feedback update
//       await logAdminAction('update_feedback_status', {
//         feedbackId,
//         newStatus
//       });
      
//       setMessage(`✅ Feedback status updated to ${newStatus}`);
      
//       // Refresh feedback list
//       await fetchFeedbacks();
//     } catch (error) {
//       console.error('Error updating feedback status:', error);
//       setMessage('❌ Error updating feedback status');
//     }
//   };

//   // Analytics data fetching - FIXED VERSION
//   const fetchAnalyticsData = async () => {
//     setAnalyticsLoading(true);
//     try {
//       // Fetch all collections for counts
//       const [usersSnapshot, jobsSnapshot, referralJobsSnapshot, messagesSnapshot, applicationsSnapshot, connectionsSnapshot] = await Promise.all([
//         getDocs(collection(db, 'users')),
//         getDocs(collection(db, 'jobs')),
//         getDocs(collection(db, 'referralJobs')),
//         getDocs(collection(db, 'messages')),
//         getDocs(collection(db, 'applications')),
//         getDocs(collection(db, 'connections'))
//       ]);

//       // Calculate daily signups (last 7 days)
//       const last7Days = Array.from({ length: 7 }, (_, i) => {
//         const date = new Date();
//         date.setDate(date.getDate() - i);
//         return date.toISOString().split('T')[0];
//       }).reverse();

//       // Type-safe user data extraction
//       const userDocs = usersSnapshot.docs.map(doc => {
//         const data = doc.data();
//         return {
//           id: doc.id,
//           ...data,
//           location: data.location || null, // Handle missing location field
//           createdAt: data.createdAt || null // Handle missing createdAt field
//         };
//       });

//       const dailySignups = last7Days.map(date => {
//         const count = userDocs.filter(user => {
//           if (!user.createdAt) return false;
//           const userDate = user.createdAt.toDate 
//             ? user.createdAt.toDate().toISOString().split('T')[0] 
//             : null;
//           return userDate === date;
//         }).length;
//         return { date, count };
//       });

//       // Calculate daily jobs (last 7 days)
//       const jobDocs = jobsSnapshot.docs.map(doc => {
//         const data = doc.data();
//         return {
//           id: doc.id,
//           ...data,
//           postedAt: data.postedAt || null
//         };
//       });

//       const dailyJobs = last7Days.map(date => {
//         const count = jobDocs.filter(job => {
//           if (!job.postedAt) return false;
//           const jobDate = job.postedAt.toDate 
//             ? job.postedAt.toDate().toISOString().split('T')[0] 
//             : null;
//           return jobDate === date;
//         }).length;
//         return { date, count };
//       });

//       // Calculate top locations - FIXED: Using type-safe approach
//       const locationCounts: Record<string, number> = {};
//       userDocs.forEach(user => {
//         // Type-safe check for location
//         const userData = user as any; // Type assertion to bypass TypeScript error
//         if (userData.location && typeof userData.location === 'string') {
//           locationCounts[userData.location] = (locationCounts[userData.location] || 0) + 1;
//         }
//       });

//       const topLocations = Object.entries(locationCounts)
//         .map(([location, count]) => ({ location, count }))
//         .sort((a, b) => b.count - a.count)
//         .slice(0, 5);

//       setAnalyticsData({
//         totalUsers: usersSnapshot.size,
//         totalJobs: jobsSnapshot.size,
//         totalReferralJobs: referralJobsSnapshot.size,
//         totalMessages: messagesSnapshot.size,
//         totalApplications: applicationsSnapshot.size,
//         totalConnections: connectionsSnapshot.size,
//         dailySignups,
//         dailyJobs,
//         topLocations
//       });
//     } catch (error) {
//       console.error('Error fetching analytics:', error);
//       setMessage('Error fetching analytics data');
//     } finally {
//       setAnalyticsLoading(false);
//     }
//   };

//   // ==================== USER CRUD OPERATIONS ====================
//   const handleMakeAdmin = async (userId: string, userData: any) => {
//     try {
//       await setUserAsAdmin(userId, userData);
      
//       // Log the admin action
//       await logAdminAction('make_admin', {
//         targetUserId: userId,
//         targetUserName: userData.displayName || 'Unknown',
//         targetUserEmail: userData.email || 'Unknown'
//       });
      
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
      
//       // Log the admin action
//       await logAdminAction('remove_admin', {
//         targetUserId: userId,
//         targetUserName: userName
//       });
      
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
      
//       // Log the admin action
//       await logAdminAction('delete_user', {
//         targetUserId: userId,
//         targetUserName: userName
//       });
      
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
      
//       // Log the admin action
//       await logAdminAction('edit_user', {
//         userId: updatedUser.id,
//         userName: updatedUser.displayName,
//         changes: {
//           displayName: updatedUser.displayName,
//           email: updatedUser.email,
//           headline: updatedUser.headline,
//           phoneNumber: updatedUser.phoneNumber
//         }
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
      
//       // Log the admin action
//       await logAdminAction('delete_job', {
//         jobId,
//         jobTitle,
//         collectionName
//       });
      
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
//       const newStatus = !currentStatus;
//       await updateDoc(doc(db, collectionName, jobId), {
//         isActive: newStatus,
//         updatedAt: new Date()
//       });
      
//       // Log the admin action
//       await logAdminAction('toggle_job_status', {
//         jobId,
//         collectionName,
//         oldStatus: currentStatus,
//         newStatus
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
      
//       // Log the config update
//       await logAdminAction('update_config', {
//         changes: configData
//       });
      
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

//   // ==================== MAINTENANCE MODE TOGGLE (FIXED VERSION) ====================
//   const toggleMaintenanceMode = async () => {
//     const newMode = !configData.isMaintenanceMode;
//     const action = newMode ? 'enable' : 'disable';
    
//     if (confirm(`Are you sure you want to ${action} maintenance mode? ${newMode ? 'This will log out ALL users and disable the platform.' : 'This will restore platform access for all users.'}`)) {
//       try {
//         // Update local state immediately for responsive UI
//         setConfigData(prev => ({
//           ...prev, 
//           isMaintenanceMode: newMode,
//           maintenanceToggledAt: new Date(),
//           maintenanceToggledBy: user?.uid || 'admin_dashboard',
//           updatedAt: new Date()
//         }));
        
//         // Save to Firestore with proper timestamp
//         await setDoc(doc(db, 'config', 'subscription'), {
//           ...configData,
//           isMaintenanceMode: newMode,
//           maintenanceToggledAt: new Date(),
//           maintenanceToggledBy: user?.uid,
//           updatedAt: new Date()
//         }, { merge: true });
        
//         // Log the maintenance mode change
//         await logAdminAction(`${action}_maintenance_mode`, {
//           oldValue: !newMode,
//           newValue: newMode,
//           userId: user?.uid,
//           userName: user?.displayName
//         });
        
//         setMessage(`✅ Maintenance mode ${action}d successfully`);
        
//         // Refresh the config data from Firestore to ensure consistency
//         setTimeout(() => {
//           fetchConfig();
//         }, 1000);
        
//       } catch (error) {
//         // Rollback on error
//         setConfigData(prev => ({...prev, isMaintenanceMode: !newMode}));
//         setMessage(`❌ Failed to ${action} maintenance mode: ${error instanceof Error ? error.message : 'Unknown error'}`);
//       }
//     }
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

//   // FEEDBACK FILTER FUNCTION - NEW
//   const filteredFeedbacks = () => {
//     let filtered = feedbacks;
    
//     // Filter by status
//     if (feedbackStatusFilter !== 'all') {
//       filtered = filtered.filter(feedback => feedback.status === feedbackStatusFilter);
//     }
    
//     // Filter by category
//     if (feedbackCategoryFilter !== 'all') {
//       filtered = filtered.filter(feedback => feedback.category === feedbackCategoryFilter);
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

//         {/* Navigation Tabs - UPDATED WITH STORAGE TAB */}
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
//               onClick={() => setActiveTab('analytics')}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all ${
//                 activeTab === 'analytics'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               📈 Analytics
//             </button>
//             {/* NEW STORAGE TAB */}
//             <button
//               onClick={() => setActiveTab('storage')}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all ${
//                 activeTab === 'storage'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               💾 Storage
//             </button>
//             <button
//               onClick={() => setActiveTab('feedback')}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all ${
//                 activeTab === 'feedback'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               📝 Feedback ({feedbacks.filter(f => f.status === 'new').length})
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

//           {/* Analytics Tab */}
//           {activeTab === 'analytics' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">Platform Analytics</h2>
//                 <div className="flex items-center space-x-4">
//                   <button
//                     onClick={fetchAnalyticsData}
//                     disabled={analyticsLoading}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors flex items-center"
//                   >
//                     {analyticsLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Loading...
//                       </>
//                     ) : (
//                       '🔄 Refresh Analytics'
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {analyticsLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
//                   <p className="mt-4 text-black text-lg">Loading analytics data...</p>
//                 </div>
//               ) : (
//                 <>
//                   {/* Summary Cards */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Total Users</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalUsers}</p>
//                         </div>
//                         <div className="text-3xl">👥</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Total Jobs</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalJobs}</p>
//                         </div>
//                         <div className="text-3xl">💼</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Referral Jobs</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalReferralJobs}</p>
//                         </div>
//                         <div className="text-3xl">🤝</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Messages</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalMessages}</p>
//                         </div>
//                         <div className="text-3xl">💬</div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Additional Metrics */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                     <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Applications</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalApplications}</p>
//                         </div>
//                         <div className="text-3xl">📄</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Connections</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalConnections}</p>
//                         </div>
//                         <div className="text-3xl">🔗</div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Daily Stats */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {/* Daily Signups */}
//                     <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-md">
//                       <h3 className="text-xl font-semibold text-black mb-4">Daily User Signups (Last 7 Days)</h3>
//                       <div className="space-y-4">
//                         {analyticsData.dailySignups.map((item, index) => (
//                           <div key={index} className="flex items-center justify-between">
//                             <span className="text-black">{item.date}</span>
//                             <div className="flex items-center space-x-3">
//                               <span className="font-medium text-black">{item.count} users</span>
//                               <div className="w-32 bg-gray-200 rounded-full h-3">
//                                 <div 
//                                   className="bg-green-500 h-3 rounded-full" 
//                                   style={{ width: `${(item.count / Math.max(...analyticsData.dailySignups.map(d => d.count)) * 100) || 0}%` }}
//                                 ></div>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Daily Jobs */}
//                     <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-md">
//                       <h3 className="text-xl font-semibold text-black mb-4">Daily Job Posts (Last 7 Days)</h3>
//                       <div className="space-y-4">
//                         {analyticsData.dailyJobs.map((item, index) => (
//                           <div key={index} className="flex items-center justify-between">
//                             <span className="text-black">{item.date}</span>
//                             <div className="flex items-center space-x-3">
//                               <span className="font-medium text-black">{item.count} jobs</span>
//                               <div className="w-32 bg-gray-200 rounded-full h-3">
//                                 <div 
//                                   className="bg-blue-500 h-3 rounded-full" 
//                                   style={{ width: `${(item.count / Math.max(...analyticsData.dailyJobs.map(d => d.count)) * 100) || 0}%` }}
//                                 ></div>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Top Locations */}
//                   {analyticsData.topLocations.length > 0 && (
//                     <div className="mt-8 bg-white p-6 rounded-2xl border border-green-200 shadow-md">
//                       <h3 className="text-xl font-semibold text-black mb-4">Top User Locations</h3>
//                       <div className="space-y-4">
//                         {analyticsData.topLocations.map((location, index) => (
//                           <div key={index} className="flex items-center justify-between">
//                             <div className="flex items-center space-x-3">
//                               <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
//                               <span className="text-black">{location.location}</span>
//                             </div>
//                             <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
//                               {location.count} users
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Export Data */}
//                   <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-300">
//                     <h3 className="text-xl font-semibold text-black mb-4">Data Export</h3>
//                     <p className="text-gray-600 mb-4">Download platform data for further analysis</p>
//                     <button
//                       onClick={() => {
//                         const dataStr = JSON.stringify(analyticsData, null, 2);
//                         const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
//                         const exportFileDefaultName = `all-platform-analytics-${new Date().toISOString().split('T')[0]}.json`;
//                         const linkElement = document.createElement('a');
//                         linkElement.setAttribute('href', dataUri);
//                         linkElement.setAttribute('download', exportFileDefaultName);
//                         linkElement.click();
//                       }}
//                       className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium"
//                     >
//                       📥 Download JSON Export
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* NEW STORAGE MONITORING TAB */}
//           {activeTab === 'storage' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">Firebase Storage Monitoring</h2>
//                 <div className="flex items-center space-x-4">
//                   <button
//                     onClick={fetchStorageData}
//                     disabled={storageLoading}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors flex items-center"
//                   >
//                     {storageLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Loading...
//                       </>
//                     ) : (
//                       '🔄 Refresh Storage Data'
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {storageLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
//                   <p className="mt-4 text-black text-lg">Loading storage data...</p>
//                 </div>
//               ) : (
//                 <>
//                   {/* Storage Warning Banner */}
//                   {storageData.storageUsagePercentage > 80 && (
//                     <div className="mb-6 p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-3">
//                           <span className="text-2xl">⚠️</span>
//                           <div>
//                             <h3 className="font-bold text-lg">Storage Limit Warning!</h3>
//                             <p className="opacity-90">You're using {storageData.storageUsagePercentage}% of your 1GB Firebase free tier.</p>
//                           </div>
//                         </div>
//                         <button
//                           onClick={cleanupOldMessages}
//                           className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50"
//                         >
//                           Clean Up Now
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   {/* Storage Summary Cards */}
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//                     <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Total Documents</p>
//                           <p className="text-3xl font-bold mt-1">{storageData.totalDocuments.toLocaleString()}</p>
//                         </div>
//                         <div className="text-3xl">📊</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Total Size</p>
//                           <p className="text-3xl font-bold mt-1">{storageData.totalEstimatedSizeMB.toFixed(2)} MB</p>
//                         </div>
//                         <div className="text-3xl">💾</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Free Tier Usage</p>
//                           <p className="text-3xl font-bold mt-1">{storageData.storageUsagePercentage}%</p>
//                         </div>
//                         <div className="text-3xl">📈</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Old Messages</p>
//                           <p className="text-3xl font-bold mt-1">{storageData.oldMessagesCount}</p>
//                         </div>
//                         <div className="text-3xl">🗑️</div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Collection Details Table */}
//                   <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden mb-8">
//                     <div className="p-6 border-b border-gray-200">
//                       <h3 className="text-xl font-semibold text-black">Collection Storage Details</h3>
//                       <p className="text-gray-600 mt-1">Estimated sizes based on document counts</p>
//                     </div>
//                     <div className="overflow-x-auto">
//                       <table className="w-full">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             <th className="p-4 text-left text-black font-semibold">Collection</th>
//                             <th className="p-4 text-left text-black font-semibold">Documents</th>
//                             <th className="p-4 text-left text-black font-semibold">Size (KB)</th>
//                             <th className="p-4 text-left text-black font-semibold">Size (MB)</th>
//                             <th className="p-4 text-left text-black font-semibold">Last Updated</th>
//                             <th className="p-4 text-left text-black font-semibold">Actions</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {storageData.collections.map((collection, index) => (
//                             <tr key={collection.name} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
//                               <td className="p-4 font-medium text-black">{collection.name}</td>
//                               <td className="p-4">
//                                 <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
//                                   {collection.documentCount.toLocaleString()}
//                                 </span>
//                               </td>
//                               <td className="p-4 text-black">{collection.estimatedSizeKB.toFixed(2)} KB</td>
//                               <td className="p-4 text-black">{collection.estimatedSizeMB.toFixed(2)} MB</td>
//                               <td className="p-4 text-gray-600">{collection.lastUpdated}</td>
//                               <td className="p-4">
//                                 {collection.documentCount > 1000 && (
//                                   <button
//                                     onClick={() => cleanupCollection(collection.name)}
//                                     className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
//                                   >
//                                     Cleanup
//                                   </button>
//                                 )}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>

//                   {/* Auto-Cleanup Section */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200">
//                       <h3 className="text-xl font-semibold text-red-800 mb-4">Auto-Cleanup Available</h3>
//                       <div className="space-y-4">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="font-medium text-red-800">Old Messages (&gt;30 days)</p>
//                             <p className="text-sm text-red-600">Messages older than 30 days can be safely deleted</p>
//                           </div>
//                           <span className="bg-red-500 text-white px-3 py-1 rounded-full">
//                             {storageData.oldMessagesCount} messages
//                           </span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="font-medium text-red-800">Storage to Free</p>
//                             <p className="text-sm text-red-600">Estimated space that will be recovered</p>
//                           </div>
//                           <span className="bg-green-500 text-white px-3 py-1 rounded-full">
//                             {storageData.oldMessagesSizeMB.toFixed(2)} MB
//                           </span>
//                         </div>
//                         <button
//                           onClick={cleanupOldMessages}
//                           disabled={!storageData.cleanupAvailable}
//                           className={`w-full py-3 rounded-xl font-medium ${
//                             storageData.cleanupAvailable
//                               ? 'bg-red-500 text-white hover:bg-red-600'
//                               : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                           }`}
//                         >
//                           {storageData.cleanupAvailable 
//                             ? `🗑️ Clean Up ${storageData.oldMessagesCount} Old Messages`
//                             : 'No old messages to clean up'
//                           }
//                         </button>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
//                       <h3 className="text-xl font-semibold text-blue-800 mb-4">Storage Recommendations</h3>
//                       <div className="space-y-3">
//                         <div className="flex items-start space-x-3">
//                           <span className="text-blue-600">💡</span>
//                           <div>
//                             <p className="font-medium text-blue-800">Firebase Free Tier: 1GB</p>
//                             <p className="text-sm text-blue-600">You're using {storageData.totalEstimatedSizeMB.toFixed(2)}MB of 1024MB</p>
//                           </div>
//                         </div>
//                         <div className="flex items-start space-x-3">
//                           <span className="text-green-600">✅</span>
//                           <div>
//                             <p className="font-medium text-blue-800">Regular Cleanup</p>
//                             <p className="text-sm text-blue-600">Clean messages older than 30 days monthly</p>
//                           </div>
//                         </div>
//                         <div className="flex items-start space-x-3">
//                           <span className="text-yellow-600">⚠️</span>
//                           <div>
//                             <p className="font-medium text-blue-800">Monitor Growth</p>
//                             <p className="text-sm text-blue-600">Largest collections: {storageData.collections.slice(0, 3).map(c => c.name).join(', ')}</p>
//                           </div>
//                         </div>
//                         <div className="mt-4 pt-4 border-t border-blue-200">
//                           <p className="text-sm text-blue-600">Last Updated: {storageData.lastUpdated}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Danger Zone */}
//                   <div className="mt-8 bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-300">
//                     <h3 className="text-xl font-semibold text-red-800 mb-4">⚠️ Danger Zone</h3>
//                     <p className="text-red-600 mb-4">These actions will permanently delete data. Use with extreme caution!</p>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <button
//                         onClick={() => cleanupCollection('apiJobs')}
//                         className="bg-red-500 text-white p-4 rounded-xl hover:bg-red-600 font-medium"
//                       >
//                         Clear All API Jobs
//                       </button>
//                       <button
//                         onClick={() => cleanupCollection('messages')}
//                         className="bg-red-500 text-white p-4 rounded-xl hover:bg-red-600 font-medium"
//                       >
//                         Clear All Messages
//                       </button>
//                       <button
//                         onClick={() => {
//                           if (confirm('Delete ALL documents from ALL collections? This will destroy all platform data!')) {
//                             setMessage('Feature not implemented - would require backend function');
//                           }
//                         }}
//                         className="bg-black text-white p-4 rounded-xl hover:bg-gray-800 font-medium"
//                       >
//                         🔥 Nuke Everything
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* NEW FEEDBACK TAB */}
//           {activeTab === 'feedback' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">User Feedback Management</h2>
//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center space-x-2">
//                     <select
//                       value={feedbackStatusFilter}
//                       onChange={(e) => setFeedbackStatusFilter(e.target.value)}
//                       className="p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     >
//                       <option value="all">All Status</option>
//                       <option value="new">New</option>
//                       <option value="reviewed">Reviewed</option>
//                       <option value="implemented">Implemented</option>
//                     </select>
//                     <select
//                       value={feedbackCategoryFilter}
//                       onChange={(e) => setFeedbackCategoryFilter(e.target.value)}
//                       className="p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     >
//                       <option value="all">All Categories</option>
//                       <option value="bug">Bug</option>
//                       <option value="improvement">Improvement</option>
//                       <option value="feature">Feature Request</option>
//                       <option value="general">General</option>
//                     </select>
//                   </div>
//                   <button
//                     onClick={fetchFeedbacks}
//                     disabled={feedbackLoading}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors flex items-center"
//                   >
//                     {feedbackLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Loading...
//                       </>
//                     ) : (
//                       '🔄 Refresh Feedback'
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {feedbackLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
//                   <p className="mt-4 text-black text-lg">Loading feedback data...</p>
//                 </div>
//               ) : filteredFeedbacks().length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <span className="text-2xl">📝</span>
//                   </div>
//                   <p className="text-black text-lg mb-2">No feedback found</p>
//                   <p className="text-gray-600">Try changing your filter criteria</p>
//                 </div>
//               ) : (
//                 <>
//                   {/* Feedback Stats */}
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                     <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow">
//                       <p className="text-sm opacity-80">Total Feedback</p>
//                       <p className="text-2xl font-bold mt-1">{feedbacks.length}</p>
//                     </div>
//                     <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow">
//                       <p className="text-sm opacity-80">New</p>
//                       <p className="text-2xl font-bold mt-1">{feedbacks.filter(f => f.status === 'new').length}</p>
//                     </div>
//                     <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl shadow">
//                       <p className="text-sm opacity-80">Reviewed</p>
//                       <p className="text-2xl font-bold mt-1">{feedbacks.filter(f => f.status === 'reviewed').length}</p>
//                     </div>
//                     <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-xl shadow">
//                       <p className="text-sm opacity-80">Implemented</p>
//                       <p className="text-2xl font-bold mt-1">{feedbacks.filter(f => f.status === 'implemented').length}</p>
//                     </div>
//                   </div>

//                   {/* Feedback List */}
//                   <div className="grid gap-4 max-h-[600px] overflow-y-auto">
//                     {filteredFeedbacks().map(feedback => (
//                       <div key={feedback.id} className="p-4 border border-purple-200 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
//                         <div className="flex justify-between items-start">
//                           <div className="flex-1">
//                             <div className="flex justify-between items-start mb-3">
//                               <div>
//                                 <h3 className="text-lg font-semibold text-black">{feedback.userName || 'Anonymous User'}</h3>
//                                 <p className="text-sm text-black">{feedback.userEmail}</p>
//                               </div>
//                               <div className="flex items-center space-x-2">
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                   feedback.status === 'new' ? 'bg-blue-100 text-blue-800' :
//                                   feedback.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
//                                   'bg-green-100 text-green-800'
//                                 }`}>
//                                   {feedback.status}
//                                 </span>
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                   feedback.category === 'bug' ? 'bg-red-100 text-red-800' :
//                                   feedback.category === 'improvement' ? 'bg-blue-100 text-blue-800' :
//                                   feedback.category === 'feature' ? 'bg-green-100 text-green-800' :
//                                   'bg-gray-100 text-gray-800'
//                                 }`}>
//                                   {feedback.category}
//                                 </span>
//                                 {feedback.rating && (
//                                   <div className="flex items-center">
//                                     <span className="text-yellow-500 mr-1">★</span>
//                                     <span className="text-sm font-medium">{feedback.rating}/5</span>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
                            
//                             <p className="text-black mb-3 bg-white p-3 rounded-lg border border-gray-200">
//                               {feedback.message}
//                             </p>
                            
//                             <div className="flex flex-wrap gap-2 text-sm text-gray-600">
//                               <span>From page: {feedback.pageUrl?.split('/').pop() || 'Unknown'}</span>
//                               <span>•</span>
//                               <span>Submitted: {feedback.createdAt?.toLocaleDateString?.() || 'Unknown date'}</span>
//                               <span>•</span>
//                               <span>User ID: {feedback.userId?.substring(0, 8)}...</span>
//                             </div>
//                           </div>
                          
//                           <div className="flex flex-col space-y-2 ml-4">
//                             {/* Status Update Buttons */}
//                             {feedback.status !== 'reviewed' && (
//                               <button
//                                 onClick={() => updateFeedbackStatus(feedback.id, 'reviewed')}
//                                 className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-600 whitespace-nowrap"
//                               >
//                                 Mark as Reviewed
//                               </button>
//                             )}
//                             {feedback.status !== 'implemented' && (
//                               <button
//                                 onClick={() => updateFeedbackStatus(feedback.id, 'implemented')}
//                                 className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 whitespace-nowrap"
//                               >
//                                 Mark as Implemented
//                               </button>
//                             )}
//                             {feedback.status === 'new' && (
//                               <button
//                                 onClick={() => {
//                                   if (confirm('Delete this feedback?')) {
//                                     handleDeleteJob(feedback.id, 'feedback', 'feedback');
//                                   }
//                                 }}
//                                 className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 whitespace-nowrap"
//                               >
//                                 Delete
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* Configuration Tab - UPDATED WITH FIXED MAINTENANCE MODE TOGGLE */}
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
//                       <div className="flex items-center justify-between mt-1">
//                         <p className={`font-medium ${configData.isMaintenanceMode ? 'text-red-600' : 'text-green-600'}`}>
//                           {configData.isMaintenanceMode ? '🔴 Active' : '🟢 Inactive'}
//                         </p>
//                         {configData.maintenanceToggledAt && (
//                           <p className="text-xs text-gray-500">
//                             Last: {configData.maintenanceToggledAt.toDate?.().toLocaleString() || 'Unknown'}
//                           </p>
//                         )}
//                       </div>
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
//                   {/* FIXED MAINTENANCE MODE TOGGLE */}
//                   <button
//                     onClick={toggleMaintenanceMode}
//                     className={`p-4 rounded-xl text-center font-medium transition-all ${
//                       configData.isMaintenanceMode 
//                         ? 'bg-green-100 text-green-800 border-2 border-green-400 hover:bg-green-200'
//                         : 'bg-red-100 text-red-800 border-2 border-red-400 hover:bg-red-200'
//                     }`}
//                   >
//                     {configData.isMaintenanceMode ? '🟢 Disable Maintenance Mode' : '🔴 Enable Maintenance Mode'}
//                   </button>
                  
//                   <button
//                     onClick={() => {
//                       if (confirm('Clear all API imported jobs? This cannot be undone.')) {
//                         cleanupCollection('apiJobs');
//                       }
//                     }}
//                     className="bg-yellow-100 text-yellow-800 p-4 rounded-xl border border-yellow-300 hover:bg-yellow-200 font-medium"
//                   >
//                     Clear API Jobs
//                   </button>
                  
//                   <button
//                     onClick={() => {
//                       if (confirm('Reset all user notifications? This cannot be undone.')) {
//                         cleanupCollection('notifications');
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

//       {/* Config Modal - UPDATED WITH BETTER MAINTENANCE MODE UI */}
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
              
//               {/* UPDATED MAINTENANCE MODE TOGGLE IN MODAL */}
//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="maintenance"
//                     checked={configData.isMaintenanceMode}
//                     onChange={(e) => {
//                       const newMode = e.target.checked;
//                       setConfigData({...configData, isMaintenanceMode: newMode});
//                     }}
//                     className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
//                   />
//                   <label htmlFor="maintenance" className="ml-3 text-black font-medium">
//                     Enable Maintenance Mode
//                   </label>
//                 </div>
//                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                   configData.isMaintenanceMode 
//                     ? 'bg-red-100 text-red-800' 
//                     : 'bg-green-100 text-green-800'
//                 }`}>
//                   {configData.isMaintenanceMode ? 'ACTIVE' : 'INACTIVE'}
//                 </span>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-black mb-1">Maintenance Message</label>
//                 <textarea
//                   value={configData.maintenanceMessage}
//                   onChange={(e) => setConfigData({...configData, maintenanceMessage: e.target.value})}
//                   className="w-full p-2 border border-gray-300 rounded-lg"
//                   rows={3}
//                   placeholder="Message to show users during maintenance"
//                 />
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

// //////////////////////////////// Working  Version 1 //////////////////////////
// //////////////////////////////// Version 1 //////////////////////////
// //////////////////////////////// Version 1 //////////////////////////
// //////////////////////////////// Version 1 //////////////////////////
// //////////////////////////////// Version 1 //////////////////////////
// //////////////////////////////// Version 1 //////////////////////////


// 'use client';

// import { useState, useEffect, useCallback, useRef } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { useRouter } from 'next/navigation';
// import { 
//   collection, addDoc, getDocs, query, where, orderBy, limit, startAfter,
//   deleteDoc, updateDoc, doc, setDoc, getDoc, writeBatch, Timestamp,
//   serverTimestamp, getCountFromServer, QueryDocumentSnapshot, DocumentData
// } from 'firebase/firestore';
// import { rapidApiConfig } from '@/lib/config';
// import { isAdmin, setUserAsAdmin, removeAdminRole, getAllAdmins } from '@/lib/admin';
// import ErrorBoundary from '@/components/ErrorBoundary';
// import ErrorFallback from '@/components/ErrorFallback';
// import { fetchAdzunaJobs, saveAdzunaJobsToFirestore, AdzunaJob } from '@/lib/adzuna-new';

// // ==================== 🚀 CACHE HELPERS ====================
// const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

// interface CacheData {
//   data: any;
//   timestamp: number;
//   hasMore?: boolean;
//   lastDocId?: string;
// }

// const getCacheKey = (tab: string, filter: string = ''): string => {
//   return `admin_${tab}_${filter}`;
// };

// const getCachedData = (key: string): CacheData | null => {
//   if (typeof window === 'undefined') return null;
//   try {
//     const raw = sessionStorage.getItem(key);
//     if (!raw) return null;
//     const data = JSON.parse(raw);
//     if (Date.now() - data.timestamp > CACHE_EXPIRY_MS) {
//       sessionStorage.removeItem(key);
//       return null;
//     }
//     return data;
//   } catch (e) {
//     return null;
//   }
// };

// const setCachedData = (key: string, data: any, hasMore?: boolean, lastDocId?: string): void => {
//   if (typeof window === 'undefined') return;
//   try {
//     const cacheData: CacheData = { data, timestamp: Date.now() };
//     if (hasMore !== undefined) cacheData.hasMore = hasMore;
//     if (lastDocId) cacheData.lastDocId = lastDocId;
//     sessionStorage.setItem(key, JSON.stringify(cacheData));
//   } catch (e) {
//     // Ignore cache errors
//   }
// };

// const clearCache = (key?: string): void => {
//   if (typeof window === 'undefined') return;
//   if (key) {
//     sessionStorage.removeItem(key);
//   } else {
//     const keys = Object.keys(sessionStorage);
//     keys.forEach(k => {
//       if (k.startsWith('admin_')) sessionStorage.removeItem(k);
//     });
//   }
// };

// // ==================== AUDIT LOGGING ====================
// const logAdminAction = async (action: string, details: any = {}, user: any) => {
//   try {
//     const auditId = `admin_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
//     await setDoc(doc(db, 'adminLogs', auditId), {
//       action,
//       userId: user?.uid,
//       userName: user?.displayName || 'Unknown',
//       userEmail: user?.email || 'Unknown',
//       details,
//       timestamp: serverTimestamp(),
//       ipAddress: 'admin_dashboard'
//     });
//   } catch (error) {
//     console.error('Failed to log admin action:', error);
//   }
// };

// // ==================== MAIN COMPONENT ====================
// function AdminDashboardContent() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [isUserAdmin, setIsUserAdmin] = useState(false);
//   const [loadingAdminCheck, setLoadingAdminCheck] = useState(true);

//   // Tab state
//   const [activeTab, setActiveTab] = useState<'jobs' | 'users' | 'api' | 'config' | 'referral' | 'messages' | 'analytics' | 'feedback' | 'storage'>('jobs');

//   // ==================== USERS STATE ====================
//   const [users, setUsers] = useState<any[]>([]);
//   const [usersLastVisible, setUsersLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
//   const [usersHasMore, setUsersHasMore] = useState(true);
//   const [usersLoading, setUsersLoading] = useState(true);
//   const [usersLoadingMore, setUsersLoadingMore] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedUserType, setSelectedUserType] = useState('all');

//   // ==================== JOBS STATE ====================
//   const [regularJobs, setRegularJobs] = useState<any[]>([]);
//   const [jobsLastVisible, setJobsLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
//   const [jobsHasMore, setJobsHasMore] = useState(true);
//   const [jobsLoading, setJobsLoading] = useState(true);
//   const [jobsLoadingMore, setJobsLoadingMore] = useState(false);

//   // ==================== REFERRAL JOBS STATE ====================
//   const [referralJobs, setReferralJobs] = useState<any[]>([]);
//   const [referralJobsLastVisible, setReferralJobsLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
//   const [referralJobsHasMore, setReferralJobsHasMore] = useState(true);
//   const [referralJobsLoading, setReferralJobsLoading] = useState(true);
//   const [referralJobsLoadingMore, setReferralJobsLoadingMore] = useState(false);

//   // ==================== MESSAGES STATE ====================
//   const [messages, setMessages] = useState<any[]>([]);
//   const [messagesLastVisible, setMessagesLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
//   const [messagesHasMore, setMessagesHasMore] = useState(true);
//   const [messagesLoading, setMessagesLoading] = useState(true);
//   const [messagesLoadingMore, setMessagesLoadingMore] = useState(false);

//   // ==================== API JOBS STATE ====================
//   const [apiJobs, setApiJobs] = useState<any[]>([]);
//   const [adzunaJobs, setAdzunaJobs] = useState<AdzunaJob[]>([]);
//   const [importedJobs, setImportedJobs] = useState<any[]>([]);
//   const [showAllImportedJobs, setShowAllImportedJobs] = useState(false);
//   const [fetchingJobs, setFetchingJobs] = useState(false);
//   const [fetchingAdzunaJobs, setFetchingAdzunaJobs] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('developer');
//   const [searchLocation, setSearchLocation] = useState('India');

//   // ==================== CONFIG STATE ====================
//   const [configData, setConfigData] = useState({
//     launchDate: '2025-01-01',
//     freePeriodMonths: 3,
//     platformName: 'ALL Platform',
//     isMaintenanceMode: false,
//     maintenanceMessage: 'The platform is currently undergoing maintenance. Please check back soon.',
//     maintenanceToggledAt: null as any,
//     maintenanceToggledBy: '',
//     updatedAt: new Date()
//   });
//   const [showConfigModal, setShowConfigModal] = useState(false);

//   // ==================== ADMIN STATE ====================
//   const [admins, setAdmins] = useState<any[]>([]);

//   // ==================== ANALYTICS STATE ====================
//   const [analyticsData, setAnalyticsData] = useState({
//     totalUsers: 0,
//     totalJobs: 0,
//     totalReferralJobs: 0,
//     totalMessages: 0,
//     totalApplications: 0,
//     totalConnections: 0,
//     dailySignups: [] as { date: string, count: number }[],
//     dailyJobs: [] as { date: string, count: number }[],
//     topLocations: [] as { location: string, count: number }[]
//   });
//   const [analyticsLoading, setAnalyticsLoading] = useState(false);

//   // ==================== STORAGE STATE ====================
//   const [storageData, setStorageData] = useState({
//     collections: [] as Array<{
//       name: string;
//       documentCount: number;
//       estimatedSizeKB: number;
//       estimatedSizeMB: number;
//       lastUpdated: string;
//     }>,
//     totalDocuments: 0,
//     totalEstimatedSizeKB: 0,
//     totalEstimatedSizeMB: 0,
//     totalEstimatedSizeGB: 0,
//     storageUsagePercentage: 0,
//     oldMessagesCount: 0,
//     oldMessagesSizeMB: 0,
//     cleanupAvailable: false,
//     lastUpdated: new Date().toLocaleString()
//   });
//   const [storageLoading, setStorageLoading] = useState(false);

//   // ==================== FEEDBACK STATE ====================
//   const [feedbacks, setFeedbacks] = useState<any[]>([]);
//   const [feedbackLoading, setFeedbackLoading] = useState(false);
//   const [feedbackStatusFilter, setFeedbackStatusFilter] = useState('all');
//   const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState('all');

//   // ==================== UI STATE ====================
//   const [message, setMessage] = useState('');
//   const [editingUser, setEditingUser] = useState<any>(null);
//   const [showUserEditModal, setShowUserEditModal] = useState(false);

//   // ==================== CHECK ADMIN STATUS ====================
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

//   // ==================== USERS FETCH (PAGINATED + CACHED) ====================
//   const fetchUsers = useCallback(async (isRefresh = false, isLoadMore = false) => {
//     if (!isUserAdmin) return;

//     const cacheKey = getCacheKey('users', `${searchTerm}_${selectedUserType}`);

//     if (!isRefresh && !isLoadMore) {
//       const cached = getCachedData(cacheKey);
//       if (cached) {
//         setUsers(cached.data);
//         setUsersHasMore(cached.hasMore || false);
//         setUsersLastVisible(null);
//         setUsersLoading(false);
//         return;
//       }
//     }

//     if (isLoadMore) {
//       setUsersLoadingMore(true);
//     } else {
//       setUsersLoading(true);
//     }

//     try {
//       let q = query(
//         collection(db, 'users'),
//         orderBy('displayName'),
//         limit(20)
//       );

//       if (selectedUserType === 'admin') {
//         q = query(q, where('role', '==', 'admin'));
//       } else if (selectedUserType === 'regular') {
//         q = query(q, where('role', '!=', 'admin'));
//       }

//       if (isLoadMore && usersLastVisible) {
//         q = query(q, startAfter(usersLastVisible));
//       }

//       const snapshot = await getDocs(q);
//       const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//       // ✅ FIXED: Using fallback strings to prevent TypeError on undefined and explicit any type
//       const searchTermLower = searchTerm.toLowerCase();
//       const filteredData = searchTerm
//         ? usersData.filter((u: any) =>
//             (u.displayName || '').toLowerCase().includes(searchTermLower) ||
//             (u.email || '').toLowerCase().includes(searchTermLower) ||
//             (u.headline || '').toLowerCase().includes(searchTermLower)
//           )
//         : usersData;

//       if (isLoadMore) {
//         setUsers(prev => [...prev, ...filteredData]);
//       } else {
//         setUsers(filteredData);
//       }

//       const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
//       setUsersLastVisible(lastDoc);
//       setUsersHasMore(snapshot.docs.length === 20);

//       if (!isLoadMore) {
//         setCachedData(cacheKey, filteredData, snapshot.docs.length === 20, lastDoc?.id);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       setMessage(`❌ Error fetching users: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     } finally {
//       setUsersLoading(false);
//       setUsersLoadingMore(false);
//     }
//   }, [usersLastVisible, selectedUserType, searchTerm, isUserAdmin]);

//   // ==================== JOBS FETCH (PAGINATED + CACHED) ====================
//   const fetchRegularJobs = useCallback(async (isRefresh = false, isLoadMore = false) => {
//     if (!isUserAdmin) return;

//     const cacheKey = 'admin_jobs';

//     if (!isRefresh && !isLoadMore) {
//       const cached = getCachedData(cacheKey);
//       if (cached) {
//         setRegularJobs(cached.data);
//         setJobsHasMore(cached.hasMore || false);
//         setJobsLastVisible(null);
//         setJobsLoading(false);
//         return;
//       }
//     }

//     if (isLoadMore) {
//       setJobsLoadingMore(true);
//     } else {
//       setJobsLoading(true);
//     }

//     try {
//       let q = query(
//         collection(db, 'jobs'),
//         orderBy('postedAt', 'desc'),
//         limit(20)
//       );

//       if (isLoadMore && jobsLastVisible) {
//         q = query(q, startAfter(jobsLastVisible));
//       }

//       const snapshot = await getDocs(q);
//       const jobsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//       if (isLoadMore) {
//         setRegularJobs(prev => [...prev, ...jobsData]);
//       } else {
//         setRegularJobs(jobsData);
//       }

//       const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
//       setJobsLastVisible(lastDoc);
//       setJobsHasMore(snapshot.docs.length === 20);

//       if (!isLoadMore) {
//         setCachedData(cacheKey, jobsData, snapshot.docs.length === 20, lastDoc?.id);
//       }
//     } catch (error) {
//       console.error('Error fetching jobs:', error);
//       setMessage(`❌ Error fetching jobs: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     } finally {
//       setJobsLoading(false);
//       setJobsLoadingMore(false);
//     }
//   }, [jobsLastVisible, isUserAdmin]);

//   // ==================== REFERRAL JOBS FETCH (PAGINATED + CACHED) ====================
//   const fetchReferralJobs = useCallback(async (isRefresh = false, isLoadMore = false) => {
//     if (!isUserAdmin) return;

//     const cacheKey = 'admin_referral_jobs';

//     if (!isRefresh && !isLoadMore) {
//       const cached = getCachedData(cacheKey);
//       if (cached) {
//         setReferralJobs(cached.data);
//         setReferralJobsHasMore(cached.hasMore || false);
//         setReferralJobsLastVisible(null);
//         setReferralJobsLoading(false);
//         return;
//       }
//     }

//     if (isLoadMore) {
//       setReferralJobsLoadingMore(true);
//     } else {
//       setReferralJobsLoading(true);
//     }

//     try {
//       let q = query(
//         collection(db, 'referralJobs'),
//         orderBy('postedAt', 'desc'),
//         limit(20)
//       );

//       if (isLoadMore && referralJobsLastVisible) {
//         q = query(q, startAfter(referralJobsLastVisible));
//       }

//       const snapshot = await getDocs(q);
//       const jobsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//       if (isLoadMore) {
//         setReferralJobs(prev => [...prev, ...jobsData]);
//       } else {
//         setReferralJobs(jobsData);
//       }

//       const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
//       setReferralJobsLastVisible(lastDoc);
//       setReferralJobsHasMore(snapshot.docs.length === 20);

//       if (!isLoadMore) {
//         setCachedData(cacheKey, jobsData, snapshot.docs.length === 20, lastDoc?.id);
//       }
//     } catch (error) {
//       console.error('Error fetching referral jobs:', error);
//       setMessage(`❌ Error fetching referral jobs: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     } finally {
//       setReferralJobsLoading(false);
//       setReferralJobsLoadingMore(false);
//     }
//   }, [referralJobsLastVisible, isUserAdmin]);

//   // ==================== MESSAGES FETCH (PAGINATED + CACHED) ====================
//   const fetchMessages = useCallback(async (isRefresh = false, isLoadMore = false) => {
//     if (!isUserAdmin) return;

//     const cacheKey = 'admin_messages';

//     if (!isRefresh && !isLoadMore) {
//       const cached = getCachedData(cacheKey);
//       if (cached) {
//         setMessages(cached.data);
//         setMessagesHasMore(cached.hasMore || false);
//         setMessagesLastVisible(null);
//         setMessagesLoading(false);
//         return;
//       }
//     }

//     if (isLoadMore) {
//       setMessagesLoadingMore(true);
//     } else {
//       setMessagesLoading(true);
//     }

//     try {
//       let q = query(
//         collection(db, 'messages'),
//         orderBy('timestamp', 'desc'),
//         limit(20)
//       );

//       if (isLoadMore && messagesLastVisible) {
//         q = query(q, startAfter(messagesLastVisible));
//       }

//       const snapshot = await getDocs(q);
//       const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//       if (isLoadMore) {
//         setMessages(prev => [...prev, ...messagesData]);
//       } else {
//         setMessages(messagesData);
//       }

//       const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
//       setMessagesLastVisible(lastDoc);
//       setMessagesHasMore(snapshot.docs.length === 20);

//       if (!isLoadMore) {
//         setCachedData(cacheKey, messagesData, snapshot.docs.length === 20, lastDoc?.id);
//       }
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//       setMessage(`❌ Error fetching messages: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     } finally {
//       setMessagesLoading(false);
//       setMessagesLoadingMore(false);
//     }
//   }, [messagesLastVisible, isUserAdmin]);

//   // ==================== FEEDBACK FETCH ====================
//   const fetchFeedbacks = useCallback(async () => {
//     if (!isUserAdmin) return;
//     setFeedbackLoading(true);
//     try {
//       const feedbackQuery = query(
//         collection(db, 'feedback'),
//         orderBy('createdAt', 'desc'),
//         limit(100)
//       );
//       const feedbackSnapshot = await getDocs(feedbackQuery);
//       const feedbackData = feedbackSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//         createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
//       }));
//       setFeedbacks(feedbackData);
//     } catch (error) {
//       console.error('Error fetching feedback:', error);
//       setMessage('❌ Error fetching feedback data');
//     } finally {
//       setFeedbackLoading(false);
//     }
//   }, [isUserAdmin]);

//   // ==================== ANALYTICS FETCH (getCountFromServer + Caching) ====================
//   const fetchAnalyticsData = useCallback(async () => {
//     if (!isUserAdmin) return;

//     const cached = getCachedData('admin_analytics');
//     if (cached) {
//       setAnalyticsData(cached.data);
//       return;
//     }

//     setAnalyticsLoading(true);
//     try {
//       const [
//         usersCountSnap, jobsCountSnap, referralJobsCountSnap,
//         messagesCountSnap, applicationsCountSnap, connectionsCountSnap
//       ] = await Promise.all([
//         getCountFromServer(collection(db, 'users')),
//         getCountFromServer(collection(db, 'jobs')),
//         getCountFromServer(collection(db, 'referralJobs')),
//         getCountFromServer(collection(db, 'messages')),
//         getCountFromServer(collection(db, 'applications')),
//         getCountFromServer(collection(db, 'connections'))
//       ]);

//       const sevenDaysAgo = new Date();
//       sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//       const last7Days = Array.from({ length: 7 }, (_, i) => {
//         const date = new Date();
//         date.setDate(date.getDate() - i);
//         return date.toISOString().split('T')[0];
//       }).reverse();

//       const recentUsersQuery = query(collection(db, 'users'), where('createdAt', '>=', sevenDaysAgo));
//       const recentJobsQuery = query(collection(db, 'jobs'), where('postedAt', '>=', sevenDaysAgo));

//       const [recentUsersSnap, recentJobsSnap] = await Promise.all([
//         getDocs(recentUsersQuery),
//         getDocs(recentJobsQuery)
//       ]);

//       const userDocs = recentUsersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       const jobDocs = recentJobsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//       const dailySignups = last7Days.map(date => {
//         const count = userDocs.filter((user: any) => {
//           if (!user.createdAt) return false;
//           const userDate = user.createdAt.toDate
//             ? user.createdAt.toDate().toISOString().split('T')[0]
//             : null;
//           return userDate === date;
//         }).length;
//         return { date, count };
//       });

//       const dailyJobs = last7Days.map(date => {
//         const count = jobDocs.filter((job: any) => {
//           if (!job.postedAt) return false;
//           const jobDate = job.postedAt.toDate
//             ? job.postedAt.toDate().toISOString().split('T')[0]
//             : null;
//           return jobDate === date;
//         }).length;
//         return { date, count };
//       });

//       const locationSampleQuery = query(collection(db, 'users'), limit(500));
//       const locationSampleSnap = await getDocs(locationSampleQuery);

//       const locationCounts: Record<string, number> = {};
//       locationSampleSnap.docs.forEach(doc => {
//         const userData = doc.data();
//         if (userData.location && typeof userData.location === 'string') {
//           locationCounts[userData.location] = (locationCounts[userData.location] || 0) + 1;
//         }
//       });

//       const topLocations = Object.entries(locationCounts)
//         .map(([location, count]) => ({ location, count }))
//         .sort((a, b) => b.count - a.count)
//         .slice(0, 5);

//       const analyticsData = {
//         totalUsers: usersCountSnap.data().count,
//         totalJobs: jobsCountSnap.data().count,
//         totalReferralJobs: referralJobsCountSnap.data().count,
//         totalMessages: messagesCountSnap.data().count,
//         totalApplications: applicationsCountSnap.data().count,
//         totalConnections: connectionsCountSnap.data().count,
//         dailySignups,
//         dailyJobs,
//         topLocations
//       };

//       setAnalyticsData(analyticsData);
//       setCachedData('admin_analytics', analyticsData);
//     } catch (error) {
//       console.error('Error fetching analytics:', error);
//       setMessage('❌ Error fetching analytics data');
//     } finally {
//       setAnalyticsLoading(false);
//     }
//   }, [isUserAdmin]);

//   // ==================== STORAGE FETCH (getCountFromServer + Caching) ====================
//   const fetchStorageData = useCallback(async () => {
//     if (!isUserAdmin) return;

//     const cached = getCachedData('admin_storage');
//     if (cached) {
//       setStorageData(cached.data);
//       return;
//     }

//     setStorageLoading(true);
//     try {
//       const collections = [
//         'users', 'jobs', 'referralJobs', 'apiJobs', 'messages',
//         'applications', 'connections', 'feedback', 'notifications'
//       ];

//       const avgSizePerDocKB: Record<string, number> = {
//         'users': 2.5,
//         'jobs': 3.0,
//         'referralJobs': 2.0,
//         'apiJobs': 4.0,
//         'messages': 0.5,
//         'applications': 1.5,
//         'connections': 0.3,
//         'feedback': 0.8,
//         'notifications': 0.2
//       };

//       const collectionData = [];
//       let totalDocuments = 0;
//       let totalEstimatedSizeKB = 0;

//       for (const collectionName of collections) {
//         try {
//           const snapshot = await getCountFromServer(collection(db, collectionName));
//           const count = snapshot.data().count;
//           const avgSize = avgSizePerDocKB[collectionName] || 1.0;
//           const estimatedSizeKB = count * avgSize;

//           collectionData.push({
//             name: collectionName,
//             documentCount: count,
//             estimatedSizeKB: Math.round(estimatedSizeKB * 100) / 100,
//             estimatedSizeMB: Math.round((estimatedSizeKB / 1024) * 100) / 100,
//             lastUpdated: new Date().toLocaleTimeString()
//           });

//           totalDocuments += count;
//           totalEstimatedSizeKB += estimatedSizeKB;
//         } catch (error) {
//           console.error(`Error fetching ${collectionName}:`, error);
//           collectionData.push({
//             name: collectionName,
//             documentCount: 0,
//             estimatedSizeKB: 0,
//             estimatedSizeMB: 0,
//             lastUpdated: 'Error'
//           });
//         }
//       }

//       const thirtyDaysAgo = new Date();
//       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//       const oldMessagesQuery = query(
//         collection(db, 'messages'),
//         where('timestamp', '<', thirtyDaysAgo)
//       );
//       const oldMsgSnapshot = await getCountFromServer(oldMessagesQuery);
//       const oldMessagesCount = oldMsgSnapshot.data().count;
//       const oldMessagesSizeMB = Math.round((oldMessagesCount * avgSizePerDocKB['messages'] / 1024) * 100) / 100;

//       const totalEstimatedSizeMB = Math.round((totalEstimatedSizeKB / 1024) * 100) / 100;
//       const totalEstimatedSizeGB = Math.round((totalEstimatedSizeMB / 1024) * 100) / 100;
//       const storageUsagePercentage = Math.min(100, Math.round((totalEstimatedSizeMB / 1024) * 100));

//       const storageData = {
//         collections: collectionData,
//         totalDocuments,
//         totalEstimatedSizeKB: Math.round(totalEstimatedSizeKB * 100) / 100,
//         totalEstimatedSizeMB,
//         totalEstimatedSizeGB,
//         storageUsagePercentage,
//         oldMessagesCount,
//         oldMessagesSizeMB,
//         cleanupAvailable: oldMessagesCount > 0,
//         lastUpdated: new Date().toLocaleString()
//       };

//       setStorageData(storageData);
//       setCachedData('admin_storage', storageData);
//     } catch (error) {
//       console.error('Error fetching storage data:', error);
//       setMessage('❌ Error fetching storage data');
//     } finally {
//       setStorageLoading(false);
//     }
//   }, [isUserAdmin]);

//   // ==================== CLEANUP FUNCTIONS ====================
//   const cleanupOldMessages = async () => {
//     if (!storageData.cleanupAvailable) return;
//     if (!confirm(`Delete all messages older than 30 days? This will remove ${storageData.oldMessagesCount} messages and free up ${storageData.oldMessagesSizeMB}MB. This action cannot be undone!`)) {
//       return;
//     }

//     setStorageLoading(true);
//     try {
//       const thirtyDaysAgo = new Date();
//       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//       const oldMessagesQuery = query(
//         collection(db, 'messages'),
//         where('timestamp', '<', thirtyDaysAgo)
//       );

//       const oldMessagesSnapshot = await getDocs(oldMessagesQuery);
//       const batch = writeBatch(db);
//       let deletedCount = 0;

//       oldMessagesSnapshot.docs.forEach(doc => {
//         batch.delete(doc.ref);
//         deletedCount++;
//       });

//       if (deletedCount > 0) {
//         await batch.commit();
//         await logAdminAction('cleanup_old_messages', {
//           messageCount: deletedCount,
//           freedSpaceMB: storageData.oldMessagesSizeMB,
//           olderThanDays: 30
//         }, user);
//         setMessage(`✅ Successfully deleted ${deletedCount} old messages`);
//         clearCache('admin_storage');
//         await fetchStorageData();
//       } else {
//         setMessage('No old messages found to delete');
//       }
//     } catch (error) {
//       console.error('Error cleaning up old messages:', error);
//       setMessage(`❌ Error cleaning up messages: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     } finally {
//       setStorageLoading(false);
//     }
//   };

//   const cleanupCollection = async (collectionName: string) => {
//     if (!confirm(`Delete ALL documents from "${collectionName}" collection? This action cannot be undone!`)) {
//       return;
//     }

//     setStorageLoading(true);
//     try {
//       const querySnapshot = await getDocs(collection(db, collectionName));
//       const batch = writeBatch(db);
//       let deletedCount = 0;

//       querySnapshot.docs.forEach(doc => {
//         batch.delete(doc.ref);
//         deletedCount++;
//       });

//       if (deletedCount > 0) {
//         await batch.commit();
//         await logAdminAction('cleanup_collection', {
//           collectionName,
//           documentCount: deletedCount
//         }, user);
//         setMessage(`✅ Successfully deleted ${deletedCount} documents from ${collectionName}`);
//         clearCache('admin_storage');
//         await fetchStorageData();
//       } else {
//         setMessage(`No documents found in ${collectionName}`);
//       }
//     } catch (error) {
//       console.error(`Error cleaning up ${collectionName}:`, error);
//       setMessage(`❌ Error cleaning up ${collectionName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     } finally {
//       setStorageLoading(false);
//     }
//   };

//   // ==================== CONFIG FETCH ====================
//   const fetchConfig = useCallback(async () => {
//     if (!isUserAdmin) return;
//     try {
//       const configDoc = await getDoc(doc(db, 'config', 'subscription'));
//       if (configDoc.exists()) {
//         const data = configDoc.data();
//         setConfigData({
//           launchDate: data.launchDate || '2025-01-01',
//           freePeriodMonths: data.freePeriodMonths || 3,
//           platformName: data.platformName || 'ALL Platform',
//           isMaintenanceMode: data.isMaintenanceMode || false,
//           maintenanceMessage: data.maintenanceMessage || 'The platform is currently undergoing maintenance. Please check back soon.',
//           maintenanceToggledAt: data.maintenanceToggledAt || null,
//           maintenanceToggledBy: data.maintenanceToggledBy || '',
//           updatedAt: data.updatedAt || new Date()
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching config:', error);
//     }
//   }, [isUserAdmin]);

//   // ==================== FETCH IMPORTED JOBS ====================
//   const fetchImportedJobs = useCallback(async () => {
//     if (!isUserAdmin) return;
//     try {
//       const apiJobsQuery = query(
//         collection(db, 'apiJobs'),
//         orderBy('fetchedAt', 'desc'),
//         showAllImportedJobs ? limit(1000) : limit(50)
//       );
//       const apiJobsSnapshot = await getDocs(apiJobsQuery);
//       const jobsData = apiJobsSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//         displayDate: doc.data().fetchedAt?.toDate ? doc.data().fetchedAt.toDate() : new Date()
//       }));
//       setImportedJobs(jobsData);
//     } catch (error) {
//       console.error('Error fetching imported jobs:', error);
//     }
//   }, [isUserAdmin, showAllImportedJobs]);

//   // ==================== FETCH ADMINS ====================
//   const fetchAllAdmins = useCallback(async () => {
//     if (!isUserAdmin) return;
//     try {
//       const adminsList = await getAllAdmins();
//       setAdmins(adminsList);
//     } catch (error) {
//       console.error('Error fetching admins:', error);
//     }
//   }, [isUserAdmin]);

//   // ==================== TAB CHANGE EFFECTS ====================
//   useEffect(() => {
//     if (!isUserAdmin) return;

//     const loadTab = async () => {
//       if (activeTab === 'users') {
//         await fetchUsers(false, false);
//       } else if (activeTab === 'jobs') {
//         await fetchRegularJobs(false, false);
//       } else if (activeTab === 'referral') {
//         await fetchReferralJobs(false, false);
//       } else if (activeTab === 'messages') {
//         await fetchMessages(false, false);
//       } else if (activeTab === 'analytics') {
//         await fetchAnalyticsData();
//       } else if (activeTab === 'storage') {
//         await fetchStorageData();
//       } else if (activeTab === 'feedback') {
//         await fetchFeedbacks();
//       } else if (activeTab === 'config') {
//         await fetchConfig();
//       }
//     };

//     loadTab();
//   }, [activeTab, isUserAdmin]);

//   // Re-fetch users when search or filter changes
//   useEffect(() => {
//     if (activeTab === 'users' && isUserAdmin) {
//       setUsersLastVisible(null);
//       setUsersHasMore(true);
//       fetchUsers(false, false);
//     }
//   }, [searchTerm, selectedUserType]);

//   // ==================== USER CRUD OPERATIONS ====================
//   const handleMakeAdmin = async (userId: string, userData: any) => {
//     try {
//       await setUserAsAdmin(userId, userData);
//       await logAdminAction('make_admin', {
//         targetUserId: userId,
//         targetUserName: userData.displayName || 'Unknown',
//         targetUserEmail: userData.email || 'Unknown'
//       }, user);
//       setMessage(`✅ ${userData.displayName || userId} is now an admin`);
//       clearCache(getCacheKey('users', `${searchTerm}_${selectedUserType}`));
//       await fetchUsers(true, false);
//       await fetchAllAdmins();
//     } catch (error) {
//       setMessage(`❌ Error making user admin: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     }
//   };

//   const handleRemoveAdmin = async (userId: string, userName: string) => {
//     if (!confirm(`Are you sure you want to remove admin role from ${userName}?`)) return;
//     try {
//       await removeAdminRole(userId);
//       await logAdminAction('remove_admin', {
//         targetUserId: userId,
//         targetUserName: userName
//       }, user);
//       setMessage(`✅ Admin role removed from ${userName}`);
//       clearCache(getCacheKey('users', `${searchTerm}_${selectedUserType}`));
//       await fetchUsers(true, false);
//       await fetchAllAdmins();
//     } catch (error) {
//       setMessage(`❌ Error removing admin role: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     }
//   };

//   const handleDeleteUser = async (userId: string, userName: string) => {
//     if (!confirm(`Permanently delete user "${userName}"? This cannot be undone!`)) return;
//     try {
//       await deleteDoc(doc(db, 'users', userId));
//       const userJobsQuery = query(collection(db, 'jobs'), where('postedBy', '==', userId));
//       const userJobsSnapshot = await getDocs(userJobsQuery);
//       const deletePromises = userJobsSnapshot.docs.map(doc => deleteDoc(doc.ref));
//       await Promise.all(deletePromises);
//       await logAdminAction('delete_user', {
//         targetUserId: userId,
//         targetUserName: userName
//       }, user);
//       setMessage(`✅ User "${userName}" deleted successfully`);
//       clearCache(getCacheKey('users', `${searchTerm}_${selectedUserType}`));
//       await fetchUsers(true, false);
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
//       await logAdminAction('edit_user', {
//         userId: updatedUser.id,
//         userName: updatedUser.displayName,
//         changes: {
//           displayName: updatedUser.displayName,
//           email: updatedUser.email,
//           headline: updatedUser.headline,
//           phoneNumber: updatedUser.phoneNumber
//         }
//       }, user);
//       setMessage(`✅ User "${updatedUser.displayName}" updated successfully`);
//       setShowUserEditModal(false);
//       setEditingUser(null);
//       clearCache(getCacheKey('users', `${searchTerm}_${selectedUserType}`));
//       await fetchUsers(true, false);
//     } catch (error) {
//       setMessage(`❌ Error updating user: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     }
//   };

//   // ==================== JOB CRUD OPERATIONS ====================
//   const handleDeleteJob = async (jobId: string, jobTitle: string, collectionName: string) => {
//     if (!confirm(`Delete job "${jobTitle}"?`)) return;
//     try {
//       await deleteDoc(doc(db, collectionName, jobId));
//       await logAdminAction('delete_job', {
//         jobId,
//         jobTitle,
//         collectionName
//       }, user);
//       setMessage(`✅ Job "${jobTitle}" deleted`);

//       if (collectionName === 'jobs') {
//         clearCache('admin_jobs');
//         await fetchRegularJobs(true, false);
//       } else if (collectionName === 'referralJobs') {
//         clearCache('admin_referral_jobs');
//         await fetchReferralJobs(true, false);
//       }
//     } catch (error) {
//       setMessage(`❌ Error deleting job: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     }
//   };

//   const handleToggleJobStatus = async (jobId: string, currentStatus: boolean, collectionName: string) => {
//     try {
//       const newStatus = !currentStatus;
//       await updateDoc(doc(db, collectionName, jobId), {
//         isActive: newStatus,
//         updatedAt: new Date()
//       });
//       await logAdminAction('toggle_job_status', {
//         jobId,
//         collectionName,
//         oldStatus: currentStatus,
//         newStatus
//       }, user);
//       setMessage(`✅ Job status updated`);

//       if (collectionName === 'jobs') {
//         clearCache('admin_jobs');
//         await fetchRegularJobs(true, false);
//       } else if (collectionName === 'referralJobs') {
//         clearCache('admin_referral_jobs');
//         await fetchReferralJobs(true, false);
//       }
//     } catch (error) {
//       setMessage(`❌ Error updating job: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     }
//   };

//   // ==================== CONFIG OPERATIONS ====================
//   const handleSaveConfig = async () => {
//     try {
//       await setDoc(doc(db, 'config', 'subscription'), {
//         ...configData,
//         updatedAt: new Date()
//       }, { merge: true });
//       await logAdminAction('update_config', {
//         changes: configData
//       }, user);
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

//   const toggleMaintenanceMode = async () => {
//     const newMode = !configData.isMaintenanceMode;
//     const action = newMode ? 'enable' : 'disable';

//     if (confirm(`Are you sure you want to ${action} maintenance mode? ${newMode ? 'This will log out ALL users and disable the platform.' : 'This will restore platform access for all users.'}`)) {
//       try {
//         setConfigData(prev => ({
//           ...prev,
//           isMaintenanceMode: newMode,
//           maintenanceToggledAt: new Date(),
//           maintenanceToggledBy: user?.uid || 'admin_dashboard',
//           updatedAt: new Date()
//         }));

//         await setDoc(doc(db, 'config', 'subscription'), {
//           ...configData,
//           isMaintenanceMode: newMode,
//           maintenanceToggledAt: new Date(),
//           maintenanceToggledBy: user?.uid,
//           updatedAt: new Date()
//         }, { merge: true });

//         await logAdminAction(`${action}_maintenance_mode`, {
//           oldValue: !newMode,
//           newValue: newMode,
//           userId: user?.uid,
//           userName: user?.displayName
//         }, user);

//         setMessage(`✅ Maintenance mode ${action}d successfully`);
//         setTimeout(() => fetchConfig(), 1000);
//       } catch (error) {
//         setConfigData(prev => ({ ...prev, isMaintenanceMode: !newMode }));
//         setMessage(`❌ Failed to ${action} maintenance mode: ${error instanceof Error ? error.message : 'Unknown error'}`);
//       }
//     }
//   };

//   // ==================== API FUNCTIONS ====================
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

//       await fetchImportedJobs();
//     } catch (error) {
//       console.error('Error importing all jobs:', error);
//       setMessage('Error importing jobs');
//     }
//   };

//   // ==================== FEEDBACK OPERATIONS ====================
//   const updateFeedbackStatus = async (feedbackId: string, newStatus: string) => {
//     try {
//       await updateDoc(doc(db, 'feedback', feedbackId), {
//         status: newStatus,
//         reviewedAt: new Date()
//       });
//       await logAdminAction('update_feedback_status', {
//         feedbackId,
//         newStatus
//       }, user);
//       setMessage(`✅ Feedback status updated to ${newStatus}`);
//       await fetchFeedbacks();
//     } catch (error) {
//       console.error('Error updating feedback status:', error);
//       setMessage('❌ Error updating feedback status');
//     }
//   };

//   // ==================== FILTER HELPERS ====================
//   const filteredFeedbacks = () => {
//     let filtered = feedbacks;
//     if (feedbackStatusFilter !== 'all') {
//       filtered = filtered.filter(feedback => feedback.status === feedbackStatusFilter);
//     }
//     if (feedbackCategoryFilter !== 'all') {
//       filtered = filtered.filter(feedback => feedback.category === feedbackCategoryFilter);
//     }
//     return filtered;
//   };

//   // ✅ FIXED: Explicitly typing 'u' as 'any'
//   const filteredUsers = () => {
//     let filtered = users;
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter((u: any) => 
//         (u.displayName || '').toLowerCase().includes(term) ||
//         (u.email || '').toLowerCase().includes(term) ||
//         (u.headline || '').toLowerCase().includes(term)
//       );
//     }
//     if (selectedUserType === 'admin') {
//       filtered = filtered.filter(user => user.role === 'admin');
//     } else if (selectedUserType === 'regular') {
//       filtered = filtered.filter(user => user.role !== 'admin');
//     }
//     return filtered;
//   };

//   const getDisplayedImportedJobs = () => {
//     return showAllImportedJobs ? importedJobs : importedJobs.slice(0, 20);
//   };

//   // ==================== LOADING & ACCESS DENIED ====================
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
//               onClick={() => { setActiveTab('jobs'); clearCache('admin_jobs'); }}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all whitespace-nowrap ${
//                 activeTab === 'jobs'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               📊 All Jobs
//             </button>
//             <button
//               onClick={() => { setActiveTab('referral'); clearCache('admin_referral_jobs'); }}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all whitespace-nowrap ${
//                 activeTab === 'referral'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               🤝 Referral Jobs
//             </button>
//             <button
//               onClick={() => { setActiveTab('users'); clearCache(getCacheKey('users', `${searchTerm}_${selectedUserType}`)); }}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all whitespace-nowrap ${
//                 activeTab === 'users'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               👥 Users ({users.length})
//             </button>
//             <button
//               onClick={() => { setActiveTab('api'); }}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all whitespace-nowrap ${
//                 activeTab === 'api'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               🔌 API Jobs
//             </button>
//             <button
//               onClick={() => { setActiveTab('messages'); clearCache('admin_messages'); }}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all whitespace-nowrap ${
//                 activeTab === 'messages'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               💬 Messages ({messages.length})
//             </button>
//             <button
//               onClick={() => { setActiveTab('analytics'); clearCache('admin_analytics'); }}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all whitespace-nowrap ${
//                 activeTab === 'analytics'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               📈 Analytics
//             </button>
//             <button
//               onClick={() => { setActiveTab('storage'); clearCache('admin_storage'); }}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all whitespace-nowrap ${
//                 activeTab === 'storage'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               💾 Storage
//             </button>
//             <button
//               onClick={() => { setActiveTab('feedback'); }}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all whitespace-nowrap ${
//                 activeTab === 'feedback'
//                   ? 'bg-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-orange-50'
//               }`}
//             >
//               📝 Feedback ({feedbacks.filter(f => f.status === 'new').length})
//             </button>
//             <button
//               onClick={() => { setActiveTab('config'); }}
//               className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all whitespace-nowrap ${
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

//           {/* ==================== JOBS TAB ==================== */}
//           {activeTab === 'jobs' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">All Platform Jobs</h2>
//                 <div className="flex items-center space-x-4">
//                   <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                     {regularJobs.length} regular jobs
//                   </span>
//                   <button
//                     onClick={() => { setJobsLastVisible(null); setJobsHasMore(true); fetchRegularJobs(true, false); }}
//                     className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors"
//                   >
//                     🔄 Refresh
//                   </button>
//                 </div>
//               </div>

//               {jobsLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mx-auto"></div>
//                   <p className="mt-4 text-black">Loading jobs...</p>
//                 </div>
//               ) : regularJobs.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <span className="text-2xl">📭</span>
//                   </div>
//                   <p className="text-black text-lg mb-2">No jobs found</p>
//                   <p className="text-gray-600">Jobs posted by users will appear here</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="grid gap-4 max-h-[600px] overflow-y-auto">
//                     {regularJobs.map(job => (
//                       <div key={job.id} className="p-4 border border-orange-200 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
//                         <div className="flex justify-between items-start">
//                           <div className="flex-1">
//                             <h3 className="text-lg font-semibold text-black mb-2">{job.title}</h3>
//                             <p className="text-black mb-1">
//                               <span className="font-medium">Company:</span> {job.company}
//                             </p>
//                             <p className="text-black mb-1">
//                               <span className="font-medium">Posted by:</span> {job.postedBy || 'Unknown'}
//                             </p>
//                             <div className="flex items-center space-x-2 mt-2">
//                               <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
//                                 {job.type || 'Full-time'}
//                               </span>
//                               <span className="text-gray-600 text-sm">
//                                 Posted: {job.postedAt?.toDate?.().toLocaleDateString() || 'Unknown date'}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleToggleJobStatus(job.id, job.isActive || true, 'jobs')}
//                               className={`px-3 py-1 rounded-lg text-sm ${
//                                 job.isActive === false
//                                   ? 'bg-green-500 text-white hover:bg-green-600'
//                                   : 'bg-yellow-500 text-white hover:bg-yellow-600'
//                               }`}
//                             >
//                               {job.isActive === false ? 'Activate' : 'Deactivate'}
//                             </button>
//                             <button
//                               onClick={() => handleDeleteJob(job.id, job.title, 'jobs')}
//                               className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   {jobsHasMore && (
//                     <div className="flex justify-center mt-6">
//                       <button
//                         onClick={() => fetchRegularJobs(false, true)}
//                         disabled={jobsLoadingMore}
//                         className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-xl font-medium transition-colors disabled:opacity-50"
//                       >
//                         {jobsLoadingMore ? 'Loading...' : 'Load More Jobs'}
//                       </button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           )}

//           {/* ==================== REFERRAL JOBS TAB ==================== */}
//           {activeTab === 'referral' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">Referral Jobs Management</h2>
//                 <div className="flex items-center space-x-4">
//                   <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                     {referralJobs.length} referral jobs
//                   </span>
//                   <button
//                     onClick={() => { setReferralJobsLastVisible(null); setReferralJobsHasMore(true); fetchReferralJobs(true, false); }}
//                     className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors"
//                   >
//                     🔄 Refresh
//                   </button>
//                 </div>
//               </div>

//               {referralJobsLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mx-auto"></div>
//                   <p className="mt-4 text-black">Loading referral jobs...</p>
//                 </div>
//               ) : referralJobs.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <span className="text-2xl">🤝</span>
//                   </div>
//                   <p className="text-black text-lg mb-2">No referral jobs found</p>
//                   <p className="text-gray-600">Employees haven't posted any referral jobs yet</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="grid gap-4 max-h-[600px] overflow-y-auto">
//                     {referralJobs.map(job => (
//                       <div key={job.id} className="p-4 border border-green-200 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
//                         <div className="flex justify-between items-start">
//                           <div className="flex-1">
//                             <h3 className="text-lg font-semibold text-black mb-2">{job.title}</h3>
//                             <p className="text-black mb-1">
//                               <span className="font-medium">Company:</span> {job.company}
//                             </p>
//                             <p className="text-black mb-1">
//                               <span className="font-medium">Location:</span> {job.location}
//                             </p>
//                             <div className="flex items-center space-x-2 mt-2">
//                               <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                 job.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                               }`}>
//                                 {job.isActive ? 'Active' : 'Inactive'}
//                               </span>
//                               <span className="text-gray-600 text-sm">
//                                 Skills: {job.skills?.slice(0, 3).join(', ')}...
//                               </span>
//                             </div>
//                           </div>
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleToggleJobStatus(job.id, job.isActive || true, 'referralJobs')}
//                               className={`px-3 py-1 rounded-lg text-sm ${
//                                 job.isActive === false
//                                   ? 'bg-green-500 text-white hover:bg-green-600'
//                                   : 'bg-yellow-500 text-white hover:bg-yellow-600'
//                               }`}
//                             >
//                               {job.isActive === false ? 'Activate' : 'Deactivate'}
//                             </button>
//                             <button
//                               onClick={() => handleDeleteJob(job.id, job.title, 'referralJobs')}
//                               className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   {referralJobsHasMore && (
//                     <div className="flex justify-center mt-6">
//                       <button
//                         onClick={() => fetchReferralJobs(false, true)}
//                         disabled={referralJobsLoadingMore}
//                         className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-xl font-medium transition-colors disabled:opacity-50"
//                       >
//                         {referralJobsLoadingMore ? 'Loading...' : 'Load More Referral Jobs'}
//                       </button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           )}

//           {/* ==================== USERS TAB ==================== */}
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
//                     onClick={() => { setUsersLastVisible(null); setUsersHasMore(true); fetchUsers(true, false); }}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//                   >
//                     🔄 Refresh Users
//                   </button>
//                 </div>
//               </div>

//               {usersLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mx-auto"></div>
//                   <p className="mt-4 text-black">Loading users...</p>
//                 </div>
//               ) : users.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <span className="text-2xl">👥</span>
//                   </div>
//                   <p className="text-black text-lg mb-2">No users found</p>
//                   <p className="text-gray-600">Try changing your search criteria</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="grid gap-4 max-h-[600px] overflow-y-auto">
//                     {users.map(user => (
//                       <div key={user.id} className="p-4 border border-orange-200 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <h3 className="text-lg font-semibold text-black">{user.displayName || 'Anonymous User'}</h3>
//                             <p className="text-black">{user.email}</p>
//                             {user.headline && (
//                               <p className="text-sm text-gray-600 mt-1">{user.headline}</p>
//                             )}
//                             <div className="flex items-center space-x-2 mt-2">
//                               <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                 user.role === 'admin'
//                                   ? 'bg-red-100 text-red-800'
//                                   : 'bg-green-100 text-green-800'
//                               }`}>
//                                 {user.role || 'user'}
//                               </span>
//                               {user.phoneNumber && (
//                                 <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
//                                   📱 {user.phoneNumber}
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleEditUser(user)}
//                               className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
//                             >
//                               Edit
//                             </button>
//                             {user.role === 'admin' ? (
//                               <button
//                                 onClick={() => handleRemoveAdmin(user.id, user.displayName)}
//                                 className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-600"
//                               >
//                                 Remove Admin
//                               </button>
//                             ) : (
//                               <button
//                                 onClick={() => handleMakeAdmin(user.id, user)}
//                                 className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-600"
//                               >
//                                 Make Admin
//                               </button>
//                             )}
//                             {user.id !== user?.uid && (
//                               <button
//                                 onClick={() => handleDeleteUser(user.id, user.displayName)}
//                                 className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
//                               >
//                                 Delete
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   {usersHasMore && (
//                     <div className="flex justify-center mt-6">
//                       <button
//                         onClick={() => fetchUsers(false, true)}
//                         disabled={usersLoadingMore}
//                         className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-xl font-medium transition-colors disabled:opacity-50"
//                       >
//                         {usersLoadingMore ? 'Loading...' : 'Load More Users'}
//                       </button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           )}

//           {/* ==================== API TAB ==================== */}
//           {activeTab === 'api' && (
//             <div>
//               <h2 className="text-2xl font-bold text-black mb-6">Fetch Jobs from APIs</h2>

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

//           {/* ==================== MESSAGES TAB ==================== */}
//           {activeTab === 'messages' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">Recent Messages</h2>
//                 <div className="flex items-center space-x-4">
//                   <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                     {messages.length} messages
//                   </span>
//                   <button
//                     onClick={() => { setMessagesLastVisible(null); setMessagesHasMore(true); fetchMessages(true, false); }}
//                     className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors"
//                   >
//                     🔄 Refresh
//                   </button>
//                 </div>
//               </div>

//               {messagesLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mx-auto"></div>
//                   <p className="mt-4 text-black">Loading messages...</p>
//                 </div>
//               ) : messages.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <span className="text-2xl">💬</span>
//                   </div>
//                   <p className="text-black text-lg mb-2">No messages found</p>
//                   <p className="text-gray-600">Users haven't sent any messages yet</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="grid gap-4 max-h-[600px] overflow-y-auto">
//                     {messages.map(msg => (
//                       <div key={msg.id} className="p-4 border border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
//                         <div className="flex justify-between items-start">
//                           <div className="flex-1">
//                             <p className="text-black mb-2">{msg.text || msg.content}</p>
//                             <div className="flex items-center space-x-2">
//                               <span className="text-sm text-gray-600">
//                                 From: {msg.senderId?.substring(0, 8)}...
//                               </span>
//                               <span className="text-sm text-gray-600">
//                                 To: {msg.receiverId?.substring(0, 8)}...
//                               </span>
//                             </div>
//                             <p className="text-xs text-gray-500 mt-1">
//                               {msg.timestamp?.toDate?.().toLocaleString() || msg.createdAt?.toDate?.().toLocaleString() || 'Unknown time'}
//                             </p>
//                           </div>
//                           <button
//                             onClick={() => handleDeleteJob(msg.id, 'message', 'messages')}
//                             className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   {messagesHasMore && (
//                     <div className="flex justify-center mt-6">
//                       <button
//                         onClick={() => fetchMessages(false, true)}
//                         disabled={messagesLoadingMore}
//                         className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-xl font-medium transition-colors disabled:opacity-50"
//                       >
//                         {messagesLoadingMore ? 'Loading...' : 'Load More Messages'}
//                       </button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           )}

//           {/* ==================== ANALYTICS TAB ==================== */}
//           {activeTab === 'analytics' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">Platform Analytics</h2>
//                 <div className="flex items-center space-x-4">
//                   <button
//                     onClick={() => { clearCache('admin_analytics'); fetchAnalyticsData(); }}
//                     disabled={analyticsLoading}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors flex items-center"
//                   >
//                     {analyticsLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Loading...
//                       </>
//                     ) : (
//                       '🔄 Refresh Analytics'
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {analyticsLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
//                   <p className="mt-4 text-black text-lg">Loading analytics data...</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Total Users</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalUsers}</p>
//                         </div>
//                         <div className="text-3xl">👥</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Total Jobs</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalJobs}</p>
//                         </div>
//                         <div className="text-3xl">💼</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Referral Jobs</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalReferralJobs}</p>
//                         </div>
//                         <div className="text-3xl">🤝</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Messages</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalMessages}</p>
//                         </div>
//                         <div className="text-3xl">💬</div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                     <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Applications</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalApplications}</p>
//                         </div>
//                         <div className="text-3xl">📄</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Connections</p>
//                           <p className="text-3xl font-bold mt-2">{analyticsData.totalConnections}</p>
//                         </div>
//                         <div className="text-3xl">🔗</div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-md">
//                       <h3 className="text-xl font-semibold text-black mb-4">Daily User Signups (Last 7 Days)</h3>
//                       <div className="space-y-4">
//                         {analyticsData.dailySignups.map((item, index) => (
//                           <div key={index} className="flex items-center justify-between">
//                             <span className="text-black">{item.date}</span>
//                             <div className="flex items-center space-x-3">
//                               <span className="font-medium text-black">{item.count} users</span>
//                               <div className="w-32 bg-gray-200 rounded-full h-3">
//                                 <div
//                                   className="bg-green-500 h-3 rounded-full"
//                                   style={{ width: `${(item.count / Math.max(...analyticsData.dailySignups.map(d => d.count), 1) * 100) || 0}%` }}
//                                 ></div>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-md">
//                       <h3 className="text-xl font-semibold text-black mb-4">Daily Job Posts (Last 7 Days)</h3>
//                       <div className="space-y-4">
//                         {analyticsData.dailyJobs.map((item, index) => (
//                           <div key={index} className="flex items-center justify-between">
//                             <span className="text-black">{item.date}</span>
//                             <div className="flex items-center space-x-3">
//                               <span className="font-medium text-black">{item.count} jobs</span>
//                               <div className="w-32 bg-gray-200 rounded-full h-3">
//                                 <div
//                                   className="bg-blue-500 h-3 rounded-full"
//                                   style={{ width: `${(item.count / Math.max(...analyticsData.dailyJobs.map(d => d.count), 1) * 100) || 0}%` }}
//                                 ></div>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   {analyticsData.topLocations.length > 0 && (
//                     <div className="mt-8 bg-white p-6 rounded-2xl border border-green-200 shadow-md">
//                       <h3 className="text-xl font-semibold text-black mb-4">Top User Locations</h3>
//                       <div className="space-y-4">
//                         {analyticsData.topLocations.map((location, index) => (
//                           <div key={index} className="flex items-center justify-between">
//                             <div className="flex items-center space-x-3">
//                               <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
//                               <span className="text-black">{location.location}</span>
//                             </div>
//                             <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
//                               {location.count} users
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
//                     <p className="text-sm text-gray-600">💾 Data is cached for 5 minutes</p>
//                     <button
//                       onClick={() => { clearCache('admin_analytics'); fetchAnalyticsData(); }}
//                       className="mt-2 text-xs text-blue-500 underline hover:text-blue-700"
//                     >
//                       Click to refresh and recalculate
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* ==================== STORAGE TAB ==================== */}
//           {activeTab === 'storage' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">Firebase Storage Monitoring</h2>
//                 <div className="flex items-center space-x-4">
//                   <button
//                     onClick={() => { clearCache('admin_storage'); fetchStorageData(); }}
//                     disabled={storageLoading}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors flex items-center"
//                   >
//                     {storageLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Loading...
//                       </>
//                     ) : (
//                       '🔄 Refresh Storage Data'
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {storageLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
//                   <p className="mt-4 text-black text-lg">Loading storage data...</p>
//                 </div>
//               ) : (
//                 <>
//                   {storageData.storageUsagePercentage > 80 && (
//                     <div className="mb-6 p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl shadow-lg">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-3">
//                           <span className="text-2xl">⚠️</span>
//                           <div>
//                             <h3 className="font-bold text-lg">Storage Limit Warning!</h3>
//                             <p className="opacity-90">You're using {storageData.storageUsagePercentage}% of your 1GB Firebase free tier.</p>
//                           </div>
//                         </div>
//                         <button
//                           onClick={cleanupOldMessages}
//                           className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50"
//                         >
//                           Clean Up Now
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//                     <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Total Documents</p>
//                           <p className="text-3xl font-bold mt-1">{storageData.totalDocuments.toLocaleString()}</p>
//                         </div>
//                         <div className="text-3xl">📊</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Total Size</p>
//                           <p className="text-3xl font-bold mt-1">{storageData.totalEstimatedSizeMB.toFixed(2)} MB</p>
//                         </div>
//                         <div className="text-3xl">💾</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Free Tier Usage</p>
//                           <p className="text-3xl font-bold mt-1">{storageData.storageUsagePercentage}%</p>
//                         </div>
//                         <div className="text-3xl">📈</div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm opacity-80">Old Messages</p>
//                           <p className="text-3xl font-bold mt-1">{storageData.oldMessagesCount}</p>
//                         </div>
//                         <div className="text-3xl">🗑️</div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden mb-8">
//                     <div className="p-6 border-b border-gray-200">
//                       <h3 className="text-xl font-semibold text-black">Collection Storage Details</h3>
//                       <p className="text-gray-600 mt-1">Estimated sizes based on document counts</p>
//                     </div>
//                     <div className="overflow-x-auto">
//                       <table className="w-full">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             <th className="p-4 text-left text-black font-semibold">Collection</th>
//                             <th className="p-4 text-left text-black font-semibold">Documents</th>
//                             <th className="p-4 text-left text-black font-semibold">Size (KB)</th>
//                             <th className="p-4 text-left text-black font-semibold">Size (MB)</th>
//                             <th className="p-4 text-left text-black font-semibold">Last Updated</th>
//                             <th className="p-4 text-left text-black font-semibold">Actions</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {storageData.collections.map((collection, index) => (
//                             <tr key={collection.name} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
//                               <td className="p-4 font-medium text-black">{collection.name}</td>
//                               <td className="p-4">
//                                 <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
//                                   {collection.documentCount.toLocaleString()}
//                                 </span>
//                               </td>
//                               <td className="p-4 text-black">{collection.estimatedSizeKB.toFixed(2)} KB</td>
//                               <td className="p-4 text-black">{collection.estimatedSizeMB.toFixed(2)} MB</td>
//                               <td className="p-4 text-gray-600">{collection.lastUpdated}</td>
//                               <td className="p-4">
//                                 {collection.documentCount > 1000 && (
//                                   <button
//                                     onClick={() => cleanupCollection(collection.name)}
//                                     className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
//                                   >
//                                     Cleanup
//                                   </button>
//                                 )}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200">
//                       <h3 className="text-xl font-semibold text-red-800 mb-4">Auto-Cleanup Available</h3>
//                       <div className="space-y-4">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="font-medium text-red-800">Old Messages (&gt;30 days)</p>
//                             <p className="text-sm text-red-600">Messages older than 30 days can be safely deleted</p>
//                           </div>
//                           <span className="bg-red-500 text-white px-3 py-1 rounded-full">
//                             {storageData.oldMessagesCount} messages
//                           </span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="font-medium text-red-800">Storage to Free</p>
//                             <p className="text-sm text-red-600">Estimated space that will be recovered</p>
//                           </div>
//                           <span className="bg-green-500 text-white px-3 py-1 rounded-full">
//                             {storageData.oldMessagesSizeMB.toFixed(2)} MB
//                           </span>
//                         </div>
//                         <button
//                           onClick={cleanupOldMessages}
//                           disabled={!storageData.cleanupAvailable}
//                           className={`w-full py-3 rounded-xl font-medium ${
//                             storageData.cleanupAvailable
//                               ? 'bg-red-500 text-white hover:bg-red-600'
//                               : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                           }`}
//                         >
//                           {storageData.cleanupAvailable 
//                             ? `🗑️ Clean Up ${storageData.oldMessagesCount} Old Messages`
//                             : 'No old messages to clean up'
//                           }
//                         </button>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
//                       <h3 className="text-xl font-semibold text-blue-800 mb-4">Storage Recommendations</h3>
//                       <div className="space-y-3">
//                         <div className="flex items-start space-x-3">
//                           <span className="text-blue-600">💡</span>
//                           <div>
//                             <p className="font-medium text-blue-800">Firebase Free Tier: 1GB</p>
//                             <p className="text-sm text-blue-600">You're using {storageData.totalEstimatedSizeMB.toFixed(2)}MB of 1024MB</p>
//                           </div>
//                         </div>
//                         <div className="flex items-start space-x-3">
//                           <span className="text-green-600">✅</span>
//                           <div>
//                             <p className="font-medium text-blue-800">Regular Cleanup</p>
//                             <p className="text-sm text-blue-600">Clean messages older than 30 days monthly</p>
//                           </div>
//                         </div>
//                         <div className="flex items-start space-x-3">
//                           <span className="text-yellow-600">⚠️</span>
//                           <div>
//                             <p className="font-medium text-blue-800">Monitor Growth</p>
//                             <p className="text-sm text-blue-600">Largest collections: {storageData.collections.slice(0, 3).map(c => c.name).join(', ')}</p>
//                           </div>
//                         </div>
//                         <div className="mt-4 pt-4 border-t border-blue-200">
//                           <p className="text-sm text-blue-600">💾 Data is cached for 5 minutes</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-8 bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-300">
//                     <h3 className="text-xl font-semibold text-red-800 mb-4">⚠️ Danger Zone</h3>
//                     <p className="text-red-600 mb-4">These actions will permanently delete data. Use with extreme caution!</p>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <button
//                         onClick={() => cleanupCollection('apiJobs')}
//                         className="bg-red-500 text-white p-4 rounded-xl hover:bg-red-600 font-medium"
//                       >
//                         Clear All API Jobs
//                       </button>
//                       <button
//                         onClick={() => cleanupCollection('messages')}
//                         className="bg-red-500 text-white p-4 rounded-xl hover:bg-red-600 font-medium"
//                       >
//                         Clear All Messages
//                       </button>
//                       <button
//                         onClick={() => {
//                           if (confirm('Delete ALL documents from ALL collections? This will destroy all platform data!')) {
//                             setMessage('Feature not implemented - would require backend function');
//                           }
//                         }}
//                         className="bg-black text-white p-4 rounded-xl hover:bg-gray-800 font-medium"
//                       >
//                         🔥 Nuke Everything
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* ==================== FEEDBACK TAB ==================== */}
//           {activeTab === 'feedback' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-black">User Feedback Management</h2>
//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center space-x-2">
//                     <select
//                       value={feedbackStatusFilter}
//                       onChange={(e) => setFeedbackStatusFilter(e.target.value)}
//                       className="p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     >
//                       <option value="all">All Status</option>
//                       <option value="new">New</option>
//                       <option value="reviewed">Reviewed</option>
//                       <option value="implemented">Implemented</option>
//                     </select>
//                     <select
//                       value={feedbackCategoryFilter}
//                       onChange={(e) => setFeedbackCategoryFilter(e.target.value)}
//                       className="p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     >
//                       <option value="all">All Categories</option>
//                       <option value="bug">Bug</option>
//                       <option value="improvement">Improvement</option>
//                       <option value="feature">Feature Request</option>
//                       <option value="general">General</option>
//                     </select>
//                   </div>
//                   <button
//                     onClick={fetchFeedbacks}
//                     disabled={feedbackLoading}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors flex items-center"
//                   >
//                     {feedbackLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Loading...
//                       </>
//                     ) : (
//                       '🔄 Refresh Feedback'
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {feedbackLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
//                   <p className="mt-4 text-black text-lg">Loading feedback data...</p>
//                 </div>
//               ) : filteredFeedbacks().length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <span className="text-2xl">📝</span>
//                   </div>
//                   <p className="text-black text-lg mb-2">No feedback found</p>
//                   <p className="text-gray-600">Try changing your filter criteria</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                     <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow">
//                       <p className="text-sm opacity-80">Total Feedback</p>
//                       <p className="text-2xl font-bold mt-1">{feedbacks.length}</p>
//                     </div>
//                     <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow">
//                       <p className="text-sm opacity-80">New</p>
//                       <p className="text-2xl font-bold mt-1">{feedbacks.filter(f => f.status === 'new').length}</p>
//                     </div>
//                     <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl shadow">
//                       <p className="text-sm opacity-80">Reviewed</p>
//                       <p className="text-2xl font-bold mt-1">{feedbacks.filter(f => f.status === 'reviewed').length}</p>
//                     </div>
//                     <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-xl shadow">
//                       <p className="text-sm opacity-80">Implemented</p>
//                       <p className="text-2xl font-bold mt-1">{feedbacks.filter(f => f.status === 'implemented').length}</p>
//                     </div>
//                   </div>

//                   <div className="grid gap-4 max-h-[600px] overflow-y-auto">
//                     {filteredFeedbacks().map(feedback => (
//                       <div key={feedback.id} className="p-4 border border-purple-200 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
//                         <div className="flex justify-between items-start">
//                           <div className="flex-1">
//                             <div className="flex justify-between items-start mb-3">
//                               <div>
//                                 <h3 className="text-lg font-semibold text-black">{feedback.userName || 'Anonymous User'}</h3>
//                                 <p className="text-sm text-black">{feedback.userEmail}</p>
//                               </div>
//                               <div className="flex items-center space-x-2">
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                   feedback.status === 'new' ? 'bg-blue-100 text-blue-800' :
//                                   feedback.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
//                                   'bg-green-100 text-green-800'
//                                 }`}>
//                                   {feedback.status}
//                                 </span>
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                   feedback.category === 'bug' ? 'bg-red-100 text-red-800' :
//                                   feedback.category === 'improvement' ? 'bg-blue-100 text-blue-800' :
//                                   feedback.category === 'feature' ? 'bg-green-100 text-green-800' :
//                                   'bg-gray-100 text-gray-800'
//                                 }`}>
//                                   {feedback.category}
//                                 </span>
//                                 {feedback.rating && (
//                                   <div className="flex items-center">
//                                     <span className="text-yellow-500 mr-1">★</span>
//                                     <span className="text-sm font-medium">{feedback.rating}/5</span>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
                            
//                             <p className="text-black mb-3 bg-white p-3 rounded-lg border border-gray-200">
//                               {feedback.message}
//                             </p>
                            
//                             <div className="flex flex-wrap gap-2 text-sm text-gray-600">
//                               <span>From page: {feedback.pageUrl?.split('/').pop() || 'Unknown'}</span>
//                               <span>•</span>
//                               <span>Submitted: {feedback.createdAt?.toLocaleDateString?.() || 'Unknown date'}</span>
//                               <span>•</span>
//                               <span>User ID: {feedback.userId?.substring(0, 8)}...</span>
//                             </div>
//                           </div>
                          
//                           <div className="flex flex-col space-y-2 ml-4">
//                             {feedback.status !== 'reviewed' && (
//                               <button
//                                 onClick={() => updateFeedbackStatus(feedback.id, 'reviewed')}
//                                 className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-600 whitespace-nowrap"
//                               >
//                                 Mark as Reviewed
//                               </button>
//                             )}
//                             {feedback.status !== 'implemented' && (
//                               <button
//                                 onClick={() => updateFeedbackStatus(feedback.id, 'implemented')}
//                                 className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 whitespace-nowrap"
//                               >
//                                 Mark as Implemented
//                               </button>
//                             )}
//                             {feedback.status === 'new' && (
//                               <button
//                                 onClick={() => {
//                                   if (confirm('Delete this feedback?')) {
//                                     handleDeleteJob(feedback.id, 'feedback', 'feedback');
//                                   }
//                                 }}
//                                 className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 whitespace-nowrap"
//                               >
//                                 Delete
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* ==================== CONFIG TAB ==================== */}
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
//                       <div className="flex items-center justify-between mt-1">
//                         <p className={`font-medium ${configData.isMaintenanceMode ? 'text-red-600' : 'text-green-600'}`}>
//                           {configData.isMaintenanceMode ? '🔴 Active' : '🟢 Inactive'}
//                         </p>
//                         {configData.maintenanceToggledAt && (
//                           <p className="text-xs text-gray-500">
//                             Last: {(configData.maintenanceToggledAt instanceof Date ? configData.maintenanceToggledAt : configData.maintenanceToggledAt.toDate?.())?.toLocaleString() || 'Unknown'}
//                           </p>
//                         )}
//                       </div>
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
//                     onClick={toggleMaintenanceMode}
//                     className={`p-4 rounded-xl text-center font-medium transition-all ${
//                       configData.isMaintenanceMode 
//                         ? 'bg-green-100 text-green-800 border-2 border-green-400 hover:bg-green-200'
//                         : 'bg-red-100 text-red-800 border-2 border-red-400 hover:bg-red-200'
//                     }`}
//                   >
//                     {configData.isMaintenanceMode ? '🟢 Disable Maintenance Mode' : '🔴 Enable Maintenance Mode'}
//                   </button>
                  
//                   <button
//                     onClick={() => {
//                       if (confirm('Clear all API imported jobs? This cannot be undone.')) {
//                         cleanupCollection('apiJobs');
//                       }
//                     }}
//                     className="bg-yellow-100 text-yellow-800 p-4 rounded-xl border border-yellow-300 hover:bg-yellow-200 font-medium"
//                   >
//                     Clear API Jobs
//                   </button>
                  
//                   <button
//                     onClick={() => {
//                       if (confirm('Reset all user notifications? This cannot be undone.')) {
//                         cleanupCollection('notifications');
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
              
//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="maintenance"
//                     checked={configData.isMaintenanceMode}
//                     onChange={(e) => {
//                       const newMode = e.target.checked;
//                       setConfigData({...configData, isMaintenanceMode: newMode});
//                     }}
//                     className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
//                   />
//                   <label htmlFor="maintenance" className="ml-3 text-black font-medium">
//                     Enable Maintenance Mode
//                   </label>
//                 </div>
//                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                   configData.isMaintenanceMode 
//                     ? 'bg-red-100 text-red-800' 
//                     : 'bg-green-100 text-green-800'
//                 }`}>
//                   {configData.isMaintenanceMode ? 'ACTIVE' : 'INACTIVE'}
//                 </span>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-black mb-1">Maintenance Message</label>
//                 <textarea
//                   value={configData.maintenanceMessage}
//                   onChange={(e) => setConfigData({...configData, maintenanceMessage: e.target.value})}
//                   className="w-full p-2 border border-gray-300 rounded-lg"
//                   rows={3}
//                   placeholder="Message to show users during maintenance"
//                 />
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

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import {
  collection, addDoc, getDocs, query, where, orderBy, limit,
  deleteDoc, updateDoc, doc, setDoc, getDoc, writeBatch,
  serverTimestamp, getCountFromServer,
  QueryConstraint
} from 'firebase/firestore';
import { fetchAdzunaJobs, saveAdzunaJobsToFirestore, AdzunaJob } from '@/lib/adzuna-new';
import { isAdmin, setUserAsAdmin, removeAdminRole, getAllAdmins } from '@/lib/admin';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorFallback from '@/components/ErrorFallback';
import { Toaster, toast } from 'react-hot-toast';
import { useDebounce } from 'use-debounce';
import { useFirebasePagination } from '@/hooks/useFirebasePagination';

// ==================== CACHE HELPERS (used by analytics & storage) ====================
const CACHE_EXPIRY_MS = 5 * 60 * 1000;

interface CacheData {
  data: any;
  timestamp: number;
}

const getCachedData = (key: string): CacheData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - data.timestamp > CACHE_EXPIRY_MS) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

const setCachedData = (key: string, data: any): void => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}
};

const clearCache = (key?: string): void => {
  if (typeof window === 'undefined') return;
  if (key) {
    sessionStorage.removeItem(key);
  } else {
    Object.keys(sessionStorage)
      .filter(k => k.startsWith('admin_'))
      .forEach(k => sessionStorage.removeItem(k));
  }
};

// ==================== AUDIT LOGGING ====================
const logAdminAction = async (action: string, details: any = {}, user: any) => {
  try {
    const auditId = `admin_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    await setDoc(doc(db, 'adminLogs', auditId), {
      action,
      userId: user?.uid,
      userName: user?.displayName || 'Unknown',
      userEmail: user?.email || 'Unknown',
      details,
      timestamp: serverTimestamp(),
      ipAddress: 'admin_dashboard'
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
};

// ==================== SKELETON LOADER ====================
function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="p-4 border border-orange-100 rounded-xl bg-orange-50 animate-pulse"
        >
          <div className="h-5 bg-orange-200 rounded w-1/3 mb-3"></div>
          <div className="h-4 bg-orange-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-orange-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
function AdminDashboardContent() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [loadingAdminCheck, setLoadingAdminCheck] = useState(true);

  const [activeTab, setActiveTab] = useState<
    'jobs' | 'users' | 'api' | 'config' | 'referral' | 'messages' | 'analytics' | 'feedback' | 'storage'
  >('jobs');

  // ==================== SEARCH ====================
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [selectedUserType, setSelectedUserType] = useState('all');

  // ==================== PAGINATED COLLECTIONS ====================
  const jobsConstraints = useMemo<QueryConstraint[]>(
    () => [orderBy('postedAt', 'desc'), limit(20)],
    []
  );
  const referralJobsConstraints = useMemo<QueryConstraint[]>(
    () => [orderBy('postedAt', 'desc'), limit(20)],
    []
  );
  const messagesConstraints = useMemo<QueryConstraint[]>(
    () => [orderBy('timestamp', 'desc'), limit(20)],
    []
  );
  const usersConstraints = useMemo<QueryConstraint[]>(
    () => [orderBy('displayName'), limit(20)],
    []
  );

  const jobsPagination = useFirebasePagination(
    'jobs',
    jobsConstraints,
    activeTab === 'jobs' ? 'admin_jobs_v2' : null
  );

  const referralJobsPagination = useFirebasePagination(
    'referralJobs',
    referralJobsConstraints,
    activeTab === 'referral' ? 'admin_referral_jobs_v2' : null
  );

  const messagesPagination = useFirebasePagination(
    'messages',
    messagesConstraints,
    activeTab === 'messages' ? 'admin_messages_v2' : null
  );

  const usersPagination = useFirebasePagination(
    'users',
    usersConstraints,
    activeTab === 'users' ? 'admin_users_v2' : null
  );

  // ==================== API JOBS STATE ====================
  const [apiJobs, setApiJobs] = useState<any[]>([]);
  const [adzunaJobs, setAdzunaJobs] = useState<AdzunaJob[]>([]);
  const [importedJobs, setImportedJobs] = useState<any[]>([]);
  const [showAllImportedJobs, setShowAllImportedJobs] = useState(false);
  const [fetchingJobs, setFetchingJobs] = useState(false);
  const [fetchingAdzunaJobs, setFetchingAdzunaJobs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('developer');
  const [searchLocation, setSearchLocation] = useState('India');

  // ==================== CONFIG STATE ====================
  const [configData, setConfigData] = useState({
    launchDate: '2025-01-01',
    freePeriodMonths: 3,
    platformName: 'ALL Platform',
    isMaintenanceMode: false,
    maintenanceMessage:
      'The platform is currently undergoing maintenance. Please check back soon.',
    maintenanceToggledAt: null as any,
    maintenanceToggledBy: '',
    updatedAt: new Date()
  });
  const [showConfigModal, setShowConfigModal] = useState(false);

  // ==================== ADMIN STATE ====================
  const [admins, setAdmins] = useState<any[]>([]);

  // ==================== ANALYTICS STATE ====================
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalReferralJobs: 0,
    totalMessages: 0,
    totalApplications: 0,
    totalConnections: 0,
    dailySignups: [] as { date: string; count: number }[],
    dailyJobs: [] as { date: string; count: number }[],
    topLocations: [] as { location: string; count: number }[]
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // ==================== STORAGE STATE ====================
  const [storageData, setStorageData] = useState({
    collections: [] as Array<{
      name: string;
      documentCount: number;
      estimatedSizeKB: number;
      estimatedSizeMB: number;
      lastUpdated: string;
    }>,
    totalDocuments: 0,
    totalEstimatedSizeKB: 0,
    totalEstimatedSizeMB: 0,
    totalEstimatedSizeGB: 0,
    storageUsagePercentage: 0,
    oldMessagesCount: 0,
    oldMessagesSizeMB: 0,
    cleanupAvailable: false,
    lastUpdated: new Date().toLocaleString()
  });
  const [storageLoading, setStorageLoading] = useState(false);

  // ==================== FEEDBACK STATE ====================
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState('all');
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState('all');

  // ==================== UI STATE ====================
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showUserEditModal, setShowUserEditModal] = useState(false);

  // ==================== CHECK ADMIN STATUS ====================
  useEffect(() => {
    async function checkAdminStatus() {
      if (user) {
        try {
          const adminStatus = await isAdmin(user);
          setIsUserAdmin(adminStatus);
          if (adminStatus) await fetchAllAdmins();
        } catch (error) {
          console.error('Error checking admin status:', error);
          toast.error('Failed to verify admin permissions');
        } finally {
          setLoadingAdminCheck(false);
        }
      } else {
        setLoadingAdminCheck(false);
      }
    }
    if (!loading) checkAdminStatus();
  }, [user, loading]);

  // ==================== ANALYTICS FETCH ====================
  const fetchAnalyticsData = useCallback(async () => {
    if (!isUserAdmin) return;

    const cached = getCachedData('admin_analytics_v2');
    if (cached) {
      setAnalyticsData(cached.data);
      return;
    }

    setAnalyticsLoading(true);
    try {
      const [
        usersCountSnap, jobsCountSnap, referralJobsCountSnap,
        messagesCountSnap, applicationsCountSnap, connectionsCountSnap
      ] = await Promise.all([
        getCountFromServer(collection(db, 'users')),
        getCountFromServer(collection(db, 'jobs')),
        getCountFromServer(collection(db, 'referralJobs')),
        getCountFromServer(collection(db, 'messages')),
        getCountFromServer(collection(db, 'applications')),
        getCountFromServer(collection(db, 'connections'))
      ]);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();

      const recentUsersQuery = query(
        collection(db, 'users'),
        where('createdAt', '>=', sevenDaysAgo)
      );
      const recentJobsQuery = query(
        collection(db, 'jobs'),
        where('postedAt', '>=', sevenDaysAgo)
      );

      const [recentUsersSnap, recentJobsSnap] = await Promise.all([
        getDocs(recentUsersQuery),
        getDocs(recentJobsQuery)
      ]);

      const userDocs = recentUsersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const jobDocs = recentJobsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const dailySignups = last7Days.map(date => ({
        date,
        count: userDocs.filter((u: any) => {
          if (!u.createdAt) return false;
          const d = u.createdAt.toDate
            ? u.createdAt.toDate().toISOString().split('T')[0]
            : null;
          return d === date;
        }).length
      }));

      const dailyJobs = last7Days.map(date => ({
        date,
        count: jobDocs.filter((j: any) => {
          if (!j.postedAt) return false;
          const d = j.postedAt.toDate
            ? j.postedAt.toDate().toISOString().split('T')[0]
            : null;
          return d === date;
        }).length
      }));

      const locationSampleSnap = await getDocs(
        query(collection(db, 'users'), limit(500))
      );

      const locationCounts: Record<string, number> = {};
      locationSampleSnap.docs.forEach(d => {
        const u = d.data();
        if (u.location && typeof u.location === 'string') {
          locationCounts[u.location] = (locationCounts[u.location] || 0) + 1;
        }
      });

      const topLocations = Object.entries(locationCounts)
        .map(([location, count]) => ({ location, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const newData = {
        totalUsers: usersCountSnap.data().count,
        totalJobs: jobsCountSnap.data().count,
        totalReferralJobs: referralJobsCountSnap.data().count,
        totalMessages: messagesCountSnap.data().count,
        totalApplications: applicationsCountSnap.data().count,
        totalConnections: connectionsCountSnap.data().count,
        dailySignups,
        dailyJobs,
        topLocations
      };

      setAnalyticsData(newData);
      setCachedData('admin_analytics_v2', newData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Error fetching analytics data');
    } finally {
      setAnalyticsLoading(false);
    }
  }, [isUserAdmin]);

  // ==================== STORAGE FETCH ====================
  const fetchStorageData = useCallback(async () => {
    if (!isUserAdmin) return;

    const cached = getCachedData('admin_storage_v2');
    if (cached) {
      setStorageData(cached.data);
      return;
    }

    setStorageLoading(true);
    try {
      const collections = [
        'users', 'jobs', 'referralJobs', 'apiJobs', 'messages',
        'applications', 'connections', 'feedback', 'notifications'
      ];

      const avgSizePerDocKB: Record<string, number> = {
        users: 2.5, jobs: 3.0, referralJobs: 2.0, apiJobs: 4.0,
        messages: 0.5, applications: 1.5, connections: 0.3,
        feedback: 0.8, notifications: 0.2
      };

      const collectionData = [];
      let totalDocuments = 0;
      let totalEstimatedSizeKB = 0;

      for (const c of collections) {
        try {
          const snap = await getCountFromServer(collection(db, c));
          const count = snap.data().count;
          const avg = avgSizePerDocKB[c] || 1.0;
          const kb = count * avg;
          collectionData.push({
            name: c,
            documentCount: count,
            estimatedSizeKB: Math.round(kb * 100) / 100,
            estimatedSizeMB: Math.round((kb / 1024) * 100) / 100,
            lastUpdated: new Date().toLocaleTimeString()
          });
          totalDocuments += count;
          totalEstimatedSizeKB += kb;
        } catch (e) {
          console.error(`Error fetching ${c}:`, e);
          collectionData.push({
            name: c, documentCount: 0, estimatedSizeKB: 0,
            estimatedSizeMB: 0, lastUpdated: 'Error'
          });
        }
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const oldMessagesSnap = await getCountFromServer(
        query(collection(db, 'messages'), where('timestamp', '<', thirtyDaysAgo))
      );
      const oldMessagesCount = oldMessagesSnap.data().count;
      const oldMessagesSizeMB =
        Math.round((oldMessagesCount * avgSizePerDocKB.messages / 1024) * 100) / 100;

      const totalEstimatedSizeMB =
        Math.round((totalEstimatedSizeKB / 1024) * 100) / 100;
      const totalEstimatedSizeGB =
        Math.round((totalEstimatedSizeMB / 1024) * 100) / 100;
      const storageUsagePercentage =
        Math.min(100, Math.round((totalEstimatedSizeMB / 1024) * 100));

      const newData = {
        collections: collectionData,
        totalDocuments,
        totalEstimatedSizeKB: Math.round(totalEstimatedSizeKB * 100) / 100,
        totalEstimatedSizeMB,
        totalEstimatedSizeGB,
        storageUsagePercentage,
        oldMessagesCount,
        oldMessagesSizeMB,
        cleanupAvailable: oldMessagesCount > 0,
        lastUpdated: new Date().toLocaleString()
      };

      setStorageData(newData);
      setCachedData('admin_storage_v2', newData);
    } catch (error) {
      console.error('Error fetching storage data:', error);
      toast.error('Error fetching storage data');
    } finally {
      setStorageLoading(false);
    }
  }, [isUserAdmin]);

  // ==================== FEEDBACK FETCH ====================
  const fetchFeedbacks = useCallback(async () => {
    if (!isUserAdmin) return;
    setFeedbackLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, 'feedback'), orderBy('createdAt', 'desc'), limit(100))
      );
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate
          ? d.data().createdAt.toDate()
          : new Date(d.data().createdAt)
      }));
      setFeedbacks(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Error fetching feedback data');
    } finally {
      setFeedbackLoading(false);
    }
  }, [isUserAdmin]);

  // ==================== CONFIG FETCH ====================
  const fetchConfig = useCallback(async () => {
    if (!isUserAdmin) return;
    try {
      const configDoc = await getDoc(doc(db, 'config', 'subscription'));
      if (configDoc.exists()) {
        const d = configDoc.data();
        setConfigData({
          launchDate: d.launchDate || '2025-01-01',
          freePeriodMonths: d.freePeriodMonths || 3,
          platformName: d.platformName || 'ALL Platform',
          isMaintenanceMode: d.isMaintenanceMode || false,
          maintenanceMessage:
            d.maintenanceMessage ||
            'The platform is currently undergoing maintenance. Please check back soon.',
          maintenanceToggledAt: d.maintenanceToggledAt || null,
          maintenanceToggledBy: d.maintenanceToggledBy || '',
          updatedAt: d.updatedAt || new Date()
        });
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  }, [isUserAdmin]);

  // ==================== IMPORTED JOBS ====================
  const fetchImportedJobs = useCallback(async () => {
    if (!isUserAdmin) return;
    try {
      const snap = await getDocs(
        query(
          collection(db, 'apiJobs'),
          orderBy('fetchedAt', 'desc'),
          showAllImportedJobs ? limit(1000) : limit(50)
        )
      );
      setImportedJobs(
        snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
          displayDate: d.data().fetchedAt?.toDate
            ? d.data().fetchedAt.toDate()
            : new Date()
        }))
      );
    } catch (error) {
      console.error('Error fetching imported jobs:', error);
    }
  }, [isUserAdmin, showAllImportedJobs]);

  // ==================== ADMINS ====================
  const fetchAllAdmins = useCallback(async () => {
    if (!isUserAdmin) return;
    try {
      setAdmins(await getAllAdmins());
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  }, [isUserAdmin]);

  // ==================== TAB CHANGE EFFECTS ====================
  useEffect(() => {
    if (!isUserAdmin) return;
    if (activeTab === 'analytics') fetchAnalyticsData();
    else if (activeTab === 'storage') fetchStorageData();
    else if (activeTab === 'feedback') fetchFeedbacks();
    else if (activeTab === 'config') fetchConfig();
    else if (activeTab === 'api') fetchImportedJobs();
  }, [activeTab, isUserAdmin, fetchAnalyticsData, fetchStorageData, fetchFeedbacks, fetchConfig, fetchImportedJobs]);

  // ==================== FILTERED USERS ====================
  const filteredUsers = useMemo(() => {
    let result = usersPagination.data || [];
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();
      result = result.filter(
        (u: any) =>
          (u.displayName || '').toLowerCase().includes(term) ||
          (u.email || '').toLowerCase().includes(term) ||
          (u.headline || '').toLowerCase().includes(term)
      );
    }
    if (selectedUserType === 'admin') {
      result = result.filter((u: any) => u.role === 'admin');
    } else if (selectedUserType === 'regular') {
      result = result.filter((u: any) => u.role !== 'admin');
    }
    return result;
  }, [usersPagination.data, debouncedSearch, selectedUserType]);

  // ==================== FILTERED FEEDBACKS ====================
  const filteredFeedbacks = useMemo(() => {
    let f = feedbacks;
    if (feedbackStatusFilter !== 'all')
      f = f.filter(x => x.status === feedbackStatusFilter);
    if (feedbackCategoryFilter !== 'all')
      f = f.filter(x => x.category === feedbackCategoryFilter);
    return f;
  }, [feedbacks, feedbackStatusFilter, feedbackCategoryFilter]);

  // ==================== USER CRUD ====================
  const handleMakeAdmin = async (userId: string, userData: any) => {
    try {
      await setUserAsAdmin(userId, userData);
      await logAdminAction('make_admin', {
        targetUserId: userId,
        targetUserName: userData.displayName || 'Unknown',
        targetUserEmail: userData.email || 'Unknown'
      }, user);
      toast.success(`${userData.displayName || userId} is now an admin`);
      usersPagination.refresh();
      await fetchAllAdmins();
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  const handleRemoveAdmin = async (userId: string, userName: string) => {
    if (!confirm(`Remove admin role from ${userName}?`)) return;
    try {
      await removeAdminRole(userId);
      await logAdminAction('remove_admin', { targetUserId: userId, targetUserName: userName }, user);
      toast.success(`Admin role removed from ${userName}`);
      usersPagination.refresh();
      await fetchAllAdmins();
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Permanently delete user "${userName}"? Cannot be undone!`)) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      const userJobsSnap = await getDocs(
        query(collection(db, 'jobs'), where('postedBy', '==', userId))
      );
      await Promise.all(userJobsSnap.docs.map(d => deleteDoc(d.ref)));
      await logAdminAction('delete_user', { targetUserId: userId, targetUserName: userName }, user);
      toast.success(`User "${userName}" deleted`);
      usersPagination.refresh();
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  const handleEditUser = (u: any) => {
    setEditingUser(u);
    setShowUserEditModal(true);
  };

  const handleSaveUser = async (updatedUser: any) => {
    try {
      await updateDoc(doc(db, 'users', updatedUser.id), {
        displayName: updatedUser.displayName,
        email: updatedUser.email,
        headline: updatedUser.headline,
        phoneNumber: updatedUser.phoneNumber,
        updatedAt: new Date()
      });
      await logAdminAction('edit_user', {
        userId: updatedUser.id,
        userName: updatedUser.displayName
      }, user);
      toast.success(`User "${updatedUser.displayName}" updated`);
      setShowUserEditModal(false);
      setEditingUser(null);
      usersPagination.refresh();
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  // ==================== JOB CRUD ====================
  const handleDeleteJob = async (jobId: string, jobTitle: string, collectionName: string) => {
    if (!confirm(`Delete job "${jobTitle}"?`)) return;
    try {
      await deleteDoc(doc(db, collectionName, jobId));
      await logAdminAction('delete_job', { jobId, jobTitle, collectionName }, user);
      toast.success(`Job "${jobTitle}" deleted`);

      if (collectionName === 'jobs') jobsPagination.refresh();
      else if (collectionName === 'referralJobs') referralJobsPagination.refresh();
      else if (collectionName === 'messages') messagesPagination.refresh();
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  const handleToggleJobStatus = async (
    jobId: string,
    currentStatus: boolean,
    collectionName: string
  ) => {
    try {
      const newStatus = !currentStatus;
      await updateDoc(doc(db, collectionName, jobId), {
        isActive: newStatus,
        updatedAt: new Date()
      });
      await logAdminAction('toggle_job_status', {
        jobId, collectionName, oldStatus: currentStatus, newStatus
      }, user);
      toast.success('Job status updated');

      if (collectionName === 'jobs') jobsPagination.refresh();
      else if (collectionName === 'referralJobs') referralJobsPagination.refresh();
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  // ==================== CONFIG ====================
  const handleSaveConfig = async () => {
    try {
      await setDoc(
        doc(db, 'config', 'subscription'),
        { ...configData, updatedAt: new Date() },
        { merge: true }
      );
      await logAdminAction('update_config', { changes: configData }, user);
      toast.success('Configuration saved');
      setShowConfigModal(false);
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  const calculateFreePeriodEnd = () => {
    const launch = new Date(configData.launchDate);
    const end = new Date(launch);
    end.setMonth(end.getMonth() + configData.freePeriodMonths);
    return end.toLocaleDateString();
  };

  const toggleMaintenanceMode = async () => {
    const newMode = !configData.isMaintenanceMode;
    const action = newMode ? 'enable' : 'disable';
    if (!confirm(`Are you sure you want to ${action} maintenance mode?`)) return;

    try {
      setConfigData(prev => ({
        ...prev,
        isMaintenanceMode: newMode,
        maintenanceToggledAt: new Date(),
        maintenanceToggledBy: user?.uid || 'admin_dashboard',
        updatedAt: new Date()
      }));

      await setDoc(
        doc(db, 'config', 'subscription'),
        {
          ...configData,
          isMaintenanceMode: newMode,
          maintenanceToggledAt: new Date(),
          maintenanceToggledBy: user?.uid,
          updatedAt: new Date()
        },
        { merge: true }
      );

      await logAdminAction(`${action}_maintenance_mode`, {
        oldValue: !newMode, newValue: newMode
      }, user);

      toast.success(`Maintenance mode ${action}d`);
      setTimeout(() => fetchConfig(), 1000);
    } catch (error) {
      setConfigData(prev => ({ ...prev, isMaintenanceMode: !newMode }));
      toast.error(`Failed to ${action} maintenance mode`);
    }
  };

  // ==================== JSEARCH API (via secure server route) ====================
  const fetchJobsFromAPI = async (searchQ: string, loc: string) => {
    const url = `/api/jsearch?query=${encodeURIComponent(
      searchQ
    )}&location=${encodeURIComponent(loc)}`;

    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `API error: ${response.status}`);
    }
    return result.data || [];
  };

  const fetchJobs = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    setFetchingJobs(true);
    try {
      const jobs = await fetchJobsFromAPI(searchQuery, searchLocation);
      setApiJobs(jobs);
      if (jobs.length > 0) toast.success(`Found ${jobs.length} jobs from JSearch`);
      else toast.error('No jobs found for your search');
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch jobs');
    } finally {
      setFetchingJobs(false);
    }
  };

  // ==================== ADZUNA API ====================
  const fetchAdzunaJobsHandler = async () => {
    if (!user) {
      toast.error('You must be logged in');
      return;
    }
    setFetchingAdzunaJobs(true);
    try {
      const jobs = await fetchAdzunaJobs('in', 20);
      setAdzunaJobs(jobs);
      toast.success(`Found ${jobs.length} jobs from Adzuna API`);
    } catch (error: any) {
      toast.error(`Error: ${error.message || 'Unknown'}`);
    } finally {
      setFetchingAdzunaJobs(false);
    }
  };

  const mapJSearchJobToOurFormat = (job: any) => ({
    title: job.job_title,
    company: job.employer_name,
    location: `${job.job_city}, ${job.job_country}`,
    type: job.job_employment_type || 'Full-time',
    salary:
      job.job_min_salary && job.job_max_salary
        ? `${job.job_min_salary} - ${job.job_max_salary}`
        : 'Not specified',
    description: job.job_description,
    requirements: 'Not specified',
    postedBy: 'api-source',
    postedAt: new Date(),
    source: 'jsearch',
    externalId: job.job_id,
    isExternal: true,
    jobLink: job.job_apply_link
  });

  const saveJobToFirestore = async (jobData: any) => {
    await addDoc(collection(db, 'jobs'), jobData);
    await addDoc(collection(db, 'apiJobs'), { ...jobData, fetchedAt: new Date() });
  };

  const importJob = async (job: any, source: 'jsearch' | 'adzuna') => {
    try {
      if (source === 'jsearch') {
        const ourJobFormat = mapJSearchJobToOurFormat(job);
        await saveJobToFirestore(ourJobFormat);
        setApiJobs(apiJobs.filter(j => j.job_id !== job.job_id));
      } else {
        const savedCount = await saveAdzunaJobsToFirestore([job], user!.uid);
        if (savedCount > 0) {
          setAdzunaJobs(adzunaJobs.filter(j => j.id !== job.id));
        }
      }
      toast.success('Job imported successfully!');
      await fetchImportedJobs();
      jobsPagination.refresh();
    } catch (error) {
      console.error('Error importing job:', error);
      toast.error('Error importing job');
    }
  };

  // ==================== FAST BATCH IMPORT ====================
  const importAllJobs = async (source: 'jsearch' | 'adzuna') => {
    const jobs = source === 'jsearch' ? apiJobs : adzunaJobs;
    if (jobs.length === 0) {
      toast.error(`No ${source} jobs to import`);
      return;
    }

    const loadingToast = toast.loading(`Importing ${jobs.length} ${source} jobs...`);

    try {
      let importedCount = 0;

      if (source === 'jsearch') {
        const CHUNK = 400;
        for (let i = 0; i < jobs.length; i += CHUNK) {
          const chunk = jobs.slice(i, i + CHUNK);
          const batch = writeBatch(db);

          chunk.forEach(job => {
            const ourJobFormat = mapJSearchJobToOurFormat(job);
            const jobRef = doc(collection(db, 'jobs'));
            const apiJobRef = doc(collection(db, 'apiJobs'));
            batch.set(jobRef, ourJobFormat);
            batch.set(apiJobRef, { ...ourJobFormat, fetchedAt: new Date() });
            importedCount++;
          });

          await batch.commit();
        }
        setApiJobs([]);
      } else {
        importedCount = await saveAdzunaJobsToFirestore(jobs, user!.uid);
        setAdzunaJobs([]);
      }

      toast.dismiss(loadingToast);
      toast.success(`Imported ${importedCount} of ${jobs.length} jobs!`);
      await fetchImportedJobs();
      jobsPagination.refresh();
    } catch (error) {
      console.error('Error importing all jobs:', error);
      toast.dismiss(loadingToast);
      toast.error('Error importing jobs');
    }
  };

  // ==================== FEEDBACK ====================
  const updateFeedbackStatus = async (feedbackId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'feedback', feedbackId), {
        status: newStatus,
        reviewedAt: new Date()
      });
      await logAdminAction('update_feedback_status', { feedbackId, newStatus }, user);
      toast.success(`Feedback marked as ${newStatus}`);
      await fetchFeedbacks();
    } catch (error) {
      console.error('Error updating feedback:', error);
      toast.error('Error updating feedback status');
    }
  };

  // ==================== CLEANUP ====================
  const cleanupOldMessages = async () => {
    if (!storageData.cleanupAvailable) return;
    if (!confirm(
      `Delete ${storageData.oldMessagesCount} messages older than 30 days? Cannot be undone!`
    )) return;

    setStorageLoading(true);
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const oldSnap = await getDocs(
        query(collection(db, 'messages'), where('timestamp', '<', thirtyDaysAgo))
      );

      const batch = writeBatch(db);
      let count = 0;
      oldSnap.docs.forEach(d => {
        batch.delete(d.ref);
        count++;
      });

      if (count > 0) {
        await batch.commit();
        await logAdminAction('cleanup_old_messages', { messageCount: count, olderThanDays: 30 }, user);
        toast.success(`Deleted ${count} old messages`);
        clearCache('admin_storage_v2');
        await fetchStorageData();
      } else {
        toast.error('No old messages found');
      }
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    } finally {
      setStorageLoading(false);
    }
  };

  const cleanupCollection = async (collectionName: string) => {
    if (!confirm(`Delete ALL documents from "${collectionName}"? Cannot be undone!`)) return;
    setStorageLoading(true);
    try {
      const snap = await getDocs(collection(db, collectionName));
      const batch = writeBatch(db);
      let count = 0;
      snap.docs.forEach(d => {
        batch.delete(d.ref);
        count++;
      });

      if (count > 0) {
        await batch.commit();
        await logAdminAction('cleanup_collection', { collectionName, documentCount: count }, user);
        toast.success(`Deleted ${count} docs from ${collectionName}`);
        clearCache('admin_storage_v2');
        await fetchStorageData();
      } else {
        toast.error(`No documents in ${collectionName}`);
      }
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    } finally {
      setStorageLoading(false);
    }
  };

  const getDisplayedImportedJobs = () =>
    showAllImportedJobs ? importedJobs : importedJobs.slice(0, 20);

  // ==================== LOADING / ACCESS DENIED ====================
  if (loading || loadingAdminCheck) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-black">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isUserAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⛔</span>
          </div>
          <h2 className="text-xl font-semibold text-black mb-2">Access Denied</h2>
          <p className="text-black mb-4">You need admin privileges to access this page.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-orange-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">🚀 Admin Dashboard</h1>
              <p className="text-black">Complete CRUD control over the platform</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome, {user?.displayName || 'Admin'}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <button
                onClick={async () => {
                  if (user) {
                    await setUserAsAdmin(user.uid, {
                      email: user.email,
                      displayName: user.displayName
                    });
                    toast.success('Admin role confirmed! Refreshing...');
                    setTimeout(() => window.location.reload(), 1000);
                  }
                }}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
              >
                🔧 Confirm Admin Role
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-1 mb-6 shadow-lg border border-orange-200">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { key: 'jobs', label: '📊 All Jobs' },
              { key: 'referral', label: '🤝 Referral Jobs' },
              { key: 'users', label: `👥 Users (${usersPagination.data.length})` },
              { key: 'api', label: '🔌 API Jobs' },
              { key: 'messages', label: `💬 Messages (${messagesPagination.data.length})` },
              { key: 'analytics', label: '📈 Analytics' },
              { key: 'storage', label: '💾 Storage' },
              { key: 'feedback', label: `📝 Feedback (${feedbacks.filter(f => f.status === 'new').length})` },
              { key: 'config', label: '⚙️ Configuration' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-3 px-4 text-center rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-orange-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">

          {/* ==================== JOBS TAB ==================== */}
          {activeTab === 'jobs' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">All Platform Jobs</h2>
                <div className="flex items-center space-x-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {jobsPagination.data.length} regular jobs
                  </span>
                  <button
                    onClick={() => jobsPagination.refresh()}
                    className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-600"
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>

              {jobsPagination.isLoading ? (
                <ListSkeleton rows={5} />
              ) : jobsPagination.data.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📭</span>
                  </div>
                  <p className="text-black text-lg mb-2">No jobs found</p>
                  <p className="text-gray-600">Jobs posted by users will appear here</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 max-h-[600px] overflow-y-auto">
                    {jobsPagination.data.map((job: any) => (
                      <div key={job.id} className="p-4 border border-orange-200 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-black mb-2">{job.title}</h3>
                            <p className="text-black mb-1">
                              <span className="font-medium">Company:</span> {job.company}
                            </p>
                            <p className="text-black mb-1">
                              <span className="font-medium">Posted by:</span> {job.postedBy || 'Unknown'}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                                {job.type || 'Full-time'}
                              </span>
                              <span className="text-gray-600 text-sm">
                                Posted: {job.postedAt?.toDate?.().toLocaleDateString() || 'Unknown date'}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleToggleJobStatus(job.id, job.isActive ?? true, 'jobs')}
                              className={`px-3 py-1 rounded-lg text-sm ${
                                job.isActive === false
                                  ? 'bg-green-500 text-white hover:bg-green-600'
                                  : 'bg-yellow-500 text-white hover:bg-yellow-600'
                              }`}
                            >
                              {job.isActive === false ? 'Activate' : 'Deactivate'}
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id, job.title, 'jobs')}
                              className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {jobsPagination.hasMore && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => jobsPagination.loadMore()}
                        disabled={jobsPagination.loadingMore}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-xl font-medium disabled:opacity-50"
                      >
                        {jobsPagination.loadingMore ? 'Loading...' : 'Load More Jobs'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ==================== REFERRAL JOBS TAB ==================== */}
          {activeTab === 'referral' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Referral Jobs Management</h2>
                <div className="flex items-center space-x-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {referralJobsPagination.data.length} referral jobs
                  </span>
                  <button
                    onClick={() => referralJobsPagination.refresh()}
                    className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-600"
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>

              {referralJobsPagination.isLoading ? (
                <ListSkeleton rows={5} />
              ) : referralJobsPagination.data.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <p className="text-black text-lg mb-2">No referral jobs found</p>
                  <p className="text-gray-600">Employees haven't posted any referral jobs yet</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 max-h-[600px] overflow-y-auto">
                    {referralJobsPagination.data.map((job: any) => (
                      <div key={job.id} className="p-4 border border-green-200 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-black mb-2">{job.title}</h3>
                            <p className="text-black mb-1">
                              <span className="font-medium">Company:</span> {job.company}
                            </p>
                            <p className="text-black mb-1">
                              <span className="font-medium">Location:</span> {job.location}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                job.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {job.isActive ? 'Active' : 'Inactive'}
                              </span>
                              <span className="text-gray-600 text-sm">
                                Skills: {job.skills?.slice(0, 3).join(', ')}...
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleToggleJobStatus(job.id, job.isActive ?? true, 'referralJobs')}
                              className={`px-3 py-1 rounded-lg text-sm ${
                                job.isActive === false
                                  ? 'bg-green-500 text-white hover:bg-green-600'
                                  : 'bg-yellow-500 text-white hover:bg-yellow-600'
                              }`}
                            >
                              {job.isActive === false ? 'Activate' : 'Deactivate'}
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id, job.title, 'referralJobs')}
                              className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {referralJobsPagination.hasMore && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => referralJobsPagination.loadMore()}
                        disabled={referralJobsPagination.loadingMore}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-xl font-medium disabled:opacity-50"
                      >
                        {referralJobsPagination.loadingMore ? 'Loading...' : 'Load More Referral Jobs'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ==================== USERS TAB ==================== */}
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">User Management</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <select
                      value={selectedUserType}
                      onChange={(e) => setSelectedUserType(e.target.value)}
                      className="p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="all">All Users</option>
                      <option value="admin">Admins Only</option>
                      <option value="regular">Regular Users</option>
                    </select>
                  </div>
                  <button
                    onClick={() => usersPagination.refresh()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    🔄 Refresh Users
                  </button>
                </div>
              </div>

              {usersPagination.isLoading ? (
                <ListSkeleton rows={5} />
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">👥</span>
                  </div>
                  <p className="text-black text-lg mb-2">No users found</p>
                  <p className="text-gray-600">Try changing your search criteria</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 max-h-[600px] overflow-y-auto">
                    {filteredUsers.map((u: any) => (
                      <div key={u.id} className="p-4 border border-orange-200 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-black">
                              {u.displayName || 'Anonymous User'}
                            </h3>
                            <p className="text-black">{u.email}</p>
                            {u.headline && (
                              <p className="text-sm text-gray-600 mt-1">{u.headline}</p>
                            )}
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                u.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {u.role || 'user'}
                              </span>
                              {u.phoneNumber && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  📱 {u.phoneNumber}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditUser(u)}
                              className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            {u.role === 'admin' ? (
                              <button
                                onClick={() => handleRemoveAdmin(u.id, u.displayName)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-600"
                              >
                                Remove Admin
                              </button>
                            ) : (
                              <button
                                onClick={() => handleMakeAdmin(u.id, u)}
                                className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-600"
                              >
                                Make Admin
                              </button>
                            )}
                            {u.id !== user?.uid && (
                              <button
                                onClick={() => handleDeleteUser(u.id, u.displayName)}
                                className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {usersPagination.hasMore && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => usersPagination.loadMore()}
                        disabled={usersPagination.loadingMore}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-xl font-medium disabled:opacity-50"
                      >
                        {usersPagination.loadingMore ? 'Loading...' : 'Load More Users'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ==================== API TAB ==================== */}
          {activeTab === 'api' && (
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">Fetch Jobs from APIs</h2>

              <div className="mb-8 p-6 bg-orange-50 rounded-2xl border border-orange-200">
                <h3 className="text-xl font-semibold text-black mb-4">JSearch API</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 font-medium text-black">Job Title/Keywords</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g., developer, marketing, etc."
                      className="w-full p-3 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-black bg-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-black">Location</label>
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="e.g., India, Bangalore, etc."
                      className="w-full p-3 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-black bg-white"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={fetchJobs}
                    disabled={fetchingJobs}
                    className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 disabled:bg-orange-300 font-medium"
                  >
                    {fetchingJobs ? '🔍 Searching...' : '🚀 Fetch JSearch Jobs'}
                  </button>
                  {apiJobs.length > 0 && (
                    <button
                      onClick={() => importAllJobs('jsearch')}
                      className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 font-medium"
                    >
                      📥 Import All ({apiJobs.length})
                    </button>
                  )}
                </div>

                {apiJobs.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-black mb-3">
                      JSearch Results ({apiJobs.length} jobs found)
                    </h4>
                    <div className="grid gap-3 max-h-96 overflow-y-auto">
                      {apiJobs.map(job => (
                        <div key={job.job_id} className="p-3 border border-orange-200 rounded-lg bg-white">
                          <h5 className="font-medium text-black">{job.job_title}</h5>
                          <p className="text-sm text-black">
                            {job.employer_name} - {job.job_city}, {job.job_country}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">{job.job_employment_type}</p>
                          <button
                            onClick={() => importJob(job, 'jsearch')}
                            className="mt-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600"
                          >
                            Import This Job
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                <h3 className="text-xl font-semibold text-black mb-4">Adzuna API</h3>
                <p className="text-black mb-4">
                  Adzuna provides 1,000 free requests per day. Currently fetches Indian tech jobs automatically.
                </p>

                <div className="flex space-x-3">
                  <button
                    onClick={fetchAdzunaJobsHandler}
                    disabled={fetchingAdzunaJobs}
                    className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 disabled:bg-blue-300 font-medium"
                  >
                    {fetchingAdzunaJobs ? '🔍 Searching...' : '🚀 Fetch Adzuna Jobs'}
                  </button>
                  {adzunaJobs.length > 0 && (
                    <button
                      onClick={() => importAllJobs('adzuna')}
                      className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 font-medium"
                    >
                      📥 Import All ({adzunaJobs.length})
                    </button>
                  )}
                </div>

                {adzunaJobs.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-black mb-3">
                      Adzuna Results ({adzunaJobs.length} jobs found)
                    </h4>
                    <div className="grid gap-3 max-h-96 overflow-y-auto">
                      {adzunaJobs.map(job => (
                        <div key={job.id} className="p-3 border border-blue-200 rounded-lg bg-white">
                          <h5 className="font-medium text-black">{job.title}</h5>
                          <p className="text-sm text-black">
                            {job.company.display_name} - {job.location.display_name}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {job.salary_min && job.salary_max
                              ? `₹${job.salary_min.toLocaleString()} - ₹${job.salary_max.toLocaleString()}`
                              : 'Salary not specified'}
                          </p>
                          <button
                            onClick={() => importJob(job, 'adzuna')}
                            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
                          >
                            Import This Job
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Imported Jobs Preview */}
              {importedJobs.length > 0 && (
                <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-black">
                      Recently Imported API Jobs ({importedJobs.length})
                    </h3>
                    <button
                      onClick={() => setShowAllImportedJobs(!showAllImportedJobs)}
                      className="text-blue-500 underline text-sm"
                    >
                      {showAllImportedJobs ? 'Show Less' : 'Show All'}
                    </button>
                  </div>
                  <div className="grid gap-3 max-h-96 overflow-y-auto">
                    {getDisplayedImportedJobs().map((job: any) => (
                      <div key={job.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-black">{job.title}</h5>
                        <p className="text-sm text-gray-600">
                          {job.company} — {job.location}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== MESSAGES TAB ==================== */}
          {activeTab === 'messages' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Recent Messages</h2>
                <div className="flex items-center space-x-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {messagesPagination.data.length} messages
                  </span>
                  <button
                    onClick={() => messagesPagination.refresh()}
                    className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-600"
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>

              {messagesPagination.isLoading ? (
                <ListSkeleton rows={5} />
              ) : messagesPagination.data.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💬</span>
                  </div>
                  <p className="text-black text-lg mb-2">No messages found</p>
                  <p className="text-gray-600">Users haven't sent any messages yet</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 max-h-[600px] overflow-y-auto">
                    {messagesPagination.data.map((msg: any) => (
                      <div key={msg.id} className="p-4 border border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-black mb-2">{msg.text || msg.content}</p>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">
                                From: {msg.senderId?.substring(0, 8)}...
                              </span>
                              <span className="text-sm text-gray-600">
                                To: {msg.receiverId?.substring(0, 8)}...
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {msg.timestamp?.toDate?.().toLocaleString() ||
                                msg.createdAt?.toDate?.().toLocaleString() ||
                                'Unknown time'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteJob(msg.id, 'message', 'messages')}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {messagesPagination.hasMore && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => messagesPagination.loadMore()}
                        disabled={messagesPagination.loadingMore}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-xl font-medium disabled:opacity-50"
                      >
                        {messagesPagination.loadingMore ? 'Loading...' : 'Load More Messages'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ==================== ANALYTICS TAB ==================== */}
          {activeTab === 'analytics' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Platform Analytics</h2>
                <button
                  onClick={() => {
                    clearCache('admin_analytics_v2');
                    fetchAnalyticsData();
                  }}
                  disabled={analyticsLoading}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
                >
                  {analyticsLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    '🔄 Refresh Analytics'
                  )}
                </button>
              </div>

              {analyticsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
                  <p className="mt-4 text-black text-lg">Loading analytics data...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                      { label: 'Total Users', value: analyticsData.totalUsers, icon: '👥', grad: 'from-orange-500 to-orange-600' },
                      { label: 'Total Jobs', value: analyticsData.totalJobs, icon: '💼', grad: 'from-blue-500 to-blue-600' },
                      { label: 'Referral Jobs', value: analyticsData.totalReferralJobs, icon: '🤝', grad: 'from-green-500 to-green-600' },
                      { label: 'Messages', value: analyticsData.totalMessages, icon: '💬', grad: 'from-purple-500 to-purple-600' }
                    ].map(card => (
                      <div key={card.label} className={`bg-gradient-to-br ${card.grad} text-white p-6 rounded-2xl shadow-lg`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm opacity-80">{card.label}</p>
                            <p className="text-3xl font-bold mt-2">{card.value}</p>
                          </div>
                          <div className="text-3xl">{card.icon}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {[
                      { label: 'Applications', value: analyticsData.totalApplications, icon: '📄', grad: 'from-yellow-500 to-yellow-600' },
                      { label: 'Connections', value: analyticsData.totalConnections, icon: '🔗', grad: 'from-red-500 to-red-600' }
                    ].map(card => (
                      <div key={card.label} className={`bg-gradient-to-br ${card.grad} text-white p-6 rounded-2xl shadow-lg`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm opacity-80">{card.label}</p>
                            <p className="text-3xl font-bold mt-2">{card.value}</p>
                          </div>
                          <div className="text-3xl">{card.icon}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-md">
                      <h3 className="text-xl font-semibold text-black mb-4">Daily Signups (Last 7 Days)</h3>
                      <div className="space-y-4">
                        {analyticsData.dailySignups.map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-black">{item.date}</span>
                            <div className="flex items-center space-x-3">
                              <span className="font-medium text-black">{item.count}</span>
                              <div className="w-32 bg-gray-200 rounded-full h-3">
                                <div
                                  className="bg-green-500 h-3 rounded-full"
                                  style={{
                                    width: `${(item.count / Math.max(...analyticsData.dailySignups.map(d => d.count), 1)) * 100}%`
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-md">
                      <h3 className="text-xl font-semibold text-black mb-4">Daily Job Posts (Last 7 Days)</h3>
                      <div className="space-y-4">
                        {analyticsData.dailyJobs.map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-black">{item.date}</span>
                            <div className="flex items-center space-x-3">
                              <span className="font-medium text-black">{item.count}</span>
                              <div className="w-32 bg-gray-200 rounded-full h-3">
                                <div
                                  className="bg-blue-500 h-3 rounded-full"
                                  style={{
                                    width: `${(item.count / Math.max(...analyticsData.dailyJobs.map(d => d.count), 1)) * 100}%`
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {analyticsData.topLocations.length > 0 && (
                    <div className="mt-8 bg-white p-6 rounded-2xl border border-green-200 shadow-md">
                      <h3 className="text-xl font-semibold text-black mb-4">Top User Locations</h3>
                      <div className="space-y-4">
                        {analyticsData.topLocations.map((loc, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-lg font-bold text-gray-600">#{i + 1}</span>
                              <span className="text-black">{loc.location}</span>
                            </div>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                              {loc.count} users
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ==================== STORAGE TAB ==================== */}
          {activeTab === 'storage' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Firebase Storage Monitoring</h2>
                <button
                  onClick={() => {
                    clearCache('admin_storage_v2');
                    fetchStorageData();
                  }}
                  disabled={storageLoading}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
                >
                  {storageLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    '🔄 Refresh Storage Data'
                  )}
                </button>
              </div>

              {storageLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
                  <p className="mt-4 text-black text-lg">Loading storage data...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                      { label: 'Total Documents', value: storageData.totalDocuments.toLocaleString(), icon: '📊', grad: 'from-blue-500 to-blue-600' },
                      { label: 'Total Size', value: `${storageData.totalEstimatedSizeMB.toFixed(2)} MB`, icon: '💾', grad: 'from-green-500 to-green-600' },
                      { label: 'Free Tier Usage', value: `${storageData.storageUsagePercentage}%`, icon: '📈', grad: 'from-purple-500 to-purple-600' },
                      { label: 'Old Messages', value: storageData.oldMessagesCount, icon: '🗑️', grad: 'from-orange-500 to-orange-600' }
                    ].map(card => (
                      <div key={card.label} className={`bg-gradient-to-br ${card.grad} text-white p-6 rounded-2xl shadow`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm opacity-80">{card.label}</p>
                            <p className="text-3xl font-bold mt-1">{card.value}</p>
                          </div>
                          <div className="text-3xl">{card.icon}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-xl font-semibold text-black">Collection Storage Details</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            {['Collection', 'Documents', 'Size (KB)', 'Size (MB)', 'Last Updated', 'Actions'].map(h => (
                              <th key={h} className="p-4 text-left text-black font-semibold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {storageData.collections.map((c, i) => (
                            <tr key={c.name} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                              <td className="p-4 font-medium text-black">{c.name}</td>
                              <td className="p-4">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                  {c.documentCount.toLocaleString()}
                                </span>
                              </td>
                              <td className="p-4 text-black">{c.estimatedSizeKB.toFixed(2)} KB</td>
                              <td className="p-4 text-black">{c.estimatedSizeMB.toFixed(2)} MB</td>
                              <td className="p-4 text-gray-600">{c.lastUpdated}</td>
                              <td className="p-4">
                                {c.documentCount > 1000 && (
                                  <button
                                    onClick={() => cleanupCollection(c.name)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                                  >
                                    Cleanup
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-8 bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-300">
                    <h3 className="text-xl font-semibold text-red-800 mb-4">⚠️ Danger Zone</h3>
                    <p className="text-red-600 mb-4">These actions will permanently delete data.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => cleanupCollection('apiJobs')}
                        className="bg-red-500 text-white p-4 rounded-xl hover:bg-red-600 font-medium"
                      >
                        Clear All API Jobs
                      </button>
                      <button
                        onClick={() => cleanupCollection('messages')}
                        className="bg-red-500 text-white p-4 rounded-xl hover:bg-red-600 font-medium"
                      >
                        Clear All Messages
                      </button>
                      <button
                        onClick={cleanupOldMessages}
                        disabled={!storageData.cleanupAvailable}
                        className={`p-4 rounded-xl font-medium ${
                          storageData.cleanupAvailable
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Cleanup Old Messages ({storageData.oldMessagesCount})
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ==================== FEEDBACK TAB ==================== */}
          {activeTab === 'feedback' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">User Feedback Management</h2>
                <div className="flex items-center space-x-2">
                  <select
                    value={feedbackStatusFilter}
                    onChange={(e) => setFeedbackStatusFilter(e.target.value)}
                    className="p-2 border border-orange-300 rounded-lg"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="implemented">Implemented</option>
                  </select>
                  <select
                    value={feedbackCategoryFilter}
                    onChange={(e) => setFeedbackCategoryFilter(e.target.value)}
                    className="p-2 border border-orange-300 rounded-lg"
                  >
                    <option value="all">All Categories</option>
                    <option value="bug">Bug</option>
                    <option value="improvement">Improvement</option>
                    <option value="feature">Feature Request</option>
                    <option value="general">General</option>
                  </select>
                  <button
                    onClick={fetchFeedbacks}
                    disabled={feedbackLoading}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>

              {feedbackLoading ? (
                <ListSkeleton rows={4} />
              ) : filteredFeedbacks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <p className="text-black text-lg mb-2">No feedback found</p>
                </div>
              ) : (
                <div className="grid gap-4 max-h-[600px] overflow-y-auto">
                  {filteredFeedbacks.map(f => (
                    <div key={f.id} className="p-4 border border-purple-200 rounded-xl bg-purple-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-black">{f.userName || 'Anonymous'}</h3>
                          <p className="text-sm text-black">{f.userEmail}</p>
                          <p className="text-black my-3 bg-white p-3 rounded-lg border">{f.message}</p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className={`px-2 py-1 rounded-full ${
                              f.status === 'new' ? 'bg-blue-100 text-blue-800' :
                              f.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {f.status}
                            </span>
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">{f.category}</span>
                            {f.rating && <span className="text-yellow-600">★ {f.rating}/5</span>}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          {f.status !== 'reviewed' && (
                            <button
                              onClick={() => updateFeedbackStatus(f.id, 'reviewed')}
                              className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-600 whitespace-nowrap"
                            >
                              Mark Reviewed
                            </button>
                          )}
                          {f.status !== 'implemented' && (
                            <button
                              onClick={() => updateFeedbackStatus(f.id, 'implemented')}
                              className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 whitespace-nowrap"
                            >
                              Mark Implemented
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== CONFIG TAB ==================== */}
          {activeTab === 'config' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Platform Configuration</h2>
                <button
                  onClick={() => setShowConfigModal(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  ⚙️ Edit Configuration
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200">
                  <h3 className="text-lg font-semibold text-black mb-4">Subscription Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Launch Date</p>
                      <p className="text-black font-medium">{configData.launchDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Free Period (Months)</p>
                      <p className="text-black font-medium">{configData.freePeriodMonths}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Free Period Ends</p>
                      <p className="text-black font-medium">{calculateFreePeriodEnd()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-black mb-4">Platform Status</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Platform Name</p>
                      <p className="text-black font-medium">{configData.platformName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Maintenance Mode</p>
                      <p className={`font-medium ${configData.isMaintenanceMode ? 'text-red-600' : 'text-green-600'}`}>
                        {configData.isMaintenanceMode ? '🔴 Active' : '🟢 Inactive'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current Admins</p>
                      <p className="text-black font-medium">{admins.length} administrators</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h3 className="text-lg font-semibold text-black mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={toggleMaintenanceMode}
                    className={`p-4 rounded-xl text-center font-medium ${
                      configData.isMaintenanceMode
                        ? 'bg-green-100 text-green-800 border-2 border-green-400'
                        : 'bg-red-100 text-red-800 border-2 border-red-400'
                    }`}
                  >
                    {configData.isMaintenanceMode ? '🟢 Disable Maintenance' : '🔴 Enable Maintenance'}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Clear all API imported jobs?')) cleanupCollection('apiJobs');
                    }}
                    className="bg-yellow-100 text-yellow-800 p-4 rounded-xl border border-yellow-300 font-medium"
                  >
                    Clear API Jobs
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Reset all notifications?')) cleanupCollection('notifications');
                    }}
                    className="bg-purple-100 text-purple-800 p-4 rounded-xl border border-purple-300 font-medium"
                  >
                    Reset Notifications
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Edit Modal */}
      {showUserEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-black mb-4">
              Edit User: {editingUser.displayName}
            </h3>
            <div className="space-y-4">
              {['displayName', 'email', 'headline', 'phoneNumber'].map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium text-black mb-1 capitalize">{field}</label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    value={editingUser[field] || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, [field]: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowUserEditModal(false);
                  setEditingUser(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveUser(editingUser)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-black mb-4">Platform Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Launch Date</label>
                <input
                  type="date"
                  value={configData.launchDate}
                  onChange={(e) => setConfigData({ ...configData, launchDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Free Period (Months)</label>
                <input
                  type="number"
                  value={configData.freePeriodMonths}
                  onChange={(e) =>
                    setConfigData({ ...configData, freePeriodMonths: parseInt(e.target.value) || 3 })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  min="1"
                  max="12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Platform Name</label>
                <input
                  type="text"
                  value={configData.platformName}
                  onChange={(e) => setConfigData({ ...configData, platformName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Maintenance Message</label>
                <textarea
                  value={configData.maintenanceMessage}
                  onChange={(e) =>
                    setConfigData({ ...configData, maintenanceMessage: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback
          error={new Error('Admin dashboard failed to load')}
          resetErrorBoundary={() => window.location.reload()}
        />
      }
    >
      <AdminDashboardContent />
    </ErrorBoundary>
  );
}

