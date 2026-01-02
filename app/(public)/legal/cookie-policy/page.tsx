"use client";

import Navigation from "@/components/client/Navigation";
import Footer from "@/components/client/Footer";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cookie Policy
          </h1>
          <p className="text-gray-600 mb-6">
            We use cookies to improve your experience, analyze traffic, and
            deliver personalized content.
          </p>
          <h2 className="text-xl font-semibold mb-2">Types of cookies</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-6">
            <li>Essential cookies (required for site operation)</li>
            <li>Analytics cookies (usage measurement)</li>
            <li>Preference cookies (remembering choices)</li>
          </ul>
          <p className="text-gray-600">
            You may control cookies in your browser settings. Continued use of
            our website constitutes consent.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
