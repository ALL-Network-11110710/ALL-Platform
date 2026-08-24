// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';

// // Define types for application and user data
// interface Application {
//   id: string;
//   userId: string;
//   coverLetter: string;
//   status: string;
//   appliedAt: any;
// }

// interface UserData {
//   name: string;
//   email: string;
//   // Add other profile fields as needed
// }

// export default function JobApplications() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const params = useParams();
//   const jobId = params.jobId as string;

//   const [job, setJob] = useState<any>(null);
//   const [applications, setApplications] = useState<Application[]>([]);
//   const [applicantUsers, setApplicantUsers] = useState<{ [key: string]: UserData }>({});
//   const [loadingData, setLoadingData] = useState(true);
//   const [error, setError] = useState('');

//   // Redirect if not authenticated
//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/login');
//     }
//   }, [user, loading, router]);

//   // Fetch job details and applications
//   useEffect(() => {
//     async function fetchData() {
//       if (user && jobId) {
//         try {
//           setError('');
//           setLoadingData(true);

//           // Fetch job details first to verify ownership
//           const jobDocRef = doc(db, 'jobs', jobId);
//           const jobSnap = await getDoc(jobDocRef);

//           if (!jobSnap.exists()) {
//             setError('Job not found.');
//             setLoadingData(false);
//             return;
//           }

//           const jobData = jobSnap.data();
//           setJob(jobData);

//           // Check if the current user owns this job
//           if (jobData.postedBy !== user.uid) {
//             setError('You do not have permission to view applications for this job.');
//             setLoadingData(false);
//             return;
//           }

//           // Fetch applications for this job
//           const applicationsRef = collection(db, 'applications');
//           const q = query(applicationsRef, where('jobId', '==', jobId));
//           const querySnapshot = await getDocs(q);

//           const applicationsList: Application[] = [];
//           querySnapshot.forEach((doc) => {
//             applicationsList.push({ id: doc.id, ...doc.data() } as Application);
//           });
//           setApplications(applicationsList);

//           // Fetch user data for each applicant - with error handling
//           const userIds = applicationsList
//             .map(app => app.userId)
//             .filter(id => id && typeof id === 'string'); // Filter out undefined/null user IDs
          
//           const usersData: { [key: string]: UserData } = {};

//           await Promise.all(
//             userIds.map(async (userId) => {
//               try {
//                 const userDocRef = doc(db, 'users', userId);
//                 const userSnap = await getDoc(userDocRef);
//                 if (userSnap.exists()) {
//                   usersData[userId] = userSnap.data() as UserData;
//                 }
//               } catch (userError) {
//                 console.error(`Error fetching user ${userId}:`, userError);
//                 // Continue with other users even if one fails
//               }
//             })
//           );

//           setApplicantUsers(usersData);
//         } catch (error) {
//           console.error('Error fetching data:', error);
//           setError('Failed to load applications. Please try again.');
//         } finally {
//           setLoadingData(false);
//         }
//       }
//     }

//     if (user && jobId) {
//       fetchData();
//     }
//   }, [user, jobId]);

//   // Function to update application status
//   const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
//     try {
//       const applicationRef = doc(db, 'applications', applicationId);
//       await updateDoc(applicationRef, {
//         status: newStatus
//       });

//       // Update local state to reflect the change
//       setApplications(prevApplications =>
//         prevApplications.map(app =>
//           app.id === applicationId ? { ...app, status: newStatus } : app
//         )
//       );
//     } catch (error) {
//       console.error('Error updating application status:', error);
//       setError('Failed to update status. Please try again.');
//     }
//   };

//   if (loading || loadingData) {
//     return (
//       <div style={{ padding: '20px' }}>
//         <h1>Job Applications</h1>
//         <p>Loading applications...</p>
//       </div>
//     );
//   }

//   if (!user) return null;

