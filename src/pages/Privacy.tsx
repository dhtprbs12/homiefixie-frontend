import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3v-8h6v8h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">HomieFixie</span>
              </a>
            </div>
            <a href="/" className="text-primary-600 hover:text-primary-700 font-medium">← Back to Home</a>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-12">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                HomieFixie ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our home improvement assistance service. Please read this 
                privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the service.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-gray-900 mb-3">Information You Provide</h3>
              <ul className="text-gray-700 space-y-2 mb-6">
                <li>• <strong>Project Descriptions:</strong> Text descriptions of your home improvement issues or projects</li>
                <li>• <strong>Images:</strong> Photos you upload to help us better understand your project (optional)</li>
                <li>• <strong>Email Address:</strong> If you choose to provide it for communication purposes (optional)</li>
                <li>• <strong>Contact Information:</strong> When you contact us through our support channels</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">Automatically Collected Information</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• <strong>Usage Data:</strong> How you interact with our service, including pages visited and features used</li>
                <li>• <strong>Device Information:</strong> Browser type, device type, and operating system</li>
                <li>• <strong>IP Address:</strong> For security and analytics purposes</li>
                <li>• <strong>Cookies:</strong> Small data files to improve your experience and analyze usage patterns</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <ul className="text-gray-700 space-y-2">
                <li>• <strong>Provide Service:</strong> Analyze your project descriptions and images to generate personalized recommendations</li>
                <li>• <strong>Improve AI:</strong> Train and improve our artificial intelligence models (using anonymized data)</li>
                <li>• <strong>Customer Support:</strong> Respond to your inquiries and provide assistance</li>
                <li>• <strong>Service Enhancement:</strong> Understand usage patterns to improve our service</li>
                <li>• <strong>Security:</strong> Detect and prevent fraud, abuse, and security issues</li>
                <li>• <strong>Legal Compliance:</strong> Comply with applicable laws and regulations</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li>• <strong>Service Providers:</strong> Third-party companies that help us operate our service (e.g., cloud hosting, analytics)</li>
                <li>• <strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                <li>• <strong>Safety:</strong> To protect the rights, property, or safety of HomieFixie, our users, or others</li>
                <li>• <strong>Business Transfer:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. These measures include encryption, secure servers, 
                and regular security assessments. However, no method of transmission over the internet or electronic storage is 
                100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
              <ul className="text-gray-700 space-y-2">
                <li>• <strong>Project Data:</strong> Stored for up to 30 days to provide ongoing support and service improvement</li>
                <li>• <strong>Images:</strong> Automatically deleted after processing and analysis completion</li>
                <li>• <strong>Analytics Data:</strong> Aggregated and anonymized data may be retained indefinitely for service improvement</li>
                <li>• <strong>Contact Information:</strong> Retained as long as necessary to provide support and communicate with you</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Privacy Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li>• <strong>Access:</strong> Request access to the personal information we have about you</li>
                <li>• <strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li>• <strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                <li>• <strong>Portability:</strong> Request a copy of your data in a structured, machine-readable format</li>
                <li>• <strong>Opt-out:</strong> Opt out of certain uses of your information</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                To exercise these rights, please contact us at <a href="mailto:privacy@homiefixie.com" className="text-primary-600 hover:text-primary-700 font-medium">privacy@homiefixie.com</a>.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your experience. You can control cookies through your 
                browser settings, but disabling cookies may affect the functionality of our service.
              </p>
              <ul className="text-gray-700 space-y-2">
                <li>• <strong>Essential Cookies:</strong> Required for basic service functionality</li>
                <li>• <strong>Analytics Cookies:</strong> Help us understand how you use our service</li>
                <li>• <strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal information 
                from children under 13. If you are a parent or guardian and believe your child has provided us with personal 
                information, please contact us immediately.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the 
                new Privacy Policy on this page and updating the "Last updated" date. Your continued use of the service after 
                any modifications indicates your acceptance of the updated Privacy Policy.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> <a href="mailto:privacy@homiefixie.com" className="text-primary-600 hover:text-primary-700 font-medium">privacy@homiefixie.com</a><br />
                  <strong>Subject:</strong> Privacy Policy Inquiry
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;