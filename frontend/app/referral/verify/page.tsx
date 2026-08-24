// "use client";

// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function EmployeeVerificationPage() {
//   const [user, loading, error] = useAuthState(auth);
//   const router = useRouter();
//   const [mounted, setMounted] = useState(false);
  
//   // Form states
//   const [companyEmail, setCompanyEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [step, setStep] = useState<'email' | 'otp' | 'verified'>('email');
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
//   const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'not_started'>('not_started');

//   useEffect(() => {
//     setMounted(true);
    
//     // Check if user is already verified
//     if (user && !loading) {
//       checkVerificationStatus();
//     }
    
//     // Redirect if not logged in
//     if (!loading && !user) {
//       router.push('/login');
//     }
//   }, [user, loading, router]);

//   const checkVerificationStatus = async () => {
//     if (!user) return;
    
//     try {
//       const userDoc = await getDoc(doc(db, 'users', user.uid));
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         if (userData.isVerifiedEmployee) {
//           setVerificationStatus('verified');
//           setStep('verified');
//         } else if (userData.verificationPending) {
//           setVerificationStatus('pending');
//           setStep('otp');
//         }
//       }
//     } catch (error) {
//       console.error('Error checking verification status:', error);
//     }
//   };

//   const handleEmailSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage(null);

//     // Basic email validation
//     if (!companyEmail.includes('@') || !companyEmail.includes('.')) {
//       setMessage({ type: 'error', text: 'Please enter a valid company email address' });
//       setIsLoading(false);
//       return;
//     }

//     // Check if it's a personal email (basic check)
//     const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
//     const emailDomain = companyEmail.split('@')[1];
    
//     if (personalDomains.includes(emailDomain)) {
//       setMessage({ 
//         type: 'error', 
//         text: 'Please use your company email address (not personal email like Gmail, Yahoo, etc.)' 
//       });
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // In a real app, you would:
//       // 1. Generate OTP
//       // 2. Send email with OTP
//       // 3. Save OTP in Firestore with expiration
      
//       // For now, we'll simulate the process
//       setMessage({ 
//         type: 'success', 
//         text: `Verification email sent to ${companyEmail}. Check your inbox for OTP. (Simulated)` 
//       });
      
//       // Update user document
//       if (user) {
//         await updateDoc(doc(db, 'users', user.uid), {
//           verificationPending: true,
//           companyEmail: companyEmail,
//           verificationRequestedAt: new Date().toISOString()
//         });
//       }
      
//       setStep('otp');
//     } catch (error: any) {
//       setMessage({ 
//         type: 'error', 
//         text: `Error: ${error.message || 'Failed to send verification email'}` 
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleOtpSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage(null);

//     if (otp.length !== 6) {
//       setMessage({ type: 'error', text: 'OTP must be 6 digits' });
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // In a real app, you would:
//       // 1. Verify OTP from Firestore
//       // 2. Check expiration
//       // 3. Mark as verified
      
//       // For simulation, any 6-digit OTP works
//       if (user) {
//         await updateDoc(doc(db, 'users', user.uid), {
//           isVerifiedEmployee: true,
//           verificationPending: false,
//           verifiedAt: new Date().toISOString(),
//           verificationMethod: 'email_otp'
//         });
        
//         setMessage({ 
//           type: 'success', 
//           text: '✅ Verification successful! You are now a verified employee.' 
//         });
//         setVerificationStatus('verified');
//         setStep('verified');
        
//         // Show success for 3 seconds, then redirect
//         setTimeout(() => {
//           router.push('/referral/post');
//         }, 3000);
//       }
//     } catch (error: any) {
//       setMessage({ 
//         type: 'error', 
//         text: `Error: ${error.message || 'Invalid OTP'}` 
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendOtp = async () => {
//     setIsLoading(true);
//     setMessage(null);
    
//     try {
//       // Resend OTP logic would go here
//       setMessage({ 
//         type: 'success', 
//         text: `New OTP sent to ${companyEmail}. Check your inbox. (Simulated)` 
//       });
//     } catch (error: any) {
//       setMessage({ 
//         type: 'error', 
//         text: `Error: ${error.message || 'Failed to resend OTP'}` 
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!mounted) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading verification...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return null; // Will redirect in useEffect
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <Link href="/referral" className="inline-block mb-6">
//             <button className="text-orange-600 hover:text-orange-800 font-medium">
//               ← Back to Referral Hub
//             </button>
//           </Link>
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Get Verified as an Employee
//           </h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Verify your company email to post referral jobs and earn bonuses. 
//             It takes just 2 minutes!
//           </p>
//         </div>

//         {/* Progress Steps */}
//         <div className="flex justify-center mb-12">
//           <div className="flex items-center space-x-4">
//             <div className={`flex items-center ${step === 'email' || step === 'otp' || step === 'verified' ? 'text-orange-600' : 'text-gray-400'}`}>
//               <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'email' || step === 'otp' || step === 'verified' ? 'bg-orange-100 border-2 border-orange-500' : 'bg-gray-100 border-2 border-gray-300'}`}>
//                 1
//               </div>
//               <span className="ml-2 font-medium">Enter Email</span>
//             </div>
            
//             <div className="w-12 h-1 bg-gray-300"></div>
            
//             <div className={`flex items-center ${step === 'otp' || step === 'verified' ? 'text-orange-600' : 'text-gray-400'}`}>
//               <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'otp' || step === 'verified' ? 'bg-orange-100 border-2 border-orange-500' : 'bg-gray-100 border-2 border-gray-300'}`}>
//                 2
//               </div>
//               <span className="ml-2 font-medium">Verify OTP</span>
//             </div>
            
//             <div className="w-12 h-1 bg-gray-300"></div>
            
//             <div className={`flex items-center ${step === 'verified' ? 'text-orange-600' : 'text-gray-400'}`}>
//               <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'verified' ? 'bg-orange-100 border-2 border-orange-500' : 'bg-gray-100 border-2 border-gray-300'}`}>
//                 3
//               </div>
//               <span className="ml-2 font-medium">Verified!</span>
//             </div>
//           </div>
//         </div>

//         {/* Message Display */}
//         {message && (
//           <div className={`mb-8 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
//             {message.text}
//           </div>
//         )}

//         {/* Step 1: Email Entry */}
//         {step === 'email' && (
//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Your Company Email</h2>
            
//             <form onSubmit={handleEmailSubmit}>
//               <div className="mb-6">
//                 <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-2">
//                   Company Email Address
//                 </label>
//                 <input
//                   type="email"
//                   id="companyEmail"
//                   value={companyEmail}
//                   onChange={(e) => setCompanyEmail(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
//                   placeholder="name@yourcompany.com"
//                   required
//                   disabled={isLoading}
//                 />
//                 <p className="mt-2 text-sm text-gray-500">
//                   Use your official company email (e.g., @google.com, @microsoft.com, @amazon.com)
//                 </p>
//               </div>
              
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//                 <h3 className="font-medium text-blue-800 mb-2">Why we verify:</h3>
//                 <ul className="text-sm text-blue-700 space-y-1">
//                   <li>• Ensures only real employees can post referral jobs</li>
//                   <li>• Builds trust with job seekers</li>
//                   <li>• Required to earn referral bonuses</li>
//                   <li>• We'll send a 6-digit OTP to verify ownership</li>
//                 </ul>
//               </div>
              
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isLoading ? (
//                   <span className="flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
//                     Sending OTP...
//                   </span>
//                 ) : (
//                   'Send Verification OTP'
//                 )}
//               </button>
//             </form>
//           </div>
//         )}

//         {/* Step 2: OTP Verification */}
//         {step === 'otp' && (
//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Verification Code</h2>
//             <p className="text-gray-600 mb-6">
//               We sent a 6-digit code to <span className="font-semibold">{companyEmail}</span>
//             </p>
            
//             <form onSubmit={handleOtpSubmit}>
//               <div className="mb-6">
//                 <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
//                   6-Digit Verification Code
//                 </label>
//                 <input
//                   type="text"
//                   id="otp"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                   className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
//                   placeholder="123456"
//                   maxLength={6}
//                   required
//                   disabled={isLoading}
//                 />
//                 <p className="mt-2 text-sm text-gray-500">
//                   Enter the 6-digit code from your email
//                 </p>
//               </div>
              
//               <div className="flex space-x-4">
//                 <button
//                   type="button"
//                   onClick={handleResendOtp}
//                   disabled={isLoading}
//                   className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Resend OTP
//                 </button>
                
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? (
//                     <span className="flex items-center justify-center">
//                       <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
//                       Verifying...
//                     </span>
//                   ) : (
//                     'Verify & Continue'
//                   )}
//                 </button>
//               </div>
              
//               <p className="mt-4 text-sm text-gray-500 text-center">
//                 Didn't receive the email? Check your spam folder or try resending.
//               </p>
//             </form>
//           </div>
//         )}

//         {/* Step 3: Verified Success */}
//         {step === 'verified' && (
//           <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
//             <div className="mb-6">
//               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                 </svg>
//               </div>
              
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">🎉 Verification Successful!</h2>
//               <p className="text-gray-600 mb-8 max-w-md mx-auto">
//                 You are now a verified employee. You can start posting referral jobs and earn bonuses!
//               </p>
              
//               <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6 mb-8">
//                 <h3 className="font-bold text-lg text-gray-900 mb-4">🎯 Next Steps:</h3>
//                 <div className="space-y-4">
//                   <div className="flex items-start">
//                     <div className="bg-orange-100 text-orange-800 rounded-full p-2 mr-4">
//                       1
//                     </div>
//                     <div className="text-left">
//                       <h4 className="font-semibold text-gray-900">Post Your First Referral Job</h4>
//                       <p className="text-gray-600 text-sm">Share job openings from your company and set a referral bonus</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-start">
//                     <div className="bg-orange-100 text-orange-800 rounded-full p-2 mr-4">
//                       2
//                     </div>
//                     <div className="text-left">
//                       <h4 className="font-semibold text-gray-900">Connect with Job Seekers</h4>
//                       <p className="text-gray-600 text-sm">Chat directly with qualified candidates</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-start">
//                     <div className="bg-orange-100 text-orange-800 rounded-full p-2 mr-4">
//                       3
//                     </div>
//                     <div className="text-left">
//                       <h4 className="font-semibold text-gray-900">Earn Referral Bonuses</h4>
//                       <p className="text-gray-600 text-sm">Get paid when your referral gets hired</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="space-y-4">
//                 <button
//                   onClick={() => router.push('/referral/post')}
//                   className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition"
//                 >
//                   Post Your First Referral Job →
//                 </button>
                
//                 <button
//                   onClick={() => router.push('/referral/marketplace')}
//                   className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition"
//                 >
//                   Browse Referral Marketplace
//                 </button>
//               </div>
              
//               <p className="mt-6 text-sm text-gray-500">
//                 Redirecting to job posting page in 3 seconds...
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Benefits Section */}
//         <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white p-6 rounded-xl border border-gray-200">
//             <div className="text-orange-600 text-2xl mb-4">💰</div>
//             <h3 className="font-bold text-gray-900 mb-2">Earn Money</h3>
//             <p className="text-gray-600 text-sm">
//               Get referral bonuses ranging from ₹15,000 to ₹50,000+ per successful hire
//             </p>
//           </div>
          
//           <div className="bg-white p-6 rounded-xl border border-gray-200">
//             <div className="text-orange-600 text-2xl mb-4">🤝</div>
//             <h3 className="font-bold text-gray-900 mb-2">Help Others</h3>
//             <p className="text-gray-600 text-sm">
//               Connect talented job seekers with opportunities at your company
//             </p>
//           </div>
          
//           <div className="bg-white p-6 rounded-xl border border-gray-200">
//             <div className="text-orange-600 text-2xl mb-4">🏆</div>
//             <h3 className="font-bold text-gray-900 mb-2">Build Network</h3>
//             <p className="text-gray-600 text-sm">
//               Expand your professional network with verified connections
//             </p>
//           </div>
//         </div>

//         {/* FAQ Section */}
//         <div className="mt-12 bg-white rounded-xl border border-gray-200 p-8">
//           <h3 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
          
//           <div className="space-y-6">
//             <div>
//               <h4 className="font-semibold text-gray-900 mb-2">Why verify with company email?</h4>
//               <p className="text-gray-600 text-sm">
//                 We use company email verification to ensure only real employees can post referral jobs, which builds trust in our marketplace and prevents fraud.
//               </p>
//             </div>
            
//             <div>
//               <h4 className="font-semibold text-gray-900 mb-2">How long does verification take?</h4>
//               <p className="text-gray-600 text-sm">
//                 Usually 2-5 minutes. You'll receive an OTP immediately after entering your email. The entire process takes less than 5 minutes.
//               </p>
//             </div>
            
//             <div>
//               <h4 className="font-semibold text-gray-900 mb-2">Is my information secure?</h4>
//               <p className="text-gray-600 text-sm">
//                 Yes! We use industry-standard encryption and never share your company email or personal details without your consent.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/lib/firebase';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { generateAndSendOTP, verifyOTP, checkExistingOTP } from '@/lib/emailService';

// export default function EmployeeVerificationPage() {
//   const [user, loading, error] = useAuthState(auth);
//   const router = useRouter();
//   const [mounted, setMounted] = useState(false);
  
//   // Form states
//   const [companyEmail, setCompanyEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [step, setStep] = useState<'email' | 'otp' | 'verified'>('email');
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
//   const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'not_started'>('not_started');

//   useEffect(() => {
//     setMounted(true);
    
//     // Check if user is already verified
//     if (user && !loading) {
//       checkVerificationStatus();
//     }
    
//     // Redirect if not logged in
//     if (!loading && !user) {
//       router.push('/login');
//     }
//   }, [user, loading, router]);

//   const checkVerificationStatus = async () => {
//     if (!user) return;
    
//     try {
//       const userDoc = await getDoc(doc(db, 'users', user.uid));
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         if (userData.isVerifiedEmployee) {
//           setVerificationStatus('verified');
//           setStep('verified');
//         } else if (userData.verificationPending) {
//           // Check if there's an existing OTP
//           const existingOTP = await checkExistingOTP(user.uid);
//           if (existingOTP.exists && existingOTP.email) {
//             setCompanyEmail(existingOTP.email);
//             setVerificationStatus('pending');
//             setStep('otp');
//           } else {
//             // No valid OTP, go back to email step
//             setStep('email');
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error checking verification status:', error);
//     }
//   };

//   const handleEmailSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage(null);

//     // Basic email validation
//     if (!companyEmail.includes('@') || !companyEmail.includes('.')) {
//       setMessage({ type: 'error', text: 'Please enter a valid company email address' });
//       setIsLoading(false);
//       return;
//     }

//     // Check if it's a personal email (basic check)
//     const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
//     const emailDomain = companyEmail.split('@')[1]?.toLowerCase();
    
//     if (personalDomains.includes(emailDomain)) {
//       setMessage({ 
//         type: 'error', 
//         text: 'Please use your company email address (not personal email like Gmail, Yahoo, etc.)' 
//       });
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // Use REAL email service to send OTP
//       if (!user) {
//         setMessage({ type: 'error', text: 'User not found. Please log in again.' });
//         setIsLoading(false);
//         return;
//       }

//       const result = await generateAndSendOTP(companyEmail, user.uid);
      
//       if (result.success) {
//         setMessage({ 
//           type: 'success', 
//           text: `✅ Verification email sent to ${companyEmail}. Check your inbox for the 6-digit OTP.` 
//         });
        
//         // Update user document
//         await updateDoc(doc(db, 'users', user.uid), {
//           verificationPending: true,
//           companyEmail: companyEmail,
//           verificationRequestedAt: new Date().toISOString()
//         });
        
//         setStep('otp');
//       } else {
//         setMessage({ 
//           type: 'error', 
//           text: result.error || 'Failed to send verification email. Please try again.' 
//         });
//       }
//     } catch (error: any) {
//       setMessage({ 
//         type: 'error', 
//         text: `Error: ${error.message || 'Failed to send verification email'}` 
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleOtpSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage(null);

//     if (otp.length !== 6) {
//       setMessage({ type: 'error', text: 'OTP must be 6 digits' });
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // Use REAL OTP verification
//       if (!user) {
//         setMessage({ type: 'error', text: 'User not found. Please log in again.' });
//         setIsLoading(false);
//         return;
//       }

//       const result = await verifyOTP(user.uid, otp);
      
//       if (result.success) {
//         // Mark user as verified employee
//         await updateDoc(doc(db, 'users', user.uid), {
//           isVerifiedEmployee: true,
//           verificationPending: false,
//           verifiedAt: new Date().toISOString(),
//           verificationMethod: 'email_otp'
//         });
        
//         setMessage({ 
//           type: 'success', 
//           text: '✅ Verification successful! You are now a verified employee.' 
//         });
//         setVerificationStatus('verified');
//         setStep('verified');
        
//         // Show success for 3 seconds, then redirect
//         setTimeout(() => {
//           router.push('/referral/post');
//         }, 3000);
//       } else {
//         setMessage({ 
//           type: 'error', 
//           text: result.error || 'Invalid OTP. Please try again.' 
//         });
//       }
//     } catch (error: any) {
//       setMessage({ 
//         type: 'error', 
//         text: `Error: ${error.message || 'Invalid OTP'}` 
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendOtp = async () => {
//     setIsLoading(true);
//     setMessage(null);
    
//     try {
//       if (!user) {
//         setMessage({ type: 'error', text: 'User not found. Please log in again.' });
//         setIsLoading(false);
//         return;
//       }

//       const result = await generateAndSendOTP(companyEmail, user.uid);
      
//       if (result.success) {
//         setMessage({ 
//           type: 'success', 
//           text: `✅ New OTP sent to ${companyEmail}. Check your inbox.` 
//         });
//       } else {
//         setMessage({ 
//           type: 'error', 
//           text: result.error || 'Failed to resend OTP. Please try again.' 
//         });
//       }
//     } catch (error: any) {
//       setMessage({ 
//         type: 'error', 
//         text: `Error: ${error.message || 'Failed to resend OTP'}` 
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!mounted) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading verification...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return null; // Will redirect in useEffect
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <Link href="/referral" className="inline-block mb-6">
//             <button className="text-orange-600 hover:text-orange-800 font-medium">
//               ← Back to Referral Hub
//             </button>
//           </Link>
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Get Verified as an Employee
//           </h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Verify your company email to post referral jobs and earn bonuses. 
//             It takes just 2 minutes!
//           </p>
//         </div>

//         {/* Progress Steps */}
//         <div className="flex justify-center mb-12">
//           <div className="flex items-center space-x-4">
//             <div className={`flex items-center ${step === 'email' || step === 'otp' || step === 'verified' ? 'text-orange-600' : 'text-gray-400'}`}>
//               <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'email' || step === 'otp' || step === 'verified' ? 'bg-orange-100 border-2 border-orange-500' : 'bg-gray-100 border-2 border-gray-300'}`}>
//                 1
//               </div>
//               <span className="ml-2 font-medium">Enter Email</span>
//             </div>
            
//             <div className="w-12 h-1 bg-gray-300"></div>
            
//             <div className={`flex items-center ${step === 'otp' || step === 'verified' ? 'text-orange-600' : 'text-gray-400'}`}>
//               <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'otp' || step === 'verified' ? 'bg-orange-100 border-2 border-orange-500' : 'bg-gray-100 border-2 border-gray-300'}`}>
//                 2
//               </div>
//               <span className="ml-2 font-medium">Verify OTP</span>
//             </div>
            
//             <div className="w-12 h-1 bg-gray-300"></div>
            
//             <div className={`flex items-center ${step === 'verified' ? 'text-orange-600' : 'text-gray-400'}`}>
//               <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'verified' ? 'bg-orange-100 border-2 border-orange-500' : 'bg-gray-100 border-2 border-gray-300'}`}>
//                 3
//               </div>
//               <span className="ml-2 font-medium">Verified!</span>
//             </div>
//           </div>
//         </div>

//         {/* Message Display */}
//         {message && (
//           <div className={`mb-8 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
//             {message.text}
//           </div>
//         )}

//         {/* Step 1: Email Entry */}
//         {step === 'email' && (
//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Your Company Email</h2>
            
//             <form onSubmit={handleEmailSubmit}>
//               <div className="mb-6">
//                 <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-2">
//                   Company Email Address
//                 </label>
//                 <input
//                   type="email"
//                   id="companyEmail"
//                   value={companyEmail}
//                   onChange={(e) => setCompanyEmail(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
//                   placeholder="name@yourcompany.com"
//                   required
//                   disabled={isLoading}
//                 />
//                 <p className="mt-2 text-sm text-gray-500">
//                   Use your official company email (e.g., @google.com, @microsoft.com, @amazon.com)
//                 </p>
//               </div>
              
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//                 <h3 className="font-medium text-blue-800 mb-2">Why we verify:</h3>
//                 <ul className="text-sm text-blue-700 space-y-1">
//                   <li>• Ensures only real employees can post referral jobs</li>
//                   <li>• Builds trust with job seekers</li>
//                   <li>• Required to earn referral bonuses</li>
//                   <li>• We'll send a 6-digit OTP to verify ownership</li>
//                 </ul>
//               </div>
              
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isLoading ? (
//                   <span className="flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
//                     Sending OTP...
//                   </span>
//                 ) : (
//                   'Send Verification OTP'
//                 )}
//               </button>
//             </form>
//           </div>
//         )}

//         {/* Step 2: OTP Verification */}
//         {step === 'otp' && (
//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Verification Code</h2>
//             <p className="text-gray-600 mb-6">
//               We sent a 6-digit code to <span className="font-semibold">{companyEmail}</span>
//             </p>
            
//             <form onSubmit={handleOtpSubmit}>
//               <div className="mb-6">
//                 <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
//                   6-Digit Verification Code
//                 </label>
//                 <input
//                   type="text"
//                   id="otp"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                   className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
//                   placeholder="123456"
//                   maxLength={6}
//                   required
//                   disabled={isLoading}
//                 />
//                 <p className="mt-2 text-sm text-gray-500">
//                   Enter the 6-digit code from your email
//                 </p>
//               </div>
              
//               <div className="flex space-x-4">
//                 <button
//                   type="button"
//                   onClick={handleResendOtp}
//                   disabled={isLoading}
//                   className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Resend OTP
//                 </button>
                
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? (
//                     <span className="flex items-center justify-center">
//                       <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
//                       Verifying...
//                     </span>
//                   ) : (
//                     'Verify & Continue'
//                   )}
//                 </button>
//               </div>
              
//               <p className="mt-4 text-sm text-gray-500 text-center">
//                 Didn't receive the email? Check your spam folder or try resending.
//               </p>
//             </form>
//           </div>
//         )}

//         {/* Step 3: Verified Success */}
//         {step === 'verified' && (
//           <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
//             <div className="mb-6">
//               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                 </svg>
//               </div>
              
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">🎉 Verification Successful!</h2>
//               <p className="text-gray-600 mb-8 max-w-md mx-auto">
//                 You are now a verified employee. You can start posting referral jobs and earn bonuses!
//               </p>
              
//               <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6 mb-8">
//                 <h3 className="font-bold text-lg text-gray-900 mb-4">🎯 Next Steps:</h3>
//                 <div className="space-y-4">
//                   <div className="flex items-start">
//                     <div className="bg-orange-100 text-orange-800 rounded-full p-2 mr-4">
//                       1
//                     </div>
//                     <div className="text-left">
//                       <h4 className="font-semibold text-gray-900">Post Your First Referral Job</h4>
//                       <p className="text-gray-600 text-sm">Share job openings from your company and set a referral bonus</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-start">
//                     <div className="bg-orange-100 text-orange-800 rounded-full p-2 mr-4">
//                       2
//                     </div>
//                     <div className="text-left">
//                       <h4 className="font-semibold text-gray-900">Connect with Job Seekers</h4>
//                       <p className="text-gray-600 text-sm">Chat directly with qualified candidates</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-start">
//                     <div className="bg-orange-100 text-orange-800 rounded-full p-2 mr-4">
//                       3
//                     </div>
//                     <div className="text-left">
//                       <h4 className="font-semibold text-gray-900">Earn Referral Bonuses</h4>
//                       <p className="text-gray-600 text-sm">Get paid when your referral gets hired</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="space-y-4">
//                 <button
//                   onClick={() => router.push('/referral/post')}
//                   className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition"
//                 >
//                   Post Your First Referral Job →
//                 </button>
                
//                 <button
//                   onClick={() => router.push('/referral/marketplace')}
//                   className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition"
//                 >
//                   Browse Referral Marketplace
//                 </button>
//               </div>
              
//               <p className="mt-6 text-sm text-gray-500">
//                 Redirecting to job posting page in 3 seconds...
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Benefits Section */}
//         <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white p-6 rounded-xl border border-gray-200">
//             <div className="text-orange-600 text-2xl mb-4">💰</div>
//             <h3 className="font-bold text-gray-900 mb-2">Earn Money</h3>
//             <p className="text-gray-600 text-sm">
//               Get referral bonuses ranging from ₹15,000 to ₹50,000+ per successful hire
//             </p>
//           </div>
          
//           <div className="bg-white p-6 rounded-xl border border-gray-200">
//             <div className="text-orange-600 text-2xl mb-4">🤝</div>
//             <h3 className="font-bold text-gray-900 mb-2">Help Others</h3>
//             <p className="text-gray-600 text-sm">
//               Connect talented job seekers with opportunities at your company
//             </p>
//           </div>
          
//           <div className="bg-white p-6 rounded-xl border border-gray-200">
//             <div className="text-orange-600 text-2xl mb-4">🏆</div>
//             <h3 className="font-bold text-gray-900 mb-2">Build Network</h3>
//             <p className="text-gray-600 text-sm">
//               Expand your professional network with verified connections
//             </p>
//           </div>
//         </div>

//         {/* FAQ Section */}
//         <div className="mt-12 bg-white rounded-xl border border-gray-200 p-8">
//           <h3 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
          
//           <div className="space-y-6">
//             <div>
//               <h4 className="font-semibold text-gray-900 mb-2">Why verify with company email?</h4>
//               <p className="text-gray-600 text-sm">
//                 We use company email verification to ensure only real employees can post referral jobs, which builds trust in our marketplace and prevents fraud.
//               </p>
//             </div>
            
//             <div>
//               <h4 className="font-semibold text-gray-900 mb-2">How long does verification take?</h4>
//               <p className="text-gray-600 text-sm">
//                 Usually 2-5 minutes. You'll receive an OTP immediately after entering your email. The entire process takes less than 5 minutes.
//               </p>
//             </div>
            
//             <div>
//               <h4 className="font-semibold text-gray-900 mb-2">Is my information secure?</h4>
//               <p className="text-gray-600 text-sm">
//                 Yes! We use industry-standard encryption and never share your company email or personal details without your consent.
//               </p>
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
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateAndSendOTP, verifyOTP, checkExistingOTP } from '@/lib/emailService';

// TEST MODE: Set to true to allow personal emails for testing
// Must match the value in /lib/emailService.ts
const TEST_MODE = true;

export default function EmployeeVerificationPage() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Form states
  const [companyEmail, setCompanyEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'verified'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'not_started'>('not_started');

  useEffect(() => {
    setMounted(true);
    
    // Check if user is already verified
    if (user && !loading) {
      checkVerificationStatus();
    }
    
    // Redirect if not logged in
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const checkVerificationStatus = async () => {
    if (!user) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.isVerifiedEmployee) {
          setVerificationStatus('verified');
          setStep('verified');
        } else if (userData.verificationPending) {
          // Check if there's an existing OTP
          const existingOTP = await checkExistingOTP(user.uid);
          if (existingOTP.exists && existingOTP.email) {
            setCompanyEmail(existingOTP.email);
            setVerificationStatus('pending');
            setStep('otp');
          } else {
            // No valid OTP, go back to email step
            setStep('email');
          }
        }
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Basic email validation
    if (!companyEmail.includes('@') || !companyEmail.includes('.')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      setIsLoading(false);
      return;
    }

    // Check if it's a personal email (ONLY if not in TEST_MODE)
    if (!TEST_MODE) {
      const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
      const emailDomain = companyEmail.split('@')[1]?.toLowerCase();
      
      if (personalDomains.includes(emailDomain)) {
        setMessage({ 
          type: 'error', 
          text: 'Please use your company email address (not personal email like Gmail, Yahoo, etc.)' 
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      // Use REAL email service to send OTP
      if (!user) {
        setMessage({ type: 'error', text: 'User not found. Please log in again.' });
        setIsLoading(false);
        return;
      }

      const result = await generateAndSendOTP(companyEmail, user.uid);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: `✅ Verification email sent to ${companyEmail}. Check your inbox for the 6-digit OTP.` 
        });
        
        // Update user document
        await updateDoc(doc(db, 'users', user.uid), {
          verificationPending: true,
          companyEmail: companyEmail,
          verificationRequestedAt: new Date().toISOString()
        });
        
        setStep('otp');
      } else {
        setMessage({ 
          type: 'error', 
          text: result.error || 'Failed to send verification email. Please try again.' 
        });
      }
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: `Error: ${error.message || 'Failed to send verification email'}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (otp.length !== 6) {
      setMessage({ type: 'error', text: 'OTP must be 6 digits' });
      setIsLoading(false);
      return;
    }

    try {
      // Use REAL OTP verification
      if (!user) {
        setMessage({ type: 'error', text: 'User not found. Please log in again.' });
        setIsLoading(false);
        return;
      }

      const result = await verifyOTP(user.uid, otp);
      
      if (result.success) {
        // Mark user as verified employee
        await updateDoc(doc(db, 'users', user.uid), {
          isVerifiedEmployee: true,
          verificationPending: false,
          verifiedAt: new Date().toISOString(),
          verificationMethod: 'email_otp'
        });
        
        setMessage({ 
          type: 'success', 
          text: '✅ Verification successful! You are now a verified employee.' 
        });
        setVerificationStatus('verified');
        setStep('verified');
        
        // Show success for 3 seconds, then redirect
        setTimeout(() => {
          router.push('/referral/post');
        }, 3000);
      } else {
        setMessage({ 
          type: 'error', 
          text: result.error || 'Invalid OTP. Please try again.' 
        });
      }
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: `Error: ${error.message || 'Invalid OTP'}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      if (!user) {
        setMessage({ type: 'error', text: 'User not found. Please log in again.' });
        setIsLoading(false);
        return;
      }

      const result = await generateAndSendOTP(companyEmail, user.uid);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: `✅ New OTP sent to ${companyEmail}. Check your inbox.` 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: result.error || 'Failed to resend OTP. Please try again.' 
        });
      }
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: `Error: ${error.message || 'Failed to resend OTP'}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading verification...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/referral" className="inline-block mb-6">
            <button className="text-orange-600 hover:text-orange-800 font-medium">
              ← Back to Referral Hub
            </button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get Verified as an Employee
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Verify your company email to post referral jobs and earn bonuses. 
            It takes just 2 minutes!
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${step === 'email' || step === 'otp' || step === 'verified' ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'email' || step === 'otp' || step === 'verified' ? 'bg-orange-100 border-2 border-orange-500' : 'bg-gray-100 border-2 border-gray-300'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Enter Email</span>
            </div>
            
            <div className="w-12 h-1 bg-gray-300"></div>
            
            <div className={`flex items-center ${step === 'otp' || step === 'verified' ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'otp' || step === 'verified' ? 'bg-orange-100 border-2 border-orange-500' : 'bg-gray-100 border-2 border-gray-300'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Verify OTP</span>
            </div>
            
            <div className="w-12 h-1 bg-gray-300"></div>
            
            <div className={`flex items-center ${step === 'verified' ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'verified' ? 'bg-orange-100 border-2 border-orange-500' : 'bg-gray-100 border-2 border-gray-300'}`}>
                3
              </div>
              <span className="ml-2 font-medium">Verified!</span>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-8 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {/* Step 1: Email Entry */}
        {step === 'email' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Your Company Email</h2>
            
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-6">
                <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Email Address
                </label>
                <input
                  type="email"
                  id="companyEmail"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  placeholder="name@yourcompany.com"
                  required
                  disabled={isLoading}
                />
                <p className="mt-2 text-sm text-gray-500">
                  {TEST_MODE 
                    ? "TEST MODE: Personal emails allowed for testing" 
                    : "Use your official company email (e.g., @google.com, @microsoft.com, @amazon.com)"
                  }
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-800 mb-2">Why we verify:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Ensures only real employees can post referral jobs</li>
                  <li>• Builds trust with job seekers</li>
                  <li>• Required to earn referral bonuses</li>
                  <li>• We'll send a 6-digit OTP to verify ownership</li>
                </ul>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Sending OTP...
                  </span>
                ) : (
                  'Send Verification OTP'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Verification Code</h2>
            <p className="text-gray-600 mb-6">
              We sent a 6-digit code to <span className="font-semibold">{companyEmail}</span>
            </p>
            
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-6">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  placeholder="123456"
                  maxLength={6}
                  required
                  disabled={isLoading}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Enter the 6-digit code from your email
                </p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Resend OTP
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </span>
                  ) : (
                    'Verify & Continue'
                  )}
                </button>
              </div>
              
              <p className="mt-4 text-sm text-gray-500 text-center">
                Didn't receive the email? Check your spam folder or try resending.
              </p>
            </form>
          </div>
        )}

        {/* Step 3: Verified Success */}
        {step === 'verified' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🎉 Verification Successful!</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You are now a verified employee. You can start posting referral jobs and earn bonuses!
              </p>
              
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-lg text-gray-900 mb-4">🎯 Next Steps:</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-orange-100 text-orange-800 rounded-full p-2 mr-4">
                      1
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">Post Your First Referral Job</h4>
                      <p className="text-gray-600 text-sm">Share job openings from your company and set a referral bonus</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-orange-100 text-orange-800 rounded-full p-2 mr-4">
                      2
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">Connect with Job Seekers</h4>
                      <p className="text-gray-600 text-sm">Chat directly with qualified candidates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-orange-100 text-orange-800 rounded-full p-2 mr-4">
                      3
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">Earn Referral Bonuses</h4>
                      <p className="text-gray-600 text-sm">Get paid when your referral gets hired</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => router.push('/referral/post')}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition"
                >
                  Post Your First Referral Job →
                </button>
                
                <button
                  onClick={() => router.push('/referral/marketplace')}
                  className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition"
                >
                  Browse Referral Marketplace
                </button>
              </div>
              
              <p className="mt-6 text-sm text-gray-500">
                Redirecting to job posting page in 3 seconds...
              </p>
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="text-orange-600 text-2xl mb-4">💰</div>
            <h3 className="font-bold text-gray-900 mb-2">Earn Money</h3>
            <p className="text-gray-600 text-sm">
              Get referral bonuses ranging from ₹15,000 to ₹50,000+ per successful hire
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="text-orange-600 text-2xl mb-4">🤝</div>
            <h3 className="font-bold text-gray-900 mb-2">Help Others</h3>
            <p className="text-gray-600 text-sm">
              Connect talented job seekers with opportunities at your company
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="text-orange-600 text-2xl mb-4">🏆</div>
            <h3 className="font-bold text-gray-900 mb-2">Build Network</h3>
            <p className="text-gray-600 text-sm">
              Expand your professional network with verified connections
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Why verify with company email?</h4>
              <p className="text-gray-600 text-sm">
                We use company email verification to ensure only real employees can post referral jobs, which builds trust in our marketplace and prevents fraud.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">How long does verification take?</h4>
              <p className="text-gray-600 text-sm">
                Usually 2-5 minutes. You'll receive an OTP immediately after entering your email. The entire process takes less than 5 minutes.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Is my information secure?</h4>
              <p className="text-gray-600 text-sm">
                Yes! We use industry-standard encryption and never share your company email or personal details without your consent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}