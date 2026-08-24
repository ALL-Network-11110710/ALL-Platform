// "use client";

// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function PostReferralJobPage() {
//   const [user, loading, error] = useAuthState(auth);
//   const router = useRouter();
//   const [mounted, setMounted] = useState(false);
//   const [isVerified, setIsVerified] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [userData, setUserData] = useState<any>(null);

//   // Form states
//   const [jobTitle, setJobTitle] = useState('');
//   const [companyName, setCompanyName] = useState('');
//   const [jobDescription, setJobDescription] = useState('');
//   const [requirements, setRequirements] = useState('');
//   const [skills, setSkills] = useState('');
//   const [jobType, setJobType] = useState('full-time');
//   const [location, setLocation] = useState('');
//   const [salaryMin, setSalaryMin] = useState('');
//   const [salaryMax, setSalaryMax] = useState('');
//   const [salaryUnit, setSalaryUnit] = useState('monthly');
//   const [bonusAmount, setBonusAmount] = useState('15000'); // Internal only
//   const [applicationDeadline, setApplicationDeadline] = useState('');
//   const [externalLink, setExternalLink] = useState('');
//   const [category, setCategory] = useState('technology');
//   const [experienceLevel, setExperienceLevel] = useState('mid');
//   const [remotePolicy, setRemotePolicy] = useState('hybrid');
//   const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

//   useEffect(() => {
//     setMounted(true);
    
//     // Check if user is logged in and verified
//     if (user && !loading) {
//       checkUserVerification();
//     }
    
//     // Redirect if not logged in
//     if (!loading && !user) {
//       router.push('/login');
//     }
//   }, [user, loading, router]);

//   const checkUserVerification = async () => {
//     if (!user) return;
    
//     try {
//       const userDoc = await getDoc(doc(db, 'users', user.uid));
//       if (userDoc.exists()) {
//         const data = userDoc.data();
//         setUserData(data);
        
//         if (data.isVerifiedEmployee) {
//           setIsVerified(true);
//           // Pre-fill company name from email domain
//           if (data.companyEmail) {
//             const domain = data.companyEmail.split('@')[1];
//             const companyNameFromDomain = domain.split('.')[0];
//             setCompanyName(companyNameFromDomain.charAt(0).toUpperCase() + companyNameFromDomain.slice(1));
//           }
//         } else {
//           setIsVerified(false);
//           setMessage({
//             type: 'error',
//             text: 'You need to be a verified employee to post referral jobs. Please verify your account first.'
//           });
//         }
//       }
//     } catch (error) {
//       console.error('Error checking verification:', error);
//       setMessage({
//         type: 'error',
//         text: 'Error checking your verification status. Please try again.'
//       });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage(null);

//     // Basic validation
//     if (!jobTitle.trim() || !companyName.trim() || !jobDescription.trim() || !location.trim()) {
//       setMessage({
//         type: 'error',
//         text: 'Please fill in all required fields: Job Title, Company Name, Description, and Location.'
//       });
//       setIsLoading(false);
//       return;
//     }

//     // Parse requirements into array
//     const requirementsArray = requirements
//       .split('\n')
//       .map(req => req.trim())
//       .filter(req => req.length > 0);

//     // Parse skills into array
//     const skillsArray = skills
//       .split(',')
//       .map(skill => skill.trim())
//       .filter(skill => skill.length > 0);

//     // Calculate deadline (30 days from now if not provided)
//     let deadlineDate = applicationDeadline;
//     if (!deadlineDate) {
//       const futureDate = new Date();
//       futureDate.setDate(futureDate.getDate() + 30);
//       deadlineDate = futureDate.toISOString().split('T')[0];
//     }

