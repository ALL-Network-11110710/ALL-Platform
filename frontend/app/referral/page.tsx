// // /app/referral/page.tsx - SIMPLE LANDING PAGE

// "use client";

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function ReferralPage() {
//   const router = useRouter();

//   useEffect(() => {
//     // Simply redirect to the marketplace
//     router.push('/referral/marketplace');
//   }, [router]);

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
//         <p className="mt-4 text-black">Redirecting to Referral Marketplace...</p>
//       </div>
//     </div>
//   );
// }

// /app/referral/page.tsx - TWO-COLUMN LANDING PAGE

// "use client";

// import { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '@/lib/firebase';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// export default function ReferralLandingPage() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted || loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//         <p className="mt-4 text-black ml-4">Loading...</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-black mb-4">Please sign in</h1>
//           <button
//             onClick={() => router.push('/login')}
//             className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
//           >
//             Sign In to Access Referral Marketplace
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Hero Section */}
//       <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <h1 className="text-4xl font-bold mb-4">
//             Employee Referral Marketplace
//           </h1>
//           <p className="text-xl opacity-90 mb-8">
//             Skip the ATS. Connect directly with employees for referral-based hiring.
//           </p>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
//             <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
//               <div className="text-2xl font-bold">₹15K-₹50K</div>
//               <div className="text-sm">Average Referral Bonus</div>
//             </div>
//             <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
//               <div className="text-2xl font-bold">10x</div>
//               <div className="text-sm">Higher Success Rate</div>
//             </div>
//             <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
//               <div className="text-2xl font-bold">Free</div>
//               <div className="text-sm">First 3 Months</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Two-Column Layout */}
//       <div className="max-w-7xl mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
//           {/* LEFT COLUMN - FOR EMPLOYEES */}
//           <div className="bg-white rounded-2xl shadow-lg border border-orange-200 p-8">
//             <div className="text-center mb-6">
//               <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-orange-500">
//                 <span className="text-3xl">👨‍💼</span>
//               </div>
//               <h2 className="text-3xl font-bold text-black mb-2">For Employees</h2>
//               <p className="text-gray-600 text-lg">
//                 Post referral jobs and earn bonuses while helping others.
//               </p>
//             </div>

//             {/* Benefits for Employees */}
//             <div className="space-y-4 mb-8">
//               <div className="flex items-start bg-orange-50 p-4 rounded-xl">
//                 <div className="bg-orange-500 text-white rounded-lg p-2 mr-3">
//                   <span className="text-lg">💰</span>
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-black text-lg">Earn Referral Bonuses</h3>
//                   <p className="text-gray-600">Get ₹15,000 - ₹50,000+ for every successful referral you make.</p>
//                 </div>
//               </div>

//               <div className="flex items-start bg-orange-50 p-4 rounded-xl">
//                 <div className="bg-orange-500 text-white rounded-lg p-2 mr-3">
//                   <span className="text-lg">🤝</span>
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-black text-lg">Help Job Seekers</h3>
//                   <p className="text-gray-600">Help talented candidates skip the traditional ATS and get direct interviews.</p>
//                 </div>
//               </div>

//               <div className="flex items-start bg-orange-50 p-4 rounded-xl">
//                 <div className="bg-orange-500 text-white rounded-lg p-2 mr-3">
//                   <span className="text-lg">🏆</span>
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-black text-lg">Build Your Network</h3>
//                   <p className="text-gray-600">Connect with talented professionals and expand your professional network.</p>
//                 </div>
//               </div>
//             </div>

//             {/* How It Works for Employees */}
//             <div className="mb-8">
//               <h3 className="text-xl font-bold text-black mb-4 border-b border-orange-200 pb-2">
//                 How It Works for Employees:
//               </h3>
//               <ol className="space-y-3">
//                 <li className="flex items-center">
//                   <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">1</span>
//                   <span className="text-black">Verify your company email address</span>
//                 </li>
//                 <li className="flex items-center">
//                   <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">2</span>
//                   <span className="text-black">Post referral job with bonus amount</span>
//                 </li>
//                 <li className="flex items-center">
//                   <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">3</span>
//                   <span className="text-black">Chat directly with interested candidates</span>
//                 </li>
//                 <li className="flex items-center">
//                   <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">4</span>
//                   <span className="text-black">Refer qualified candidates and earn bonus!</span>
//                 </li>
//               </ol>
//             </div>

