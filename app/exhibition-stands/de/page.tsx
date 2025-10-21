import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Germany | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Germany. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Germany`, `booth builders Germany`, `trade show displays Germany`, `Germany exhibition builders`, `Germany booth design`, `Germany exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Germany`,
      description: `Professional exhibition stand builders across Germany. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Germany`,
      description: `Professional exhibition stand builders across Germany. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/de`,
    },
  };
}

export default async function GermanyPage() {
  console.log('🇩🇪 Loading Germany page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Germany"
        initialBuilders={[]}
        initialContent={{
          id: 'de-main',
          title: 'Exhibition Stand Builders in Germany',
          metaTitle: 'Germany Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders across Germany. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Germany is a thriving center for innovation and trade shows in the Europe, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Germany\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Germany\'s premier exhibition stand builders for trade show success across the country.',
          seoKeywords: ['Germany exhibition stands', 'Germany trade show builders', 'Germany exhibition builders', 'Germany booth design', 'Germany exhibition services', 'Europe trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}