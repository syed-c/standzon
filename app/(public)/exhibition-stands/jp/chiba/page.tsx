import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/client/Navigation';
import Footer from '@/components/client/Footer';
import WhatsAppFloat from '@/components/client/WhatsAppFloat';
import CountryCityPage from '@/components/client/CountryCityPage';



// ✅ FIX: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Chiba | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Chiba, Japan. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Chiba`, `booth builders Chiba`, `trade show displays Chiba`, `Chiba exhibition builders`, `Chiba booth design`, `Chiba exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Chiba`,
      description: `Professional exhibition stand builders in Chiba, Japan. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Chiba`,
      description: `Professional exhibition stand builders in Chiba, Japan. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/jp/chiba`,
    },
  };
}

export default async function ChibaPage() {
  console.log('🇯🇵 Loading Chiba page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Japan"
        city="Chiba"
        initialBuilders={[]}
        initialContent={{
          id: 'jp-chiba',
          title: 'Exhibition Stand Builders in Chiba',
          metaTitle: 'Chiba Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Chiba, Japan. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Chiba is a major industrial and trade center in Japan, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Chiba\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Chiba\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Chiba exhibition stands', 'Chiba trade show builders', 'Chiba exhibition builders', 'Chiba booth design', 'Chiba exhibition services', 'Japan trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}