//             {/* Employee CTA */}
//             <div className="text-center">
//               <Link
//                 href="/referral/verify"
//                 className="inline-block w-full py-4 bg-orange-500 text-white text-lg font-bold rounded-xl hover:bg-orange-600 transition duration-300 shadow-lg"
//               >
//                 ✅ Get Verified as Employee
//               </Link>
//               <p className="text-sm text-gray-500 mt-2">
//                 Free verification • Post unlimited jobs • Keep 100% of referral bonus
//               </p>
//             </div>
//           </div>

//           {/* RIGHT COLUMN - FOR JOB SEEKERS */}
//           <div className="bg-white rounded-2xl shadow-lg border border-orange-200 p-8">
//             <div className="text-center mb-6">
//               <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-blue-500">
//                 <span className="text-3xl">👨‍🎓</span>
//               </div>
//               <h2 className="text-3xl font-bold text-black mb-2">For Job Seekers</h2>
//               <p className="text-gray-600 text-lg">
//                 Get direct access to employees and skip traditional applications.
//               </p>
//             </div>

//             {/* Benefits for Job Seekers */}
//             <div className="space-y-4 mb-8">
//               <div className="flex items-start bg-blue-50 p-4 rounded-xl">
//                 <div className="bg-blue-500 text-white rounded-lg p-2 mr-3">
//                   <span className="text-lg">🎯</span>
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-black text-lg">Direct Employee Access</h3>
//                   <p className="text-gray-600">Chat directly with company employees, not recruiters or HR bots.</p>
//                 </div>
//               </div>

//               <div className="flex items-start bg-blue-50 p-4 rounded-xl">
//                 <div className="bg-blue-500 text-white rounded-lg p-2 mr-3">
//                   <span className="text-lg">⚡</span>
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-black text-lg">Skip ATS Systems</h3>
//                   <p className="text-gray-600">Avoid resume screening algorithms with direct employee referrals.</p>
//                 </div>
//               </div>

//               <div className="flex items-start bg-blue-50 p-4 rounded-xl">
//                 <div className="bg-blue-500 text-white rounded-lg p-2 mr-3">
//                   <span className="text-lg">💬</span>
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-black text-lg">Real Conversations</h3>
//                   <p className="text-gray-600">Get insider information about company culture and team fit.</p>
//                 </div>
//               </div>
//             </div>

//             {/* How It Works for Job Seekers */}
//             <div className="mb-8">
//               <h3 className="text-xl font-bold text-black mb-4 border-b border-blue-200 pb-2">
//                 How It Works for Job Seekers:
//               </h3>
//               <ol className="space-y-3">
//                 <li className="flex items-center">
//                   <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">1</span>
//                   <span className="text-black">Browse verified employee job posts</span>
//                 </li>
//                 <li className="flex items-center">
//                   <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">2</span>
//                   <span className="text-black">Initiate chat with employees of interest</span>
//                 </li>
//                 <li className="flex items-center">
//                   <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">3</span>
//                   <span className="text-black">Share your profile and discuss opportunities</span>
//                 </li>
//                 <li className="flex items-center">
//                   <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">4</span>
//                   <span className="text-black">Get referred internally for faster hiring</span>
//                 </li>
//               </ol>
//             </div>

//             {/* Job Seeker CTA */}
//             <div className="text-center">
//               <Link
//                 href="/referral/marketplace"
//                 className="inline-block w-full py-4 bg-blue-500 text-white text-lg font-bold rounded-xl hover:bg-blue-600 transition duration-300 shadow-lg"
//               >
//                 🔍 Browse Referral Jobs
//               </Link>
//               <p className="text-sm text-gray-500 mt-2">
//                 Free browsing • Direct employee access • No application fees
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Common Section - Bottom CTA */}
//         <div className="mt-12 text-center">
//           <div className="bg-gradient-to-r from-orange-100 to-blue-100 rounded-2xl p-10 border border-orange-300 shadow-lg">
//             <h2 className="text-3xl font-bold text-black mb-6">
//               Ready to Get Started?
//             </h2>
//             <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
//               Whether you're an employee looking to earn referral bonuses or a job seeker wanting to skip the traditional application process, our platform connects you directly.
//             </p>
            
//             <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
//               <div className="text-center">
//                 <div className="text-4xl mb-2">🚀</div>
//                 <h3 className="text-lg font-bold text-black mb-2">For Employees</h3>
//                 <p className="text-gray-600 mb-3">Post jobs, earn bonuses, help others</p>
//                 <Link
//                   href="/referral/verify"
//                   className="inline-block px-8 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition"
//                 >
//                   Get Verified
//                 </Link>
//               </div>
              
