// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { doc, setDoc } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';

// export default function PostJob() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [posting, setPosting] = useState(false);

//   // Job form fields
//   const [jobTitle, setJobTitle] = useState('');
//   const [companyName, setCompanyName] = useState('');
//   const [location, setLocation] = useState('');
//   const [jobType, setJobType] = useState('Full-time');
//   const [salary, setSalary] = useState('');
//   const [description, setDescription] = useState('');
//   const [requirements, setRequirements] = useState('');
//   const [jobLink, setJobLink] = useState(''); // New field for external job link

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) return;

//     setPosting(true);
//     try {
//       // Create a unique ID for the job
//       const jobId = Date.now().toString();
      
//       await setDoc(doc(db, 'jobs', jobId), {
//         jobId,
//         jobTitle,
//         companyName,
//         location,
//         jobType,
//         salary,
//         description,
//         requirements: requirements.split('\n').filter(req => req.trim()),
//         jobLink: jobLink.trim(), // Save the job link
//         postedBy: user.uid,
//         postedByEmail: user.email,
//         postedAt: new Date(),
//         isExternal: jobLink.trim() !== '', // Mark as external if link provided
//       });

//       alert('Job posted successfully!');
//       router.push('/dashboard');
//     } catch (error) {
//       console.error('Error posting job:', error);
//       alert('Error posting job. Please try again.');
//     } finally {
//       setPosting(false);
//     }
//   };

//   if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-orange-500 pb-3">Post a New Job</h1>
          
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
//                 <input
//                   type="text"
//                   value={jobTitle}
//                   onChange={(e) => setJobTitle(e.target.value)}
//                   placeholder="e.g., Software Engineer"
//                   required
//                   className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
//                 <input
//                   type="text"
//                   value={companyName}
//                   onChange={(e) => setCompanyName(e.target.value)}
//                   placeholder="e.g., Tech Solutions Inc."
//                   required
//                   className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
//                 <input
//                   type="text"
//                   value={location}
//                   onChange={(e) => setLocation(e.target.value)}
//                   placeholder="e.g., Mumbai, India or Remote"
//                   required
//                   className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Job Type *</label>
//                 <select 
//                   value={jobType} 
//                   onChange={(e) => setJobType(e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
//                 >
//                   <option value="Full-time">Full-time</option>
//                   <option value="Part-time">Part-time</option>
//                   <option value="Contract">Contract</option>
//                   <option value="Internship">Internship</option>
//                   <option value="Remote">Remote</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
//               <input
//                 type="text"
//                 value={salary}
//                 onChange={(e) => setSalary(e.target.value)}
//                 placeholder="e.g., ₹8-12 LPA or Negotiable"
//                 className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
//               <textarea
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 placeholder="Describe the job role and responsibilities..."
//                 rows={4}
//                 required
//                 className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (one per line) *</label>
//               <textarea
//                 value={requirements}
//                 onChange={(e) => setRequirements(e.target.value)}
//                 placeholder="BS in Computer Science\n3+ years experience\n..."
//                 rows={4}
//                 required
//                 className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Job Application Link
//                 <span className="text-xs text-gray-500 ml-1"></span>
//               </label>
//               <input
//                 type="url"
//                 value={jobLink}
//                 onChange={(e) => setJobLink(e.target.value)}
//                 placeholder="https://company.com/careers/job-id"
//                 className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Clicking the link will take you to other website.
//               </p>
//             </div>

//             <div className="flex gap-4 pt-4">
//               <button 
//                 type="submit" 
//                 disabled={posting}
//                 className={`px-6 py-3 rounded-md font-medium transition-colors ${
//                   posting 
//                     ? 'bg-gray-400 cursor-not-allowed' 
//                     : 'bg-orange-500 hover:bg-orange-600 text-white'
//                 }`}
//               >
//                 {posting ? 'Posting...' : 'Post Job'}
//               </button>
              
//               <button 
//                 type="button"
//                 onClick={() => router.push('/dashboard')}
//                 className="px-6 py-3 bg-gray-500 text-white rounded-md font-medium hover:bg-gray-600 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  Briefcase, 
  Building, 
  MapPin, 
  Clock, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  X, 
  Globe, 
  Award, 
  Users,
  Sparkles,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';

