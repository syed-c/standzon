"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, FormEvent } from "react";
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

  const currentUser = useQuery(api.auth.currentUser, {}, { enabled: false }) || initialUser;
  const settings = useQuery(api.siteSettings.getSiteSettings, {}) || initialSettings;
  const upsertSettings = useMutation(api.siteSettings.upsertSiteSettings);
  const seedSettings = useMutation(api.siteSettings.seedInitialSettings);
  
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Loading states
  if (currentUser === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user...</p>
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
  if (currentUser.role !== "superadmin") {
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
      const result = await seedSettings({});
      if (result.success) {
        toast({
          title: "Settings Initialized",
          description: "Default website settings have been created successfully.",
        });
      } else {
        toast({
          title: "Settings Already Exist",
          description: result.message,
          variant: "destructive",
        });
      }
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

      await upsertSettings({ payload });
      
      toast({
        title: "Settings Updated",
        description: "Website settings have been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Settings</h1>
        <p className="text-gray-600">
          Manage all website content, contact information, and branding from this central dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="smtp">SMTP Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Basic company information and branding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      defaultValue={settings.companyName || ""}
                      placeholder="StandsZone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <Input
                      id="primaryColor"
                      name="primaryColor"
                      type="color"
                      defaultValue={settings.primaryColor || "#ec4899"}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    name="logoUrl"
                    defaultValue={settings.logoUrl || ""}
                    placeholder="https://example.com/logo.png"
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
                  Contact details displayed throughout the website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contactEmail">Email Address</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    defaultValue={settings.contact?.email || ""}
                    placeholder="hello@standszone.com"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Phone Number</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    defaultValue={settings.contact?.phone || ""}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="contactAddress">Address</Label>
                  <Textarea
                    id="contactAddress"
                    name="contactAddress"
                    defaultValue={settings.contact?.address || ""}
                    placeholder="123 Exhibition Ave, NYC"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>
                  Social media profiles and links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="socialFacebook">Facebook</Label>
                    <Input
                      id="socialFacebook"
                      name="socialFacebook"
                      defaultValue={settings.social?.facebook || ""}
                      placeholder="https://facebook.com/standszone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="socialTwitter">Twitter</Label>
                    <Input
                      id="socialTwitter"
                      name="socialTwitter"
                      defaultValue={settings.social?.twitter || ""}
                      placeholder="https://twitter.com/standszone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="socialInstagram">Instagram</Label>
                    <Input
                      id="socialInstagram"
                      name="socialInstagram"
                      defaultValue={settings.social?.instagram || ""}
                      placeholder="https://instagram.com/standszone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="socialLinkedin">LinkedIn</Label>
                    <Input
                      id="socialLinkedin"
                      name="socialLinkedin"
                      defaultValue={settings.social?.linkedin || ""}
                      placeholder="https://linkedin.com/company/standszone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="socialYoutube">YouTube</Label>
                    <Input
                      id="socialYoutube"
                      name="socialYoutube"
                      defaultValue={settings.social?.youtube || ""}
                      placeholder="https://youtube.com/@standszone"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Content</CardTitle>
                <CardDescription>
                  Manage key website content and SEO metadata
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="footerText">Footer Description</Label>
                  <Textarea
                    id="footerText"
                    name="footerText"
                    defaultValue={settings.pages?.footerText || ""}
                    placeholder="Creating extraordinary exhibition experiences..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Input
                    id="heroSubtitle"
                    name="heroSubtitle"
                    defaultValue={settings.pages?.heroSubtitle || ""}
                    placeholder="Connect with verified exhibition stand builders worldwide"
                  />
                </div>
                <div>
                  <Label htmlFor="aboutText">About Text</Label>
                  <Textarea
                    id="aboutText"
                    name="aboutText"
                    defaultValue={settings.pages?.aboutText || ""}
                    placeholder="We are the leading platform..."
                    rows={3}
                  />
                </div>
                <Separator />
                <div>
                  <Label htmlFor="defaultMetaTitle">Default Meta Title</Label>
                  <Input
                    id="defaultMetaTitle"
                    name="defaultMetaTitle"
                    defaultValue={settings.metadata?.defaultMetaTitle || ""}
                    placeholder="StandsZone - Global Exhibition Stand Builders Directory"
                  />
                </div>
                <div>
                  <Label htmlFor="defaultMetaDescription">Default Meta Description</Label>
                  <Textarea
                    id="defaultMetaDescription"
                    name="defaultMetaDescription"
                    defaultValue={settings.metadata?.defaultMetaDescription || ""}
                    placeholder="Find and connect with verified exhibition stand builders worldwide..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="smtp" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SMTP Email Configuration</CardTitle>
                <CardDescription>
                  Configure SMTP settings for sending emails from the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      name="smtpHost"
                      defaultValue={settings.smtp?.host || ""}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      name="smtpPort"
                      type="number"
                      defaultValue={settings.smtp?.port || "587"}
                      placeholder="587"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpUser">SMTP Username/Email</Label>
                    <Input
                      id="smtpUser"
                      name="smtpUser"
                      type="email"
                      defaultValue={settings.smtp?.user || ""}
                      placeholder="your-email@gmail.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      name="smtpPassword"
                      type="password"
                      defaultValue={settings.smtp?.password || ""}
                      placeholder="Your app password or SMTP password"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpSecure">Encryption</Label>
                    <select
                      id="smtpSecure"
                      name="smtpSecure"
                      defaultValue={settings.smtp?.secure ? "true" : "false"}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="false">TLS (Port 587)</option>
                      <option value="true">SSL (Port 465)</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="smtpFromEmail">From Email</Label>
                    <Input
                      id="smtpFromEmail"
                      name="smtpFromEmail"
                      type="email"
                      defaultValue={settings.smtp?.fromEmail || ""}
                      placeholder="noreply@standszone.com"
                    />
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">📧 SMTP Configuration Help</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Gmail:</strong> Use smtp.gmail.com, port 587, and an App Password</li>
                    <li>• <strong>Outlook:</strong> Use smtp-mail.outlook.com, port 587</li>
                    <li>• <strong>Custom SMTP:</strong> Contact your email provider for settings</li>
                    <li>• <strong>Security:</strong> Enable 2FA and use App Passwords when available</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="updateNote">Update Note (Optional)</Label>
                <Input
                  id="updateNote"
                  name="updateNote"
                  placeholder="Brief description of changes made..."
                  className="mt-1"
                />
              </div>
              <Button 
                type="submit" 
                disabled={saving}
                className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
              >
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}