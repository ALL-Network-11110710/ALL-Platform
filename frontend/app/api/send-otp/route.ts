// import { NextRequest, NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';

// // Configure email transporter (SERVER-SIDE ONLY)
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

// export async function POST(request: NextRequest) {
//   try {
//     // Get data from request
//     const body = await request.json();
//     const { email, userId } = body;

//     if (!email || !userId) {
//       return NextResponse.json(
//         { success: false, error: 'Email and userId are required' },
//         { status: 400 }
//       );
//     }

//     // Check if it's a personal email domain
//     const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'protonmail.com'];
//     const emailDomain = email.split('@')[1]?.toLowerCase();
    
//     if (personalDomains.includes(emailDomain)) {
//       return NextResponse.json(
//         { success: false, error: 'Please use your company email address (not personal email like Gmail, Yahoo, etc.)' },
//         { status: 400 }
//       );
//     }

//     // Generate 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Send email
//     const mailOptions = {
//       from: `"ALL Network" <${process.env.GMAIL_USER}>`,
//       to: email,
//       subject: 'Employee Verification OTP - ALL Network',
//       html: createVerificationEmail(otp, email),
//     };

//     await transporter.sendMail(mailOptions);
    
//     // In a real app, you would save the OTP to a database here
//     // For now, we'll return it (in production, you should save to Firestore)
    
//     return NextResponse.json({
//       success: true,
//       message: 'OTP sent successfully',
//       otp: otp // For testing only - remove in production
//     });

//   } catch (error: any) {
//     console.error('Email sending error:', error);
//     return NextResponse.json(
//       { success: false, error: error.message || 'Failed to send verification email' },
//       { status: 500 }
//     );
//   }
// }

// import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/lib/firebase';
// import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// export async function POST(request: NextRequest) {
//   try {
//     // Get data from request
//     const body = await request.json();
//     const { userId, otp } = body;

//     if (!userId || !otp) {
//       return NextResponse.json(
//         { success: false, error: 'User ID and OTP are required' },
//         { status: 400 }
//       );
//     }

//     // Validate OTP format
//     if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
//       return NextResponse.json(
//         { success: false, error: 'OTP must be 6 digits' },
//         { status: 400 }
//       );
//     }

//     // Get OTP record from Firestore
//     const otpDoc = await getDoc(doc(db, 'verificationOTPs', userId));
    
//     if (!otpDoc.exists()) {
//       return NextResponse.json(
//         { success: false, error: 'OTP not found or expired. Please request a new one.' },
//         { status: 404 }
//       );
//     }

//     const otpData = otpDoc.data();
    
//     // Check if OTP is already verified
//     if (otpData.verified) {
//       await deleteDoc(doc(db, 'verificationOTPs', userId));
//       return NextResponse.json(
//         { success: false, error: 'This OTP has already been used. Please request a new one.' },
//         { status: 400 }
//       );
//     }

//     // Check expiration
//     const expiresAt = new Date(otpData.expiresAt);
//     if (new Date() > expiresAt) {
//       await deleteDoc(doc(db, 'verificationOTPs', userId));
//       return NextResponse.json(
//         { success: false, error: 'OTP has expired. Please request a new one.' },
//         { status: 400 }
//       );
//     }

//     // Check attempts (max 3 attempts)
//     if (otpData.attempts >= 3) {
//       await deleteDoc(doc(db, 'verificationOTPs', userId));
//       return NextResponse.json(
//         { success: false, error: 'Too many failed attempts. Please request a new OTP.' },
//         { status: 400 }
//       );
//     }

//     // Verify OTP
//     if (otpData.otp !== otp) {
//       // Increment attempts
//       await updateDoc(doc(db, 'verificationOTPs', userId), {
//         attempts: otpData.attempts + 1
//       });
      
//       const remainingAttempts = 3 - (otpData.attempts + 1);
//       return NextResponse.json(
//         { 
//           success: false, 
//           error: `Invalid OTP. ${remainingAttempts} attempt(s) remaining.` 
//         },
//         { status: 400 }
//       );
//     }

