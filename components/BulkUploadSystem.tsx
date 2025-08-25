'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  X,
  Info,
  Building,
  Calendar,
  MapPin,
  Users,
  Eye,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface UploadResult {
  id: string;
  type: 'builder' | 'tradeshow';
  fileName: string;
  totalRows: number;
  processedRows: number;
  successfulRows: number;
  errors: UploadError[];
  status: 'processing' | 'completed' | 'failed';
  uploadedAt: string;
  downloadUrl?: string;
}

interface UploadError {
  row: number;
  field: string;
  message: string;
  value: string;
}

interface BulkUploadSystemProps {
  userRole: 'admin' | 'moderator';
  onUploadComplete?: (result: UploadResult) => void;
}

export default function BulkUploadSystem({ userRole, onUploadComplete }: BulkUploadSystemProps) {
  console.log('BulkUploadSystem: Component loaded for role:', userRole);
  
  const [activeTab, setActiveTab] = useState<'builders' | 'tradeshows'>('builders');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample CSV data templates
  const builderCSVTemplate = `companyName,contactPerson,email,phone,website,country,city,address,specializations,teamSize,establishedYear,description
"Expo Design Berlin","Klaus Mueller","klaus@expodesign.de","+49 30 123456","https://expodesign.de","Germany","Berlin","Friedrichstraße 95","Custom Design,Modular Systems","25-50",2008,"Leading exhibition stand design company"
"Premium Stands UK","Sarah Johnson","sarah@premiumstands.co.uk","+44 20 123456","https://premiumstands.co.uk","United Kingdom","London","Oxford Street 123","Technology Integration,LED Displays","16-30",2012,"Specialists in high-tech exhibition solutions"
"Milano Exhibition","Marco Rossi","marco@milanoexpo.it","+39 02 123456","https://milanoexpo.it","Italy","Milan","Via Dante 45","Fashion Displays,Luxury Stands","6-15",2015,"Premium exhibition stands for fashion industry"`;

  const tradeshowCSVTemplate = `name,slug,city,country,venue,startDate,endDate,industry,expectedVisitors,expectedExhibitors,description,website
"CES 2025","ces-2025","Las Vegas","United States","Las Vegas Convention Center","2025-01-07","2025-01-10","Technology",115000,4000,"World's most influential technology event","https://ces.tech"
"Mobile World Congress 2025","mwc-2025","Barcelona","Spain","Fira de Barcelona","2025-03-03","2025-03-06","Technology",95000,2300,"Premier mobile industry event","https://mwcbarcelona.com"
"Hannover Messe 2025","hannover-messe-2025","Hannover","Germany","Hannover Fairground","2025-04-14","2025-04-18","Manufacturing",190000,5000,"Leading industrial technology fair","https://hannovermesse.de"`;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setErrors(['Please select a CSV file']);
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setErrors(['File size must be less than 10MB']);
      return;
    }

    setSelectedFile(file);
    setErrors([]);
    
    // Parse and preview CSV
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
      const data = lines.slice(1, 6).map(line => { // Preview first 5 rows
        const values = line.split(',').map(v => v.replace(/"/g, ''));
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });
      
      setPreviewData(data);
      setShowPreview(true);
    };
    reader.readAsText(file);
  };

  const validateData = (data: any[], type: 'builder' | 'tradeshow'): UploadError[] => {
    const errors: UploadError[] = [];
    
    if (type === 'builder') {
      const requiredFields = ['companyName', 'contactPerson', 'email', 'phone', 'country', 'city'];
      
      data.forEach((row, index) => {
        requiredFields.forEach(field => {
          if (!row[field] || row[field].trim() === '') {
            errors.push({
              row: index + 2, // +2 because we skip header and start from 1
              field,
              message: `${field} is required`,
              value: row[field] || ''
            });
          }
        });
        
        // Email validation
        if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
          errors.push({
            row: index + 2,
            field: 'email',
            message: 'Invalid email format',
            value: row.email
          });
        }
      });
    } else if (type === 'tradeshow') {
      const requiredFields = ['name', 'slug', 'city', 'country', 'startDate', 'endDate'];
      
      data.forEach((row, index) => {
        requiredFields.forEach(field => {
          if (!row[field] || row[field].trim() === '') {
            errors.push({
              row: index + 2,
              field,
              message: `${field} is required`,
              value: row[field] || ''
            });
          }
        });
        
        // Date validation
        if (row.startDate && !isValidDate(row.startDate)) {
          errors.push({
            row: index + 2,
            field: 'startDate',
            message: 'Invalid date format (use YYYY-MM-DD)',
            value: row.startDate
          });
        }
        
        if (row.endDate && !isValidDate(row.endDate)) {
          errors.push({
            row: index + 2,
            field: 'endDate',
            message: 'Invalid date format (use YYYY-MM-DD)',
            value: row.endDate
          });
        }
      });
    }
    
    return errors;
  };

  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      console.log(`Starting ${activeTab} bulk upload:`, selectedFile.name);
      
      // Simulate file processing with progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      // Parse the full CSV file
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.replace(/"/g, ''));
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          return row;
        });

        // Validate data
        const validationType = activeTab === 'builders' ? 'builder' : 'tradeshow';
        const validationErrors = validateData(data, validationType);
        
        // Simulate API upload
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const result: UploadResult = {
          id: `upload-${Date.now()}`,
          type: validationType,
          fileName: selectedFile.name,
          totalRows: data.length,
          processedRows: data.length,
          successfulRows: data.length - validationErrors.length,
          errors: validationErrors,
          status: validationErrors.length > 0 ? 'completed' : 'completed',
          uploadedAt: new Date().toISOString(),
          downloadUrl: validationErrors.length > 0 ? '/downloads/error-report.csv' : undefined
        };
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        setTimeout(() => {
          setUploadResults(prev => [result, ...prev]);
          if (onUploadComplete) {
            onUploadComplete(result);
          }
          
          // Reset form
          setSelectedFile(null);
          setPreviewData([]);
          setShowPreview(false);
          setIsUploading(false);
          setUploadProgress(0);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          
          console.log('Upload completed:', result);
        }, 1000);
      };
      
      reader.readAsText(selectedFile);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setErrors(['Upload failed. Please try again.']);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const downloadTemplate = (type: 'builder' | 'tradeshow') => {
    const template = type === 'builder' ? builderCSVTemplate : tradeshowCSVTemplate;
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log(`Downloaded ${type} template`);
  };

  const deleteUploadResult = (id: string) => {
    setUploadResults(prev => prev.filter(result => result.id !== id));
    console.log('Deleted upload result:', id);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Bulk Upload System</span>
          </CardTitle>
          <CardDescription>
            Upload multiple builders or trade shows using CSV files. Download templates and follow the format guidelines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="builders" className="flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <span>Builders</span>
              </TabsTrigger>
              <TabsTrigger value="tradeshows" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Trade Shows</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="builders" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upload Builders CSV</CardTitle>
                    <CardDescription>
                      Upload a CSV file containing builder information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="builder-file">Select CSV File</Label>
                      <Input
                        ref={fileInputRef}
                        id="builder-file"
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        disabled={isUploading}
                        className="mt-1"
                      />
                    </div>

                    {errors.length > 0 && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <ul className="list-disc list-inside">
                            {errors.map((error, index) => (
                              <li key={index} className="text-red-800">{error}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{Math.round(uploadProgress)}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        onClick={handleUpload}
                        disabled={!selectedFile || isUploading}
                        className="flex-1"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {isUploading ? 'Uploading...' : 'Upload CSV'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => downloadTemplate('builder')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Guidelines */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">CSV Format Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Required Fields:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <Badge variant="outline">companyName</Badge>
                        <Badge variant="outline">contactPerson</Badge>
                        <Badge variant="outline">email</Badge>
                        <Badge variant="outline">phone</Badge>
                        <Badge variant="outline">country</Badge>
                        <Badge variant="outline">city</Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Optional Fields:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <Badge variant="secondary">website</Badge>
                        <Badge variant="secondary">address</Badge>
                        <Badge variant="secondary">specializations</Badge>
                        <Badge variant="secondary">teamSize</Badge>
                        <Badge variant="secondary">establishedYear</Badge>
                        <Badge variant="secondary">description</Badge>
                      </div>
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Tips:</strong>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• Use comma-separated values (CSV) format</li>
                          <li>• Enclose text containing commas in quotes</li>
                          <li>• Maximum file size: 10MB</li>
                          <li>• Email addresses must be valid format</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tradeshows" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upload Trade Shows CSV</CardTitle>
                    <CardDescription>
                      Upload a CSV file containing trade show information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="tradeshow-file">Select CSV File</Label>
                      <Input
                        ref={fileInputRef}
                        id="tradeshow-file"
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        disabled={isUploading}
                        className="mt-1"
                      />
                    </div>

                    {errors.length > 0 && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <ul className="list-disc list-inside">
                            {errors.map((error, index) => (
                              <li key={index} className="text-red-800">{error}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{Math.round(uploadProgress)}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        onClick={handleUpload}
                        disabled={!selectedFile || isUploading}
                        className="flex-1"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {isUploading ? 'Uploading...' : 'Upload CSV'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => downloadTemplate('tradeshow')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Guidelines */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">CSV Format Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Required Fields:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <Badge variant="outline">name</Badge>
                        <Badge variant="outline">slug</Badge>
                        <Badge variant="outline">city</Badge>
                        <Badge variant="outline">country</Badge>
                        <Badge variant="outline">startDate</Badge>
                        <Badge variant="outline">endDate</Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Optional Fields:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <Badge variant="secondary">venue</Badge>
                        <Badge variant="secondary">industry</Badge>
                        <Badge variant="secondary">expectedVisitors</Badge>
                        <Badge variant="secondary">expectedExhibitors</Badge>
                        <Badge variant="secondary">description</Badge>
                        <Badge variant="secondary">website</Badge>
                      </div>
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Date Format:</strong>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• Use YYYY-MM-DD format (e.g., 2025-03-15)</li>
                          <li>• End date must be after start date</li>
                          <li>• Slug must be unique and URL-friendly</li>
                          <li>• Numbers should not include commas</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Preview Data */}
          {showPreview && previewData.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>Data Preview</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Preview of the first 5 rows from your CSV file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        {Object.keys(previewData[0] || {}).map((header) => (
                          <th key={header} className="border border-gray-300 px-3 py-2 text-left font-medium">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {Object.values(row).map((value: any, cellIndex) => (
                            <td key={cellIndex} className="border border-gray-300 px-3 py-2">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Upload Results */}
      {uploadResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Upload History</span>
              </div>
              <Badge variant="outline">{uploadResults.length} uploads</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadResults.map((result) => (
                <div key={result.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          {result.type === 'builder' ? (
                            <Building className="w-4 h-4" />
                          ) : (
                            <Calendar className="w-4 h-4" />
                          )}
                          <span className="font-medium">{result.fileName}</span>
                        </div>
                        <Badge className={
                          result.status === 'completed' ? 'bg-green-100 text-green-800' :
                          result.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {result.status}
                        </Badge>
                        {result.errors.length > 0 && (
                          <Badge variant="outline" className="text-orange-600">
                            {result.errors.length} errors
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Total:</span> {result.totalRows}
                        </div>
                        <div>
                          <span className="font-medium">Successful:</span> {result.successfulRows}
                        </div>
                        <div>
                          <span className="font-medium">Errors:</span> {result.errors.length}
                        </div>
                        <div>
                          <span className="font-medium">Uploaded:</span> {new Date(result.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>

                      {result.errors.length > 0 && (
                        <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                          <h4 className="font-medium text-red-800 mb-2">Errors Found:</h4>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {result.errors.slice(0, 5).map((error, index) => (
                              <div key={index} className="text-sm text-red-700">
                                Row {error.row}, {error.field}: {error.message}
                              </div>
                            ))}
                            {result.errors.length > 5 && (
                              <div className="text-sm text-red-600">
                                ... and {result.errors.length - 5} more errors
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {result.downloadUrl && (
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Error Report
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteUploadResult(result.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}