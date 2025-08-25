import React from "react";
import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import EnhancedCountryPage from "@/components/EnhancedCountryPage";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const countryName = "United States";
  return {
    title: `Exhibition Stand Builders in ${countryName} | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in ${countryName}. Custom trade show displays, booth design, and comprehensive exhibition services. Get quotes from verified contractors.`,
    openGraph: { title: `Exhibition Stand Builders in ${countryName}` },
  };
}

export default function CountryPage() {
  return (
    <div className="font-inter">
      <Navigation />
      <EnhancedCountryPage countrySlug="united-states" />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
