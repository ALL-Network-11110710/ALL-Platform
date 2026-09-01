// 'use client';

// import { useState, useEffect } from 'react';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import Link from 'next/link';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';

// interface Job {
//   id: string;
//   title: string;
//   jobTitle?: string;
//   company: string;
//   companyName?: string;
//   location: string;
//   type: string;
//   jobType?: string;
//   salary: string;
//   description: string;
//   requirements: string | string[];
//   postedAt: any;
//   jobLink?: string; // Added for external jobs
//   isExternal?: boolean; // Added for external jobs
// }

// // Define the types of filters we will have
// type JobTypeFilter = 'All' | 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

// // Jobs Content Component
// function JobsContent() {
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   // Step 1: Add state for the job type filter. Default is 'All'
//   const [jobTypeFilter, setJobTypeFilter] = useState<JobTypeFilter>('All');

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, 'jobs'));
//         const jobsData: Job[] = [];
        
//         querySnapshot.forEach((doc) => {
//           jobsData.push({
//             id: doc.id,
//             ...doc.data(),
//           } as Job);
//         });
        
//         setJobs(jobsData);
//       } catch (error) {
//         console.error('Error fetching jobs:', error);
//         throw new Error('Failed to load jobs from database');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   // Helper function to get job title with fallback
//   const getJobTitle = (job: Job) => {
//     return job.jobTitle || job.title || 'Untitled Position';
//   };

//   // Helper function to get company name with fallback
//   const getCompanyName = (job: Job) => {
//     return job.companyName || job.company || 'Unknown Company';
//   };

//   // Helper function to get job type with fallback
//   const getJobType = (job: Job) => {
//     return job.jobType || job.type || 'Not specified';
//   };

//   // Check if a job is external
//   const isExternalJob = (job: Job) => {
//     return job.jobLink && job.jobLink.trim() !== '' || job.isExternal;
//   };

//   // Step 2: Update the filtering function to also use the jobTypeFilter
//   const filteredJobs = jobs.filter(job => {
//     const term = searchTerm.toLowerCase();
    
//     // Safely check each field for the search term.
//     const title = getJobTitle(job).toLowerCase();
//     const company = getCompanyName(job).toLowerCase();
//     const location = job.location ? job.location.toLowerCase() : '';
//     const type = getJobType(job).toLowerCase();
//     const description = job.description ? job.description.toLowerCase() : '';

//     // Check if the job matches the search term
//     const matchesSearch = (
//       title.includes(term) ||
//       company.includes(term) ||
//       location.includes(term) ||
//       type.includes(term) ||
//       description.includes(term)
//     );

//     // Check if the job matches the job type filter
//     // If the filter is 'All', we always show the job (true).
//     // Otherwise, we check if the job's type matches the selected filter.
//     const matchesJobType = jobTypeFilter === 'All' || getJobType(job) === jobTypeFilter;

//     // A job must match BOTH the search term AND the job type filter to be shown
//     return matchesSearch && matchesJobType;
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
//           <p className="mt-4 text-black">Loading jobs...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-orange-200">
//           <h1 className="text-3xl font-bold text-black mb-2">Job Listings</h1>
//           <p className="text-black">Find your next opportunity on ALL Platform</p>
//         </div>
        
//         {/* Search Input Bar */}
//         <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-orange-200">
//           <input
//             type="text"
//             placeholder="Search for jobs, companies, locations, or keywords..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full p-4 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
//           />
//         </div>

//         {/* Job Type Filter Buttons */}
//         <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-orange-200">
//           <h2 className="text-lg font-medium text-black mb-4">Filter by Job Type</h2>
//           <div className="flex flex-wrap gap-2">
//             {(['All', 'Full-time', 'Part-time', 'Contract', 'Internship'] as JobTypeFilter[]).map((type) => (
//               <button
//                 key={type}
//                 className={`px-4 py-2 rounded-xl border ${
//                   jobTypeFilter === type 
//                     ? 'bg-orange-500 text-white border-orange-500' // Active style
//                     : 'bg-white text-black border-orange-300 hover:bg-orange-100' // Inactive style
//                 } transition-all duration-200`}
//                 onClick={() => setJobTypeFilter(type)} // Set the filter when clicked
//               >
//                 {type}
//               </button>
//             ))}
//           </div>
//         </div>
        
//         {/* Show the active filters */}
//         {(searchTerm || jobTypeFilter !== 'All') && (
//           <div className="bg-orange-100 rounded-xl p-4 mb-6 border border-orange-200">
//             <p className="text-black">
//               Showing results for: 
//               {searchTerm && <span> search "<strong>{searchTerm}</strong>"</span>}
//               {searchTerm && jobTypeFilter !== 'All' && <span> and </span>}
//               {jobTypeFilter !== 'All' && <span> job type "<strong>{jobTypeFilter}</strong>"</span>}
//             </p>
//           </div>
//         )}
        
//         {filteredJobs.length === 0 ? (
//           <div className="bg-orange-100 rounded-2xl p-8 text-center border border-orange-200">
//             <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-2xl">🔍</span>
//             </div>
//             <p className="text-black text-lg mb-2">
//               {searchTerm || jobTypeFilter !== 'All' 
//                 ? `No jobs match your filters` 
//                 : 'No jobs available yet'
//               }
//             </p>
//             <p className="text-black mb-4">
//               {searchTerm || jobTypeFilter !== 'All' 
//                 ? 'Try adjusting your search criteria' 
//                 : 'Check back later or post a job!'
//               }
//             </p>
//             {(searchTerm || jobTypeFilter !== 'All') && (
//               <button
//                 onClick={() => {
//                   setSearchTerm('');
//                   setJobTypeFilter('All');
//                 }}
//                 className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200"
//               >
//                 Clear Filters
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="grid gap-6">
//             {filteredJobs.map((job) => {
//               const isExternal = isExternalJob(job);
              
//               return (
//                 <div key={job.id} className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//                   <div className="flex justify-between items-start mb-4">
//                     <div>
//                       <h2 className="text-xl font-semibold text-black mb-2">
//                         {getJobTitle(job)}
//                         {isExternal && (
//                           <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                             External
//                           </span>
//                         )}
//                       </h2>
//                       <div className="flex flex-wrap gap-2 mb-2">
//                         <span className="bg-orange-100 text-black px-3 py-1 rounded-full text-sm">{getCompanyName(job)}</span>
//                         <span className="bg-orange-100 text-black px-3 py-1 rounded-full text-sm">{job.location}</span>
//                         <span className="bg-orange-100 text-black px-3 py-1 rounded-full text-sm">{getJobType(job)}</span>
//                       </div>
//                     </div>
//                     {job.salary && (
//                       <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                         {job.salary}
//                       </span>
//                     )}
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
//                       <h3 className="font-medium text-black mb-2">Description</h3>
//                       <p className="text-black text-sm">{job.description}</p>
//                     </div>
                    
//                     <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
//                       <h3 className="font-medium text-black mb-2">Requirements</h3>
//                       <ul className="text-black text-sm list-disc list-inside">
//                         {Array.isArray(job.requirements) ? (
//                           <>
//                             {job.requirements.slice(0, 3).map((req, index) => (
//                               <li key={index}>{req}</li>
//                             ))}
//                             {job.requirements.length > 3 && <li>...and more</li>}
//                           </>
//                         ) : (
//                           <li>{job.requirements || 'Not specified'}</li>
//                         )}
//                       </ul>
//                     </div>
//                   </div>
                  
//                   <div className="flex justify-between items-center">
//                     <p className="text-black text-sm">
//                       Posted: {job.postedAt?.toDate ? job.postedAt.toDate().toLocaleDateString() : 'Recently'}
//                     </p>
//                     <Link 
//                       href={`/jobs/${job.id}`}
//                       className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200"
//                     >
//                       View Details
//                     </Link>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Main Jobs Page Component with Error Boundary
// export default function JobsPage() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Jobs page failed to load">
//       <JobsContent />
//     </ClientErrorBoundary>
//   );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import Link from 'next/link';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';

// interface Job {
//   id: string;
//   title: string;
//   jobTitle?: string;
//   company: string;
//   companyName?: string;
//   location: string;
//   type: string;
//   jobType?: string;
//   salary: string;
//   description: string;
//   requirements: string | string[];
//   postedAt: any;
//   jobLink?: string; // Added for external jobs
//   isExternal?: boolean; // Added for external jobs
//   source?: string; // Added for tracking job source
// }

// // Define the types of filters we will have
// type JobTypeFilter = 'All' | 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

// // Jobs Content Component
// function JobsContent() {
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   // Step 1: Add state for the job type filter. Default is 'All'
//   const [jobTypeFilter, setJobTypeFilter] = useState<JobTypeFilter>('All');

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, 'jobs'));
//         const jobsData: Job[] = [];
        
//         querySnapshot.forEach((doc) => {
//           const jobData = doc.data();
//           jobsData.push({
//             id: doc.id,
//             ...jobData,
//           } as Job);
//         });
        
//         console.log(`Fetched ${jobsData.length} jobs from Firestore`);
//         setJobs(jobsData);
//       } catch (error) {
//         console.error('Error fetching jobs:', error);
//         throw new Error('Failed to load jobs from database');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   // Helper function to get job title with fallback
//   const getJobTitle = (job: Job) => {
//     return job.jobTitle || job.title || 'Untitled Position';
//   };

//   // Helper function to get company name with fallback
//   const getCompanyName = (job: Job) => {
//     return job.companyName || job.company || 'Unknown Company';
//   };

//   // Helper function to get job type with fallback
//   const getJobType = (job: Job) => {
//     const jobType = job.jobType || job.type || 'Not specified';
//     // Normalize job type for consistent filtering
//     if (jobType.toLowerCase().includes('full')) return 'Full-time';
//     if (jobType.toLowerCase().includes('part')) return 'Part-time';
//     if (jobType.toLowerCase().includes('contract')) return 'Contract';
//     if (jobType.toLowerCase().includes('intern')) return 'Internship';
//     return jobType;
//   };

//   // Check if a job is external
//   const isExternalJob = (job: Job) => {
//     return (job.jobLink && job.jobLink.trim() !== '' && job.jobLink !== '#') || job.isExternal;
//   };

//   // Get external job link
//   const getJobLink = (job: Job) => {
//     if (job.jobLink && job.jobLink.trim() !== '' && job.jobLink !== '#') {
//       return job.jobLink;
//     }
//     return `/jobs/${job.id}`;
//   };

//   // Check if job is from Adzuna
//   const isAdzunaJob = (job: Job) => {
//     return job.source === 'adzuna';
//   };

//   // Step 2: Update the filtering function to also use the jobTypeFilter
//   const filteredJobs = jobs.filter(job => {
//     const term = searchTerm.toLowerCase();
    
//     // Safely check each field for the search term.
//     const title = getJobTitle(job).toLowerCase();
//     const company = getCompanyName(job).toLowerCase();
//     const location = job.location ? job.location.toLowerCase() : '';
//     const type = getJobType(job).toLowerCase();
//     const description = job.description ? job.description.toLowerCase() : '';

//     // Check if the job matches the search term
//     const matchesSearch = (
//       title.includes(term) ||
//       company.includes(term) ||
//       location.includes(term) ||
//       type.includes(term) ||
//       description.includes(term)
//     );

//     // Check if the job matches the job type filter
//     // If the filter is 'All', we always show the job (true).
//     // Otherwise, we check if the job's type matches the selected filter.
//     const matchesJobType = jobTypeFilter === 'All' || getJobType(job) === jobTypeFilter;

//     // A job must match BOTH the search term AND the job type filter to be shown
//     return matchesSearch && matchesJobType;
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
//           <p className="mt-4 text-black">Loading jobs...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-orange-200">
//           <h1 className="text-3xl font-bold text-black mb-2">Job Listings</h1>
//           <p className="text-black">Find your next opportunity on ALL Platform</p>
//           <p className="text-black text-sm mt-2">
//             Showing {filteredJobs.length} of {jobs.length} total jobs
//             {jobs.some(job => isAdzunaJob(job)) && ` (including ${jobs.filter(job => isAdzunaJob(job)).length} from Adzuna)`}
//           </p>
//         </div>
        
//         {/* Search Input Bar */}
//         <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-orange-200">
//           <input
//             type="text"
//             placeholder="Search for jobs, companies, locations, or keywords..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full p-4 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
//           />
//         </div>

//         {/* Job Type Filter Buttons */}
//         <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-orange-200">
//           <h2 className="text-lg font-medium text-black mb-4">Filter by Job Type</h2>
//           <div className="flex flex-wrap gap-2">
//             {(['All', 'Full-time', 'Part-time', 'Contract', 'Internship'] as JobTypeFilter[]).map((type) => (
//               <button
//                 key={type}
//                 className={`px-4 py-2 rounded-xl border ${
//                   jobTypeFilter === type 
//                     ? 'bg-orange-500 text-white border-orange-500' // Active style
//                     : 'bg-white text-black border-orange-300 hover:bg-orange-100' // Inactive style
//                 } transition-all duration-200`}
//                 onClick={() => setJobTypeFilter(type)} // Set the filter when clicked
//               >
//                 {type}
//               </button>
//             ))}
//           </div>
//         </div>
        
//         {/* Show the active filters */}
//         {(searchTerm || jobTypeFilter !== 'All') && (
//           <div className="bg-orange-100 rounded-xl p-4 mb-6 border border-orange-200">
//             <p className="text-black">
//               Showing results for: 
//               {searchTerm && <span> search "<strong>{searchTerm}</strong>"</span>}
//               {searchTerm && jobTypeFilter !== 'All' && <span> and </span>}
//               {jobTypeFilter !== 'All' && <span> job type "<strong>{jobTypeFilter}</strong>"</span>}
//               <span> - {filteredJobs.length} jobs found</span>
//             </p>
//           </div>
//         )}
        
//         {filteredJobs.length === 0 ? (
//           <div className="bg-orange-100 rounded-2xl p-8 text-center border border-orange-200">
//             <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-2xl">🔍</span>
//             </div>
//             <p className="text-black text-lg mb-2">
//               {searchTerm || jobTypeFilter !== 'All' 
//                 ? `No jobs match your filters` 
//                 : 'No jobs available yet'
//               }
//             </p>
//             <p className="text-black mb-4">
//               {searchTerm || jobTypeFilter !== 'All' 
//                 ? 'Try adjusting your search criteria' 
//                 : 'Check back later or post a job!'
//               }
//             </p>
//             {(searchTerm || jobTypeFilter !== 'All') && (
//               <button
//                 onClick={() => {
//                   setSearchTerm('');
//                   setJobTypeFilter('All');
//                 }}
//                 className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200"
//               >
//                 Clear Filters
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="grid gap-6">
//             {filteredJobs.map((job) => {
//               const isExternal = isExternalJob(job);
//               const isAdzuna = isAdzunaJob(job);
//               const jobLink = getJobLink(job);
              
//               return (
//                 <div key={job.id} className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
//                   <div className="flex justify-between items-start mb-4">
//                     <div>
//                       <h2 className="text-xl font-semibold text-black mb-2">
//                         {getJobTitle(job)}
//                         <div className="flex flex-wrap gap-1 mt-1">
//                           {isExternal && (
//                             <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                               External
//                             </span>
//                           )}
//                           {isAdzuna && (
//                             <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                               Adzuna
//                             </span>
//                           )}
//                           {job.source && job.source !== 'adzuna' && (
//                             <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                               {job.source}
//                             </span>
//                           )}
//                         </div>
//                       </h2>
//                       <div className="flex flex-wrap gap-2 mb-2">
//                         <span className="bg-orange-100 text-black px-3 py-1 rounded-full text-sm">{getCompanyName(job)}</span>
//                         <span className="bg-orange-100 text-black px-3 py-1 rounded-full text-sm">{job.location}</span>
//                         <span className="bg-orange-100 text-black px-3 py-1 rounded-full text-sm">{getJobType(job)}</span>
//                       </div>
//                     </div>
//                     {job.salary && job.salary !== 'Not specified' && (
//                       <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                         {job.salary}
//                       </span>
//                     )}
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
//                       <h3 className="font-medium text-black mb-2">Description</h3>
//                       <p className="text-black text-sm">{job.description}</p>
//                     </div>
                    
//                     <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
//                       <h3 className="font-medium text-black mb-2">Requirements</h3>
//                       <ul className="text-black text-sm list-disc list-inside">
//                         {Array.isArray(job.requirements) ? (
//                           <>
//                             {job.requirements.slice(0, 3).map((req, index) => (
//                               <li key={index}>{req}</li>
//                             ))}
//                             {job.requirements.length > 3 && <li>...and more</li>}
//                           </>
//                         ) : (
//                           <li>{job.requirements || 'Not specified'}</li>
//                         )}
//                       </ul>
//                     </div>
//                   </div>
                  
//                   <div className="flex justify-between items-center">
//                     <p className="text-black text-sm">
//                       Posted: {job.postedAt?.toDate ? job.postedAt.toDate().toLocaleDateString() : 'Recently'}
//                     </p>
//                     {isExternal ? (
//                       <a 
//                         href={jobLink}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200"
//                       >
//                         Apply on Company Site
//                       </a>
//                     ) : (
//                       <Link 
//                         href={jobLink}
//                         className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200"
//                       >
//                         View Details
//                       </Link>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Main Jobs Page Component with Error Boundary
// export default function JobsPage() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Jobs page failed to load">
//       <JobsContent />
//     </ClientErrorBoundary>
//   );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import Link from 'next/link';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';

// interface Job {
//   id: string;
//   title: string;
//   jobTitle?: string;
//   company: string;
//   companyName?: string;
//   location: string;
//   type: string;
//   jobType?: string;
//   salary: string;
//   description: string;
//   requirements: string | string[];
//   postedAt: any;
//   jobLink?: string;
//   isExternal?: boolean;
//   source?: string;
//   experience?: string;
//   education?: string;
//   remote?: boolean;
// }

// // Define filter types
// type JobTypeFilter = 'All' | 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
// type ExperienceFilter = 'All' | 'Entry' | 'Mid' | 'Senior' | 'Executive';
// type EducationFilter = 'All' | 'High School' | 'Bachelor\'s' | 'Master\'s' | 'PhD';
// type DatePostedFilter = 'All' | '24h' | '3d' | '1w' | '1m';

// interface AdvancedFilters {
//   jobType: JobTypeFilter;
//   experience: ExperienceFilter;
//   education: EducationFilter;
//   datePosted: DatePostedFilter;
//   salaryMin: string;
//   salaryMax: string;
//   remoteOnly: boolean;
//   hasSalary: boolean;
// }

// // Jobs Content Component
// function JobsContent() {
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
//   const [savedSearches, setSavedSearches] = useState<string[]>([]);
//   const [recentSearches, setRecentSearches] = useState<string[]>([]);

//   // Advanced filters state
//   const [filters, setFilters] = useState<AdvancedFilters>({
//     jobType: 'All',
//     experience: 'All',
//     education: 'All',
//     datePosted: 'All',
//     salaryMin: '',
//     salaryMax: '',
//     remoteOnly: false,
//     hasSalary: false
//   });

//   // Load saved and recent searches from localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem('jobSavedSearches');
//     const recent = localStorage.getItem('jobRecentSearches');
    
//     if (saved) setSavedSearches(JSON.parse(saved));
//     if (recent) setRecentSearches(JSON.parse(recent));
//   }, []);

//   // Save recent searches to localStorage
//   useEffect(() => {
//     if (recentSearches.length > 0) {
//       localStorage.setItem('jobRecentSearches', JSON.stringify(recentSearches));
//     }
//   }, [recentSearches]);

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, 'jobs'));
//         const jobsData: Job[] = [];
        
//         querySnapshot.forEach((doc) => {
//           const jobData = doc.data();
//           jobsData.push({
//             id: doc.id,
//             ...jobData,
//           } as Job);
//         });
        
//         console.log(`Fetched ${jobsData.length} jobs from Firestore`);
//         setJobs(jobsData);
//       } catch (error) {
//         console.error('Error fetching jobs:', error);
//         throw new Error('Failed to load jobs from database');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   // Helper functions
//   const getJobTitle = (job: Job) => {
//     return job.jobTitle || job.title || 'Untitled Position';
//   };

//   const getCompanyName = (job: Job) => {
//     return job.companyName || job.company || 'Unknown Company';
//   };

//   const getJobType = (job: Job) => {
//     const jobType = job.jobType || job.type || 'Not specified';
//     if (jobType.toLowerCase().includes('full')) return 'Full-time';
//     if (jobType.toLowerCase().includes('part')) return 'Part-time';
//     if (jobType.toLowerCase().includes('contract')) return 'Contract';
//     if (jobType.toLowerCase().includes('intern')) return 'Internship';
//     if (jobType.toLowerCase().includes('remote')) return 'Remote';
//     return jobType;
//   };

//   const isExternalJob = (job: Job) => {
//     return (job.jobLink && job.jobLink.trim() !== '' && job.jobLink !== '#') || job.isExternal;
//   };

//   const getJobLink = (job: Job) => {
//     if (job.jobLink && job.jobLink.trim() !== '' && job.jobLink !== '#') {
//       return job.jobLink;
//     }
//     return `/jobs/${job.id}`;
//   };

//   const isAdzunaJob = (job: Job) => {
//     return job.source === 'adzuna';
//   };

//   // Extract salary number for filtering
//   const getSalaryNumber = (salary: string): number => {
//     if (!salary || salary === 'Not specified') return 0;
    
//     // Extract first number from salary string (e.g., "$50,000 - $70,000" -> 50000)
//     const match = salary.match(/\$?(\d+,?\d*)/);
//     if (match) {
//       return parseInt(match[1].replace(/,/g, ''), 10);
//     }
//     return 0;
//   };