//               <div className="text-center">
//                 <div className="text-4xl mb-2">🎯</div>
//                 <h3 className="text-lg font-bold text-black mb-2">For Job Seekers</h3>
//                 <p className="text-gray-600 mb-3">Browse jobs, chat directly, get referred</p>
//                 <Link
//                   href="/referral/marketplace"
//                   className="inline-block px-8 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition"
//                 >
//                   Browse Jobs
//                 </Link>
//               </div>
//             </div>

//             <div className="mt-10 pt-8 border-t border-orange-300">
//               <h3 className="text-2xl font-bold text-black mb-4">Why Choose ALL Referral Marketplace?</h3>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div className="bg-white rounded-xl p-4 border border-gray-200">
//                   <div className="text-xl font-bold text-orange-500 mb-1">100% Free</div>
//                   <div className="text-sm text-gray-600">First 3 months for everyone</div>
//                 </div>
//                 <div className="bg-white rounded-xl p-4 border border-gray-200">
//                   <div className="text-xl font-bold text-green-500 mb-1">No Middlemen</div>
//                   <div className="text-sm text-gray-600">Direct employee connections</div>
//                 </div>
//                 <div className="bg-white rounded-xl p-4 border border-gray-200">
//                   <div className="text-xl font-bold text-blue-500 mb-1">Bonus Protected</div>
//                   <div className="text-sm text-gray-600">Employees keep 100% of bonus</div>
//                 </div>
//                 <div className="bg-white rounded-xl p-4 border border-gray-200">
//                   <div className="text-xl font-bold text-purple-500 mb-1">Trust Verified</div>
//                   <div className="text-sm text-gray-600">Company email verification</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, Search, ArrowRight, DollarSign, Users, 
  ShieldCheck, Zap, MessageCircle, CheckCircle2, Trophy, Handshake 
} from 'lucide-react';

