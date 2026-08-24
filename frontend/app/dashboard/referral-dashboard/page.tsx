// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import Link from 'next/link';
// import { 
//   Briefcase, MessageSquare, Users, Eye, Calendar, 
//   DollarSign, MapPin, Trash2, Edit, ExternalLink,
//   ChevronRight, Loader2, AlertCircle
// } from 'lucide-react';
// import NotificationsDropdown from '@/components/NotificationsDropdown';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';

// function ReferralDashboardContent() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [referralJobs, setReferralJobs] = useState<any[]>([]);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [stats, setStats] = useState({
//     totalJobs: 0,
//     totalViews: 0,
//     totalApplications: 0,
//     activeJobs: 0
//   });

//   // Check authentication
//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/login');
//     }
//   }, [user, loading, router]);

//   // Fetch referral jobs
//   useEffect(() => {
//     async function fetchReferralJobs() {
//       if (!user) return;

//       try {
//         // Fetch jobs posted by this user
//         const jobsRef = collection(db, 'ReferralJobs');
//         const q = query(jobsRef, where('postedBy', '==', user.uid));
//         const querySnapshot = await getDocs(q);
        
//         const jobs: any[] = [];
//         let totalViews = 0;
//         let totalApplications = 0;
//         let activeJobs = 0;

//         querySnapshot.forEach((doc) => {
//           const jobData = doc.data();
//           jobs.push({ id: doc.id, ...jobData });
          
//           // Calculate stats
//           totalViews += jobData.viewCount || 0;
//           totalApplications += jobData.applicationCount || 0;
//           if (jobData.status === 'active') activeJobs++;
//         });

//         setReferralJobs(jobs);
//         setStats({
//           totalJobs: jobs.length,
//           totalViews,
//           totalApplications,
//           activeJobs
//         });
        
//       } catch (error) {
//         console.error('Error fetching referral jobs:', error);
//       } finally {
//         setLoadingJobs(false);
//       }
//     }

//     if (user) {
//       fetchReferralJobs();
//     }
//   }, [user]);

//   const handleDeleteJob = async (jobId: string) => {
//     if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       await deleteDoc(doc(db, 'ReferralJobs', jobId));
//       setReferralJobs(referralJobs.filter(job => job.id !== jobId));
//       setStats(prev => ({
//         ...prev,
//         totalJobs: prev.totalJobs - 1,
//         activeJobs: prev.activeJobs - 1
//       }));
//     } catch (error) {
//       console.error('Error deleting job:', error);
//       alert('Failed to delete job. Please try again.');
//     }
//   };

//   const formatDate = (timestamp: any) => {
//     if (!timestamp) return 'N/A';
//     const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//     return date.toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Loading state
//   if (loading || loadingJobs) {
//     return (
//       <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
//         <div className="w-12 h-12 border-4 border-neutral-100 border-t-orange-600 rounded-full animate-spin"></div>
//         <p className="text-neutral-500 font-medium">Loading Referral Dashboard...</p>
//       </div>
//     );
//   }

//   // No user
//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-neutral-50">
//       {/* Header */}
//       <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <Link href="/dashboard" className="flex items-center gap-2 text-neutral-400 hover:text-black">
//               <span className="text-lg">←</span>
//               <span className="text-sm font-medium">Back to Dashboard</span>
//             </Link>
//             <span className="text-neutral-300">|</span>
//             <div className="flex items-center gap-2">
//               <Briefcase className="w-5 h-5 text-orange-600" />
//               <span className="text-xl font-bold text-black">Referral Dashboard</span>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-6">
//             <NotificationsDropdown />
            
