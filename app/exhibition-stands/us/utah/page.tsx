import { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CountryCityPage from '@/components/CountryCityPage';



// ✅ FIX: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Utah | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Utah, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Utah`, `booth builders Utah`, `trade show displays Utah`, `Utah exhibition builders`, `Utah booth design`, `Utah exhibition stands`],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: `Exhibition Stand Builders in Utah`,
      description: `Professional exhibition stand builders in Utah, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Utah`,
      description: `Professional exhibition stand builders in Utah, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/us/utah`,
    },
  };
}

export default async function UtahPage() {
  console.log('🇺🇸 Loading Utah page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United States"
        city="Utah"
        initialBuilders={[]}
        initialContent={{
          id: 'us-utah',
          title: 'Exhibition Stand Builders in Utah',
          metaTitle: 'Utah Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Utah, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Utah is a major technology and outdoor recreation hub in the western United States, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Utah\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Utah\'s premier exhibition stand builders for trade show success in the state.',
          seoKeywords: ['Utah exhibition stands', 'Utah trade show builders', 'Utah exhibition builders', 'Utah booth design', 'Utah exhibition services', 'USA trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}