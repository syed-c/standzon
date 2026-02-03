"use client";

import { useState, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface SuperAdminWebsiteSettingsClientProps {
  initialUser: any;
  initialSettings: any;
}

export default function SuperAdminWebsiteSettingsClient({ 
  initialUser, 
  initialSettings 
}: SuperAdminWebsiteSettingsClientProps) {
  console.log("🔧 SuperAdminWebsiteSettingsClient: Component rendered");

  const [currentUser, setCurrentUser] = useState<any>(initialUser);
  const [settings, setSettings] = useState<any>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Simulate data fetching without Convex
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For now, we'll just use the initial data
        setCurrentUser(initialUser);
        setSettings(initialSettings);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
        toast({
          title: "Error",
          description: "Failed to load website settings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading states
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading website settings...</p>
        </div>
      </div>
    );
  }

  // Authentication check
  if (currentUser === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
            <CardDescription className="text-center">
              Please sign in to access the admin panel.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Authorization check
  if (currentUser && currentUser.role !== "superadmin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Unauthorized</CardTitle>
            <CardDescription className="text-center">
              You need super admin privileges to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                Current Role: {currentUser.role || "user"}
              </Badge>
              <p className="text-sm text-gray-500">
                Contact your system administrator for access.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Settings loading
  if (settings === "skip" || settings === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  // Handle initial seed if no settings exist
  const handleSeedSettings = async () => {
    setSeeding(true);
    try {
      // Simulate seeding
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const defaultSettings = {
        companyName: "ExhibitBay",
        logoUrl: "/logo.png",
        primaryColor: "#0070f3",
        contact: {
          email: "info@exhibitbay.com",
          phone: "+1234567890",
          address: "123 Business Street, City, Country",
        },
        social: {
          facebook: "https://facebook.com/exhibitbay",
          twitter: "https://twitter.com/exhibitbay",
          instagram: "https://instagram.com/exhibitbay",
          linkedin: "https://linkedin.com/company/exhibitbay",
          youtube: "https://youtube.com/exhibitbay",
        },
        pages: {
          footerText: "© 2025 ExhibitBay. All rights reserved.",
          heroSubtitle: "Connecting exhibitors with the best stand builders worldwide",
          aboutText: "ExhibitBay is the leading platform for exhibition stand design and construction.",
        },
        metadata: {
          defaultMetaTitle: "ExhibitBay - Exhibition Stand Builders Marketplace",
          defaultMetaDescription: "Find the best exhibition stand builders for your next trade show. Connect with verified professionals worldwide.",
        },
        smtp: {
          host: "smtp.example.com",
          port: 587,
          user: "noreply@example.com",
          password: "password",
          secure: false,
          fromEmail: "noreply@example.com",
        },
        note: "Default settings initialized",
      };
      
      setSettings(defaultSettings);
      
      toast({
        title: "Settings Initialized",
        description: "Default website settings have been created successfully.",
      });
    } catch (error) {
      console.error("Failed to seed settings:", error);
      toast({
        title: "Error",
        description: "Failed to initialize settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSeeding(false);
    }
  };

  // If no settings exist, show seed option
  if (!settings) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Initialize Website Settings</CardTitle>
            <CardDescription>
              No website settings found. Initialize with default values to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleSeedSettings} 
              disabled={seeding}
              className="w-full"
            >
              {seeding ? "Initializing..." : "Initialize Default Settings"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const form = new FormData(e.currentTarget as HTMLFormElement);
      
      const payload = {
        companyName: form.get("companyName") as string,
        logoUrl: form.get("logoUrl") as string,
        primaryColor: form.get("primaryColor") as string,
        contact: {
          email: form.get("contactEmail") as string,
          phone: form.get("contactPhone") as string,
          address: form.get("contactAddress") as string,
        },
        social: {
          facebook: form.get("socialFacebook") as string,
          twitter: form.get("socialTwitter") as string,
          instagram: form.get("socialInstagram") as string,
          linkedin: form.get("socialLinkedin") as string,
          youtube: form.get("socialYoutube") as string,
        },
        pages: {
          footerText: form.get("footerText") as string,
          heroSubtitle: form.get("heroSubtitle") as string,
          aboutText: form.get("aboutText") as string,
        },
        metadata: {
          defaultMetaTitle: form.get("defaultMetaTitle") as string,
          defaultMetaDescription: form.get("defaultMetaDescription") as string,
        },
        smtp: {
          host: form.get("smtpHost") as string,
          port: parseInt(form.get("smtpPort") as string) || 587,
          user: form.get("smtpUser") as string,
          password: form.get("smtpPassword") as string,
          secure: form.get("smtpSecure") === "true",
          fromEmail: form.get("smtpFromEmail") as string,
        },
        note: form.get("updateNote") as string,
      };

      // Simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSettings(payload);
      
      toast({
        title: "Settings Updated",
        description: "Website settings have been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all settings to default values?")) {
      handleSeedSettings();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Website Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your website configuration and branding
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="smtp">SMTP</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure your company information and branding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    defaultValue={settings.companyName}
                    placeholder="ExhibitBay"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    name="logoUrl"
                    defaultValue={settings.logoUrl}
                    placeholder="/logo.png"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Input
                    id="primaryColor"
                    name="primaryColor"
                    defaultValue={settings.primaryColor}
                    placeholder="#0070f3"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Public contact details for your business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    defaultValue={settings.contact?.email}
                    placeholder="info@exhibitbay.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    defaultValue={settings.contact?.phone}
                    placeholder="+1234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactAddress">Address</Label>
                  <Textarea
                    id="contactAddress"
                    name="contactAddress"
                    defaultValue={settings.contact?.address}
                    placeholder="123 Business Street, City, Country"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>
                  Links to your social media profiles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="socialFacebook">Facebook</Label>
                  <Input
                    id="socialFacebook"
                    name="socialFacebook"
                    defaultValue={settings.social?.facebook}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialTwitter">Twitter</Label>
                  <Input
                    id="socialTwitter"
                    name="socialTwitter"
                    defaultValue={settings.social?.twitter}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialInstagram">Instagram</Label>
                  <Input
                    id="socialInstagram"
                    name="socialInstagram"
                    defaultValue={settings.social?.instagram}
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialLinkedin">LinkedIn</Label>
                  <Input
                    id="socialLinkedin"
                    name="socialLinkedin"
                    defaultValue={settings.social?.linkedin}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialYoutube">YouTube</Label>
                  <Input
                    id="socialYoutube"
                    name="socialYoutube"
                    defaultValue={settings.social?.youtube}
                    placeholder="https://youtube.com/yourchannel"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Content</CardTitle>
                <CardDescription>
                  Static content for key pages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="footerText">Footer Text</Label>
                  <Textarea
                    id="footerText"
                    name="footerText"
                    defaultValue={settings.pages?.footerText}
                    placeholder="© 2025 Your Company. All rights reserved."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Textarea
                    id="heroSubtitle"
                    name="heroSubtitle"
                    defaultValue={settings.pages?.heroSubtitle}
                    placeholder="Your compelling hero subtitle"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aboutText">About Page Text</Label>
                  <Textarea
                    id="aboutText"
                    name="aboutText"
                    defaultValue={settings.pages?.aboutText}
                    placeholder="About your company..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Metadata</CardTitle>
                <CardDescription>
                  Default meta tags for your website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultMetaTitle">Default Meta Title</Label>
                  <Input
                    id="defaultMetaTitle"
                    name="defaultMetaTitle"
                    defaultValue={settings.metadata?.defaultMetaTitle}
                    placeholder="Your Company - Best Products & Services"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultMetaDescription">Default Meta Description</Label>
                  <Textarea
                    id="defaultMetaDescription"
                    name="defaultMetaDescription"
                    defaultValue={settings.metadata?.defaultMetaDescription}
                    placeholder="Discover the best products and services at Your Company..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="smtp" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SMTP Configuration</CardTitle>
                <CardDescription>
                  Email server settings for sending notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      name="smtpHost"
                      defaultValue={settings.smtp?.host}
                      placeholder="smtp.example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      name="smtpPort"
                      type="number"
                      defaultValue={settings.smtp?.port}
                      placeholder="587"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">Username</Label>
                  <Input
                    id="smtpUser"
                    name="smtpUser"
                    defaultValue={settings.smtp?.user}
                    placeholder="user@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">Password</Label>
                  <Input
                    id="smtpPassword"
                    name="smtpPassword"
                    type="password"
                    defaultValue={settings.smtp?.password}
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="smtpSecure"
                    name="smtpSecure"
                    defaultChecked={settings.smtp?.secure}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="smtpSecure">Use Secure Connection (SSL/TLS)</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpFromEmail">From Email</Label>
                  <Input
                    id="smtpFromEmail"
                    name="smtpFromEmail"
                    type="email"
                    defaultValue={settings.smtp?.fromEmail}
                    placeholder="noreply@example.com"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="updateNote">Update Note (Optional)</Label>
                  <Textarea
                    id="updateNote"
                    name="updateNote"
                    placeholder="Brief description of changes made..."
                    rows={2}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setSettings(initialSettings)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Tabs>
      </form>
    </div>
  );
}