//             <div className="flex items-center gap-3 pl-6 border-l border-neutral-100">
//               <div className="text-right hidden md:block">
//                 <p className="text-sm font-bold text-black">{user.displayName}</p>
//                 <p className="text-xs text-neutral-500">Employee Account</p>
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
//             Your Referral Jobs
//           </h1>
//           <p className="text-neutral-500">
//             Manage your posted referral jobs, track applicants, and communicate with candidates.
//           </p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//           <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">Total Jobs</p>
//                 <p className="text-3xl font-black text-black">{stats.totalJobs}</p>
//               </div>
//               <Briefcase className="w-8 h-8 text-orange-500" />
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">Total Views</p>
//                 <p className="text-3xl font-black text-black">{stats.totalViews}</p>
//               </div>
//               <Eye className="w-8 h-8 text-blue-500" />
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">Applications</p>
//                 <p className="text-3xl font-black text-black">{stats.totalApplications}</p>
//               </div>
//               <Users className="w-8 h-8 text-green-500" />
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">Active Jobs</p>
//                 <p className="text-3xl font-black text-black">{stats.activeJobs}</p>
//               </div>
//               <Calendar className="w-8 h-8 text-purple-500" />
//             </div>
//           </div>
//         </div>

//         {/* Action Bar */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-bold text-black">Your Posted Jobs</h2>
//           <div className="flex gap-3">
//             <Link
//               href="/referral/post"
//               className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-sm"
//             >
//               Post New Job
//             </Link>
//             <Link
//               href="/referral/marketplace"
//               className="px-6 py-3 bg-white border border-neutral-300 text-black font-bold rounded-xl hover:bg-neutral-50 transition-colors"
//             >
//               Browse Marketplace
//             </Link>
//           </div>
//         </div>

//         {/* Jobs List */}
//         {referralJobs.length === 0 ? (
//           <div className="bg-white rounded-2xl p-12 border border-neutral-200 text-center">
//             <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Briefcase className="w-10 h-10 text-orange-500" />
//             </div>
//             <h3 className="text-2xl font-bold text-black mb-3">No Referral Jobs Yet</h3>
//             <p className="text-neutral-500 max-w-md mx-auto mb-8">
//               Start posting referral jobs to help candidates and earn bonuses. Your first job will appear here.
//             </p>
//             <Link
//               href="/referral/post"
//               className="inline-flex items-center px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg"
//             >
//               Post Your First Referral Job
//               <ChevronRight className="w-5 h-5 ml-2" />
//             </Link>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {referralJobs.map((job) => (
//               <div key={job.id} className="bg-white rounded-2xl p-6 border border-neutral-200 hover:border-orange-300 transition-all">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                   {/* Job Info */}
//                   <div className="flex-1">
//                     <div className="flex items-start justify-between mb-3">
//                       <div>
//                         <h3 className="text-xl font-bold text-black mb-1">{job.jobTitle}</h3>
//                         <div className="flex items-center gap-4 text-sm text-neutral-500 mb-3">
//                           <span className="flex items-center gap-1">
//                             <Briefcase className="w-4 h-4" />
//                             {job.company}
//                           </span>
//                           <span className="flex items-center gap-1">
//                             <MapPin className="w-4 h-4" />
//                             {job.location || 'Remote'}
//                           </span>
//                           <span className="flex items-center gap-1">
//                             <DollarSign className="w-4 h-4" />
//                             {job.salary || 'Not specified'}
//                           </span>
//                         </div>
//                       </div>
//                       <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                         job.status === 'active' 
//                           ? 'bg-green-100 text-green-700' 
//                           : 'bg-neutral-100 text-neutral-700'
//                       }`}>
//                         {job.status || 'active'}
//                       </span>
//                     </div>

//                     <p className="text-neutral-600 mb-4 line-clamp-2">{job.description}</p>

//                     <div className="flex flex-wrap gap-3 text-sm">
//                       <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full">
//                         {job.jobType || 'Full-time'}
//                       </span>
//                       <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full flex items-center gap-1">
//                         <Eye className="w-3 h-3" />
//                         {job.viewCount || 0} views
//                       </span>
//                       <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full flex items-center gap-1">
//                         <Users className="w-3 h-3" />
//                         {job.applicationCount || 0} applications
//                       </span>
//                       <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full flex items-center gap-1">
//                         <Calendar className="w-3 h-3" />
//                         Posted {formatDate(job.postedAt)}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex flex-col gap-2">
//                     <Link
//                       href={`/referral/jobs/${job.id}`}
//                       className="px-4 py-2 bg-black text-white font-bold rounded-lg hover:bg-orange-600 transition-colors text-center flex items-center justify-center gap-2"
//                     >
//                       <ExternalLink className="w-4 h-4" />
//                       View Job
//                     </Link>
                    