//     // Mark as verified and delete OTP
//     await updateDoc(doc(db, 'verificationOTPs', userId), {
//       verified: true,
//       verifiedAt: new Date().toISOString()
//     });

//     // Return success
//     return NextResponse.json({
//       success: true,
//       message: 'OTP verified successfully',
//       email: otpData.email
//     });

//   } catch (error: any) {
//     console.error('OTP verification error:', error);
    
//     let errorMessage = 'OTP verification failed. Please try again.';
    
//     if (error.code === 'permission-denied') {
//       errorMessage = 'Firestore permission denied. Please check your Firebase rules.';
//     }
    
//     return NextResponse.json(
//       { success: false, error: errorMessage },
//       { status: 500 }
//     );
//   }
// }

// import { NextRequest, NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';
// import { db } from '@/lib/firebase';
// import { doc, setDoc } from 'firebase/firestore';

// // Configure email transporter (SERVER-SIDE ONLY)
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

// // TEST MODE: Set to true to allow personal emails for testing
// const TEST_MODE = true;

// export async function POST(request: NextRequest) {
//   try {
//     // Get data from request
//     const body = await request.json();
//     const { email, userId } = body;

//     if (!email || !userId) {
//       return NextResponse.json(
//         { success: false, error: 'Email and userId are required' },
//         { status: 400 }
//       );
//     }

//     // Check if it's a personal email domain (only if not in TEST_MODE)
//     if (!TEST_MODE) {
//       const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'protonmail.com'];
//       const emailDomain = email.split('@')[1]?.toLowerCase();
      
//       if (personalDomains.includes(emailDomain)) {
//         return NextResponse.json(
//           { success: false, error: 'Please use your company email address (not personal email like Gmail, Yahoo, etc.)' },
//           { status: 400 }
//         );
//       }
//     }

//     // Generate 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Store OTP in Firestore with 10-minute expiration
//     const otpData = {
//       otp: otp,
//       email: email,
//       userId: userId,
//       createdAt: new Date().toISOString(),
//       expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now
//       attempts: 0,
//       verified: false
//     };

//     // Save to Firestore in 'verificationOTPs' collection
//     await setDoc(doc(db, 'verificationOTPs', userId), otpData);

//     // Send email
//     const mailOptions = {
//       from: `"ALL Network" <${process.env.GMAIL_USER}>`,
//       to: email,
//       subject: TEST_MODE ? '[TEST] Employee Verification OTP - ALL Network' : 'Employee Verification OTP - ALL Network',
//       html: createVerificationEmail(otp, email),
//     };

//     const info = await transporter.sendMail(mailOptions);
    
//     console.log(`OTP sent to ${email}: ${otp} (TEST_MODE: ${TEST_MODE})`);
//     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
//     // DO NOT return the OTP in response for security
//     return NextResponse.json({
//       success: true,
//       message: TEST_MODE 
//         ? `TEST MODE: OTP sent successfully. OTP: ${otp} (For testing only)` 
//         : 'OTP sent successfully. Check your email.',
//     });

//   } catch (error: any) {
//     console.error('Email sending error:', error);
    
//     // Provide user-friendly error messages
//     let errorMessage = 'Failed to send verification email. Please try again.';
    
//     if (error.code === 'auth/invalid-email') {
//       errorMessage = 'Invalid email address. Please check and try again.';
//     } else if (error.code === 'permission-denied') {
//       errorMessage = 'Firestore permission denied. Please check your Firebase rules.';
//     } else if (error.message.includes('Invalid login')) {
//       errorMessage = 'Email service configuration error. Please contact support.';
//     }
    
//     return NextResponse.json(
//       { success: false, error: errorMessage },
//       { status: 500 }
//     );
//   }
// }

// import { NextRequest, NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';

// // TEST MODE: Set to true to allow personal emails for testing
// const TEST_MODE = true;

// // We need to use Firebase Admin SDK for server-side
// // First, try to import from firebase-admin
// let adminDb: any;
// try {
//   // Try to import the admin SDK
//   const admin = require('firebase-admin');
  
