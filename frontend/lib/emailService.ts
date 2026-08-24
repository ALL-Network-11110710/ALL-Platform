// import nodemailer from 'nodemailer';
// import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
// import { db } from './firebase';

// // Configure email transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASSWORD,
//   },
// });

// // OTP email template
// const createVerificationEmail = (otp: string, companyEmail: string) => {
//   return `
// <!DOCTYPE html>
// <html>
// <head>
//   <style>
//     body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//     .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//     .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//     .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; }
//     .otp-box { background: white; border: 2px dashed #f97316; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 10px; margin: 20px 0; border-radius: 8px; }
//     .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
//     .button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 0; }
//   </style>
// </head>
// <body>
//   <div class="container">
//     <div class="header">
//       <h1>ALL Network - Employee Verification</h1>
//       <p>Verify your company email to post referral jobs</p>
//     </div>
//     <div class="content">
//       <h2>Your Verification Code</h2>
//       <p>Hello,</p>
//       <p>You've requested to verify your company email <strong>${companyEmail}</strong> for posting referral jobs on ALL Network.</p>
      
//       <div class="otp-box">
//         ${otp}
//       </div>
      
//       <p>Enter this 6-digit code on the verification page to complete the process.</p>
      
//       <p><strong>This code will expire in 10 minutes.</strong></p>
      
//       <p>If you didn't request this verification, please ignore this email.</p>
      
//       <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
//       <p><strong>Why verify?</strong></p>
//       <ul>
//         <li>✓ Post referral jobs at your company</li>
//         <li>✓ Earn bonuses for successful referrals</li>
//         <li>✓ Connect directly with job seekers</li>
//         <li>✓ Build your professional network</li>
//       </ul>
//     </div>
//     <div class="footer">
//       <p>© 2024 ALL Network. All rights reserved.</p>
//       <p>Tier 2 & 3 India's Professional Network</p>
//       <p>This is an automated email, please do not reply.</p>
//     </div>
//   </div>
// </body>
// </html>
//   `;
// };

// // Generate and store OTP
// export async function generateAndSendOTP(email: string, userId: string): Promise<{ success: boolean; otp?: string; error?: string }> {
//   try {
//     // Check if it's a personal email domain
//     const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'protonmail.com'];
//     const emailDomain = email.split('@')[1]?.toLowerCase();
    
//     if (personalDomains.includes(emailDomain)) {
//       return {
//         success: false,
//         error: 'Please use your company email address (not personal email like Gmail, Yahoo, etc.)'
//       };
//     }

//     // Generate 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
//     // Create OTP record in Firestore
//     const otpData = {
//       otp,
//       email,
//       userId,
//       createdAt: new Date().toISOString(),
//       expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
//       attempts: 0,
//       verified: false
//     };

//     // Store in Firestore
//     await setDoc(doc(db, 'verificationOTPs', userId), otpData);

//     // Send email
//     const mailOptions = {
//       from: `"ALL Network" <${process.env.GMAIL_USER}>`,
//       to: email,
//       subject: 'Employee Verification OTP - ALL Network',
//       html: createVerificationEmail(otp, email),
//     };

//     await transporter.sendMail(mailOptions);
    
//     return { success: true, otp };
    
//   } catch (error: any) {
//     console.error('Email sending error:', error);
//     return {
//       success: false,
//       error: error.message || 'Failed to send verification email. Please try again.'
//     };
//   }
// }

// // Verify OTP
// export async function verifyOTP(userId: string, userOtp: string): Promise<{ success: boolean; error?: string }> {
//   try {
//     // Get OTP record
//     const otpDoc = await getDoc(doc(db, 'verificationOTPs', userId));
    
//     if (!otpDoc.exists()) {
//       return { success: false, error: 'OTP expired or not found. Please request a new one.' };
//     }

//     const otpData = otpDoc.data();
    
//     // Check expiration
//     const expiresAt = new Date(otpData.expiresAt);
//     if (new Date() > expiresAt) {
//       await deleteDoc(doc(db, 'verificationOTPs', userId));
//       return { success: false, error: 'OTP has expired. Please request a new one.' };
//     }

//     // Check attempts
//     if (otpData.attempts >= 3) {
//       await deleteDoc(doc(db, 'verificationOTPs', userId));
//       return { success: false, error: 'Too many failed attempts. Please request a new OTP.' };
//     }

//     // Verify OTP
//     if (otpData.otp !== userOtp) {
//       // Increment attempts
//       await setDoc(doc(db, 'verificationOTPs', userId), {
//         ...otpData,
//         attempts: otpData.attempts + 1
//       }, { merge: true });
      