//   return (
//     <div style={{ padding: '20px' }}>
//       <button 
//         onClick={() => router.push('/dashboard/company')}
//         style={{ 
//           padding: '10px 20px', 
//           margin: '0 0 20px 0', 
//           cursor: 'pointer',
//           backgroundColor: '#9e9e9e',
//           color: 'white',
//           border: 'none',
//           borderRadius: '4px'
//         }}
//       >
//         ← Back to Company Dashboard
//       </button>

//       <h1>Job Applications</h1>
//       {job && (
//         <div style={{ marginBottom: '20px' }}>
//           <h2>For: {job.jobTitle || job.title}</h2>
//           <p><strong>Company:</strong> {job.companyName || job.company}</p>
//           <p><strong>Location:</strong> {job.location}</p>
//         </div>
//       )}

//       {error && (
//         <div style={{ 
//           padding: '10px', 
//           backgroundColor: '#ffebee', 
//           color: '#c62828',
//           border: '1px solid #ef5350',
//           borderRadius: '4px',
//           margin: '10px 0'
//         }}>
//           {error}
//         </div>
//       )}

//       <div>
//         <h3>Applications ({applications.length})</h3>
        
//         {applications.length === 0 ? (
//           <p>No applications yet.</p>
//         ) : (
//           <div>
//             {applications.map((application) => {
//               const applicant = applicantUsers[application.userId];
//               return (
//                 <div key={application.id} style={{ 
//                   border: '1px solid #e0e0e0', 
//                   padding: '20px', 
//                   margin: '15px 0',
//                   borderRadius: '8px',
//                   backgroundColor: '#fafafa'
//                 }}>
//                   <h4 style={{ margin: '0 0 10px 0' }}>
//                     Applicant: {applicant ? applicant.name : `User (ID: ${application.userId || 'Unknown'})`}
//                   </h4>
//                   {applicant ? (
//                     <p style={{ margin: '5px 0' }}>
//                       <strong>Email:</strong> {applicant.email}
//                     </p>
//                   ) : (
//                     <p style={{ margin: '5px 0', color: '#ff9800' }}>
//                       <strong>Note:</strong> User profile not found
//                     </p>
//                   )}
//                   <p style={{ margin: '5px 0' }}>
//                     <strong>Applied on:</strong> {application.appliedAt?.toDate().toLocaleDateString()}
//                   </p>
//                   <p style={{ margin: '5px 0' }}>
//                     <strong>Cover Letter:</strong>
//                   </p>
//                   <div style={{ 
//                     padding: '10px', 
//                     backgroundColor: '#fff', 
//                     border: '1px solid #ddd',
//                     borderRadius: '4px',
//                     margin: '10px 0'
//                   }}>
//                     {application.coverLetter}
//                   </div>
                  
//                   <div style={{ margin: '15px 0' }}>
//                     <label htmlFor={`status-${application.id}`}><strong>Status: </strong></label>
//                     <select
//                       id={`status-${application.id}`}
//                       value={application.status || 'submitted'}
//                       onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
//                       style={{ 
//                         padding: '8px', 
//                         margin: '0 10px',
//                         borderRadius: '4px',
//                         border: '1px solid #ccc'
//                       }}
//                     >
//                       <option value="submitted">Submitted</option>
//                       <option value="reviewed">Reviewed</option>
//                       <option value="accepted">Accepted</option>
//                       <option value="rejected">Rejected</option>
//                     </select>
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


'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';

// Define types for application and user data
interface Application {
  id: string;
  userId: string;
  coverLetter: string;
  status: string;
  appliedAt: any;
}

interface UserData {
  name: string;
  email: string;
  headline?: string;
  skills?: string[];
  location?: string;
  profileImage?: string;
}

