// "use client";

// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// // Define the type for referral jobs
// interface ReferralJob {
//   id: string;
//   title: string;
//   company: string;
//   location: string;
//   bonusAmount: number;
//   skills: string[];
//   postedBy: string;
//   postedAt: any;
//   description: string;
//   requirements: string[];
//   companyEmail: string;
//   isActive: boolean;
// }

// export default function ReferralMarketplacePage() {
//   const [user, loadingAuth] = useAuthState(auth);
//   const router = useRouter();
//   const [referralJobs, setReferralJobs] = useState<ReferralJob[]>([]);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [isVerifiedEmployee, setIsVerifiedEmployee] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Check if user is a verified employee
//   useEffect(() => {
//     const checkVerification = async () => {
//       if (user) {
//         try {
//           const userDoc = await getDocs(query(
//             collection(db, 'users'),
//             where('uid', '==', user.uid)
//           ));
          
//           if (!userDoc.empty) {
//             const userData = userDoc.docs[0].data();
//             setIsVerifiedEmployee(userData.isVerifiedEmployee || false);
//           }
//         } catch (error) {
//           console.error('Error checking verification:', error);
//         }
//       }
//     };

//     checkVerification();
//   }, [user]);

//   // Fetch referral jobs
//   useEffect(() => {
//     const fetchReferralJobs = async () => {
//       try {
//         const jobsQuery = query(
//           collection(db, 'referralJobs'),
//           where('isActive', '==', true),
//           orderBy('postedAt', 'desc'),
//           limit(20)
//         );

//         const querySnapshot = await getDocs(jobsQuery);
//         const jobs: ReferralJob[] = [];
        
//         querySnapshot.forEach((doc) => {
//           jobs.push({
//             id: doc.id,
//             ...doc.data()
//           } as ReferralJob);
//         });

//         setReferralJobs(jobs);
//         setLoadingJobs(false);
//       } catch (error) {
//         console.error('Error fetching referral jobs:', error);
//         setLoadingJobs(false);
//       }
//     };

//     fetchReferralJobs();
//   }, []);

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   const formatDate = (timestamp: any) => {
//     if (!timestamp) return 'Recently';
//     const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//     return date.toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Prevent hydration errors
//   if (!mounted) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//       </div>
//     );
//   }

//   if (loadingAuth) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//         <p className="mt-4 text-black ml-4">Loading...</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-white">
//         <div className="max-w-7xl mx-auto px-4 py-12">
//           <div className="text-center">
//             <h1 className="text-4xl font-bold text-black mb-4">
//               Employee Referral Marketplace
//             </h1>
//             <p className="text-xl text-gray-600 mb-8">
//               Connect directly with verified employees for referral-based hiring
//             </p>
//             <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
//               <h2 className="text-2xl font-bold text-black mb-4">
//                 Please Sign In
//               </h2>
//               <p className="text-gray-600 mb-6">
//                 You need to be signed in to access the referral marketplace.
//               </p>
//               <button
//                 onClick={() => router.push('/login')}
//                 className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
//               >
//                 Sign In to Continue
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-black mb-4">
//             Employee Referral Marketplace
//           </h1>
//           <p className="text-xl text-gray-600 mb-6">
//             Get direct access to company employees for referral-based hiring. Skip the ATS and connect directly!
//           </p>
          
//           <div className="flex flex-wrap justify-center gap-4 mb-8">
//             {isVerifiedEmployee ? (
//               <Link
//                 href="/referral/post"
//                 className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300 shadow-lg"
//               >
//                 🚀 Post a Referral Job (Free for 3 Months)
//               </Link>
//             ) : (
//               <Link
//                 href="/referral/verify"
//                 className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300 shadow-lg"
//               >
//                 ✅ Get Verified as Employee
//               </Link>
//             )}
            
//             <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 shadow-lg">
//               💼 Browse All Jobs
//             </button>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
//             <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
//               <div className="text-3xl font-bold text-orange-500 mb-2">
//                 {referralJobs.length}+
//               </div>
//               <div className="text-gray-600">Active Referral Jobs</div>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
//               <div className="text-3xl font-bold text-green-500 mb-2">
//                 ₹15K - ₹50K
//               </div>
//               <div className="text-gray-600">Average Referral Bonus</div>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
//               <div className="text-3xl font-bold text-blue-500 mb-2">
//                 Free
//               </div>
//               <div className="text-gray-600">First 3 Months</div>
//             </div>
//           </div>
//         </div>

//         {/* How It Works */}
//         <div className="mb-12">
//           <h2 className="text-2xl font-bold text-black mb-6 text-center">
//             How It Works
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="bg-white p-6 rounded-lg shadow-lg border border-orange-200">
//               <div className="text-3xl mb-4">1️⃣</div>
//               <h3 className="text-xl font-semibold mb-3 text-black">Employees Post Jobs</h3>
//               <p className="text-gray-600">
//                 Verified employees post referral opportunities with bonus amounts. They must verify their company email.
//               </p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-lg border border-orange-200">
//               <div className="text-3xl mb-4">2️⃣</div>
//               <h3 className="text-xl font-semibold mb-3 text-black">Job Seekers Browse</h3>
//               <p className="text-gray-600">
//                 Browse referral jobs and connect directly with employees. First 3 months completely free!
//               </p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-lg border border-orange-200">
//               <div className="text-3xl mb-4">3️⃣</div>
//               <h3 className="text-xl font-semibold mb-3 text-black">Chat & Get Referred</h3>
//               <p className="text-gray-600">
//                 Chat directly with employees, share your profile, and get referred internally. Win-win for everyone!
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Referral Jobs List */}
//         <div>
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-black">
//               Available Referral Jobs
//             </h2>
//             <div className="text-gray-600">
//               Showing {referralJobs.length} jobs
//             </div>
//           </div>

