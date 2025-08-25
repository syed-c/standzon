export default function TestSimplePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Simple Test Page</h1>
      <p className="text-gray-600 mb-4">This is a server-side rendered page to test basic functionality.</p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h2 className="font-semibold text-blue-800 mb-2">Test Results:</h2>
        <ul className="text-blue-700 space-y-1">
          <li>✅ Next.js routing is working</li>
          <li>✅ Tailwind CSS is working</li>
          <li>✅ Server-side rendering is working</li>
        </ul>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h2 className="font-semibold text-yellow-800 mb-2">API Test:</h2>
        <p className="text-yellow-700">
          If you can see this page, the issue is likely with client-side JavaScript execution.
          The SmartBuildersManager component uses useEffect and useState which require client-side rendering.
        </p>
      </div>
    </div>
  );
}