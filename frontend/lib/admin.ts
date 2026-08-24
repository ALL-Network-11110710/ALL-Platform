// // lib/admin.ts
// import { User } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from './firebase';

// export const isAdmin = async (user: User): Promise<boolean> => {
//   try {
//     const userDoc = await getDoc(doc(db, 'users', user.uid));
//     return userDoc.exists() && userDoc.data()?.role === 'admin';
//   } catch (error) {
//     console.error('Error checking admin status:', error);
//     return false;
//   }
// };

// File: /lib/admin.ts
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Check if a user is an admin
 */
export const isAdmin = async (user: User): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      console.log('User document does not exist');
      return false;
    }
    
    const userData = userDoc.data();
    const isAdmin = userData?.role === 'admin';
    console.log('Admin check:', { uid: user.uid, role: userData?.role, isAdmin });
    return isAdmin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Set a user as admin
 */
export const setUserAsAdmin = async (userId: string, userData?: any): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      // Update existing user with admin role
      await updateDoc(userRef, {
        role: 'admin',
        updatedAt: new Date()
      });
      console.log('Updated existing user as admin:', userId);
    } else {
      // Create new user document with admin role
      await setDoc(userRef, {
        uid: userId,
        role: 'admin',
        email: userData?.email || '',
        displayName: userData?.displayName || 'Admin User',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...userData
      });
      console.log('Created new user as admin:', userId);
    }
    
    return true;
  } catch (error) {
    console.error('Error setting user as admin:', error);
    throw error;
  }
};

/**
 * Remove admin role from a user
 */
export const removeAdminRole = async (userId: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: 'user',
      updatedAt: new Date()
    });
    console.log('Removed admin role from user:', userId);
    return true;
  } catch (error) {
    console.error('Error removing admin role:', error);
    throw error;
  }
};

/**
 * Get all admin users
 */
export const getAllAdmins = async (): Promise<any[]> => {
  try {
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const usersRef = collection(db, 'users');
    const adminQuery = query(usersRef, where('role', '==', 'admin'));
    const snapshot = await getDocs(adminQuery);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting all admins:', error);
    return [];
  }
};

/**
 * Check if current user is admin and refresh role from Firebase
 * Use this in components to ensure admin status is up-to-date
 */
export const refreshAdminStatus = async (user: User): Promise<boolean> => {
  try {
    // Force a fresh read from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      console.error('User document not found during refresh');
      return false;
    }
    
    const userData = userDoc.data();
    console.log('Refreshed admin status:', { 
      uid: user.uid, 
      role: userData?.role,
      email: userData?.email 
    });
    
    return userData?.role === 'admin';
  } catch (error) {
    console.error('Error refreshing admin status:', error);
    return false;
  }
};

/**
 * Ensure admin role persists during user updates
 * Call this function whenever user profile is updated
 */
export const ensureAdminRolePersists = async (userId: string, currentRole: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const existingData = userDoc.data();
      // If user was admin, keep them as admin
      if (existingData?.role === 'admin' && currentRole !== 'admin') {
        await updateDoc(userRef, {
          role: 'admin', // Force keep as admin
          updatedAt: new Date()
        });
        console.log('Preserved admin role for user:', userId);
      }
    }
  } catch (error) {
    console.error('Error ensuring admin role persists:', error);
  }
};