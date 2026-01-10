import React, { Suspense } from "react";
import Navigation from "@/components/Navigation";
import HomeHero from "@/components/home/HomeHero";
import HomeLeads from "@/components/home/HomeLeads";
import HomeLocations from "@/components/home/HomeLocations";
import HomeRest from "@/components/home/HomeRest";
import { HeroSkeleton, LeadsSkeleton } from "@/components/skeletons";

export default function ServerHomePageContent() {
  return (
    <div className="page-container homepage-container">
      <Navigation />

      <main className="main-content">
        {/* Helper for LCP: Loading state - Suspense enabled for Streaming/TBT Optimization */}
        <Suspense fallback={<HeroSkeleton />}>
          <HomeHero />
        </Suspense>

        <Suspense fallback={<LeadsSkeleton />}>
          <HomeLeads />
        </Suspense>

        <Suspense fallback={<div className="py-16 bg-gray-50 animate-pulse"><div className="container mx-auto px-4"><div className="h-64 bg-gray-200 rounded-lg"></div></div></div>}>
          <HomeLocations />
        </Suspense>

        <Suspense fallback={<div className="h-64 bg-gray-50 animate-pulse"></div>}>
          <HomeRest />
        </Suspense>
      </main>

      {/* Footer is handled by ServerGlobalLayoutProvider */}
    </div>
  );
}