import { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CountryCityPage from '@/components/CountryCityPage';



// ✅ FIX: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Michigan | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Michigan, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Michigan`, `booth builders Michigan`, `trade show displays Michigan`, `Michigan exhibition builders`, `Michigan booth design`, `Michigan exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Michigan`,
      description: `Professional exhibition stand builders in Michigan, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Michigan`,
      description: `Professional exhibition stand builders in Michigan, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/us/michigan`,
    },
  };
}

export default async function MichiganPage() {
  console.log('🇺🇸 Loading Michigan page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United States"
        city="Michigan"
        initialBuilders={[]}
        initialContent={{
          id: 'us-michigan',
          title: 'Exhibition Stand Builders in Michigan',
          metaTitle: 'Michigan Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Michigan, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Michigan is a major automotive and manufacturing hub in the midwestern United States, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Michigan\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Michigan\'s premier exhibition stand builders for trade show success in the state.',
          seoKeywords: ['Michigan exhibition stands', 'Michigan trade show builders', 'Michigan exhibition builders', 'Michigan booth design', 'Michigan exhibition services', 'USA trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}