//       return { success: false, error: 'Invalid OTP. Please try again.' };
//     }

//     // Mark as verified and delete OTP
//     await deleteDoc(doc(db, 'verificationOTPs', userId));
    
//     return { success: true };
    
//   } catch (error: any) {
//     console.error('OTP verification error:', error);
//     return {
//       success: false,
//       error: error.message || 'OTP verification failed. Please try again.'
//     };
//   }
// }

// // Check if OTP exists and is valid
// export async function checkExistingOTP(userId: string): Promise<{ exists: boolean; email?: string }> {
//   try {
//     const otpDoc = await getDoc(doc(db, 'verificationOTPs', userId));
    
//     if (!otpDoc.exists()) {
//       return { exists: false };
//     }

//     const otpData = otpDoc.data();
    
//     // Check expiration
//     const expiresAt = new Date(otpData.expiresAt);
//     if (new Date() > expiresAt) {
//       await deleteDoc(doc(db, 'verificationOTPs', userId));
//       return { exists: false };
//     }

//     return { exists: true, email: otpData.email };
    
//   } catch (error) {
//     console.error('Check OTP error:', error);
//     return { exists: false };
//   }
// }

// Client-side email service for ALL Network
// Uses API routes for server-side email sending

// /**
//  * Generate and send OTP to user's company email
//  * @param email - The company email address
//  * @param userId - The user's Firebase UID
//  * @returns Promise with success status and optional OTP (for testing)
//  */
// export async function generateAndSendOTP(email: string, userId: string): Promise<{ 
//   success: boolean; 
//   otp?: string; 
//   error?: string 
// }> {
//   try {
//     // Call the server-side API route
//     const response = await fetch('/api/send-otp', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ 
//         email, 
//         userId,
//         timestamp: new Date().toISOString()
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return {
//         success: false,
//         error: data.error || `Failed to send verification email (Status: ${response.status})`
//       };
//     }

//     return {
//       success: true,
//       otp: data.otp // For testing - in production, you'd save to Firestore
//     };
    
//   } catch (error: any) {
//     console.error('Email sending error:', error);
    
//     // User-friendly error messages
//     let errorMessage = 'Failed to send verification email. Please check your connection and try again.';
    
//     if (error.message.includes('Failed to fetch')) {
//       errorMessage = 'Cannot connect to server. Please check your internet connection.';
//     } else if (error.message.includes('NetworkError')) {
//       errorMessage = 'Network error. Please check your connection.';
//     }
    
//     return {
//       success: false,
//       error: errorMessage
//     };
//   }
// }

// /**
//  * Verify OTP entered by user
//  * @param userId - The user's Firebase UID
//  * @param userOtp - The OTP entered by user
//  * @returns Promise with success status
//  */
// export async function verifyOTP(userId: string, userOtp: string): Promise<{ 
//   success: boolean; 
//   error?: string 
// }> {
//   try {
//     // For now, we'll accept any 6-digit OTP for testing
//     // In production, you would:
//     // 1. Get OTP from Firestore
//     // 2. Check expiration
//     // 3. Compare with user input
    
//     if (!userOtp || userOtp.length !== 6) {
//       return { 
//         success: false, 
//         error: 'OTP must be 6 digits' 
//       };
//     }
    
//     // Test if OTP is all numbers
//     if (!/^\d{6}$/.test(userOtp)) {
//       return { 
//         success: false, 
//         error: 'OTP must contain only numbers' 
//       };
//     }
    
//     // For now, accept any valid 6-digit OTP
//     // TODO: Replace with actual Firestore verification
//     return { success: true };
    
//   } catch (error: any) {
//     console.error('OTP verification error:', error);
//     return {
//       success: false,
//       error: 'OTP verification failed. Please try again.'
//     };
//   }
// }

// /**
//  * Check if an OTP exists and is still valid
//  * @param userId - The user's Firebase UID
//  * @returns Promise with existence status and optional email
//  */
// export async function checkExistingOTP(userId: string): Promise<{ 
//   exists: boolean; 
//   email?: string 
// }> {
//   try {
//     // For now, always return false (no existing OTP)
//     // TODO: Replace with actual Firestore check
//     return { exists: false };
    
//   } catch (error) {
//     console.error('Check OTP error:', error);
//     return { exists: false };
//   }
// }

// /**
//  * Resend OTP to the same email
//  * @param email - The company email address
//  * @param userId - The user's Firebase UID
//  * @returns Promise with success status
//  */
// export async function resendOTP(email: string, userId: string): Promise<{ 
//   success: boolean; 
//   error?: string 
// }> {
//   return generateAndSendOTP(email, userId);
// }

// /**
//  * Validate email format and check if it's a company email
//  * @param email - The email to validate
//  * @returns Object with validation results
//  */
// export function validateCompanyEmail(email: string): {
//   isValid: boolean;
//   isCompanyEmail: boolean;
//   error?: string;
// } {
//   // Basic email format check
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
//   if (!email) {
//     return { isValid: false, isCompanyEmail: false, error: 'Email is required' };
//   }
  
//   if (!emailRegex.test(email)) {
//     return { isValid: false, isCompanyEmail: false, error: 'Invalid email format' };
//   }
  
//   // Check for personal email domains
//   const personalDomains = [
//     'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
//     'icloud.com', 'protonmail.com', 'aol.com', 'zoho.com',
//     'mail.com', 'yandex.com', 'gmx.com'
//   ];
  
//   const emailDomain = email.split('@')[1]?.toLowerCase();
  
//   if (personalDomains.includes(emailDomain)) {
//     return { 
//       isValid: true, 
//       isCompanyEmail: false, 
//       error: 'Please use your company email address (not personal email)' 
//     };
//   }
  
//   return { isValid: true, isCompanyEmail: true };
// }

// Client-side email service for ALL Network
// Uses API routes for server-side email sending

// /**
//  * Generate and send OTP to user's company email
//  * @param email - The company email address
//  * @param userId - The user's Firebase UID
//  * @returns Promise with success status and message
//  */
// export async function generateAndSendOTP(email: string, userId: string): Promise<{ 
//   success: boolean; 
//   message?: string;
//   error?: string 
// }> {
//   try {
//     // Call the server-side API route
//     const response = await fetch('/api/send-otp', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ 
//         email, 
//         userId,
//         timestamp: new Date().toISOString()
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return {
//         success: false,
//         error: data.error || `Failed to send verification email (Status: ${response.status})`
//       };
//     }

//     return {
//       success: true,
//       message: data.message || 'OTP sent successfully'
//     };
    
//   } catch (error: any) {
//     console.error('Email sending error:', error);
    
//     // User-friendly error messages
//     let errorMessage = 'Failed to send verification email. Please check your connection and try again.';
    
//     if (error.message.includes('Failed to fetch')) {
//       errorMessage = 'Cannot connect to server. Please check your internet connection.';
//     } else if (error.message.includes('NetworkError')) {
//       errorMessage = 'Network error. Please check your connection.';
//     }
    
//     return {
//       success: false,
//       error: errorMessage
//     };
//   }
// }

// /**
//  * Verify OTP entered by user
//  * @param userId - The user's Firebase UID
//  * @param userOtp - The OTP entered by user
//  * @returns Promise with success status
//  */
// export async function verifyOTP(userId: string, userOtp: string): Promise<{ 
//   success: boolean; 
//   email?: string;
//   message?: string;
//   error?: string 
// }> {
//   try {
//     // Call the server-side verification API
//     const response = await fetch('/api/verify-otp', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ 
//         userId,
//         otp: userOtp
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return {
//         success: false,
//         error: data.error || `OTP verification failed (Status: ${response.status})`
//       };
//     }

//     return {
//       success: true,
//       email: data.email,
//       message: data.message || 'OTP verified successfully'
//     };
    
//   } catch (error: any) {
//     console.error('OTP verification error:', error);
//     return {
//       success: false,
//       error: 'OTP verification failed. Please try again.'
//     };
//   }
// }

// /**
//  * Check if an OTP exists and is still valid
//  * @param userId - The user's Firebase UID
//  * @returns Promise with existence status and optional email
//  */
// export async function checkExistingOTP(userId: string): Promise<{ 
//   exists: boolean; 
//   email?: string;
//   expiresIn?: number;
//   error?: string;
// }> {
//   try {
//     // For now, we'll return false as we don't have a direct API for this
//     // In production, you might want to create an API to check OTP status
//     return { exists: false };
    
//   } catch (error) {
//     console.error('Check OTP error:', error);
//     return { 
//       exists: false,
//       error: 'Failed to check OTP status'
//     };
//   }
// }

// /**
//  * Validate email format and check if it's a company email
//  * @param email - The email to validate
//  * @returns Object with validation results
//  */
// export function validateCompanyEmail(email: string): {
//   isValid: boolean;
//   isCompanyEmail: boolean;
//   error?: string;
// } {
//   // Basic email format check
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
//   if (!email) {
//     return { isValid: false, isCompanyEmail: false, error: 'Email is required' };
//   }
  
//   if (!emailRegex.test(email)) {
//     return { isValid: false, isCompanyEmail: false, error: 'Invalid email format' };
//   }
  
//   // Check for personal email domains
//   const personalDomains = [
//     'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
//     'icloud.com', 'protonmail.com', 'aol.com', 'zoho.com',
//     'mail.com', 'yandex.com', 'gmx.com'
//   ];
  
//   const emailDomain = email.split('@')[1]?.toLowerCase();
  
//   if (personalDomains.includes(emailDomain)) {
//     return { 
//       isValid: true, 
//       isCompanyEmail: false, 
//       error: 'Please use your company email address (not personal email)' 
//     };
//   }
  
//   return { isValid: true, isCompanyEmail: true };
// }

// Client-side email service for ALL Network
// Uses API routes for server-side email sending

// TEST MODE: Set to true to allow personal emails for testing
const TEST_MODE = true;

/**
 * Generate and send OTP to user's company email
 */
export async function generateAndSendOTP(email: string, userId: string): Promise<{ 
  success: boolean; 
  message?: string;
  error?: string 
}> {
  try {
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, userId, timestamp: new Date().toISOString() }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || `Failed to send email` };
    }

    return { success: true, message: data.message };
    
  } catch (error: any) {
    console.error('Email sending error:', error);
    return { success: false, error: 'Failed to send verification email. Please try again.' };
  }
}