//           {loadingJobs ? (
//             <div className="text-center py-12">
//               <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
//               <p className="mt-4 text-gray-600">Loading referral jobs...</p>
//             </div>
//           ) : referralJobs.length === 0 ? (
//             <div className="text-center py-12 bg-white rounded-lg shadow border border-orange-200">
//               <div className="text-4xl mb-4">💼</div>
//               <h3 className="text-xl font-semibold mb-2 text-black">No referral jobs yet</h3>
//               <p className="text-gray-600 mb-6">
//                 Be the first to post a referral job and earn bonus!
//               </p>
//               {isVerifiedEmployee ? (
//                 <Link
//                   href="/referral/post"
//                   className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
//                 >
//                   Post First Referral Job
//                 </Link>
//               ) : (
//                 <Link
//                   href="/referral/verify"
//                   className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
//                 >
//                   Get Verified to Post Jobs
//                 </Link>
//               )}
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {referralJobs.map((job) => (
//                 <div
//                   key={job.id}
//                   className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 border border-orange-200"
//                 >
//                   {/* Bonus Badge */}
//                   <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 text-center">
//                     <div className="text-xl font-bold">{formatCurrency(job.bonusAmount)}</div>
//                     <div className="text-sm">Referral Bonus</div>
//                   </div>

//                   <div className="p-6">
//                     <h3 className="text-xl font-bold text-black mb-2">
//                       {job.title}
//                     </h3>
//                     <div className="text-gray-600 mb-4">
//                       <div className="flex items-center mb-2">
//                         <span className="font-semibold">🏢 {job.company}</span>
//                       </div>
//                       <div className="flex items-center mb-2">
//                         <span className="font-semibold">📍 {job.location}</span>
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         Posted {formatDate(job.postedAt)}
//                       </div>
//                     </div>

//                     {/* Skills */}
//                     <div className="mb-4">
//                       <div className="text-sm font-semibold text-gray-700 mb-2">
//                         Required Skills:
//                       </div>
//                       <div className="flex flex-wrap gap-2">
//                         {job.skills.slice(0, 3).map((skill, index) => (
//                           <span
//                             key={index}
//                             className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
//                           >
//                             {skill}
//                           </span>
//                         ))}
//                         {job.skills.length > 3 && (
//                           <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
//                             +{job.skills.length - 3} more
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex flex-col gap-3">
//                       <Link
//                         href={`/referral/jobs/${job.id}`}
//                         className="bg-blue-500 text-white text-center py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
//                       >
//                         View Details
//                       </Link>
//                       <button
//                         onClick={() => {
//                           // This will be implemented in next task
//                           alert('Chat feature coming in next update!');
//                         }}
//                         className="bg-green-500 text-white text-center py-2 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
//                       >
//                         💬 Chat with Employee
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* CTA Section */}
//         <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-center text-white">
//           <h2 className="text-3xl font-bold mb-4">
//             Ready to Get Referred?
//           </h2>
//           <p className="text-xl mb-6 opacity-90">
//             Connect directly with employees and skip the traditional application process.
//           </p>
//           <div className="flex flex-wrap justify-center gap-4">
//             <Link
//               href="/referral/verify"
//               className="bg-white text-orange-500 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition duration-300 shadow-lg"
//             >
//               👨‍💼 Get Verified as Employee
//             </Link>
//             <button className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition duration-300 shadow-lg">
//               🔍 Browse All Jobs
//             </button>
//           </div>
//           <p className="mt-6 text-sm opacity-75">
//             ⭐ First 3 months completely free for everyone!
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// // Define the type for referral jobs
// interface ReferralJob {
//   id: string;
//   title: string;
//   company: string;
//   location: string;
//   bonusAmount: number;
//   skills: string[];
//   postedBy: string;
//   postedAt: any;
//   description: string;
//   requirements: string[];
//   companyEmail: string;
//   isActive: boolean;
// }

// export default function ReferralMarketplacePage() {
//   const [user, loadingAuth] = useAuthState(auth);
//   const router = useRouter();
//   const [referralJobs, setReferralJobs] = useState<ReferralJob[]>([]);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [isVerifiedEmployee, setIsVerifiedEmployee] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Check if user is a verified employee
//   useEffect(() => {
//     const checkVerification = async () => {
//       if (user) {
//         try {
//           const userDoc = await getDocs(query(
//             collection(db, 'users'),
//             where('uid', '==', user.uid)
//           ));
          
//           if (!userDoc.empty) {
//             const userData = userDoc.docs[0].data();
//             setIsVerifiedEmployee(userData.isVerifiedEmployee || false);
//           }
//         } catch (error) {
//           console.error('Error checking verification:', error);
//         }
//       }
//     };

//     checkVerification();
//   }, [user]);

//   // Fetch referral jobs
//   useEffect(() => {
//     const fetchReferralJobs = async () => {
//       try {
//         const jobsQuery = query(
//           collection(db, 'referralJobs'),
//           where('isActive', '==', true),
//           orderBy('postedAt', 'desc'),
//           limit(20)
//         );

//         const querySnapshot = await getDocs(jobsQuery);
//         const jobs: ReferralJob[] = [];
        
//         querySnapshot.forEach((doc) => {
//           jobs.push({
//             id: doc.id,
//             ...doc.data()
//           } as ReferralJob);
//         });

//         setReferralJobs(jobs);
//         setLoadingJobs(false);
//       } catch (error) {
//         console.error('Error fetching referral jobs:', error);
//         setLoadingJobs(false);
//       }
//     };

//     fetchReferralJobs();
//   }, []);

//   const formatDate = (timestamp: any) => {
//     if (!timestamp) return 'Recently';
//     const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//     return date.toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Prevent hydration errors
//   if (!mounted) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//       </div>
//     );
//   }

//   if (loadingAuth) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//         <p className="mt-4 text-black ml-4">Loading...</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-white">
//         <div className="max-w-7xl mx-auto px-4 py-12">
//           <div className="text-center">
//             <h1 className="text-4xl font-bold text-black mb-4">
//               Employee Referral Marketplace
//             </h1>
//             <p className="text-xl text-gray-600 mb-8">
//               Connect directly with verified employees for referral-based hiring
//             </p>
//             <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
//               <h2 className="text-2xl font-bold text-black mb-4">
//                 Please Sign In
//               </h2>
//               <p className="text-gray-600 mb-6">
//                 You need to be signed in to access the referral marketplace.
//               </p>
//               <button
//                 onClick={() => router.push('/login')}
//                 className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
//               >
//                 Sign In to Continue
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-black mb-4">
//             Employee Referral Marketplace
//           </h1>
//           <p className="text-xl text-gray-600 mb-6">
//             Get direct access to company employees for referral-based hiring. Skip the ATS and connect directly!
//           </p>
          
//           <div className="flex flex-wrap justify-center gap-4 mb-8">
//             {isVerifiedEmployee ? (
//               <Link
//                 href="/referral/post"
//                 className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300 shadow-lg"
//               >
//                 🚀 Post a Referral Job (Free for 3 Months)
//               </Link>
//             ) : (
//               <Link
//                 href="/referral/verify"
//                 className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300 shadow-lg"
//               >
//                 ✅ Get Verified as Employee
//               </Link>
//             )}
            
//             <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 shadow-lg">
//               💼 Browse All Jobs
//             </button>
//           </div>

//           {/* Stats - Updated to remove bonus amount */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
//             <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
//               <div className="text-3xl font-bold text-orange-500 mb-2">
//                 {referralJobs.length}+
//               </div>
//               <div className="text-gray-600">Active Referral Jobs</div>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
//               <div className="text-3xl font-bold text-blue-500 mb-2">
//                 50+
//               </div>
//               <div className="text-gray-600">Verified Employees</div>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
//               <div className="text-3xl font-bold text-green-500 mb-2">
//                 Free
//               </div>
//               <div className="text-gray-600">First 3 Months</div>
//             </div>
//           </div>
//         </div>

//         {/* How It Works */}
//         <div className="mb-12">
//           <h2 className="text-2xl font-bold text-black mb-6 text-center">
//             How It Works
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="bg-white p-6 rounded-lg shadow-lg border border-orange-200">
//               <div className="text-3xl mb-4">1️⃣</div>
//               <h3 className="text-xl font-semibold mb-3 text-black">Employees Post Jobs</h3>
//               <p className="text-gray-600">
//                 Verified employees post referral opportunities. They must verify their company email to ensure authenticity.
//               </p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-lg border border-orange-200">
//               <div className="text-3xl mb-4">2️⃣</div>
//               <h3 className="text-xl font-semibold mb-3 text-black">Job Seekers Browse</h3>
//               <p className="text-gray-600">
//                 Browse referral jobs and connect directly with employees. First 3 months completely free!
//               </p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-lg border border-orange-200">
//               <div className="text-3xl mb-4">3️⃣</div>
//               <h3 className="text-xl font-semibold mb-3 text-black">Chat & Get Referred</h3>
//               <p className="text-gray-600">
//                 Chat directly with employees, share your profile, and get referred internally. Win-win for everyone!
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Referral Jobs List */}
//         <div>
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-black">
//               Available Referral Jobs
//             </h2>
//             <div className="text-gray-600">
//               Showing {referralJobs.length} jobs
//             </div>
//           </div>

//           {loadingJobs ? (
//             <div className="text-center py-12">
//               <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
//               <p className="mt-4 text-gray-600">Loading referral jobs...</p>
//             </div>
//           ) : referralJobs.length === 0 ? (
//             <div className="text-center py-12 bg-white rounded-lg shadow border border-orange-200">
//               <div className="text-4xl mb-4">💼</div>
//               <h3 className="text-xl font-semibold mb-2 text-black">No referral jobs yet</h3>
//               <p className="text-gray-600 mb-6">
//                 Be the first to post a referral job and help candidates!
//               </p>
//               {isVerifiedEmployee ? (
//                 <Link
//                   href="/referral/post"
//                   className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
//                 >
//                   Post First Referral Job
//                 </Link>
//               ) : (
//                 <Link
//                   href="/referral/verify"
//                   className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
//                 >
//                   Get Verified to Post Jobs
//                 </Link>
//               )}
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {referralJobs.map((job) => (
//                 <div
//                   key={job.id}
//                   className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 border border-orange-200"
//                 >
//                   {/* Job card without bonus badge */}
//                   <div className="p-6">
//                     <h3 className="text-xl font-bold text-black mb-2">
//                       {job.title}
//                     </h3>
//                     <div className="text-gray-600 mb-4">
//                       <div className="flex items-center mb-2">
//                         <span className="font-semibold">🏢 {job.company}</span>
//                       </div>
//                       <div className="flex items-center mb-2">
//                         <span className="font-semibold">📍 {job.location}</span>
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         Posted {formatDate(job.postedAt)}
//                       </div>
//                     </div>

//                     {/* Skills */}
//                     <div className="mb-4">
//                       <div className="text-sm font-semibold text-gray-700 mb-2">
//                         Required Skills:
//                       </div>
//                       <div className="flex flex-wrap gap-2">
//                         {job.skills.slice(0, 3).map((skill, index) => (
//                           <span
//                             key={index}
//                             className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
//                           >
//                             {skill}
//                           </span>
//                         ))}
//                         {job.skills.length > 3 && (
//                           <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
//                             +{job.skills.length - 3} more
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex flex-col gap-3">
//                       <Link
//                         href={`/referral/jobs/${job.id}`}
//                         className="bg-blue-500 text-white text-center py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
//                       >
//                         View Details
//                       </Link>
//                       <button
//                         onClick={() => {
//                           // This will be implemented in next task
//                           alert('Chat feature coming in next update!');
//                         }}
//                         className="bg-green-500 text-white text-center py-2 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
//                       >
//                         💬 Chat with Employee
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* CTA Section */}
//         <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-center text-white">
//           <h2 className="text-3xl font-bold mb-4">
//             Ready to Get Referred?
//           </h2>
//           <p className="text-xl mb-6 opacity-90">
//             Connect directly with employees and skip the traditional application process.
//           </p>
//           <div className="flex flex-wrap justify-center gap-4">
//             <Link
//               href="/referral/verify"
//               className="bg-white text-orange-500 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition duration-300 shadow-lg"
//             >
//               👨‍💼 Get Verified as Employee
//             </Link>
//             <button className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition duration-300 shadow-lg">
//               🔍 Browse All Jobs
//             </button>
//           </div>
//           <p className="mt-6 text-sm opacity-75">
//             ⭐ First 3 months completely free for everyone!
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { startReferralConversation } from '@/lib/startConversation'; // NEW IMPORT

// // Define the type for referral jobs
// interface ReferralJob {
//   id: string;
//   title: string;
//   company: string;
//   location: string;
//   bonusAmount: number;
//   skills: string[];
//   postedBy: string;
//   postedAt: any;
//   description: string;
//   requirements: string[];
//   companyEmail: string;
//   isActive: boolean;
// }

// export default function ReferralMarketplacePage() {
//   const [user, loadingAuth] = useAuthState(auth);
//   const router = useRouter();
//   const [referralJobs, setReferralJobs] = useState<ReferralJob[]>([]);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [isVerifiedEmployee, setIsVerifiedEmployee] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const [startingConversation, setStartingConversation] = useState<string | null>(null); // NEW: Track which job is starting conversation

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Check if user is a verified employee
//   useEffect(() => {
//     const checkVerification = async () => {
//       if (user) {
//         try {
//           const userDoc = await getDocs(query(
//             collection(db, 'users'),
//             where('uid', '==', user.uid)
//           ));
          
//           if (!userDoc.empty) {
//             const userData = userDoc.docs[0].data();
//             setIsVerifiedEmployee(userData.isVerifiedEmployee || false);
//           }
//         } catch (error) {
//           console.error('Error checking verification:', error);
//         }
//       }
//     };

//     checkVerification();
//   }, [user]);

//   // Fetch referral jobs
//   useEffect(() => {
//     const fetchReferralJobs = async () => {
//       try {
//         const jobsQuery = query(
//           collection(db, 'referralJobs'),
//           where('isActive', '==', true),
//           orderBy('postedAt', 'desc'),
//           limit(20)
//         );

//         const querySnapshot = await getDocs(jobsQuery);
//         const jobs: ReferralJob[] = [];
        
//         querySnapshot.forEach((doc) => {
//           jobs.push({
//             id: doc.id,
//             ...doc.data()
//           } as ReferralJob);
//         });

//         setReferralJobs(jobs);
//         setLoadingJobs(false);
//       } catch (error) {
//         console.error('Error fetching referral jobs:', error);
//         setLoadingJobs(false);
//       }
//     };

//     fetchReferralJobs();
//   }, []);

//   // NEW: Function to handle starting conversation with employee
//   const handleStartConversation = async (job: ReferralJob) => {
//     if (!user) {
//       router.push('/login');
//       return;
//     }

//     // Don't allow users to message themselves
//     if (user.uid === job.postedBy) {
//       alert("You can't message yourself about your own job posting!");
//       return;
//     }

//     setStartingConversation(job.id);

//     try {
//       // Get current user's name
//       const userDoc = await getDocs(
//         query(collection(db, 'users'), where('uid', '==', user.uid))
//       );
      
//       let userName = 'A job seeker';
//       if (!userDoc.empty) {
//         const userData = userDoc.docs[0].data();
//         userName = userData.displayName || userData.name || 'A job seeker';
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
      
//     } catch (error) {
//       console.error('Error starting conversation:', error);
//       alert('Failed to start conversation. Please try again.');
//     } finally {
//       setStartingConversation(null);
//     }
//   };

//   const formatDate = (timestamp: any) => {
//     if (!timestamp) return 'Recently';
//     const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//     return date.toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Prevent hydration errors
//   if (!mounted) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//       </div>
//     );
//   }

//   if (loadingAuth) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//         <p className="mt-4 text-black ml-4">Loading...</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-white">
//         <div className="max-w-7xl mx-auto px-4 py-12">
//           <div className="text-center">
//             <h1 className="text-4xl font-bold text-black mb-4">
//               Employee Referral Marketplace
//             </h1>
//             <p className="text-xl text-gray-600 mb-8">
//               Connect directly with verified employees for referral-based hiring
//             </p>
//             <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
//               <h2 className="text-2xl font-bold text-black mb-4">
//                 Please Sign In
//               </h2>
//               <p className="text-gray-600 mb-6">
//                 You need to be signed in to access the referral marketplace.
//               </p>
//               <button
//                 onClick={() => router.push('/login')}
//                 className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
//               >
//                 Sign In to Continue
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-black mb-4">
//             Employee Referral Marketplace
//           </h1>
//           <p className="text-xl text-gray-600 mb-6">
//             Get direct access to company employees for referral-based hiring. Skip the ATS and connect directly!
//           </p>
          
//           <div className="flex flex-wrap justify-center gap-4 mb-8">
//             {isVerifiedEmployee ? (
//               <Link
//                 href="/referral/post"
//                 className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300 shadow-lg"
//               >
//                 🚀 Post a Referral Job (Free for 3 Months)
//               </Link>
//             ) : (
//               <Link
//                 href="/referral/verify"
//                 className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300 shadow-lg"
//               >
//                 ✅ Get Verified as Employee
//               </Link>
//             )}
            
//             <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 shadow-lg">
//               💼 Browse All Jobs
//             </button>
//           </div>

//           {/* Stats - Updated to remove bonus amount */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
//             <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
//               <div className="text-3xl font-bold text-orange-500 mb-2">
//                 {referralJobs.length}+
//               </div>
//               <div className="text-gray-600">Active Referral Jobs</div>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
//               <div className="text-3xl font-bold text-blue-500 mb-2">
//                 50+
//               </div>
//               <div className="text-gray-600">Verified Employees</div>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
//               <div className="text-3xl font-bold text-green-500 mb-2">
//                 Free
//               </div>
//               <div className="text-gray-600">First 3 Months</div>
//             </div>
//           </div>
//         </div>

//         {/* How It Works */}
//         <div className="mb-12">
//           <h2 className="text-2xl font-bold text-black mb-6 text-center">
//             How It Works
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="bg-white p-6 rounded-lg shadow-lg border border-orange-200">
//               <div className="text-3xl mb-4">1️⃣</div>
//               <h3 className="text-xl font-semibold mb-3 text-black">Employees Post Jobs</h3>
//               <p className="text-gray-600">
//                 Verified employees post referral opportunities. They must verify their company email to ensure authenticity.
//               </p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-lg border border-orange-200">
//               <div className="text-3xl mb-4">2️⃣</div>
//               <h3 className="text-xl font-semibold mb-3 text-black">Job Seekers Browse</h3>
//               <p className="text-gray-600">
//                 Browse referral jobs and connect directly with employees. First 3 months completely free!
//               </p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-lg border border-orange-200">
//               <div className="text-3xl mb-4">3️⃣</div>
//               <h3 className="text-xl font-semibold mb-3 text-black">Chat & Get Referred</h3>
//               <p className="text-gray-600">
//                 Chat directly with employees, share your profile, and get referred internally. Win-win for everyone!
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Referral Jobs List */}
//         <div>
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-black">
//               Available Referral Jobs
//             </h2>
//             <div className="text-gray-600">
//               Showing {referralJobs.length} jobs
//             </div>
//           </div>

//           {loadingJobs ? (
//             <div className="text-center py-12">
//               <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
//               <p className="mt-4 text-gray-600">Loading referral jobs...</p>
//             </div>
//           ) : referralJobs.length === 0 ? (
//             <div className="text-center py-12 bg-white rounded-lg shadow border border-orange-200">
//               <div className="text-4xl mb-4">💼</div>
//               <h3 className="text-xl font-semibold mb-2 text-black">No referral jobs yet</h3>
//               <p className="text-gray-600 mb-6">
//                 Be the first to post a referral job and help candidates!
//               </p>
//               {isVerifiedEmployee ? (
//                 <Link
//                   href="/referral/post"
//                   className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
//                 >
//                   Post First Referral Job
//                 </Link>
//               ) : (
//                 <Link
//                   href="/referral/verify"
//                   className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
//                 >
//                   Get Verified to Post Jobs
//                 </Link>
//               )}
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {referralJobs.map((job) => (
//                 <div
//                   key={job.id}
//                   className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 border border-orange-200"
//                 >
//                   {/* Job card without bonus badge */}
//                   <div className="p-6">
//                     <h3 className="text-xl font-bold text-black mb-2">
//                       {job.title}
//                     </h3>
//                     <div className="text-gray-600 mb-4">
//                       <div className="flex items-center mb-2">
//                         <span className="font-semibold">🏢 {job.company}</span>
//                       </div>
//                       <div className="flex items-center mb-2">
//                         <span className="font-semibold">📍 {job.location}</span>
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         Posted {formatDate(job.postedAt)}
//                       </div>
//                     </div>

//                     {/* Skills */}
//                     <div className="mb-4">
//                       <div className="text-sm font-semibold text-gray-700 mb-2">
//                         Required Skills:
//                       </div>
//                       <div className="flex flex-wrap gap-2">
//                         {job.skills.slice(0, 3).map((skill, index) => (
//                           <span
//                             key={index}
//                             className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
//                           >
//                             {skill}
//                           </span>
//                         ))}
//                         {job.skills.length > 3 && (
//                           <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
//                             +{job.skills.length - 3} more
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex flex-col gap-3">
//                       <Link
//                         href={`/referral/jobs/${job.id}`}
//                         className="bg-blue-500 text-white text-center py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
//                       >
//                         View Details
//                       </Link>
                      
//                       {/* Chat with Employee Button - UPDATED */}
//                       <button
//                         onClick={() => handleStartConversation(job)}
//                         disabled={startingConversation === job.id || user.uid === job.postedBy}
//                         className={`text-white text-center py-2 rounded-lg font-semibold transition duration-300 ${
//                           user.uid === job.postedBy
//                             ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                             : startingConversation === job.id
//                             ? 'bg-green-600 cursor-wait'
//                             : 'bg-green-500 hover:bg-green-600'
//                         }`}
//                       >
//                         {user.uid === job.postedBy ? (
//                           'You posted this job'
//                         ) : startingConversation === job.id ? (
//                           <>
//                             <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
//                             Starting chat...
//                           </>
//                         ) : (
//                           '💬 Chat with Employee'
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* CTA Section */}
//         <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-center text-white">
//           <h2 className="text-3xl font-bold mb-4">
//             Ready to Get Referred?
//           </h2>
//           <p className="text-xl mb-6 opacity-90">
//             Connect directly with employees and skip the traditional application process.
//           </p>
//           <div className="flex flex-wrap justify-center gap-4">
//             <Link
//               href="/referral/verify"
//               className="bg-white text-orange-500 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition duration-300 shadow-lg"
//             >
//               👨‍💼 Get Verified as Employee
//             </Link>
//             <button className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition duration-300 shadow-lg">
//               🔍 Browse All Jobs
//             </button>
//           </div>
//           <p className="mt-6 text-sm opacity-75">
//             ⭐ First 3 months completely free for everyone!
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// Working main one

// "use client";

// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { startReferralConversation } from '@/lib/startConversation';

// // Define the type for referral jobs
// interface ReferralJob {
//   id: string;
//   title: string;
//   company: string;
//   location: string;
//   bonusAmount: number;
//   skills: string[];
//   postedBy: string;
//   postedAt: any;
//   description: string;
//   requirements: string[];
//   companyEmail: string;
//   isActive: boolean;
// }

// // Filter state interface
// interface FilterState {
//   search: string;
//   location: string;
//   company: string;
//   skill: string;
//   sortBy: 'newest' | 'oldest';
// }

// export default function ReferralMarketplacePage() {
//   const [user, loadingAuth] = useAuthState(auth);
//   const router = useRouter();
//   const [referralJobs, setReferralJobs] = useState<ReferralJob[]>([]);
//   const [filteredJobs, setFilteredJobs] = useState<ReferralJob[]>([]);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [isVerifiedEmployee, setIsVerifiedEmployee] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const [startingConversation, setStartingConversation] = useState<string | null>(null);
  
//   // Filter states
//   const [filters, setFilters] = useState<FilterState>({
//     search: '',
//     location: 'all',
//     company: 'all',
//     skill: 'all',
//     sortBy: 'newest'
//   });

//   // Unique values for filters
//   const [locations, setLocations] = useState<string[]>([]);
//   const [companies, setCompanies] = useState<string[]>([]);
//   const [allSkills, setAllSkills] = useState<string[]>([]);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Check if user is a verified employee
//   useEffect(() => {
//     const checkVerification = async () => {
//       if (user) {
//         try {
//           const userDoc = await getDocs(query(
//             collection(db, 'users'),
//             where('uid', '==', user.uid)
//           ));
          
//           if (!userDoc.empty) {
//             const userData = userDoc.docs[0].data();
//             setIsVerifiedEmployee(userData.isVerifiedEmployee || false);
//           }
//         } catch (error) {
//           console.error('Error checking verification:', error);
//         }
//       }
//     };

//     checkVerification();
//   }, [user]);

//   // Fetch referral jobs
//   useEffect(() => {
//     const fetchReferralJobs = async () => {
//       try {
//         const jobsQuery = query(
//           collection(db, 'referralJobs'),
//           where('isActive', '==', true),
//           orderBy('postedAt', 'desc')
//         );

//         const querySnapshot = await getDocs(jobsQuery);
//         const jobs: ReferralJob[] = [];
//         const uniqueLocations = new Set<string>();
//         const uniqueCompanies = new Set<string>();
//         const uniqueSkills = new Set<string>();
        
//         querySnapshot.forEach((doc) => {
//           const jobData = {
//             id: doc.id,
//             ...doc.data()
//           } as ReferralJob;
          
//           jobs.push(jobData);
          
//           // Collect unique values for filters
//           if (jobData.location) uniqueLocations.add(jobData.location);
//           if (jobData.company) uniqueCompanies.add(jobData.company);
//           if (jobData.skills) {
//             jobData.skills.forEach(skill => uniqueSkills.add(skill));
//           }
//         });

//         setReferralJobs(jobs);
//         setFilteredJobs(jobs);
//         setLocations(Array.from(uniqueLocations).sort());
//         setCompanies(Array.from(uniqueCompanies).sort());
//         setAllSkills(Array.from(uniqueSkills).sort());
//         setLoadingJobs(false);
//       } catch (error) {
//         console.error('Error fetching referral jobs:', error);
//         setLoadingJobs(false);
//       }
//     };

//     fetchReferralJobs();
//   }, []);

//   // Apply filters whenever filters or jobs change
//   useEffect(() => {
//     let result = [...referralJobs];

//     // Apply search filter
//     if (filters.search) {
//       const searchLower = filters.search.toLowerCase();
//       result = result.filter(job =>
//         job.title.toLowerCase().includes(searchLower) ||
//         job.company.toLowerCase().includes(searchLower) ||
//         job.description.toLowerCase().includes(searchLower) ||
//         job.skills.some(skill => skill.toLowerCase().includes(searchLower))
//       );
//     }

//     // Apply location filter
//     if (filters.location !== 'all') {
//       result = result.filter(job => job.location === filters.location);
//     }

//     // Apply company filter
//     if (filters.company !== 'all') {
//       result = result.filter(job => job.company === filters.company);
//     }

//     // Apply skill filter
//     if (filters.skill !== 'all') {
//       result = result.filter(job => job.skills.includes(filters.skill));
//     }

//     // Apply sorting
//     result.sort((a, b) => {
//       const dateA = a.postedAt?.toDate ? a.postedAt.toDate() : new Date(a.postedAt);
//       const dateB = b.postedAt?.toDate ? b.postedAt.toDate() : new Date(b.postedAt);
      
//       return filters.sortBy === 'newest' 
//         ? dateB.getTime() - dateA.getTime()
//         : dateA.getTime() - dateB.getTime();
//     });

//     setFilteredJobs(result);
//   }, [filters, referralJobs]);

//   // Handle starting conversation with employee
//   const handleStartConversation = async (job: ReferralJob) => {
//     if (!user) {
//       router.push('/login');
//       return;
//     }

//     if (user.uid === job.postedBy) {
//       alert("You can't message yourself about your own job posting!");
//       return;
//     }

//     setStartingConversation(job.id);

//     try {
//       const userDoc = await getDocs(
//         query(collection(db, 'users'), where('uid', '==', user.uid))
//       );
      
//       let userName = 'A job seeker';
//       if (!userDoc.empty) {
//         const userData = userDoc.docs[0].data();
//         userName = userData.displayName || userData.name || 'A job seeker';
//       }

//       const conversationId = await startReferralConversation(
//         job.id,
//         job.title,
//         job.company,
//         job.postedBy,
//         user.uid,
//         userName
//       );

//       router.push(`/dashboard/messages/${conversationId}`);
      
//     } catch (error) {
//       console.error('Error starting conversation:', error);
//       alert('Failed to start conversation. Please try again.');
//     } finally {
//       setStartingConversation(null);
//     }
//   };

//   const formatDate = (timestamp: any) => {
//     if (!timestamp) return 'Recently';
//     const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//     const now = new Date();
//     const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
//     if (diffDays === 0) return 'Today';
//     if (diffDays === 1) return 'Yesterday';
//     if (diffDays < 7) return `${diffDays} days ago`;
    
//     return date.toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'short'
//     });
//   };

//   const handleFilterChange = (key: keyof FilterState, value: string) => {
//     setFilters(prev => ({
//       ...prev,
//       [key]: value
//     }));
//   };

//   const clearFilters = () => {
//     setFilters({
//       search: '',
//       location: 'all',
//       company: 'all',
//       skill: 'all',
//       sortBy: 'newest'
//     });
//   };

//   // Prevent hydration errors
//   if (!mounted) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//       </div>
//     );
//   }

//   if (loadingAuth) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//         <p className="mt-4 text-black ml-4">Loading...</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center p-4">
//         <div className="max-w-md w-full text-center">
//           <h1 className="text-2xl font-bold text-black mb-4">
//             Employee Referral Marketplace
//           </h1>
//           <p className="text-gray-600 mb-6">
//             Please sign in to access referral jobs
//           </p>
//           <button
//             onClick={() => router.push('/login')}
//             className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300 w-full"
//           >
//             Sign In
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Header Section */}
//         <div className="mb-8">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-black">
//                 Employee Referral Marketplace
//               </h1>
//               <p className="text-gray-600 mt-2">
//                 Connect directly with verified employees for referral opportunities
//               </p>
//             </div>
            
//             {isVerifiedEmployee ? (
//               <Link
//                 href="/referral/post"
//                 className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300 shadow-md whitespace-nowrap"
//               >
//                 + Post Referral Job
//               </Link>
//             ) : (
//               <Link
//                 href="/referral/verify"
//                 className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300 shadow-md whitespace-nowrap"
//               >
//                 Get Verified to Post Jobs
//               </Link>
//             )}
//           </div>

//           {/* Stats Bar */}
//           <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//             <div className="text-sm text-gray-600">
//               <span className="font-semibold text-black">{filteredJobs.length}</span> referral jobs available
//             </div>
//             <div className="text-sm text-gray-600">
//               {referralJobs.length > 0 && (
//                 <span className="text-orange-500 font-semibold">Free for 3 months</span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Filter Section */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
//             {/* Search Input */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Search Jobs
//               </label>
//               <input
//                 type="text"
//                 value={filters.search}
//                 onChange={(e) => handleFilterChange('search', e.target.value)}
//                 placeholder="Job title, company, or skills"
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
//               />
//             </div>

//             {/* Location Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Location
//               </label>
//               <select
//                 value={filters.location}
//                 onChange={(e) => handleFilterChange('location', e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black bg-white"
//               >
//                 <option value="all">All Locations</option>
//                 {locations.map((location, index) => (
//                   <option key={index} value={location}>{location}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Company Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Company
//               </label>
//               <select
//                 value={filters.company}
//                 onChange={(e) => handleFilterChange('company', e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black bg-white"
//               >
//                 <option value="all">All Companies</option>
//                 {companies.map((company, index) => (
//                   <option key={index} value={company}>{company}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Skills Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Skills
//               </label>
//               <select
//                 value={filters.skill}
//                 onChange={(e) => handleFilterChange('skill', e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black bg-white"
//               >
//                 <option value="all">All Skills</option>
//                 {allSkills.map((skill, index) => (
//                   <option key={index} value={skill}>{skill}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Sort By */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Sort By
//               </label>
//               <select
//                 value={filters.sortBy}
//                 onChange={(e) => handleFilterChange('sortBy', e.target.value as 'newest' | 'oldest')}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black bg-white"
//               >
//                 <option value="newest">Newest First</option>
//                 <option value="oldest">Oldest First</option>
//               </select>
//             </div>
//           </div>

//           {/* Active Filters and Clear Button */}
//           <div className="flex flex-wrap items-center justify-between gap-2">
//             <div className="flex flex-wrap gap-2">
//               {filters.search && (
//                 <span className="inline-flex items-center bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full">
//                   Search: {filters.search}
//                   <button
//                     onClick={() => handleFilterChange('search', '')}
//                     className="ml-2 text-orange-600 hover:text-orange-800"
//                   >
//                     ×
//                   </button>
//                 </span>
//               )}
//               {filters.location !== 'all' && (
//                 <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
//                   {filters.location}
//                   <button
//                     onClick={() => handleFilterChange('location', 'all')}
//                     className="ml-2 text-blue-600 hover:text-blue-800"
//                   >
//                     ×
//                   </button>
//                 </span>
//               )}
//               {filters.company !== 'all' && (
//                 <span className="inline-flex items-center bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
//                   {filters.company}
//                   <button
//                     onClick={() => handleFilterChange('company', 'all')}
//                     className="ml-2 text-green-600 hover:text-green-800"
//                   >
//                     ×
//                   </button>
//                 </span>
//               )}
//               {filters.skill !== 'all' && (
//                 <span className="inline-flex items-center bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
//                   {filters.skill}
//                   <button
//                     onClick={() => handleFilterChange('skill', 'all')}
//                     className="ml-2 text-purple-600 hover:text-purple-800"
//                   >
//                     ×
//                   </button>
//                 </span>
//               )}
//             </div>
            
//             {(filters.search || filters.location !== 'all' || filters.company !== 'all' || filters.skill !== 'all') && (
//               <button
//                 onClick={clearFilters}
//                 className="text-sm text-gray-600 hover:text-black font-medium"
//               >
//                 Clear all filters
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Jobs Section */}
//         <div>
//           {loadingJobs ? (
//             <div className="text-center py-12">
//               <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
//               <p className="mt-4 text-gray-600">Loading referral jobs...</p>
//             </div>
//           ) : filteredJobs.length === 0 ? (
//             <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
//               <div className="text-5xl mb-4">🔍</div>
//               <h3 className="text-xl font-semibold mb-2 text-black">
//                 {referralJobs.length === 0 ? 'No referral jobs yet' : 'No jobs match your filters'}
//               </h3>
//               <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                 {referralJobs.length === 0
//                   ? 'Be the first to post a referral job and help candidates get hired through referrals.'
//                   : 'Try adjusting your filters or search term to see more results.'}
//               </p>
//               {referralJobs.length === 0 && isVerifiedEmployee ? (
//                 <Link
//                   href="/referral/post"
//                   className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
//                 >
//                   Post First Referral Job
//                 </Link>
//               ) : referralJobs.length === 0 ? (
//                 <Link
//                   href="/referral/verify"
//                   className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
//                 >
//                   Get Verified to Post Jobs
//                 </Link>
//               ) : (
//                 <button
//                   onClick={clearFilters}
//                   className="inline-block bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition duration-300"
//                 >
//                   Clear All Filters
//                 </button>
//               )}
//             </div>
//           ) : (
//             <>
//               {/* Job Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredJobs.map((job) => (
//                   <div
//                     key={job.id}
//                     className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden group"
//                   >
//                     <div className="p-5">
//                       {/* Job Header */}
//                       <div className="flex justify-between items-start mb-3">
//                         <div>
//                           <h3 className="text-lg font-bold text-black group-hover:text-orange-600 transition-colors line-clamp-2">
//                             {job.title}
//                           </h3>
//                           <p className="text-gray-700 font-medium mt-1">{job.company}</p>
//                         </div>
//                         <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap">
//                           Referral
//                         </span>
//                       </div>

//                       {/* Location and Date */}
//                       <div className="flex items-center text-sm text-gray-600 mb-4">
//                         <span className="mr-4">📍 {job.location}</span>
//                         <span>📅 {formatDate(job.postedAt)}</span>
//                       </div>

//                       {/* Skills */}
//                       <div className="mb-4">
//                         <div className="text-sm font-medium text-gray-700 mb-2">
//                           Required Skills:
//                         </div>
//                         <div className="flex flex-wrap gap-1.5">
//                           {job.skills.slice(0, 4).map((skill, index) => (
//                             <span
//                               key={index}
//                               className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium"
//                             >
//                               {skill}
//                             </span>
//                           ))}
//                           {job.skills.length > 4 && (
//                             <span className="bg-gray-200 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium">
//                               +{job.skills.length - 4} more
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       {/* Description Preview */}
//                       <p className="text-sm text-gray-600 mb-5 line-clamp-2">
//                         {job.description}
//                       </p>

//                       {/* Action Buttons */}
//                       <div className="flex flex-col gap-2">
//                         <Link
//                           href={`/referral/jobs/${job.id}`}
//                           className="text-center bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 py-2.5 rounded-lg font-medium transition-colors"
//                         >
//                           View Details
//                         </Link>
                        
//                         <button
//                           onClick={() => handleStartConversation(job)}
//                           disabled={startingConversation === job.id || user.uid === job.postedBy}
//                           className={`py-2.5 rounded-lg font-medium transition-colors ${
//                             user.uid === job.postedBy
//                               ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                               : startingConversation === job.id
//                               ? 'bg-green-600 text-white cursor-wait'
//                               : 'bg-green-500 hover:bg-green-600 text-white'
//                           }`}
//                         >
//                           {user.uid === job.postedBy ? (
//                             'You posted this job'
//                           ) : startingConversation === job.id ? (
//                             <span className="flex items-center justify-center">
//                               <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
//                               Connecting...
//                             </span>
//                           ) : (
//                             '💬 Chat with Employee'
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Results Info */}
//               <div className="mt-6 text-center text-gray-600 text-sm">
//                 Showing {filteredJobs.length} of {referralJobs.length} referral jobs
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// --------------------- main working one -----------------

// "use client";

// import { useState, useEffect, useRef, useCallback } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { 
//   collection, query, where, getDocs, orderBy, onSnapshot, 
//   doc, setDoc, serverTimestamp, updateDoc 
// } from 'firebase/firestore';
// import { useRouter } from 'next/navigation';
// import { 
//   startReferralConversation,
//   sendReferralMessage,
//   getReferralMessages,
//   getUserReferralConversations,
//   getJobReferralConversations,
//   markConversationAsRead,
//   type ReferralConversation,
//   type Message as LibMessage
// } from '@/lib/referralMessaging';
// // 1. RENAMED IMPORTS TO FIX CONFLICTS
// import { 
//   Search, MessageSquare, Send, Briefcase, 
//   MapPin, Calendar, X, ArrowLeft, Users,
//   User, ChevronRight, DollarSign, Check, 
//   CheckCheck, Loader2, Sparkles, Zap, Star, Filter, Building, Tag, Globe, Target, Award, Code, 
//   Lock as LockIcon, 
//   ShieldCheck as ShieldCheckIcon 
// } from 'lucide-react';

// // --- TYPE DEFINITIONS ---
// interface Message extends LibMessage {
//   delivered?: boolean;
// }

// interface ReferralJob {
//   id: string;
//   title: string;
//   company: string;
//   location: string;
//   bonusAmount: number;
//   skills: string[];
//   postedBy: string;
//   postedAt: any;
//   description: string;
//   requirements: string[];
//   isActive: boolean;
//   jobType: string;
//   salaryMin?: number;
//   salaryMax?: number;
//   salaryUnit?: string;
//   postedByName?: string;
//   remote?: boolean;
//   experience?: string;
//   referralCode?: string;
//   views?: number;
//   saves?: number;
// }

// // --- HELPERS (Defined OUTSIDE component to fix scope errors) ---

// const generateStableJobId = () => {
//   return '#' + Math.floor(10000 + Math.random() * 90000).toString();
// };

// const getSafeName = (rawName?: string) => {
//   if (!rawName) return "Verified Employee";
//   if (rawName.includes('@')) {
//     const namePart = rawName.split('@')[0];
//     const cleanName = namePart.replace(/[0-9]/g, ''); 
//     return cleanName.split('.')
//       .map(n => n.charAt(0).toUpperCase() + n.slice(1))
//       .join(' ');
//   }
//   return rawName;
// };

// const toJSDate = (date: any): Date => {
//   if (!date) return new Date();
//   if (typeof date.toDate === 'function') return date.toDate();
//   return new Date(date);
// };

// const formatSalary = (job: ReferralJob) => {
//   if (!job.salaryMin && !job.salaryMax) return 'Not disclosed';
//   if (job.salaryMin && job.salaryMax) {
//     return `₹${job.salaryMin.toLocaleString()} - ₹${job.salaryMax.toLocaleString()}`;
//   }
//   return `₹${(job.salaryMin || job.salaryMax)?.toLocaleString()}`;
// };

// const getCompanyStyle = (company: string) => {
//   const styles = [
//     { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', icon: 'bg-blue-100' },
//     { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', icon: 'bg-purple-100' },
//     { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', icon: 'bg-emerald-100' },
//     { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', icon: 'bg-orange-100' },
//     { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-100', icon: 'bg-pink-100' },
//   ];
//   const index = company.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % styles.length;
//   return styles[index];
// };

// const getSkillIcon = (skill: string) => {
//   const s = skill.toLowerCase();
//   if (s.includes('react') || s.includes('js') || s.includes('front')) return <Code className="w-3 h-3" />;
//   return <Sparkles className="w-3 h-3" />;
// };

// export default function ReferralMarketplacePage() {
//   const [user, loadingAuth] = useAuthState(auth);
//   const router = useRouter();
//   const messagesEndRef = useRef<HTMLDivElement>(null);
  
//   // Data State - Explicitly Typed to fix 'never' errors
//   const [referralJobs, setReferralJobs] = useState<ReferralJob[]>([]);
//   const [filteredJobs, setFilteredJobs] = useState<ReferralJob[]>([]);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [isVerifiedEmployee, setIsVerifiedEmployee] = useState(false);
//   const [userPostedJobs, setUserPostedJobs] = useState<ReferralJob[]>([]);
  
//   // UI State
//   const [viewMode, setViewMode] = useState<'all' | 'my'>('all');
//   const [selectedJob, setSelectedJob] = useState<ReferralJob | null>(null);
//   const [selectedConversation, setSelectedConversation] = useState<ReferralConversation | null>(null);
//   const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
//   const [showJobDetails, setShowJobDetails] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
  
//   // Chat Data - Explicitly Typed
//   const [jobConversations, setJobConversations] = useState<ReferralConversation[]>([]);
//   const [allUserConversations, setAllUserConversations] = useState<ReferralConversation[]>([]);
//   const [messages, setMessages] = useState<Message[]>([]);
  
//   const [newMessage, setNewMessage] = useState('');
//   const [sendingMessage, setSendingMessage] = useState(false);
//   const [startingChat, setStartingChat] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  
//   // Filters
//   const [locations, setLocations] = useState<string[]>([]);
//   const [companies, setCompanies] = useState<string[]>([]);
//   const [selectedLocation, setSelectedLocation] = useState('all');
//   const [selectedCompany, setSelectedCompany] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedJobType, setSelectedJobType] = useState('all');
//   const [sortBy, setSortBy] = useState<'newest' | 'bonus'>('newest');

//   const [jobTypes] = useState<string[]>(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']);

//   // 1. Initial Data Load
//   useEffect(() => {
//     const initData = async () => {
//       if (!user) return;

//       try {
//         const q = query(collection(db, 'users'), where('uid', '==', user.uid));
//         const userDoc = await getDocs(q);
//         if (!userDoc.empty) {
//           const userData = userDoc.docs[0].data();
//           setIsVerifiedEmployee(userData.isVerifiedEmployee || false);
          
//           if (userData.isVerifiedEmployee) {
//             const jobsQuery = query(collection(db, 'referralJobs'), where('postedBy', '==', user.uid), orderBy('postedAt', 'desc'));
//             const jobsSnapshot = await getDocs(jobsQuery);
//             const myJobs: ReferralJob[] = [];
//             jobsSnapshot.forEach((doc) => {
//                 const data = doc.data();
//                 // 2. FIXED: Explicit object creation prevents "id specified more than once"
//                 myJobs.push({
//                    id: doc.id,
//                    title: data.title,
//                    company: data.company,
//                    location: data.location,
//                    bonusAmount: data.bonusAmount,
//                    skills: data.skills,
//                    postedBy: data.postedBy,
//                    postedAt: data.postedAt,
//                    description: data.description,
//                    requirements: data.requirements,
//                    isActive: data.isActive,
//                    jobType: data.jobType,
//                    salaryMin: data.salaryMin,
//                    salaryMax: data.salaryMax,
//                    salaryUnit: data.salaryUnit,
//                    postedByName: data.postedByName,
//                    remote: data.remote,
//                    experience: data.experience,
//                    referralCode: data.referralCode,
//                    views: data.views,
//                    saves: data.saves
//                 } as ReferralJob);
//             });
//             setUserPostedJobs(myJobs);
//           }
//         }
//       } catch (e) {
//         console.error("Verification check failed", e);
//       }

//       const allJobsQuery = query(collection(db, 'referralJobs'), where('isActive', '==', true), orderBy('postedAt', 'desc'));
//       const unsubscribe = onSnapshot(allJobsQuery, (snapshot) => {
//         const allJobs: ReferralJob[] = [];
//         const locs = new Set<string>();
//         const comps = new Set<string>();
        
//         snapshot.forEach((docSnapshot) => {
//           const data = docSnapshot.data();
          
//           // Generate ID if missing
//           if (!data.referralCode) {
//             const newCode = generateStableJobId();
//             updateDoc(doc(db, 'referralJobs', docSnapshot.id), { referralCode: newCode }).catch(console.error);
//             data.referralCode = newCode;
//           }

//           // 2. FIXED: Explicit object creation
//           const jobObj = {
//             id: docSnapshot.id,
//             title: data.title,
//             company: data.company,
//             location: data.location,
//             bonusAmount: data.bonusAmount,
//             skills: data.skills,
//             postedBy: data.postedBy,
//             postedAt: data.postedAt,
//             description: data.description,
//             requirements: data.requirements,
//             isActive: data.isActive,
//             jobType: data.jobType,
//             salaryMin: data.salaryMin,
//             salaryMax: data.salaryMax,
//             salaryUnit: data.salaryUnit,
//             postedByName: data.postedByName,
//             remote: data.remote,
//             experience: data.experience,
//             referralCode: data.referralCode,
//             views: data.views,
//             saves: data.saves
//           } as ReferralJob;

//           allJobs.push(jobObj);
          
//           if (data.location) locs.add(data.location);
//           if (data.company) comps.add(data.company);
//         });

//         if (sortBy === 'bonus') {
//             allJobs.sort((a, b) => b.bonusAmount - a.bonusAmount);
//         } else {
//              allJobs.sort((a, b) => toJSDate(b.postedAt).getTime() - toJSDate(a.postedAt).getTime());
//         }

//         setReferralJobs(allJobs);
//         setLocations(Array.from(locs).sort());
//         setCompanies(Array.from(comps).sort());
//         setLoadingJobs(false);
//       });

//       getUserReferralConversations(user.uid).then(convs => setAllUserConversations(convs as ReferralConversation[]));

//       return () => unsubscribe();
//     };

//     initData();
//   }, [user, sortBy]);

//   // 2. Filter Logic
//   useEffect(() => {
//     let result = viewMode === 'my' ? userPostedJobs : referralJobs;
//     if (searchTerm) {
//       const lower = searchTerm.toLowerCase();
//       result = result.filter(j => 
//         j.title.toLowerCase().includes(lower) || 
//         j.company.toLowerCase().includes(lower) ||
//         j.referralCode?.toLowerCase().includes(lower)
//       );
//     }
//     if (selectedLocation !== 'all') result = result.filter(j => j.location === selectedLocation);
//     if (selectedCompany !== 'all') result = result.filter(j => j.company === selectedCompany);
//     if (selectedJobType !== 'all') result = result.filter(j => j.jobType === selectedJobType);

//     setFilteredJobs(result);
//   }, [searchTerm, selectedLocation, selectedCompany, selectedJobType, viewMode, referralJobs, userPostedJobs]);

//   // 3. Handle Job Selection
//   const handleSelectJob = async (job: ReferralJob) => {
//     setSelectedJob(job);
//     setActiveTab('details'); 
//     setSelectedConversation(null); 
//     setShowJobDetails(true);
    
//     // Update Views
//     if (user && user.uid !== job.postedBy) {
//        try {
//          updateDoc(doc(db, 'referralJobs', job.id), { views: (job.views || 0) + 1 }).catch(() => {});
//        } catch (e) {}
//     }

//     if (!user) return;

//     const convs = await getJobReferralConversations(job.id, user.uid);
//     setJobConversations(convs as ReferralConversation[]);

//     if (user.uid !== job.postedBy) {
//       const existing = convs.find(c => c.jobSeekerId === user.uid);
//       if (existing) {
//         setSelectedConversation(existing as ReferralConversation);
//       }
//     }
//   };

//   // 4. Chat & Messaging
//   const handleOpenChat = async () => {
//     if (!user || !selectedJob) return;
//     setStartingChat(true);

//     try {
//       if (user.uid === selectedJob.postedBy) {
//         setActiveTab('chat');
//       } else {
//         const existing = jobConversations.find(c => c.jobSeekerId === user.uid);
//         if (existing) {
//           setSelectedConversation(existing);
//         } else {
//           const newId = await startReferralConversation(
//             selectedJob.id, selectedJob.title, selectedJob.company, selectedJob.postedBy, user.uid
//           );
//           const convs = await getJobReferralConversations(selectedJob.id, user.uid);
//           setJobConversations(convs as ReferralConversation[]);
//           const newConv = convs.find(c => c.conversationId === newId);
//           if (newConv) setSelectedConversation(newConv as ReferralConversation);
//         }
//         setActiveTab('chat');
//       }
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setStartingChat(false);
//     }
//   };

//   useEffect(() => {
//     if (!selectedConversation || !user) return;
//     markConversationAsRead(selectedConversation.conversationId, user.uid);
    
//     const unsubMsg = getReferralMessages(selectedConversation.conversationId, (msgs) => {
//       setMessages(msgs as Message[]);
//       setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
//     });

//     const typingRef = doc(db, 'typingStatus', selectedConversation.conversationId);
//     const unsubTyping = onSnapshot(typingRef, (docSnap) => {
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         const otherUserId = selectedConversation.participants.find(id => id !== user.uid);
//         if (otherUserId && data[otherUserId] === true) {
//           setIsTyping(true);
//           const timer = setTimeout(() => setIsTyping(false), 3000);
//           return () => clearTimeout(timer);
//         } else {
//           setIsTyping(false);
//         }
//       }
//     });

//     return () => {
//       unsubMsg();
//       unsubTyping();
//     };
//   }, [selectedConversation, user]);

//   const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setNewMessage(value);
    
//     if (selectedConversation && user) {
//       if (typingTimeout) clearTimeout(typingTimeout);
//       const typingRef = doc(db, 'typingStatus', selectedConversation.conversationId);
//       setDoc(typingRef, { [user.uid]: true, timestamp: serverTimestamp() }, { merge: true });
//       const timeout = setTimeout(() => {
//         setDoc(typingRef, { [user.uid]: false }, { merge: true });
//       }, 2000);
//       setTypingTimeout(timeout);
//     }
//   }, [selectedConversation, user, typingTimeout]);

//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !selectedConversation || !user) return;
//     setSendingMessage(true);
//     try {
//       const typingRef = doc(db, 'typingStatus', selectedConversation.conversationId);
//       await setDoc(typingRef, { [user.uid]: false }, { merge: true });
//       await sendReferralMessage(selectedConversation.conversationId, user.uid, newMessage.trim());
//       setNewMessage('');
//     } finally {
//       setSendingMessage(false);
//     }
//   };

//   const getUnreadCountForJob = (jobId: string) => {
//     const conversations = allUserConversations.filter(conv => conv.jobId === jobId);
//     return conversations.reduce((total, conv) => total + (conv.myUnreadCount || 0), 0);
//   };

//   const formatDate = (ts: any) => toJSDate(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
//   const formatTime = (ts: any) => toJSDate(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

//   // 3. FIXED: clearFilters was undefined
//   const clearFilters = () => {
//     setSearchTerm('');
//     setSelectedLocation('all');
//     setSelectedCompany('all');
//     setSelectedJobType('all');
//   };

//   if (loadingAuth) return <div className="h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-orange-500 rounded-full animate-spin border-t-transparent"></div></div>;
//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-neutral-50 flex flex-col h-screen overflow-hidden font-sans">
      
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0 z-20 shadow-sm">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center shadow-lg">
//               <Zap className="w-5 h-5 text-white fill-current" />
//             </div>
//             <div>
//               <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Referral<span className="text-orange-600">Hub</span></h1>
//               <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Premium Connections</p>
//             </div>
//           </div>
//           <div className="flex gap-3">
//             {isVerifiedEmployee && (
//               <button onClick={() => setViewMode(viewMode === 'my' ? 'all' : 'my')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'my' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'}`}>
//                 {viewMode === 'my' ? 'View All Jobs' : 'My Posted Jobs'}
//               </button>
//             )}
//             <button onClick={() => router.push(isVerifiedEmployee ? '/referral/post' : '/referral/verify')} className="bg-black text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
//               {isVerifiedEmployee ? <><Sparkles className="w-3 h-3"/> Post Opportunity</> : <><Star className="w-3 h-3"/> Get Verified</>}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="flex-1 overflow-hidden">
//         <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row">
          
//           {/* LEFT PANEL: Job Grid */}
//           <div className={`w-full ${showJobDetails ? 'lg:w-[60%] hidden lg:flex' : 'lg:w-full flex'} h-full flex-col border-r border-gray-200 bg-gray-50`}>
            
//             {/* Filters Bar */}
//             <div className="p-5 bg-white border-b border-gray-200 shadow-sm flex-shrink-0 space-y-4 z-10">
//                <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
//                   <div className="relative flex-1">
//                     <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
//                     <input 
//                       type="text" 
//                       value={searchTerm} 
//                       onChange={(e) => setSearchTerm(e.target.value)} 
//                       placeholder="Search roles, companies, or skills..." 
//                       className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" 
//                     />
//                   </div>
//                   <button onClick={() => setShowFilters(!showFilters)} className="text-xs font-bold flex items-center justify-center gap-2 bg-gray-100 px-4 py-2.5 rounded-xl hover:bg-gray-200 border border-gray-200 transition-colors whitespace-nowrap">
//                     <Filter className="w-3.5 h-3.5"/> {showFilters ? 'Hide Filters' : 'Filters'}
//                   </button>
//                </div>

//                {showFilters && (
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 animate-in slide-in-from-top-2 duration-200">
//                     <select onChange={(e) => setSelectedLocation(e.target.value)} value={selectedLocation} className="bg-white border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-black cursor-pointer">
//                         <option value="all">All Locations</option>
//                         {locations.map(l => <option key={l} value={l}>{l}</option>)}
//                     </select>
//                     <select onChange={(e) => setSelectedCompany(e.target.value)} value={selectedCompany} className="bg-white border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-black cursor-pointer">
//                         <option value="all">All Companies</option>
//                         {companies.map(c => <option key={c} value={c}>{c}</option>)}
//                     </select>
//                     <select onChange={(e) => setSelectedJobType(e.target.value)} value={selectedJobType} className="bg-white border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-black cursor-pointer">
//                         <option value="all">All Types</option>
//                         {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
//                     </select>
//                      <select onChange={(e) => setSortBy(e.target.value as any)} value={sortBy} className="bg-white border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-black cursor-pointer">
//                         <option value="newest">Newest First</option>
//                         <option value="bonus">Highest Bonus</option>
//                     </select>
//                     {/* 3. FIXED: clearFilters was missing */}
//                     <button onClick={clearFilters} className="col-span-2 md:col-span-4 text-xs text-red-500 font-bold text-center py-1 hover:underline">Reset All Filters</button>
//                   </div>
//               )}
//             </div>

//             {/* Scrollable Job List */}
//             <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
//               {loadingJobs ? (
//                 <div className="flex flex-col items-center justify-center h-64">
//                     <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
//                     <p className="text-gray-400 text-sm font-medium">Loading opportunities...</p>
//                 </div>
//               ) : filteredJobs.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
//                   <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
//                     <Briefcase className="w-10 h-10 text-gray-400" />
//                   </div>
//                   <h3 className="text-lg font-bold text-gray-700">No jobs found</h3>
//                   <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">Try adjusting your filters or check back later for new referral opportunities.</p>
//                 </div>
//               ) : (
//                 <div className={`grid grid-cols-1 ${showJobDetails ? 'lg:grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'} gap-5 pb-10`}>
//                   {filteredJobs.map(job => {
//                     const unread = getUnreadCountForJob(job.id);
//                     const isMyJob = job.postedBy === user?.uid;
//                     const style = getCompanyStyle(job.company);

//                     return (
//                       <div 
//                         key={job.id}
//                         onClick={() => handleSelectJob(job)}
//                         className={`bg-white rounded-2xl border transition-all duration-300 cursor-pointer hover:shadow-xl relative group flex flex-col h-full overflow-hidden hover:scale-[1.01]
//                           ${selectedJob?.id === job.id ? 'border-black ring-1 ring-black shadow-lg' : 'border-gray-100 hover:border-gray-300'}
//                         `}
//                       >
//                         <div className="p-5 flex flex-col h-full">
//                             {/* Top Section */}
//                             <div className="flex justify-between items-start mb-3">
//                                 <div className="flex items-center gap-3">
//                                     <div className={`w-10 h-10 rounded-lg ${style.bg} ${style.text} flex items-center justify-center font-bold text-lg shadow-sm`}>
//                                         {job.company.charAt(0)}
//                                     </div>
//                                     <div>
//                                         <h3 className="font-bold text-gray-900 line-clamp-1 text-base leading-tight" title={job.title}>{job.title}</h3>
//                                         <p className="text-xs text-gray-500 font-medium">{job.company}</p>
//                                     </div>
//                                 </div>
//                                 {unread > 0 && (
//                                     <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse whitespace-nowrap">
//                                         {unread}
//                                     </span>
//                                 )}
//                             </div>
                            
//                             {/* Tags */}
//                             <div className="flex flex-wrap items-center gap-2 mb-4">
//                                 <span className="inline-flex items-center gap-1 text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
//                                     <MapPin className="w-3 h-3" /> {job.location}
//                                 </span>
//                                 <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium border border-gray-200">
//                                     {job.jobType}
//                                 </span>
//                             </div>

//                             {/* Skills (Flexible Spacer) */}
//                             <div className="flex-grow mb-4">
//                                 <div className="flex flex-wrap gap-1.5">
//                                     {job.skills?.slice(0, 2).map(skill => (
//                                         <span key={skill} className="text-[10px] bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
//                                             {skill}
//                                         </span>
//                                     ))}
//                                     {job.skills?.length > 2 && <span className="text-[10px] text-gray-400 px-1">+{job.skills.length - 2}</span>}
//                                 </div>
//                             </div>

//                             {/* Bottom: Bonus (Only for Owner) & Footer */}
//                             <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-end">
//                                 <div>
//                                     {isMyJob ? (
//                                         <div className="flex flex-col">
//                                             <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Your Bonus</span>
//                                             <span className="text-sm font-bold text-gray-900">₹{job.bonusAmount?.toLocaleString() || '0'}</span>
//                                         </div>
//                                     ) : (
//                                         <div className="flex flex-col">
//                                             <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Salary</span>
//                                             <span className="text-xs font-bold text-gray-900">{formatSalary(job).split(' - ')[0]}...</span>
//                                         </div>
//                                     )}
//                                 </div>
                                
//                                 <span className={`text-xs font-bold flex items-center px-3 py-1.5 rounded-lg transition-colors ${selectedJob?.id === job.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-900 group-hover:bg-black group-hover:text-white'}`}>
//                                     View <ChevronRight className="w-3 h-3 ml-1"/>
//                                 </span>
//                             </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* RIGHT PANEL: Details & Chat */}
//           <div className={`w-full lg:w-[40%] bg-white h-full flex flex-col fixed inset-0 z-50 lg:static lg:z-auto ${!showJobDetails ? 'hidden' : 'flex'}`}>
            
//             {/* Mobile Header */}
//             <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-white lg:hidden">
//               <button onClick={() => setShowJobDetails(false)} className="flex items-center text-sm font-bold text-gray-600">
//                 <ArrowLeft className="w-4 h-4 mr-1" /> Back
//               </button>
//               <h3 className="font-bold text-sm">Job Details</h3>
//               <div className="w-8"></div>
//             </div>

//             {selectedJob && (
//                 <>
//                 {activeTab === 'details' ? (
//                   // === VIEW A: JOB DETAILS ===
//                   <div className="flex-1 overflow-y-auto flex flex-col bg-white">
//                     {/* Hero */}
//                     <div className="p-8 pb-4">
//                         <div className="flex justify-between items-start mb-4">
//                             <div className={`w-16 h-16 rounded-2xl ${getCompanyStyle(selectedJob.company).bg} ${getCompanyStyle(selectedJob.company).text} flex items-center justify-center text-2xl font-bold shadow-sm`}>
//                                 {selectedJob.company.charAt(0)}
//                             </div>
//                             <button onClick={() => setShowJobDetails(false)} className="hidden lg:block text-gray-300 hover:text-black transition-colors">
//                                 <X className="w-6 h-6" />
//                             </button>
//                         </div>
                        
//                         <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">{selectedJob.title}</h2>
                        
//                         <div className="flex flex-wrap gap-3 mb-6">
//                             <span className="flex items-center text-sm font-medium text-gray-900">
//                                 <Building className="w-4 h-4 mr-1.5 text-gray-400"/> {selectedJob.company}
//                             </span>
//                             <span className="flex items-center text-sm text-gray-500">
//                                 <MapPin className="w-4 h-4 mr-1.5 text-gray-400"/> {selectedJob.location}
//                             </span>
//                         </div>

//                         {/* Salary/Bonus Card */}
//                         <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-center">
//                              <div>
//                                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Salary Range</p>
//                                 <p className="text-lg font-bold text-gray-900">{formatSalary(selectedJob)}</p>
//                              </div>
//                              {/* Only Owner Sees Bonus */}
//                              {user.uid === selectedJob.postedBy && (
//                                 <div className="text-right">
//                                     <p className="text-[10px] text-amber-600 uppercase font-bold tracking-wider mb-1">Referral Bonus</p>
//                                     <p className="text-lg font-bold text-amber-700">₹{selectedJob.bonusAmount?.toLocaleString()}</p>
//                                     {/* 3. FIXED: Tooltip title on div wrapper, correct Icon alias */}
//                                     <div className="text-[10px] text-amber-700 mt-1 flex items-center gap-1 justify-end" title="Private to you">
//                                       <LockIcon size={10} /> Private
//                                     </div>
//                                 </div>
//                              )}
//                         </div>
//                     </div>

//                     <div className="p-8 pt-2 space-y-8">
//                         {/* Description */}
//                         <div>
//                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Role Overview</h3>
//                             <div className="text-sm text-gray-600 leading-7 whitespace-pre-wrap">
//                               {selectedJob.description}
//                             </div>
//                         </div>

//                         {/* Skills */}
//                         <div>
//                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tech Stack</h3>
//                             <div className="flex flex-wrap gap-2">
//                                 {selectedJob.skills?.map(s => (
//                                     <span key={s} className="bg-white border border-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium shadow-sm hover:border-gray-300 transition-colors flex items-center gap-1">
//                                         {getSkillIcon(s)} {s}
//                                     </span>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* CTA Section */}
//                         <div className="pt-6 pb-4 sticky bottom-0 bg-white border-t border-gray-50">
//                         {user.uid === selectedJob.postedBy ? (
//                             <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
//                                 <h3 className="font-bold text-black mb-3 text-sm flex items-center justify-between">
//                                     <span>Applicants</span>
//                                     <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs">{jobConversations.length}</span>
//                                 </h3>
//                                 {jobConversations.length === 0 ? (
//                                     <div className="text-center py-4 text-gray-400 text-xs italic">No messages yet.</div>
//                                 ) : (
//                                     <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
//                                         {jobConversations.map(conv => (
//                                             <div 
//                                                 key={conv.conversationId}
//                                                 onClick={() => { setSelectedConversation(conv); setActiveTab('chat'); }}
//                                                 className="p-3 bg-white border border-gray-100 rounded-lg hover:border-black cursor-pointer flex justify-between items-center transition-all group"
//                                             >
//                                                 <div>
//                                                     <p className="font-bold text-xs text-gray-900">{getSafeName(conv.jobSeekerName)}</p>
//                                                     <p className="text-[10px] text-gray-500 truncate w-32">{conv.lastMessage}</p>
//                                                 </div>
//                                                 {conv.myUnreadCount > 0 ? (
//                                                     <span className="bg-orange-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{conv.myUnreadCount}</span>
//                                                 ) : <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black" />}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                         ) : (
//                             <button
//                                 onClick={handleOpenChat}
//                                 disabled={startingChat}
//                                 className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 transform active:scale-95"
//                             >
//                                 {startingChat ? <Loader2 className="w-5 h-5 animate-spin"/> : <MessageSquare className="w-5 h-5" />}
//                                 {selectedConversation ? 'Continue Conversation' : 'Chat with Employee'}
//                             </button>
//                         )}
//                         </div>
//                     </div>
//                   </div>
//                 ) : (
//                   // === VIEW B: CHAT INTERFACE ===
//                   <div className="flex-1 flex flex-col h-full bg-gray-50">
                    
//                     {/* Chat Header - ANIMATED & SECURE */}
//                     <div className="p-4 border-b border-gray-200 bg-white shadow-sm flex items-center gap-3 z-10 sticky top-0">
//                       <button onClick={() => setActiveTab('details')} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
//                         <ArrowLeft className="w-5 h-5 text-gray-600" />
//                       </button>
                      
//                       <div className="flex-1 min-w-0 animate-in slide-in-from-bottom-2 duration-500 fade-in fill-mode-forwards">
//                         {/* 1. Name + Role */}
//                         <div className="flex items-center justify-between">
//                           <h3 className="font-bold text-gray-900 text-sm truncate flex items-center gap-2">
//                             {user.uid === selectedJob.postedBy 
//                               ? getSafeName(selectedConversation?.jobSeekerName) 
//                               : getSafeName(selectedJob.postedByName)}
                            
//                             <span className="font-normal text-gray-500 hidden sm:inline">
//                                ({selectedJob.title})
//                             </span>
//                           </h3>
                          
//                           {/* 4. FIXED: Tooltip on wrapper div, Icon renamed */}
//                           <div title="Secure & Private Chat">
//                             <ShieldCheckIcon className="w-4 h-4 text-green-500" />
//                           </div>
//                         </div>
                        
//                         {/* 2. Company Name (Small) */}
//                         <div className="flex items-center text-xs text-gray-500 mt-0.5 font-medium">
//                           <Building className="w-3 h-3 mr-1" />
//                           {selectedJob.company}
//                           {isTyping && <span className="ml-2 text-green-600 animate-pulse">Typing...</span>}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Messages Area */}
//                     <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                       {messages.map(msg => {
//                         const isMe = msg.senderId === user.uid;
//                         return (
//                           <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in zoom-in-95 duration-200`}>
//                             <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-black text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'}`}>
//                               <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
//                               <div className={`flex justify-end items-center mt-1 gap-1 ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>
//                                 <span className="text-[9px] opacity-70">
//                                   {formatTime(msg.createdAt)}
//                                 </span>
//                                 {isMe && (
//                                   msg.read ? <CheckCheck className="w-3 h-3 text-green-400" /> : (msg as any).delivered ? <CheckCheck className="w-3 h-3 text-gray-500" /> : <Check className="w-3 h-3 text-gray-500" />
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                       <div ref={messagesEndRef} />
//                     </div>

//                     {/* Input Area */}
//                     <div className="p-4 bg-white border-t border-gray-200">
//                       <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-2xl px-2 py-1 focus-within:ring-2 focus-within:ring-black focus-within:bg-white focus-within:border-transparent transition-all shadow-inner">
//                         <input 
//                           className="flex-1 bg-transparent border-none px-3 py-3 text-sm focus:outline-none text-gray-900 placeholder:text-gray-400"
//                           placeholder="Type a professional message..."
//                           value={newMessage}
//                           onChange={handleInputChange}
//                           onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
//                           disabled={sendingMessage}
//                         />
//                         <button 
//                           onClick={handleSendMessage}
//                           disabled={!newMessage.trim() || sendingMessage}
//                           className="p-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:bg-gray-300 shadow-sm"
//                         >
//                           <Send className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 </>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useRef, useCallback } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { 
//   collection, query, where, getDocs, orderBy, 
//   doc, setDoc, serverTimestamp, updateDoc, limit, startAfter,
//   getDoc, QueryDocumentSnapshot, DocumentData, Timestamp, onSnapshot, DocumentSnapshot
// } from 'firebase/firestore';
// import { useRouter } from 'next/navigation';
// import { 
//   startReferralConversation,
//   sendReferralMessage,
//   getReferralMessages,
//   getUserReferralConversations,
//   getJobReferralConversations,
//   markConversationAsRead,
//   type ReferralConversation,
//   type Message as LibMessage
// } from '@/lib/referralMessaging';
// import { 
//   Search, MessageSquare, Send, Briefcase, 
//   MapPin, Calendar, X, ArrowLeft, Users,
//   User, ChevronRight, DollarSign, Check, 
//   CheckCheck, Loader2, Sparkles, Zap, Star, Filter, Building, Tag, Globe, Target, Award, Code, 
//   Lock as LockIcon, 
//   ShieldCheck as ShieldCheckIcon,
//   RefreshCw
// } from 'lucide-react';

// // --- TYPE DEFINITIONS ---
// interface Message extends LibMessage {
//   delivered?: boolean;
// }

// interface ReferralJob {
//   id: string;
//   title: string;
//   company: string;
//   location: string;
//   bonusAmount: number;
//   skills: string[];
//   postedBy: string;
//   postedAt: any;
//   description: string;
//   requirements: string[];
//   isActive: boolean;
//   jobType: string;
//   salaryMin?: number;
//   salaryMax?: number;
//   salaryUnit?: string;
//   postedByName?: string;
//   remote?: boolean;
//   experience?: string;
//   referralCode?: string;
//   views?: number;
//   saves?: number;
// }

// // --- HELPERS ---
// const generateStableJobId = () => {
//   return '#' + Math.floor(10000 + Math.random() * 90000).toString();
// };

// const getSafeName = (rawName?: string) => {
//   if (!rawName) return "Verified Employee";
//   if (rawName.includes('@')) {
//     const namePart = rawName.split('@')[0];
//     const cleanName = namePart.replace(/[0-9]/g, ''); 
//     return cleanName.split('.')
//       .map(n => n.charAt(0).toUpperCase() + n.slice(1))
//       .join(' ');
//   }
//   return rawName;
// };

// const toJSDate = (date: any): Date => {
//   if (!date) return new Date();
//   if (typeof date.toDate === 'function') return date.toDate();
//   return new Date(date);
// };

// const formatSalary = (job: ReferralJob) => {
//   if (!job.salaryMin && !job.salaryMax) return 'Not disclosed';
//   if (job.salaryMin && job.salaryMax) {
//     return `₹${job.salaryMin.toLocaleString()} - ₹${job.salaryMax.toLocaleString()}`;
//   }
//   return `₹${(job.salaryMin || job.salaryMax)?.toLocaleString()}`;
// };

// const getCompanyStyle = (company: string) => {
//   const styles = [
//     { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', icon: 'bg-blue-100' },
//     { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', icon: 'bg-purple-100' },
//     { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', icon: 'bg-emerald-100' },
//     { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', icon: 'bg-orange-100' },
//     { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-100', icon: 'bg-pink-100' },
//   ];
//   const index = company.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % styles.length;
//   return styles[index];
// };

// const getSkillIcon = (skill: string) => {
//   const s = skill.toLowerCase();
//   if (s.includes('react') || s.includes('js') || s.includes('front')) return <Code className="w-3 h-3" />;
//   return <Sparkles className="w-3 h-3" />;
// };

// export default function ReferralMarketplacePage() {
//   const [user, loadingAuth] = useAuthState(auth);
//   const router = useRouter();
//   const messagesEndRef = useRef<HTMLDivElement>(null);
  
//   // Data State
//   const [referralJobs, setReferralJobs] = useState<ReferralJob[]>([]);
//   const [filteredJobs, setFilteredJobs] = useState<ReferralJob[]>([]);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
//   const [isVerifiedEmployee, setIsVerifiedEmployee] = useState(false);
//   const [userPostedJobs, setUserPostedJobs] = useState<ReferralJob[]>([]);
  
//   // UI State
//   const [viewMode, setViewMode] = useState<'all' | 'my'>('all');
//   const [selectedJob, setSelectedJob] = useState<ReferralJob | null>(null);
//   const [selectedConversation, setSelectedConversation] = useState<ReferralConversation | null>(null);
//   const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
//   const [showJobDetails, setShowJobDetails] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
  
//   // Chat Data
//   const [jobConversations, setJobConversations] = useState<ReferralConversation[]>([]);
//   const [allUserConversations, setAllUserConversations] = useState<ReferralConversation[]>([]);
//   const [messages, setMessages] = useState<Message[]>([]);
  
//   const [newMessage, setNewMessage] = useState('');
//   const [sendingMessage, setSendingMessage] = useState(false);
//   const [startingChat, setStartingChat] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  
//   // Filters
//   const [locations, setLocations] = useState<string[]>([]);
//   const [companies, setCompanies] = useState<string[]>([]);
//   const [selectedLocation, setSelectedLocation] = useState('all');
//   const [selectedCompany, setSelectedCompany] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedJobType, setSelectedJobType] = useState('all');
//   const [sortBy, setSortBy] = useState<'newest' | 'bonus'>('newest');

//   const [jobTypes] = useState<string[]>(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']);

//   // Helper: Build Firestore query for jobs (with filters, sorting, pagination)
//   const buildJobsQuery = (startAfterDoc?: QueryDocumentSnapshot<DocumentData>) => {
//     let jobsQuery = query(
//       collection(db, 'referralJobs'),
//       where('isActive', '==', true),
//       orderBy('postedAt', 'desc'),
//       limit(20)
//     );
    
//     // Apply location filter
//     if (selectedLocation !== 'all') {
//       jobsQuery = query(jobsQuery, where('location', '==', selectedLocation));
//     }
    
//     // Apply company filter
//     if (selectedCompany !== 'all') {
//       jobsQuery = query(jobsQuery, where('company', '==', selectedCompany));
//     }
    
//     // Apply job type filter
//     if (selectedJobType !== 'all') {
//       jobsQuery = query(jobsQuery, where('jobType', '==', selectedJobType));
//     }
    
//     // Apply sort by bonus (requires different orderBy)
//     if (sortBy === 'bonus') {
//       // Must order by bonusAmount descending, then by postedAt as tiebreaker
//       jobsQuery = query(
//         collection(db, 'referralJobs'),
//         where('isActive', '==', true),
//         orderBy('bonusAmount', 'desc'),
//         orderBy('postedAt', 'desc'),
//         limit(20)
//       );
//       // Re-apply filters (Firestore requires index, but we'll keep it simple)
//       if (selectedLocation !== 'all') jobsQuery = query(jobsQuery, where('location', '==', selectedLocation));
//       if (selectedCompany !== 'all') jobsQuery = query(jobsQuery, where('company', '==', selectedCompany));
//       if (selectedJobType !== 'all') jobsQuery = query(jobsQuery, where('jobType', '==', selectedJobType));
//     }
    
//     if (startAfterDoc) {
//       jobsQuery = query(jobsQuery, startAfter(startAfterDoc));
//     }
    
//     return jobsQuery;
//   };

//   // Fetch first page of jobs (or refresh)
//   const fetchJobs = async (isRefresh = false) => {
//     if (!isRefresh && referralJobs.length > 0 && !hasMore) return;
    
//     setLoadingJobs(true);
//     try {
//       const jobsQuery = buildJobsQuery();
//       const snapshot = await getDocs(jobsQuery);
      
//       const jobsList: ReferralJob[] = [];
//       snapshot.forEach((docSnap) => {
//         const data = docSnap.data();
//         // Ensure referralCode exists
//         if (!data.referralCode) {
//           const newCode = generateStableJobId();
//           updateDoc(doc(db, 'referralJobs', docSnap.id), { referralCode: newCode }).catch(console.error);
//           data.referralCode = newCode;
//         }
        
//         jobsList.push({
//           id: docSnap.id,
//           title: data.title,
//           company: data.company,
//           location: data.location,
//           bonusAmount: data.bonusAmount,
//           skills: data.skills || [],
//           postedBy: data.postedBy,
//           postedAt: data.postedAt,
//           description: data.description,
//           requirements: data.requirements,
//           isActive: data.isActive,
//           jobType: data.jobType,
//           salaryMin: data.salaryMin,
//           salaryMax: data.salaryMax,
//           salaryUnit: data.salaryUnit,
//           postedByName: data.postedByName,
//           remote: data.remote,
//           experience: data.experience,
//           referralCode: data.referralCode,
//           views: data.views,
//           saves: data.saves,
//         } as ReferralJob);
//       });
      
//       // Update location and company sets for filters
//       const locs = new Set<string>();
//       const comps = new Set<string>();
//       jobsList.forEach(job => {
//         if (job.location) locs.add(job.location);
//         if (job.company) comps.add(job.company);
//       });
//       setLocations(Array.from(locs).sort());
//       setCompanies(Array.from(comps).sort());
      
//       setReferralJobs(jobsList);
//       setFilteredJobs(jobsList); // No additional client filtering needed because query already filtered
//       setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
//       setHasMore(snapshot.docs.length === 20);
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//     } finally {
//       setLoadingJobs(false);
//     }
//   };

//   // Load more jobs (next page)
//   const loadMoreJobs = async () => {
//     if (!hasMore || loadingMore || !lastVisible) return;
//     setLoadingMore(true);
//     try {
//       const jobsQuery = buildJobsQuery(lastVisible);
//       const snapshot = await getDocs(jobsQuery);
      
//       const newJobs: ReferralJob[] = [...referralJobs];
//       snapshot.forEach((docSnap) => {
//         const data = docSnap.data();
//         if (!data.referralCode) {
//           const newCode = generateStableJobId();
//           updateDoc(doc(db, 'referralJobs', docSnap.id), { referralCode: newCode }).catch(console.error);
//           data.referralCode = newCode;
//         }
//         newJobs.push({
//           id: docSnap.id,
//           title: data.title,
//           company: data.company,
//           location: data.location,
//           bonusAmount: data.bonusAmount,
//           skills: data.skills || [],
//           postedBy: data.postedBy,
//           postedAt: data.postedAt,
//           description: data.description,
//           requirements: data.requirements,
//           isActive: data.isActive,
//           jobType: data.jobType,
//           salaryMin: data.salaryMin,
//           salaryMax: data.salaryMax,
//           salaryUnit: data.salaryUnit,
//           postedByName: data.postedByName,
//           remote: data.remote,
//           experience: data.experience,
//           referralCode: data.referralCode,
//           views: data.views,
//           saves: data.saves,
//         } as ReferralJob);
//       });
      
//       setReferralJobs(newJobs);
//       setFilteredJobs(newJobs);
//       setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
//       setHasMore(snapshot.docs.length === 20);
//     } catch (error) {
//       console.error("Error loading more jobs:", error);
//     } finally {
//       setLoadingMore(false);
//     }
//   };

//   // Refresh jobs (reset pagination)
//   const refreshJobs = () => {
//     setLastVisible(null);
//     setHasMore(true);
//     fetchJobs(true);
//   };

//   // Fetch user data (verification, posted jobs, conversations)
//   useEffect(() => {
//     if (!user) return;
    
//     const initUserData = async () => {
//       try {
//         const q = query(collection(db, 'users'), where('uid', '==', user.uid));
//         const userDoc = await getDocs(q);
//         if (!userDoc.empty) {
//           const userData = userDoc.docs[0].data();
//           setIsVerifiedEmployee(userData.isVerifiedEmployee || false);
          
//           if (userData.isVerifiedEmployee) {
//             const jobsQuery = query(collection(db, 'referralJobs'), where('postedBy', '==', user.uid), orderBy('postedAt', 'desc'));
//             const jobsSnapshot = await getDocs(jobsQuery);
//             const myJobs: ReferralJob[] = [];
//             jobsSnapshot.forEach((docSnap) => {
//               const data = docSnap.data();
//               myJobs.push({
//                 id: docSnap.id,
//                 title: data.title,
//                 company: data.company,
//                 location: data.location,
//                 bonusAmount: data.bonusAmount,
//                 skills: data.skills || [],
//                 postedBy: data.postedBy,
//                 postedAt: data.postedAt,
//                 description: data.description,
//                 requirements: data.requirements,
//                 isActive: data.isActive,
//                 jobType: data.jobType,
//                 salaryMin: data.salaryMin,
//                 salaryMax: data.salaryMax,
//                 salaryUnit: data.salaryUnit,
//                 postedByName: data.postedByName,
//                 remote: data.remote,
//                 experience: data.experience,
//                 referralCode: data.referralCode,
//                 views: data.views,
//                 saves: data.saves,
//               } as ReferralJob);
//             });
//             setUserPostedJobs(myJobs);
//           }
//         }
        
//         // Fetch user's conversations (this remains unfiltered for now)
//         const convs = await getUserReferralConversations(user.uid);
//         setAllUserConversations(convs as ReferralConversation[]);
//       } catch (e) {
//         console.error("User data init failed", e);
//       }
//     };
    
//     initUserData();
//     // Fetch jobs only once on mount and when filters change
//     fetchJobs();
//   }, [user]); // Only depend on user, not filters - because fetchJobs will be called separately when filters change

//   // Re-fetch jobs when filters or sort change
//   useEffect(() => {
//     if (user) {
//       // Reset pagination and fetch new filtered results
//       setLastVisible(null);
//       setHasMore(true);
//       fetchJobs(true);
//     }
//   }, [selectedLocation, selectedCompany, selectedJobType, sortBy, user]);

//   // Client-side search (applied on already loaded jobs – you can also implement server-side search later)
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredJobs(referralJobs);
//     } else {
//       const lower = searchTerm.toLowerCase();
//       const filtered = referralJobs.filter(job => 
//         job.title.toLowerCase().includes(lower) || 
//         job.company.toLowerCase().includes(lower) ||
//         job.referralCode?.toLowerCase().includes(lower)
//       );
//       setFilteredJobs(filtered);
//     }
//   }, [searchTerm, referralJobs]);

//   // When viewMode changes to 'my', show userPostedJobs; else show filteredJobs
//   const displayedJobs = viewMode === 'my' ? userPostedJobs : filteredJobs;

//   const handleSelectJob = async (job: ReferralJob) => {
//     setSelectedJob(job);
//     setActiveTab('details'); 
//     setSelectedConversation(null); 
//     setShowJobDetails(true);
    
//     // Update view count
//     if (user && user.uid !== job.postedBy) {
//       try {
//         await updateDoc(doc(db, 'referralJobs', job.id), { views: (job.views || 0) + 1 });
//       } catch (e) {}
//     }

//     if (!user) return;

//     const convs = await getJobReferralConversations(job.id, user.uid);
//     setJobConversations(convs as ReferralConversation[]);

//     if (user.uid !== job.postedBy) {
//       const existing = convs.find(c => c.jobSeekerId === user.uid);
//       if (existing) {
//         setSelectedConversation(existing as ReferralConversation);
//       }
//     }
//   };

//   const handleOpenChat = async () => {
//     if (!user || !selectedJob) return;
//     setStartingChat(true);

//     try {
//       if (user.uid === selectedJob.postedBy) {
//         setActiveTab('chat');
//       } else {
//         const existing = jobConversations.find(c => c.jobSeekerId === user.uid);
//         if (existing) {
//           setSelectedConversation(existing);
//         } else {
//           await startReferralConversation(
//             selectedJob.id, selectedJob.title, selectedJob.company, selectedJob.postedBy, user.uid
//           );
//           const convs = await getJobReferralConversations(selectedJob.id, user.uid);
//           setJobConversations(convs as ReferralConversation[]);
//           const newConv = convs.find(c => c.jobSeekerId === user.uid);
//           if (newConv) setSelectedConversation(newConv as ReferralConversation);
//         }
//         setActiveTab('chat');
//       }
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setStartingChat(false);
//     }
//   };

//   useEffect(() => {
//     if (!selectedConversation || !user) return;
//     markConversationAsRead(selectedConversation.conversationId, user.uid);
    
//     const unsubMsg = getReferralMessages(selectedConversation.conversationId, (msgs) => {
//       setMessages(msgs as Message[]);
//       setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
//     });

//     const typingRef = doc(db, 'typingStatus', selectedConversation.conversationId);
//     //const unsubTyping = onSnapshot(typingRef, (docSnap) => {
//     const unsubTyping = onSnapshot(typingRef, (docSnap: DocumentSnapshot) => {
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         const otherUserId = selectedConversation.participants.find(id => id !== user.uid);
//         if (otherUserId && data[otherUserId] === true) {
//           setIsTyping(true);
//           const timer = setTimeout(() => setIsTyping(false), 3000);
//           return () => clearTimeout(timer);
//         } else {
//           setIsTyping(false);
//         }
//       }
//     });

//     return () => {
//       unsubMsg();
//       unsubTyping();
//     };
//   }, [selectedConversation, user]);

//   const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setNewMessage(value);
    
//     if (selectedConversation && user) {
//       if (typingTimeout) clearTimeout(typingTimeout);
//       const typingRef = doc(db, 'typingStatus', selectedConversation.conversationId);
//       setDoc(typingRef, { [user.uid]: true, timestamp: serverTimestamp() }, { merge: true });
//       const timeout = setTimeout(() => {
//         setDoc(typingRef, { [user.uid]: false }, { merge: true });
//       }, 2000);
//       setTypingTimeout(timeout);
//     }
//   }, [selectedConversation, user, typingTimeout]);

//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !selectedConversation || !user) return;
//     setSendingMessage(true);
//     try {
//       const typingRef = doc(db, 'typingStatus', selectedConversation.conversationId);
//       await setDoc(typingRef, { [user.uid]: false }, { merge: true });
//       await sendReferralMessage(selectedConversation.conversationId, user.uid, newMessage.trim());
//       setNewMessage('');
//     } finally {
//       setSendingMessage(false);
//     }
//   };

//   const getUnreadCountForJob = (jobId: string) => {
//     const conversations = allUserConversations.filter(conv => conv.jobId === jobId);
//     return conversations.reduce((total, conv) => total + (conv.myUnreadCount || 0), 0);
//   };

//   const formatDate = (ts: any) => toJSDate(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
//   const formatTime = (ts: any) => toJSDate(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

//   const clearFilters = () => {
//     setSearchTerm('');
//     setSelectedLocation('all');
//     setSelectedCompany('all');
//     setSelectedJobType('all');
//   };

//   if (loadingAuth) return <div className="h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-orange-500 rounded-full animate-spin border-t-transparent"></div></div>;
//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-neutral-50 flex flex-col h-screen overflow-hidden font-sans">
      
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0 z-20 shadow-sm">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center shadow-lg">
//               <Zap className="w-5 h-5 text-white fill-current" />
//             </div>
//             <div>
//               <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Referral<span className="text-orange-600">Hub</span></h1>
//               <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Premium Connections</p>
//             </div>
//           </div>
//           <div className="flex gap-3">
//             {isVerifiedEmployee && (
//               <button onClick={() => setViewMode(viewMode === 'my' ? 'all' : 'my')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'my' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'}`}>
//                 {viewMode === 'my' ? 'View All Jobs' : 'My Posted Jobs'}
//               </button>
//             )}
//             <button onClick={() => router.push(isVerifiedEmployee ? '/referral/post' : '/referral/verify')} className="bg-black text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
//               {isVerifiedEmployee ? <><Sparkles className="w-3 h-3"/> Post Opportunity</> : <><Star className="w-3 h-3"/> Get Verified</>}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="flex-1 overflow-hidden">
//         <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row">
          
//           {/* LEFT PANEL: Job Grid */}
//           <div className={`w-full ${showJobDetails ? 'lg:w-[60%] hidden lg:flex' : 'lg:w-full flex'} h-full flex-col border-r border-gray-200 bg-gray-50`}>
            
//             {/* Filters Bar */}
//             <div className="p-5 bg-white border-b border-gray-200 shadow-sm flex-shrink-0 z-10 space-y-4">
//                <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
//                   <div className="relative flex-1">
//                     <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
//                     <input 
//                       type="text" 
//                       value={searchTerm} 
//                       onChange={(e) => setSearchTerm(e.target.value)} 
//                       placeholder="Search roles, companies, or skills..." 
//                       className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" 
//                     />
//                   </div>
//                   <div className="flex gap-2">
//                     <button onClick={refreshJobs} className="text-xs font-bold flex items-center justify-center gap-2 bg-gray-100 px-4 py-2.5 rounded-xl hover:bg-gray-200 border border-gray-200 transition-colors">
//                       <RefreshCw className="w-3.5 h-3.5"/> Refresh
//                     </button>
//                     <button onClick={() => setShowFilters(!showFilters)} className="text-xs font-bold flex items-center justify-center gap-2 bg-gray-100 px-4 py-2.5 rounded-xl hover:bg-gray-200 border border-gray-200 transition-colors whitespace-nowrap">
//                       <Filter className="w-3.5 h-3.5"/> {showFilters ? 'Hide Filters' : 'Filters'}
//                     </button>
//                   </div>
//                </div>

//                {showFilters && (
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 animate-in slide-in-from-top-2 duration-200">
//                     <select onChange={(e) => setSelectedLocation(e.target.value)} value={selectedLocation} className="bg-white border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-black cursor-pointer">
//                         <option value="all">All Locations</option>
//                         {locations.map(l => <option key={l} value={l}>{l}</option>)}
//                     </select>
//                     <select onChange={(e) => setSelectedCompany(e.target.value)} value={selectedCompany} className="bg-white border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-black cursor-pointer">
//                         <option value="all">All Companies</option>
//                         {companies.map(c => <option key={c} value={c}>{c}</option>)}
//                     </select>
//                     <select onChange={(e) => setSelectedJobType(e.target.value)} value={selectedJobType} className="bg-white border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-black cursor-pointer">
//                         <option value="all">All Types</option>
//                         {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
//                     </select>
//                      <select onChange={(e) => setSortBy(e.target.value as any)} value={sortBy} className="bg-white border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-black cursor-pointer">
//                         <option value="newest">Newest First</option>
//                         <option value="bonus">Highest Bonus</option>
//                     </select>
//                     <button onClick={clearFilters} className="col-span-2 md:col-span-4 text-xs text-red-500 font-bold text-center py-1 hover:underline">Reset All Filters</button>
//                   </div>
//               )}
//             </div>

//             {/* Scrollable Job List */}
//             <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
//               {loadingJobs ? (
//                 <div className="flex flex-col items-center justify-center h-64">
//                     <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
//                     <p className="text-gray-400 text-sm font-medium">Loading opportunities...</p>
//                 </div>
//               ) : displayedJobs.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
//                   <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
//                     <Briefcase className="w-10 h-10 text-gray-400" />
//                   </div>
//                   <h3 className="text-lg font-bold text-gray-700">No jobs found</h3>
//                   <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">Try adjusting your filters or check back later for new referral opportunities.</p>
//                 </div>
//               ) : (
//                 <>
//                 <div className={`grid grid-cols-1 ${showJobDetails ? 'lg:grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'} gap-5 pb-10`}>
//                   {displayedJobs.map(job => {
//                     const unread = getUnreadCountForJob(job.id);
//                     const isMyJob = job.postedBy === user?.uid;
//                     const style = getCompanyStyle(job.company);

//                     return (
//                       <div 
//                         key={job.id}
//                         onClick={() => handleSelectJob(job)}
//                         className={`bg-white rounded-2xl border transition-all duration-300 cursor-pointer hover:shadow-xl relative group flex flex-col h-full overflow-hidden hover:scale-[1.01]
//                           ${selectedJob?.id === job.id ? 'border-black ring-1 ring-black shadow-lg' : 'border-gray-100 hover:border-gray-300'}
//                         `}
//                       >
//                         <div className="p-5 flex flex-col h-full">
//                             {/* Top Section */}
//                             <div className="flex justify-between items-start mb-3">
//                                 <div className="flex items-center gap-3">
//                                     <div className={`w-10 h-10 rounded-lg ${style.bg} ${style.text} flex items-center justify-center font-bold text-lg shadow-sm`}>
//                                         {job.company.charAt(0)}
//                                     </div>
//                                     <div>
//                                         <h3 className="font-bold text-gray-900 line-clamp-1 text-base leading-tight" title={job.title}>{job.title}</h3>
//                                         <p className="text-xs text-gray-500 font-medium">{job.company}</p>
//                                     </div>
//                                 </div>
//                                 {unread > 0 && (
//                                     <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse whitespace-nowrap">
//                                         {unread}
//                                     </span>
//                                 )}
//                             </div>
                            
//                             {/* Tags */}
//                             <div className="flex flex-wrap items-center gap-2 mb-4">
//                                 <span className="inline-flex items-center gap-1 text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
//                                     <MapPin className="w-3 h-3" /> {job.location}
//                                 </span>
//                                 <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium border border-gray-200">
//                                     {job.jobType}
//                                 </span>
//                             </div>

//                             {/* Skills */}
//                             <div className="flex-grow mb-4">
//                                 <div className="flex flex-wrap gap-1.5">
//                                     {job.skills?.slice(0, 2).map(skill => (
//                                         <span key={skill} className="text-[10px] bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
//                                             {skill}
//                                         </span>
//                                     ))}
//                                     {job.skills?.length > 2 && <span className="text-[10px] text-gray-400 px-1">+{job.skills.length - 2}</span>}
//                                 </div>
//                             </div>

//                             {/* Bottom */}
//                             <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-end">
//                                 <div>
//                                     {isMyJob ? (
//                                         <div className="flex flex-col">
//                                             <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Your Bonus</span>
//                                             <span className="text-sm font-bold text-gray-900">₹{job.bonusAmount?.toLocaleString() || '0'}</span>
//                                         </div>
//                                     ) : (
//                                         <div className="flex flex-col">
//                                             <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Salary</span>
//                                             <span className="text-xs font-bold text-gray-900">{formatSalary(job).split(' - ')[0]}...</span>
//                                         </div>
//                                     )}
//                                 </div>
                                
//                                 <span className={`text-xs font-bold flex items-center px-3 py-1.5 rounded-lg transition-colors ${selectedJob?.id === job.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-900 group-hover:bg-black group-hover:text-white'}`}>
//                                     View <ChevronRight className="w-3 h-3 ml-1"/>
//                                 </span>
//                             </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//                 {/* Load More Button */}
//                 {viewMode === 'all' && hasMore && (
//                   <div className="flex justify-center pb-8">
//                     <button
//                       onClick={loadMoreJobs}
//                       disabled={loadingMore}
//                       className="px-6 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
//                     >
//                       {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
//                       {loadingMore ? 'Loading...' : 'Load More Jobs'}
//                     </button>
//                   </div>
//                 )}
//                 </>
//               )}
//             </div>
//           </div>

//           {/* RIGHT PANEL: Details & Chat (unchanged) */}
//           <div className={`w-full lg:w-[40%] bg-white h-full flex flex-col fixed inset-0 z-50 lg:static lg:z-auto ${!showJobDetails ? 'hidden' : 'flex'}`}>
            
//             <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-white lg:hidden">
//               <button onClick={() => setShowJobDetails(false)} className="flex items-center text-sm font-bold text-gray-600">
//                 <ArrowLeft className="w-4 h-4 mr-1" /> Back
//               </button>
//               <h3 className="font-bold text-sm">Job Details</h3>
//               <div className="w-8"></div>
//             </div>

//             {selectedJob && (
//                 <>
//                 {activeTab === 'details' ? (
//                   <div className="flex-1 overflow-y-auto flex flex-col bg-white">
//                     <div className="p-8 pb-4">
//                         <div className="flex justify-between items-start mb-4">
//                             <div className={`w-16 h-16 rounded-2xl ${getCompanyStyle(selectedJob.company).bg} ${getCompanyStyle(selectedJob.company).text} flex items-center justify-center text-2xl font-bold shadow-sm`}>
//                                 {selectedJob.company.charAt(0)}
//                             </div>
//                             <button onClick={() => setShowJobDetails(false)} className="hidden lg:block text-gray-300 hover:text-black transition-colors">
//                                 <X className="w-6 h-6" />
//                             </button>
//                         </div>
                        
//                         <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">{selectedJob.title}</h2>
                        
//                         <div className="flex flex-wrap gap-3 mb-6">
//                             <span className="flex items-center text-sm font-medium text-gray-900">
//                                 <Building className="w-4 h-4 mr-1.5 text-gray-400"/> {selectedJob.company}
//                             </span>
//                             <span className="flex items-center text-sm text-gray-500">
//                                 <MapPin className="w-4 h-4 mr-1.5 text-gray-400"/> {selectedJob.location}
//                             </span>
//                         </div>

//                         <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-center">
//                              <div>
//                                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Salary Range</p>
//                                 <p className="text-lg font-bold text-gray-900">{formatSalary(selectedJob)}</p>
//                              </div>
//                              {user.uid === selectedJob.postedBy && (
//                                 <div className="text-right">
//                                     <p className="text-[10px] text-amber-600 uppercase font-bold tracking-wider mb-1">Referral Bonus</p>
//                                     <p className="text-lg font-bold text-amber-700">₹{selectedJob.bonusAmount?.toLocaleString()}</p>
//                                     <div className="text-[10px] text-amber-700 mt-1 flex items-center gap-1 justify-end" title="Private to you">
//                                       <LockIcon size={10} /> Private
//                                     </div>
//                                 </div>
//                              )}
//                         </div>
//                     </div>

//                     <div className="p-8 pt-2 space-y-8">
//                         <div>
//                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Role Overview</h3>
//                             <div className="text-sm text-gray-600 leading-7 whitespace-pre-wrap">
//                               {selectedJob.description}
//                             </div>
//                         </div>

//                         <div>
//                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tech Stack</h3>
//                             <div className="flex flex-wrap gap-2">
//                                 {selectedJob.skills?.map(s => (
//                                     <span key={s} className="bg-white border border-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium shadow-sm hover:border-gray-300 transition-colors flex items-center gap-1">
//                                         {getSkillIcon(s)} {s}
//                                     </span>
//                                 ))}
//                             </div>
//                         </div>

//                         <div className="pt-6 pb-4 sticky bottom-0 bg-white border-t border-gray-50">
//                         {user.uid === selectedJob.postedBy ? (
//                             <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
//                                 <h3 className="font-bold text-black mb-3 text-sm flex items-center justify-between">
//                                     <span>Applicants</span>
//                                     <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs">{jobConversations.length}</span>
//                                 </h3>
//                                 {jobConversations.length === 0 ? (
//                                     <div className="text-center py-4 text-gray-400 text-xs italic">No messages yet.</div>
//                                 ) : (
//                                     <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
//                                         {jobConversations.map(conv => (
//                                             <div 
//                                                 key={conv.conversationId}
//                                                 onClick={() => { setSelectedConversation(conv); setActiveTab('chat'); }}
//                                                 className="p-3 bg-white border border-gray-100 rounded-lg hover:border-black cursor-pointer flex justify-between items-center transition-all group"
//                                             >
//                                                 <div>
//                                                     <p className="font-bold text-xs text-gray-900">{getSafeName(conv.jobSeekerName)}</p>
//                                                     <p className="text-[10px] text-gray-500 truncate w-32">{conv.lastMessage}</p>
//                                                 </div>
//                                                 {conv.myUnreadCount > 0 ? (
//                                                     <span className="bg-orange-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{conv.myUnreadCount}</span>
//                                                 ) : <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black" />}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                         ) : (
//                             <button
//                                 onClick={handleOpenChat}
//                                 disabled={startingChat}
//                                 className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 transform active:scale-95"
//                             >
//                                 {startingChat ? <Loader2 className="w-5 h-5 animate-spin"/> : <MessageSquare className="w-5 h-5" />}
//                                 {selectedConversation ? 'Continue Conversation' : 'Chat with Employee'}
//                             </button>
//                         )}
//                         </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex-1 flex flex-col h-full bg-gray-50">
                    
//                     <div className="p-4 border-b border-gray-200 bg-white shadow-sm flex items-center gap-3 z-10 sticky top-0">
//                       <button onClick={() => setActiveTab('details')} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
//                         <ArrowLeft className="w-5 h-5 text-gray-600" />
//                       </button>
                      
//                       <div className="flex-1 min-w-0 animate-in slide-in-from-bottom-2 duration-500 fade-in fill-mode-forwards">
//                         <div className="flex items-center justify-between">
//                           <h3 className="font-bold text-gray-900 text-sm truncate flex items-center gap-2">
//                             {user.uid === selectedJob.postedBy 
//                               ? getSafeName(selectedConversation?.jobSeekerName) 
//                               : getSafeName(selectedJob.postedByName)}
                            
//                             <span className="font-normal text-gray-500 hidden sm:inline">
//                                ({selectedJob.title})
//                             </span>
//                           </h3>
                          
//                           <div title="Secure & Private Chat">
//                             <ShieldCheckIcon className="w-4 h-4 text-green-500" />
//                           </div>
//                         </div>
                        
//                         <div className="flex items-center text-xs text-gray-500 mt-0.5 font-medium">
//                           <Building className="w-3 h-3 mr-1" />
//                           {selectedJob.company}
//                           {isTyping && <span className="ml-2 text-green-600 animate-pulse">Typing...</span>}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                       {messages.map(msg => {
//                         const isMe = msg.senderId === user.uid;
//                         return (
//                           <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in zoom-in-95 duration-200`}>
//                             <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-black text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'}`}>
//                               <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
//                               <div className={`flex justify-end items-center mt-1 gap-1 ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>
//                                 <span className="text-[9px] opacity-70">
//                                   {formatTime(msg.createdAt)}
//                                 </span>
//                                 {isMe && (
//                                   msg.read ? <CheckCheck className="w-3 h-3 text-green-400" /> : (msg as any).delivered ? <CheckCheck className="w-3 h-3 text-gray-500" /> : <Check className="w-3 h-3 text-gray-500" />
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                       <div ref={messagesEndRef} />
//                     </div>

//                     <div className="p-4 bg-white border-t border-gray-200">
//                       <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-2xl px-2 py-1 focus-within:ring-2 focus-within:ring-black focus-within:bg-white focus-within:border-transparent transition-all shadow-inner">
//                         <input 
//                           className="flex-1 bg-transparent border-none px-3 py-3 text-sm focus:outline-none text-gray-900 placeholder:text-gray-400"
//                           placeholder="Type a professional message..."
//                           value={newMessage}
//                           onChange={handleInputChange}
//                           onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
//                           disabled={sendingMessage}
//                         />
//                         <button 
//                           onClick={handleSendMessage}
//                           disabled={!newMessage.trim() || sendingMessage}
//                           className="p-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:bg-gray-300 shadow-sm"
//                         >
//                           <Send className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 </>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }



//  ----------------------------  working one ---------------------------------

// "use client";

// import { useState, useEffect, useRef, useCallback } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { 
//   collection, query, where, getDocs, orderBy, 
//   doc, setDoc, serverTimestamp, updateDoc, limit, startAfter,
//   getDoc, QueryDocumentSnapshot, DocumentData, Timestamp,
//   onSnapshot, DocumentSnapshot
// } from 'firebase/firestore';
// import { useRouter } from 'next/navigation';
// import { 
//   startReferralConversation,
//   sendReferralMessage,
//   getReferralMessages,
//   getJobReferralConversationsPaginated,
//   markConversationAsRead,
//   type ReferralConversation,
//   type Message as LibMessage
// } from '@/lib/referralMessaging';
// import { 
//   Search, MessageSquare, Send, Briefcase, 
//   MapPin, X, ArrowLeft, Users,
//   ChevronRight, DollarSign, Check, 
//   CheckCheck, Loader2, Sparkles, Zap, Star, Filter, Building, 
//   Lock as LockIcon, 
//   ShieldCheck as ShieldCheckIcon,
//   RefreshCw
// } from 'lucide-react';

// // --- TYPE DEFINITIONS ---
// interface Message extends LibMessage {
//   delivered?: boolean;
// }

// interface ReferralJob {
//   id: string;
//   title: string;
//   company: string;
//   location: string;
//   bonusAmount: number;
//   skills: string[];
//   postedBy: string;
//   postedAt: any;
//   description: string;
//   requirements: string[];
//   isActive: boolean;
//   jobType: string;
//   salaryMin?: number;
//   salaryMax?: number;
//   salaryUnit?: string;
//   postedByName?: string;
//   remote?: boolean;
//   experience?: string;
//   referralCode?: string;
//   views?: number;
//   saves?: number;
//   unreadCounts?: Record<string, number>;
// }

// // --- HELPERS ---
// const generateStableJobId = () => {
//   return '#' + Math.floor(10000 + Math.random() * 90000).toString();
// };

// const getSafeName = (rawName?: string) => {
//   if (!rawName) return "Verified Employee";
//   if (rawName.includes('@')) {
//     const namePart = rawName.split('@')[0];
//     const cleanName = namePart.replace(/[0-9]/g, ''); 
//     return cleanName.split('.')
//       .map(n => n.charAt(0).toUpperCase() + n.slice(1))
//       .join(' ');
//   }
//   return rawName;
// };

// const toJSDate = (date: any): Date => {
//   if (!date) return new Date();
//   if (typeof date.toDate === 'function') return date.toDate();
//   return new Date(date);
// };

// const formatSalary = (job: ReferralJob) => {
//   if (!job.salaryMin && !job.salaryMax) return 'Not disclosed';
//   if (job.salaryMin && job.salaryMax) {
//     return `₹${job.salaryMin.toLocaleString()} - ₹${job.salaryMax.toLocaleString()}`;
//   }
//   return `₹${(job.salaryMin || job.salaryMax)?.toLocaleString()}`;
// };

// const getCompanyStyle = (company: string) => {
//   const styles = [
//     { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', icon: 'bg-blue-100' },
//     { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', icon: 'bg-purple-100' },
//     { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', icon: 'bg-emerald-100' },
//     { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', icon: 'bg-orange-100' },
//     { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-100', icon: 'bg-pink-100' },
//   ];
//   const index = company.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % styles.length;
//   return styles[index];
// };

// // Simplified getSkillIcon - NO Code icon, only Sparkles
// const getSkillIcon = (skill: string) => {
//   return <Sparkles className="w-3 h-3" />;
// };

// export default function ReferralMarketplacePage() {
//   const [user, loadingAuth] = useAuthState(auth);
//   const router = useRouter();
//   const messagesEndRef = useRef<HTMLDivElement>(null);
  
//   // Data State
//   const [referralJobs, setReferralJobs] = useState<ReferralJob[]>([]);
//   const [filteredJobs, setFilteredJobs] = useState<ReferralJob[]>([]);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
//   const [isVerifiedEmployee, setIsVerifiedEmployee] = useState(false);
//   const [userPostedJobs, setUserPostedJobs] = useState<ReferralJob[]>([]);
  
//   // UI State
//   const [viewMode, setViewMode] = useState<'all' | 'my'>('all');
//   const [selectedJob, setSelectedJob] = useState<ReferralJob | null>(null);
//   const [selectedConversation, setSelectedConversation] = useState<ReferralConversation | null>(null);
//   const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
//   const [showJobDetails, setShowJobDetails] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
  
//   // Chat Data (paginated for selected job)
//   const [jobConversations, setJobConversations] = useState<ReferralConversation[]>([]);
//   const [jobConversationsLastDoc, setJobConversationsLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
//   const [hasMoreConversations, setHasMoreConversations] = useState(false);
//   const [loadingConversations, setLoadingConversations] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]);
  
//   const [newMessage, setNewMessage] = useState('');
//   const [sendingMessage, setSendingMessage] = useState(false);
//   const [startingChat, setStartingChat] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  
//   // Filters
//   const [locations, setLocations] = useState<string[]>([]);
//   const [companies, setCompanies] = useState<string[]>([]);
//   const [selectedLocation, setSelectedLocation] = useState('all');
//   const [selectedCompany, setSelectedCompany] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedJobType, setSelectedJobType] = useState('all');
//   const [sortBy, setSortBy] = useState<'newest' | 'bonus'>('newest');

//   const [jobTypes] = useState<string[]>(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']);

//   // Build Firestore query for jobs
//   const buildJobsQuery = (startAfterDoc?: QueryDocumentSnapshot<DocumentData>) => {
//     let jobsQuery = query(
//       collection(db, 'referralJobs'),
//       where('isActive', '==', true),
//       orderBy('postedAt', 'desc'),
//       limit(20)
//     );
    
//     if (selectedLocation !== 'all') {
//       jobsQuery = query(jobsQuery, where('location', '==', selectedLocation));
//     }
//     if (selectedCompany !== 'all') {
//       jobsQuery = query(jobsQuery, where('company', '==', selectedCompany));
//     }
//     if (selectedJobType !== 'all') {
//       jobsQuery = query(jobsQuery, where('jobType', '==', selectedJobType));
//     }
    
//     if (sortBy === 'bonus') {
//       jobsQuery = query(
//         collection(db, 'referralJobs'),
//         where('isActive', '==', true),
//         orderBy('bonusAmount', 'desc'),
//         orderBy('postedAt', 'desc'),
//         limit(20)
//       );
//       if (selectedLocation !== 'all') jobsQuery = query(jobsQuery, where('location', '==', selectedLocation));
//       if (selectedCompany !== 'all') jobsQuery = query(jobsQuery, where('company', '==', selectedCompany));
//       if (selectedJobType !== 'all') jobsQuery = query(jobsQuery, where('jobType', '==', selectedJobType));
//     }
    
//     if (startAfterDoc) {
//       jobsQuery = query(jobsQuery, startAfter(startAfterDoc));
//     }
    
//     return jobsQuery;
//   };

//   // Fetch jobs
//   const fetchJobs = async (isRefresh = false) => {
//     if (!isRefresh && referralJobs.length > 0 && !hasMore) return;
//     setLoadingJobs(true);
//     try {
//       const jobsQuery = buildJobsQuery();
//       const snapshot = await getDocs(jobsQuery);
      
//       const jobsList: ReferralJob[] = [];
//       snapshot.forEach((docSnap) => {
//         const data = docSnap.data();
//         if (!data.referralCode) {
//           const newCode = generateStableJobId();
//           updateDoc(doc(db, 'referralJobs', docSnap.id), { referralCode: newCode }).catch(console.error);
//           data.referralCode = newCode;
//         }
//         jobsList.push({
//           id: docSnap.id,
//           title: data.title,
//           company: data.company,
//           location: data.location,
//           bonusAmount: data.bonusAmount,
//           skills: data.skills || [],
//           postedBy: data.postedBy,
//           postedAt: data.postedAt,
//           description: data.description,
//           requirements: data.requirements,
//           isActive: data.isActive,
//           jobType: data.jobType,
//           salaryMin: data.salaryMin,
//           salaryMax: data.salaryMax,
//           salaryUnit: data.salaryUnit,
//           postedByName: data.postedByName,
//           remote: data.remote,
//           experience: data.experience,
//           referralCode: data.referralCode,
//           views: data.views,
//           saves: data.saves,
//           unreadCounts: data.unreadCounts || {}
//         });
//       });
      
//       const locs = new Set<string>();
//       const comps = new Set<string>();
//       jobsList.forEach(job => {
//         if (job.location) locs.add(job.location);
//         if (job.company) comps.add(job.company);
//       });
//       setLocations(Array.from(locs).sort());
//       setCompanies(Array.from(comps).sort());
      
//       setReferralJobs(jobsList);
//       setFilteredJobs(jobsList);
//       setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
//       setHasMore(snapshot.docs.length === 20);
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//     } finally {
//       setLoadingJobs(false);
//     }
//   };

//   const loadMoreJobs = async () => {
//     if (!hasMore || loadingMore || !lastVisible) return;
//     setLoadingMore(true);
//     try {
//       const jobsQuery = buildJobsQuery(lastVisible);
//       const snapshot = await getDocs(jobsQuery);
      
//       const newJobs: ReferralJob[] = [...referralJobs];
//       snapshot.forEach((docSnap) => {
//         const data = docSnap.data();
//         if (!data.referralCode) {
//           const newCode = generateStableJobId();
//           updateDoc(doc(db, 'referralJobs', docSnap.id), { referralCode: newCode }).catch(console.error);
//           data.referralCode = newCode;
//         }
//         newJobs.push({
//           id: docSnap.id,
//           title: data.title,
//           company: data.company,
//           location: data.location,
//           bonusAmount: data.bonusAmount,
//           skills: data.skills || [],
//           postedBy: data.postedBy,
//           postedAt: data.postedAt,
//           description: data.description,
//           requirements: data.requirements,
//           isActive: data.isActive,
//           jobType: data.jobType,
//           salaryMin: data.salaryMin,
//           salaryMax: data.salaryMax,
//           salaryUnit: data.salaryUnit,
//           postedByName: data.postedByName,
//           remote: data.remote,
//           experience: data.experience,
//           referralCode: data.referralCode,
//           views: data.views,
//           saves: data.saves,
//           unreadCounts: data.unreadCounts || {}
//         });
//       });
      
//       setReferralJobs(newJobs);
//       setFilteredJobs(newJobs);
//       setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
//       setHasMore(snapshot.docs.length === 20);
//     } catch (error) {
//       console.error("Error loading more jobs:", error);
//     } finally {
//       setLoadingMore(false);
//     }
//   };

//   const refreshJobs = () => {
//     setLastVisible(null);
//     setHasMore(true);
//     fetchJobs(true);
//   };

//   // Load conversations for selected job (paginated)
//   const loadJobConversations = async (jobId: string, reset: boolean = true) => {
//     if (!user) return;
//     setLoadingConversations(true);
//     try {
//       const result = await getJobReferralConversationsPaginated(
//         jobId,
//         user.uid,
//         20,
//         reset ? undefined : jobConversationsLastDoc || undefined
//       );
      
//       if (reset) {
//         setJobConversations(result.conversations);
//       } else {
//         setJobConversations(prev => [...prev, ...result.conversations]);
//       }
//       setJobConversationsLastDoc(result.lastDoc);
//       setHasMoreConversations(result.lastDoc !== null);
//     } catch (error) {
//       console.error("Error loading conversations:", error);
//     } finally {
//       setLoadingConversations(false);
//     }
//   };

//   const loadMoreConversations = () => {
//     if (selectedJob) {
//       loadJobConversations(selectedJob.id, false);
//     }
//   };

//   // Fetch user data
//   useEffect(() => {
//     if (!user) return;
    
//     const initUserData = async () => {
//       try {
//         const q = query(collection(db, 'users'), where('uid', '==', user.uid));
//         const userDoc = await getDocs(q);
//         if (!userDoc.empty) {
//           const userData = userDoc.docs[0].data();
//           setIsVerifiedEmployee(userData.isVerifiedEmployee || false);
          
//           if (userData.isVerifiedEmployee) {
//             const jobsQuery = query(collection(db, 'referralJobs'), where('postedBy', '==', user.uid), orderBy('postedAt', 'desc'));
//             const jobsSnapshot = await getDocs(jobsQuery);
//             const myJobs: ReferralJob[] = [];
//             jobsSnapshot.forEach((docSnap) => {
//               const data = docSnap.data();
//               myJobs.push({
//                 id: docSnap.id,
//                 title: data.title,
//                 company: data.company,
//                 location: data.location,
//                 bonusAmount: data.bonusAmount,
//                 skills: data.skills || [],
//                 postedBy: data.postedBy,
//                 postedAt: data.postedAt,
//                 description: data.description,
//                 requirements: data.requirements,
//                 isActive: data.isActive,
//                 jobType: data.jobType,
//                 salaryMin: data.salaryMin,
//                 salaryMax: data.salaryMax,
//                 salaryUnit: data.salaryUnit,
//                 postedByName: data.postedByName,
//                 remote: data.remote,
//                 experience: data.experience,
//                 referralCode: data.referralCode,
//                 views: data.views,
//                 saves: data.saves,
//                 unreadCounts: data.unreadCounts || {}
//               });
//             });
//             setUserPostedJobs(myJobs);
//           }
//         }
//       } catch (e) {
//         console.error("User data init failed", e);
//       }
//     };
    
//     initUserData();
//     fetchJobs();
//   }, [user]);

//   // Re-fetch jobs when filters/sort change
//   useEffect(() => {
//     if (user) {
//       setLastVisible(null);
//       setHasMore(true);
//       fetchJobs(true);
//     }
//   }, [selectedLocation, selectedCompany, selectedJobType, sortBy, user]);

//   // Client-side search
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredJobs(referralJobs);
//     } else {
//       const lower = searchTerm.toLowerCase();
//       const filtered = referralJobs.filter(job => 
//         job.title.toLowerCase().includes(lower) || 
//         job.company.toLowerCase().includes(lower) ||
//         job.referralCode?.toLowerCase().includes(lower)
//       );
//       setFilteredJobs(filtered);
//     }
//   }, [searchTerm, referralJobs]);

//   const displayedJobs = viewMode === 'my' ? userPostedJobs : filteredJobs;

//   const handleSelectJob = async (job: ReferralJob) => {
//     setSelectedJob(job);
//     setActiveTab('details');
//     setSelectedConversation(null);
//     setShowJobDetails(true);
    
//     // Load conversations for this job
//     if (user) {
//       await loadJobConversations(job.id, true);
//       if (user.uid !== job.postedBy) {
//         const existingConv = jobConversations.find(c => c.jobSeekerId === user.uid);
//         if (existingConv) {
//           setSelectedConversation(existingConv);
//         }
//       }
//     }
    
//     // Update view count
//     if (user && user.uid !== job.postedBy) {
//       try {
//         await updateDoc(doc(db, 'referralJobs', job.id), { views: (job.views || 0) + 1 });
//       } catch (e) {}
//     }
//   };

//   const handleOpenChat = async () => {
//     if (!user || !selectedJob) return;
//     setStartingChat(true);
//     try {
//       if (user.uid === selectedJob.postedBy) {
//         setActiveTab('chat');
//       } else {
//         const existing = jobConversations.find(c => c.jobSeekerId === user.uid);
//         if (existing) {
//           setSelectedConversation(existing);
//         } else {
//           await startReferralConversation(
//             selectedJob.id, selectedJob.title, selectedJob.company, selectedJob.postedBy, user.uid
//           );
//           await loadJobConversations(selectedJob.id, true);
//           const newConv = jobConversations.find(c => c.jobSeekerId === user.uid);
//           if (newConv) setSelectedConversation(newConv);
//         }
//         setActiveTab('chat');
//       }
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setStartingChat(false);
//     }
//   };

//   // Message listener for selected conversation
//   useEffect(() => {
//     if (!selectedConversation || !user) return;
//     markConversationAsRead(selectedConversation.conversationId, user.uid);
    
//     // Update local job unread count to 0
//     if (selectedJob) {
//       const updatedUnreads = { ...(selectedJob.unreadCounts || {}) };
//       updatedUnreads[user.uid] = 0;
//       setSelectedJob({ ...selectedJob, unreadCounts: updatedUnreads });
//       setReferralJobs(prev => prev.map(job => 
//         job.id === selectedJob.id ? { ...job, unreadCounts: updatedUnreads } : job
//       ));
//     }
    
//     const unsubMsg = getReferralMessages(selectedConversation.conversationId, (msgs) => {
//       setMessages(msgs as Message[]);
//       setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
//     });

//     const typingRef = doc(db, 'typingStatus', selectedConversation.conversationId);
//     const unsubTyping = onSnapshot(typingRef, (docSnap: DocumentSnapshot) => {
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         const otherUserId = selectedConversation.participants.find(id => id !== user.uid);
//         if (otherUserId && data[otherUserId] === true) {
//           setIsTyping(true);
//           const timer = setTimeout(() => setIsTyping(false), 3000);
//           return () => clearTimeout(timer);
//         } else {
//           setIsTyping(false);
//         }
//       }
//     });

//     return () => {
//       unsubMsg();
//       unsubTyping();
//     };
//   }, [selectedConversation, user, selectedJob]);

//   const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setNewMessage(value);
    
//     if (selectedConversation && user) {
//       if (typingTimeout) clearTimeout(typingTimeout);
//       const typingRef = doc(db, 'typingStatus', selectedConversation.conversationId);
//       setDoc(typingRef, { [user.uid]: true, timestamp: serverTimestamp() }, { merge: true });
//       const timeout = setTimeout(() => {
//         setDoc(typingRef, { [user.uid]: false }, { merge: true });
//       }, 2000);
//       setTypingTimeout(timeout);
//     }
//   }, [selectedConversation, user, typingTimeout]);

//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !selectedConversation || !user) return;
//     setSendingMessage(true);
//     try {
//       const typingRef = doc(db, 'typingStatus', selectedConversation.conversationId);
//       await setDoc(typingRef, { [user.uid]: false }, { merge: true });
//       await sendReferralMessage(selectedConversation.conversationId, user.uid, newMessage.trim());
//       setNewMessage('');
//     } finally {
//       setSendingMessage(false);
//     }
//   };

//   const getUnreadCountForJob = (job: ReferralJob): number => {
//     if (!user) return 0;
//     return job.unreadCounts?.[user.uid] || 0;
//   };

//   const formatTime = (ts: any) => toJSDate(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

//   const clearFilters = () => {
//     setSearchTerm('');
//     setSelectedLocation('all');
//     setSelectedCompany('all');
//     setSelectedJobType('all');
//   };

//   if (loadingAuth) return <div className="h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-orange-500 rounded-full animate-spin border-t-transparent"></div></div>;
//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-neutral-50 flex flex-col h-screen overflow-hidden font-sans">
      
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0 z-20 shadow-sm">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center shadow-lg">
//               <Zap className="w-5 h-5 text-white fill-current" />
//             </div>
//             <div>
//               <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Referral<span className="text-orange-600">Hub</span></h1>
//               <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Premium Connections</p>
//             </div>
//           </div>
//           <div className="flex gap-3">
//             {isVerifiedEmployee && (
//               <button onClick={() => setViewMode(viewMode === 'my' ? 'all' : 'my')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'my' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'}`}>
//                 {viewMode === 'my' ? 'View All Jobs' : 'My Posted Jobs'}
//               </button>
//             )}
//             <button onClick={() => router.push(isVerifiedEmployee ? '/referral/post' : '/referral/verify')} className="bg-black text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
//               {isVerifiedEmployee ? <><Sparkles className="w-3 h-3"/> Post Opportunity</> : <><Star className="w-3 h-3"/> Get Verified</>}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="flex-1 overflow-hidden">
//         <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row">
          
//           {/* LEFT PANEL: Job Grid */}
//           <div className={`w-full ${showJobDetails ? 'lg:w-[60%] hidden lg:flex' : 'lg:w-full flex'} h-full flex-col border-r border-gray-200 bg-gray-50`}>
            
//             {/* Filters Bar */}
//             <div className="p-5 bg-white border-b border-gray-200 shadow-sm flex-shrink-0 z-10 space-y-4">
//                <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
//                   <div className="relative flex-1">
//                     <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
//                     <input 
//                       type="text" 
//                       value={searchTerm} 
//                       onChange={(e) => setSearchTerm(e.target.value)} 
//                       placeholder="Search roles, companies, or skills..." 
//                       className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" 
//                     />
//                   </div>
//                   <div className="flex gap-2">
//                     <button onClick={refreshJobs} className="text-xs font-bold flex items-center justify-center gap-2 bg-gray-100 px-4 py-2.5 rounded-xl hover:bg-gray-200 border border-gray-200 transition-colors">
//                       <RefreshCw className="w-3.5 h-3.5"/> Refresh
//                     </button>
//                     <button onClick={() => setShowFilters(!showFilters)} className="text-xs font-bold flex items-center justify-center gap-2 bg-gray-100 px-4 py-2.5 rounded-xl hover:bg-gray-200 border border-gray-200 transition-colors whitespace-nowrap">
//                       <Filter className="w-3.5 h-3.5"/> {showFilters ? 'Hide Filters' : 'Filters'}
//                     </button>
//                   </div>
//                </div>

//                {showFilters && (
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 animate-in slide-in-from-top-2 duration-200">
//                     <select onChange={(e) => setSelectedLocation(e.target.value)} value={selectedLocation} className="bg-white border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-black cursor-pointer">
//                         <option value="all">All Locations</option>
//                         {locations.map(l => <option key={l} value={l}>{l}</option>)}
//                     </select>
//                     <select onChange={(e) => setSelectedCompany(e.target.value)} value={selectedCompany} className="bg-white border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-black cursor-pointer">
//                         <option value="all">All Companies</option>
//                         {companies.map(c => <option key={c} value={c}>{c}</option>)}
//                     </select>
//                     <select onChange={(e) => setSelectedJobType(e.target.value)} value={selectedJobType} className="bg-white border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-black cursor-pointer">
//                         <option value="all">All Types</option>
//                         {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
//                     </select>
//                      <select onChange={(e) => setSortBy(e.target.value as any)} value={sortBy} className="bg-white border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-black cursor-pointer">
//                         <option value="newest">Newest First</option>
//                         <option value="bonus">Highest Bonus</option>
//                     </select>
//                     <button onClick={clearFilters} className="col-span-2 md:col-span-4 text-xs text-red-500 font-bold text-center py-1 hover:underline">Reset All Filters</button>
//                   </div>
//               )}
//             </div>

//             {/* Scrollable Job List */}
//             <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
//               {loadingJobs ? (
//                 <div className="flex flex-col items-center justify-center h-64">
//                     <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
//                     <p className="text-gray-400 text-sm font-medium">Loading opportunities...</p>
//                 </div>
//               ) : displayedJobs.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
//                   <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
//                     <Briefcase className="w-10 h-10 text-gray-400" />
//                   </div>
//                   <h3 className="text-lg font-bold text-gray-700">No jobs found</h3>
//                   <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">Try adjusting your filters or check back later for new referral opportunities.</p>
//                 </div>
//               ) : (
//                 <>
//                 <div className={`grid grid-cols-1 ${showJobDetails ? 'lg:grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'} gap-5 pb-10`}>
//                   {displayedJobs.map(job => {
//                     const unread = getUnreadCountForJob(job);
//                     const isMyJob = job.postedBy === user?.uid;
//                     const style = getCompanyStyle(job.company);

//                     return (
//                       <div 
//                         key={job.id}
//                         onClick={() => handleSelectJob(job)}
//                         className={`bg-white rounded-2xl border transition-all duration-300 cursor-pointer hover:shadow-xl relative group flex flex-col h-full overflow-hidden hover:scale-[1.01]
//                           ${selectedJob?.id === job.id ? 'border-black ring-1 ring-black shadow-lg' : 'border-gray-100 hover:border-gray-300'}
//                         `}
//                       >
//                         <div className="p-5 flex flex-col h-full">
//                             <div className="flex justify-between items-start mb-3">
//                                 <div className="flex items-center gap-3">
//                                     <div className={`w-10 h-10 rounded-lg ${style.bg} ${style.text} flex items-center justify-center font-bold text-lg shadow-sm`}>
//                                         {job.company.charAt(0)}
//                                     </div>
//                                     <div>
//                                         <h3 className="font-bold text-gray-900 line-clamp-1 text-base leading-tight" title={job.title}>{job.title}</h3>
//                                         <p className="text-xs text-gray-500 font-medium">{job.company}</p>
//                                     </div>
//                                 </div>
//                                 {unread > 0 && (
//                                     <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse whitespace-nowrap">
//                                         {unread}
//                                     </span>
//                                 )}
//                             </div>
                            
//                             <div className="flex flex-wrap items-center gap-2 mb-4">
//                                 <span className="inline-flex items-center gap-1 text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
//                                     <MapPin className="w-3 h-3" /> {job.location}
//                                 </span>
//                                 <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium border border-gray-200">
//                                     {job.jobType}
//                                 </span>
//                             </div>

//                             <div className="flex-grow mb-4">
//                                 <div className="flex flex-wrap gap-1.5">
//                                     {job.skills?.slice(0, 2).map(skill => (
//                                         <span key={skill} className="text-[10px] bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
//                                             {skill}
//                                         </span>
//                                     ))}
//                                     {job.skills?.length > 2 && <span className="text-[10px] text-gray-400 px-1">+{job.skills.length - 2}</span>}
//                                 </div>
//                             </div>

//                             <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-end">
//                                 <div>
//                                     {isMyJob ? (
//                                         <div className="flex flex-col">
//                                             <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Your Bonus</span>
//                                             <span className="text-sm font-bold text-gray-900">₹{job.bonusAmount?.toLocaleString() || '0'}</span>
//                                         </div>
//                                     ) : (
//                                         <div className="flex flex-col">
//                                             <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Salary</span>
//                                             <span className="text-xs font-bold text-gray-900">{formatSalary(job).split(' - ')[0]}...</span>
//                                         </div>
//                                     )}
//                                 </div>
                                
//                                 <span className={`text-xs font-bold flex items-center px-3 py-1.5 rounded-lg transition-colors ${selectedJob?.id === job.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-900 group-hover:bg-black group-hover:text-white'}`}>
//                                     View <ChevronRight className="w-3 h-3 ml-1"/>
//                                 </span>
//                             </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//                 {viewMode === 'all' && hasMore && (
//                   <div className="flex justify-center pb-8">
//                     <button
//                       onClick={loadMoreJobs}
//                       disabled={loadingMore}
//                       className="px-6 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
//                     >
//                       {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
//                       {loadingMore ? 'Loading...' : 'Load More Jobs'}
//                     </button>
//                   </div>
//                 )}
//                 </>
//               )}
//             </div>
//           </div>

//           {/* RIGHT PANEL: Details & Chat */}
//           <div className={`w-full lg:w-[40%] bg-white h-full flex flex-col fixed inset-0 z-50 lg:static lg:z-auto ${!showJobDetails ? 'hidden' : 'flex'}`}>
            
//             <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-white lg:hidden">
//               <button onClick={() => setShowJobDetails(false)} className="flex items-center text-sm font-bold text-gray-600">
//                 <ArrowLeft className="w-4 h-4 mr-1" /> Back
//               </button>
//               <h3 className="font-bold text-sm">Job Details</h3>
//               <div className="w-8"></div>
//             </div>

//             {selectedJob && (
//                 <>
//                 {activeTab === 'details' ? (
//                   <div className="flex-1 overflow-y-auto flex flex-col bg-white">
//                     <div className="p-8 pb-4">
//                         <div className="flex justify-between items-start mb-4">
//                             <div className={`w-16 h-16 rounded-2xl ${getCompanyStyle(selectedJob.company).bg} ${getCompanyStyle(selectedJob.company).text} flex items-center justify-center text-2xl font-bold shadow-sm`}>
//                                 {selectedJob.company.charAt(0)}
//                             </div>
//                             <button onClick={() => setShowJobDetails(false)} className="hidden lg:block text-gray-300 hover:text-black transition-colors">
//                                 <X className="w-6 h-6" />
//                             </button>
//                         </div>
                        
//                         <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">{selectedJob.title}</h2>
                        
//                         <div className="flex flex-wrap gap-3 mb-6">
//                             <span className="flex items-center text-sm font-medium text-gray-900">
//                                 <Building className="w-4 h-4 mr-1.5 text-gray-400"/> {selectedJob.company}
//                             </span>
//                             <span className="flex items-center text-sm text-gray-500">
//                                 <MapPin className="w-4 h-4 mr-1.5 text-gray-400"/> {selectedJob.location}
//                             </span>
//                         </div>

//                         <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-center">
//                              <div>
//                                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Salary Range</p>
//                                 <p className="text-lg font-bold text-gray-900">{formatSalary(selectedJob)}</p>
//                              </div>
//                              {user.uid === selectedJob.postedBy && (
//                                 <div className="text-right">
//                                     <p className="text-[10px] text-amber-600 uppercase font-bold tracking-wider mb-1">Referral Bonus</p>
//                                     <p className="text-lg font-bold text-amber-700">₹{selectedJob.bonusAmount?.toLocaleString()}</p>
//                                     <div className="text-[10px] text-amber-700 mt-1 flex items-center gap-1 justify-end" title="Private to you">
//                                       <LockIcon size={10} /> Private
//                                     </div>
//                                 </div>
//                              )}
//                         </div>
//                     </div>

//                     <div className="p-8 pt-2 space-y-8">
//                         <div>
//                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Role Overview</h3>
//                             <div className="text-sm text-gray-600 leading-7 whitespace-pre-wrap">
//                               {selectedJob.description}
//                             </div>
//                         </div>

//                         <div>
//                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tech Stack</h3>
//                             <div className="flex flex-wrap gap-2">
//                                 {selectedJob.skills?.map(s => (
//                                     <span key={s} className="bg-white border border-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium shadow-sm hover:border-gray-300 transition-colors flex items-center gap-1">
//                                         {getSkillIcon(s)} {s}
//                                     </span>
//                                 ))}
//                             </div>
//                         </div>

//                         <div className="pt-6 pb-4 sticky bottom-0 bg-white border-t border-gray-50">
//                         {user.uid === selectedJob.postedBy ? (
//                             <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
//                                 <h3 className="font-bold text-black mb-3 text-sm flex items-center justify-between">
//                                     <span>Applicants</span>
//                                     <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs">{jobConversations.length}</span>
//                                 </h3>
//                                 {loadingConversations && jobConversations.length === 0 ? (
//                                     <div className="text-center py-4 text-gray-400 text-xs">Loading conversations...</div>
//                                 ) : jobConversations.length === 0 ? (
//                                     <div className="text-center py-4 text-gray-400 text-xs italic">No messages yet.</div>
//                                 ) : (
//                                     <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
//                                         {jobConversations.map(conv => (
//                                             <div 
//                                                 key={conv.conversationId}
//                                                 onClick={() => { setSelectedConversation(conv); setActiveTab('chat'); }}
//                                                 className="p-3 bg-white border border-gray-100 rounded-lg hover:border-black cursor-pointer flex justify-between items-center transition-all group"
//                                             >
//                                                 <div>
//                                                     <p className="font-bold text-xs text-gray-900">{getSafeName(conv.jobSeekerName)}</p>
//                                                     <p className="text-[10px] text-gray-500 truncate w-32">{conv.lastMessage}</p>
//                                                 </div>
//                                                 <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black" />
//                                             </div>
//                                         ))}
//                                         {hasMoreConversations && (
//                                             <button onClick={loadMoreConversations} className="text-xs text-black font-medium mt-2 text-center w-full py-1 hover:underline">
//                                                 Load more...
//                                             </button>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         ) : (
//                             <button
//                                 onClick={handleOpenChat}
//                                 disabled={startingChat}
//                                 className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 transform active:scale-95"
//                             >
//                                 {startingChat ? <Loader2 className="w-5 h-5 animate-spin"/> : <MessageSquare className="w-5 h-5" />}
//                                 {selectedConversation ? 'Continue Conversation' : 'Chat with Employee'}
//                             </button>
//                         )}
//                         </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex-1 flex flex-col h-full bg-gray-50">
                    
//                     <div className="p-4 border-b border-gray-200 bg-white shadow-sm flex items-center gap-3 z-10 sticky top-0">
//                       <button onClick={() => setActiveTab('details')} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
//                         <ArrowLeft className="w-5 h-5 text-gray-600" />
//                       </button>
                      
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center justify-between">
//                           <h3 className="font-bold text-gray-900 text-sm truncate flex items-center gap-2">
//                             {user.uid === selectedJob.postedBy 
//                               ? getSafeName(selectedConversation?.jobSeekerName) 
//                               : getSafeName(selectedJob.postedByName)}
                            
//                             <span className="font-normal text-gray-500 hidden sm:inline">
//                                ({selectedJob.title})
//                             </span>
//                           </h3>
                          
//                           <div title="Secure & Private Chat">
//                             <ShieldCheckIcon className="w-4 h-4 text-green-500" />
//                           </div>
//                         </div>
                        
//                         <div className="flex items-center text-xs text-gray-500 mt-0.5 font-medium">
//                           <Building className="w-3 h-3 mr-1" />
//                           {selectedJob.company}
//                           {isTyping && <span className="ml-2 text-green-600 animate-pulse">Typing...</span>}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                       {messages.map(msg => {
//                         const isMe = msg.senderId === user.uid;
//                         return (
//                           <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in zoom-in-95 duration-200`}>
//                             <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-black text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'}`}>
//                               <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
//                               <div className={`flex justify-end items-center mt-1 gap-1 ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>
//                                 <span className="text-[9px] opacity-70">
//                                   {formatTime(msg.createdAt)}
//                                 </span>
//                                 {isMe && (
//                                   msg.read ? <CheckCheck className="w-3 h-3 text-green-400" /> : (msg as any).delivered ? <CheckCheck className="w-3 h-3 text-gray-500" /> : <Check className="w-3 h-3 text-gray-500" />
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                       <div ref={messagesEndRef} />
//                     </div>

//                     <div className="p-4 bg-white border-t border-gray-200">
//                       <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-2xl px-2 py-1 focus-within:ring-2 focus-within:ring-black focus-within:bg-white focus-within:border-transparent transition-all shadow-inner">
//                         <input 
//                           className="flex-1 bg-transparent border-none px-3 py-3 text-sm focus:outline-none text-gray-900 placeholder:text-gray-400"
//                           placeholder="Type a professional message..."
//                           value={newMessage}
//                           onChange={handleInputChange}
//                           onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
//                           disabled={sendingMessage}
//                         />
//                         <button 
//                           onClick={handleSendMessage}
//                           disabled={!newMessage.trim() || sendingMessage}
//                           className="p-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:bg-gray-300 shadow-sm"
//                         >
//                           <Send className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 </>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { 
  collection, query, where, getDocs, orderBy, 
  doc, setDoc, serverTimestamp, updateDoc, limit, startAfter,
  QueryDocumentSnapshot, DocumentData, DocumentSnapshot, onSnapshot
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { 
  startReferralConversation,
  sendReferralMessage,
  getReferralMessages,
  getJobReferralConversationsPaginated,
  markConversationAsRead,
  type ReferralConversation,
  type Message as LibMessage
} from '@/lib/referralMessaging';
import { 
  Search, MessageSquare, Send, Briefcase, 
  MapPin, X, ArrowLeft,
  ChevronRight, Check, 
  CheckCheck, Loader2, Sparkles, Zap, Star, Filter, Building, 
  Lock as LockIcon, 
  ShieldCheck as ShieldCheckIcon,
  RefreshCw
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface Message extends LibMessage {
  delivered?: boolean;
}

interface ReferralJob {
  id: string;
  title: string;
  company: string;
  location: string;
  bonusAmount: number;
  skills: string[];
  postedBy: string;
  postedAt: any;
  description: string;
  requirements: string[];
  isActive: boolean;
  jobType: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryUnit?: string;
  postedByName?: string;
  remote?: boolean;
  experience?: string;
  referralCode?: string;
  views?: number;
  saves?: number;
  unreadCounts?: Record<string, number>;
}

// --- HELPERS ---
const getSafeName = (rawName?: string) => {
  if (!rawName) return "Verified Employee";
  if (rawName.includes('@')) {
    const namePart = rawName.split('@')[0];
    const cleanName = namePart.replace(/[0-9]/g, ''); 
    return cleanName.split('.')
      .map(n => n.charAt(0).toUpperCase() + n.slice(1))
      .join(' ');
  }
  return rawName;
};

const toJSDate = (date: any): Date => {
  if (!date) return new Date();
  if (typeof date.toDate === 'function') return date.toDate();
  return new Date(date);
};

const formatSalary = (job: ReferralJob) => {
  if (!job.salaryMin && !job.salaryMax) return 'Not disclosed';
  if (job.salaryMin && job.salaryMax) {
    return `₹${job.salaryMin.toLocaleString()} - ₹${job.salaryMax.toLocaleString()}`;
  }
  return `₹${(job.salaryMin || job.salaryMax)?.toLocaleString()}`;
};

const getCompanyStyle = (company: string) => {
  const styles = [
    { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', icon: 'bg-blue-100' },
    { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', icon: 'bg-purple-100' },
    { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', icon: 'bg-emerald-100' },
    { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', icon: 'bg-orange-100' },
    { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-100', icon: 'bg-pink-100' },
  ];
  const index = company.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % styles.length;
  return styles[index];
};

const getSkillIcon = (skill: string) => {
  return <Sparkles className="w-3 h-3" />;
};

export default function ReferralMarketplacePage() {
  const [user, loadingAuth] = useAuthState(auth);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 🚀 OPTIMIZATION: Track viewed jobs in memory to prevent duplicate writes
  const viewedJobs = useRef<Set<string>>(new Set());
  
  // 🚀 OPTIMIZATION: Edge-triggered typing indicators
  const hasNotifiedTypingRef = useRef(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  // 🚀 FIX: Ref to prevent duplicate message updates (prevents infinite loop)
  const messagesRef = useRef<Message[]>([]);

  // Data State
  const [referralJobs, setReferralJobs] = useState<ReferralJob[]>([]);
  // 🚀 FIX: Removed filteredJobs state; useMemo handles it
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [isVerifiedEmployee, setIsVerifiedEmployee] = useState(false);
  
  // UI State
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all');
  const [userPostedJobs, setUserPostedJobs] = useState<ReferralJob[]>([]);
  const [loadingMyJobs, setLoadingMyJobs] = useState(false);
  const [myJobsFetched, setMyJobsFetched] = useState(false);

  const [selectedJob, setSelectedJob] = useState<ReferralJob | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<ReferralConversation | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Chat Data
  const [jobConversations, setJobConversations] = useState<ReferralConversation[]>([]);
  const [jobConversationsLastDoc, setJobConversationsLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMoreConversations, setHasMoreConversations] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [startingChat, setStartingChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // Filters
  const [locations, setLocations] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'bonus'>('newest');

  const [jobTypes] = useState<string[]>(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']);

  // 🚀 HYBRID: Use useMemo to compute filteredJobs without state updates
  const filteredJobs = useMemo(() => {
    if (searchTerm.trim() === '') {
      return referralJobs;
    }
    const lower = searchTerm.toLowerCase();
    return referralJobs.filter(job => 
      job.title.toLowerCase().includes(lower) || 
      job.company.toLowerCase().includes(lower) ||
      job.referralCode?.toLowerCase().includes(lower)
    );
  }, [searchTerm, referralJobs]);

  const buildJobsQuery = (startAfterDoc?: QueryDocumentSnapshot<DocumentData>) => {
    let jobsQuery = query(
      collection(db, 'referralJobs'),
      where('isActive', '==', true),
      orderBy('postedAt', 'desc'),
      limit(20)
    );
    
    if (selectedLocation !== 'all') jobsQuery = query(jobsQuery, where('location', '==', selectedLocation));
    if (selectedCompany !== 'all') jobsQuery = query(jobsQuery, where('company', '==', selectedCompany));
    if (selectedJobType !== 'all') jobsQuery = query(jobsQuery, where('jobType', '==', selectedJobType));
    
    if (sortBy === 'bonus') {
      jobsQuery = query(
        collection(db, 'referralJobs'),
        where('isActive', '==', true),
        orderBy('bonusAmount', 'desc'),
        orderBy('postedAt', 'desc'),
        limit(20)
      );
      if (selectedLocation !== 'all') jobsQuery = query(jobsQuery, where('location', '==', selectedLocation));
      if (selectedCompany !== 'all') jobsQuery = query(jobsQuery, where('company', '==', selectedCompany));
      if (selectedJobType !== 'all') jobsQuery = query(jobsQuery, where('jobType', '==', selectedJobType));
    }
    
    if (startAfterDoc) jobsQuery = query(jobsQuery, startAfter(startAfterDoc));
    return jobsQuery;
  };

  const processJobData = (snapshot: any): ReferralJob[] => {
    const jobsList: ReferralJob[] = [];
    snapshot.forEach((docSnap: any) => {
      const data = docSnap.data();
      jobsList.push({
        id: docSnap.id,
        title: data.title,
        company: data.company,
        location: data.location,
        bonusAmount: data.bonusAmount,
        skills: data.skills || [],
        postedBy: data.postedBy,
        postedAt: data.postedAt,
        description: data.description,
        requirements: data.requirements,
        isActive: data.isActive,
        jobType: data.jobType,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        salaryUnit: data.salaryUnit,
        postedByName: data.postedByName,
        remote: data.remote,
        experience: data.experience,
        referralCode: data.referralCode || 'PENDING',
        views: data.views,
        saves: data.saves,
        unreadCounts: data.unreadCounts || {}
      });
    });
    return jobsList;
  };

  const fetchJobs = async (isRefresh = false) => {
    if (!isRefresh && referralJobs.length > 0 && !hasMore) return;
    setLoadingJobs(true);
    try {
      const jobsQuery = buildJobsQuery();
      const snapshot = await getDocs(jobsQuery);
      const jobsList = processJobData(snapshot);
      
      const locs = new Set<string>();
      const comps = new Set<string>();
      jobsList.forEach(job => {
        if (job.location) locs.add(job.location);
        if (job.company) comps.add(job.company);
      });
      setLocations(Array.from(locs).sort());
      setCompanies(Array.from(comps).sort());
      
      setReferralJobs(jobsList);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === 20);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const loadMoreJobs = async () => {
    if (!hasMore || loadingMore || !lastVisible) return;
    setLoadingMore(true);
    try {
      const jobsQuery = buildJobsQuery(lastVisible);
      const snapshot = await getDocs(jobsQuery);
      const newJobs = processJobData(snapshot);
      
      setReferralJobs(prev => [...prev, ...newJobs]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === 20);
    } catch (error) {
      console.error("Error loading more jobs:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const refreshJobs = () => {
    setLastVisible(null);
    setHasMore(true);
    fetchJobs(true);
  };

  const loadJobConversations = async (jobId: string, reset: boolean = true) => {
    if (!user) return;
    setLoadingConversations(true);
    try {
      const result = await getJobReferralConversationsPaginated(
        jobId, user.uid, 20, reset ? undefined : jobConversationsLastDoc || undefined
      );
      
      if (reset) {
        setJobConversations(result.conversations);
      } else {
        setJobConversations(prev => [...prev, ...result.conversations]);
      }
      setJobConversationsLastDoc(result.lastDoc);
      setHasMoreConversations(result.lastDoc !== null);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadMoreConversations = () => {
    if (selectedJob) loadJobConversations(selectedJob.id, false);
  };

  // Base setup effect
  useEffect(() => {
    if (!user) return;
    const initUserData = async () => {
      try {
        const q = query(collection(db, 'users'), where('uid', '==', user.uid));
        const userDoc = await getDocs(q);
        if (!userDoc.empty) {
          setIsVerifiedEmployee(userDoc.docs[0].data().isVerifiedEmployee || false);
        }
      } catch (e) {
        console.error("User data init failed", e);
      }
    };
    initUserData();
    fetchJobs();
  }, [user]);

  // Lazy Load "My Jobs"
  useEffect(() => {
    if (viewMode === 'my' && user && !myJobsFetched) {
      const fetchMyJobs = async () => {
        setLoadingMyJobs(true);
        try {
          const jobsQuery = query(collection(db, 'referralJobs'), where('postedBy', '==', user.uid), orderBy('postedAt', 'desc'));
          const snapshot = await getDocs(jobsQuery);
          setUserPostedJobs(processJobData(snapshot));
          setMyJobsFetched(true);
        } catch (error) {
          console.error("Failed to load my jobs", error);
        } finally {
          setLoadingMyJobs(false);
        }
      };
      fetchMyJobs();
    }
  }, [viewMode, user, myJobsFetched]);

  // Re-fetch jobs when filters/sort change
  useEffect(() => {
    if (user) {
      setLastVisible(null);
      setHasMore(true);
      fetchJobs(true);
    }
  }, [selectedLocation, selectedCompany, selectedJobType, sortBy, user]);

  // 🚀 FIX: Removed the useEffect that set filteredJobs; useMemo handles it

  const displayedJobs = viewMode === 'my' ? userPostedJobs : filteredJobs;

  const handleSelectJob = async (job: ReferralJob) => {
    setSelectedJob(job);
    setActiveTab('details');
    setSelectedConversation(null);
    setShowJobDetails(true);
    
    if (user) {
      await loadJobConversations(job.id, true);
      if (user.uid !== job.postedBy) {
        const existingConv = jobConversations.find(c => c.jobSeekerId === user.uid);
        if (existingConv) setSelectedConversation(existingConv);
      }
    }
    
    // Only count views once per session
    if (user && user.uid !== job.postedBy && !viewedJobs.current.has(job.id)) {
      try {
        viewedJobs.current.add(job.id);
        await updateDoc(doc(db, 'referralJobs', job.id), { views: (job.views || 0) + 1 });
      } catch (e) {}
    }
  };

  const handleOpenChat = async () => {
    if (!user || !selectedJob) return;
    setStartingChat(true);
    try {
      if (user.uid === selectedJob.postedBy) {
        setActiveTab('chat');
      } else {
        const existing = jobConversations.find(c => c.jobSeekerId === user.uid);
        if (existing) {
          setSelectedConversation(existing);
        } else {
          await startReferralConversation(
            selectedJob.id, selectedJob.title, selectedJob.company, selectedJob.postedBy, user.uid
          );
          await loadJobConversations(selectedJob.id, true);
          const newConv = jobConversations.find(c => c.jobSeekerId === user.uid);
          if (newConv) setSelectedConversation(newConv);
        }
        setActiveTab('chat');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setStartingChat(false);
    }
  };

  // 🚀 HYBRID: Uses DeepSeek's message listener + Gemini's unread count check
  useEffect(() => {
    if (!selectedConversation || !user) return;
    
    markConversationAsRead(selectedConversation.conversationId, user.uid);
    
    // 🟢 Gemini's improvement: Only update unread count if it's > 0
    const currentUnreads = selectedJob?.unreadCounts?.[user.uid] || 0;
    
    if (selectedJob && currentUnreads > 0) {
      const updatedUnreads = { ...(selectedJob.unreadCounts || {}) };
      updatedUnreads[user.uid] = 0;
      setSelectedJob({ ...selectedJob, unreadCounts: updatedUnreads });
      setReferralJobs(prev => prev.map(job => 
        job.id === selectedJob.id ? { ...job, unreadCounts: updatedUnreads } : job
      ));
    }
    
    // 🟢 DeepSeek's message listener with duplicate prevention
    const unsubMsg = getReferralMessages(selectedConversation.conversationId, (msgs) => {
      const newMessages = msgs as Message[];
      if (JSON.stringify(messagesRef.current) !== JSON.stringify(newMessages)) {
        messagesRef.current = newMessages;
        setMessages(newMessages);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    });

    const typingRef = doc(db, 'typingStatus', selectedConversation.conversationId);
    const unsubTyping = onSnapshot(typingRef, (docSnap: DocumentSnapshot) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const otherUserId = selectedConversation.participants.find(id => id !== user.uid);
        if (otherUserId && data[otherUserId] === true) {
          setIsTyping(true);
          const timer = setTimeout(() => setIsTyping(false), 3000);
          return () => clearTimeout(timer);
        } else {
          setIsTyping(false);
        }
      }
    });

    return () => {
      unsubMsg();
      unsubTyping();
    };
  }, [selectedConversation, user, selectedJob]);

  // 🚀 OPTIMIZATION: Edge-triggered typing (exactly 2 writes max per interaction block)
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);
    
    if (selectedConversation && user) {
      if (typingTimeout) clearTimeout(typingTimeout);
      
      const typingRef = doc(db, 'typingStatus', selectedConversation.conversationId);
      
      // Started typing
      if (value.trim().length > 0 && !hasNotifiedTypingRef.current) {
        setDoc(typingRef, { [user.uid]: true, timestamp: serverTimestamp() }, { merge: true });
        hasNotifiedTypingRef.current = true;
      } 
      
      // Manually cleared input
      if (value.trim().length === 0 && hasNotifiedTypingRef.current) {
        setDoc(typingRef, { [user.uid]: false }, { merge: true });
        hasNotifiedTypingRef.current = false;
      }

      // Stopped typing timeout
      const timeout = setTimeout(() => {
        if (hasNotifiedTypingRef.current) {
          setDoc(typingRef, { [user.uid]: false }, { merge: true });
          hasNotifiedTypingRef.current = false;
        }
      }, 2500);
      setTypingTimeout(timeout);
    }
  }, [selectedConversation, user, typingTimeout]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;
    setSendingMessage(true);
    try {
      const typingRef = doc(db, 'typingStatus', selectedConversation.conversationId);
      await setDoc(typingRef, { [user.uid]: false }, { merge: true });
      hasNotifiedTypingRef.current = false;
      
      await sendReferralMessage(selectedConversation.conversationId, user.uid, newMessage.trim());
      setNewMessage('');
    } finally {
      setSendingMessage(false);
    }
  };

  const getUnreadCountForJob = (job: ReferralJob): number => {
    if (!user) return 0;
    return job.unreadCounts?.[user.uid] || 0;
  };

  const formatTime = (ts: any) => toJSDate(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('all');
    setSelectedCompany('all');
    setSelectedJobType('all');
  };

  if (loadingAuth) return <div className="h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-orange-500 rounded-full animate-spin border-t-transparent"></div></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col h-screen overflow-hidden font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-orange-600 tracking-tighter">
  ALL
  <span className="text-xl font-black text-black tracking-tight ml-2">
    Referral Jobs
  </span>
</h1>
              {/* <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Premium Connections</p> */}
            </div>
          </div>
          <div className="flex gap-3">
            {isVerifiedEmployee && (
              <button onClick={() => setViewMode(viewMode === 'my' ? 'all' : 'my')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'my' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'}`}>
                {viewMode === 'my' ? 'View All Jobs' : 'My Posted Jobs'}
                {viewMode === 'my' && loadingMyJobs && <Loader2 className="w-3 h-3 inline ml-1 animate-spin" />}
              </button>
            )}
            <button onClick={() => router.push(isVerifiedEmployee ? '/referral/post' : '/referral/verify')} className="bg-black text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              {isVerifiedEmployee ? <><Sparkles className="w-3 h-3"/> Post Opportunity</> : <><Star className="w-3 h-3"/> Get Verified</>}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row">
          
          {/* LEFT PANEL: Job Grid */}
          <div className={`w-full ${showJobDetails ? 'lg:w-[60%] hidden lg:flex' : 'lg:w-full flex'} h-full flex-col border-r border-gray-200 bg-gray-50`}>
            
            {/* Filters Bar */}
            <div className="p-5 bg-white border-b border-gray-200 shadow-sm flex-shrink-0 z-10 space-y-4">
               <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      placeholder="Search roles, companies, or skills..." 
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" 
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={refreshJobs} className="text-xs font-bold flex items-center justify-center gap-2 bg-gray-100 px-4 py-2.5 rounded-xl hover:bg-gray-200 border border-gray-200 transition-colors">
                      <RefreshCw className="w-3.5 h-3.5"/> Refresh
                    </button>
                    <button onClick={() => setShowFilters(!showFilters)} className="text-xs font-bold flex items-center justify-center gap-2 bg-gray-100 px-4 py-2.5 rounded-xl hover:bg-gray-200 border border-gray-200 transition-colors whitespace-nowrap">
                      <Filter className="w-3.5 h-3.5"/> {showFilters ? 'Hide Filters' : 'Filters'}
                    </button>
                  </div>
               </div>

               {showFilters && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 animate-in slide-in-from-top-2 duration-200">
                    <select onChange={(e) => setSelectedLocation(e.target.value)} value={selectedLocation} className="bg-white border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-black cursor-pointer">
                        <option value="all">All Locations</option>
                        {locations.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <select onChange={(e) => setSelectedCompany(e.target.value)} value={selectedCompany} className="bg-white border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-black cursor-pointer">
                        <option value="all">All Companies</option>
                        {companies.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select onChange={(e) => setSelectedJobType(e.target.value)} value={selectedJobType} className="bg-white border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-black cursor-pointer">
                        <option value="all">All Types</option>
                        {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                     <select onChange={(e) => setSortBy(e.target.value as any)} value={sortBy} className="bg-white border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-black cursor-pointer">
                        <option value="newest">Newest First</option>
                        <option value="bonus">Highest Bonus</option>
                    </select>
                    <button onClick={clearFilters} className="col-span-2 md:col-span-4 text-xs text-red-500 font-bold text-center py-1 hover:underline">Reset All Filters</button>
                  </div>
              )}
            </div>

            {/* Scrollable Job List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
              {loadingJobs || loadingMyJobs ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400 text-sm font-medium">Loading opportunities...</p>
                </div>
              ) : displayedJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700">No jobs found</h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">Try adjusting your filters or check back later for new referral opportunities.</p>
                </div>
              ) : (
                <>
                <div className={`grid grid-cols-1 ${showJobDetails ? 'lg:grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'} gap-5 pb-10`}>
                  {displayedJobs.map(job => {
                    const unread = getUnreadCountForJob(job);
                    const isMyJob = job.postedBy === user?.uid;
                    const style = getCompanyStyle(job.company);

                    return (
                      <div 
                        key={job.id}
                        onClick={() => handleSelectJob(job)}
                        className={`bg-white rounded-2xl border transition-all duration-300 cursor-pointer hover:shadow-xl relative group flex flex-col h-full overflow-hidden hover:scale-[1.01]
                          ${selectedJob?.id === job.id ? 'border-black ring-1 ring-black shadow-lg' : 'border-gray-100 hover:border-gray-300'}
                        `}
                      >
                        <div className="p-5 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg ${style.bg} ${style.text} flex items-center justify-center font-bold text-lg shadow-sm`}>
                                        {job.company.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 line-clamp-1 text-base leading-tight" title={job.title}>{job.title}</h3>
                                        <p className="text-xs text-gray-500 font-medium">{job.company}</p>
                                    </div>
                                </div>
                                {unread > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse whitespace-nowrap">
                                        {unread}
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="inline-flex items-center gap-1 text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
                                    <MapPin className="w-3 h-3" /> {job.location}
                                </span>
                                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium border border-gray-200">
                                    {job.jobType}
                                </span>
                            </div>

                            <div className="flex-grow mb-4">
                                <div className="flex flex-wrap gap-1.5">
                                    {job.skills?.slice(0, 2).map(skill => (
                                        <span key={skill} className="text-[10px] bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                                            {skill}
                                        </span>
                                    ))}
                                    {job.skills?.length > 2 && <span className="text-[10px] text-gray-400 px-1">+{job.skills.length - 2}</span>}
                                </div>
                            </div>

                            <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-end">
                                <div>
                                    {isMyJob ? (
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Your Bonus</span>
                                            <span className="text-sm font-bold text-gray-900">₹{job.bonusAmount?.toLocaleString() || '0'}</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Salary</span>
                                            <span className="text-xs font-bold text-gray-900">{formatSalary(job).split(' - ')[0]}...</span>
                                        </div>
                                    )}
                                </div>
                                
                                <span className={`text-xs font-bold flex items-center px-3 py-1.5 rounded-lg transition-colors ${selectedJob?.id === job.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-900 group-hover:bg-black group-hover:text-white'}`}>
                                    View <ChevronRight className="w-3 h-3 ml-1"/>
                                </span>
                            </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {viewMode === 'all' && hasMore && (
                  <div className="flex justify-center pb-8">
                    <button
                      onClick={loadMoreJobs}
                      disabled={loadingMore}
                      className="px-6 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
                    >
                      {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      {loadingMore ? 'Loading...' : 'Load More Jobs'}
                    </button>
                  </div>
                )}
                </>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Details & Chat */}
          <div className={`w-full lg:w-[40%] bg-white h-full flex flex-col fixed inset-0 z-50 lg:static lg:z-auto ${!showJobDetails ? 'hidden' : 'flex'}`}>
            
            <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-white lg:hidden">
              <button onClick={() => setShowJobDetails(false)} className="flex items-center text-sm font-bold text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </button>
              <h3 className="font-bold text-sm">Job Details</h3>
              <div className="w-8"></div>
            </div>

            {selectedJob && (
                <>
                {activeTab === 'details' ? (
                  <div className="flex-1 overflow-y-auto flex flex-col bg-white">
                    <div className="p-8 pb-4">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-16 h-16 rounded-2xl ${getCompanyStyle(selectedJob.company).bg} ${getCompanyStyle(selectedJob.company).text} flex items-center justify-center text-2xl font-bold shadow-sm`}>
                                {selectedJob.company.charAt(0)}
                            </div>
                            <button onClick={() => setShowJobDetails(false)} className="hidden lg:block text-gray-300 hover:text-black transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">{selectedJob.title}</h2>
                        
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className="flex items-center text-sm font-medium text-gray-900">
                                <Building className="w-4 h-4 mr-1.5 text-gray-400"/> {selectedJob.company}
                            </span>
                            <span className="flex items-center text-sm text-gray-500">
                                <MapPin className="w-4 h-4 mr-1.5 text-gray-400"/> {selectedJob.location}
                            </span>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-center">
                             <div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Salary Range</p>
                                <p className="text-lg font-bold text-gray-900">{formatSalary(selectedJob)}</p>
                             </div>
                             {user.uid === selectedJob.postedBy && (
                                <div className="text-right">
                                    <p className="text-[10px] text-amber-600 uppercase font-bold tracking-wider mb-1">Referral Bonus</p>
                                    <p className="text-lg font-bold text-amber-700">₹{selectedJob.bonusAmount?.toLocaleString()}</p>
                                    <div className="text-[10px] text-amber-700 mt-1 flex items-center gap-1 justify-end" title="Private to you">
                                      <LockIcon size={10} /> Private
                                    </div>
                                </div>
                             )}
                        </div>
                    </div>

                    <div className="p-8 pt-2 space-y-8">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Role Overview</h3>
                            <div className="text-sm text-gray-600 leading-7 whitespace-pre-wrap">
                              {selectedJob.description}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedJob.skills?.map(s => (
                                    <span key={s} className="bg-white border border-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium shadow-sm hover:border-gray-300 transition-colors flex items-center gap-1">
                                        {getSkillIcon(s)} {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 pb-4 sticky bottom-0 bg-white border-t border-gray-50">
                        {user.uid === selectedJob.postedBy ? (
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <h3 className="font-bold text-black mb-3 text-sm flex items-center justify-between">
                                    <span>Applicants</span>
                                    <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs">{jobConversations.length}</span>
                                </h3>
                                {loadingConversations && jobConversations.length === 0 ? (
                                    <div className="text-center py-4 text-gray-400 text-xs">Loading conversations...</div>
                                ) : jobConversations.length === 0 ? (
                                    <div className="text-center py-4 text-gray-400 text-xs italic">No messages yet.</div>
                                ) : (
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                        {jobConversations.map(conv => (
                                            <div 
                                                key={conv.conversationId}
                                                onClick={() => { setSelectedConversation(conv); setActiveTab('chat'); }}
                                                className="p-3 bg-white border border-gray-100 rounded-lg hover:border-black cursor-pointer flex justify-between items-center transition-all group"
                                            >
                                                <div>
                                                    <p className="font-bold text-xs text-gray-900">{getSafeName(conv.jobSeekerName)}</p>
                                                    <p className="text-[10px] text-gray-500 truncate w-32">{conv.lastMessage}</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black" />
                                            </div>
                                        ))}
                                        {hasMoreConversations && (
                                            <button onClick={loadMoreConversations} className="text-xs text-black font-medium mt-2 text-center w-full py-1 hover:underline">
                                                Load more...
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={handleOpenChat}
                                disabled={startingChat}
                                className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 transform active:scale-95"
                            >
                                {startingChat ? <Loader2 className="w-5 h-5 animate-spin"/> : <MessageSquare className="w-5 h-5" />}
                                {selectedConversation ? 'Continue Conversation' : 'Chat with Employee'}
                            </button>
                        )}
                        </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col h-full bg-gray-50">
                    
                    <div className="p-4 border-b border-gray-200 bg-white shadow-sm flex items-center gap-3 z-10 sticky top-0">
                      <button onClick={() => setActiveTab('details')} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-gray-900 text-sm truncate flex items-center gap-2">
                            {user.uid === selectedJob.postedBy 
                              ? getSafeName(selectedConversation?.jobSeekerName) 
                              : getSafeName(selectedJob.postedByName)}
                            
                            <span className="font-normal text-gray-500 hidden sm:inline">
                               ({selectedJob.title})
                            </span>
                          </h3>
                          
                          <div title="Secure & Private Chat">
                            <ShieldCheckIcon className="w-4 h-4 text-green-500" />
                          </div>
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-500 mt-0.5 font-medium">
                          <Building className="w-3 h-3 mr-1" />
                          {selectedJob.company}
                          {isTyping && <span className="ml-2 text-green-600 animate-pulse">Typing...</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map(msg => {
                        const isMe = msg.senderId === user.uid;
                        return (
                          <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in zoom-in-95 duration-200`}>
                            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-black text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'}`}>
                              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                              <div className={`flex justify-end items-center mt-1 gap-1 ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>
                                <span className="text-[9px] opacity-70">
                                  {formatTime(msg.createdAt)}
                                </span>
                                {isMe && (
                                  msg.read ? <CheckCheck className="w-3 h-3 text-green-400" /> : (msg as any).delivered ? <CheckCheck className="w-3 h-3 text-gray-500" /> : <Check className="w-3 h-3 text-gray-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-white border-t border-gray-200">
                      <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-2xl px-2 py-1 focus-within:ring-2 focus-within:ring-black focus-within:bg-white focus-within:border-transparent transition-all shadow-inner">
                        <input 
                          className="flex-1 bg-transparent border-none px-3 py-3 text-sm focus:outline-none text-gray-900 placeholder:text-gray-400"
                          placeholder="Type a professional message..."
                          value={newMessage}
                          onChange={handleInputChange}
                          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                          disabled={sendingMessage}
                        />
                        <button 
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || sendingMessage}
                          className="p-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:bg-gray-300 shadow-sm"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}