//   // Check if job is remote
//   const isRemoteJob = (job: Job): boolean => {
//     const location = job.location?.toLowerCase() || '';
//     const jobType = getJobType(job).toLowerCase();
//     return location.includes('remote') || jobType.includes('remote') || job.remote === true;
//   };

//   // Get job posting date for filtering
//   const getJobDate = (job: Job): Date => {
//     if (job.postedAt?.toDate) {
//       return job.postedAt.toDate();
//     }
//     return new Date(); // Fallback to current date
//   };

//   // Check if job matches date filter
//   const matchesDateFilter = (job: Job): boolean => {
//     if (filters.datePosted === 'All') return true;
    
//     const jobDate = getJobDate(job);
//     const now = new Date();
//     const diffTime = now.getTime() - jobDate.getTime();
//     const diffDays = diffTime / (1000 * 60 * 60 * 24);

//     switch (filters.datePosted) {
//       case '24h': return diffDays <= 1;
//       case '3d': return diffDays <= 3;
//       case '1w': return diffDays <= 7;
//       case '1m': return diffDays <= 30;
//       default: return true;
//     }
//   };

//   // Check if job matches salary filter
//   const matchesSalaryFilter = (job: Job): boolean => {
//     if (!filters.salaryMin && !filters.salaryMax && !filters.hasSalary) return true;
    
//     const salary = getSalaryNumber(job.salary);
//     if (salary === 0 && filters.hasSalary) return false;
    
//     const min = filters.salaryMin ? parseInt(filters.salaryMin) : 0;
//     const max = filters.salaryMax ? parseInt(filters.salaryMax) : Infinity;
    
//     return salary >= min && salary <= max;
//   };

//   // Check if job matches experience filter
//   const matchesExperienceFilter = (job: Job): boolean => {
//     if (filters.experience === 'All') return true;
    
//     const jobExp = job.experience?.toLowerCase() || '';
//     const filterExp = filters.experience.toLowerCase();
    
//     return jobExp.includes(filterExp) || 
//            (filterExp === 'entry' && (jobExp.includes('junior') || jobExp.includes('fresher'))) ||
//            (filterExp === 'senior' && jobExp.includes('lead'));
//   };

//   // Enhanced filtering function
//   const filteredJobs = jobs.filter(job => {
//     const term = searchTerm.toLowerCase();
    
//     // Search across multiple fields
//     const title = getJobTitle(job).toLowerCase();
//     const company = getCompanyName(job).toLowerCase();
//     const location = job.location ? job.location.toLowerCase() : '';
//     const type = getJobType(job).toLowerCase();
//     const description = job.description ? job.description.toLowerCase() : '';
//     const requirements = Array.isArray(job.requirements) 
//       ? job.requirements.join(' ').toLowerCase()
//       : (job.requirements || '').toLowerCase();

//     const matchesSearch = (
//       title.includes(term) ||
//       company.includes(term) ||
//       location.includes(term) ||
//       type.includes(term) ||
//       description.includes(term) ||
//       requirements.includes(term)
//     );

//     const matchesJobType = filters.jobType === 'All' || getJobType(job) === filters.jobType;
//     const matchesRemote = !filters.remoteOnly || isRemoteJob(job);
//     const matchesDate = matchesDateFilter(job);
//     const matchesSalary = matchesSalaryFilter(job);
//     const matchesExperience = matchesExperienceFilter(job);
//     const matchesEducation = filters.education === 'All' || 
//       (job.education && job.education.toLowerCase().includes(filters.education.toLowerCase()));

//     return matchesSearch && matchesJobType && matchesRemote && matchesDate && 
//            matchesSalary && matchesExperience && matchesEducation;
//   });

//   // Handle search with recent search tracking
//   const handleSearch = (term: string) => {
//     setSearchTerm(term);
    
//     if (term.trim() && !recentSearches.includes(term)) {
//       const updatedRecent = [term, ...recentSearches.slice(0, 4)]; // Keep last 5 searches
//       setRecentSearches(updatedRecent);
//     }
//   };

//   // Save current search
//   const saveCurrentSearch = () => {
//     if (searchTerm.trim() && !savedSearches.includes(searchTerm)) {
//       const updatedSaved = [searchTerm, ...savedSearches];
//       setSavedSearches(updatedSaved);
//       localStorage.setItem('jobSavedSearches', JSON.stringify(updatedSaved));
//     }
//   };

//   // Clear all filters
//   const clearAllFilters = () => {
//     setSearchTerm('');
//     setFilters({
//       jobType: 'All',
//       experience: 'All',
//       education: 'All',
//       datePosted: 'All',
//       salaryMin: '',
//       salaryMax: '',
//       remoteOnly: false,
//       hasSalary: false
//     });
//   };

//   // Count active filters
//   const activeFilterCount = Object.values(filters).filter(value => 
//     value !== 'All' && value !== '' && value !== false
//   ).length + (searchTerm ? 1 : 0);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
//           <p className="mt-4 text-black">Loading jobs...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-orange-200">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//             <div className="mb-4 md:mb-0">
//               <h1 className="text-3xl font-bold text-black mb-2">Find Your Dream Job</h1>
//               <p className="text-black">Discover opportunities that match your skills and preferences</p>
//             </div>
//             <div className="text-sm text-gray-600">
//               <p>{filteredJobs.length} of {jobs.length} jobs match your criteria</p>
//               {jobs.some(job => isAdzunaJob(job)) && (
//                 <p>Including {jobs.filter(job => isAdzunaJob(job)).length} opportunities from Adzuna</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Search and Quick Actions */}
//         <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-orange-200">
//           <div className="flex flex-col md:flex-row gap-4 mb-4">
//             {/* Search Input */}
//             <div className="flex-1 relative">
//               <input
//                 type="text"
//                 placeholder="Search for jobs, companies, locations, skills, or keywords..."
//                 value={searchTerm}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="w-full p-4 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black pr-12"
//               />
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm('')}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>

//             {/* Quick Action Buttons */}
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
//                 className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 flex items-center gap-2"
//               >
//                 <span>🔧</span>
//                 Advanced Filters
//                 {activeFilterCount > 0 && (
//                   <span className="bg-white text-orange-500 text-xs px-2 py-1 rounded-full">
//                     {activeFilterCount}
//                   </span>
//                 )}
//               </button>
              
//               {searchTerm && (
//                 <button
//                   onClick={saveCurrentSearch}
//                   className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 flex items-center gap-2"
//                 >
//                   <span>💾</span>
//                   Save Search
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Recent & Saved Searches */}
//           {(recentSearches.length > 0 || savedSearches.length > 0) && (
//             <div className="flex flex-wrap gap-2">
//               {recentSearches.length > 0 && (
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm text-gray-600">Recent:</span>
//                   {recentSearches.slice(0, 3).map((search, index) => (
//                     <button
//                       key={index}
//                       onClick={() => handleSearch(search)}
//                       className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
//                     >
//                       {search}
//                     </button>
//                   ))}
//                 </div>
//               )}
              
//               {savedSearches.length > 0 && (
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm text-gray-600">Saved:</span>
//                   {savedSearches.slice(0, 3).map((search, index) => (
//                     <button
//                       key={index}
//                       onClick={() => handleSearch(search)}
//                       className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full hover:bg-orange-200 transition-colors flex items-center gap-1"
//                     >
//                       {search}
//                       <span>⭐</span>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Advanced Filters Panel */}
//         {showAdvancedFilters && (
//           <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-orange-200">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-black">Advanced Filters</h2>
//               <button
//                 onClick={clearAllFilters}
//                 className="text-sm text-orange-600 hover:text-orange-700"
//               >
//                 Clear All Filters
//               </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {/* Job Type Filter */}
//               <div>
//                 <label className="block text-sm font-medium text-black mb-2">Job Type</label>
//                 <select
//                   value={filters.jobType}
//                   onChange={(e) => setFilters({...filters, jobType: e.target.value as JobTypeFilter})}
//                   className="w-full p-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
//                 >
//                   <option value="All">All Job Types</option>
//                   <option value="Full-time">Full-time</option>
//                   <option value="Part-time">Part-time</option>
//                   <option value="Contract">Contract</option>
//                   <option value="Internship">Internship</option>
//                   <option value="Remote">Remote</option>
//                 </select>
//               </div>

//               {/* Experience Level */}
//               <div>
//                 <label className="block text-sm font-medium text-black mb-2">Experience</label>
//                 <select
//                   value={filters.experience}
//                   onChange={(e) => setFilters({...filters, experience: e.target.value as ExperienceFilter})}
//                   className="w-full p-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
//                 >
//                   <option value="All">All Experience Levels</option>
//                   <option value="Entry">Entry Level</option>
//                   <option value="Mid">Mid Level</option>
//                   <option value="Senior">Senior Level</option>
//                   <option value="Executive">Executive</option>
//                 </select>
//               </div>

//               {/* Education */}
//               <div>
//                 <label className="block text-sm font-medium text-black mb-2">Education</label>
//                 <select
//                   value={filters.education}
//                   onChange={(e) => setFilters({...filters, education: e.target.value as EducationFilter})}
//                   className="w-full p-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
//                 >
//                   <option value="All">All Education Levels</option>
//                   <option value="High School">High School</option>
//                   <option value="Bachelor's">Bachelor's Degree</option>
//                   <option value="Master's">Master's Degree</option>
//                   <option value="PhD">PhD</option>
//                 </select>
//               </div>

//               {/* Date Posted */}
//               <div>
//                 <label className="block text-sm font-medium text-black mb-2">Date Posted</label>
//                 <select
//                   value={filters.datePosted}
//                   onChange={(e) => setFilters({...filters, datePosted: e.target.value as DatePostedFilter})}
//                   className="w-full p-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
//                 >
//                   <option value="All">Any Time</option>
//                   <option value="24h">Last 24 Hours</option>
//                   <option value="3d">Last 3 Days</option>
//                   <option value="1w">Last Week</option>
//                   <option value="1m">Last Month</option>
//                 </select>
//               </div>

//               {/* Salary Range */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-black mb-2">Salary Range (USD)</label>
//                 <div className="flex gap-4">
//                   <input
//                     type="number"
//                     placeholder="Min Salary"
//                     value={filters.salaryMin}
//                     onChange={(e) => setFilters({...filters, salaryMin: e.target.value})}
//                     className="flex-1 p-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
//                   />
//                   <input
//                     type="number"
//                     placeholder="Max Salary"
//                     value={filters.salaryMax}
//                     onChange={(e) => setFilters({...filters, salaryMax: e.target.value})}
//                     className="flex-1 p-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
//                   />
//                 </div>
//               </div>

//               {/* Additional Options */}
//               <div className="md:col-span-2 flex items-center gap-6">
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={filters.remoteOnly}
//                     onChange={(e) => setFilters({...filters, remoteOnly: e.target.checked})}
//                     className="rounded border-orange-300 text-orange-500 focus:ring-orange-500"
//                   />
//                   <span className="text-black">Remote Jobs Only</span>
//                 </label>
                
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={filters.hasSalary}
//                     onChange={(e) => setFilters({...filters, hasSalary: e.target.checked})}
//                     className="rounded border-orange-300 text-orange-500 focus:ring-orange-500"
//                   />
//                   <span className="text-black">Salary Listed</span>
//                 </label>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Active Filters Summary */}
//         {activeFilterCount > 0 && (
//           <div className="bg-orange-100 rounded-xl p-4 mb-6 border border-orange-200">
//             <div className="flex flex-wrap items-center gap-2">
//               <span className="text-black font-medium">Active filters:</span>
              
//               {searchTerm && (
//                 <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
//                   Search: "{searchTerm}"
//                   <button onClick={() => setSearchTerm('')} className="ml-1">✕</button>
//                 </span>
//               )}
              
//               {filters.jobType !== 'All' && (
//                 <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
//                   {filters.jobType}
//                   <button onClick={() => setFilters({...filters, jobType: 'All'})} className="ml-1">✕</button>
//                 </span>
//               )}
              
//               {filters.remoteOnly && (
//                 <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
//                   Remote Only
//                   <button onClick={() => setFilters({...filters, remoteOnly: false})} className="ml-1">✕</button>
//                 </span>
//               )}
              
//               <button
//                 onClick={clearAllFilters}
//                 className="text-orange-600 hover:text-orange-700 text-sm font-medium ml-auto"
//               >
//                 Clear All
//               </button>
//             </div>
//           </div>
//         )}
        
//         {/* Jobs Grid */}
//         {filteredJobs.length === 0 ? (
//           <div className="bg-orange-100 rounded-2xl p-8 text-center border border-orange-200">
//             <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-2xl">🔍</span>
//             </div>
//             <p className="text-black text-lg mb-2">
//               {searchTerm || activeFilterCount > 0 
//                 ? `No jobs match your filters` 
//                 : 'No jobs available yet'
//               }
//             </p>
//             <p className="text-black mb-4">
//               {searchTerm || activeFilterCount > 0 
//                 ? 'Try adjusting your search criteria or clearing some filters' 
//                 : 'Check back later or post a job!'
//               }
//             </p>
//             {(searchTerm || activeFilterCount > 0) && (
//               <button
//                 onClick={clearAllFilters}
//                 className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200"
//               >
//                 Clear All Filters
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="grid gap-6">
//             {filteredJobs.map((job) => {
//               const isExternal = isExternalJob(job);
//               const isAdzuna = isAdzunaJob(job);
//               const jobLink = getJobLink(job);
//               const isRemote = isRemoteJob(job);
//               const salary = getSalaryNumber(job.salary);
              
//               return (
//                 <div key={job.id} className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300">
//                   <div className="flex justify-between items-start mb-4">
//                     <div className="flex-1">
//                       <h2 className="text-xl font-semibold text-black mb-2">
//                         {getJobTitle(job)}
//                       </h2>
//                       <div className="flex flex-wrap gap-1 mb-2">
//                         {isExternal && (
//                           <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                             External
//                           </span>
//                         )}
//                         {isAdzuna && (
//                           <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                             Adzuna
//                           </span>
//                         )}
//                         {isRemote && (
//                           <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                             Remote
//                           </span>
//                         )}
//                         {job.experience && (
//                           <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                             {job.experience}
//                           </span>
//                         )}
//                       </div>
//                       <div className="flex flex-wrap gap-2 mb-2">
//                         <span className="bg-orange-100 text-black px-3 py-1 rounded-full text-sm flex items-center gap-1">
//                           🏢 {getCompanyName(job)}
//                         </span>
//                         <span className="bg-orange-100 text-black px-3 py-1 rounded-full text-sm flex items-center gap-1">
//                           📍 {job.location}
//                         </span>
//                         <span className="bg-orange-100 text-black px-3 py-1 rounded-full text-sm flex items-center gap-1">
//                           ⏱️ {getJobType(job)}
//                         </span>
//                       </div>
//                     </div>
//                     {salary > 0 && (
//                       <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
//                         ${salary.toLocaleString()}
//                       </span>
//                     )}
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
//                       <h3 className="font-medium text-black mb-2">Description</h3>
//                       <p className="text-black text-sm line-clamp-3">{job.description}</p>
//                     </div>
                    
//                     <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
//                       <h3 className="font-medium text-black mb-2">Requirements</h3>
//                       <ul className="text-black text-sm list-disc list-inside">
//                         {Array.isArray(job.requirements) ? (
//                           <>
//                             {job.requirements.slice(0, 3).map((req, index) => (
//                               <li key={index} className="truncate">{req}</li>
//                             ))}
//                             {job.requirements.length > 3 && <li>...and {job.requirements.length - 3} more</li>}
//                           </>
//                         ) : (
//                           <li className="truncate">{job.requirements || 'Not specified'}</li>
//                         )}
//                       </ul>
//                     </div>
//                   </div>
                  
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-4 text-sm text-black">
//                       <span>📅 {getJobDate(job).toLocaleDateString()}</span>
//                       {job.education && (
//                         <span>🎓 {job.education}</span>
//                       )}
//                     </div>
//                     {isExternal ? (
//                       <a 
//                         href={jobLink}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 flex items-center gap-2"
//                       >
//                         <span>🌐</span>
//                         Apply on Company Site
//                       </a>
//                     ) : (
//                       <Link 
//                         href={jobLink}
//                         className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 flex items-center gap-2"
//                       >
//                         <span>👀</span>
//                         View Details & Apply
//                       </Link>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Main Jobs Page Component with Error Boundary
// export default function JobsPage() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Jobs page failed to load">
//       <JobsContent />
//     </ClientErrorBoundary>
//   );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import { collection, getDocs, orderBy, query } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import Link from 'next/link';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';
// import { 
//   Search, MapPin, Briefcase, DollarSign, Clock, Filter, 
//   ExternalLink, Building, X, Globe, CheckCircle2 
// } from 'lucide-react';

// // --- Types ---
// interface Job {
//   id: string;
//   title: string;
//   jobTitle?: string;
//   company: string;
//   companyName?: string;
//   location: string;
//   type: string;
//   jobType?: string;
//   salary: string;
//   description: string;
//   requirements: string | string[];
//   postedAt: any;
//   jobLink?: string;
//   isExternal?: boolean;
//   source?: string;
//   experience?: string;
//   education?: string;
//   remote?: boolean;
// }

// // --- Main Component ---
// function JobsContent() {
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Filter States
//   const [selectedType, setSelectedType] = useState<string>('All');
//   const [selectedExp, setSelectedExp] = useState<string>('All');
//   const [remoteOnly, setRemoteOnly] = useState(false);
//   const [showMobileFilters, setShowMobileFilters] = useState(false);

//   // Initial Fetch
//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         // Fetch jobs ordered by posted date (newest first)
//         const q = query(collection(db, 'jobs'), orderBy('postedAt', 'desc'));
//         const querySnapshot = await getDocs(q);
//         const jobsData: Job[] = [];
        
//         querySnapshot.forEach((doc) => {
//           jobsData.push({ id: doc.id, ...doc.data() } as Job);
//         });
        
//         setJobs(jobsData);
//       } catch (error) {
//         console.error('Error fetching jobs:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   // --- Helpers ---
//   const getJobTitle = (j: Job) => j.jobTitle || j.title || 'Untitled';
//   const getCompanyName = (j: Job) => j.companyName || j.company || 'Unknown';
//   const getJobType = (j: Job) => j.jobType || j.type || 'Full-time';
//   const isExternal = (j: Job) => (j.jobLink && j.jobLink.length > 5) || j.isExternal;
  
//   const getSalary = (s: string) => {
//     if (!s || s === 'Not specified') return null;
//     return s;
//   };

//   const formatDate = (timestamp: any) => {
//     if (!timestamp?.toDate) return 'Recent';
//     const date = timestamp.toDate();
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - date.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     if (diffDays <= 1) return 'New';
//     if (diffDays <= 7) return `${diffDays}d ago`;
//     return date.toLocaleDateString();
//   };

//   // --- Filtering Logic ---
//   const filteredJobs = jobs.filter(job => {
//     const term = searchTerm.toLowerCase();
//     const title = getJobTitle(job).toLowerCase();
//     const company = getCompanyName(job).toLowerCase();
//     const type = getJobType(job).toLowerCase();
//     const location = job.location?.toLowerCase() || '';

//     // Search Match
//     const matchesSearch = title.includes(term) || company.includes(term) || location.includes(term);
    
//     // Type Match
//     const matchesType = selectedType === 'All' || type.includes(selectedType.toLowerCase());
    
//     // Remote Match
//     const isRemote = location.includes('remote') || type.includes('remote');
//     const matchesRemote = !remoteOnly || isRemote;

//     // Experience Match (Simple check)
//     const matchesExp = selectedExp === 'All' || (job.experience && job.experience.includes(selectedExp));

//     return matchesSearch && matchesType && matchesRemote && matchesExp;
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="w-10 h-10 border-4 border-neutral-100 border-t-orange-600 rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-neutral-50">
      
//       {/* 1. TOP HEADER & SEARCH (Fixed Height) */}
//       <div className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
//             {/* Brand / Title */}
//             <div>
//               <h1 className="text-2xl font-black text-black tracking-tight">Find Work</h1>
//               <p className="text-xs text-neutral-500 hidden md:block">
//                 {filteredJobs.length} active opportunities found
//               </p>
//             </div>

//             {/* Search Bar */}
//             <div className="flex-1 max-w-2xl flex gap-2">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by title, skill, or company..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 border border-transparent focus:bg-white focus:border-orange-500 rounded-xl outline-none transition-all text-black font-medium placeholder-neutral-500"
//                 />
//                 {searchTerm && (
//                   <button 
//                     onClick={() => setSearchTerm('')}
//                     className="absolute right-3 top-3 text-neutral-400 hover:text-black"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 )}
//               </div>
              
//               <button 
//                 onClick={() => setShowMobileFilters(!showMobileFilters)}
//                 className="md:hidden px-3 py-2 bg-black text-white rounded-xl"
//               >
//                 <Filter className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex items-start gap-8">
        
//         {/* 2. SIDEBAR FILTERS (Desktop Sticky) */}
//         <aside className={`
//           w-full md:w-64 flex-shrink-0 bg-white md:bg-transparent rounded-2xl md:rounded-none shadow-xl md:shadow-none p-6 md:p-0
//           fixed inset-0 z-40 md:static md:z-0 md:block
//           ${showMobileFilters ? 'block' : 'hidden'}
//         `}>
//           <div className="flex justify-between items-center md:hidden mb-6">
//             <h2 className="text-xl font-bold text-black">Filters</h2>
//             <button onClick={() => setShowMobileFilters(false)}><X className="w-6 h-6" /></button>
//           </div>

//           <div className="space-y-8 md:sticky md:top-24">
            
