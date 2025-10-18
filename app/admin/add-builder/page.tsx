import { Suspense } from 'react';
import AddBuilderForm from '@/components/AddBuilderForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AddBuilderPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Builder</h1>
          <p className="text-gray-600 mt-2">
            Add a new exhibition stand builder to the platform
          </p>
        </div>

        <Suspense fallback={
          <Card>
            <CardContent className="p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        }>
          <AddBuilderForm 
            onSuccess={() => {
              // Redirect to builders list or show success message
              window.location.href = '/admin/builders';
            }}
          />
        </Suspense>
      </div>
    </div>
  );
}
