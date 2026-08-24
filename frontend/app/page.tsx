// 'use client';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';
// // Removed DarkModeSwitch import

// export default function Home() {
//   const router = useRouter();
//   const [currentFeature, setCurrentFeature] = useState(0);

//   const features = [
//     {
//       title: "Job Posting & Discovery",
//       description: "Post jobs or find perfect opportunities tailored for India's every cities",
//       icon: "📋",
//       details: [
//         "Create detailed job listings",
//         "Advanced search and filtering",
//         "Application tracking system",
//         "Company profile pages"
//       ]
//     },
//     {
//       title: "Professional Networking",
//       description: "Connect with professionals across India's growing cities",
//       icon: "🔗",
//       details: [
//         "Send and accept connection requests",
//         "Follow companies and professionals",
//         "Message connections directly",
//         "View who's viewed your profile"
//       ]
//     },
//     {
//       title: "Content Sharing",
//       description: "Share professional insights and updates",
//       icon: "💬",
//       details: [
//         "Post text updates and articles",
//         "Engage with likes and comments",
//         "Share professional achievements",
//         "Coming soon: Image and video sharing"
//       ]
//     },
//     {
//       title: "Profile Management",
//       description: "Showcase your skills and experience",
//       icon: "👤",
//       details: [
//         "Create a professional profile",
//         "Highlight skills and experience",
//         "Showcase projects and portfolio",
//         "Receive endorsements from connections"
//       ]
//     }
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentFeature((prev) => (prev + 1) % features.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="min-h-screen bg-white transition-colors duration-300">
//       {/* Navigation */}
//       <nav className="bg-white border-b border-orange-200 py-4 sticky top-0 z-50 transition-colors duration-300">
//         <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
//           <div className="flex items-center">
//             <span className="text-2xl font-bold text-orange-600">ALL</span>
//           </div>
//           <div className="flex items-center space-x-4">
//             {/* Removed DarkModeSwitch component */}
//             <Link href="/jobs" className="text-black hover:text-orange-600 transition-colors">
//               Jobs
//             </Link>
//             <button 
//               onClick={() => router.push('/login')}
//               className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200"
//             >
//               Sign In
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="py-16 px-4 bg-gradient-to-b from-orange-50 to-white transition-colors duration-300">
//         <div className="max-w-4xl mx-auto text-center">
//           <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 transition-colors duration-300">
//             The Professional Network for <span className="text-orange-600">India's Growing Cities</span>
//           </h1>
//           <p className="text-xl text-black mb-8 max-w-2xl mx-auto transition-colors duration-300">
//             Connect with professionals, discover opportunities, and grow your career - all in one platform designed for India's every cities.
//           </p>
//           <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
//             <button 
//               onClick={() => router.push('/login')}
//               className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-all duration-200 transform hover:scale-105"
//             >
//               Join Now - It's Free
//             </button>
//             <button 
//               onClick={() => router.push('/jobs')}
//               className="px-6 py-3 bg-white text-black border border-orange-300 rounded-xl font-medium hover:bg-orange-50 transition-all duration-200"
//             >
//               Browse Jobs
//             </button>
//           </div>
//           <div className="flex flex-wrap justify-center gap-6 text-black transition-colors duration-300">
//             <div className="flex items-center">
//               <span className="text-orange-500 mr-2">📌</span>
//               <span>Professionals Connection</span>
//             </div>
//             <div className="flex items-center">
//               <span className="text-orange-500 mr-2">📄</span>
//               <span>50+ Job Opportunities</span>
//             </div>
//             <div className="flex items-center">
//               <span className="text-orange-500 mr-2">⭐</span>
//               <span>More features to come</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Early User Program */}
//       <section className="py-16 px-4 bg-orange-100 transition-colors duration-300">
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="bg-white rounded-2xl p-8 border border-orange-200 shadow-lg transition-colors duration-300">
//             <h2 className="text-3xl font-bold text-black mb-4 transition-colors duration-300">
//               <span className="text-orange-600">Be Our Early User!</span>
//             </h2>
//             <p className="text-black mb-6 transition-colors duration-300">
//               We're building <span className="text-orange-600 font-medium">ALL</span> every day with our community. Join us as an early user and help shape the future of professional networking in India's growing cities.
//             </p>
//             <div className="bg-orange-50 rounded-xl p-6 mb-6 transition-colors duration-300">
//               <h3 className="text-xl font-semibold text-black mb-4">First 10 to Reach 10,000 Connections</h3>
//               <p className="text-black">
//                 The first 10 users to reach 10,000 connections will be featured on our homepage
//               </p>
//             </div>
//             <button 
//               onClick={() => router.push('/login')}
//               className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-all duration-200"
//             >
//               Join as Early User
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Animated Feature Showcase */}
//       <section className="py-16 px-4 bg-white transition-colors duration-300">
//         <div className="max-w-5xl mx-auto">
//           <h2 className="text-3xl font-bold text-black text-center mb-4 transition-colors duration-300">
//             Everything You Need for <span className="text-orange-600">Professional Growth</span>
//           </h2>
//           <p className="text-black text-center mb-12 max-w-2xl mx-auto transition-colors duration-300">
//             <span className="text-orange-600">ALL</span> brings together the best features for networking, job hunting, and career development.
//           </p>
          
