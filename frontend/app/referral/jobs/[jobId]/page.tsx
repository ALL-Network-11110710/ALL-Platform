// "use client";

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { auth, db } from '@/lib/firebase';
// import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import Link from 'next/link';

// export default function ReferralJobDetailsPage() {
//   const params = useParams();
//   const router = useRouter();
//   const [user, loading] = useAuthState(auth);
//   const [job, setJob] = useState<any>(null);
//   const [loadingJob, setLoadingJob] = useState(true);
//   const [employee, setEmployee] = useState<any>(null);
//   const [isStartingChat, setIsStartingChat] = useState(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

//   const jobId = params.jobId as string;

//   useEffect(() => {
//     if (!jobId) return;

//     const fetchJobDetails = async () => {
//       try {
//         setLoadingJob(true);
        
//         // Fetch job details
//         const jobDoc = await getDoc(doc(db, 'referralJobs', jobId));
        
//         if (!jobDoc.exists()) {
//           setMessage({
//             type: 'error',
//             text: 'Job not found or has been removed.'
//           });
//           setLoadingJob(false);
//           return;
//         }

//         const jobData = jobDoc.data();
//         setJob({
//           id: jobDoc.id,
//           ...jobData,
//           postedAt: jobData.postedAt?.toDate?.() || new Date(jobData.postedAt || Date.now())
//         });

//         // Increment view count
//         await updateDoc(doc(db, 'referralJobs', jobId), {
//           views: increment(1)
//         });

//         // Fetch employee details
//         if (jobData.postedBy) {
//           const employeeDoc = await getDoc(doc(db, 'users', jobData.postedBy));
//           if (employeeDoc.exists()) {
//             setEmployee(employeeDoc.data());
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching job:', error);
//         setMessage({
//           type: 'error',
//           text: 'Failed to load job details. Please try again.'
//         });
//       } finally {
//         setLoadingJob(false);
//       }
//     };

//     fetchJobDetails();
//   }, [jobId]);

//   const startChatWithEmployee = async () => {
//     if (!user) {
//       router.push('/login?redirect=' + encodeURIComponent(`/referral/jobs/${jobId}`));
//       return;
//     }

//     if (!job || !job.postedBy) return;

//     setIsStartingChat(true);
//     setMessage(null);

//     try {
//       // Generate conversation ID (sorted user IDs to ensure uniqueness)
//       const sortedIds = [user.uid, job.postedBy].sort();
//       const conversationId = sortedIds.join('_');
      
//       // Check if conversation already exists
//       const conversationDoc = await getDoc(doc(db, 'messages', conversationId));
      
//       if (!conversationDoc.exists()) {
//         // Create initial conversation document with setDoc and merge option
//         const conversationData = {
//           participants: [user.uid, job.postedBy],
//           participantsNames: [
//             user.displayName || user.email || 'You',
//             employee?.name || job.postedByName || 'Employee'
//           ],
//           lastMessage: `Hi! I'm interested in the ${job.title} position at ${job.company}`,
//           lastMessageAt: new Date().toISOString(),
//           unreadCount: { [job.postedBy]: 1 },
//           jobReference: {
//             jobId: job.id,
//             jobTitle: job.title,
//             company: job.company
//           }
//         };
        
//         // Use setDoc with merge: true to create or update
//         await setDoc(doc(db, 'messages', conversationId), conversationData, { merge: true });
//       }

//       // Redirect to chat
//       router.push(`/dashboard/messages/${conversationId}`);
      
//     } catch (error: any) {
//       console.error('Error starting chat:', error);
//       setMessage({
//         type: 'error',
//         text: `Failed to start chat: ${error.message || 'Please try again'}`
//       });
//     } finally {
//       setIsStartingChat(false);
//     }
//   };

//   const formatDate = (date: Date) => {
//     return new Intl.DateTimeFormat('en-IN', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     }).format(date);
//   };

//   if (loadingJob) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading job details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!job) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-3xl mx-auto text-center">
//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//               </svg>
//             </div>
            
//             <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
//             <p className="text-gray-600 mb-6">
//               This referral job is no longer available or has been removed.
//             </p>
            
