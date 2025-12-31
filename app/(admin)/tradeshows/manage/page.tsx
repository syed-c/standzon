'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, ArrowLeft, Edit, Trash2, Eye, Plus, Save, X,
  MapPin, Users, DollarSign, Globe, ExternalLink, Star,
  Building2, Clock, Award, Zap
} from 'lucide-react';
import Link from 'next/link';
import { tradeShows, TradeShow } from '@/lib/data/tradeShows';

export default function ManageTradeShowsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [selectedShow, setSelectedShow] = useState<TradeShow | null>(null);
  const [editingShow, setEditingShow] = useState<TradeShow | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  console.log('Manage Trade Shows page loaded');

  // Filter trade shows
  const filteredShows = tradeShows.filter(show => {
    const matchesSearch = show.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         show.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         show.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIndustry = filterIndustry === 'all' || show.industries.some(industry => industry.id === filterIndustry);
    const matchesCountry = filterCountry === 'all' || show.country === filterCountry;
    
    return matchesSearch && matchesIndustry && matchesCountry;
  });

  // Get unique countries and industries
  const countries = Array.from(new Set(tradeShows.map(show => show.country))).sort();
  const industries = Array.from(new Set(tradeShows.flatMap(show => show.industries.map(industry => industry.name)))).sort();

  const handleEditShow = (show: TradeShow) => {
    setEditingShow({ ...show });
    setIsEditing(true);
    console.log('Editing trade show:', show.name);
  };

  const handleSaveShow = () => {
    if (!editingShow) return;
    
    console.log('Saving trade show changes:', editingShow.name);
    // In a real app, this would make an API call to save changes
    
    // Update the show in the local array (for demo purposes)
    const index = tradeShows.findIndex(s => s.id === editingShow.id);
    if (index !== -1) {
      Object.assign(tradeShows[index], editingShow);
    }
    
    setIsEditing(false);
    setEditingShow(null);
    alert('Trade show updated successfully!');
  };

  const handleDeleteShow = (showId: string) => {
    if (confirm('Are you sure you want to delete this trade show?')) {
      console.log('Deleting trade show:', showId);
      // In a real app, this would make an API call to delete
      alert('Trade show deleted successfully!');
    }
  };

  const getStatusBadge = (show: TradeShow) => {
    const now = new Date();
    const startDate = new Date(show.startDate);
    const endDate = new Date(show.endDate);
    
    if (now < startDate) {
      return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
    } else if (now >= startDate && now <= endDate) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    } else {
      return <Badge variant="outline">Past</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/advanced">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Trade Shows</h1>
              <p className="text-gray-600">Edit and manage all trade shows and exhibitions</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-purple-100 text-purple-800">
              <Calendar className="w-3 h-3 mr-1" />
              {filteredShows.length} Shows
            </Badge>
            <Link href="/admin/tradeshows/add">
              <Button className="bg-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Add New Show
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Trade Shows</Label>
                <Input
                  id="search"
                  placeholder="Search by name, city, or country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Filter by Industry</Label>
                <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industries.map(industry => (
                      <SelectItem key={industry} value={industry.toLowerCase()}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Filter by Country</Label>
                <Select value={filterCountry} onValueChange={setFilterCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trade Shows List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredShows.map((show) => (
            <Card key={show.id} className="transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base leading-tight">{show.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {show.city}, {show.country}
                    </p>
                  </div>
                  {getStatusBadge(show)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Event Details */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{new Date(show.startDate).toLocaleDateString()} - {new Date(show.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{show.venue.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Zap className="w-4 h-4 text-gray-500" />
                    <span className="capitalize">{show.industries[0]?.name || 'Various'}</span>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="font-semibold text-sm">{show.expectedVisitors?.toLocaleString() || 'N/A'}</div>
                    <div className="text-xs text-gray-600">Visitors</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="font-semibold text-sm">{show.expectedExhibitors?.toLocaleString() || 'N/A'}</div>
                    <div className="text-xs text-gray-600">Exhibitors</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="font-semibold text-sm">{show.costs?.standRental?.min || 'N/A'}</div>
                    <div className="text-xs text-gray-600">Min Cost</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {show.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedShow(show)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleEditShow(show)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteShow(show.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredShows.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No trade shows found</h3>
              <p className="text-gray-600 mb-4">
                No trade shows match your current filters. Try adjusting your search criteria.
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setFilterIndustry('all');
                setFilterCountry('all');
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Trade Show Modal */}
      {selectedShow && (
        <Dialog open={!!selectedShow} onOpenChange={() => setSelectedShow(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{selectedShow.name}</span>
                {getStatusBadge(selectedShow)}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Event Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Start Date:</span>
                      <span>{new Date(selectedShow.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">End Date:</span>
                      <span>{new Date(selectedShow.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location:</span>
                      <span>{selectedShow.city}, {selectedShow.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Venue:</span>
                      <span>{selectedShow.venue.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Industry:</span>
                      <span>{selectedShow.industries[0]?.name || 'Various'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Statistics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Expected Visitors:</span>
                      <span>{selectedShow.expectedVisitors?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Expected Exhibitors:</span>
                      <span>{selectedShow.expectedExhibitors?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Booth Cost Range:</span>
                      <span>
                        {selectedShow.costs?.standRental ? 
                          `${selectedShow.costs.standRental.min} - ${selectedShow.costs.standRental.max} ${selectedShow.costs.standRental.currency}` : 
                          'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Description</h4>
                <p className="text-sm text-gray-600">{selectedShow.description}</p>
              </div>

              {selectedShow.website && (
                <div>
                  <h4 className="font-medium mb-3">Website</h4>
                  <a href={selectedShow.website} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:underline flex items-center text-sm">
                    <span>{selectedShow.website}</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedShow(null)}>
                  Close
                </Button>
                <Button onClick={() => handleEditShow(selectedShow)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Trade Show
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Trade Show Modal */}
      {isEditing && editingShow && (
        <Dialog open={isEditing} onOpenChange={() => setIsEditing(false)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Edit className="w-5 h-5" />
                <span>Edit {editingShow.name}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-medium">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-name">Event Name</Label>
                    <Input
                      id="event-name"
                      value={editingShow.name}
                      onChange={(e) => setEditingShow({
                        ...editingShow,
                        name: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                      id="venue"
                      value={editingShow.venue.name}
                      onChange={(e) => setEditingShow({
                        ...editingShow,
                        venue: { ...editingShow.venue, name: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={editingShow.city}
                      onChange={(e) => setEditingShow({
                        ...editingShow,
                        city: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={editingShow.country}
                      onChange={(e) => setEditingShow({
                        ...editingShow,
                        country: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={editingShow.startDate}
                      onChange={(e) => setEditingShow({
                        ...editingShow,
                        startDate: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={editingShow.endDate}
                      onChange={(e) => setEditingShow({
                        ...editingShow,
                        endDate: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="space-y-4">
                <h4 className="font-medium">Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expected-visitors">Expected Visitors</Label>
                    <Input
                      id="expected-visitors"
                      type="number"
                      value={editingShow.expectedVisitors}
                      onChange={(e) => setEditingShow({
                        ...editingShow,
                        expectedVisitors: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expected-exhibitors">Expected Exhibitors</Label>
                    <Input
                      id="expected-exhibitors"
                      type="number"
                      value={editingShow.expectedExhibitors}
                      onChange={(e) => setEditingShow({
                        ...editingShow,
                        expectedExhibitors: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingShow.description}
                  onChange={(e) => setEditingShow({
                    ...editingShow,
                    description: e.target.value
                  })}
                  rows={4}
                />
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={editingShow.website || ''}
                  onChange={(e) => setEditingShow({
                    ...editingShow,
                    website: e.target.value
                  })}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveShow}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}