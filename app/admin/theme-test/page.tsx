import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Sun, 
  Moon, 
  Palette, 
  Monitor, 
  Smartphone, 
  Tablet,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';

export default function ThemeTestPage() {
  return (
    <AdminLayout sidebar={<Sidebar />} topbar={<Topbar />}>
      <div className="space-y-8">
        {/* Header */}
        <div className="premium-glass-card p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Theme Test Page</h1>
              <p className="text-gray-400 mt-1">Test all UI components in both light and dark modes</p>
            </div>
          </div>
        </div>

        {/* Theme Switcher */}
        <div className="premium-glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Theme Switcher</h2>
          <p className="text-gray-400 mb-4">Use the theme switcher in the sidebar or topbar to toggle between light and dark modes.</p>
        </div>

        {/* Buttons */}
        <div className="premium-glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button>Default Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="link">Link Button</Button>
          </div>
        </div>

        {/* Form Elements */}
        <div className="premium-glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Form Elements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Input Field</label>
                <Input placeholder="Enter text here" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Textarea</label>
                <Textarea placeholder="Enter detailed text here" rows={4} />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Select Field</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="premium-glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Badges</h2>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="premium-glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Progress: 65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="premium-glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Alerts</h2>
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                This is an informational alert message.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                This is an error alert message.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Cards */}
        <div className="premium-glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>Card description text</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">This is a default card component with some sample content.</p>
              </CardContent>
            </Card>
            <Card className="premium-stat-card">
              <CardHeader>
                <CardTitle>Premium Card</CardTitle>
                <CardDescription>Premium card description</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">This is a premium card component with enhanced styling.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}