//   // Initialize if not already initialized
//   if (!admin.apps.length) {
//     admin.initializeApp({
//       credential: admin.credential.cert({
//         projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//         clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//         privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//       }),
//     });
//   }
  
//   adminDb = admin.firestore();
// } catch (error) {
//   console.warn('Firebase Admin SDK not available, falling back to client SDK for testing');
//   // We'll handle this below
// }

// // Configure email transporter (SERVER-SIDE ONLY)
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

// export async function POST(request: NextRequest) {
//   try {
//     // Get data from request
//     const body = await request.json();
//     const { email, userId } = body;

//     if (!email || !userId) {
//       return NextResponse.json(
//         { success: false, error: 'Email and userId are required' },
//         { status: 400 }
//       );
//     }

//     // Check if it's a personal email domain (only if not in TEST_MODE)
//     if (!TEST_MODE) {
//       const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'protonmail.com'];
//       const emailDomain = email.split('@')[1]?.toLowerCase();
      
//       if (personalDomains.includes(emailDomain)) {
//         return NextResponse.json(
//           { success: false, error: 'Please use your company email address (not personal email like Gmail, Yahoo, etc.)' },
//           { status: 400 }
//         );
//       }
//     }

//     // Generate 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Store OTP in Firestore with 10-minute expiration
//     const otpData = {
//       otp: otp,
//       email: email,
//       userId: userId,
//       createdAt: new Date().toISOString(),
//       expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now
//       attempts: 0,
//       verified: false
//     };

//     // Save to Firestore - Use admin SDK if available
//     if (adminDb) {
//       // Using Firebase Admin SDK
//       await adminDb.collection('verificationOTPs').doc(userId).set(otpData);
//     } else {
//       // Fallback - we'll just log for now since client SDK doesn't work server-side
//       console.log('TEST MODE: Would save OTP to Firestore:', otpData);
//       console.log('OTP for testing:', otp);
//     }

//     // Send email
//     const mailOptions = {
//       from: `"ALL Network" <${process.env.GMAIL_USER}>`,
//       to: email,
//       subject: TEST_MODE ? '[TEST] Employee Verification OTP - ALL Network' : 'Employee Verification OTP - ALL Network',
//       html: createVerificationEmail(otp, email),
//     };

//     const info = await transporter.sendMail(mailOptions);
    
//     console.log(`OTP sent to ${email}: ${otp} (TEST_MODE: ${TEST_MODE})`);
//     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
//     // Return response with OTP in TEST_MODE for testing
//     return NextResponse.json({
//       success: true,
//       message: TEST_MODE 
//         ? `TEST MODE: OTP sent successfully. OTP: ${otp} (For testing only)` 
//         : 'OTP sent successfully. Check your email.',
//       testMode: TEST_MODE,
//       otp: TEST_MODE ? otp : undefined, // Only return OTP in test mode
//     });

//   } catch (error: any) {
//     console.error('Email sending error:', error);
    
//     // Provide user-friendly error messages
//     let errorMessage = 'Failed to send verification email. Please try again.';
    
//     if (error.code === 'auth/invalid-email') {
//       errorMessage = 'Invalid email address. Please check and try again.';
//     } else if (error.message.includes('Invalid login')) {
//       errorMessage = 'Email service configuration error. Please check your Gmail credentials.';
//     } else if (error.message.includes('getaddrinfo')) {
//       errorMessage = 'Network error. Please check your internet connection.';
//     }
    
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: errorMessage,
//         details: TEST_MODE ? error.message : undefined
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

