import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CountryCityPage from '@/components/CountryCityPage';



// ✅ FIX: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Anaheim | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Anaheim, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Anaheim`, `booth builders Anaheim`, `trade show displays Anaheim`, `Anaheim exhibition builders`, `Anaheim booth design`, `Anaheim exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Anaheim`,
      description: `Professional exhibition stand builders in Anaheim, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Anaheim`,
      description: `Professional exhibition stand builders in Anaheim, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/us/anaheim`,
    },
  };
}

export default async function AnaheimPage() {
  console.log('🇺🇸 Loading Anaheim page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United States"
        city="Anaheim"
        initialBuilders={[]}
        initialContent={{
          id: 'us-anaheim',
          title: 'Exhibition Stand Builders in Anaheim',
          metaTitle: 'Anaheim Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Anaheim, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Anaheim is a major entertainment and convention destination in California, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Anaheim\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Anaheim\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Anaheim exhibition stands', 'Anaheim trade show builders', 'Anaheim exhibition builders', 'Anaheim booth design', 'Anaheim exhibition services', 'USA trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}