//     try {
//       const referralJobData = {
//         title: jobTitle.trim(),
//         company: companyName.trim(),
//         description: jobDescription.trim(),
//         requirements: requirementsArray.length > 0 ? requirementsArray : ['No specific requirements listed'],
//         skills: skillsArray.length > 0 ? skillsArray : ['Not specified'],
//         jobType,
//         location: location.trim(),
//         salaryMin: salaryMin ? parseInt(salaryMin) : null,
//         salaryMax: salaryMax ? parseInt(salaryMax) : null,
//         salaryUnit,
//         bonusAmount: parseInt(bonusAmount), // Stored internally, not shown to job seekers
//         postedBy: user!.uid,
//         postedByName: userData?.name || user!.email || 'Anonymous Employee',
//         postedAt: serverTimestamp(),
//         isActive: true,
//         applicationDeadline: deadlineDate,
//         externalLink: externalLink.trim() || null,
//         category,
//         experienceLevel,
//         remotePolicy,
//         // Stats
//         views: 0,
//         applications: 0,
//         status: 'open'
//       };

//       // Add to Firestore
//       await addDoc(collection(db, 'referralJobs'), referralJobData);
      
//       setMessage({
//         type: 'success',
//         text: '🎉 Referral job posted successfully! Redirecting to marketplace...'
//       });

//       // Clear form
//       setJobTitle('');
//       setJobDescription('');
//       setRequirements('');
//       setSkills('');
//       setLocation('');
//       setSalaryMin('');
//       setSalaryMax('');
//       setExternalLink('');

//       // Redirect after 2 seconds
//       setTimeout(() => {
//         router.push('/referral/marketplace');
//       }, 2000);

//     } catch (error: any) {
//       console.error('Error posting job:', error);
//       setMessage({
//         type: 'error',
//         text: `Error: ${error.message || 'Failed to post job. Please try again.'}`
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!mounted || loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return null; // Will redirect in useEffect
//   }

//   if (!isVerified) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-3xl mx-auto text-center">
//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
//               </svg>
//             </div>
            
//             <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Required</h2>
//             <p className="text-gray-600 mb-6">
//               You need to be a verified employee to post referral jobs.
//             </p>
            
//             <div className="space-y-4">
//               <button
//                 onClick={() => router.push('/referral/verify')}
//                 className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition"
//               >
//                 Get Verified as Employee →
//               </button>
              
//               <button
//                 onClick={() => router.push('/referral/marketplace')}
//                 className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition"
//               >
//                 Browse Referral Marketplace
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <Link href="/referral" className="inline-block mb-6">
//             <button className="text-orange-600 hover:text-orange-800 font-medium flex items-center">
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
//               </svg>
//               Back to Referral Hub
//             </button>
//           </Link>
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Post a Referral Job
//           </h1>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Share job openings from your company and help candidates get direct access to employees.
//           </p>
//         </div>

//         {/* Message Display */}
//         {message && (
//           <div className={`mb-8 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
//             {message.text}
//           </div>
//         )}

