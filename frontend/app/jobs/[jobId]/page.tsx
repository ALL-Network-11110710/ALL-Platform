// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';

// interface Job {
//   id?: string;
//   jobId?: string;
//   title?: string;
//   jobTitle?: string;
//   company?: string;
//   companyName?: string;
//   location: string;
//   jobType: string;
//   type?: string;
//   salary: string;
//   description: string;
//   requirements: string | string[];
//   postedBy: string;
//   postedAt: any;
//   jobLink?: string; // Added for external jobs
//   isExternal?: boolean; // Added for external jobs
// }

// export default function JobDetails({ params }: { params: Promise<{ jobId: string }> }) {
//   const [user, loadingAuth] = useAuthState(auth);
//   const [job, setJob] = useState<Job | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [applying, setApplying] = useState(false);
//   const [resolvedParams, setResolvedParams] = useState<{ jobId: string } | null>(null);
//   const [coverLetter, setCoverLetter] = useState('');
//   const router = useRouter();

//   // Resolve the params promise
//   useEffect(() => {
//     params.then(resolved => {
//       setResolvedParams(resolved);
//     });
//   }, [params]);

//   useEffect(() => {
//     if (resolvedParams) {
//       fetchJobDetails();
//     }
//   }, [resolvedParams]);

//   const fetchJobDetails = async () => {
//     if (!resolvedParams) return;
    
//     try {
//       const docRef = doc(db, 'jobs', resolvedParams.jobId);
//       const docSnap = await getDoc(docRef);
      
//       if (docSnap.exists()) {
//         setJob({ jobId: docSnap.id, ...docSnap.data() } as Job);
//       } else {
//         alert('Job not found!');
//         router.push('/jobs');
//       }
//     } catch (error) {
//       console.error('Error fetching job:', error);
//       alert('Error loading job details.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to format requirements for display
//   const formatRequirements = (requirements: string | string[]) => {
//     if (Array.isArray(requirements)) {
//       return requirements;
//     } else if (typeof requirements === 'string') {
//       // Try to split by common delimiters if it's a string
//       if (requirements.includes('\n')) {
//         return requirements.split('\n').filter(line => line.trim() !== '');
//       } else if (requirements.includes(',')) {
//         return requirements.split(',').map(item => item.trim());
//       } else {
//         return [requirements];
//       }
//     }
//     return ['No requirements specified'];
//   };

//   const handleApply = async () => {
//     if (!user || !job) return;
    
//     setApplying(true);
//     try {
//       // Ensure we have all required fields with fallbacks
//       const applicationData = {
//         jobId: job.jobId || job.id || '',
//         jobTitle: job.jobTitle || job.title || 'Untitled Position',
//         companyName: job.companyName || job.company || 'Unknown Company',
//         userId: user.uid,
//         applicantName: user.displayName || 'Unknown User',
//         applicantEmail: user.email || '',
//         coverLetter: coverLetter,
//         status: 'submitted',
//         appliedAt: new Date(),
//       };

//       // Save application to Firestore
//       await addDoc(collection(db, 'applications'), applicationData);

//       alert('Application submitted successfully! 🎉');
//       router.push('/jobs');
//     } catch (error) {
//       console.error('Error submitting application:', error);
//       alert('Error submitting application. Please try again.');
//     } finally {
//       setApplying(false);
//     }
//   };

//   const formatDate = (timestamp: any) => {
//     if (!timestamp) return 'Recent';
//     return new Date(timestamp.toDate()).toLocaleDateString();
//   };

//   // Helper function to get job title with fallback
//   const getJobTitle = () => {
//     return job?.jobTitle || job?.title || 'Untitled Position';
//   };

//   // Helper function to get company name with fallback
//   const getCompanyName = () => {
//     return job?.companyName || job?.company || 'Unknown Company';
//   };

//   // Check if this is an external job with a link
//   const isExternalJob = job?.jobLink && job.jobLink.trim() !== '';