//             {/* Job Type Filter */}
//             <div>
//               <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Job Type</h3>
//               <div className="space-y-2">
//                 {['All', 'Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
//                   <label key={type} className="flex items-center gap-3 cursor-pointer group">
//                     <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${selectedType === type ? 'bg-orange-600 border-orange-600' : 'bg-white border-neutral-300 group-hover:border-orange-400'}`}>
//                       {selectedType === type && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
//                     </div>
//                     <input 
//                       type="radio" 
//                       name="jobType" 
//                       className="hidden" 
//                       checked={selectedType === type}
//                       onChange={() => setSelectedType(type)} 
//                     />
//                     <span className={`text-sm ${selectedType === type ? 'text-black font-bold' : 'text-neutral-600'}`}>{type}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Remote Toggle */}
//             <div>
//               <label className="flex items-center gap-3 cursor-pointer group">
//                 <div className={`w-10 h-6 rounded-full p-1 transition-colors ${remoteOnly ? 'bg-orange-600' : 'bg-neutral-300'}`}>
//                   <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${remoteOnly ? 'translate-x-4' : 'translate-x-0'}`} />
//                 </div>
//                 <input 
//                   type="checkbox" 
//                   className="hidden" 
//                   checked={remoteOnly} 
//                   onChange={(e) => setRemoteOnly(e.target.checked)} 
//                 />
//                 <span className="text-sm font-bold text-black">Remote Only</span>
//               </label>
//             </div>

//             {/* Experience Level (Simple) */}
//             <div>
//               <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Experience</h3>
//               <div className="flex flex-wrap gap-2">
//                 {['All', 'Entry', 'Mid', 'Senior'].map((exp) => (
//                   <button
//                     key={exp}
//                     onClick={() => setSelectedExp(exp)}
//                     className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
//                       selectedExp === exp 
//                         ? 'bg-black text-white border-black' 
//                         : 'bg-white text-neutral-600 border-neutral-200 hover:border-black'
//                     }`}
//                   >
//                     {exp}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Reset */}
//             <button 
//               onClick={() => {
//                 setSelectedType('All');
//                 setSelectedExp('All');
//                 setRemoteOnly(false);
//                 setSearchTerm('');
//               }}
//               className="w-full py-2 text-xs font-bold text-neutral-400 hover:text-orange-600 transition-colors border-t border-neutral-200 pt-4 mt-4"
//             >
//               Reset all filters
//             </button>
//           </div>
//         </aside>

//         {/* 3. JOB LIST (Feed) */}
//         <div className="flex-1 min-w-0">
          
//           {filteredJobs.length === 0 ? (
//             <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
//               <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🤔</div>
//               <h3 className="text-lg font-bold text-black mb-2">No jobs match your search</h3>
//               <p className="text-neutral-500 mb-6">Try adjusting your filters or keyword.</p>
//               <button 
//                 onClick={() => { setSearchTerm(''); setSelectedType('All'); setRemoteOnly(false); }}
//                 className="px-6 py-2 bg-black text-white rounded-lg text-sm font-bold"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {filteredJobs.map((job) => {
//                 const external = isExternal(job);
//                 const salary = getSalary(job.salary);
//                 const postedDate = formatDate(job.postedAt);
//                 const link = (job.jobLink && job.jobLink.length > 1) ? job.jobLink : `/jobs/${job.id}`;

//                 return (
//                   <div 
//                     key={job.id} 
//                     className="group bg-white rounded-xl border border-neutral-200 p-5 hover:border-orange-300 hover:shadow-md transition-all duration-200 relative overflow-hidden"
//                   >
//                     {/* Active strip on hover */}
//                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />

//                     <div className="flex flex-col sm:flex-row gap-4">
                      
//                       {/* Logo Area */}
//                       <div className="w-12 h-12 sm:w-16 sm:h-16 bg-neutral-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-neutral-100 text-xl font-bold text-neutral-400">
//                         {getCompanyName(job).charAt(0)}
//                       </div>

//                       {/* Content Area */}
//                       <div className="flex-1 min-w-0">
//                         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
//                           <div>
//                             <Link href={`/jobs/${job.id}`} className="block group-hover:text-orange-600 transition-colors">
//                               <h2 className="text-lg font-bold text-black leading-tight truncate pr-4">
//                                 {getJobTitle(job)}
//                               </h2>
//                             </Link>
//                             <p className="text-sm text-neutral-500 font-medium flex items-center gap-1 mt-1">
//                               <Building className="w-3.5 h-3.5" />
//                               {getCompanyName(job)}
//                             </p>
//                           </div>
                          
//                           {/* Date & Tag */}
//                           <div className="flex items-center gap-2 flex-shrink-0">
//                             {postedDate === 'New' && (
//                               <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
//                                 NEW
//                               </span>
//                             )}
//                             <span className="text-xs text-neutral-400 font-medium whitespace-nowrap">
//                               {postedDate}
//                             </span>
//                           </div>
//                         </div>

//                         {/* Metadata Tags */}
//                         <div className="flex flex-wrap gap-2 mb-3">
//                           <span className="inline-flex items-center px-2.5 py-1 bg-neutral-100 rounded-md text-xs font-medium text-neutral-600">
//                             <MapPin className="w-3 h-3 mr-1 text-neutral-400" />
//                             {job.location}
//                           </span>
//                           <span className="inline-flex items-center px-2.5 py-1 bg-neutral-100 rounded-md text-xs font-medium text-neutral-600">
//                             <Briefcase className="w-3 h-3 mr-1 text-neutral-400" />
//                             {getJobType(job)}
//                           </span>
//                           {salary && (
//                             <span className="inline-flex items-center px-2.5 py-1 bg-green-50 border border-green-100 rounded-md text-xs font-medium text-green-700">
//                               <DollarSign className="w-3 h-3 mr-0.5" />
//                               {salary}
//                             </span>
//                           )}
//                           {external && (
//                             <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">
//                               <ExternalLink className="w-3 h-3 mr-1" />
//                               External
//                             </span>
//                           )}
//                         </div>

//                         {/* Description Preview (Desktop only) */}
//                         <p className="text-xs text-neutral-500 line-clamp-2 hidden sm:block mb-3 leading-relaxed">
//                           {job.description}
//                         </p>

//                         {/* Action Area (Visible on Hover/Mobile) */}
//                         <div className="flex items-center justify-end gap-3 mt-auto">
//                           {external ? (
//                             <a 
//                               href={link} 
//                               target="_blank" 
//                               rel="noreferrer"
//                               className="w-full sm:w-auto px-4 py-2 bg-white border border-neutral-300 hover:border-black text-black text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
//                             >
//                               Apply Externally
//                               <ExternalLink className="w-3.5 h-3.5" />
//                             </a>
//                           ) : (
//                             <Link 
//                               href={`/jobs/${job.id}`}
//                               className="w-full sm:w-auto px-6 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
//                             >
//                               Details
//                             </Link>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function JobsPage() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Jobs page failed to load">
//       <JobsContent />
//     </ClientErrorBoundary>
//   );
// }


//-------------------------------------- woirking one ------------------------------


// 'use client';

// import { useState, useEffect } from 'react';
// import { collection, getDocs, orderBy, query } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import Link from 'next/link';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';
// import { 
//   Search, MapPin, Briefcase, DollarSign, Clock, Filter, 
//   ExternalLink, Building, X, Globe, CheckCircle2, Eye, 
//   Calendar, User, BookOpen
// } from 'lucide-react';

// // --- Types ---
// interface Job {
//   id: string;
//   title: string;
//   jobTitle?: string;
//   company: string;
//   companyName?: string;
//   location: string;
//   type: string;
//   jobType?: string;
//   salary: string;
//   description: string;
//   requirements: string | string[];
//   postedAt: any;
//   jobLink?: string;
//   isExternal?: boolean;
//   source?: string;
//   experience?: string;
//   education?: string;
//   remote?: boolean;
// }

// // --- Helper Functions ---
// const truncateText = (text: string, maxLength: number = 120): string => {
//   if (!text || text.length <= maxLength) return text;
//   return text.substring(0, maxLength).trim() + '...';
// };

// const extractFirstSentence = (text: string): string => {
//   if (!text) return '';
//   // Find first sentence ending with period, exclamation, or question mark
//   const match = text.match(/^[^.!?]+[.!?]/);
//   return match ? match[0] : truncateText(text, 80);
// };

// const formatRelativeTime = (timestamp: any): string => {
//   if (!timestamp?.toDate) return 'Recently';
//   const date = timestamp.toDate();
//   const now = new Date();
//   const diffTime = Math.abs(now.getTime() - date.getTime());
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
//   if (diffDays < 1) {
//     const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
//     if (diffHours < 1) {
//       const diffMinutes = Math.floor(diffTime / (1000 * 60));
//       return `${diffMinutes}m ago`;
//     }
//     return `${diffHours}h ago`;
//   }
//   if (diffDays === 1) return 'Yesterday';
//   if (diffDays < 7) return `${diffDays}d ago`;
//   if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
//   return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
// };

// const getJobPreview = (job: Job): string => {
//   // If description is too long, extract first meaningful part
//   const description = job.description || '';
  
//   // Try to find a summary or first paragraph
//   const lines = description.split('\n').filter(line => line.trim().length > 10);
  
//   if (lines.length > 0) {
//     const firstLine = lines[0].trim();
//     if (firstLine.toLowerCase().includes('summary:') || firstLine.toLowerCase().includes('about:')) {
//       return truncateText(firstLine.replace(/^(summary|about):\s*/i, ''), 100);
//     }
//     return truncateText(firstLine, 100);
//   }
  
//   // Fallback to requirements or salary
//   if (job.requirements) {
//     const reqText = Array.isArray(job.requirements) 
//       ? job.requirements[0] 
//       : typeof job.requirements === 'string' 
//         ? job.requirements.split('\n')[0]
//         : 'Requirements available';
//     return `Requires: ${truncateText(reqText, 80)}`;
//   }
  
//   return `Position at ${job.companyName || job.company}`;
// };

// // --- Main Component ---
// function JobsContent() {
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Filter States
//   const [selectedType, setSelectedType] = useState<string>('All');
//   const [selectedExp, setSelectedExp] = useState<string>('All');
//   const [remoteOnly, setRemoteOnly] = useState(false);
//   const [showMobileFilters, setShowMobileFilters] = useState(false);

//   // Initial Fetch
//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         // Fetch jobs ordered by posted date (newest first)
//         const q = query(collection(db, 'jobs'), orderBy('postedAt', 'desc'));
//         const querySnapshot = await getDocs(q);
//         const jobsData: Job[] = [];
        
//         querySnapshot.forEach((doc) => {
//           jobsData.push({ id: doc.id, ...doc.data() } as Job);
//         });
        
//         setJobs(jobsData);
//       } catch (error) {
//         console.error('Error fetching jobs:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   // --- Helpers ---
//   const getJobTitle = (j: Job) => j.jobTitle || j.title || 'Untitled';
//   const getCompanyName = (j: Job) => j.companyName || j.company || 'Unknown';
//   const getJobType = (j: Job) => j.jobType || j.type || 'Full-time';
//   const isExternal = (j: Job) => (j.jobLink && j.jobLink.length > 5) || j.isExternal;
  
//   const getSalary = (s: string) => {
//     if (!s || s === 'Not specified' || s === '') return null;
//     return s;
//   };

//   // --- Filtering Logic ---
//   const filteredJobs = jobs.filter(job => {
//     const term = searchTerm.toLowerCase();
//     const title = getJobTitle(job).toLowerCase();
//     const company = getCompanyName(job).toLowerCase();
//     const type = getJobType(job).toLowerCase();
//     const location = job.location?.toLowerCase() || '';

//     // Search Match
//     const matchesSearch = title.includes(term) || company.includes(term) || location.includes(term);
    
//     // Type Match
//     const matchesType = selectedType === 'All' || type.includes(selectedType.toLowerCase());
    
//     // Remote Match
//     const isRemote = location.includes('remote') || type.includes('remote');
//     const matchesRemote = !remoteOnly || isRemote;

//     // Experience Match (Simple check)
//     const matchesExp = selectedExp === 'All' || (job.experience && job.experience.includes(selectedExp));

//     return matchesSearch && matchesType && matchesRemote && matchesExp;
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="w-10 h-10 border-4 border-neutral-100 border-t-orange-600 rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-neutral-50">
      
//       {/* 1. TOP HEADER & SEARCH (Fixed Height) */}
//       <div className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
//             {/* Brand / Title */}
//             <div>
//               <h1 className="text-2xl font-black text-black tracking-tight">Find Work</h1>
//               <p className="text-xs text-neutral-500 hidden md:block">
//                 {filteredJobs.length} active opportunities found
//               </p>
//             </div>

//             {/* Search Bar */}
//             <div className="flex-1 max-w-2xl flex gap-2">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
//                 <input
//                   type="text"
//                   placeholder="Search jobs, companies, or locations..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 border border-transparent focus:bg-white focus:border-orange-500 rounded-xl outline-none transition-all text-black font-medium placeholder-neutral-500"
//                 />
//                 {searchTerm && (
//                   <button 
//                     onClick={() => setSearchTerm('')}
//                     className="absolute right-3 top-3 text-neutral-400 hover:text-black"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 )}
//               </div>
              
//               <button 
//                 onClick={() => setShowMobileFilters(!showMobileFilters)}
//                 className="md:hidden px-3 py-2 bg-black text-white rounded-xl"
//               >
//                 <Filter className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex items-start gap-8">
        
//         {/* 2. SIDEBAR FILTERS (Desktop Sticky) */}
//         <aside className={`
//           w-full md:w-64 flex-shrink-0 bg-white md:bg-transparent rounded-2xl md:rounded-none shadow-xl md:shadow-none p-6 md:p-0
//           fixed inset-0 z-40 md:static md:z-0 md:block
//           ${showMobileFilters ? 'block' : 'hidden'}
//         `}>
//           <div className="flex justify-between items-center md:hidden mb-6">
//             <h2 className="text-xl font-bold text-black">Filters</h2>
//             <button onClick={() => setShowMobileFilters(false)}><X className="w-6 h-6" /></button>
//           </div>

//           <div className="space-y-8 md:sticky md:top-24">
            
//             {/* Job Type Filter */}
//             <div>
//               <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Job Type</h3>
//               <div className="space-y-2">
//                 {['All', 'Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
//                   <label key={type} className="flex items-center gap-3 cursor-pointer group">
//                     <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${selectedType === type ? 'bg-orange-600 border-orange-600' : 'bg-white border-neutral-300 group-hover:border-orange-400'}`}>
//                       {selectedType === type && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
//                     </div>
//                     <input 
//                       type="radio" 
//                       name="jobType" 
//                       className="hidden" 
//                       checked={selectedType === type}
//                       onChange={() => setSelectedType(type)} 
//                     />
//                     <span className={`text-sm ${selectedType === type ? 'text-black font-bold' : 'text-neutral-600'}`}>{type}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Remote Toggle */}
//             <div>
//               <label className="flex items-center gap-3 cursor-pointer group">
//                 <div className={`w-10 h-6 rounded-full p-1 transition-colors ${remoteOnly ? 'bg-orange-600' : 'bg-neutral-300'}`}>
//                   <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${remoteOnly ? 'translate-x-4' : 'translate-x-0'}`} />
//                 </div>
//                 <input 
//                   type="checkbox" 
//                   className="hidden" 
//                   checked={remoteOnly} 
//                   onChange={(e) => setRemoteOnly(e.target.checked)} 
//                 />
//                 <span className="text-sm font-bold text-black">Remote Only</span>
//               </label>
//             </div>

//             {/* Experience Level (Simple) */}
//             <div>
//               <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Experience</h3>
//               <div className="flex flex-wrap gap-2">
//                 {['All', 'Entry', 'Mid', 'Senior'].map((exp) => (
//                   <button
//                     key={exp}
//                     onClick={() => setSelectedExp(exp)}
//                     className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
//                       selectedExp === exp 
//                         ? 'bg-black text-white border-black' 
//                         : 'bg-white text-neutral-600 border-neutral-200 hover:border-black'
//                     }`}
//                   >
//                     {exp}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Reset */}
//             <button 
//               onClick={() => {
//                 setSelectedType('All');
//                 setSelectedExp('All');
//                 setRemoteOnly(false);
//                 setSearchTerm('');
//               }}
//               className="w-full py-2 text-xs font-bold text-neutral-400 hover:text-orange-600 transition-colors border-t border-neutral-200 pt-4 mt-4"
//             >
//               Reset all filters
//             </button>
//           </div>
//         </aside>

//         {/* 3. JOB LIST (Feed) */}
//         <div className="flex-1 min-w-0">
          
//           {filteredJobs.length === 0 ? (
//             <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
//               <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🤔</div>
//               <h3 className="text-lg font-bold text-black mb-2">No jobs match your search</h3>
//               <p className="text-neutral-500 mb-6">Try adjusting your filters or keyword.</p>
//               <button 
//                 onClick={() => { setSearchTerm(''); setSelectedType('All'); setRemoteOnly(false); }}
//                 className="px-6 py-2 bg-black text-white rounded-lg text-sm font-bold"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//               {filteredJobs.map((job) => {
//                 const external = isExternal(job);
//                 const salary = getSalary(job.salary);
//                 const postedDate = formatRelativeTime(job.postedAt);
//                 const jobPreview = getJobPreview(job);

//                 return (
//                   <div 
//                     key={job.id} 
//                     className="group bg-white rounded-xl border border-neutral-200 p-5 hover:border-orange-300 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
//                   >
//                     {/* Top Section - Always same height */}
//                     <div className="flex-1">
//                       {/* Job Title and Company - Fixed 2 lines */}
//                       <div className="mb-3">
//                         <Link href={`/jobs/${job.id}`} className="block group-hover:text-orange-600 transition-colors">
//                           <h2 className="text-lg font-bold text-black line-clamp-1">
//                             {getJobTitle(job)}
//                           </h2>
//                         </Link>
//                         <div className="flex items-center gap-1 mt-1">
//                           <Building className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
//                           <p className="text-sm text-neutral-500 font-medium line-clamp-1">
//                             {getCompanyName(job)}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Job Preview - Always exactly 2 lines */}
//                       <div className="mb-4">
//                         <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
//                           {jobPreview}
//                         </p>
//                       </div>

//                       {/* Metadata Tags - Always same layout */}
//                       <div className="flex flex-wrap gap-2 mb-4">
//                         <span className="inline-flex items-center px-2.5 py-1 bg-neutral-100 rounded-md text-xs font-medium text-neutral-600">
//                           <MapPin className="w-3 h-3 mr-1 text-neutral-400 flex-shrink-0" />
//                           <span className="truncate max-w-[80px]">{job.location}</span>
//                         </span>
//                         <span className="inline-flex items-center px-2.5 py-1 bg-neutral-100 rounded-md text-xs font-medium text-neutral-600">
//                           <Briefcase className="w-3 h-3 mr-1 text-neutral-400 flex-shrink-0" />
//                           {getJobType(job)}
//                         </span>
//                         {salary && (
//                           <span className="inline-flex items-center px-2.5 py-1 bg-green-50 border border-green-100 rounded-md text-xs font-medium text-green-700">
//                             <DollarSign className="w-3 h-3 mr-0.5 flex-shrink-0" />
//                             <span className="truncate max-w-[80px]">{salary}</span>
//                           </span>
//                         )}
//                         {external && (
//                           <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">
//                             <Globe className="w-3 h-3 mr-1 flex-shrink-0" />
//                             External
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Bottom Section - Always same height */}
//                     <div className="border-t border-neutral-100 pt-4 mt-auto">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                           <div className="flex items-center gap-1 text-xs text-neutral-400">
//                             <Clock className="w-3 h-3" />
//                             {postedDate}
//                           </div>
//                           {postedDate === 'Recently' || postedDate.includes('h ago') || postedDate.includes('m ago') ? (
//                             <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
//                               NEW
//                             </span>
//                           ) : null}
//                         </div>
                        
//                         <div className="flex gap-2">
//                           {external ? (
//                             <a 
//                               href={job.jobLink} 
//                               target="_blank" 
//                               rel="noreferrer"
//                               className="px-4 py-2 bg-white border border-neutral-300 hover:border-black text-black text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
//                             >
//                               Apply
//                               <ExternalLink className="w-3.5 h-3.5" />
//                             </a>
//                           ) : (
//                             <Link 
//                               href={`/jobs/${job.id}`}
//                               className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 group/btn"
//                             >
//                               <Eye className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
//                               Details
//                             </Link>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//           {/* Results Count Footer */}
//           {filteredJobs.length > 0 && (
//             <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
//               <p className="text-sm text-neutral-500">
//                 Showing <span className="font-bold text-black">{filteredJobs.length}</span> of <span className="font-bold text-black">{jobs.length}</span> jobs
//               </p>
//               <p className="text-xs text-neutral-400 mt-1">
//                 Click on any job for full details and to apply
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function JobsPage() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Jobs page failed to load">
//       <JobsContent />
//     </ClientErrorBoundary>
//   );
// }

// ------------------------ working one ----------------------------------------

// 'use client';

// import { useState, useEffect, useCallback, useRef } from 'react';
// import { 
//   collection, getDocs, orderBy, query, limit, startAfter, 
//   where, QueryDocumentSnapshot, DocumentData 
// } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import Link from 'next/link';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';
// import { 
//   Search, MapPin, Briefcase, DollarSign, Clock, Filter, 
//   ExternalLink, Building, X, Globe, CheckCircle2, Eye, 
//   Loader2, RefreshCw
// } from 'lucide-react';

// // --- Types ---
// interface Job {
//   id: string;
//   title: string;
//   jobTitle?: string;
//   company: string;
//   companyName?: string;
//   location: string;
//   type: string;
//   jobType?: string;
//   salary: string;
//   description: string;
//   requirements: string | string[];
//   postedAt: any;
//   jobLink?: string;
//   isExternal?: boolean;
//   source?: string;
//   experience?: string;
//   education?: string;
//   remote?: boolean;
//   isActive?: boolean;
// }

