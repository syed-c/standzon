'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, Upload, RefreshCw, Eye, Edit, Trash2, Plus, Send, 
  CheckCircle, AlertTriangle, Target, Brain, Zap, Star 
} from 'lucide-react';

export function InteractiveActions({ 
  type, 
  itemId, 
  onRefresh, 
  className = "" 
}: { 
  type: string; 
  itemId?: string; 
  onRefresh?: () => void; 
  className?: string; 
}) {
  const { toast } = useToast();

  const handleAction = (action: string, item?: string) => {
    console.log(`Executing ${action} action on ${type}${item ? ` (${item})` : ''}`);
    
    // Show appropriate toast notification
    const actionMessages = {
      view: "Opening detailed view...",
      edit: "Opening edit form...", 
      delete: "Item deleted successfully",
      refresh: "Data refreshed from server",
      download: "Download started...",
      upload: "Upload initiated...",
      assign: "Assignment completed",
      approve: "Item approved",
      reject: "Item rejected",
      activate: "Item activated",
      deactivate: "Item deactivated"
    };

    toast({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} ${type}`,
      description: actionMessages[action as keyof typeof actionMessages] || `${action} completed successfully`,
      duration: 3000,
    });

    // Execute refresh if provided
    if (onRefresh && ['delete', 'edit', 'activate', 'deactivate', 'approve'].includes(action)) {
      setTimeout(() => {
        onRefresh();
      }, 1000);
    }
  };

  const getActionButtons = () => {
    switch (type) {
      case 'builder':
        return [
          { action: 'view', icon: Eye, variant: 'outline' as const },
          { action: 'edit', icon: Edit, variant: 'outline' as const },
          { action: 'activate', icon: CheckCircle, variant: 'default' as const }
        ];
      case 'lead':
        return [
          { action: 'view', icon: Eye, variant: 'outline' as const },
          { action: 'assign', icon: Target, variant: 'default' as const },
          { action: 'approve', icon: CheckCircle, variant: 'default' as const }
        ];
      case 'event':
        return [
          { action: 'view', icon: Eye, variant: 'outline' as const },
          { action: 'edit', icon: Edit, variant: 'outline' as const },
          { action: 'delete', icon: Trash2, variant: 'destructive' as const }
        ];
      case 'insight':
        return [
          { action: 'view', icon: Eye, variant: 'outline' as const },
          { action: 'assign', icon: Send, variant: 'default' as const }
        ];
      default:
        return [
          { action: 'view', icon: Eye, variant: 'outline' as const }
        ];
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {getActionButtons().map(({ action, icon: Icon, variant }) => (
        <Button
          key={action}
          size="sm"
          variant={variant}
          onClick={() => handleAction(action, itemId)}
          className="h-8 w-8 p-0"
        >
          <Icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
}

export function SmartStatusBadge({ 
  status, 
  type = "default" 
}: { 
  status: string; 
  type?: string; 
}) {
  const getStatusConfig = () => {
    const statusMap: Record<string, { className: string; icon?: any }> = {
      // Builder statuses
      active: { className: "bg-green-100 text-green-800", icon: CheckCircle },
      inactive: { className: "bg-red-100 text-red-800", icon: AlertTriangle },
      pending: { className: "bg-yellow-100 text-yellow-800", icon: AlertTriangle },
      
      // Lead statuses
      new: { className: "bg-blue-100 text-blue-800", icon: Plus },
      assigned: { className: "bg-purple-100 text-purple-800", icon: Target },
      responded: { className: "bg-orange-100 text-orange-800", icon: Send },
      converted: { className: "bg-green-100 text-green-800", icon: CheckCircle },
      
      // Event statuses
      published: { className: "bg-green-100 text-green-800", icon: CheckCircle },
      draft: { className: "bg-gray-100 text-gray-800", icon: Edit },
      review: { className: "bg-yellow-100 text-yellow-800", icon: Eye },
      
      // Priority levels
      critical: { className: "bg-red-100 text-red-800", icon: AlertTriangle },
      high: { className: "bg-orange-100 text-orange-800", icon: Star },
      medium: { className: "bg-blue-100 text-blue-800", icon: CheckCircle },
      low: { className: "bg-gray-100 text-gray-800", icon: CheckCircle },
    };

    return statusMap[status.toLowerCase()] || { className: "bg-gray-100 text-gray-800" };
  };

  const { className, icon: Icon } = getStatusConfig();

  return (
    <Badge className={`${className} flex items-center space-x-1`}>
      {Icon && <Icon className="h-3 w-3" />}
      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </Badge>
  );
}

export function RealTimeIndicator({ 
  isLive = true, 
  lastUpdate = "now" 
}: { 
  isLive?: boolean; 
  lastUpdate?: string; 
}) {
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
      <span className="text-xs text-gray-500">
        {isLive ? 'Live' : `Updated ${lastUpdate}`}
      </span>
    </div>
  );
}

export function PerformanceScore({ 
  score, 
  size = "default" 
}: { 
  score: number; 
  size?: "sm" | "default" | "lg"; 
}) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    default: "w-12 h-12 text-sm", 
    lg: "w-16 h-16 text-base"
  };

  const getScoreColor = () => {
    if (score >= 90) return "text-green-600 border-green-500";
    if (score >= 80) return "text-blue-600 border-blue-500";
    if (score >= 70) return "text-yellow-600 border-yellow-500";
    return "text-red-600 border-red-500";
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full border-2 ${getScoreColor()} flex items-center justify-center font-bold bg-white`}>
      {score}
    </div>
  );
}

export function QuickActions({ 
  actions, 
  onAction 
}: { 
  actions: Array<{name: string; icon: any; variant?: "default" | "outline" | "destructive"}>; 
  onAction: (action: string) => void; 
}) {
  return (
    <div className="flex items-center space-x-2">
      {actions.map(({ name, icon: Icon, variant = "outline" }) => (
        <Button
          key={name}
          size="sm"
          variant={variant}
          onClick={() => onAction(name)}
          className="flex items-center space-x-1"
        >
          <Icon className="h-4 w-4" />
          <span className="text-xs">{name}</span>
        </Button>
      ))}
    </div>
  );
}