"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from '@/components/ThemeProvider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  Building2,
  TrendingUp,
  DollarSign,
  MessageSquare,
  Star,
  Globe,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  UserPlus,
  Activity,
  FileText,
  CreditCard,
  Settings,
  Shield,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  MapPin,
  Zap,
  Trash2,
  Upload,
  Edit,
  Plus,
  Save,
  ExternalLink,
  Database,
  HardDrive,
  UserCheck,
  Mail,
  Target,
  CheckSquare,
  User,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  EyeIcon,
  Pencil,
  Archive,
  Ban,
  Check,
  X,
  Flag,
  Package,
  Key,
  Lock,
  Verified,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Info,
  Play,
  Pause,
  Square,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  GitDiff,
  Code,
  Terminal,
  Command,
  PlayCircle,
  Stop,
  SkipBack,
  SkipForward,
  RotateCw,
  RefreshCw as RefreshCwIcon,
  TrendingDown,
  ShoppingCart,
  Receipt,
  Wallet,
  PiggyBank,
  Coins,
  Gem,
  Scale,
  Truck,
  Ship,
  Plane,
  Train,
  Car,
  Bike,
  Fuel,
  GasStation,
  ChargingStation,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  BatteryWarning,
  BatteryCritical,
  Power,
  Zap as ZapIcon,
  LightningBolt,
  Sun as SunIcon,
  Moon as MoonIcon,
  Cloud as CloudIcon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  CloudHaze,
  CloudSun,
  CloudMoon,
  Cloudy,
  SunDim,
  SunMedium,
  SunBright,
  MoonStar,
  Stars,
  Sparkles,
  Wind,
  Tornado,
  Hurricane,
  Snowflake,
  Thermometer,
  ThermometerSun,
  ThermometerSnowflake,
  Droplets,
  Umbrella,
  UmbrellaClosed,
  Rainbow,
  Flower,
  Leaf,
  Sprout,
  Seedling,
  TreeDeciduous,
  TreePine,
  Waves as WavesIcon,
  Anchor as AnchorIcon,
  Sailboat,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  CalendarArrowUp,
  CalendarArrowDown,
  Settings2,
  Server,
  Network,
  Router,
  Cpu,
  MemoryStick,
  Database as DatabaseIcon,
  HardDrive as HardDriveIcon,
  Monitor,
  Printer,
  Camera,
  Video,
  Speaker,
  Headphones,
  Gamepad2,
  Watch,
  Battery,
  BatteryCharging,
  Wifi,
  Bluetooth,
  Signal,
  Globe as GlobeIcon,
  Link,
  Unlock,
  Lock as LockIcon,
  ShieldCheck as ShieldCheckIcon,
  ShieldAlert as ShieldAlertIcon,
  Shield as ShieldIcon,
  Key as KeyIcon,
  Eye as EyeIconHidden,
  EyeOff,
  Copy,
  Share2,
  Archive as ArchiveIcon,
  Unarchive,
  Ban as BanIcon,
  Flag as FlagIcon,
  ArchiveRestore,
  RotateCcw,
  RefreshCcw,
  UploadCloud,
  DownloadCloud,
  Cloud,
  CloudUpload,
  CloudDownload,
  HardDriveUpload,
  HardDriveDownload,
} from "lucide-react";

interface SystemConfig {
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
    from: string;
  };
  sms: {
    provider: string;
    apiKey: string;
    secretKey: string;
    phoneNumber: string;
  };
  domain: {
    provider: string;
    apiKey: string;
    zoneId: string;
    dnsRecords: string[];
  };
  aiProviders: {
    openai: {
      apiKey: string;
      model: string;
    };
    gemini: {
      apiKey: string;
      model: string;
    };
    anthropic: {
      apiKey: string;
      model: string;
    };
  };
  featureFlags: {
    enableEmail: boolean;
    enableSms: boolean;
    enableAiFeatures: boolean;
    enableAdvancedAnalytics: boolean;
    enableCustomDomains: boolean;
  };
  maintenanceMode: boolean;
  backupConfig: {
    enabled: boolean;
    schedule: string;
    retentionDays: number;
    storageLocation: string;
  };
}