// // --- Cache Helpers ---
// const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

// interface CacheData {
//   jobs: Job[];
//   lastVisible: QueryDocumentSnapshot<DocumentData> | null;
//   hasMore: boolean;
//   timestamp: number;
// }

// // Generate a unique cache key based on filters
// const getCacheKey = (type: string, exp: string, remote: boolean): string => {
//   return `jobs_cache_${type}_${exp}_${remote}`;
// };

// // Safely read from sessionStorage (browser only)
// const getCachedData = (key: string): CacheData | null => {
//   if (typeof window === 'undefined') return null;
//   try {
//     const raw = sessionStorage.getItem(key);
//     if (!raw) return null;
//     const data = JSON.parse(raw);
//     // Check expiry
//     if (Date.now() - data.timestamp > CACHE_EXPIRY_MS) {
//       sessionStorage.removeItem(key);
//       return null;
//     }
//     // Note: lastVisible is a Firestore snapshot object, which cannot be serialized.
//     // We store it as a plain object and re-hydrate it on load.
//     // For simplicity, we only cache the jobs array and hasMore.
//     // We'll re-fetch lastVisible on load. We cache jobs only.
//     // Actually, let's just cache the jobs array and hasMore, and discard lastVisible.
//     // We'll set lastVisible to null and let the component re-fetch it.
//     // But that would defeat the purpose. Let's store the doc ID and re-fetch it?
//     // Better: We'll cache the jobs array, and if we have cached jobs, we assume we can use them.
//     // For pagination, if we have cached jobs, we'll set hasMore based on cached data.
//     // But we need lastVisible to load more. We can store the last doc ID and re-fetch it.
//     // Simplest: Cache the jobs, and when loading more, we use the last job's ID to fetch next.
//     // Wait, startAfter requires a DocumentSnapshot. We can get a reference using doc(db, 'jobs', lastDocId).
//     // But startAfter needs a snapshot, not just an ID. We can use doc(db, 'jobs', lastDocId) as a reference? No, startAfter needs a DocumentSnapshot.
//     // Workaround: We'll store the lastDocId and timestamp, and on load more, we fetch the document snapshot by ID.
//     // Actually, the simplest and safest: Don't cache pagination state.
//     // Cache ONLY the initial 20 jobs. When user clicks "Load More", we always fetch fresh from Firestore.
//     // This is the best tradeoff.
//     // So our cache will store: jobs array (first page), hasMore, timestamp.
//     // We will NOT cache lastVisible. On load more, we will use the last job's ID to query.
//     // But wait, startAfter needs a snapshot. We can use query(startAfter(snapshot)).
//     // If we have the last job's id, we can fetch that job's snapshot, then use it.
//     // That would be an extra read.
//     // MUCH simpler: Just don't cache pagination state. Cache the initial 20 jobs.
//     // On "Load More", we always fetch from Firestore using the current lastVisible in state.
//     // But if we refresh the page, we lose lastVisible. That's okay, because we start fresh.
//     // So the cache is ONLY for the initial load.
//     // Let's simplify: Cache ONLY the initial 20 jobs. If cached, load them. hasMore = true (since we don't know if there are more).
//     // On load more, fetch from Firestore.
//     // To check hasMore, we can fetch the first page. If it has 20 docs, hasMore = true.
//     // This is acceptable.
//     return data as CacheData;
//   } catch (e) {
//     return null;
//   }
// };

// const setCachedData = (key: string, jobs: Job[], hasMore: boolean): void => {
//   if (typeof window === 'undefined') return;
//   try {
//     // Remove lastVisible from cache (we only cache jobs and hasMore)
//     const data: CacheData = {
//       jobs,
//       hasMore,
//       timestamp: Date.now(),
//       lastVisible: null, // We don't cache this
//     };
//     sessionStorage.setItem(key, JSON.stringify(data));
//   } catch (e) {
//     // Ignore cache errors (e.g., storage full)
//   }
// };

// // --- Helper Functions ---
// const getJobTitle = (j: Job): string => j.jobTitle || j.title || 'Untitled';
// const getCompanyName = (j: Job): string => j.companyName || j.company || 'Unknown';
// const getJobType = (j: Job): string => j.jobType || j.type || 'Full-time';

// const isExternalJob = (j: Job): boolean => {
//   return !!(j.jobLink && j.jobLink.length > 5) || !!j.isExternal;
// };

// const truncateText = (text: string, maxLength: number = 120): string => {
//   if (!text || text.length <= maxLength) return text;
//   return text.substring(0, maxLength).trim() + '...';
// };

// const formatRelativeTime = (timestamp: any): string => {
//   if (!timestamp) return 'Recently';
  
//   let date: Date;
//   if (timestamp?.toDate) {
//     date = timestamp.toDate();
//   } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
//     date = new Date(timestamp);
//   } else {
//     return 'Recently';
//   }

//   const now = new Date();
//   const diffTime = Math.abs(now.getTime() - date.getTime());
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
//   if (diffDays < 1) {
//     const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
//     if (diffHours < 1) {
//       const diffMinutes = Math.floor(diffTime / (1000 * 60));
//       return `${diffMinutes}m ago`;
//     }
//     return `${diffHours}h ago`;
//   }
//   if (diffDays === 1) return 'Yesterday';
//   if (diffDays < 7) return `${diffDays}d ago`;
//   if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
//   return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
// };

// const getJobPreview = (job: Job): string => {
//   const description = job.description || '';
//   const lines = description.split('\n').filter(line => line.trim().length > 10);
  
//   if (lines.length > 0) {
//     const firstLine = lines[0].trim();
//     if (firstLine.toLowerCase().includes('summary:') || firstLine.toLowerCase().includes('about:')) {
//       return truncateText(firstLine.replace(/^(summary|about):\s*/i, ''), 100);
//     }
//     return truncateText(firstLine, 100);
//   }
  
//   if (job.requirements) {
//     const reqText = Array.isArray(job.requirements) 
//       ? job.requirements[0] 
//       : typeof job.requirements === 'string' 
//         ? job.requirements.split('\n')[0]
//         : 'Requirements available';
//     return `Requires: ${truncateText(reqText, 80)}`;
//   }
  
//   return `Position at ${getCompanyName(job)}`;
// };

// const getSalaryDisplay = (salary: string): string | null => {
//   if (!salary || salary === 'Not specified' || salary === '') return null;
//   return salary;
// };

// const mapDocToJob = (doc: QueryDocumentSnapshot<DocumentData>): Job => {
//   const data = doc.data();
//   return {
//     id: doc.id,
//     title: data.title || data.jobTitle || 'Untitled',
//     jobTitle: data.jobTitle,
//     company: data.company || data.companyName || 'Unknown',
//     companyName: data.companyName,
//     location: data.location || 'Remote',
//     type: data.type || data.jobType || 'Full-time',
//     jobType: data.jobType,
//     salary: data.salary || 'Not specified',
//     description: data.description || '',
//     requirements: data.requirements || [],
//     postedAt: data.postedAt,
//     jobLink: data.jobLink,
//     isExternal: data.isExternal || false,
//     source: data.source,
//     experience: data.experience || '',
//     education: data.education || '',
//     remote: data.remote || false,
//     isActive: data.isActive !== undefined ? data.isActive : true,
//   };
// };

// // --- Main Component ---
// function JobsContent() {
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  
//   // Search & Filters
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedType, setSelectedType] = useState<string>('All');
//   const [selectedExp, setSelectedExp] = useState<string>('All');
//   const [remoteOnly, setRemoteOnly] = useState(false);
//   const [showMobileFilters, setShowMobileFilters] = useState(false);
  
//   // Refs to prevent infinite loops
//   const isInitialLoadDone = useRef(false);
//   const currentFilterKey = useRef<string>('');

//   // --- Build Firestore query with filters ---
//   const buildJobsQuery = useCallback((
//     startAfterDoc?: QueryDocumentSnapshot<DocumentData>
//   ) => {
//     let q = query(
//       collection(db, 'jobs'),
//       orderBy('postedAt', 'desc'),
//       limit(20)
//     );

//     // Apply type filter
//     if (selectedType !== 'All') {
//       q = query(q, where('type', '==', selectedType));
//     }

//     // Apply experience filter
//     if (selectedExp !== 'All') {
//       q = query(q, where('experience', '==', selectedExp));
//     }

//     // Apply remote filter
//     if (remoteOnly) {
//       q = query(q, where('remote', '==', true));
//     }

//     // Pagination
//     if (startAfterDoc) {
//       q = query(q, startAfter(startAfterDoc));
//     }

//     return q;
//   }, [selectedType, selectedExp, remoteOnly]);

//   // --- Fetch initial or refreshed jobs (with caching) ---
//   const fetchJobs = useCallback(async (isRefresh = false) => {
//     const cacheKey = getCacheKey(selectedType, selectedExp, remoteOnly);
//     currentFilterKey.current = cacheKey;

//     // 🚀 HYBRID: Check cache FIRST (unless refreshing)
//     if (!isRefresh && typeof window !== 'undefined') {
//       const cached = getCachedData(cacheKey);
//       if (cached && cached.jobs.length > 0) {
//         console.log(`📦 [HYBRID] Using cached jobs for: ${cacheKey}`);
//         setJobs(cached.jobs);
//         setHasMore(cached.hasMore);
//         setLastVisible(null); // We don't cache lastVisible
//         setLoading(false);
//         return; // ✅ ZERO READS!
//       }
//     }

//     // 🔥 No cache or refresh: Fetch from Firestore (20 reads)
//     console.log(`🌐 [HYBRID] Fetching fresh jobs for: ${cacheKey}`);
//     setLoading(true);
//     try {
//       const q = buildJobsQuery();
//       const snapshot = await getDocs(q);
      
//       const jobsList: Job[] = [];
//       snapshot.forEach((doc) => {
//         jobsList.push(mapDocToJob(doc));
//       });
      
//       const hasMoreData = snapshot.docs.length === 20;
      
//       setJobs(jobsList);
//       setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
//       setHasMore(hasMoreData);
      
//       // 💾 Save to cache
//       setCachedData(cacheKey, jobsList, hasMoreData);
//     } catch (error) {
//       console.error('Error fetching jobs:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [buildJobsQuery, selectedType, selectedExp, remoteOnly]);

//   // --- Load more jobs (always fresh from Firestore) ---
//   const loadMoreJobs = useCallback(async () => {
//     if (!hasMore || loadingMore || !lastVisible) return;
    
//     console.log('📄 [HYBRID] Loading more jobs...');
//     setLoadingMore(true);
//     try {
//       const q = buildJobsQuery(lastVisible);
//       const snapshot = await getDocs(q);
      
//       const newJobs: Job[] = [...jobs];
//       snapshot.forEach((doc) => {
//         newJobs.push(mapDocToJob(doc));
//       });
      
//       const hasMoreData = snapshot.docs.length === 20;
      
//       setJobs(newJobs);
//       setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
//       setHasMore(hasMoreData);
      
//       // 💾 Update cache with the expanded list
//       const cacheKey = getCacheKey(selectedType, selectedExp, remoteOnly);
//       setCachedData(cacheKey, newJobs, hasMoreData);
//     } catch (error) {
//       console.error('Error loading more jobs:', error);
//     } finally {
//       setLoadingMore(false);
//     }
//   }, [hasMore, loadingMore, lastVisible, buildJobsQuery, jobs, selectedType, selectedExp, remoteOnly]);

//   // --- Refresh (clear cache + refetch) ---
//   const refreshJobs = useCallback(() => {
//     const cacheKey = getCacheKey(selectedType, selectedExp, remoteOnly);
//     if (typeof window !== 'undefined') {
//       sessionStorage.removeItem(cacheKey);
//     }
//     setLastVisible(null);
//     setHasMore(true);
//     fetchJobs(true);
//   }, [fetchJobs, selectedType, selectedExp, remoteOnly]);

//   // --- Reset all filters ---
//   const resetFilters = () => {
//     setSelectedType('All');
//     setSelectedExp('All');
//     setRemoteOnly(false);
//     setSearchTerm('');
//   };

//   // --- Initial load and filter changes ---
//   useEffect(() => {
//     // Reset pagination state when filters change
//     setLastVisible(null);
//     setHasMore(true);
//     fetchJobs(false);
//   }, [selectedType, selectedExp, remoteOnly, fetchJobs]);

//   // --- Client-side search filtering ---
//   const filteredJobs = jobs.filter(job => {
//     const term = searchTerm.toLowerCase();
//     const title = getJobTitle(job).toLowerCase();
//     const company = getCompanyName(job).toLowerCase();
//     const location = job.location?.toLowerCase() || '';
//     return title.includes(term) || company.includes(term) || location.includes(term);
//   });

//   // --- Loading state ---
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="w-10 h-10 border-4 border-neutral-100 border-t-orange-600 rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-neutral-50">
      
//       {/* 1. TOP HEADER & SEARCH */}
//       <div className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
//             <div>
//               <h1 className="text-2xl font-black text-black tracking-tight">Find Work</h1>
//               <p className="text-xs text-neutral-500 hidden md:block">
//                 {filteredJobs.length} active opportunities found
//               </p>
//             </div>

//             <div className="flex-1 max-w-2xl flex gap-2">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
//                 <input
//                   type="text"
//                   placeholder="Search jobs, companies, or locations..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 border border-transparent focus:bg-white focus:border-orange-500 rounded-xl outline-none transition-all text-black font-medium placeholder-neutral-500"
//                 />
//                 {searchTerm && (
//                   <button 
//                     onClick={() => setSearchTerm('')}
//                     className="absolute right-3 top-3 text-neutral-400 hover:text-black"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 )}
//               </div>
              
//               <button 
//                 onClick={() => setShowMobileFilters(!showMobileFilters)}
//                 className="md:hidden px-3 py-2 bg-black text-white rounded-xl"
//               >
//                 <Filter className="w-5 h-5" />
//               </button>

//               {/* Refresh Button */}
//               <button 
//                 onClick={refreshJobs}
//                 className="px-3 py-2 bg-neutral-200 hover:bg-neutral-300 text-black rounded-xl transition-colors flex items-center justify-center"
//                 title="Refresh jobs (clear cache)"
//               >
//                 <RefreshCw className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex items-start gap-8">
        
//         {/* 2. SIDEBAR FILTERS */}
//         <aside className={`
//           w-full md:w-64 flex-shrink-0 bg-white md:bg-transparent rounded-2xl md:rounded-none shadow-xl md:shadow-none p-6 md:p-0
//           fixed inset-0 z-40 md:static md:z-0 md:block
//           ${showMobileFilters ? 'block' : 'hidden'}
//         `}>
//           <div className="flex justify-between items-center md:hidden mb-6">
//             <h2 className="text-xl font-bold text-black">Filters</h2>
//             <button onClick={() => setShowMobileFilters(false)}><X className="w-6 h-6" /></button>
//           </div>

//           <div className="space-y-8 md:sticky md:top-24">
            
//             {/* Job Type */}
//             <div>
//               <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Job Type</h3>
//               <div className="space-y-2">
//                 {['All', 'Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
//                   <label key={type} className="flex items-center gap-3 cursor-pointer group">
//                     <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${selectedType === type ? 'bg-orange-600 border-orange-600' : 'bg-white border-neutral-300 group-hover:border-orange-400'}`}>
//                       {selectedType === type && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
//                     </div>
//                     <input 
//                       type="radio" 
//                       name="jobType" 
//                       className="hidden" 
//                       checked={selectedType === type}
//                       onChange={() => setSelectedType(type)} 
//                     />
//                     <span className={`text-sm ${selectedType === type ? 'text-black font-bold' : 'text-neutral-600'}`}>{type}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Remote Toggle */}
//             <div>
//               <label className="flex items-center gap-3 cursor-pointer group">
//                 <div className={`w-10 h-6 rounded-full p-1 transition-colors ${remoteOnly ? 'bg-orange-600' : 'bg-neutral-300'}`}>
//                   <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${remoteOnly ? 'translate-x-4' : 'translate-x-0'}`} />
//                 </div>
//                 <input 
//                   type="checkbox" 
//                   className="hidden" 
//                   checked={remoteOnly} 
//                   onChange={(e) => setRemoteOnly(e.target.checked)} 
//                 />
//                 <span className="text-sm font-bold text-black">Remote Only</span>
//               </label>
//             </div>

//             {/* Experience */}
//             <div>
//               <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Experience</h3>
//               <div className="flex flex-wrap gap-2">
//                 {['All', 'Entry', 'Mid', 'Senior'].map((exp) => (
//                   <button
//                     key={exp}
//                     onClick={() => setSelectedExp(exp)}
//                     className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
//                       selectedExp === exp 
//                         ? 'bg-black text-white border-black' 
//                         : 'bg-white text-neutral-600 border-neutral-200 hover:border-black'
//                     }`}
//                   >
//                     {exp}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Reset */}
//             <button 
//               onClick={resetFilters}
//               className="w-full py-2 text-xs font-bold text-neutral-400 hover:text-orange-600 transition-colors border-t border-neutral-200 pt-4 mt-4"
//             >
//               Reset all filters
//             </button>
//           </div>
//         </aside>

//         {/* 3. JOB LIST */}
//         <div className="flex-1 min-w-0">
          
//           {filteredJobs.length === 0 ? (
//             <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
//               <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🤔</div>
//               <h3 className="text-lg font-bold text-black mb-2">No jobs match your search</h3>
//               <p className="text-neutral-500 mb-6">Try adjusting your filters or keyword.</p>
//               <button 
//                 onClick={resetFilters}
//                 className="px-6 py-2 bg-black text-white rounded-lg text-sm font-bold"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           ) : (
//             <>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                 {filteredJobs.map((job) => {
//                   const external = isExternalJob(job);
//                   const salary = getSalaryDisplay(job.salary);
//                   const postedDate = formatRelativeTime(job.postedAt);
//                   const jobPreview = getJobPreview(job);

//                   return (
//                     <div 
//                       key={job.id} 
//                       className="group bg-white rounded-xl border border-neutral-200 p-5 hover:border-orange-300 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
//                     >
//                       <div className="flex-1">
//                         <div className="mb-3">
//                           <Link href={`/jobs/${job.id}`} className="block group-hover:text-orange-600 transition-colors">
//                             <h2 className="text-lg font-bold text-black line-clamp-1">
//                               {getJobTitle(job)}
//                             </h2>
//                           </Link>
//                           <div className="flex items-center gap-1 mt-1">
//                             <Building className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
//                             <p className="text-sm text-neutral-500 font-medium line-clamp-1">
//                               {getCompanyName(job)}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="mb-4">
//                           <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
//                             {jobPreview}
//                           </p>
//                         </div>

//                         <div className="flex flex-wrap gap-2 mb-4">
//                           <span className="inline-flex items-center px-2.5 py-1 bg-neutral-100 rounded-md text-xs font-medium text-neutral-600">
//                             <MapPin className="w-3 h-3 mr-1 text-neutral-400 flex-shrink-0" />
//                             <span className="truncate max-w-[80px]">{job.location || 'Remote'}</span>
//                           </span>
//                           <span className="inline-flex items-center px-2.5 py-1 bg-neutral-100 rounded-md text-xs font-medium text-neutral-600">
//                             <Briefcase className="w-3 h-3 mr-1 text-neutral-400 flex-shrink-0" />
//                             {getJobType(job)}
//                           </span>
//                           {salary && (
//                             <span className="inline-flex items-center px-2.5 py-1 bg-green-50 border border-green-100 rounded-md text-xs font-medium text-green-700">
//                               <DollarSign className="w-3 h-3 mr-0.5 flex-shrink-0" />
//                               <span className="truncate max-w-[80px]">{salary}</span>
//                             </span>
//                           )}
//                           {external && (
//                             <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">
//                               <Globe className="w-3 h-3 mr-1 flex-shrink-0" />
//                               External
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       <div className="border-t border-neutral-100 pt-4 mt-auto">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <div className="flex items-center gap-1 text-xs text-neutral-400">
//                               <Clock className="w-3 h-3" />
//                               {postedDate}
//                             </div>
//                             {postedDate === 'Recently' || postedDate.includes('h ago') || postedDate.includes('m ago') ? (
//                               <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
//                                 NEW
//                               </span>
//                             ) : null}
//                           </div>
                          
//                           <div className="flex gap-2">
//                             {external ? (
//                               <a 
//                                 href={job.jobLink} 
//                                 target="_blank" 
//                                 rel="noreferrer"
//                                 className="px-4 py-2 bg-white border border-neutral-300 hover:border-black text-black text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
//                               >
//                                 Apply
//                                 <ExternalLink className="w-3.5 h-3.5" />
//                               </a>
//                             ) : (
//                               <Link 
//                                 href={`/jobs/${job.id}`}
//                                 className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 group/btn"
//                               >
//                                 <Eye className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
//                                 Details
//                               </Link>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Load More Button */}
//               {hasMore && (
//                 <div className="flex justify-center mt-8">
//                   <button
//                     onClick={loadMoreJobs}
//                     disabled={loadingMore}
//                     className="px-6 py-3 bg-white border border-neutral-300 hover:border-black rounded-xl text-sm font-bold text-neutral-700 hover:text-black transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {loadingMore ? (
//                       <>
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                         Loading...
//                       </>
//                     ) : (
//                       <>
//                         <RefreshCw className="w-4 h-4" />
//                         Load More Jobs
//                       </>
//                     )}
//                   </button>
//                 </div>
//               )}