//   if (loading) return (
//     <div className="min-h-screen bg-white flex items-center justify-center">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
//         <p className="mt-4 text-black">Loading job details...</p>
//       </div>
//     </div>
//   );
  
//   if (!job) return (
//     <div className="min-h-screen bg-white flex items-center justify-center">
//       <div className="text-center">
//         <p className="text-black text-xl">Job not found.</p>
//         <button 
//           onClick={() => router.push('/jobs')}
//           className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200"
//         >
//           Back to Jobs
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-white p-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Back Button */}
//         <button 
//           onClick={() => router.push('/jobs')}
//           className="flex items-center px-4 py-2 mb-6 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200"
//         >
//           <span className="mr-2">←</span>
//           Back to Jobs
//         </button>

//         {/* External Job Notice */}
//         {isExternalJob && (
//           <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-yellow-800">External Job Posting</h3>
//                 <div className="mt-2 text-sm text-yellow-700">
//                   <p>This job is hosted on an external website. You'll be redirected to the company's site to apply.</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Job Details Card */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 mb-6">
//           <h1 className="text-3xl font-bold text-black mb-2">
//             {getJobTitle()}
//           </h1>
          
//           <p className="text-xl font-semibold text-black mb-2">
//             {getCompanyName()}
//           </p>
          
//           <div className="flex flex-wrap gap-2 mb-4">
//             <span className="bg-orange-100 text-black px-3 py-1 rounded-full text-sm">{job.location}</span>
//             <span className="bg-orange-100 text-black px-3 py-1 rounded-full text-sm">{job.jobType || job.type}</span>
//             {job.salary && (
//               <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">{job.salary}</span>
//             )}
//             {isExternalJob && (
//               <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">External</span>
//             )}
//           </div>
          
//           <p className="text-black text-sm mb-6">
//             Posted on {formatDate(job.postedAt)}
//           </p>

//           <div className="mb-6">
//             <h2 className="text-xl font-semibold text-black mb-3">Job Description</h2>
//             <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
//               <p className="text-black leading-relaxed">{job.description}</p>
//             </div>
//           </div>

//           <div className="mb-6">
//             <h2 className="text-xl font-semibold text-black mb-3">Requirements</h2>
//             <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
//               <ul className="list-disc list-inside text-black leading-relaxed">
//                 {formatRequirements(job.requirements).map((req, index) => (
//                   <li key={index} className="mb-1">{req}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Application Section */}
//         {user ? (
//           isExternalJob ? (
//             // External job application button
//             <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//               <h2 className="text-2xl font-bold text-black mb-4">Apply for this Position</h2>
//               <p className="text-black mb-6">
//                 This job is hosted on an external website. Click the button below to apply directly on the company's site.
//               </p>
//               <a
//                 href={job.jobLink}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="block w-full py-3 px-4 bg-blue-500 text-white rounded-xl font-bold text-center hover:bg-blue-600 transition-all duration-200"
//               >
//                 Apply on Company Site
//               </a>
//             </div>
//           ) : (
//             // Standard application form
//             <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//               <h2 className="text-2xl font-bold text-black mb-4">Apply for this Position</h2>
              
//               <div className="mb-4">
//                 <label className="block text-black font-medium mb-2">
//                   Cover Letter *
//                 </label>
//                 <textarea
//                   value={coverLetter}
//                   onChange={(e) => setCoverLetter(e.target.value)}
//                   placeholder="Why are you interested in this position? What makes you a good fit?"
//                   rows={6}
//                   required
//                   className="w-full p-4 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
//                 />
//               </div>

//               <div className="mb-4">
//                 <p className="text-black"><strong>Applying as:</strong> {user.displayName} ({user.email})</p>
//               </div>
              
