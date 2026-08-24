// 'use client';
// import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
// import { doc, setDoc } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebase';
// import { useRouter } from 'next/navigation';

// export default function Login() {
//   const router = useRouter();

//   const handleGoogleLogin = async () => {
//     const provider = new GoogleAuthProvider();
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;

//       await setDoc(doc(db, 'users', user.uid), {
//         uid: user.uid,
//         email: user.email,
//         displayName: user.displayName,
//         photoURL: user.photoURL,
//         createdAt: new Date(),
//         lastLogin: new Date(),
//         role: 'user'
//       }, { merge: true });

//       // REDIRECT TO DASHBOARD AFTER LOGIN
//       router.push('/dashboard');
//     } catch (error) {
//       console.error('Login error:', error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-6">
//       <div className="max-w-md w-full">
//         {/* Header Section */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-black mb-2">ALL Platform</h1>
//           <p className="text-black">Professional Networking & Job Opportunities</p>
//         </div>

//         {/* Login Card */}
//         <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-200">
//           <div className="text-center mb-6">
//             <h2 className="text-2xl font-bold text-black mb-2">Welcome Back</h2>
//             <p className="text-black">Sign in to access your professional dashboard</p>
//           </div>

//           {/* Google Login Button */}
//           <button
//             onClick={handleGoogleLogin}
//             className="w-full flex items-center justify-center px-4 py-3 border border-orange-300 rounded-xl text-black font-medium hover:bg-orange-50 transition-all duration-200"
//           >
//             <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
//               <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//               <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//               <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//               <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//             </svg>
//             Sign in with Google
//           </button>

//           {/* Additional Info */}
//           <div className="mt-6 text-center">
//             <p className="text-black text-sm">
//               By signing in, you agree to our Terms of Service and Privacy Policy
//             </p>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-8">
//           <p className="text-black text-sm">
//             Focused on Tier 2 & 3 Cities in India
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// ----------------------------------- working one ---------------------

// 'use client';
// import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
// import { doc, setDoc } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebase';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link'; // Added for the Back button

// export default function Login() {
//   const router = useRouter();

//   const handleGoogleLogin = async () => {
//     const provider = new GoogleAuthProvider();
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;

//       // LOGIC PRESERVED: Save user data to Firestore
//       await setDoc(doc(db, 'users', user.uid), {
//         uid: user.uid,
//         email: user.email,
//         displayName: user.displayName,
//         photoURL: user.photoURL,
//         createdAt: new Date(),
//         lastLogin: new Date(),
//         role: 'user'
//       }, { merge: true });

//       // LOGIC PRESERVED: Redirect to dashboard
//       router.push('/dashboard');
//     } catch (error) {
//       console.error('Login error:', error);
//     }
//   };

//   return (
//     <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      
//       {/* LEFT SIDE: Brand & Vision (Hidden on Mobile) */}
//       <div className="hidden lg:flex flex-col justify-between bg-black p-12 relative overflow-hidden text-white">
//         {/* Abstract Background Blur */}
//         <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600 rounded-full blur-[150px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        
//         {/* Logo Area */}
//         <div className="z-10">
//           <Link href="/" className="text-3xl font-black tracking-tighter text-white hover:text-orange-500 transition-colors">
//             ALL
//           </Link>
//         </div>

//         {/* Value Prop */}
//         <div className="z-10 max-w-lg mb-12">
//           <h2 className="text-5xl font-bold mb-6 tracking-tight leading-tight">
//             Skip the application <br/>
//             <span className="text-orange-600">black hole.</span>
//           </h2>
//           <p className="text-gray-400 text-xl leading-relaxed">
//             Join the only professional network where you connect directly with verified employees for referrals.
//           </p>
          
//           <div className="mt-12 flex gap-8 border-t border-gray-800 pt-8">
//             <div>
//               <p className="text-3xl font-bold text-white">100%</p>
//               <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">Verified Jobs</p>
//             </div>
//             <div>
//               <p className="text-3xl font-bold text-white">0s</p>
//               <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">Latency</p>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="z-10">
//           <p className="text-sm text-gray-600">© 2026 ALL Inc. Professional Network.</p>
//         </div>
//       </div>

