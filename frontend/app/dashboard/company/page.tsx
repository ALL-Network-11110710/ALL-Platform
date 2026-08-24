// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

// export default function CompanyDashboard() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [userJobs, setUserJobs] = useState<any[]>([]);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [error, setError] = useState('');

//   // Redirect if not authenticated
//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/login');
//     }
//   }, [user, loading, router]);

//   // Fetch jobs posted by the current user
//   useEffect(() => {
//     async function fetchUserJobs() {
//       if (user) {
//         try {
//           setError('');
//           const jobsRef = collection(db, 'jobs');
          
//           // Try the optimized query first (with index)
//           try {
//             const q = query(
//               jobsRef, 
//               where('postedBy', '==', user.uid),
//               orderBy('postedAt', 'desc')
//             );
//             const querySnapshot = await getDocs(q);
            
//             const jobs: any[] = [];
//             querySnapshot.forEach((doc) => {
//               jobs.push({ id: doc.id, ...doc.data() });
//             });
            
//             setUserJobs(jobs);
//           } catch (indexError) {
//             // If index doesn't exist yet, use fallback query
//             console.log('Index not ready, using fallback query:', indexError);
            
//             const fallbackQuery = query(
//               jobsRef, 
//               where('postedBy', '==', user.uid)
//             );
//             const querySnapshot = await getDocs(fallbackQuery);
            
//             const jobs: any[] = [];
//             querySnapshot.forEach((doc) => {
//               jobs.push({ id: doc.id, ...doc.data() });
//             });
            
//             // Manual sorting by postedAt (newest first)
//             const sortedJobs = jobs.sort((a, b) => {
//               if (a.postedAt && b.postedAt) {
//                 return b.postedAt.toDate().getTime() - a.postedAt.toDate().getTime();
//               }
//               return 0;
//             });
            
//             setUserJobs(sortedJobs);
//           }
//         } catch (error) {
//           console.error('Error fetching user jobs:', error);
//           setError('Failed to load your jobs. Please try again.');
//         } finally {
//           setLoadingJobs(false);
//         }
//       }
//     }

//     if (user) {
//       fetchUserJobs();
//     }
//   }, [user]);

//   if (loading || loadingJobs) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6 flex items-center justify-center">
//         <div className="max-w-6xl w-full">
//           <div className="animate-pulse">
//             <div className="h-8 bg-gradient-to-r from-orange-200 to-orange-100 rounded-full w-1/4 mb-6"></div>
//             <div className="h-4 bg-orange-100 rounded-full w-1/2 mb-12"></div>
//             <div className="h-40 bg-white/70 backdrop-blur-lg rounded-3xl shadow-lg mb-10"></div>
//             <div className="space-y-6">
//               {[1, 2, 3].map((i) => (
//                 <div key={i} className="h-48 bg-white/70 backdrop-blur-lg rounded-3xl shadow-lg"></div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-10 text-center">
//           <h1 className="text-4xl font-bold text-gray-800 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-400">
//             Company Dashboard
//           </h1>
//           <p className="text-gray-600 text-lg">Manage your job postings with elegance</p>
//         </div>

//         {/* Stats Card with Glassmorphism */}
//         <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 mb-10 shadow-xl border border-white/30">
//           <div className="flex flex-col lg:flex-row items-center justify-between">
//             <div className="text-center lg:text-left mb-6 lg:mb-0">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-3">Your Job Portfolio</h2>
//               <p className="text-5xl font-bold text-orange-500">{userJobs.length}</p>
//               <p className="text-gray-600 mt-1">Active {userJobs.length === 1 ? 'Job' : 'Jobs'}</p>
//             </div>
//             <button 
//               onClick={() => router.push('/dashboard/post-job')}
//               className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-400 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-500 transform hover:-translate-y-1 hover:shadow-2xl"
//             >
//               <span className="relative z-10">+ Create New Job</span>
//               <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-20 group-hover:animate-ping-slow"></div>
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Job Listings */}
//         <div className="mb-10">
//           {userJobs.length === 0 ? (
//             <div className="text-center py-20 bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30">
//               <div className="text-7xl mb-6 text-orange-300">💼</div>
//               <h3 className="text-2xl font-semibold text-gray-700 mb-3">Your canvas is empty</h3>
//               <p className="text-gray-600 mb-8 max-w-md mx-auto">Begin your hiring journey by posting your first job opportunity</p>
//               <button 
//                 onClick={() => router.push('/dashboard/post-job')}
//                 className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-400 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-500 transform hover:-translate-y-1 hover:shadow-2xl"
//               >
//                 <span className="relative z-10">Create Your First Job</span>
//                 <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//               </button>
//             </div>
//           ) : (
//             <div className="grid gap-8">
//               {userJobs.map((job) => (
//                 <div key={job.id} className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-white/30 hover:border-orange-200/50">
//                   <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
//                     <div className="flex-1 mb-6 lg:mb-0">
//                       <h3 className="text-2xl font-semibold text-gray-800 mb-4">
//                         {job.jobTitle || job.title}
//                       </h3>
                      
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                         <div className="flex items-center">
//                           <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
//                             <span className="text-orange-600">🏢</span>
//                           </div>
//                           <div>
//                             <p className="text-sm text-gray-500">Company</p>
//                             <p className="font-medium">{job.companyName || job.company}</p>
//                           </div>
//                         </div>
                        
