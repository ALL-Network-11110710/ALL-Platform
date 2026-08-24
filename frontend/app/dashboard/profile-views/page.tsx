// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '@/lib/firebase';
// import { getProfileViews } from '@/lib/profileViews';
// import Link from 'next/link';

// interface ProfileView {
//   id: string;
//   viewedUserId: string;
//   viewerUserId: string;
//   viewedAt: any;
//   viewerData: {
//     displayName: string;
//     photoURL: string | null;
//     headline: string;
//     uid: string;
//   };
// }

// export default function ProfileViewsPage() {
//   const [user] = useAuthState(auth);
//   const router = useRouter();
//   const [profileViews, setProfileViews] = useState<ProfileView[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!user) {
//       router.push('/login');
//       return;
//     }
//     fetchProfileViews();
//   }, [user]);

//   const fetchProfileViews = async () => {
//     if (!user) return;
    
//     try {
//       setLoading(true);
//       const views = await getProfileViews(user.uid, 50); // Get last 50 views
//       setProfileViews(views);
//     } catch (error) {
//       console.error('Error fetching profile views:', error);
//       setError('Failed to load profile views');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatTimeAgo = (timestamp: any) => {
//     if (!timestamp) return 'Recently';
    
//     const viewedAt = timestamp.toDate();
//     const now = new Date();
//     const diffInSeconds = Math.floor((now.getTime() - viewedAt.getTime()) / 1000);
    
//     if (diffInSeconds < 60) return 'Just now';
//     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
//     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
//     if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
//     return viewedAt.toLocaleDateString();
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-4xl mx-auto px-4">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
//             <p className="text-gray-700">Loading profile views...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Profile Views</h1>
//               <p className="text-gray-600 mt-2">
//                 See who's been checking out your profile
//               </p>
//             </div>
//             <Link 
//               href="/dashboard"
//               className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
//             >
//               Back to Dashboard
//             </Link>
//           </div>
//         </div>

//         {/* Profile Views List */}
//         <div className="bg-white rounded-lg shadow-md">
//           {error ? (
//             <div className="p-8 text-center">
//               <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-2xl">⚠️</span>
//               </div>
//               <p className="text-gray-700 mb-4">{error}</p>
//               <button 
//                 onClick={fetchProfileViews}
//                 className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
//               >
//                 Try Again
//               </button>
//             </div>
//           ) : profileViews.length === 0 ? (
//             <div className="p-8 text-center">
//               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-2xl">👁️</span>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No profile views yet</h3>
//               <p className="text-gray-600 mb-4">
//                 When people view your profile, they'll appear here.
//               </p>
//               <div className="space-y-2 text-sm text-gray-500">
//                 <p>💡 Complete your profile to get more views</p>
//                 <p>💡 Connect with more professionals</p>
//                 <p>💡 Share your profile link</p>
//               </div>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-200">
//               {profileViews.map((view) => (
//                 <div key={view.id} className="p-6 hover:bg-gray-50 transition-colors">
//                   <div className="flex items-center space-x-4">
//                     {/* Viewer Avatar */}
//                     <div className="flex-shrink-0">
//                       {view.viewerData.photoURL ? (
//                         <img 
//                           src={view.viewerData.photoURL} 
//                           alt={view.viewerData.displayName}
//                           className="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
//                         />
//                       ) : (
//                         <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-200">
//                           <span className="text-orange-500 font-bold text-lg">
//                             {view.viewerData.displayName?.[0]?.toUpperCase() || 'U'}
//                           </span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Viewer Info */}
//                     <div className="flex-grow">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <h3 className="font-semibold text-gray-900">
//                             {view.viewerData.displayName}
//                           </h3>
//                           <p className="text-gray-600 text-sm">
//                             {view.viewerData.headline}
//                           </p>
//                         </div>
//                         <span className="text-sm text-gray-500">
//                           {formatTimeAgo(view.viewedAt)}
//                         </span>
//                       </div>
                      