//         {/* Promotion Banner */}
//         <div className="mb-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg">
//           <div className="flex flex-col md:flex-row items-center justify-between">
//             <div className="mb-4 md:mb-0">
//               <h3 className="text-2xl font-bold mb-2">🎉 Limited Time Offer!</h3>
//               <p className="text-orange-100 text-lg">
//                 Post referral jobs for <span className="font-bold">FREE for 3 months</span>. No subscription required!
//               </p>
//             </div>
//             <div>
//               <span className="bg-white text-orange-600 font-bold py-3 px-6 rounded-lg text-lg">
//                 Employee Plan: ₹0/month
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Main Form - Takes 2/3 width on large screens */}
//           <div className="lg:w-2/3">
//             <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
//               <div className="mb-8">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Details</h2>
//                 <p className="text-gray-600">Fill in the job information below</p>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-8">
//                 {/* Basic Information */}
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Job Title *
//                       </label>
//                       <input
//                         type="text"
//                         value={jobTitle}
//                         onChange={(e) => setJobTitle(e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
//                         placeholder="e.g., Senior Software Engineer"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Company Name *
//                       </label>
//                       <input
//                         type="text"
//                         value={companyName}
//                         onChange={(e) => setCompanyName(e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
//                         placeholder="e.g., Google, Microsoft, Amazon"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Job Type *
//                       </label>
//                       <select
//                         value={jobType}
//                         onChange={(e) => setJobType(e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
//                       >
//                         <option value="full-time">Full-time</option>
//                         <option value="part-time">Part-time</option>
//                         <option value="contract">Contract</option>
//                         <option value="internship">Internship</option>
//                       </select>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Experience Level
//                       </label>
//                       <select
//                         value={experienceLevel}
//                         onChange={(e) => setExperienceLevel(e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
//                       >
//                         <option value="entry">Entry Level</option>
//                         <option value="mid">Mid Level</option>
//                         <option value="senior">Senior</option>
//                         <option value="executive">Executive</option>
//                       </select>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Remote Policy
//                       </label>
//                       <select
//                         value={remotePolicy}
//                         onChange={(e) => setRemotePolicy(e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
//                       >
//                         <option value="onsite">On-site</option>
//                         <option value="remote">Remote</option>
//                         <option value="hybrid">Hybrid</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Location *
//                     </label>
//                     <input
//                       type="text"
//                       value={location}
//                       onChange={(e) => setLocation(e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
//                       placeholder="e.g., Bengaluru, Karnataka or Remote"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Description & Requirements */}
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Job Description & Requirements</h3>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Job Description *
//                     </label>
//                     <textarea
//                       value={jobDescription}
//                       onChange={(e) => setJobDescription(e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition h-40"
//                       placeholder="Describe the role, responsibilities, and impact..."
//                       required
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Requirements (one per line)
//                       </label>
//                       <textarea
//                         value={requirements}
//                         onChange={(e) => setRequirements(e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition h-40"
//                         placeholder="• 3+ years experience in React\n• Bachelor's degree in CS\n• Strong communication skills"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Skills (comma separated)
//                       </label>
//                       <textarea
//                         value={skills}
//                         onChange={(e) => setSkills(e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition h-40"
//                         placeholder="React, TypeScript, Node.js, AWS, Agile"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Salary & Category */}
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Salary & Category</h3>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Salary Range (Optional)
//                       </label>
//                       <div className="flex space-x-2">
//                         <input
//                           type="number"
//                           value={salaryMin}
//                           onChange={(e) => setSalaryMin(e.target.value)}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
//                           placeholder="Min"
//                         />
//                         <input
//                           type="number"
//                           value={salaryMax}
//                           onChange={(e) => setSalaryMax(e.target.value)}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
//                           placeholder="Max"
//                         />
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Salary Unit
//                       </label>
//                       <select
//                         value={salaryUnit}
//                         onChange={(e) => setSalaryUnit(e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
//                       >
//                         <option value="monthly">Per Month</option>
//                         <option value="yearly">Per Year</option>
//                       </select>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Category
//                       </label>
//                       <select
//                         value={category}
//                         onChange={(e) => setCategory(e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
//                       >
//                         <option value="technology">Technology</option>
//                         <option value="business">Business</option>
//                         <option value="marketing">Marketing</option>
//                         <option value="design">Design</option>
//                         <option value="sales">Sales</option>
//                         <option value="finance">Finance</option>
//                         <option value="hr">Human Resources</option>
//                         <option value="operations">Operations</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Additional Information */}
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Application Deadline
//                       </label>
//                       <input
//                         type="date"
//                         value={applicationDeadline}
//                         onChange={(e) => setApplicationDeadline(e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
//                       />
//                       <p className="mt-2 text-sm text-gray-500">Leave empty for 30 days from now</p>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         External Application Link (Optional)
//                       </label>
//                       <input
//                         type="url"
//                         value={externalLink}
//                         onChange={(e) => setExternalLink(e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
//                         placeholder="https://company.com/careers/job-id"
//                       />
//                       <p className="mt-2 text-sm text-gray-500">If candidates should apply on your company site</p>
//                     </div>
//                   </div>

//                   {/* Hidden Bonus Amount Selection - For employee's reference only */}
//                   <div className="border-t pt-6">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Referral Bonus (For Your Records)
//                     </label>
//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                       {[
//                         { value: '15000', label: '₹15,000', desc: 'Standard' },
//                         { value: '25000', label: '₹25,000', desc: 'Premium' },
//                         { value: '50000', label: '₹50,000+', desc: 'Executive' },
//                       ].map((option) => (
//                         <div
//                           key={option.value}
//                           className={`border-2 rounded-xl p-4 cursor-pointer transition ${bonusAmount === option.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}
//                           onClick={() => setBonusAmount(option.value)}
//                         >
//                           <div className="text-lg font-semibold text-gray-900">{option.label}</div>
//                           <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
//                           {bonusAmount === option.value && (
//                             <div className="mt-2 text-xs text-orange-600 font-medium">✓ Selected</div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                     <p className="mt-2 text-sm text-gray-500">
//                       This bonus amount is for your reference only and won't be shown to job seekers.
//                     </p>
//                   </div>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="pt-6 border-t">
//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-6 rounded-xl hover:from-orange-600 hover:to-orange-700 transition text-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isLoading ? (
//                       <span className="flex items-center justify-center">
//                         <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mr-3"></div>
//                         Posting Job...
//                       </span>
//                     ) : (
//                       'Post Referral Job →'
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>

