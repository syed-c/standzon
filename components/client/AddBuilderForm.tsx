"use client";

import { useState } from 'react';
import { Button } from '@/components/shared/button';
import { Input } from '@/components/shared/input';
import { Label } from '@/components/shared/label';
import { Textarea } from '@/components/shared/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/select';
import { Switch } from '@/components/shared/switch';
import { useBuilders } from '@/lib/hooks/useBuilders';
import { toast } from '@/hooks/use-toast';

interface AddBuilderFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddBuilderForm({ onSuccess, onCancel }: AddBuilderFormProps) {
  const { addBuilder } = useBuilders();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    primary_email: '',
    phone: '',
    website: '',
    headquarters_city: '',
    headquarters_country: '',
    headquarters_country_code: '',
    headquarters_address: '',
    contact_person: '',
    position: '',
    company_description: '',
    team_size: '',
    projects_completed: '',
    rating: '',
    response_time: '',
    languages: '',
    verified: false,
    premium_member: false,
    basic_stand_min: '',
    basic_stand_max: '',
    custom_stand_min: '',
    custom_stand_max: '',
    premium_stand_min: '',
    premium_stand_max: '',
    average_project: '',
    currency: 'USD',
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company_name || !formData.primary_email) {
      toast({
        title: "Error",
        description: "Company name and email are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data for submission by converting types appropriately
      // We need to create a new object that matches the Builder interface
      const submissionData: any = {};
      
      // Copy all fields first
      Object.keys(formData).forEach(key => {
        (submissionData as any)[key] = (formData as any)[key];
      });
      
      // Convert string numbers to actual numbers
      const numericFields = [
        'team_size', 'projects_completed', 'rating', 
        'basic_stand_min', 'basic_stand_max', 
        'custom_stand_min', 'custom_stand_max', 
        'premium_stand_min', 'premium_stand_max', 
        'average_project'
      ];
      
      numericFields.forEach(field => {
        const value = (formData as any)[field];
        if (typeof value === 'string' && value.trim()) {
          (submissionData as any)[field] = parseFloat(value);
        } else if (typeof value === 'string' && !value.trim()) {
          (submissionData as any)[field] = null;
        } else {
          (submissionData as any)[field] = value;
        }
      });

      // Convert languages string to array
      if (formData.languages) {
        submissionData.languages = formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang);
      } else {
        submissionData.languages = [];
      }

      await addBuilder(submissionData);
      
      toast({
        title: "Success",
        description: "Builder added successfully!",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add builder",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="primary_email">Email *</Label>
              <Input
                id="primary_email"
                type="email"
                value={formData.primary_email}
                onChange={(e) => handleInputChange('primary_email', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="headquarters_city">City</Label>
              <Input
                id="headquarters_city"
                value={formData.headquarters_city}
                onChange={(e) => handleInputChange('headquarters_city', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="headquarters_country">Country</Label>
              <Input
                id="headquarters_country"
                value={formData.headquarters_country}
                onChange={(e) => handleInputChange('headquarters_country', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="headquarters_country_code">Country Code</Label>
              <Input
                id="headquarters_country_code"
                value={formData.headquarters_country_code}
                onChange={(e) => handleInputChange('headquarters_country_code', e.target.value)}
                placeholder="e.g., US, DE, GB"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="headquarters_address">Address</Label>
            <Textarea
              id="headquarters_address"
              value={formData.headquarters_address}
              onChange={(e) => handleInputChange('headquarters_address', e.target.value)}
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => handleInputChange('contact_person', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
              />
            </div>
          </div>

          {/* Company Description */}
          <div>
            <Label htmlFor="company_description">Company Description</Label>
            <Textarea
              id="company_description"
              value={formData.company_description}
              onChange={(e) => handleInputChange('company_description', e.target.value)}
              rows={3}
            />
          </div>

          {/* Business Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="team_size">Team Size</Label>
              <Input
                id="team_size"
                type="number"
                value={formData.team_size}
                onChange={(e) => handleInputChange('team_size', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="projects_completed">Projects Completed</Label>
              <Input
                id="projects_completed"
                type="number"
                value={formData.projects_completed}
                onChange={(e) => handleInputChange('projects_completed', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => handleInputChange('rating', e.target.value)}
              />
            </div>
          </div>

          {/* Pricing Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="basic_stand_min">Basic Stand Min ($)</Label>
              <Input
                id="basic_stand_min"
                type="number"
                value={formData.basic_stand_min}
                onChange={(e) => handleInputChange('basic_stand_min', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="basic_stand_max">Basic Stand Max ($)</Label>
              <Input
                id="basic_stand_max"
                type="number"
                value={formData.basic_stand_max}
                onChange={(e) => handleInputChange('basic_stand_max', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="custom_stand_min">Custom Stand Min ($)</Label>
              <Input
                id="custom_stand_min"
                type="number"
                value={formData.custom_stand_min}
                onChange={(e) => handleInputChange('custom_stand_min', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="custom_stand_max">Custom Stand Max ($)</Label>
              <Input
                id="custom_stand_max"
                type="number"
                value={formData.custom_stand_max}
                onChange={(e) => handleInputChange('custom_stand_max', e.target.value)}
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="response_time">Response Time</Label>
              <Input
                id="response_time"
                value={formData.response_time}
                onChange={(e) => handleInputChange('response_time', e.target.value)}
                placeholder="e.g., 24 hours"
              />
            </div>
            <div>
              <Label htmlFor="languages">Languages</Label>
              <Input
                id="languages"
                value={formData.languages}
                onChange={(e) => handleInputChange('languages', e.target.value)}
                placeholder="e.g., English, German, French"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status Switches */}
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="verified"
                checked={formData.verified}
                onCheckedChange={(checked) => handleInputChange('verified', checked)}
              />
              <Label htmlFor="verified">Verified</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="premium_member"
                checked={formData.premium_member}
                onCheckedChange={(checked) => handleInputChange('premium_member', checked)}
              />
              <Label htmlFor="premium_member">Premium Member</Label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Builder'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