//                       {/* Action Buttons */}
//                       <div className="flex items-center space-x-3 mt-2">
//                         <Link
//                           href={`/profile/${view.viewerUserId}`}
//                           className="text-orange-600 hover:text-orange-700 text-sm font-medium"
//                         >
//                           View Profile
//                         </Link>
//                         <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
//                           Connect
//                         </button>
//                         <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
//                           Message
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Stats */}
//         {profileViews.length > 0 && (
//           <div className="mt-6 bg-orange-50 rounded-lg p-4 border border-orange-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-orange-800 font-medium">
//                   {profileViews.length} profile view{profileViews.length !== 1 ? 's' : ''}
//                 </p>
//                 <p className="text-orange-700 text-sm">
//                   Your profile is getting attention!
//                 </p>
//               </div>
//               <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
//                 <span className="text-white text-sm">👁️</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { getProfileViews } from '@/lib/profileViews';
import Link from 'next/link';
import {
  Eye,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  ArrowLeft,
  ExternalLink,
  MessageCircle,
  UserPlus,
  Filter,
  ChevronRight,
  Globe,
  Sparkles,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';

interface ProfileView {
  id: string;
  viewedUserId: string;
  viewerUserId: string;
  viewedAt: any;
  viewerData: {
    displayName: string;
    photoURL: string | null;
    headline: string;
    uid: string;
    location?: string;
    company?: string;
  };
}

export default function ProfileViewsPage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [profileViews, setProfileViews] = useState<ProfileView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month'>('week');
  const [stats, setStats] = useState({
    totalViews: 0,
    weeklyViews: 0,
    monthlyViews: 0,
    uniqueViewers: 0
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchProfileViews();
  }, [user, timeFilter]);

  const fetchProfileViews = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const views = await getProfileViews(user.uid, 100);
      setProfileViews(views);
      
      // Calculate stats
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const weeklyViews = views.filter(v => v.viewedAt.toDate() > weekAgo).length;
      const monthlyViews = views.filter(v => v.viewedAt.toDate() > monthAgo).length;
      const uniqueViewers = new Set(views.map(v => v.viewerUserId)).size;
      
      setStats({
        totalViews: views.length,
        weeklyViews,
        monthlyViews,
        uniqueViewers
      });
    } catch (error) {
      console.error('Error fetching profile views:', error);
      setError('Failed to load profile views');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredViews = () => {
    const now = new Date();
    let filterDate = new Date();
    
    switch (timeFilter) {
      case 'week':
        filterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        filterDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return profileViews;
    }
    
    return profileViews.filter(view => view.viewedAt.toDate() > filterDate);
  };

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Recently';
    
    const viewedAt = timestamp.toDate();
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - viewedAt.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return viewedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Eye className="h-8 w-8 text-orange-500 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 font-medium mt-4">Loading your profile analytics...</p>
        </div>
      </div>
    );
  }

  const filteredViews = getFilteredViews();

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
                  Profile Analytics
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Track who's viewing your profile and gain insights
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200">
                <Globe className="h-5 w-5 text-gray-600" />
              </button>
              <button 
                onClick={fetchProfileViews}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Welcome Message */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Sparkles className="h-5 w-5 text-orange-600" />
                  <h2 className="text-xl font-bold text-orange-900">
                    Good {getTimeOfDay()}, {user?.displayName?.split(' ')[0] || 'there'}!
                  </h2>
                </div>
                <p className="text-orange-800">
                  Your professional profile has been viewed {stats.totalViews} times. 
                  {stats.weeklyViews > 0 && ` You've had ${stats.weeklyViews} views this week!`}
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Eye className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Total</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{stats.totalViews}</h3>
              <p className="text-gray-600 mt-1">Profile Views</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">7 Days</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{stats.weeklyViews}</h3>
              <p className="text-gray-600 mt-1">This Week</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">30 Days</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{stats.monthlyViews}</h3>
              <p className="text-gray-600 mt-1">This Month</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Unique</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{stats.uniqueViewers}</h3>
              <p className="text-gray-600 mt-1">Unique Viewers</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Recent Profile Views</h3>
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setTimeFilter('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeFilter === 'week'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeFilter('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeFilter === 'month'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeFilter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Profile Views List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {error ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-red-50 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Something went wrong</h3>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">{error}</p>
              <button 
                onClick={fetchProfileViews}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          ) : filteredViews.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {timeFilter === 'week' ? 'No views this week' : 'No profile views yet'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                When professionals view your profile, they'll appear here. 
                Complete your profile, share your link, and engage with the community to get more views.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mb-3 mx-auto">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-orange-900">Complete your profile</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-3 mx-auto">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-blue-900">Connect with more people</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mb-3 mx-auto">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-purple-900">Share your profile link</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredViews.map((view) => (
                <div key={view.id} className="p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200 group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {/* Viewer Avatar */}
                      <div className="relative">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center overflow-hidden shadow-sm">
                          {view.viewerData.photoURL ? (
                            <img 
                              src={view.viewerData.photoURL} 
                              alt={view.viewerData.displayName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-bold text-xl">
                              {view.viewerData.displayName?.[0]?.toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <Eye className="h-2 w-2 text-white" />
                        </div>
                      </div>

                      {/* Viewer Info */}
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">
                            {view.viewerData.displayName}
                          </h3>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            {formatTimeAgo(view.viewedAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">
                          {view.viewerData.headline}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          {view.viewerData.company && (
                            <span className="flex items-center">
                              <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                              </svg>
                              {view.viewerData.company}
                            </span>
                          )}
                          {view.viewerData.location && (
                            <span className="flex items-center">
                              <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              </svg>
                              {view.viewerData.location}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-4 mt-4">
                          <Link
                            href={`/profile/${view.viewerUserId}`}
                            className="inline-flex items-center text-orange-600 hover:text-orange-700 text-sm font-medium group-hover:underline"
                          >
                            View Profile
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Link>
                          <button className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                            <UserPlus className="h-3 w-3 mr-1" />
                            Connect
                          </button>
                          <Link
                            href={`/dashboard/messages?id=${view.viewerUserId}_${user?.uid}`}
                            className="inline-flex items-center text-gray-600 hover:text-gray-700 text-sm font-medium"
                          >
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Message
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Time Badge */}
                    <div className="hidden md:flex items-center space-x-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(view.viewedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Insights Section */}
        {filteredViews.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Profile Insights</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Trend</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {filteredViews.length > 5 ? 'Growing' : 'Starting'}
                    </p>
                  </div>
                </div>
                <p className="text-blue-700 text-sm">
                  {filteredViews.length > 5 
                    ? 'Your profile views are increasing steadily'
                    : 'Share your profile to get more views'}
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900">Engagement</p>
                    <p className="text-2xl font-bold text-green-800">{stats.uniqueViewers}</p>
                  </div>
                </div>
                <p className="text-green-700 text-sm">
                  Unique professionals viewed your profile
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-900">Opportunity</p>
                    <p className="text-2xl font-bold text-orange-800">{filteredViews.length}</p>
                  </div>
                </div>
                <p className="text-orange-700 text-sm">
                  Potential connections in {timeFilter === 'week' ? 'this week' : 'this period'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl">
          <div className="flex items-center mb-4">
            <Sparkles className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Tips to Get More Views</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Complete your profile</p>
                <p className="text-gray-600 text-sm mt-1">
                  Add a professional photo, detailed bio, work experience, and skills
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Engage with content</p>
                <p className="text-gray-600 text-sm mt-1">
                  Like, comment, and share relevant posts to increase visibility
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Grow your network</p>
                <p className="text-gray-600 text-sm mt-1">
                  Connect with professionals in your industry and related fields
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">4</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Share your profile</p>
                <p className="text-gray-600 text-sm mt-1">
                  Post your profile link on social media and professional groups
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}