/**
 * Verify OTP entered by user
 */
export async function verifyOTP(userId: string, userOtp: string): Promise<{ 
  success: boolean; 
  email?: string;
  message?: string;
  error?: string 
}> {
  try {
    const response = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, otp: userOtp }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || `OTP verification failed` };
    }

    return { success: true, email: data.email, message: data.message };
    
  } catch (error: any) {
    console.error('OTP verification error:', error);
    return { success: false, error: 'OTP verification failed. Please try again.' };
  }
}

/**
 * Check if an OTP exists and is still valid
 */
export async function checkExistingOTP(userId: string): Promise<{ 
  exists: boolean; 
  email?: string;
  error?: string;
}> {
  try {
    // For now, return false (no existing OTP)
    // In production, you would call an API to check Firestore
    return { exists: false };
    
  } catch (error) {
    console.error('Check OTP error:', error);
    return { 
      exists: false,
      error: 'Failed to check OTP status'
    };
  }
}

/**
 * Validate email format (with TEST_MODE support)
 */
export function validateCompanyEmail(email: string): {
  isValid: boolean;
  isCompanyEmail: boolean;
  error?: string;
} {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, isCompanyEmail: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, isCompanyEmail: false, error: 'Invalid email format' };
  }
  
  // In TEST_MODE, allow all emails
  if (TEST_MODE) {
    return { isValid: true, isCompanyEmail: true };
  }
  
  // Check for personal email domains
  const personalDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
    'icloud.com', 'protonmail.com'
  ];
  
  const emailDomain = email.split('@')[1]?.toLowerCase();
  
  if (personalDomains.includes(emailDomain)) {
    return { 
      isValid: true, 
      isCompanyEmail: false, 
      error: 'Please use your company email address' 
    };
  }
  
  return { isValid: true, isCompanyEmail: true };
}