//               {/* Results Count */}
//               <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
//                 <p className="text-sm text-neutral-500">
//                   Showing <span className="font-bold text-black">{filteredJobs.length}</span> of <span className="font-bold text-black">{jobs.length}</span> loaded jobs
//                   {hasMore && <span className="text-neutral-400 ml-1">(load more below)</span>}
//                 </p>
//                 <p className="text-xs text-neutral-400 mt-1">
//                   Click on any job for full details and to apply
//                 </p>
//                 <p className="text-[10px] text-neutral-300 mt-2">
//                   💾 Cached for 5 minutes • <button onClick={refreshJobs} className="underline hover:text-black">Refresh now</button>
//                 </p>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function JobsPage() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Jobs page failed to load">
//       <JobsContent />
//     </ClientErrorBoundary>
//   );
// }


// ------------------------------------ working one -----------------------


// 'use client';

// import { useState, useEffect, useCallback, useRef } from 'react';
// import { 
//   collection, getDocs, orderBy, query, limit, startAfter, 
//   where, QueryDocumentSnapshot, DocumentData 
// } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import Link from 'next/link';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';
// import { 
//   Search, MapPin, Briefcase, DollarSign, Clock, Filter, 
//   ExternalLink, Building, X, Globe, CheckCircle2, Eye, 
//   Loader2, RefreshCw
// } from 'lucide-react';

// // --- Types ---
// interface Job {
//   id: string;
//   title: string;
//   jobTitle?: string;
//   company: string;
//   companyName?: string;
//   location: string;
//   type: string;
//   jobType?: string;
//   salary: string;
//   description: string;
//   requirements: string | string[];
//   postedAt: any;
//   jobLink?: string;
//   isExternal?: boolean;
//   source?: string;
//   experience?: string;
//   education?: string;
//   remote?: boolean;
//   isActive?: boolean;
// }

// // --- Cache Helpers ---
// const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

// interface CacheData {
//   jobs: Job[];
//   lastVisible: QueryDocumentSnapshot<DocumentData> | null;
//   hasMore: boolean;
//   timestamp: number;
// }

// // Generate a unique cache key based on filters
// const getCacheKey = (type: string, exp: string, remote: boolean): string => {
//   return `jobs_cache_${type}_${exp}_${remote}`;
// };

// // Safely read from sessionStorage (browser only)
// const getCachedData = (key: string): CacheData | null => {
//   if (typeof window === 'undefined') return null;
//   try {
//     const raw = sessionStorage.getItem(key);
//     if (!raw) return null;
//     const data = JSON.parse(raw);
//     // Check expiry
//     if (Date.now() - data.timestamp > CACHE_EXPIRY_MS) {
//       sessionStorage.removeItem(key);
//       return null;
//     }
//     // Note: lastVisible is a Firestore snapshot object, which cannot be serialized.
//     // We store it as a plain object and re-hydrate it on load.
//     // For simplicity, we only cache the jobs array and hasMore.
//     // We'll re-fetch lastVisible on load. We cache jobs only.
//     // Actually, let's just cache the jobs array and hasMore, and discard lastVisible.
//     // We'll set lastVisible to null and let the component re-fetch it.
//     // But that would defeat the purpose. Let's store the doc ID and re-fetch it?
//     // Better: We'll cache the jobs array, and if we have cached jobs, we assume we can use them.
//     // For pagination, if we have cached jobs, we'll set hasMore based on cached data.
//     // But we need lastVisible to load more. We can store the last doc ID and re-fetch it.
//     // Simplest: Cache the jobs, and when loading more, we use the last job's ID to fetch next.
//     // Wait, startAfter requires a DocumentSnapshot. We can get a reference using doc(db, 'jobs', lastDocId).
//     // But startAfter needs a snapshot, not just an ID. We can use doc(db, 'jobs', lastDocId) as a reference? No, startAfter needs a DocumentSnapshot.
//     // Workaround: We'll store the lastDocId and timestamp, and on load more, we fetch the document snapshot by ID.
//     // Actually, the simplest and safest: Don't cache pagination state.
//     // Cache ONLY the initial 20 jobs. When user clicks "Load More", we always fetch fresh from Firestore.
//     // This is the best tradeoff.
//     // So our cache will store: jobs array (first page), hasMore, timestamp.
//     // We will NOT cache lastVisible. On load more, we will use the last job's ID to query.
//     // But wait, startAfter needs a snapshot. We can use query(startAfter(snapshot)).
//     // If we have the last job's id, we can fetch that job's snapshot, then use it.
//     // That would be an extra read.
//     // MUCH simpler: Just don't cache pagination state. Cache the initial 20 jobs.
//     // On "Load More", we always fetch from Firestore using the current lastVisible in state.
//     // But if we refresh the page, we lose lastVisible. That's okay, because we start fresh.
//     // So the cache is ONLY for the initial load.
//     // Let's simplify: Cache ONLY the initial 20 jobs. If cached, load them. hasMore = true (since we don't know if there are more).
//     // On load more, fetch from Firestore.
//     // To check hasMore, we can fetch the first page. If it has 20 docs, hasMore = true.
//     // This is acceptable.
//     return data as CacheData;
//   } catch (e) {
//     return null;
//   }
// };

// const setCachedData = (key: string, jobs: Job[], hasMore: boolean): void => {
//   if (typeof window === 'undefined') return;
//   try {
//     // Remove lastVisible from cache (we only cache jobs and hasMore)
//     const data: CacheData = {
//       jobs,
//       hasMore,
//       timestamp: Date.now(),
//       lastVisible: null, // We don't cache this
//     };
//     sessionStorage.setItem(key, JSON.stringify(data));
//   } catch (e) {
//     // Ignore cache errors (e.g., storage full)
//   }
// };

// // --- Helper Functions ---
// const getJobTitle = (j: Job): string => j.jobTitle || j.title || 'Untitled';
// const getCompanyName = (j: Job): string => j.companyName || j.company || 'Unknown';
// const getJobType = (j: Job): string => j.jobType || j.type || 'Full-time';

// const isExternalJob = (j: Job): boolean => {
//   return !!(j.jobLink && j.jobLink.length > 5) || !!j.isExternal;
// };

// const truncateText = (text: string, maxLength: number = 120): string => {
//   if (!text || text.length <= maxLength) return text;
//   return text.substring(0, maxLength).trim() + '...';
// };

// const formatRelativeTime = (timestamp: any): string => {
//   if (!timestamp) return 'Recently';
  
//   let date: Date;
//   if (timestamp?.toDate) {
//     date = timestamp.toDate();
//   } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
//     date = new Date(timestamp);
//   } else {
//     return 'Recently';
//   }

//   const now = new Date();
//   const diffTime = Math.abs(now.getTime() - date.getTime());
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
//   if (diffDays < 1) {
//     const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
//     if (diffHours < 1) {
//       const diffMinutes = Math.floor(diffTime / (1000 * 60));
//       return `${diffMinutes}m ago`;
//     }
//     return `${diffHours}h ago`;
//   }
//   if (diffDays === 1) return 'Yesterday';
//   if (diffDays < 7) return `${diffDays}d ago`;
//   if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
//   return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
// };

// const getJobPreview = (job: Job): string => {
//   const description = job.description || '';
//   const lines = description.split('\n').filter(line => line.trim().length > 10);
  
//   if (lines.length > 0) {
//     const firstLine = lines[0].trim();
//     if (firstLine.toLowerCase().includes('summary:') || firstLine.toLowerCase().includes('about:')) {
//       return truncateText(firstLine.replace(/^(summary|about):\s*/i, ''), 100);
//     }
//     return truncateText(firstLine, 100);
//   }
  
//   if (job.requirements) {
//     const reqText = Array.isArray(job.requirements) 
//       ? job.requirements[0] 
//       : typeof job.requirements === 'string' 
//         ? job.requirements.split('\n')[0]
//         : 'Requirements available';
//     return `Requires: ${truncateText(reqText, 80)}`;
//   }
  
//   return `Position at ${getCompanyName(job)}`;
// };

// const getSalaryDisplay = (salary: string): string | null => {
//   if (!salary || salary === 'Not specified' || salary === '') return null;
//   return salary;
// };

// const mapDocToJob = (doc: QueryDocumentSnapshot<DocumentData>): Job => {
//   const data = doc.data();
//   return {
//     id: doc.id,
//     title: data.title || data.jobTitle || 'Untitled',
//     jobTitle: data.jobTitle,
//     company: data.company || data.companyName || 'Unknown',
//     companyName: data.companyName,
//     location: data.location || 'Remote',
//     type: data.type || data.jobType || 'Full-time',
//     jobType: data.jobType,
//     salary: data.salary || 'Not specified',
//     description: data.description || '',
//     requirements: data.requirements || [],
//     postedAt: data.postedAt,
//     jobLink: data.jobLink,
//     isExternal: data.isExternal || false,
//     source: data.source,
//     experience: data.experience || '',
//     education: data.education || '',
//     remote: data.remote || false,
//     isActive: data.isActive !== undefined ? data.isActive : true,
//   };
// };

// // --- Main Component ---
// function JobsContent() {
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  
//   // Search & Filters
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedType, setSelectedType] = useState<string>('All');
//   const [selectedExp, setSelectedExp] = useState<string>('All');
//   const [remoteOnly, setRemoteOnly] = useState(false);
//   const [showMobileFilters, setShowMobileFilters] = useState(false);
  
//   // Refs to prevent infinite loops
//   const isInitialLoadDone = useRef(false);
//   const currentFilterKey = useRef<string>('');

//   // --- Build Firestore query with filters ---
//   const buildJobsQuery = useCallback((
//     startAfterDoc?: QueryDocumentSnapshot<DocumentData>
//   ) => {
//     let q = query(
//       collection(db, 'jobs'),
//       orderBy('postedAt', 'desc'),
//       limit(20)
//     );

//     // Apply type filter
//     if (selectedType !== 'All') {
//       q = query(q, where('type', '==', selectedType));
//     }

//     // Apply experience filter
//     if (selectedExp !== 'All') {
//       q = query(q, where('experience', '==', selectedExp));
//     }

//     // Apply remote filter
//     if (remoteOnly) {
//       q = query(q, where('remote', '==', true));
//     }

//     // Pagination
//     if (startAfterDoc) {
//       q = query(q, startAfter(startAfterDoc));
//     }

//     return q;
//   }, [selectedType, selectedExp, remoteOnly]);

//   // --- Fetch initial or refreshed jobs (with caching) ---
//   const fetchJobs = useCallback(async (isRefresh = false) => {
//     const cacheKey = getCacheKey(selectedType, selectedExp, remoteOnly);
//     currentFilterKey.current = cacheKey;

//     // 🚀 HYBRID: Check cache FIRST (unless refreshing)
//     if (!isRefresh && typeof window !== 'undefined') {
//       const cached = getCachedData(cacheKey);
//       if (cached && cached.jobs.length > 0) {
//         console.log(`📦 [HYBRID] Using cached jobs for: ${cacheKey}`);
//         setJobs(cached.jobs);
//         setHasMore(cached.hasMore);
//         setLastVisible(null); // We don't cache lastVisible
//         setLoading(false);
//         return; // ✅ ZERO READS!
//       }
//     }

//     // 🔥 No cache or refresh: Fetch from Firestore (20 reads)
//     console.log(`🌐 [HYBRID] Fetching fresh jobs for: ${cacheKey}`);
//     setLoading(true);
//     try {
//       const q = buildJobsQuery();
//       const snapshot = await getDocs(q);
      
//       const jobsList: Job[] = [];
//       snapshot.forEach((doc) => {
//         jobsList.push(mapDocToJob(doc));
//       });
      
//       const hasMoreData = snapshot.docs.length === 20;
      
//       setJobs(jobsList);
//       setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
//       setHasMore(hasMoreData);
      
//       // 💾 Save to cache
//       setCachedData(cacheKey, jobsList, hasMoreData);
//     } catch (error) {
//       console.error('Error fetching jobs:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [buildJobsQuery, selectedType, selectedExp, remoteOnly]);

//   // --- Load more jobs (always fresh from Firestore) ---
//   const loadMoreJobs = useCallback(async () => {
//     if (!hasMore || loadingMore || !lastVisible) return;
    
//     console.log('📄 [HYBRID] Loading more jobs...');
//     setLoadingMore(true);
//     try {
//       const q = buildJobsQuery(lastVisible);
//       const snapshot = await getDocs(q);
      
//       const newJobs: Job[] = [...jobs];
//       snapshot.forEach((doc) => {
//         newJobs.push(mapDocToJob(doc));
//       });
      
//       const hasMoreData = snapshot.docs.length === 20;
      
//       setJobs(newJobs);
//       setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
//       setHasMore(hasMoreData);
      
//       // 💾 Update cache with the expanded list
//       const cacheKey = getCacheKey(selectedType, selectedExp, remoteOnly);
//       setCachedData(cacheKey, newJobs, hasMoreData);
//     } catch (error) {
//       console.error('Error loading more jobs:', error);
//     } finally {
//       setLoadingMore(false);
//     }
//   }, [hasMore, loadingMore, lastVisible, buildJobsQuery, jobs, selectedType, selectedExp, remoteOnly]);

//   // --- Refresh (clear cache + refetch) ---
//   const refreshJobs = useCallback(() => {
//     const cacheKey = getCacheKey(selectedType, selectedExp, remoteOnly);
//     if (typeof window !== 'undefined') {
//       sessionStorage.removeItem(cacheKey);
//     }
//     setLastVisible(null);
//     setHasMore(true);
//     fetchJobs(true);
//   }, [fetchJobs, selectedType, selectedExp, remoteOnly]);

//   // --- Reset all filters ---
//   const resetFilters = () => {
//     setSelectedType('All');
//     setSelectedExp('All');
//     setRemoteOnly(false);
//     setSearchTerm('');
//   };

//   // --- Initial load and filter changes ---
//   useEffect(() => {
//     // Reset pagination state when filters change
//     setLastVisible(null);
//     setHasMore(true);
//     fetchJobs(false);
//   }, [selectedType, selectedExp, remoteOnly, fetchJobs]);

//   // --- Client-side search filtering ---
//   const filteredJobs = jobs.filter(job => {
//     const term = searchTerm.toLowerCase();
//     const title = getJobTitle(job).toLowerCase();
//     const company = getCompanyName(job).toLowerCase();
//     const location = job.location?.toLowerCase() || '';
//     return title.includes(term) || company.includes(term) || location.includes(term);
//   });

//   // --- Loading state ---
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="w-10 h-10 border-4 border-neutral-100 border-t-orange-600 rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-neutral-50">
      
//       {/* 1. TOP HEADER & SEARCH */}
//       <div className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
//             <div>
//               <h1 className="text-2xl font-black text-black tracking-tight">Find Work</h1>
//               <p className="text-xs text-neutral-500 hidden md:block">
//                 {filteredJobs.length} active opportunities found
//               </p>
//             </div>

//             <div className="flex-1 max-w-2xl flex gap-2">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
//                 <input
//                   type="text"
//                   placeholder="Search jobs, companies, or locations..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 border border-transparent focus:bg-white focus:border-orange-500 rounded-xl outline-none transition-all text-black font-medium placeholder-neutral-500"
//                 />
//                 {searchTerm && (
//                   <button 
//                     onClick={() => setSearchTerm('')}
//                     className="absolute right-3 top-3 text-neutral-400 hover:text-black"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 )}
//               </div>
              
//               <button 
//                 onClick={() => setShowMobileFilters(!showMobileFilters)}
//                 className="md:hidden px-3 py-2 bg-black text-white rounded-xl"
//               >
//                 <Filter className="w-5 h-5" />
//               </button>

//               {/* Refresh Button */}
//               <button 
//                 onClick={refreshJobs}
//                 className="px-3 py-2 bg-neutral-200 hover:bg-neutral-300 text-black rounded-xl transition-colors flex items-center justify-center"
//                 title="Refresh jobs (clear cache)"
//               >
//                 <RefreshCw className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex items-start gap-8">
        
//         {/* 2. SIDEBAR FILTERS */}
//         <aside className={`
//           w-full md:w-64 flex-shrink-0 bg-white md:bg-transparent rounded-2xl md:rounded-none shadow-xl md:shadow-none p-6 md:p-0
//           fixed inset-0 z-40 md:static md:z-0 md:block
//           ${showMobileFilters ? 'block' : 'hidden'}
//         `}>
//           <div className="flex justify-between items-center md:hidden mb-6">
//             <h2 className="text-xl font-bold text-black">Filters</h2>
//             <button onClick={() => setShowMobileFilters(false)}><X className="w-6 h-6" /></button>
//           </div>

//           <div className="space-y-8 md:sticky md:top-24">
            
//             {/* Job Type */}
//             <div>
//               <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Job Type</h3>
//               <div className="space-y-2">
//                 {['All', 'Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
//                   <label key={type} className="flex items-center gap-3 cursor-pointer group">
//                     <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${selectedType === type ? 'bg-orange-600 border-orange-600' : 'bg-white border-neutral-300 group-hover:border-orange-400'}`}>
//                       {selectedType === type && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
//                     </div>
//                     <input 
//                       type="radio" 
//                       name="jobType" 
//                       className="hidden" 
//                       checked={selectedType === type}
//                       onChange={() => setSelectedType(type)} 
//                     />
//                     <span className={`text-sm ${selectedType === type ? 'text-black font-bold' : 'text-neutral-600'}`}>{type}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Remote Toggle */}
//             <div>
//               <label className="flex items-center gap-3 cursor-pointer group">
//                 <div className={`w-10 h-6 rounded-full p-1 transition-colors ${remoteOnly ? 'bg-orange-600' : 'bg-neutral-300'}`}>
//                   <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${remoteOnly ? 'translate-x-4' : 'translate-x-0'}`} />
//                 </div>
//                 <input 
//                   type="checkbox" 
//                   className="hidden" 
//                   checked={remoteOnly} 
//                   onChange={(e) => setRemoteOnly(e.target.checked)} 
//                 />
//                 <span className="text-sm font-bold text-black">Remote Only</span>
//               </label>
//             </div>

//             {/* Experience */}
//             <div>
//               <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Experience</h3>
//               <div className="flex flex-wrap gap-2">
//                 {['All', 'Entry', 'Mid', 'Senior'].map((exp) => (
//                   <button
//                     key={exp}
//                     onClick={() => setSelectedExp(exp)}
//                     className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
//                       selectedExp === exp 
//                         ? 'bg-black text-white border-black' 
//                         : 'bg-white text-neutral-600 border-neutral-200 hover:border-black'
//                     }`}
//                   >
//                     {exp}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Reset */}
//             <button 
//               onClick={resetFilters}
//               className="w-full py-2 text-xs font-bold text-neutral-400 hover:text-orange-600 transition-colors border-t border-neutral-200 pt-4 mt-4"
//             >
//               Reset all filters
//             </button>
//           </div>
//         </aside>

//         {/* 3. JOB LIST */}
//         <div className="flex-1 min-w-0">
          
//           {filteredJobs.length === 0 ? (
//             <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
//               <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🤔</div>
//               <h3 className="text-lg font-bold text-black mb-2">No jobs match your search</h3>
//               <p className="text-neutral-500 mb-6">Try adjusting your filters or keyword.</p>
//               <button 
//                 onClick={resetFilters}
//                 className="px-6 py-2 bg-black text-white rounded-lg text-sm font-bold"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           ) : (
//             <>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                 {filteredJobs.map((job) => {
//                   const external = isExternalJob(job);
//                   const salary = getSalaryDisplay(job.salary);
//                   const postedDate = formatRelativeTime(job.postedAt);
//                   const jobPreview = getJobPreview(job);

//                   return (
//                     <div 
//                       key={job.id} 
//                       className="group bg-white rounded-xl border border-neutral-200 p-5 hover:border-orange-300 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
//                     >
//                       <div className="flex-1">
//                         <div className="mb-3">
//                           <Link href={`/jobs/${job.id}`} className="block group-hover:text-orange-600 transition-colors">
//                             <h2 className="text-lg font-bold text-black line-clamp-1">
//                               {getJobTitle(job)}
//                             </h2>
//                           </Link>
//                           <div className="flex items-center gap-1 mt-1">
//                             <Building className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
//                             <p className="text-sm text-neutral-500 font-medium line-clamp-1">
//                               {getCompanyName(job)}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="mb-4">
//                           <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
//                             {jobPreview}
//                           </p>
//                         </div>

//                         <div className="flex flex-wrap gap-2 mb-4">
//                           <span className="inline-flex items-center px-2.5 py-1 bg-neutral-100 rounded-md text-xs font-medium text-neutral-600">
//                             <MapPin className="w-3 h-3 mr-1 text-neutral-400 flex-shrink-0" />
//                             <span className="truncate max-w-[80px]">{job.location || 'Remote'}</span>
//                           </span>
//                           <span className="inline-flex items-center px-2.5 py-1 bg-neutral-100 rounded-md text-xs font-medium text-neutral-600">
//                             <Briefcase className="w-3 h-3 mr-1 text-neutral-400 flex-shrink-0" />
//                             {getJobType(job)}
//                           </span>
//                           {salary && (
//                             <span className="inline-flex items-center px-2.5 py-1 bg-green-50 border border-green-100 rounded-md text-xs font-medium text-green-700">
//                               <DollarSign className="w-3 h-3 mr-0.5 flex-shrink-0" />
//                               <span className="truncate max-w-[80px]">{salary}</span>
//                             </span>
//                           )}
//                           {external && (
//                             <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">
//                               <Globe className="w-3 h-3 mr-1 flex-shrink-0" />
//                               External
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       <div className="border-t border-neutral-100 pt-4 mt-auto">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <div className="flex items-center gap-1 text-xs text-neutral-400">
//                               <Clock className="w-3 h-3" />
//                               {postedDate}
//                             </div>
//                             {postedDate === 'Recently' || postedDate.includes('h ago') || postedDate.includes('m ago') ? (
//                               <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
//                                 NEW
//                               </span>
//                             ) : null}
//                           </div>
                          
