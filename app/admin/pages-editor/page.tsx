'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Eye, Edit, RefreshCw, FileText } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type PageItem = {
  title: string;
  path: string;
  type: 'static' | 'country' | 'city';
};

export default function AdminPagesEditor() {
  // Simple client-side guard: require admin session in localStorage
  React.useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
      const user = raw ? JSON.parse(raw) : null;
      const isAdmin = !!user && (user.role === 'super_admin' || user.role === 'admin' || user.isAdmin);
      if (!isAdmin) {
        window.location.href = '/admin/login';
      }
    } catch {
      if (typeof window !== 'undefined') window.location.href = '/admin/login';
    }
  }, []);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [cmsSource, setCmsSource] = useState<'supabase' | 'file' | null>(null);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState<string>('');
  const [h1, setH1] = useState('');
  const [pageMap, setPageMap] = useState<Array<{ tag: string; text: string }>>([]);
  // Section-aware state - starts with minimal common sections
  const [sections, setSections] = useState<any>({
    // Common sections (used by multiple pages)
    hero: { heading: '', description: '' },
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pages-editor?action=list');
      const data = await res.json();
      if (data.success) setPages(data.data || []);
    } catch (e) {
      console.error('Failed to load pages', e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return pages.filter(p => p.title.toLowerCase().includes(q) || p.path.toLowerCase().includes(q));
  }, [pages, search]);

  const openEditor = async (path: string) => {
    setEditingPath(path);
    setSeoTitle('');
    setSeoDescription('');
    setSeoKeywords('');
    setH1('');
    setPageMap([]);
    
    // Reset sections based on page type
    if (path === '/custom-booth') {
      setSections((prev: any) => ({
        hero: { heading: '', description: '' },
        whyChooseCustom: { 
          heading: 'Why Choose Custom Design?', 
          paragraph: 'Stand out from the crowd with a booth that\'s uniquely yours', 
          features: [
            { heading: 'Brand-Focused Design', paragraph: 'Every element designed to reflect your brand identity and values' },
            { heading: 'Creative Innovation', paragraph: 'Cutting-edge design concepts that make your booth stand out' },
            { heading: 'Goal-Oriented', paragraph: 'Designed specifically to achieve your exhibition objectives' },
            { heading: 'Multi-Functional', paragraph: 'Spaces that work for meetings, demos, and networking' }
          ]
        },
        designProcess: { 
          heading: 'Our Design Process', 
          paragraph: 'From concept to completion, we guide you through every step', 
          steps: [
            { heading: 'Discovery & Brief', paragraph: 'We understand your brand, goals, and exhibition requirements' },
            { heading: 'Concept Design', paragraph: '3D concepts and layouts tailored to your space and objectives' },
            { heading: 'Design Refinement', paragraph: 'Collaborative refinement until the design is perfect' },
            { heading: 'Production & Install', paragraph: 'Expert construction and professional installation at your venue' }
          ]
        },
        customDesignServices: { 
          heading: 'Custom Design Services', 
          paragraph: 'Comprehensive custom booth solutions for every need',
          serviceCards: [
            {
              title: 'Concept Development',
              description: 'Initial design concepts based on your brief and objectives',
              startingFrom: 'Starting from',
              price: '$2,000',
              features: ['Brand analysis', '3D visualization', 'Space planning', 'Material selection'],
              buttonText: 'Get Quote',
              buttonLink: '/quote',
              badge: ''
            },
            {
              title: 'Full Custom Design',
              description: 'Complete custom booth design with all elements',
              startingFrom: 'Starting from',
              price: '$15,000',
              features: ['Unique architecture', 'Custom graphics', 'Interactive elements', 'Lighting design'],
              buttonText: 'Get Quote',
              buttonLink: '/quote',
              badge: 'Most Popular'
            },
            {
              title: 'Modular Custom',
              description: 'Custom-designed modular systems for flexibility',
              startingFrom: 'Starting from',
              price: '$8,000',
              features: ['Reusable components', 'Multiple configurations', 'Easy transport', 'Cost-effective'],
              buttonText: 'Get Quote',
              buttonLink: '/quote',
              badge: ''
            }
          ]
        },
        customBoothCta: { 
          heading: 'Ready to Create Your Custom Booth?', 
          paragraph: 'Connect with expert designers who understand your industry and objectives', 
          buttons: [
            { text: 'Start Your Project', href: '/quote' },
            { text: 'Browse Designers', href: '/quote' }
          ]
        },
        boothRental: { 
          hero: { heading: 'Booth Rental Services', description: 'Flexible, cost-effective exhibition booth rental solutions with full setup and support.' },
          whyChoose: { 
            heading: 'Why Choose Booth Rental?', 
            paragraph: 'Cost-effective solutions for businesses that need professional exhibition presence without the long-term commitment', 
            features: [
              { heading: 'Cost-Effective', paragraph: 'No long-term investment, pay only for what you need' },
              { heading: 'Flexible Options', paragraph: 'Choose from various booth sizes and configurations' },
              { heading: 'Professional Quality', paragraph: 'High-quality materials and professional appearance' },
              { heading: 'Quick Setup', paragraph: 'Fast installation and dismantle for multiple shows' }
            ]
          },
          process: { 
            heading: 'Our Rental Process', 
            paragraph: 'Simple, streamlined process from selection to show floor', 
            steps: [
              { heading: 'Select Booth', paragraph: 'Choose from our range of booth options and sizes' },
              { heading: 'Customize Graphics', paragraph: 'Add your branding and graphics to the rental booth' },
              { heading: 'Schedule Delivery', paragraph: 'We coordinate delivery and installation timing' },
              { heading: 'Show Support', paragraph: 'Professional support during your exhibition' }
            ]
          },
          services: { 
            heading: 'Booth Rental Services', 
            paragraph: 'Comprehensive rental solutions for every exhibition need',
            serviceCards: [
              {
                title: 'Modular Booth Rental',
                description: 'Flexible modular systems for various booth sizes and configurations',
                startingFrom: 'Starting from',
                price: '$1,500',
                features: ['Easy setup', 'Multiple configurations', 'Professional appearance', 'Cost-effective'],
                buttonText: 'Get Quote',
                buttonLink: '/quote',
                badge: ''
              },
              {
                title: 'Custom Graphics Package',
                description: 'Complete branding and graphics for your rental booth',
                startingFrom: 'Starting from',
                price: '$800',
                features: ['Brand integration', 'High-quality prints', 'Quick turnaround', 'Installation included'],
                buttonText: 'Get Quote',
                buttonLink: '/quote',
                badge: 'Most Popular'
              },
              {
                title: 'Full Service Rental',
                description: 'Complete booth rental with setup, graphics, and support',
                startingFrom: 'Starting from',
                price: '$3,500',
                features: ['End-to-end service', 'Professional installation', 'On-site support', 'Complete package'],
                buttonText: 'Get Quote',
                buttonLink: '/quote',
                badge: 'Premium'
              }
            ]
          },
          cta: { 
            heading: 'Ready to Rent Your Exhibition Booth?', 
            paragraph: 'Connect with rental experts who understand your exhibition needs', 
            buttons: [
              { text: 'Get Started', href: '/quote' },
              { text: 'Browse Options', href: '/quote' }
            ]
          }
        },
        // Country pages structure
        countryPages: {
          'china': {
            whyChooseHeading: 'Why Choose Local Builders in China?',
            whyChooseParagraph: 'Local builders offer unique advantages including market knowledge, logistical expertise, and established vendor relationships.',
            infoCards: [
              {
                title: 'Local Market Knowledge',
                text: 'Understand local regulations, venue requirements, and cultural preferences specific to China.'
              },
              {
                title: 'Faster Project Delivery',
                text: 'Reduced logistics time, easier coordination, and faster response times for urgent modifications or support.'
              },
              {
                title: 'Cost-Effective Solutions',
                text: 'Lower transportation costs, established supplier networks, and competitive local pricing structures.'
              }
            ],
            quotesParagraph: 'Connect with 3-5 verified local builders who understand your market. No registration required, quotes within 24 hours.',
            servicesHeading: 'Exhibition Stand Builders in China: Services, Costs, and Tips',
            servicesParagraph: 'Finding the right exhibition stand partner in China can dramatically improve your event ROI. Local builders offer end-to-end services including custom design, fabrication, graphics, logistics, and on-site installation—ensuring your brand presents a professional, high‑impact presence on the show floor.'
          },
          'germany': {
            whyChooseHeading: 'Why Choose Local Builders in Germany?',
            whyChooseParagraph: 'Local builders offer unique advantages including market knowledge, logistical expertise, and established vendor relationships.',
            infoCards: [
              {
                title: 'Local Market Knowledge',
                text: 'Understand local regulations, venue requirements, and cultural preferences specific to Germany.'
              },
              {
                title: 'Faster Project Delivery',
                text: 'Reduced logistics time, easier coordination, and faster response times for urgent modifications or support.'
              },
              {
                title: 'Cost-Effective Solutions',
                text: 'Lower transportation costs, established supplier networks, and competitive local pricing structures.'
              }
            ],
            quotesParagraph: 'Connect with 3-5 verified local builders who understand your market. No registration required, quotes within 24 hours.',
            servicesHeading: 'Exhibition Stand Builders in Germany: Services, Costs, and Tips',
            servicesParagraph: 'Finding the right exhibition stand partner in Germany can dramatically improve your event ROI. Local builders offer end-to-end services including custom design, fabrication, graphics, logistics, and on-site installation—ensuring your brand presents a professional, high‑impact presence on the show floor.'
          },
          'united-states': {
            whyChooseHeading: 'Why Choose Local Builders in United States?',
            whyChooseParagraph: 'Local builders offer unique advantages including market knowledge, logistical expertise, and established vendor relationships.',
            infoCards: [
              {
                title: 'Local Market Knowledge',
                text: 'Understand local regulations, venue requirements, and cultural preferences specific to United States.'
              },
              {
                title: 'Faster Project Delivery',
                text: 'Reduced logistics time, easier coordination, and faster response times for urgent modifications or support.'
              },
              {
                title: 'Cost-Effective Solutions',
                text: 'Lower transportation costs, established supplier networks, and competitive local pricing structures.'
              }
            ],
            quotesParagraph: 'Connect with 3-5 verified local builders who understand your market. No registration required, quotes within 24 hours.',
            servicesHeading: 'Exhibition Stand Builders in United States: Services, Costs, and Tips',
            servicesParagraph: 'Finding the right exhibition stand partner in United States can dramatically improve your event ROI. Local builders offer end-to-end services including custom design, fabrication, graphics, logistics, and on-site installation—ensuring your brand presents a professional, high‑impact presence on the show floor.'
          }
        }
      }));
    } else if (path === '/') {
      setSections((prev: any) => ({
        hero: { heading: '', description: '' },
        heroButtons: [ { text: 'Get Free Quote →', href: '/quote' }, { text: 'Global Venues', href: '/exhibition-stands' }, { text: 'Find Builders', href: '/builders' } ],
        leadsIntro: { heading: 'Live Lead Activity', paragraph: 'Real exhibition stand requests from clients worldwide' },
        readyLeads: { heading: 'Ready to Access These Leads?', paragraph: 'Join our platform as a verified builder and start receiving qualified leads like these' },
        globalPresence: { heading: 'Global Presence, Local Expertise', paragraph: 'With operations spanning five continents, we deliver world-class exhibition solutions while maintaining deep local market knowledge and cultural understanding.' },
        moreCountries: { heading: 'More Countries in {country}', paragraph: 'Discover exhibition stand builders across all major markets in this region. Click on any country to explore local professionals and get instant quotes.' },
        expandingMarkets: { heading: 'Expanding to New Markets?', paragraph: "We're continuously growing our global network. If you don't see your location listed, contact us to discuss how we can support your exhibition needs." },
        readyStart: { heading: 'Ready to Get Started?', paragraph: 'Connect with verified exhibition stand builders in your target location. Get multiple competitive quotes without creating an account.' },
        clientSay: { heading: 'What Our Clients Say', paragraph: 'Join thousands of satisfied clients who found their perfect exhibition stand builders through our platform' },
        reviews: [ { name: '', role: '', rating: 5, text: '', image: '' } ],
        finalCta: { heading: "Let's Create Something Extraordinary", paragraph: 'Ready to transform your exhibition presence? Get a personalized quote and discover how we can bring your vision to life.', buttons: [ { text: 'Get Free Quotes Now', href: '/quote' } ] },
      }));
    } else if (path.startsWith('/exhibition-stands/')) {
      // Extract country slug from path
      const countrySlug = path.split('/').pop() || '';
      const countryName = countrySlug?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      setSections((prev: any) => ({
        hero: { heading: '', description: '' },
        // Country pages structure
        countryPages: {
          [countrySlug as string]: {
            whyChooseHeading: `Why Choose Local Builders in ${countryName}?`,
            whyChooseParagraph: 'Local builders offer unique advantages including market knowledge, logistical expertise, and established vendor relationships.',
            infoCards: [
              {
                title: 'Local Market Knowledge',
                text: `Understand local regulations, venue requirements, and cultural preferences specific to ${countryName}.`
              },
              {
                title: 'Faster Project Delivery',
                text: 'Reduced logistics time, easier coordination, and faster response times for urgent modifications or support.'
              },
              {
                title: 'Cost-Effective Solutions',
                text: 'Lower transportation costs, established supplier networks, and competitive local pricing structures.'
              }
            ],
            quotesParagraph: 'Connect with 3-5 verified local builders who understand your market. No registration required, quotes within 24 hours.',
            servicesHeading: `Exhibition Stand Builders in ${countryName}: Services, Costs, and Tips`,
            servicesParagraph: `Finding the right exhibition stand partner in ${countryName} can dramatically improve your event ROI. Local builders offer end-to-end services including custom design, fabrication, graphics, logistics, and on-site installation—ensuring your brand presents a professional, high‑impact presence on the show floor.`
          }
        }
      }));
    } else {
      setSections((prev: any) => ({
        hero: { heading: '', description: '' },
      }));
    }
    try {
      // 1) Try loading saved content first
      const savedRes = await fetch(`/api/admin/pages-editor?action=get-content&path=${encodeURIComponent(path)}`, { cache: 'no-store' });
      try {
        const src = savedRes.headers.get('x-cms-source');
        if (src === 'supabase' || src === 'file') setCmsSource(src as 'supabase' | 'file');
      } catch {}
      const saved = await savedRes.json();
      if (saved?.success && saved?.data) {
        const pc = saved.data;
        setSeoTitle(pc?.seo?.metaTitle || '');
        setSeoDescription(pc?.seo?.metaDescription || '');
        setSeoKeywords((pc?.seo?.keywords || []).join(', '));
        setH1(pc?.sections?.hero?.heading || pc?.hero?.title || '');
        // Load sections if present, but only load page-specific sections
        if (pc?.sections) {
          if (path === '/custom-booth') {
            // For custom-booth page, only load custom-booth specific sections
            console.log("Loading custom-booth sections:", pc.sections);
            setSections((prev:any) => {
              const newSections = {
                ...prev,
                hero: pc.sections.hero || prev.hero,
                whyChooseCustom: pc.sections.whyChooseCustom || prev.whyChooseCustom,
                designProcess: pc.sections.designProcess || prev.designProcess,
                customDesignServices: pc.sections.customDesignServices || prev.customDesignServices,
                customBoothCta: pc.sections.customBoothCta || prev.customBoothCta,
              };
              console.log("New sections state:", newSections);
              return newSections;
            });
          } else if (path === '/booth-rental') {
            // For booth-rental page, load booth-rental specific sections
            console.log("Loading booth-rental sections:", pc.sections);
            setSections((prev:any) => {
              const newSections = {
                ...prev,
                hero: pc.sections.hero || prev.hero,
                boothRental: pc.sections.boothRental || prev.boothRental,
              };
              console.log("New sections state:", newSections);
              return newSections;
            });
          } else if (path === '/3d-rendering-and-concept-development') {
            // For 3D rendering page, load rendering-specific sections
            console.log("Loading 3D rendering sections:", pc.sections);
            setSections((prev:any) => {
              const newSections = {
                ...prev,
                hero: pc.sections.hero || prev.hero,
                renderingConcept: pc.sections.renderingConcept || prev.renderingConcept,
              };
              console.log("New sections state:", newSections);
              return newSections;
            });
          } else if (path === '/trade-show-installation-and-dismantle') {
            // For installation & dismantle page, load I&D specific sections
            console.log("Loading installation & dismantle sections:", pc.sections);
            setSections((prev:any) => {
              const newSections = {
                ...prev,
                hero: pc.sections.hero || prev.hero,
                installationDismantle: pc.sections.installationDismantle || prev.installationDismantle,
              };
              console.log("New sections state:", newSections);
              return newSections;
            });
          } else if (path === '/trade-show-project-management') {
            // For project management page, load PM specific sections
            console.log("Loading project management sections:", pc.sections);
            setSections((prev:any) => {
              const newSections = {
                ...prev,
                hero: pc.sections.hero || prev.hero,
                projectManagement: pc.sections.projectManagement || prev.projectManagement,
              };
              console.log("New sections state:", newSections);
              return newSections;
            });
          } else if (path === '/trade-show-graphics-printing') {
            // For graphics & printing page, load graphics-specific sections
            console.log("Loading graphics & printing sections:", pc.sections);
            setSections((prev:any) => {
              const newSections = {
                ...prev,
                hero: pc.sections.hero || prev.hero,
                graphicsPrinting: pc.sections.graphicsPrinting || prev.graphicsPrinting,
              };
              console.log("New sections state:", newSections);
              return newSections;
            });
          } else if (path === '/') {
            // For home page, load home-specific sections
            setSections((prev:any) => ({
              ...prev,
              hero: pc.sections.hero || prev.hero,
              heroButtons: pc.sections.heroButtons || prev.heroButtons,
              leadsIntro: pc.sections.leadsIntro || prev.leadsIntro,
              readyLeads: pc.sections.readyLeads || prev.readyLeads,
              globalPresence: pc.sections.globalPresence || prev.globalPresence,
              moreCountries: pc.sections.moreCountries || prev.moreCountries,
              expandingMarkets: pc.sections.expandingMarkets || prev.expandingMarkets,
              readyStart: pc.sections.readyStart || prev.readyStart,
              clientSay: pc.sections.clientSay || prev.clientSay,
              reviews: pc.sections.reviews || prev.reviews,
              finalCta: pc.sections.finalCta || prev.finalCta,
            }));
          } else if (path.startsWith('/exhibition-stands/')) {
            // For country pages, load country-specific sections
            const countrySlug = path.split('/').pop() || '';
            setSections((prev:any) => ({
              ...prev,
              hero: pc.sections.hero || prev.hero,
              countryPages: pc.sections.countryPages || prev.countryPages,
            }));
          } else {
            // For other pages, load common sections only
            setSections((prev:any) => ({
              ...prev,
              hero: pc.sections.hero || prev.hero,
            }));
          }
        }
        const rawHtml: string | undefined = pc?.content?.extra?.rawHtml || pc?.content?.introduction;
        if (rawHtml && typeof rawHtml === 'string') {
          const doc = new DOMParser().parseFromString(rawHtml, 'text/html');
          const sections: Array<{ tag: string; text: string }> = [];
          doc.querySelectorAll('h1,h2,h3,h4,p,li').forEach((el) => {
            const tag = el.tagName.toLowerCase();
            let text = (el.textContent || '').replace(/\s+/g, ' ').trim();
            if (text && text.length > 2) {
              if (text.length > 500) text = text.slice(0, 500) + '…';
              sections.push({ tag, text });
            }
          });
          if (sections.length > 0) {
              setPageMap(sections);
            return; // Use saved content; skip scraping
          }
        }
      }

      // 2) Fallback to scraping live page
      // Load current HTML and scrape
      const res = await fetch(path, { cache: 'no-store' });
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const metaTitle = doc.querySelector('title')?.textContent || '';
      const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const metaKeywords = doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
      const h1El = doc.querySelector('h1');
      setSeoTitle(metaTitle);
      setSeoDescription(metaDescription);
      setSeoKeywords(metaKeywords);
      setH1(h1El?.textContent || '');

      const sectionsArr: Array<{ tag: string; text: string }> = [];
      doc.querySelectorAll('h1,h2,h3,h4,p,li,div.card,div[class*="card"],div[class*="box"]').forEach((el) => {
        const tag = el.tagName.toLowerCase();
        let text = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (text && text.length > 2) {
          // cap overly long snippets
          if (text.length > 500) text = text.slice(0, 500) + '…';
          sectionsArr.push({ tag, text });
        }
      });
      setPageMap(sectionsArr);
    } catch (e) {
      console.error('Failed to scrape page', e);
    }
  };

  const saveChanges = async () => {
    if (!editingPath) return;
    setIsSaving(true);
    try {
      const normalizedMap = pageMap;

      // Build simple HTML from edited map
      const contentHtml = normalizedMap
        .map((s) => {
          const safeTag = ['h1','h2','h3','h4','p','li'].includes(s.tag.toLowerCase()) ? s.tag.toLowerCase() : 'p';
          if (safeTag === 'li') return `<ul><li>${s.text}</li></ul>`;
          return `<${safeTag}>${s.text}</${safeTag}>`;
        })
        .join('\n');

      // Debug: Log what we're sending for country pages
      if (editingPath.startsWith('/exhibition-stands/')) {
        console.log('🌍 Saving country page:', editingPath);
        console.log('📝 Sections data:', sections);
        console.log('🏳️ Country pages data:', sections.countryPages);
      }
      
      // Debug: Log what we're sending for custom-booth page
      if (editingPath === '/custom-booth') {
        console.log('🎨 Saving custom-booth page:', editingPath);
        console.log('📝 Sections data:', sections);
        console.log('🎯 Hero data:', sections.hero);
        console.log('💡 Why Choose data:', sections.whyChooseCustom);
        console.log('🔄 Design Process data:', sections.designProcess);
        console.log('🛠️ Custom Design Services data:', sections.customDesignServices);
        console.log('🚀 CTA data:', sections.customBoothCta);
      }

      const res = await fetch('/api/admin/pages-editor', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          path: editingPath,
          seo: {
            title: seoTitle,
            description: seoDescription,
            keywords: seoKeywords.split(',').map(k => k.trim()).filter(Boolean),
          },
          h1,
          contentHtml,
          // new: send structured sections so changes are scoped
          // keep sending sections for non-about pages; for /about, contentHtml drives visible text
          sections,
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Update failed');

      // Debug: Log the response
      console.log('✅ Save response:', data);

      toast({ title: 'Updated', description: 'Page updated successfully and revalidated.' });
      setEditingPath(null);
    } catch (e: any) {
      console.error('❌ Save error:', e);
      toast({ title: 'Save Failed', description: e.message || 'Could not save.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Navigation />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pages Editor</h1>
              <p className="text-gray-600">View and edit SEO and headings for site pages.</p>
              {cmsSource && (
                <div className="mt-2 inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full border" style={{ borderColor: cmsSource==='supabase' ? '#10b981' : '#60a5fa', color: cmsSource==='supabase' ? '#065f46' : '#1e3a8a', background: cmsSource==='supabase' ? '#ecfdf5' : '#eff6ff' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: cmsSource==='supabase' ? '#10b981' : '#3b82f6' }}></span>
                  <span>CMS source: {cmsSource}</span>
                </div>
              )}
            </div>
            <Button variant="outline" onClick={loadPages}><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Pages</CardTitle>
              <CardDescription>Search and manage all available pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Input placeholder="Search pages by title or path" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              {loading ? (
                <div className="text-gray-500">Loading pages…</div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((p) => (
                    <div key={p.path} className="flex items-center justify-between border rounded-lg p-3 bg-white">
                      <div>
                        <div className="font-medium text-gray-900">{p.title}</div>
                        <div className="text-sm text-gray-600">{p.path}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => window.open(p.path, '_blank')}><Eye className="w-4 h-4 mr-1" /> View</Button>
                        <Button variant="outline" onClick={() => openEditor(p.path)}><Edit className="w-4 h-4 mr-1" /> Edit</Button>
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && (
                    <div className="text-gray-500">No pages found.</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      {editingPath && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Edit Page: {editingPath}</h2>
                <Button variant="outline" onClick={() => setEditingPath(null)}>Close</Button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h3 className="font-semibold">SEO</h3>
                  <div>
                    <Label>Meta Title</Label>
                    <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="SEO Title" />
                  </div>
                  <div>
                    <Label>Meta Description</Label>
                    <Textarea rows={3} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="SEO Description" />
                  </div>
                  <div>
                    <Label>Meta Keywords (comma separated)</Label>
                    <Input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="keyword1, keyword2, …" />
                  </div>

                  {editingPath !== '/' && (
                    <>
                      <h3 className="font-semibold mt-4">Content</h3>
                      <div>
                        <Label>H1 (Main Heading)</Label>
                        <Input value={h1} onChange={(e) => setH1(e.target.value)} placeholder="Main page heading" />
                      </div>
                    </>
                  )}
                </div>

                {/* Right column: Home editor */}
                <div className="space-y-6">
                  {editingPath === '/' ? (
                    <Accordion type="multiple" className="bg-transparent">
                      <AccordionItem value="hero">
                        <AccordionTrigger>Hero</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Hero H1</Label>
                            <Input value={sections.hero?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, hero:{ ...(s.hero||{}), heading:e.target.value } }))} />
                            <Label className="mt-2 block">Hero Description</Label>
                            <Textarea rows={3} value={sections.hero?.description||''} onChange={(e)=>setSections((s:any)=>({ ...s, hero:{ ...(s.hero||{}), description:e.target.value } }))} />
                            <div className="mt-2">
                              <h5 className="font-semibold mb-2">Hero Buttons</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {(sections.heroButtons||[]).map((b:any, idx:number)=> (
                                  <div key={idx} className="border rounded p-3">
                                    <Label>Text</Label>
                                    <Input value={b.text||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.heroButtons||[])]; arr[idx]={...arr[idx], text:e.target.value}; return { ...s, heroButtons:arr }; })} />
                                    <Label className="mt-2 block">Link</Label>
                                    <Input value={b.href||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.heroButtons||[])]; arr[idx]={...arr[idx], href:e.target.value}; return { ...s, heroButtons:arr }; })} />
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2 mt-2">
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, heroButtons:[...(s.heroButtons||[]), { text:'', href:'' }] }))}>Add Button</Button>
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, heroButtons:(s.heroButtons||[]).slice(0,-1) }))}>Remove Last</Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="leadsIntro">
                        <AccordionTrigger>Leads Intro</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Leads Section Heading</Label>
                            <Input value={sections.leadsIntro?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, leadsIntro:{ ...(s.leadsIntro||{}), heading:e.target.value } }))} />
                            <Label className="mt-2 block">Leads Section Paragraph</Label>
                            <Textarea rows={3} value={sections.leadsIntro?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, leadsIntro:{ ...(s.leadsIntro||{}), paragraph:e.target.value } }))} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="leads">
                        <AccordionTrigger>Leads CTA</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Leads CTA Heading</Label>
                            <Input value={sections.readyLeads?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, readyLeads:{ ...(s.readyLeads||{}), heading:e.target.value } }))} />
                            <Label className="mt-2 block">Leads CTA Paragraph</Label>
                            <Textarea rows={3} value={sections.readyLeads?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, readyLeads:{ ...(s.readyLeads||{}), paragraph:e.target.value } }))} />
                            <div className="mt-2">
                              <h5 className="font-semibold mb-2">Buttons</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {(sections.readyLeads?.buttons||[]).map((b:any, idx:number)=> (
                                  <div key={idx} className="border rounded p-3">
                                    <Label>Text</Label>
                                    <Input value={b.text||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.readyLeads?.buttons||[])]; arr[idx]={...arr[idx], text:e.target.value}; return { ...s, readyLeads:{ ...(s.readyLeads||{}), buttons:arr } }; })} />
                                    <Label className="mt-2 block">Link</Label>
                                    <Input value={b.href||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.readyLeads?.buttons||[])]; arr[idx]={...arr[idx], href:e.target.value}; return { ...s, readyLeads:{ ...(s.readyLeads||{}), buttons:arr } }; })} />
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2 mt-2">
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, readyLeads:{ ...(s.readyLeads||{}), buttons:[...(s.readyLeads?.buttons||[]), { text:'', href:'' }] } }))}>Add Button</Button>
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, readyLeads:{ ...(s.readyLeads||{}), buttons:(s.readyLeads?.buttons||[]).slice(0,-1) } }))}>Remove Last</Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="globalPresence">
                        <AccordionTrigger>Global Presence</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Heading</Label>
                            <Input value={sections.globalPresence?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, globalPresence:{ ...(s.globalPresence||{}), heading:e.target.value } }))} />
                            <Label className="mt-2 block">Paragraph</Label>
                            <Textarea rows={3} value={sections.globalPresence?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, globalPresence:{ ...(s.globalPresence||{}), paragraph:e.target.value } }))} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="moreCountries">
                        <AccordionTrigger>More Countries</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Heading</Label>
                            <Input value={sections.moreCountries?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, moreCountries:{ ...(s.moreCountries||{}), heading:e.target.value } }))} />
                            <Label className="mt-2 block">Paragraph</Label>
                            <Textarea rows={3} value={sections.moreCountries?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, moreCountries:{ ...(s.moreCountries||{}), paragraph:e.target.value } }))} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="expandingMarkets">
                        <AccordionTrigger>Expanding Markets</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Heading</Label>
                            <Input value={sections.expandingMarkets?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, expandingMarkets:{ ...(s.expandingMarkets||{}), heading:e.target.value } }))} />
                            <Label className="mt-2 block">Paragraph</Label>
                            <Textarea rows={3} value={sections.expandingMarkets?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, expandingMarkets:{ ...(s.expandingMarkets||{}), paragraph:e.target.value } }))} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="readyStart">
                        <AccordionTrigger>Ready to Get Started</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Heading</Label>
                            <Input value={sections.readyStart?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, readyStart:{ ...(s.readyStart||{}), heading:e.target.value } }))} />
                            <Label className="mt-2 block">Paragraph</Label>
                            <Textarea rows={3} value={sections.readyStart?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, readyStart:{ ...(s.readyStart||{}), paragraph:e.target.value } }))} />
                            <div className="mt-2">
                              <h5 className="font-semibold mb-2">Buttons</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {(sections.readyStart?.buttons||[]).map((b:any, idx:number)=> (
                                  <div key={idx} className="border rounded p-3">
                                    <Label>Text</Label>
                                    <Input value={b.text||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.readyStart?.buttons||[])]; arr[idx]={...arr[idx], text:e.target.value}; return { ...s, readyStart:{ ...(s.readyStart||{}), buttons:arr } }; })} />
                                    <Label className="mt-2 block">Link</Label>
                                    <Input value={b.href||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.readyStart?.buttons||[])]; arr[idx]={...arr[idx], href:e.target.value}; return { ...s, readyStart:{ ...(s.readyStart||{}), buttons:arr } }; })} />
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2 mt-2">
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, readyStart:{ ...(s.readyStart||{}), buttons:[...(s.readyStart?.buttons||[]), { text:'', href:'' }] } }))}>Add Button</Button>
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, readyStart:{ ...(s.readyStart||{}), buttons:(s.readyStart?.buttons||[]).slice(0,-1) } }))}>Remove Last</Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="testimonials">
                        <AccordionTrigger>Testimonials</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.clientSay?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, clientSay:{ ...(s.clientSay||{}), heading:e.target.value } }))} />
                            <Label className="mt-2 block">Section Paragraph</Label>
                            <Textarea rows={3} value={sections.clientSay?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, clientSay:{ ...(s.clientSay||{}), paragraph:e.target.value } }))} />
                            <div className="mt-3">
                              <h5 className="font-semibold mb-2">Reviews</h5>
                              {(sections.reviews||[]).map((r:any, idx:number)=> (
                                <div key={idx} className="border rounded p-3 mb-2">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                      <Label>Name</Label>
                                      <Input value={r.name||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.reviews||[])]; arr[idx]={...arr[idx], name:e.target.value}; return { ...s, reviews:arr }; })} />
                                    </div>
                                    <div>
                                      <Label>Role</Label>
                                      <Input value={r.role||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.reviews||[])]; arr[idx]={...arr[idx], role:e.target.value}; return { ...s, reviews:arr }; })} />
                                    </div>
                                    <div>
                                      <Label>Rating (1–5)</Label>
                                      <Input value={String(r.rating ?? 5)} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.reviews||[])]; arr[idx]={...arr[idx], rating:Math.max(1, Math.min(5, Number(e.target.value)||1))}; return { ...s, reviews:arr }; })} />
                                    </div>
                                    <div>
                                      <Label>Image</Label>
                                      <Input type="file" accept="image/*" onChange={(e)=>{
                                        const file = e.currentTarget.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = ()=> setSections((s:any)=>{ const arr=[...(s.reviews||[])]; arr[idx]={...arr[idx], image:String(reader.result||'')}; return { ...s, reviews:arr }; });
                                        reader.readAsDataURL(file);
                                      }} />
                                    </div>
                                  </div>
                                  <Label className="mt-2 block">Review Text</Label>
                                  <Textarea rows={3} value={r.text||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.reviews||[])]; arr[idx]={...arr[idx], text:e.target.value}; return { ...s, reviews:arr }; })} />
                                </div>
                              ))}
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, reviews:[...(s.reviews||[]), { name:'', role:'', rating:5, text:'', image:'' }] }))}>Add Review</Button>
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, reviews:(s.reviews||[]).slice(0,-1) }))}>Remove Last</Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="finalCta">
                        <AccordionTrigger>Final CTA</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Heading</Label>
                            <Input value={sections.finalCta?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, finalCta:{ ...(s.finalCta||{}), heading:e.target.value } }))} />
                            <Label className="mt-2 block">Paragraph</Label>
                            <Textarea rows={3} value={sections.finalCta?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, finalCta:{ ...(s.finalCta||{}), paragraph:e.target.value } }))} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                              {(sections.finalCta?.buttons||[]).map((b:any, idx:number)=> (
                                <div key={idx} className="border rounded p-3">
                                  <Label>Button Text</Label>
                                  <Input value={b.text||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.finalCta.buttons||[])]; arr[idx]={...arr[idx], text:e.target.value}; return { ...s, finalCta:{...s.finalCta, buttons:arr} }; })} />
                                  <Label className="mt-2 block">Button Link</Label>
                                  <Input value={b.href||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.finalCta.buttons||[])]; arr[idx]={...arr[idx], href:e.target.value}; return { ...s, finalCta:{...s.finalCta, buttons:arr} }; })} />
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, finalCta:{ ...(s.finalCta||{}), buttons:[...(s.finalCta?.buttons||[]), { text:'', href:'' }] } }))}>Add Button</Button>
                              <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, finalCta:{ ...(s.finalCta||{}), buttons:(s.finalCta?.buttons||[]).slice(0,-1) } }))}>Remove Last</Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : editingPath === '/custom-booth' ? (
                    <Accordion type="multiple" className="bg-transparent">
                      <AccordionItem value="hero">
                        <AccordionTrigger>Hero</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Hero H1</Label>
                            <Input value={sections.hero?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, hero:{ ...(s.hero||{}), heading:e.target.value } }))} />
                            <Label className="mt-2 block">Hero Description</Label>
                            <Textarea rows={3} value={sections.hero?.description||''} onChange={(e)=>setSections((s:any)=>({ ...s, hero:{ ...(s.hero||{}), description:e.target.value } }))} />
                      </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="whyChooseCustom">
                        <AccordionTrigger>Why Choose Custom Design</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.whyChooseCustom?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, whyChooseCustom:{ ...(s.whyChooseCustom||{}), heading:e.target.value } }))} />
                            <Label className="mt-2 block">Section Paragraph</Label>
                            <Textarea rows={3} value={sections.whyChooseCustom?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, whyChooseCustom:{ ...(s.whyChooseCustom||{}), paragraph:e.target.value } }))} />
                            <div className="mt-3">
                              <h5 className="font-semibold mb-2">Features</h5>
                              {(sections.whyChooseCustom?.features||[]).map((feature:any, idx:number)=> (
                                <div key={idx} className="border rounded p-3 mb-2">
                                  <Label>Feature Heading</Label>
                                  <Input value={feature.heading||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.whyChooseCustom?.features||[])]; arr[idx]={...arr[idx], heading:e.target.value}; return { ...s, whyChooseCustom:{ ...(s.whyChooseCustom||{}), features:arr } }; })} />
                                  <Label className="mt-2 block">Feature Description</Label>
                                  <Textarea rows={2} value={feature.paragraph||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.whyChooseCustom?.features||[])]; arr[idx]={...arr[idx], paragraph:e.target.value}; return { ...s, whyChooseCustom:{ ...(s.whyChooseCustom||{}), features:arr } }; })} />
                      </div>
                              ))}
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, whyChooseCustom:{ ...(s.whyChooseCustom||{}), features:[...(s.whyChooseCustom?.features||[]), { heading:'', paragraph:'' }] } }))}>Add Feature</Button>
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, whyChooseCustom:{ ...(s.whyChooseCustom||{}), features:(s.whyChooseCustom?.features||[]).slice(0,-1) } }))}>Remove Last</Button>
                      </div>
                          </div>
                      </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="designProcess">
                        <AccordionTrigger>Design Process</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.designProcess?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, designProcess:{ ...(s.designProcess||{}), heading:e.target.value } }))} />
                            <Label className="mt-2 block">Section Paragraph</Label>
                            <Textarea rows={3} value={sections.designProcess?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, designProcess:{ ...(s.designProcess||{}), paragraph:e.target.value } }))} />
                            <div className="mt-3">
                              <h5 className="font-semibold mb-2">Process Steps</h5>
                              {(sections.designProcess?.steps||[]).map((step:any, idx:number)=> (
                                <div key={idx} className="border rounded p-3 mb-2">
                                  <Label>Step Heading</Label>
                                  <Input value={step.heading||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.designProcess?.steps||[])]; arr[idx]={...arr[idx], heading:e.target.value}; return { ...s, designProcess:{ ...(s.designProcess||{}), steps:arr } }; })} />
                                  <Label className="mt-2 block">Step Description</Label>
                                  <Textarea rows={2} value={step.paragraph||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.designProcess?.steps||[])]; arr[idx]={...arr[idx], paragraph:e.target.value}; return { ...s, designProcess:{ ...(s.designProcess||{}), steps:arr } }; })} />
                          </div>
                        ))}
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, designProcess:{ ...(s.designProcess||{}), steps:[...(s.designProcess?.steps||[]), { heading:'', paragraph:'' }] } }))}>Add Step</Button>
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, designProcess:{ ...(s.designProcess||{}), steps:(s.designProcess?.steps||[]).slice(0,-1) } }))}>Remove Last</Button>
                      </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="customDesignServices">
                        <AccordionTrigger>Custom Design Services</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.customDesignServices?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, customDesignServices:{ ...(s.customDesignServices||{}), heading:e.target.value } }))} />
                            <Label className="mt-2 block">Section Paragraph</Label>
                            <Textarea rows={3} value={sections.customDesignServices?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, customDesignServices:{ ...(s.customDesignServices||{}), paragraph:e.target.value } }))} />
                            
                            <div className="mt-4">
                              <h5 className="font-semibold mb-3">Service Cards</h5>
                              {(sections.customDesignServices?.serviceCards || []).map((card: any, idx: number) => (
                                <div key={idx} className="border rounded p-4 mb-3 bg-gray-50">
                                  <div className="flex items-center justify-between mb-3">
                                    <h6 className="font-medium">Card {idx + 1}</h6>
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => {
                                        const arr = [...(sections.customDesignServices?.serviceCards || [])];
                                        arr.splice(idx, 1);
                                        setSections((s: any) => ({ 
                                          ...s, 
                                          customDesignServices: { 
                                            ...(s.customDesignServices || {}), 
                                            serviceCards: arr 
                                          } 
                                        }));
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <Label>Card Title</Label>
                                      <Input 
                                        value={card.title || ''} 
                                        onChange={(e) => {
                                          const arr = [...(sections.customDesignServices?.serviceCards || [])];
                                          arr[idx] = { ...arr[idx], title: e.target.value };
                                          setSections((s: any) => ({ 
                                            ...s, 
                                            customDesignServices: { 
                                              ...(s.customDesignServices || {}), 
                                              serviceCards: arr 
                                            } 
                                          }));
                                        }} 
                                      />
                                    </div>
                                    <div>
                                      <Label>Badge (optional)</Label>
                                      <Input 
                                        value={card.badge || ''} 
                                        placeholder="e.g., Most Popular"
                                        onChange={(e) => {
                                          const arr = [...(sections.customDesignServices?.serviceCards || [])];
                                          arr[idx] = { ...arr[idx], badge: e.target.value };
                                          setSections((s: any) => ({ 
                                            ...s, 
                                            customDesignServices: { 
                                              ...(s.customDesignServices || {}), 
                                              serviceCards: arr 
                                            } 
                                          }));
                                        }} 
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3">
                                    <Label>Card Description</Label>
                                    <Textarea 
                                      rows={2} 
                                      value={card.description || ''} 
                                      onChange={(e) => {
                                        const arr = [...(sections.customDesignServices?.serviceCards || [])];
                                        arr[idx] = { ...arr[idx], description: e.target.value };
                                        setSections((s: any) => ({ 
                                          ...s, 
                                          customDesignServices: { 
                                            ...(s.customDesignServices || {}), 
                                            serviceCards: arr 
                                          } 
                                        }));
                                      }} 
                                    />
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                    <div>
                                      <Label>Starting From Text</Label>
                                      <Input 
                                        value={card.startingFrom || ''} 
                                        placeholder="Starting from"
                                        onChange={(e) => {
                                          const arr = [...(sections.customDesignServices?.serviceCards || [])];
                                          arr[idx] = { ...arr[idx], startingFrom: e.target.value };
                                          setSections((s: any) => ({ 
                                            ...s, 
                                            customDesignServices: { 
                                              ...(s.customDesignServices || {}), 
                                              serviceCards: arr 
                                            } 
                                          }));
                                        }} 
                                      />
                                    </div>
                                    <div>
                                      <Label>Price</Label>
                                      <Input 
                                        value={card.price || ''} 
                                        placeholder="e.g., $2,000"
                                        onChange={(e) => {
                                          const arr = [...(sections.customDesignServices?.serviceCards || [])];
                                          arr[idx] = { ...arr[idx], price: e.target.value };
                                          setSections((s: any) => ({ 
                                            ...s, 
                                            customDesignServices: { 
                                              ...(s.customDesignServices || {}), 
                                              serviceCards: arr 
                                            } 
                                          }));
                                        }} 
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3">
                                    <Label>Features (one per line)</Label>
                                    <Textarea 
                                      rows={3} 
                                      value={(card.features || []).join('\n')} 
                                      placeholder="Brand analysis&#10;3D visualization&#10;Space planning&#10;Material selection"
                                      onChange={(e) => {
                                        const features = e.target.value.split('\n').filter(f => f.trim());
                                        const arr = [...(sections.customDesignServices?.serviceCards || [])];
                                        arr[idx] = { ...arr[idx], features };
                                        setSections((s: any) => ({ 
                                          ...s, 
                                          customDesignServices: { 
                                            ...(s.customDesignServices || {}), 
                                            serviceCards: arr 
                                          } 
                                        }));
                                      }} 
                                    />
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                    <div>
                                      <Label>Button Text</Label>
                                      <Input 
                                        value={card.buttonText || ''} 
                                        placeholder="Get Quote"
                                        onChange={(e) => {
                                          const arr = [...(sections.customDesignServices?.serviceCards || [])];
                                          arr[idx] = { ...arr[idx], buttonText: e.target.value };
                                          setSections((s: any) => ({ 
                                            ...s, 
                                            customDesignServices: { 
                                              ...(s.customDesignServices || {}), 
                                              serviceCards: arr 
                                            } 
                                          }));
                                        }} 
                                      />
                                    </div>
                                    <div>
                                      <Label>Button Link</Label>
                                      <Input 
                                        value={card.buttonLink || ''} 
                                        placeholder="/quote"
                                        onChange={(e) => {
                                          const arr = [...(sections.customDesignServices?.serviceCards || [])];
                                          arr[idx] = { ...arr[idx], buttonLink: e.target.value };
                                          setSections((s: any) => ({ 
                                            ...s, 
                                            customDesignServices: { 
                                              ...(s.customDesignServices || {}), 
                                              serviceCards: arr 
                                            } 
                                          }));
                                        }} 
                                      />
                                    </div>
                                  </div>
                          </div>
                        ))}
                              
                              <div className="flex gap-2 mt-3">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => {
                                    const newCard = {
                                      title: '',
                                      description: '',
                                      startingFrom: 'Starting from',
                                      price: '',
                                      features: [],
                                      buttonText: 'Get Quote',
                                      buttonLink: '/quote',
                                      badge: ''
                                    };
                                    setSections((s: any) => ({ 
                                      ...s, 
                                      customDesignServices: { 
                                        ...(s.customDesignServices || {}), 
                                        serviceCards: [...(s.customDesignServices?.serviceCards || []), newCard] 
                                      } 
                                    }));
                                  }}
                                >
                                  Add Service Card
                                </Button>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => {
                                    const arr = [...(sections.customDesignServices?.serviceCards || [])];
                                    if (arr.length > 0) {
                                      arr.splice(-1, 1);
                                      setSections((s: any) => ({ 
                                        ...s, 
                                        customDesignServices: { 
                                          ...(s.customDesignServices || {}), 
                                          serviceCards: arr 
                                        } 
                                      }));
                                    }
                                  }}
                                >
                                  Remove Last Card
                                </Button>
                      </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="customBoothCta">
                        <AccordionTrigger>Final CTA</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.customBoothCta?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, customBoothCta:{ ...(s.customBoothCta||{}), heading:e.target.value } }))} />
                            <Label className="mt-2 block">Section Paragraph</Label>
                            <Textarea rows={3} value={sections.customBoothCta?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, customBoothCta:{ ...(s.customBoothCta||{}), paragraph:e.target.value } }))} />
                            <div className="mt-3">
                              <h5 className="font-semibold mb-2">Buttons</h5>
                              {(sections.customBoothCta?.buttons||[]).map((button:any, idx:number)=> (
                                <div key={idx} className="border rounded p-3 mb-2">
                              <Label>Button Text</Label>
                                  <Input value={button.text||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.customBoothCta?.buttons||[])]; arr[idx]={...arr[idx], text:e.target.value}; return { ...s, customBoothCta:{ ...(s.customBoothCta||{}), buttons:arr } }; })} />
                              <Label className="mt-2 block">Button Link</Label>
                                  <Input value={button.href||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.customBoothCta?.buttons||[])]; arr[idx]={...arr[idx], href:e.target.value}; return { ...s, customBoothCta:{ ...(s.customBoothCta||{}), buttons:arr } }; })} />
                          </div>
                        ))}
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, customBoothCta:{ ...(s.customBoothCta||{}), buttons:[...(s.customBoothCta?.buttons||[]), { text:'', href:'' }] } }))}>Add Button</Button>
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, customBoothCta:{ ...(s.customBoothCta||{}), buttons:(s.customBoothCta?.buttons||[]).slice(0,-1) } }))}>Remove Last</Button>
                      </div>
                      </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : editingPath === '/booth-rental' ? (
                    <Accordion type="multiple" className="bg-transparent">
                      <AccordionItem value="hero">
                        <AccordionTrigger>Hero</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Hero H1</Label>
                            <Input value={sections.boothRental?.hero?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, boothRental:{ ...(s.boothRental||{}), hero:{ ...(s.boothRental?.hero||{}), heading:e.target.value } } }))} />
                            <Label className="mt-2 block">Hero Description</Label>
                            <Textarea rows={3} value={sections.boothRental?.hero?.description||''} onChange={(e)=>setSections((s:any)=>({ ...s, boothRental:{ ...(s.boothRental||{}), hero:{ ...(s.boothRental?.hero||{}), description:e.target.value } } }))} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="whyChoose">
                        <AccordionTrigger>Why Choose Booth Rental</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.boothRental?.whyChoose?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, boothRental:{ ...(s.boothRental||{}), whyChoose:{ ...(s.boothRental?.whyChoose||{}), heading:e.target.value } } }))} />
                            <Label className="mt-2 block">Section Paragraph</Label>
                            <Textarea rows={3} value={sections.boothRental?.whyChoose?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, boothRental:{ ...(s.boothRental||{}), whyChoose:{ ...(s.boothRental?.whyChoose||{}), paragraph:e.target.value } } }))} />
                            <div className="mt-3">
                              <h5 className="font-semibold mb-2">Features</h5>
                              {(sections.boothRental?.whyChoose?.features||[]).map((feature:any, idx:number)=> (
                                <div key={idx} className="border rounded p-3 mb-2">
                                  <Label>Feature Heading</Label>
                                  <Input value={feature.heading||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.boothRental?.whyChoose?.features||[])]; arr[idx]={...arr[idx], heading:e.target.value}; return { ...s, boothRental:{ ...(s.boothRental||{}), whyChoose:{ ...(s.boothRental?.whyChoose||{}), features:arr } } }; })} />
                                  <Label className="mt-2 block">Feature Description</Label>
                                  <Textarea rows={2} value={feature.paragraph||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.boothRental?.whyChoose?.features||[])]; arr[idx]={...arr[idx], paragraph:e.target.value}; return { ...s, boothRental:{ ...(s.boothRental||{}), whyChoose:{ ...(s.boothRental?.whyChoose||{}), features:arr } } }; })} />
                                </div>
                              ))}
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, boothRental:{ ...(s.boothRental||{}), whyChoose:{ ...(s.boothRental?.whyChoose||{}), features:[...(s.boothRental?.whyChoose?.features||[]), { heading:'', paragraph:'' }] } } }))}>Add Feature</Button>
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, boothRental:{ ...(s.boothRental||{}), whyChoose:{ ...(s.boothRental?.whyChoose||{}), features:(s.boothRental?.whyChoose?.features||[]).slice(0,-1) } } }))}>Remove Last</Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="process">
                        <AccordionTrigger>Rental Process</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.boothRental?.process?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, boothRental:{ ...(s.boothRental||{}), process:{ ...(s.boothRental?.process||{}), heading:e.target.value } } }))} />
                            <Label className="mt-2 block">Section Paragraph</Label>
                            <Textarea rows={3} value={sections.boothRental?.process?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, boothRental:{ ...(s.boothRental||{}), process:{ ...(s.boothRental?.process||{}), paragraph:e.target.value } } }))} />
                            <div className="mt-3">
                              <h5 className="font-semibold mb-2">Process Steps</h5>
                              {(sections.boothRental?.process?.steps||[]).map((step:any, idx:number)=> (
                                <div key={idx} className="border rounded p-3 mb-2">
                                  <Label>Step Heading</Label>
                                  <Input value={step.heading||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.boothRental?.process?.steps||[])]; arr[idx]={...arr[idx], heading:e.target.value}; return { ...s, boothRental:{ ...(s.boothRental||{}), process:{ ...(s.boothRental?.process||{}), steps:arr } } }; })} />
                                  <Label className="mt-2 block">Step Description</Label>
                                  <Textarea rows={2} value={step.paragraph||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.boothRental?.process?.steps||[])]; arr[idx]={...arr[idx], paragraph:e.target.value}; return { ...s, boothRental:{ ...(s.boothRental||{}), process:{ ...(s.boothRental?.process||{}), steps:arr } } }; })} />
                                </div>
                              ))}
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, boothRental:{ ...(s.boothRental||{}), process:{ ...(s.boothRental?.process||{}), steps:[...(s.boothRental?.process?.steps||[]), { heading:'', paragraph:'' }] } } }))}>Add Step</Button>
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, boothRental:{ ...(s.boothRental||{}), process:{ ...(s.boothRental?.process||{}), steps:(s.boothRental?.process?.steps||[]).slice(0,-1) } } }))}>Remove Last</Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="services">
                        <AccordionTrigger>Booth Rental Services</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.boothRental?.services?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, boothRental:{ ...(s.boothRental||{}), services:{ ...(s.boothRental?.services||{}), heading:e.target.value } } }))} />
                            <Label className="mt-2 block">Section Paragraph</Label>
                            <Textarea rows={3} value={sections.boothRental?.services?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, boothRental:{ ...(s.boothRental||{}), services:{ ...(s.boothRental?.services||{}), paragraph:e.target.value } } }))} />
                            
                            <div className="mt-4">
                              <h5 className="font-semibold mb-3">Service Cards</h5>
                              {(sections.boothRental?.services?.serviceCards || []).map((card: any, idx: number) => (
                                <div key={idx} className="border rounded p-4 mb-3 bg-gray-50">
                                  <div className="flex items-center justify-between mb-3">
                                    <h6 className="font-medium">Card {idx + 1}</h6>
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => {
                                        const arr = [...(sections.boothRental?.services?.serviceCards || [])];
                                        arr.splice(idx, 1);
                                        setSections((s: any) => ({ 
                                          ...s, 
                                          boothRental: { 
                                            ...(s.boothRental || {}), 
                                            services: { ...(s.boothRental?.services || {}), serviceCards: arr }
                                          } 
                                        }));
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <Label>Card Title</Label>
                                      <Input 
                                        value={card.title || ''} 
                                        onChange={(e) => {
                                          const arr = [...(sections.boothRental?.services?.serviceCards || [])];
                                          arr[idx] = { ...arr[idx], title: e.target.value };
                                          setSections((s: any) => ({ 
                                            ...s, 
                                            boothRental: { 
                                              ...(s.boothRental || {}), 
                                              services: { ...(s.boothRental?.services || {}), serviceCards: arr }
                                            } 
                                          }));
                                        }} 
                                      />
                                    </div>
                                    <div>
                                      <Label>Badge (optional)</Label>
                                      <Input 
                                        value={card.badge || ''} 
                                        placeholder="e.g., Most Popular"
                                        onChange={(e) => {
                                          const arr = [...(sections.boothRental?.services?.serviceCards || [])];
                                          arr[idx] = { ...arr[idx], badge: e.target.value };
                                          setSections((s: any) => ({ 
                                            ...s, 
                                            boothRental: { 
                                              ...(s.boothRental || {}), 
                                              services: { ...(s.boothRental?.services || {}), serviceCards: arr }
                                            } 
                                          }));
                                        }} 
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3">
                                    <Label>Card Description</Label>
                                    <Textarea 
                                      rows={2} 
                                      value={card.description || ''} 
                                      onChange={(e) => {
                                        const arr = [...(sections.boothRental?.services?.serviceCards || [])];
                                        arr[idx] = { ...arr[idx], description: e.target.value };
                                        setSections((s: any) => ({ 
                                          ...s, 
                                          boothRental: { 
                                            ...(s.boothRental || {}), 
                                            services: { ...(s.boothRental?.services || {}), serviceCards: arr }
                                          } 
                                        }));
                                      }} 
                                    />
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                    <div>
                                      <Label>Starting From Text</Label>
                                      <Input 
                                        value={card.startingFrom || ''} 
                                        placeholder="Starting from"
                                        onChange={(e) => {
                                          const arr = [...(sections.boothRental?.services?.serviceCards || [])];
                                          arr[idx] = { ...arr[idx], startingFrom: e.target.value };
                                          setSections((s: any) => ({ 
                                            ...s, 
                                            boothRental: { 
                                              ...(s.boothRental || {}), 
                                              services: { ...(s.boothRental?.services || {}), serviceCards: arr }
                                            } 
                                          }));
                                        }} 
                                      />
                                    </div>
                                    <div>
                                      <Label>Price</Label>
                                      <Input 
                                        value={card.price || ''} 
                                        placeholder="e.g., $1,500"
                                        onChange={(e) => {
                                          const arr = [...(sections.boothRental?.services?.serviceCards || [])];
                                          arr[idx] = { ...arr[idx], price: e.target.value };
                                          setSections((s: any) => ({ 
                                            ...s, 
                                            boothRental: { 
                                              ...(s.boothRental || {}), 
                                              services: { ...(s.boothRental?.services || {}), serviceCards: arr }
                                            } 
                                          }));
                                        }} 
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3">
                                    <Label>Features (one per line)</Label>
                                    <Textarea 
                                      rows={3} 
                                      value={(card.features || []).join('\n')} 
                                      placeholder="Easy setup&#10;Multiple configurations&#10;Professional appearance&#10;Cost-effective"
                                      onChange={(e) => {
                                        const features = e.target.value.split('\n').filter(f => f.trim());
                                        const arr = [...(sections.boothRental?.services?.serviceCards || [])];
                                        arr[idx] = { ...arr[idx], features };
                                        setSections((s: any) => ({ 
                                          ...s, 
                                          boothRental: { 
                                            ...(s.boothRental || {}), 
                                            services: { ...(s.boothRental?.services || {}), serviceCards: arr }
                                          } 
                                        }));
                                      }} 
                                    />
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                    <div>
                              <Label>Button Text</Label>
                                      <Input 
                                        value={card.buttonText || ''} 
                                        placeholder="Get Quote"
                                        onChange={(e) => {
                                          const arr = [...(sections.boothRental?.services?.serviceCards || [])];
                                          arr[idx] = { ...arr[idx], buttonText: e.target.value };
                                          setSections((s: any) => ({ 
                                            ...s, 
                                            boothRental: { 
                                              ...(s.boothRental || {}), 
                                              services: { ...(s.boothRental?.services || {}), serviceCards: arr }
                                            } 
                                          }));
                                        }} 
                                      />
                                    </div>
                                    <div>
                                      <Label>Button Link</Label>
                                      <Input 
                                        value={card.buttonLink || ''} 
                                        placeholder="/quote"
                                        onChange={(e) => {
                                          const arr = [...(sections.boothRental?.services?.serviceCards || [])];
                                          arr[idx] = { ...arr[idx], buttonLink: e.target.value };
                                          setSections((s: any) => ({ 
                                            ...s, 
                                            boothRental: { 
                                              ...(s.boothRental || {}), 
                                              services: { ...(s.boothRental?.services || {}), serviceCards: arr }
                                            } 
                                          }));
                                        }} 
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              <div className="flex gap-2 mt-3">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => {
                                    const newCard = {
                                      title: '',
                                      description: '',
                                      startingFrom: 'Starting from',
                                      price: '',
                                      features: [],
                                      buttonText: 'Get Quote',
                                      buttonLink: '/quote',
                                      badge: ''
                                    };
                                    setSections((s: any) => ({ 
                                      ...s, 
                                      boothRental: { 
                                        ...(s.boothRental || {}), 
                                        services: { ...(s.boothRental?.services || {}), serviceCards: [...(s.boothRental?.services?.serviceCards || []), newCard] }
                                      } 
                                    }));
                                  }}
                                >
                                  Add Service Card
                                </Button>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => {
                                    const arr = [...(sections.boothRental?.services?.serviceCards || [])];
                                    if (arr.length > 0) {
                                      arr.splice(-1, 1);
                                      setSections((s: any) => ({ 
                                        ...s, 
                                        boothRental: { 
                                          ...(s.boothRental || {}), 
                                          services: { ...(s.boothRental?.services || {}), serviceCards: arr }
                                        } 
                                      }));
                                    }
                                  }}
                                >
                                  Remove Last Card
                                </Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="cta">
                        <AccordionTrigger>Final CTA</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.boothRental?.cta?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, boothRental:{ ...(s.boothRental||{}), cta:{ ...(s.boothRental?.cta||{}), heading:e.target.value } } }))} />
                            <Label className="mt-2 block">Section Paragraph</Label>
                            <Textarea rows={3} value={sections.boothRental?.cta?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, boothRental:{ ...(s.boothRental||{}), cta:{ ...(s.boothRental?.cta||{}), paragraph:e.target.value } } }))} />
                            <div className="mt-3">
                              <h5 className="font-semibold mb-2">Buttons</h5>
                              {(sections.boothRental?.cta?.buttons||[]).map((button:any, idx:number)=> (
                                <div key={idx} className="border rounded p-3 mb-2">
                                  <Label>Button Text</Label>
                                  <Input value={button.text||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.boothRental?.cta?.buttons||[])]; arr[idx]={...arr[idx], text:e.target.value}; return { ...s, boothRental:{ ...(s.boothRental||{}), cta:{ ...(s.boothRental?.cta||{}), buttons:arr } } }; })} />
                              <Label className="mt-2 block">Button Link</Label>
                                  <Input value={button.href||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.boothRental?.cta?.buttons||[])]; arr[idx]={...arr[idx], href:e.target.value}; return { ...s, boothRental:{ ...(s.boothRental||{}), cta:{ ...(s.boothRental?.cta||{}), buttons:arr } } }; })} />
                            </div>
                          ))}
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, boothRental:{ ...(s.boothRental||{}), cta:{ ...(s.boothRental?.cta||{}), buttons:[...(s.boothRental?.cta?.buttons||[]), { text:'', href:'' }] } } }))}>Add Button</Button>
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, boothRental:{ ...(s.boothRental||{}), cta:{ ...(s.boothRental?.cta||{}), buttons:(s.boothRental?.cta?.buttons||[]).slice(0,-1) } } }))}>Remove Last</Button>
                        </div>
                      </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : editingPath?.startsWith('/exhibition-stands/') ? (
                    <div className="space-y-6">
                      <Accordion type="multiple" className="bg-transparent">
                        <AccordionItem value="countryPages" className="border-2 border-blue-200 rounded-lg">
                          <AccordionTrigger className="text-xl font-semibold px-6 py-4 bg-blue-50 hover:bg-blue-100 rounded-t-lg">
                            🌍 Country Pages Content
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                            <div className="space-y-8">
                              {Object.entries(sections.countryPages || {}).map(([countrySlug, countryData]: [string, any]) => (
                                <div key={countrySlug} className="border-2 border-gray-200 rounded-xl p-8 bg-gradient-to-br from-gray-50 to-white shadow-sm">
                                  <h4 className="text-2xl font-bold mb-6 text-gray-800 capitalize border-b border-gray-200 pb-3">
                                    🏳️ {countrySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                  </h4>
                                  
                                  {/* Why Choose Local Section */}
                                  <div className="mb-8 p-6 bg-white rounded-lg border border-gray-100">
                                    <h5 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
                                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                      Why Choose Local Builders
                                    </h5>
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="text-sm font-medium text-gray-600">Section Heading</Label>
                                        <Input 
                                          className="mt-1"
                                          value={countryData?.whyChooseHeading || ''} 
                                          onChange={(e) => setSections((s: any) => ({
                                            ...s,
                                            countryPages: {
                                              ...(s.countryPages || {}),
                                              [countrySlug]: {
                                                ...(s.countryPages?.[countrySlug] || {}),
                                                whyChooseHeading: e.target.value
                                              }
                                            }
                                          }))}
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium text-gray-600">Section Paragraph</Label>
                                        <Textarea 
                                          className="mt-1"
                                          rows={3} 
                                          value={countryData?.whyChooseParagraph || ''} 
                                          onChange={(e) => setSections((s: any) => ({
                                            ...s,
                                            countryPages: {
                                              ...(s.countryPages || {}),
                                              [countrySlug]: {
                                                ...(s.countryPages?.[countrySlug] || {}),
                                                whyChooseParagraph: e.target.value
                                              }
                                            }
                                          }))}
                                        />
                                      </div>
                                      
                                                                          {/* Info Cards */}
                                    <div className="mt-10 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
                                      <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center">
                                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4">
                                            <span className="text-white font-bold text-sm">3</span>
                                          </div>
                                          <div>
                                            <h6 className="text-xl font-bold text-gray-800">Info Cards</h6>
                                            <p className="text-sm text-gray-600">Customize the three key advantages for local builders</p>
                                          </div>
                                        </div>
                                        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                                          Core Content
                                        </Badge>
                                      </div>
                                      
                                      <div className="space-y-8">
                                        {(countryData?.infoCards || []).map((card: any, idx: number) => (
                                          <div key={idx} className="group relative">
                                            {/* Card Container */}
                                            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-300 group-hover:scale-[1.01] w-full">
                                              {/* Card Header */}
                                              <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center">
                                                  <div className={`w-8 h-8 rounded-full mr-4 flex items-center justify-center ${
                                                    idx === 0 ? 'bg-blue-500' : 
                                                    idx === 1 ? 'bg-green-500' : 'bg-purple-500'
                                                  }`}>
                                                    <span className="text-white font-bold text-lg">{idx + 1}</span>
                                                  </div>
                                                  <div>
                                                    <span className="text-xl font-bold text-gray-800">Card {idx + 1}</span>
                                                    <div className="text-sm text-gray-600 mt-1">
                                                      {idx === 0 ? "Market Knowledge" : idx === 1 ? "Project Delivery" : "Cost Solutions"}
                                                    </div>
                                                  </div>
                                                </div>
                                                <Badge variant="outline" className={`${
                                                  idx === 0 ? 'border-blue-300 text-blue-700 bg-blue-50' : 
                                                  idx === 1 ? 'border-green-300 text-green-700 bg-green-50' : 
                                                  'border-purple-300 text-purple-700 bg-purple-50'
                                                } px-4 py-2 text-sm`}>
                                                  {idx === 0 ? "Market Knowledge" : idx === 1 ? "Project Delivery" : "Cost Solutions"}
                                                </Badge>
                                              </div>
                                              
                                              {/* Card Content */}
                                              <div className="space-y-8">
                                                <div>
                                                  <Label className="text-lg font-semibold text-gray-700 mb-4 block flex items-center">
                                                    <span className="w-3 h-3 bg-gray-400 rounded-full mr-3"></span>
                                                    Card Title
                                                  </Label>
                                                  <Input 
                                                    className="text-base h-14 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 w-full"
                                                    placeholder="e.g., Local Market Knowledge"
                                                    value={card.title || ''} 
                                                    onChange={(e) => {
                                                      const arr = [...(countryData?.infoCards || [])];
                                                      arr[idx] = { ...arr[idx], title: e.target.value };
                                                      setSections((s: any) => ({
                                                        ...s,
                                                        countryPages: {
                                                          ...(s.countryPages || {}),
                                                          [countrySlug]: {
                                                            ...(s.countryPages?.[countrySlug] || {}),
                                                            infoCards: arr
                                                          }
                                                        }
                                                      }));
                                                    }}
                                                  />
                                                </div>
                                                
                                                <div>
                                                  <Label className="text-lg font-semibold text-gray-700 mb-4 block flex items-center">
                                                    <span className="w-3 h-3 bg-gray-400 rounded-full mr-3"></span>
                                                    Description
                                                  </Label>
                                                  <Textarea 
                                                    className="text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none w-full"
                                                    rows={6} 
                                                    placeholder="Describe the advantage or benefit that local builders provide..."
                                                    value={card.text || ''} 
                                                    onChange={(e) => {
                                                      const arr = [...(countryData?.infoCards || [])];
                                                      arr[idx] = { ...arr[idx], text: e.target.value };
                                                      setSections((s: any) => ({
                                                        ...s,
                                                        countryPages: {
                                                          ...(s.countryPages || {}),
                                                          [countrySlug]: {
                                                            ...(s.countryPages?.[countrySlug] || {}),
                                                            infoCards: arr
                                                          }
                                                        }
                                                      }));
                                                    }}
                                                  />
                                                </div>
                                              </div>
                                              
                                              {/* Card Footer */}
                                              <div className="mt-8 pt-6 border-t border-gray-100">
                                                <div className="text-sm text-gray-500 text-center bg-gray-50 rounded-lg p-3">
                                                  This card will appear in the "Why Choose Local Builders" section
                                                </div>
                                              </div>
                                            </div>
                                            
                                            {/* Hover Effect Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                          </div>
                                        ))}
                                      </div>
                                      
                                      {/* Add/Remove Cards Controls */}
                                      <div className="mt-8 flex justify-center">
                                        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                                          <div className="text-sm text-gray-600 text-center mb-3">
                                            Info cards are automatically managed - you can edit the content above
                                          </div>
                                          <div className="flex gap-2 justify-center">
                                            <Button 
                                              type="button" 
                                              variant="outline" 
                                              size="sm"
                                              className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                              onClick={() => {
                                                // Reset cards to default content
                                                const defaultCards = [
                                                  {
                                                    title: "Local Market Knowledge",
                                                    text: `Understand local regulations, venue requirements, and cultural preferences specific to ${countrySlug}.`
                                                  },
                                                  {
                                                    title: "Faster Project Delivery",
                                                    text: "Reduced logistics time, easier coordination, and faster response times for urgent modifications or support."
                                                  },
                                                  {
                                                    title: "Cost-Effective Solutions",
                                                    text: "Lower transportation costs, established supplier networks, and competitive local pricing structures."
                                                  }
                                                ];
                                                setSections((s: any) => ({
                                                  ...s,
                                                  countryPages: {
                                                    ...(s.countryPages || {}),
                                                    [countrySlug]: {
                                                      ...(s.countryPages?.[countrySlug] || {}),
                                                      infoCards: defaultCards
                                                    }
                                                  }
                                                }));
                                              }}
                                            >
                                              Reset to Default
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    </div>
                                  </div>
                                  
                                  {/* Get Quotes Section */}
                                  <div className="mb-8 p-6 bg-white rounded-lg border border-gray-100">
                                    <h5 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
                                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                      Get Quotes Section
                                    </h5>
                                    <div>
                                      <Label className="text-sm font-medium text-gray-600">Paragraph</Label>
                                      <Textarea 
                                        className="mt-1"
                                        rows={3} 
                                        value={countryData?.quotesParagraph || ''} 
                                        onChange={(e) => setSections((s: any) => ({
                                          ...s,
                                          countryPages: {
                                            ...(s.countryPages || {}),
                                            [countrySlug]: {
                                              ...(s.countryPages?.[countrySlug] || {}),
                                              quotesParagraph: e.target.value
                                            }
                                          }
                                        }))}
                                      />
                                    </div>
                                  </div>
                                  
                                  {/* Services Overview Section */}
                                  <div className="p-6 bg-white rounded-lg border border-gray-100">
                                    <h5 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
                                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                                      Services Overview
                                    </h5>
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="text-sm font-medium text-gray-600">Section Heading</Label>
                                        <Input 
                                          className="mt-1"
                                          value={countryData?.servicesHeading || ''} 
                                          onChange={(e) => setSections((s: any) => ({
                                            ...s,
                                            countryPages: {
                                              ...(s.countryPages || {}),
                                              [countrySlug]: {
                                                ...(s.countryPages?.[countrySlug] || {}),
                                                servicesHeading: e.target.value
                                              }
                                            }
                                          }))}
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium text-gray-600">Section Paragraph</Label>
                                        <Textarea 
                                          className="mt-1"
                                          rows={4} 
                                          value={countryData?.servicesParagraph || ''} 
                                          onChange={(e) => setSections((s: any) => ({
                                            ...s,
                                            countryPages: {
                                              ...(s.countryPages || {}),
                                              [countrySlug]: {
                                                ...(s.countryPages?.[countrySlug] || {}),
                                                servicesParagraph: e.target.value
                                              }
                                            }
                                          }))}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Final CTA Section */}
                                  <div className="mt-8 p-6 bg-white rounded-lg border border-gray-100">
                                    <h5 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
                                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                                      Final Call-to-Action
                                    </h5>
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="text-sm font-medium text-gray-600">Section Heading</Label>
                                        <Input 
                                          className="mt-1"
                                          value={countryData?.finalCtaHeading || ''} 
                                          onChange={(e) => setSections((s: any) => ({
                                            ...s,
                                            countryPages: {
                                              ...(s.countryPages || {}),
                                              [countrySlug]: {
                                                ...(s.countryPages?.[countrySlug] || {}),
                                                finalCtaHeading: e.target.value
                                              }
                                            }
                                          }))}
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium text-gray-600">Section Paragraph</Label>
                                        <Textarea 
                                          className="mt-1"
                                          rows={3} 
                                          value={countryData?.finalCtaParagraph || ''} 
                                          onChange={(e) => setSections((s: any) => ({
                                            ...s,
                                            countryPages: {
                                              ...(s.countryPages || {}),
                                              [countrySlug]: {
                                                ...(s.countryPages?.[countrySlug] || {}),
                                                finalCtaParagraph: e.target.value
                                              }
                                            }
                                          }))}
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium text-gray-600">Primary Button Text</Label>
                                        <Input 
                                          className="mt-1"
                                          value={countryData?.finalCtaButtonText || ''} 
                                          onChange={(e) => setSections((s: any) => ({
                                            ...s,
                                            countryPages: {
                                              ...(s.countryPages || {}),
                                              [countrySlug]: {
                                                ...(s.countryPages?.[countrySlug] || {}),
                                                finalCtaButtonText: e.target.value
                                              }
                                            }
                                          }))}
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium text-gray-600">Back to Top Button Text</Label>
                                        <Input 
                                          className="mt-1"
                                          value={countryData?.backToTopButtonText || ''} 
                                          onChange={(e) => setSections((s: any) => ({
                                            ...s,
                                            countryPages: {
                                              ...(s.countryPages || {}),
                                              [countrySlug]: {
                                                ...(s.countryPages?.[countrySlug] || {}),
                                                backToTopButtonText: e.target.value
                                              }
                                            }
                                          }))}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                                              </AccordionItem>
                    </Accordion>
                  </div>
                ) : editingPath === '/3d-rendering-and-concept-development' ? (
                  <div className="space-y-6">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="hero">
                        <AccordionTrigger>Hero Section</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.renderingConcept?.hero?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, renderingConcept:{ ...(s.renderingConcept||{}), hero:{ ...(s.renderingConcept?.hero||{}), heading:e.target.value } } }))} />
                            <Label className="mt-2 block">Section Description</Label>
                            <Textarea rows={3} value={sections.renderingConcept?.hero?.description||''} onChange={(e)=>setSections((s:any)=>({ ...s, renderingConcept:{ ...(s.renderingConcept||{}), hero:{ ...(s.renderingConcept?.hero||{}), description:e.target.value } } }))} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="whyChoose">
                        <AccordionTrigger>Why Choose Section</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.renderingConcept?.whyChoose?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, renderingConcept:{ ...(s.renderingConcept||{}), whyChoose:{ ...(s.renderingConcept?.whyChoose||{}), heading:e.target.value } } }))} />
                            <Label className="mt-2 block">Section Paragraph</Label>
                            <Textarea rows={3} value={sections.renderingConcept?.whyChoose?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, renderingConcept:{ ...(s.renderingConcept||{}), whyChoose:{ ...(s.renderingConcept?.whyChoose||{}), paragraph:e.target.value } } }))} />
                            <div className="mt-3">
                              <h5 className="font-semibold mb-2">Features</h5>
                              {(sections.renderingConcept?.whyChoose?.features||[]).map((feature:any, idx:number)=> (
                                <div key={idx} className="border rounded p-3 mb-2">
                                  <Label>Feature Heading</Label>
                                  <Input value={feature.heading||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.renderingConcept?.whyChoose?.features||[])]; arr[idx]={...arr[idx], heading:e.target.value}; return { ...s, renderingConcept:{ ...(s.renderingConcept||{}), whyChoose:{ ...(s.renderingConcept?.whyChoose||{}), features:arr } } }; })} />
                                  <Label className="mt-2 block">Feature Paragraph</Label>
                                  <Textarea rows={2} value={feature.paragraph||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.renderingConcept?.whyChoose?.features||[])]; arr[idx]={...arr[idx], paragraph:e.target.value}; return { ...s, renderingConcept:{ ...(s.renderingConcept||{}), whyChoose:{ ...(s.renderingConcept?.whyChoose||{}), features:arr } } }; })} />
                                </div>
                              ))}
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, renderingConcept:{ ...(s.renderingConcept||{}), whyChoose:{ ...(s.renderingConcept?.whyChoose||{}), features:[...(s.renderingConcept?.whyChoose?.features||[]), { heading:'', paragraph:'' }] } } }))}>Add Feature</Button>
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, renderingConcept:{ ...(s.renderingConcept||{}), whyChoose:{ ...(s.renderingConcept?.whyChoose||{}), features:(s.renderingConcept?.whyChoose?.features||[]).slice(0,-1) } } }))}>Remove Last</Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="process">
                        <AccordionTrigger>Process Section</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.renderingConcept?.process?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, renderingConcept:{ ...(s.renderingConcept||{}), process:{ ...(s.renderingConcept?.process||{}), heading:e.target.value } } }))} />
                            <Label className="mt-2 block">Section Paragraph</Label>
                            <Textarea rows={3} value={sections.renderingConcept?.process?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, renderingConcept:{ ...(s.renderingConcept||{}), process:{ ...(s.renderingConcept?.process||{}), paragraph:e.target.value } } }))} />
                            <div className="mt-3">
                              <h5 className="font-semibold mb-2">Process Steps</h5>
                              {(sections.renderingConcept?.process?.steps||[]).map((step:any, idx:number)=> (
                                <div key={idx} className="border rounded p-3 mb-2">
                                  <Label>Step Heading</Label>
                                  <Input value={step.heading||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.renderingConcept?.process?.steps||[])]; arr[idx]={...arr[idx], heading:e.target.value}; return { ...s, renderingConcept:{ ...(s.renderingConcept||{}), process:{ ...(s.renderingConcept?.process||{}), steps:arr } } }; })} />
                                  <Label className="mt-2 block">Step Paragraph</Label>
                                  <Textarea rows={2} value={step.paragraph||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.renderingConcept?.process?.steps||[])]; arr[idx]={...arr[idx], paragraph:e.target.value}; return { ...s, renderingConcept:{ ...(s.renderingConcept||{}), process:{ ...(s.renderingConcept?.process||{}), steps:arr } } }; })} />
                                </div>
                              ))}
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, renderingConcept:{ ...(s.renderingConcept||{}), process:{ ...(s.renderingConcept?.process||{}), steps:[...(s.renderingConcept?.process?.steps||[]), { heading:'', paragraph:'' }] } } }))}>Add Step</Button>
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, renderingConcept:{ ...(s.renderingConcept||{}), process:{ ...(s.renderingConcept?.process||{}), steps:(s.renderingConcept?.process?.steps||[]).slice(0,-1) } } }))}>Remove Last</Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="services">
                        <AccordionTrigger>Services Section</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.renderingConcept?.services?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, renderingConcept:{ ...(s.renderingConcept||{}), services:{ ...(s.renderingConcept?.services||{}), heading:e.target.value } } }))} />
                            <Label className="mt-2 block">Section Paragraph</Label>
                            <Textarea rows={3} value={sections.renderingConcept?.services?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, renderingConcept:{ ...(s.renderingConcept||{}), services:{ ...(s.renderingConcept?.services||{}), paragraph:e.target.value } } }))} />
                            <div className="mt-3">
                              <h5 className="font-semibold mb-2">Service Cards</h5>
                              {(sections.renderingConcept?.services?.serviceCards||[]).map((card:any, idx:number)=> (
                                <div key={idx} className="border rounded p-3 mb-2">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <Label>Card Title</Label>
                                      <Input value={card.title||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.renderingConcept?.services?.serviceCards||[])]; arr[idx]={...arr[idx], title:e.target.value}; return { ...s, renderingConcept:{ ...(s.renderingConcept||{}), services:{ ...(s.renderingConcept?.services||{}), serviceCards:arr } } }; })} />
                                    </div>
                                    <div>
                                      <Label>Badge (optional)</Label>
                                      <Input value={card.badge||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.renderingConcept?.services?.serviceCards||[])]; arr[idx]={...arr[idx], badge:e.target.value}; return { ...s, renderingConcept:{ ...(s.renderingConcept||{}), services:{ ...(s.renderingConcept?.services||{}), serviceCards:arr } } }; })} />
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <Label>Description</Label>
                                    <Textarea rows={2} value={card.description||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.renderingConcept?.services?.serviceCards||[])]; arr[idx]={...arr[idx], description:e.target.value}; return { ...s, renderingConcept:{ ...(s.renderingConcept||{}), services:{ ...(s.renderingConcept?.services||{}), serviceCards:arr } } }; })} />
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                    <div>
                                      <Label>Starting From Text</Label>
                                      <Input value={card.startingFrom||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.renderingConcept?.services?.serviceCards||[])]; arr[idx]={...arr[idx], startingFrom:e.target.value}; return { ...s, renderingConcept:{ ...(s.renderingConcept||{}), services:{ ...(s.renderingConcept?.services||{}), serviceCards:arr } } }; })} />
                                    </div>
                                    <div>
                                      <Label>Price</Label>
                                      <Input value={card.price||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.renderingConcept?.services?.serviceCards||[])]; arr[idx]={...arr[idx], price:e.target.value}; return { ...s, renderingConcept:{ ...(s.renderingConcept||{}), services:{ ...(s.renderingConcept?.services||{}), serviceCards:arr } } }; })} />
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <Label>Features (one per line)</Label>
                                    <Textarea rows={3} value={(card.features||[]).join('\n')} onChange={(e)=>{ const features=e.target.value.split('\n').filter(f=>f.trim()); const arr=[...(s.renderingConcept?.services?.serviceCards||[])]; arr[idx]={...arr[idx], features}; setSections((s:any)=>({ ...s, renderingConcept:{ ...(s.renderingConcept||{}), services:{ ...(s.renderingConcept?.services||{}), serviceCards:arr } } })); }} />
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                    <div>
                                      <Label>Button Text</Label>
                                      <Input value={card.buttonText||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.renderingConcept?.services?.serviceCards||[])]; arr[idx]={...arr[idx], buttonText:e.target.value}; return { ...s, renderingConcept:{ ...(s.renderingConcept||{}), services:{ ...(s.renderingConcept?.services||{}), serviceCards:arr } } }; })} />
                                    </div>
                                    <div>
                                      <Label>Button Link</Label>
                                      <Input value={card.buttonLink||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.renderingConcept?.services?.serviceCards||[])]; arr[idx]={...arr[idx], buttonLink:e.target.value}; return { ...s, renderingConcept:{ ...(s.renderingConcept||{}), services:{ ...(s.renderingConcept?.services||{}), serviceCards:arr } } }; })} />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <div className="flex gap-2 mt-3">
                                <Button type="button" variant="outline" onClick={()=>{ const newCard={ title:'', description:'', startingFrom:'Starting from', price:'', features:[], buttonText:'Get Quote', buttonLink:'/quote', badge:'' }; setSections((s:any)=>({ ...s, renderingConcept:{ ...(s.renderingConcept||{}), services:{ ...(s.renderingConcept?.services||{}), serviceCards:[...(s.renderingConcept?.services?.serviceCards||[]), newCard] } } })); }}>Add Service Card</Button>
                                <Button type="button" variant="outline" onClick={()=>{ const arr=[...(sections.renderingConcept?.services?.serviceCards||[])]; if(arr.length>0){ arr.splice(-1,1); setSections((s:any)=>({ ...s, renderingConcept:{ ...(s.renderingConcept||{}), services:{ ...(s.renderingConcept?.services||{}), serviceCards:arr } } })); } }}>Remove Last Card</Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="cta">
                        <AccordionTrigger>Final CTA</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.renderingConcept?.cta?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, renderingConcept:{ ...(s.renderingConcept||{}), cta:{ ...(s.renderingConcept?.cta||{}), heading:e.target.value } } }))} />
                            <Label className="mt-2 block">Section Paragraph</Label>
                            <Textarea rows={3} value={sections.renderingConcept?.cta?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, renderingConcept:{ ...(s.renderingConcept||{}), cta:{ ...(s.renderingConcept?.cta||{}), paragraph:e.target.value } } }))} />
                            <div className="mt-3">
                              <h5 className="font-semibold mb-2">Buttons</h5>
                              {(sections.renderingConcept?.cta?.buttons||[]).map((button:any, idx:number)=> (
                                <div key={idx} className="border rounded p-3 mb-2">
                                  <Label>Button Text</Label>
                                  <Input value={button.text||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.renderingConcept?.cta?.buttons||[])]; arr[idx]={...arr[idx], text:e.target.value}; return { ...s, renderingConcept:{ ...(s.renderingConcept||{}), cta:{ ...(s.renderingConcept?.cta||{}), buttons:arr } } }; })} />
                                  <Label className="mt-2 block">Button Link</Label>
                                  <Input value={button.href||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.renderingConcept?.cta?.buttons||[])]; arr[idx]={...arr[idx], href:e.target.value}; return { ...s, renderingConcept:{ ...(s.renderingConcept||{}), cta:{ ...(s.renderingConcept?.cta||{}), buttons:arr } } }; })} />
                                </div>
                              ))}
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, renderingConcept:{ ...(s.renderingConcept||{}), cta:{ ...(s.renderingConcept?.cta||{}), buttons:[...(s.renderingConcept?.cta?.buttons||[]), { text:'', href:'' }] } } }))}>Add Button</Button>
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, renderingConcept:{ ...(s.renderingConcept||{}), cta:{ ...(s.renderingConcept?.cta||{}), buttons:(s.renderingConcept?.cta?.buttons||[]).slice(0,-1) } } }))}>Remove Last</Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ) : editingPath === '/trade-show-installation-and-dismantle' ? (
                  <div className="space-y-6">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="hero">
                        <AccordionTrigger>Hero Section</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.installationDismantle?.hero?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, installationDismantle:{ ...(s.installationDismantle||{}), hero:{ ...(s.installationDismantle?.hero||{}), heading:e.target.value } } }))} />
                            <Label className="mt-2 block">Section Description</Label>
                            <Textarea rows={3} value={sections.installationDismantle?.hero?.description||''} onChange={(e)=>setSections((s:any)=>({ ...s, installationDismantle:{ ...(s.installationDismantle||{}), hero:{ ...(s.installationDismantle?.hero||{}), description:e.target.value } } }))} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="whyChoose">
                        <AccordionTrigger>Why Choose Section</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.installationDismantle?.whyChoose?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, installationDismantle:{ ...(s.installationDismantle||{}), whyChoose:{ ...(s.installationDismantle?.whyChoose||{}), heading:e.target.value } } }))} />
                            <Label className="mt-2 block">Section Paragraph</Label>
                            <Textarea rows={3} value={sections.installationDismantle?.whyChoose?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, installationDismantle:{ ...(s.installationDismantle||{}), whyChoose:{ ...(s.installationDismantle?.whyChoose||{}), paragraph:e.target.value } } }))} />
                            <div className="mt-3">
                              <h5 className="font-semibold mb-2">Features</h5>
                              {(sections.installationDismantle?.whyChoose?.features||[]).map((feature:any, idx:number)=> (
                                <div key={idx} className="border rounded p-3 mb-2">
                                  <Label>Feature Heading</Label>
                                  <Input value={feature.heading||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.installationDismantle?.whyChoose?.features||[])]; arr[idx]={...arr[idx], heading:e.target.value}; return { ...s, installationDismantle:{ ...(s.installationDismantle||{}), whyChoose:{ ...(s.installationDismantle?.whyChoose||{}), features:arr } } }; })} />
                                  <Label className="mt-2 block">Feature Paragraph</Label>
                                  <Textarea rows={2} value={feature.paragraph||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.installationDismantle?.whyChoose?.features||[])]; arr[idx]={...arr[idx], paragraph:e.target.value}; return { ...s, installationDismantle:{ ...(s.installationDismantle||{}), whyChoose:{ ...(s.installationDismantle?.whyChoose||{}), features:arr } } }; })} />
                                </div>
                              ))}
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, installationDismantle:{ ...(s.installationDismantle||{}), whyChoose:{ ...(s.installationDismantle?.whyChoose||{}), features:[...(s.installationDismantle?.whyChoose?.features||[]), { heading:'', paragraph:'' }] } } }))}>Add Feature</Button>
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, installationDismantle:{ ...(s.installationDismantle||{}), whyChoose:{ ...(s.installationDismantle?.whyChoose||{}), features:(s.installationDismantle?.whyChoose?.features||[]).slice(0,-1) } } }))}>Remove Last</Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="process">
                        <AccordionTrigger>Process Section</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.installationDismantle?.process?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, installationDismantle:{ ...(s.installationDismantle||{}), process:{ ...(s.installationDismantle?.process||{}), heading:e.target.value } } }))} />
                            <Label className="mt-2 block">Section Paragraph</Label>
                            <Textarea rows={3} value={sections.installationDismantle?.process?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, installationDismantle:{ ...(s.installationDismantle||{}), process:{ ...(s.installationDismantle?.process||{}), paragraph:e.target.value } } }))} />
                            <div className="mt-3">
                              <h5 className="font-semibold mb-2">Process Steps</h5>
                              {(sections.installationDismantle?.process?.steps||[]).map((step:any, idx:number)=> (
                                <div key={idx} className="border rounded p-3 mb-2">
                                  <Label>Step Heading</Label>
                                  <Input value={step.heading||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.installationDismantle?.process?.steps||[])]; arr[idx]={...arr[idx], heading:e.target.value}; return { ...s, installationDismantle:{ ...(s.installationDismantle||{}), process:{ ...(s.installationDismantle?.process||{}), steps:arr } } }; })} />
                                  <Label className="mt-2 block">Step Paragraph</Label>
                                  <Textarea rows={2} value={step.paragraph||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.installationDismantle?.process?.steps||[])]; arr[idx]={...arr[idx], paragraph:e.target.value}; return { ...s, installationDismantle:{ ...(s.installationDismantle||{}), process:{ ...(s.installationDismantle?.process||{}), steps:arr } } }; })} />
                                </div>
                              ))}
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, installationDismantle:{ ...(s.installationDismantle||{}), process:{ ...(s.installationDismantle?.process||{}), steps:[...(s.installationDismantle?.process?.steps||[]), { heading:'', paragraph:'' }] } } }))}>Add Step</Button>
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, installationDismantle:{ ...(s.installationDismantle||{}), process:{ ...(s.installationDismantle?.process||{}), steps:(s.installationDismantle?.process?.steps||[]).slice(0,-1) } } }))}>Remove Last</Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="services">
                        <AccordionTrigger>Services Section</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.installationDismantle?.services?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, installationDismantle:{ ...(s.installationDismantle||{}), services:{ ...(s.installationDismantle?.services||{}), heading:e.target.value } } }))} />
                            <Label className="mt-2 block">Section Paragraph</Label>
                            <Textarea rows={3} value={sections.installationDismantle?.services?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, installationDismantle:{ ...(s.installationDismantle||{}), services:{ ...(s.installationDismantle?.services||{}), paragraph:e.target.value } } }))} />
                            <div className="mt-3">
                              <h5 className="font-semibold mb-2">Service Cards</h5>
                              {(sections.installationDismantle?.services?.serviceCards||[]).map((card:any, idx:number)=> (
                                <div key={idx} className="border rounded p-3 mb-2">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <Label>Card Title</Label>
                                      <Input value={card.title||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.installationDismantle?.services?.serviceCards||[])]; arr[idx]={...arr[idx], title:e.target.value}; return { ...s, installationDismantle:{ ...(s.installationDismantle||{}), services:{ ...(s.installationDismantle?.services||{}), serviceCards:arr } } }; })} />
                                    </div>
                                    <div>
                                      <Label>Badge (optional)</Label>
                                      <Input value={card.badge||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.installationDismantle?.services?.serviceCards||[])]; arr[idx]={...arr[idx], badge:e.target.value}; return { ...s, installationDismantle:{ ...(s.installationDismantle||{}), services:{ ...(s.installationDismantle?.services||{}), serviceCards:arr } } }; })} />
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <Label>Description</Label>
                                    <Textarea rows={2} value={card.description||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.installationDismantle?.services?.serviceCards||[])]; arr[idx]={...arr[idx], description:e.target.value}; return { ...s, installationDismantle:{ ...(s.installationDismantle||{}), services:{ ...(s.installationDismantle?.services||{}), serviceCards:arr } } }; })} />
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                    <div>
                                      <Label>Starting From Text</Label>
                                      <Input value={card.startingFrom||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.installationDismantle?.services?.serviceCards||[])]; arr[idx]={...arr[idx], startingFrom:e.target.value}; return { ...s, installationDismantle:{ ...(s.installationDismantle||{}), services:{ ...(s.installationDismantle?.services||{}), serviceCards:arr } } }; })} />
                                    </div>
                                    <div>
                                      <Label>Price</Label>
                                      <Input value={card.price||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.installationDismantle?.services?.serviceCards||[])]; arr[idx]={...arr[idx], price:e.target.value}; return { ...s, installationDismantle:{ ...(s.installationDismantle||{}), services:{ ...(s.installationDismantle?.services||{}), serviceCards:arr } } }; })} />
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <Label>Features (one per line)</Label>
                                    <Textarea rows={3} value={(card.features||[]).join('\n')} onChange={(e)=>{ const features=e.target.value.split('\n').filter(f=>f.trim()); const arr=[...(s.installationDismantle?.services?.serviceCards||[])]; arr[idx]={...arr[idx], features}; setSections((s:any)=>({ ...s, installationDismantle:{ ...(s.installationDismantle||{}), services:{ ...(s.installationDismantle?.services||{}), serviceCards:arr } } })); }} />
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                    <div>
                                      <Label>Button Text</Label>
                                      <Input value={card.buttonText||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.installationDismantle?.services?.serviceCards||[])]; arr[idx]={...arr[idx], buttonText:e.target.value}; return { ...s, installationDismantle:{ ...(s.installationDismantle||{}), services:{ ...(s.installationDismantle?.services||{}), serviceCards:arr } } }; })} />
                                    </div>
                                    <div>
                                      <Label>Button Link</Label>
                                      <Input value={card.buttonLink||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.installationDismantle?.services?.serviceCards||[])]; arr[idx]={...arr[idx], buttonLink:e.target.value}; return { ...s, installationDismantle:{ ...(s.installationDismantle||{}), services:{ ...(s.installationDismantle?.services||{}), serviceCards:arr } } }; })} />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <div className="flex gap-2 mt-3">
                                <Button type="button" variant="outline" onClick={()=>{ const newCard={ title:'', description:'', startingFrom:'Starting from', price:'', features:[], buttonText:'Get Quote', buttonLink:'/quote', badge:'' }; setSections((s:any)=>({ ...s, installationDismantle:{ ...(s.installationDismantle||{}), services:{ ...(s.installationDismantle?.services||{}), serviceCards:[...(s.installationDismantle?.services?.serviceCards||[]), newCard] } } })); }}>Add Service Card</Button>
                                <Button type="button" variant="outline" onClick={()=>{ const arr=[...(sections.installationDismantle?.services?.serviceCards||[])]; if(arr.length>0){ arr.splice(-1,1); setSections((s:any)=>({ ...s, installationDismantle:{ ...(s.installationDismantle||{}), services:{ ...(s.installationDismantle?.services||{}), serviceCards:arr } } })); } }}>Remove Last Card</Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="cta">
                        <AccordionTrigger>Final CTA</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.installationDismantle?.cta?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, installationDismantle:{ ...(s.installationDismantle||{}), cta:{ ...(s.installationDismantle?.cta||{}), heading:e.target.value } } }))} />
                            <Label className="mt-2 block">Section Paragraph</Label>
                            <Textarea rows={3} value={sections.installationDismantle?.cta?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, installationDismantle:{ ...(s.installationDismantle||{}), cta:{ ...(s.installationDismantle?.cta||{}), paragraph:e.target.value } } }))} />
                            <div className="mt-3">
                              <h5 className="font-semibold mb-2">Buttons</h5>
                              {(sections.installationDismantle?.cta?.buttons||[]).map((button:any, idx:number)=> (
                                <div key={idx} className="border rounded p-3 mb-2">
                                  <Label>Button Text</Label>
                                  <Input value={button.text||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.installationDismantle?.cta?.buttons||[])]; arr[idx]={...arr[idx], text:e.target.value}; return { ...s, installationDismantle:{ ...(s.installationDismantle||{}), cta:{ ...(s.installationDismantle?.cta||{}), buttons:arr } } }; })} />
                                  <Label className="mt-2 block">Button Link</Label>
                                  <Input value={button.href||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.installationDismantle?.cta?.buttons||[])]; arr[idx]={...arr[idx], href:e.target.value}; return { ...s, installationDismantle:{ ...(s.installationDismantle||{}), cta:{ ...(s.installationDismantle?.cta||{}), buttons:arr } } }; })} />
                                </div>
                              ))}
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, installationDismantle:{ ...(s.installationDismantle||{}), cta:{ ...(s.installationDismantle?.cta||{}), buttons:[...(s.installationDismantle?.cta?.buttons||[]), { text:'', href:'' }] } } }))}>Add Button</Button>
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, installationDismantle:{ ...(s.installationDismantle||{}), cta:{ ...(s.installationDismantle?.cta||{}), buttons:(s.installationDismantle?.cta?.buttons||[]).slice(0,-1) } } }))}>Remove Last</Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ) : editingPath === '/trade-show-project-management' ? (
                  <div className="space-y-6">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="hero">
                        <AccordionTrigger>Hero Section</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.projectManagement?.hero?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, projectManagement:{ ...(s.projectManagement||{}), hero:{ ...(s.projectManagement?.hero||{}), heading:e.target.value } } }))} />
                            <Label className="mt-2 block">Section Description</Label>
                            <Textarea rows={3} value={sections.projectManagement?.hero?.description||''} onChange={(e)=>setSections((s:any)=>({ ...s, projectManagement:{ ...(s.projectManagement||{}), hero:{ ...(s.projectManagement?.hero||{}), description:e.target.value } } }))} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="whyChoose">
                        <AccordionTrigger>Why Choose Section</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.projectManagement?.whyChoose?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, projectManagement:{ ...(s.projectManagement||{}), whyChoose:{ ...(s.projectManagement?.whyChoose||{}), heading:e.target.value } } }))} />
                            <Label className="mt-2 block">Section Paragraph</Label>
                            <Textarea rows={3} value={sections.projectManagement?.whyChoose?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, projectManagement:{ ...(s.projectManagement||{}), whyChoose:{ ...(s.projectManagement?.whyChoose||{}), paragraph:e.target.value } } }))} />
                            <div className="mt-3">
                              <h5 className="font-semibold mb-2">Features</h5>
                              {(sections.projectManagement?.whyChoose?.features||[]).map((feature:any, idx:number)=> (
                                <div key={idx} className="border rounded p-3 mb-2">
                                  <Label>Feature Heading</Label>
                                  <Input value={feature.heading||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.projectManagement?.whyChoose?.features||[])]; arr[idx]={...arr[idx], heading:e.target.value}; return { ...s, projectManagement:{ ...(s.projectManagement||{}), whyChoose:{ ...(s.projectManagement?.whyChoose||{}), features:arr } } }; })} />
                                  <Label className="mt-2 block">Feature Paragraph</Label>
                                  <Textarea rows={2} value={feature.paragraph||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.projectManagement?.whyChoose?.features||[])]; arr[idx]={...arr[idx], paragraph:e.target.value}; return { ...s, projectManagement:{ ...(s.projectManagement||{}), whyChoose:{ ...(s.projectManagement?.whyChoose||{}), features:arr } } }; })} />
                                </div>
                              ))}
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, projectManagement:{ ...(s.projectManagement||{}), whyChoose:{ ...(s.projectManagement?.whyChoose||{}), features:[...(s.projectManagement?.whyChoose?.features||[]), { heading:'', paragraph:'' }] } } }))}>Add Feature</Button>
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, projectManagement:{ ...(s.projectManagement||{}), whyChoose:{ ...(s.projectManagement?.whyChoose||{}), features:(s.projectManagement?.whyChoose?.features||[]).slice(0,-1) } } }))}>Remove Last</Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="process">
                        <AccordionTrigger>Process Section</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.projectManagement?.process?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, projectManagement:{ ...(s.projectManagement||{}), process:{ ...(s.projectManagement?.process||{}), heading:e.target.value } } }))} />
                            <Label className="mt-2 block">Section Paragraph</Label>
                            <Textarea rows={3} value={sections.projectManagement?.process?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, projectManagement:{ ...(s.projectManagement||{}), process:{ ...(s.projectManagement?.process||{}), paragraph:e.target.value } } }))} />
                            <div className="mt-3">
                              <h5 className="font-semibold mb-2">Process Steps</h5>
                              {(sections.projectManagement?.process?.steps||[]).map((step:any, idx:number)=> (
                                <div key={idx} className="border rounded p-3 mb-2">
                                  <Label>Step Heading</Label>
                                  <Input value={step.heading||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.projectManagement?.process?.steps||[])]; arr[idx]={...arr[idx], heading:e.target.value}; return { ...s, projectManagement:{ ...(s.projectManagement||{}), process:{ ...(s.projectManagement?.process||{}), steps:arr } } }; })} />
                                  <Label className="mt-2 block">Step Paragraph</Label>
                                  <Textarea rows={2} value={step.paragraph||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.projectManagement?.process?.steps||[])]; arr[idx]={...arr[idx], paragraph:e.target.value}; return { ...s, projectManagement:{ ...(s.projectManagement||{}), process:{ ...(s.projectManagement?.process||{}), steps:arr } } }; })} />
                                </div>
                              ))}
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, projectManagement:{ ...(s.projectManagement||{}), process:{ ...(s.projectManagement?.process||{}), steps:[...(s.projectManagement?.process?.steps||[]), { heading:'', paragraph:'' }] } } }))}>Add Step</Button>
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, projectManagement:{ ...(s.projectManagement||{}), process:{ ...(s.projectManagement?.process||{}), steps:(s.projectManagement?.process?.steps||[]).slice(0,-1) } } }))}>Remove Last</Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="services">
                        <AccordionTrigger>Services Section</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.projectManagement?.services?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, projectManagement:{ ...(s.projectManagement||{}), services:{ ...(s.projectManagement?.services||{}), heading:e.target.value } } }))} />
                            <Label className="mt-2 block">Section Paragraph</Label>
                            <Textarea rows={3} value={sections.projectManagement?.services?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, projectManagement:{ ...(s.projectManagement||{}), services:{ ...(s.projectManagement?.services||{}), paragraph:e.target.value } } }))} />
                            <div className="mt-3">
                              <h5 className="font-semibold mb-2">Service Cards</h5>
                              {(sections.projectManagement?.services?.serviceCards||[]).map((card:any, idx:number)=> (
                                <div key={idx} className="border rounded p-3 mb-2">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <Label>Card Title</Label>
                                      <Input value={card.title||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.projectManagement?.services?.serviceCards||[])]; arr[idx]={...arr[idx], title:e.target.value}; return { ...s, projectManagement:{ ...(s.projectManagement||{}), services:{ ...(s.projectManagement?.services||{}), serviceCards:arr } } }; })} />
                                    </div>
                                    <div>
                                      <Label>Badge (optional)</Label>
                                      <Input value={card.badge||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.projectManagement?.services?.serviceCards||[])]; arr[idx]={...arr[idx], badge:e.target.value}; return { ...s, projectManagement:{ ...(s.projectManagement||{}), services:{ ...(s.projectManagement?.services||{}), serviceCards:arr } } }; })} />
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <Label>Description</Label>
                                    <Textarea rows={2} value={card.description||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.projectManagement?.services?.serviceCards||[])]; arr[idx]={...arr[idx], description:e.target.value}; return { ...s, projectManagement:{ ...(s.projectManagement||{}), services:{ ...(s.projectManagement?.services||{}), serviceCards:arr } } }; })} />
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                    <div>
                                      <Label>Starting From Text</Label>
                                      <Input value={card.startingFrom||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.projectManagement?.services?.serviceCards||[])]; arr[idx]={...arr[idx], startingFrom:e.target.value}; return { ...s, projectManagement:{ ...(s.projectManagement||{}), services:{ ...(s.projectManagement?.services||{}), serviceCards:arr } } }; })} />
                                    </div>
                                    <div>
                                      <Label>Price</Label>
                                      <Input value={card.price||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.projectManagement?.services?.serviceCards||[])]; arr[idx]={...arr[idx], price:e.target.value}; return { ...s, projectManagement:{ ...(s.projectManagement||{}), services:{ ...(s.projectManagement?.services||{}), serviceCards:arr } } }; })} />
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <Label>Features (one per line)</Label>
                                    <Textarea rows={3} value={(card.features||[]).join('\n')} onChange={(e)=>{ const features=e.target.value.split('\n').filter(f=>f.trim()); const arr=[...(s.projectManagement?.services?.serviceCards||[])]; arr[idx]={...arr[idx], features}; setSections((s:any)=>({ ...s, projectManagement:{ ...(s.projectManagement||{}), services:{ ...(s.projectManagement?.services||{}), serviceCards:arr } } })); }} />
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                    <div>
                                      <Label>Button Text</Label>
                                      <Input value={card.buttonText||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.projectManagement?.services?.serviceCards||[])]; arr[idx]={...arr[idx], buttonText:e.target.value}; return { ...s, projectManagement:{ ...(s.projectManagement||{}), services:{ ...(s.projectManagement?.services||{}), serviceCards:arr } } }; })} />
                                    </div>
                                    <div>
                                      <Label>Button Link</Label>
                                      <Input value={card.buttonLink||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.projectManagement?.services?.serviceCards||[])]; arr[idx]={...arr[idx], buttonLink:e.target.value}; return { ...s, projectManagement:{ ...(s.projectManagement||{}), services:{ ...(s.projectManagement?.services||{}), serviceCards:arr } } }; })} />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <div className="flex gap-2 mt-3">
                                <Button type="button" variant="outline" onClick={()=>{ const newCard={ title:'', description:'', startingFrom:'Starting from', price:'', features:[], buttonText:'Get Quote', buttonLink:'/quote', badge:'' }; setSections((s:any)=>({ ...s, projectManagement:{ ...(s.projectManagement||{}), services:{ ...(s.projectManagement?.services||{}), serviceCards:[...(s.projectManagement?.services?.serviceCards||[]), newCard] } } })); }}>Add Service Card</Button>
                                <Button type="button" variant="outline" onClick={()=>{ const arr=[...(sections.projectManagement?.services?.serviceCards||[])]; if(arr.length>0){ arr.splice(-1,1); setSections((s:any)=>({ ...s, projectManagement:{ ...(s.projectManagement||{}), services:{ ...(s.projectManagement?.services||{}), serviceCards:arr } } })); } }}>Remove Last Card</Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="cta">
                        <AccordionTrigger>Final CTA</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 bg-white border rounded-md p-3">
                            <Label>Section Heading</Label>
                            <Input value={sections.projectManagement?.cta?.heading||''} onChange={(e)=>setSections((s:any)=>({ ...s, projectManagement:{ ...(s.projectManagement||{}), cta:{ ...(s.projectManagement?.cta||{}), heading:e.target.value } } }))} />
                            <Label className="mt-2 block">Section Paragraph</Label>
                            <Textarea rows={3} value={sections.projectManagement?.cta?.paragraph||''} onChange={(e)=>setSections((s:any)=>({ ...s, projectManagement:{ ...(s.projectManagement||{}), cta:{ ...(s.projectManagement?.cta||{}), paragraph:e.target.value } } }))} />
                            <div className="mt-3">
                              <h5 className="font-semibold mb-2">Buttons</h5>
                              {(sections.projectManagement?.cta?.buttons||[]).map((button:any, idx:number)=> (
                                <div key={idx} className="border rounded p-3 mb-2">
                                  <Label>Button Text</Label>
                                  <Input value={button.text||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.projectManagement?.cta?.buttons||[])]; arr[idx]={...arr[idx], text:e.target.value}; return { ...s, projectManagement:{ ...(s.projectManagement||{}), cta:{ ...(s.projectManagement?.cta||{}), buttons:arr } } }; })} />
                                  <Label className="mt-2 block">Button Link</Label>
                                  <Input value={button.href||''} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.projectManagement?.cta?.buttons||[])]; arr[idx]={...arr[idx], href:e.target.value}; return { ...s, projectManagement:{ ...(s.projectManagement||{}), cta:{ ...(s.projectManagement?.cta||{}), buttons:arr } } }; })} />
                                </div>
                              ))}
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, projectManagement:{ ...(s.projectManagement||{}), cta:{ ...(s.projectManagement?.cta||{}), buttons:[...(s.projectManagement?.cta?.buttons||[]), { text:'', href:'' }] } } }))}>Add Button</Button>
                                <Button type="button" variant="outline" onClick={()=>setSections((s:any)=>({ ...s, projectManagement:{ ...(s.projectManagement||{}), cta:{ ...(s.projectManagement?.cta||{}), buttons:(s.projectManagement?.cta?.buttons||[]).slice(0,-1) } } }))}>Remove Last</Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ) : null}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setEditingPath(null)}>Cancel</Button>
                <Button onClick={saveChanges} disabled={isSaving}>{isSaving ? 'Saving…' : 'Save Changes'}</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}