//           <div className="grid md:grid-cols-2 gap-8 items-center">
//             <div className="bg-orange-50 p-8 rounded-2xl border border-orange-200 h-80 flex flex-col justify-center transition-colors duration-300">
//               <div className="text-4xl mb-4">{features[currentFeature].icon}</div>
//               <h3 className="text-2xl font-semibold text-black mb-2 transition-colors duration-300">{features[currentFeature].title}</h3>
//               <p className="text-black mb-4 transition-colors duration-300">{features[currentFeature].description}</p>
//               <ul className="space-y-2">
//                 {features[currentFeature].details.map((detail, index) => (
//                   <li key={index} className="flex items-center text-black transition-colors duration-300">
//                     <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
//                     {detail}
//                   </li>
//                 ))}
//               </ul>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               {features.map((feature, index) => (
//                 <div 
//                   key={index}
//                   className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
//                     currentFeature === index 
//                       ? 'bg-orange-500 text-white border-orange-500 transform scale-105' 
//                       : 'bg-orange-100 text-black border-orange-200 hover:bg-orange-200'
//                   }`}
//                   onClick={() => setCurrentFeature(index)}
//                 >
//                   <div className="text-2xl mb-2">{feature.icon}</div>
//                   <h4 className="font-medium">{feature.title}</h4>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* What Our Developers Say */}
//       <section className="py-16 px-4 bg-orange-50 transition-colors duration-300">
//         <div className="max-w-4xl mx-auto">
//           <h2 className="text-3xl font-bold text-black text-center mb-12 transition-colors duration-300">
//             What Our <span className="text-orange-600">Developers</span> Say
//           </h2>
          
//           <div className="grid md:grid-cols-2 gap-8">
//             <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-lg transition-colors duration-300">
//               <div className="flex items-center mb-4">
//                 <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 text-xl font-bold mr-3">
//                   R
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-black">Rashid Shaikh</h4>
//                   <p className="text-black text-sm">Co-Founder & Developer</p>
//                 </div>
//               </div>
//               <p className="text-black">
//                 "Our vision with ALL is to bridge the gap between talent and opportunity in India's every cities. We're constantly iterating and improving ALL."
//               </p>
//             </div>
            
//             <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-lg transition-colors duration-300">
//               <div className="flex items-center mb-4">
//                 <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 text-xl font-bold mr-3">
//                   S
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-black">Sahil Singh</h4>
//                   <p className="text-black text-sm">Co-Founder & Developer</p>
//                 </div>
//               </div>
//               <p className="text-black">
//                 "Building ALL has been an incredible journey till now. We're focused on creating opportunities for professionals in India's every cities."
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section className="py-16 px-4 bg-white transition-colors duration-300">
//         <div className="max-w-5xl mx-auto">
//           <h2 className="text-3xl font-bold text-black text-center mb-12 transition-colors duration-300">
//             How <span className="text-orange-600">ALL</span> Works
//           </h2>
          
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
//               <h3 className="text-xl font-semibold text-black mb-2 transition-colors duration-300">Create Your Profile</h3>
//               <p className="text-black transition-colors duration-300">
//                 Build a professional profile showcasing your skills, experience, and career goals.
//               </p>
//             </div>
            
//             <div className="text-center">
//               <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
//               <h3 className="text-xl font-semibold text-black mb-2 transition-colors duration-300">Connect & Engage</h3>
//               <p className="text-black transition-colors duration-300">
//                 Find and connect with professionals, join conversations, and build your network.
//               </p>
//             </div>
            
//             <div className="text-center">
//               <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
//               <h3 className="text-xl font-semibold text-black mb-2 transition-colors duration-300">Discover Opportunities</h3>
//               <p className="text-black transition-colors duration-300">
//                 Find jobs, share insights, and grow your career with our tailored recommendations.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Final CTA */}
//       <section className="py-16 px-4 bg-gradient-to-r from-orange-500 to-orange-600 transition-colors duration-300">
//         <div className="max-w-3xl mx-auto text-center">
//           <h2 className="text-3xl font-bold text-white mb-6">
//             Ready to Transform Your Career?
//           </h2>
//           <p className="text-white mb-8 text-lg">
//             Join thousands of professionals in India's growing cities who are already building their careers on <span className="font-semibold">ALL</span>.
//           </p>
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <button 
//               onClick={() => router.push('/login')}
//               className="px-8 py-4 bg-white text-orange-600 rounded-xl font-medium hover:bg-orange-50 transition-all duration-200 transform hover:scale-105"
//             >
//               Create Your Account
//             </button>
//             <button 
//               onClick={() => router.push('/jobs')}
//               className="px-8 py-4 bg-transparent text-white border border-white rounded-xl font-medium hover:bg-white hover:text-orange-600 transition-all duration-200"
//             >
//               Explore Job Listings
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-black text-white py-12 px-4 transition-colors duration-300">
//         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
//           <div>
//             <div className="flex items-center mb-4">
//               <span className="text-2xl font-bold text-orange-500">ALL</span>
//             </div>
//             <p className="text-orange-200">
//               The professional network designed for India's every cities.
//             </p>
//           </div>
//           <div>
//             <h3 className="font-semibold mb-4">Features</h3>
//             <ul className="space-y-2">
//               <li><span className="text-orange-200">Job Posting</span></li>
//               <li><span className="text-orange-200">Professional Networking</span></li>
//               <li><span className="text-orange-200">Messaging</span></li>
//               <li><span className="text-orange-200">Content Sharing</span></li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="font-semibold mb-4">Resources</h3>
//             <ul className="space-y-2">
//               <li><Link href="/jobs" className="text-orange-200 hover:text-white transition-colors duration-300">Browse Jobs</Link></li>
//               <li><a href="#" className="text-orange-200 hover:text-white transition-colors duration-300">Help Center</a></li>
//               <li><a href="#" className="text-orange-200 hover:text-white transition-colors duration-300">Community</a></li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="font-semibold mb-4">Company</h3>
//             <ul className="space-y-2">
//               <li><a href="#" className="text-orange-200 hover:text-white transition-colors duration-300">About Us</a></li>
//               <li><a href="#" className="text-orange-200 hover:text-white transition-colors duration-300">Blog</a></li>
//               <li><a href="#" className="text-orange-200 hover:text-white transition-colors duration-300">Careers</a></li>
//               <li><a href="#" className="text-orange-200 hover:text-white transition-colors duration-300">Contact</a></li>
//             </ul>
//           </div>
//         </div>
//         <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-orange-800 text-center transition-colors duration-300">
//           <p className="text-orange-200">© 2025 ALL. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }

//  2nd here down

// 'use client';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';

// export default function Home() {
//   const router = useRouter();
//   const [activeFeature, setActiveFeature] = useState(0);

//   // REAL features that exist in your platform
//   const features = [
//     {
//       title: "Employee Referral Marketplace",
//       description: "Connect directly with company employees for referral-based hiring",
//       points: [
//         "Verified employees from top companies",
//         "Direct chat with employees before applying",
//         "Higher success rate than traditional applications",
//         "Priority consideration through referrals"
//       ],
//       status: "✅ LIVE NOW"
//     },
//     {
//       title: "Every Job, Every Second",
//       description: "Real-time job aggregation from multiple sources across India",
//       points: [
//         "Proprietary multi-source aggregation engine",
//         "Jobs from both manual posting and external sources",
//         "Instant notifications for new matching jobs",
//         "Comprehensive coverage across all cities"
//       ],
//       status: "✅ LIVE NOW"
//     },
//     {
//       title: "Professional Networking",
//       description: "Build meaningful connections that drive your career forward",
//       points: [
//         "Instant real-time messaging interface",
//         "Typing indicators and read receipts",
//         "Professional profile discovery",
//         "Connection requests with notifications"
//       ],
//       status: "✅ LIVE NOW"
//     },
//     {
//       title: "Application Management",
//       description: "Complete control over your job search process",
//       points: [
//         "Track all your applications in one dashboard",
//         "Real-time status updates from companies",
//         "Cover letter storage for each application",
//         "Company response tracking"
//       ],
//       status: "✅ LIVE NOW"
//     }
//   ];

//   // How it works - REAL steps
//   const steps = [
//     {
//       title: "Sign Up in 30 Seconds",
//       description: "Google authentication for instant account creation",
//       color: "bg-orange-500"
//     },
//     {
//       title: "Build Your Profile",
//       description: "Add skills, experience, and career preferences",
//       color: "bg-black"
//     },
//     {
//       title: "Discover Opportunities",
//       description: "Browse jobs, connect with employees, apply directly",
//       color: "bg-orange-500"
//     },
//     {
//       title: "Track & Grow",
//       description: "Monitor applications, expand network, advance career",
//       color: "bg-black"
//     }
//   ];

//   // Real platform facts
//   const platformFacts = [
//     {
//       number: "100%",
//       label: "Verified Jobs",
//       description: "We filter out spam to keep listings high quality"
//     },
//     {
//       number: "₹0",
//       label: "Cost to Join",
//       description: "Free for job seekers, always"
//     },
//     {
//       number: "Direct",
//       label: "Connections",
//       description: "No middlemen, talk directly to employees"
//     },
//     {
//       number: "Live",
//       label: "Real-time Feed",
//       description: "Jobs update continuously, not daily"
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-white font-sans">
//       {/* Fixed Navigation */}
//       <nav className="fixed w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//           <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
//             <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-xl">A</span>
//             </div>
//             <span className="ml-3 text-2xl font-bold text-black tracking-tight">ALL</span>
//           </div>
//           <div className="flex items-center space-x-8">
//             <Link href="/jobs" className="hidden md:block text-gray-600 hover:text-black font-medium text-sm uppercase tracking-wide">
//               Find Jobs
//             </Link>
//             <Link href="/network" className="hidden md:block text-gray-600 hover:text-black font-medium text-sm uppercase tracking-wide">
//               People
//             </Link>
//             <button 
//               onClick={() => router.push('/login')}
//               className="px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
//             >
//               Sign In
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="pt-32 pb-20 px-6">
//         <div className="max-w-5xl mx-auto text-center">
//           <div className="inline-block px-4 py-1.5 bg-orange-50 border border-orange-100 rounded-full mb-8">
//             <span className="text-orange-600 font-semibold text-sm tracking-wide">🚀 India's Fastest Growing Professional Network</span>
//           </div>
          
//           <h1 className="text-5xl md:text-7xl font-bold text-black mb-8 leading-[1.1] tracking-tight">
//             The Professional Network<br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500">
//               For Everyone.
//             </span>
//           </h1>
          
//           <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed">
//             Real jobs. Real connections. Real results. <br className="hidden md:block" />
//             Stop applying into the void. Start getting referred.
//           </p>
          
//           <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
//             <button 
//               onClick={() => router.push('/login')}
//               className="px-8 py-4 bg-orange-600 text-white text-lg font-bold rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all transform hover:-translate-y-1"
//             >
//               Join For Free
//             </button>
//             <button 
//               onClick={() => router.push('/jobs')}
//               className="px-8 py-4 bg-white text-black text-lg font-bold rounded-xl border border-gray-200 hover:border-black hover:bg-gray-50 transition-all"
//             >
//               Browse Open Jobs
//             </button>
//           </div>
          
//           {/* Platform Facts */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-100 pt-12 max-w-4xl mx-auto">
//             {platformFacts.map((fact, index) => (
//               <div key={index} className="text-center">
//                 <div className="text-4xl font-bold text-black mb-2">{fact.number}</div>
//                 <div className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-2">{fact.label}</div>
//                 <div className="text-xs text-gray-500">{fact.description}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-24 px-6 bg-gray-50">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 tracking-tight">
//               Platform Features
//             </h2>
//             <p className="text-lg text-gray-600">
//               Powerful tools designed to accelerate your career growth.
//             </p>
//           </div>
          
//           {/* Feature Tabs */}
//           <div className="flex flex-wrap justify-center gap-2 mb-12">
//             {features.map((feature, index) => (
//               <button
//                 key={index}
//                 onClick={() => setActiveFeature(index)}
//                 className={`px-6 py-3 rounded-full text-sm font-bold transition-all border ${
//                   activeFeature === index
//                     ? 'bg-black text-white border-black'
//                     : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 {feature.title}
//               </button>
//             ))}
//           </div>
          
