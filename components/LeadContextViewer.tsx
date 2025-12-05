'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Target, Users, FileText, Mail, Phone } from 'lucide-react';

export default function LeadContextViewer() {
  const [leads, setLeads] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/leads?action=with-context');
      const data = await response.json();
      
      if (data.success) {
        setLeads(data.data || []);
        setSummary(data.summary || null);
      }
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading leads...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Lead Context Viewer</h1>
        <p className="text-gray-600">View all leads with full context information</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{summary.total}</div>
              <div className="text-sm text-gray-600">Total Leads</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{summary.general_inquiries}</div>
              <div className="text-sm text-gray-600">General Inquiries</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">{summary.builder_specific}</div>
              <div className="text-sm text-gray-600">Builder Specific</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{summary.with_location_context}</div>
              <div className="text-sm text-gray-600">With Location</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">{summary.with_design_files}</div>
              <div className="text-sm text-gray-600">With Design Files</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Leads List */}
      <div className="space-y-4">
        {leads.map((lead) => (
          <Card key={lead.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{lead.company_name}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {lead.contact_email}
                    </div>
                    {lead.contact_phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {lead.contact_phone}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge className={lead.is_general_inquiry ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                    {lead.lead_type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {lead.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Details */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Event Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Trade Show:</span>
                      <span className="ml-2 font-medium">{lead.trade_show_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Event Location:</span>
                      <span className="ml-2 font-medium">{lead.city}, {lead.country}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Stand Size:</span>
                      <span className="ml-2 font-medium">{lead.stand_size} sqm</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Budget:</span>
                      <span className="ml-2 font-medium">{lead.budget}</span>
                    </div>
                  </div>
                </div>

                {/* Search Context */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Builder Search Context
                  </h4>
                  <div className="space-y-2 text-sm">
                    {lead.search_location_city || lead.search_location_country ? (
                      <>
                        <div>
                          <span className="text-gray-600">Looking for builders in:</span>
                          <span className="ml-2 font-medium">
                            {lead.search_location_city && `${lead.search_location_city}, `}
                            {lead.search_location_country}
                            {lead.search_location_country_code && ` (${lead.search_location_country_code})`}
                          </span>
                        </div>
                        {!lead.event_vs_search_match && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            Event & search locations differ
                          </Badge>
                        )}
                      </>
                    ) : (
                      <div className="text-gray-400 italic">No search location specified</div>
                    )}
                    
                    {lead.targeted_builder_name && (
                      <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2 text-purple-900">
                          <Target className="w-4 h-4" />
                          <span className="font-medium">Targeted Builder:</span>
                        </div>
                        <div className="mt-1 font-semibold">{lead.targeted_builder_name}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  {lead.has_design_files && (
                    <Badge className="bg-green-100 text-green-800">
                      <FileText className="w-3 h-3 mr-1" />
                      {lead.uploaded_files_count} design file{lead.uploaded_files_count !== 1 ? 's' : ''}
                    </Badge>
                  )}
                  <Badge variant="outline">
                    Score: {lead.lead_score}
                  </Badge>
                  <Badge variant="outline">
                    {lead.source}
                  </Badge>
                  <span className="text-gray-500 text-xs ml-auto">
                    {new Date(lead.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {leads.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No leads found</h3>
          <p className="text-gray-500">Submit a lead from the website to see it appear here</p>
        </div>
      )}

      <div className="mt-8 text-center">
        <Button onClick={loadLeads} variant="outline">
          Refresh Leads
        </Button>
      </div>
    </div>
  );
}