//                         <div className="flex items-center">
//                           <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
//                             <span className="text-orange-600">📍</span>
//                           </div>
//                           <div>
//                             <p className="text-sm text-gray-500">Location</p>
//                             <p className="font-medium">{job.location}</p>
//                           </div>
//                         </div>
                        
//                         <div className="flex items-center">
//                           <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
//                             <span className="text-orange-600">🕒</span>
//                           </div>
//                           <div>
//                             <p className="text-sm text-gray-500">Type</p>
//                             <p className="font-medium">{job.jobType || job.type}</p>
//                           </div>
//                         </div>
                        
//                         {job.salary && (
//                           <div className="flex items-center">
//                             <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
//                               <span className="text-orange-600">💰</span>
//                             </div>
//                             <div>
//                               <p className="text-sm text-gray-500">Salary</p>
//                               <p className="font-medium text-green-600">{job.salary}</p>
//                             </div>
//                           </div>
//                         )}
//                       </div>
                      
//                       {job.postedAt && (
//                         <div className="flex items-center text-sm text-gray-500">
//                           <span className="mr-2">📅</span> Posted on {job.postedAt.toDate().toLocaleDateString()}
//                         </div>
//                       )}
//                     </div>
                    
//                     <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
//                       <button 
//                         onClick={() => router.push(`/dashboard/company/job/${job.id}`)}
//                         className="group flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
//                       >
//                         <span className="mr-2 group-hover:scale-110 transition-transform">📋</span> 
//                         Applications
//                       </button>
                      
//                       <button 
//                         onClick={() => router.push(`/jobs/${job.id}`)}
//                         className="group flex items-center justify-center bg-white text-gray-700 border border-gray-200 px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:border-orange-200 hover:shadow-lg"
//                       >
//                         <span className="mr-2 group-hover:scale-110 transition-transform">👀</span> 
//                         Preview
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Footer Actions */}
//         <div className="flex flex-wrap justify-center gap-5">
//           <button 
//             onClick={() => router.push('/dashboard/post-job')}
//             className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-400 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-500 transform hover:-translate-y-1 hover:shadow-2xl"
//           >
//             <span className="relative z-10">+ Add New Job</span>
//             <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//           </button>

//           <button 
//             onClick={() => router.push('/dashboard')}
//             className="group flex items-center bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:border-orange-200 hover:shadow-lg"
//           >
//             <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> 
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
      
