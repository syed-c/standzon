"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import { Badge } from '@/components/shared/badge';
import { Input } from '@/components/shared/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shared/dialog';
import { Textarea } from '@/components/shared/textarea';
import { Label } from '@/components/shared/label';
import { 
  FiCalendar, FiMapPin, FiUsers, FiTrendingUp, FiSearch, FiFilter, 
  FiPlus, FiEdit3, FiTrash2, FiStar, FiGlobe, FiDollarSign,
  FiEye, FiCheckCircle, FiClock, FiBarChart, FiDownload
} from 'react-icons/fi';
import { tradeShows, industries, tradeShowStats, TradeShowUtils, TradeShow } from '@/lib/data/tradeShows';
import { toast } from 'sonner';

export default function TradeShowManagement() {
  console.log("Trade Show Management: Component loaded with", tradeShows.length, "shows");

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedSignificance, setSelectedSignificance] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('startDate');
  const [showFilters, setShowFilters] = useState(false);
  const [editingShow, setEditingShow] = useState<TradeShow | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Get unique values for filters
  const countries = useMemo(() => {
    return Array.from(new Set(tradeShows.map(show => show.country))).sort();
  }, []);

  const years = useMemo(() => {
    return Array.from(new Set(tradeShows.map(show => show.year))).sort();
  }, []);

  const significanceOptions = ['Major', 'Regional', 'Specialized', 'Emerging'];

  // Filter and sort trade shows
  const filteredAndSortedShows = useMemo(() => {
    let filtered = tradeShows.filter(show => {
      const matchesSearch = searchTerm === '' || 
        show.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.venue.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry = selectedCountry === 'all' || show.country === selectedCountry;
      const matchesIndustry = selectedIndustry === 'all' || 
        show.industries.some(industry => industry.slug === selectedIndustry);
      const matchesSignificance = selectedSignificance === 'all' || show.significance === selectedSignificance;
      const matchesYear = selectedYear === 'all' || show.year.toString() === selectedYear;
      
      // Status filter (upcoming vs past)
      const isUpcoming = new Date(show.startDate) > new Date();
      const matchesStatus = selectedStatus === 'all' || 
        (selectedStatus === 'upcoming' && isUpcoming) ||
        (selectedStatus === 'past' && !isUpcoming);

      return matchesSearch && matchesCountry && matchesIndustry && 
             matchesSignificance && matchesYear && matchesStatus;
    });

    // Sort shows
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'startDate':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'visitors':
          return b.expectedVisitors - a.expectedVisitors;
        case 'exhibitors':
          return b.expectedExhibitors - a.expectedExhibitors;
        case 'significance':
          const order = { 'Major': 4, 'Regional': 3, 'Specialized': 2, 'Emerging': 1 };
          return (order[b.significance] || 0) - (order[a.significance] || 0);
        default:
          return 0;
      }
    });
  }, [searchTerm, selectedCountry, selectedIndustry, selectedSignificance, selectedYear, selectedStatus, sortBy]);

  const handleDeleteShow = (showId: string) => {
    // In a real app, this would delete from the database
    console.log("Delete show:", showId);
    toast.success("Trade show deleted successfully");
  };

  const handleEditShow = (show: TradeShow) => {
    setEditingShow(show);
    console.log("Edit show:", show.name);
  };

  const handleCreateShow = () => {
    setShowCreateDialog(true);
    console.log("Create new trade show");
  };

  const exportShows = () => {
    console.log("Export trade shows to CSV");
    toast.success("Trade shows exported successfully");
  };

  const upcomingShows = tradeShows.filter(show => new Date(show.startDate) > new Date()).length;
  const majorShows = tradeShows.filter(show => show.significance === 'Major').length;

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-navy-900">Trade Show Management</h2>
          <p className="text-gray-600 mt-1">Manage {tradeShows.length} global exhibitions and events</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportShows} variant="outline">
            <FiDownload className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreateShow}>
            <FiPlus className="w-4 h-4 mr-2" />
            Add Trade Show
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Shows</p>
                <p className="text-3xl font-bold text-navy-900">{tradeShows.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-blue-primary" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{countries.length} countries</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Shows</p>
                <p className="text-3xl font-bold text-green-600">{upcomingShows}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiClock className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <FiCheckCircle className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">Next 12 months</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Major Events</p>
                <p className="text-3xl font-bold text-purple-600">{majorShows}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiStar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <FiGlobe className="w-4 h-4 text-purple-500 mr-1" />
              <span className="text-sm text-purple-600">Global significance</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                <p className="text-3xl font-bold text-orange-600">
                  {(tradeShowStats.totalExpectedVisitors / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <FiBarChart className="w-4 h-4 text-orange-500 mr-1" />
              <span className="text-sm text-orange-600">Expected annually</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search trade shows, cities, venues, or organizers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <FiFilter className="w-4 h-4" />
                Filters
              </Button>
              <span className="text-sm text-gray-600">
                {filteredAndSortedShows.length} of {tradeShows.length} shows
              </span>
            </div>
          </div>
        </CardHeader>

        {showFilters && (
          <CardContent className="border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map(industry => (
                    <SelectItem key={industry.slug} value={industry.slug}>{industry.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSignificance} onValueChange={setSelectedSignificance}>
                <SelectTrigger>
                  <SelectValue placeholder="All Significance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Significance</SelectItem>
                  {significanceOptions.map(sig => (
                    <SelectItem key={sig} value={sig}>{sig}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="startDate">Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="visitors">Visitors</SelectItem>
                  <SelectItem value="exhibitors">Exhibitors</SelectItem>
                  <SelectItem value="significance">Significance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(selectedCountry !== 'all' || selectedIndustry !== 'all' || selectedSignificance !== 'all' || 
              selectedYear !== 'all' || selectedStatus !== 'all') && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCountry('all');
                    setSelectedIndustry('all');
                    setSelectedSignificance('all');
                    setSelectedYear('all');
                    setSelectedStatus('all');
                  }}
                  className="text-sm"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Trade Shows Grid */}
      <div className="grid gap-6">
        {filteredAndSortedShows.length > 0 ? (
          filteredAndSortedShows.map((show) => {
            const isUpcoming = new Date(show.startDate) > new Date();
            const duration = TradeShowUtils.calculateDuration(show.startDate, show.endDate);
            
            return (
              <Card key={show.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-navy-900">{show.name}</h3>
                        <Badge 
                          variant="secondary" 
                          style={{ backgroundColor: show.industries[0]?.color + '20', color: show.industries[0]?.color }}
                        >
                          {show.industries[0]?.icon} {show.industries[0]?.name}
                        </Badge>
                        <Badge variant={show.significance === 'Major' ? 'default' : 'outline'}>
                          {show.significance}
                        </Badge>
                        <Badge variant={isUpcoming ? 'default' : 'secondary'}>
                          {isUpcoming ? 'Upcoming' : 'Past'}
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <FiCalendar className="w-4 h-4 mr-2 text-blue-primary" />
                          {TradeShowUtils.formatDate(show.startDate)} ({duration} days)
                        </div>
                        <div className="flex items-center">
                          <FiMapPin className="w-4 h-4 mr-2 text-blue-primary" />
                          {show.city}, {show.country}
                        </div>
                        <div className="flex items-center">
                          <FiUsers className="w-4 h-4 mr-2 text-blue-primary" />
                          {show.expectedVisitors.toLocaleString()} visitors
                        </div>
                        <div className="flex items-center">
                          <FiGlobe className="w-4 h-4 mr-2 text-blue-primary" />
                          {show.venue.name}
                        </div>
                      </div>

                      <p className="text-gray-700 line-clamp-2">{show.description}</p>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="text-gray-500">
                          <strong>Exhibitors:</strong> {show.expectedExhibitors.toLocaleString()}
                        </span>
                        <span className="text-gray-500">
                          <strong>Space:</strong> {show.standSpace.toLocaleString()} sqm
                        </span>
                        <span className="text-gray-500">
                          <strong>Entry:</strong> {show.ticketPrice}
                        </span>
                        {show.previousEditionStats && (
                          <span className="text-gray-500 flex items-center">
                            <strong>Rating:</strong> {show.previousEditionStats.feedback}/5 
                            <FiStar className="w-3 h-3 ml-1 text-yellow-500" />
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/trade-shows/${show.slug}`, '_blank')}
                      >
                        <FiEye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditShow(show)}
                      >
                        <FiEdit3 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteShow(show.id)}
                      >
                        <FiTrash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No trade shows found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCountry('all');
                  setSelectedIndustry('all');
                  setSelectedSignificance('all');
                  setSelectedYear('all');
                  setSelectedStatus('all');
                }}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog - Placeholder */}
      {editingShow && (
        <Dialog open={!!editingShow} onOpenChange={() => setEditingShow(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Trade Show: {editingShow.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Show Name</Label>
                  <Input id="name" defaultValue={editingShow.name} />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" defaultValue={editingShow.city} />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" defaultValue={editingShow.country} />
                </div>
                <div>
                  <Label htmlFor="significance">Significance</Label>
                  <Select defaultValue={editingShow.significance}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {significanceOptions.map(sig => (
                        <SelectItem key={sig} value={sig}>{sig}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" defaultValue={editingShow.description} rows={3} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingShow(null)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  console.log("Save trade show changes");
                  setEditingShow(null);
                  toast.success("Trade show updated successfully");
                }}>
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