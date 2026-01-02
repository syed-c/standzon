import React, { Suspense } from 'react';
import { RealGlobalPagesManagerClient } from '@/components/client/RealGlobalPagesManagerClient';
import { getGlobalPagesStatistics, generateAllGlobalPages } from '@/lib/server/convex/admin';

export async function RealGlobalPagesManager() {
  const stats = await getGlobalPagesStatistics();
  const allPages = await generateAllGlobalPages();
  
  return (
    <RealGlobalPagesManagerClient 
      initialStats={stats as any}
      initialCountryPages={allPages?.countries || []}
      initialCityPages={allPages?.cities || []}
    />
  );
}

export default RealGlobalPagesManager;
