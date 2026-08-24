'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Interface for an Application
interface Application {
  id: string;
  jobId: string;
  userId: string;
  coverLetter: string;
  status: string;
  appliedAt: any;
}

// Interface for a Job (we need to display job details)
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
}

export default function ApplicationsPage() {
  const [user, loadingAuth] = useAuthState(auth);
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<{ [key: string]: Job }>({}); // Store jobs by their ID
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push('/login');
    }
  }, [user, loadingAuth, router]);

  useEffect(() => {
    const fetchApplications = async () => {
      // Check if user is logged in
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setDebugInfo(`Fetching applications for user: ${user.uid}`);
        
        // 1. Fetch all applications for the current user
        const applicationsQuery = query(
          collection(db, 'applications'),
          where('userId', '==', user.uid)
        );
        const applicationSnapshot = await getDocs(applicationsQuery);
        
        const applicationsData: Application[] = [];
        applicationSnapshot.forEach((doc) => {
          applicationsData.push({ id: doc.id, ...doc.data() } as Application);
        });
        
        setDebugInfo(prev => prev + `\nFound ${applicationsData.length} applications`);
        setApplications(applicationsData);

        // 2. Fetch the details for each job that was applied to
        const jobDetails: { [key: string]: Job } = {};
        for (const app of applicationsData) {
          // Only fetch if we haven't already fetched this job
          if (!jobDetails[app.jobId]) {
            try {
              const jobDoc = await getDoc(doc(db, 'jobs', app.jobId));
              if (jobDoc.exists()) {
                jobDetails[app.jobId] = { id: jobDoc.id, ...jobDoc.data() } as Job;
              } else {
                setDebugInfo(prev => prev + `\nJob ${app.jobId} not found`);
              }
            } catch (jobError) {
              console.error(`Error fetching job ${app.jobId}:`, jobError);
              setDebugInfo(prev => prev + `\nError fetching job ${app.jobId}: ${jobError}`);
            }
          }
        }
        setJobs(jobDetails);

      } catch (error) {
        console.error('Error fetching data:', error);
        setDebugInfo(prev => prev + `\nError: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]); // Re-fetch if the user changes

  // Show loading state
  if (loadingAuth || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-black">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-orange-200">
          <h1 className="text-3xl font-bold text-black mb-2">My Applications</h1>
          <p className="text-black">Track the status of your job applications</p>
        </div>

        {/* DEBUG INFO - TEMPORARY */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-orange-100 p-4 rounded-lg mb-6 border border-orange-300">
            <h3 className="font-bold mb-2 text-black">Debug Info:</h3>
            <pre className="text-xs whitespace-pre-wrap text-black">{debugInfo}</pre>
            <p className="mt-2 text-black">User UID: {user?.uid}</p>
          </div>
        )}
        
        {applications.length === 0 ? (
          <div className="bg-orange-100 p-6 rounded-2xl border border-orange-200 text-center">
            <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-black mb-2">You haven't applied to any jobs yet.</p>
            <p className="text-black text-sm mb-4">Start browsing available jobs to submit your first application</p>
            <Link 
              href="/jobs" 
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-all duration-200"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((application) => {
              const job = jobs[application.jobId];
              return (
                <div key={application.id} className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
                  {/* Check if we have the job details */}
                  {job ? (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-semibold text-black mb-1">{job.title}</h2>
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-orange-100 text-black px-3 py-1 rounded-full text-sm">{job.company}</span>
                            <span className="bg-orange-100 text-black px-3 py-1 rounded-full text-sm">{job.location}</span>
                            <span className="bg-orange-100 text-black px-3 py-1 rounded-full text-sm">{job.type}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          application.status === 'submitted' ? 'bg-orange-100 text-black' :
                          application.status === 'reviewed' ? 'bg-orange-300 text-black' :
                          application.status === 'accepted' ? 'bg-orange-500 text-white' :
                          application.status === 'rejected' ? 'bg-orange-800 text-white' :
                          'bg-orange-100 text-black'
                        }`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="my-4">
                        <h3 className="font-medium text-black mb-2">Your Cover Letter:</h3>
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                          <p className="text-black">{application.coverLetter}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-black text-sm">
                          Applied on: {application.appliedAt?.toDate ? application.appliedAt.toDate().toLocaleDateString() : 'Recent'}
                        </p>
                        <Link 
                          href={`/jobs/${application.jobId}`}
                          className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 text-sm"
                        >
                          View Job
                        </Link>
                      </div>
                    </>
                  ) : (
                    // Show this if the job details couldn't be loaded (e.g., job was deleted)
                    <div>
                      <h2 className="text-xl font-semibold text-black mb-2">Job Details Unavailable</h2>
                      <p className="text-black mb-4">The job you applied for may have been removed.</p>
                      
                      <div className="my-4">
                        <h3 className="font-medium text-black mb-2">Your Cover Letter:</h3>
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                          <p className="text-black">{application.coverLetter}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-black text-sm">
                          Applied on: {application.appliedAt?.toDate ? application.appliedAt.toDate().toLocaleDateString() : 'Recent'}
                        </p>
                        <p className="text-black text-sm">Job ID: {application.jobId}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}