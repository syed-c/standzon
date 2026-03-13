'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { getSupabaseClient } from '@/lib/supabase/client';
import { mapTradeShowDBToUI } from '@/lib/utils/tradeShowMapping';
import { TradeShow } from '@/lib/data/tradeShows';

export default function AdminTradeshowsPage() {
  const [tradeShows, setTradeShows] = useState<TradeShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editingShow, setEditingShow] = useState<TradeShow | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTradeShows();
  }, []);

  const fetchTradeShows = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('trade_shows')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setTradeShows((data || []).map(mapTradeShowDBToUI));
    } catch (err) {
      console.error('Error fetching trade shows:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter trade shows
  const filteredShows = tradeShows.filter(show => {
    const matchesSearch = 
      show.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      show.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      show.country.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCountry = filterCountry === 'all' || show.country === filterCountry;

    return matchesSearch && matchesCountry;
  });

  // Pagination
  const totalPages = Math.ceil(filteredShows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedShows = filteredShows.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCountry]);

  // Get unique countries
  const countries = Array.from(new Set(tradeShows.map(show => show.country))).sort();

  // Stats
  const stats = {
    total: tradeShows.length,
    upcoming: tradeShows.filter(s => s.startDate && new Date(s.startDate) > new Date()).length,
    past: tradeShows.filter(s => s.endDate && new Date(s.endDate) < new Date()).length,
  };

  const handleEditShow = (show: TradeShow) => {
    setEditingShow({ ...show });
    setShowEditDialog(true);
  };

  const handleSaveShow = async () => {
    if (!editingShow) return;
    setIsSaving(true);
    
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('trade_shows')
        .update({
          name: editingShow.name,
          description: editingShow.description,
          venue: editingShow.venue,
          city: editingShow.city,
          country: editingShow.country,
          start_date: editingShow.startDate,
          end_date: editingShow.endDate,
          website: editingShow.website,
          industries: editingShow.industries.map(i => i.name),
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingShow.id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Tradeshow updated successfully' });
      setShowEditDialog(false);
      fetchTradeShows();
    } catch (err) {
      console.error('Error saving tradeshow:', err);
      toast({ title: 'Error', description: 'Failed to save tradeshow', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tradeshows Management</h1>
          <p className="text-slate-500">Manage all exhibition tradeshows and events</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchTradeShows} className="border-slate-300 text-slate-700 hover:bg-slate-50">
            <span className="material-symbols-outlined mr-2">refresh</span>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="material-symbols-outlined text-blue-600">event</span>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Tradeshows</p>
                <p className="text-xl font-bold text-slate-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="material-symbols-outlined text-green-600">schedule</span>
              </div>
              <div>
                <p className="text-sm text-slate-500">Upcoming</p>
                <p className="text-xl font-bold text-slate-900">{stats.upcoming}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <span className="material-symbols-outlined text-slate-600">history</span>
              </div>
              <div>
                <p className="text-sm text-slate-500">Past Events</p>
                <p className="text-xl font-bold text-slate-900">{stats.past}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Card */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Filters & Search</CardTitle>
          <CardDescription className="text-slate-500">
            {filteredShows.length} of {tradeShows.length} tradeshows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-600">Search</Label>
              <div className="relative mt-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">search</span>
                <Input
                  placeholder="Search by name, city, country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-300"
                />
              </div>
            </div>
            <div>
              <Label className="text-slate-600">Country</Label>
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger className="mt-1 border-slate-300">
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tradeshows Table */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Tradeshows Directory</CardTitle>
          <CardDescription className="text-slate-500">
            View and manage tradeshow details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3886] mx-auto"></div>
                <p className="mt-2 text-slate-500">Loading tradeshows...</p>
              </div>
            </div>
          ) : paginatedShows.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <span className="material-symbols-outlined text-5xl block mb-2 opacity-40">event_busy</span>
              <p>No tradeshows found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Location</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Industries</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedShows.map((show) => (
                      <tr key={show.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-slate-900">{show.name}</div>
                            {show.venue && typeof show.venue === 'string' && <div className="text-xs text-slate-500">{show.venue}</div>}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {show.city}, {show.country}
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-sm">
                          {show.startDate ? new Date(show.startDate).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {show.industries.slice(0, 2).map((ind, i) => (
                              <Badge key={i} variant="outline" className="text-xs border-slate-200">
                                {ind.name}
                              </Badge>
                            ))}
                            {show.industries.length > 2 && (
                              <Badge variant="outline" className="text-xs border-slate-200">
                                +{show.industries.length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditShow(show)}
                              className="border-slate-300 text-slate-600 hover:bg-slate-50"
                            >
                              <span className="material-symbols-outlined text-sm mr-1">edit</span>
                              Edit
                            </Button>
                            {show.website && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                asChild
                                className="border-slate-300 text-slate-600 hover:bg-slate-50"
                              >
                                <a href={show.website} target="_blank" rel="noopener noreferrer">
                                  <span className="material-symbols-outlined text-sm mr-1">open_in_new</span>
                                  Visit
                                </a>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-slate-500">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredShows.length)} of {filteredShows.length} tradeshows
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="border-slate-300 text-slate-600 hover:bg-slate-50"
                  >
                    Previous
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={
                            currentPage === pageNum 
                              ? "bg-[#1e3886] border-[#1e3886] text-white" 
                              : "border-slate-300 text-slate-600 hover:bg-slate-50"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="border-slate-300 text-slate-600 hover:bg-slate-50"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Edit Tradeshow</DialogTitle>
          </DialogHeader>
          {editingShow && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="md:col-span-2">
                <Label className="text-slate-600">Tradeshow Name</Label>
                <Input 
                  value={editingShow.name} 
                  onChange={(e) => setEditingShow({ ...editingShow, name: e.target.value })}
                  className="border-slate-300 mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-slate-600">Description</Label>
                <Textarea 
                  value={editingShow.description || ''} 
                  onChange={(e) => setEditingShow({ ...editingShow, description: e.target.value })}
                  className="border-slate-300 mt-1"
                  rows={3}
                />
              </div>
              <div>
                <Label className="text-slate-600">Venue</Label>
                <Input 
                  value={typeof editingShow.venue === 'string' ? editingShow.venue : ''} 
                  onChange={(e) => setEditingShow({ ...editingShow, venue: e.target.value as any })}
                  className="border-slate-300 mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-600">City</Label>
                <Input 
                  value={editingShow.city} 
                  onChange={(e) => setEditingShow({ ...editingShow, city: e.target.value })}
                  className="border-slate-300 mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-600">Country</Label>
                <Input 
                  value={editingShow.country} 
                  onChange={(e) => setEditingShow({ ...editingShow, country: e.target.value })}
                  className="border-slate-300 mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-600">Website</Label>
                <Input 
                  value={editingShow.website || ''} 
                  onChange={(e) => setEditingShow({ ...editingShow, website: e.target.value })}
                  className="border-slate-300 mt-1"
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label className="text-slate-600">Start Date</Label>
                <Input 
                  type="date"
                  value={editingShow.startDate ? new Date(editingShow.startDate).toISOString().split('T')[0] : ''} 
                  onChange={(e) => setEditingShow({ ...editingShow, startDate: e.target.value })}
                  className="border-slate-300 mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-600">End Date</Label>
                <Input 
                  type="date"
                  value={editingShow.endDate ? new Date(editingShow.endDate).toISOString().split('T')[0] : ''} 
                  onChange={(e) => setEditingShow({ ...editingShow, endDate: e.target.value })}
                  className="border-slate-300 mt-1"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowEditDialog(false)}
                  className="border-slate-300 text-slate-700"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveShow}
                  disabled={isSaving}
                  className="bg-[#1e3886]"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
