// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { doc, updateDoc, getDoc } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';

// export default function EditProfile() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [saving, setSaving] = useState(false);
  
//   // Form fields
//   const [headline, setHeadline] = useState('');
//   const [bio, setBio] = useState('');
//   const [skills, setSkills] = useState('');
//   const [location, setLocation] = useState('');
//   const [profileImage, setProfileImage] = useState('');
//   const [projects, setProjects] = useState('');
//   const [education, setEducation] = useState('');
//   const [experience, setExperience] = useState('');
//   const [website, setWebsite] = useState('');
//   const [github, setGithub] = useState('');
//   const [linkedin, setLinkedin] = useState('');
//   const [currentRole, setCurrentRole] = useState('user'); // Add this line

//   // Redirect if not logged in
//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/login');
//     }
    
//     // Load existing profile data if available
//     if (user) {
//       const loadProfileData = async () => {
//         try {
//           const userDoc = await getDoc(doc(db, 'users', user.uid));
//           if (userDoc.exists()) {
//             const userData = userDoc.data();
//             setHeadline(userData.headline || '');
//             setBio(userData.bio || '');
//             setSkills(userData.skills ? userData.skills.join(', ') : '');
//             setLocation(userData.location || '');
//             setProfileImage(userData.profileImage || '');
//             setProjects(userData.projects ? userData.projects.join('\n') : '');
//             setEducation(userData.education || '');
//             setExperience(userData.experience || '');
//             setWebsite(userData.website || '');
//             setGithub(userData.github || '');
//             setLinkedin(userData.linkedin || '');
//             setCurrentRole(userData.role || 'user'); // Add this line
//           }
//         } catch (error) {
//           console.error('Error loading profile data:', error);
//         }
//       };
      
//       loadProfileData();
//     }
//   }, [user, loading, router]);

//   const handleBack = () => {
//     router.push('/dashboard');
//   };

//   const handleSave = async () => {
//     if (!user) return;
    
//     setSaving(true);
//     try {
//       // Update user document in Firestore - PRESERVE THE ROLE FIELD
//       await updateDoc(doc(db, 'users', user.uid), {
//         headline: headline,
//         bio: bio,
//         skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill),
//         location: location,
//         profileImage: profileImage,
//         projects: projects.split('\n').map(project => project.trim()).filter(project => project),
//         education: education,
//         experience: experience,
//         website: website,
//         github: github,
//         linkedin: linkedin,
//         role: currentRole, // Add this line to preserve the role
//         updatedAt: new Date()
//       });
      
