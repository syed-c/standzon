'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Building2, 
  ArrowLeft, 
  Save, 
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function AddBuilderPage() {
  const [formData, setFormData] = useState({
    company_name: '',
    primary_email: '',
    phone: '',
    website: '',
    headquarters_city: '',
    headquarters_country: '',
    contact_person: '',
    position: '',
    company_description: '',
    team_size: '',
    projects_completed: '',
    rating: '',
    response_time: '',
    verified: false,
    premium_member: false,
  });
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Convert numeric fields
      const dataToSend = {
        ...formData,
        team_size: formData.team_size ? parseInt(formData.team_size) : null,
        projects_completed: formData.projects_completed ? parseInt(formData.projects_completed) : null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
      };

      const response = await fetch('/api/builders/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add builder');
      }

      setSuccess('Builder added successfully!');
      // Reset form
      setFormData({
        company_name: '',
        primary_email: '',
        phone: '',
        website: '',
        headquarters_city: '',
        headquarters_country: '',
        contact_person: '',
        position: '',
        company_description: '',
        team_size: '',
        projects_completed: '',
        rating: '',
        response_time: '',
        verified: false,
        premium_member: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add builder');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <Link href="/admin/builders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Builders
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Builder</h1>
            <p className="text-gray-600">Create a new exhibition stand builder profile</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Builder Information</span>
            </CardTitle>
            <CardDescription>
              Fill in the details for the new exhibition stand builder
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800">{success}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="primary_email">Primary Email *</Label>
                  <Input
                    id="primary_email"
                    name="primary_email"
                    type="email"
                    value={formData.primary_email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="headquarters_city">Headquarters City</Label>
                  <Input
                    id="headquarters_city"
                    name="headquarters_city"
                    value={formData.headquarters_city}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="headquarters_country">Headquarters Country</Label>
                  <Input
                    id="headquarters_country"
                    name="headquarters_country"
                    value={formData.headquarters_country}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact_person">Contact Person</Label>
                  <Input
                    id="contact_person"
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="team_size">Team Size</Label>
                  <Input
                    id="team_size"
                    name="team_size"
                    type="number"
                    value={formData.team_size}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projects_completed">Projects Completed</Label>
                  <Input
                    id="projects_completed"
                    name="projects_completed"
                    type="number"
                    value={formData.projects_completed}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="response_time">Response Time</Label>
                  <Input
                    id="response_time"
                    name="response_time"
                    value={formData.response_time}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company_description">Company Description</Label>
                <Textarea
                  id="company_description"
                  name="company_description"
                  value={formData.company_description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="verified">Verified Builder</Label>
                    <p className="text-sm text-gray-500">Mark this builder as verified</p>
                  </div>
                  <Switch
                    id="verified"
                    checked={formData.verified}
                    onCheckedChange={handleSwitchChange('verified')}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="premium_member">Premium Member</Label>
                    <p className="text-sm text-gray-500">Mark this builder as premium member</p>
                  </div>
                  <Switch
                    id="premium_member"
                    checked={formData.premium_member}
                    onCheckedChange={handleSwitchChange('premium_member')}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Link href="/admin/builders">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Add Builder
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}