//                           <div className="flex gap-2">
//                             {external ? (
//                               <a 
//                                 href={job.jobLink} 
//                                 target="_blank" 
//                                 rel="noreferrer"
//                                 className="px-4 py-2 bg-white border border-neutral-300 hover:border-black text-black text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
//                               >
//                                 Apply
//                                 <ExternalLink className="w-3.5 h-3.5" />
//                               </a>
//                             ) : (
//                               <Link 
//                                 href={`/jobs/${job.id}`}
//                                 className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 group/btn"
//                               >
//                                 <Eye className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
//                                 Details
//                               </Link>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Load More Button */}
//               {hasMore && (
//                 <div className="flex justify-center mt-8">
//                   <button
//                     onClick={loadMoreJobs}
//                     disabled={loadingMore}
//                     className="px-6 py-3 bg-white border border-neutral-300 hover:border-black rounded-xl text-sm font-bold text-neutral-700 hover:text-black transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {loadingMore ? (
//                       <>
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                         Loading...
//                       </>
//                     ) : (
//                       <>
//                         <RefreshCw className="w-4 h-4" />
//                         Load More Jobs
//                       </>
//                     )}
//                   </button>
//                 </div>
//               )}

//               {/* Results Count */}
//               <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
//                 <p className="text-sm text-neutral-500">
//                   Showing <span className="font-bold text-black">{filteredJobs.length}</span> of <span className="font-bold text-black">{jobs.length}</span> loaded jobs
//                   {hasMore && <span className="text-neutral-400 ml-1">(load more below)</span>}
//                 </p>
//                 <p className="text-xs text-neutral-400 mt-1">
//                   Click on any job for full details and to apply
//                 </p>
//                 <p className="text-[10px] text-neutral-300 mt-2">
//                   💾 Cached for 5 minutes • <button onClick={refreshJobs} className="underline hover:text-black">Refresh now</button>
//                 </p>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function JobsPage() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Jobs page failed to load">
//       <JobsContent />
//     </ClientErrorBoundary>
//   );
// }


// -------------------- latest working V --------------------------------------

// 'use client';

// import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// import { 
//   collection, getDocs, orderBy, query, limit, startAfter, 
//   where, QueryDocumentSnapshot, DocumentData 
// } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import Link from 'next/link';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';
// import { 
//   Search, MapPin, Briefcase, DollarSign, Clock, Filter, 
//   ExternalLink, Building, X, Globe, CheckCircle2, Eye, 
//   Loader2, RefreshCw
// } from 'lucide-react';

// // --- Types ---
// interface Job {
//   id: string;
//   title: string;
//   jobTitle?: string;
//   company: string;
//   companyName?: string;
//   location: string;
//   type: string;
//   jobType?: string;
//   salary: string;
//   description: string;
//   requirements: string | string[];
//   postedAt: any;
//   jobLink?: string;
//   isExternal?: boolean;
//   source?: string;
//   experience?: string;
//   education?: string;
//   remote?: boolean;
//   isActive?: boolean;
// }

// // --- Cache Helpers ---
// const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

// interface CacheData {
//   jobs: Job[];
//   hasMore: boolean;
//   timestamp: number;
// }

// // Search term removed from cache key to prevent fragmented caching
// const getCacheKey = (type: string, exp: string, remote: boolean): string => {
//   return `jobs_cache_${type}_${exp}_${remote}`;
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
//     return data as CacheData;
//   } catch (e) {
//     return null;
//   }
// };

// const setCachedData = (key: string, jobs: Job[], hasMore: boolean): void => {
//   if (typeof window === 'undefined') return;
//   try {
//     const data: CacheData = {
//       jobs,
//       hasMore,
//       timestamp: Date.now(),
//     };
//     sessionStorage.setItem(key, JSON.stringify(data));
//   } catch (e) {
//     // Ignore cache errors
//   }
// };

// // --- Helper Functions ---
// const getJobTitle = (j: Job): string => j.jobTitle || j.title || 'Untitled';
// const getCompanyName = (j: Job): string => j.companyName || j.company || 'Unknown';
// const getJobType = (j: Job): string => j.jobType || j.type || 'Full-time';

// const isExternalJob = (j: Job): boolean => {
//   return !!(j.jobLink && j.jobLink.length > 5) || !!j.isExternal;
// };

// const truncateText = (text: string, maxLength: number = 120): string => {
//   if (!text || text.length <= maxLength) return text;
//   return text.substring(0, maxLength).trim() + '...';
// };

// const formatRelativeTime = (timestamp: any): string => {
//   if (!timestamp) return 'Recently';
  
//   let date: Date;
//   if (timestamp?.toDate) {
//     date = timestamp.toDate();
//   } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
//     date = new Date(timestamp);
//   } else {
//     return 'Recently';
//   }

//   const now = new Date();
//   const diffTime = Math.abs(now.getTime() - date.getTime());
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
//   if (diffDays < 1) {
//     const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
//     if (diffHours < 1) {
//       const diffMinutes = Math.floor(diffTime / (1000 * 60));
//       return `${diffMinutes}m ago`;
//     }
//     return `${diffHours}h ago`;
//   }
//   if (diffDays === 1) return 'Yesterday';
//   if (diffDays < 7) return `${diffDays}d ago`;
//   if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
//   return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
// };

// const getJobPreview = (job: Job): string => {
//   const description = job.description || '';
//   const lines = description.split('\n').filter(line => line.trim().length > 10);
  
//   if (lines.length > 0) {
//     const firstLine = lines[0].trim();
//     if (firstLine.toLowerCase().includes('summary:') || firstLine.toLowerCase().includes('about:')) {
//       return truncateText(firstLine.replace(/^(summary|about):\s*/i, ''), 100);
//     }
//     return truncateText(firstLine, 100);
//   }
  
//   if (job.requirements) {
//     const reqText = Array.isArray(job.requirements) 
//       ? job.requirements[0] 
//       : typeof job.requirements === 'string' 
//         ? job.requirements.split('\n')[0]
//         : 'Requirements available';
//     return `Requires: ${truncateText(reqText, 80)}`;
//   }
  
//   return `Position at ${getCompanyName(job)}`;
// };

// const getSalaryDisplay = (salary: string): string | null => {
//   if (!salary || salary === 'Not specified' || salary === '') return null;
//   return salary;
// };

// const mapDocToJob = (doc: QueryDocumentSnapshot<DocumentData>): Job => {
//   const data = doc.data();
//   return {
//     id: doc.id,
//     title: data.title || data.jobTitle || 'Untitled',
//     jobTitle: data.jobTitle,
//     company: data.company || data.companyName || 'Unknown',
//     companyName: data.companyName,
//     location: data.location || 'Remote',
//     type: data.type || data.jobType || 'Full-time',
//     jobType: data.jobType,
//     salary: data.salary || 'Not specified',
//     description: data.description || '',
//     requirements: data.requirements || [],
//     postedAt: data.postedAt,
//     jobLink: data.jobLink,
//     isExternal: data.isExternal || false,
//     source: data.source,
//     experience: data.experience || '',
//     education: data.education || '',
//     remote: data.remote || false,
//     isActive: data.isActive !== undefined ? data.isActive : true,
//   };
// };

// // --- Main Component ---
// function JobsContent() {
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  
//   // Search & Filters
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedType, setSelectedType] = useState<string>('All');
//   const [selectedExp, setSelectedExp] = useState<string>('All');
//   const [remoteOnly, setRemoteOnly] = useState(false);
//   const [showMobileFilters, setShowMobileFilters] = useState(false);
  
//   // Refs for tracking
//   const isFirstLoad = useRef(true);

//   // --- Build Firestore query with base filters ONLY ---
//   const buildJobsQuery = useCallback((
//     startAfterDoc?: QueryDocumentSnapshot<DocumentData>
//   ) => {
//     let q = query(
//       collection(db, 'jobs'),
//       orderBy('postedAt', 'desc'),
//       limit(50) // Increased to 50 so local search has more data
//     );

//     // Apply type filter
//     if (selectedType !== 'All') {
//       q = query(q, where('type', '==', selectedType));
//     }

//     // Apply experience filter
//     if (selectedExp !== 'All') {
//       q = query(q, where('experience', '==', selectedExp));
//     }

//     // Apply remote filter
//     if (remoteOnly) {
//       q = query(q, where('remote', '==', true));
//     }

//     // Pagination
//     if (startAfterDoc) {
//       q = query(q, startAfter(startAfterDoc));
//     }

//     return q;
//   }, [selectedType, selectedExp, remoteOnly]);

//   // --- Fetch jobs (with caching) - STABLE function ---
//   const fetchJobs = useCallback(async (isRefresh = false) => {
//     const cacheKey = getCacheKey(selectedType, selectedExp, remoteOnly);

//     // 🚀 Check cache FIRST (unless refreshing)
//     if (!isRefresh && typeof window !== 'undefined') {
//       const cached = getCachedData(cacheKey);
//       if (cached && cached.jobs.length > 0) {
//         console.log(`📦 [HYBRID] Using cached jobs for: ${cacheKey}`);
//         setJobs(cached.jobs);
//         setHasMore(cached.hasMore);
//         setLastVisible(null);
//         setLoading(false);
//         return; 
//       }
//     }

//     // 🔥 No cache or refresh: Fetch from Firestore
//     console.log(`🌐 [HYBRID] Fetching fresh jobs for: ${cacheKey}`);
//     setLoading(true);
//     try {
//       const q = buildJobsQuery();
//       const snapshot = await getDocs(q);
      
//       const jobsList: Job[] = [];
//       snapshot.forEach((doc) => {
//         jobsList.push(mapDocToJob(doc));
//       });
      
//       const hasMoreData = snapshot.docs.length === 50;
      
//       setJobs(jobsList);
//       setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
//       setHasMore(hasMoreData);
      
//       // 💾 Save to cache
//       setCachedData(cacheKey, jobsList, hasMoreData);
//     } catch (error) {
//       console.error('Error fetching jobs:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [buildJobsQuery, selectedType, selectedExp, remoteOnly]);

//   // --- Load more jobs ---
//   const loadMoreJobs = useCallback(async () => {
//     if (!hasMore || loadingMore || !lastVisible) return;
    
//     console.log('📄 [HYBRID] Loading more jobs...');
//     setLoadingMore(true);
//     try {
//       const q = buildJobsQuery(lastVisible);
//       const snapshot = await getDocs(q);
      
//       const newJobs: Job[] = [...jobs];
//       snapshot.forEach((doc) => {
//         newJobs.push(mapDocToJob(doc));
//       });
      
//       const hasMoreData = snapshot.docs.length === 50;
      
//       setJobs(newJobs);
//       setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
//       setHasMore(hasMoreData);
      
//       // 💾 Update cache
//       const cacheKey = getCacheKey(selectedType, selectedExp, remoteOnly);
//       setCachedData(cacheKey, newJobs, hasMoreData);
//     } catch (error) {
//       console.error('Error loading more jobs:', error);
//     } finally {
//       setLoadingMore(false);
//     }
//   }, [hasMore, loadingMore, lastVisible, buildJobsQuery, jobs, selectedType, selectedExp, remoteOnly]);

//   // --- Refresh (clear cache + refetch) ---
//   const refreshJobs = useCallback(() => {
//     const cacheKey = getCacheKey(selectedType, selectedExp, remoteOnly);
//     if (typeof window !== 'undefined') {
//       sessionStorage.removeItem(cacheKey);
//     }
//     setLastVisible(null);
//     setHasMore(true);
//     fetchJobs(true);
//   }, [fetchJobs, selectedType, selectedExp, remoteOnly]);

//   // --- Reset all filters ---
//   const resetFilters = () => {
//     setSelectedType('All');
//     setSelectedExp('All');
//     setRemoteOnly(false);
//     setSearchTerm('');
//   };

//   // 1. Initial load on mount
//   useEffect(() => {
//     if (isFirstLoad.current) {
//       isFirstLoad.current = false;
//       fetchJobs(false);
//     }
//   }, [fetchJobs]);

//   // 2. Handle filter changes (type, exp, remote) - resets pagination
//   useEffect(() => {
//     // Skip on first load
//     if (isFirstLoad.current) return;
    
//     // Reset pagination
//     setLastVisible(null);
//     setHasMore(true);
//     fetchJobs(false);
//   }, [selectedType, selectedExp, remoteOnly, fetchJobs]);

//   // --- Client-side search filtering (Instant & Free) ---
//   const filteredJobs = useMemo(() => {
//     const term = searchTerm.trim().toLowerCase();
//     if (!term) return jobs;
    
//     return jobs.filter(job => {
//       const title = getJobTitle(job).toLowerCase();
//       const company = getCompanyName(job).toLowerCase();
//       const location = job.location?.toLowerCase() || '';
//       return company.includes(term) || location.includes(term) || title.includes(term);
//     });
//   }, [jobs, searchTerm]);

//   // --- Loading state ---
//   if (loading && isFirstLoad.current) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="w-10 h-10 border-4 border-neutral-100 border-t-orange-600 rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-neutral-50">
      
//       {/* 1. TOP HEADER & SEARCH */}
//       <div className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
//             {/* Left side: Back button + Title */}
//             <div className="flex items-center gap-4">
//               <Link 
//                 href="/dashboard" 
//                 className="text-neutral-500 hover:text-black transition-colors flex items-center gap-2 group"
//               >
//                 <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
//                 <span className="text-sm font-medium hidden sm:inline">Back</span>
//               </Link>
//               <div className="h-6 w-px bg-neutral-200 hidden sm:block" />
//               <h1 className="text-2xl font-black text-black tracking-tight">ALL Jobs</h1>
//             </div>

//             <div className="flex-1 max-w-2xl flex gap-2">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
//                 <input
//                   type="text"
//                   placeholder="Search jobs by title, company, or location..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 border border-transparent focus:bg-white focus:border-orange-500 rounded-xl outline-none transition-all text-black font-medium placeholder-neutral-500"
//                 />
//                 {searchTerm && (
//                   <button 
//                     onClick={() => setSearchTerm('')}
//                     className="absolute right-3 top-3 text-neutral-400 hover:text-black"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 )}
//               </div>
              
//               <button 
//                 onClick={() => setShowMobileFilters(!showMobileFilters)}
//                 className="md:hidden px-3 py-2 bg-black text-white rounded-xl"
//               >
//                 <Filter className="w-5 h-5" />
//               </button>

//               <button 
//                 onClick={refreshJobs}
//                 className="px-3 py-2 bg-neutral-200 hover:bg-neutral-300 text-black rounded-xl transition-colors flex items-center justify-center"
//                 title="Refresh jobs"
//               >
//                 <RefreshCw className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex items-start gap-8">
        
//         {/* 2. SIDEBAR FILTERS */}
//         <aside className={`
//           w-full md:w-64 flex-shrink-0 bg-white md:bg-transparent rounded-2xl md:rounded-none shadow-xl md:shadow-none p-6 md:p-0
//           fixed inset-0 z-40 md:static md:z-0 md:block
//           ${showMobileFilters ? 'block' : 'hidden'}
//         `}>
//           <div className="flex justify-between items-center md:hidden mb-6">
//             <h2 className="text-xl font-bold text-black">Filters</h2>
//             <button onClick={() => setShowMobileFilters(false)}><X className="w-6 h-6" /></button>
//           </div>

//           <div className="space-y-8 md:sticky md:top-24">
            
//             {/* Job Type */}
//             <div>
//               <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Job Type</h3>
//               <div className="space-y-2">
//                 {['All', 'Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
//                   <label key={type} className="flex items-center gap-3 cursor-pointer group">
//                     <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${selectedType === type ? 'bg-orange-600 border-orange-600' : 'bg-white border-neutral-300 group-hover:border-orange-400'}`}>
//                       {selectedType === type && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
//                     </div>
//                     <input 
//                       type="radio" 
//                       name="jobType" 
//                       className="hidden" 
//                       checked={selectedType === type}
//                       onChange={() => setSelectedType(type)} 
//                     />
//                     <span className={`text-sm ${selectedType === type ? 'text-black font-bold' : 'text-neutral-600'}`}>{type}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Remote Toggle */}
//             <div>
//               <label className="flex items-center gap-3 cursor-pointer group">
//                 <div className={`w-10 h-6 rounded-full p-1 transition-colors ${remoteOnly ? 'bg-orange-600' : 'bg-neutral-300'}`}>
//                   <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${remoteOnly ? 'translate-x-4' : 'translate-x-0'}`} />
//                 </div>
//                 <input 
//                   type="checkbox" 
//                   className="hidden" 
//                   checked={remoteOnly} 
//                   onChange={(e) => setRemoteOnly(e.target.checked)} 
//                 />
//                 <span className="text-sm font-bold text-black">Remote Only</span>
//               </label>
//             </div>

//             {/* Experience */}
//             <div>
//               <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Experience</h3>
//               <div className="flex flex-wrap gap-2">
//                 {['All', 'Entry', 'Mid', 'Senior'].map((exp) => (
//                   <button
//                     key={exp}
//                     onClick={() => setSelectedExp(exp)}
//                     className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
//                       selectedExp === exp 
//                         ? 'bg-black text-white border-black' 
//                         : 'bg-white text-neutral-600 border-neutral-200 hover:border-black'
//                     }`}
//                   >
//                     {exp}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Reset */}
//             <button 
//               onClick={resetFilters}
//               className="w-full py-2 text-xs font-bold text-neutral-400 hover:text-orange-600 transition-colors border-t border-neutral-200 pt-4 mt-4"
//             >
//               Reset all filters
//             </button>
//           </div>
//         </aside>

//         {/* 3. JOB LIST */}
//         <div className="flex-1 min-w-0">
          
//           {loading ? (
//             <div className="flex justify-center py-12">
//               <div className="w-10 h-10 border-4 border-neutral-100 border-t-orange-600 rounded-full animate-spin"></div>
//             </div>
//           ) : filteredJobs.length === 0 ? (
//             <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
//               <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🤔</div>
//               <h3 className="text-lg font-bold text-black mb-2">No jobs match your search</h3>
//               <p className="text-neutral-500 mb-6">Try adjusting your filters or keyword.</p>
//               <button 
//                 onClick={resetFilters}
//                 className="px-6 py-2 bg-black text-white rounded-lg text-sm font-bold"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           ) : (
//             <>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                 {filteredJobs.map((job) => {
//                   const external = isExternalJob(job);
//                   const salary = getSalaryDisplay(job.salary);
//                   const postedDate = formatRelativeTime(job.postedAt);
//                   const jobPreview = getJobPreview(job);

//                   return (
//                     <div 
//                       key={job.id} 
//                       className="group bg-white rounded-xl border border-neutral-200 p-5 hover:border-orange-300 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
//                     >
//                       <div className="flex-1">
//                         <div className="mb-3">
//                           <Link href={`/jobs/${job.id}`} className="block group-hover:text-orange-600 transition-colors">
//                             <h2 className="text-lg font-bold text-black line-clamp-1">
//                               {getJobTitle(job)}
//                             </h2>
//                           </Link>
//                           <div className="flex items-center gap-1 mt-1">
//                             <Building className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
//                             <p className="text-sm text-neutral-500 font-medium line-clamp-1">
//                               {getCompanyName(job)}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="mb-4">
//                           <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
//                             {jobPreview}
//                           </p>
//                         </div>

//                         <div className="flex flex-wrap gap-2 mb-4">
//                           <span className="inline-flex items-center px-2.5 py-1 bg-neutral-100 rounded-md text-xs font-medium text-neutral-600">
//                             <MapPin className="w-3 h-3 mr-1 text-neutral-400 flex-shrink-0" />
//                             <span className="truncate max-w-[80px]">{job.location || 'Remote'}</span>
//                           </span>
//                           <span className="inline-flex items-center px-2.5 py-1 bg-neutral-100 rounded-md text-xs font-medium text-neutral-600">
//                             <Briefcase className="w-3 h-3 mr-1 text-neutral-400 flex-shrink-0" />
//                             {getJobType(job)}
//                           </span>
//                           {salary && (
//                             <span className="inline-flex items-center px-2.5 py-1 bg-green-50 border border-green-100 rounded-md text-xs font-medium text-green-700">
//                               <DollarSign className="w-3 h-3 mr-0.5 flex-shrink-0" />
//                               <span className="truncate max-w-[80px]">{salary}</span>
//                             </span>
//                           )}
//                           {external && (
//                             <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">
//                               <Globe className="w-3 h-3 mr-1 flex-shrink-0" />
//                               External
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       <div className="border-t border-neutral-100 pt-4 mt-auto">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <div className="flex items-center gap-1 text-xs text-neutral-400">
//                               <Clock className="w-3 h-3" />
//                               {postedDate}
//                             </div>
//                             {postedDate === 'Recently' || postedDate.includes('h ago') || postedDate.includes('m ago') ? (
//                               <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
//                                 NEW
//                               </span>
//                             ) : null}
//                           </div>
                          
//                           <div className="flex gap-2">
//                             {external ? (
//                               <a 
//                                 href={job.jobLink} 
//                                 target="_blank" 
//                                 rel="noreferrer"
//                                 className="px-4 py-2 bg-white border border-neutral-300 hover:border-black text-black text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
//                               >
//                                 Apply
//                                 <ExternalLink className="w-3.5 h-3.5" />
//                               </a>
//                             ) : (
//                               <Link 
//                                 href={`/jobs/${job.id}`}
//                                 className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 group/btn"
//                               >
//                                 <Eye className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
//                                 Details
//                               </Link>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Load More Button */}
//               {hasMore && !loading && (
//                 <div className="flex justify-center mt-8">
//                   <button
//                     onClick={loadMoreJobs}
//                     disabled={loadingMore}
//                     className="px-6 py-3 bg-white border border-neutral-300 hover:border-black rounded-xl text-sm font-bold text-neutral-700 hover:text-black transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {loadingMore ? (
//                       <>
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                         Loading...
//                       </>
//                     ) : (
//                       <>
//                         <RefreshCw className="w-4 h-4" />
//                         Load More Jobs
//                       </>
//                     )}
//                   </button>
//                 </div>
//               )}