export default function PostJob() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [posting, setPosting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Job form fields
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [jobLink, setJobLink] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');

  const jobTypes = [
    { value: 'Full-time', label: 'Full-time', icon: '🕒' },
    { value: 'Part-time', label: 'Part-time', icon: '⏰' },
    { value: 'Contract', label: 'Contract', icon: '📝' },
    { value: 'Internship', label: 'Internship', icon: '🎓' },
    { value: 'Remote', label: 'Remote', icon: '🌍' },
    { value: 'Hybrid', label: 'Hybrid', icon: '🏢' },
  ];

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};
    
    if (step === 1) {
      if (!jobTitle.trim()) errors.jobTitle = 'Job title is required';
      if (!companyName.trim()) errors.companyName = 'Company name is required';
      if (!location.trim()) errors.location = 'Location is required';
    }
    
    if (step === 2) {
      if (!description.trim()) errors.description = 'Description is required';
      if (!requirements.trim()) errors.requirements = 'Requirements are required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;
    if (!user) return;

    setPosting(true);
    try {
      const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const jobData = {
        jobId,
        jobTitle,
        companyName,
        location,
        jobType,
        salary: salary || 'Not disclosed',
        description,
        requirements: requirements.split('\n').filter(req => req.trim()),
        skills,
        experience: experience || 'Not specified',
        jobLink: jobLink.trim(),
        postedBy: user.uid,
        postedByEmail: user.email,
        postedByName: user.displayName || user.email?.split('@')[0],
        postedAt: new Date(),
        isExternal: jobLink.trim() !== '',
        views: 0,
        applications: 0,
        status: 'active'
      };

      await setDoc(doc(db, 'jobs', jobId), jobData);

      // Show success and redirect
      router.push(`/jobs/${jobId}?success=true`);
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Error posting job. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-orange-500 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 font-medium mt-4">Loading job posting form...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-orange-500" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Post a New Job
                </h1>
                <p className="text-sm text-gray-500 mt-1">Reach thousands of qualified professionals</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 font-medium">Step {currentStep} of 3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                currentStep >= step
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 border-orange-500 text-white shadow-lg'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {currentStep > step ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="font-bold">{step}</span>
                )}
              </div>
              <div className={`flex-1 h-1 mx-2 ${step < 3 ? (currentStep > step ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gray-300') : ''}`} />
              <div className="hidden md:block">
                <span className={`text-sm font-medium ${
                  currentStep >= step ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step === 1 && 'Basic Details'}
                  {step === 2 && 'Job Description'}
                  {step === 3 && 'Additional Info'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex items-center mb-2">
                  <Briefcase className="h-6 w-6 text-orange-500 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Basic Job Details</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Job Title */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                      Job Title *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g., Senior Frontend Developer"
                        required
                        className={`w-full p-4 pl-12 bg-gray-50 border ${formErrors.jobTitle ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500`}
                      />
                      <Briefcase className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-orange-500" />
                    </div>
                    {formErrors.jobTitle && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.jobTitle}</p>
                    )}
                  </div>

                  {/* Company Name */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Building className="h-4 w-4 mr-2 text-gray-400" />
                      Company Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g., Tech Innovations Inc."
                        required
                        className={`w-full p-4 pl-12 bg-gray-50 border ${formErrors.companyName ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500`}
                      />
                      <Building className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-orange-500" />
                    </div>
                    {formErrors.companyName && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.companyName}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      Location *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Bangalore, India or Remote"
                        required
                        className={`w-full p-4 pl-12 bg-gray-50 border ${formErrors.location ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500`}
                      />
                      <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-orange-500" />
                    </div>
                    {formErrors.location && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.location}</p>
                    )}
                  </div>

                  {/* Job Type */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      Job Type *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {jobTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setJobType(type.value)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-2 ${
                            jobType === type.value
                              ? 'border-orange-500 bg-orange-50 text-orange-600'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <span>{type.icon}</span>
                          <span className="font-medium">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Salary */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                      Salary Range
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        placeholder="e.g., ₹12-18 LPA or Negotiable"
                        className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                      />
                      <DollarSign className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-orange-500" />
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Award className="h-4 w-4 mr-2 text-gray-400" />
                      Experience Required
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="e.g., 3-5 years or Entry Level"
                        className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                      />
                      <Award className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-orange-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Job Description */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex items-center mb-2">
                  <FileText className="h-6 w-6 text-orange-500 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Job Description & Requirements</h2>
                </div>

                {/* Description */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <div className="relative">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the job role, responsibilities, and what makes this position special..."
                      rows={6}
                      required
                      className={`w-full p-4 bg-gray-50 border ${formErrors.description ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none`}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                      {description.length}/2000 characters
                    </div>
                  </div>
                  {formErrors.description && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.description}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    Tip: Include day-to-day responsibilities, team information, and growth opportunities
                  </p>
                </div>

                {/* Requirements */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements (one per line) *
                  </label>
                  <div className="relative">
                    <textarea
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder="BS in Computer Science or equivalent\n3+ years of experience in React\nStrong problem-solving skills\n..."
                      rows={6}
                      required
                      className={`w-full p-4 bg-gray-50 border ${formErrors.requirements ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none`}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                      {requirements.split('\n').filter(r => r.trim()).length} requirements
                    </div>
                  </div>
                  {formErrors.requirements && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.requirements}</p>
                  )}
                </div>

                {/* Skills */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Skills (Optional)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      placeholder="Add a skill (e.g., React, Python, AWS)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Skills Tags */}
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <div
                          key={skill}
                          className="inline-flex items-center bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 text-orange-700 px-4 py-2 rounded-full text-sm font-medium"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-orange-500 hover:text-orange-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Additional Info */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex items-center mb-2">
                  <Globe className="h-6 w-6 text-orange-500 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Additional Information</h2>
                </div>

                {/* External Job Link */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <ExternalLink className="h-4 w-4 mr-2 text-gray-400" />
                      External Job Application Link (Optional)
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={jobLink}
                      onChange={(e) => setJobLink(e.target.value)}
                      placeholder="https://company.com/careers/job-id"
                      className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    />
                    <ExternalLink className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-orange-500" />
                  </div>
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-800 font-medium">
                          External Job Link Instructions
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          If you provide an external link, applicants will be directed to your company's career page instead of applying on ALL Platform.
                        </p>
                        <p className="text-xs text-blue-600 mt-2">
                          Leave this blank if you want applicants to apply directly on ALL Platform.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Preview */}
                <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Job Preview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Job Title:</span>
                      <span className="font-medium text-gray-900">{jobTitle || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Company:</span>
                      <span className="font-medium text-gray-900">{companyName || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium text-gray-900">{location || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900">{jobType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Salary:</span>
                      <span className="font-medium text-gray-900">{salary || 'Not disclosed'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium text-gray-900">{experience || 'Not specified'}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          This job will be visible to thousands of professionals on ALL Platform
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </button>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 transform"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={posting}
                    className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 transform ${
                      posting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:scale-105'
                    }`}
                  >
                    {posting ? (
                      <div className="flex items-center">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Posting Job...
                      </div>
                    ) : (
                      'Post Job Now'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Tips Sidebar */}
        <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl">
          <div className="flex items-center mb-4">
            <Sparkles className="h-5 w-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-bold text-orange-900">Tips for Better Results</h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-orange-600 mr-2 mt-1 flex-shrink-0" />
              <span className="text-orange-800">Be specific about responsibilities and expectations</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-orange-600 mr-2 mt-1 flex-shrink-0" />
              <span className="text-orange-800">Include salary range to attract more applicants</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-orange-600 mr-2 mt-1 flex-shrink-0" />
              <span className="text-orange-800">Add required skills for better matching</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-orange-600 mr-2 mt-1 flex-shrink-0" />
              <span className="text-orange-800">Use external links for your career page applications</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        /* Custom scrollbar */
        textarea::-webkit-scrollbar {
          width: 6px;
        }
        
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        
        textarea::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        
        textarea::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}