//           {/* Active Feature Details */}
//           <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-xl shadow-gray-100/50">
//             <div className="grid md:grid-cols-2 gap-12 items-center">
//               <div>
//                 <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-4">
//                   {features[activeFeature].status}
//                 </div>
//                 <h3 className="text-3xl font-bold text-black mb-4">{features[activeFeature].title}</h3>
//                 <p className="text-xl text-gray-600 mb-8 leading-relaxed">{features[activeFeature].description}</p>
                
//                 <div className="space-y-4">
//                   {features[activeFeature].points.map((point, index) => (
//                     <div key={index} className="flex items-start">
//                       <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
//                         <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
//                         </svg>
//                       </div>
//                       <span className="text-black font-medium">{point}</span>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-10">
//                   <button 
//                     onClick={() => {
//                       if (activeFeature === 0) router.push('/network');
//                       if (activeFeature === 1) router.push('/jobs');
//                       if (activeFeature === 2) router.push('/dashboard/messages');
//                       if (activeFeature === 3) router.push('/dashboard/applications');
//                     }}
//                     className="inline-flex items-center text-orange-600 font-bold hover:text-orange-700"
//                   >
//                     Try Feature Now <span className="ml-2">→</span>
//                   </button>
//                 </div>
//               </div>
              
//               {/* Feature Visualization (Abstract) */}
//               <div className="bg-gradient-to-br from-orange-50 to-gray-50 rounded-2xl p-8 h-80 flex items-center justify-center border border-gray-100">
//                  {/* Visual placeholder based on index */}
//                  <div className="text-center">
//                     <div className="text-6xl mb-4 opacity-20">
//                       {activeFeature === 0 && "🤝"}
//                       {activeFeature === 1 && "⚡"}
//                       {activeFeature === 2 && "💬"}
//                       {activeFeature === 3 && "📊"}
//                     </div>
//                     <p className="text-gray-400 font-medium">Live System Demo</p>
//                  </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Employee Referral Marketplace - Special Highlight */}
//       <section className="py-24 px-6 bg-black text-white overflow-hidden relative">
//         {/* Background Pattern */}
//         <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600 rounded-full blur-[128px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>

//         <div className="max-w-6xl mx-auto relative z-10">
//           <div className="grid md:grid-cols-2 gap-16 items-center">
//             <div>
//               <div className="inline-block px-4 py-1 border border-orange-500 text-orange-500 font-bold text-xs uppercase tracking-widest rounded-full mb-6">
//                 Game Changer
//               </div>
//               <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
//                 The Employee <br />
//                 <span className="text-orange-500">Referral Marketplace</span>
//               </h2>
//               <p className="text-xl text-gray-400 mb-8 leading-relaxed">
//                 Why apply blindly? Our marketplace connects you with verified employees at your dream companies. Chat, connect, and get referred directly.
//               </p>
              
//               <button 
//                 onClick={() => router.push('/network')}
//                 className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-all"
//               >
//                 Find Verified Employees
//               </button>
//             </div>
            
//             <div className="space-y-6">
//                {/* Step 1 */}
//                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-orange-500/50 transition-colors">
//                   <div className="flex items-center mb-2">
//                     <span className="text-orange-500 font-bold mr-3">01</span>
//                     <h4 className="font-bold text-lg">Search & Discover</h4>
//                   </div>
//                   <p className="text-gray-400 pl-8 text-sm">Filter employees by company, role, or location to find the right match.</p>
//                </div>
               
//                {/* Step 2 */}
//                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-orange-500/50 transition-colors">
//                   <div className="flex items-center mb-2">
//                     <span className="text-orange-500 font-bold mr-3">02</span>
//                     <h4 className="font-bold text-lg">Request Connection</h4>
//                   </div>
//                   <p className="text-gray-400 pl-8 text-sm">Send a connection request to start a professional conversation.</p>
//                </div>

//                {/* Step 3 */}
//                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-orange-500/50 transition-colors">
//                   <div className="flex items-center mb-2">
//                     <span className="text-orange-500 font-bold mr-3">03</span>
//                     <h4 className="font-bold text-lg">Get Referred</h4>
//                   </div>
//                   <p className="text-gray-400 pl-8 text-sm">Impress them with your profile and get an internal referral link.</p>
//                </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Developers / Team */}
//       <section className="py-24 px-6 bg-white">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-3xl font-bold text-black mb-12 tracking-tight">Built By Developers</h2>
          
//           <div className="grid md:grid-cols-2 gap-8 text-left">
//             <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100">
//               <div className="flex items-center mb-4">
//                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">R</div>
//                  <div>
//                     <h3 className="font-bold text-black">Rashid Shaikh</h3>
//                     <p className="text-orange-600 text-xs font-bold uppercase">Platform Architect</p>
//                  </div>
//               </div>
//               <p className="text-gray-600 italic">"We built ALL to bridge the gap between talent and opportunity. Every feature is designed to make hiring faster and fairer."</p>
//             </div>

//             <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100">
//               <div className="flex items-center mb-4">
//                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">S</div>
//                  <div>
//                     <h3 className="font-bold text-black">Sahil Singh</h3>
//                     <p className="text-orange-600 text-xs font-bold uppercase">Product Director</p>
//                  </div>
//               </div>
//               <p className="text-gray-600 italic">"Our focus is on real outcomes. If a feature doesn't help you get hired or build a genuine connection, it doesn't belong on ALL."</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Final CTA */}
//       <section className="py-20 px-6 bg-orange-600">
//         <div className="max-w-3xl mx-auto text-center">
//           <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
//             Ready To Advance Your Career?
//           </h2>
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <button 
//               onClick={() => router.push('/login')}
//               className="px-10 py-4 bg-white text-black text-lg font-bold rounded-xl hover:bg-black hover:text-white transition-all shadow-xl"
//             >
//               Get Started Now
//             </button>
//           </div>
//           <p className="text-orange-200 mt-6 text-sm font-medium">Free for professionals • No credit card required</p>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-black text-white py-16 px-6 border-t border-gray-900">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
//           <div className="col-span-1 md:col-span-2">
//             <span className="text-2xl font-bold tracking-tight">ALL</span>
//             <p className="mt-4 text-gray-500 max-w-sm">
//               The professional network tailored for modern India. Connecting talent directly with verified opportunities.
//             </p>
//           </div>
          
