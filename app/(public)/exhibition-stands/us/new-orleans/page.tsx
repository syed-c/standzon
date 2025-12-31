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
    title: `Exhibition Stand Builders in New Orleans | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in New Orleans, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands New Orleans`, `booth builders New Orleans`, `trade show displays New Orleans`, `New Orleans exhibition builders`, `New Orleans booth design`, `New Orleans exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in New Orleans`,
      description: `Professional exhibition stand builders in New Orleans, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in New Orleans`,
      description: `Professional exhibition stand builders in New Orleans, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/us/new-orleans`,
    },
  };
}

export default async function NewOrleansPage() {
  console.log('🇺🇸 Loading New Orleans page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United States"
        city="New Orleans"
        initialBuilders={[]}
        initialContent={{
          id: 'us-new-orleans',
          title: 'Exhibition Stand Builders in New Orleans',
          metaTitle: 'New Orleans Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in New Orleans, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'New Orleans is a vibrant cultural destination in Louisiana, famous for its music, food, and festivals, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in New Orleans\' dynamic exhibition landscape.',
          heroContent: 'Partner with New Orleans\' premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['New Orleans exhibition stands', 'New Orleans trade show builders', 'New Orleans exhibition builders', 'New Orleans booth design', 'New Orleans exhibition services', 'USA trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}