//                     <button
//                       onClick={() => router.push(`/dashboard/messages?job=${job.id}`)}
//                       className="px-4 py-2 bg-orange-50 text-orange-600 font-bold rounded-lg hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
//                     >
//                       <MessageSquare className="w-4 h-4" />
//                       Messages
//                     </button>

//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => router.push(`/referral/post?edit=${job.id}`)}
//                         className="flex-1 px-3 py-2 bg-white border border-neutral-300 text-black font-medium rounded-lg hover:bg-neutral-50 transition-colors flex items-center justify-center gap-1"
//                       >
//                         <Edit className="w-4 h-4" />
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteJob(job.id)}
//                         className="flex-1 px-3 py-2 bg-white border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Info Section */}
//         {referralJobs.length > 0 && (
//           <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
//               <div>
//                 <h4 className="font-bold text-black mb-2">How the Referral Dashboard Works</h4>
//                 <ul className="text-sm text-neutral-600 space-y-2">
//                   <li>• <strong>View Job:</strong> See how your job appears to candidates in the marketplace</li>
//                   <li>• <strong>Messages:</strong> Chat directly with candidates interested in this job</li>
//                   <li>• <strong>Edit:</strong> Update job details if anything changes</li>
//                   <li>• <strong>Delete:</strong> Remove jobs that are no longer available</li>
//                   <li>• <strong>Track:</strong> Monitor views and applications in real-time</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function ReferralDashboard() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Referral Dashboard failed to load">
//       <ReferralDashboardContent />
//     </ClientErrorBoundary>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Link from 'next/link';
import { 
  Briefcase, MessageSquare, Users, Eye, Calendar, 
  DollarSign, MapPin, Trash2, Edit, ExternalLink,
  ChevronRight, AlertCircle
} from 'lucide-react';
import NotificationsDropdown from '@/components/NotificationsDropdown';
import ClientErrorBoundary from '@/components/ClientErrorBoundary';