export default function ReferralLandingPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neutral-100 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Login Prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-neutral-200 text-center">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-black mb-2">Join the Marketplace</h1>
          <p className="text-neutral-500 mb-8">Sign in to access exclusive referral bonuses and direct employee connections.</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-200"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. HERO SECTION */}
      <div className="bg-black text-white pt-20 pb-32 relative overflow-hidden">
        {/* Abstract Background Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600 rounded-full blur-[150px] opacity-10 translate-x-1/3 -translate-y-1/3"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            Employee Referral <br />
            <span className="text-orange-500">Marketplace</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Skip the ATS. Connect directly with employees for referral-based hiring.
          </p>
        </div>
      </div>

      {/* 2. STATS BAR (Floating) */}
      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-neutral-100 flex flex-col items-center text-center">
            <span className="text-3xl font-black text-black mb-1">₹15K-₹50K</span>
            <span className="text-sm font-bold text-neutral-400 uppercase tracking-wide">Avg. Referral Bonus</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-neutral-100 flex flex-col items-center text-center">
            <span className="text-3xl font-black text-orange-600 mb-1">10x</span>
            <span className="text-sm font-bold text-neutral-400 uppercase tracking-wide">Higher Success Rate</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-neutral-100 flex flex-col items-center text-center">
            <span className="text-3xl font-black text-black mb-1">Free</span>
            <span className="text-sm font-bold text-neutral-400 uppercase tracking-wide">First 3 Months</span>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT: SPLIT COLUMNS */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* LEFT: FOR EMPLOYEES (Orange Theme) */}
          <div className="bg-orange-50 rounded-[2.5rem] p-8 md:p-12 border border-orange-100 relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-orange-500/20">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-4xl font-black text-black mb-4">For Employees</h2>
              <p className="text-lg text-neutral-600 mb-10 leading-relaxed">
                Post referral jobs and earn bonuses while helping others. Turn your company's open roles into income.
              </p>

              {/* Benefit Cards */}
              <div className="space-y-4 mb-10">
                <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm flex items-start gap-4">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><DollarSign className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-black">Earn Bonuses</h3>
                    <p className="text-sm text-neutral-500">Get ₹15,000 - ₹50,000+ for every successful referral.</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm flex items-start gap-4">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Handshake className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-black">Help Job Seekers</h3>
                    <p className="text-sm text-neutral-500">Help candidates skip the ATS and get direct interviews.</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm flex items-start gap-4">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Trophy className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-black">Build Network</h3>
                    <p className="text-sm text-neutral-500">Connect with talented professionals in your industry.</p>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="mb-10">
                <h3 className="font-bold text-black uppercase tracking-wider text-sm mb-4">How it works</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-neutral-700">
                    <span className="w-6 h-6 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-xs font-bold">1</span>
                    Verify your company email address
                  </li>
                  <li className="flex items-center gap-3 text-neutral-700">
                    <span className="w-6 h-6 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-xs font-bold">2</span>
                    Post referral job with bonus amount
                  </li>
                  <li className="flex items-center gap-3 text-neutral-700">
                    <span className="w-6 h-6 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-xs font-bold">3</span>
                    Chat directly with interested candidates
                  </li>
                  <li className="flex items-center gap-3 text-neutral-700">
                    <span className="w-6 h-6 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-xs font-bold">4</span>
                    Refer qualified candidates and earn!
                  </li>
                </ul>
              </div>

              <Link
                href="/referral/verify"
                className="flex items-center justify-center w-full py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-200 group"
              >
                Get Verified as Employee <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* RIGHT: FOR JOB SEEKERS (Black/White Theme) */}
          <div className="bg-neutral-900 rounded-[2.5rem] p-8 md:p-12 border border-neutral-800 relative overflow-hidden text-white">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <Search className="w-8 h-8 text-black" />
              </div>
              
              <h2 className="text-4xl font-black text-white mb-4">For Job Seekers</h2>
              <p className="text-lg text-neutral-400 mb-10 leading-relaxed">
                Get direct access to employees and skip traditional applications. Chat with real humans, not bots.
              </p>

              {/* Benefit Cards */}
              <div className="space-y-4 mb-10">
                <div className="bg-neutral-800 p-5 rounded-2xl border border-neutral-700 shadow-sm flex items-start gap-4">
                  <div className="p-2 bg-neutral-700 text-white rounded-lg"><Zap className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-white">Direct Access</h3>
                    <p className="text-sm text-neutral-400">Chat directly with company employees.</p>
                  </div>
                </div>
                <div className="bg-neutral-800 p-5 rounded-2xl border border-neutral-700 shadow-sm flex items-start gap-4">
                  <div className="p-2 bg-neutral-700 text-white rounded-lg"><ShieldCheck className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-white">Skip ATS</h3>
                    <p className="text-sm text-neutral-400">Avoid resume screening algorithms.</p>
                  </div>
                </div>
                <div className="bg-neutral-800 p-5 rounded-2xl border border-neutral-700 shadow-sm flex items-start gap-4">
                  <div className="p-2 bg-neutral-700 text-white rounded-lg"><MessageCircle className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-white">Real Insights</h3>
                    <p className="text-sm text-neutral-400">Get insider info on culture and team fit.</p>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="mb-10">
                <h3 className="font-bold text-neutral-500 uppercase tracking-wider text-sm mb-4">How it works</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-neutral-300">
                    <span className="w-6 h-6 rounded-full bg-neutral-700 text-white flex items-center justify-center text-xs font-bold">1</span>
                    Browse verified employee job posts
                  </li>
                  <li className="flex items-center gap-3 text-neutral-300">
                    <span className="w-6 h-6 rounded-full bg-neutral-700 text-white flex items-center justify-center text-xs font-bold">2</span>
                    Initiate chat with employees of interest
                  </li>
                  <li className="flex items-center gap-3 text-neutral-300">
                    <span className="w-6 h-6 rounded-full bg-neutral-700 text-white flex items-center justify-center text-xs font-bold">3</span>
                    Share profile and discuss opportunities
                  </li>
                  <li className="flex items-center gap-3 text-neutral-300">
                    <span className="w-6 h-6 rounded-full bg-neutral-700 text-white flex items-center justify-center text-xs font-bold">4</span>
                    Get referred internally for faster hiring
                  </li>
                </ul>
              </div>

              <Link
                href="/referral/marketplace"
                className="flex items-center justify-center w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-all shadow-lg group"
              >
                Browse Referral Jobs <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* 4. FOOTER / VALUE PROP */}
      <div className="bg-white border-t border-neutral-100 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-black mb-12">Why use the Marketplace?</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div className="text-2xl font-bold text-orange-600 mb-2">100% Free</div>
              <p className="text-neutral-500 text-sm">For the first 3 months. No hidden fees.</p>
            </div>
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div className="text-2xl font-bold text-black mb-2">No Middlemen</div>
              <p className="text-neutral-500 text-sm">Direct P2P connection. No recruiters.</p>
            </div>
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div className="text-2xl font-bold text-black mb-2">Bonus Protected</div>
              <p className="text-neutral-500 text-sm">Employees keep 100% of the bonus.</p>
            </div>
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div className="text-2xl font-bold text-green-600 mb-2">Trust Verified</div>
              <p className="text-neutral-500 text-sm">Work email verification required.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}