//             <Link href="/referral/marketplace">
//               <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition">
//                 Browse Other Referral Jobs →
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header with Back Button */}
//         <div className="mb-8">
//           <Link href="/referral/marketplace" className="inline-block">
//             <button className="text-orange-600 hover:text-orange-800 font-medium flex items-center">
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
//               </svg>
//               Back to Referral Marketplace
//             </button>
//           </Link>
//         </div>

//         {/* Message Display */}
//         {message && (
//           <div className={`mb-8 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
//             {message.text}
//           </div>
//         )}

//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Main Content - Job Details */}
//           <div className="lg:w-2/3">
//             {/* Job Header */}
//             <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
//               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//                 <div>
//                   <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
//                   <div className="flex items-center text-lg text-gray-700 mb-4">
//                     <span className="font-semibold text-orange-600">{job.company}</span>
//                     <span className="mx-2">•</span>
//                     <span>{job.location}</span>
//                   </div>
                  
//                   {/* Job Badges */}
//                   <div className="flex flex-wrap gap-2 mb-4">
//                     <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
//                       {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
//                     </span>
//                     <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
//                       {job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)} Level
//                     </span>
//                     <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
//                       {job.remotePolicy.charAt(0).toUpperCase() + job.remotePolicy.slice(1)}
//                     </span>
//                     <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
//                       {job.category.charAt(0).toUpperCase() + job.category.slice(1)}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="mt-4 md:mt-0">
//                   <div className="text-right">
//                     <div className="text-sm text-gray-500">Posted</div>
//                     <div className="font-medium text-gray-900">{formatDate(job.postedAt)}</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Chat Button */}
//               <div className="border-t pt-6">
//                 <button
//                   onClick={startChatWithEmployee}
//                   disabled={isStartingChat || !user}
//                   className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-6 rounded-xl hover:from-orange-600 hover:to-orange-700 transition text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//                 >
//                   {isStartingChat ? (
//                     <span className="flex items-center">
//                       <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mr-3"></div>
//                       Starting Chat...
//                     </span>
//                   ) : !user ? (
//                     'Login to Chat with Employee'
//                   ) : (
//                     <>
//                       <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
//                       </svg>
//                       Chat Directly with Employee
//                     </>
//                   )}
//                 </button>
                
//                 <p className="text-center mt-4 text-gray-600">
//                   Connect directly with a verified employee at {job.company} to learn more about this opportunity
//                 </p>
//               </div>
//             </div>

//             {/* Job Description */}
//             <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Description</h2>
//               <div className="prose max-w-none">
//                 <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
//               </div>
//             </div>

//             {/* Requirements & Skills */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               {/* Requirements */}
//               <div className="bg-white rounded-2xl shadow-xl p-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
//                 <ul className="space-y-2">
//                   {Array.isArray(job.requirements) ? (
//                     job.requirements.map((req: string, index: number) => (
//                       <li key={index} className="flex items-start">
//                         <div className="text-orange-500 mr-3 mt-1">•</div>
//                         <span className="text-gray-700">{req}</span>
//                       </li>
//                     ))
//                   ) : (
//                     <li className="text-gray-700">No specific requirements listed</li>
//                   )}
//                 </ul>
//               </div>

//               {/* Skills */}
//               <div className="bg-white rounded-2xl shadow-xl p-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
//                 <div className="flex flex-wrap gap-2">
//                   {Array.isArray(job.skills) ? (
//                     job.skills.map((skill: string, index: number) => (
//                       <span
//                         key={index}
//                         className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium"
//                       >
//                         {skill}
//                       </span>
//                     ))
//                   ) : (
//                     <span className="text-gray-700">Skills not specified</span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Salary Information */}
//             {(job.salaryMin || job.salaryMax) && (
//               <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-4">Salary Information</h2>
//                 <div className="flex items-center">
//                   <div className="bg-orange-100 text-orange-800 p-4 rounded-lg mr-4">
//                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                     </svg>
//                   </div>
//                   <div>
//                     <div className="text-2xl font-bold text-gray-900">
//                       {job.salaryMin && job.salaryMax 
//                         ? `₹${job.salaryMin.toLocaleString()} - ₹${job.salaryMax.toLocaleString()}`
//                         : job.salaryMin 
//                         ? `From ₹${job.salaryMin.toLocaleString()}`
//                         : `Up to ₹${job.salaryMax.toLocaleString()}`
//                       }
//                       <span className="text-sm text-gray-600 ml-2">per {job.salaryUnit}</span>
//                     </div>
//                     <p className="text-gray-600 mt-1">Compensation range for this position</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Additional Information */}
//             <div className="bg-white rounded-2xl shadow-xl p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-2">Application Deadline</h3>
//                   <p className="text-gray-700">
//                     {job.applicationDeadline 
//                       ? new Date(job.applicationDeadline).toLocaleDateString('en-IN', {
//                           weekday: 'long',
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric'
//                         })
//                       : '30 days from posting'
//                     }
//                   </p>
//                 </div>
                