//       {/* RIGHT SIDE: Login Form */}
//       <div className="flex flex-col justify-center items-center p-8 bg-white relative">
//         {/* Back Button (Mobile) */}
//         <Link href="/" className="absolute top-8 right-8 text-sm font-bold text-gray-400 hover:text-black transition-colors">
//           Back to Home
//         </Link>

//         <div className="w-full max-w-md space-y-8">
//           {/* Mobile Logo (Visible only on small screens) */}
//           <div className="lg:hidden text-center mb-8">
//             <span className="text-4xl font-black text-orange-600 tracking-tighter">ALL</span>
//           </div>

//           <div className="text-center lg:text-left">
//             <h1 className="text-3xl font-bold text-black mb-3">Welcome Back</h1>
//             <p className="text-gray-500">Sign in to access your dashboard and manage your applications.</p>
//           </div>

//           <div className="pt-4 pb-6">
//             <button
//               onClick={handleGoogleLogin}
//               className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-black font-bold text-lg hover:border-black hover:bg-gray-50 transition-all duration-200 group"
//             >
//               <svg className="w-6 h-6" viewBox="0 0 24 24">
//                 <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                 <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                 <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                 <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//               </svg>
//               <span>Continue with Google</span>
//               <span className="opacity-0 group-hover:opacity-100 transition-opacity text-orange-600">→</span>
//             </button>
//           </div>

//           <div className="text-center">
//             <p className="text-xs text-gray-400 max-w-xs mx-auto">
//               By continuing, you agree to our Terms of Service and Privacy Policy. No spam, ever.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 Login mounted. Current URL:", window.location.href);

    // Listen for auth state changes to auto-redirect if already logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("👤 onAuthStateChanged fired. User:", user?.email || "null");
      
      if (user) {
        console.log("🚀 User already logged in. Sending to dashboard.");
        router.push('/dashboard');
      } else {
        setIsLoading(false);
      }
    });

    // Cleanup the listener
    return () => unsubscribe();
  }, [router]);

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    
    const provider = new GoogleAuthProvider();
    // Forces the account selection screen so users don't get stuck in auto-login loops
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      console.log("🚀 Starting Google Popup Sign-In...");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log("✅ User authenticated via popup:", user.email);

      // Save user to Firestore immediately after successful auth
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date(),
        lastLogin: new Date(),
        role: 'user'
      }, { merge: true });
      
      console.log("✅ User data saved to Firestore.");
      
      // Navigate to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error("❌ Sign-in error:", err);
      setError(`Sign-in Error: ${err.message || err.code || 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  // Show a loading spinner while checking initial auth state or logging in
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Please wait...</p>
        </div>
      </div>
    );
  }

  // --- UI ---
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <div className="hidden lg:flex flex-col justify-between bg-black p-12 relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600 rounded-full blur-[150px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="z-10">
          <Link href="/" className="text-3xl font-black tracking-tighter text-white hover:text-orange-500 transition-colors">
            ALL
          </Link>
        </div>
        <div className="z-10 max-w-lg mb-12">
          <h2 className="text-5xl font-bold mb-6 tracking-tight leading-tight">
            Skip the application <br/>
            <span className="text-orange-600">black hole.</span>
          </h2>
          <p className="text-gray-400 text-xl leading-relaxed">
            Join the only professional network where you connect directly with verified employees for referrals.
          </p>
          <div className="mt-12 flex gap-8 border-t border-gray-800 pt-8">
            <div>
              <p className="text-3xl font-bold text-white">100%</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">Verified Jobs</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">0s</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">Latency</p>
            </div>
          </div>
        </div>
        <div className="z-10">
          <p className="text-sm text-gray-600">© 2026 ALL Inc. Professional Network.</p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center p-8 bg-white relative">
        <Link href="/" className="absolute top-8 right-8 text-sm font-bold text-gray-400 hover:text-black transition-colors">
          Back to Home
        </Link>

        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center mb-8">
            <span className="text-4xl font-black text-orange-600 tracking-tighter">ALL</span>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-black mb-3">Welcome Back</h1>
            <p className="text-gray-500">Sign in to access your dashboard and manage your applications.</p>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 text-red-700 text-sm font-mono break-words">
              <strong>⚠️ Error:</strong> {error}
            </div>
          )}

          <div className="pt-4 pb-6">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-black font-bold text-lg hover:border-black hover:bg-gray-50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              By continuing, you agree to our Terms of Service and Privacy Policy. No spam, ever.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}