function ReferralDashboardContent() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [referralJobs, setReferralJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalViews: 0,
    totalApplications: 0,
    activeJobs: 0
  });

  // Check authentication
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch referral jobs - FIXED: Using 'referralJobs' (lowercase)
  useEffect(() => {
    async function fetchReferralJobs() {
      if (!user) return;

      try {
        console.log('Fetching referral jobs for user:', user.uid);
        
        // FIXED: Changed from 'ReferralJobs' to 'referralJobs' (lowercase)
        const jobsRef = collection(db, 'referralJobs');
        const q = query(jobsRef, where('postedBy', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const jobs: any[] = [];
        let totalViews = 0;
        let totalApplications = 0;
        let activeJobs = 0;

        querySnapshot.forEach((doc) => {
          const jobData = doc.data();
          console.log('Found job:', { id: doc.id, ...jobData });
          jobs.push({ id: doc.id, ...jobData });
          
          // Calculate stats
          totalViews += jobData.views || 0;
          totalApplications += jobData.applications || 0;
          if (jobData.status === 'open' || jobData.status === undefined) activeJobs++;
        });

        console.log(`Total jobs found: ${jobs.length}`);
        setReferralJobs(jobs);
        setStats({
          totalJobs: jobs.length,
          totalViews,
          totalApplications,
          activeJobs
        });
        
      } catch (error) {
        console.error('Error fetching referral jobs:', error);
      } finally {
        setLoadingJobs(false);
      }
    }

    if (user) {
      fetchReferralJobs();
    }
  }, [user]);

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      // FIXED: Changed from 'ReferralJobs' to 'referralJobs'
      await deleteDoc(doc(db, 'referralJobs', jobId));
      setReferralJobs(referralJobs.filter(job => job.id !== jobId));
      setStats(prev => ({
        ...prev,
        totalJobs: prev.totalJobs - 1,
        activeJobs: prev.activeJobs - 1
      }));
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job. Please try again.');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Loading state
  if (loading || loadingJobs) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-neutral-100 border-t-orange-600 rounded-full animate-spin"></div>
        <p className="text-neutral-500 font-medium">Loading Referral Dashboard...</p>
      </div>
    );
  }

  // No user
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2 text-neutral-400 hover:text-black">
              <span className="text-lg">←</span>
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
            <span className="text-neutral-300">|</span>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-orange-600" />
              <span className="text-xl font-bold text-black">Referral Dashboard</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <NotificationsDropdown />
            
            <div className="flex items-center gap-3 pl-6 border-l border-neutral-100">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-black">{user.displayName}</p>
                <p className="text-xs text-neutral-500">Employee Account</p>
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
            Your Referral Jobs
          </h1>
          <p className="text-neutral-500">
            Manage your posted referral jobs, track applicants, and communicate with candidates.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">Total Jobs</p>
                <p className="text-3xl font-black text-black">{stats.totalJobs}</p>
              </div>
              <Briefcase className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">Total Views</p>
                <p className="text-3xl font-black text-black">{stats.totalViews}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">Applications</p>
                <p className="text-3xl font-black text-black">{stats.totalApplications}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">Active Jobs</p>
                <p className="text-3xl font-black text-black">{stats.activeJobs}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Your Posted Jobs</h2>
          <div className="flex gap-3">
            <Link
              href="/referral/post"
              className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-sm"
            >
              Post New Job
            </Link>
            <Link
              href="/referral/marketplace"
              className="px-6 py-3 bg-white border border-neutral-300 text-black font-bold rounded-xl hover:bg-neutral-50 transition-colors"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>

        {/* Jobs List */}
        {referralJobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-neutral-200 text-center">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-3">No Referral Jobs Yet</h3>
            <p className="text-neutral-500 max-w-md mx-auto mb-8">
              Start posting referral jobs to help candidates and earn bonuses. Your first job will appear here.
            </p>
            <Link
              href="/referral/post"
              className="inline-flex items-center px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg"
            >
              Post Your First Referral Job
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {referralJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl p-6 border border-neutral-200 hover:border-orange-300 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        {/* FIXED: Changed from job.jobTitle to job.title */}
                        <h3 className="text-xl font-bold text-black mb-1">{job.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-neutral-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location || 'Remote'}
                          </span>
                          {job.salaryMin && job.salaryMax ? (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              ₹{job.salaryMin.toLocaleString()} - ₹{job.salaryMax.toLocaleString()} {job.salaryUnit === 'monthly' ? '/month' : '/year'}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              Not specified
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        job.status === 'open' || job.status === undefined
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {job.status || 'open'}
                      </span>
                    </div>

                    <p className="text-neutral-600 mb-4 line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full">
                        {job.jobType || 'Full-time'}
                      </span>
                      {/* FIXED: Changed from viewCount to views */}
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {job.views || 0} views
                      </span>
                      {/* FIXED: Changed from applicationCount to applications */}
                      <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {job.applications || 0} applications
                      </span>
                      <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Posted {formatDate(job.postedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/referral/jobs/${job.id}`}
                      className="px-4 py-2 bg-black text-white font-bold rounded-lg hover:bg-orange-600 transition-colors text-center flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Job
                    </Link>
                    
                    <button
                      onClick={() => router.push(`/dashboard/messages?job=${job.id}`)}
                      className="px-4 py-2 bg-orange-50 text-orange-600 font-bold rounded-lg hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Messages
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/referral/post?edit=${job.id}`)}
                        className="flex-1 px-3 py-2 bg-white border border-neutral-300 text-black font-medium rounded-lg hover:bg-neutral-50 transition-colors flex items-center justify-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="flex-1 px-3 py-2 bg-white border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        {referralJobs.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-bold text-black mb-2">How the Referral Dashboard Works</h4>
                <ul className="text-sm text-neutral-600 space-y-2">
                  <li>• <strong>View Job:</strong> See how your job appears to candidates in the marketplace</li>
                  <li>• <strong>Messages:</strong> Chat directly with candidates interested in this job</li>
                  <li>• <strong>Edit:</strong> Update job details if anything changes</li>
                  <li>• <strong>Delete:</strong> Remove jobs that are no longer available</li>
                  <li>• <strong>Track:</strong> Monitor views and applications in real-time</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReferralDashboard() {
  return (
    <ClientErrorBoundary fallbackMessage="Referral Dashboard failed to load">
      <ReferralDashboardContent />
    </ClientErrorBoundary>
  );
}