//                 {job.externalLink && (
//                   <div>
//                     <h3 className="font-semibold text-gray-900 mb-2">External Application</h3>
//                     <a
//                       href={job.externalLink}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-orange-600 hover:text-orange-800 font-medium"
//                     >
//                       Apply on company website →
//                     </a>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="lg:w-1/3">
//             {/* Employee Information */}
//             <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">About the Employee</h2>
              
//               <div className="flex items-center mb-6">
//                 <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
//                   {(employee?.name || job.postedByName || 'E').charAt(0).toUpperCase()}
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-gray-900 text-lg">
//                     {employee?.name || job.postedByName || 'Anonymous Employee'}
//                   </h3>
//                   <div className="flex items-center mt-1">
//                     <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
//                     <span className="text-green-600 font-medium text-sm">Verified Employee</span>
//                   </div>
//                 </div>
//               </div>

//               {employee?.headline && (
//                 <div className="mb-4">
//                   <p className="text-gray-700">{employee.headline}</p>
//                 </div>
//               )}

//               <div className="border-t pt-4">
//                 <h4 className="font-semibold text-gray-900 mb-2">Why chat with this employee?</h4>
//                 <ul className="space-y-2 text-sm text-gray-600">
//                   <li className="flex items-start">
//                     <div className="text-green-500 mr-2 mt-1">✓</div>
//                     <span>Get insider information about the role</span>
//                   </li>
//                   <li className="flex items-start">
//                     <div className="text-green-500 mr-2 mt-1">✓</div>
//                     <span>Learn about company culture and team</span>
//                   </li>
//                   <li className="flex items-start">
//                     <div className="text-green-500 mr-2 mt-1">✓</div>
//                     <span>Get referral to skip initial screening</span>
//                   </li>
//                   <li className="flex items-start">
//                     <div className="text-green-500 mr-2 mt-1">✓</div>
//                     <span>Receive interview tips and preparation help</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>

//             {/* How Referral Works */}
//             <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6 mb-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">🔄 How Referral Works</h2>
//               <div className="space-y-4">
//                 <div className="flex items-start">
//                   <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
//                     1
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-900">Chat with Employee</h4>
//                     <p className="text-sm text-gray-700">Connect directly to learn about the role</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
//                     2
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-900">Share Your Profile</h4>
//                     <p className="text-sm text-gray-700">Provide resume and portfolio if needed</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
//                     3
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-900">Get Referred Internally</h4>
//                     <p className="text-sm text-gray-700">Employee submits your profile directly to HR</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
//                     4
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-900">Faster Interview Process</h4>
//                     <p className="text-sm text-gray-700">Skip resume screening, go straight to interviews</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Stats */}
//             <div className="bg-white rounded-2xl shadow-xl p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">Job Statistics</h2>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Views</span>
//                   <span className="font-bold text-gray-900">{job.views || 0}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Active Applicants</span>
//                   <span className="font-bold text-gray-900">{job.applications || 0}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Job Status</span>
//                   <span className={`font-bold ${job.status === 'open' ? 'text-green-600' : 'text-red-600'}`}>
//                     {job.status === 'open' ? 'Open' : 'Closed'}
//                   </span>
//                 </div>
//               </div>
              
//               <div className="mt-6 pt-6 border-t border-gray-200">
//                 <p className="text-sm text-gray-600 mb-4">
//                   Found an issue with this job posting?
//                 </p>
//                 <button className="w-full border border-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 transition text-sm">
//                   Report This Job
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// Working main one 

