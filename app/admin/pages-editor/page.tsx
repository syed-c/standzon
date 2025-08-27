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
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState<string>('');
  const [h1, setH1] = useState('');
  const [pageMap, setPageMap] = useState<Array<{ tag: string; text: string }>>([]);
  // Section-aware state
  const [sections, setSections] = useState<any>({
    // Common
    hero: { heading: '', description: '' },
    cta: { heading: 'Ready to Transform Your Exhibition Experience?', paragraph: '', buttons: [ { text: 'Get Started Today', href: '/contact' }, { text: 'Browse Contractors', href: '/exhibition-stands' } ] },
    // About
    mission: { heading: '', paragraph: '' },
    vision: { heading: '', paragraph: '' },
    coreValues: [
      { heading: 'Trust & Reliability', paragraph: '' },
      { heading: 'Global Reach', paragraph: '' },
      { heading: 'Efficiency', paragraph: '' },
      { heading: 'Partnership', paragraph: '' },
    ],
    howItWorks: [
      { heading: 'Submit Your Requirements', paragraph: '' },
      { heading: 'Receive Matched Proposals', paragraph: '' },
      { heading: 'Compare & Choose', paragraph: '' },
      { heading: 'Project Success', paragraph: '' },
    ],
    team: [
      { name: 'Marcus Weber', role: 'Founder & CEO', bio: '' },
      { name: 'Sarah Chen', role: 'Head of Operations', bio: '' },
      { name: 'David Rodriguez', role: 'Technical Director', bio: '' },
      { name: 'Emma Thompson', role: 'Client Success Manager', bio: '' },
    ],
    // Home specific
    heroButtons: [ { text: 'Get Free Quote →', href: '/quote' }, { text: 'Global Venues', href: '/exhibition-stands' }, { text: 'Find Builders', href: '/builders' } ],
    // Leads intro (separate from CTA)
    leadsIntro: { heading: 'Live Lead Activity', paragraph: 'Real exhibition stand requests from clients worldwide' },
    // Leads CTA block
    readyLeads: { heading: 'Ready to Access These Leads?', paragraph: 'Join our platform as a verified builder and start receiving qualified leads like these' },
    globalPresence: { heading: 'Global Presence, Local Expertise', paragraph: 'With operations spanning five continents, we deliver world-class exhibition solutions while maintaining deep local market knowledge and cultural understanding.' },
    moreCountries: { heading: 'More Countries in {country}', paragraph: 'Discover exhibition stand builders across all major markets in this region. Click on any country to explore local professionals and get instant quotes.' },
    expandingMarkets: { heading: 'Expanding to New Markets?', paragraph: "We're continuously growing our global network. If you don't see your location listed, contact us to discuss how we can support your exhibition needs." },
    readyStart: { heading: 'Ready to Get Started?', paragraph: 'Connect with verified exhibition stand builders in your target location. Get multiple competitive quotes without creating an account.' },
    clientSay: { heading: 'What Our Clients Say', paragraph: 'Join thousands of satisfied clients who found their perfect exhibition stand builders through our platform' },
    reviews: [
      { name: '', role: '', rating: 5, text: '', image: '' },
    ],
    finalCta: { heading: "Let's Create Something Extraordinary", paragraph: 'Ready to transform your exhibition presence? Get a personalized quote and discover how we can bring your vision to life.', buttons: [ { text: 'Get Free Quotes Now', href: '/quote' } ] },
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
    try {
      // 1) Try loading saved content first
      const savedRes = await fetch(`/api/admin/pages-editor?action=get-content&path=${encodeURIComponent(path)}`, { cache: 'no-store' });
      const saved = await savedRes.json();
      if (saved?.success && saved?.data) {
        const pc = saved.data;
        setSeoTitle(pc?.seo?.metaTitle || '');
        setSeoDescription(pc?.seo?.metaDescription || '');
        setSeoKeywords((pc?.seo?.keywords || []).join(', '));
        setH1(pc?.sections?.hero?.heading || pc?.hero?.title || '');
        // Load sections if present
        if (pc?.sections) setSections((prev:any)=>({ ...prev, ...pc.sections }));
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
            // For /about, organize blocks into page order for cleaner editing
            if (path === '/about') {
              const organized: Array<{ tag: string; text: string }> = [];
              const firstH1Idx = sections.findIndex(s => s.tag === 'h1');
              if (firstH1Idx >= 0) organized.push(sections[firstH1Idx]);
              const firstParaAfterH1Idx = sections.findIndex((s, i) => i > firstH1Idx && s.tag === 'p');
              if (firstParaAfterH1Idx >= 0) organized.push(sections[firstParaAfterH1Idx]);
              const missionH2Idx = sections.findIndex(s => s.tag === 'h2' && /mission/i.test(s.text));
              if (missionH2Idx >= 0) organized.push(sections[missionH2Idx]);
              const missionParaIdx = sections.findIndex((s, i) => i > missionH2Idx && s.tag === 'p');
              if (missionParaIdx >= 0) organized.push(sections[missionParaIdx]);
              // Append remaining unique blocks (avoid duplicates)
              sections.forEach(s => {
                if (!organized.includes(s)) organized.push(s);
              });
              setPageMap(organized);
            } else {
              setPageMap(sections);
            }
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
      // Enforce single H1 for /about by converting subsequent H1s to H2s
      const normalizedMap = editingPath === '/about' ? (() => {
        let seenH1 = false;
        return pageMap.map((s) => {
          if (s.tag.toLowerCase() === 'h1') {
            if (seenH1) return { ...s, tag: 'h2' };
            seenH1 = true;
          }
          return s;
        });
      })() : pageMap;

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

                {/* Right column: Home or About editors */}
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
                  ) : (
                    <>
                      <h3 className="font-semibold">About Page Sections</h3>
                      <div className="bg-white border rounded-md p-3">
                        <h4 className="font-semibold mb-2">1) Hero</h4>
                        <Label>H1</Label>
                        <Input value={sections.hero.heading} onChange={(e)=>setSections((s:any)=>({ ...s, hero:{...s.hero, heading:e.target.value} }))} />
                        <Label className="mt-2 block">Description (Paragraph)</Label>
                        <Textarea rows={3} value={sections.hero.description} onChange={(e)=>setSections((s:any)=>({ ...s, hero:{...s.hero, description:e.target.value} }))} />
                      </div>
                      <div className="bg-white border rounded-md p-3">
                        <h4 className="font-semibold mb-2">2) Mission</h4>
                        <Label>H2</Label>
                        <Input value={sections.mission.heading} onChange={(e)=>setSections((s:any)=>({ ...s, mission:{...s.mission, heading:e.target.value} }))} />
                        <Label className="mt-2 block">Paragraph</Label>
                        <Textarea rows={4} value={sections.mission.paragraph} onChange={(e)=>setSections((s:any)=>({ ...s, mission:{...s.mission, paragraph:e.target.value} }))} />
                      </div>
                      <div className="bg-white border rounded-md p-3">
                        <h4 className="font-semibold mb-2">3) Vision</h4>
                        <Label>H2</Label>
                        <Input value={sections.vision.heading} onChange={(e)=>setSections((s:any)=>({ ...s, vision:{...s.vision, heading:e.target.value} }))} />
                        <Label className="mt-2 block">Paragraph</Label>
                        <Textarea rows={3} value={sections.vision.paragraph} onChange={(e)=>setSections((s:any)=>({ ...s, vision:{...s.vision, paragraph:e.target.value} }))} />
                      </div>
                      <div className="bg-white border rounded-md p-3">
                        <h4 className="font-semibold mb-2">4) Core Values</h4>
                        {sections.coreValues.map((item:any, idx:number)=> (
                          <div key={idx} className="border rounded p-3 mb-3">
                            <Label>H3</Label>
                            <Input value={item.heading} onChange={(e)=>setSections((s:any)=>{ const arr=[...s.coreValues]; arr[idx]={...arr[idx], heading:e.target.value}; return { ...s, coreValues:arr }; })} />
                            <Label className="mt-2 block">Paragraph</Label>
                            <Textarea rows={3} value={item.paragraph} onChange={(e)=>setSections((s:any)=>{ const arr=[...s.coreValues]; arr[idx]={...arr[idx], paragraph:e.target.value}; return { ...s, coreValues:arr }; })} />
                          </div>
                        ))}
                      </div>
                      <div className="bg-white border rounded-md p-3">
                        <h4 className="font-semibold mb-2">5) How It Works</h4>
                        {sections.howItWorks.map((item:any, idx:number)=> (
                          <div key={idx} className="border rounded p-3 mb-3">
                            <Label>H3</Label>
                            <Input value={item.heading} onChange={(e)=>setSections((s:any)=>{ const arr=[...s.howItWorks]; arr[idx]={...arr[idx], heading:e.target.value}; return { ...s, howItWorks:arr }; })} />
                            <Label className="mt-2 block">Paragraph</Label>
                            <Textarea rows={3} value={item.paragraph} onChange={(e)=>setSections((s:any)=>{ const arr=[...s.howItWorks]; arr[idx]={...arr[idx], paragraph:e.target.value}; return { ...s, howItWorks:arr }; })} />
                          </div>
                        ))}
                      </div>
                      <div className="bg-white border rounded-md p-3">
                        <h4 className="font-semibold mb-2">6) Meet Our Team</h4>
                        {sections.team.map((m:any, idx:number)=> (
                          <div key={idx} className="border rounded p-3 mb-3">
                            <Label>H3 (Name)</Label>
                            <Input value={m.name} onChange={(e)=>setSections((s:any)=>{ const arr=[...s.team]; arr[idx]={...arr[idx], name:e.target.value}; return { ...s, team:arr }; })} />
                            <Label className="mt-2 block">H4 (Role)</Label>
                            <Input value={m.role} onChange={(e)=>setSections((s:any)=>{ const arr=[...s.team]; arr[idx]={...arr[idx], role:e.target.value}; return { ...s, team:arr }; })} />
                            <Label className="mt-2 block">Paragraph (Bio)</Label>
                            <Textarea rows={3} value={m.bio} onChange={(e)=>setSections((s:any)=>{ const arr=[...s.team]; arr[idx]={...arr[idx], bio:e.target.value}; return { ...s, team:arr }; })} />
                          </div>
                        ))}
                      </div>
                      <div className="bg-white border rounded-md p-3">
                        <h4 className="font-semibold mb-2">7) CTA</h4>
                        <Label>H2</Label>
                        <Input value={sections.cta.heading} onChange={(e)=>setSections((s:any)=>({ ...s, cta:{...s.cta, heading:e.target.value} }))} />
                        <Label className="mt-2 block">Paragraph</Label>
                        <Textarea rows={3} value={sections.cta.paragraph} onChange={(e)=>setSections((s:any)=>({ ...s, cta:{...s.cta, paragraph:e.target.value} }))} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                          {sections.cta.buttons?.map((b:any, idx:number)=> (
                            <div key={idx} className="border rounded p-3">
                              <Label>Button Text</Label>
                              <Input value={b.text} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.cta.buttons||[])]; arr[idx]={...arr[idx], text:e.target.value}; return { ...s, cta:{...s.cta, buttons:arr} }; })} />
                              <Label className="mt-2 block">Button Link</Label>
                              <Input value={b.href} onChange={(e)=>setSections((s:any)=>{ const arr=[...(s.cta.buttons||[])]; arr[idx]={...arr[idx], href:e.target.value}; return { ...s, cta:{...s.cta, buttons:arr} }; })} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
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


