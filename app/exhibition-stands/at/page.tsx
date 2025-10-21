import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Austria | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Austria. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Austria`, `booth builders Austria`, `trade show displays Austria`, `Austria exhibition builders`, `Austria booth design`, `Austria exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Austria`,
      description: `Professional exhibition stand builders across Austria. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Austria`,
      description: `Professional exhibition stand builders across Austria. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/at`,
    },
  };
}

export default async function AustriaPage() {
  console.log('🇦🇹 Loading Austria page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Austria"
        initialBuilders={[]}
        initialContent={{
          id: 'at-main',
          title: 'Exhibition Stand Builders in Austria',
          metaTitle: 'Austria Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders across Austria. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Austria is a thriving center for innovation and trade shows in Central Europe, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Austria\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Austria\'s premier exhibition stand builders for trade show success across the country.',
          seoKeywords: ['Austria exhibition stands', 'Austria trade show builders', 'Austria exhibition builders', 'Austria booth design', 'Austria exhibition services', 'Central Europe trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