// "use client";

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { auth, db } from '@/lib/firebase';
// import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import Link from 'next/link';
// import { startReferralConversation, canMessageEmployee } from '@/lib/startConversation'; // NEW IMPORT

// export default function ReferralJobDetailsPage() {
//   const params = useParams();
//   const router = useRouter();
//   const [user, loading] = useAuthState(auth);
//   const [job, setJob] = useState<any>(null);
//   const [loadingJob, setLoadingJob] = useState(true);
//   const [employee, setEmployee] = useState<any>(null);
//   const [isStartingChat, setIsStartingChat] = useState(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

//   const jobId = params.jobId as string;

//   useEffect(() => {
//     if (!jobId) return;

//     const fetchJobDetails = async () => {
//       try {
//         setLoadingJob(true);
        
//         // Fetch job details
//         const jobDoc = await getDoc(doc(db, 'referralJobs', jobId));
        
//         if (!jobDoc.exists()) {
//           setMessage({
//             type: 'error',
//             text: 'Job not found or has been removed.'
//           });
//           setLoadingJob(false);
//           return;
//         }

//         const jobData = jobDoc.data();
//         setJob({
//           id: jobDoc.id,
//           ...jobData,
//           postedAt: jobData.postedAt?.toDate?.() || new Date(jobData.postedAt || Date.now())
//         });

//         // Increment view count
//         await updateDoc(doc(db, 'referralJobs', jobId), {
//           views: increment(1)
//         });

//         // Fetch employee details
//         if (jobData.postedBy) {
//           const employeeDoc = await getDoc(doc(db, 'users', jobData.postedBy));
//           if (employeeDoc.exists()) {
//             setEmployee(employeeDoc.data());
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching job:', error);
//         setMessage({
//           type: 'error',
//           text: 'Failed to load job details. Please try again.'
//         });
//       } finally {
//         setLoadingJob(false);
//       }
//     };

//     fetchJobDetails();
//   }, [jobId]);

//   // NEW: Function to handle starting conversation with employee
//   const startChatWithEmployee = async () => {
//     if (!user) {
//       router.push('/login?redirect=' + encodeURIComponent(`/referral/jobs/${jobId}`));
//       return;
//     }

//     if (!job || !job.postedBy) return;

//     // Check if user can message the employee
//     if (!canMessageEmployee(user.uid, job.postedBy)) {
//       alert("You can't message yourself about your own job posting!");
//       return;
//     }

//     setIsStartingChat(true);
//     setMessage(null);

//     try {
//       // Get current user's name
//       let userName = 'A job seeker';
//       try {
//         const userDoc = await getDoc(doc(db, 'users', user.uid));
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           userName = userData.displayName || userData.name || user.email || 'A job seeker';
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }

//       // Start the conversation and create notification
//       const conversationId = await startReferralConversation(
//         job.id,
//         job.title,
//         job.company,
//         job.postedBy,
//         user.uid,
//         userName
//       );

//       // Redirect to the conversation page
//       router.push(`/dashboard/messages/${conversationId}`);
      
//     } catch (error: any) {
//       console.error('Error starting chat:', error);
//       setMessage({
//         type: 'error',
//         text: `Failed to start chat: ${error.message || 'Please try again'}`
//       });
//     } finally {
//       setIsStartingChat(false);
//     }
//   };

//   const formatDate = (date: Date) => {
//     return new Intl.DateTimeFormat('en-IN', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     }).format(date);
//   };

//   if (loadingJob) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading job details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!job) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-3xl mx-auto text-center">
//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//               </svg>
//             </div>
            
//             <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
//             <p className="text-gray-600 mb-6">
//               This referral job is no longer available or has been removed.
//             </p>
            
//             <Link href="/referral/marketplace">
//               <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition">
//                 Browse Other Referral Jobs →
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header with Back Button */}
//         <div className="mb-8">
//           <Link href="/referral/marketplace" className="inline-block">
//             <button className="text-orange-600 hover:text-orange-800 font-medium flex items-center">
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
//               </svg>
//               Back to Referral Marketplace
//             </button>
//           </Link>
//         </div>

//         {/* Message Display */}
//         {message && (
//           <div className={`mb-8 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
//             {message.text}
//           </div>
//         )}

