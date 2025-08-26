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

// Simple WYSIWYG using contentEditable to avoid adding new deps here.
// Can be swapped with TipTap/Editor.js later without changing API contract.

type PageItem = {
  title: string;
  path: string;
  type: 'static' | 'country' | 'city';
};

export default function MasterPagesEditor() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState<string>('');
  const [h1, setH1] = useState('');
  const [rawHtml, setRawHtml] = useState('');
  const [structured, setStructured] = useState<any>(null);
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
    setSeoTitle(''); setSeoDescription(''); setSeoKeywords(''); setH1(''); setRawHtml(''); setStructured(null);
    try {
      const savedRes = await fetch(`/api/admin/pages-editor?action=get-content&path=${encodeURIComponent(path)}`, { cache: 'no-store' });
      const saved = await savedRes.json();
      if (saved?.success && saved?.data) {
        const pc = saved.data;
        setSeoTitle(pc?.seo?.metaTitle || '');
        setSeoDescription(pc?.seo?.metaDescription || '');
        setSeoKeywords((pc?.seo?.keywords || []).join(', '));
        setH1(pc?.hero?.title || '');
        setRawHtml(pc?.content?.extra?.rawHtml || pc?.content?.introduction || '');
        setStructured(pc?.content?.extra?.structured || null);
        return;
      }
      // Fallback: fetch page and seed editor with body text
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
      const body = doc.querySelector('body');
      setRawHtml(body ? body.innerHTML : '');
    } catch (e) {
      console.error('Failed to load editor data', e);
    }
  };

  const saveChanges = async () => {
    if (!editingPath) return;
    try {
      const res = await fetch('/api/admin/pages-editor', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          path: editingPath,
          seo: {
            title: seoTitle,
            description: seoDescription,
            keywords: seoKeywords.split(',').map((k) => k.trim()).filter(Boolean),
          },
          h1,
          contentHtml: rawHtml,
          structured,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Update failed');
      // Revalidate + dispatch client event
      await fetch('/api/revalidate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: editingPath }) });
      try { window.dispatchEvent(new CustomEvent('global-pages:updated', { detail: { pageId: editingPath.split('/').filter(Boolean).slice(1).join('-') || 'home' } })); } catch {}
      toast({ title: 'Saved', description: 'Page updated successfully.' });
      setEditingPath(null);
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Save Failed', description: e.message || 'Could not save.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Navigation />
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Master Pages Editor</h1>
              <p className="text-gray-600">Manage SEO and content for all site pages.</p>
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
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
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
                  <div className="mt-4">
                    <Label>H1 (Main Heading)</Label>
                    <Input value={h1} onChange={(e) => setH1(e.target.value)} placeholder="Main page heading" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Content Editor (WYSIWYG)</h3>
                  <div className="flex gap-2 text-sm">
                    <Button variant="outline" size="sm" onClick={() => document.execCommand('bold')}>Bold</Button>
                    <Button variant="outline" size="sm" onClick={() => document.execCommand('italic')}>Italic</Button>
                    <Button variant="outline" size="sm" onClick={() => document.execCommand('underline')}>Underline</Button>
                    <Button variant="outline" size="sm" onClick={() => document.execCommand('insertUnorderedList')}>• List</Button>
                    <Button variant="outline" size="sm" onClick={() => document.execCommand('insertOrderedList')}>1. List</Button>
                    <Button variant="outline" size="sm" onClick={() => document.execCommand('formatBlock', false, 'H2')}>H2</Button>
                    <Button variant="outline" size="sm" onClick={() => document.execCommand('formatBlock', false, 'H3')}>H3</Button>
                    <Button variant="outline" size="sm" onClick={() => document.execCommand('formatBlock', false, 'H4')}>H4</Button>
                    <Button variant="outline" size="sm" onClick={() => { const url = prompt('Enter URL'); if (url) document.execCommand('createLink', false, url); }}>Link</Button>
                  </div>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    className="min-h-[240px] border rounded-md p-3 prose max-w-none"
                    onInput={(e) => setRawHtml((e.target as HTMLElement).innerHTML)}
                    dangerouslySetInnerHTML={{ __html: rawHtml }}
                  />
                  <div>
                    <Label>Structured JSON (optional)</Label>
                    <Textarea rows={6} value={structured ? JSON.stringify(structured, null, 2) : ''} onChange={(e) => {
                      try { setStructured(JSON.parse(e.target.value)); } catch { setStructured(e.target.value as any); }
                    }} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setEditingPath(null)}>Cancel</Button>
                <Button onClick={saveChanges}>Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}