const SystemSettings = () => {
  const { theme } = useTheme();
  const [config, setConfig] = useState<SystemConfig>({
    smtp: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      username: '',
      password: '',
      from: 'noreply@yourdomain.com'
    },
    sms: {
      provider: 'twilio',
      apiKey: '',
      secretKey: '',
      phoneNumber: ''
    },
    domain: {
      provider: 'cloudflare',
      apiKey: '',
      zoneId: '',
      dnsRecords: []
    },
    aiProviders: {
      openai: {
        apiKey: '',
        model: 'gpt-4'
      },
      gemini: {
        apiKey: '',
        model: 'gemini-pro'
      },
      anthropic: {
        apiKey: '',
        model: 'claude-3-opus'
      }
    },
    featureFlags: {
      enableEmail: true,
      enableSms: true,
      enableAiFeatures: true,
      enableAdvancedAnalytics: true,
      enableCustomDomains: true
    },
    maintenanceMode: false,
    backupConfig: {
      enabled: true,
      schedule: 'daily',
      retentionDays: 30,
      storageLocation: 'aws-s3'
    }
  });
  const [activeTab, setActiveTab] = useState('email');
  const [saving, setSaving] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  const handleSave = () => {
    setSaving(true);
    // Simulate saving configuration
    setTimeout(() => {
      setSaving(false);
      alert('Configuration saved successfully!');
    }, 1500);
  };

  const handleTestEmail = () => {
    // Simulate sending test email
    alert(`Test email sent to ${testEmail}`);
  };

  const handleToggleFeatureFlag = (flag: keyof SystemConfig['featureFlags']) => {
    setConfig(prev => ({
      ...prev,
      featureFlags: {
        ...prev.featureFlags,
        [flag]: !prev.featureFlags[flag]
      }
    }));
  };

  const toggleMaintenanceMode = () => {
    setConfig(prev => ({
      ...prev,
      maintenanceMode: !prev.maintenanceMode
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure global settings for the platform
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Maintenance Mode Banner */}
      {config.maintenanceMode && (
        <div className="rounded-md bg-yellow-50 dark:bg-yellow-950 p-4 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Maintenance Mode Active</h3>
              <p className="text-sm text-yellow-600 dark:text-yellow-300">
                The platform is currently in maintenance mode. Only administrators can access the system.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="domain">Domain</TabsTrigger>
          <TabsTrigger value="ai">AI Providers</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        {/* Email Configuration */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Configure SMTP settings for email delivery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="smtp-host" className="block text-sm font-medium mb-1">
                    SMTP Host
                  </label>
                  <Input
                    id="smtp-host"
                    value={config.smtp.host}
                    onChange={(e) => setConfig({...config, smtp: {...config.smtp, host: e.target.value}})}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label htmlFor="smtp-port" className="block text-sm font-medium mb-1">
                    Port
                  </label>
                  <Input
                    id="smtp-port"
                    type="number"
                    value={config.smtp.port}
                    onChange={(e) => setConfig({...config, smtp: {...config.smtp, port: parseInt(e.target.value)}})}
                    placeholder="587"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="smtp-username" className="block text-sm font-medium mb-1">
                    Username
                  </label>
                  <Input
                    id="smtp-username"
                    value={config.smtp.username}
                    onChange={(e) => setConfig({...config, smtp: {...config.smtp, username: e.target.value}})}
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div>
                  <label htmlFor="smtp-password" className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="smtp-password"
                      type="password"
                      value={config.smtp.password}
                      onChange={(e) => setConfig({...config, smtp: {...config.smtp, password: e.target.value}})}
                      placeholder="••••••••"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      <EyeIconHidden className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="smtp-from" className="block text-sm font-medium mb-1">
                  From Address
                </label>
                <Input
                  id="smtp-from"
                  value={config.smtp.from}
                  onChange={(e) => setConfig({...config, smtp: {...config.smtp, from: e.target.value}})}
                  placeholder="noreply@yourdomain.com"
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Input
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Enter email to send test"
                />
                <Button onClick={handleTestEmail}>Send Test Email</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS Configuration */}
        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle>SMS Configuration</CardTitle>
              <CardDescription>Configure SMS settings for notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sms-provider" className="block text-sm font-medium mb-1">
                    Provider
                  </label>
                  <Select 
                    value={config.sms.provider} 
                    onValueChange={(value) => setConfig({...config, sms: {...config.sms, provider: value}})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="nexmo">Nexmo</SelectItem>
                      <SelectItem value="aws-sns">AWS SNS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="sms-phone-number" className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <Input
                    id="sms-phone-number"
                    value={config.sms.phoneNumber}
                    onChange={(e) => setConfig({...config, sms: {...config.sms, phoneNumber: e.target.value}})}
                    placeholder="+1234567890"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sms-api-key" className="block text-sm font-medium mb-1">
                    API Key
                  </label>
                  <Input
                    id="sms-api-key"
                    type="password"
                    value={config.sms.apiKey}
                    onChange={(e) => setConfig({...config, sms: {...config.sms, apiKey: e.target.value}})}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label htmlFor="sms-secret-key" className="block text-sm font-medium mb-1">
                    Secret Key
                  </label>
                  <div className="relative">
                    <Input
                      id="sms-secret-key"
                      type="password"
                      value={config.sms.secretKey}
                      onChange={(e) => setConfig({...config, sms: {...config.sms, secretKey: e.target.value}})}
                      placeholder="••••••••"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      <EyeIconHidden className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Domain Configuration */}
        <TabsContent value="domain">
          <Card>
            <CardHeader>
              <CardTitle>Domain Configuration</CardTitle>
              <CardDescription>Configure domain provider settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="domain-provider" className="block text-sm font-medium mb-1">
                    Provider
                  </label>
                  <Select 
                    value={config.domain.provider} 
                    onValueChange={(value) => setConfig({...config, domain: {...config.domain, provider: value}})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cloudflare">Cloudflare</SelectItem>
                      <SelectItem value="route53">AWS Route 53</SelectItem>
                      <SelectItem value="cloud-dns">Google Cloud DNS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="domain-zone-id" className="block text-sm font-medium mb-1">
                    Zone ID
                  </label>
                  <Input
                    id="domain-zone-id"
                    value={config.domain.zoneId}
                    onChange={(e) => setConfig({...config, domain: {...config.domain, zoneId: e.target.value}})}
                    placeholder="Zone ID"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="domain-api-key" className="block text-sm font-medium mb-1">
                  API Key
                </label>
                <div className="relative">
                  <Input
                    id="domain-api-key"
                    type="password"
                    value={config.domain.apiKey}
                    onChange={(e) => setConfig({...config, domain: {...config.domain, apiKey: e.target.value}})}
                    placeholder="••••••••"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    <EyeIconHidden className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">DNS Records</h3>
                <div className="border rounded-md p-4">
                  <p className="text-sm text-muted-foreground">Configure DNS records for custom domains</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add DNS Record
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Providers */}
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI Provider Configuration</CardTitle>
              <CardDescription>Configure AI services for platform intelligence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">OpenAI</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="openai-api-key" className="block text-sm font-medium mb-1">
                      API Key
                    </label>
                    <div className="relative">
                      <Input
                        id="openai-api-key"
                        type="password"
                        value={config.aiProviders.openai.apiKey}
                        onChange={(e) => setConfig({
                          ...config, 
                          aiProviders: {
                            ...config.aiProviders, 
                            openai: {
                              ...config.aiProviders.openai, 
                              apiKey: e.target.value
                            }
                          }
                        })}
                        placeholder="••••••••"
                      />
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        <EyeIconHidden className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="openai-model" className="block text-sm font-medium mb-1">
                      Model
                    </label>
                    <Select 
                      value={config.aiProviders.openai.model} 
                      onValueChange={(value) => setConfig({
                        ...config, 
                        aiProviders: {
                          ...config.aiProviders, 
                          openai: {
                            ...config.aiProviders.openai, 
                            model: value
                          }
                        }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Gemini</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="gemini-api-key" className="block text-sm font-medium mb-1">
                      API Key
                    </label>
                    <div className="relative">
                      <Input
                        id="gemini-api-key"
                        type="password"
                        value={config.aiProviders.gemini.apiKey}
                        onChange={(e) => setConfig({
                          ...config, 
                          aiProviders: {
                            ...config.aiProviders, 
                            gemini: {
                              ...config.aiProviders.gemini, 
                              apiKey: e.target.value
                            }
                          }
                        })}
                        placeholder="••••••••"
                      />
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        <EyeIconHidden className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="gemini-model" className="block text-sm font-medium mb-1">
                      Model
                    </label>
                    <Select 
                      value={config.aiProviders.gemini.model} 
                      onValueChange={(value) => setConfig({
                        ...config, 
                        aiProviders: {
                          ...config.aiProviders, 
                          gemini: {
                            ...config.aiProviders.gemini, 
                            model: value
                          }
                        }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                        <SelectItem value="gemini-pro-vision">Gemini Pro Vision</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Anthropic</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="anthropic-api-key" className="block text-sm font-medium mb-1">
                      API Key
                    </label>
                    <div className="relative">
                      <Input
                        id="anthropic-api-key"
                        type="password"
                        value={config.aiProviders.anthropic.apiKey}
                        onChange={(e) => setConfig({
                          ...config, 
                          aiProviders: {
                            ...config.aiProviders, 
                            anthropic: {
                              ...config.aiProviders.anthropic, 
                              apiKey: e.target.value
                            }
                          }
                        })}
                        placeholder="••••••••"
                      />
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        <EyeIconHidden className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="anthropic-model" className="block text-sm font-medium mb-1">
                      Model
                    </label>
                    <Select 
                      value={config.aiProviders.anthropic.model} 
                      onValueChange={(value) => setConfig({
                        ...config, 
                        aiProviders: {
                          ...config.aiProviders, 
                          anthropic: {
                            ...config.aiProviders.anthropic, 
                            model: value
                          }
                        }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                        <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feature Flags */}
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>Enable or disable platform features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Enable email notifications for users</p>
                  </div>
                  <Button
                    variant={config.featureFlags.enableEmail ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToggleFeatureFlag('enableEmail')}
                  >
                    {config.featureFlags.enableEmail ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-muted-foreground">Enable SMS notifications for users</p>
                  </div>
                  <Button
                    variant={config.featureFlags.enableSms ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToggleFeatureFlag('enableSms')}
                  >
                    {config.featureFlags.enableSms ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">AI Features</h3>
                    <p className="text-sm text-muted-foreground">Enable AI-powered insights and automation</p>
                  </div>
                  <Button
                    variant={config.featureFlags.enableAiFeatures ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToggleFeatureFlag('enableAiFeatures')}
                  >
                    {config.featureFlags.enableAiFeatures ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">Advanced Analytics</h3>
                    <p className="text-sm text-muted-foreground">Enable advanced analytics and reporting</p>
                  </div>
                  <Button
                    variant={config.featureFlags.enableAdvancedAnalytics ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToggleFeatureFlag('enableAdvancedAnalytics')}
                  >
                    {config.featureFlags.enableAdvancedAnalytics ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">Custom Domains</h3>
                    <p className="text-sm text-muted-foreground">Allow users to set custom domains</p>
                  </div>
                  <Button
                    variant={config.featureFlags.enableCustomDomains ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToggleFeatureFlag('enableCustomDomains')}
                  >
                    {config.featureFlags.enableCustomDomains ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Mode */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Mode</CardTitle>
              <CardDescription>Temporarily disable public access to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">Maintenance Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    {config.maintenanceMode 
                      ? 'Platform is in maintenance mode. Only administrators can access.' 
                      : 'Platform is operational. All users have access.'}
                  </p>
                </div>
                <Button
                  variant={config.maintenanceMode ? "destructive" : "default"}
                  size="sm"
                  onClick={toggleMaintenanceMode}
                >
                  {config.maintenanceMode ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Maintenance Message</h3>
                <Textarea
                  placeholder="Enter a message to display to users during maintenance..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Configuration */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup Configuration</CardTitle>
              <CardDescription>Configure automated backups for platform data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="backup-enabled"
                  checked={config.backupConfig.enabled}
                  onChange={(e) => setConfig({
                    ...config, 
                    backupConfig: {
                      ...config.backupConfig, 
                      enabled: e.target.checked
                    }
                  })}
                  className="h-4 w-4"
                />
                <label htmlFor="backup-enabled" className="text-sm font-medium">
                  Enable Automated Backups
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="backup-schedule" className="block text-sm font-medium mb-1">
                    Schedule
                  </label>
                  <Select 
                    value={config.backupConfig.schedule} 
                    onValueChange={(value) => setConfig({
                      ...config, 
                      backupConfig: {
                        ...config.backupConfig, 
                        schedule: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="retention-days" className="block text-sm font-medium mb-1">
                    Retention Days
                  </label>
                  <Input
                    id="retention-days"
                    type="number"
                    value={config.backupConfig.retentionDays}
                    onChange={(e) => setConfig({
                      ...config, 
                      backupConfig: {
                        ...config.backupConfig, 
                        retentionDays: parseInt(e.target.value)
                      }
                    })}
                    placeholder="30"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="storage-location" className="block text-sm font-medium mb-1">
                  Storage Location
                </label>
                <Select 
                  value={config.backupConfig.storageLocation} 
                  onValueChange={(value) => setConfig({
                    ...config, 
                    backupConfig: {
                      ...config.backupConfig, 
                      storageLocation: value
                    }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aws-s3">AWS S3</SelectItem>
                    <SelectItem value="gcp-storage">Google Cloud Storage</SelectItem>
                    <SelectItem value="azure-blob">Azure Blob Storage</SelectItem>
                    <SelectItem value="local">Local Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4">
                <Button>
                  <HardDriveUpload className="h-4 w-4 mr-2" />
                  Run Manual Backup Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;