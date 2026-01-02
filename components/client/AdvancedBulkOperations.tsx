'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import { Badge } from '@/components/shared/badge';
import { Input } from '@/components/shared/input';
import { Label } from '@/components/shared/label';
import { Textarea } from '@/components/shared/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/select';
import { Checkbox } from '@/components/shared/checkbox';
import { Progress } from '@/components/shared/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/tabs';
import { 
  Upload,
  Download,
  CheckCircle,
  X,
  Users,
  Building,
  MapPin,
  Star,
  AlertTriangle,
  Play,
  Pause,
  Settings,
  FileText,
  Filter,
  Zap,
  Clock,
  RefreshCw,
  Trash2,
  Edit,
  Tag,
  Mail,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface BulkOperation {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error' | 'paused';
  progress: number;
  totalItems: number;
  processedItems: number;
  successItems: number;
  errorItems: number;
  startTime?: string;
  endTime?: string;
  logs: Array<{
    timestamp: string;
    level: 'info' | 'success' | 'warning' | 'error';
    message: string;
  }>;
}

interface SelectedItem {
  id: string;
  name: string;
  type: 'builder' | 'lead' | 'exhibition' | 'country' | 'city';
  status?: string;
  metadata?: any;
}

interface AdvancedBulkOperationsProps {
  selectedItems: SelectedItem[];
  onSelectionChange: (items: SelectedItem[]) => void;
  availableItems: SelectedItem[];
  onOperationComplete: (operation: BulkOperation) => void;
}

export default function AdvancedBulkOperations({
  selectedItems,
  onSelectionChange,
  availableItems,
  onOperationComplete
}: AdvancedBulkOperationsProps) {
  const [activeOperation, setActiveOperation] = useState<BulkOperation | null>(null);
  const [operationHistory, setOperationHistory] = useState<BulkOperation[]>([]);
  const [operationType, setOperationType] = useState<string>('');
  const [operationSettings, setOperationSettings] = useState<any>({});
  const [isRunning, setIsRunning] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any[]>([]);

  const operationTypes = [
    {
      id: 'approve_builders',
      name: 'Approve Builders',
      description: 'Bulk approve selected builders for verification',
      icon: CheckCircle,
      color: 'text-green-600',
      requiresSettings: false,
      supportedTypes: ['builder']
    },
    {
      id: 'reject_builders', 
      name: 'Reject Builders',
      description: 'Bulk reject selected builders with reason',
      icon: X,
      color: 'text-red-600',
      requiresSettings: true,
      supportedTypes: ['builder']
    },
    {
      id: 'update_status',
      name: 'Update Status',
      description: 'Change status for multiple items',
      icon: Edit,
      color: 'text-blue-600',
      requiresSettings: true,
      supportedTypes: ['builder', 'lead', 'exhibition']
    },
    {
      id: 'assign_tags',
      name: 'Assign Tags',
      description: 'Add tags to selected items',
      icon: Tag,
      color: 'text-purple-600',
      requiresSettings: true,
      supportedTypes: ['builder', 'exhibition']
    },
    {
      id: 'send_notifications',
      name: 'Send Notifications',
      description: 'Send bulk email notifications',
      icon: Mail,
      color: 'text-orange-600',
      requiresSettings: true,
      supportedTypes: ['builder', 'lead']
    },
    {
      id: 'export_data',
      name: 'Export Data',
      description: 'Export selected items to CSV/Excel',
      icon: Download,
      color: 'text-indigo-600',
      requiresSettings: true,
      supportedTypes: ['builder', 'lead', 'exhibition', 'country', 'city']
    },
    {
      id: 'delete_items',
      name: 'Delete Items',
      description: 'Permanently delete selected items',
      icon: Trash2,
      color: 'text-red-600',
      requiresSettings: false,
      supportedTypes: ['builder', 'lead', 'exhibition']
    }
  ];

  const mockRunOperation = useCallback(async (type: string, items: SelectedItem[], settings: any) => {
    const operation: BulkOperation = {
      id: Date.now().toString(),
      name: operationTypes.find(op => op.id === type)?.name || 'Unknown Operation',
      description: `Processing ${items.length} items`,
      status: 'running',
      progress: 0,
      totalItems: items.length,
      processedItems: 0,
      successItems: 0,
      errorItems: 0,
      startTime: new Date().toISOString(),
      logs: [{
        timestamp: new Date().toISOString(),
        level: 'info',
        message: `Operation started with ${items.length} items`
      }]
    };

    setActiveOperation(operation);
    setIsRunning(true);

    // Simulate processing
    for (let i = 0; i < items.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time
      
      const success = Math.random() > 0.1; // 90% success rate
      
      const updatedOperation = {
        ...operation,
        progress: Math.round(((i + 1) / items.length) * 100),
        processedItems: i + 1,
        successItems: operation.successItems + (success ? 1 : 0),
        errorItems: operation.errorItems + (success ? 0 : 1),
        logs: [
          ...operation.logs,
          {
            timestamp: new Date().toISOString(),
            level: success ? 'success' as const : 'error' as const,
            message: success 
              ? `Successfully processed ${items[i].name}`
              : `Failed to process ${items[i].name}: Error occurred`
          }
        ]
      };

      setActiveOperation(updatedOperation);
    }

    const finalOperation = {
      ...operation,
      status: 'completed' as const,
      progress: 100,
      processedItems: items.length,
      endTime: new Date().toISOString(),
      logs: [
        ...operation.logs,
        {
          timestamp: new Date().toISOString(),
          level: 'info' as const,
          message: `Operation completed. ${operation.successItems} successful, ${operation.errorItems} errors`
        }
      ]
    };

    setActiveOperation(finalOperation);
    setOperationHistory(prev => [finalOperation, ...prev]);
    setIsRunning(false);
    onOperationComplete(finalOperation);

    toast.success(`Operation completed successfully!`, {
      description: `Processed ${items.length} items with ${finalOperation.successItems} successes`
    });
  }, [operationTypes, onOperationComplete]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      
      // Mock CSV parsing
      const mockPreview = [
        { name: 'Demo Builder 1', email: 'demo1@example.com', country: 'Germany', city: 'Berlin' },
        { name: 'Demo Builder 2', email: 'demo2@example.com', country: 'UAE', city: 'Dubai' },
        { name: 'Demo Builder 3', email: 'demo3@example.com', country: 'USA', city: 'Las Vegas' }
      ];
      setImportPreview(mockPreview);
      
      toast.success('CSV file uploaded successfully', {
        description: `Preview shows ${mockPreview.length} items ready for import`
      });
    } else {
      toast.error('Please upload a valid CSV file');
    }
  };

  const startOperation = () => {
    if (!operationType || selectedItems.length === 0) {
      toast.error('Please select operation type and items');
      return;
    }

    const selectedOperation = operationTypes.find(op => op.id === operationType);
    if (selectedOperation?.requiresSettings && !Object.keys(operationSettings).length) {
      toast.error('Please configure operation settings');
      return;
    }

    mockRunOperation(operationType, selectedItems, operationSettings);
  };

  const pauseOperation = () => {
    if (activeOperation) {
      setActiveOperation(prev => prev ? { ...prev, status: 'paused' } : null);
      setIsRunning(false);
      toast.info('Operation paused');
    }
  };

  const resumeOperation = () => {
    if (activeOperation) {
      setActiveOperation(prev => prev ? { ...prev, status: 'running' } : null);
      setIsRunning(true);
      toast.info('Operation resumed');
    }
  };

  const getOperationStatusColor = (status: BulkOperation['status']) => {
    switch (status) {
      case 'running': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'paused': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="w-full space-y-6" data-macaly="bulk-operations-panel">
      {/* Header with Selection Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span>Advanced Bulk Operations</span>
            {selectedItems.length > 0 && (
              <Badge className="bg-blue-100 text-blue-800">
                {selectedItems.length} selected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-600">{selectedItems.length}</h3>
              <p className="text-sm text-blue-600">Selected Items</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-2xl font-bold text-green-600">{availableItems.length}</h3>
              <p className="text-sm text-green-600">Available Items</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="text-2xl font-bold text-purple-600">{operationHistory.length}</h3>
              <p className="text-sm text-purple-600">Completed Operations</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <h3 className="text-2xl font-bold text-orange-600">
                {operationHistory.reduce((sum, op) => sum + op.successItems, 0)}
              </h3>
              <p className="text-sm text-orange-600">Items Processed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="operations" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="monitor">Monitor</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Operation Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Select Operation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Operation Type</Label>
                  <Select value={operationType} onValueChange={setOperationType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose operation" />
                    </SelectTrigger>
                    <SelectContent>
                      {operationTypes.map(op => (
                        <SelectItem key={op.id} value={op.id}>
                          <div className="flex items-center gap-2">
                            <op.icon className={`h-4 w-4 ${op.color}`} />
                            <span>{op.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {operationType && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      {operationTypes.find(op => op.id === operationType)?.description}
                    </p>
                  </div>
                )}

                {/* Operation Settings */}
                {operationType === 'reject_builders' && (
                  <div>
                    <Label>Rejection Reason</Label>
                    <Textarea
                      placeholder="Enter reason for rejection..."
                      value={operationSettings.reason || ''}
                      onChange={(e) => setOperationSettings(prev => ({ ...prev, reason: e.target.value }))}
                    />
                  </div>
                )}

                {operationType === 'update_status' && (
                  <div>
                    <Label>New Status</Label>
                    <Select 
                      value={operationSettings.status || ''}
                      onValueChange={(value) => setOperationSettings(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="featured">Featured</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {operationType === 'assign_tags' && (
                  <div>
                    <Label>Tags (comma-separated)</Label>
                    <Input
                      placeholder="premium, verified, featured"
                      value={operationSettings.tags || ''}
                      onChange={(e) => setOperationSettings(prev => ({ ...prev, tags: e.target.value }))}
                    />
                  </div>
                )}

                {operationType === 'send_notifications' && (
                  <div className="space-y-3">
                    <div>
                      <Label>Email Template</Label>
                      <Select 
                        value={operationSettings.template || ''}
                        onValueChange={(value) => setOperationSettings(prev => ({ ...prev, template: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="welcome">Welcome Email</SelectItem>
                          <SelectItem value="approval">Approval Notification</SelectItem>
                          <SelectItem value="rejection">Rejection Notice</SelectItem>
                          <SelectItem value="update">Status Update</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Custom Message</Label>
                      <Textarea
                        placeholder="Optional custom message..."
                        value={operationSettings.message || ''}
                        onChange={(e) => setOperationSettings(prev => ({ ...prev, message: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={startOperation}
                  disabled={isRunning || selectedItems.length === 0 || !operationType}
                  className="w-full"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Operation
                </Button>
              </CardContent>
            </Card>

            {/* Selected Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Selected Items ({selectedItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {selectedItems.length > 0 ? (
                    selectedItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {item.type === 'builder' && <Building className="h-4 w-4 text-blue-600" />}
                          {item.type === 'lead' && <Users className="h-4 w-4 text-green-600" />}
                          {item.type === 'exhibition' && <Calendar className="h-4 w-4 text-purple-600" />}
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-600">{item.type}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSelectionChange(selectedItems.filter(i => i.id !== item.id))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Filter className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p className="text-sm">No items selected</p>
                      <p className="text-xs">Select items from the main list to perform bulk operations</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Import Tab */}
        <TabsContent value="import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Bulk Import from CSV
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="csv-upload">Upload CSV File</Label>
                <Input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="mt-1"
                />
              </div>
              
              {importPreview.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Import Preview</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(importPreview[0]).map(key => (
                            <th key={key} className="px-4 py-2 text-left font-medium">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {importPreview.slice(0, 3).map((row, index) => (
                          <tr key={index} className="border-t">
                            {Object.values(row).map((value, i) => (
                              <td key={i} className="px-4 py-2">{value as string}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button className="mt-4 w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Import {importPreview.length} Items
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitor Tab */}
        <TabsContent value="monitor" className="space-y-6">
          {activeOperation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>Active Operation</span>
                    <Badge className={getOperationStatusColor(activeOperation.status)}>
                      {activeOperation.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    {activeOperation.status === 'running' && (
                      <Button variant="outline" size="sm" onClick={pauseOperation}>
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                    {activeOperation.status === 'paused' && (
                      <Button variant="outline" size="sm" onClick={resumeOperation}>
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{activeOperation.name}</span>
                    <span>{activeOperation.progress}%</span>
                  </div>
                  <Progress value={activeOperation.progress} className="h-2" />
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{activeOperation.totalItems}</p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">{activeOperation.processedItems}</p>
                    <p className="text-xs text-gray-600">Processed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{activeOperation.successItems}</p>
                    <p className="text-xs text-gray-600">Success</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{activeOperation.errorItems}</p>
                    <p className="text-xs text-gray-600">Errors</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Operation Logs</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1 text-sm">
                    {activeOperation.logs.slice(-10).map((log, index) => (
                      <div key={index} className={`p-2 rounded text-xs ${
                        log.level === 'error' ? 'bg-red-50 text-red-700' :
                        log.level === 'success' ? 'bg-green-50 text-green-700' :
                        log.level === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-gray-50 text-gray-700'
                      }`}>
                        <span className="font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className="ml-2">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {!activeOperation && (
            <Card>
              <CardContent className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-gray-500">No active operations</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Operation History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {operationHistory.length > 0 ? (
                  operationHistory.map(operation => (
                    <div key={operation.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{operation.name}</h4>
                        <Badge className={getOperationStatusColor(operation.status)}>
                          {operation.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{operation.description}</p>
                      <div className="grid grid-cols-4 gap-4 text-center text-sm">
                        <div>
                          <p className="font-semibold">{operation.totalItems}</p>
                          <p className="text-gray-500">Total</p>
                        </div>
                        <div>
                          <p className="font-semibold text-green-600">{operation.successItems}</p>
                          <p className="text-gray-500">Success</p>
                        </div>
                        <div>
                          <p className="font-semibold text-red-600">{operation.errorItems}</p>
                          <p className="text-gray-500">Errors</p>
                        </div>
                        <div>
                          <p className="font-semibold">{operation.progress}%</p>
                          <p className="text-gray-500">Progress</p>
                        </div>
                      </div>
                      {operation.startTime && (
                        <p className="text-xs text-gray-500 mt-2">
                          Started: {new Date(operation.startTime).toLocaleString()}
                          {operation.endTime && ` • Completed: ${new Date(operation.endTime).toLocaleString()}`}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>No operation history</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}