//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Main Content - Job Details */}
//           <div className="lg:w-2/3">
//             {/* Job Header */}
//             <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
//               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//                 <div>
//                   <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
//                   <div className="flex items-center text-lg text-gray-700 mb-4">
//                     <span className="font-semibold text-orange-600">{job.company}</span>
//                     <span className="mx-2">•</span>
//                     <span>{job.location}</span>
//                   </div>
                  
//                   {/* Job Badges */}
//                   <div className="flex flex-wrap gap-2 mb-4">
//                     <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
//                       {job.jobType?.charAt(0).toUpperCase() + job.jobType?.slice(1) || 'Full-time'}
//                     </span>
//                     {job.experienceLevel && (
//                       <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
//                         {job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)} Level
//                       </span>
//                     )}
//                     {job.remotePolicy && (
//                       <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
//                         {job.remotePolicy.charAt(0).toUpperCase() + job.remotePolicy.slice(1)}
//                       </span>
//                     )}
//                     {job.category && (
//                       <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
//                         {job.category.charAt(0).toUpperCase() + job.category.slice(1)}
//                       </span>
//                     )}
//                   </div>
//                 </div>
                
//                 <div className="mt-4 md:mt-0">
//                   <div className="text-right">
//                     <div className="text-sm text-gray-500">Posted</div>
//                     <div className="font-medium text-gray-900">{formatDate(job.postedAt)}</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Chat Button */}
//               <div className="border-t pt-6">
//                 <button
//                   onClick={startChatWithEmployee}
//                   disabled={isStartingChat || !user}
//                   className={`w-full text-white font-bold py-4 px-6 rounded-xl text-lg flex items-center justify-center ${
//                     !user || (user && user.uid === job.postedBy)
//                       ? 'bg-gray-400 cursor-not-allowed'
//                       : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition'
//                   }`}
//                 >
//                   {isStartingChat ? (
//                     <span className="flex items-center">
//                       <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mr-3"></div>
//                       Starting Chat...
//                     </span>
//                   ) : !user ? (
//                     'Login to Chat with Employee'
//                   ) : user.uid === job.postedBy ? (
//                     'You posted this job'
//                   ) : (
//                     <>
//                       <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
//                       </svg>
//                       Chat Directly with Employee
//                     </>
//                   )}
//                 </button>
                
//                 <p className="text-center mt-4 text-gray-600">
//                   Connect directly with a verified employee at {job.company} to learn more about this opportunity
//                 </p>
//               </div>
//             </div>

//             {/* Job Description */}
//             <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Description</h2>
//               <div className="prose max-w-none">
//                 <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
//               </div>
//             </div>

//             {/* Requirements & Skills */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               {/* Requirements */}
//               <div className="bg-white rounded-2xl shadow-xl p-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
//                 <ul className="space-y-2">
//                   {Array.isArray(job.requirements) ? (
//                     job.requirements.map((req: string, index: number) => (
//                       <li key={index} className="flex items-start">
//                         <div className="text-orange-500 mr-3 mt-1">•</div>
//                         <span className="text-gray-700">{req}</span>
//                       </li>
//                     ))
//                   ) : (
//                     <li className="text-gray-700">No specific requirements listed</li>
//                   )}
//                 </ul>
//               </div>

//               {/* Skills */}
//               <div className="bg-white rounded-2xl shadow-xl p-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
//                 <div className="flex flex-wrap gap-2">
//                   {Array.isArray(job.skills) ? (
//                     job.skills.map((skill: string, index: number) => (
//                       <span
//                         key={index}
//                         className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium"
//                       >
//                         {skill}
//                       </span>
//                     ))
//                   ) : (
//                     <span className="text-gray-700">Skills not specified</span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Salary Information */}
//             {(job.salaryMin || job.salaryMax) && (
//               <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-4">Salary Information</h2>
//                 <div className="flex items-center">
//                   <div className="bg-orange-100 text-orange-800 p-4 rounded-lg mr-4">
//                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                     </svg>
//                   </div>
//                   <div>
//                     <div className="text-2xl font-bold text-gray-900">
//                       {job.salaryMin && job.salaryMax 
//                         ? `₹${job.salaryMin.toLocaleString()} - ₹${job.salaryMax.toLocaleString()}`
//                         : job.salaryMin 
//                         ? `From ₹${job.salaryMin.toLocaleString()}`
//                         : `Up to ₹${job.salaryMax.toLocaleString()}`
//                       }
//                       {job.salaryUnit && (
//                         <span className="text-sm text-gray-600 ml-2">per {job.salaryUnit}</span>
//                       )}
//                     </div>
//                     <p className="text-gray-600 mt-1">Compensation range for this position</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Additional Information */}
//             <div className="bg-white rounded-2xl shadow-xl p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-2">Application Deadline</h3>
//                   <p className="text-gray-700">
//                     {job.applicationDeadline 
//                       ? new Date(job.applicationDeadline).toLocaleDateString('en-IN', {
//                           weekday: 'long',
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric'
//                         })
//                       : '30 days from posting'
//                     }
//                   </p>
//                 </div>
                
