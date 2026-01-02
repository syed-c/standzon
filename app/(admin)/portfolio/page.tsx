'use client';

import React, { useEffect, useState } from 'react';
import AuthBoundary from '@/components/client/AuthBoundary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import { Textarea } from '@/components/shared/textarea';
import { Label } from '@/components/shared/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/select';

export default function AdminPortfolio() {
  console.log(' AdminPortfolio component rendered');
  
  const { toast } = useToast();

  // Country and City options state
  const [countryOptions, setCountryOptions] = useState<Array<{ slug: string; name: string }>>([]);
  const [cityOptionsByCountry, setCityOptionsByCountry] = useState<Record<string, Array<{ slug: string; name: string }>>>({});
  
  // Log when country options change
  useEffect(() => {
    // Remove console.log statements to prevent potential infinite loops
  }, [countryOptions]);
  
  // Log when city options change
  useEffect(() => {
    // Remove console.log statements to prevent potential infinite loops
  }, [cityOptionsByCountry]);
  
  // Country Gallery Editors state
  const [selectedCountryForGallery, setSelectedCountryForGallery] = useState<string>('');
  const [countryGalleryText, setCountryGalleryText] = useState<string>('');
  const [loadingCountryGallery, setLoadingCountryGallery] = useState<boolean>(false);
  const [savingCountryGallery, setSavingCountryGallery] = useState<boolean>(false);

  // City Gallery Editors state
  const [selectedCountryForCityGallery, setSelectedCountryForCityGallery] = useState<string>('');
  const [selectedCityForGallery, setSelectedCityForGallery] = useState<string>('');
  const [cityGalleryText, setCityGalleryText] = useState<string>('');
  const [loadingCityGallery, setLoadingCityGallery] = useState<boolean>(false);
  const [savingCityGallery, setSavingCityGallery] = useState<boolean>(false);

  // Load country/city options from page_contents table
  useEffect(() => {
    let isMounted = true;
    
    (async () => {
      try {
        // Fetch all location data from our API endpoint
        const response = await fetch('/api/admin/portfolio/locations');
        
        if (!response.ok) {
          const errorText = await response.text();
          if (isMounted) {
            toast({ 
              title: 'Error', 
              description: `Failed to fetch location data: ${response.status} ${response.statusText}`, 
              variant: 'destructive' 
            });
          }
          return;
        }

        const result = await response.json();
        
        if (!result.success) {
          if (isMounted) {
            toast({ 
              title: 'Error', 
              description: `Failed to fetch location data: ${result.error}`, 
              variant: 'destructive' 
            });
          }
          return;
        }

        // Add a small delay to ensure state updates properly
        setTimeout(() => {
          if (isMounted) {
            setCountryOptions(result.countries);
            setCityOptionsByCountry(result.cities);
          }
        }, 100);
      } catch (error: any) {
        if (isMounted) {
          toast({ 
            title: 'Error', 
            description: `Failed to load location data: ${error.message}`, 
            variant: 'destructive' 
          });
        }
      }
    })();
    
    return () => {
      isMounted = false;
    };
  }, [toast]);

  const loadCountryGallery = async () => {
    if (!selectedCountryForGallery) return;
    setLoadingCountryGallery(true);
    try {
      const path = `/exhibition-stands/${selectedCountryForGallery}`;
      const res = await fetch(`/api/admin/pages-editor?action=get-content&path=${encodeURIComponent(path)}`, { cache: 'no-store' });
      const j = await res.json();
      const images = (j?.data?.sections?.countryPages?.[selectedCountryForGallery]?.galleryImages || j?.data?.countryPages?.[selectedCountryForGallery]?.galleryImages || []) as string[];
      setCountryGalleryText(Array.isArray(images) ? images.join('\n') : '');
    } catch {
      setCountryGalleryText('');
    } finally {
      setLoadingCountryGallery(false);
    }
  };

  const saveCountryGallery = async () => {
    if (!selectedCountryForGallery) return;
    setSavingCountryGallery(true);
    try {
      const path = `/exhibition-stands/${selectedCountryForGallery}`;
      
      // First, fetch the current page content to preserve it
      const getRes = await fetch(`/api/admin/pages-editor?action=get-content&path=${encodeURIComponent(path)}`, { cache: 'no-store' });
      const currentContent = await getRes.json();
      
      if (!currentContent?.success) {
        toast({ title: 'Save failed', description: 'Could not retrieve current page content.', variant: 'destructive' });
        return;
      }
      
      // Extract the URLs from the text area
      const urls = countryGalleryText.split('\n').map(u => u.trim()).filter(Boolean);
      
      // Update only the gallery images while preserving the rest of the content
      const res = await fetch('/api/admin/pages-editor', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'update', 
          path,
          // Preserve existing content by sending it back with the update
          ...currentContent.data,
          // Only update the gallery images section
          sections: { 
            ...currentContent.data.sections,
            countryPages: { 
              ...currentContent.data.sections?.countryPages,
              [selectedCountryForGallery]: { 
                ...currentContent.data.sections?.countryPages?.[selectedCountryForGallery],
                galleryImages: urls 
              } 
            } 
          }
        })
      });
      
      const j = await res.json();
      if (j?.success) {
        toast({ title: 'Saved', description: 'Country gallery updated.' });
        window.dispatchEvent(new CustomEvent('global-pages:updated', { detail: { path } }));
      } else {
        toast({ title: 'Save failed', description: 'Could not save gallery.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Gallery save error:', error);
      toast({ title: 'Save failed', description: 'Network or server error.', variant: 'destructive' });
    } finally {
      setSavingCountryGallery(false);
    }
  };

  const loadCityGallery = async () => {
    if (!selectedCountryForCityGallery || !selectedCityForGallery) return;
    setLoadingCityGallery(true);
    try {
      const path = `/exhibition-stands/${selectedCountryForCityGallery}/${selectedCityForGallery}`;
      const res = await fetch(`/api/admin/pages-editor?action=get-content&path=${encodeURIComponent(path)}`, { cache: 'no-store' });
      const j = await res.json();
      const key = `${selectedCountryForCityGallery}-${selectedCityForGallery}`;
      // For city pages, gallery images are nested under countryPages
      const images = (j?.data?.sections?.cityPages?.[key]?.countryPages?.[selectedCityForGallery]?.galleryImages || []) as string[];
      setCityGalleryText(Array.isArray(images) ? images.join('\n') : '');
    } catch {
      setCityGalleryText('');
    } finally {
      setLoadingCityGallery(false);
    }
  };

  const saveCityGallery = async () => {
    if (!selectedCountryForCityGallery || !selectedCityForGallery) return;
    setSavingCityGallery(true);
    try {
      const path = `/exhibition-stands/${selectedCountryForCityGallery}/${selectedCityForGallery}`;
      
      // First, fetch the current page content to preserve it
      const getRes = await fetch(`/api/admin/pages-editor?action=get-content&path=${encodeURIComponent(path)}`, { cache: 'no-store' });
      const currentContent = await getRes.json();
      
      if (!currentContent?.success) {
        toast({ title: 'Save failed', description: 'Could not retrieve current page content.', variant: 'destructive' });
        return;
      }
      
      const key = `${selectedCountryForCityGallery}-${selectedCityForGallery}`;
      const urls = cityGalleryText.split('\n').map(u => u.trim()).filter(Boolean);
      
      // For city pages, we need to structure the data with a nested countryPages object
      const cityData = {
        ...currentContent.data.sections?.cityPages?.[key],
        countryPages: {
          ...currentContent.data.sections?.cityPages?.[key]?.countryPages,
          [selectedCityForGallery]: {
            ...(currentContent.data.sections?.cityPages?.[key]?.countryPages?.[selectedCityForGallery] || {}),
            galleryImages: urls
          }
        }
      };
      
      const res = await fetch('/api/admin/pages-editor', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'update', 
          path,
          // Preserve existing content by sending it back with the update
          ...currentContent.data,
          // Only update the gallery images section
          sections: { 
            ...currentContent.data.sections,
            cityPages: { 
              ...currentContent.data.sections?.cityPages,
              [key]: cityData
            } 
          }
        })
      });
      
      const j = await res.json();
      if (j?.success) {
        toast({ title: 'Saved', description: 'City gallery updated.' });
        window.dispatchEvent(new CustomEvent('global-pages:updated', { detail: { path } }));
      } else {
        toast({ title: 'Save failed', description: 'Could not save gallery.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('City gallery save error:', error);
      toast({ title: 'Save failed', description: 'Network or server error.', variant: 'destructive' });
    } finally {
      setSavingCityGallery(false);
    }
  };

  return (
    <AuthBoundary requiredRole="admin">
      <div className="py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Portfolio Management</h1>
              <p className="text-gray-400">Manage gallery images for country and city pages.</p>
              <p className="text-sm text-gray-500 mt-1">
                Countries: {countryOptions.length} | 
                City Groups: {Object.keys(cityOptionsByCountry).length}
              </p>
            </div>
            <Button onClick={async () => {
              const response = await fetch('/api/admin/portfolio/locations');
              const result = await response.json();
              if (result.success) {
                setCountryOptions(result.countries);
                setCityOptionsByCountry(result.cities);
                toast({ title: 'Success', description: 'Location data reloaded manually.' });
              }
            }}>
              Reload Location Data
            </Button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700 text-white">
              <CardHeader>
                <CardTitle>Country Gallery Manager</CardTitle>
                <CardDescription className="text-gray-400">Add or update gallery images for a specific country page.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label>Select Country</Label>
                  <Select value={selectedCountryForGallery} onValueChange={(v)=>setSelectedCountryForGallery(v)}>
                    <SelectTrigger className="w-full bg-slate-700 border-slate-600"><SelectValue placeholder="Choose a country" /></SelectTrigger>
                    <SelectContent className="max-h-80 bg-slate-800 text-white border-slate-700">
                      {countryOptions.map((c) => (
                        <SelectItem key={`country-${c.slug}`} value={c.slug}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={loadCountryGallery} disabled={!selectedCountryForGallery || loadingCountryGallery} className="border-slate-600 hover:bg-slate-700">
                      {loadingCountryGallery ? 'Loading…' : 'Load Images'}
                    </Button>
                  </div>
                  <Label className="mt-2">Image URLs (one per line)</Label>
                  <Textarea rows={8} value={countryGalleryText} onChange={(e)=>setCountryGalleryText(e.target.value)} placeholder="https://example.com/1.jpg\nhttps://example.com/2.jpg" className="bg-slate-700 border-slate-600 text-white" />
                  <div className="flex items-center gap-3">
                    <input type="file" accept="image/*" className="text-sm text-gray-400" onChange={async (e)=>{
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const fd = new FormData();
                      fd.append('file', f);
                      fd.append('scope', `countries/${selectedCountryForGallery||'general'}`);
                      const res = await fetch('/api/admin/gallery-upload', { method: 'POST', body: fd });
                      const j = await res.json();
                      if (j?.success && j.url) {
                        setCountryGalleryText((prev)=> (prev? prev+"\n":"") + j.url);
                        toast({ title: 'Uploaded', description: 'Image added to country gallery.' });
                      } else {
                        toast({ title: 'Upload failed', description: j?.error||'Could not upload', variant: 'destructive' });
                      }
                    }} />
                    <span className="text-xs text-gray-500">Upload to Storage</span>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveCountryGallery} disabled={!selectedCountryForGallery || savingCountryGallery}>{savingCountryGallery ? 'Saving…' : 'Save Country Gallery'}</Button>
                    <Button variant="outline" onClick={()=>setCountryGalleryText('')} className="border-slate-600 hover:bg-slate-700">Clear</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 text-white">
              <CardHeader>
                <CardTitle>City Gallery Manager</CardTitle>
                <CardDescription className="text-gray-400">Add or update gallery images for a specific city page.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label>Select Country</Label>
                  <Select value={selectedCountryForCityGallery} onValueChange={(v)=>{ setSelectedCountryForCityGallery(v); setSelectedCityForGallery(''); }}>
                    <SelectTrigger className="w-full bg-slate-700 border-slate-600"><SelectValue placeholder="Choose a country" /></SelectTrigger>
                    <SelectContent className="max-h-80 bg-slate-800 text-white border-slate-700">
                      {countryOptions.map((c) => (
                        <SelectItem key={`country-${c.slug}`} value={c.slug}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Label>Select City</Label>
                  <Select value={selectedCityForGallery} onValueChange={(v)=>setSelectedCityForGallery(v)} disabled={!selectedCountryForCityGallery}>
                    <SelectTrigger className="w-full bg-slate-700 border-slate-600"><SelectValue placeholder="Choose a city" /></SelectTrigger>
                    <SelectContent className="max-h-80 bg-slate-800 text-white border-slate-700">
                      {(cityOptionsByCountry[selectedCountryForCityGallery]||[]).map(city => (
                        <SelectItem key={city.slug} value={city.slug}>{city.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={loadCityGallery} disabled={!selectedCountryForCityGallery || !selectedCityForGallery || loadingCityGallery} className="border-slate-600 hover:bg-slate-700">
                      {loadingCityGallery ? 'Loading…' : 'Load Images'}
                    </Button>
                  </div>
                  <Label className="mt-2">Image URLs (one per line)</Label>
                  <Textarea rows={8} value={cityGalleryText} onChange={(e)=>setCityGalleryText(e.target.value)} placeholder="https://example.com/1.jpg\nhttps://example.com/2.jpg" className="bg-slate-700 border-slate-600 text-white" />
                  <div className="flex items-center gap-3">
                    <input type="file" accept="image/*" className="text-sm text-gray-400" onChange={async (e)=>{
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const fd = new FormData();
                      fd.append('file', f);
                      fd.append('scope', `cities/${selectedCountryForCityGallery||'country'}/${selectedCityForGallery||'city'}`);
                      const res = await fetch('/api/admin/gallery-upload', { method: 'POST', body: fd });
                      const j = await res.json();
                      if (j?.success && j.url) {
                        setCityGalleryText((prev)=> (prev? prev+"\n":"") + j.url);
                        toast({ title: 'Uploaded', description: 'Image added to city gallery.' });
                      } else {
                        toast({ title: 'Upload failed', description: j?.error||'Could not upload', variant: 'destructive' });
                      }
                    }} />
                    <span className="text-xs text-gray-500">Upload to Storage</span>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveCityGallery} disabled={!selectedCountryForCityGallery || !selectedCityForGallery || savingCityGallery}>{savingCityGallery ? 'Saving…' : 'Save City Gallery'}</Button>
                    <Button variant="outline" onClick={()=>setCityGalleryText('')} className="border-slate-600 hover:bg-slate-700">Clear</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthBoundary>
  );
}
