import { builderAPI } from '@/lib/database/persistenceAPI';

export default async function TestServerBuilders() {
  let builders: any[] = [];
  let error: string | null = null;

  try {
    console.log('🔍 Loading builders from server-side...');
    builders = await builderAPI.getAllBuilders();
    console.log(`✅ Loaded ${builders.length} builders from server`);
  } catch (err) {
    console.error('❌ Server-side error loading builders:', err);
    error = err instanceof Error ? err.message : 'Unknown error';
  }

  const gmbBuilders = builders.filter(b => b.id?.startsWith('gmb_') || b.gmbImported);
  const verifiedBuilders = builders.filter(b => b.verified);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Server-Side Builders Test</h1>
      
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Total Builders</h3>
              <p className="text-2xl font-bold text-blue-900">{builders.length}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Verified</h3>
              <p className="text-2xl font-bold text-green-900">{verifiedBuilders.length}</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">GMB Imported</h3>
              <p className="text-2xl font-bold text-purple-900">{gmbBuilders.length}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800">Countries</h3>
              <p className="text-2xl font-bold text-yellow-900">
                {new Set(builders.map(b => b.headquarters?.country).filter(Boolean)).size}
              </p>
            </div>
          </div>

          {/* Builders List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Builders List ({builders.length})</h2>
            {builders.length === 0 ? (
              <p className="text-gray-500">No builders found</p>
            ) : (
              <div className="grid gap-4">
                {builders.slice(0, 10).map((builder, index) => (
                  <div key={builder.id || index} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{builder.companyName}</h3>
                        <p className="text-gray-600">
                          {builder.headquarters?.city || 'Unknown'}, {builder.headquarters?.country || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {builder.contactInfo?.primaryEmail || 'No email'}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {builder.verified && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Verified
                            </span>
                          )}
                          {(builder.id?.startsWith('gmb_') || builder.gmbImported) && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              GMB Imported
                            </span>
                          )}
                          {builder.premiumMember && (
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                              Premium
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          ⭐ {(builder.rating || 0).toFixed(1)}
                        </div>
                        <p className="text-sm text-gray-500">
                          {builder.projectsCompleted || 0} projects
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {builders.length > 10 && (
                  <p className="text-gray-500 text-center">
                    ... and {builders.length - 10} more builders
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}