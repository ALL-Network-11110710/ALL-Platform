import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, orderBy, limit, doc, getDoc, Timestamp, serverTimestamp } from 'firebase/firestore';

// Record a profile view
export async function recordProfileView(viewedUserId: string, viewerUserId: string) {
  try {
    console.log('Recording profile view:', { viewedUserId, viewerUserId });
    
    // Don't record if user views their own profile
    if (viewedUserId === viewerUserId) {
      console.log('Skipping self-view');
      return null;
    }

    // Check if view already exists in last 24 hours (prevent spam)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const viewsRef = collection(db, 'profileViews');
    const recentViewQuery = query(
      viewsRef,
      where('viewedUserId', '==', viewedUserId),
      where('viewerUserId', '==', viewerUserId),
      where('viewedAt', '>', Timestamp.fromDate(twentyFourHoursAgo))
    );

    const recentViews = await getDocs(recentViewQuery);
    
    console.log('Recent views found:', recentViews.size);
    
    // If no recent view, record new view
    if (recentViews.empty) {
      const viewData = {
        viewedUserId,
        viewerUserId,
        viewedAt: serverTimestamp(), // Use serverTimestamp for consistency
        read: false
      };

      console.log('Creating new profile view:', viewData);
      const docRef = await addDoc(collection(db, 'profileViews'), viewData);
      
      // Create notification for the profile owner
      await createProfileViewNotification(viewedUserId, viewerUserId, docRef.id);
      
      console.log('Profile view recorded successfully:', docRef.id);
      return docRef.id;
    } else {
      console.log('Profile view already exists in last 24 hours, skipping');
    }

    return null;
  } catch (error) {
    console.error('Error recording profile view:', error);
    return null;
  }
}

// Create notification for profile view
async function createProfileViewNotification(viewedUserId: string, viewerUserId: string, viewId: string) {
  try {
    console.log('Creating profile view notification:', { viewedUserId, viewerUserId, viewId });
    
    // Get viewer's profile info for the notification
    const viewerDoc = await getDoc(doc(db, 'users', viewerUserId));
    const viewerData = viewerDoc.exists() ? viewerDoc.data() : null;
    
    const viewerName = viewerData?.displayName || 'Someone';
    const viewerPhoto = viewerData?.photoURL || null;
    const viewerHeadline = viewerData?.headline || 'Professional';

    const notificationData = {
      userId: viewedUserId,
      type: 'profile_view',
      title: 'Viewed your profile',
      message: `${viewerName} viewed your profile`,
      relatedId: viewId,
      viewerUserId: viewerUserId,
      viewerName: viewerName,
      viewerPhoto: viewerPhoto,
      viewerHeadline: viewerHeadline,
      read: false,
      createdAt: serverTimestamp()
    };

    console.log('Adding notification to Firestore:', notificationData);
    await addDoc(collection(db, 'notifications'), notificationData);
    console.log('Profile view notification created successfully');
  } catch (error) {
    console.error('Error creating profile view notification:', error);
  }
}

// Get profile views for a user
export async function getProfileViews(userId: string, limitCount: number = 10) {
  try {
    console.log('Fetching profile views for user:', userId);
    
    const viewsRef = collection(db, 'profileViews');
    const viewsQuery = query(
      viewsRef,
      where('viewedUserId', '==', userId),
      orderBy('viewedAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(viewsQuery);
    const views: any[] = [];

    console.log('Profile views query result:', querySnapshot.size, 'documents');

    for (const docSnap of querySnapshot.docs) {
      const viewData = docSnap.data();
      
      // Get viewer's profile data
      const viewerDoc = await getDoc(doc(db, 'users', viewData.viewerUserId));
      const viewerData = viewerDoc.exists() ? viewerDoc.data() : null;
      
      views.push({
        id: docSnap.id,
        ...viewData,
        viewerData: viewerData || {
          displayName: 'Unknown User',
          photoURL: null,
          headline: 'Professional',
          uid: viewData.viewerUserId
        }
      });
    }

    console.log('Processed profile views:', views.length);
    return views;
  } catch (error) {
    console.error('Error getting profile views:', error);
    return [];
  }
}

// Get profile views count
export async function getProfileViewsCount(userId: string) {
  try {
    console.log('Counting profile views for user:', userId);
    
    const viewsRef = collection(db, 'profileViews');
    const viewsQuery = query(
      viewsRef,
      where('viewedUserId', '==', userId)
    );

    const querySnapshot = await getDocs(viewsQuery);
    const count = querySnapshot.size;
    
    console.log('Profile views count:', count);
    return count;
  } catch (error) {
    console.error('Error getting profile views count:', error);
    return 0;
  }
}

// Mark profile view as read
export async function markProfileViewAsRead(viewId: string) {
  try {
    const viewRef = doc(db, 'profileViews', viewId);
    // Note: We'll need to update this to use updateDoc if we add this field
    // For now, we'll handle read status in the frontend
  } catch (error) {
    console.error('Error marking profile view as read:', error);
  }
}