//           <div>
//             <h4 className="font-bold mb-6 text-gray-200">Platform</h4>
//             <ul className="space-y-3 text-sm text-gray-500">
//               <li><Link href="/jobs" className="hover:text-orange-500 transition-colors">Browse Jobs</Link></li>
//               <li><Link href="/network" className="hover:text-orange-500 transition-colors">Find People</Link></li>
//               <li><Link href="/login" className="hover:text-orange-500 transition-colors">Sign In</Link></li>
//             </ul>
//           </div>
          
//           <div>
//             <h4 className="font-bold mb-6 text-gray-200">Legal</h4>
//             <ul className="space-y-3 text-sm text-gray-500">
//               <li><a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a></li>
//               <li><a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a></li>
//               <li><a href="#" className="hover:text-orange-500 transition-colors">Contact Support</a></li>
//             </ul>
//           </div>
//         </div>
//         <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-900 text-center text-gray-600 text-sm">
//           <p>© 2025 ALL Inc. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }


// ---------------------------------- working one  ---------------------------


// 'use client';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';

// export default function Home() {
//   const router = useRouter();
//   const [activeFeature, setActiveFeature] = useState(0);

//   // Helper to handle protected navigation
//   const handleProtectedAction = () => {
//     router.push('/login');
//   };

//   // REAL features that exist in your platform
//   const features = [
//     {
//       title: "Employee Referral Marketplace",
//       description: "Connect directly with company employees for referral-based hiring",
//       points: [
//         "Verified employees from top companies",
//         "Direct chat with employees before applying",
//         "Higher success rate than traditional applications",
//         "Priority consideration through referrals"
//       ],
//       status: "✅ LIVE NOW"
//     },
//     {
//       title: "Every Job, Every Second",
//       description: "Real-time job aggregation from multiple sources across India",
//       points: [
//         "Proprietary multi-source aggregation engine",
//         "Jobs from both manual posting and external sources",
//         "Live feed updates on your dashboard", // Fixed: Removed notifications claim
//         "Comprehensive coverage across all cities"
//       ],
//       status: "✅ LIVE NOW"
//     },
//     {
//       title: "Professional Networking",
//       description: "Build meaningful connections that drive your career forward",
//       points: [
//         "Instant real-time messaging interface",
//         "Typing indicators and read receipts",
//         "Professional profile discovery",
//         "Connection requests with notifications"
//       ],
//       status: "✅ LIVE NOW"
//     },
//     {
//       title: "Application Management",
//       description: "Complete control over your job search process",
//       points: [
//         "Track all your applications in one dashboard",
//         "Real-time status updates from companies",
//         "Cover letter storage for each application",
//         "Company response tracking"
//       ],
//       status: "✅ LIVE NOW"
//     }
//   ];

//   // How it works - REAL steps
//   const steps = [
//     {
//       title: "Sign Up in 30 Seconds",
//       description: "Google authentication for instant account creation",
//       color: "bg-orange-500"
//     },
//     {
//       title: "Build Your Profile",
//       description: "Add skills, experience, and career preferences",
//       color: "bg-black"
//     },
//     {
//       title: "Discover Opportunities",
//       description: "Browse jobs, connect with employees, apply directly",
//       color: "bg-orange-500"
//     },
//     {
//       title: "Track & Grow",
//       description: "Monitor applications, expand network, advance career",
//       color: "bg-black"
//     }
//   ];

//   // Real platform facts - CORRECTED
//   const platformFacts = [
//     {
//       number: "Active", // Fixed: Removed "100%"
//       label: "Job Feed", // Fixed: Removed "Verified Jobs"
//       description: "Aggregated listings from trusted sources"
//     },
//     {
//       number: "₹0",
//       label: "Cost to Join",
//       description: "Create your professional profile for free" // Fixed: Removed "always"
//     },
//     {
//       number: "Direct",
//       label: "Connections",
//       description: "No middlemen, talk directly to employees"
//     },
//     {
//       number: "Live",
//       label: "Real-time Feed",
//       description: "Jobs update continuously on the dashboard"
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-white font-sans">
//       {/* Fixed Navigation */}
//       <nav className="fixed w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//           <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
//             <span className="text-3xl font-black text-orange-600 tracking-tighter">ALL</span>
//           </div>
          
//           <div className="flex items-center space-x-8">
//             <button 
//               onClick={handleProtectedAction}
//               className="hidden md:block text-gray-600 hover:text-black font-medium text-sm uppercase tracking-wide"
//             >
//               Find Jobs
//             </button>
//             <button 
//               onClick={handleProtectedAction}
//               className="hidden md:block text-gray-600 hover:text-black font-medium text-sm uppercase tracking-wide"
//             >
//               People
//             </button>
//             <button 
//               onClick={() => router.push('/login')}
//               className="px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
//             >
//               Sign In
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="pt-32 pb-20 px-6">
//         <div className="max-w-5xl mx-auto text-center">
//           <h1 className="text-5xl md:text-7xl font-bold text-black mb-8 leading-[1.1] tracking-tight">
//             The Professional Network<br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500">
//               For Everyone.
//             </span>
//           </h1>
          
