'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminPortfolio() {
  console.log(' AdminPortfolio component rendered');
  
  // Simple client-side guard: require admin session in localStorage
  React.useEffect(() => {
    console.log(' Checking admin authentication');
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
      const user = raw ? JSON.parse(raw) : null;
      const isAdmin = !!user && (user.role === 'super_admin' || user.role === 'admin' || user.isAdmin);
      if (!isAdmin) {
        console.log(' User is not admin, redirecting to login');
        window.location.href = '/admin/login';
      } else {
        console.log(' User is admin, proceeding');
      }
    } catch (error) {
      console.log(' Error checking admin auth, redirecting to login', error);
      if (typeof window !== 'undefined') window.location.href = '/admin/login';
    }
  }, []);

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
        // console.log('🔍 Attempting to fetch location data from API...');
        
        // Fetch all location data from our API endpoint
        const response = await fetch('/api/admin/portfolio/locations');
        
        if (!response.ok) {
          const errorText = await response.text();
          // console.error('❌ Error fetching location data:', errorText);
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
          // console.error('❌ Error in location data response:', result.error);
          if (isMounted) {
            toast({ 
              title: 'Error', 
              description: `Failed to fetch location data: ${result.error}`, 
              variant: 'destructive' 
            });
          }
          return;
        }

        // console.log(`✅ Successfully fetched location data`);
        // console.log('📊 Countries:', result.countries.length);
        // console.log('📊 Cities for Germany:', result.cities['germany']?.length || 0);
        // console.log('📊 All city groups:', Object.keys(result.cities).length);

        // Add a small delay to ensure state updates properly
        setTimeout(() => {
          if (isMounted) {
            setCountryOptions(result.countries);
            setCityOptionsByCountry(result.cities);
            // console.log('✅ Country/city data loading complete');
          }
        }, 100);
      } catch (error: any) {
        // console.error('❌ Error loading country/city data:', error);
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
  }, []);

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
    <AdminLayout sidebar={<Sidebar />} topbar={<Topbar />}>
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
              <p className="text-gray-600">Manage gallery images for country and city pages.</p>
              {/* Debug info */}
              <p className="text-sm text-gray-500 mt-1">
                Countries: {countryOptions.length} | 
                City Groups: {Object.keys(cityOptionsByCountry).length}
              </p>
            </div>
            {/* Test button to manually reload data */}
            <Button onClick={async () => {
              console.log(' Manually reloading location data...');
              const response = await fetch('/api/admin/portfolio/locations');
              const result = await response.json();
              console.log(' Manual reload result:', result);
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
            {/* Country Gallery Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Country Gallery Manager</CardTitle>
                <CardDescription>Add or update gallery images for a specific country page.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label>Select Country</Label>
                  <Select value={selectedCountryForGallery} onValueChange={(v)=>setSelectedCountryForGallery(v)}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Choose a country" /></SelectTrigger>
                    <SelectContent className="max-h-80">
                      {countryOptions.map((c) => (
                        <SelectItem key={`country-${c.slug}`} value={c.slug}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={loadCountryGallery} disabled={!selectedCountryForGallery || loadingCountryGallery}>
                      {loadingCountryGallery ? 'Loading…' : 'Load Images'}
                    </Button>
                  </div>
                  <Label className="mt-2">Image URLs (one per line)</Label>
                  <Textarea rows={8} value={countryGalleryText} onChange={(e)=>setCountryGalleryText(e.target.value)} placeholder="https://example.com/1.jpg\nhttps://example.com/2.jpg" />
                  <div className="flex items-center gap-3">
                    <input type="file" accept="image/*" onChange={async (e)=>{
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
                    <span className="text-xs text-gray-500">Upload to Supabase Storage</span>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveCountryGallery} disabled={!selectedCountryForGallery || savingCountryGallery}>{savingCountryGallery ? 'Saving…' : 'Save Country Gallery'}</Button>
                    <Button variant="outline" onClick={()=>setCountryGalleryText('')}>Clear</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* City Gallery Editor */}
            <Card>
              <CardHeader>
                <CardTitle>City Gallery Manager</CardTitle>
                <CardDescription>Add or update gallery images for a specific city page.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label>Select Country</Label>
                  <Select value={selectedCountryForCityGallery} onValueChange={(v)=>{ setSelectedCountryForCityGallery(v); setSelectedCityForGallery(''); }}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Choose a country" /></SelectTrigger>
                    <SelectContent className="max-h-80">
                      {countryOptions.map((c) => (
                        <SelectItem key={`country-${c.slug}`} value={c.slug}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Label>Select City</Label>
                  <Select value={selectedCityForGallery} onValueChange={(v)=>setSelectedCityForGallery(v)} disabled={!selectedCountryForCityGallery}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Choose a city" /></SelectTrigger>
                    <SelectContent className="max-h-80">
                      {(cityOptionsByCountry[selectedCountryForCityGallery]||[]).map(city => (
                        <SelectItem key={city.slug} value={city.slug}>{city.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={loadCityGallery} disabled={!selectedCountryForCityGallery || !selectedCityForGallery || loadingCityGallery}>
                      {loadingCityGallery ? 'Loading…' : 'Load Images'}
                    </Button>
                  </div>
                  <Label className="mt-2">Image URLs (one per line)</Label>
                  <Textarea rows={8} value={cityGalleryText} onChange={(e)=>setCityGalleryText(e.target.value)} placeholder="https://example.com/1.jpg\nhttps://example.com/2.jpg" />
                  <div className="flex items-center gap-3">
                    <input type="file" accept="image/*" onChange={async (e)=>{
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
                    <span className="text-xs text-gray-500">Upload to Supabase Storage</span>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveCityGallery} disabled={!selectedCountryForCityGallery || !selectedCityForGallery || savingCityGallery}>{savingCityGallery ? 'Saving…' : 'Save City Gallery'}</Button>
                    <Button variant="outline" onClick={()=>setCityGalleryText('')}>Clear</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}