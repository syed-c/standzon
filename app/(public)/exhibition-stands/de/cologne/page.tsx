import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import CountryCityPage from '@/components/public/CountryCityPage';



// ✅ FIX: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Cologne | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Cologne, Germany. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Cologne`, `booth builders Cologne`, `trade show displays Cologne`, `Cologne exhibition builders`, `Cologne booth design`, `Cologne exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Cologne`,
      description: `Professional exhibition stand builders in Cologne, Germany. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Cologne`,
      description: `Professional exhibition stand builders in Cologne, Germany. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/de/cologne`,
    },
  };
}

export default async function ColognePage() {
  console.log('🇩🇪 Loading Cologne page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Germany"
        city="Cologne"
        initialBuilders={[]}
        initialContent={{
          id: 'de-cologne',
          title: 'Exhibition Stand Builders in Cologne',
          metaTitle: 'Cologne Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Cologne, Germany. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Cologne is a major cultural and trade center in Germany, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Cologne\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Cologne\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Cologne exhibition stands', 'Cologne trade show builders', 'Cologne exhibition builders', 'Cologne booth design', 'Cologne exhibition services', 'Germany trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