// TEST MODE: Set to true to allow personal emails for testing
const TEST_MODE = true;

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// OTP email template
const createVerificationEmail = (otp: string, companyEmail: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; }
    .otp-box { background: white; border: 2px dashed #f97316; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 10px; margin: 20px 0; border-radius: 8px; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ALL Network - Employee Verification</h1>
      <p>Verify your company email to post referral jobs</p>
    </div>
    <div class="content">
      <h2>Your Verification Code</h2>
      <p>Hello,</p>
      <p>You've requested to verify your company email <strong>${companyEmail}</strong> for posting referral jobs on ALL Network.</p>
      
      <div class="otp-box">
        ${otp}
      </div>
      
      <p>Enter this 6-digit code on the verification page to complete the process.</p>
      
      <p><strong>This code will expire in 10 minutes.</strong></p>
      
      <p>If you didn't request this verification, please ignore this email.</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p><strong>Why verify?</strong></p>
      <ul>
        <li>✓ Post referral jobs at your company</li>
        <li>✓ Earn bonuses for successful referrals</li>
        <li>✓ Connect directly with job seekers</li>
        <li>✓ Build your professional network</li>
      </ul>
    </div>
    <div class="footer">
      <p>© 2024 ALL Network. All rights reserved.</p>
      <p>Tier 2 & 3 India's Professional Network</p>
      <p>This is an automated email, please do not reply.</p>
    </div>
  </div>
</body>
</html>
  `;
};

export async function POST(request: NextRequest) {
  try {
    // Get data from request
    const body = await request.json();
    const { email, userId } = body;

    console.log(`📧 Sending OTP request for: ${email}, user: ${userId}`);

    if (!email || !userId) {
      return NextResponse.json(
        { success: false, error: 'Email and userId are required' },
        { status: 400 }
      );
    }

    // Check if it's a personal email domain (only if not in TEST_MODE)
    if (!TEST_MODE) {
      const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'protonmail.com'];
      const emailDomain = email.split('@')[1]?.toLowerCase();
      
      if (personalDomains.includes(emailDomain)) {
        return NextResponse.json(
          { success: false, error: 'Please use your company email address (not personal email like Gmail, Yahoo, etc.)' },
          { status: 400 }
        );
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Firestore with 10-minute expiration
    const otpData = {
      otp: otp,
      email: email,
      userId: userId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now
      attempts: 0,
      verified: false
    };

    console.log(`🔑 Generated OTP: ${otp}`);
    console.log(`💾 Saving OTP to Firestore for user: ${userId}`);

    // ✅ FIX: Save to Firestore using client SDK (db)
    try {
      // Save to verificationOTPs collection
      await setDoc(doc(db, 'verificationOTPs', userId), otpData);
      console.log(`✅ OTP saved to verificationOTPs/${userId}`);
      
      // ✅ FIX: Update user document using setDoc with merge: true
      // This avoids the TypeScript error about FieldPath
      await setDoc(doc(db, 'users', userId), {
        verificationPending: true,
        companyEmail: email,
        verificationRequestedAt: new Date().toISOString(),
        latestOTP: otp, // Backup in user document
        otpExpiresAt: otpData.expiresAt
      }, { merge: true });
      
      console.log(`✅ User document updated: users/${userId}`);
      
    } catch (firestoreError: any) {
      console.error('❌ Firestore error:', firestoreError);
      // In test mode, continue anyway
      if (!TEST_MODE) {
        throw firestoreError;
      }
    }

    // Send email
    const mailOptions = {
      from: `"ALL Network" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: TEST_MODE ? '[TEST] Employee Verification OTP - ALL Network' : 'Employee Verification OTP - ALL Network',
      html: createVerificationEmail(otp, email),
    };

    await transporter.sendMail(mailOptions);
    
    console.log(`📨 Email sent to ${email}`);
    console.log(`🎯 OTP for testing: ${otp}`);
    
    // Return response
    return NextResponse.json({
      success: true,
      message: TEST_MODE 
        ? `TEST MODE: OTP sent successfully. OTP: ${otp} (For testing only)` 
        : 'OTP sent successfully. Check your email.',
      testMode: TEST_MODE,
      otp: TEST_MODE ? otp : undefined,
    });

  } catch (error: any) {
    console.error('❌ Email sending error:', error);
    
    // Provide user-friendly error messages
    let errorMessage = 'Failed to send verification email. Please try again.';
    
    if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address. Please check and try again.';
    } else if (error.message.includes('Invalid login')) {
      errorMessage = 'Email service configuration error. Please check your Gmail credentials.';
    } else if (error.message.includes('getaddrinfo')) {
      errorMessage = 'Network error. Please check your internet connection.';
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: TEST_MODE ? error.message : undefined
      },
      { status: 500 }
    );
  }
}