//       alert('Profile updated successfully!');
//       router.push('/dashboard'); // Go back to dashboard after saving
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       alert('Error updating profile. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-orange-500 pb-3">Edit Your Profile</h1>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
//               <input
//                 type="url"
//                 value={profileImage}
//                 onChange={(e) => setProfileImage(e.target.value)}
//                 placeholder="https://example.com/your-photo.jpg"
//                 className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
//               />
//               {profileImage && (
//                 <div className="mt-2">
//                   <p className="text-sm text-gray-600 mb-1">Preview:</p>
//                   <img 
//                     src={profileImage} 
//                     alt="Profile preview" 
//                     className="w-20 h-20 rounded-full object-cover border border-gray-300"
//                   />
//                 </div>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
//               <input
//                 type="text"
//                 value={headline}
//                 onChange={(e) => setHeadline(e.target.value)}
//                 placeholder="e.g., Software Developer at Tech Company"
//                 className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
//               />
//             </div>
//           </div>

//           <div className="mt-6">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Bio/Summary</label>
//             <textarea
//               value={bio}
//               onChange={(e) => setBio(e.target.value)}
//               placeholder="Tell us about yourself, your experience, and what you're passionate about..."
//               rows={4}
//               className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
//               <input
//                 type="text"
//                 value={skills}
//                 onChange={(e) => setSkills(e.target.value)}
//                 placeholder="e.g., JavaScript, React, Node.js, UI/UX Design"
//                 className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//               <input
//                 type="text"
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 placeholder="e.g., Mumbai, India"
//                 className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
//               />
//             </div>
//           </div>

//           <div className="mt-6">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
//             <input
//               type="text"
//               value={education}
//               onChange={(e) => setEducation(e.target.value)}
//               placeholder="e.g., B.Tech in Computer Science, XYZ University (2020-2024)"
//               className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
//             />
//           </div>

//           <div className="mt-6">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
//             <textarea
//               value={experience}
//               onChange={(e) => setExperience(e.target.value)}
//               placeholder="List your work experience, including company names, positions, and durations..."
//               rows={3}
//               className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
//             />
//           </div>

//           <div className="mt-6">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Projects (one per line)</label>
//             <textarea
//               value={projects}
//               onChange={(e) => setProjects(e.target.value)}
//               placeholder="List your notable projects, one per line...
// e.g., E-commerce website with React and Node.js
// e.g., Mobile app for local business"
//               rows={4}
//               className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
//               <input
//                 type="url"
//                 value={website}
//                 onChange={(e) => setWebsite(e.target.value)}
//                 placeholder="https://yourwebsite.com"
//                 className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
//               <input
//                 type="url"
//                 value={github}
//                 onChange={(e) => setGithub(e.target.value)}
//                 placeholder="https://github.com/yourusername"
//                 className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
//               <input
//                 type="url"
//                 value={linkedin}
//                 onChange={(e) => setLinkedin(e.target.value)}
//                 placeholder="https://linkedin.com/in/yourprofile"
//                 className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
//               />
//             </div>
//           </div>

//           <div className="flex gap-4 pt-6 mt-6 border-t border-gray-200">
//             <button 
//               onClick={handleSave} 
//               disabled={saving}
//               className={`px-6 py-3 rounded-md font-medium transition-colors ${
//                 saving 
//                   ? 'bg-gray-400 cursor-not-allowed' 
//                   : 'bg-orange-500 hover:bg-orange-600 text-white'
//               }`}
//             >
//               {saving ? 'Saving...' : 'Save Profile'}
//             </button>
            
//             <button 
//               onClick={handleBack}
//               className="px-6 py-3 bg-gray-500 text-white rounded-md font-medium hover:bg-gray-600 transition-colors"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// ----------------------------------- main one --------------------------------

// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { doc, updateDoc, getDoc } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';

// export default function EditProfile() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [saving, setSaving] = useState(false);
  
//   // LOGIC PRESERVED: Form fields
//   const [headline, setHeadline] = useState('');
//   const [bio, setBio] = useState('');
//   const [skills, setSkills] = useState('');
//   const [location, setLocation] = useState('');
//   const [profileImage, setProfileImage] = useState('');
//   const [projects, setProjects] = useState('');
//   const [education, setEducation] = useState('');
//   const [experience, setExperience] = useState('');
//   const [website, setWebsite] = useState('');
//   const [github, setGithub] = useState('');
//   const [linkedin, setLinkedin] = useState('');
//   const [currentRole, setCurrentRole] = useState('user');

//   // LOGIC PRESERVED: Redirect & Load Data
//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/login');
//     }
    
//     if (user) {
//       const loadProfileData = async () => {
//         try {
//           const userDoc = await getDoc(doc(db, 'users', user.uid));
//           if (userDoc.exists()) {
//             const userData = userDoc.data();
//             setHeadline(userData.headline || '');
//             setBio(userData.bio || '');
//             setSkills(userData.skills ? userData.skills.join(', ') : '');
//             setLocation(userData.location || '');
//             setProfileImage(userData.profileImage || '');
//             setProjects(userData.projects ? userData.projects.join('\n') : '');
//             setEducation(userData.education || '');
//             setExperience(userData.experience || '');
//             setWebsite(userData.website || '');
//             setGithub(userData.github || '');
//             setLinkedin(userData.linkedin || '');
//             setCurrentRole(userData.role || 'user');
//           }
//         } catch (error) {
//           console.error('Error loading profile data:', error);
//         }
//       };
      
//       loadProfileData();
//     }
//   }, [user, loading, router]);

//   const handleBack = () => {
//     router.push('/dashboard');
//   };

//   // LOGIC PRESERVED: Save handler
//   const handleSave = async () => {
//     if (!user) return;
    
//     setSaving(true);
//     try {
//       await updateDoc(doc(db, 'users', user.uid), {
//         headline: headline,
//         bio: bio,
//         skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill),
//         location: location,
//         profileImage: profileImage,
//         projects: projects.split('\n').map(project => project.trim()).filter(project => project),
//         education: education,
//         experience: experience,
//         website: website,
//         github: github,
//         linkedin: linkedin,
//         role: currentRole,
//         updatedAt: new Date()
//       });
      
//       alert('Profile updated successfully!');
//       router.push('/dashboard');
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       alert('Error updating profile. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return (
//     <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
//       <div className="w-12 h-12 border-4 border-neutral-100 border-t-orange-600 rounded-full animate-spin"></div>
//       <p className="text-neutral-500 font-medium">Loading Profile...</p>
//     </div>
//   );
  
//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6">
//       <div className="max-w-4xl mx-auto">
        
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-black text-black tracking-tight">Edit Profile</h1>
//             <p className="text-neutral-500 mt-1">Update your professional presence</p>
//           </div>
//           <button 
//             onClick={handleBack}
//             className="text-sm font-bold text-neutral-500 hover:text-black transition-colors"
//           >
//             Cancel
//           </button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
//           {/* LEFT COLUMN: Avatar & Quick Info */}
//           <div className="lg:col-span-1 space-y-6">
//             <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 text-center">
//               <div className="relative inline-block mb-6">
//                 <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto bg-neutral-100 flex items-center justify-center">
//                   {profileImage ? (
//                     <img 
//                       src={profileImage} 
//                       alt="Profile" 
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         // Fallback if URL is broken
//                         (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.displayName}&background=f97316&color=fff`;
//                       }}
//                     />
//                   ) : (
//                     <span className="text-4xl font-bold text-orange-300">
//                       {user.displayName?.charAt(0) || 'U'}
//                     </span>
//                   )}
//                 </div>
//                 <div className="absolute bottom-2 right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm border-2 border-white">
//                   ✎
//                 </div>
//               </div>

//               <div className="space-y-4 text-left">
//                 <div>
//                   <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">
//                     Profile Image Link
//                   </label>
//                   <input
//                     type="url"
//                     value={profileImage}
//                     onChange={(e) => setProfileImage(e.target.value)}
//                     placeholder="https://..."
//                     className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
//                   />
//                   <p className="text-[10px] text-neutral-400 mt-2">
//                     Paste a direct link to your photo (from LinkedIn, GitHub, etc.)
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Save Button (Desktop Placement) */}
//             <div className="hidden lg:block">
//               <button 
//                 onClick={handleSave} 
//                 disabled={saving}
//                 className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 ${
//                   saving 
//                     ? 'bg-neutral-300 cursor-not-allowed text-neutral-500' 
//                     : 'bg-black text-white hover:bg-orange-600 hover:shadow-orange-200'
//                 }`}
//               >
//                 {saving ? 'Saving...' : 'Save Changes'}
//               </button>
//             </div>
//           </div>

//           {/* RIGHT COLUMN: Main Form */}
//           <div className="lg:col-span-2 space-y-6">
            
//             {/* 1. Basic Info */}
//             <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
//               <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
//                 <span className="w-2 h-2 rounded-full bg-orange-500"></span>
//                 About You
//               </h2>
              
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-bold text-neutral-700 mb-2">Professional Headline</label>
//                   <input
//                     type="text"
//                     value={headline}
//                     onChange={(e) => setHeadline(e.target.value)}
//                     placeholder="e.g. Senior Developer @ TechCorp | React Enthusiast"
//                     className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-bold text-neutral-700 mb-2">Bio</label>
//                   <textarea
//                     value={bio}
//                     onChange={(e) => setBio(e.target.value)}
//                     rows={4}
//                     placeholder="Write a short summary of your professional journey..."
//                     className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
//                   />
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-bold text-neutral-700 mb-2">Location</label>
//                     <input
//                       type="text"
//                       value={location}
//                       onChange={(e) => setLocation(e.target.value)}
//                       placeholder="e.g. Mumbai, India"
//                       className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-bold text-neutral-700 mb-2">Skills</label>
//                     <input
//                       type="text"
//                       value={skills}
//                       onChange={(e) => setSkills(e.target.value)}
//                       placeholder="React, Node.js, Design..."
//                       className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* 2. Professional Details */}
//             <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
//               <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
//                 <span className="w-2 h-2 rounded-full bg-orange-500"></span>
//                 Professional Details
//               </h2>

//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-bold text-neutral-700 mb-2">Experience</label>
//                   <textarea
//                     value={experience}
//                     onChange={(e) => setExperience(e.target.value)}
//                     rows={3}
//                     placeholder="List your recent roles..."
//                     className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-bold text-neutral-700 mb-2">Education</label>
//                   <input
//                     type="text"
//                     value={education}
//                     onChange={(e) => setEducation(e.target.value)}
//                     placeholder="e.g. B.Tech Computer Science"
//                     className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-bold text-neutral-700 mb-2">Notable Projects</label>
//                   <textarea
//                     value={projects}
//                     onChange={(e) => setProjects(e.target.value)}
//                     rows={4}
//                     placeholder="• Built an E-commerce platform&#10;• Designed a mobile app"
//                     className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-mono text-sm"
//                   />
//                   <p className="text-[10px] text-neutral-400 mt-1">One project per line</p>
//                 </div>
//               </div>
//             </div>

//             {/* 3. Social Links */}
//             <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
//               <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
//                 <span className="w-2 h-2 rounded-full bg-orange-500"></span>
//                 Social Presence
//               </h2>
              
//               <div className="grid gap-4">
//                 <div className="relative">
//                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔗</span>
//                   <input
//                     type="url"
//                     value={website}
//                     onChange={(e) => setWebsite(e.target.value)}
//                     placeholder="Personal Website"
//                     className="w-full pl-12 p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
//                   />
//                 </div>
//                 <div className="relative">
//                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">💼</span>
//                   <input
//                     type="url"
//                     value={linkedin}
//                     onChange={(e) => setLinkedin(e.target.value)}
//                     placeholder="LinkedIn Profile URL"
//                     className="w-full pl-12 p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
//                   />
//                 </div>
//                 <div className="relative">
//                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">💻</span>
//                   <input
//                     type="url"
//                     value={github}
//                     onChange={(e) => setGithub(e.target.value)}
//                     placeholder="GitHub Profile URL"
//                     className="w-full pl-12 p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Mobile Save Button */}
//             <div className="lg:hidden">
//               <button 
//                 onClick={handleSave} 
//                 disabled={saving}
//                 className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg ${
//                   saving 
//                     ? 'bg-neutral-300 cursor-not-allowed text-neutral-500' 
//                     : 'bg-black text-white active:bg-orange-600'
//                 }`}
//               >
//                 {saving ? 'Saving...' : 'Save Profile'}
//               </button>
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
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import ProfileImageUploader from '@/components/ProfileImageUploader';

export default function EditProfile() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  // LOGIC PRESERVED: Form fields
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [projects, setProjects] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [website, setWebsite] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [currentRole, setCurrentRole] = useState('user');

  // LOGIC PRESERVED: Redirect & Load Data
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    
    if (user) {
      const loadProfileData = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setHeadline(userData.headline || '');
            setBio(userData.bio || '');
            setSkills(userData.skills ? userData.skills.join(', ') : '');
            setLocation(userData.location || '');
            setProfileImage(userData.profileImage || '');
            setProjects(userData.projects ? userData.projects.join('\n') : '');
            setEducation(userData.education || '');
            setExperience(userData.experience || '');
            setWebsite(userData.website || '');
            setGithub(userData.github || '');
            setLinkedin(userData.linkedin || '');
            setCurrentRole(userData.role || 'user');
          }
        } catch (error) {
          console.error('Error loading profile data:', error);
        }
      };
      
      loadProfileData();
    }
  }, [user, loading, router]);

  const handleBack = () => {
    router.push('/dashboard');
  };

  // LOGIC PRESERVED: Save handler
  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        headline: headline,
        bio: bio,
        skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        location: location,
        profileImage: profileImage,
        projects: projects.split('\n').map(project => project.trim()).filter(project => project),
        education: education,
        experience: experience,
        website: website,
        github: github,
        linkedin: linkedin,
        role: currentRole,
        updatedAt: new Date()
      });
      
      alert('Profile updated successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-neutral-100 border-t-orange-600 rounded-full animate-spin"></div>
      <p className="text-neutral-500 font-medium">Loading Profile...</p>
    </div>
  );
  
  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-black tracking-tight">Edit Profile</h1>
            <p className="text-neutral-500 mt-1">Update your professional presence</p>
          </div>
          <button 
            onClick={handleBack}
            className="text-sm font-bold text-neutral-500 hover:text-black transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Avatar Uploader */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 text-center">
              <ProfileImageUploader
                currentImageUrl={profileImage}
                onImageUploaded={(url) => setProfileImage(url)}
              />
            </div>

            {/* Save Button (Desktop Placement) */}
            <div className="hidden lg:block">
              <button 
                onClick={handleSave} 
                disabled={saving}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 ${
                  saving 
                    ? 'bg-neutral-300 cursor-not-allowed text-neutral-500' 
                    : 'bg-black text-white hover:bg-orange-600 hover:shadow-orange-200'
                }`}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Main Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Basic Info */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
              <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                About You
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Professional Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Senior Developer @ TechCorp | React Enthusiast"
                    className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    placeholder="Write a short summary of your professional journey..."
                    className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Mumbai, India"
                      className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-2">Skills</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="React, Node.js, Design..."
                      className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Professional Details */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
              <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Professional Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Experience</label>
                  <textarea
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    rows={3}
                    placeholder="List your recent roles..."
                    className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Education</label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science"
                    className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Notable Projects</label>
                  <textarea
                    value={projects}
                    onChange={(e) => setProjects(e.target.value)}
                    rows={4}
                    placeholder="• Built an E-commerce platform&#10;• Designed a mobile app"
                    className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-mono text-sm"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">One project per line</p>
                </div>
              </div>
            </div>

            {/* 3. Social Links */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
              <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Social Presence
              </h2>
              
              <div className="grid gap-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔗</span>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Personal Website"
                    className="w-full pl-12 p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">💼</span>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="LinkedIn Profile URL"
                    className="w-full pl-12 p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">💻</span>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="GitHub Profile URL"
                    className="w-full pl-12 p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Save Button */}
            <div className="lg:hidden">
              <button 
                onClick={handleSave} 
                disabled={saving}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg ${
                  saving 
                    ? 'bg-neutral-300 cursor-not-allowed text-neutral-500' 
                    : 'bg-black text-white active:bg-orange-600'
                }`}
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}