//               {/* Results Count */}
//               <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
//                 <p className="text-sm text-neutral-500">
//                   Showing <span className="font-bold text-black">{filteredJobs.length}</span> matching jobs
//                   {hasMore && <span className="text-neutral-400 ml-1">(load more below)</span>}
//                 </p>
//                 <p className="text-xs text-neutral-400 mt-1">
//                   Click on any job for full details and to apply
//                 </p>
//                 <p className="text-[10px] text-neutral-300 mt-2">
//                   💾 Cached for 5 minutes • <button onClick={refreshJobs} className="underline hover:text-black">Refresh now</button>
//                 </p>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function JobsPage() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Jobs page failed to load">
//       <JobsContent />
//     </ClientErrorBoundary>
//   );
// }


// ############################# Publish version 1 #############################
// ############################# Publish version 1 #############################
// ############################# Publish version 1 #############################
// ############################# Publish version 1 #############################
// ############################# Publish version 1 #############################
// ############################# Publish version 1 #############################

// 'use client';

// import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// import { 
//   collection, getDocs, orderBy, query, limit, startAfter, 
//   QueryDocumentSnapshot, DocumentData, doc, getDoc
// } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import Link from 'next/link';
// import ClientErrorBoundary from '@/components/ClientErrorBoundary';
// import { 
//   Search, MapPin, Briefcase, DollarSign, Clock, Filter, 
//   ExternalLink, Building, X, CheckCircle2, 
//   RefreshCw, TrendingUp, ChevronRight, Loader2, ArrowLeft
// } from 'lucide-react';

// // --- Types ---
// interface Job {
//   id: string;
//   title: string;
//   jobTitle?: string;
//   company: string;
//   companyName?: string;
//   location: string;
//   type: string;
//   jobType?: string;
//   salary: string;
//   description: string;
//   requirements: string | string[];
//   postedAt: any;
//   jobLink?: string;
//   isExternal?: boolean;
//   source?: string;
//   experience?: string;
//   education?: string;
//   remote?: boolean;
//   isActive?: boolean;
// }

// // --- Cache Helpers ---
// const CACHE_EXPIRY_MS = 5 * 60 * 1000; 

// interface CacheData {
//   jobs: Job[];
//   hasMore: boolean;
//   lastDocId: string | null;
//   timestamp: number;
// }

// const getCacheKey = (): string => 'jobs_cache_master_list';

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
//     return data as CacheData;
//   } catch (e) {
//     return null;
//   }
// };

// const setCachedData = (key: string, jobs: Job[], hasMore: boolean, lastDocId: string | null): void => {
//   if (typeof window === 'undefined') return;
//   try {
//     sessionStorage.setItem(key, JSON.stringify({ 
//       jobs, 
//       hasMore, 
//       lastDocId,
//       timestamp: Date.now() 
//     }));
//   } catch (e) {}
// };

// // --- UI Helpers ---
// const getJobTitle = (j: Job): string => j.jobTitle || j.title || 'Untitled';
// const getCompanyName = (j: Job): string => j.companyName || j.company || 'Unknown';
// const getJobType = (j: Job): string => j.jobType || j.type || 'Full-time';

// const isExternalJob = (j: Job): boolean => !!(j.jobLink && j.jobLink.length > 5) || !!j.isExternal;

// const getCompanyStyle = (company: string) => {
//   const styles = [
//     { bg: 'bg-blue-100', text: 'text-blue-700' },
//     { bg: 'bg-purple-100', text: 'text-purple-700' },
//     { bg: 'bg-emerald-100', text: 'text-emerald-700' },
//     { bg: 'bg-orange-100', text: 'text-orange-700' },
//     { bg: 'bg-pink-100', text: 'text-pink-700' },
//   ];
//   const index = company.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % styles.length;
//   return styles[index];
// };

// const truncateText = (text: string, maxLength: number = 140): string => {
//   if (!text || text.length <= maxLength) return text;
//   return text.substring(0, maxLength).trim() + '...';
// };

// const formatRelativeTime = (timestamp: any): string => {
//   if (!timestamp) return 'Recently';
//   let date: Date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
//   const diffDays = Math.ceil(Math.abs(new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
//   if (diffDays < 1) return 'Today';
//   if (diffDays === 1) return 'Yesterday';
//   if (diffDays < 7) return `${diffDays}d ago`;
//   if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
//   return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
// };

// const mapDocToJob = (doc: QueryDocumentSnapshot<DocumentData>): Job => {
//   const data = doc.data();
//   return {
//     id: doc.id,
//     title: data.title || data.jobTitle || 'Untitled',
//     jobTitle: data.jobTitle,
//     company: data.company || data.companyName || 'Unknown',
//     companyName: data.companyName,
//     location: data.location || 'Remote',
//     type: data.type || data.jobType || 'Full-time',
//     jobType: data.jobType,
//     salary: data.salary || '',
//     description: data.description || '',
//     requirements: data.requirements || [],
//     postedAt: data.postedAt,
//     jobLink: data.jobLink,
//     isExternal: data.isExternal || false,
//     source: data.source,
//     experience: data.experience || '',
//     remote: data.remote || false,
//     isActive: data.isActive !== undefined ? data.isActive : true,
//   };
// };

// // --- SKELETON LOADER ---
// const JobSkeleton = () => (
//   <div className="bg-white rounded-2xl border border-neutral-200 p-6 animate-pulse h-full flex flex-col">
//     <div className="flex gap-4 mb-4">
//       <div className="w-12 h-12 bg-neutral-100 rounded-xl flex-shrink-0"></div>
//       <div className="flex-1 space-y-2 py-1">
//         <div className="h-4 bg-neutral-100 rounded w-3/4"></div>
//         <div className="h-3 bg-neutral-100 rounded w-1/2"></div>
//       </div>
//     </div>
//     <div className="space-y-2 mb-6">
//       <div className="h-3 bg-neutral-50 rounded w-full"></div>
//       <div className="h-3 bg-neutral-50 rounded w-5/6"></div>
//     </div>
//     <div className="flex gap-2 mt-auto pt-4 border-t border-neutral-50">
//       <div className="h-8 bg-neutral-100 rounded-lg w-20"></div>
//       <div className="h-8 bg-neutral-100 rounded-lg w-24"></div>
//     </div>
//   </div>
// );

// // --- MAIN COMPONENT ---
// function JobsContent() {
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [lastDocId, setLastDocId] = useState<string | null>(null);
  
//   // Filters
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedType, setSelectedType] = useState<string>('All');
//   const [selectedExp, setSelectedExp] = useState<string>('All');
//   const [remoteOnly, setRemoteOnly] = useState(false);
//   const [showMobileFilters, setShowMobileFilters] = useState(false);
  
//   const isFirstLoad = useRef(true);
//   const popularTags = ["React", "Remote", "Marketing", "Product Manager", "Entry Level"];

//   // 🚀 OPTIMIZED FETCH: 50 jobs at a time
//   const fetchJobs = useCallback(async (isRefresh = false) => {
//     const cacheKey = getCacheKey();

//     // Check cache first
//     if (!isRefresh && typeof window !== 'undefined') {
//       const cached = getCachedData(cacheKey);
//       if (cached && cached.jobs.length > 0) {
//         setJobs(cached.jobs);
//         setHasMore(cached.hasMore);
//         setLastDocId(cached.lastDocId || null);
//         setLoading(false);
//         return; 
//       }
//     }

//     setLoading(true);
//     try {
//       const q = query(
//         collection(db, 'jobs'),
//         orderBy('postedAt', 'desc'),
//         limit(50)
//       );
      
//       const snapshot = await getDocs(q);
//       const jobsList: Job[] = [];
//       snapshot.forEach((doc) => jobsList.push(mapDocToJob(doc)));
      
//       const hasMoreData = snapshot.docs.length === 50;
//       const lastId = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : null;
      
//       setJobs(jobsList);
//       setLastDocId(lastId);
//       setHasMore(hasMoreData);
//       setCachedData(cacheKey, jobsList, hasMoreData, lastId);
//     } catch (error) {
//       console.error('Error fetching jobs:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // ✅ FIXED: Load more jobs using only lastDocId
//   const loadMoreJobs = useCallback(async () => {
//     if (!hasMore || loadingMore) return;
    
//     // If we don't have a lastDocId, we can't load more
//     if (!lastDocId) {
//       console.error('No last document ID available');
//       return;
//     }
    
//     setLoadingMore(true);
//     try {
//       // First, get the last document snapshot using its ID
//       const docRef = doc(db, 'jobs', lastDocId);
//       const docSnap = await getDoc(docRef);
      
//       if (!docSnap.exists()) {
//         console.error('Last document not found');
//         setLoadingMore(false);
//         return;
//       }
      
//       // Convert to QueryDocumentSnapshot
//       const lastSnapshot = docSnap as QueryDocumentSnapshot<DocumentData>;
      
//       // Query for the next 50 jobs
//       const q = query(
//         collection(db, 'jobs'),
//         orderBy('postedAt', 'desc'),
//         startAfter(lastSnapshot),
//         limit(50)
//       );
      
//       const snapshot = await getDocs(q);
      
//       const newJobs: Job[] = [...jobs];
//       snapshot.forEach((doc) => newJobs.push(mapDocToJob(doc)));
      
//       const hasMoreData = snapshot.docs.length === 50;
//       const newLastId = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : null;
      
//       setJobs(newJobs);
//       setLastDocId(newLastId);
//       setHasMore(hasMoreData);
      
//       // Update cache with the new data
//       const cacheKey = getCacheKey();
//       setCachedData(cacheKey, newJobs, hasMoreData, newLastId);
//     } catch (error) {
//       console.error('Error loading more jobs:', error);
//     } finally {
//       setLoadingMore(false);
//     }
//   }, [hasMore, loadingMore, lastDocId, jobs]);

//   const refreshJobs = () => {
//     if (typeof window !== 'undefined') sessionStorage.removeItem(getCacheKey());
//     setLastDocId(null);
//     setHasMore(true);
//     fetchJobs(true);
//   };

//   useEffect(() => {
//     if (isFirstLoad.current) {
//       isFirstLoad.current = false;
//       fetchJobs(false);
//     }
//   }, [fetchJobs]);

//   const resetFilters = () => {
//     setSelectedType('All');
//     setSelectedExp('All');
//     setRemoteOnly(false);
//     setSearchTerm('');
//   };

//   // 🔥 FIXED: Search ONLY in Title, Company, and Location (NOT Description)
//   const filteredJobs = useMemo(() => {
//     return jobs.filter(job => {
//       // 1. Tokenized Search (ONLY in title, company, location)
//       let textMatch = true;
//       const term = searchTerm.trim().toLowerCase();
//       if (term) {
//         const searchableText = `
//           ${getJobTitle(job)} 
//           ${getCompanyName(job)} 
//           ${job.location || ''}
//         `.toLowerCase();
        
//         const tokens = term.split(/\s+/);
//         textMatch = tokens.every(token => searchableText.includes(token));
//       }

//       // 2. Forgiving Type Match
//       let typeMatch = true;
//       if (selectedType !== 'All') {
//         const dbType = (job.type || job.jobType || '').toLowerCase().replace(/[-_ ]/g, '');
//         const filterType = selectedType.toLowerCase().replace(/[-_ ]/g, '');
//         typeMatch = dbType.includes(filterType);
//       }

//       // 3. Experience Match
//       let expMatch = true;
//       if (selectedExp !== 'All') {
//         const e = (job.experience || '').toLowerCase();
//         expMatch = e.includes(selectedExp.toLowerCase());
//       }

//       // 4. Remote Match
//       let remoteMatch = true;
//       if (remoteOnly) {
//         remoteMatch = job.remote === true || (job.location || '').toLowerCase().includes('remote');
//       }

//       // 5. Active check
//       const isActiveMatch = job.isActive !== false;

//       return textMatch && typeMatch && expMatch && remoteMatch && isActiveMatch;
//     });
//   }, [jobs, searchTerm, selectedType, selectedExp, remoteOnly]);

//   return (
//     <div className="min-h-screen bg-[#F8F9FA] pb-20">
      
//       {/* 🚀 STICKY HEADER WITH BACK BUTTON */}
//       <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Link 
//               href="/dashboard" 
//               className="flex items-center gap-1.5 text-neutral-500 hover:text-black transition-colors group"
//             >
//               <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
//               <span className="text-sm font-medium hidden sm:inline">Back</span>
//             </Link>
//             <div className="h-5 w-px bg-neutral-200 hidden sm:block" />
//             <h1 className="text-lg font-black text-black">ALL Jobs</h1>
//           </div>
//           <button onClick={refreshJobs} className="text-sm font-medium text-neutral-500 hover:text-black flex items-center gap-1.5 bg-neutral-100 px-3 py-1.5 rounded-lg transition-colors">
//             <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> <span className="hidden sm:inline">Refresh</span>
//           </button>
//         </div>
//       </div>

//       {/* 🚀 HERO SECTION */}
//       <div className="bg-white border-b border-neutral-200 pt-8 pb-12 px-6 shadow-sm relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
//         <div className="absolute bottom-0 left-10 w-48 h-48 bg-blue-500 rounded-full blur-[100px] opacity-5 pointer-events-none"></div>
        
//         <div className="max-w-4xl mx-auto text-center relative z-10">
//           <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight mb-4">
//             Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">opportunity.</span>
//           </h1>
//           <p className="text-neutral-500 text-lg mb-8 max-w-2xl mx-auto">
//             Discover hundreds of jobs from top companies hiring in India and globally.
//           </p>

//           {/* ✅ SEARCH BAR – Search button always visible */}
//           <div className="relative max-w-2xl mx-auto shadow-xl rounded-2xl bg-white border border-neutral-200 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 transition-all flex items-center p-2">
//             <Search className="w-6 h-6 text-neutral-400 ml-3 flex-shrink-0" />
//             <input
//               type="text"
//               placeholder="Search by role, skill, or company (e.g. 'React', 'Google')..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full px-4 py-3 bg-transparent text-black font-medium outline-none placeholder-neutral-400"
//             />
//             {searchTerm && (
//               <button onClick={() => setSearchTerm('')} className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-xl transition-colors">
//                 <X className="w-5 h-5" />
//               </button>
//             )}
//             <button 
//               onClick={() => {}} 
//               className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors ml-2 whitespace-nowrap"
//             >
//               Search
//             </button>
//           </div>

//           <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
//             <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mr-2 flex items-center">
//               <TrendingUp className="w-3 h-3 mr-1"/> Trending:
//             </span>
//             {popularTags.map(tag => (
//               <button 
//                 key={tag} 
//                 onClick={() => setSearchTerm(tag)}
//                 className="text-xs font-medium bg-white border border-neutral-200 text-neutral-600 px-3 py-1.5 rounded-full hover:border-orange-500 hover:text-orange-600 transition-colors shadow-sm"
//               >
//                 {tag}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-start gap-8">
        
//         {/* 2. SIDEBAR FILTERS (Sticky on Desktop) */}
//         <aside className="w-full md:w-64 flex-shrink-0 space-y-6 sticky top-6">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-black text-black flex items-center gap-2">
//               <Filter className="w-5 h-5"/> Filters
//             </h2>
//             {(searchTerm || selectedType !== 'All' || selectedExp !== 'All' || remoteOnly) && (
//               <button onClick={resetFilters} className="text-xs font-bold text-orange-600 hover:underline">
//                 Clear All
//               </button>
//             )}
//           </div>

//           <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-6">
//             <div>
//               <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Job Type</h3>
//               <div className="space-y-3">
//                 {['All', 'Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
//                   <label key={type} className="flex items-center gap-3 cursor-pointer group">
//                     <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${selectedType === type ? 'bg-orange-600 border-orange-600' : 'bg-neutral-50 border-neutral-300 group-hover:border-orange-400'}`}>
//                       {selectedType === type && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
//                     </div>
//                     <span className={`text-sm ${selectedType === type ? 'text-black font-bold' : 'text-neutral-600 group-hover:text-black'}`}>{type}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             <div className="pt-4 border-t border-neutral-100">
//               <label className="flex items-center gap-3 cursor-pointer group">
//                 <div className={`w-10 h-6 rounded-full p-1 transition-colors ${remoteOnly ? 'bg-orange-600' : 'bg-neutral-200'}`}>
//                   <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${remoteOnly ? 'translate-x-4' : 'translate-x-0'}`} />
//                 </div>
//                 <span className="text-sm font-bold text-black">Remote Only</span>
//               </label>
//             </div>

//             <div className="pt-4 border-t border-neutral-100">
//               <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Experience Level</h3>
//               <div className="flex flex-wrap gap-2">
//                 {['All', 'Entry', 'Mid', 'Senior'].map((exp) => (
//                   <button
//                     key={exp}
//                     onClick={() => setSelectedExp(exp)}
//                     className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
//                       selectedExp === exp 
//                         ? 'bg-black text-white border-black shadow-md' 
//                         : 'bg-white text-neutral-600 border-neutral-200 hover:border-black'
//                     }`}
//                   >
//                     {exp}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* 3. JOB LISTING GRID */}
//         <div className="flex-1 min-w-0">
          
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-black text-black">
//               {loading && isFirstLoad.current ? 'Loading jobs...' : `${filteredJobs.length} Jobs Found`}
//             </h2>
//             <button onClick={refreshJobs} className="text-sm font-medium text-neutral-500 hover:text-black flex items-center gap-1.5 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg shadow-sm transition-colors">
//               <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
//             </button>
//           </div>

//           {loading && isFirstLoad.current ? (
//             <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
//               {Array.from({ length: 8 }).map((_, i) => <JobSkeleton key={i} />)}
//             </div>
//           ) : filteredJobs.length === 0 ? (
//             <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center shadow-sm">
//               <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
//                 <Search className="w-10 h-10 text-orange-500" />
//               </div>
//               <h3 className="text-2xl font-black text-black mb-2">No jobs match your criteria</h3>
//               <p className="text-neutral-500 mb-8 max-w-md mx-auto">
//                 We couldn't find any roles matching your exact filters. Try adjusting your keywords or clearing some filters to see more opportunities.
//               </p>
//               <button 
//                 onClick={resetFilters}
//                 className="px-8 py-3 bg-black text-white rounded-xl text-sm font-bold shadow-lg hover:bg-neutral-800 transition-colors"
//               >
//                 Clear All Filters
//               </button>
//             </div>
//           ) : (
//             <>
//               <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
//                 {filteredJobs.map((job) => {
//                   const external = isExternalJob(job);
//                   const salary = job.salary && job.salary !== 'Not specified' ? job.salary : null;
//                   const postedDate = formatRelativeTime(job.postedAt);
//                   const cStyle = getCompanyStyle(getCompanyName(job));

//                   return (
//                     <div 
//                       key={job.id} 
//                       className="group bg-white rounded-2xl border border-neutral-200 p-6 hover:border-black hover:shadow-xl transition-all duration-300 flex flex-col relative"
//                     >
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="flex items-center gap-4">
//                           <div className={`w-14 h-14 rounded-xl ${cStyle.bg} ${cStyle.text} flex items-center justify-center text-xl font-black shadow-inner`}>
//                             {getCompanyName(job).charAt(0)}
//                           </div>
//                           <div>
//                             <p className="text-sm font-bold text-neutral-500 mb-0.5 flex items-center gap-1.5">
//                               {getCompanyName(job)}
//                               {postedDate === 'Today' && <span className="bg-orange-100 text-orange-600 text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">New</span>}
//                             </p>
//                             <Link href={`/jobs/${job.id}`} className="block group-hover:text-orange-600 transition-colors">
//                               <h2 className="text-lg font-black text-black leading-tight line-clamp-1" title={getJobTitle(job)}>
//                                 {getJobTitle(job)}
//                               </h2>
//                             </Link>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex flex-wrap gap-2 mb-5">
//                         <span className="inline-flex items-center px-2.5 py-1 bg-neutral-100 rounded-lg text-xs font-bold text-neutral-600">
//                           <MapPin className="w-3.5 h-3.5 mr-1 text-neutral-400" />
//                           <span className="truncate max-w-[100px]">{job.location || 'Remote'}</span>
//                         </span>
//                         <span className="inline-flex items-center px-2.5 py-1 bg-neutral-100 rounded-lg text-xs font-bold text-neutral-600">
//                           <Briefcase className="w-3.5 h-3.5 mr-1 text-neutral-400" />
//                           {getJobType(job)}
//                         </span>
//                         {salary && (
//                           <span className="inline-flex items-center px-2.5 py-1 bg-green-50 border border-green-200 rounded-lg text-xs font-bold text-green-700">
//                             <DollarSign className="w-3.5 h-3.5 mr-0.5" />
//                             <span className="truncate max-w-[100px]">{salary}</span>
//                           </span>
//                         )}
//                       </div>

//                       <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed mb-6">
//                         {truncateText(job.description?.replace(/<[^>]*>?/gm, ''), 150) || "Click to view full job description and requirements."}
//                       </p>

//                       <div className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-100">
//                         <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-400">
//                           <Clock className="w-4 h-4" />
//                           {postedDate}
//                         </div>
                        
