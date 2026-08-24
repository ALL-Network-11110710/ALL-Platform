import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, otp } = body;

    if (!userId || !otp) {
      return NextResponse.json(
        { success: false, error: 'User ID and OTP are required' },
        { status: 400 }
      );
    }

    // Get the OTP from Firestore
    const otpDoc = await getDoc(doc(db, 'verificationOTPs', userId));
    
    if (!otpDoc.exists()) {
      return NextResponse.json(
        { success: false, error: 'OTP not found. Please request a new one.' },
        { status: 400 }
      );
    }

    const otpData = otpDoc.data();
    
    // Check if OTP has expired
    const expiresAt = new Date(otpData.expiresAt);
    const now = new Date();
    
    if (now > expiresAt) {
      // Delete expired OTP
      await deleteDoc(doc(db, 'verificationOTPs', userId));
      return NextResponse.json(
        { success: false, error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if OTP matches
    if (otpData.otp !== otp) {
      // Increment attempt count
      const attempts = (otpData.attempts || 0) + 1;
      await updateDoc(doc(db, 'verificationOTPs', userId), { attempts });
      
      if (attempts >= 5) {
        await deleteDoc(doc(db, 'verificationOTPs', userId));
        return NextResponse.json(
          { success: false, error: 'Too many failed attempts. Please request a new OTP.' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      );
    }

    // OTP is valid!
    // Delete the OTP document (one-time use)
    await deleteDoc(doc(db, 'verificationOTPs', userId));

    // Update user as verified
    await updateDoc(doc(db, 'users', userId), {
      isVerifiedEmployee: true,
      verificationPending: false,
      verifiedAt: new Date().toISOString(),
      verificationMethod: 'email_otp',
      companyEmail: otpData.email
    });

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      email: otpData.email,
    });

  } catch (error: any) {
    console.error('OTP verification error:', error);
    
    let errorMessage = 'Failed to verify OTP. Please try again.';
    
    if (error.code === 'permission-denied') {
      errorMessage = 'Firestore permission denied. Please check your Firebase rules.';
    } else if (error.message.includes('network')) {
      errorMessage = 'Network error. Please check your connection.';
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}