//           <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed">
//             Real jobs. Real connections. Real results. <br className="hidden md:block" />
//             Stop applying into the void. Start getting referred.
//           </p>
          
//           <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
//             <button 
//               onClick={() => router.push('/login')}
//               className="px-8 py-4 bg-orange-600 text-white text-lg font-bold rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all transform hover:-translate-y-1"
//             >
//               Join For Free
//             </button>
//             <button 
//               onClick={handleProtectedAction}
//               className="px-8 py-4 bg-white text-black text-lg font-bold rounded-xl border border-gray-200 hover:border-black hover:bg-gray-50 transition-all"
//             >
//               Browse Open Jobs
//             </button>
//           </div>
          
//           {/* Platform Facts */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-100 pt-12 max-w-4xl mx-auto">
//             {platformFacts.map((fact, index) => (
//               <div key={index} className="text-center">
//                 <div className="text-4xl font-bold text-black mb-2">{fact.number}</div>
//                 <div className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-2">{fact.label}</div>
//                 <div className="text-xs text-gray-500">{fact.description}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-24 px-6 bg-gray-50">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 tracking-tight">
//               Platform Features
//             </h2>
//             <p className="text-lg text-gray-600">
//               Powerful tools designed to accelerate your career growth.
//             </p>
//           </div>
          
//           {/* Feature Tabs */}
//           <div className="flex flex-wrap justify-center gap-2 mb-12">
//             {features.map((feature, index) => (
//               <button
//                 key={index}
//                 onClick={() => setActiveFeature(index)}
//                 className={`px-6 py-3 rounded-full text-sm font-bold transition-all border ${
//                   activeFeature === index
//                     ? 'bg-black text-white border-black'
//                     : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 {feature.title}
//               </button>
//             ))}
//           </div>
          
//           {/* Active Feature Details */}
//           <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-xl shadow-gray-100/50">
//             <div className="grid md:grid-cols-2 gap-12 items-center">
//               <div>
//                 <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-4">
//                   {features[activeFeature].status}
//                 </div>
//                 <h3 className="text-3xl font-bold text-black mb-4">{features[activeFeature].title}</h3>
//                 <p className="text-xl text-gray-600 mb-8 leading-relaxed">{features[activeFeature].description}</p>
                
//                 <div className="space-y-4">
//                   {features[activeFeature].points.map((point, index) => (
//                     <div key={index} className="flex items-start">
//                       <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
//                         <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
//                         </svg>
//                       </div>
//                       <span className="text-black font-medium">{point}</span>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-10">
//                   <button 
//                     onClick={handleProtectedAction}
//                     className="inline-flex items-center text-orange-600 font-bold hover:text-orange-700"
//                   >
//                     Try Feature Now <span className="ml-2">→</span>
//                   </button>
//                 </div>
//               </div>
              
//               {/* Feature Visualization (Abstract) */}
//               <div className="bg-gradient-to-br from-orange-50 to-gray-50 rounded-2xl p-8 h-80 flex items-center justify-center border border-gray-100">
//                  <div className="text-center">
//                     <div className="text-6xl mb-4 opacity-20">
//                       {activeFeature === 0 && "🤝"}
//                       {activeFeature === 1 && "⚡"}
//                       {activeFeature === 2 && "💬"}
//                       {activeFeature === 3 && "📊"}
//                     </div>
//                     <p className="text-gray-400 font-medium">Live System Demo</p>
//                  </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Employee Referral Marketplace - Special Highlight */}
//       <section className="py-24 px-6 bg-black text-white overflow-hidden relative">
//         <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600 rounded-full blur-[128px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>

//         <div className="max-w-6xl mx-auto relative z-10">
//           <div className="grid md:grid-cols-2 gap-16 items-center">
//             <div>
//               <div className="inline-block px-4 py-1 border border-orange-500 text-orange-500 font-bold text-xs uppercase tracking-widest rounded-full mb-6">
//                 Game Changer
//               </div>
//               <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
//                 The Employee <br />
//                 <span className="text-orange-500">Referral Marketplace</span>
//               </h2>
//               <p className="text-xl text-gray-400 mb-8 leading-relaxed">
//                 Why apply blindly? Our marketplace connects you with verified employees at your dream companies. Chat, connect, and get referred directly.
//               </p>
              
//               {/* Fixed: Updated button text */}
//               <button 
//                 onClick={handleProtectedAction}
//                 className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-all"
//               >
//                 Find verified jobs posted by verified employee
//               </button>
//             </div>
            
//             <div className="space-y-6">
//                {/* Step 1 - Fixed: Updated text */}
//                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-orange-500/50 transition-colors">
//                   <div className="flex items-center mb-2">
//                     <span className="text-orange-500 font-bold mr-3">01</span>
//                     <h4 className="font-bold text-lg">Search & Discover</h4>
//                   </div>
//                   <p className="text-gray-400 pl-8 text-sm">Filter jobs by company, role, or location to find the right match.</p>
//                </div>
               
//                {/* Step 2 */}
//                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-orange-500/50 transition-colors">
//                   <div className="flex items-center mb-2">
//                     <span className="text-orange-500 font-bold mr-3">02</span>
//                     <h4 className="font-bold text-lg">Request Connection</h4>
//                   </div>
//                   <p className="text-gray-400 pl-8 text-sm">Send a connection request to start a professional conversation.</p>
//                </div>

//                {/* Step 3 */}
//                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-orange-500/50 transition-colors">
//                   <div className="flex items-center mb-2">
//                     <span className="text-orange-500 font-bold mr-3">03</span>
//                     <h4 className="font-bold text-lg">Get Referred</h4>
//                   </div>
//                   <p className="text-gray-400 pl-8 text-sm">Impress them with your profile and get an internal referral link.</p>
//                </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Developers / Team */}
//       <section className="py-24 px-6 bg-white">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-3xl font-bold text-black mb-12 tracking-tight">Built By Developers</h2>
          