//                 {job.externalLink && (
//                   <div>
//                     <h3 className="font-semibold text-gray-900 mb-2">External Application</h3>
//                     <a
//                       href={job.externalLink}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-orange-600 hover:text-orange-800 font-medium"
//                     >
//                       Apply on company website →
//                     </a>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="lg:w-1/3">
//             {/* Employee Information */}
//             <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">About the Employee</h2>
              
//               <div className="flex items-center mb-6">
//                 <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
//                   {(employee?.name || employee?.displayName || job.postedByName || 'E').charAt(0).toUpperCase()}
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-gray-900 text-lg">
//                     {employee?.name || employee?.displayName || job.postedByName || 'Anonymous Employee'}
//                   </h3>
//                   <div className="flex items-center mt-1">
//                     <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
//                     <span className="text-green-600 font-medium text-sm">Verified Employee</span>
//                   </div>
//                 </div>
//               </div>

//               {employee?.headline && (
//                 <div className="mb-4">
//                   <p className="text-gray-700">{employee.headline}</p>
//                 </div>
//               )}

//               <div className="border-t pt-4">
//                 <h4 className="font-semibold text-gray-900 mb-2">Why chat with this employee?</h4>
//                 <ul className="space-y-2 text-sm text-gray-600">
//                   <li className="flex items-start">
//                     <div className="text-green-500 mr-2 mt-1">✓</div>
//                     <span>Get insider information about the role</span>
//                   </li>
//                   <li className="flex items-start">
//                     <div className="text-green-500 mr-2 mt-1">✓</div>
//                     <span>Learn about company culture and team</span>
//                   </li>
//                   <li className="flex items-start">
//                     <div className="text-green-500 mr-2 mt-1">✓</div>
//                     <span>Get referral to skip initial screening</span>
//                   </li>
//                   <li className="flex items-start">
//                     <div className="text-green-500 mr-2 mt-1">✓</div>
//                     <span>Receive interview tips and preparation help</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>

//             {/* How Referral Works */}
//             <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6 mb-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">🔄 How Referral Works</h2>
//               <div className="space-y-4">
//                 <div className="flex items-start">
//                   <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
//                     1
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-900">Chat with Employee</h4>
//                     <p className="text-sm text-gray-700">Connect directly to learn about the role</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
//                     2
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-900">Share Your Profile</h4>
//                     <p className="text-sm text-gray-700">Provide resume and portfolio if needed</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
//                     3
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-900">Get Referred Internally</h4>
//                     <p className="text-sm text-gray-700">Employee submits your profile directly to HR</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
//                     4
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-900">Faster Interview Process</h4>
//                     <p className="text-sm text-gray-700">Skip resume screening, go straight to interviews</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Stats */}
//             <div className="bg-white rounded-2xl shadow-xl p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">Job Statistics</h2>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Views</span>
//                   <span className="font-bold text-gray-900">{job.views || 0}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Active Applicants</span>
//                   <span className="font-bold text-gray-900">{job.applications || 0}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Job Status</span>
//                   <span className={`font-bold ${job.status === 'open' ? 'text-green-600' : 'text-red-600'}`}>
//                     {job.status === 'open' ? 'Open' : 'Closed'}
//                   </span>
//                 </div>
//               </div>
              