//           {/* Sidebar - Takes 1/3 width on large screens */}
//           <div className="lg:w-1/3">
//             {/* Stats Card */}
//             <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
//               <h3 className="text-xl font-bold text-gray-900 mb-6">📊 Your Referral Stats</h3>
//               <div className="space-y-5">
//                 <div className="flex items-center justify-between pb-3 border-b">
//                   <div>
//                     <div className="text-sm text-gray-500">Verified Status</div>
//                     <div className="flex items-center mt-1">
//                       <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
//                       <span className="font-semibold text-green-600">Verified Employee</span>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-sm text-gray-500">Company</div>
//                     <div className="font-semibold text-gray-900">{companyName || 'Not specified'}</div>
//                   </div>
//                 </div>
                
//                 <div className="text-center py-4">
//                   <div className="text-sm text-gray-500 mb-1">Free Posts Remaining</div>
//                   <div className="font-bold text-orange-600 text-4xl">∞</div>
//                   <p className="text-sm text-gray-500 mt-2">Free for 3 months!</p>
//                 </div>
                
//                 <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
//                   <div className="flex items-center">
//                     <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
//                       ₹
//                     </div>
//                     <div>
//                       <div className="text-sm text-gray-500">Selected Bonus</div>
//                       <div className="font-bold text-gray-900 text-lg">₹{parseInt(bonusAmount).toLocaleString()}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Tips Card */}
//             <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 mb-6">
//               <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Tips for Success</h3>
//               <ul className="space-y-3">
//                 <li className="flex items-start">
//                   <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
//                     1
//                   </div>
//                   <span className="text-gray-700">Be specific about requirements to attract qualified candidates</span>
//                 </li>
//                 <li className="flex items-start">
//                   <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
//                     2
//                   </div>
//                   <span className="text-gray-700">Mention if you can provide interview tips or referrals</span>
//                 </li>
//                 <li className="flex items-start">
//                   <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
//                     3
//                   </div>
//                   <span className="text-gray-700">Respond quickly to candidate messages (within 24 hours)</span>
//                 </li>
//                 <li className="flex items-start">
//                   <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
//                     4
//                   </div>
//                   <span className="text-gray-700">Share insights about your company culture</span>
//                 </li>
//               </ul>
//             </div>

//             {/* How It Works */}
//             <div className="bg-white rounded-2xl shadow-xl p-6">
//               <h3 className="text-xl font-bold text-gray-900 mb-4">🔄 How Referral Works</h3>
//               <div className="space-y-4">
//                 <div className="flex items-start">
//                   <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
//                     1
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-900">Post Job</h4>
//                     <p className="text-sm text-gray-600">Fill this form with job details</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
//                     2
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-900">Candidates Message You</h4>
//                     <p className="text-sm text-gray-600">Job seekers contact you directly via chat</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
//                     3
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-900">Refer & Earn</h4>
//                     <p className="text-sm text-gray-600">Get bonus when candidate is hired through your referral</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="mt-8 pt-6 border-t border-gray-200">
//                 <Link href="/referral/marketplace">
//                   <button className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition flex items-center justify-center">
//                     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                     </svg>
//                     Browse All Referral Jobs
//                   </button>
//                 </Link>
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
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// DEBUG MODE: Set to true to see detailed logs
const DEBUG_MODE = true;