//           <div className="grid md:grid-cols-2 gap-8 text-left">
//             <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100">
//               <div className="flex items-center mb-4">
//                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">R</div>
//                  <div>
//                     <h3 className="font-bold text-black">Rashid Shaikh</h3>
//                     <p className="text-orange-600 text-xs font-bold uppercase">Head of Product</p>
//                  </div>
//               </div>
//               <p className="text-gray-600 italic">"We built ALL to bridge the gap between talent and opportunity. Every feature is designed to make hiring faster and fairer."</p>
//             </div>

//             <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100">
//               <div className="flex items-center mb-4">
//                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">S</div>
//                  <div>
//                     <h3 className="font-bold text-black">Sahil Singh</h3>
//                     <p className="text-orange-600 text-xs font-bold uppercase">Head of Operation</p>
//                  </div>
//               </div>
//               <p className="text-gray-600 italic">"Our focus is on real outcomes. If a feature doesn't help you get hired or build a genuine connection, it doesn't belong on ALL."</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Final CTA */}
//       <section className="py-20 px-6 bg-orange-600">
//         <div className="max-w-3xl mx-auto text-center">
//           <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
//             Ready To Advance Your Career?
//           </h2>
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <button 
//               onClick={() => router.push('/login')}
//               className="px-10 py-4 bg-white text-black text-lg font-bold rounded-xl hover:bg-black hover:text-white transition-all shadow-xl"
//             >
//               Get Started Now
//             </button>
//           </div>
//           <p className="text-orange-200 mt-6 text-sm font-medium">Free for professionals</p>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-black text-white py-16 px-6 border-t border-gray-900">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
//           <div className="col-span-1 md:col-span-2">
//             <span className="text-2xl font-bold tracking-tight">ALL</span>
//             <p className="mt-4 text-gray-500 max-w-sm">
//               The professional network tailored for modern India. Connecting talent directly with verified opportunities.
//             </p>
//           </div>
          
//           <div>
//             <h4 className="font-bold mb-6 text-gray-200">Platform</h4>
//             <ul className="space-y-3 text-sm text-gray-500">
//               <li><button onClick={handleProtectedAction} className="hover:text-orange-500 transition-colors">Browse Jobs</button></li>
//               <li><button onClick={handleProtectedAction} className="hover:text-orange-500 transition-colors">Find People</button></li>
//               <li><Link href="/login" className="hover:text-orange-500 transition-colors">Sign In</Link></li>
//             </ul>
//           </div>
          
//           <div>
//             <h4 className="font-bold mb-6 text-gray-200">Legal</h4>
//             <ul className="space-y-3 text-sm text-gray-500">
//               <li><a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a></li>
//               <li><a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a></li>
//               <li><a href="#" className="hover:text-orange-500 transition-colors">Contact Support</a></li>
//             </ul>
//           </div>
//         </div>
//         <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-900 text-center text-gray-600 text-sm">
//           <p>© 2026 ALL Inc. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }



'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState(0);

  // Helper to handle protected navigation
  const handleProtectedAction = () => {
    router.push('/login');
  };

  // REAL features that exist in your platform
  const features = [
    {
      title: "Employee Referral Marketplace",
      description: "Connect directly with company employees for referral-based hiring",
      points: [
        "Verified employees from top companies",
        "Direct chat with employees before applying",
        "Higher success rate than traditional applications",
        "Priority consideration through referrals"
      ],
      status: "✅ LIVE NOW"
    },
    {
      title: "Every Job, Every Second",
      description: "Real-time job aggregation from multiple sources across India",
      points: [
        "Proprietary multi-source aggregation engine",
        "Jobs from both manual posting and external sources",
        "Live feed updates on your dashboard",
        "Comprehensive coverage across all cities"
      ],
      status: "✅ LIVE NOW"
    },
    {
      title: "Professional Networking",
      description: "Build meaningful connections that drive your career forward",
      points: [
        "Instant real-time messaging interface",
        "Typing indicators and read receipts",
        "Professional profile discovery",
        "Connection requests with notifications"
      ],
      status: "✅ LIVE NOW"
    },
    {
      title: "Application Management",
      description: "Complete control over your job search process",
      points: [
        "Track all your applications in one dashboard",
        "Real-time status updates from companies",
        "Cover letter storage for each application",
        "Company response tracking"
      ],
      status: "✅ LIVE NOW"
    }
  ];

  // How it works - REAL steps
  const steps = [
    {
      title: "Sign Up in 30 Seconds",
      description: "Google authentication for instant account creation",
      color: "bg-orange-500"
    },
    {
      title: "Build Your Profile",
      description: "Add skills, experience, and career preferences",
      color: "bg-black"
    },
    {
      title: "Discover Opportunities",
      description: "Browse jobs, connect with employees, apply directly",
      color: "bg-orange-500"
    },
    {
      title: "Track & Grow",
      description: "Monitor applications, expand network, advance career",
      color: "bg-black"
    }
  ];

  // Real platform facts - CORRECTED
  const platformFacts = [
    {
      number: "Active",
      label: "Job Feed",
      description: "Aggregated listings from trusted sources"
    },
    {
      number: "₹0",
      label: "Cost to Join",
      description: "Create your professional profile for free"
    },
    {
      number: "Direct",
      label: "Connections",
      description: "No middlemen, talk directly to employees"
    },
    {
      number: "Live",
      label: "Real-time Feed",
      description: "Jobs update continuously on the dashboard"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Fixed Navigation */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
            <span className="text-3xl font-black text-orange-600 tracking-tighter">ALL</span>
          </div>
          
          <div className="flex items-center space-x-8">
            <button 
              onClick={handleProtectedAction}
              className="hidden md:block text-gray-600 hover:text-black font-medium text-sm uppercase tracking-wide"
            >
              Find Jobs
            </button>
            <button 
              onClick={handleProtectedAction}
              className="hidden md:block text-gray-600 hover:text-black font-medium text-sm uppercase tracking-wide"
            >
              People
            </button>
            <button 
              onClick={() => router.push('/login')}
              className="px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-black mb-8 leading-[1.1] tracking-tight">
            The Professional Network<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500">
              For Everyone.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed">
            Real jobs. Real connections. Real results. <br className="hidden md:block" />
            Stop applying into the void. Start getting referred.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <button 
              onClick={() => router.push('/login')}
              className="px-8 py-4 bg-orange-600 text-white text-lg font-bold rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all transform hover:-translate-y-1"
            >
              Join For Free
            </button>
            <button 
              onClick={handleProtectedAction}
              className="px-8 py-4 bg-white text-black text-lg font-bold rounded-xl border border-gray-200 hover:border-black hover:bg-gray-50 transition-all"
            >
              Browse Open Jobs
            </button>
          </div>
          
          {/* Platform Facts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-100 pt-12 max-w-4xl mx-auto">
            {platformFacts.map((fact, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-black mb-2">{fact.number}</div>
                <div className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-2">{fact.label}</div>
                <div className="text-xs text-gray-500">{fact.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 tracking-tight">
              Platform Features
            </h2>
            <p className="text-lg text-gray-600">
              Powerful tools designed to accelerate your career growth.
            </p>
          </div>
          
          {/* Feature Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`px-6 py-3 rounded-full text-sm font-bold transition-all border ${
                  activeFeature === index
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {feature.title}
              </button>
            ))}
          </div>
          
          {/* Active Feature Details */}
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-xl shadow-gray-100/50">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-4">
                  {features[activeFeature].status}
                </div>
                <h3 className="text-3xl font-bold text-black mb-4">{features[activeFeature].title}</h3>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">{features[activeFeature].description}</p>
                
                <div className="space-y-4">
                  {features[activeFeature].points.map((point, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-black font-medium">{point}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <button 
                    onClick={handleProtectedAction}
                    className="inline-flex items-center text-orange-600 font-bold hover:text-orange-700"
                  >
                    Try Feature Now <span className="ml-2">→</span>
                  </button>
                </div>
              </div>
              
              {/* Feature Visualization (Abstract) */}
              <div className="bg-gradient-to-br from-orange-50 to-gray-50 rounded-2xl p-8 h-80 flex items-center justify-center border border-gray-100">
                 <div className="text-center">
                    <div className="text-6xl mb-4 opacity-20">
                      {activeFeature === 0 && "🤝"}
                      {activeFeature === 1 && "⚡"}
                      {activeFeature === 2 && "💬"}
                      {activeFeature === 3 && "📊"}
                    </div>
                    <p className="text-gray-400 font-medium">Live System Demo</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Employee Referral Marketplace - Special Highlight */}
      <section className="py-24 px-6 bg-black text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600 rounded-full blur-[128px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-1 border border-orange-500 text-orange-500 font-bold text-xs uppercase tracking-widest rounded-full mb-6">
                Game Changer
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                The Employee <br />
                <span className="text-orange-500">Referral Marketplace</span>
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Why apply blindly? Our marketplace connects you with verified employees at your dream companies. Chat, connect, and get referred directly.
              </p>
              
              <button 
                onClick={handleProtectedAction}
                className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-all"
              >
                Find verified jobs posted by verified employee
              </button>
            </div>
            
            <div className="space-y-6">
               <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-orange-500/50 transition-colors">
                  <div className="flex items-center mb-2">
                    <span className="text-orange-500 font-bold mr-3">01</span>
                    <h4 className="font-bold text-lg">Search & Discover</h4>
                  </div>
                  <p className="text-gray-400 pl-8 text-sm">Filter jobs by company, role, or location to find the right match.</p>
               </div>
               
               <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-orange-500/50 transition-colors">
                  <div className="flex items-center mb-2">
                    <span className="text-orange-500 font-bold mr-3">02</span>
                    <h4 className="font-bold text-lg">Request Connection</h4>
                  </div>
                  <p className="text-gray-400 pl-8 text-sm">Send a connection request to start a professional conversation.</p>
               </div>

               <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-orange-500/50 transition-colors">
                  <div className="flex items-center mb-2">
                    <span className="text-orange-500 font-bold mr-3">03</span>
                    <h4 className="font-bold text-lg">Get Referred</h4>
                  </div>
                  <p className="text-gray-400 pl-8 text-sm">Impress them with your profile and get an internal referral link.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ REMOVED: "Built By Developers" section - COMPLETELY DELETED */}

      {/* Final CTA */}
      <section className="py-20 px-6 bg-orange-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
            Ready To Advance Your Career?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => router.push('/login')}
              className="px-10 py-4 bg-white text-black text-lg font-bold rounded-xl hover:bg-black hover:text-white transition-all shadow-xl"
            >
              Get Started Now
            </button>
          </div>
          <p className="text-orange-200 mt-6 text-sm font-medium">Free for professionals</p>
        </div>
      </section>

      {/* Footer - ✅ UPDATED with proper hyperlinks */}
      <footer className="bg-black text-white py-16 px-6 border-t border-gray-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold tracking-tight">ALL</span>
            <p className="mt-4 text-gray-500 max-w-sm">
              The professional network tailored for modern India. Connecting talent directly with verified opportunities.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-gray-200">Platform</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><button onClick={handleProtectedAction} className="hover:text-orange-500 transition-colors">Browse Jobs</button></li>
              <li><button onClick={handleProtectedAction} className="hover:text-orange-500 transition-colors">Find People</button></li>
              <li><Link href="/login" className="hover:text-orange-500 transition-colors">Sign In</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-gray-200">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="/support" className="hover:text-orange-500 transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-900 text-center text-gray-600 text-sm">
          <p>© 2026 ALL Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}