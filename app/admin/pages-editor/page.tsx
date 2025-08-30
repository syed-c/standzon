'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
            { text: 'Browse Designers', href: '/builders' }
          ]
        },
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
            setSections((prev:any) => ({
              ...prev,
              hero: pc.sections.hero || prev.hero,
              whyChooseCustom: pc.sections.whyChooseCustom || prev.whyChooseCustom,
              designProcess: pc.sections.designProcess || prev.designProcess,
              customDesignServices: pc.sections.customDesignServices || prev.customDesignServices,
              customBoothCta: pc.sections.customBoothCta || prev.customBoothCta,
            }));
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

      toast({ title: 'Updated', description: 'Page updated successfully and revalidated.' });
      setEditingPath(null);
    } catch (e: any) {
      console.error(e);
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
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Edit Page</h2>
                <Button variant="outline" onClick={() => setEditingPath(null)}>Close</Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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


