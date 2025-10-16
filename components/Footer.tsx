
"use client";

import React from 'react';
import Image from 'next/image';
import logoImg from '@/components/zonelogo2.png';
import { FiPhone, FiMail, FiMapPin, FiLinkedin, FiTwitter, FiInstagram, FiFacebook, FiExternalLink } from 'react-icons/fi';
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

  // Fetch CMS footer settings from API (client-side)
  const [footerData, setFooterData] = React.useState<any | null>(null);
  React.useEffect(() => {
    let mounted = true;
    const fetchFooter = () => {
      const url = `/api/admin/footer?ts=${Date.now()}`; // cache-bust SW/CDN
      fetch(url, { cache: 'no-store' })
        .then(r => r.json())
        .then(json => { if (mounted) setFooterData(json?.data || null); })
        .catch(() => {});
    };
    fetchFooter();
    // Refresh when the tab gains focus (helps after saving in CMS)
    const onFocus = () => fetchFooter();
    const onVisible = () => { if (document.visibilityState === 'visible') fetchFooter(); };
    const onFooterUpdated = () => fetchFooter();
    const onGlobalPagesUpdated = () => fetchFooter();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('footer:updated', onFooterUpdated as EventListener);
    window.addEventListener('global-pages:updated', onGlobalPagesUpdated as EventListener);
    return () => {
      mounted = false;
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('footer:updated', onFooterUpdated as EventListener);
      window.removeEventListener('global-pages:updated', onGlobalPagesUpdated as EventListener);
    };
  }, []);

  // Use settings data or fallback
  const siteData = fallbackData; // reserved for other global settings

  const services = footerData?.columns?.services?.items || [
    { label: "Custom Stand Design", href: "#" },
    { label: "Build & Installation", href: "#" },
    { label: "Global Services", href: "#" },
    { label: "Event Management", href: "#" },
    { label: "Marketing Integration", href: "#" },
    { label: "Premium Experiences", href: "#" }
  ];

  const locations = footerData?.columns?.locations?.items || [
    { label: "United States", href: "#" },
    { label: "Germany", href: "#" },
    { label: "United Kingdom", href: "#" },
    { label: "UAE", href: "#" },
    { label: "China", href: "#" },
    { label: "Singapore", href: "#" }
  ];

  const resources = footerData?.columns?.resources?.items || [
    { label: "Portfolio", href: "#" },
    { label: "Case Studies", href: "#" },
    { label: "Industry Insights", href: "#" },
    { label: "Exhibition Calendar", href: "#" },
    { label: "Design Trends", href: "#" },
    { label: "Contact Us", href: "#" }
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
            <div className="mb-4">
              <Image src={logoImg} alt="StandsZone" width={200} height={60} className="w-40 md:w-48 h-auto" priority />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {footerData?.paragraph || siteData.pages?.footerText || fallbackData.pages.footerText}
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <FiPhone className="w-4 h-4 text-pink-400 mr-3" />
                {footerData?.contact?.phoneLink ? (
                  <a href={footerData.contact.phoneLink} className="text-gray-300 hover:text-pink-400 transition-colors flex items-center">
                    {footerData.contact.phone}
                    <FiExternalLink className="w-3 h-3 ml-1 opacity-60" />
                  </a>
                ) : (
                  <span className="text-gray-300">{footerData?.contact?.phone || siteData.contact?.phone || fallbackData.contact.phone}</span>
                )}
              </div>
              <div className="flex items-center">
                <FiMail className="w-4 h-4 text-pink-400 mr-3" />
                {footerData?.contact?.emailLink ? (
                  <a href={footerData.contact.emailLink} className="text-gray-300 hover:text-pink-400 transition-colors flex items-center">
                    {footerData.contact.email}
                    <FiExternalLink className="w-3 h-3 ml-1 opacity-60" />
                  </a>
                ) : (
                  <span className="text-gray-300">{footerData?.contact?.email || siteData.contact?.email || fallbackData.contact.email}</span>
                )}
              </div>
              <div className="flex items-center">
                <FiMapPin className="w-4 h-4 text-pink-400 mr-3" />
                {footerData?.contact?.addressLink ? (
                  <a href={footerData.contact.addressLink} className="text-gray-300 hover:text-pink-400 transition-colors flex items-center">
                    {footerData.contact.address}
                    <FiExternalLink className="w-3 h-3 ml-1 opacity-60" />
                  </a>
                ) : (
                  <span className="text-gray-300">{footerData?.contact?.address || siteData.contact?.address || fallbackData.contact.address}</span>
                )}
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-inter">{footerData?.columns?.services?.heading || 'Services'}</h4>
            <ul className="space-y-2">
              {services.map((service: any, index: number) => (
                <li key={index}>
                  <a href={service.href || '#'} className="text-gray-300 hover:text-pink-400 transition-colors">
                    {service.label || service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-inter">{footerData?.columns?.locations?.heading || 'Global Locations'}</h4>
            <ul className="space-y-2">
              {locations.map((location: any, index: number) => (
                <li key={index}>
                  <a href={location.href || '#'} className="text-gray-300 hover:text-pink-400 transition-colors">
                    {location.label || location}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-inter">{footerData?.columns?.resources?.heading || 'Resources'}</h4>
            <ul className="space-y-2">
              {resources.map((resource: any, index: number) => (
                <li key={index}>
                  <a href={resource.href || '#'} className="text-gray-300 hover:text-pink-400 transition-colors">
                    {resource.label || resource}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter removed per requirements */}

        {/* Bottom Footer */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                {footerData?.bottom?.copyright || `© 2024 ${siteData.companyName || fallbackData.companyName}. All rights reserved.`}
              </p>
              <div className="flex space-x-6 text-sm">
                {(footerData?.bottom?.links || [
                  { label: 'Privacy Policy', href: '/legal/privacy-policy' },
                  { label: 'Terms of Service', href: '/legal/terms-of-service' },
                  { label: 'Cookie Policy', href: '/legal/cookie-policy' },
                ]).map((l: any, i: number) => (
                  <a key={i} href={l.href} className="text-gray-400 hover:text-pink-400 transition-colors">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-4 md:mt-0">
              {(footerData?.social || socialLinks).map((social: any, index: number) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-pink-400 hover:bg-gray-700 transition-all duration-300"
                >
                  {social.icon === 'linkedin' ? <FiLinkedin className="w-4 h-4" />
                   : social.icon === 'twitter' ? <FiTwitter className="w-4 h-4" />
                   : social.icon === 'instagram' ? <FiInstagram className="w-4 h-4" />
                   : social.icon === 'facebook' ? <FiFacebook className="w-4 h-4" />
                   : <FiExternalLink className="w-4 h-4" />}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
