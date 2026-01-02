import React, { Suspense } from 'react';
import ManageBuildersClient from '@/components/client/ManageBuildersClient';
import { getBuilders } from '@/lib/server/db/builders';

export default async function ManageBuildersPage() {
  const builders = await getBuilders();
  
  // Map builders to the format expected by ManageBuildersClient
  const transformedBuilders = builders.map((builder: any) => ({
    id: builder.id,
    companyName: builder.company_name,
    slug: builder.slug,
    logo: builder.logo,
    establishedYear: builder.established_year,
    contactInfo: {
      primaryEmail: builder.primary_email,
      phone: builder.phone,
      contactPerson: builder.contact_person
    },
    headquarters: {
      city: builder.headquarters_city,
      country: builder.headquarters_country
    },
    serviceLocations: builder.service_locations || [],
    rating: builder.rating || 0,
    projectsCompleted: builder.projects_completed || 0,
    verified: builder.verified || false,
    premiumMember: builder.premium_member || false,
    teamSize: builder.team_size || 0
  }));

  return (
    <Suspense fallback={<div>Loading builders...</div>}>
      <ManageBuildersClient initialBuilders={transformedBuilders as any} />
    </Suspense>
  );
}