//               <div className="mt-6 pt-6 border-t border-gray-200">
//                 <p className="text-sm text-gray-600 mb-4">
//                   Found an issue with this job posting?
//                 </p>
//                 <button className="w-full border border-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 transition text-sm">
//                   Report This Job
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import Link from 'next/link';
import { startReferralConversation, canMessageEmployee } from '@/lib/startConversation';

export default function ReferralJobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [job, setJob] = useState<any>(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [employee, setEmployee] = useState<any>(null);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const jobId = params.jobId as string;

  useEffect(() => {
    if (!jobId) return;

    const fetchJobDetails = async () => {
      try {
        setLoadingJob(true);
        
        // Fetch job details
        const jobDoc = await getDoc(doc(db, 'referralJobs', jobId));
        
        if (!jobDoc.exists()) {
          setMessage({
            type: 'error',
            text: 'Job not found or has been removed.'
          });
          setLoadingJob(false);
          return;
        }

        const jobData = jobDoc.data();
        setJob({
          id: jobDoc.id,
          ...jobData,
          postedAt: jobData.postedAt?.toDate?.() || new Date(jobData.postedAt || Date.now())
        });

        // FIXED: Increment view count - with safe error handling
        try {
          const jobRef = doc(db, 'referralJobs', jobId);
          await updateDoc(jobRef, {
            views: increment(1)
          }).catch((error) => {
            // Silently ignore view count update errors
            console.log('Note: Could not update view count (normal for some users)');
          });
        } catch (updateError) {
          // Don't let view count errors break the page
          console.log('View count update failed, continuing page load');
        }

        // Fetch employee details
        if (jobData.postedBy) {
          const employeeDoc = await getDoc(doc(db, 'users', jobData.postedBy));
          if (employeeDoc.exists()) {
            setEmployee(employeeDoc.data());
          }
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        setMessage({
          type: 'error',
          text: 'Failed to load job details. Please try again.'
        });
      } finally {
        setLoadingJob(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const startChatWithEmployee = async () => {
    if (!user) {
      router.push('/login?redirect=' + encodeURIComponent(`/referral/jobs/${jobId}`));
      return;
    }

    if (!job || !job.postedBy) return;

    // Check if user can message the employee
    if (!canMessageEmployee(user.uid, job.postedBy)) {
      alert("You can't message yourself about your own job posting!");
      return;
    }

    setIsStartingChat(true);
    setMessage(null);

    try {
      // Get current user's name
      let userName = 'A job seeker';
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          userName = userData.displayName || userData.name || user.email || 'A job seeker';
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }

      // Start the conversation and create notification
      const conversationId = await startReferralConversation(
        job.id,
        job.title,
        job.company,
        job.postedBy,
        user.uid,
        userName
      );

      // Redirect to the conversation page
      router.push(`/dashboard/messages/${conversationId}`);
      
    } catch (error: any) {
      console.error('Error starting chat:', error);
      // Show user-friendly error message
      setMessage({
        type: 'error',
        text: 'Failed to start chat. Please try again or contact support if the problem persists.'
      });
    } finally {
      setIsStartingChat(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (loadingJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
            <p className="text-gray-600 mb-6">
              This referral job is no longer available or has been removed.
            </p>
            
            <Link href="/referral/marketplace">
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition">
                Browse Other Referral Jobs →
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Link href="/referral/marketplace" className="inline-block">
            <button className="text-orange-600 hover:text-orange-800 font-medium flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Referral Marketplace
            </button>
          </Link>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-8 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Job Details */}
          <div className="lg:w-2/3">
            {/* Job Header */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <div className="flex items-center text-lg text-gray-700 mb-4">
                    <span className="font-semibold text-orange-600">{job.company}</span>
                    <span className="mx-2">•</span>
                    <span>{job.location}</span>
                  </div>
                  
                  {/* Job Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                      {job.jobType?.charAt(0).toUpperCase() + job.jobType?.slice(1) || 'Full-time'}
                    </span>
                    {job.experienceLevel && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)} Level
                      </span>
                    )}
                    {job.remotePolicy && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {job.remotePolicy.charAt(0).toUpperCase() + job.remotePolicy.slice(1)}
                      </span>
                    )}
                    {job.category && (
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        {job.category.charAt(0).toUpperCase() + job.category.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Posted</div>
                    <div className="font-medium text-gray-900">{formatDate(job.postedAt)}</div>
                  </div>
                </div>
              </div>

              {/* Chat Button */}
              <div className="border-t pt-6">
                <button
                  onClick={startChatWithEmployee}
                  disabled={isStartingChat || !user}
                  className={`w-full text-white font-bold py-4 px-6 rounded-xl text-lg flex items-center justify-center ${
                    !user || (user && user.uid === job.postedBy)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition'
                  }`}
                >
                  {isStartingChat ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mr-3"></div>
                      Starting Chat...
                    </span>
                  ) : !user ? (
                    'Login to Chat with Employee'
                  ) : user.uid === job.postedBy ? (
                    'You posted this job'
                  ) : (
                    <>
                      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                      Chat Directly with Employee
                    </>
                  )}
                </button>
                
                <p className="text-center mt-4 text-gray-600">
                  Connect directly with a verified employee at {job.company} to learn more about this opportunity
                </p>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            {/* Requirements & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Requirements */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {Array.isArray(job.requirements) ? (
                    job.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="text-orange-500 mr-3 mt-1">•</div>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-700">No specific requirements listed</li>
                  )}
                </ul>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(job.skills) ? (
                    job.skills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-700">Skills not specified</span>
                  )}
                </div>
              </div>
            </div>

            {/* Salary Information */}
            {(job.salaryMin || job.salaryMax) && (
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Salary Information</h2>
                <div className="flex items-center">
                  <div className="bg-orange-100 text-orange-800 p-4 rounded-lg mr-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {job.salaryMin && job.salaryMax 
                        ? `₹${job.salaryMin.toLocaleString()} - ₹${job.salaryMax.toLocaleString()}`
                        : job.salaryMin 
                        ? `From ₹${job.salaryMin.toLocaleString()}`
                        : `Up to ₹${job.salaryMax.toLocaleString()}`
                      }
                      {job.salaryUnit && (
                        <span className="text-sm text-gray-600 ml-2">per {job.salaryUnit}</span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">Compensation range for this position</p>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Application Deadline</h3>
                  <p className="text-gray-700">
                    {job.applicationDeadline 
                      ? new Date(job.applicationDeadline).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : '30 days from posting'
                    }
                  </p>
                </div>
                
                {job.externalLink && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">External Application</h3>
                    <a
                      href={job.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-800 font-medium"
                    >
                      Apply on company website →
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Employee Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About the Employee</h2>
              
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                  {(employee?.name || employee?.displayName || job.postedByName || 'E').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {employee?.name || employee?.displayName || job.postedByName || 'Anonymous Employee'}
                  </h3>
                  <div className="flex items-center mt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-600 font-medium text-sm">Verified Employee</span>
                  </div>
                </div>
              </div>

              {employee?.headline && (
                <div className="mb-4">
                  <p className="text-gray-700">{employee.headline}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Why chat with this employee?</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="text-green-500 mr-2 mt-1">✓</div>
                    <span>Get insider information about the role</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-500 mr-2 mt-1">✓</div>
                    <span>Learn about company culture and team</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-500 mr-2 mt-1">✓</div>
                    <span>Get referral to skip initial screening</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-500 mr-2 mt-1">✓</div>
                    <span>Receive interview tips and preparation help</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* How Referral Works */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🔄 How Referral Works</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Chat with Employee</h4>
                    <p className="text-sm text-gray-700">Connect directly to learn about the role</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Share Your Profile</h4>
                    <p className="text-sm text-gray-700">Provide resume and portfolio if needed</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Get Referred Internally</h4>
                    <p className="text-sm text-gray-700">Employee submits your profile directly to HR</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Faster Interview Process</h4>
                    <p className="text-sm text-gray-700">Skip resume screening, go straight to interviews</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Statistics</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Views</span>
                  <span className="font-bold text-gray-900">{job.views || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Applicants</span>
                  <span className="font-bold text-gray-900">{job.applications || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Job Status</span>
                  <span className={`font-bold ${job.status === 'open' ? 'text-green-600' : 'text-red-600'}`}>
                    {job.status === 'open' ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">
                  Found an issue with this job posting?
                </p>
                <button className="w-full border border-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 transition text-sm">
                  Report This Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}