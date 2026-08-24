'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PrivacyPolicyPage() {
  // ✅ This prevents hydration mismatch by setting email on client side
  const [supportEmail, setSupportEmail] = useState('');

  useEffect(() => {
    setSupportEmail('all.network0672@gmail.com'); // 👈 Put YOUR email here
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-black tracking-tight">Privacy Policy</h1>
            <p className="text-neutral-500 mt-1">Last Updated: August 1, 2026</p>
          </div>
          <Link 
            href="/dashboard" 
            className="text-sm font-bold text-neutral-500 hover:text-black transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8 md:p-12 prose prose-neutral max-w-none">
          
          <p className="text-neutral-600">
            Welcome to ALL (the "Platform"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">1. Information We Collect</h2>
          <p className="text-neutral-600">We collect information that you voluntarily provide to us when you:</p>
          <ul className="list-disc pl-6 text-neutral-600 space-y-1">
            <li>Create an account (name, email, phone number, password)</li>
            <li>Complete your profile (headline, skills, experience, education, resume/CV, photo)</li>
            <li>Post a job or referral opportunity</li>
            <li>Apply for a job or referral</li>
            <li>Send messages or connect with other professionals</li>
            <li>Submit feedback or support requests</li>
          </ul>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">2. How We Use Your Information</h2>
          <p className="text-neutral-600">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-neutral-600 space-y-1">
            <li>Create and manage your account</li>
            <li>Connect you with employers and other professionals</li>
            <li>Process job applications and referrals</li>
            <li>Send you notifications about relevant opportunities</li>
            <li>Improve our platform and user experience</li>
            <li>Respond to your support requests</li>
          </ul>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">3. Information Sharing</h2>
          <p className="text-neutral-600">We may share your information in the following situations:</p>
          <ul className="list-disc pl-6 text-neutral-600 space-y-1">
            <li><strong>With Employers:</strong> When you apply for a job, your profile and application are shared with the employer.</li>
            <li><strong>With Referral Partners:</strong> When you apply for a referral, your profile is shared with the referring employee.</li>
            <li><strong>With Service Providers:</strong> We use trusted third-party services (Firebase, email providers) to operate the platform.</li>
            <li><strong>Legal Compliance:</strong> If required by law or to protect the rights and safety of our users.</li>
          </ul>
          <p className="text-neutral-600 mt-3">
            <strong>Important:</strong> We do NOT sell your personal data to third parties for marketing purposes.
          </p>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">4. Data Retention</h2>
          <p className="text-neutral-600">
            We retain your personal data for as long as your account is active. If you delete your account, we will delete or anonymize your data within 30 days, except where we are required to retain certain data for legal or regulatory purposes (e.g., compliance with employment laws).
          </p>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">5. Your Rights</h2>
          <p className="text-neutral-600">You have the following rights regarding your data:</p>
          <ul className="list-disc pl-6 text-neutral-600 space-y-1">
            <li><strong>Access:</strong> Request a copy of the data we hold about you.</li>
            <li><strong>Correction:</strong> Update or correct inaccuracies in your profile.</li>
            <li><strong>Deletion:</strong> Request deletion of your account and data.</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent for certain data processing.</li>
          </ul>
          <p className="text-neutral-600 mt-3">
            To exercise these rights, please contact us at{' '}
            <a 
              href={`mailto:${supportEmail}`} 
              className="text-orange-600 hover:underline"
            >
              {supportEmail || 'Loading...'}
            </a>.
          </p>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">6. Cookies and Tracking</h2>
          <p className="text-neutral-600">
            We use cookies and similar technologies to enhance your experience, analyze usage, and serve relevant content. You can control cookie preferences in your browser settings.
          </p>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">7. Data Security</h2>
          <p className="text-neutral-600">
            We implement industry-standard security measures, including encryption, access controls, and regular monitoring, to protect your data from unauthorized access, disclosure, or loss. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">8. Children's Privacy</h2>
          <p className="text-neutral-600">
            Our platform is not intended for individuals under the age of 18. We do not knowingly collect data from minors. If you believe we have collected data from a minor, please contact us to have it removed.
          </p>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">9. Changes to This Policy</h2>
          <p className="text-neutral-600">
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page with a new "Last Updated" date. We encourage you to review this policy periodically.
          </p>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">10. Contact Us</h2>
          <p className="text-neutral-600">
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
          </p>
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 mt-3">
            <p className="font-medium text-black">ALL Platform Team</p>
            <p className="text-neutral-600">
              Email: 
              <a 
                href={`mailto:${supportEmail}`} 
                className="text-orange-600 hover:underline ml-1"
              >
                {supportEmail || 'Loading...'}
              </a>
            </p>
          </div>

          <p className="text-neutral-500 text-sm mt-8 border-t border-neutral-200 pt-6">
            By using the ALL Platform, you consent to the collection and use of your personal data as described in this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}