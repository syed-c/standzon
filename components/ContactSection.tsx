"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function ContactSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [footerData, setFooterData] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchFooter = () => {
      const url = `/api/admin/footer?ts=${Date.now()}`;
      fetch(url, { cache: 'no-store' })
        .then(r => r.json())
        .then(json => { if (mounted) setFooterData(json?.data || null); })
        .catch(() => { });
    };
    fetchFooter();
    return () => { mounted = false; };
  }, []);

  const fallbackData = {
    contact: {
      phone: "+1 (555) 123-4567",
      email: "hello@standszone.com",
      address: "123 Exhibition Ave, NYC"
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    budget: '',
    location: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast({
        title: "Quote Request Submitted!",
        description: "We'll get back to you within 24 hours.",
      });
      setIsSubmitting(false);
      setFormData({ name: '', email: '', company: '', phone: '', service: '', budget: '', location: '', message: '' });
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 px-6 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        {/* Left column — Contact info */}
        <div className="lg:w-1/3">
          <h3 className="text-4xl font-black text-[#0f172a] leading-tight mb-6 uppercase tracking-tighter">
            LET&apos;S CREATE SOMETHING EXTRAORDINARY
          </h3>
          <p className="text-slate-500 mb-10">
            Our global team of consultants is ready to assist you with technical specifications and local market insights.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#1e3886]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Call Us</p>
                {footerData?.contact?.phoneLink ? (
                  <a href={footerData.contact.phoneLink} className="font-bold text-[#0f172a] hover:text-[#1e3886] transition-colors">{footerData.contact.phone}</a>
                ) : (
                  <p className="font-bold text-[#0f172a]">{footerData?.contact?.phone || fallbackData.contact.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#1e3886]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</p>
                {footerData?.contact?.emailLink ? (
                  <a href={footerData.contact.emailLink} className="font-bold text-[#0f172a] hover:text-[#1e3886] transition-colors">{footerData.contact.email}</a>
                ) : (
                  <p className="font-bold text-[#0f172a]">{footerData?.contact?.email || fallbackData.contact.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#1e3886]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Visit Us</p>
                {footerData?.contact?.addressLink ? (
                  <a href={footerData.contact.addressLink} className="font-bold text-[#0f172a] hover:text-[#1e3886] transition-colors">{footerData.contact.address}</a>
                ) : (
                  <p className="font-bold text-[#0f172a]">{footerData?.contact?.address || fallbackData.contact.address}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right column — Form */}
        <div className="lg:w-2/3 bg-white p-10 shadow-xl border border-slate-200">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="John Doe"
                className="bg-slate-50 border-slate-200 focus:border-[#1e3886] focus:ring-[#1e3886] p-4 rounded-none"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Company Email</label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@company.com"
                className="bg-slate-50 border-slate-200 focus:border-[#1e3886] focus:ring-[#1e3886] p-4 rounded-none"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Event Name</label>
              <Input
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="e.g. Arab Health 2025"
                className="bg-slate-50 border-slate-200 focus:border-[#1e3886] focus:ring-[#1e3886] p-4 rounded-none"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Budget Range</label>
              <Select onValueChange={(value) => handleInputChange('budget', value)}>
                <SelectTrigger className="bg-slate-50 border-slate-200 focus:border-[#1e3886] focus:ring-[#1e3886] p-4 rounded-none">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent className="bg-white text-[#0f172a]">
                  <SelectItem value="10k-25k">$10k - $25k</SelectItem>
                  <SelectItem value="25k-50k">$25k - $50k</SelectItem>
                  <SelectItem value="50k-100k">$50k - $100k</SelectItem>
                  <SelectItem value="100k-plus">$100k+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Project Brief &amp; Details</label>
              <Textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Tell us about your requirements..."
                rows={4}
                className="bg-slate-50 border-slate-200 focus:border-[#1e3886] focus:ring-[#1e3886] p-4 rounded-none"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1e3886] hover:bg-[#1e3886]/95 text-white font-black uppercase tracking-[0.2em] py-5 shadow-lg transition-all rounded-none text-sm"
              >
                {isSubmitting ? 'Submitting...' : 'Request Professional Consultation'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}