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
    hero: { heading: '', description: '', buttonText: '' },
    mission: { heading: '', paragraph: '' },
    team: { heading: '', paragraph: '' },
    cta: { heading: '', buttonText: '' },
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
        setH1(pc?.hero?.title || '');
        // Load sections if present
        if (pc?.sections) {
          setSections({
            hero: { heading: pc.sections.hero?.heading || pc.hero?.title || '', description: pc.sections.hero?.description || pc.hero?.description || '', buttonText: pc.sections.hero?.buttonText || pc.hero?.ctaText || '' },
            mission: { heading: pc.sections.mission?.heading || 'Our Mission', paragraph: pc.sections.mission?.paragraph || '' },
            team: { heading: pc.sections.team?.heading || 'Meet Our Team', paragraph: pc.sections.team?.paragraph || '' },
            cta: { heading: pc.sections.cta?.heading || 'Ready to Transform Your Exhibition Experience?', buttonText: pc.sections.cta?.buttonText || 'Get Started Today' },
          });
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
          sections: editingPath === '/about' ? undefined : {
            hero: {
              heading: sections.hero?.heading || h1,
              description: sections.hero?.description,
              buttonText: sections.hero?.buttonText,
            },
            mission: sections.mission,
            team: sections.team,
            cta: sections.cta,
          },
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

                  <h3 className="font-semibold mt-4">Content</h3>
                  <div>
                    <Label>H1 (Main Heading)</Label>
                    <Input value={h1} onChange={(e) => setH1(e.target.value)} placeholder="Main page heading" />
                  </div>
                  {/* For /about keep the editor simple and organized; other pages may show extra fields */}
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Detected Page Content (Editable)</h3>
                  <div className="border rounded-md max-h-[50vh] overflow-auto p-3 bg-gray-50 space-y-3">
                    {pageMap.slice(0, 200).map((s, idx) => (
                      <div key={idx} className="bg-white rounded-md p-3 border">
                        <div className="flex items-center gap-2 mb-2">
                          <Label className="text-xs text-gray-500">Type</Label>
                          <select
                            className="text-sm border rounded px-2 py-1"
                            value={s.tag}
                            onChange={(e) => {
                              const v = e.target.value;
                              setPageMap((prev) => prev.map((it, i) => i === idx ? { ...it, tag: v } : it));
                            }}
                          >
                            <option value="h1">H1</option>
                            <option value="h2">H2</option>
                            <option value="h3">H3</option>
                            <option value="h4">H4</option>
                            <option value="p">Paragraph</option>
                            <option value="li">List Item</option>
                          </select>
                        </div>
                        {/* Inline toolbar for paragraph blocks */}
                        {s.tag === 'p' && (
                          <div className="flex items-center gap-2 mb-2">
                            <Button variant="outline" size="sm" onClick={() => {
                              const text = prompt('Text to make bold in this paragraph?');
                              if (!text) return;
                              setPageMap(prev => prev.map((it, i) => {
                                if (i !== idx) return it;
                                const replaced = it.text.replace(text, `<strong>${text}</strong>`);
                                return { ...it, text: replaced };
                              }));
                            }}>Bold</Button>
                            <Button variant="outline" size="sm" onClick={() => {
                              const anchor = prompt('Text to hyperlink?');
                              if (!anchor) return;
                              const url = prompt('URL to link to (https://...)');
                              if (!url) return;
                              setPageMap(prev => prev.map((it, i) => {
                                if (i !== idx) return it;
                                const replaced = it.text.replace(anchor, `<a href="${url}">${anchor}</a>`);
                                return { ...it, text: replaced };
                              }));
                            }}>Link</Button>
                          </div>
                        )}
                        <Textarea
                          rows={3}
                          value={s.text}
                          onChange={(e) => {
                            const v = e.target.value;
                            setPageMap((prev) => prev.map((it, i) => i === idx ? { ...it, text: v } : it));
                          }}
                        />
                      </div>
                    ))}
                    {pageMap.length === 0 && (
                      <div className="text-gray-500 text-sm">No content detected yet.</div>
                    )}
                  </div>
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