//               <button
//                 onClick={handleApply}
//                 disabled={applying || !coverLetter.trim()}
//                 className={`w-full py-3 rounded-xl font-bold ${
//                   applying || !coverLetter.trim()
//                     ? 'bg-orange-300 text-black cursor-not-allowed'
//                     : 'bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200'
//                 }`}
//               >
//                 {applying ? 'Submitting Application...' : 'Submit Application'}
//               </button>
//             </div>
//           )
//         ) : (
//           <div className="bg-orange-100 rounded-2xl p-6 text-center border border-orange-200">
//             <p className="text-black text-lg mb-4">⚠️ You need to be logged in to apply for this job.</p>
//             <button 
//               onClick={() => router.push('/login')}
//               className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200"
//             >
//               Login to Apply
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { 
//   Briefcase, MapPin, DollarSign, Clock, Building, 
//   ArrowLeft, CheckCircle, ExternalLink, Send 
// } from 'lucide-react';

// interface Job {
//   id?: string;
//   jobId?: string;
//   title?: string;
//   jobTitle?: string;
//   company?: string;
//   companyName?: string;
//   location: string;
//   jobType: string;
//   type?: string;
//   salary: string;
//   description: string;
//   requirements: string | string[];
//   postedBy: string;
//   postedAt: any;
//   jobLink?: string;
//   isExternal?: boolean;
// }

// export default function JobDetails({ params }: { params: Promise<{ jobId: string }> }) {
//   const [user, loadingAuth] = useAuthState(auth);
//   const [job, setJob] = useState<Job | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [applying, setApplying] = useState(false);
//   const [resolvedParams, setResolvedParams] = useState<{ jobId: string } | null>(null);
//   const [coverLetter, setCoverLetter] = useState('');
//   const router = useRouter();

//   // Resolve params
//   useEffect(() => {
//     params.then(resolved => {
//       setResolvedParams(resolved);
//     });
//   }, [params]);

//   // Fetch job
//   useEffect(() => {
//     if (resolvedParams) {
//       fetchJobDetails();
//     }
//   }, [resolvedParams]);

//   const fetchJobDetails = async () => {
//     if (!resolvedParams) return;
    
//     try {
//       const docRef = doc(db, 'jobs', resolvedParams.jobId);
//       const docSnap = await getDoc(docRef);
      
//       if (docSnap.exists()) {
//         setJob({ jobId: docSnap.id, ...docSnap.data() } as Job);
//       } else {
//         alert('Job not found!');
//         router.push('/jobs');
//       }
//     } catch (error) {
//       console.error('Error fetching job:', error);
//       alert('Error loading job details.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatRequirements = (requirements: string | string[]) => {
//     if (Array.isArray(requirements)) return requirements;
//     if (typeof requirements === 'string') {
//       if (requirements.includes('\n')) return requirements.split('\n').filter(line => line.trim() !== '');
//       if (requirements.includes(',')) return requirements.split(',').map(item => item.trim());
//       return [requirements];
//     }
//     return ['No requirements specified'];
//   };

//   const handleApply = async () => {
//     if (!user || !job) return;
    
//     setApplying(true);
//     try {
//       const applicationData = {
//         jobId: job.jobId || job.id || '',
//         jobTitle: job.jobTitle || job.title || 'Untitled Position',
//         companyName: job.companyName || job.company || 'Unknown Company',
//         userId: user.uid,
//         applicantName: user.displayName || 'Unknown User',
//         applicantEmail: user.email || '',
//         coverLetter: coverLetter,
//         status: 'submitted',
//         appliedAt: new Date(),
//       };

//       await addDoc(collection(db, 'applications'), applicationData);
//       alert('Application submitted successfully! 🎉');
//       router.push('/jobs');
//     } catch (error) {
//       console.error('Error submitting application:', error);
//       alert('Error submitting application. Please try again.');
//     } finally {
//       setApplying(false);
//     }
//   };

//   const formatDate = (timestamp: any) => {
//     if (!timestamp) return 'Recent';
//     // Safety check for non-Firestore dates
//     const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//     return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
//   };

//   const getJobTitle = () => job?.jobTitle || job?.title || 'Untitled Position';
//   const getCompanyName = () => job?.companyName || job?.company || 'Unknown Company';
//   const isExternalJob = job?.jobLink && job.jobLink.trim() !== '';

//   if (loading) return (
//     <div className="min-h-screen bg-white flex items-center justify-center">
//       <div className="w-12 h-12 border-4 border-neutral-100 border-t-orange-600 rounded-full animate-spin"></div>
//     </div>
//   );
  
//   if (!job) return null;

//   return (
//     <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6">
//       <div className="max-w-4xl mx-auto">
        
//         {/* Navigation */}
//         <button 
//           onClick={() => router.push('/jobs')}
//           className="group flex items-center text-sm font-bold text-neutral-500 hover:text-black mb-8 transition-colors"
//         >
//           <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
//           Back to Jobs
//         </button>

//         <div className="grid lg:grid-cols-3 gap-8">
          
//           {/* Main Content (Left Column) */}
//           <div className="lg:col-span-2 space-y-6">
            
//             {/* Job Header Card */}
//             <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
//               <div className="flex items-start justify-between mb-6">
//                 <div>
//                   <h1 className="text-3xl font-black text-black tracking-tight mb-2 leading-tight">
//                     {getJobTitle()}
//                   </h1>
//                   <div className="flex items-center text-neutral-600 font-medium text-lg">
//                     <Building className="w-5 h-5 mr-2 text-orange-500" />
//                     {getCompanyName()}
//                   </div>
//                 </div>
//                 {/* Logo Placeholder */}
//                 <div className="w-16 h-16 bg-neutral-100 rounded-xl flex items-center justify-center text-2xl font-bold text-neutral-400">
//                   {getCompanyName().charAt(0)}
//                 </div>
//               </div>

//               <div className="flex flex-wrap gap-3 mb-6">
//                 <span className="inline-flex items-center px-3 py-1 bg-neutral-100 rounded-lg text-sm font-medium text-neutral-700">
//                   <MapPin className="w-4 h-4 mr-1.5 text-neutral-500" />
//                   {job.location}
//                 </span>
//                 <span className="inline-flex items-center px-3 py-1 bg-neutral-100 rounded-lg text-sm font-medium text-neutral-700">
//                   <Briefcase className="w-4 h-4 mr-1.5 text-neutral-500" />
//                   {job.jobType || job.type}
//                 </span>
//                 {job.salary && (
//                   <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100">
//                     <DollarSign className="w-4 h-4 mr-1" />
//                     {job.salary}
//                   </span>
//                 )}
//               </div>

//               <div className="flex items-center text-xs text-neutral-400 font-medium">
//                 <Clock className="w-3.5 h-3.5 mr-1.5" />
//                 Posted {formatDate(job.postedAt)}
//               </div>
//             </div>

//             {/* Description */}
//             <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
//               <h3 className="text-lg font-bold text-black mb-4">About the Role</h3>
//               <div className="prose prose-neutral max-w-none text-neutral-600 leading-relaxed">
//                 {job.description}
//               </div>
//             </div>

//             {/* Requirements */}
//             <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
//               <h3 className="text-lg font-bold text-black mb-4">Requirements</h3>
//               <ul className="space-y-3">
//                 {formatRequirements(job.requirements).map((req, index) => (
//                   <li key={index} className="flex items-start text-neutral-600">
//                     <CheckCircle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
//                     <span className="leading-relaxed">{req}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* Sidebar (Right Column) - Application */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-3xl p-6 shadow-xl border border-orange-100 sticky top-8">
//               <h3 className="text-xl font-bold text-black mb-2">Interested?</h3>
//               <p className="text-sm text-neutral-500 mb-6">
//                 Read the description carefully before applying.
//               </p>

//               {!user ? (
//                 <div className="text-center py-6 bg-neutral-50 rounded-2xl border border-neutral-100">
//                   <p className="text-sm font-medium text-neutral-600 mb-4">
//                     Log in to apply for this position.
//                   </p>
//                   <button 
//                     onClick={() => router.push('/login')}
//                     className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-neutral-800 transition-colors"
//                   >
//                     Log In
//                   </button>
//                 </div>
//               ) : isExternalJob ? (
//                 <div className="space-y-4">
//                   <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
//                     This is an external listing. You will be redirected to the company's site.
//                   </div>
//                   <a
//                     href={job.jobLink}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center justify-center w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg group"
//                   >
//                     Apply Externally
//                     <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
//                   </a>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
//                       Cover Letter
//                     </label>
//                     <textarea
//                       value={coverLetter}
//                       onChange={(e) => setCoverLetter(e.target.value)}
//                       placeholder="Briefly introduce yourself..."
//                       rows={6}
//                       className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm text-black"
//                     />
//                   </div>
                  
//                   <button
//                     onClick={handleApply}
//                     disabled={applying || !coverLetter.trim()}
//                     className={`
//                       w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg
//                       ${applying || !coverLetter.trim()
//                         ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
//                         : 'bg-black text-white hover:bg-orange-600 hover:shadow-orange-200'}
//                     `}
//                   >
//                     {applying ? (
//                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                     ) : (
//                       <>
//                         Submit Application
//                         <Send className="w-4 h-4" />
//                       </>
//                     )}
//                   </button>
                  
//                   <p className="text-xs text-center text-neutral-400 mt-4">
//                     Applying as <span className="font-bold text-black">{user.displayName}</span>
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }


