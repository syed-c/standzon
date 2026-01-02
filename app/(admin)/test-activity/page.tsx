'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/client/AdminLayout';
import Sidebar from '@/components/client/Sidebar';
import Topbar from '@/components/client/Topbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/card";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { Label } from "@/components/shared/label";
import { Textarea } from "@/components/shared/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shared/select";
import { Alert, AlertDescription } from "@/components/shared/alert";
import { CheckCircle, XCircle } from "lucide-react";

export default function TestActivityPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [formData, setFormData] = useState({
    user: 'admin@test.com',
    table: 'test_table',
    operation: 'UPDATE',
    recordId: '123',
    details: 'Test database change operation'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOperationChange = (value: string) => {
    setFormData(prev => ({ ...prev, operation: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/test-db-change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          changes: {
            field1: 'value1',
            field2: 'value2'
          }
        }),
      });

      const data = await response.json();
      setResult({ success: data.success, message: data.message });
    } catch (error) {
      setResult({ success: false, message: 'Network error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout sidebar={<Sidebar />} topbar={<Topbar />}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Activity Tracking Test</CardTitle>
              <CardDescription>
                Test the database change tracking and session monitoring functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="user">User</Label>
                    <Input
                      id="user"
                      name="user"
                      value={formData.user}
                      onChange={handleChange}
                      placeholder="Enter user email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="table">Table</Label>
                    <Input
                      id="table"
                      name="table"
                      value={formData.table}
                      onChange={handleChange}
                      placeholder="Enter table name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="operation">Operation</Label>
                    <Select value={formData.operation} onValueChange={handleOperationChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CREATE">Create</SelectItem>
                        <SelectItem value="READ">Read</SelectItem>
                        <SelectItem value="UPDATE">Update</SelectItem>
                        <SelectItem value="DELETE">Delete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="recordId">Record ID</Label>
                    <Input
                      id="recordId"
                      name="recordId"
                      value={formData.recordId}
                      onChange={handleChange}
                      placeholder="Enter record ID"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="details">Details</Label>
                  <Textarea
                    id="details"
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    placeholder="Enter operation details"
                    rows={3}
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Testing...' : 'Test Database Change Tracking'}
                </Button>
              </form>

              {result && (
                <div className="mt-6">
                  <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                      {result.message}
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">How to Test:</h3>
                <ol className="list-decimal list-inside text-blue-800 space-y-1">
                  <li>Fill in the form fields with test data</li>
                  <li>Click "Test Database Change Tracking"</li>
                  <li>Check the Activities page to see the logged change</li>
                  <li>Navigate to different admin pages to test session tracking</li>
                  <li>Logout and check session duration in the Activities page</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}