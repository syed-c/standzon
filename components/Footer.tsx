
"use client";

import { FiPhone, FiMail, FiMapPin, FiLinkedin, FiTwitter, FiInstagram, FiFacebook } from 'react-icons/fi';
// import { useQuery } from 'convex/react';
// import { api } from '@/convex/_generated/api';

export default function Footer() {
  console.log("Footer: Component rendered");

  // Fetch site settings for dynamic content
  // const settings = useQuery(api.siteSettings.getSiteSettings, {});

  // Fallback data if settings are not loaded yet
  const fallbackData = {
    companyName: "StandsZone",
    contact: {
      phone: "+1 (555) 123-4567",
      email: "hello@standszone.com",
      address: "123 Exhibition Ave, NYC"
    },
    social: {
      linkedin: "#",
      twitter: "#",
      instagram: "#",
      facebook: "#"
    },
    pages: {
      footerText: "Creating extraordinary exhibition experiences that captivate audiences and drive business results across 50+ countries worldwide."
    }
  };

  // Use settings data or fallback
  const siteData = fallbackData; // settings || fallbackData;

  const services = [
    "Custom Stand Design",
    "Build & Installation", 
    "Global Services",
    "Event Management",
    "Marketing Integration",
    "Premium Experiences"
  ];

  const locations = [
    "United States",
    "Germany", 
    "United Kingdom",
    "UAE",
    "China",
    "Singapore"
  ];

  const resources = [
    "Portfolio",
    "Case Studies",
    "Industry Insights",
    "Exhibition Calendar",
    "Design Trends",
    "Contact Us"
  ];

  const socialLinks = [
    { icon: FiLinkedin, href: siteData.social?.linkedin || fallbackData.social.linkedin, label: "LinkedIn" },
    { icon: FiTwitter, href: siteData.social?.twitter || fallbackData.social.twitter, label: "Twitter" },
    { icon: FiInstagram, href: siteData.social?.instagram || fallbackData.social.instagram, label: "Instagram" },
    { icon: FiFacebook, href: siteData.social?.facebook || fallbackData.social.facebook, label: "Facebook" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold font-inter mb-4">
              {siteData.companyName}<span className="text-pink-500">Zone</span>
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {siteData.pages?.footerText || fallbackData.pages.footerText}
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <FiPhone className="w-4 h-4 text-pink-400 mr-3" />
                <span className="text-gray-300">{siteData.contact?.phone || fallbackData.contact.phone}</span>
              </div>
              <div className="flex items-center">
                <FiMail className="w-4 h-4 text-pink-400 mr-3" />
                <span className="text-gray-300">{siteData.contact?.email || fallbackData.contact.email}</span>
              </div>
              <div className="flex items-center">
                <FiMapPin className="w-4 h-4 text-pink-400 mr-3" />
                <span className="text-gray-300">{siteData.contact?.address || fallbackData.contact.address}</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-inter">Services</h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <a href="#services" className="text-gray-300 hover:text-pink-400 transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-inter">Global Locations</h4>
            <ul className="space-y-2">
              {locations.map((location, index) => (
                <li key={index}>
                  <a href="#locations" className="text-gray-300 hover:text-pink-400 transition-colors">
                    {location}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-inter">Resources</h4>
            <ul className="space-y-2">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors">
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-8 border-t border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-xl font-semibold mb-2 font-inter">Stay Updated</h4>
              <p className="text-gray-300">
                Get the latest exhibition trends, industry insights, and project showcases delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              />
              <button className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © 2024 {siteData.companyName || fallbackData.companyName}. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="/legal/privacy-policy" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Privacy Policy
                </a>
                <a href="/legal/terms-of-service" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Terms of Service
                </a>
                <a href="/legal/cookie-policy" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-4 md:mt-0">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-pink-400 hover:bg-gray-700 transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