//                         {external ? (
//                           <a 
//                             href={job.jobLink} 
//                             target="_blank" 
//                             rel="noreferrer"
//                             className="px-5 py-2.5 bg-white border-2 border-neutral-200 hover:border-black text-black text-sm font-black rounded-xl transition-all flex items-center gap-2 shadow-sm"
//                           >
//                             Apply External
//                             <ExternalLink className="w-4 h-4" />
//                           </a>
//                         ) : (
//                           <Link 
//                             href={`/jobs/${job.id}`}
//                             className="px-5 py-2.5 bg-black text-white text-sm font-black rounded-xl hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20 transition-all flex items-center gap-2 transform active:scale-95"
//                           >
//                             View Details
//                             <ChevronRight className="w-4 h-4" />
//                           </Link>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {hasMore && !loading && (
//                 <div className="flex justify-center mt-10">
//                   <button
//                     onClick={loadMoreJobs}
//                     disabled={loadingMore}
//                     className="px-8 py-3.5 bg-white border-2 border-neutral-200 hover:border-black rounded-xl text-sm font-black text-black transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
//                   >
//                     {loadingMore ? (
//                       <><Loader2 className="w-5 h-5 animate-spin" /> Loading more...</>
//                     ) : (
//                       <><RefreshCw className="w-5 h-5" /> Load More Opportunities</>
//                     )}
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function JobsPage() {
//   return (
//     <ClientErrorBoundary fallbackMessage="Jobs page failed to load">
//       <JobsContent />
//     </ClientErrorBoundary>
//   );
// }


'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  collection, getDocs, orderBy, query, limit, startAfter, 
  QueryDocumentSnapshot, DocumentData, doc, getDoc,
  startAt, endAt
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import ClientErrorBoundary from '@/components/ClientErrorBoundary';
import { 
  Search, MapPin, Briefcase, DollarSign, Clock, Filter, 
  ExternalLink, Building, X, CheckCircle2, 
  RefreshCw, TrendingUp, ChevronRight, Loader2, ArrowLeft
} from 'lucide-react';

// --- Types ---
interface Job {
  id: string;
  title: string;
  jobTitle?: string;
  company: string;
  companyName?: string;
  location: string;
  type: string;
  jobType?: string;
  salary: string;
  description: string;
  requirements: string | string[];
  postedAt: any;
  jobLink?: string;
  isExternal?: boolean;
  source?: string;
  experience?: string;
  education?: string;
  remote?: boolean;
  isActive?: boolean;
}

// --- Cache Helpers ---
const CACHE_EXPIRY_MS = 5 * 60 * 1000; 

interface CacheData {
  jobs: Job[];
  hasMore: boolean;
  lastDocId: string | null;
  timestamp: number;
}

const getCacheKey = (prefix: string = 'jobs', searchTerm: string = ''): string => {
  if (searchTerm.trim()) {
    return `jobs_search_${searchTerm.trim().toLowerCase()}`;
  }
  return `${prefix}_master_list`;
};

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
    return data as CacheData;
  } catch (e) {
    return null;
  }
};

const setCachedData = (key: string, jobs: Job[], hasMore: boolean, lastDocId: string | null): void => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, JSON.stringify({ 
      jobs, 
      hasMore, 
      lastDocId,
      timestamp: Date.now() 
    }));
  } catch (e) {}
};

// --- UI Helpers ---
const getJobTitle = (j: Job): string => j.jobTitle || j.title || 'Untitled';
const getCompanyName = (j: Job): string => j.companyName || j.company || 'Unknown';
const getJobType = (j: Job): string => j.jobType || j.type || 'Full-time';

const isExternalJob = (j: Job): boolean => !!(j.jobLink && j.jobLink.length > 5) || !!j.isExternal;

const getCompanyStyle = (company: string) => {
  const styles = [
    { bg: 'bg-blue-100', text: 'text-blue-700' },
    { bg: 'bg-purple-100', text: 'text-purple-700' },
    { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    { bg: 'bg-orange-100', text: 'text-orange-700' },
    { bg: 'bg-pink-100', text: 'text-pink-700' },
  ];
  const index = company.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % styles.length;
  return styles[index];
};

const truncateText = (text: string, maxLength: number = 140): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

const formatRelativeTime = (timestamp: any): string => {
  if (!timestamp) return 'Recently';
  let date: Date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  const diffDays = Math.ceil(Math.abs(new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 1) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const mapDocToJob = (doc: QueryDocumentSnapshot<DocumentData>): Job => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title || data.jobTitle || 'Untitled',
    jobTitle: data.jobTitle,
    company: data.company || data.companyName || 'Unknown',
    companyName: data.companyName,
    location: data.location || 'Remote',
    type: data.type || data.jobType || 'Full-time',
    jobType: data.jobType,
    salary: data.salary || '',
    description: data.description || '',
    requirements: data.requirements || [],
    postedAt: data.postedAt,
    jobLink: data.jobLink,
    isExternal: data.isExternal || false,
    source: data.source,
    experience: data.experience || '',
    remote: data.remote || false,
    isActive: data.isActive !== undefined ? data.isActive : true,
  };
};

// --- SKELETON LOADER ---
const JobSkeleton = () => (
  <div className="bg-white rounded-2xl border border-neutral-200 p-6 animate-pulse h-full flex flex-col">
    <div className="flex gap-4 mb-4">
      <div className="w-12 h-12 bg-neutral-100 rounded-xl flex-shrink-0"></div>
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-neutral-100 rounded w-3/4"></div>
        <div className="h-3 bg-neutral-100 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-2 mb-6">
      <div className="h-3 bg-neutral-50 rounded w-full"></div>
      <div className="h-3 bg-neutral-50 rounded w-5/6"></div>
    </div>
    <div className="flex gap-2 mt-auto pt-4 border-t border-neutral-50">
      <div className="h-8 bg-neutral-100 rounded-lg w-20"></div>
      <div className="h-8 bg-neutral-100 rounded-lg w-24"></div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
function JobsContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDocId, setLastDocId] = useState<string | null>(null);
  
  // Search Results State
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchHasMore, setSearchHasMore] = useState(false);
  const [searchLastDoc, setSearchLastDoc] = useState<string | null>(null);
  const [searchLoadingMore, setSearchLoadingMore] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedExp, setSelectedExp] = useState<string>('All');
  const [remoteOnly, setRemoteOnly] = useState(false);
  
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstLoad = useRef(true);
  const popularTags = ["React", "Remote", "Marketing", "Product Manager", "Entry Level"];

  // --- MAIN FETCH (browse mode) ---
  const fetchJobs = useCallback(async (isRefresh = false) => {
    const cacheKey = getCacheKey('jobs', '');
    if (!isRefresh && typeof window !== 'undefined') {
      const cached = getCachedData(cacheKey);
      if (cached && cached.jobs.length > 0) {
        setJobs(cached.jobs);
        setHasMore(cached.hasMore);
        setLastDocId(cached.lastDocId || null);
        setLoading(false);
        return; 
      }
    }
    setLoading(true);
    try {
      const q = query(
        collection(db, 'jobs'),
        orderBy('postedAt', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      const jobsList: Job[] = [];
      snapshot.forEach((doc) => jobsList.push(mapDocToJob(doc)));
      const hasMoreData = snapshot.docs.length === 50;
      const lastId = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : null;
      setJobs(jobsList);
      setLastDocId(lastId);
      setHasMore(hasMoreData);
      setCachedData(cacheKey, jobsList, hasMoreData, lastId);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMoreJobs = useCallback(async () => {
    if (!hasMore || loadingMore || !lastDocId) return;
    setLoadingMore(true);
    try {
      const docRef = doc(db, 'jobs', lastDocId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) { setLoadingMore(false); return; }
      const lastSnapshot = docSnap as QueryDocumentSnapshot<DocumentData>;
      const q = query(
        collection(db, 'jobs'),
        orderBy('postedAt', 'desc'),
        startAfter(lastSnapshot),
        limit(50)
      );
      const snapshot = await getDocs(q);
      const newJobs: Job[] = [...jobs];
      snapshot.forEach((doc) => newJobs.push(mapDocToJob(doc)));
      const hasMoreData = snapshot.docs.length === 50;
      const newLastId = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : null;
      setJobs(newJobs);
      setLastDocId(newLastId);
      setHasMore(hasMoreData);
      const cacheKey = getCacheKey('jobs', '');
      setCachedData(cacheKey, newJobs, hasMoreData, newLastId);
    } catch (error) {
      console.error('Error loading more jobs:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, lastDocId, jobs]);

  // --- 🔥 SEARCH FUNCTION (Fixed) ---
  const performSearch = useCallback(async (term: string, isLoadMore = false) => {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) {
      setIsSearchMode(false);
      setSearchResults([]);
      setSearchHasMore(false);
      setSearchLastDoc(null);
      return;
    }

    setIsSearchMode(true);
    const cacheKey = getCacheKey('search', trimmedTerm);

    if (!isLoadMore) {
      const cached = getCachedData(cacheKey);
      if (cached && cached.jobs.length > 0) {
        setSearchResults(cached.jobs);
        setSearchHasMore(cached.hasMore);
        setSearchLastDoc(cached.lastDocId || null);
        setSearchLoading(false);
        return;
      }
    }

    if (!isLoadMore) setSearchLoading(true);
    else setSearchLoadingMore(true);

    try {
      // Generate case variants
      const variants = [
        trimmedTerm,
        trimmedTerm.toLowerCase(),
        trimmedTerm.charAt(0).toUpperCase() + trimmedTerm.slice(1).toLowerCase()
      ];
      const uniqueVariants = [...new Set(variants)];
      const fields = ['title', 'jobTitle'];
      const limitPerQuery = 20;

      let allResults: Job[] = [];

      for (const field of fields) {
        for (const variant of uniqueVariants) {
          const q = query(
            collection(db, 'jobs'),
            orderBy(field),
            startAt(variant),
            endAt(variant + '\uf8ff'),
            limit(limitPerQuery)
          );
          const snapshot = await getDocs(q);
          snapshot.forEach((doc) => {
            const job = mapDocToJob(doc);
            if (!allResults.some(j => j.id === job.id)) {
              allResults.push(job);
            }
          });
        }
      }

      // Client-side filters
      let filtered = allResults.filter(job => {
        if (selectedType !== 'All') {
          const dbType = (job.type || job.jobType || '').toLowerCase().replace(/[-_ ]/g, '');
          const filterType = selectedType.toLowerCase().replace(/[-_ ]/g, '');
          if (!dbType.includes(filterType)) return false;
        }
        if (selectedExp !== 'All') {
          const exp = (job.experience || '').toLowerCase();
          if (!exp.includes(selectedExp.toLowerCase())) return false;
        }
        if (remoteOnly) {
          const isRemote = job.remote === true || (job.location || '').toLowerCase().includes('remote');
          if (!isRemote) return false;
        }
        return true;
      });

      // Sort by postedAt
      filtered.sort((a, b) => {
        const dateA = a.postedAt?.toDate?.() || new Date(a.postedAt);
        const dateB = b.postedAt?.toDate?.() || new Date(b.postedAt);
        return dateB.getTime() - dateA.getTime();
      });

      // For pagination, we slice first 20, but we'll keep all for "Load More"
      const displayResults = filtered.slice(0, 20);
      const hasMoreData = filtered.length > 20;
      const lastId = displayResults.length > 0 ? displayResults[displayResults.length - 1].id : null;

      if (!isLoadMore) {
        setSearchResults(displayResults);
        setSearchHasMore(hasMoreData);
        setSearchLastDoc(lastId);
        setCachedData(cacheKey, displayResults, hasMoreData, lastId);
      } else {
        // Load more: we already have all results, so show all
        setSearchResults(filtered);
        setSearchHasMore(false);
        setSearchLastDoc(null);
        setCachedData(cacheKey, filtered, false, null);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setSearchHasMore(false);
    } finally {
      if (!isLoadMore) setSearchLoading(false);
      else setSearchLoadingMore(false);
    }
  }, [selectedType, selectedExp, remoteOnly]);

  // --- Load More for Search ---
  const loadMoreSearch = useCallback(async () => {
    // Since we already fetched all results in the first search, we just show all
    if (searchHasMore) {
      // Re-run search without pagination limit
      await performSearch(searchTerm, true);
    }
  }, [searchHasMore, searchTerm, performSearch]);

  const refreshJobs = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(getCacheKey('jobs', ''));
      if (searchTerm.trim()) sessionStorage.removeItem(getCacheKey('search', searchTerm.trim()));
    }
    setLastDocId(null);
    setHasMore(true);
    setSearchResults([]);
    setSearchHasMore(false);
    setSearchLastDoc(null);
    setIsSearchMode(false);
    fetchJobs(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      if (value.trim()) {
        performSearch(value, false);
      } else {
        setIsSearchMode(false);
        setSearchResults([]);
        setSearchHasMore(false);
        setSearchLastDoc(null);
      }
    }, 500);
  };

  const handleSearchClick = () => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (searchTerm.trim()) {
      performSearch(searchTerm.trim(), false);
    } else {
      setIsSearchMode(false);
      setSearchResults([]);
      setSearchHasMore(false);
      setSearchLastDoc(null);
    }
  };

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      fetchJobs(false);
    }
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [fetchJobs]);

  const resetFilters = () => {
    setSelectedType('All');
    setSelectedExp('All');
    setRemoteOnly(false);
    setSearchTerm('');
    setIsSearchMode(false);
    setSearchResults([]);
    setSearchHasMore(false);
    setSearchLastDoc(null);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
  };

  // Determine display data
  const displayJobs = isSearchMode ? searchResults : jobs;
  const displayLoading = isSearchMode ? searchLoading : loading;
  const displayHasMore = isSearchMode ? searchHasMore : hasMore;
  const displayLoadingMore = isSearchMode ? searchLoadingMore : loadingMore;

  const handleLoadMore = () => {
    if (isSearchMode) {
      loadMoreSearch();
    } else {
      loadMoreJobs();
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-1.5 text-neutral-500 hover:text-black transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-sm font-medium hidden sm:inline">Back</span>
            </Link>
            <div className="h-5 w-px bg-neutral-200 hidden sm:block" />
            <h1 className="text-lg font-black text-black">ALL Jobs</h1>
            {isSearchMode && (
              <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                Searching: {searchTerm}
              </span>
            )}
          </div>
          <button onClick={refreshJobs} className="text-sm font-medium text-neutral-500 hover:text-black flex items-center gap-1.5 bg-neutral-100 px-3 py-1.5 rounded-lg transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading || searchLoading ? 'animate-spin' : ''}`} /> <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Hero Section with Search */}
      <div className="bg-white border-b border-neutral-200 pt-8 pb-12 px-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-blue-500 rounded-full blur-[100px] opacity-5 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight mb-4">
            Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">opportunity.</span>
          </h1>
          <p className="text-neutral-500 text-lg mb-8 max-w-2xl mx-auto">
            Discover hundreds of jobs from top companies hiring in India and globally.
          </p>

          <div className="relative max-w-2xl mx-auto shadow-xl rounded-2xl bg-white border border-neutral-200 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 transition-all flex items-center p-2">
            <Search className="w-6 h-6 text-neutral-400 ml-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by role, skill, or company (e.g. 'React', 'Google')..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 bg-transparent text-black font-medium outline-none placeholder-neutral-400"
            />
            {searchTerm && (
              <button onClick={() => {
                setSearchTerm('');
                setIsSearchMode(false);
                setSearchResults([]);
                setSearchHasMore(false);
                setSearchLastDoc(null);
                if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
              }} className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            )}
            <button onClick={handleSearchClick} className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors ml-2 whitespace-nowrap">
              Search
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mr-2 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1"/> Trending:
            </span>
            {popularTags.map(tag => (
              <button key={tag} onClick={() => {
                setSearchTerm(tag);
                performSearch(tag, false);
              }} className="text-xs font-medium bg-white border border-neutral-200 text-neutral-600 px-3 py-1.5 rounded-full hover:border-orange-500 hover:text-orange-600 transition-colors shadow-sm">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-start gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-6 sticky top-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-black flex items-center gap-2">
              <Filter className="w-5 h-5"/> Filters
            </h2>
            {(searchTerm || selectedType !== 'All' || selectedExp !== 'All' || remoteOnly) && (
              <button onClick={resetFilters} className="text-xs font-bold text-orange-600 hover:underline">
                Clear All
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-6">
            <div>
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Job Type</h3>
              <div className="space-y-3">
                {['All', 'Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${selectedType === type ? 'bg-orange-600 border-orange-600' : 'bg-neutral-50 border-neutral-300 group-hover:border-orange-400'}`}>
                      {selectedType === type && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`text-sm ${selectedType === type ? 'text-black font-bold' : 'text-neutral-600 group-hover:text-black'}`}>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${remoteOnly ? 'bg-orange-600' : 'bg-neutral-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${remoteOnly ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <span className="text-sm font-bold text-black">Remote Only</span>
              </label>
            </div>

            <div className="pt-4 border-t border-neutral-100">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Experience Level</h3>
              <div className="flex flex-wrap gap-2">
                {['All', 'Entry', 'Mid', 'Senior'].map((exp) => (
                  <button
                    key={exp}
                    onClick={() => setSelectedExp(exp)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      selectedExp === exp 
                        ? 'bg-black text-white border-black shadow-md' 
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-black'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>

            {isSearchMode && searchTerm.trim() && (
              <button
                onClick={() => performSearch(searchTerm.trim(), false)}
                className="w-full py-2 bg-orange-50 text-orange-600 font-bold rounded-lg text-sm hover:bg-orange-100 transition-colors"
              >
                Apply Filters to Search
              </button>
            )}
          </div>
        </aside>

        {/* Job Listings */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-black">
              {displayLoading && isFirstLoad.current ? 'Loading jobs...' : 
               isSearchMode ? `${displayJobs.length} Search Results` :
               `${displayJobs.length} Jobs Found`}
            </h2>
            <button onClick={refreshJobs} className="text-sm font-medium text-neutral-500 hover:text-black flex items-center gap-1.5 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg shadow-sm transition-colors">
              <RefreshCw className={`w-4 h-4 ${loading || searchLoading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          {(displayLoading && isFirstLoad.current) || (isSearchMode && searchLoading && displayJobs.length === 0) ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <JobSkeleton key={i} />)}
            </div>
          ) : displayJobs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center shadow-sm">
              <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <Search className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-black text-black mb-2">
                {isSearchMode ? 'No jobs match your search' : 'No jobs match your criteria'}
              </h3>
              <p className="text-neutral-500 mb-8 max-w-md mx-auto">
                {isSearchMode 
                  ? `We couldn't find any jobs matching "${searchTerm}". Try a different keyword or browse all jobs below.`
                  : "We couldn't find any roles matching your exact filters. Try adjusting your keywords or clearing some filters to see more opportunities."}
              </p>
              <button onClick={resetFilters} className="px-8 py-3 bg-black text-white rounded-xl text-sm font-bold shadow-lg hover:bg-neutral-800 transition-colors">
                {isSearchMode ? 'Browse All Jobs' : 'Clear All Filters'}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {displayJobs.map((job) => {
                  const external = isExternalJob(job);
                  const salary = job.salary && job.salary !== 'Not specified' ? job.salary : null;
                  const postedDate = formatRelativeTime(job.postedAt);
                  const cStyle = getCompanyStyle(getCompanyName(job));

                  return (
                    <div key={job.id} className="group bg-white rounded-2xl border border-neutral-200 p-6 hover:border-black hover:shadow-xl transition-all duration-300 flex flex-col relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-xl ${cStyle.bg} ${cStyle.text} flex items-center justify-center text-xl font-black shadow-inner`}>
                            {getCompanyName(job).charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-neutral-500 mb-0.5 flex items-center gap-1.5">
                              {getCompanyName(job)}
                              {postedDate === 'Today' && <span className="bg-orange-100 text-orange-600 text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">New</span>}
                            </p>
                            <Link href={`/jobs/${job.id}`} className="block group-hover:text-orange-600 transition-colors">
                              <h2 className="text-lg font-black text-black leading-tight line-clamp-1" title={getJobTitle(job)}>
                                {getJobTitle(job)}
                              </h2>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-5">
                        <span className="inline-flex items-center px-2.5 py-1 bg-neutral-100 rounded-lg text-xs font-bold text-neutral-600">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-neutral-400" />
                          <span className="truncate max-w-[100px]">{job.location || 'Remote'}</span>
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 bg-neutral-100 rounded-lg text-xs font-bold text-neutral-600">
                          <Briefcase className="w-3.5 h-3.5 mr-1 text-neutral-400" />
                          {getJobType(job)}
                        </span>
                        {salary && (
                          <span className="inline-flex items-center px-2.5 py-1 bg-green-50 border border-green-200 rounded-lg text-xs font-bold text-green-700">
                            <DollarSign className="w-3.5 h-3.5 mr-0.5" />
                            <span className="truncate max-w-[100px]">{salary}</span>
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed mb-6">
                        {truncateText(job.description?.replace(/<[^>]*>?/gm, ''), 150) || "Click to view full job description and requirements."}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-100">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-400">
                          <Clock className="w-4 h-4" />
                          {postedDate}
                        </div>
                        {external ? (
                          <a href={job.jobLink} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-white border-2 border-neutral-200 hover:border-black text-black text-sm font-black rounded-xl transition-all flex items-center gap-2 shadow-sm">
                            Apply External <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : (
                          <Link href={`/jobs/${job.id}`} className="px-5 py-2.5 bg-black text-white text-sm font-black rounded-xl hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20 transition-all flex items-center gap-2 transform active:scale-95">
                            View Details <ChevronRight className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {displayHasMore && !displayLoading && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={handleLoadMore}
                    disabled={displayLoadingMore}
                    className="px-8 py-3.5 bg-white border-2 border-neutral-200 hover:border-black rounded-xl text-sm font-black text-black transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {displayLoadingMore ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Loading more...</>
                    ) : (
                      <><RefreshCw className="w-5 h-5" /> Load More Opportunities</>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <ClientErrorBoundary fallbackMessage="Jobs page failed to load">
      <JobsContent />
    </ClientErrorBoundary>
  );
}