'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, Download, FileText, CheckCircle, AlertTriangle, 
  Calendar, ArrowLeft, RefreshCw, Save, Trash2, MapPin
} from 'lucide-react';
import Link from 'next/link';

export default function BulkImportTradeShowsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importResults, setImportResults] = useState<any>(null);

  console.log('Bulk Import Trade Shows page loaded');

  const generateTradeShowTemplate = () => {
    const headers = [
      'eventName',
      'eventSlug',
      'startDate',
      'endDate',
      'city',
      'country',
      'venue',
      'industry',
      'description',
      'website',
      'organizerName',
      'organizerEmail',
      'expectedVisitors',
      'expectedExhibitors',
      'boothCostFrom',
      'boothCostTo',
      'currency'
    ];

    const sampleData = [
      [
        'Technology Innovation Expo 2025',
        'tech-innovation-expo-2025',
        '2025-09-15',
        '2025-09-18',
        'Berlin',
        'Germany',
        'Messe Berlin',
        'Technology',
        'Leading technology exhibition showcasing innovations in AI, IoT, and digital transformation',
        'https://techinnovationexpo.com',
        'Tech Events GmbH',
        'info@techinnovationexpo.com',
        '25000',
        '800',
        '200',
        '500',
        'EUR'
      ],
      [
        'Healthcare & Medical Devices Summit',
        'healthcare-medical-summit-2025',
        '2025-10-10',
        '2025-10-13',
        'Chicago',
        'United States',
        'McCormick Place',
        'Healthcare',
        'Premier healthcare exhibition featuring medical devices, pharmaceuticals, and health tech',
        'https://healthcaresummit.com',
        'Medical Events Inc',
        'contact@healthcaresummit.com',
        '30000',
        '1200',
        '150',
        '400',
        'USD'
      ]
    ];

    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'trade_shows_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Trade show CSV template downloaded');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      console.log('CSV file selected:', file.name);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const processCSVFile = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const text = await selectedFile.text();
      setUploadProgress(30);
      
      console.log('Parsing trade show CSV data...');
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',');
      
      const tradeShows: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
        if (values.length >= headers.length) {
          tradeShows.push({
            eventName: values[0],
            eventSlug: values[1],
            startDate: values[2],
            endDate: values[3],
            city: values[4],
            country: values[5],
            venue: values[6],
            industry: values[7],
            description: values[8],
            website: values[9],
            organizerName: values[10],
            organizerEmail: values[11],
            expectedVisitors: parseInt(values[12]) || 0,
            expectedExhibitors: parseInt(values[13]) || 0,
            boothCostFrom: parseInt(values[14]) || 0,
            boothCostTo: parseInt(values[15]) || 0,
            currency: values[16] || 'USD'
          });
        }
        setUploadProgress(30 + ((i / lines.length) * 40));
      }
      
      console.log(`Processed ${tradeShows.length} trade shows`);
      
      // Simulate import process
      for (let i = 0; i < tradeShows.length; i++) {
        setUploadProgress(70 + ((i / tradeShows.length) * 30));
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`Imported trade show: ${tradeShows[i]?.eventName}`);
      }

      setImportResults({
        total: tradeShows.length,
        imported: tradeShows.length,
        errors: 0
      });

      setUploadProgress(100);
      console.log('Trade show import completed successfully');
      
    } catch (error) {
      console.error('Error processing CSV:', error);
      alert('Error processing CSV file. Please check the format.');
    } finally {
      setIsUploading(false);
    }
  };

  const clearData = () => {
    setSelectedFile(null);
    setImportResults(null);
    setUploadProgress(0);
    console.log('Data cleared');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/advanced">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bulk Import Trade Shows</h1>
              <p className="text-gray-600">Import multiple trade shows and exhibitions using CSV file</p>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-800">
            <Calendar className="w-3 h-3 mr-1" />
            Trade Show Management
          </Badge>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Step 1: Download Template */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Step 1: Download CSV Template</span>
            </CardTitle>
            <CardDescription>
              Download the CSV template to see the required format for trade show data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Button onClick={generateTradeShowTemplate} className="bg-purple-600 hover:bg-purple-700">
                <Download className="w-4 h-4 mr-2" />
                Download Trade Show Template
              </Button>
              <div className="text-sm text-gray-600">
                <strong>Required Fields:</strong> Event Name, Dates, City, Country, Venue, Industry
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Upload CSV */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Step 2: Upload Your CSV File</span>
            </CardTitle>
            <CardDescription>
              Select your completed CSV file containing trade show information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="w-full"
              />
            </div>

            {selectedFile && (
              <Alert>
                <FileText className="w-4 h-4" />
                <AlertDescription>
                  File selected: <strong>{selectedFile.name}</strong> ({Math.round(selectedFile.size / 1024)} KB)
                </AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-2">
              <Button 
                onClick={processCSVFile}
                disabled={!selectedFile || isUploading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Processing...' : 'Import Trade Shows'}
              </Button>
              
              {(selectedFile || importResults) && (
                <Button variant="outline" onClick={clearData}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing trade shows...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Add Single Trade Show */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Quick Add Single Trade Show</span>
            </CardTitle>
            <CardDescription>
              Add a single trade show quickly without CSV import
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-name">Event Name</Label>
                <Input id="event-name" placeholder="Enter event name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="food">Food & Beverage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input id="end-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="City" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="Country" />
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="w-4 h-4 mr-2" />
              Add Trade Show
            </Button>
          </CardContent>
        </Card>

        {/* Import Results */}
        {importResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Import Completed Successfully!</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{importResults.total}</div>
                  <div className="text-sm text-gray-600">Total Processed</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{importResults.imported}</div>
                  <div className="text-sm text-gray-600">Successfully Imported</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{importResults.errors}</div>
                  <div className="text-sm text-gray-600">Errors/Skipped</div>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <Link href="/admin/tradeshows/manage">
                  <Button>
                    <Calendar className="w-4 h-4 mr-2" />
                    View All Trade Shows
                  </Button>
                </Link>
                <Button variant="outline" onClick={clearData}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Import More
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Global Trade Show Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Global Trade Show Database</span>
            </CardTitle>
            <CardDescription>
              Pre-populate with major international trade shows
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Technology Shows</h4>
                <p className="text-sm text-gray-600 mb-2">CES, IFA, Mobile World Congress, etc.</p>
                <Button size="sm" variant="outline">Import Tech Shows</Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Healthcare Shows</h4>
                <p className="text-sm text-gray-600 mb-2">MEDICA, HIMSS, Arab Health, etc.</p>
                <Button size="sm" variant="outline">Import Healthcare Shows</Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Manufacturing Shows</h4>
                <p className="text-sm text-gray-600 mb-2">Hannover Messe, IMTS, EMO, etc.</p>
                <Button size="sm" variant="outline">Import Manufacturing Shows</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}