'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  Briefcase, MapPin, DollarSign, Clock, Building, 
  ArrowLeft, CheckCircle, ExternalLink, Send,
  FileText, Users, Award, Globe
} from 'lucide-react';

interface Job {
  id?: string;
  jobId?: string;
  title?: string;
  jobTitle?: string;
  company?: string;
  companyName?: string;
  location: string;
  jobType: string;
  type?: string;
  salary: string;
  description: string;
  requirements: string | string[];
  postedBy: string;
  postedAt: any;
  jobLink?: string;
  isExternal?: boolean;
}

export default function JobDetails({ params }: { params: Promise<{ jobId: string }> }) {
  const [user, loadingAuth] = useAuthState(auth);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ jobId: string } | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const router = useRouter();

  // Resolve params
  useEffect(() => {
    params.then(resolved => {
      setResolvedParams(resolved);
    });
  }, [params]);

  // Fetch job
  useEffect(() => {
    if (resolvedParams) {
      fetchJobDetails();
    }
  }, [resolvedParams]);

  const fetchJobDetails = async () => {
    if (!resolvedParams) return;
    
    try {
      const docRef = doc(db, 'jobs', resolvedParams.jobId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setJob({ jobId: docSnap.id, ...docSnap.data() } as Job);
      } else {
        alert('Job not found!');
        router.push('/jobs');
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      alert('Error loading job details.');
    } finally {
      setLoading(false);
    }
  };

  const formatRequirements = (requirements: string | string[]) => {
    if (Array.isArray(requirements)) return requirements;
    if (typeof requirements === 'string') {
      if (requirements.includes('\n')) return requirements.split('\n').filter(line => line.trim() !== '');
      if (requirements.includes(',')) return requirements.split(',').map(item => item.trim());
      return [requirements];
    }
    return ['No requirements specified'];
  };

  const formatDescription = (description: string) => {
    if (!description || description.trim() === '') {
      return <p className="text-neutral-400 italic">No description provided.</p>;
    }

    // If description contains HTML tags, render it safely
    if (description.includes('<') && description.includes('>')) {
      return (
        <div 
          className="job-description-html" 
          dangerouslySetInnerHTML={{ __html: description }}
        />
      );
    }

    // For plain text, split by newlines and create paragraphs
    const paragraphs = description.split('\n').filter(p => p.trim() !== '');
    
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="mb-4 text-justify">
        {paragraph}
      </p>
    ));
  };

  const getWordCount = (text: string) => {
    return text ? text.split(/\s+/).length : 0;
  };

  const getReadTime = (text: string) => {
    const wordCount = getWordCount(text);
    return Math.ceil(wordCount / 200); // 200 words per minute
  };

  const handleApply = async () => {
    if (!user || !job) return;
    
    setApplying(true);
    try {
      const applicationData = {
        jobId: job.jobId || job.id || '',
        jobTitle: job.jobTitle || job.title || 'Untitled Position',
        companyName: job.companyName || job.company || 'Unknown Company',
        userId: user.uid,
        applicantName: user.displayName || 'Unknown User',
        applicantEmail: user.email || '',
        coverLetter: coverLetter,
        status: 'submitted',
        appliedAt: new Date(),
      };

      await addDoc(collection(db, 'applications'), applicationData);
      alert('Application submitted successfully! 🎉');
      router.push('/jobs');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Recent';
    // Safety check for non-Firestore dates
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getJobTitle = () => job?.jobTitle || job?.title || 'Untitled Position';
  const getCompanyName = () => job?.companyName || job?.company || 'Unknown Company';
  const isExternalJob = job?.jobLink && job.jobLink.trim() !== '';

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-neutral-100 border-t-orange-600 rounded-full animate-spin"></div>
    </div>
  );
  
  if (!job) return null;

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6">
      {/* Add custom CSS for job description */}
      <style jsx>{`
        .job-description-html h1, .job-description-html h2, .job-description-html h3, .job-description-html h4 {
          font-weight: bold;
          color: #000;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .job-description-html h1 { font-size: 1.5rem; }
        .job-description-html h2 { font-size: 1.25rem; }
        .job-description-html h3 { font-size: 1.125rem; }
        .job-description-html p {
          margin-bottom: 1rem;
          text-align: justify;
        }
        .job-description-html ul, .job-description-html ol {
          margin-bottom: 1rem;
          margin-left: 1.5rem;
        }
        .job-description-html li {
          margin-bottom: 0.5rem;
          list-style-type: disc;
        }
        .job-description-html ol li {
          list-style-type: decimal;
        }
        .job-description-html a {
          color: #ea580c;
          text-decoration: underline;
        }
        .job-description-html a:hover {
          color: #c2410c;
        }
        .job-description-html strong {
          font-weight: bold;
          color: #000;
        }
        .job-description-html em {
          font-style: italic;
        }
        
        /* Custom scrollbar */
        .scrollable-description::-webkit-scrollbar {
          width: 6px;
        }
        .scrollable-description::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 10px;
        }
        .scrollable-description::-webkit-scrollbar-thumb {
          background: #d4d4d4;
          border-radius: 10px;
        }
        .scrollable-description::-webkit-scrollbar-thumb:hover {
          background: #a3a3a3;
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => router.push('/jobs')}
          className="group flex items-center text-sm font-bold text-neutral-500 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Jobs
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Job Header Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-black text-black tracking-tight mb-2 leading-tight">
                    {getJobTitle()}
                  </h1>
                  <div className="flex items-center text-neutral-600 font-medium text-lg">
                    <Building className="w-5 h-5 mr-2 text-orange-500" />
                    {getCompanyName()}
                  </div>
                </div>
                {/* Logo Placeholder */}
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center text-2xl font-bold text-orange-600 border border-orange-200">
                  {getCompanyName().charAt(0)}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="inline-flex items-center px-3 py-1 bg-neutral-100 rounded-lg text-sm font-medium text-neutral-700">
                  <MapPin className="w-4 h-4 mr-1.5 text-neutral-500" />
                  {job.location}
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-neutral-100 rounded-lg text-sm font-medium text-neutral-700">
                  <Briefcase className="w-4 h-4 mr-1.5 text-neutral-500" />
                  {job.jobType || job.type}
                </span>
                {job.salary && (
                  <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {job.salary}
                  </span>
                )}
                {isExternalJob && (
                  <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">
                    <Globe className="w-4 h-4 mr-1" />
                    External Job
                  </span>
                )}
              </div>

              <div className="flex items-center text-xs text-neutral-400 font-medium">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                Posted {formatDate(job.postedAt)}
                <span className="mx-2">•</span>
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                {getWordCount(job.description)} words
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-black">About the Role</h3>
                <span className="text-xs px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full">
                  {getReadTime(job.description)} min read
                </span>
              </div>
              
              <div className="scrollable-description max-h-[500px] overflow-y-auto pr-4">
                <div className="text-neutral-600 leading-relaxed">
                  {formatDescription(job.description)}
                </div>
              </div>
              
              {/* Scroll hint */}
              <div className="mt-4 pt-4 border-t border-neutral-100 text-xs text-neutral-400 flex items-center">
                <svg className="w-4 h-4 mr-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                Scroll to read full description
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-black">Requirements</h3>
                <span className="text-xs px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full">
                  {formatRequirements(job.requirements).length} requirements
                </span>
              </div>
              
              <div className="scrollable-description max-h-[400px] overflow-y-auto pr-4">
                <ul className="space-y-3">
                  {formatRequirements(job.requirements).map((req, index) => (
                    <li key={index} className="flex items-start text-neutral-600 p-3 rounded-lg hover:bg-neutral-50 transition-colors group">
                      <div className="flex-shrink-0 mt-0.5 mr-3">
                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-orange-600" />
                        </div>
                      </div>
                      <span className="leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Additional Info Section */}
            {(job.postedBy || isExternalJob) && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
                <h3 className="text-lg font-bold text-black mb-4">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {job.postedBy && (
                    <div className="flex items-center p-4 bg-neutral-50 rounded-xl">
                      <Users className="w-5 h-5 mr-3 text-neutral-500" />
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Posted By</p>
                        <p className="text-black">User ID: {job.postedBy.substring(0, 8)}...</p>
                      </div>
                    </div>
                  )}
                  {isExternalJob && (
                    <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                      <Award className="w-5 h-5 mr-3 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-blue-500">Application Method</p>
                        <p className="text-black">Apply on company website</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (Right Column) - Application */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-orange-100 sticky top-8">
              <h3 className="text-xl font-bold text-black mb-2">Interested?</h3>
              <p className="text-sm text-neutral-500 mb-6">
                Read the description carefully before applying.
              </p>

              {!user ? (
                <div className="text-center py-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <p className="text-sm font-medium text-neutral-600 mb-4">
                    Log in to apply for this position.
                  </p>
                  <button 
                    onClick={() => router.push('/login')}
                    className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-neutral-800 transition-colors"
                  >
                    Log In
                  </button>
                </div>
              ) : isExternalJob ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
                    <p className="font-medium mb-1">This is an external listing.</p>
                    <p>You will be redirected to the company's official site to apply.</p>
                  </div>
                  <a
                    href={job.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-200 group"
                  >
                    Apply Externally
                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <p className="text-xs text-center text-neutral-400 mt-2">
                    Opens in new tab
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">
                        Cover Letter
                      </label>
                      <span className="text-xs text-neutral-400">
                        {coverLetter.length}/1000 chars
                      </span>
                    </div>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Briefly introduce yourself and explain why you're a good fit..."
                      rows={6}
                      maxLength={1000}
                      className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm text-black resize-none"
                    />
                    <p className="text-xs text-neutral-400 mt-1">
                      Keep it concise and professional
                    </p>
                  </div>
                  
                  <button
                    onClick={handleApply}
                    disabled={applying || !coverLetter.trim()}
                    className={`
                      w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg
                      ${applying || !coverLetter.trim()
                        ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-black to-neutral-800 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-200'}
                    `}
                  >
                    {applying ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Submitting...
                      </div>
                    ) : (
                      <>
                        Submit Application
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  
                  <div className="pt-4 border-t border-neutral-100">
                    <p className="text-xs text-center text-neutral-400">
                      Applying as <span className="font-bold text-black">{user.displayName}</span>
                    </p>
                    <p className="text-xs text-center text-neutral-400 mt-1">
                      ({user.email})
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Tips Card */}
            <div className="mt-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
              <h4 className="font-bold text-black mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Application Tips
              </h4>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>Tailor your cover letter to this specific role</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>Highlight relevant experience from the requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>Keep your cover letter professional and concise</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>Proofread for spelling and grammar errors</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}