//       {/* Custom CSS for animations */}
//       <style jsx>{`
//         @keyframes ping-slow {
//           0% { transform: scale(1); opacity: 1; }
//           75%, 100% { transform: scale(2); opacity: 0; }
//         }
//         .hover\:animate-ping-slow:hover {
//           animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
//         }
//       `}</style>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export default function CompanyDashboard() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [userJobs, setUserJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch jobs posted by the current user
  useEffect(() => {
    async function fetchUserJobs() {
      if (user) {
        try {
          setError('');
          const jobsRef = collection(db, 'jobs');
          
          // Try the optimized query first (with index)
          try {
            const q = query(
              jobsRef, 
              where('postedBy', '==', user.uid),
              orderBy('postedAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            
            const jobs: any[] = [];
            querySnapshot.forEach((doc) => {
              jobs.push({ id: doc.id, ...doc.data() });
            });
            
            setUserJobs(jobs);
          } catch (indexError) {
            // If index doesn't exist yet, use fallback query
            console.log('Index not ready, using fallback query:', indexError);
            
            const fallbackQuery = query(
              jobsRef, 
              where('postedBy', '==', user.uid)
            );
            const querySnapshot = await getDocs(fallbackQuery);
            
            const jobs: any[] = [];
            querySnapshot.forEach((doc) => {
              jobs.push({ id: doc.id, ...doc.data() });
            });
            
            // Manual sorting by postedAt (newest first)
            const sortedJobs = jobs.sort((a, b) => {
              if (a.postedAt && b.postedAt) {
                return b.postedAt.toDate().getTime() - a.postedAt.toDate().getTime();
              }
              return 0;
            });
            
            setUserJobs(sortedJobs);
          }
        } catch (error) {
          console.error('Error fetching user jobs:', error);
          setError('Failed to load your jobs. Please try again.');
        } finally {
          setLoadingJobs(false);
        }
      }
    }

    if (user) {
      fetchUserJobs();
    }
  }, [user]);

  if (loading || loadingJobs) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => router.push('/dashboard')}
          className="group flex items-center text-sm font-bold text-neutral-500 hover:text-black mb-8 transition-colors"
        >
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
          Back to Main Dashboard
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-black tracking-tight mb-2">
              Company Dashboard
            </h1>
            <p className="text-neutral-500 text-lg">Manage your job postings and applications.</p>
          </div>
          
          <button 
            onClick={() => router.push('/dashboard/post-job')}
            className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg flex items-center gap-2"
          >
            <span>+</span> Post New Job
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
            <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-2">Active Jobs</h3>
            <p className="text-4xl font-black text-black">{userJobs.length}</p>
          </div>
          {/* Add more stats here if available in the future */}
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-black border-b border-neutral-200 pb-4">
            Your Job Postings
          </h2>

          {userJobs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 border-dashed">
              <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                💼
              </div>
              <h3 className="text-xl font-bold text-black mb-2">No Jobs Posted Yet</h3>
              <p className="text-neutral-500 mb-6 max-w-md mx-auto">
                Start building your team by posting your first job opportunity.
              </p>
              <button 
                onClick={() => router.push('/dashboard/post-job')}
                className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors"
              >
                Create Your First Job
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {userJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    
                    {/* Job Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                         <h3 className="text-xl font-bold text-black hover:text-orange-600 transition-colors cursor-pointer" onClick={() => router.push(`/jobs/${job.id}`)}>
                          {job.jobTitle || job.title}
                        </h3>
                        <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Active
                        </span>
                      </div>
                      
                      <p className="text-neutral-600 font-medium mb-4">{job.companyName || job.company}</p>
                      
                      <div className="flex flex-wrap gap-3 text-sm text-neutral-500 mb-4">
                        <span className="flex items-center gap-1 bg-neutral-50 px-3 py-1 rounded-lg">
                          <span>📍</span> {job.location}
                        </span>
                        <span className="flex items-center gap-1 bg-neutral-50 px-3 py-1 rounded-lg">
                          <span>🕒</span> {job.jobType || job.type}
                        </span>
                        {job.salary && (
                          <span className="flex items-center gap-1 bg-neutral-50 px-3 py-1 rounded-lg">
                            <span>💰</span> {job.salary}
                          </span>
                        )}
                      </div>
                      
                      {job.postedAt && (
                        <p className="text-xs text-neutral-400">
                          Posted on {job.postedAt.toDate().toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row lg:flex-col gap-3 justify-start lg:justify-center border-t lg:border-t-0 lg:border-l border-neutral-100 pt-4 lg:pt-0 lg:pl-6 min-w-[200px]">
                      <button 
                        onClick={() => router.push(`/dashboard/company/job/${job.id}`)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-bold text-sm hover:bg-orange-600 transition-colors"
                      >
                        <span>📋</span> View Applications
                      </button>
                      
                      <button 
                        onClick={() => router.push(`/jobs/${job.id}`)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg font-bold text-sm hover:border-black hover:text-black transition-colors"
                      >
                        <span>👀</span> Preview Job
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