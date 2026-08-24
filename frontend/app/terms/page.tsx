'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function TermsOfServicePage() {
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
            <h1 className="text-3xl font-black text-black tracking-tight">Terms of Service</h1>
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
            Welcome to ALL (the "Platform"). By using our platform, you agree to comply with and be bound by the following Terms of Service. Please read them carefully. If you do not agree with these terms, please do not use the platform.
          </p>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">1. Acceptance of Terms</h2>
          <p className="text-neutral-600">
            By creating an account, accessing, or using the ALL platform, you agree to be bound by these Terms of Service, our Privacy Policy, and any additional terms applicable to specific features. These terms constitute a legally binding agreement between you and ALL.
          </p>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">2. User Eligibility</h2>
          <ul className="list-disc pl-6 text-neutral-600 space-y-1">
            <li>You must be at least <strong>18 years old</strong> to use this platform.</li>
            <li>By using the platform, you represent that you are legally capable of entering into a binding contract.</li>
            <li>You agree to provide accurate, current, and complete information during registration and to keep it updated.</li>
          </ul>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">3. User Accounts</h2>
          <ul className="list-disc pl-6 text-neutral-600 space-y-1">
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You are solely responsible for all activities that occur under your account.</li>
            <li>You must notify us immediately of any unauthorized use of your account.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
          </ul>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">4. User Content and Conduct</h2>
          <p className="text-neutral-600 font-medium">You agree that you will not:</p>
          <ul className="list-disc pl-6 text-neutral-600 space-y-1">
            <li>Post false, misleading, or fraudulent information</li>
            <li>Impersonate any person or entity</li>
            <li>Harass, abuse, or threaten other users</li>
            <li>Post inappropriate, defamatory, or obscene content</li>
            <li>Infringe on the intellectual property rights of others</li>
            <li>Upload viruses, malware, or any harmful code</li>
            <li>Collect user data without consent (data scraping)</li>
            <li>Use the platform for any illegal or unauthorized purpose</li>
          </ul>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">5. Job Postings and Applications</h2>
          <ul className="list-disc pl-6 text-neutral-600 space-y-1">
            <li>Employers posting jobs must provide accurate and legitimate information.</li>
            <li>Job postings must comply with all applicable employment laws.</li>
            <li>We reserve the right to remove job postings that violate our policies.</li>
            <li>Job applications are submitted directly to employers; we are not responsible for hiring decisions.</li>
            <li>We do not guarantee that you will receive a job offer or referral.</li>
          </ul>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">6. Referral Marketplace</h2>
          <ul className="list-disc pl-6 text-neutral-600 space-y-1">
            <li>Employees posting referrals must have accurate and legitimate referral opportunities.</li>
            <li>Referral fees or compensation are negotiated directly between the referrer and the candidate.</li>
            <li>We are not responsible for the outcome of any referral arrangement.</li>
          </ul>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">7. Intellectual Property</h2>
          <ul className="list-disc pl-6 text-neutral-600 space-y-1">
            <li>All content on the platform (text, graphics, logos, software) is the property of ALL or our licensors and is protected by copyright and trademark laws.</li>
            <li>You retain ownership of the content you post on the platform.</li>
            <li>By posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content to provide our services.</li>
          </ul>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">8. Third-Party Links</h2>
          <p className="text-neutral-600">
            Our platform may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of any third-party websites. You access such websites at your own risk.
          </p>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">9. Disclaimer of Warranties</h2>
          <p className="text-neutral-600">
            The ALL platform is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. We do not guarantee that:
          </p>
          <ul className="list-disc pl-6 text-neutral-600 space-y-1">
            <li>The platform will be uninterrupted, secure, or error-free</li>
            <li>The platform will meet your specific requirements</li>
            <li>Any job or referral opportunities posted will be accurate or available</li>
          </ul>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">10. Limitation of Liability</h2>
          <p className="text-neutral-600">
            To the maximum extent permitted by law, ALL and its affiliates, directors, employees, or agents shall not be liable for:
          </p>
          <ul className="list-disc pl-6 text-neutral-600 space-y-1">
            <li>Any indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, data, or business opportunities</li>
            <li>Any issues arising from your use of the platform</li>
          </ul>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">11. Indemnification</h2>
          <p className="text-neutral-600">
            You agree to indemnify and hold ALL harmless from any claims, damages, losses, or expenses arising from your use of the platform, your violation of these terms, or your infringement of any rights of third parties.
          </p>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">12. Termination</h2>
          <p className="text-neutral-600">
            We reserve the right to suspend or terminate your account at any time, with or without notice, for violation of these terms, conduct that we deem harmful to the platform, or for any other reason. Upon termination, your access to the platform will cease, and your data will be deleted in accordance with our Privacy Policy.
          </p>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">13. Governing Law</h2>
          <p className="text-neutral-600">
            These terms shall be governed by and construed in accordance with the laws of <strong>India</strong>. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in <strong>Mumbai, India</strong>.
          </p>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">14. Changes to Terms</h2>
          <p className="text-neutral-600">
            We may update these Terms of Service from time to time. We will notify you of any material changes by posting the updated terms on this page with a new "Last Updated" date. Your continued use of the platform after any changes constitutes acceptance of the new terms.
          </p>

          <h2 className="text-xl font-bold text-black mt-8 mb-3">15. Contact Us</h2>
          <p className="text-neutral-600">
            If you have any questions or concerns about these Terms of Service, please contact us at:
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
            By using the ALL Platform, you acknowledge that you have read, understood, and agree to these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}