export default function PostReferralJobPage() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Form states
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [skills, setSkills] = useState('');
  const [jobType, setJobType] = useState('full-time');
  const [location, setLocation] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [salaryUnit, setSalaryUnit] = useState('monthly');
  const [bonusAmount, setBonusAmount] = useState('15000'); // Internal only
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [category, setCategory] = useState('technology');
  const [experienceLevel, setExperienceLevel] = useState('mid');
  const [remotePolicy, setRemotePolicy] = useState('hybrid');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Check if user is logged in and verified
    if (user && !loading) {
      checkUserVerification();
    }
    
    // Redirect if not logged in
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // DEBUG: Log current state
  useEffect(() => {
    if (DEBUG_MODE && user && !loading) {
      console.log('=== DEBUG INFO: Post Referral Page ===');
      console.log('Current user UID:', user.uid);
      console.log('Current user email:', user.email);
      console.log('isVerified state:', isVerified);
      console.log('User Data from state:', userData);
      console.log('===============================');
    }
  }, [user, loading, isVerified, userData]);

  const checkUserVerification = async () => {
    if (!user) return;
    
    if (DEBUG_MODE) {
      console.log('🔄 Checking verification for user:', user.uid);
    }
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        
        if (DEBUG_MODE) {
          console.log('📄 User document found:', data);
          console.log('🔍 isVerifiedEmployee value:', data.isVerifiedEmployee);
          console.log('🔍 Type of isVerifiedEmployee:', typeof data.isVerifiedEmployee);
        }
        
        // FIXED: Check if isVerifiedEmployee is exactly true (strict check)
        if (data.isVerifiedEmployee === true) {
          if (DEBUG_MODE) console.log('✅ User is VERIFIED! Setting isVerified to true');
          setIsVerified(true);
          
          // Pre-fill company name from email domain
          if (data.companyEmail) {
            const domain = data.companyEmail.split('@')[1];
            const companyNameFromDomain = domain.split('.')[0];
            setCompanyName(companyNameFromDomain.charAt(0).toUpperCase() + companyNameFromDomain.slice(1));
          }
        } else {
          if (DEBUG_MODE) console.log('❌ User is NOT verified. isVerifiedEmployee:', data.isVerifiedEmployee);
          setIsVerified(false);
          setMessage({
            type: 'error',
            text: 'You need to be a verified employee to post referral jobs. Please verify your account first.'
          });
        }
      } else {
        if (DEBUG_MODE) console.log('❌ User document does NOT exist in Firestore');
        setIsVerified(false);
        setMessage({
          type: 'error',
          text: 'User profile not found. Please complete your profile first.'
        });
      }
    } catch (error) {
      console.error('Error checking verification:', error);
      if (DEBUG_MODE) console.log('❌ Error checking verification:', error);
      setMessage({
        type: 'error',
        text: 'Error checking your verification status. Please try again.'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Basic validation
    if (!jobTitle.trim() || !companyName.trim() || !jobDescription.trim() || !location.trim()) {
      setMessage({
        type: 'error',
        text: 'Please fill in all required fields: Job Title, Company Name, Description, and Location.'
      });
      setIsLoading(false);
      return;
    }

    // Parse requirements into array
    const requirementsArray = requirements
      .split('\n')
      .map(req => req.trim())
      .filter(req => req.length > 0);

    // Parse skills into array
    const skillsArray = skills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);

    // Calculate deadline (30 days from now if not provided)
    let deadlineDate = applicationDeadline;
    if (!deadlineDate) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      deadlineDate = futureDate.toISOString().split('T')[0];
    }

    try {
      const referralJobData = {
        title: jobTitle.trim(),
        company: companyName.trim(),
        description: jobDescription.trim(),
        requirements: requirementsArray.length > 0 ? requirementsArray : ['No specific requirements listed'],
        skills: skillsArray.length > 0 ? skillsArray : ['Not specified'],
        jobType,
        location: location.trim(),
        salaryMin: salaryMin ? parseInt(salaryMin) : null,
        salaryMax: salaryMax ? parseInt(salaryMax) : null,
        salaryUnit,
        bonusAmount: parseInt(bonusAmount), // Stored internally, not shown to job seekers
        postedBy: user!.uid,
        postedByName: userData?.name || user!.email || 'Anonymous Employee',
        postedAt: serverTimestamp(),
        isActive: true,
        applicationDeadline: deadlineDate,
        externalLink: externalLink.trim() || null,
        category,
        experienceLevel,
        remotePolicy,
        // Stats
        views: 0,
        applications: 0,
        status: 'open'
      };

      if (DEBUG_MODE) {
        console.log('📤 Posting referral job:', referralJobData);
      }

      // Add to Firestore
      await addDoc(collection(db, 'referralJobs'), referralJobData);
      
      if (DEBUG_MODE) {
        console.log('✅ Job posted successfully!');
      }
      
      setMessage({
        type: 'success',
        text: '🎉 Referral job posted successfully! Redirecting to marketplace...'
      });

      // Clear form
      setJobTitle('');
      setJobDescription('');
      setRequirements('');
      setSkills('');
      setLocation('');
      setSalaryMin('');
      setSalaryMax('');
      setExternalLink('');

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/referral/marketplace');
      }, 2000);

    } catch (error: any) {
      console.error('Error posting job:', error);
      setMessage({
        type: 'error',
        text: `Error: ${error.message || 'Failed to post job. Please try again.'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Required</h2>
            <p className="text-gray-600 mb-6">
              You need to be a verified employee to post referral jobs.
            </p>
            
            {/* DEBUG SECTION - Shows current user info */}
            {DEBUG_MODE && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold text-yellow-800 mb-2">🛠️ Debug Information</h4>
                <p className="text-sm text-yellow-700">
                  <strong>Current User ID:</strong> {user.uid}<br/>
                  <strong>Current Email:</strong> {user.email}<br/>
                  <strong>Firestore Document:</strong> users/{user.uid}<br/>
                  <br/>
                  <button 
                    onClick={() => {
                      console.log('Manual verification check triggered');
                      checkUserVerification();
                      window.location.reload();
                    }} 
                    className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm"
                  >
                    Re-check Verification
                  </button>
                  <button 
                    onClick={() => router.push('/referral/verify')} 
                    className="mt-2 ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                  >
                    Go Verify Again
                  </button>
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <button
                onClick={() => router.push('/referral/verify')}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition"
              >
                Get Verified as Employee →
              </button>
              
              <button
                onClick={() => router.push('/referral/marketplace')}
                className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition"
              >
                Browse Referral Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/referral" className="inline-block mb-6">
            <button className="text-orange-600 hover:text-orange-800 font-medium flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Referral Hub
            </button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Post a Referral Job
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Share job openings from your company and help candidates get direct access to employees.
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-8 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {/* Success Banner - Shows when verified */}
        <div className="mb-8 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white text-green-600 rounded-full w-10 h-10 flex items-center justify-center mr-4">
                ✓
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">🎉 Verified Employee!</h3>
                <p className="text-green-100">
                  You can now post referral jobs and earn bonuses. Post your first job below!
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <span className="bg-white text-green-600 font-bold py-2 px-4 rounded-lg">
                Status: VERIFIED
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Form - Takes 2/3 width on large screens */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Details</h2>
                <p className="text-gray-600">Fill in the job information below</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        placeholder="e.g., Senior Software Engineer"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        placeholder="e.g., Google, Microsoft, Amazon"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Type *
                      </label>
                      <select
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience Level
                      </label>
                      <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      >
                        <option value="entry">Entry Level</option>
                        <option value="mid">Mid Level</option>
                        <option value="senior">Senior</option>
                        <option value="executive">Executive</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Remote Policy
                      </label>
                      <select
                        value={remotePolicy}
                        onChange={(e) => setRemotePolicy(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      >
                        <option value="onsite">On-site</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      placeholder="e.g., Bengaluru, Karnataka or Remote"
                      required
                    />
                  </div>
                </div>

                {/* Description & Requirements */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Job Description & Requirements</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description *
                    </label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition h-40"
                      placeholder="Describe the role, responsibilities, and impact..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Requirements (one per line)
                      </label>
                      <textarea
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition h-40"
                        placeholder="• 3+ years experience in React\n• Bachelor's degree in CS\n• Strong communication skills"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skills (comma separated)
                      </label>
                      <textarea
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition h-40"
                        placeholder="React, TypeScript, Node.js, AWS, Agile"
                      />
                    </div>
                  </div>
                </div>

                {/* Salary & Category */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Salary & Category</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salary Range (Optional)
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={salaryMin}
                          onChange={(e) => setSalaryMin(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                          placeholder="Min"
                        />
                        <input
                          type="number"
                          value={salaryMax}
                          onChange={(e) => setSalaryMax(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salary Unit
                      </label>
                      <select
                        value={salaryUnit}
                        onChange={(e) => setSalaryUnit(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      >
                        <option value="monthly">Per Month</option>
                        <option value="yearly">Per Year</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      >
                        <option value="technology">Technology</option>
                        <option value="business">Business</option>
                        <option value="marketing">Marketing</option>
                        <option value="design">Design</option>
                        <option value="sales">Sales</option>
                        <option value="finance">Finance</option>
                        <option value="hr">Human Resources</option>
                        <option value="operations">Operations</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Application Deadline
                      </label>
                      <input
                        type="date"
                        value={applicationDeadline}
                        onChange={(e) => setApplicationDeadline(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      />
                      <p className="mt-2 text-sm text-gray-500">Leave empty for 30 days from now</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        External Application Link (Optional)
                      </label>
                      <input
                        type="url"
                        value={externalLink}
                        onChange={(e) => setExternalLink(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        placeholder="https://company.com/careers/job-id"
                      />
                      <p className="mt-2 text-sm text-gray-500">If candidates should apply on your company site</p>
                    </div>
                  </div>

                  {/* Hidden Bonus Amount Selection - For employee's reference only */}
                  <div className="border-t pt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Referral Bonus (For Your Records)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { value: '15000', label: '₹15,000', desc: 'Standard' },
                        { value: '25000', label: '₹25,000', desc: 'Premium' },
                        { value: '50000', label: '₹50,000+', desc: 'Executive' },
                      ].map((option) => (
                        <div
                          key={option.value}
                          className={`border-2 rounded-xl p-4 cursor-pointer transition ${bonusAmount === option.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}
                          onClick={() => setBonusAmount(option.value)}
                        >
                          <div className="text-lg font-semibold text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                          {bonusAmount === option.value && (
                            <div className="mt-2 text-xs text-orange-600 font-medium">✓ Selected</div>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      This bonus amount is for your reference only and won't be shown to job seekers.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-6 rounded-xl hover:from-orange-600 hover:to-orange-700 transition text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mr-3"></div>
                        Posting Job...
                      </span>
                    ) : (
                      'Post Referral Job →'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar - Takes 1/3 width on large screens */}
          <div className="lg:w-1/3">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">📊 Your Referral Stats</h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b">
                  <div>
                    <div className="text-sm text-gray-500">Verified Status</div>
                    <div className="flex items-center mt-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="font-semibold text-green-600">Verified Employee</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Company</div>
                    <div className="font-semibold text-gray-900">{companyName || 'Not specified'}</div>
                  </div>
                </div>
                
                <div className="text-center py-4">
                  <div className="text-sm text-gray-500 mb-1">Free Posts Remaining</div>
                  <div className="font-bold text-orange-600 text-4xl">∞</div>
                  <p className="text-sm text-gray-500 mt-2">Free for 3 months!</p>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      ₹
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Selected Bonus</div>
                      <div className="font-bold text-gray-900 text-lg">₹{parseInt(bonusAmount).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Tips for Success</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    1
                  </div>
                  <span className="text-gray-700">Be specific about requirements to attract qualified candidates</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    2
                  </div>
                  <span className="text-gray-700">Mention if you can provide interview tips or referrals</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    3
                  </div>
                  <span className="text-gray-700">Respond quickly to candidate messages (within 24 hours)</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    4
                  </div>
                  <span className="text-gray-700">Share insights about your company culture</span>
                </li>
              </ul>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🔄 How Referral Works</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Post Job</h4>
                    <p className="text-sm text-gray-600">Fill this form with job details</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Candidates Message You</h4>
                    <p className="text-sm text-gray-600">Job seekers contact you directly via chat</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Refer & Earn</h4>
                    <p className="text-sm text-gray-600">Get bonus when candidate is hired through your referral</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link href="/referral/marketplace">
                  <button className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                    Browse All Referral Jobs
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}