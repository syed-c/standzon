import SimpleSmartBuilders from '@/components/SimpleSmartBuilders';

export default function TestSmartBuildersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Test Smart Builders Manager</h1>
        <SimpleSmartBuilders />
      </div>
    </div>
  );
}