/**
 * Test function for OTP system (optional - only if you're using test page)
 */
export async function testOTPSystem(): Promise<{ 
  success: boolean; 
  message: string;
  details?: any;
}> {
  if (!TEST_MODE) {
    return {
      success: false,
      message: 'Test mode is disabled. Enable TEST_MODE to run tests.'
    };
  }

  try {
    // Test 1: Validate email
    const testEmail = 'test@example.com';
    const validation = validateCompanyEmail(testEmail);
    
    // Test 2: Simulate API call
    const testResponse = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'test@example.com', 
        userId: 'test-user-123',
        timestamp: new Date().toISOString()
      }),
    });

    return {
      success: validation.isValid && testResponse.ok,
      message: `OTP System Test: ${validation.isValid ? 'Email validation ✓' : 'Email validation ✗'} | API: ${testResponse.ok ? 'Online ✓' : 'Offline ✗'}`,
      details: {
        testMode: TEST_MODE,
        emailValidation: validation,
        apiStatus: testResponse.status
      }
    };
  } catch (error: any) {
    // Handle TypeScript error properly
    let errorMessage = 'Unknown error occurred';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String((error as any).message);
    }
    
    return {
      success: false,
      message: `OTP System Test Failed: ${errorMessage}`,
      details: { error: errorMessage }
    };
  }
}