export default function JobApplications() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicantUsers, setApplicantUsers] = useState<{ [key: string]: UserData }>({});
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch job details and applications
  useEffect(() => {
    async function fetchData() {
      if (user && jobId) {
        try {
          setError('');
          setLoadingData(true);

          // Fetch job details first to verify ownership
          const jobDocRef = doc(db, 'jobs', jobId);
          const jobSnap = await getDoc(jobDocRef);

          if (!jobSnap.exists()) {
            setError('Job not found.');
            setLoadingData(false);
            return;
          }

          const jobData = jobSnap.data();
          setJob(jobData);

          // Check if the current user owns this job
          if (jobData.postedBy !== user.uid) {
            setError('You do not have permission to view applications for this job.');
            setLoadingData(false);
            return;
          }

          // Fetch applications for this job
          const applicationsRef = collection(db, 'applications');
          const q = query(applicationsRef, where('jobId', '==', jobId));
          const querySnapshot = await getDocs(q);

          const applicationsList: Application[] = [];
          querySnapshot.forEach((doc) => {
            applicationsList.push({ id: doc.id, ...doc.data() } as Application);
          });
          setApplications(applicationsList);

          // Fetch user data for each applicant - with error handling
          const userIds = applicationsList
            .map(app => app.userId)
            .filter(id => id && typeof id === 'string'); // Filter out undefined/null user IDs
          
          const usersData: { [key: string]: UserData } = {};

          await Promise.all(
            userIds.map(async (userId) => {
              try {
                const userDocRef = doc(db, 'users', userId);
                const userSnap = await getDoc(userDocRef);
                if (userSnap.exists()) {
                  usersData[userId] = userSnap.data() as UserData;
                }
              } catch (userError) {
                console.error(`Error fetching user ${userId}:`, userError);
                // Continue with other users even if one fails
              }
            })
          );

          setApplicantUsers(usersData);
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Failed to load applications. Please try again.');
        } finally {
          setLoadingData(false);
        }
      }
    }

    if (user && jobId) {
      fetchData();
    }
  }, [user, jobId]);

  // Function to update application status
  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    setUpdatingStatus(applicationId);
    try {
      const applicationRef = doc(db, 'applications', applicationId);
      await updateDoc(applicationRef, {
        status: newStatus
      });

      // Update local state to reflect the change
      setApplications(prevApplications =>
        prevApplications.map(app =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error('Error updating application status:', error);
      setError('Failed to update status. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-neutral-100 border-t-orange-600 rounded-full animate-spin"></div>
        <p className="text-neutral-500 font-medium">Loading applications...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard/company"
            className="flex items-center text-sm font-medium text-neutral-600 hover:text-orange-600 transition-colors mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Company Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">Job Applications</h1>
              {job && (
                <div className="text-neutral-600">
                  <p className="text-lg font-medium">{job.jobTitle || job.title}</p>
                  <p className="text-sm">{job.companyName || job.company} • {job.location}</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{applications.length}</div>
                <div className="text-sm text-neutral-500">Total Applications</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Applications Grid */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-200 bg-neutral-50">
            <h3 className="text-lg font-bold text-black">
              Applications Received ({applications.length})
            </h3>
            {applications.length === 0 && (
              <p className="text-neutral-500 mt-2">No applications yet. Check back later.</p>
            )}
          </div>

          {applications.length > 0 && (
            <div className="divide-y divide-neutral-100">
              {applications.map((application) => {
                const applicant = applicantUsers[application.userId];
                
                return (
                  <div key={application.id} className="p-6 hover:bg-neutral-50/50 transition-colors">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Applicant Info */}
                      <div className="lg:w-2/3">
                        <div className="flex items-start gap-4 mb-4">
                          {applicant?.profileImage ? (
                            <img 
                              src={applicant.profileImage} 
                              alt={applicant.name || 'Applicant'}
                              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                              <span className="text-2xl text-orange-600 font-bold">
                                {applicant?.name?.charAt(0) || 'A'}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex-grow">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h4 className="text-xl font-bold text-black">
                                {applicant ? applicant.name : `Applicant (ID: ${application.userId?.substring(0, 8)}...)`}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(application.status || 'submitted')}`}>
                                {application.status || 'submitted'}
                              </span>
                            </div>
                            
                            <div className="space-y-1">
                              {applicant ? (
                                <>
                                  <p className="text-neutral-600">
                                    <span className="font-medium">Email:</span> {applicant.email}
                                  </p>
                                  {applicant.headline && (
                                    <p className="text-neutral-600">
                                      <span className="font-medium">Headline:</span> {applicant.headline}
                                    </p>
                                  )}
                                  {applicant.location && (
                                    <p className="text-neutral-600">
                                      <span className="font-medium">Location:</span> {applicant.location}
                                    </p>
                                  )}
                                  {applicant.skills && applicant.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {applicant.skills.slice(0, 3).map((skill, index) => (
                                        <span key={index} className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded">
                                          {skill}
                                        </span>
                                      ))}
                                      {applicant.skills.length > 3 && (
                                        <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded">
                                          +{applicant.skills.length - 3} more
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="flex items-center text-yellow-600 text-sm">
                                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                  </svg>
                                  <span>User profile not available</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Cover Letter */}
                        <div className="mt-6">
                          <h5 className="text-sm font-bold text-neutral-700 mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Cover Letter
                          </h5>
                          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                            <p className="text-neutral-700 whitespace-pre-line">
                              {application.coverLetter || 'No cover letter provided.'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Application Details & Actions */}
                      <div className="lg:w-1/3">
                        <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-200">
                          <h5 className="text-sm font-bold text-neutral-700 mb-4">Application Details</h5>
                          
                          <div className="space-y-4">
                            <div>
                              <p className="text-xs text-neutral-500 mb-1">Applied Date</p>
                              <p className="font-medium text-black">
                                {application.appliedAt?.toDate().toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-xs text-neutral-500 mb-1">Application ID</p>
                              <p className="font-medium text-black text-sm font-mono">
                                {application.id.substring(0, 12)}...
                              </p>
                            </div>

                            {/* Status Update */}
                            <div>
                              <p className="text-xs text-neutral-500 mb-2">Update Status</p>
                              <div className="flex flex-col sm:flex-row gap-2">
                                <select
                                  value={application.status || 'submitted'}
                                  onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                                  disabled={updatingStatus === application.id}
                                  className="flex-grow p-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:opacity-50"
                                >
                                  <option value="submitted">Submitted</option>
                                  <option value="reviewed">Under Review</option>
                                  <option value="accepted">Accepted</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                                {updatingStatus === application.id && (
                                  <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 border-t border-neutral-200">
                              {applicant && (
                                <button
                                  onClick={() => router.push(`/profile/${application.userId}`)}
                                  className="w-full mb-3 px-4 py-2.5 bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 rounded-xl font-medium transition-colors flex items-center justify-center"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  View Full Profile
                                </button>
                              )}
                              
                              <button
                                onClick={() => router.push(`/dashboard/messages?userId=${application.userId}`)}
                                className="w-full px-4 py-2.5 bg-orange-600 text-white hover:bg-orange-700 rounded-xl font-medium transition-colors flex items-center justify-center"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Send Message
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Applied Date - Mobile */}
                    <div className="mt-4 lg:hidden text-sm text-neutral-500">
                      Applied on {application.appliedAt?.toDate().toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Stats Summary */}
        {applications.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-neutral-200">
              <div className="text-2xl font-bold text-yellow-600">
                {applications.filter(app => app.status === 'submitted').length}
              </div>
              <div className="text-sm text-neutral-500">Submitted</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-neutral-200">
              <div className="text-2xl font-bold text-blue-600">
                {applications.filter(app => app.status === 'reviewed').length}
              </div>
              <div className="text-sm text-neutral-500">Under Review</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-neutral-200">
              <div className="text-2xl font-bold text-green-600">
                {applications.filter(app => app.status === 'accepted').length}
              </div>
              <div className="text-sm text-neutral-500">Accepted</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-neutral-200">
              <div className="text-2xl font-bold text-red-600">
                {applications.filter(app => app.status === 'rejected').length}
              </div>
              <div className="text-sm text-neutral-500">Rejected</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}