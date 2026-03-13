"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  event_name: string;
  event_date: string;
  venue: string;
  city: string;
  country: string;
  stand_size: number;
  budget_range: string;
  timeline: string;
  stand_type: string;
  status: 'new' | 'assigned' | 'contacted' | 'quoted' | 'converted' | 'lost' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: string;
  created_at: string;
  updated_at: string;
  builder_id?: string;
  notes?: string;
  special_requests?: string;
  needs_installation?: boolean;
  needs_transportation?: boolean;
  needs_storage?: boolean;
  needs_av_equipment?: boolean;
  needs_lighting?: boolean;
  needs_furniture?: boolean;
  needs_graphics?: boolean;
}

interface LeadsManagementProps {
  adminId: string;
  permissions: string[];
}

export default function LeadsManagement({
  adminId,
  permissions,
}: LeadsManagementProps) {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, statusFilter, priorityFilter, sourceFilter, countryFilter]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/leads');
      if (!response.ok) throw new Error('Failed to fetch leads');
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: "Failed to load leads from database",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = [...leads];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.company_name?.toLowerCase().includes(term) ||
        lead.contact_name?.toLowerCase().includes(term) ||
        lead.contact_email?.toLowerCase().includes(term) ||
        lead.event_name?.toLowerCase().includes(term) ||
        lead.city?.toLowerCase().includes(term) ||
        lead.country?.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter !== "all") filtered = filtered.filter(l => l.status === statusFilter);
    if (priorityFilter !== "all") filtered = filtered.filter(l => l.priority === priorityFilter);
    if (sourceFilter !== "all") filtered = filtered.filter(l => l.source === sourceFilter);
    if (countryFilter !== "all") filtered = filtered.filter(l => l.country === countryFilter);
    
    setFilteredLeads(filtered);
    setCurrentPage(1);
  };

  const updateLeadStatus = async (leadId: string, newStatus: Lead['status']) => {
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update lead');
      
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
      toast({ title: "Success", description: `Lead status updated to ${newStatus}` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update lead status", variant: "destructive" });
    }
  };

  const updateLeadPriority = async (leadId: string, newPriority: Lead['priority']) => {
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority })
      });
      if (!response.ok) throw new Error('Failed to update lead');
      
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, priority: newPriority } : l));
      toast({ title: "Success", description: `Lead priority updated to ${newPriority}` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update lead priority", variant: "destructive" });
    }
  };

  const deleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete lead');
      
      setLeads(prev => prev.filter(l => l.id !== leadId));
      toast({ title: "Success", description: "Lead deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete lead", variant: "destructive" });
    }
  };

  const bulkUpdateStatus = async (status: Lead['status']) => {
    if (selectedLeads.size === 0) return;
    try {
      const response = await fetch('/api/admin/leads/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadIds: Array.from(selectedLeads), status })
      });
      if (!response.ok) throw new Error('Failed to bulk update');
      
      setLeads(prev => prev.map(l => 
        selectedLeads.has(l.id) ? { ...l, status } : l
      ));
      setSelectedLeads(new Set());
      toast({ title: "Success", description: `Updated ${selectedLeads.size} leads` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to bulk update leads", variant: "destructive" });
    }
  };

  const exportToCSV = () => {
    const headers = ['Company', 'Contact', 'Email', 'Phone', 'Event', 'City', 'Country', 'Status', 'Priority', 'Source', 'Created'];
    const rows = filteredLeads.map(l => [
      l.company_name, l.contact_name, l.contact_email, l.contact_phone,
      l.event_name, l.city, l.country, l.status, l.priority, l.source, l.created_at
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v || ''}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: "Exported", description: `${filteredLeads.length} leads exported to CSV` });
  };

  const toggleSelectAll = () => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filteredLeads.map(l => l.id)));
    }
  };

  const toggleSelect = (leadId: string) => {
    const newSet = new Set(selectedLeads);
    if (newSet.has(leadId)) {
      newSet.delete(leadId);
    } else {
      newSet.add(leadId);
    }
    setSelectedLeads(newSet);
  };

  const countries = [...new Set(leads.map(l => l.country).filter(Boolean))];
  const sources = [...new Set(leads.map(l => l.source).filter(Boolean))];

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: "bg-blue-100 text-blue-700 border-blue-200",
      assigned: "bg-amber-100 text-amber-700 border-amber-200",
      contacted: "bg-purple-100 text-purple-700 border-purple-200",
      quoted: "bg-indigo-100 text-indigo-700 border-indigo-200",
      converted: "bg-green-100 text-green-700 border-green-200",
      lost: "bg-red-100 text-red-700 border-red-200",
      cancelled: "bg-slate-100 text-slate-700 border-slate-200",
    };
    return <Badge className={styles[status] || "bg-slate-100"}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      low: "bg-slate-100 text-slate-600 border-slate-200",
      medium: "bg-amber-100 text-amber-600 border-amber-200",
      high: "bg-orange-100 text-orange-600 border-orange-200",
      urgent: "bg-red-100 text-red-600 border-red-200",
    };
    return <Badge variant="outline" className={styles[priority] || ""}>{priority}</Badge>;
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    converted: leads.filter(l => l.status === 'converted').length,
    avgScore: leads.length ? Math.round(leads.reduce((sum, l) => sum + (l.priority === 'urgent' ? 100 : l.priority === 'high' ? 75 : l.priority === 'medium' ? 50 : 25), 0) / leads.length) : 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Leads Management</h1>
          <p className="text-slate-600">Manage incoming leads and track conversion pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-300 text-slate-700" onClick={exportToCSV}>
            <span className="material-symbols-outlined mr-2">download</span>
            Export CSV
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={fetchLeads}>
            <span className="material-symbols-outlined mr-2">refresh</span>
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Leads', value: stats.total, icon: 'campaign', color: 'bg-blue-50 border-blue-200' },
          { title: 'New Leads', value: stats.new, icon: 'fiber_new', color: 'bg-green-50 border-green-200' },
          { title: 'Converted', value: stats.converted, icon: 'check_circle', color: 'bg-purple-50 border-purple-200' },
          { title: 'Pipeline Health', value: `${stats.avgScore}%`, icon: 'trending_up', color: 'bg-amber-50 border-amber-200' },
        ].map((stat, idx) => (
          <Card key={idx} className={`${stat.color} border`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <span className="material-symbols-outlined text-3xl text-slate-400">{stat.icon}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex-1 relative max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-slate-300"
              />
            </div>
            <div className="flex items-center gap-2">
              {selectedLeads.size > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-slate-300">
                      <span className="material-symbols-outlined mr-2">stack</span>
                      Bulk ({selectedLeads.size})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => bulkUpdateStatus('contacted')}>Mark as Contacted</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => bulkUpdateStatus('quoted')}>Mark as Quoted</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => bulkUpdateStatus('converted')}>Mark as Converted</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => bulkUpdateStatus('lost')}>Mark as Lost</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedLeads(new Set())}>Clear Selection</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button 
                variant="outline" 
                className="border-slate-300"
                onClick={() => setShowFilters(!showFilters)}
              >
                <span className="material-symbols-outlined mr-2">filter_list</span>
                Filters
                {(statusFilter !== 'all' || priorityFilter !== 'all' || sourceFilter !== 'all' || countryFilter !== 'all') && (
                  <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">Active</Badge>
                )}
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="quoted">Quoted</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Source" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sources.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Country" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="ghost" onClick={() => { setStatusFilter('all'); setPriorityFilter('all'); setSourceFilter('all'); setCountryFilter('all'); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
<TableHeader>
                  <TableRow className="bg-slate-100 hover:bg-slate-100">
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">Company</TableHead>
                    <TableHead className="font-semibold text-slate-700">Contact</TableHead>
                    <TableHead className="font-semibold text-slate-700">Event</TableHead>
                    <TableHead className="font-semibold text-slate-700">Location</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700">Priority</TableHead>
                    <TableHead className="font-semibold text-slate-700">Source</TableHead>
                    <TableHead className="font-semibold text-slate-700">Created</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {paginatedLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-slate-500">
                      No leads found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLeads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-slate-50">
                      <TableCell>
                        <Checkbox 
                          checked={selectedLeads.has(lead.id)}
                          onCheckedChange={() => toggleSelect(lead.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>{lead.company_name}</div>
                        <div className="text-xs text-slate-500">{lead.budget_range}</div>
                      </TableCell>
                      <TableCell>
                        <div>{lead.contact_name}</div>
                        <div className="text-xs text-slate-500">{lead.contact_email}</div>
                      </TableCell>
                      <TableCell>
                        <div>{lead.event_name}</div>
                        <div className="text-xs text-slate-500">{lead.event_date}</div>
                      </TableCell>
                      <TableCell>
                        <div>{lead.city}</div>
                        <div className="text-xs text-slate-500">{lead.country}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(lead.status)}</TableCell>
                      <TableCell>{getPriorityBadge(lead.priority)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-50">{lead.source}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="material-symbols-outlined">more_vert</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedLead(lead)}>
                              <span className="material-symbols-outlined mr-2">visibility</span>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setEditMode(true); setEditForm(lead); setSelectedLead(lead); }}>
                              <span className="material-symbols-outlined mr-2">edit</span>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'contacted')}>Contacted</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'quoted')}>Quoted</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'converted')}>Converted</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'lost')}>Lost</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Change Priority</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => updateLeadPriority(lead.id, 'low')}>Low</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateLeadPriority(lead.id, 'medium')}>Medium</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateLeadPriority(lead.id, 'high')}>High</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateLeadPriority(lead.id, 'urgent')}>Urgent</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => deleteLead(lead.id)} className="text-red-600">
                              <span className="material-symbols-outlined mr-2">delete</span>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-slate-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLeads.length)} of {filteredLeads.length} leads
            </div>
            <div className="flex items-center gap-2">
              <Select value={String(itemsPerPage)} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="25">25 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                  <SelectItem value="100">100 / page</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                  <span className="material-symbols-outlined">chevron_left</span>
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  
                  return (
                    <Button key={pageNum} variant={currentPage === pageNum ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(pageNum)}>
                      {pageNum}
                    </Button>
                  );
                })}
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                  <span className="material-symbols-outlined">chevron_right</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedLead} onOpenChange={() => { setSelectedLead(null); setEditMode(false); setEditForm({}); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>
              {selectedLead?.company_name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-4">
              {editMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Company Name</label>
                      <Input value={editForm.company_name || ''} onChange={(e) => setEditForm({...editForm, company_name: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Contact Name</label>
                      <Input value={editForm.contact_name || ''} onChange={(e) => setEditForm({...editForm, contact_name: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input value={editForm.contact_email || ''} onChange={(e) => setEditForm({...editForm, contact_email: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <Input value={editForm.contact_phone || ''} onChange={(e) => setEditForm({...editForm, contact_phone: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Select value={editForm.status} onValueChange={(v) => setEditForm({...editForm, status: v as Lead['status']})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="assigned">Assigned</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="quoted">Quoted</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <Select value={editForm.priority} onValueChange={(v) => setEditForm({...editForm, priority: v as Lead['priority']})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea value={editForm.notes || ''} onChange={(e) => setEditForm({...editForm, notes: e.target.value})} rows={3} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={async () => {
                      try {
                        const response = await fetch(`/api/admin/leads/${selectedLead.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(editForm)
                        });
                        if (!response.ok) throw new Error('Failed to update');
                        setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, ...editForm } : l));
                        setEditMode(false);
                        toast({ title: 'Success', description: 'Lead updated successfully' });
                      } catch (error) {
                        toast({ title: 'Error', description: 'Failed to update lead', variant: 'destructive' });
                      }
                    }}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Company</p>
                      <p className="font-medium">{selectedLead.company_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Contact</p>
                      <p className="font-medium">{selectedLead.contact_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-medium">{selectedLead.contact_email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="font-medium">{selectedLead.contact_phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Event</p>
                      <p className="font-medium">{selectedLead.event_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Event Date</p>
                      <p className="font-medium">{selectedLead.event_date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Venue</p>
                      <p className="font-medium">{selectedLead.venue}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Location</p>
                      <p className="font-medium">{selectedLead.city}, {selectedLead.country}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Stand Size</p>
                      <p className="font-medium">{selectedLead.stand_size} sq ft</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Budget</p>
                      <p className="font-medium">{selectedLead.budget_range}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Status</p>
                      {getStatusBadge(selectedLead.status)}
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Priority</p>
                      {getPriorityBadge(selectedLead.priority)}
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Source</p>
                      <p className="font-medium">{selectedLead.source}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Timeline</p>
                      <p className="font-medium">{selectedLead.timeline}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Created</p>
                      <p className="font-medium">{selectedLead.created_at ? new Date(selectedLead.created_at).toLocaleString() : '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Updated</p>
                      <p className="font-medium">{selectedLead.updated_at ? new Date(selectedLead.updated_at).toLocaleString() : '-'}</p>
                    </div>
                  </div>
                  {selectedLead.notes && (
                    <div>
                      <p className="text-sm text-slate-500">Notes</p>
                      <p className="mt-1 p-3 bg-slate-50 rounded">{selectedLead.notes}</p>
                    </div>
                  )}
                  {selectedLead.special_requests && (
                    <div>
                      <p className="text-sm text-slate-500">Special Requests</p>
                      <p className="mt-1 p-3 bg-slate-50 rounded">{selectedLead.special_requests}</p>
                    </div>
                  )}
                  <Button variant="outline" onClick={() => setEditMode(true)} className="w-full">
                    <span className="material-symbols-outlined mr-2">edit</span>
                    Edit Lead
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
